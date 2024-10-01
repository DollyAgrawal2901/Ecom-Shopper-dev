import React, { useState } from 'react';
import upload_area from '../assets/upload_area.svg';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddProduct() {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: '',
    image: '',
    category: 'women',
    new_price: '',
    old_price: ''
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    console.log(productDetails);
    let responseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append('product', image);

    await fetch('http://localhost:4000/Upload', {
      method: 'POST',
      headers: {
        Accept: 'application/json'
      },
      body: formData,
    }).then((resp) => resp.json()).then((data) => { responseData = data });

    if (responseData.success) {
      product.image = responseData.image_url;
      console.log(product);
      await fetch('http://localhost:4000/addproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      }).then((resp) => resp.json()).then((data) => {
        if (data.success) {
          toast.success("Product Added Successfully!", { autoClose: 2000 });
        } else {
          toast.error("Failed to Add Product", { autoClose: 2000 });
        }
      });
    }
  };

  return (
    <div className=' box-border w-[55%] py-[30px] px-[50px] my-[20px] mx-auto rounded-[6px] bg-slate-300'>
      <ToastContainer />
      <div className='w-[100%] text-black font-semibold text-[20px] px-[10px] py-[10px]'>
        <p>Product Title</p>
        <input value={productDetails.name} onChange={changeHandler} className='box-border w-[100%] h-[50px] rounded-[4px] pl-[15px] border border-[#c3c3c3] outline-none text-[#7b7b7b] text-[14px]' type="text" name='name' placeholder='Type here' />
      </div>
      <div className='flex gap-[40px]'>
        <div className='w-[100%] text-black font-semibold text-[20px] px-[10px] py-[10px]'>
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} className='box-border w-[100%] h-[50px] rounded-[4px] pl-[15px] border border-[#c3c3c3] outline-none text-[#7b7b7b] text-[14px]' type="number" name='old_price' placeholder='Type here' />
        </div>
        <div className='w-[100%] text-black font-semibold text-[20px] px-[10px] py-[10px]'>
          <p>Offer Price</p>
          <input value={productDetails.new_price} onChange={changeHandler} className='box-border w-[100%] h-[50px] rounded-[4px] pl-[15px] border border-[#c3c3c3] outline-none text-[#7b7b7b] text-[14px]' type="number" name='new_price' placeholder='Type here' />
        </div>
      </div>
      <div className='w-[100%] text-black font-semibold text-[20px] px-[10px] py-[10px]'>
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} className='p-[10px] w-[100px] h-[50px] text-[14px] text-[#7b7b7b] border border-[#7b7b7b8ad] rounded-4px' name="category">
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className='w-[100%] text-black font-semibold text-[20px] px-[10px] py-[10px]'>
        <label htmlFor="file-input">
          <img className='h-[120px] w-[120px] rounded-[10px] object-contain my-[10px] mx-[0px]' src={image ? URL.createObjectURL(image) : upload_area} alt="" />
        </label>
        <input className='box-border w-[100%] h-[50px] rounded-[4px] pl-[15px] border border-[#c3c3c3] outline-none text-[#7b7b7b] text-[14px]' onChange={imageHandler} type="file" name='image' id='file-input' hidden />
      </div>
      <button onClick={() => { Add_Product() }} className='mt-[20px] w-[160px] h-[50px] rounded-[6px] bg-teal-500 border-none cursor-pointer text-white text-[20px] font-medium'>
        ADD
      </button>
    </div>
  );
}
