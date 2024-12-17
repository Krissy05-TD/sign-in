const twilio = require("twilio");

const accountSid = "your_account_sid";
const authToken = "your_auth_token";
const client = new twilio(accountSid, authToken);

const sendOtpSms = async (phoneNumber, otp) => {
  try {
    await client.messages.create({
      body: `Your OTP code is: ${otp}`,
      from: "+1234567890", // Your Twilio phone number
      to: phoneNumber,
    });
    console.log("OTP sent via SMS.");
  } catch (error) {
    console.error("Error sending OTP via SMS:", error.message);
  }
};
