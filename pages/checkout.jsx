import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Transition } from "@headlessui/react";

import getStorageValue from "@utils/localStorage/getStorageValue";
import confirmTransaction from "@utils/confirmTransaction";
import useLocalStorage from "@utils/localStorage/useLocalStorage";

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

		// console.log(transaction);
		// Send transaction object
		const response = await confirmTransaction(transaction);
		console.log(response);
		// If successful, set transaction to local storage and redirect to receipt page
		// if (response.success) {
		// 	setTransaction(response.data);
		// 	router.replace("/receipt");
		// } else {
		// 	// DESIGNER TODO: Handle here if unsuccessful checkout (i.e., missing values).
		// }
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
			<div className="relative w-1/3 min-h-screen my-10 font-rale text-slate-900">
				<div className="flex justify-between text-green-700">
					<div className="mb-5 text-5xl font-extrabold ">Checkout</div>
					<div className="self-center text-xl font-bold">{steps[currentStep - 1]}</div>
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
											<li key={product.id} className="flex py-3">
												<p className="flex items-center mr-2 font-bold text-gray-600">
													<input
														className="pr-2 mr-2 rounded-md input font-black-100 text-normal w-14 input-sm input-bordered focus:ring-2 focus:ring-blue-300"
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
													x
												</p>
												<div className="flex-shrink-0 w-16 h-16 overflow-hidden border border-gray-200 rounded-md">
													<img src={product.menuItem.productImagesCollection.items[0].url} className="object-cover object-center w-full h-full" />
												</div>

												<div className="flex flex-col flex-1 ml-4">
													<div>
														<div className="flex justify-between text-base font-medium text-gray-900">
															<h3>
																<a className="font-bold">{product.menuItem.productName}</a>
															</h3>
															<p className="ml-4 font-bold">₱ {product.menuItem.productPrice * product.quantity}</p>
														</div>
														<p className="text-sm font-medium text-gray-600">₱ {product.menuItem.productPrice}</p>
													</div>
													<div className="flex items-end justify-between flex-1 text-sm">
														<div className="flex">
															<button
																name={product.menuItem.productName}
																type="button"
																className="font-medium text-green-600 hover:text-green-500"
																onClick={(e) => deleteItem(e.target.name)}
															>
																Remove
															</button>
														</div>
													</div>
												</div>
											</li>
										);
									})}
								</div>
							)}

							{/* Step button */}
							<button id="next" onClick={(e) => handleAnimation(e)} className="p-2 font-semibold text-white bg-green-700 rounded-md">
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
					<div className="absolute w-full mt-5 rounded-md card bg-zinc-100 drop-shadow-lg">
						<div className="card-body">
							{/* Delivery or pickup radio buttons */}
							<div className="flex mb-5 space-x-4 cursor-pointer">
								<div className="flex">
									<input
										type="radio"
										name="Delivery"
										checked={`${type === "Delivery" ? "checked" : ""}`}
										className="mr-2 radio radio-accent"
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
										className="mr-2 radio radio-accent"
										onClick={(e) => handleDeliveryType(e)}
										value="Pickup"
									/>
									<span className={`${type === "Pickup" ? "text-green-700 font-semibold" : ""}`}>Pickup</span>
								</div>
							</div>

							{/* Delivery */}
							{type === "Delivery" && user && (
								<div className="font-medium">
									{/* Basic details */}
									<div className="grid grid-cols-2 grid-rows-1 pb-4 mb-5 border-b-2">
										<div className="font-bold">
											<div>Full Name:</div>
											<div>Email Address:</div>
											<div>Contact Information:</div>
											<div>Address:</div>
										</div>
										<div>
											<div>{`${user.firstName} ${user.lastName}`}</div>
											<div>{user.email}</div>
											<div>
												{user.contactNum} {user.altContactNum !== "" ? `, ${user.altContactNum}` : ""}
											</div>
											<div>{user.homeAddress}</div>
										</div>
									</div>

									<div className="mb-2 font-bold">Payment Method: </div>
									<div className="flex-col pb-5 mb-5 space-y-4 border-b-2 cursor-pointer">
										<div className="flex">
											<input
												type="radio"
												name="COD"
												checked={`${payMethod === "COD" ? "checked" : ""}`}
												className="mr-2 radio radio-accent"
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
													className="w-32 ml-2 rounded-md input input-sm"
													required
												/>
											</div>
										)}
										<div className="flex">
											<input
												type="radio"
												name="GCash"
												checked={`${payMethod === "GCash" ? "checked" : ""}`}
												className="mr-2 radio radio-accent"
												onClick={(e) => handlePayMethod(e)}
												value="GCash"
											/>
											<span className={`${payMethod === "GCash" ? "text-green-700 font-semibold" : ""}`}>GCash</span>
										</div>
									</div>

									{/* Delivery time */}
									<div className="mb-2 font-bold">Delivery Time:</div>
									<div className="flex-col pb-5 mb-2 space-y-4 cursor-pointer">
										<div className="flex">
											<input
												type="radio"
												name="Now"
												checked={`${!chooseDeliveryTime ? "checked" : ""}`}
												className="mr-2 radio radio-accent"
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
												className="mr-2 radio radio-accent"
												onClick={(e) => setChooseDeliveryTime(true)}
												value="chooseTime"
											/>
											<span className={`${chooseDeliveryTime ? "text-green-700 font-semibold" : ""}`}>Choose Time</span>
										</div>
										{chooseDeliveryTime && (
											<input
												type="datetime-local"
												className="p-1 border rounded-md focus:ring focus:outline-none focus:ring-green-700"
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
									<div className="grid grid-cols-2 grid-rows-1 pb-4 mb-5 border-b-2">
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
									<div className="font-bold">
										Choose Store:
										<select onChange={(e) => setStoreLocation(e.target.value)} className="w-full max-w-xs mb-5 ml-2 rounded-md select select-sm">
											<option>Branch 1</option>
											<option>Branch 2</option>
											<option>Branch 3</option>
											<option>Branch 4</option>
										</select>
									</div>

									{/* Pickup time */}
									<div className="mb-2 font-bold">Pickup Time:</div>
									<div className="flex-col pb-5 mb-2 space-y-4 cursor-pointer">
										<div className="flex">
											<input
												type="radio"
												name="Now"
												checked={`${!choosePickupTime ? "checked" : ""}`}
												className="mr-2 radio radio-accent"
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
												className="mr-2 radio radio-accent"
												onClick={(e) => setChoosePickupTime(true)}
												value="chooseTime"
											/>
											<span className={`${choosePickupTime ? "text-green-700 font-semibold" : ""}`}>Choose Time</span>
										</div>
										{choosePickupTime && (
											<input
												type="datetime-local"
												className="p-1 border rounded-md focus:ring focus:outline-none focus:ring-green-700"
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
								<button id="prev" onClick={(e) => handleAnimation(e)} className="w-full p-2 font-semibold text-white bg-green-700 rounded-md">
									Go Back
								</button>
								<button id="next" onClick={(e) => handleAnimation(e)} className="w-full p-2 font-semibold text-white bg-green-700 rounded-md">
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
					<div className="absolute w-full mt-5 rounded-md card bg-zinc-100 drop-shadow-lg">
						<div className="card-body">
							{/* Basic details */}
							{user && (
								<div className="grid grid-cols-2 grid-rows-1 pb-4 border-b-2">
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
										{type === "Delivery" && <div>{user.homeAddress}</div>}
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
											<div>{chooseDeliveryTime ? deliverTime : "NOW"}</div>
											<div>{payMethod.toUpperCase()}</div>
										</>
									) : (
										// Pickup
										<>
											<div>{storeLocation}</div>
											<div>{pickupTime}</div>
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
							<div className="font-bold">Order:</div>
							<div className="border-b-2 divide-y">
								{order.map((product) => {
									return (
										<li key={product.id} className="flex py-3">
											<p className="flex items-center mr-2 font-bold text-gray-600">
												<a className="mr-4">{product.quantity}</a> x
											</p>
											<div className="flex-shrink-0 w-16 h-16 ml-3 overflow-hidden border border-gray-200 rounded-md">
												<img src={product.menuItem.productImagesCollection.items[0].url} className="object-cover object-center w-full h-full" />
											</div>

											<div className="flex flex-col flex-1 ml-4">
												<div>
													<div className="flex justify-between text-base font-medium text-gray-900">
														<h3>
															<a className="font-bold">{product.menuItem.productName}</a>
														</h3>
														<p className="ml-4 font-bold">₱ {product.menuItem.productPrice * product.quantity}</p>
													</div>
													<p className="text-sm font-medium text-gray-600">₱ {product.menuItem.productPrice}</p>
												</div>
											</div>
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

							{/* Place order button */}
							<div className="flex w-full space-x-4">
								<button id="prev" onClick={(e) => handleAnimation(e)} className="w-full p-2 font-semibold text-white bg-green-700 rounded-md">
									Go Back
								</button>
								<button onClick={submitTransaction} className="w-full p-2 font-semibold text-white bg-green-700 rounded-md">
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
