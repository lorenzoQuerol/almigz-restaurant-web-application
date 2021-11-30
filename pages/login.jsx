import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import styles from '../styles/Home.module.css'

// const state = {
//     email: '',
//     password:''
// };

// handleChange = event => {
//     this.setState({ [event.target.name]: event.target.value });
// }

// submitLogin = event => {
//     console.log(this.state);
// }

export default function Home() {
    return (
        <div>
            <h1>Login</h1>
            <div class="form-control">
                <form>
                    <label class="label">Email Address</label>
                    <input class="input input-bordered"
                        type = "email" 
                        name = "email"
                        // onChange = {this.handleChange}
                        // value = {email}
                        // onChange = {(e)=> setEmail(e.target.value)}
                    ></input>
                
                    <label class="label">Password</label>
                    <input class="input input-bordered"
                        type = "text" 
                        name = "password"
                        // onChange = {this.handleChange}
                        // value = {password}
                        // onChange = {(e)=> setPassword(e.target.value)}
                    ></input>
                    <button class="btn">Submit</button>
                </form>
            </div>
        </div>
    )
  }
