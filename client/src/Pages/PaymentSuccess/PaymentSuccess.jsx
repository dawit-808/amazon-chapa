import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../Utility/firebase";
import { doc, collection, setDoc, collectionGroup } from "firebase/firestore";
import { useContext } from "react";
import { DataContext } from "../../components/DataProvider/DataProvider";
import { Type } from "../../Utility/action.type";
import { axiosInstance } from "../../Api/axios";

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [{ basket, user }, dispatch] = useContext(DataContext);
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const txRef = query.get("tx_ref");

    const verifyPayment = async () => {
      if (!txRef || !user?.uid) {
        setMessage("Missing payment info or user is not logged in.");
        return;
      }

      try {
        const response = await axiosInstance.get(`/${txRef}`);
        const payment = response?.data?.data;

        if (!payment) {
          setMessage("No payment data received.");
          return;
        }

        if (payment.status === "success") {
          // Always use the backup basket if it exists
          const basketBackup = localStorage.getItem("basket_backup");
          const orderBasket = basketBackup ? JSON.parse(basketBackup) : basket;

          if (!orderBasket || orderBasket.length === 0) {
            setMessage("No items in basket. Cannot create order.");
            return;
          }

          await setDoc(
            doc(collection(db, "users", user.uid, "orders"), txRef),
            {
              basket: orderBasket, // Use the backup basket or current basket
              amount: Number(payment.amount) * 100,
              created: Math.floor(Date.now() / 1000),
            }
          );

          dispatch({ type: Type.EMPTY_BASKET });
          localStorage.removeItem("basket_backup");
          setMessage("Payment successful! Redirecting...");
          setTimeout(() => {
            navigate("/orders", {
              state: { msg: "You have placed a new order" },
            });
          }, 1000);
        } else {
          setMessage("Payment failed. Please try again.");
        }
      } catch (err) {
        console.error("Chapa verify error:", err);
        setMessage("Payment verification failed. Try again later.");
      }
    };

    verifyPayment();
  }, [location.search, user, basket, dispatch, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{message}</h2>
    </div>
  );
}

export default PaymentSuccess;
