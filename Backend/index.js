require("dotenv").config();
const port = process.env.PORT;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIP_BACKEND_KEY);

app.use(express.json());
const allowedOrigins = [
  "https://localhost:5173",
  "http://localhost:5173",
  "https://localhost:5174",
  "http://localhost:5174",
];


app.use(
  cors({
    origin: allowedOrigins, // Allow multiple origins
    methods: ["GET", "POST", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

app.get("/", (req, res) => {
  res.send("Express App is Running");
});

const storage = multer.diskStorage({
  destination: "./Upload/Images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

app.use("/Images", express.static("Upload/Images"));

app.post("/Upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/Images/${req.file.filename}`,
  });
});

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
  popular: { type: Boolean, default: false }, // New field added
  quantity: { type: Number, default: 5 },
});

app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 40; // Start id from 40 if no products exist
  }

  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  await product.save();
  res.json({
    success: true,
    name: req.body.name,
  });
});


app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({
    success: true,
    name: req.body.name,
  });
});

app.get("/allproduct", async (req, res) => {
  let products = await Product.find({});
  res.send(products);
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100, // Amount in cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: "https://localhost:5173/success",
      cancel_url: "https://localhost:5173/cancel",
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get Single Product by ID Endpoint
app.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id, 10) });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ message: "Failed to fetch product details" });
  }
});

// New collection Endpoint
app.get("/newcollections", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ date: -1 }).limit(8); // Fetch the 8 latest products
    console.log("New Collections Fetched");
    res.json(products); // Send the products as a response
  } catch (error) {
    console.error("Error fetching new collections:", error);
    res.status(500).json({ message: "Failed to fetch new collections" });
  }
});

//Endpoint to fetch popular Products
app.get("/popular-products", async (req, res) => {
  try {
    const popularProducts = await Product.find({ popular: true });
    res.json(popularProducts);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching popular products" });
  }
});

app.post("/togglePopular", async (req, res) => {
  const { id, isPopular } = req.body;
  try {
    // Assuming `Product` is your model
    const product = await Product.findOneAndUpdate(
      { id: id },
      { $set: { popular: isPopular } },
      { new: true }
    );
    res.json(product);
  } catch (error) {
    res.status(500).send("Error updating product status");
  }
});

// Route to update all products with the 'popular' field use Thunder-client POST request to update all existing fields
app.post('/update-all-products', async (req, res) => {
  try {
    const result = await Product.updateMany({}, { $set: { popular: false } });
    res.json({
      success: true,
      message: `Updated ${result.nModified} products`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating products' });
  }
});

app.post("/updateproduct", async (req, res) => {
  const { id, name, old_price, new_price, category } = req.body;

  try {
    // Use `findOneAndUpdate` to match by `id`, not `_id`
    const updatedProduct = await Product.findOneAndUpdate(
      { id }, // Matching the product by `id` field
      {
        name,
        old_price,
        new_price,
        category,
      },
      { new: true } // Return the updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product details" });
  }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: {
    type: Map,
    of: Number, // Key-value pairs of product ID and quantity
    default: new Map(),
  },
  ordered: [
    {
      id: { type: Number, required: true }, // Product ID
      name: { type: String, required: true }, // Product Name
      imageUrl: { type: String, required: true }, // Product Image
      category: { type: String, required: true }, // Product Category
      price: { type: Number, required: true }, // Product Price
      quantity: { type: Number, required: true }, // Quantity Ordered
      totalPrice: { type: Number, required: true }, // Price * Quantity
      orderedAt: { type: String, required: true }, // Date & Time in 12-hour format
    },
  ],
  address: { type: String, default: null }, // New field for address
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("LoginSignup_userdata", userSchema);

// Middleware for verifying JWT
const fetchUser = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, "secret_ecom");
    req.user = verified;
    console.log("Decoded user:", req.user); // Add this line
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

// Signup route
app.post("/signup", async (req, res) => {
  let cart = new Map();
  // for (let i = 1; i <= 300; i++) {
  //   cart.set(i.toString(), 0);
  // }

  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        error: "User with the same email already exists.",
      });
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      cart: cart,
    });

    await user.save();
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Include email in payload
      "secret_ecom",
      { expiresIn: "1h" }
    );
    res.json({ success: true, token });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || password !== user.password) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email }, // Include email in payload
      "secret_ecom",
      { expiresIn: "1h" }
    );
    res.json({ success: true, token, cart: user.cart });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Add or update item in cart
