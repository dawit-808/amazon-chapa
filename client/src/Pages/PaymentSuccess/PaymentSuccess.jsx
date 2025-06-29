import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../Utility/firebase";
import { doc, collection, setDoc } from "firebase/firestore";
import { DataContext } from "../../components/DataProvider/DataProvider";
import { Type } from "../../Utility/action.type";
import { axiosInstance } from "../../Api/axios";
import Loader from "../../components/Loader/Loader";
import Confetti from "react-confetti";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaRedo,
  FaHistory,
} from "react-icons/fa";
import styles from "./PaymentSuccess.module.css";
import LayOut from "../../components/LayOut/LayOut";

function PaymentSuccess() {
  const [{ basket, user }, dispatch] = useContext(DataContext);
  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const txRef = new URLSearchParams(location.search).get("tx_ref");

  const handleRetry = () => window.location.reload();

  const handleViewOrders = () => {
    dispatch({ type: Type.EMPTY_BASKET });
    localStorage.removeItem("basket_backup");
    navigate("/orders", { state: { msg: "Order placed" } });
  };

  useEffect(() => {
    const resize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (!user) return; // wait until user is available

    const verifyPayment = async () => {
      if (!txRef || !user.uid) return;

      try {
        const { data } = await axiosInstance.get(`/payment/verify/${txRef}`);
        const payment = data?.data;

        if (payment?.status !== "success") {
          throw new Error("Payment not successful.");
        }

        const basketBackup = JSON.parse(
          localStorage.getItem("basket_backup") || "[]"
        );
        const finalBasket = basketBackup.length ? basketBackup : basket;

        if (!finalBasket.length) {
          throw new Error("Empty basket. Cannot complete order.");
        }

        await setDoc(doc(collection(db, "users", user.uid, "orders"), txRef), {
          basket: finalBasket,
          amount: Number(payment.amount) * 100,
          created: Date.now(),
          status: "processing",
          paymentMethod: "Chapa",
          transactionRef: txRef,
        });

        setStatus("success");
      } catch (err) {
        console.error("Verify error:", err);
        setStatus("error");
        setErrorMsg(err.message || "Payment verification failed.");
      }
    };

    verifyPayment();
  }, [user, txRef, basket, dispatch]);

  return (
    <LayOut>
      <div className={styles.container}>
        {status === "loading" && (
          <div className={styles.loaderContainer}>
            <Loader />
            <p>Verifying your payment...</p>
          </div>
        )}

        {status === "success" && (
          <>
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
            />
            <div className={styles.successCard}>
              <FaCheckCircle className={styles.successIcon} />
              <h2 className={styles.successTitle}>Payment Successful!</h2>
              <p className={styles.message}>
                Thanks for your purchase. Your order is now being processed.
              </p>
              <button
                onClick={handleViewOrders}
                className={styles.successButton}
              >
                <FaHistory /> View Orders
              </button>
            </div>
          </>
        )}

        {status === "error" && (
          <div className={styles.errorCard}>
            <FaTimesCircle className={styles.errorIcon} />
            <h2 className={styles.errorTitle}>Payment Failed</h2>
            <p className={styles.message}>{errorMsg}</p>
            <button onClick={handleRetry} className={styles.errorButton}>
              <FaRedo /> Try Again
            </button>
          </div>
        )}
      </div>
    </LayOut>
  );
}

export default PaymentSuccess;
