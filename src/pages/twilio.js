const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Twilio credentials
const accountSid = "ACa16615287456e85f2dd665a618d5daef"; // Replace with your Account SID
const authToken = "74d1a3a12ea00ed0e56ff9761008bd88"; // Replace with your Auth Token
const client = twilio(accountSid, authToken);

// Endpoint to send SMS
app.post("/send-otp", async (req, res) => {
    const { phoneNumber, otp } = req.body;

    try {
        const message = await client.messages.create({
            body: `Your OTP is: ${otp}`,
            from: "+27747253625", // Your Twilio phone number
            to: phoneNumber,
        });

        res.status(200).json({ success: true, message: "OTP sent successfully!" });
    } catch (error) {
        console.error("Error sending OTP:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
