import React, { useEffect, useState } from "react";
import classes from "./ProductDetail.module.css";
import LayOut from "../../components/LayOut/LayOut";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Api/api";
import ProductCard from "../../components/Product/ProductCard";
import Loader from "../../components/Loader/Loader";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Failed to load product:", err))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <LayOut>
      {loading ? (
        <Loader />
      ) : product ? (
        <ProductCard
          product={product}
          flex={true}
          renderDesk={true}
          renderAdd={true}
        />
      ) : (
        <p>Product not found.</p>
      )}
    </LayOut>
  );
}

export default ProductDetail;
