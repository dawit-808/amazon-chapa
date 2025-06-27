import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../Utility/firebase";
import { doc, collection, setDoc } from "firebase/firestore";
import { useContext } from "react";
import { DataContext } from "../../components/DataProvider/DataProvider";
import { Type } from "../../Utility/action.type";
import axios from "axios";

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
        const response = await axios.get(
          `https://api.chapa.co/v1/transaction/verify/${txRef}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_CHAPA_SECRET_KEY}`,
            },
          }
        );

        const payment = response.data.data;

        if (payment.status === "success") {
          await setDoc(
            doc(collection(db, "users", user.uid, "orders"), txRef),
            {
              basket,
              amount: Number(payment.amount) * 100,
              created: Math.floor(Date.now() / 1000),
            }
          );

          dispatch({ type: Type.EMPTY_BASKET });
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
  }, [location.search, user]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{message}</h2>
    </div>
  );
}

export default PaymentSuccess;
