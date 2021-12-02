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
        <div class="w-1/2 flex-col text-center">
            <h1 class="text-5xl font-rale text-black font-bold p-8">Login</h1>
            <div class="rounded-md shadow-xl border-t border-t-gray-100 p-10">
                <form class="font-rale font-lg text-gray-800 font-bold" onSubmit = {submitLogin}>
                    <label class="label">Email Address</label>
                    <input class="input p-5  input-sm input-bordered rounded-md w-full focus:ring-2 focus:ring-blue-300"
                        type = "email" 
                        name = "email"
                        placeholder = "Email Address"
                        value = {email}
                        onChange = {(e)=> setEmail(e.target.value)}
                    ></input>
                
                    <label class="label mt-4">Password</label>
                    <input class="input p-5  input-sm input-bordered rounded-md w-full focus:ring-2 focus:ring-blue-300"
                        type = "text" 
                        name = "password"
                        placeholder = "Password"
                        value = {password}
                        onChange = {(e)=> setPassword(e.target.value)}
                    ></input>
                    <button class="font-normal text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-green-500 hover:font-medium hover:bg-green-300">Submit</button>
                </form>
            </div>
        </div>
    )
  }
