import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../ShopContext';
import { useParams } from 'react-router-dom';
import Breadcrum from '../../Components/Breadcrum';
import ProductDisplay from '../../Components/ProductDisplay';
import DescriptionBox from '../../Components/DescriptionBox';
import RelatedProducts from '../../Components/RelatedProducts';

export default function Product() {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const localProduct = all_product.find((e) => e.id === Number(productId));

    if (localProduct) {
      setProduct(localProduct);
      setLoading(false); // Set loading to false
    } else {
      const fetchProductFromDB = async () => {
        try {
          const response = await fetch(`http://localhost:4000/product/${productId}`);
          if (response.ok) {
            const data = await response.json();
            setProduct(data);
          } else {
            setError("Product not found in MongoDB");
          }
        } catch (error) {
          setError("Error fetching product from MongoDB");
          console.error("Error fetching product from MongoDB:", error);
        } finally {
          setLoading(false); // Set loading to false
        }
      };
      fetchProductFromDB();
    }
  }, [all_product, productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <div>
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProducts currentCategory={product.category} />
    </div>
  );
}
