import React from 'react'
import arrow_icon from '../Components/assets/breadcrum_arrow.png'

export default function Breadcrum(props) {
    const {product} = props
  return (
    <div className='flex items-center gap-[8px] text-slate-500 text-[16px] font-semibold my-[60px] mx-[170px] capitalize'>
        HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" /> {product.category} <img src={arrow_icon} alt="" /> {product.name}
    </div>
  )
}
