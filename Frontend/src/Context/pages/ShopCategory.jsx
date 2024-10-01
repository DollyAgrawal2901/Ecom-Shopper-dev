import React, { useEffect, useState, useContext } from 'react';
import { ShopContext } from '../ShopContext';
import dropdown_icon from '../../Components/assets/dropdown_icon.png';
import Item from '../../Components/Items/Item';

export default function ShopCategory(props) {
  const { all_product, setAllProducts } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set local products from context
    setProducts(all_product || []);
  }, [all_product]);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/allproduct');
        if (response.ok) {
          const data = await response.json();
          setNewProducts(data);
          if (setAllProducts) setAllProducts(data); // Update context if needed
        } else {
          console.error("Error fetching new products from MongoDB");
        }
      } catch (error) {
        console.error("Error fetching new products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewProducts();
  }, [setAllProducts]);

  // Combine local and new products
  // const combinedProducts = [...products, ...newProducts];
  const combinedProducts = [...newProducts];

  // Filter products by category
  const filteredProducts = combinedProducts.filter(
    (item) => item.category === props.category
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <img className='block my-[30px] mx-auto w-[82%]' src={props.banner} alt="" />
      <div className='flex my-0 mx-[170px] justify-between items-center'>
        <p className='font-semibold'>
          <span className='font-semibold'>Showing 1-{filteredProducts.length}</span> out of {filteredProducts.length} products
        </p>
        <div className='py-[10px] px-[20px] rounded-[40px] border border-[#888]'>
          Sort by <img src={dropdown_icon} alt="" />
        </div>
      </div>
      <div className='my-[20px] mx-[170px] grid grid-cols-4 gap-y-[80px]'>
        {filteredProducts.length === 0 ? (
          <p className='text-center text-gray-500 py-4'>No products available</p>
        ) : (
          filteredProducts.map((item) => (
            <Item
              key={item.id}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))
        )}
      </div>
      <div className='flex justify-center items-center my-[150px] mx-auto w-[233px] h-[69px] rounded-[75px] bg-gray-500 text-gray-900 text-[18px] font-medium'>
        Explore More
      </div>
    </div>
  );
}
