const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const generateOtp = require("generateOtp")

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Twilio credentials
const twilioClient = twilio("ACa16615287456e85f2dd665a618d5daef", "74d1a3a12ea00ed0e56ff9761008bd88");

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your preferred email service
  auth: {
    user: "krisdavids2005@gmail.com",
    pass: "T05unny>18",
  },
});

// Generate random OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const otp = generateOtp();
console.log("Generated OTP:", otp);

app.post("/send-otp", async (req, res) => {
  const { method, destination, otp } = req.body;

  try {
    if (method === "number") {
      // Send OTP via SMS
      await twilioClient.messages.create({
        body: `Your OTP is: ${otp}`,
        from: "+27747253625",
        to: destination,
      });
      res.json({ success: true, message: "OTP sent via phone number." });
    } else if (method === "email") {
      // Send OTP via Email
      await transporter.sendMail({
        from: '"Project 1" <krisdavids2005@gmail.com>',
        to: destination,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,
      });
      res.json({ success: true, message: "OTP sent via email." });
    } else {
      res.status(400).json({ success: false, message: "Invalid method." });
    }
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
