import React, { useContext, useState } from "react";
import classes from "./Auth.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import iconBlack from "./icon/iconBlack.png";
import { auth } from "../../Utility/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { DataContext } from "../../components/DataProvider/DataProvider";
import { Type } from "../../Utility/action.type";
import { ClipLoader } from "react-spinners";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({
    signin: false,
    signup: false,
  });

  const [{ user }, dispatch] = useContext(DataContext);
  const navigate = useNavigate();
  const navStateData = useLocation();

  const authHandler = async (e) => {
    e.preventDefault();
    const action = e.target.name;

    setLoading((prev) => ({ ...prev, [action]: true }));
    setError("");

    try {
      let userCredential;

      if (action === "signin") {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password.trim()
        );
        navigate(navStateData?.state?.redirect || "/");
      } else if (action === "signup") {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password.trim()
        );
      }

      dispatch({
        type: Type.SET_USER,
        user: userCredential.user,
      });

      setEmail("");
      setPassword("");
      navigate(navStateData?.state?.redirect || "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, [action]: false }));
    }
  };

  return (
    <section className={classes.auth}>
      <Link to="/">
        <img src={iconBlack} alt="App Logo" />
      </Link>

      <div className={classes.auth_container}>
        <h1>Sign In</h1>
        {navStateData?.state?.msg && (
          <small
            style={{
              padding: "5px",
              textAlign: "center",
              color: "red",
              fontWeight: "bold",
            }}
          >
            {navStateData?.state?.msg}
          </small>
        )}

        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input
              placeholder="Enter your email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              placeholder="Enter your password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={authHandler}
            type="submit"
            name="signin"
            className={classes.signin_btn}
            disabled={loading.signin || loading.signup}
          >
            {loading.signin ? (
              <ClipLoader size={15} color="#111B21" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p>
          By signing up, you agree to the Amazon clone's{" "}
          <Link to="/terms">Terms of Use</Link> and{" "}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>

        <button
          onClick={authHandler}
          type="button"
          name="signup"
          className={classes.signup_btn}
          disabled={loading.signin || loading.signup}
        >
          {loading.signup ? (
            <ClipLoader size={15} color="#111B21" />
          ) : (
            "Sign Up"
          )}
        </button>

        {error && <small className={classes.error}>{error}</small>}
      </div>
    </section>
  );
}

export default Auth;
