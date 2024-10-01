import React, { useContext, useEffect, useState } from 'react';
import star_icon from './assets/star_icon.png';
import star_dull_icon from './assets/star_dull_icon.png';
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';

export default function ProductDisplay(props) {
    const { productId } = useParams();
    const { all_product, addToCart } = useContext(ShopContext);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const fetchProductFromMongo = async () => {
        try {
            const response = await fetch(`http://localhost:4000/product/${productId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const productData = await response.json();
            setProduct(productData);
        } catch (error) {
            console.error("Error fetching product from MongoDB:", error);
        }
    };

    useEffect(() => {
        const localProduct = all_product.find((e) => e.id === Number(productId));

        if (localProduct) {
            setProduct(localProduct);
        } else {
            fetchProductFromMongo();
        }

        // Polling every 5 seconds to check for updates
        const intervalId = setInterval(() => {
            fetchProductFromMongo();
        }, 1500);

        // Cleanup function to clear the interval
        return () => clearInterval(intervalId);
    }, [productId, all_product]);

    if (!product) {
        return <div>Loading...</div>; // Show a loading state while fetching data
    }

    return (
        <div className='flex'>
            <div className='flex gap-[17px]'>
                <div className='flex flex-col gap-[16px]'>
                    <img className='h-[163px]' src={product.image} alt="" />
                    <img className='h-[163px]' src={product.image} alt="" />
                    <img className='h-[163px]' src={product.image} alt="" />
                    <img className='h-[163px]' src={product.image} alt="" />
                </div>
                <div>
                    <img className='w-[586px] h-[700px]' src={product.image} alt="" />
                </div>
            </div>
            <div className='my-[0px] mx-[70px] flex flex-col'>
                <h1 className='text-zinc-800 text-[40px] font-bold'>{product.name}</h1>
                <div className='flex items-center mt-[13px] gap-[5px] text-zinc-700 text-[16px]'>
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_icon} alt="" />
                    <img src={star_dull_icon} alt="" />
                    <p>(122)</p>
                </div>
                <div className='flex my-[10px] mx-[0px] gap-[30px] text-[24px] font-bold'>
                    <div className='text-slate-600 line-through'>
                        ${product.old_price}
                    </div>
                    <div className='text-red-700'>
                        ${product.new_price}
                    </div>
                </div>
                <div className='mb-40'>
                    A lightweight, usually knitted, pullover shirt, close-fitting
                </div>
                 {/* <div>
                    <h1 className='mt-[55px] text-slate-600 text-[20px] font-semibold'>Select Size</h1>
                    <div className='flex my-[30px] mx-[0px] gap-[20px]'>
                        <div className='py-[18px] px-[24px] bg-slate-50 border border-[#ebebeb] rounded-[3px] cursor-pointer'>S</div>
                        <div className='py-[18px] px-[24px] bg-slate-50 border border-[#ebebeb] rounded-[3px] cursor-pointer'>M</div>
                        <div className='py-[18px] px-[24px] bg-slate-50 border border-[#ebebeb] rounded-[3px] cursor-pointer'>L</div>
                        <div className='py-[18px] px-[24px] bg-slate-50 border border-[#ebebeb] rounded-[3px] cursor-pointer'>XL</div>
                        <div className='py-[18px] px-[24px] bg-slate-50 border border-[#ebebeb] rounded-[3px] cursor-pointer'>XXL</div>
                    </div>
                </div> */}
                <button 
                    onClick={() => { addToCart(product.id, quantity); }} 
                    className={`py-[20px] px-[40px] w-[200px] text-[16px] font-semibold mb-[40px] border-none outline-none cursor-pointer transition-colors ${
                        product.quantity > 0 ? 'bg-red-500 text-white' : 'bg-gray-500 text-black cursor-not-allowed'
                    }`}
                    disabled={product.quantity === 0}
                >
                    {product.quantity > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
                </button>
                <p className='mt-[10px]'>
                    <span className='font-semibold'>Category: </span> Women, T-Shirt, Crop Top
                </p>
                <p className='mt-[10px]'>
                    <span className='font-semibold'>Tags: </span> Modern, Latest
                </p>
            </div>
        </div>
    );
}
