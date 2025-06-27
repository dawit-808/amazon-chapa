import React from "react";
import CategoryCard from "./CategoryCard";
import classes from "./CategoryCard.module.css";
import { categories } from "./data.js";

function Category() {
  return (
    <>
      <section className={classes.category_container}>
        {categories.map((item, index) => (
          <CategoryCard key={index} data={item}></CategoryCard>
        ))}
      </section>
    </>
  );
}

export default Category;
