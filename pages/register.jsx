import { useState } from "react";
import { signIn } from "next-auth/react";
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

	const submitRegister = async (event) => {
		event.preventDefault(); // Prevent page from refreshing for errors in input

		// New user object
		var userData = {
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: password,
			homeAddress: homeAddress,
			contactNum: "+63" + contactNum,
			altContactNum: !!altContactNum ? "+63" + altContactNum : altContactNum,
			cart: {},
		};

		// Register user
		if (firstName && lastName && email && password && confirmPassword && homeAddress && contactNum) {
			if (contactNum == altContactNum) {
				setMessage("Please enter another mobile number for Contact Number 2.");
			} else if (password === confirmPassword) {
				const response = await registerUser(userData);
				// SUCCESS: Automatically sign in and redirect to homepage
				if (response.success) {
					await signIn("credentials", {
						email: email,
						password: password,
						callbackUrl: process.env.NEXTAUTH_URL,
					});
				} else setMessage(response.msg); // ERROR: Email exists in the system
			} else setMessage("Passwords do not match."); // ERROR: Passwords do not match
		} else setMessage("Please fill out all fields."); // ERROR: Empty Fields
	};

	// When rendering client side don't display anything until loading is complete
	if (typeof window !== "undefined") return null;

	return (
		<div className="flex-col w-1/2 text-center">
			<h1 className="p-8 text-5xl font-bold text-black font-rale">Sign Up</h1>
			<div className="p-10 border-t rounded-md shadow-xl border-t-gray-100">
				<form className="font-bold text-gray-800 font-rale font-lg" onSubmit={submitRegister}>
					<label className="label">First Name</label>
					<input
						className="w-full p-5 rounded-md input input-sm input-bordered focus:ring-2 focus:ring-blue-300"
						type="text"
						name="firstName"
						placeholder="First Name"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						required
					></input>

					<label className="mt-4 label">Last Name</label>
					<input
						className="w-full p-5 rounded-md input input-sm input-bordered focus:ring-2 focus:ring-blue-300"
						type="text"
						name="lastName"
						placeholder="Last Name"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						required
					></input>

					<label className="mt-4 label">Email Address</label>
					<input
						className="w-full p-5 rounded-md input input-sm input-bordered focus:ring-2 focus:ring-blue-300"
						type="email"
						name="email"
						placeholder="example@email.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					></input>

					<label className="mt-4 label">Password</label>
					<input
						className="w-full p-5 rounded-md input input-sm input-bordered focus:ring-2 focus:ring-blue-300"
						type="password"
						name="password"
						minLength="8"
						pattern="[^\s]{8,}"
						title="Password should have at least 8 characters and should not contain whitespace."
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					></input>

					<label className="mt-4 label">Confirm Password</label>
					<input
						className="w-full p-5 rounded-md input input-sm input-bordered focus:ring-2 focus:ring-blue-300"
						type="password"
						name="confirmPassword"
						placeholder="Confirm Password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					></input>

					<label className="mt-4 label">Home Address</label>
					<textarea
						className="w-full h-20 p-5 rounded-md input input-sm input-bordered focus:ring-2 focus:ring-blue-300"
						type="text"
						name="homeAddress"
						placeholder="Home Address"
						value={homeAddress}
						onChange={(e) => setAddress(e.target.value)}
						required
					></textarea>

					<label className="mt-4 label">Contact Number 1</label>
					<div className="flex items-center w-full pl-2 font-sans font-medium text-gray-600 rounded-md align-left">
						+63
						<input
							className="w-full p-5 pl-3 ml-2 font-sans tracking-wide rounded-md input input-sm input-bordered focus:ring-2 focus:ring-blue-300"
							type="tel"
							name="contactNum"
							maxLength="10"
							minLength="10"
							pattern="[0-9]{10}"
							title="Input should only contain 10 digits."
							placeholder="9XXXXXXXXX (Mobile Number)"
							value={contactNum}
							onChange={(e) => setContactNum(e.target.value)}
							required
						></input>
					</div>

					<label className="mt-4 label">Contact Number 2</label>
					<div className="flex items-center w-full pl-2 font-sans font-medium text-gray-600 rounded-md align-left">
						+63
						<input
							className="w-full p-5 pl-3 ml-2 font-sans tracking-wide rounded-md input input-sm input-bordered focus:ring-2 focus:ring-blue-300"
							type="tel"
							name="altContactNum"
							maxLength="10"
							minLength="10"
							pattern="[0-9]{10}"
							title="Input should only contain 10 digits."
							placeholder="9XXXXXXXXX (Mobile Number)"
							value={altContactNum}
							onChange={(e) => setAltContactNum(e.target.value)}
						></input>
					</div>
					<br />
					<div className="mt-4 font-sans font-normal text-left text-red-500">{message}</div>
					<button className="p-4 m-5 font-normal text-white bg-green-500 rounded-lg pl-7 pr-7 hover:font-medium hover:bg-green-300">Submit</button>
				</form>
			</div>
		</div>
	);
}
