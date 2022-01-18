import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import registerUser from "@utils/registerUser";
import toTitleCase from "@utils/toTitleCase";

export default function register() {
	const router = useRouter();

	// Get session
	const { data: session, status } = useSession();

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

	useEffect(() => {
		if (status === "authenticated") router.replace("/");
	}, [session, status]);

	const submitRegister = async (event) => {
		event.preventDefault(); // Prevent page from refreshing for errors in input

		// New user object
		var userData = {
			firstName: toTitleCase(firstName),
			lastName: toTitleCase(lastName),
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

	// If page is stil in loading or authenticated (already signed in)
	if (status === "loading" || status === "authenticated") return <h1>Loading...</h1>;

	return (
		<div className="flex justify-center font-rale text-slate-900">
			<div className="flex-col w-full mx-6 my-16 text-center rounded-md sm:w-1/3 md:w-2/3 lg:w-1/2 xl:w-1/3 drop-shadow-lg bg-zinc-100">
				<div className="p-5">
					<h1 className="py-5 text-2xl font-extrabold text-green-700 sm:text-4xl">Create an Account</h1>
					<form className="font-bold font-rale font-lg" onSubmit={submitRegister}>
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
						<button className="inline-block w-full px-4 py-2 font-semibold text-white bg-green-700 rounded-xl hover:font-medium hover:bg-green-600">Register</button>
						<div className="mt-8 mb-2 font-sans text-sm font-medium text-center">
							Already have an account?{" "}
							<Link href="/auth/signIn">
								<a className="underline decoration-dotted underline-offset-2 hover:text-green-700">Login here!</a>
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
