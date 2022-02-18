import { useState, useEffect, useMemo } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useAxios from "axios-hooks";
import useSWR from "swr";
import axios from "axios";
import Image from "next/image";
import getStorageValue from "@utils/localStorage/getStorageValue";
import Loading from "@components/Loading";

const fetcher = (url) => fetch(url).then((res) => res.json());

export async function getServerSideProps(context) {
	const session = await getSession(context);

	if (!session)
		return {
			redirect: {
				permanent: false,
				destination: "/signin",
			},
		};

	if (session.user.isAdmin)
		return {
			redirect: {
				permanent: false,
				destination: "/admin",
			},
		};
	return {
		props: session,
	};
}

export default function Checkout(session) {
	const router = useRouter();
	const [{ data, loading, error }, refetch] = useAxios(`/api/users/${session.user.email}`);
	const { data: timeData, error: timeError } = useSWR("/api/hours", fetcher);
	const timeValid = (time) => time >= timeData.operatingHours.startTime && time <= timeData.operatingHours.endTime; // NOTE: time validator
	const cart = getStorageValue("foodCart");
	const branch = getStorageValue("branch");
	const {
		register,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			type: "Pickup",
			useHomeAddress: "true",
			payMethod: "GCash",
			deliverNow: "true",
			branch: "Molino Boulevard",
			address: "",
			change: "",
		},
	});

	// ANCHOR Page elements
	const [order, setOrder] = useState({}); // Contains cart and total price
	const [products, setProducts] = useState(undefined); // Contains food products only (w/o total price)
	const [user, setUser] = useState({});

	useEffect(() => {
		if (cart) setOrder(cart);
		if (order) setProducts(order.products);
		if (data) setUser(data.user);
	}, [data]);

	// ANCHOR Today's date for limiting
	const [dateToday, setDateToday] = useState(() => {
		const date = new Date().toISOString().slice(0, -14);
		return date;
	});

	// ANCHOR Place order function
	const placeOrder = async (data) => {
		const formattedDate = `${data.deliverDate}T${data.deliverTime}`;
		let response = await axios.get("/api/count", { params: { filter: "transactions" } });
		const transaction = {
			lastUpdated: new Date(),
			invoiceNum: response.data.count,
			dateCreated: new Date(),
			orderStatus: 0,
			type: data.type,
			fullName: `${user.firstName} ${user.lastName}`,
			email: user.email,
			contactNum: [user.contact1, user.contact2],
			order: order.products,
			specialInstructions: data.specialInstructions,
			reasonForCancel: "",
			totalPrice: data.type === "Delivery" ? cart.total + 50 : cart.total,
			address: data.useHomeAddress === "true" ? user.address : data.address,
			payMethod: data.payMethod,
			change: data.payMethod === "COD" ? Number(data.change) : null,
			branch: branch,
			deliverTime: data.type === "Delivery" ? (data.deliverNow === "true" ? "Now" : formattedDate) : null,
			pickupTime: data.type === "Pickup" ? (data.deliverNow === "true" ? "Now" : formattedDate) : null,
		};

		// Remove extra properties from each menu item
		transaction.order.forEach((item) => {
			delete item.menuItem.category;
			delete item.menuItem.productDescription;
			delete item.menuItem.isAvailable;
			delete item.menuItem.slug;
			delete item.menuItem.available;
		});

		// Place transaction into user history and transactions
		response = await axios.post("/api/transactions", transaction);
		await axios.put(`/api/history/${session.user.email}`, transaction);

		window.localStorage.setItem("transaction", JSON.stringify(response.data.transaction));
		router.replace("/receipt");
	};

	return (
		<div className="container p-12 mx-auto text-gray-800 font-rale">
			{loading ? (
				<Loading />
			) : (
				<div className="flex flex-col w-full px-0 mx-auto md:flex-row">
					{/* SECTION Shipping details */}
					<div className="flex flex-col md:w-full">
						<form className="justify-center w-full mx-auto" onSubmit={handleSubmit(placeOrder)}>
							{/* ANCHOR Choose type */}
							<h2 className="mb-4 font-bold text-green-700 md:text-xl text-heading">Type</h2>
							<div className="my-4 border-b-2">
								<div className="w-full">
									<div className="flex items-center mb-2 space-x-4">
										<div className="flex items-center">
											<input className="accent-green-600" {...register("type", { required: true })} type="radio" value="Pickup" />
											<p className="ml-1 text-sm font-normal leading-4">Pickup</p>
										</div>
										<div className="flex items-center">
											<input className="accent-green-600" {...register("type", { required: true })} type="radio" value="Delivery" />
											<p className="ml-1 text-sm font-normal leading-4">Delivery</p>
										</div>
									</div>
								</div>
							</div>

							{/* ANCHOR Basic details */}
							<h2 className="mb-4 font-bold text-green-700 md:text-xl text-heading">Basic Details</h2>
							<div className="space-x-0 lg:flex lg:space-x-4">
								<div className="w-full lg:w-1/2">
									<label for="firstName" className="block mb-3 text-sm font-semibold">
										Full Name
									</label>
									<span>
										{user.firstName} {user.lastName}
									</span>
								</div>
							</div>
							{watch("type") === "Delivery" && (
								<div className="mt-4">
									<div className="w-full">
										<label for="Email" className="block mb-3 text-sm font-semibold">
											Email
										</label>
										<span>{user.email}</span>
									</div>
								</div>
							)}
							<div className="mt-4">
								<div className="w-full">
									<label for="Email" className="block mb-3 text-sm font-semibold">
										Contact Information
									</label>
									<span>
										{user.contact1}
										{user.contact2 !== "" ? `, ${user.contact2}` : ""}
									</span>
								</div>
							</div>

							<div className="my-4 border-b-2">
								<div className="w-full">
									{watch("type") === "Delivery" ? (
										<>
											<label for="Address" className="block mb-1 text-sm font-semibold">
												Address
											</label>
											<div className="flex items-center mb-2 space-x-4">
												<div className="flex items-center">
													<input className="accent-green-600" {...register("useHomeAddress", { required: true })} type="radio" value="true" />
													<p className="ml-1 text-sm font-normal leading-4">Home Address</p>
												</div>
												<div className="flex items-center">
													<input className="accent-green-600" {...register("useHomeAddress", { required: true })} type="radio" value="false" />
													<p className="ml-1 text-sm font-normal leading-4">Other Address</p>
												</div>
											</div>
											{watch("useHomeAddress") == "true" ? (
												<div className="mb-1">
													<span className="w-full">{user.address}</span>
												</div>
											) : (
												<>
													<textarea
														className="w-full px-4 py-3 text-xs border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-green-700"
														name="Address"
														cols="20"
														rows="4"
														placeholder="Address"
														{...register("address", { required: watch("useHomeAddress") === "false" ? true : false, maxLength: 100 })}
													/>
													{errors.address?.type === "required" && (
														<div className="mb-1 text-sm font-medium text-left text-red-500">Home address is required</div>
													)}
													{errors.address?.type === "maxLength" && (
														<div className="mt-1 text-sm font-medium text-left text-red-500">Home address must be less than 100 characters</div>
													)}
												</>
											)}
										</>
									) : (
										<div className="mt-4">
											<div className="w-full">
												<label for="Email" className="block mb-3 text-sm font-semibold">
													Branch
												</label>
												<span>{branch}</span>
											</div>
										</div>
									)}
								</div>
							</div>

							{/* ANCHOR Payment details */}
							<h2 className="mb-4 font-bold text-green-700 md:text-xl text-heading">Payment</h2>
							<div className="my-4 border-b-2">
								<div className="w-full mb-2">
									<div className="flex items-center mb-1 space-x-4">
										<div className="flex items-center">
											<input className="accent-green-600" {...register("payMethod")} type="radio" value="COD" />
											<p className="ml-2 text-sm font-normal leading-4">{watch("type") === "Pickup" ? "Cash on Pickup" : "COD (Cash on Delivery)"}</p>
										</div>
										<div className="flex items-center">
											<input className="accent-green-600" {...register("payMethod")} type="radio" value="GCash" />
											<p className="ml-2 text-sm font-normal leading-4">GCash</p>
										</div>
									</div>
									{watch("payMethod") == "COD" ? (
										<div className="items-center mt-2 text-md">
											Change for:
											<input
												type="number"
												className="px-2 py-1 ml-2 text-xs border border-gray-300 rounded sm:w-1/3 lg:w-1/4 lg:text-sm focus:outline-none focus:ring-1 focus:ring-green-700"
												placeholder="Change"
												{...register("change", {
													required: watch("payMethod") === "COD" ? true : false,
													min: watch("type") === "Pickup" ? Number(order.total) : Number(order.total) + 50,
												})}
											/>
											{errors.change?.type === "required" && <div className="mt-1 text-sm font-medium text-left text-red-500">Change is required</div>}
											{errors.change?.type === "min" && (
												<div className="mt-1 text-sm font-medium text-left text-red-500">Change must be more than or equal to the total price</div>
											)}
										</div>
									) : (
										<>
											{watch("type") === "Delivery" ? (
												<span className="text-sm font-semibold">* Payment details will be seen on the tracker page once you place an order</span>
											) : (
												<div className="text-sm">
													{watch("branch") === "Molino Boulevard" && (
														<>
															<div>
																<div className="font-bold">Name</div>
																<div className="mb-2">Molino Boulevard</div>
															</div>
															<div>
																<div className="font-bold">GCash Number</div>
																<div className="mb-2">0955 361 9520</div>
															</div>
														</>
													)}

													{watch("branch") === "V Central Mall" && (
														<>
															<div>
																<div className="font-bold">Name</div>
																<div className="mb-2">V Central Mall</div>
															</div>
															<div>
																<div className="font-bold">GCash Number</div>
																<div className="mb-2">0935 696 8978</div>
															</div>
														</>
													)}

													{watch("branch") === "Unitop Mall" && (
														<>
															<div>
																<div className="font-bold">Name</div>
																<div className="mb-2">Unitop Mall</div>
															</div>
															<div>
																<div className="font-bold">GCash Number</div>
																<div className="mb-2">0997 760 5792</div>
															</div>
														</>
													)}
												</div>
											)}
										</>
									)}
								</div>
							</div>

							{/* ANCHOR When to deliver */}
							<h2 className="mb-1 font-bold text-green-700 md:text-xl text-heading">{watch("type") == "Delivery" ? "When to Deliver" : "When to Pickup"}</h2>
							<div className="mt-4">
								<div className="w-full">
									<div className="flex items-center mb-2 space-x-4">
										<div className="flex items-center">
											<input className="accent-green-600" {...register("deliverNow", { required: true })} type="radio" value="true" />
											<p className="ml-2 text-sm font-normal leading-4">NOW</p>
										</div>
										<div className="flex items-center">
											<input className="accent-green-600" {...register("deliverNow", { required: true })} type="radio" value="false" />
											<p className="ml-2 text-sm font-normal leading-4">Choose a Date and Time</p>
										</div>
									</div>
								</div>
								{watch("deliverNow") === "false" && (
									<>
										<div>
											<input
												type="date"
												name="deliverDate"
												className="p-1 mb-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-700"
												{...register("deliverDate", { required: watch("deliverNow") === "false" ? true : false, min: dateToday })}
											/>
											{errors.deliverDate?.type === "required" && <div className="mb-2 text-sm font-medium text-left text-red-500">Please choose a date</div>}
											{errors.deliverDate?.type === "min" && (
												<div className="mb-2 text-sm font-medium text-left text-red-500">Please choose a date no earlier than today</div>
											)}
										</div>

										<div>
											<input
												type="time"
												name="deliverTime"
												placeholder="deliverTime"
												className="p-1 mb-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-700"
												{...register("deliverTime", {
													required: watch("deliverNow") === "false" ? true : false,
													validate: timeValid,
												})}
											/>
											{errors.deliverTime?.type === "required" && <div className="mb-2 text-sm font-medium text-left text-red-500">Please choose a time</div>}
											{errors.deliverTime?.type === "validate" && (
												<div className="mb-2 text-sm font-medium text-left text-red-500">Please choose a time between operating hours</div>
											)}
										</div>
										<div className="mb-2 text-sm font-semibold">
											Operating Hours: {timeData.operatingHours.startTime} - {timeData.operatingHours.endTime}
										</div>
									</>
								)}
							</div>

							{/* ANCHOR Special Instructions */}
							<div className="relative pt-3">
								<label for="note" className="block mb-3 font-bold text-green-700 md:text-xl">
									Special Instructions
								</label>
								<textarea
									name="note"
									className="flex items-center w-full px-4 py-3 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-700"
									rows="4"
									placeholder="Special instructions for delivery"
									{...register("specialInstructions", { maxLength: 100 })}
								/>
								{errors.specialInstructions?.type === "maxLength" && (
									<div className="mb-2 text-sm font-medium text-left text-red-500">Special instructions must be below 100 characters</div>
								)}
							</div>

							{/* ANCHOR Place order button */}
							<div className="mt-4">
								<button className="w-full px-6 py-2 text-white transition-colors bg-green-700 rounded hover:bg-green-600">Place Order</button>
							</div>
						</form>
					</div>
					{/* !SECTION  */}

					{/* SECTION Order Summary */}
					<div className="flex flex-col w-full ml-0 md:ml-5 lg:ml-9 lg:w-2/5">
						<div className="pt-12 md:pt-0 2xl:ps-4">
							<h2 className="text-xl font-bold">Order Summary</h2>
							<div className="mt-8">
								<div className="flex flex-col space-y-4">
									{products && (
										<>
											{products.map((p, index) => {
												return (
													<div className="flex space-x-2">
														<div className="p-1 rounded shadow bg-zinc-100">
															<Image src={p.menuItem.productImagesCollection.items[0].url} width={70} height={60} />
														</div>
														<div className="flex-1">
															<h2 className="text-lg font-bold">{p.menuItem.productName}</h2>₱{p.menuItem.productPrice}
														</div>
														<div className="pt-[.20rem] w-10">{`x ${p.quantity}`}</div>
													</div>
												);
											})}
										</>
									)}
								</div>
							</div>
							{products && (
								<div className="flex mt-4">
									<h2 className="text-xl font-bold">Items: {products.length}</h2>
								</div>
							)}
							{order && (
								<div className="flex items-center w-full py-4 text-sm font-semibold border-b border-gray-300 lg:py-5 lg:px-3 text-heading last:border-b-0 last:text-base last:pb-0">
									Subtotal<span className="ml-2">₱{order.total}</span>
								</div>
							)}
							<div className="flex items-center w-full py-4 text-sm font-semibold border-b border-gray-300 lg:py-5 lg:px-3 text-heading last:border-b-0 last:text-base last:pb-0">
								Delivery Fee<span className="ml-2">{watch("type") === "Delivery" ? "₱50" : "-"}</span>
							</div>
							<div className="flex items-center w-full py-4 text-sm font-semibold border-b border-gray-300 lg:py-5 lg:px-3 text-heading last:border-b-0 last:text-base last:pb-0">
								Total<span className="ml-2">₱{watch("type") === "Delivery" ? order.total + 50 : order.total}</span>
							</div>
						</div>
					</div>
					{/* !SECTION */}
				</div>
			)}
		</div>
	);
}

Checkout.layout = "consumer";
