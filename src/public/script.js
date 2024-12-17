const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const result = document.getElementById("result");

sendOtpBtn.addEventListener("click", async () => {
    const method = document.querySelector('input[name="method"]:checked').value;
    const destination = document.getElementById("destination").value;

    try {
        const response = await fetch("http://localhost:5000/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ method, destination }),
        });

        if (response.ok) {
            result.textContent = "OTP sent successfully.";
        } else {
            result.textContent = "Failed to send OTP.";
        }
    } catch (error) {
        result.textContent = "Error sending OTP.";
    }
});

verifyOtpBtn.addEventListener("click", async () => {
    const destination = document.getElementById("destination").value;
    const otp = document.getElementById("otp").value;

    try {
        const response = await fetch("http://localhost:5000/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ destination, otp }),
        });

        if (response.ok) {
            result.textContent = "OTP verified successfully.";
        } else {
            result.textContent = "Invalid OTP.";
        }
    } catch (error) {
        result.textContent = "Error verifying OTP.";
    }
});
