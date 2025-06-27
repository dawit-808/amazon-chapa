import React, { useContext, useEffect, useState } from "react";
import classes from "./Orders.module.css";
import LayOut from "../../components/LayOut/LayOut";
import { db } from "../../Utility/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { DataContext } from "../../components/DataProvider/DataProvider";
import ProductCard from "../../components/Product/ProductCard";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormat";

function Orders() {
  const [{ user }, dispatch] = useContext(DataContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const ordersRef = collection(db, "users", user.uid, "orders");
      const q = query(ordersRef, orderBy("created", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const ordersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setOrders(ordersData);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <LayOut>
        <div className={classes.loading_container}>
          <div className={classes.loading_spinner}></div>
        </div>
      </LayOut>
    );
  }

  return (
    <LayOut>
      <section className={classes.container}>
        <div className={classes.orders_container}>
          <div className={classes.header_wrapper}>
            <h2>Your Order History</h2>
            <p className={classes.subtitle}>All your purchases in one place</p>
          </div>

          {orders.length === 0 ? (
            <div className={classes.empty_state}>
              <div className={classes.empty_icon}>
                <svg viewBox="0 0 24 24">
                  <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
                </svg>
              </div>
              <h3>No Orders Yet</h3>
              <p>Your ordered items will appear here</p>
            </div>
          ) : (
            <div className={classes.orders_list}>
              {orders.map((eachOrder, i) => {
                const calculatedTotal = eachOrder.data.basket?.reduce(
                  (sum, item) => sum + item.price * item.amount,
                  0
                );
                const orderTotal = eachOrder.data.amount
                  ? eachOrder.data.amount / 100
                  : calculatedTotal;

                return (
                  <div key={i} className={classes.order_card}>
                    <div className={classes.order_header}>
                      <div className={classes.order_meta}>
                        <div>
                          <span className={classes.meta_label}>Order #</span>
                          <span className={classes.order_id}>
                            {eachOrder.id}
                          </span>
                        </div>
                        <div>
                          <span className={classes.meta_label}>Date</span>
                          <span className={classes.order_date}>
                            {new Date(
                              eachOrder.data.created * 1000
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className={classes.order_total}>
                        <span className={classes.total_label}>Total</span>
                        <span className={classes.total_amount}>
                          <CurrencyFormat amount={orderTotal} />
                        </span>
                      </div>
                    </div>

                    <div className={classes.order_items}>
                      {eachOrder.data.basket?.map((order) => (
                        <div key={order.id} className={classes.order_item}>
                          <div className={classes.item_image}>
                            <img src={order.image} alt={order.title} />
                          </div>
                          <div className={classes.item_details}>
                            <h4 className={classes.item_title}>
                              {order.title}
                            </h4>
                            <div className={classes.item_meta}>
                              <span className={classes.item_price}>
                                <CurrencyFormat amount={order.price} />
                              </span>
                              <span className={classes.item_quantity}>
                                × {order.amount}
                              </span>
                              <span className={classes.item_subtotal}>
                                <CurrencyFormat
                                  amount={order.price * order.amount}
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </LayOut>
  );
}

export default Orders;
