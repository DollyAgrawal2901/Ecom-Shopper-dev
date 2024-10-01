import React from 'react'
import exclusive_image from '../assets/exclusive_image.png'

export default function Offers() {
  return (
    <div className="w-[65%] h-[60vh] flex m-auto px-[140px] py-0 mb-[150px] bg-gradient-to-b from-[#d1efff] to-[#efff0a22] via-transparent">
        <div className='flex-1 flex flex-col justify-center'>
            <h1 className='text-neutral-900 text-[80px] font-semibold'>Exclusive</h1>
            <h1 className='text-neutral-900 text-[80px] font-semibold'>Offers for you</h1>
            <p className='text-neutral-950 text-[22px] font-semibold'>ONLY ON BEST SELLERS PRODUCT</p>
            <button className='w-[282px] h-[70px] rounded-[35px] bg-green-700 border-none text-white text-[22px] font-medium mt-[30px] cursor-pointer'>Check Now</button>
        </div>
        <div className='flex-1 flex items-center justify-center pt-[50px]'>
            <img src={exclusive_image} alt="" />
        </div>
    </div>
  )
}
