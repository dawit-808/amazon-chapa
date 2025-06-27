import React, { useContext, useState } from "react";
import classes from "./Payment.module.css";
import LayOut from "../../components/LayOut/LayOut";
import { DataContext } from "../../components/DataProvider/DataProvider";
import ProductCard from "../../components/Product/ProductCard";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../Api/axios";
import { ClipLoader } from "react-spinners";
import { db } from "../../Utility/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Type } from "../../Utility/action.type";

function Payment() {
  const [{ user, basket }, dispatch] = useContext(DataContext);
  const totalItem = basket?.reduce((amount, item) => {
    return item.amount + amount;
  }, 0);

  const total = basket.reduce(
    (amount, item) => amount + item.price * item.amount,
    0
  );

  const [cardError, setCardError] = useState("");
  const [processing, setProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleChange = (e) => {
    e?.error?.message ? setCardError(e?.error?.message) : setCardError("");
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      setProcessing(true);

      // 1. Get client secret from backend
      const response = await axiosInstance.post(
        `/payment/create?total=${total}`
      );
      const clientSecret = response.data?.clientSecret;

      // 2. Confirm card payment
      const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      // 3. Save payment info to Firestore (after successful payment)
      await setDoc(
        doc(collection(db, "users", user.uid, "orders"), paymentIntent.id),
        {
          basket: basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
        }
      );

      // empty the basket

      dispatch({ type: Type.EMPTY_BASKET });

      setProcessing(false);
      // console.log("Payment Success:", paymentIntent);
      navigate("/orders", { state: { msg: "You have placed new order" } });
    } catch (error) {
      console.error("Payment Failed:", error);
      setProcessing(false);
    }
  };

  return (
    <>
      <LayOut>
        <div className={classes.payment_header}>Checkout {totalItem} items</div>
        <section className={classes.payment}>
          <div className={classes.flex}>
            <h1>Delivery Address</h1>
            <div>
              <div>{user?.email}</div>
              <div>Addis Ababa</div>
              <div>Ethiopia</div>
            </div>
          </div>
          <hr />
          <div className={classes.flex}>
            <h3>Review items and delivery</h3>
            <div>
              {basket?.map((item) => (
                <ProductCard key={item.id} product={item} flex={true} />
              ))}
            </div>
          </div>
          <hr />

          <div className={classes.flex}>
            <h3>Payment methods</h3>
            <div className={classes.payment_card_container}>
              <div className={classes.payment_details}>
                <form onSubmit={handlePayment}>
                  {/* error */}
                  {cardError && (
                    <small style={{ color: "red" }}>{cardError}</small>
                  )}
                  {/* card element */}
                  <CardElement onChange={handleChange} />

                  {/* price */}
                  <div className={classes.payment_price}>
                    <div>
                      <span style={{ display: "flex", gap: "10px" }}>
                        Total Order | <CurrencyFormat amount={total} />
                      </span>
                    </div>
                    <button type="submit">
                      {processing ? (
                        <ClipLoader size={15} color="#111B21" />
                      ) : (
                        "Pay Now"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </LayOut>
    </>
  );
}

export default Payment;
