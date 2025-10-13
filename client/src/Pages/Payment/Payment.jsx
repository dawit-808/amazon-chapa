import { useContext, useState } from "react";
import classes from "./Payment.module.css";
import LayOut from "../../components/LayOut/LayOut";
import { DataContext } from "../../components/DataProvider/DataProvider";
import ProductCard from "../../components/Product/ProductCard";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../Api/axios";
import { ClipLoader } from "react-spinners";

function Payment() {
  const [{ user, basket }] = useContext(DataContext);

  const totalItems = basket?.reduce((sum, item) => sum + item.amount, 0);
  const totalPrice = basket?.reduce((sum, item) => sum + item.price * item.amount, 0);

  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [pNumber, setPNumber] = useState("");
  const [cardError, setCardError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!user) {
      setCardError("You must sign in before making a payment.");
      return;
    }

    setProcessing(true);
    setCardError("");

    try {
      const response = await axiosInstance.post("/payment/create", {
        fName,
        lName,
        email,
        pNumber,
        basket,
        amount: Math.round(totalPrice * 100), // in cents if backend expects it
      });

      const checkoutUrl = response.data?.data?.checkout_url;

      if (checkoutUrl) {
        localStorage.setItem("basket_backup", JSON.stringify(basket));
        window.location.href = checkoutUrl;
      } else {
        setCardError("Payment link could not be created.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      setCardError("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <LayOut>
      <div className={classes.payment_container}>
        {/* Header */}
        <header className={classes.payment_header}>
          <div className={classes.header_content}>
            <h2>Complete Your Purchase</h2>
            <p className={classes.item_count}>
              {totalItems} premium items selected
            </p>
          </div>
        </header>

        <div className={classes.payment_content}>
          {/* Left Column */}
          <div className={classes.order_summary}>
            {/* Delivery Info */}
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
                    <span className={classes.info_value}>Addis Ababa, Ethiopia</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Order Summary */}
            <section className={classes.section}>
              <h2 className={classes.section_title}>
                <span className={classes.title_number}>2</span>
                Order Summary
              </h2>
              <div className={classes.products_list}>
                {basket?.map((item) => (
                  <ProductCard key={item.id} product={item} flex />
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
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
                    <CurrencyFormat amount={totalPrice} />
                  </div>
                </div>

                <button
                  type="submit"
                  className={classes.pay_button}
                  disabled={processing}
                >
                  {processing ? (
                    <ClipLoader size={20} color="#ffffff" />
                  ) : (
                    "Checkout Payment"
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
