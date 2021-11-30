import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'

export default function Home() {
    return (
        <div>
            <h1>Register</h1>
            <div class="form-control">
                <form>
                    <label class="label">First Name</label>
                    <input class="input input-sm input-bordered"
                        type = "text" 
                        name = "fname"
                        // onChange = {this.handleChange}
                        // value = {fname}
                        // onChange = {(e)=> setFname(e.target.value)}
                    ></input>

                    <label class="label">Last Name</label>
                    <input class="input input-sm input-bordered" 
                        type = "text" 
                        name = "lname"
                        // onChange = {this.handleChange}
                        // value = {lname}
                        // onChange = {(e)=> setLname(e.target.value)}
                    ></input>

                    <label class="label">Email Address</label>
                    <input class="input input-sm input-bordered"
                        type = "email" 
                        name = "email"
                        // onChange = {this.handleChange}
                        // value = {email}
                        // onChange = {(e)=> setEmail(e.target.value)}
                    ></input>

                    <label class="label">Password</label>
                    <input class="input input-sm input-bordered"
                        type = "password" 
                        name = "password"
                        // onChange = {this.handleChange}
                        // value = {password}
                        // onChange = {(e)=> setPassword(e.target.value)}
                    ></input>

                    <label class="label">Confirm Password</label>
                    <input class="input input-sm input-bordered"
                        type = "password" 
                        name = "cpassword"
                        // onChange = {this.handleChange}
                        // value = {cpassword}
                        // onChange = {(e)=> setCpassword(e.target.value)}
                    ></input>

                    <label class="label">Home Address</label>
                    <input  class="input input-sm input-bordered" 
                        type = "text" 
                        name = "address"
                        // onChange = {this.handleChange}
                        // value = {address}
                        // onChange = {(e)=> setAddress(e.target.value)}
                    ></input>

                    <label class="label">Contact Number 1</label>
                    <input class="input input-sm input-bordered"
                        type = "tel" 
                        name = "num1"
                        // onChange = {this.handleChange}
                        // value = {num1}
                        // onChange = {(e)=> setNum2(e.target.value)}
                    ></input>

                    <label class="label">Contact Number 2</label>
                    <input  class="input input-sm input-bordered"
                        type = "tel"
                        name = "num2"
                        // onChange = {this.handleChange} 
                        // value = {num2}
                        // onChange = {(e)=> setNum2(e.target.value)}
                    ></input>

                    <button class="btn">Submit</button>
                </form>
            </div>
        </div>
    )
  }
