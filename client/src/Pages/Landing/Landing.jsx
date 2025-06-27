import React from "react";
import CarouselEffect from "../../components/CarouselEffect/CarouselEffect";
import Category from "../../components/Category/Category";
import LayOut from "../../components/LayOut/LayOut";
import Product from "../../components/Product/Product";
import classes from "./Landing.module.css";

function Landing() {
  return (
    <section className={classes.landing_section}>
      <LayOut>
        <CarouselEffect />
        <Category />
        <Product />
      </LayOut>
    </section>
  );
}

export default Landing;
