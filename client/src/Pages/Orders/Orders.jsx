import React, { useContext, useEffect, useState } from "react";
import classes from "./Orders.module.css";
import LayOut from "../../components/LayOut/LayOut";
import { db } from "../../Utility/firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { DataContext } from "../../components/DataProvider/DataProvider";
import ProductCard from "../../components/Product/ProductCard";

function Orders() {
  const [{ user }, dispatch] = useContext(DataContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      const ordersRef = collection(db, "users", user.uid, "orders");

      const q = query(ordersRef, orderBy("created", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setOrders(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

      return () => unsubscribe();
    } else {
      setOrders([]);
    }
  }, [user]);

  return (
    <LayOut>
      <section className={classes.container}>
        <div className={classes.orders_container}>
          <h2>Your Orders</h2>
          {/* ordered items */}
          <div>
            {orders.length === 0 ? (
              <p style={{ marginTop: "1rem" }}>
                You haven't placed any orders yet.
              </p>
            ) : (
              orders.map((eachOrder, i) => (
                <div key={i}>
                  <hr />
                  <p>
                    Order ID: {eachOrder.id}
                    <br />
                    Ordered on:{" "}
                    {new Date(eachOrder.data.created * 1000).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                    <br />
                    Total:{" "}
                    {(eachOrder.data.amount / 100).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>

                  {eachOrder.data.basket.map((order) => (
                    <ProductCard flex={true} product={order} key={order.id} />
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </LayOut>
  );
}

export default Orders;