app.post("/cart/add", fetchUser, async (req, res) => {
  const { productId, quantity } = req.body;
  const userEmail = req.user.email;

  try {
    // Find the user by their email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the product by its ID
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if enough stock is available
    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Decrease the product stock
    product.quantity -= quantity;
    await product.save();

    // Update the cart with the new or updated quantity
    const currentQuantity = user.cart.get(productId) || 0;
    user.cart.set(productId, currentQuantity + quantity);

    // Save the updated user cart
    await user.save();

    res.json({ success: true, cart: user.cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding to cart" });
  }
});


// Remove item from cart
app.post("/cart/remove", fetchUser, async (req, res) => {
  const { productId, quantity } = req.body;
  const userEmail = req.user.email;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the current quantity of the product in the cart
    const currentQuantity = user.cart.get(productId) || 0;
    const newQuantity = currentQuantity - quantity;

    // Remove or update the cart based on new quantity
    if (newQuantity <= 0) {
      user.cart.delete(productId);
    } else {
      user.cart.set(productId, newQuantity);
    }

    // Increment the product stock by the removed quantity
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Increase the product stock
    product.quantity += quantity;
    await product.save();

    // Save the updated cart
    await user.save();
    res.json({ success: true, cart: user.cart });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Error removing from cart" });
  }
});


// Get user's cart
app.get("/cart", fetchUser, async (req, res) => {
  const userEmail = req.user.email;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, cart: user.cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// Route to get registration data
app.get("/admin/registration-data", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
});

// Route to update all products with 'quantity' field
app.post("/product/update-quantity", async (req, res) => {
  try {
    const result = await Product.updateMany({}, { $set: { quantity: 5 } });
    res.status(200).json({
      message: "Quantity field added to all products successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating products", error: err });
  }
});

app.patch("/allproduct/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    // Update the quantity of the product by its id
    const product = await Product.findOneAndUpdate(
      { id: id }, // Ensure you're using the right identifier here
      { quantity: quantity },
      { new: true } // Return the updated document
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product quantity" });
  }
});


// Profile API
app.get("/user/profile", fetchUser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ name: user.name, email: user.email, address: user.address });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Error fetching user profile", error });
  }
});


app.post("/user/update", fetchUser, async (req, res) => {
  try {
    const { name, address, email } = req.body;

    // Check for existing email
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.email !== req.user.email) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },
      { $set: { name, address, email } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error });
  }
});

