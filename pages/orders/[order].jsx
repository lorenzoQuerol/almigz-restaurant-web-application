import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import useAxios from "axios-hooks";
import axios from "axios";
import Loading from "@components/Loading";

// Status Conditional Rendering Variables (K)
const statFlags = new Array(6);
statFlags.fill(false);
const statColors = ["bg-red-200", "bg-yellow-200", "bg-[#CF9FFF]", "bg-blue-200", "bg-green-200", "bg-gray-200"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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

export default function Order(session) {
	const router = useRouter();
	const [{ data, loading, error }, refetch] = useAxios(`/api/transactions/${router.query.order}`);

	// Transaction object
	const [transaction, setTransaction] = useState({});

	// Reason for cancellation
	const [reason, setReason] = useState("");

	useEffect(() => {
		if (data) setTransaction(data.transaction);
	}, [data]);

	// delpickFlag: true (Delivery), false (Pickup)
	let delFee, payMethod, total, cash, change, delpickFlag;

	// Delivery Fee & Payment Method (K)
	if (transaction.type === "Delivery") {
		delFee = 50; //temporary
		payMethod = transaction.payMethod;
		delpickFlag = true;
	} else if (transaction.type === "Pickup") {
		delFee = 0;
		payMethod = "(on pickup)";
		delpickFlag = false;
	}

	// Set total, cash, and change values (K)
	if (payMethod === "Cash on Delivery") {
		total = transaction.totalPrice;
		change = transaction.change;
		cash = parseInt(total) + parseInt(change);
	} else if (payMethod === "GCash" || payMethod === "(on pickup)") {
		change = "-";
		cash = "-";
		total = "";
	}

	/* Set Status Conditional Rendering Flag (K) */
	statFlags.fill(false);
	statFlags[transaction.orderStatus] = true;

	const updateStatus = async (value) => {
		let temp = transaction;
		temp.orderStatus = value;
		temp.lastUpdated = new Date();
		setTransaction(temp);

		// Update both user history and transactions
		const transRes = await axios.put(`/api/transactions/${transaction.invoiceNum}`, transaction);
		const userRes = await axios.put(`/api/history/${transaction.email}/${transaction.invoiceNum}`, transaction);

		// Refetch page to update status
		refetch();
	};

	const saveReason = async (value) => {
		const response = await axios.put(`/api/transactions/${transaction.invoiceNum}`, transaction);

		setReason(value);
		setMessage("Changes saved.");
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
		<div className={`w-full flex flex-col`}>
			{loading ? (
				<Loading />
			) : (
				<>
					<div className="flex flex-row flex-wrap items-start justify-center w-auto m-5">
						<div className="flex flex-col w-full lg:w-1/2">
							<div className="flex flex-col border rounded-md">
								<div className="flex flex-wrap items-center justify-between p-5 pb-3 bg-gray-100 rounded-t shadow-lg">
									<div className="">
										<h1 className="text-4xl font-bold text-black font-rale">Order #{transaction.invoiceNum.toString().padStart(4, "0")}</h1>
										<p className="mt-1 ml-1 text-sm text-gray-500">Date: {transaction.dateCreated}</p>
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
												{transaction.order.map((product) => (
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
						<div className="flex flex-col w-full p-3 text-black bg-white border divide-y rounded-md shadow-lg lg:w-1/4 lg:mx-3">
							{/* For DELIVERY */}
							{delpickFlag && (
								<div className={`flex flex-col justify-center text-center ${statColors[transaction.orderStatus]}`}>
									<b>For DELIVERY</b>
									Delivery Time: {transaction.deliverTime}
								</div>
							)}
							{!delpickFlag && (
								<div className={`flex flex-col justify-center text-center ${statColors[transaction.orderStatus]}`}>
									<b>For PICK UP</b>
									Store: {transaction.storeLocation}
									<br />
									Pick Up Time: {transaction.pickupTime}
								</div>
							)}
							<div className="flex flex-col py-2 pb-10">
								<b> {transaction.fullName}</b>
								{transaction.email}
								{transaction.contactNum.map((num) => (
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
									onChange={(e) => saveReason(e.target.value)}
								>
									{transaction.reason}
								</textarea>
								<p className="my-1 text-sm italic tracking-wider text-center text-green-500 bg-green-100">{message}</p>
							</div>
						)}
						<span className="text-center text-black">
							Go to{" "}
							<span className="self-center font-semibold underline hover:text-green-700">
								<Link href="/orders"> DASHBOARD</Link>
							</span>
						</span>
					</div>
				</>
			)}
		</div>
	);
}
