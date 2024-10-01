import React, { useState, useEffect } from 'react';
import Item from '../Items/Item';

export default function Popular() {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    // Fetch popular products from the backend
    const fetchPopularProducts = async () => {
      try {
        const response = await fetch("http://localhost:4000/popular-products");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPopularProducts(data);
      } catch (error) {
        console.error("Error fetching popular products:", error);
      }
    };

    fetchPopularProducts();
  }, []);

  return (
    <div className="flex flex-col items-center gap-[10px] h-[90vh]">
      <h1 className='text-gray-950 text-[50px] font-semibold'>POPULAR IN WOMEN</h1>
      <hr className='w-[200px] h-[6px] rounded-[10px] bg-slate-800' />
      <div className="mt-[50px] flex gap-[30px]">
        {popularProducts.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No popular products available</p>
        ) : (
          popularProducts.map((item, i) => (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          ))
        )}
      </div>
    </div>
  );
}
