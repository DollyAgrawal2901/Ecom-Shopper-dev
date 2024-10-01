import React from 'react'
import { Link } from 'react-router-dom'

export default function (props) {
  return (
    <div className='w-[350px] hover:scale-[1.05] transition duration-[0.6s]'>
        <Link to={`/product/${props.id}`}><img onClick={window.scrollTo(0,0)} src={props.image} alt="" /></Link>
        <p className='my-1.5'>{props.name}</p>
        <div className='flex gap-[20px] '>
            <div className='text-slate-700 text-[18px] font-semibold'>${props.new_price}</div>
            <div className='text-slate-500 text-[18px] font-medium line-through'>{props.old_price}</div>
        </div>
    </div>
  )
}
