const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.status(200).json({ message: "success!" });
});

// Payment initialization route
app.post("/payment/create", async (req, res) => {
  const { email, fName, lName, pNumber, amount } = req.body;
  const ref = "tx_" + uuidv4();

  if (Number(amount) > 0) {
    try {
      const chapaResponse = await axios.post(
        "https://api.chapa.co/v1/transaction/initialize",
        {
          amount: amount.toString(),
          currency: "ETB",
          email: email,
          first_name: fName,
          last_name: lName,
          phone_number: pNumber,
          tx_ref: ref,
          callback_url: `${process.env.BACKEND_URL}/payment/webhook`,
          return_url: `${process.env.FRONTEND_URL}/payment/success?tx_ref=${ref}`,
          "customization[title]": "Amazon Clone Payment",
          "customization[description]": "Thanks for shopping with us",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      res.status(200).json(chapaResponse.data);
    } catch (error) {
      console.error("Chapa error:", error.response?.data || error.message);
      res.status(500).json({ error: error.response?.data || error.message });
    }
  } else {
    res.status(403).json({ message: "Amount must be greater than 0" });
  }
});

// Webhook receiver route
app.post("/payment/webhook", (req, res) => {
  console.log("Webhook received:", req.body);
  res.sendStatus(200);
});

// verify payment route

app.get("/payment/verify/:txRef", async (req, res) => {
  const { txRef } = req.params;

  try {
    const chapaResponse = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${txRef}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    res.status(200).json(chapaResponse.data);
  } catch (err) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ error: "Failed to verify payment" });
  }
});

// Start server
app.listen(5000, (err) => {
  if (err) throw err;
  console.log("Server running on http://localhost:5000");
});
