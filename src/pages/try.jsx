import { BsFillShieldLockFill, BsTelephoneFill, BsEnvelopeFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../firebase";  // Ensure you import Firestore and auth correctly
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { collection, addDoc } from "firebase/firestore";  // Firestore import
import { sendSignInLinkToEmail } from "firebase/auth";

const App = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState("phone");  // Default to phone method
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);

  // Firebase: Save user to Firestore
  async function saveUserToFirestore(phone, email) {
    try {
      const docRef = await addDoc(collection("users"), {
        phoneNumber: phone,
        email: email,
        createdAt: new Date(),
      });
      console.log("User saved to Firestore with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function onSignup() {
    setLoading(true);
    onCaptchVerify();
    const appVerifier = window.recaptchaVerifier;

    if (method === "phone") {
      const formatPh = "+" + ph;

      // Save to Firestore before sending OTP
      saveUserToFirestore(formatPh, "");

      signInWithPhoneNumber(auth, formatPh, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setLoading(false);
          setShowOTP(true);
          toast.success("OTP sent successfully!");
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          toast.error("Error sending OTP. Please try again.");
        });
    } else if (method === "email") {
      // Save email to Firestore
      saveUserToFirestore("", email);

      const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // redirection must be in the authorized domains list in the Firebase Console.
        url: 'https://your-app.com/finishSignUp?cartId=1234',
        handleCodeInApp: true,
      };

      sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
          // Save the email locally to complete sign-up later
          window.localStorage.setItem("emailForSignIn", email);
          setLoading(false);
          setShowOTP(true);
          toast.success("OTP sent to your email!");
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          toast.error("Error sending OTP to email. Please try again.");
        });
    }
  }

  function onOTPVerify() {
    setLoading(true);
    if (method === "phone") {
      window.confirmationResult
        .confirm(otp)
        .then(async (res) => {
          console.log(res);
          setUser(res.user);
          setLoading(false);
          toast.success("OTP Verified! Welcome!");
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          toast.error("Invalid OTP. Please try again.");
        });
    } else if (method === "email") {
      const emailLink = window.localStorage.getItem("emailForSignIn");

      if (emailLink) {
        auth
          .signInWithEmailLink(emailLink, otp)
          .then((result) => {
            console.log(result);
            setUser(result.user);
            setLoading(false);
            toast.success("Email OTP Verified! Welcome!");
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
            toast.error("Invalid OTP. Please try again.");
          });
      }
    }
  }

  return (
    <section className="bg-emerald-500 flex items-center justify-center h-screen">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <h2 className="text-center text-white font-medium text-2xl">
            👍 Login Success
          </h2>
        ) : (
          <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
            <h1 className="text-center leading-normal text-white font-medium text-3xl mb-6">
              Welcome to <br /> CODE A PROGRAM
            </h1>
            <div className="flex gap-4 justify-center mb-6">
              <button
                className={`px-4 py-2 ${method === "phone" ? "bg-white text-emerald-500" : "bg-emerald-500 text-white"} rounded`}
                onClick={() => setMethod("phone")}
              >
                Phone OTP
              </button>
              <button
                className={`px-4 py-2 ${method === "email" ? "bg-white text-emerald-500" : "bg-emerald-500 text-white"} rounded`}
                onClick={() => setMethod("email")}
              >
                Email OTP
              </button>
            </div>
            {showOTP ? (
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  <BsFillShieldLockFill size={30} />
                </div>
                <label
                  htmlFor="otp"
                  className="font-bold text-xl text-white text-center"
                >
                  Enter your OTP
                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="opt-container"
                />
                <button
                  onClick={onOTPVerify}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  {method === "phone" ? <BsTelephoneFill size={30} /> : <BsEnvelopeFill size={30} />}
                </div>
                <label
                  htmlFor=""
                  className="font-bold text-xl text-white text-center"
                >
                  {method === "phone" ? "Verify your phone number" : "Enter your email"}
                </label>
                {method === "phone" ? (
                  <PhoneInput country={"za"} value={ph} onChange={setPh} />
                ) : (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded border-none"
                    placeholder="Enter your email"
                  />
                )}
                <button
                  onClick={onSignup}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>{method === "phone" ? "Send code via SMS" : "Send code via Email"}</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default App;
