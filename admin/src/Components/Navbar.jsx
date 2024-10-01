import React from 'react';
import { Link } from 'react-router-dom';
import navlogo from '../assets/nav-logo.svg';
import navProfile from '../assets/nav-profile.svg';
import add_product_icon from '../assets/Product_Cart.svg';
import list_product_icon from '../assets/Product_list_icon.svg';
import registration_icon from '../assets/registration_icon.svg';
import product_quantity_icon from '../assets/product_quantity.png';

export default function Navbar() {
  return (
    <div className='flex items-center justify-between py-[15px] px-[60px] shadow-[0_1px_3px_-2px_rgba(0,0,0,1)] mb-[1px] bg-amber-100'>
      {/* Left section with the logo */}
      <img className='w-[200px]' src={navlogo} alt="Logo" />

      {/* Center section with navigation links */}
      <div className='flex items-center gap-[40px] -ml-[100px]'>
        <Link to={'/addproduct'} style={{ textDecoration: 'none' }}>
          <div className='flex items-center gap-[10px] px-[10px] py-[5px] rounded-[6px] bg-slate-300 cursor-pointer hover:bg-slate-400'>
            <img src={add_product_icon} alt="Add Product" className='w-6 h-6' />
            <p>Add Product</p>
          </div>
        </Link>

        <Link to={'/listproduct'} style={{ textDecoration: 'none' }}>
          <div className='flex items-center gap-[10px] px-[10px] py-[5px] rounded-[6px] bg-slate-300 cursor-pointer hover:bg-slate-400'>
            <img src={list_product_icon} alt="Product List" className='w-6 h-6' />
            <p>Product List</p>
          </div>
        </Link>

        <Link to={'/registrationdata'} style={{ textDecoration: 'none' }}>
          <div className='flex items-center gap-[10px] px-[10px] py-[5px] rounded-[6px] bg-slate-300 cursor-pointer hover:bg-slate-400'>
            <img src={registration_icon} alt="Registered Users" className='w-6 h-6' />
            <p>Registered Users</p>
          </div>
        </Link>

        <Link to={'/productquantity'} style={{ textDecoration: 'none' }}>
          <div className='flex items-center gap-[10px] px-[10px] py-[5px] rounded-[6px] bg-slate-300 cursor-pointer hover:bg-slate-400'>
            <img src={product_quantity_icon} alt="Product Quantity" className='w-6 h-6' />
            <p>Product Quantity</p>
          </div>
        </Link>
      </div>

      {/* Right section with the profile icon */}
      <img className='w-[75px]' src={navProfile} alt="Profile" />
    </div>
  );
}
