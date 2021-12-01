import { useState } from "react";
import registerUser from "@utils/registerUser";

export default function register() {
    // User information
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
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
            homeAddress: address,
            contactNum: contactNum,
            altContactNum: altContactNum,
        };

        if (password === confirmPassword) {
            const response = registerUser(userData);
            if (response.success) {
                setMessage(response.msg);
                /*
                    TODO: Redirect to homepage, display in UI the message for successful registration
                    READ: NextJS useRouter methods
                */
            } else {
                setMessage(response.msg);
                /*
                    TODO: Display in UI error message
                    RECOMMEND: set states for errors, conditionally render
                */
            }
        } else {
            /*
                TODO: Display in UI some error message
                RECOMMEND: set states for errors, conditionally render
            */
            alert("Password does not match.");
        }
    };

    return (
        <>
            <h1>Register</h1>
            <div className="form-control">
                <form onSubmit={submitRegister}>
                    <label className="label">First Name</label>
                    <input
                        className="input input-sm input-bordered"
                        type="text"
                        name="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    ></input>

                    <label className="label">Last Name</label>
                    <input
                        className="input input-sm input-bordered"
                        type="text"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    ></input>

                    <label className="label">Email Address</label>
                    <input
                        className="input input-sm input-bordered"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>

                    <label className="label">Password</label>
                    <input
                        className="input input-sm input-bordered"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>

                    <label className="label">Confirm Password</label>
                    <input
                        className="input input-sm input-bordered"
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></input>

                    <label className="label">Home Address</label>
                    <input
                        className="input input-sm input-bordered"
                        type="text"
                        name="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    ></input>

                    <label className="label">Contact Number 1</label>
                    <input
                        className="input input-sm input-bordered"
                        type="tel"
                        name="contactNum"
                        value={contactNum}
                        onChange={(e) => setContactNum(e.target.value)}
                    ></input>

                    <label className="label">Alternate Contact Number</label>
                    <input
                        className="input input-sm input-bordered"
                        type="tel"
                        name="altContactNum"
                        value={altContactNum}
                        onChange={(e) => setAltContactNum(e.target.value)}
                    ></input>

                    <button className="btn">Submit</button>
                </form>
            </div>
        </>
    );
}
