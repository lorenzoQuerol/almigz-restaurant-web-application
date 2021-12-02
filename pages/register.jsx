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
        else if (contactNum.length != 11 || contactNum.substring(0,2) != "09")
            alert("Please input a valid contact number.")
        else if (altContactNum.length != 11 || altContactNum.substring(0,2) != "09")
            alert("Alternate contact number is invalid.")
        else{
            uploadToDb(userData);
        }
    }
    return (
        <div>
            <h1>Register</h1>
            <div class="form-control">
                <form onSubmit = {submitRegister}>
                    <label class="label">First Name</label>
                    <input class="input input-sm input-bordered"
                        type = "text" 
                        name = "fname"
                        value = {fname}
                        onChange = {(e)=> setFname(e.target.value)}
                    ></input>

                    <label class="label">Last Name</label>
                    <input class="input input-sm input-bordered" 
                        type = "text" 
                        name = "lname"
                        value = {lname}
                        onChange = {(e)=> setLname(e.target.value)}
                    ></input>

                    <label class="label">Email Address</label>
                    <input class="input input-sm input-bordered"
                        type = "email" 
                        name = "email"
                        value = {email}
                        onChange = {(e)=> setEmail(e.target.value)}
                    ></input>

                    <label class="label">Password</label>
                    <input class="input input-sm input-bordered"
                        type = "password" 
                        name = "password"
                        value = {password}
                        onChange = {(e)=> setPassword(e.target.value)}
                    ></input>

                    <label class="label">Confirm Password</label>
                    <input class="input input-sm input-bordered"
                        type = "password" 
                        name = "cpassword"
                        value = {cpassword}
                        onChange = {(e)=> setCpassword(e.target.value)}
                    ></input>

                    <label class="label">Home Address</label>
                    <input  class="input input-sm input-bordered" 
                        type = "text" 
                        name = "address"
                        value = {address}
                        onChange = {(e)=> setAddress(e.target.value)}
                    ></input>

                    <label class="label">Contact Number 1</label>
                    <input class="input input-sm input-bordered"
                        type = "tel" 
                        name = "num1"
                        value = {contactNum}
                        onChange = {(e)=> setNum1(e.target.value)}
                    ></input>

                    <label class="label">Contact Number 2</label>
                    <input  class="input input-sm input-bordered"
                        type = "tel"
                        name = "num2"
                        value = {altContactNum}
                        onChange = {(e)=> setNum2(e.target.value)}
                    ></input>

                    <button class="btn">Submit</button>
                </form>
            </div>
        </div>
    )
  }
