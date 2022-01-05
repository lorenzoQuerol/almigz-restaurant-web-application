import router from "next/router";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import getStorageValue from "@utils/localStorage/getStorageValue";
import removeStorageValue from "@utils/localStorage/removeStorageValue";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// MOCK DATA
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
let transaction = {
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
	payMethod: "Cash on Delivery",
	change: "810",
	deliverTime: "Now",
	storeLocation: "",
	pickupTime: "",
	reason: "",
};

//SAMPLE: DEL-GCASH (R)
let transactionSample2 = {
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
let transactionSample3 = {
	invoiceNum: 1,
	dateCreated: "01/05/2022 06:40:40",
	orderStatus: 0,
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

export default function Receipt() {
	// Get session
	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push("auth/signIn");
		},
	});

	// Retrieve transaction from local storage
	const [transaction, setTransaction] = useState(() => {
		const initialValue = getStorageValue("transaction", undefined);
		return initialValue || "";
	});

	// Format Date object
	const date = new Date(transaction.dateCreated);
	const formattedDate = `${months[date.getMonth()]} ${date.getDay()}, ${date.getFullYear()} @ ${date.getHours()}:${date.getMinutes()}`;

	// Delivery Fee & Payment Method (K)
	let delFee, payMethod, total, cash, change;
	if (transaction.type === "Delivery") {
		delFee = 50; // TEMPORARY - delivery fee
		payMethod = transaction.payMethod;
	} else if (transaction.type === "Pickup") {
		delFee = 0;
		payMethod = "(on pickup)";
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

	// useEffect(() => {
	// 	// If session is undefined, redirect to sign in page
	// 	if (!session) router.push("auth/signIn");
	// }, [session]);

	// If 'Proceed to Order Tracker' is clicked:
	// * clear transaction and food cart from local storage
	// * redirect to tracker page
	const handleTrackerClick = (event) => {
		removeStorageValue("foodCart");
		removeStorageValue("transaction");
		router.push("/tracker");
	};

	if (status === "loading") return <h1>Loading...</h1>;

	return (
		<div className="flex flex-col w-1/2 mt-5">
			<div className="p-5 pb-3 bg-gray-100 border border-gray-200 shadow-xl">
				<h1 className="text-4xl font-bold text-black font-rale">Order #{transaction.invoiceNum.toString().padStart(4, "0")}</h1>
				<p className="mt-1 ml-1 text-sm text-gray-500">Date: {formattedDate}</p>
			</div>

			<div className="p-5 bg-white border border-gray-200 shadow-xl">
				<div className="flex justify-between">
					<table className="w-full mt-3 text-black divide-y divide-gray-500 table-auto font-rale">
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
									<td className="py-3 font-sans">{product.quantity}</td>
									<td className="">{product.menuItem.productName}</td>
									<td className="font-sans">{product.menuItem.productPrice}</td>
									<td className="font-sans">{product.menuItem.productPrice * product.quantity}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="px-4 pt-8 pb-6 border-t border-gray-200 sm:px-6">
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
				<div className="px-4 py-6 border-t border-gray-200 sm:px-6">
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
				<p className="mt-5 text-sm text-gray-500">This report is generated automatically and does not serve as an official receipt.</p>
			</div>
			<button
				className="self-center p-4 m-5 font-normal text-white bg-green-500 rounded-lg pl-7 pr-7 hover:font-medium hover:bg-green-300"
				onClick={() => handleTrackerClick()}
			>
				Proceed to Order Tracker
			</button>
		</div>
	);
}
