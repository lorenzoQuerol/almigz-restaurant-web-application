import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import useSWR from "swr";

import getCart from "@utils/foodCart/getCart";
import confirmTransaction from "@utils/confirmTransaction";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function CheckoutPage() {
	// Session
	const { data: session, status } = useSession();

	// User
	const [user, setUser] = useState();

	// TEMPORARY - delivery fee
	const delFee = 50;

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

	// Get session email
	useMemo(() => {
		if (session) setEmail(session.user.email);
	}, [session]);

	// Fetch user details via SWR
	const { data, error } = useSWR(`/api/users/${email}`, fetcher);

	// Initialize form values
	useMemo(() => {
		const cart = getCart();
		setOrder(cart);

		if (data) setUser(data.data);
		if (user && cart) {
			setFullName(`${user.firstName} ${user.lastName}`);
			setEmail(user.email);
			setContactNum([user.contactNum, user.altContactNum]);
			setAddress(user.homeAddress);
			setTotalPrice(order.total + delFee);

			// TEMPORARY - test transaction
			setPayMethod("GCash");
			setChange(1000);
			setDeliverTime("Now");
		}
	}, [data, user]);

	// Submit transaction
	const submitTransaction = async (event) => {
		event.preventDefault();

		// Pre-process cart for transaction
		order.data.forEach((item) => {
			delete item.menuItem.category;
			delete item.menuItem.description;
			delete item.menuItem.isAvailable;
			delete item.menuItem.imgUrls;
		});

		// Initialize transaction object
		const transaction = {
			orderStatus: "Confirmed",
			type: type,
			fullName: null,
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

		// Set to null for fields not required in DELIVERY type
		if (type === "Delivery") {
			transaction.storeLocation = null;
			transaction.pickupTime = null;
		}

		// Set to null for fields not required in PICKUP type
		if (type === "Pickup") {
			transaction.address = null;
			transaction.payMethod = null;
			transaction.change = null;
			transaction.deliverTime = null;
		}

		// Send transaction object
		const response = await confirmTransaction(transaction);
	};

	return (
		<>
			CHECKOUT: <br />
			<form onSubmit={submitTransaction}>
				<button>Place Order (Open Receipt)</button>
			</form>
		</>
	);
}
