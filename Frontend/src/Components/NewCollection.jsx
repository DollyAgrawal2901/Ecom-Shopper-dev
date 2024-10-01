import React, { useState, useEffect } from 'react';
import Item from './Items/Item';

export default function NewCollection() {
  const [newCollection, setNewCollection] = useState([]);

  useEffect(() => {
    // Fetch new collection data from backend
    const fetchNewCollections = async () => {
      try {
        const response = await fetch("http://localhost:4000/newcollections");
        const data = await response.json();
        setNewCollection(data);
      } catch (error) {
        console.error("Error fetching new collections:", error);
      }
    };
    fetchNewCollections();
  }, []);

  return (
    <div className="flex flex-col items-center gap-[20px] mb-[100px]">
      <h1 className='text-gray-950 text-[50px] font-semibold'>
        NEW COLLECTIONS
      </h1>
      <hr className='w-[200px] h-[6px] rounded-[10px] bg-slate-800' />
      <div className="grid grid-cols-4 mt-[50px] gap-[30px]">
        {newCollection.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
}
