import { useState, useEffect, useMemo } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import useAxios from "axios-hooks";
import axios from "axios";
import Image from "next/image";
import useLocalStorage from "@utils/localStorage/useLocalStorage";
import getStorageValue from "@utils/localStorage/getStorageValue";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const timeValid = (time) => time >= "10:00" && time <= "19:00";

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

export default function CheckoutPage(session) {
	const router = useRouter();
	const [{ data, loading, error }, refetch] = useAxios(`/api/users/${session.user.email}`);

	const cart = getStorageValue("foodCart");
	const {
		register,
		watch,
		getValues,
		handleSubmit,
		trigger,
		formState: { errors },
	} = useForm({
		defaultValues: {
			type: "Delivery",
			useHomeAddress: "true",
			payMethod: "GCash",
			deliverNow: "true",
			branch: "Molino Blvd.",
			address: "",
			change: "",
		},
	});

	// ANCHOR Page elements
	const [currentStep, setCurrentStep] = useState(1);
	const [forward, setForward] = useState(true);
	const steps = ["Review Cart", "Additional Details", "Review Order"];

	const [order, setOrder] = useState({}); // Contains cart and total price
	const [delFee, setDelFee] = useState(50); // NOTE Delivery fee
	const [subTotal, setSubtotal] = useState(0);
	const [totalPrice, setTotalPrice] = useState(0);

	const [user, setUser] = useState({});
	const [details, setDetails] = useState(null);

	useEffect(() => {
		if (cart) setOrder(cart);
		if (data) setUser(data.user);
	}, [data]);

	// ANCHOR Cart functions
	const deleteItem = (name) => {
		const index = cart.data.findIndex((product) => product.menuItem.productName === name);
		cart.data.splice(index, 1); // Delete item

		let temp = 0;
		cart.data.forEach((product) => {
			temp += product.quantity * product.menuItem.productPrice;
		});

		setSubtotal(temp);
		setTotalPrice(temp + delFee);
		localStorage.setItem("foodCart", JSON.stringify(cart));
	};

	const updateTotal = async (value, name) => {
		const index = cart.data.findIndex((product) => product.menuItem.productName === name);
		cart.data[index].quantity = value; // Update quantity

		let temp = 0;
		cart.data.forEach((product) => {
			temp += product.quantity * product.menuItem.productPrice;
		});

		setSubtotal(temp);
		setTotalPrice(temp + delFee);
		localStorage.setItem("foodCart", JSON.stringify(cart));
	};

	// SECTION Additional details functions
	const [dateToday, setDateToday] = useState(() => {
		const date = new Date().toISOString().slice(0, -14);
		return date;
	});

	// NOTE Time limit for the day to pickup and deliver
	const [startTime, setStartTime] = useState("10:00");
	const [endTime, setEndTime] = useState("19:00");

	const confirmDetails = (data) => {
		const formattedDate = `${data.deliverDate}T${data.deliverTime}`;

		const temp = {
			invoiceNum: undefined,
			dateCreated: undefined,
			orderStatus: 0,
			type: getValues("type"),
			fullName: `${user.firstName} ${user.lastName}`,
			email: user.email,
			contactNum: [user.contact1, user.contact2],
			order: cart.data,
			specialInstructions: data.specialInstructions,
			reasonForCancel: "",
			totalPrice: getValues("type") === "Delivery" ? cart.total + 50 : cart.total,
			address: getValues("useHomeAddress") === "true" ? user.address : getValues("address"),
			payMethod: getValues("payMethod"),
			change: Number(getValues("change")),
			deliverTime: getValues("type") === "Delivery" ? (data.deliverNow ? "Now" : formattedDate) : undefined,
			branch: getValues("branch"),
			pickupTime: getValues("type") === "Pickup" ? (data.deliverNow ? "Now" : formattedDate) : undefined,
		};

		setDetails(temp);

		if (Object.keys(errors).length === 0 && errors.constructor === Object) {
			setCurrentStep(currentStep + 1);
			setForward(true);
		}
	};
	// !SECTION

	// SECTION Review checkout functions
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
		return `${formatDate} @ ${time}`;
	};

	const placeOrder = async () => {
		const transaction = details;

		const response = await axios.get("/api/count");

		transaction.dateCreated = new Date();
		transaction.invoiceNum = response.data.count;

		// Pre-process cart for transaction
		transaction.order.forEach((item) => {
			delete item.menuItem.category;
			delete item.menuItem.productDescription;
			delete item.menuItem.isAvailable;
			delete item.menuItem.productImagesCollection;
			delete item.menuItem.slug;
			delete item.menuItem.available;
		});

		// Set to undefined for fields not required in DELIVERY type
		if (transaction.type === "Delivery") {
			transaction.storeLocation = undefined;
			transaction.pickupTime = undefined;
			if (transaction.payMethod === "GCash") transaction.change = undefined;
		}

		// Set to undefined for fields not required in PICKUP type
		if (transaction.type === "Pickup") {
			transaction.address = undefined;
			transaction.deliverTime = undefined;
		}

		const userRes = await axios.post("/api/transactions", transaction);
		window.localStorage.setItem("transaction", JSON.stringify(userRes.data.transaction));
		router.replace("/receipt");
	};
	// !SECTION

	// ANCHOR Animation function
	const handleAnimation = (event) => {
		if (event.target.id == "prev") {
			setCurrentStep(currentStep - 1);
			setForward(false);
		}

		if (event.target.id == "next") {
			setCurrentStep(currentStep + 1);
			setForward(true);
		}
	};

	useEffect(() => {
		setTimeout(() => {
			setForward(true);
		}, 500);
	}, [forward]);

	if (loading) return <h1>Loading...</h1>;

	return (
		<div className="flex justify-center">
			<div className="relative w-full mx-5 my-10 sm:mx-0 sm:w-3/4 xl:w-1/2 font-rale text-slate-900">
				<div className="flex flex-col text-green-700 sm:justify-between sm:flex-row">
					<div className="mb-5 text-5xl font-extrabold ">Checkout</div>
					<div className="text-xl font-bold sm:self-center">{steps[currentStep - 1]}</div>
				</div>

				{/* ANCHOR Review cart */}
				<Transition
					show={currentStep === 1 ? true : false}
					enter="delay-700 transform transition ease-out duration-300"
					enterFrom={`opacity-0 ${forward ? "translate-x-full" : "-translate-x-full"}`}
					enterTo="translate-x-0 opacity-100"
					leave="transform transition ease-in duration-300"
					leaveFrom="translate-x-0 opacity-100"
					leaveTo={`opacity-0 ${forward ? "-translate-x-full" : "translate-x-full"}`}
				>
					<div className={`${forward ? "" : "absolute"} w-full mt-5 rounded-md text-md sm:text-lg card bg-zinc-100 drop-shadow-lg`}>
						<div className="card-body">
							{/* Cart details */}
							{cart && (
								<div className="mb-5 divide-y">
									{cart.data.map((product) => {
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
												<p className="self-center hidden font-bold w-22 sm:flex text-end">
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

				{/* ANCHOR Additional details */}
				<Transition
					show={currentStep === 2 ? true : false}
					enter="delay-700 transform transition ease-out duration-500"
					enterFrom={`opacity-0 ${forward ? "translate-x-full" : "-translate-x-full"}`}
					enterTo="translate-x-0 opacity-100"
					leave="transform transition ease-in duration-500"
					leaveFrom="translate-x-0 opacity-100"
					leaveTo={`opacity-0 ${forward ? "-translate-x-full" : "translate-x-full"}`}
				>
					<div className={`${forward ? "" : "absolute"} w-full mt-5 rounded-md text-md sm:text-lg card bg-zinc-100 drop-shadow-lg`}>
						<div className="card-body">
							<form onSubmit={handleSubmit(confirmDetails)}>
								{/* ANCHOR Delivery or pickup radio buttons */}
								<div className="flex mb-2 space-x-4 text-sm">
									<div>
										<input className="self-center mr-2" name="type" {...register("type")} type="radio" value="Delivery" />
										<span className={`${watch("type") === "Delivery" ? "text-green-700 font-semibold" : ""}`}>Delivery</span>
									</div>
									<div>
										<input className="self-center mr-2" name="type" {...register("type")} type="radio" value="Pickup" />
										<span className={`${watch("type") === "Pickup" ? "text-green-700 font-semibold" : ""}`}>Pickup</span>
									</div>
								</div>

								{/* ANCHOR User details */}
								{watch("type") === "Delivery" ? (
									<div className="text-sm border-b-2">
										<div className="text-lg font-bold text-green-700">User Details</div>
										<div className="font-bold">Full Name</div>
										<div className="mb-2">
											{user.firstName} {user.lastName}
										</div>
										<div className="font-bold">Email Address</div>
										<div className="mb-2">{user.email}</div>
										<div className="font-bold">Contact Information</div>
										<div className="mb-2">
											{user.contact1} {user.contact2 !== "" ? `, ${user.contact2}` : ""}
										</div>
										<div className="font-bold">Address</div>
										<div className="flex space-x-4">
											<div>
												<input className="self-center mr-2" name="useHomeAddress" {...register("useHomeAddress")} type="radio" value="true" />
												<span className={`${watch("useHomeAddress") === "true" ? "text-green-700 font-semibold" : ""}`}>Use Home Address</span>
											</div>
											<div>
												<input className="self-center mr-2" name="useHomeAddress" {...register("useHomeAddress")} type="radio" value="false" />
												<span className={`${watch("useHomeAddress") === "true" ? "" : "text-green-700 font-semibold"}`}>Use Different Address</span>
											</div>
										</div>
										{watch("useHomeAddress") === "true" ? (
											<div className="mb-2">{user.address}</div>
										) : (
											<>
												<textarea
													className="w-full h-20 my-2 rounded-md input-bordered textarea focus:ring focus:outline-none focus:ring-green-700"
													name="address"
													{...register("address", { required: watch("useHomeAddress") == "false" ? true : false })}
												/>
												{errors.address && <div className="mb-2 text-sm font-medium text-left text-red-500 ">Address is required</div>}
											</>
										)}
									</div>
								) : (
									<div className="text-sm border-b-2">
										<div className="font-bold">Full Name</div>
										<div className="mb-2">
											{user.firstName} {user.lastName}
										</div>
										<div className="font-bold">Contact Information</div>
										<div className="mb-2">
											{user.contact1} {user.contact2 !== "" ? `, ${user.contact2}` : ""}
										</div>
										<div>
											<span className="font-bold">Choose Branch: </span>
											<select
												name="branch"
												className="w-1/2 mb-3 rounded-md sm:w-1/3 input-bordered sm:ml-2 select select-xs focus:ring focus:outline-none focus:ring-green-700"
												{...register("branch")}
											>
												<option value="Molino Blvd.">Molino Blvd.</option>
												<option value="V Central">V Central</option>
												<option value="Unitop">Unitop</option>
											</select>
										</div>
									</div>
								)}

								{/* ANCHOR Payment details */}
								<div className="mt-2 text-sm border-b-2">
									<div className="text-lg font-bold text-green-700">Payment Details</div>
									<div className="flex mb-2 space-x-4">
										<div>
											<input className="self-center mr-2" name="payMethod" {...register("payMethod")} type="radio" value="COD" />
											<span className={`${watch("payMethod") === "COD" ? "text-green-700 font-semibold" : ""}`}>
												{watch("type") === "Delivery" ? "COD (Cash on Delivery)" : "Cash on Pickup"}
											</span>
										</div>
										<div>
											<input className="self-center mr-2" name="payMethod" {...register("payMethod")} type="radio" value="GCash" />
											<span className={`${watch("payMethod") === "GCash" ? "text-green-700 font-semibold" : ""}`}>GCash</span>
										</div>
									</div>
									{watch("payMethod") === "COD" ? (
										<div className="mb-2">
											<span className="font-bold ">Change for: ₱ </span>
											<input
												type="number"
												name="change"
												className="w-32 ml-2 rounded-md input-bordered input input-xs focus:ring focus:outline-none focus:ring-green-700"
												{...register("change", {
													required: watch("payMethod") === "COD" ? true : false,
													min: watch("type") === "Pickup" ? cart.total : cart.total + 50,
												})}
											/>
											<div className="mt-2 text-xs font-bold">Total Price: ₱{watch("type") === "Pickup" ? cart.total : cart.total + 50}</div>
											{errors.change?.type === "required" && <div className="mt-1 text-sm font-medium text-left text-red-500">Change is required</div>}
											{errors.change?.type === "min" && (
												<div className="mt-1 text-sm font-medium text-left text-red-500">Change must be more than the total price</div>
											)}
										</div>
									) : (
										<div className="flex-row">
											{watch("type") === "Delivery" ? (
												<div></div>
											) : (
												<div>
													{watch("branch") === "Molino Blvd." && (
														<>
															<div>
																<div className="font-bold">Name</div>
																<div className="mb-2">Molino Blvd.</div>
															</div>
															<div>
																<div className="font-bold">GCash Number</div>
																<div className="mb-2">0955 361 9520</div>
															</div>
														</>
													)}

													{watch("branch") === "V Central" && (
														<>
															<div>
																<div className="font-bold">Name</div>
																<div className="mb-2">V Central</div>
															</div>
															<div>
																<div className="font-bold">GCash Number</div>
																<div className="mb-2">0935 696 8978</div>
															</div>
														</>
													)}

													{watch("branch") === "Unitop" && (
														<>
															<div>
																<div className="font-bold">Name</div>
																<div className="mb-2">Unitop</div>
															</div>
															<div>
																<div className="font-bold">GCash Number</div>
																<div className="mb-2">0997 760 5792</div>
															</div>
														</>
													)}
												</div>
											)}
											<div className="mb-2 text-xs font-bold">
												{watch("type") === "Delivery"
													? "*The payment details will be available once you place your order"
													: "*The payment details depends on the branch you choose"}
											</div>
										</div>
									)}
								</div>

								{/* ANCHOR Deliver/Pickup now or set date/time */}
								<div className="my-2 text-sm border-b-2">
									<div className="text-lg font-bold text-green-700">{watch("type") === "Delivery" ? "When to Deliver" : "When to Pickup"}</div>
									<div className="flex mb-2 space-x-4">
										<div>
											<input className="self-center mr-2" name="deliverNow" {...register("deliverNow")} type="radio" value="true" />
											<span className={`${watch("deliverNow") === "true" ? "text-green-700 font-semibold" : ""}`}>
												{watch("type") === "Delivery" ? "Deliver NOW" : "Pickup NOW"}
											</span>
										</div>
										<div>
											<input className="self-center mr-2" name="deliverNow" {...register("deliverNow")} type="radio" value="false" />
											<span className={`${watch("deliverNow") === "false" ? "text-green-700 font-semibold" : ""}`}>Choose Date and Time</span>
										</div>
									</div>
									{watch("deliverNow") === "false" && (
										<>
											<div>
												<input
													type="date"
													name="deliverDate"
													className="p-1 mb-2 rounded-md input-bordered focus:ring focus:outline-none focus:ring-green-700"
													{...register("deliverDate", { required: watch("deliverNow") === "false" ? true : false, min: dateToday })}
												/>
												{errors.deliverDate?.type === "required" && (
													<div className="mb-2 text-sm font-medium text-left text-red-500">Please choose a date</div>
												)}
												{errors.deliverDate?.type === "min" && (
													<div className="mb-2 text-sm font-medium text-left text-red-500">Please choose a date no earlier than today</div>
												)}
											</div>

											<div>
												<input
													type="time"
													name="deliverTime"
													placeholder="deliverTime"
													className="p-1 mb-2 rounded-md input-bordered focus:ring focus:outline-none focus:ring-green-700"
													{...register("deliverTime", {
														required: watch("deliverNow") === "false" ? true : false,
														validate: timeValid,
													})}
												/>
												{errors.deliverTime?.type === "required" && (
													<div className="mb-2 text-sm font-medium text-left text-red-500">Please choose a time</div>
												)}
												{errors.deliverTime?.type === "validate" && (
													<div className="mb-2 text-sm font-medium text-left text-red-500">Please choose a time between operating hours</div>
												)}
											</div>
											<div className="mb-2 text-sm font-semibold">
												Operating Hours: {startTime} - {endTime}
											</div>
										</>
									)}
								</div>

								{/* ANCHOR Special instructions */}
								<div className="mb-5">
									<p className="text-lg font-bold text-green-700">Special Instructions</p>
									<textarea
										className="w-full h-20 border rounded-md input-bordered textarea focus:ring focus:outline-none focus:ring-green-700"
										name="specialInstructions"
										{...register("specialInstructions")}
									/>
								</div>
								{/* ANCHOR Step buttons */}
								<div className="flex w-full space-x-4">
									<button
										type="button"
										id="prev"
										onClick={(e) => handleAnimation(e)}
										className="w-full p-2 font-semibold text-white transition-colors duration-200 bg-green-700 rounded-md hover:bg-green-600"
									>
										Go Back
									</button>
									<button
										type="submit"
										id="next"
										className="w-full p-2 font-semibold text-white transition-colors duration-200 bg-green-700 rounded-md hover:bg-green-600"
									>
										Next
									</button>
								</div>
							</form>
						</div>
					</div>
				</Transition>

				{/* ANCHOR Review checkout */}
				{details && (
					<Transition
						show={currentStep === 3 ? true : false}
						enter="delay-700 transform transition ease-out duration-300"
						enterFrom={`opacity-0 ${forward ? "translate-x-full" : "-translate-x-full"}`}
						enterTo="translate-x-0 opacity-100"
						leave="transform transition ease-in duration-300"
						leaveFrom="translate-x-0 opacity-100"
						leaveTo={`opacity-0 ${forward ? "-translate-x-full" : "translate-x-full"}`}
					>
						<div className={`${forward ? "" : "absolute"} w-full mt-5 rounded-md text-md sm:text-lg card bg-zinc-100 drop-shadow-lg`}>
							<div className="card-body">
								{/* ANCHOR User details */}
								{details.type === "Delivery" ? (
									<div className="text-sm border-b-2">
										<div className="text-lg font-bold text-green-700">User Details</div>
										<div className="font-bold">Full Name</div>
										<div className="mb-2">{details.fullName}</div>
										<div className="font-bold">Email Address</div>
										<div className="mb-2">{details.email}</div>
										<div className="font-bold">Contact Information</div>
										<div className="mb-2">
											{details.contactNum[0]}, {details.contactNum[1]}
										</div>
										<div className="font-bold">Address</div>
										<div className="mb-2">{details.address}</div>
									</div>
								) : (
									<div className="text-sm border-b-2">
										<div className="text-lg font-bold text-green-700">User Details</div>
										<div className="font-bold">Full Name</div>
										<div className="mb-2">{details.fullName}</div>
										<div className="font-bold">Contact Information</div>
										<div className="mb-2">
											{details.contactNum[0]}, {details.contactNum[1]}
										</div>
										<div className="font-bold">Branch</div>
										<div className="mb-2">{details.branch}</div>
									</div>
								)}

								{/* ANCHOR Delivery details */}
								<div className="py-2 text-sm border-b-2">
									<div className="text-lg font-bold text-green-700">Payment Details</div>
									<div className="font-bold">Type</div>
									<div className="mb-2">{details.type}</div>
									<div className="font-bold">Payment</div>
									<div className="mb-2">
										{details.payMethod} {details.payMethod === "COD" ? `(Change for ₱${details.change})` : ""}
									</div>
									{details.type === "Delivery" && <div className="font-bold">Deliver On</div>}
									{details.type === "Delivery" && <div className="">{watch("deliverNow") ? "Now" : formatDate(details.deliverTime)}</div>}
									{details.type === "Pickup" && <div className="font-bold">Pickup on</div>}
									{details.type === "Pickup" && <div className="">{watch("deliverNow") ? "Now" : formatDate(details.pickupTime)}</div>}
								</div>

								{/* ANCHOR Food order */}
								<div className="py-2 text-sm border-b-2">
									<div className="text-lg font-bold text-green-700">Order Summary</div>
									<div className="flex justify-between font-bold">
										<div>Item</div>
										<div>Qty.</div>
										<div className="hidden sm:flex"></div>
									</div>
									<div className="divide-y">
										{order.data.map((product) => {
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
								</div>

								{/* ANCHOR Payment details */}
								<div className="py-2 text-sm border-b-2">
									<div className="mb-1 text-lg font-bold text-green-700">Pricing</div>
									<div className="flex justify-between font-medium text-gray-900">
										<p className="font-semibold">Subtotal</p>
										<p>₱{order.total}</p>
									</div>
									{details.type === "Delivery" ? (
										// Delivery
										<div className="flex justify-between my-3 text-gray-500 text-medium">
											<p>Delivery Fee</p>
											<p>₱{delFee}</p>
										</div>
									) : (
										// Pickup
										<div className="flex justify-between my-3 text-gray-500 text-medium">
											<p>Delivery Fee</p>
											<p>₱ - </p>
										</div>
									)}
									<div className="flex justify-between font-medium text-gray-900">
										<p className="font-bold text-green-700">Total</p>
										{details.type === "Delivery" ? <p className="font-bold">₱{order.total + delFee}</p> : <p className="font-bold">₱{order.total}</p>}
									</div>
								</div>
								<div className="py-2 text-sm">
									<div className="mb-1 text-lg font-bold text-green-700">Special Instructions</div>
									{details.specialInstructions ? <div>{details.specialInstructions}</div> : <div>None</div>}
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
										onClick={placeOrder}
										className="w-full p-2 font-semibold text-white transition-colors duration-200 bg-green-700 rounded-md hover:bg-green-600"
									>
										Place Order
									</button>
								</div>
							</div>
						</div>
					</Transition>
				)}
			</div>
		</div>
	);
}
