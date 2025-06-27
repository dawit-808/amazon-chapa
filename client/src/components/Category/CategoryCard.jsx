import React from "react";
import { Link } from "react-router-dom";
import classes from "./CategoryCard.module.css";

function CategoryCard({ data }) {
  return (
    <>
      <div className={classes.category}>
        <Link to={`/products/category/${data.name}`}>
          <h2>
            <span>{data.title}</span>
          </h2>
          <img src={data.imgLink} alt={data.title} />
          <p>Shop now</p>
        </Link>
      </div>
    </>
  );
}

export default CategoryCard;
