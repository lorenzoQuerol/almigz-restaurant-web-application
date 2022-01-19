import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Transition } from "@headlessui/react";
import Image from "next/image";

import getStorageValue from "@utils/localStorage/getStorageValue";
import confirmTransaction from "@utils/confirmTransaction";
import useLocalStorage from "@utils/localStorage/useLocalStorage";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CheckoutPage() {
	const router = useRouter();

	// Get Session
	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			router.replace("/auth/signIn");
		},
	});

	// Page elements
	const [currentStep, setCurrentStep] = useState(1);
	const [forward, setForward] = useState(true);
	const [dateToday, setDateToday] = useState(() => {
		const date = new Date().toISOString().slice(0, -8);
		return date;
	});
	const [delFee, setDelFee] = useState(50);
	const [subTotal, setSubtotal] = useState(0);
	const [chooseDeliveryTime, setChooseDeliveryTime] = useState(false);
	const [choosePickupTime, setChoosePickupTime] = useState(false);
	const [chooseAddress, setChooseAddress] = useState(false);

	const steps = ["Review Cart", "Additional Details", "Review Order"];

	// User
	const [user, setUser] = useState(null);

	// Additional details
	const [type, setType] = useState("Delivery");
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [contactNum, setContactNum] = useState([]);
	const [order, setOrder] = useState([]);
	const [specialInstructions, setSpecialInstructions] = useState("");
	const [totalPrice, setTotalPrice] = useState(0);

	// Delivery details
	const [address, setAddress] = useState("");
	const [payMethod, setPayMethod] = useState("COD");
	const [change, setChange] = useState(0);
	const [deliveryFee, setDeliveryFee] = useState(50);
	const [deliverTime, setDeliverTime] = useState(() => {
		const date = new Date().toISOString().slice(0, -8);
		return date;
	});

	// Pickup details
	const [storeLocation, setStoreLocation] = useState("Branch 1");
	const [pickupTime, setPickupTime] = useState("Now");

	// Transaction
	const [transaction, setTransaction] = useLocalStorage("transaction", null);

	// Get user data
	const { data, error } = useSWR(`/api/users/${email}`, fetcher);

	// Get cart from local storage
	const cart = getStorageValue("foodCart");

	useEffect(() => {
		if (session) setEmail(session.user.email);

		if (data) setUser(data.data);
		if (cart) {
			setOrder(cart.data);
			setSubtotal(cart.total);
			setTotalPrice(cart.total + delFee);
		}
		if (user) {
			setFullName(`${user.firstName} ${user.lastName}`);
			setEmail(user.email);
			setContactNum([user.contactNum, user.altContactNum]);
			setAddress(user.homeAddress);
		}
	}, [session, status, email, data, user]);

	// Delete item and update prices
	const deleteItem = (name) => {
		const index = order.findIndex((product) => product.menuItem.productName === name);
		order.splice(index, 1); // Delete item

		let temp = 0;
		order.forEach((product) => {
			temp += product.quantity * product.menuItem.productPrice;
		});

		setSubtotal(temp);
		setTotalPrice(temp + delFee);
		localStorage.setItem("foodCart", JSON.stringify(order));
	};

	// Update quantity of item and update prices
	const updateTotal = async (value, name) => {
		const index = order.findIndex((product) => product.menuItem.productName === name);
		order[index].quantity = value; // Update quantity

		let temp = 0;
		order.forEach((product) => {
			temp += product.quantity * product.menuItem.productPrice;
		});

		setSubtotal(temp);
		setTotalPrice(temp + delFee);
		localStorage.setItem("foodCart", JSON.stringify(order));
	};

	// Handle submit transaction
	const submitTransaction = async () => {
		// Initialize transaction object
		const transaction = {
			dateCreated: new Date(),
			orderStatus: 0, // Initial "incoming order" status
			type: type,
			fullName: fullName,
			email: email,
			contactNum: contactNum,
			order: order,
			specialInstructions: specialInstructions,
			totalPrice: totalPrice,
			address: address,
			payMethod: payMethod,
			change: change,
			deliverTime: deliverTime,
			storeLocation: storeLocation,
			pickupTime: pickupTime,
		};

		// Send transaction object
		const response = await confirmTransaction(transaction);

		// If successful, set transaction to local storage and redirect to receipt page
		if (response.success) {
			setTransaction(response.data);
			router.replace("/receipt");
		} else {
			// DESIGNER TODO: Handle here if unsuccessful checkout (i.e., missing values).
		}
	};

	const handleDeliveryType = (event) => {
		setType(event.target.value);
		if (type === "Delivery") setTotalPrice(subTotal + delFee);
		if (type === "Pickup") setTotalPrice(subTotal);
	};

	const handlePayMethod = (event) => {
		setPayMethod(event.target.value);
	};

	const handleDeliverTime = (event) => {
		setDeliverTime(event.target.value);
	};

	const handlePickupTime = (event) => {
		setPickupTime(event.target.value);
	};

	const formatDate = (date) => {
		date = new Date(date).toLocaleString("en-US", {
			weekday: "short", // long, short, narrow
			day: "numeric", // numeric, 2-digit
			year: "numeric", // numeric, 2-digit
			month: "long", // numeric, 2-digit, long, short, narrow
			hour: "numeric", // numeric, 2-digit
			minute: "numeric", // numeric, 2-digit
		});
		const tempDate = new Date(date);

		// Get formatted date and time
		const formatDate = `${months[tempDate.getMonth()]} ${tempDate.getDay()}, ${tempDate.getFullYear()}`;
		const time = date.slice(23);

		// Return formatted date
		return `${formatDate} @ ${time}`;
	};

	const handleRefreshTotal = () => {
		if (type === "Delivery") setTotalPrice(subTotal + delFee);
		if (type === "Pickup") setTotalPrice(subTotal);
	};

	const handleAnimation = (event) => {
		if (event.target.id === "prev") {
			setCurrentStep(currentStep - 1);
			setForward(false);
		}
		if (event.target.id === "next") {
			setCurrentStep(currentStep + 1);
			setForward(true);
		}
	};

	if (status === "loading") return <h1>Loading...</h1>;

	return (
		<div className="flex justify-center">
			<div className="relative w-full mx-5 my-10 sm:mx-0 sm:w-3/4 xl:w-1/2 font-rale text-slate-900">
				<div className="flex flex-col text-green-700 sm:justify-between sm:flex-row">
					<div className="mb-5 text-5xl font-extrabold ">Checkout</div>
					<div className="text-xl font-bold sm:self-center">{steps[currentStep - 1]}</div>
				</div>

				{/* Review cart */}
				<Transition
					show={currentStep === 1 ? true : false}
					enter="delay-700 transform transition ease-out duration-500"
					enterFrom={`opacity-0 ${forward ? "translate-x-full" : "-translate-x-full"}`}
					enterTo="translate-x-0 opacity-100"
					leave="transform transition ease-in duration-500 sm:duration-700"
					leaveFrom="translate-x-0 opacity-100"
					leaveTo={`opacity-0 ${forward ? "-translate-x-full" : "translate-x-full"}`}
				>
					<div className="absolute w-full mt-5 rounded-md card bg-zinc-100 drop-shadow-lg">
						<div className="card-body">
							{/* Cart details */}
							{order && (
								<div className="mb-5 divide-y">
									{order.map((product) => {
										return (
											<li key={product.id} className="flex py-3 sm:flex-row">
												{/* Image */}
												<div className="flex-shrink-0 w-16 h-16 overflow-hidden border border-gray-200 rounded-md ">
													<div className="object-cover object-center w-full h-full">
														<Image src={product.menuItem.productImagesCollection.items[0].url} height={100} width={100} />
													</div>
												</div>

												{/* Food item details */}
												<div className="flex-col flex-1 w-1/4 ml-4 text-sm sm:flex sm:text-md">
													<div>
														<div className="flex justify-between font-medium">
															<p className="font-bold">{product.menuItem.productName}</p>
														</div>
														<p className="font-medium">₱ {product.menuItem.productPrice}</p>
													</div>
													<div className="flex items-end justify-between flex-1">
														<div className="flex">
															<button
																name={product.menuItem.productName}
																type="button"
																className="font-bold text-green-700 transition-colors duration-200 hover:text-green-600"
																onClick={(e) => deleteItem(e.target.name)}
															>
																Remove
															</button>
														</div>
													</div>
												</div>

												{/* Quantity */}
												<div className="flex self-center ml-4 sm:flex-1">
													<input
														className="pr-2 border rounded-md input font-black-100 text-normal w-14 input-sm input-bordered focus:ring focus:outline-none focus:ring-green-700"
														type="number"
														min="1"
														step="1"
														max="9999"
														name={product.menuItem.productName}
														value={product.quantity}
														placeholder={product.quantity}
														onLoad={(e) => setTotalPrice(product.quantity)}
														onChange={(e) => updateTotal(e.target.value, e.target.name)}
													/>
												</div>
												{/* Total price */}
												<p className="self-center hidden w-20 font-bold sm:flex text-end">
													<p className="ml-4 mr-5 font-bold ">₱ {product.menuItem.productPrice * product.quantity}</p>
												</p>
											</li>
										);
									})}
								</div>
							)}

							{/* Step button */}
							<button
								id="next"
								onClick={(e) => handleAnimation(e)}
								className="p-2 font-semibold text-white transition-colors duration-200 bg-green-700 rounded-md hover:bg-green-600"
							>
								Next
							</button>
						</div>
					</div>
				</Transition>

				{/* Additional details */}
				<Transition
					show={currentStep === 2 ? true : false}
					enter="delay-700 transform transition ease-out duration-500"
					enterFrom={`opacity-0 ${forward ? "translate-x-full" : "-translate-x-full"}`}
					enterTo="translate-x-0 opacity-100"
					leave="transform transition ease-in duration-500"
					leaveFrom="translate-x-0 opacity-100"
					leaveTo={`opacity-0 ${forward ? "-translate-x-full" : "translate-x-full"}`}
				>
					<div className="absolute w-full mt-5 rounded-md text-md sm:text-lg card bg-zinc-100 drop-shadow-lg">
						<div className="card-body">
							{/* Delivery or pickup radio buttons */}
							<div className="flex mb-5 space-x-4 cursor-pointer">
								<div className="flex">
									<input
										type="radio"
										name="Delivery"
										checked={`${type === "Delivery" ? "checked" : ""}`}
										className="self-center mr-2 radio radio-xs radio-accent"
										onClick={(e) => handleDeliveryType(e)}
										value="Delivery"
									/>
									<span className={`${type === "Delivery" ? "text-green-700 font-semibold" : ""}`}>Delivery</span>
								</div>
								<div className="flex">
									<input
										type="radio"
										name="Pickup"
										checked={`${type === "Pickup" ? "checked" : ""}`}
										className="self-center mr-2 radio-xs radio radio-accent"
										onClick={(e) => handleDeliveryType(e)}
										value="Pickup"
									/>
									<span className={`${type === "Pickup" ? "text-green-700 font-semibold" : ""}`}>Pickup</span>
								</div>
							</div>

							{/* Delivery */}
							{type === "Delivery" && user && (
								<div className="font-medium">
									{/* Basic details for mobile */}
									<div className="pb-4 mb-5 border-b-2 sm:hidden">
										<div>
											<div className="font-bold">Full Name: </div>
											<div>{`${user.firstName} ${user.lastName}`}</div>
											<div className="font-bold">Email Address: </div>
											<div>{user.email}</div>
											<div className="font-bold">Contact Information:</div>
											<div>
												{user.contactNum} {user.altContactNum !== "" ? `, ${user.altContactNum}` : ""}
											</div>
											<div className="font-bold">Address: </div>
											<div>{user.homeAddress}</div>
										</div>
									</div>

									{/* Basic details for desktop/tablet */}
									<div className="hidden grid-cols-2 grid-rows-1 pb-4 mb-5 border-b-2 sm:grid">
										<div className="font-bold">
											<div>Full Name:</div>
											<div>Email Address:</div>
											<div>Contact Information:</div>
											<div>Address:</div>
											{/* Use home address */}
											<div className="flex">
												<input
													type="radio"
													name="Use Home Address"
													checked={`${chooseAddress ? "" : "checked"}`}
													className="self-center mr-2 radio radio-xs radio-accent"
													onClick={(e) => {
														setChooseAddress(false);
														setAddress(user.homeAddress);
													}}
													value="Use Home Address"
												/>
												<span className={`${chooseAddress ? "" : "text-green-700 font-semibold"}`}>Use Home Address</span>
											</div>

											{/* Use different address */}
											<div className="flex">
												<input
													type="radio"
													name="Use Different Address"
													checked={`${chooseAddress ? "checked" : ""}`}
													className="self-center mr-2 radio radio-xs radio-accent"
													onClick={(e) => setChooseAddress(true)}
													value="Use Different Address"
												/>
												<span className={`${chooseAddress ? "text-green-700 font-semibold" : ""}`}>Use Different Address</span>
											</div>
											{chooseAddress && (
												<textarea
													onChange={(e) => setAddress(e.target.value)}
													className="w-full h-20 rounded-md input-bordered textarea focus:ring focus:outline-none focus:ring-green-700"
													placeholder="Use a different address!"
												></textarea>
											)}
										</div>
										<div>
											<div>{`${user.firstName} ${user.lastName}`}</div>
											<div>{user.email}</div>
											<div>
												{user.contactNum} {user.altContactNum !== "" ? `, ${user.altContactNum}` : ""}
											</div>
											{!chooseAddress && <div>{user.homeAddress}</div>}
										</div>
									</div>

									<div className="mb-2 font-bold">Payment Method: </div>
									<div className="flex-col pb-5 mb-5 space-y-2 border-b-2 cursor-pointer">
										<div className="flex">
											<input
												type="radio"
												name="COD"
												checked={`${payMethod === "COD" ? "checked" : ""}`}
												className="self-center mr-2 radio radio-xs radio-accent"
												onClick={(e) => handlePayMethod(e)}
												value="COD"
											/>
											<span className={`${payMethod === "COD" ? "text-green-700 font-semibold" : ""}`}>COD (Cash On Delivery)</span>
										</div>
										{payMethod === "COD" && (
											<div className="font-semibold">
												Change For:
												<input
													type="number"
													onChange={(e) => setChange(e.target.value)}
													min="1"
													value={change}
													className="w-32 ml-2 rounded-md input-bordered input input-sm focus:ring focus:outline-none focus:ring-green-700"
													required
												/>
											</div>
										)}
										<div className="flex">
											<input
												type="radio"
												name="GCash"
												checked={`${payMethod === "GCash" ? "checked" : ""}`}
												className="self-center mr-2 radio radio-xs radio-accent"
												onClick={(e) => handlePayMethod(e)}
												value="GCash"
											/>
											<span className={`${payMethod === "GCash" ? "text-green-700 font-semibold" : ""}`}>GCash</span>
										</div>
									</div>

									{/* Delivery time */}
									<div className="mb-2 font-bold">Delivery Time:</div>
									<div className="flex-col pb-5 mb-2 space-y-2 cursor-pointer">
										<div className="flex">
											<input
												type="radio"
												name="Now"
												checked={`${!chooseDeliveryTime ? "checked" : ""}`}
												className="self-center mr-2 radio radio-xs radio-accent"
												onClick={(e) => {
													handleDeliverTime(e);
													setChooseDeliveryTime(false);
												}}
												value="Now"
											/>
											<span className={`${!chooseDeliveryTime ? "text-green-700 font-semibold" : ""}`}>Now</span>
										</div>
										<div className="flex self-center">
											<input
												type="radio"
												name="chooseTime"
												checked={`${chooseDeliveryTime ? "checked" : ""}`}
												className="self-center mr-2 radio radio-xs radio-accent"
												onClick={(e) => setChooseDeliveryTime(true)}
												value="chooseTime"
											/>
											<span className={`${chooseDeliveryTime ? "text-green-700 font-semibold" : ""}`}>Choose Time</span>
										</div>
										{chooseDeliveryTime && (
											<input
												type="datetime-local"
												className="p-1 rounded-md input-bordered focus:ring focus:outline-none focus:ring-green-700"
												id="deliverTime"
												onChange={handleDeliverTime}
												min={dateToday}
												value={deliverTime}
											/>
										)}
									</div>
								</div>
							)}

							{/* Pickup */}
							{type === "Pickup" && user && (
								<div>
									{/* Basic details for mobile */}
									<div className="pb-4 mb-5 border-b-2 sm:hidden b-4">
										<div className="font-bold">Full Name:</div>
										<div>{`${user.firstName} ${user.lastName}`}</div>
										<div className="font-bold">Contact Information:</div>
										<div>
											{user.contactNum} {user.altContactNum !== "" ? `, ${user.altContactNum}` : ""}
										</div>
									</div>

									{/* Basic details for desktop/tablet */}
									<div className="hidden grid-cols-2 grid-rows-1 pb-4 mb-5 border-b-2 sm:grid">
										<div className="font-bold">
											<div>Full Name:</div>
											<div>Contact Information:</div>
										</div>
										<div>
											<div>{`${user.firstName} ${user.lastName}`}</div>
											<div>
												{user.contactNum} {user.altContactNum !== "" ? `, ${user.altContactNum}` : ""}
											</div>
										</div>
									</div>

									{/* Choose branch */}
									<div className="font-bold">
										Choose Store:
										<select
											onChange={(e) => setStoreLocation(e.target.value)}
											className="w-full max-w-xs mb-3 rounded-md input-bordered sm:ml-2 select select-sm focus:ring focus:outline-none focus:ring-green-700"
										>
											<option>Branch 1</option>
											<option>Branch 2</option>
											<option>Branch 3</option>
											<option>Branch 4</option>
										</select>
									</div>

									{/* Pickup time */}
									<div className="mb-2 font-bold">Pickup Time:</div>
									<div className="flex-col pb-5 mb-2 space-y-2 cursor-pointer">
										<div className="flex">
											<input
												type="radio"
												name="Now"
												checked={`${!choosePickupTime ? "checked" : ""}`}
												className="self-center mr-2 radio radio-xs radio-accent"
												onClick={(e) => {
													handleDeliverTime(e);
													setChoosePickupTime(false);
												}}
												value="Now"
											/>
											<span className={`${!choosePickupTime ? "text-green-700 font-semibold" : ""}`}>Now</span>
										</div>
										<div className="flex self-center">
											<input
												type="radio"
												name="chooseTime"
												checked={`${choosePickupTime ? "checked" : ""}`}
												className="self-center mr-2 radio radio-xs radio-accent"
												onClick={(e) => setChoosePickupTime(true)}
												value="chooseTime"
											/>
											<span className={`${choosePickupTime ? "text-green-700 font-semibold" : ""}`}>Choose Time</span>
										</div>
										{choosePickupTime && (
											<input
												type="datetime-local"
												className="p-1 rounded-md input-bordered focus:ring focus:outline-none focus:ring-green-700"
												id="pickupTime"
												onChange={handlePickupTime}
												min={dateToday}
												value={pickupTime}
											/>
										)}
									</div>
								</div>
							)}

							{/* Step buttons */}
							<div className="flex w-full space-x-4">
								<button
									id="prev"
									onClick={(e) => handleAnimation(e)}
									className="w-full p-2 font-semibold text-white transition-colors duration-200 bg-green-700 rounded-md hover:bg-green-600"
								>
									Go Back
								</button>
								<button
									id="next"
									onClick={(e) => handleAnimation(e)}
									className="w-full p-2 font-semibold text-white transition-colors duration-200 bg-green-700 rounded-md hover:bg-green-600"
								>
									Next
								</button>
							</div>
						</div>
					</div>
				</Transition>

				{/* Review checkout */}
				<Transition
					show={currentStep === 3 ? true : false}
					enter="delay-700 transform transition ease-out duration-500"
					enterFrom={`opacity-0 ${forward ? "translate-x-full" : "-translate-x-full"}`}
					enterTo="translate-x-0 opacity-100"
					leave="transform transition ease-in duration-500"
					leaveFrom="translate-x-0 opacity-100"
					leaveTo={`opacity-0 ${forward ? "-translate-x-full" : "translate-x-full"}`}
					afterEnter={handleRefreshTotal}
				>
					<div className="w-full mt-5 rounded-md card bg-zinc-100 drop-shadow-lg">
						<div className="card-body">
							{/* Basic details for mobile */}
							{user && (
								<div className="grid pb-4 border-b-2 sm:hidden">
									<div className="font-bold">Full Name:</div>
									<div>{`${user.firstName} ${user.lastName}`}</div>
									{type === "Delivery" && <div className="font-bold">Email Address:</div>}
									{type === "Delivery" && <div>{address}</div>}
									<div className="font-bold">Contact Information:</div>
									<div>
										{user.contactNum} {user.altContactNum !== "" ? `, ${user.altContactNum}` : ""}
									</div>
									{type === "Delivery" && <div className="font-bold">Address:</div>}
									{type === "Delivery" && <div>{address}</div>}
								</div>
							)}

							{/* Basic details for desktop/tablet */}
							{user && (
								<div className="hidden grid-cols-2 grid-rows-1 pb-4 border-b-2 sm:grid">
									<div className="font-bold">
										<div>Full Name:</div>
										{type === "Delivery" && <div>Email Address:</div>}
										<div>Contact Information:</div>
										{type === "Delivery" && <div>Address:</div>}
									</div>
									<div>
										<div>{`${user.firstName} ${user.lastName}`}</div>
										{type === "Delivery" && <div>{user.email}</div>}
										<div>
											{user.contactNum} {user.altContactNum !== "" ? `, ${user.altContactNum}` : ""}
										</div>
										{type === "Delivery" && <div>{address}</div>}
									</div>
								</div>
							)}

							{/* Delivery details */}
							<div className="grid grid-cols-2 grid-rows-1 py-4 mb-4 border-b-2">
								<div className="font-bold">
									<div>Type:</div>
									{type === "Delivery" ? (
										<>
											<div>Deliver On:</div>
											<div>Payment:</div>
										</>
									) : (
										<>
											<div>Pickup Branch: </div>
											<div>Pickup On:</div>
										</>
									)}
								</div>
								<div>
									<div>{type.toUpperCase()}</div>
									{type === "Delivery" ? (
										// Delivery
										<>
											<div>{chooseDeliveryTime ? formatDate(deliverTime) : "NOW"}</div>
											<div>{payMethod.toUpperCase()}</div>
										</>
									) : (
										// Pickup
										<>
											<div>{storeLocation}</div>
											<div>{choosePickupTime ? formatDate(pickupTime) : "NOW"}</div>
										</>
									)}

									{type === "Delivery" && payMethod === "COD" && (
										<div>
											Change for <a className="font-semibold">₱{change}</a>
										</div>
									)}
								</div>
							</div>

							{/* Food order */}
							<div className="flex justify-between font-bold">
								<div>Order:</div>
								<div>Qty.</div>
								<div className="hidden sm:flex"></div>
							</div>
							<div className="border-b-2 divide-y">
								{order.map((product) => {
									return (
										<li key={product.id} className="flex py-3 sm:flex-row">
											{/* Image */}
											<div className="flex-shrink-0 w-16 h-16 overflow-hidden border border-gray-200 rounded-md">
												<div className="object-cover object-center w-full h-full">
													<Image src={product.menuItem.productImagesCollection.items[0].url} height={100} width={100} />
												</div>
											</div>

											{/* Food item details */}
											<div className="flex-col flex-1 w-1/4 ml-4 text-sm sm:flex sm:text-md">
												<div>
													<div className="flex justify-between font-medium text-gray-900">
														<p className="font-bold">{product.menuItem.productName}</p>
													</div>
													<p className="font-medium">₱ {product.menuItem.productPrice}</p>
												</div>
											</div>

											{/* Quantity */}
											<div className="flex self-center ml-4 font-medium sm:flex-1">x {product.quantity}</div>
											{/* Total price */}
											<p className="self-center hidden w-20 font-bold sm:flex text-end">
												<p className="ml-4 mr-5 font-bold ">₱ {product.menuItem.productPrice * product.quantity}</p>
											</p>
										</li>
									);
								})}
							</div>

							{/* Payment details */}
							<div className="py-5">
								{/* Subtotal */}
								<div className="flex justify-between text-base font-medium text-gray-900">
									<p className="font-semibold">Subtotal</p>
									<p>₱{subTotal}</p>
								</div>

								{type === "Delivery" ? (
									// Delivery
									<div className="flex justify-between my-3 text-base text-gray-500 text-medium">
										<p>Delivery Fee</p>
										<p>₱{delFee}</p>
									</div>
								) : (
									// Pickup
									<div className="flex justify-between my-3 text-base text-gray-500 text-medium">
										<p>Delivery Fee</p>
										<p>₱ - </p>
									</div>
								)}

								{/* Total */}
								<div className="flex justify-between text-base font-medium text-gray-900">
									<p className="font-semibold">Total</p>
									{type === "Delivery" ? <p className="font-bold">₱{totalPrice}</p> : <p className="font-bold">₱{subTotal}</p>}
								</div>
							</div>

							{/* Special instructions */}
							<div className="mb-5">
								<p className="mb-2 font-bold">Special Instructions</p>
								<textarea
									onChange={(e) => setSpecialInstructions(e.target.value)}
									className="w-full h-20 border rounded-md textarea focus:ring focus:outline-none focus:ring-green-700"
									placeholder="Place it here!"
								></textarea>
							</div>

							{/* Place order button */}
							<div className="flex w-full space-x-4">
								<button
									id="prev"
									onClick={(e) => handleAnimation(e)}
									className="w-full p-2 font-semibold text-white transition-colors duration-200 bg-green-700 rounded-md hover:bg-green-600"
								>
									Go Back
								</button>
								<button
									onClick={submitTransaction}
									className="w-full p-2 font-semibold text-white transition-colors duration-200 bg-green-700 rounded-md hover:bg-green-600"
								>
									Place Order
								</button>
							</div>
						</div>
					</div>
				</Transition>
			</div>
		</div>
	);
}
