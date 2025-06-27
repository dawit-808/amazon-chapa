import { useContext, useState } from "react";
import classes from "./Payment.module.css";
import LayOut from "../../components/LayOut/LayOut";
import { DataContext } from "../../components/DataProvider/DataProvider";
import ProductCard from "../../components/Product/ProductCard";
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

  // user info
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [pNumber, setPNumber] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    e?.error?.message ? setCardError(e?.error?.message) : setCardError("");
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const response = await axiosInstance.post("/payment/create", {
        fName,
        lName,
        email,
        pNumber,
        amount: total,
      });

      const checkoutUrl = response.data?.data?.checkout_url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Payment Error:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <LayOut>
      <div className={classes.payment_container}>
        {/*  Header */}
        <div className={classes.payment_header}>
          <div className={classes.header_content}>
            <h2>Complete Your Purchase</h2>
            <p className={classes.item_count}>
              {totalItem} premium items selected
            </p>
          </div>
        </div>

        {/* Main Payment Content */}
        <div className={classes.payment_content}>
          {/* Left Column - Order Summary */}
          <div className={classes.order_summary}>
            <section className={classes.section}>
              <h2 className={classes.section_title}>
                <span className={classes.title_number}>1</span>
                Delivery Information
              </h2>
              <div className={classes.delivery_info}>
                <div className={classes.info_card}>
                  <div className={classes.info_row}>
                    <span className={classes.info_label}>Email:</span>
                    <span className={classes.info_value}>{user?.email}</span>
                  </div>
                  <div className={classes.info_row}>
                    <span className={classes.info_label}>Location:</span>
                    <span className={classes.info_value}>
                      Addis Ababa, Ethiopia
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className={classes.section}>
              <h2 className={classes.section_title}>
                <span className={classes.title_number}>2</span>
                Order Summary
              </h2>
              <div className={classes.products_list}>
                {basket?.map((item) => (
                  <ProductCard key={item.id} product={item} flex={true} />
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Payment Form */}
          <div className={classes.payment_form_container}>
            <div className={classes.payment_form_wrapper}>
              <h2 className={classes.section_title}>
                <span className={classes.title_number}>3</span>
                Payment Details
              </h2>

              <form onSubmit={handlePayment} className={classes.payment_form}>
                {cardError && (
                  <div className={classes.error_message}>
                    <svg className={classes.error_icon} viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    {cardError}
                  </div>
                )}

                <div className={classes.form_grid}>
                  <div className={classes.form_group}>
                    <label className={classes.form_label}>First Name</label>
                    <input
                      type="text"
                      className={classes.form_input}
                      required
                      value={fName}
                      onChange={(e) => setFName(e.target.value)}
                    />
                  </div>

                  <div className={classes.form_group}>
                    <label className={classes.form_label}>Last Name</label>
                    <input
                      type="text"
                      className={classes.form_input}
                      required
                      value={lName}
                      onChange={(e) => setLName(e.target.value)}
                    />
                  </div>
                </div>

                <div className={classes.form_group}>
                  <label className={classes.form_label}>Email</label>
                  <input
                    type="email"
                    className={classes.form_input}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className={classes.form_group}>
                  <label className={classes.form_label}>Phone Number</label>
                  <input
                    type="text"
                    className={classes.form_input}
                    required
                    value={pNumber}
                    onChange={(e) => setPNumber(e.target.value)}
                  />
                </div>

                <div className={classes.total_container}>
                  <div className={classes.total_label}>Order Total</div>
                  <div className={classes.total_amount}>
                    <CurrencyFormat amount={total} />
                  </div>
                </div>

                <button
                  type="submit"
                  className={classes.pay_button}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <ClipLoader size={20} color="#ffffff" />
                    </>
                  ) : (
                    "Complete Payment"
                  )}
                </button>

                <div className={classes.security_badge}>
                  <svg className={classes.lock_icon} viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11V11.99z" />
                  </svg>
                  <span>256-bit SSL Secure Payment</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </LayOut>
  );
}

export default Payment;
