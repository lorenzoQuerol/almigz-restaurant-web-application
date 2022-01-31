import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import useAxios from "axios-hooks";
import axios from "axios";

import removeStorageValue from "@utils/localStorage/removeStorageValue";
import DeleteDialog from "@components/DeleteDialog";
import Loading from "@components/Loading";
import toTitleCase from "@utils/toTitleCase";

const UserSettings = ({ session }) => {
	const router = useRouter();
	const [{ data, loading, error }, refetch] = useAxios({ url: `${process.env.NEXTAUTH_URL}/api/users/${session.user.email}` });

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: useMemo(() => {
			if (data) {
				return {
					firstName: data.user.firstName,
					lastName: data.user.lastName,
					password: "",
					confirmPassword: "",
					address: data.user.address,
					contact1: data.user.contact1.slice(3),
					contact2: data.user.contact2.slice(3),
				};
			}

			// return [
			// 	{ firstName: data.user.firstName },
			// 	{ lastName: data.user.lastName },
			// 	{ password: "" },
			// 	{ confirmPassword: "" },
			// 	{ address: data.user.address },
			// 	{ contact1: data.user.contact1.slice(3) },
			// 	{ contact2: data.user.contact2.slice(3) },
			// ];
		}, [data]),
	});

	// User
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [address, setAddress] = useState("");
	const [contact1, setContact1] = useState("");
	const [contact2, setContact2] = useState("");

	// Page elements
	const [editable, setEditable] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		if (data) {
			setFirstName(data.user.firstName);
			setLastName(data.user.lastName);
			setEmail(data.user.email);
			setAddress(data.user.address);
			setContact1(data.user.contact1);
			setContact2(data.user.contact2);
		}
	}, [data]);

	useEffect(() => {
		if (data) {
			reset({
				firstName: data.user.firstName,
				lastName: data.user.lastName,
				password: "",
				confirmPassword: "",
				address: data.user.address,
				contact1: data.user.contact1.slice(3),
				contact2: data.user.contact2.slice(3),
			});
		}
	}, [data]);

	const handleEditable = () => {
		setEditable(!editable);
	};

	const handleDeleteDialog = () => {
		setOpenDeleteDialog(!openDeleteDialog);
	};

	const resetEdit = () => {
		handleEditable();

		reset({
			firstName: data.user.firstName,
			lastName: data.user.lastName,
			password: "",
			confirmPassword: "",
			address: data.user.address,
			contact1: data.user.contact1.slice(3),
			contact2: data.user.contact2.slice(3),
		});

		setMessage("");
	};

	// ANCHOR Update account
	const updateAccount = async (form) => {
		if (form.password === form.confirmPassword) {
			handleEditable();

			// Preprocess data
			form.firstName = toTitleCase(form.firstName);
			form.lastName = toTitleCase(form.lastName);
			if (form.password === "") form.password = data.user.password;
			delete form.confirmPassword;
			form.contact1 = `+63${form.contact1}`;
			if (form.contact2 !== "") form.contact2 = `+63${form.contact2}`;

			// Update and refetch updated user
			await axios.put(`/api/users/${data.user.email}`, form);
			const response = await axios.get(`/api/users/${data.user.email}`);
			// setUser(response.data.user);

			// Refresh client-side
			if (response.status < 300) refetch();

			setMessage("");
		} else {
			setMessage("Please confirm password change");
		}
	};

	// ANCHOR Delete account
	const deleteAccount = async () => {
		handleDeleteDialog();

		// Remove any local storage related to session
		removeStorageValue("foodCart");
		removeStorageValue("transaction");

		// Delete account from database and redirect to landing page
		await axios.delete(`/api/users/${session.user.email}`);
		signOut({ redirect: true, callbackUrl: "/" });
	};

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<>
					<DeleteDialog openDeleteDialog={openDeleteDialog} handleOpenDeleteDialog={handleDeleteDialog} handleDeleteAccount={deleteAccount} />
					<div className="rounded-md bg-zinc-100 card drop-shadow-lg">
						<div className="text-sm md:text-lg card-body">
							<div className="font-bold ">Email: {email}</div>
							<div className="h-1 my-6 overflow-hidden bg-gray-300 rounded">
								<div className="w-24 h-full bg-green-700"></div>
							</div>

							{/* Not editable */}
							{!editable && (
								<>
									<div className="grid grid-flow-row lg:grid-cols-2 lg:grid-rows-4">
										<div>
											<a className="font-bold">First Name</a>: {firstName}
										</div>
										<div>
											<a className="font-bold">Last Name</a>: {lastName}
										</div>
										<div>
											<a className="font-bold">Password</a>: ******************
										</div>

										<div className="row-span-3">
											<a className="font-bold ">Home Address</a>: {address}
										</div>
										<div className="row-span-1">
											<a className="font-bold">Contact Number 1</a>: {contact1}
										</div>
										<div>
											<a className="font-bold">Contact Number 2</a>: {contact2}
										</div>
									</div>

									{/* Edit and delete buttons */}
									<div className="flex flex-col justify-between sm:flex-row md:justify-end card-actions">
										<button
											type="button"
											onClick={handleEditable}
											className="self-center px-3 py-2 mx-3 mt-2 text-sm font-semibold text-white transition-colors duration-200 ease-in-out bg-green-700 cursor-pointer hover:bg-green-600 rounded-xl"
										>
											Edit Details
										</button>
										<button
											type="button"
											onClick={handleDeleteDialog}
											className="self-center px-3 py-2 mx-3 mt-2 text-sm font-semibold text-white transition-colors duration-200 ease-in-out bg-red-700 cursor-pointer hover:bg-red-600 rounded-xl"
										>
											Delete Account
										</button>
									</div>
								</>
							)}

							{/* Is editable */}
							{editable && (
								<>
									<form onSubmit={handleSubmit(updateAccount)}>
										<div className="grid items-center gap-5 md:grid-flow-col md:grid-cols-2 md:grid-rows-4 form-control">
											<div>
												<a className="font-bold">First Name </a>
												<input
													type="text"
													placeholder="First Name"
													{...register("firstName", { required: true, maxLength: 80 })}
													className="w-full rounded-md input input-sm"
												/>
												{errors.firstName && <div className="mt-1 text-sm font-medium text-left text-red-500">First name is required</div>}
											</div>
											<div>
												<a className="font-bold">Last Name </a>
												<input
													type="text"
													placeholder="Last Name"
													{...register("lastName", { required: true, maxLength: 100 })}
													className="w-full rounded-md input input-sm"
												/>
												{errors.lastName && <div className="mt-1 text-sm font-medium text-left text-red-500">Last name is required</div>}
											</div>
											<div>
												<a className="font-bold ">Change Password </a>
												<input
													type="text"
													title="Password should have at least 8 characters and should not contain whitespace."
													placeholder="Password"
													{...register("password", { required: false, min: 8, pattern: /^\S+$/i })}
													className="w-full rounded-md input input-sm"
												/>
												{message && <div className="mt-1 text-xs font-medium text-left text-red-500">{message}</div>}
											</div>

											<div>
												<a className="font-bold">Confirm Password </a>
												<input
													type="text"
													title="Password should have at least 8 characters and should not contain whitespace."
													placeholder="Confirm Password"
													{...register("confirmPassword", { required: false, min: 8, pattern: /^\S+$/i })}
													className="w-full rounded-md input input-sm"
												/>
											</div>

											<div className="row-span-2 ">
												<a type="text" className="font-bold" required>
													Home Address
												</a>
												<br />
												<textarea
													type="text"
													placeholder="Home Address"
													{...register("address", { required: true, maxLength: 100 })}
													className="w-full rounded-md h-36 textarea"
												/>
												{errors.address && <div className="mt-1 text-sm font-medium text-left text-red-500">Email is required</div>}
											</div>
											<div className="row-span-1">
												<a className="font-bold">Contact Number 1 </a>
												<div className="flex font-semibold">
													+63
													<input
														type="tel"
														placeholder="9XXXXXXXXX (Mobile Number)"
														{...register("contact1", { required: true, minLength: 10, maxLength: 10, pattern: /^9/ })}
														className="w-full ml-3 rounded-md input input-sm"
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
											<div>
												<a className="font-bold">Contact Number 2 </a>
												<div className="flex font-semibold">
													+63
													<input
														type="tel"
														placeholder="9XXXXXXXXX (Mobile Number)"
														{...register("contact2", { required: false, minLength: 10, maxLength: 10, pattern: /^9/ })}
														className="w-full ml-3 rounded-md input input-sm"
													/>
												</div>
												{errors.contact1?.type === "pattern" && (
													<div className="mt-1 text-sm font-medium text-left text-red-500">Contact number must start with 9</div>
												)}
												{errors.contact1?.type === "maxLength" && (
													<div className="mt-1 text-sm font-medium text-left text-red-500">Contact number must be 10 digits</div>
												)}
												{errors.contact1?.type === "minLength" && (
													<div className="mt-1 text-sm font-medium text-left text-red-500">Contact number must be 10 digits</div>
												)}
											</div>
										</div>

										{/* Buttons */}
										<div className="flex flex-col justify-between sm:flex-row md:justify-end card-actions">
											<button
												type="button"
												onClick={resetEdit}
												className="flex self-center px-3 py-2 mx-3 mt-2 text-sm font-semibold text-white transition-colors duration-200 ease-in-out bg-yellow-700 cursor-pointer hover:bg-yellow-600 rounded-xl"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="self-center justify-center w-4 h-4 mr-1"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
												</svg>
												Cancel
											</button>
											<button
												type="submit"
												className="self-center px-3 py-2 mx-3 mt-2 text-sm font-semibold text-white transition-colors duration-200 ease-in-out bg-green-700 cursor-pointer hover:bg-green-600 rounded-xl"
											>
												Done Editing
											</button>
										</div>
									</form>
								</>
							)}
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default UserSettings;
