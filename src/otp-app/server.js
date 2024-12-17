const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const accountSid = "your_twilio_account_sid"; // Twilio SID
const authToken = "your_twilio_auth_token";   // Twilio Auth Token
const twilioClient = twilio(accountSid, authToken);

let otpStore = {}; // Temporary storage for OTPs (use DB in production)

// Generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP via SMS
const sendOtpSms = async (phone, otp) => {
    await twilioClient.messages.create({
        body: `Your OTP is: ${otp}`,
        from: "+1234567890", // Replace with your Twilio phone number
        to: phone,
    });
};

// Send OTP via Email
const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "your_email@gmail.com",       // Replace with your email
            pass: "your_email_password",       // Replace with your email password
        },
    });

    const mailOptions = {
        from: "your_email@gmail.com",
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
};

// API to send OTP
app.post("/send-otp", async (req, res) => {
    const { method, destination } = req.body;
    const otp = generateOtp();

    try {
        if (method === "number") {
            await sendOtpSms(destination, otp);
        } else if (method === "email") {
            await sendOtpEmail(destination, otp);
        }

        otpStore[destination] = otp; // Save OTP temporarily
        res.status(200).send("OTP sent successfully.");
    } catch (error) {
        res.status(500).send("Failed to send OTP.");
    }
});

// API to verify OTP
app.post("/verify-otp", (req, res) => {
    const { destination, otp } = req.body;

    if (otpStore[destination] === otp) {
        delete otpStore[destination]; // Remove OTP after verification
        res.status(200).send("OTP verified successfully.");
    } else {
        res.status(400).send("Invalid OTP.");
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

