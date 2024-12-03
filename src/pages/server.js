const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "krisdavids2005@gmail.com",
    pass: "T05unny>18",
  },
});

// Twilio setup
const accountSid = "ACa16615287456e85f2dd665a618d5daef";
const authToken = "74d1a3a12ea00ed0e56ff9761008bd88";
const client = new twilio(accountSid, authToken);

app.post("/send-otp-email", async (req, res) => {
  const { email, otp } = req.body;

  const mailOptions = {
    from: "krisdavids2005@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "OTP sent successfully via email." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/send-otp-sms", async (req, res) => {
  const { number, otp } = req.body;

  try {
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: "+27747253625", // Replace with your Twilio number
      to: number,
    });
    res.status(200).json({ success: true, message: "OTP sent successfully via SMS." });
  } catch (error) {
    console.error("Error sending SMS:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
