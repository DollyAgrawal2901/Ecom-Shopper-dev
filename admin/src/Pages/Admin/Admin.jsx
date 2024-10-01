import React from 'react'
import Sidebar from '../../Components/Sidebar'
import { Routes,Route } from 'react-router-dom'
import AddProduct from '../../Components/AddProduct'
import ListProduct from '../../Components/ListProduct'
import RegistrationData from '../../Components/RegistrationData'
import ProductQuantity from '../../Components/ProductQuantity'

export default function Admin() {
  return (
    <div className=''>
        {/* <Sidebar /> */}
        <Routes>
          <Route path='/addproduct' element={<AddProduct />} />
          <Route path='/listproduct' element={<ListProduct />} />
          <Route path='/registrationdata' element={<RegistrationData />}/>
          <Route path='/productquantity' element={<ProductQuantity />}/>
        </Routes>
    </div>
  )
}
