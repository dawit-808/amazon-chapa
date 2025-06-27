import React, { useContext } from "react";
import { Link } from "react-router-dom";
import classes from "./Header.module.css";
import logo from "./icons/amazonIcon.png";
import usFlag from "./icons/usFlag.png";
import { MdLocationPin } from "react-icons/md";
import { IoMdSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import LowerHeader from "./LowerHeader";
import { DataContext } from "../DataProvider/DataProvider";
import { auth } from "../../Utility/firebase";

function Header() {
  const [{ user, basket }, dispatch] = useContext(DataContext);
  const totalItem = basket?.reduce((amount, item) => {
    return item.amount + amount;
  }, 0);

  return (
    <section className={classes.fixed}>
      <div className={classes.header_container}>
        {/* Logo and Location */}
        <div className={classes.left}>
          <Link to="/" className={classes.hoverBox}>
            <img src={logo} alt="Amazon Logo" className={classes.logo} />
          </Link>
          <div className={`${classes.location} ${classes.hoverBox}`}>
            <MdLocationPin size={20} />
            <div>
              <p>Deliver to</p>
              <strong>Ethiopia</strong>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className={classes.search}>
          <select>
            <option value="all">All</option>
            <option value="electronics">Electronics</option>
            <option value="books">Books</option>
            <option value="fashion">Fashion</option>
          </select>
          <input type="text" placeholder="Search Amazon" />
          <button className={classes.searchButton}>
            <IoMdSearch size={20} />
          </button>
        </div>

        {/* Right Section */}
        <div className={classes.right}>
          <div className={`${classes.language} ${classes.hoverBox}`}>
            <img src={usFlag} alt="Flag" />
            <select>
              <option>EN</option>
            </select>
          </div>

          <Link
            to={user ? "/" : "/auth"}
            className={`${classes.option} ${classes.hoverBox}`}
            onClick={() => {
              if (user) {
                auth.signOut();
              }
            }}
          >
            <p>Hello, {user?.email ? user.email.split("@")[0] : "Sign In"}</p>
            <strong>{user ? "Sign Out" : "Account & Lists"}</strong>
          </Link>

          <Link
            to="/orders"
            className={`${classes.option} ${classes.hoverBox}`}
          >
            <p>Returns</p>
            <strong>& Orders</strong>
          </Link>

          <Link to="/cart" className={`${classes.cart} ${classes.hoverBox}`}>
            <FiShoppingCart size={26} />
            <span>{totalItem}</span>
          </Link>
        </div>
      </div>
      <LowerHeader />
    </section>
  );
}

export default Header;
