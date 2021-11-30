import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'
import loginRequest  from '@utils/login'
import {useState} from "react";

export default function Home() {  
    const [email           ,setEmail]          = useState(''); 
    const [password        ,setPassword]       = useState('');
    
    const submitLogin = (e) =>{
        e.preventDefault();
        var userInput = ({
            email:email,
            password:password
        })
        loginRequest(userInput);
    }
    return (
        <div>
            <h1>Login</h1>
            <div class="form-control">
                <form onSubmit = {submitLogin}>
                    <label class="label">Email Address</label>
                    <input class="input input-bordered"
                        type = "email" 
                        name = "email"
                        value = {email}
                        onChange = {(e)=> setEmail(e.target.value)}
                    ></input>
                
                    <label class="label">Password</label>
                    <input class="input input-bordered"
                        type = "text" 
                        name = "password"
                        value = {password}
                        onChange = {(e)=> setPassword(e.target.value)}
                    ></input>
                    <button class="btn">Submit</button>
                </form>
            </div>
        </div>
    )
  }
