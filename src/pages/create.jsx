import React, { useRef } from 'react';
import { firestore } from "../firebase";
import { addDoc,collection } from '@firebase/firestore';
import './style/create.css'

export default function Create() {
    const messageRef = useRef();
    const ref = collection(firestore, "messages");

    const firstnameRef = useRef();
    const lastnameRef = useRef();
    const numberRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSave = async (e) => {
        e.preventDefault();
        console.log(messageRef.current.value);

        const data = {
            firstname: firstnameRef.current.value,
            lastname: lastnameRef.current.value,
            number: numberRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
          };

        try {
            addDoc(ref,data);
        }catch (e) {
            console.log(e);
        }
    };
    return (
        <div>
            <div className='create'>
                    <div className='left'>
                        <h1>
                        <img src='/logo.jpeg' alt='Four Leaf Clover'></img>
                        Project 1
                        </h1>
                    </div>
                    <div className='right'>
                    <form className='form-grid' onSubmit={handleSave}>
                        <div>
                            <label className='firstname'>First Name
                                <input 
                                type='text'
                                placeholder='Enter First Name'
                                ref={firstnameRef}
                                id='firstname'
                                required>
                                </input>
                            </label>
                        </div>
                        <div>
                            <label className='lastname'>Last Name
                                <input 
                                type='text'
                                placeholder='Enter Last Name'
                                ref={lastnameRef}
                                id='lastname'
                                required>
                                </input>
                            </label>
                        </div>
                        <div>
                            <label className='number'>Number
                                <input 
                                type='tel'
                                placeholder='012 345 6789'
                                ref={numberRef}
                                id='number'
                                required>
                                </input>
                            </label>
                        </div>
                        <div>
                            <label className='email'>Email
                                <input 
                                type='email'
                                placeholder='example@email.com'
                                ref={emailRef}
                                id='email'
                                required>
                                </input>
                            </label>
                        </div>
                        <div>
                            <label className='password'>Password
                                <input 
                                type='password'
                                placeholder='Enter your password'
                                ref={passwordRef}
                                id='password'
                                required>
                                </input>
                            </label>
                        </div>
                        <div>
                            <label className='confirm-password'>Confirm Password
                                <input 
                                type='password'
                                placeholder='Confirm your password'
                                ref={passwordRef}
                                id='confirm-password'
                                required>
                                </input>
                            </label>
                        </div>
                    </form>
                    <button type='button' id='button'>
                    Send Verification Code
                    </button>

                        <p>Already have an account?<a href='/login'>Login</a></p>
                    
                    </div>
            </div>
        </div>
    );
}