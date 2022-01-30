import router from "next/router";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import Transaction from "@models/TransactionModel";
import createConnection from "@utils/mongoDBConnection";

//sample order array (R)
const products = [
	{
		quantity: 3,
		menuItem: {
			productName: "Pork Binagoongan",
			productPrice: 80.0,
		},
	},
	{
		quantity: 1,
		menuItem: {
			productName: "Malabon (Small)",
			productPrice: 380.0,
		},
	},
	{
		quantity: 2,
		menuItem: {
			productName: "Malabon Medium",
			productPrice: 80.0,
		},
	},
	{
		quantity: 4,
		menuItem: {
			productName: "Sizzling Sisig",
			productPrice: 90.0,
		},
	},
];

//SAMPLE: DEL-COD (R)
var transSample1 = {
	invoiceNum: 1,
	dateCreated: "01/05/2022 06:40:40",
	orderStatus: 3,
	type: "Delivery",
	fullName: "John Doe",
	email: "johndoe@gmail.com",
	contactNum: ["+639123456789", "+639012345678"],
	order: products,
	specialInstructions:
		"Lorem ipsum dolor sit amet. Hic sunt reiciendis et necessitatibus magnam est odio nihil qui sint dolores quo libero vitae et nihil repudiandae et nobis mollitia? Eos voluptatibus deleniti non molestias laboriosam eum impedit quidem ad sunt nesciunt ut dolores corrupti et eius fugit. Et veritatis voluptas vel accusantium praesentium qui nobis saepe et nostrum sint.",
	totalPrice: 1190.0,
	address: "2401 Taft Ave, Malate, Manila, 1004 Metro Manila",
	payMethod: "Cash on Delivery",
	change: "810",
	deliverTime: "Now",
	storeLocation: "",
	pickupTime: "",
	reason: "A reason...",
};

//SAMPLE: DEL-GCASH (R)
var transSample2 = {
	invoiceNum: 1,
	dateCreated: "01/05/2022 06:40:40",
	orderStatus: 0,
	type: "Delivery",
	fullName: "John Doe",
	email: "johndoe@gmail.com",
	contactNum: ["+639123456789", "+639012345678"],
	order: products,
	specialInstructions:
		"Lorem ipsum dolor sit amet. Hic sunt reiciendis et necessitatibus magnam est odio nihil qui sint dolores quo libero vitae et nihil repudiandae et nobis mollitia? Eos voluptatibus deleniti non molestias laboriosam eum impedit quidem ad sunt nesciunt ut dolores corrupti et eius fugit. Et veritatis voluptas vel accusantium praesentium qui nobis saepe et nostrum sint.",
	totalPrice: 1190.0,
	address: "2401 Taft Ave, Malate, Manila, 1004 Metro Manila",
	payMethod: "GCash",
	change: "",
	deliverTime: "11:00 AM",
	storeLocation: "",
	pickupTime: "",
};

//SAMPLE: PICKUP (R)
var transSample3 = {
	invoiceNum: 1,
	dateCreated: "01/05/2022 06:40:40",
	orderStatus: 4,
	type: "Pickup",
	fullName: "John Doe",
	email: "johndoe@gmail.com",
	contactNum: ["+639123456789", "+639012345678"],
	order: products,
	specialInstructions:
		"Lorem ipsum dolor sit amet. Hic sunt reiciendis et necessitatibus magnam est odio nihil qui sint dolores quo libero vitae et nihil repudiandae et nobis mollitia? Eos voluptatibus deleniti non molestias laboriosam eum impedit quidem ad sunt nesciunt ut dolores corrupti et eius fugit. Et veritatis voluptas vel accusantium praesentium qui nobis saepe et nostrum sint.",
	totalPrice: 1190.0,
	address: "2401 Taft Ave, Malate, Manila, 1004 Metro Manila",
	payMethod: "",
	change: "",
	deliverTime: "",
	storeLocation: "Branch 1",
	pickupTime: "12:00 PM",
};

// Status Conditional Rendering Variables (K)
const statFlags = new Array(6);
statFlags.fill(false);
const statColors = ["bg-red-200", "bg-yellow-200", "bg-[#CF9FFF]", "bg-blue-200", "bg-green-200", "bg-gray-200"];

export async function getServerSideProps(context) {
	const { params } = context;
	const { order } = params;

	await createConnection();
	const response = JSON.stringify(await Transaction.findOne({ invoiceNum: order }));

	return {
		props: JSON.parse(response),
	};
}

