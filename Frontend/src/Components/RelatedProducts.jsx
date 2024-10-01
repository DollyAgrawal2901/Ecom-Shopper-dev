import React, { useState, useEffect } from "react";
import data_product from "./assets/data";
import Item from "./Items/Item";

export default function RelatedProducts({ currentCategory }) {
  const [relatedCollection, setRelatedCollection] = useState([]);

  useEffect(() => {
    const fetchRelatedCollections = async () => {
      try {
        const response = await fetch("http://localhost:4000/allproduct"); // Adjust the backend URL if deployed
        const data = await response.json();
        
        // Filter products based on the current category
        const filteredProducts = data.filter(
          (item) => item.category === currentCategory
        );
        
        // Randomly pick 4 products from the filtered list
        // const shuffledProducts = data.sort(() => 0.5 - Math.random());
        const shuffledProducts = filteredProducts.sort(() => 0.5 - Math.random());
        const selectedProducts = shuffledProducts.slice(0, 4);

        setRelatedCollection(selectedProducts); // Set the 4 random products to state
      } catch (error) {
        console.error("Error fetching related collections:", error);
      }
    };

    fetchRelatedCollections();
  }, [currentCategory]); // Re-fetch if the category changes

  return (
    <div className="flex flex-col items-center gap-[10px] h-[90vh]">
      <h1 className="text-slate-900 text-[50px] font-semibold">
        Related Products
      </h1>
      <hr className="w-[200px] h-[6px] rounded-[10px] bg-slate-800" />
      <div className="mt-[50px] flex gap-[30px]">
        {relatedCollection.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
}
