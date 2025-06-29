import { useContext } from "react";
import classes from "./Cart.module.css";
import LayOut from "../../components/LayOut/LayOut";
import { DataContext } from "../../components/DataProvider/DataProvider";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormat";
import { Link } from "react-router-dom";
import { Type } from "../../Utility/action.type";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FiGift } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

function Cart() {
  const [{ basket }, dispatch] = useContext(DataContext);
  const total = basket.reduce(
    (amount, item) => amount + item.price * item.amount,
    0
  );

  const increment = (item) => {
    dispatch({
      type: Type.ADD_TO_BASKET,
      item,
    });
  };

  const decrement = (id) => {
    dispatch({
      type: Type.REMOVE_FROM_BASKET,
      id,
    });
  };

  const removeItem = (id) => {
    dispatch({
      type: Type.REMOVE_ITEM,
      id,
    });
  };

  return (
    <LayOut>
      <section className={classes.container}>
        <div className={classes.cart_header}>
          <h1 className={classes.cart_title}>Your Selection</h1>
          <p className={classes.cart_subtitle}>
            {basket.length} exquisite items in your collection
          </p>
        </div>

        <div className={classes.cart_layout}>
          <div className={classes.cart_main}>
            {basket.length === 0 ? (
              <div className={classes.empty_cart}>
                <div className={classes.empty_illustration}>
                  <svg viewBox="0 0 64 64">
                    <path d="M45,50H19c-2.2,0-4-1.8-4-4V22c0-2.2,1.8-4,4-4h26c2.2,0,4,1.8,4,4v24C49,48.2,47.2,50,45,50z" />
                    <path d="M32,38c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S35.3,38,32,38z" />
                    <path d="M24,22l-4-8H12c-2.2,0-4,1.8-4,4v32c0,2.2,1.8,4,4,4h40c2.2,0,4-1.8,4-4V18c0-2.2-1.8-4-4-4H44l-4,8H24z" />
                  </svg>
                </div>
                <h3>Your cart is empty</h3>
                <p>
                  Discover exceptional items to add to your luxury experience
                </p>
                <Link to="/" className={classes.explore_btn}>
                  Begin Your Journey
                </Link>
              </div>
            ) : (
              <div className={classes.cart_items}>
                {basket.map((item) => (
                  <div key={item.id} className={classes.cart_item}>
                    <div className={classes.item_image}>
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div className={classes.item_details}>
                      <h4 className={classes.item_title}>{item.title}</h4>
                      <p className={classes.item_description}>
                        {item.description}
                      </p>
                      <div className={classes.item_actions}>
                        <div className={classes.quantity_control}>
                          <button
                            className={classes.quantity_btn}
                            onClick={() => decrement(item.id)}
                            aria-label="Decrease quantity"
                          >
                            <IoIosArrowDown size={16} />
                          </button>
                          <span className={classes.quantity}>
                            {item.amount}
                          </span>
                          <button
                            className={classes.quantity_btn}
                            onClick={() => increment(item)}
                            aria-label="Increase quantity"
                          >
                            <IoIosArrowUp size={16} />
                          </button>
                        </div>
                        <button
                          className={classes.remove_btn}
                          onClick={() => removeItem(item.id)}
                        >
                          <RiDeleteBin6Line size={18} />
                        </button>
                      </div>
                    </div>
                    <div className={classes.item_price}>
                      <CurrencyFormat amount={item.price * item.amount} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {basket.length > 0 && (
            <div className={classes.cart_summary}>
              <div className={classes.summary_card}>
                <h3 className={classes.summary_title}>Order Summary</h3>

                <div className={classes.summary_row}>
                  <span>Subtotal</span>
                  <span>
                    <CurrencyFormat amount={total} />
                  </span>
                </div>

                <div className={classes.summary_row}>
                  <span>Estimated Delivery</span>
                  <span className={classes.free}>FREE</span>
                </div>

                <div className={classes.summary_row}>
                  <span>Items</span>
                  <span>{basket.length}</span>
                </div>

                <div className={classes.total_row}>
                  <span>Total</span>
                  <span className={classes.total_amount}>
                    <CurrencyFormat amount={total} />
                  </span>
                </div>

                <Link to="/payments" className={classes.checkout_btn}>
                  Secure Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </LayOut>
  );
}

export default Cart;