export default function Order(props) {
	// Transaction object
	const [transaction, setTransaction] = useState(props);

	// Reason for cancellation
	const [reason, setReason] = useState("");

	// "Changes saved." message for reason text input
	const [message, setMessage] = useState("");

	// Get session
	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			router.replace("/auth/signIn");
		},
	});

	// Once session is available, check if the session has the admin role
	useEffect(() => {
		if (session) if (!session.user.isAdmin) router.replace("/");
	}, [session]);

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

	/**
	 * DEV NOTE (Enzo):
	 * It would be more optimal (if possible) if we only have one API call for both status change and reason for cancellation (if any).
	 */
	const updateStatus = async (value) => {
		// DEV NOTE (Enzo): I assumed the same transaction object will be directly modified -
		const response = await axios.put(`/api/transactions/${transaction.invoiceNum}`, transaction);

		/* FOR TESTING ONLY (R) */
		transSample1.orderStatus = parseInt(value);
		// transSample2.orderStatus = parseInt(value);
		// transSample3.orderStatus = parseInt(value);

		router.push("/orders/1"); //temporary - reload same order page
	};

	const saveReason = async (value) => {
		// DEV NOTE (Enzo): I assumed the same transaction object will be directly modified
		const response = await axios.put(`/api/transactions/${transaction.invoiceNum}`, transaction);

		setReason(value);
		transSample1.reason = value; //for testing only (R)
		//if (success)
		setMessage("Changes saved.");
	};

	if (status === "loading") return <h1>Loading...</h1>;

	// Page will only render if the user is an admin
	if (session.user.isAdmin) {
		return (
			<div className={`w-screen flex flex-col`}>
				<div className="flex flex-wrap flex-row w-auto items-start justify-center m-5">
					<div className="flex flex-col w-full lg:w-1/2">
						<div className="flex flex-col border rounded-md">
							<div className="flex flex-wrap items-center justify-between p-5 pb-3 bg-gray-100 rounded-t shadow-lg">
								<div className="">
									<h1 className="text-4xl font-bold text-black font-rale">Order #{transaction.invoiceNum.toString().padStart(4, "0")}</h1>
									<p className="mt-1 ml-1 text-sm text-gray-500">Date: {transaction.dateCreated}</p>
								</div>
								{statFlags[0] && <div className="flex mt-1 md:w-max text-center items-center px-1 text-lg font-semibold text-white bg-red-500 rounded-lg">INCOMING ORDER</div>}
								{statFlags[1] && <div className="flex mt-1 md:w-max text-center items-center px-1 text-lg font-semibold text-white bg-yellow-500 rounded-lg">ORDER PROCESSED</div>}
								{statFlags[2] && <div className="px-1 mt-1 md:w-max text-center bg-[#9a37c4] text-white font-semibold text-lg flex items-center rounded-lg">ORDER IN PREPARATION</div>}
								{statFlags[3] && (
									<div className="flex md:w-max text-center items-center px-1 mt-2 text-lg font-semibold text-white bg-blue-500 rounded-lg">
										{delpickFlag && <p className="w-max">ORDER IN DELIVERY</p>}
										{!delpickFlag && <p className="w-max">READY FOR PICK UP</p>}
									</div>
								)}
								{statFlags[4] && <div className="flex mt-1 md:w-max text-center items-center px-1 text-lg font-semibold text-white bg-green-500 rounded-lg">COMPLETED ORDER</div>}
								{statFlags[5] && <div className="flex mt-1 md:w-max text-center items-center px-1 text-lg font-semibold text-white bg-gray-500 rounded-lg">CANCELLED ORDER</div>}
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
						<div className="flex flex-wrap flex-row mb-2 items-center justify-between mt-2 bg-white border rounded-md shadow-lg">
							<div className="p-5 px-4 w-full lg:w-1/2 sm:px-6">
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
							<div className="lg:w-1/3 w-full p-5 divide-y">
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
					<div className="flex flex-col lg:w-1/4 p-3 w-full lg:mx-3 text-black bg-white border divide-y rounded-md shadow-lg">
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
						<div className="flex self-center align-center flex-wrap justify-center gap-4">
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
						<div className="flex self-center align-center flex-wrap justify-center gap-4">
							<button
								className="self-center p-4 font-normal text-white bg-green-500 rounded-lg pl-7 pr-7 hover:font-medium hover:bg-green-300"
								onClick={() => updateStatus(2)}
							>
								Prepare Order
							</button>
						</div>
					)}
					{statFlags[2] && (
						<div className="flex self-center align-center flex-wrap justify-center gap-4">
							<button
								className="self-center p-4 font-normal text-white bg-green-500 rounded-lg pl-7 pr-7 hover:font-medium hover:bg-green-300"
								onClick={() => updateStatus(3)}
							>
								Ready for Deliver / Pickup
							</button>
						</div>
					)}
					{statFlags[3] && (
						<div className="flex self-center align-center flex-wrap justify-center gap-4">
							<button
								className="self-center p-4 font-normal text-white bg-green-500 rounded-lg pl-7 pr-7 hover:font-medium hover:bg-green-300"
								onClick={() => updateStatus(4)}
							>
								Complete Order
							</button>
						</div>
					)}
					{statFlags[4] && (
						<div className="flex self-center align-center flex-wrap justify-center gap-4">
							<div className="text-xl font-bold text-center text-black">
								ORDER STATUS: <span className="text-green-600">COMPLETED</span>{" "}
							</div>
						</div>
					)}
					{statFlags[5] && (
						<div className="px-4 flex self-center align-center flex-wrap justify-center flex-col w-full lg:w-1/2">
							<div className="text-xl mb-4 font-bold text-center text-black">
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
			</div>
		);
	} else {
		return <h1>Loading...</h1>;
	}
}
