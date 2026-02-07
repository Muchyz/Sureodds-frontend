require("dotenv").config();
const express = require("express");
const axios = require("axios");
const moment = require("moment");

const app = express();
app.use(express.json());

const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMER_SECRET;
const shortCode = process.env.SHORTCODE;
const passkey = process.env.PASSKEY;

// 1️⃣ Get Access Token
async function getAccessToken() {
  try {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const { data } = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    );
    return data.access_token;
  } catch (err) {
    console.error("Access Token Error:", err.response?.data || err.message);
    throw err;
  }
}

// 2️⃣ Generate STK Password
function generatePassword() {
  const timestamp = moment().format("YYYYMMDDHHmmss");
  const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");
  return { password, timestamp };
}

// 3️⃣ STK Push Endpoint
app.post("/stkpush", async (req, res) => {
  try {
    const { phone, amount } = req.body;

    // Only sandbox test numbers allowed
    if (!/^2547\d{8}$/.test(phone)) {
      return res.status(400).json({
        error: "Use sandbox test number format: 2547XXXXXXXX"
      });
    }

    const token = await getAccessToken();
    const { password, timestamp } = generatePassword();

    const stkRequest = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: shortCode,                    // sandbox shortcode
      PhoneNumber: phone,
      CallBackURL: "https://example.com/callback",
      AccountReference: "0040179069768",   // your real paybill account
      TransactionDesc: "Payment to Equity Paybill"
    };

    console.log("Sending STK push:", stkRequest);

    const { data } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkRequest,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("STK Push Response:", data);
    res.json(data);

  } catch (err) {
    console.error("STK Push Error:", err.response?.data || err.message);
    res.status(500).json(err.response?.data || err.message);
  }
});

// 4️⃣ Callback Endpoint
app.post("/callback", (req, res) => {
  console.log("STK Callback:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// 5️⃣ Start server
app.listen(3000, () => console.log("Server running on port 3000"));