// API to check if the user already exists or not while updating email
app.post("/user/check-email", async (req, res) => {
  try {
    const { email, currentEmail } = req.body; // Accepting currentEmail in the request body
    // Check if the new email is the same as the current email
    if (email === currentEmail) {
      return res.status(200).json({ exists: false }); // No need to check if the same
    }
    
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({ exists: true });
    }
    res.status(200).json({ exists: false });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ message: "Error checking email", error });
  }
});
// Resetting cart after successful payment
app.post("/cart/reset", fetchUser, async (req, res) => {
  const email = req.user.email; // Get email directly from the decoded token

  try {
    // Find the user's cart by email
    const userCart = await User.findOne({ email });

    if (!userCart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Reset only items that have been added to the cart (quantity > 0)
    userCart.cart.forEach((quantity, productId) => {
      if (quantity > 0) {
        userCart.cart.set(productId, 0); // Reset quantity to zero for added items
      }
    });

    // Save the updated cart back to the database
    await userCart.save();

    console.log("Cart reset successfully for user:", email); // Log for verification
    res.json({ success: true, message: "Cart reset successfully" });
  } catch (error) {
    console.error("Error resetting cart:", error);
    res.status(500).json({ success: false, message: "Failed to reset cart" });
  }
});

// // Route to update the 'ordered' field for all users
// app.post('/user/update-all-ordered', async (req, res) => {
//   try {
//     const { ordered } = req.body;

//     if (!ordered) {
//       return res.status(400).json({ message: "Ordered data is required" });
//     }

//     // Update 'ordered' field for all users
//     const result = await User.updateMany({}, { $set: { ordered } });

//     res.json({
//       success: true,
//       message: `Updated ${result.nModified} users' ordered field`,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Error updating users" });
//   }
// });

app.post("/user/place-order", fetchUser, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert the cart from Mongoose Map to a regular object for easier manipulation
    const cart = user.cart; // Assuming this is a Mongoose Map
    const products = await Product.find({}); // Fetch all products

    const orderedItems = [];

    // Log the cart to ensure it has items
    console.log("User Cart:", cart);

    // Iterate over the cart and build the ordered items array
    cart.forEach((quantity, productId) => {
      // Ensure productId is converted to a number for comparison
      const product = products.find((prod) => prod.id === Number(productId));
      if (product) {
        const totalPrice = product.new_price * quantity;

        // Format date and time in 12-hour format
        const dateTime = new Date();
        const formattedDateTime = dateTime.toLocaleString("en-US", {
          hour12: true,
        });

        // Push order details to the array
        orderedItems.push({
          id: product.id,
          name: product.name,
          imageUrl: product.image, // Ensure this matches your product schema
          category: product.category,
          price: product.new_price,
          quantity: quantity,
          totalPrice: totalPrice,
          orderedAt: formattedDateTime, // Optional: consider changing this to a Date object
        });
      } else {
        console.warn(`Product with id ${productId} not found in products.`);
      }
    });

    // Log the ordered items to ensure they are populated
    console.log("Ordered Items:", orderedItems);

    // Add ordered items to user's `ordered` field
    user.ordered = [...user.ordered, ...orderedItems];

    // Clear the cart after placing the order
    user.cart = new Map(); // Reset cart

    // Save the updated user document
    await user.save();

    // Log the updated user document for debugging
    console.log("Updated User:", user);

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order" });
  }
});

app.get("/user/ordered", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Assuming `user.ordered` is an array of ordered items
    const orderedItems = user.ordered;

    // Fetch all products to match product details
    const products = await Product.find({});

    const orderedWithDetails = orderedItems.map((item) => {
      const product = products.find((prod) => prod.id === item.id);
      return {
        productId: item.id, // Assuming product IDs are stored in `item.id`
        name: product?.name || "Product not found",
        imageUrl: product?.imageUrl || "No Image",
        category: product?.category || "Unknown",
        price: product?.price || 0,
        quantity: item.quantity,
        totalPrice: item.quantity * (product?.price || 0),
        orderedAt: item.orderedAt, // Assuming `orderedAt` is already stored
      };
    });

    res.json({ ordered: orderedWithDetails });
  } catch (error) {
    console.error("Error fetching ordered items:", error);
    res.status(500).json({ message: "Failed to fetch ordered items" });
  }
});



app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on port: " + port);
  } else {
    console.log("Error: " + error);
  }
});



// // Route to update all all "LoginSignup_userdata" with 'address' field
// app.post("/LoginSignup_userdata/update-address", async (req, res) => {
//   try {
//     // Update address to null for all users where it's not set
//     const result = await User.updateMany(
//       { address: { $exists: false } },
//       { $set: { address: null } }
//     );

//     res.status(200).json({
//       message: "Address field added to all users successfully",
//       modifiedCount: result.modifiedCount,
//     });
//   } catch (err) {
//     console.error("Error updating users:", err);
//     res.status(500).json({ message: "Error updating users", error: err });
//   }
// });