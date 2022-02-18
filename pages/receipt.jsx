import router from "next/router";
import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import Image from "next/image";
import getStorageValue from "@utils/localStorage/getStorageValue";
import removeStorageValue from "@utils/localStorage/removeStorageValue";
import Loading from "@components/Loading";

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

export default function Receipt(session) {
	// Retrieve transaction from local storage
	const [transaction, setTransaction] = useState(() => {
		const initialValue = getStorageValue("transaction", undefined);
		return initialValue || "";
	});

	// ANCHOR Date formatting
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

	const handleTrackerClick = () => {
		removeStorageValue("foodCart");
		removeStorageValue("transaction");
		removeStorageValue("branch");
		router.replace(`/tracker/${transaction.invoiceNum}`);
	};

	if (!transaction)
		return (
			<div className="mt-10">
				<Loading />
			</div>
		);

	return (
		<div className="px-4 text-gray-800 2xl:container 2xl:mx-auto py-14 md:px-6 xl:px-32 font-rale">
			<div className="flex flex-col items-center justify-center space-y-10 xl:flex-row xl:space-y-0 xl:space-x-8">
				{/* ANCHOR Order summary */}
				<div className="flex flex-col items-start justify-center w-full lg:w-9/12 xl:w-full">
					<div className="w-full mb-1 text-3xl font-bold leading-7 xl:leading-9 md:text-left">Order #{transaction.invoiceNum.toString().padStart(4, "0")}</div>
					<div className="w-full leading-7 text-gray-500 text-md xl:leading-9 md:text-left">{formatDate(transaction.dateCreated)}</div>

					<div className="flex flex-col items-center justify-center w-full mt-8 space-y-4 ">
						{transaction.order &&
							transaction.order.map((item, index) => {
								let foodItem = item.menuItem;
								let imgUrl = foodItem.productImagesCollection[0].items[0].url;

								return (
									<div className="flex items-start justify-start w-full border border-gray-200 md:flex-row md:items-center">
										<div className="w-40 md:w-32">
											{/* <img className="hidden md:block" src="https://i.ibb.co/wWp4m6W/Rectangle-8.png" alt="girl-in-red-dress" />
													<img className="md:hidden " src="https://i.ibb.co/f8pyz8q/Rectangle-8.png" alt="girl-in-red-dress" /> */}
											<Image src={imgUrl} height={1000} width={1000} />
										</div>
										<div className="flex flex-col items-start justify-start w-full p-4 md:justify-between md:items-center md:flex-row md:px-8">
											<div className="flex flex-col items-start justify-start md:flex-shrink-0">
												<h3 className="w-full text-lg font-semibold leading-6 md:text-xl md:leading-5">{foodItem.productName}</h3>
												<div className="flex flex-row items-start justify-start mt-4 space-x-4 md:space-x-6 ">
													<p className="text-sm leading-none sm:text-md">
														Quantity: <span className="">{item.quantity}</span>
													</p>
												</div>
											</div>
											<div className="flex items-center w-full mt-4 md:mt-0 md:justify-end ">
												<p className="text-xl font-semibold leading-5 lg:text-2xl lg:leading-6">₱ {foodItem.productPrice}</p>
											</div>
										</div>
									</div>
								);
							})}
					</div>

					{/* ANCHOR Shipping and pricing details */}

					<div className="flex flex-col items-start justify-start w-full mt-8 space-y-10 xl:mt-10">
						{/* SECTION Additional Details */}
						<div className="flex flex-col items-start justify-between w-full space-y-8 md:flex-row md:w-auto md:space-y-0 md:space-x-14 xl:space-x-8 lg:w-full">
							<div className="flex flex-col items-start justify-start space-y-2">
								<p className="text-base font-semibold leading-4 ">{transaction.type === "Delivery" ? "Address" : "Branch"}</p>
								<p className="text-sm leading-5 ">{transaction.type === "Delivery" ? transaction.address : transaction.branch}</p>
							</div>
							<div className="flex flex-col items-start justify-start space-y-2">
								<p className="text-base font-semibold leading-4 ">Payment Via</p>
								<p className="text-sm leading-5 ">{transaction.type === "Pickup" && transaction.payMethod === "COD" ? "Cash on Pickup" : transaction.payMethod}</p>
							</div>
							<div className="flex flex-col items-start justify-start space-y-2">
								<p className="text-base font-semibold leading-4 ">Method</p>
								<p className="text-sm leading-5 ">{transaction.type}</p>
							</div>
							<div className="flex flex-col items-start justify-start space-y-2">
								<p className="text-base font-semibold leading-4 ">Time</p>
								<p className="text-sm leading-5 ">
									{transaction.type == "Delivery"
										? transaction.deliverTime === "Now"
											? "Now"
											: formatDate(transaction.deliverTime)
										: transaction.pickupTime === "Now"
										? "Now"
										: formatDate(transaction.pickupTime)}
								</p>
							</div>
						</div>
						{/* !SECTION */}

						{/* SECTION Payment details */}
						<div className="flex flex-col w-full space-y-4">
							<div className="flex flex-col items-center justify-center w-full pb-4 space-y-4 border-b border-gray-200">
								{/* ANCHOR Subtotal */}
								<div className="flex justify-between w-full">
									<p className="text-base leading-4 ">Subtotal</p>
									<p className="text-base leading-4 ">₱ {transaction.type === "Delivery" ? transaction.totalPrice - 50 : transaction.totalPrice}</p>
								</div>

								{/* ANCHOR Delivery fee */}
								<div className="flex justify-between w-full">
									<p className="text-base leading-4 ">Delivery</p>
									<p className="text-base leading-4 ">₱ {transaction.type === "Delivery" ? "50" : "-"}</p>
								</div>
							</div>

							{/* ANCHOR Total price */}
							<div className="flex items-center justify-between w-full">
								<p className="text-base font-bold leading-4">Total</p>
								<p className="text-base font-bold leading-4">₱ {transaction.totalPrice}</p>
							</div>
							<p className="mt-5 text-sm text-gray-500">This report is generated automatically and does not serve as an official receipt.</p>
							<div className="flex flex-col items-center justify-center w-full pt-1 space-y-6 md:pt-4 xl:pt-8 md:space-y-8">
								<button
									onClick={handleTrackerClick}
									className="px-10 py-2 font-medium text-white transition-all bg-green-700 border rounded shadow cursor-pointer hover:bg-green-600"
								>
									<a>Proceed to Order Tracker</a>
								</button>
							</div>
						</div>
						{/* !SECTION */}
					</div>
				</div>
			</div>
		</div>
	);
}

Receipt.layout = "consumer";
