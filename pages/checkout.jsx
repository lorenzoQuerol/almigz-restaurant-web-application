import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useSWR from "swr";

import getStorageValue from "@utils/localStorage/getStorageValue";
import confirmTransaction from "@utils/confirmTransaction";
import useLocalStorage from "@utils/localStorage/useLocalStorage";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CheckoutPage() {
	const router = useRouter();

	// TEMPORARY - delivery fee
	const delFee = 50;

	// Session
	const { data: session, status } = useSession();

	// User
	const [user, setUser] = useState();

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
	const [payMethod, setPayMethod] = useState("");
	const [change, setChange] = useState(0);
	const [deliverTime, setDeliverTime] = useState("Now");

	// Pickup details
	const [storeLocation, setStoreLocation] = useState("");
	const [pickupTime, setPickupTime] = useState("Now");

	// Transaction
	const [transaction, setTransaction] = useLocalStorage("transaction", null);

	// Get user data
	const { data, error } = useSWR(`/api/users/${email}`, fetcher);

	// Get cart from local storage
	const cart = getStorageValue("foodCart");

	useEffect(() => {
		// If session is undefined, redirect to sign in page
		if (status === "unauthenticated") router.push("auth/signIn");

		if (session) setEmail(session.user.email);

		if (data) setUser(data.data);
		if (cart) setOrder(cart);
		if (user) {
			setFullName(`${user.firstName} ${user.lastName}`);
			setEmail(user.email);
			setContactNum([user.contactNum, user.altContactNum]);
			setAddress(user.homeAddress);
			setTotalPrice(order.total + delFee);

			// TEMPORARY - test transaction (UI NEEDED)
			setPayMethod("GCash");
			setChange(1000);
			setDeliverTime("Now");
		}
	}, [session, status, email, data, user]);

	// Handle submit transaction
	const submitTransaction = async (event) => {
		event.preventDefault();

		// Initialize transaction object
		const transaction = {
			invoiceNum: 1, // DEVELOPER TODO: This should increment based on the number of documents in the database
			dateCreated: new Date(),
			orderStatus: 0, // Initial "incoming order" status
			type: type,
			fullName: fullName,
			email: email,
			contactNum: contactNum,
			order: order.data,
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
			router.push("/receipt");
		} else {
			// DESIGNER TODO: Handle here if unsuccessful checkout (i.e., missing values).
		}
	};

	if (status === "authenticated") {
		return (
			<>
				CHECKOUT: <br />
				<form onSubmit={submitTransaction}>
					<button>Place Order (Open Receipt)</button>
				</form>
			</>
		);
	} else {
		return <h1>Loading...</h1>;
	}
}
