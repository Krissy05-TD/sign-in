import React, { useRef } from "react";
import { firestore } from "../firebase";
import { addDoc,collection } from '@firebase/firestore';
import './style/home.css';

export default function Home() {
    const messageRef = useRef();
    const ref = collection(firestore, "messages");

    const homeRef = useRef();

    const handleSave = async (e) => {
        e.preventDefault();
        console.log(messageRef.current.value);

        const data = {
            home: homeRef.current.value,
        }

        try {
            addDoc(ref,data);
        }catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="Account">
            <h1 className="start" ref={homeRef}>Welcome</h1>
            <form className='form-grid' onSubmit={handleSave}>
            <button type="button" onClick={() => window.location.href="create"} id="button">Sign In</button>
            <button type="button" onClick={() => window.location.href="login"} id="button">Log In</button>
            </form>
        </div>
    )
}
