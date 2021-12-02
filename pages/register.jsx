import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'
import {useState} from "react";
import uploadToDb from "@utils/register"

export default function Home() {                
    const [fname           ,setFname]           = useState('');    
    const [lname           ,setLname]           = useState('');     
    const [email           ,setEmail]           = useState(''); 
    const [password        ,setPassword]        = useState('');     
    const [address         ,setAddress]         = useState('');     
    const [contactNum      ,setNum1]            = useState('');     
    const [altContactNum   ,setNum2]            = useState('');
    const [cpassword       ,setCpassword]       = useState('');
    
    const submitRegister = (e) =>{
        e.preventDefault();
        var userData = ({
            firstName:fname,
            lastName:lname,
            email:email,
            password:password, 
            homeAddress:address,
            contactNum:contactNum,
            altContactNum:altContactNum 
        });
        if(password != cpassword)
            alert("Password does not match");
        else{
            uploadToDb(userData);
        }
    }
    return (
        <div class="w-1/2 flex-col text-center">
            <h1 class="text-5xl font-rale text-black font-bold p-8">Sign Up</h1>
            <div class="rounded-md shadow-xl p-10 border-t border-t-gray-100">
                <form class="font-rale font-lg text-gray-800 font-bold" onSubmit = {submitRegister}>
                    <label class="label">First Name</label>
                    <input class="input p-5  input-sm input-bordered rounded-md w-full focus:ring-2 focus:ring-blue-300"
                        type = "text" 
                        name = "fname"
                        placeholder = "First Name"
                        value = {fname}
                        onChange = {(e)=> setFname(e.target.value)}
                    ></input>

                    <label class="label mt-4">Last Name</label>
                    <input class="input p-5  input-sm input-bordered rounded-md w-full focus:ring-2 focus:ring-blue-300" 
                        type = "text" 
                        name = "lname"
                        placeholder = "Last Name"
                        value = {lname}
                        onChange = {(e)=> setLname(e.target.value)}
                    ></input>

                    <label class="label mt-4">Email Address</label>
                    <input class="input p-5  input-sm input-bordered rounded-md w-full focus:ring-2 focus:ring-blue-300"
                        type = "email" 
                        name = "email"
                        placeholder = "example@email.com"
                        value = {email}
                        onChange = {(e)=> setEmail(e.target.value)}
                    ></input>

                    <label class="label mt-4">Password</label>
                    <input class="input p-5  input-sm input-bordered rounded-md w-full focus:ring-2 focus:ring-blue-300"
                        type = "password" 
                        name = "password"
                        placeholder = "Password"
                        value = {password}
                        onChange = {(e)=> setPassword(e.target.value)}
                    ></input>

                    <label class="label mt-4">Confirm Password</label>
                    <input class="input p-5  input-sm input-bordered rounded-md w-full focus:ring-2 focus:ring-blue-300"
                        type = "password" 
                        name = "cpassword"
                        placeholder = "Confirm Password"
                        value = {cpassword}
                        onChange = {(e)=> setCpassword(e.target.value)}
                    ></input>

                    <label class="label mt-4">Home Address</label>
                    <textarea  class="input p-5 input-sm input-bordered rounded-md w-full h-20 focus:ring-2 focus:ring-blue-300" 
                        type = "text" 
                        name = "address"
                        placeholder = "Home Address"
                        value = {address}
                        onChange = {(e)=> setAddress(e.target.value)}
                    ></textarea>

                    <label class="label mt-4">Contact Number 1</label>
                    <input class="input p-5 input-sm input-bordered rounded-md w-full focus:ring-2 focus:ring-blue-300"
                        type = "tel" 
                        name = "num1"
                        placeholder = "09XXXXXXXXX (Mobile Number)"
                        value = {contactNum}
                        onChange = {(e)=> setNum1(e.target.value)}
                    ></input>

                    <label class="label mt-4">Contact Number 2</label>
                    <input  class="input p-5 input-sm input-bordered rounded-md w-full focus:ring-2 focus:ring-blue-300"
                        type = "tel"
                        name = "num2"
                        placeholder = "Mobile or Telephone Number"
                        value = {altContactNum}
                        onChange = {(e)=> setNum2(e.target.value)}
                    ></input>
                    <br/>
                    <button class="font-normal text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-green-500 hover:font-medium hover:bg-green-300">Submit</button>
                </form>
            </div>
        </div>
    )
  }
