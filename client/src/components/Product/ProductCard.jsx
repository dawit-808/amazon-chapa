import React, { useContext } from "react";
import classes from "./Product.module.css";
import Rating from "@mui/material/Rating";
import CurrencyFormat from "../CurrencyFormat/CurrencyFormat";
import { Link } from "react-router-dom";
import { DataContext } from "../DataProvider/DataProvider";
import { Type } from "../../Utility/action.type";

function ProductCard({ product, flex, renderDesk, renderAdd }) {
  const { title, price, image, rating, id, description } = product;

  const [state, dispatch] = React.useContext(DataContext);

  const addToCart = () => {
    dispatch({
      type: Type.ADD_TO_BASKET,
      item: {
        id,
        title,
        price,
        image,
        rating,
        description,
      },
    });
  };

  return (
    <section
      className={`${classes.card_container} ${
        flex ? classes.product_flexed : ""
      }`}
    >
      <Link to={`/products/${id}`}>
        <img src={image} alt={title} />
      </Link>

      <div className={classes.product_content}>
        <h4>{title}</h4>

        {renderDesk && <p className={classes.description}>{description}</p>}

        <div className={classes.rating}>
          <Rating name="half-rating" defaultValue={5} precision={0.1} />
          <small>{rating?.count}</small>
        </div>

        <div className={classes.price}>
          <CurrencyFormat amount={price} />
        </div>

        {renderAdd && (
          <button className={classes.btn} onClick={addToCart}>
            Add to cart
          </button>
        )}
      </div>
    </section>
  );
}

export default ProductCard;
