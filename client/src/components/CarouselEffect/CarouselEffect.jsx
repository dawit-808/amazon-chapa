import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { img } from "./img/data";
import classes from "./CarouselEffect.module.css";

function CarouselEffect() {
  return (
    <>
      <div className={classes.carousel_wrapper}>
        <Carousel
          autoPlay
          infiniteLoop
          showIndicators={false}
          showThumbs={false}
          showStatus={false}
          interval={4000}
        >
          {img.map((item, index) => (
            <div key={index}>
              <img src={item} alt={`slide-${index + 1}`} />
            </div>
          ))}
        </Carousel>
        <div className={classes.hero_img}></div>
      </div>
    </>
  );
}

export default CarouselEffect;
