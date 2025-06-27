import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import Auth from "./Pages/Auth/Auth";
import Payment from "./Pages/Payment/Payment";
import Orders from "./Pages/Orders/Orders";
import Cart from "./Pages/Cart/Cart";
import Results from "./Pages/Results/Results";
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";

const stripePromise = loadStripe(
  "pk_test_51RVqtGR9Q8tavpYtes59UyU6FPvDrrfslDr8H8acMTK5srkTHBXuFKRMjj2VzQqvgJJKeLEXcp0NjJZFTg6Yfl2F00UxOmNYHH"
);

function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/payments"
          element={
            <ProtectedRoutes
              msg={"You must login to pay"}
              redirect={"/payments"}
            >
              <Elements stripe={stripePromise}>
                <Payment />
              </Elements>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoutes
              msg={"You must login to see your orders"}
              redirect={"/orders"}
            >
              <Orders />
            </ProtectedRoutes>
          }
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products/category/:categoryName" element={<Results />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
}

export default Routing;
