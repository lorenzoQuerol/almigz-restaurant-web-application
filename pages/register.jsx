import { useState } from "react";
import registerUser from "@utils/registerUser";
import { useRouter } from "next/router";


export default function register() {
    const router = useRouter();
    // User information
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [homeAddress, setAddress] = useState("");
    const [contactNum, setContactNum] = useState("");
    const [altContactNum, setAltContactNum] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // API response message
    const [message, setMessage] = useState("");

    const submitRegister = (event) => {
        event.preventDefault();

        // Initialize user object
        var userData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            homeAddress: homeAddress,
            contactNum: contactNum,
            altContactNum: altContactNum,
            cart: {}
        };
        
        console.log(userData);

        if (firstName && lastName && email && password && confirmPassword && homeAddress && contactNum && altContactNum) {
            if (password === confirmPassword) {
                const response = registerUser(userData);
                if (response.success) {
                    console.log("success" + response);
                    setMessage(response.msg);
                    /*
                        TODO: Redirect to homepage, display in UI the message for successful registration
                        READ: NextJS useRouter methods
                    */
                    return router.push(process.env.NEXTAUTH_URL);
                } else {
                    console.log("fail" + response);
                    setMessage(response.msg);
                    /*
                        TODO: Display in UI error message
                        RECOMMEND: set states for errors, conditionally render
                    */
                }
            } 
            else {
                /*
                    TODO: Display in UI some error message
                    RECOMMEND: set states for errors, conditionally render
                */
                console.log("here fail");
                setMessage("Password does not match.");
            }
        } 
        else {
            setMessage("Please fill out all fields.");
        }
    };

    return (
        <div className="w-1/2 flex-col text-center">
            <h1 className="text-5xl font-rale text-black font-bold p-8">Sign Up</h1>
            <div className="rounded-md shadow-xl p-10 border-t border-t-gray-100">
                <form className="font-rale font-lg text-gray-800 font-bold" onSubmit={submitRegister}>
                    <label className="label">First Name</label>
                    <input
                        className="input p-5  input-sm input-bordered rounded-md w-full focus:ring-2 focus:ring-blue-300"
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    ></input>

                    <label className="label mt-4">Last Name</label>
                    <input
                        className="input p-5  input-sm input-bordered rounded-md w-full focus:ring-2 focus:ring-blue-300"
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    ></input>

                    <label className="label mt-4">Email Address</label>
                    <input
                        className="input p-5  input-sm input-bordered rounded-md w-full focus:ring-2 focus:ring-blue-300"
                        type="email"
                        name="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>

                    <label className="label mt-4">Password</label>
                    <input
                        className="input p-5  input-sm input-bordered rounded-md w-full focus:ring-2 focus:ring-blue-300"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>

                    <label className="label mt-4">Confirm Password</label>
                    <input
                        className="input p-5  input-sm input-bordered rounded-md w-full focus:ring-2 focus:ring-blue-300"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></input>

                    <label className="label mt-4">Home Address</label>
                    <textarea
                        className="input p-5 input-sm input-bordered rounded-md w-full h-20 focus:ring-2 focus:ring-blue-300"
                        type="text"
                        name="homeAddress"
                        placeholder="Home Address"
                        value={homeAddress}
                        onChange={(e) => setAddress(e.target.value)}
                    ></textarea>

                    <label className="label mt-4">Contact Number 1</label>
                    <input
                        className="input p-5 input-sm input-bordered rounded-md w-full focus:ring-2 focus:ring-blue-300"
                        type="tel"
                        name="contactNum"
                        placeholder="09XXXXXXXXX (Mobile Number)"
                        value={contactNum}
                        onChange={(e) => setContactNum(e.target.value)}
                    ></input>

                    <label className="label mt-4">Contact Number 2</label>
                    <input
                        className="input p-5 input-sm input-bordered rounded-md w-full focus:ring-2 focus:ring-blue-300"
                        type="tel"
                        name="altContactNum"
                        placeholder="Mobile or Telephone Number"
                        value={altContactNum}
                        onChange={(e) => setAltContactNum(e.target.value)}
                    ></input>
                    <br />
                    <div className="text-red-500 font-sans font-normal text-left mt-4">{message}</div>
                    <button className="font-normal text-white rounded-lg m-5 p-4 pl-7 pr-7 bg-green-500 hover:font-medium hover:bg-green-300">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
