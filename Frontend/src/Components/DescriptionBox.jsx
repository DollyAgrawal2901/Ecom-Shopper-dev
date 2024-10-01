import React from 'react'

export default function DescriptionBox() {
  return (
    <div className='my-[120px] mx-[170px]'>
        <div className='flex'>
            <div className='flex items-center justify-center text-[16px] font-semibold w-[171px] h-[70px] border border-[#d0d0d0]'>
                Description
            </div>
            <div className='flex items-center justify-center text-[16px] font-semibold w-[171px] h-[70px] border border-[#d0d0d0] bg-slate-100 text-slate-500'>
                Reviews (122)
            </div>
        </div>
        <div className='flex flex-col gap-[25px] border border-slate-400 p-[48px] pb-[70px]'>
            <p>An e-commerce website, or online store, is a digital storefront that allows customers to buy and sell products and services over the internet. It acts as a virtual equivalent of a physical store, with product shelves, sales staff, and a cash register. Customers can use e-commerce websites to browse products, find information, and make purchases.</p>
            <p>An ecommerce website is an online store where customers can find products, browse offerings, and place purchases online. It facilitates the transaction between a buyer and seller. </p>
        </div>
    </div>
  )
}
