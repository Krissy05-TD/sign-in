import React, { useRef, useState } from "react";
import { firestore } from "../firebase";
import { addDoc, collection } from "@firebase/firestore";
import "./new.css"; // Assuming you have the CSS in the same format

export default function CreatePassword() {
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const ref = collection(firestore, "passwords");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");

        const password = passwordRef.current.value.trim();
        const confirmPassword = confirmPasswordRef.current.value.trim();

        if (!password || !confirmPassword) {
            setError("* Both password fields are required!");
            return;
        }

        if (password !== confirmPassword) {
            setError("* Passwords do not match!");
            return;
        }

        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
        if (!passwordPattern.test(password)) {
            setError("* Password must meet the requirements!");
            return;
        }

        const data = { password };

        setLoading(true);
        try {
            await addDoc(ref, data);
            window.location.href = "login.php"; // Redirect after successful save
        } catch (e) {
            console.error(e);
            setError("An error occurred while saving the password!");
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (inputId) => {
        const input = document.getElementById(inputId);
        if (input.type === "password") {
            input.type = "text";
        } else {
            input.type = "password";
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <div className="left">
                <div>
                    <h1>
                        <img src="assets/logo.jpeg" alt="Four Leaf Clover" />
                        Project 1
                    </h1>
                </div>
            </div>

            <div className="right">
                <form className="signup-form" onSubmit={handleSave}>
                    <h1>Create a New Password</h1>
                    <div className="password-container">
                        <div className="new-password">
                            <label htmlFor="password">New Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter a New Password"
                                ref={passwordRef}
                            />
                            <img
                                id="togglePassword"
                                src="assets/closed.png"
                                alt="Show Password"
                                width="20px"
                                height="20px"
                                onClick={() => togglePasswordVisibility("password")}
                            />
                        </div>

                        <div className="confirm-password">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm-password"
                                placeholder="Confirm New Password"
                                ref={confirmPasswordRef}
                            />
                            <img
                                id="toggleConfirmPassword"
                                src="assets/closed.png"
                                alt="Show Password"
                                width="20px"
                                height="20px"
                                onClick={() => togglePasswordVisibility("confirm-password")}
                            />
                        </div>
                    </div>

                    <div className="requirements">
                        <p>Password must contain:</p>
                        <ul id="requirements-list">
                            <li id="characters" className="invalid">
                                At least 8 characters
                            </li>
                            <li id="number" className="invalid">At least 1 number</li>
                            <li id="uppercase" className="invalid">
                                Uppercase and Lowercase letters
                            </li>
                            <li id="special-char" className="invalid">
                                Special characters (~`! @#$%^&amp;*()-_+={}[]|\;:&quot;&lt;&gt;,./?)
                            </li>
                        </ul>
                    </div>

                    {error && <p className="error" style={{ color: "red" }}>{error}</p>}
                </form>
                <button type="submit" id="submit-btn" onClick={handleSave}>
                    Submit
                </button>

                {loading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Verifying OTP... Please wait.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
