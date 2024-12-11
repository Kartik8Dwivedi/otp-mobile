require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();
app.use(bodyParser.json());

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } =
  process.env;
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const otps = {};

app.post("/send-otp", (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).send({ message: "Phone number is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
  otps[phone] = otp; // Store OTP for the phone number

  client.messages
    .create({
      body: `Your verification code is ${otp}`,
      from: TWILIO_PHONE_NUMBER,
      to: phone,
    })
    .then((message) => {
      res
        .status(200)
        .send({ message: "OTP sent successfully", sid: message.sid });
    })
    .catch((error) => {
      res
        .status(500)
        .send({ message: "Failed to send OTP", error: error.message });
    });
});

app.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res
      .status(400)
      .send({ message: "Phone number and OTP are required" });
  }

  if (otps[phone] && otps[phone].toString() === otp) {
    delete otps[phone]; // Invalidate OTP after verification
    res.status(200).send({ message: "OTP verified successfully" });
  } else {
    res.status(400).send({ message: "Invalid OTP" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
