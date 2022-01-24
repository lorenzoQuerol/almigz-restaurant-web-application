import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@utils/supabaseClient";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";

import axios from "axios";
import useSWR from "swr";

import DeleteDialog from "@components/DeleteDialog";
import toTitleCase from "@utils/toTitleCase";
import removeStorageValue from "@utils/localStorage/removeStorageValue";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export async function getServerSideProps({ req }) {
	const { user } = await supabase.auth.api.getUserByCookie(req);

	if (!user) return { props: {}, redirect: { destination: "/signin", permanent: false } };

	return {
		props: JSON.parse(JSON.stringify(user)),
	};
}

const Loading = () => {
	return (
		<div class="flex items-center justify-center h-full">
			<div class="w-10 h-10 border-4 border-t-transparent border-green-700 border-solid rounded-full animate-spin"></div>
		</div>
	);
};

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function account(user) {
	const router = useRouter();

	const [initialUser, setInitialUser] = useState({});
	const [profiles, setProfiles] = useState([]);
	// Page elements
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [currentTab, setCurrentTab] = useState("User Settings");
	const [isEditable, setIsEditable] = useState(false);
	const [openTransaction, setOpenTransaction] = useState(false);
	const navigationBar = [
		{ id: "1", name: "User Settings", current: true },
		{ id: "2", name: "Transactions", current: false },
	];

	// Editable user information
	// const [firstName, setFirstName] = useState(user.firstName);
	// const [lastName, setLastName] = useState(user.lastName);
	// const [password, setPassword] = useState("");
	// const [confirmPassword, setConfirmPassword] = useState("");
	// const [homeAddress, setAddress] = useState(user.homeAddress);
	// const [contactNum, setContactNum] = useState(user.contactNum.slice(3));
	// const [altContactNum, setAltContactNum] = useState(user.altContactNum.slice(3));

	// Transactions
	const [transactions, setTransactions] = useState(null);

	// Error message
	const [errorMessage, setErrorMessage] = useState("");

	// useEffect(() => {
	// 	setIsLoading(false);
	// }, [user]);

	useEffect(async () => {
		if (user) setInitialUser(user.user_metadata);
	}, [user]);

	// Refresh client-side
	const refreshData = () => {
		router.replace(router.asPath);
		setIsLoading(true);
	};

	// Handlers
	const handleCurrentTab = (name) => {
		setCurrentTab(name);
	};

	const handleIsEditable = () => {
		setIsEditable(!isEditable);
	};

	const handleOpenDeleteDialog = () => {
		setOpenDeleteDialog(!openDeleteDialog);
	};

	const handleOpenTransaction = () => {
		setOpenTransaction(!openTransaction);
	};

	// Delete user account
	const handleDeleteAccount = async () => {
		handleOpenDeleteDialog();

		// Delete account from database and redirect to landing page
		const response = await axios.delete(`/api/users/${user.id}`);
		console.log(response.data);

		// const { error } = await supabase.auth.signOut();
		// if (!error) router.replace("/");
	};

	// Reset all states if editing was cancelled
	const handleCancelEdit = () => {
		setFirstName(user.firstName);
		setLastName(user.lastName);
		setPassword("");
		setConfirmPassword("");
		setAddress(user.homeAddress);
		setContactNum(user.contactNum.slice(3));
		setAltContactNum(user.altContactNum.slice(3));

		handleIsEditable();
	};

	// Update account details
	const updateAccount = async (event) => {
		event.preventDefault();
		handleIsEditable();

		if (confirmPassword === password) {
			// Initialize object and preprocess data
			const tempUser = {
				firstName: toTitleCase(firstName),
				lastName: toTitleCase(lastName),
				password: password,
				homeAddress: homeAddress,
				contactNum: `+63${contactNum}`,
				altContactNum: altContactNum,
			};

			if (tempUser.password === "") tempUser.password = user.password;
			if (tempUser.altContactNum === "") tempUser.altContactNum = "";
			else tempUser.altContactNum = `+63${altContactNum}`;

			// Send user object
			const response = await axios.put(`/api/users/${user.email}`, tempUser);

			// Refresh client-side
			if (response.status < 300) refreshData();

			// Reset password states
			setPassword("");
			setConfirmPassword("");
		} else {
			setErrorMessage("Passwords do not match.");
		}
	};

	if (!user) return "Loading";

	// return null;
	return (
		<div className="flex flex-col justify-center mx-10 my-10 md:mx-36 xl:mx-72 font-rale text-slate-900">
			<DeleteDialog openDeleteDialog={openDeleteDialog} handleOpenDeleteDialog={handleOpenDeleteDialog} handleDeleteAccount={handleDeleteAccount} />
			<div className="flex flex-col justify-between mb-5 lg:flex-row">
				<div className="text-3xl font-bold text-green-700 lg:text-4xl">{currentTab}</div>
				<ul className="flex flex-row self-center mt-5 lg:mt-0">
					<li>
						{navigationBar.map((tab) => {
							tab.current = tab.name == currentTab ? true : false;
							return (
								<a
									onClick={(e) => {
										handleCurrentTab(tab.name);
									}}
									key={tab.id}
									className={
										tab.current
											? "self-center bg-green-700 px-3 py-2 mx-3 my-2 font-semibold text-white ease-in-out transition-colors duration-100 rounded-md cursor-pointer"
											: "self-center px-3 py-2 mx-3 my-2 hover:text-white transition-colors ease-in-out duration-200 hover:bg-green-700 rounded-md cursor-pointer"
									}
								>
									{tab.name}
								</a>
							);
						})}
					</li>
				</ul>
			</div>

			{/* User settings card */}
			{currentTab === "User Settings" && (
				<div className="rounded-md bg-zinc-100 card drop-shadow-lg">
					<div className="text-sm md:text-lg card-body">
						{isLoading === true ? (
							<Loading />
						) : (
							<>
								<div className="font-bold ">Email: {user.email}</div>
								<div className="h-1 my-6 overflow-hidden bg-gray-300 rounded">
									<div className="w-24 h-full bg-green-700"></div>
								</div>

								{/* Not editable */}
								{!isEditable && (
									<>
										<div className="grid grid-flow-row lg:grid-cols-2 lg:grid-rows-4">
											<div>
												<a className="font-bold">First Name</a>: {initialUser.first_name}
											</div>
											<div>
												<a className="font-bold">Last Name</a>: {initialUser.last_name}
											</div>
											<div>
												<a className="font-bold">Password</a>: ******************
											</div>

											<div className="row-span-3">
												<a className="font-bold ">Home Address</a>: {initialUser.address}
											</div>
											<div className="row-span-1">
												<a className="font-bold">Contact Number 1</a>: {initialUser.contact1}
											</div>
											<div>
												<a className="font-bold">Contact Number 2</a>: {initialUser.contact2}
											</div>
										</div>
										<div className="flex flex-col justify-between sm:flex-row md:justify-end card-actions">
											<button
												type="button"
												onClick={handleIsEditable}
												className="self-center px-3 py-2 mx-3 mt-2 text-sm font-semibold text-white transition-colors duration-200 ease-in-out bg-green-700 cursor-pointer hover:bg-green-600 rounded-xl"
											>
												Edit Details
											</button>
											<button
												type="button"
												onClick={handleOpenDeleteDialog}
												className="self-center px-3 py-2 mx-3 mt-2 text-sm font-semibold text-white transition-colors duration-200 ease-in-out bg-red-700 cursor-pointer hover:bg-red-600 rounded-xl"
											>
												Delete Account
											</button>
										</div>
									</>
								)}

								{/* Is editable */}
								{isEditable && (
									<>
										<form onSubmit={updateAccount}>
											<div className="grid items-center gap-5 md:grid-flow-col md:grid-cols-2 md:grid-rows-4 form-control">
												<div>
													<a className="font-bold">First Name: </a>
													<input
														type="text"
														onChange={(e) => setFirstName(e.target.value)}
														value={firstName}
														className="w-full rounded-md input input-sm"
														required
													/>
												</div>
												<div>
													<a className="font-bold">Last Name: </a>
													<input
														type="text"
														onChange={(e) => setLastName(e.target.value)}
														value={lastName}
														className="w-full rounded-md input input-sm"
														required
													/>
												</div>
												<div>
													<a className="font-bold ">Change Password: </a>
													<input
														type="text"
														onChange={(e) => setPassword(e.target.value)}
														placeholder="**********"
														className="w-full rounded-md input input-sm"
													/>
												</div>
												{password !== "" && (
													<div>
														<a className="font-bold">Confirm Password: </a>
														<input
															type="text"
															onChange={(e) => setConfirmPassword(e.target.value)}
															placeholder="**********"
															className="w-full rounded-md input input-sm"
														/>
													</div>
												)}

												<div className="row-span-2 ">
													<a type="text" className="font-bold" required>
														Home Address:
													</a>
													<br />
													<textarea
														onChange={(e) => setAddress(e.target.value)}
														className="w-full rounded-md h-36 textarea"
														value={homeAddress}
													></textarea>
												</div>
												<div className="row-span-1">
													<a className="font-bold">Contact Number 1: </a>
													<div className="flex font-semibold">
														+63
														<input
															onChange={(e) => setContactNum(e.target.value)}
															type="tel"
															name="altContactNum"
															maxLength="10"
															minLength="10"
															pattern="[0-9]{10}"
															title="Input should only contain 10 digits."
															value={contactNum}
															className="w-full ml-3 rounded-md input input-sm"
															required
														/>
													</div>
												</div>
												<div>
													<a className="font-bold">Contact Number 2: </a>
													<div className="flex font-semibold">
														+63
														<input
															onChange={(e) => setAltContactNum(e.target.value)}
															type="tel"
															name="altContactNum"
															maxLength="10"
															minLength="10"
															pattern="[0-9]{10}"
															title="Input should only contain 10 digits."
															value={altContactNum}
															className="w-full ml-3 rounded-md input input-sm"
														/>
													</div>
												</div>
											</div>

											{/* Buttons */}
											<div className="flex flex-col justify-between sm:flex-row md:justify-end card-actions">
												<button
													type="button"
													onClick={handleCancelEdit}
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
							</>
						)}
					</div>
				</div>
			)}

			{/* Transaction history card */}
			{currentTab === "Transactions" && (
				<div className="text-gray-500 rounded-md bg-zinc-100 card drop-shadow-lg">
					<div className="text-sm md:text-md card-body">
						<div className="w-full">
							{transactions.map((item) => {
								let date = new Date(item.dateCreated);
								let formattedDate = `${date.getMonth() + 1}/${date.getDay() + 1}/${date.getFullYear()} @ ${date.getHours()}:${date.getMinutes()}`;

								return (
									<Disclosure>
										{({ open }) => (
											<>
												<div className="flex justify-between p-2 rounded-md">
													<div className="flex">
														<Disclosure.Button className="mr-2">
															<ChevronUpIcon
																className={`rounded-md transition duration-200 ${
																	open ? "transform rotate-0" : "transform rotate-180"
																} w-10 h-10 text-green-700`}
															/>
														</Disclosure.Button>
														<div className="text-left">
															<div className="text-xl font-bold text-slate-900">Completed Order</div>
															<div>
																Ordered On: <a className="font-semibold text-slate-900">{formattedDate}</a>
															</div>
															<div className="flex">
																<div className="mr-1">Items:</div>
																{item.order.map((food, index) => {
																	if (item.order.length - 1 === index) {
																		return (
																			<div className="w-3/4 font-semibold truncate text-slate-900">
																				{food.quantity}x {food.menuItem.productName}
																			</div>
																		);
																	} else {
																		return (
																			<div className="w-3/4 ml-1 font-semibold truncate text-slate-900">
																				{food.quantity} x {food.menuItem.productName},
																			</div>
																		);
																	}
																})}
															</div>
														</div>
													</div>
													<div className="text-right">
														<div>
															Total Price: <a className="font-semibold text-slate-900">₱{item.totalPrice}</a>
														</div>
														<div>
															Method: <a className="font-semibold text-slate-900">{item.payMethod}</a>
														</div>
													</div>
												</div>
												<Disclosure.Panel>
													<div className="p-2 font-semibold bg-gray-300 rounded-b-lg text-slate-900">
														<div>{item.address}</div>
														<div>Order Summary:</div>
														{item.order.map((food) => {
															return (
																<div className="w-3/4 font-semibold truncate text-slate-900">
																	<a className="mr-10">{food.quantity}x</a> {food.menuItem.productName}
																</div>
															);
														})}
														<div className="w-1/3">
															<div className="flex justify-between text-right">
																<div className="text-left">Subtotal:</div>
																<div> {item.totalPrice}</div>
															</div>
															<div className="flex justify-between text-right">
																<div className="text-left">Delivery Fee:</div>
																<div> DEL_FEE</div>
															</div>
															<div className="flex justify-between text-right">
																<div className="text-left">Total:</div>
																<div> {item.totalPrice}</div>
															</div>
														</div>
													</div>
												</Disclosure.Panel>
											</>
										)}
									</Disclosure>
								);
							})}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
