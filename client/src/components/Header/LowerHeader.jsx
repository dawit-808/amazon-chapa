import React from "react";
import { MdOutlineMenu } from "react-icons/md";
import classes from "./LowerHeader.module.css";

function LowerHeader() {
  return (
    <>
      <section className={classes.lowerHeader}>
        <ul>
          <li>
            <MdOutlineMenu />
            <span>All</span>
          </li>
          <li>Today's Deals</li>
          <li>Registry</li>
          <li>Prime Video</li>
          <li>Gift Cards</li>
          <li>Sell</li>
        </ul>
      </section>
    </>
  );
}

export default LowerHeader;
