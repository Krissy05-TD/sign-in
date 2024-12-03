const sendOtp = async () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  
    if (sendOtpNumberRef.current.checked) {
      if (!/^\d{10}$/.test(number)) {
        setStatus("Please provide a valid 10-digit phone number.");
        return;
      }
  
      try {
        const response = await axios.post("http://localhost:5000/send-otp-sms", {
          number: number,
          otp: generatedOtp,
        });
        if (response.data.success) {
          setStatus("OTP sent successfully via number.");
        } else {
          setStatus("Failed to send OTP via number.");
        }
      } catch (error) {
        console.error("Error sending OTP via number:", error.message);
        setStatus("Error sending OTP via number.");
      }
    } else if (sendOtpEmailRef.current.checked) {
      const email = emailRef.current.value;
      if (!/\S+@\S+\.\S+/.test(email)) {
        setStatus("Please provide a valid email.");
        return;
      }
  
      try {
        const response = await axios.post("http://localhost:5000/send-otp-email", {
          email: email,
          otp: generatedOtp,
        });
        if (response.data.success) {
          setStatus("OTP sent successfully via email.");
        } else {
          setStatus("Failed to send OTP via email.");
        }
      } catch (error) {
        console.error("Error sending OTP via email:", error.message);
        setStatus("Error sending OTP via email.");
      }
    } else {
      setStatus("Please select a method to send the OTP.");
    }
  };
  