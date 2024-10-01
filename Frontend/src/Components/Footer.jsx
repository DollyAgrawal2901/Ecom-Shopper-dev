import React from 'react'
import footer_logo from './assets/logo_big.png'
import instagram_icon from './assets/instagram_icon.png'
import pintester_icon from './assets/pintester_icon.png'
import whatsapp_icon from './assets/whatsapp_icon.png'

export default function Footer() {
  return (
    <div className='flex flex-col justify-center items-center gap-[50px] '>
        <div className='flex items-center gap-[30px] '>
            <img src={footer_logo} alt="" />
            <p className="text-slate-900 text-[46px] font-bold">SHOPPER</p>
        </div>
        <ul className='flex list-none gap-[50px] text-slate-950 text-[20px]'>
            <li className='cursor-pointer'>Company</li>
            <li className='cursor-pointer'>Offices</li>
            <li className='cursor-pointer'>Products</li>
            <li className='cursor-pointer'>About</li>
            <li className='cursor-pointer'>Contact</li>
        </ul>
        <div className='flex gap-[20px] '>
            <div className='p-[10px] pb-[6px] bg-slate-500 border border-[#b3ebc1]'>
                <img src={instagram_icon} alt="" />
            </div>
            <div className='p-[10px] pb-[6px] bg-slate-500 border border-[#b3ebc1]'> 
                <img src={pintester_icon} alt="" />
            </div>
            <div className='p-[10px] pb-[6px] bg-slate-500 border border-[#b3ebc1]'>
                <img src={whatsapp_icon} alt="" />
            </div>
        </div>
        <div className='flex flex-col items-center gap-[30px] w-[100%] mb-[30px] text-slate-900 text-[20px]'>
            <hr className='w-[80%] border-none rounded-[10px] h-[3px] bg-slate-500'/>
            <p>Copyright @ 2024- All Rights Reserved</p>
        </div>
    </div>
  )
}
