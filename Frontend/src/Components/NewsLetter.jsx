import React from 'react'

export default function NewsLetter() {
  return (
    <div className='w-[65%] h-[40vh] flex flex-col items-center justify-center m-auto px-[140px] py-0 mb-[150px] bg-gradient-to-b from-[#d1efff] to-[#efff0a22] via-transparent gap-[30px]'>
        <h1 className='text-stone-900 text-[55px] font-semibold'>Get Exclusve Offers on your Email</h1>
        <p className='text-stone-800 text-[20px]'>Subscribe to our newsletter and stay updated</p>
        <div className='flex items-center justify-center bg-yellow-50 w-[730px] h-[70px] rounded-[80px] border border-[#ff5733]'> 
            <input className='w-[500px] ml-[30px] border-none outline-none text-slate-950 text-[16px]' type="email" placeholder='Your Email id' />
            <button className='w-[210px] h-[70px] rounded-[80px] bg-black text-white text-[16px]cursor-pointer'>Subscribe</button>
        </div>
    </div>
  )
}
