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
                    <path d="M155.708 20.3315L154.788 21.3315L128.338 58.0215L128.628 58.5915H127.938L119.278 70.6415L91.1681 109.262C87.8654 113.137 83.6487 116.129 78.8994 117.966C74.1501 119.803 69.0178 120.427 63.9666 119.782C58.9155 119.137 54.1046 117.244 49.9691 114.273C45.8336 111.301 42.5038 107.346 40.2807 102.765C38.0577 98.1838 37.0115 93.1207 37.2367 88.0335C37.462 82.9463 38.9516 77.9955 41.5708 73.6286C44.1901 69.2617 47.8564 65.6164 52.2384 63.0224C56.6203 60.4284 61.5797 58.9674 66.6681 58.7715H127.938L128.338 58.1915C122.626 47.0892 113.967 37.7739 103.311 31.2667C92.6555 24.7596 80.4137 21.3119 67.9281 21.3015H63.8581C52.5215 21.9933 41.5388 25.5137 31.9125 31.5412C22.2861 37.5687 14.3229 45.9114 8.74968 55.8076C3.17646 65.7039 0.170797 76.8385 0.0070675 88.195C-0.156662 99.5515 2.52676 110.768 7.81236 120.821C13.098 130.874 20.8174 139.443 30.2659 145.745C39.7145 152.048 50.5912 155.883 61.9031 156.901C73.215 157.92 84.6019 156.088 95.0241 151.575C105.446 147.061 114.572 140.009 121.568 131.062L124.098 127.672L165.408 70.6715L174.068 58.7415L201.068 21.3315L207.898 12.1515C199.888 6.32737 189.896 3.91777 180.112 5.45124C170.328 6.98472 161.552 12.3361 155.708 20.3315Z" />
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
