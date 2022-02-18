import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import useSWR from "swr";
import useAxios from "axios-hooks";
import axios from "axios";
import Loading from "@components/Loading";

const status = ["INCOMING", "PROCESSED", "IN PREPARATION", "READY FOR PICKUP/DELIVERY", "COMPLETED ORDER", "CANCELLED ORDER"];
const headers = ["Quantity", "Item Name", "Price per Piece", "Total Price"];
const months = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "August", "Sept.", "Oct.", "Nov.", "Dec."];
const statColors = ["bg-red-200", "bg-yellow-200", "bg-[#CF9FFF]", "bg-blue-200", "bg-green-200", "bg-gray-200"];
const statTextColors = ["text-red-900", "text-yellow-900", "text-[#320064]", "text-blue-900", "text-green-900", "text-gray-900"];

export async function getServerSideProps(context) {
	const session = await getSession(context);

	if (!session)
		return {
			redirect: {
				permanent: false,
				destination: "/signin",
			},
		};

	if (!session.user.isAdmin)
		return {
			redirect: {
				permanent: false,
				destination: "/",
			},
		};

	return {
		props: session,
	};
}

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function OrderPage(session) {
	const router = useRouter();
	const { data: delFeeData, error: delFeeError } = useSWR("/api/delivery", fetcher); // NOTE Delivery fee
	const [{ data, loading, error }, refetch] = useAxios(`/api/transactions/${router.query.order}`);

	const [transaction, setTransaction] = useState({});
	const [reason, setReason] = useState("");
	const [message, setMessage] = useState("");

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		if (data) setTransaction(data.transaction);
		if (transaction) setValue("status", String(transaction.orderStatus));
	}, [data, transaction]);

	// ANCHOR Update Status
	const updateStatus = async (updated) => {
		let temp = transaction;
		temp.orderStatus = Number(updated.status);
		temp.lastUpdated = new Date();

		if (temp.orderStatus == 5) temp.reasonForCancel = updated.reasonForCancel;
		else temp.reasonForCancel = "";

		setTransaction(temp);

		// Update both user history and transactions
		const transRes = await axios.put(`/api/transactions/${transaction.invoiceNum}`, transaction);
		const userRes = await axios.put(`/api/history/${transaction.email}/${transaction.invoiceNum}`, transaction);

		// Refetch page to update status
		refetch();
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
		return `${formatDate} @ ${time}`;
	};

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<div className="text-gray-800 font-rale">
					<div className="flex flex-col mb-2 text-4xl font-bold w-fit sm:flex-row sm:items-center">
						<div className="mb-2">Order #{data.transaction.invoiceNum.toString().padStart(4, "0")}</div>
						<div className={`sm:ml-5 p-1 text-center px-5 text-lg rounded ${statColors[transaction.orderStatus]} ${statTextColors[transaction.orderStatus]}`}>
							{status[transaction.orderStatus]}
						</div>
					</div>
					<div className="mb-2 text-gray-600 text-md">Date Created: {formatDate(transaction.dateCreated)}</div>

					<div className="flex justify-between w-full mb-5">
						<div className="flex flex-col items-start w-full bg-white rounded shadow lg:flex-row lg:items-center">
							<div className="w-full h-full lg:w-2/3 ">
								<table className="min-w-full bg-white">
									<thead>
										<tr className="w-full h-16 py-8 border-b border-gray-300">
											{headers.map((item, index) => {
												return <th className="px-2 text-sm font-semibold leading-4 tracking-normal text-left sm:px-6">{item}</th>;
											})}
										</tr>
									</thead>
									<tbody>
										{transaction.order?.map((item, index) => {
											return (
												<tr className="text-base border-b border-gray-300 h-14">
													<td className="px-2 leading-4 tracking-normal whitespace-no-wrap sm:px-6">{item.quantity}</td>
													<td className="px-2 leading-4 tracking-normal whitespace-no-wrap sm:px-6">{item.menuItem.productName}</td>
													<td className="px-2 leading-4 tracking-normal whitespace-no-wrap sm:px-6">{item.menuItem.productPrice}</td>
													<td className="px-2 leading-4 tracking-normal whitespace-no-wrap sm:px-6">{item.menuItem.productPrice * item.quantity}</td>
												</tr>
											);
										})}
									</tbody>
								</table>
								<div className="w-full p-5 px-4 sm:px-6">
									<h1 className="font-semibold text-normal">Payment Method: {transaction.payMethod}</h1>
									<div className="flex justify-between mt-3 text-base ">
										<p>Cash</p>
										<p>{transaction.payMethod == "GCash" ? "-" : `₱${transaction.change}`}</p>
									</div>
									<div className="flex justify-between my-2 text-base text-gray-500 text-medium">
										<p>Total</p>
										<p>-₱{transaction.totalPrice}</p>
									</div>
									<div className="flex justify-between text-base">
										<p>Change</p>
										<p>{transaction.payMethod == "GCash" ? "-" : `₱${transaction.change - transaction.totalPrice}`}</p>
									</div>
								</div>
								<div className="w-full p-5 divide-y">
									<div className="flex justify-between py-2 text-base font-medium">
										<p>Subtotal</p>
										<p>{transaction.type == "Delivery" ? `₱${transaction.totalPrice - delFeeData?.deliveryFeeData.delFee}` : `₱${transaction.totalPrice}`}</p>
									</div>
									<div className="flex justify-between py-2 text-base text-gray-500 text-medium">
										<p>Delivery Fee</p>
										<p>{transaction.type == "Delivery" ? `₱${delFeeData.deliveryFeeData.delFee}` : "-"}</p>
									</div>
									<div className="flex justify-between py-2 text-base font-medium ">
										<p>Total</p>
										<p>₱{transaction.totalPrice}</p>
									</div>
								</div>
							</div>
							<div className="w-full h-full bg-gray-100 border-t lg:w-1/3 lg:border-t-0 lg:border-r lg:border-l lg:rounded-r">
								<div className="p-2">
									<div className={`p-2 text-sm ${statColors[transaction.orderStatus]} ${statTextColors[transaction.orderStatus]}`}>
										<p className="font-bold">For {transaction.type}</p>
										{transaction.type === "Pickup" && (
											<p>
												<span className="font-bold">Store:</span> {transaction.branch}
											</p>
										)}
										{transaction.deliverTime ? (
											<p>
												<span className="font-bold">Deliver Time:</span> {transaction.deliverTime === "Now" ? "Now" : formatDate(transaction.deliverTime)}
											</p>
										) : (
											<p>
												<span className="font-bold">Pickup Time:</span> {transaction.pickupTime === "Now" ? "Now" : formatDate(transaction.pickupTime)}
											</p>
										)}
									</div>
									<p className="pt-3 font-bold">User Details</p>
									<div className="px-2 text-sm font-medium divide-y">
										<div className="pt-1">
											<p className="font-bold">Full Name</p>
											<p className="py-1">{transaction.fullName}</p>
										</div>
										{transaction.type == "Delivery" && <p className="py-1">{transaction.email}</p>}
										<div className="py-1">
											<p className="font-bold">Contact Information</p>
											<p className="py-1">{`${transaction.contactNum?.[0]}`}</p>
											{transaction.contactNum?.length == 2 && <p>{transaction.contactNum[1]}</p>}
										</div>

										{transaction.type == "Delivery" && <p className="py-1">{transaction.address}</p>}
										<div className="py-1">
											<p className="font-bold">Special Instructions</p>
											<p>{transaction.specialInstructions == "" ? "None" : transaction.specialInstructions}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* ANCHOR Settings */}
					<div className="flex flex-col">
						<form onSubmit={handleSubmit(updateStatus)}>
							<div className="flex-row mb-5">
								<span className="font-bold">Update Status</span>
								<select
									{...register("status")}
									className="max-w-xs px-2 py-1 ml-5 border rounded w-fit md:w-1/2 lg:w-full focus:border-1 focus:outline-none focus:border-green-700"
								>
									<option value={0}>Incoming</option>
									<option value={1}>Processed</option>
									<option value={2}>Preparing Order</option>
									<option value={3}>Ready for Pickup/Delivery</option>
									<option value={4}>Complete Order</option>
									<option value={5}>Cancel Order</option>
								</select>
							</div>
							{watch("status") == 5 && (
								<>
									<textarea
										name="note"
										className="flex items-center w-full px-4 py-3 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-700"
										rows="4"
										placeholder="Reason for Cancellation"
										{...register("reasonForCancel", { required: Number(watch("status")) == 5 ? true : false, maxLength: 100 })}
									/>
									{errors.reasonForCancel?.type == "required" && (
										<div className="mb-2 text-sm font-medium text-left text-red-500">Please write a reason for cancellation</div>
									)}
								</>
							)}
							{Number(watch("status")) !== transaction.orderStatus && (
								<div className="flex justify-center">
									<button
										type="submit"
										className="w-full px-8 py-2 text-white transition duration-150 ease-in-out bg-yellow-700 border rounded sm:w-1/3 md:w-1/2 text-md hover:bg-yellow-600 focus:outline-none"
									>
										Update
									</button>
								</div>
							)}
						</form>

						<div className="flex justify-center">
							<Link href="/admin/transactions">
								<button className="w-full px-8 py-2 text-white transition duration-150 ease-in-out bg-green-700 border rounded sm:w-1/3 md:w-1/2 text-md hover:bg-green-600 focus:outline-none">
									Go Back to Transactions
								</button>
							</Link>
						</div>
					</div>
				</div>
			)}
		</>
	);

	return (
		<div>
			{loading ? (
				<Loading />
			) : (
				<>
					<div className="flex flex-row flex-wrap items-start justify-center w-auto m-5">
						<div className="flex flex-col w-full">
							<div className="flex flex-col border rounded">
								<div className="flex flex-wrap items-center justify-between p-5 pb-3 bg-gray-100 rounded-t shadow">
									<div className="">
										<h1 className="text-4xl font-bold text-black font-rale">Order #{data.transaction.invoiceNum.toString().padStart(4, "0")}</h1>
										<p className="mt-1 ml-1 text-sm text-gray-500">Date: {transaction.type === "Now" ? "Now" : formatDate(transaction.dateCreated)}</p>
									</div>
									{statFlags[0] && (
										<div className="flex items-center px-1 mt-1 text-lg font-semibold text-center text-white bg-red-500 rounded-lg md:w-max">
											INCOMING ORDER
										</div>
									)}
									{statFlags[1] && (
										<div className="flex items-center px-1 mt-1 text-lg font-semibold text-center text-white bg-yellow-500 rounded-lg md:w-max">
											ORDER PROCESSED
										</div>
									)}
									{statFlags[2] && (
										<div className="px-1 mt-1 md:w-max text-center bg-[#9a37c4] text-white font-semibold text-lg flex items-center rounded-lg">
											ORDER IN PREPARATION
										</div>
									)}
									{statFlags[3] && (
										<div className="flex items-center px-1 mt-2 text-lg font-semibold text-center text-white bg-blue-500 rounded-lg md:w-max">
											{delpickFlag && <p className="w-max">ORDER IN DELIVERY</p>}
											{!delpickFlag && <p className="w-max">READY FOR PICK UP</p>}
										</div>
									)}
									{statFlags[4] && (
										<div className="flex items-center px-1 mt-1 text-lg font-semibold text-center text-white bg-green-500 rounded-lg md:w-max">
											COMPLETED ORDER
										</div>
									)}
									{statFlags[5] && (
										<div className="flex items-center px-1 mt-1 text-lg font-semibold text-center text-white bg-gray-500 rounded-lg md:w-max">
											CANCELLED ORDER
										</div>
									)}
								</div>
								<div className="p-5 pt-4 bg-white rounded-b shadow-lg">
									<div className="flex justify-between">
										<table className="w-full text-black divide-y divide-gray-500 table-auto font-rale">
											<thead>
												<tr>
													<th className="py-2">Quantity</th>
													<th>Item Name</th>
													<th>Price per piece</th>
													<th>Total Price</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-gray-200">
												{data.transaction.order.map((product) => (
													<tr key={product.menuItem.productName} className="py-3 text-center">
														<td className="py-1 font-sans">{product.quantity}</td>
														<td className="">{product.menuItem.productName}</td>
														<td className="font-sans">{product.menuItem.productPrice}</td>
														<td className="font-sans">{product.menuItem.productPrice * product.quantity}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<div className="flex flex-row flex-wrap items-center justify-between mt-2 mb-2 bg-white border rounded-md shadow-lg">
								<div className="w-full p-5 px-4 lg:w-1/2 sm:px-6">
									<h1 className="font-semibold text-gray-900 text-normal">Payment Method: {payMethod}</h1>
									<div className="flex justify-between mt-3 text-base text-gray-900">
										<p>Cash</p>
										<p>{cash}</p>
									</div>
									<div className="flex justify-between my-2 text-base text-gray-400 text-medium">
										<p>Total</p>
										<p>-{total}</p>
									</div>
									<div className="flex justify-between text-base text-gray-900">
										<p>Change</p>
										<p>{change}</p>
									</div>
								</div>
								<div className="w-full p-5 divide-y lg:w-1/3">
									<div className="flex justify-between text-base font-medium text-gray-900">
										<p>Subtotal</p>
										<p>P {transaction.totalPrice - delFee}</p>
									</div>
									<div className="flex justify-between my-3 text-base text-gray-500 text-medium">
										<p>Delivery Fee</p>
										<p>P {delFee}</p>
									</div>
									<div className="flex justify-between my-1 text-xl font-medium text-gray-900">
										<p>Total</p>
										<p>P {transaction.totalPrice}</p>
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-col w-full p-3 text-black bg-white border divide-y rounded lg:w-1/4 lg:mx-3">
							{/* For DELIVERY */}
							{delpickFlag && (
								<div className={`flex flex-col justify-center text-center ${statColors[transaction.orderStatus]}`}>
									<b>For DELIVERY</b>
									Delivery Time: {transaction.deliverTime === "Now" ? "Now" : formatDate(transaction.deliverTime)}
								</div>
							)}
							{!delpickFlag && (
								<div className={`flex flex-col justify-center text-center ${statColors[transaction.orderStatus]}`}>
									<b>For PICK UP</b>
									Store: {transaction.storeLocation}
									<br />
									Pick Up Time: {transaction.pickupTime === "Now" ? "Now" : formatDate(transaction.pickupTime)}
								</div>
							)}
							<div className="flex flex-col py-2 pb-10">
								<b> {transaction.fullName}</b>
								{transaction.email}
								{data.transaction.contactNum.map((num) => (
									<span>
										{num}
										<br />
									</span>
								))}
								{transaction.address}
								<br />
							</div>
							<div className="flex flex-col pt-2 text-sm font-light leading-normal text-gray-400">
								<span className="italic font-medium">Special Instructions</span>
								<br />
								<span>{transaction.specialInstructions}</span>
							</div>
						</div>
					</div>
					{/* <div className={`sticky left-0 bottom-0 bg-white w-full shadow-${col}`}> */}
					<div className={`flex-col w-full flex justify-center p-3 mb-5`}>
						{statFlags[0] && (
							<div className="flex flex-wrap self-center justify-center gap-4 align-center">
								<button
									className="self-center p-4 font-normal text-white bg-green-500 rounded-lg pl-7 pr-7 hover:font-medium hover:bg-green-300"
									onClick={() => updateStatus(1)}
								>
									Accept Order
								</button>
								<button
									className="self-center p-4 font-normal text-white bg-red-500 rounded-lg pl-7 pr-7 hover:font-medium hover:bg-red-300"
									onClick={() => updateStatus(5)}
								>
									Cancel Order
								</button>
							</div>
						)}
						{statFlags[1] && (
							<div className="flex flex-wrap self-center justify-center gap-4 align-center">
								<button
									className="self-center p-4 font-normal text-white bg-green-500 rounded-lg pl-7 pr-7 hover:font-medium hover:bg-green-300"
									onClick={() => updateStatus(2)}
								>
									Prepare Order
								</button>
							</div>
						)}
						{statFlags[2] && (
							<div className="flex flex-wrap self-center justify-center gap-4 align-center">
								<button
									className="self-center p-4 font-normal text-white bg-green-500 rounded-lg pl-7 pr-7 hover:font-medium hover:bg-green-300"
									onClick={() => updateStatus(3)}
								>
									Ready for Deliver / Pickup
								</button>
							</div>
						)}
						{statFlags[3] && (
							<div className="flex flex-wrap self-center justify-center gap-4 align-center">
								<button
									className="self-center p-4 font-normal text-white bg-green-500 rounded-lg pl-7 pr-7 hover:font-medium hover:bg-green-300"
									onClick={() => updateStatus(4)}
								>
									Complete Order
								</button>
							</div>
						)}
						{statFlags[4] && (
							<div className="flex flex-wrap self-center justify-center gap-4 align-center">
								<div className="text-xl font-bold text-center text-black">
									ORDER STATUS: <span className="text-green-600">COMPLETED</span>{" "}
								</div>
							</div>
						)}
						{statFlags[5] && (
							<div className="flex flex-col flex-wrap self-center justify-center w-full px-4 align-center lg:w-1/2">
								<div className="mb-4 text-xl font-bold text-center text-black">
									ORDER STATUS: <span className="text-red-600">CANCELLED</span>{" "}
								</div>
								<label>Remarks/Reason:</label>
								<textarea
									contentEditable="true"
									suppressContentEditableWarning={true}
									className="p-1 border focus:text-black"
									value={reason}
									onChange={(e) => setReason(e.target.value)}
								>
									{transaction.reason}
								</textarea>
								<button onClick={saveReason} className="px-2 py-3 font-bold text-white bg-green-700">
									Save
								</button>
								<p className="my-1 text-sm italic tracking-wider text-center text-green-500 bg-green-100">{message}</p>
							</div>
						)}
						<Link href="/admin/transactions">
							<button className="px-8 py-2 text-sm text-white transition duration-150 ease-in-out bg-green-700 border rounded hover:bg-yellow-600 focus:outline-none">
								Go Back to Transactions
							</button>
						</Link>
					</div>
				</>
			)}
		</div>
	);
}

OrderPage.layout = "admin";
