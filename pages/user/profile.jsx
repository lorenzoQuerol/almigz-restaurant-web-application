import { useState, useEffect, useMemo } from "react";
import { getSession, signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import useAxios from "axios-hooks";

import Loading from "@components/Loading";
import DeleteDialog from "@components/DeleteDialog";
import toTitleCase from "@utils/toTitleCase";
import removeStorageValue from "@utils/localStorage/removeStorageValue";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function getServerSideProps(context) {
	const session = await getSession(context);

	if (!session)
		return {
			redirect: {
				permanent: false,
				destination: "/signin",
			},
		};

	return {
		props: session,
	};
}

export default function Profile(session) {
	const router = useRouter();
	const [{ data, loading, error }, refetch] = useAxios(`/api/users/${session.user.email}`);
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		watch,
		formState: { errors },
	} = useForm();

	const [user, setUser] = useState({});
	const [editable, setEditable] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		if (data) setUser(data.user);
		if (user) {
			setValue("firstName", user.firstName);
			setValue("lastName", user.lastName);
			setValue("password", "");
			setValue("confirmPassword", "");
			setValue("address", user.address);
			setValue("contact1", user.contact1?.slice(3));
			setValue("contact2", user.contact2?.slice(3));
		}
	}, [data, user]);

	const handleEditable = () => {
		setEditable(!editable);
	};

	const handleCancelEdit = () => {
		setValue("firstName", user.firstName);
		setValue("lastName", user.lastName);
		setValue("password", "");
		setValue("confirmPassword", "");
		setValue("address", user.address);
		setValue("contact1", user.contact1?.slice(3));
		setValue("contact2", user.contact2?.slice(3));

		handleEditable();
	};

	const handleEditProfile = async (edited) => {
		if (edited.password === edited.confirmPassword) {
			handleEditable();

			// Preprocess data
			edited.firstName = toTitleCase(edited.firstName);
			edited.lastName = toTitleCase(edited.lastName);
			if (edited.password == "") edited.password = user.password;
			delete edited.confirmPassword;
			edited.contact1 = `+63${edited.contact1}`;
			if (edited.contact2 !== "") edited.contact2 = `+63${edited.contact2}`;

			// Update and refetch data
			const response = await axios.put(`/api/users/${user.email}`, edited);
			if (response.status < 300) refetch();

			// Reset message
			setMessage("");
		} else {
			setMessage("Ensure both passwords are the same");
		}
	};

	const handleDeleteDialog = () => {
		setOpenDeleteDialog(!openDeleteDialog);
	};

	const handleDeleteAccount = async () => {
		handleDeleteDialog();

		// Remove any local storage related to session
		removeStorageValue("foodCart");
		removeStorageValue("transaction");

		// Delete account from database and redirect to landing page
		await axios.delete(`/api/users/${session.user.email}`);
		signOut({ redirect: true, callbackUrl: "/" });
	};

	const formatDate = (date) => {
		date = new Date(date).toLocaleString("en-US", {
			weekday: "short",
			day: "numeric",
			year: "numeric",
			month: "long",
			hour: "numeric",
			minute: "numeric",
		});
		const tempDate = new Date(date);

		// Get formatted date and time
		const formatDate = `${months[tempDate.getMonth()]} ${tempDate.getDate()}, ${tempDate.getFullYear()}`;
		const time = date.slice(23);

		// Return formatted date
		return `${formatDate}`;
	};

	return (
		<>
			<DeleteDialog openDeleteDialog={openDeleteDialog} handleDeleteDialog={handleDeleteDialog} handleDeleteAccount={handleDeleteAccount} />
			<div className="absolute w-full h-full text-gray-800 font-rale">
				{/* Page title starts */}
				<div className="container flex flex-col items-start justify-between px-6 pb-4 mx-auto my-6 border-b border-gray-300 lg:my-12 lg:flex-row lg:items-center">
					<div>
						<h4 className="text-2xl font-bold leading-tight text-gray-800">User Profile</h4>
						<ul className="flex flex-col items-start mt-3 text-sm text-gray-600 md:flex-row md:items-center">
							<li className="flex items-center mt-3 md:mt-0">
								<span className="mr-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="icon icon-tabler icon-tabler-plane-departure"
										width={16}
										height={16}
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										fill="none"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path stroke="none" d="M0 0h24v24H0z" />
										<path d="M15 12h5a2 2 0 0 1 0 4h-15l-3 -6h3l2 2h3l-2 -7h3z" transform="rotate(-15 12 12) translate(0 -1)" />
										<line x1={3} y1={21} x2={21} y2={21} />
									</svg>
								</span>
								<span>Joined on {formatDate(user.dateCreated)}</span>
							</li>
						</ul>
					</div>
					<div className="mt-6 space-x-3 lg:mt-0">
						{!editable && (
							<button
								onClick={handleEditable}
								className="px-8 py-2 text-sm text-white transition duration-150 ease-in-out bg-green-700 border rounded z-1 hover:bg-green-600 focus:outline-none"
							>
								Edit Profile
							</button>
						)}
						{editable && (
							<button
								type="submit"
								onClick={handleSubmit(handleEditProfile)}
								className="px-8 py-2 text-sm text-white transition duration-150 ease-in-out bg-green-700 border rounded hover:bg-green-600 focus:outline-none"
							>
								Done Editing
							</button>
						)}

						{editable && (
							<button
								onClick={handleCancelEdit}
								className="px-8 py-2 text-sm text-white transition duration-150 ease-in-out bg-yellow-700 border rounded hover:bg-yellow-600 focus:outline-none"
							>
								Cancel
							</button>
						)}
					</div>
				</div>

				{/* Page title ends */}
				<div className="container px-6 mx-auto">
					{loading ? (
						<Loading />
					) : (
						<div className="w-full h-64 border-gray-300 rounded">
							{editable ? (
								<form>
									<div className="grid grid-flow-row sm:grid-cols-2">
										{/* SECTION Editable */}
										{/* ANCHOR First Name */}
										<div className="flex flex-col mb-5 md:mr-16">
											<label className="mb-2 text-sm font-bold leading-tight tracking-normal text-gray-800">First Name</label>
											<input
												className="flex items-center w-full h-10 pl-3 text-sm font-normal text-gray-600 bg-white border border-gray-300 rounded shadow focus:outline-none focus:border-2 focus:border-green-700"
												placeholder="First Name"
												{...register("firstName", { required: true, maxLength: 80 })}
											/>
											{errors.firstName?.type === "required" && <div className="mt-1 text-sm font-medium text-left text-red-500">First name is required</div>}
											{errors.firstName?.type === "maxLength" && (
												<div className="mt-1 text-sm font-medium text-left text-red-500">First name must be less than 80 characters</div>
											)}
										</div>

										{/* ANCHOR Last Name */}
										<div className="flex flex-col mb-5 md:mr-16">
											<label className="mb-2 text-sm font-bold leading-tight tracking-normal text-gray-800">Last Name</label>
											<input
												className="flex items-center w-full h-10 pl-3 text-sm font-normal text-gray-600 bg-white border border-gray-300 rounded shadow focus:outline-none focus:border-2 focus:border-green-700"
												placeholder="Last Name"
												{...register("lastName", { required: true, maxLength: 100 })}
											/>
											{errors.lastName?.type === "required" && <div className="mt-1 text-sm font-medium text-left text-red-500">Last name is required</div>}
											{errors.lastName?.type === "maxLength" && (
												<div className="mt-1 text-sm font-medium text-left text-red-500">Last name must be less than 100 characters</div>
											)}
										</div>

										{/* ANCHOR Password */}
										<div className="flex flex-col mb-5 md:mr-16">
											<label className="mb-2 text-sm font-bold leading-tight tracking-normal text-gray-800">Password</label>
											<input
												className="flex items-center w-full h-10 pl-3 text-sm font-normal text-gray-600 bg-white border border-gray-300 rounded shadow focus:outline-none focus:border-2 focus:border-green-700"
												placeholder="Password"
												{...register("password", { required: false, minLength: 8, pattern: /^\S+$/i })}
											/>
											{errors.password?.type === "minLength" && (
												<div className="mt-1 text-sm font-medium text-left text-red-500">Password must be more than 8 characters</div>
											)}
											{errors.password?.type === "pattern" && (
												<div className="mt-1 text-sm font-medium text-left text-red-500">Password cannot contain whitespace</div>
											)}
										</div>

										{/* ANCHOR Confirm Password */}
										{watch("password") !== "" && (
											<div className="flex flex-col mb-5 md:mr-16">
												<label className="mb-2 text-sm font-bold leading-tight tracking-normal text-gray-800">Confirm Password</label>
												<input
													className="flex items-center w-full h-10 pl-3 text-sm font-normal text-gray-600 bg-white border border-gray-300 rounded shadow focus:outline-none focus:border-2 focus:border-green-700"
													placeholder="Confirm Password"
													{...register("confirmPassword")}
												/>
												{message && <div className="mt-1 text-xs font-medium text-left text-red-500">{message}</div>}
											</div>
										)}

										{/* ANCHOR Address */}
										<div className="flex flex-col mb-5 md:mr-16">
											<label className="mb-2 text-sm font-bold leading-tight tracking-normal text-gray-800">Address</label>
											<textarea
												className="flex items-center w-full h-10 pt-2 pl-3 text-sm font-normal text-gray-600 bg-white border border-gray-300 rounded shadow focus:outline-none focus:border-2 focus:border-green-700"
												placeholder="Address"
												{...register("address", { required: true, maxLength: 100 })}
											/>
											{errors.address?.type === "required" && <div className="mt-1 text-sm font-medium text-left text-red-500">Address is required</div>}
											{errors.address?.type === "maxLength" && (
												<div className="mt-1 text-sm font-medium text-left text-red-500">Address must be less than 100 characters</div>
											)}
										</div>

										{/* ANCHOR Contact Number 1 */}
										<div className="flex flex-col mb-5 md:mr-16">
											<label className="mb-2 text-sm font-bold leading-tight tracking-normal text-gray-800">Contact Number 1</label>

											<div className="flex items-center">
												+63
												<input
													className="flex items-center w-full h-10 pl-3 ml-1 text-sm font-normal text-gray-600 bg-white border border-gray-300 rounded shadow focus:outline-none focus:border-2 focus:border-green-700"
													placeholder="Contact Number 1"
													{...register("contact1", { required: true, minLength: 10, maxLength: 10, pattern: /^9/ })}
												/>
											</div>
											{errors.contact1?.type === "required" && (
												<div className="mt-1 text-sm font-medium text-left text-red-500">Contact number is required</div>
											)}
											{errors.contact1?.type === "maxLength" && (
												<div className="mt-1 text-sm font-medium text-left text-red-500">Contact number must be 10 digits</div>
											)}
											{errors.contact1?.type === "minLength" && (
												<div className="mt-1 text-sm font-medium text-left text-red-500">Contact number must be 10 digits</div>
											)}
											{errors.contact1?.type === "pattern" && (
												<div className="mt-1 text-sm font-medium text-left text-red-500">Contact number must start with 9</div>
											)}
										</div>

										{/* ANCHOR Contact Number 2 */}
										<div className="flex flex-col md:mr-16">
											<label className="mb-2 text-sm font-bold leading-tight tracking-normal text-gray-800">
												Contact Number 2 <a className="text-xs">(Optional)</a>
											</label>
											<div className="flex items-center">
												+63
												<input
													className="flex items-center w-full h-10 pl-3 ml-1 text-sm font-normal text-gray-600 bg-white border border-gray-300 rounded shadow focus:outline-none focus:border-2 focus:border-green-700"
													placeholder="Contact Number 2"
													{...register("contact2", { required: false, minLength: 10, maxLength: 10, pattern: /^9/ })}
												/>
											</div>
											{errors.contact2?.type === "maxLength" && (
												<div className="mt-1 text-sm font-medium text-left text-red-500">Contact number must be 10 digits</div>
											)}
											{errors.contact2?.type === "minLength" && (
												<div className="mt-1 text-sm font-medium text-left text-red-500">Contact number must be 10 digits</div>
											)}
											{errors.contact2?.type === "pattern" && (
												<div className="mt-1 text-sm font-medium text-left text-red-500">Contact number must start with 9</div>
											)}
										</div>
										{/* !SECTION Editable */}
										{editable && (
											<div className="flex flex-col mt-8 w-52 md:mr-16">
												<button
													type="button"
													onClick={handleDeleteDialog}
													className="px-8 py-2 text-sm text-white transition duration-150 ease-in-out bg-red-800 border rounded hover:bg-red-700 focus:outline-none"
												>
													Delete Account
												</button>
											</div>
										)}
									</div>
								</form>
							) : (
								<div className="grid grid-flow-row sm:grid-cols-2">
									{/* SECTION Not editable */}
									{/* ANCHOR First Name */}
									<div className="flex flex-col mb-5 md:mr-16">
										<label className="mb-2 text-sm font-bold leading-tight tracking-normal text-gray-800">First Name</label>
										<span>{user.firstName}</span>
									</div>

									{/* ANCHOR Last Name */}
									<div className="flex flex-col mb-5 md:mr-16">
										<label className="mb-2 text-sm font-bold leading-tight tracking-normal text-gray-800">Last Name</label>
										<span>{user.lastName}</span>
									</div>

									{/* ANCHOR Password */}
									<div className="flex flex-col mb-5 md:mr-16">
										<label className="mb-2 text-sm font-bold leading-tight tracking-normal text-gray-800">Password</label>
										<span>**************</span>
									</div>

									{/* ANCHOR Address */}
									<div className="flex flex-col mb-5 md:mr-16">
										<label className="mb-2 text-sm font-bold leading-tight tracking-normal text-gray-800">Address</label>
										<span>{user.address}</span>
									</div>

									{/* ANCHOR Contact Number 1 */}
									<div className="flex flex-col mb-5 md:mr-16">
										<label className="mb-2 text-sm font-bold leading-tight tracking-normal text-gray-800">Contact Number 1</label>
										<span>{user.contact1}</span>
									</div>

									{/* ANCHOR Contact Number 2 */}
									<div className="flex flex-col md:mr-16">
										<label className="mb-2 text-sm font-bold leading-tight tracking-normal text-gray-800">Contact Number 2</label>
										<span>{user.contact2}</span>
									</div>
									{/* !SECTION Not editable */}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	);
}
