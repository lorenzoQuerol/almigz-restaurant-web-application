import React, { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import useAxios from "axios-hooks";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import Loading from "@components/Loading";
import useInterval from "@utils/useInterval";

import ReceiveIcon from "@public/receiver.png";
import ProcessIcon from "@public/ethics.png";
import PrepareIcon from "@public/cooking.png";
import TruckIcon from "@public/truck.png";
import CheckIcon from "@public/check.png";
import CancelIcon from "@public/delete.png";
import PickupIcon from "@public/location.png";
import { useRouter } from "next/router";
import { set } from "@mongoosejs/double";

// Text and icons for delivery
const statusIconsDelivery = [ReceiveIcon, ProcessIcon, PrepareIcon, TruckIcon, CheckIcon, CancelIcon];
const statusTextDelivery = ["Order Submitted!", "Order Processed!", "In Preparation!", "In Transit!", "Order Complete!", "Order Cancelled"];

// Text and icons for pickup
const statusIconsPickup = [ReceiveIcon, ProcessIcon, PrepareIcon, PickupIcon, CheckIcon, CancelIcon];
const statusTextPickup = ["Order Submitted!", "Order Processed!", "In Preparation!", "Ready for Pickup!", "Order Complete!", "Order Cancelled"];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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

const Steps = (type, orderStatus) => {
	switch (orderStatus) {
		case 0:
			return (
				<ul className="steps">
					<li class="step step-primary font-semibold"></li>
					<li class="step font-semibold"></li>
					<li class="step font-semibold"></li>
					<li class="step font-semibold"></li>
					<li class="step font-semibold"></li>
				</ul>
			);

		case 1:
			return (
				<ul className="steps">
					<li class="step step-primary font-semibold"></li>
					<li class="step step-primary font-semibold"></li>
					<li class="step font-semibold"></li>
					<li class="step font-semibold"></li>
					<li class="step font-semibold"></li>
				</ul>
			);

		case 2:
			return (
				<ul className="steps">
					<li class="step step-primary font-semibold"></li>
					<li class="step step-primary font-semibold"></li>
					<li class="step step-primary font-semibold"></li>
					<li class="step font-semibold"></li>
					<li class="step font-semibold"></li>
				</ul>
			);

		case 3:
			return (
				<ul className="steps">
					<li class="step step-primary font-semibold"></li>
					<li class="step step-primary font-semibold"></li>
					<li class="step step-primary font-semibold"></li>
					<li class="step step-primary font-semibold"></li>
					<li class="step font-semibold"></li>
				</ul>
			);

		case 4:
			return (
				<ul className="steps">
					<li class="step step-primary font-semibold"></li>
					<li class="step step-primary font-semibold"></li>
					<li class="step step-primary font-semibold"></li>
					<li class="step step-primary font-semibold"></li>
					<li class="step step-primary font-semibold"></li>
				</ul>
			);

		case 5:
			return;
	}
};

export default function Tracker(session) {
	const router = useRouter();
	const invoiceNum = router.query.invoiceNum;
	const { data: delFeeData, error: delFeeError } = useSWR("/api/delivery", fetcher); // NOTE Delivery fee

	// Fetch most recent transaction made by the user
	const [{ data, loading, error }, refetch] = useAxios({
		url: `${process.env.NEXTAUTH_URL}/api/history/${session.user.email}/${invoiceNum}`,
	});

	const [transaction, setTransaction] = useState({});
	const [order, setOrder] = useState([]);
	const [status, setStatus] = useState(0);

	useEffect(() => {
		if (data) {
			setTransaction(data.transaction);
			setOrder(data.transaction.order);
			setStatus(data.transaction.orderStatus);
		}
	}, [data]);

	useInterval(() => {
		refetch();
	}, 60000);

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
		<div className="px-4 2xl:container 2xl:mx-auto py-14 md:px-6 xl:px-20 font-rale text-slate-900">
			{loading ? (
				<div className="mt-8">
					<Loading />
				</div>
			) : (
				<div>
					<h3 className="w-full mb-5 text-4xl font-bold leading-7 xl:text-4xl xl:leading-9 md:text-left">Order Tracker</h3>
					<div className="flex flex-col items-center justify-center space-y-10 xl:flex-row xl:space-y-0 xl:space-x-8">
						{/* ANCHOR Current status of order */}
						<div className="flex flex-col items-center w-full space-y-5 lg:w-9/12 xl:w-full">
							<div className="items-center">
								{transaction.type === "Delivery" ? (
									<Image src={statusIconsDelivery[status]} height="250" width="250" />
								) : (
									<Image src={statusIconsPickup[status]} height="250" width="250" />
								)}
							</div>

							<div className="items-center">
								<h3 className="w-full text-3xl font-bold leading-7 xl:text-4xl xl:leading-9 md:text-left">
									{transaction.type === "Delivery" ? statusTextDelivery[status] : statusTextPickup[status]}
								</h3>
							</div>

							{transaction.reasonForCancel !== "" && (
								<div>
									<span>Reason for Cancellation: {transaction.reasonForCancel}</span>
								</div>
							)}

							<div>{Steps(transaction.type, status)}</div>
							<div>
								<span>Last Updated: {formatDate(transaction.lastUpdated)}</span>
							</div>
						</div>

						{/* ANCHOR Order summary */}
						<div className="flex flex-col items-start justify-center w-full lg:w-9/12 xl:w-full">
							<h3 className="w-full text-xl font-bold leading-7 xl:text-2xl xl:leading-9 md:text-left">Order Summary</h3>
							<div className="flex flex-col items-center justify-center w-full mt-8 space-y-4 ">
								{order &&
									order.map((item, index) => {
										let foodItem = item.menuItem;
										let imgUrl = foodItem.productImagesCollection[0].items[0].url;

										return (
											<div className="flex items-start justify-start w-full border border-gray-200 md:flex-row md:items-center">
												<div className="w-40 md:w-32">
													<Image src={imgUrl} height={1000} width={1000} />
												</div>
												<div className="flex flex-col items-start justify-start w-full p-4 md:justify-between md:items-center md:flex-row md:px-8">
													<div className="flex flex-col items-start justify-start md:flex-shrink-0">
														<h3 className="w-full text-lg font-semibold leading-6 md:text-xl md:leading-5">{foodItem.productName}</h3>
														<div className="flex flex-row items-start justify-start mt-4 space-x-4 md:space-x-6 ">
															<p className="text-sm leading-none ">
																Quantity: <span className="">{item.quantity}</span>
															</p>
														</div>
													</div>
													<div className="flex items-center w-full mt-4 md:mt-0 md:justify-end ">
														<p className="text-xl font-semibold leading-5 lg:text-2xl lg:leading-6">₱ {foodItem.productPrice}.00</p>
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
										<p className="text-sm leading-5 ">
											{transaction.type === "Pickup" && transaction.payMethod === "COD" ? "Cash on Pickup" : transaction.payMethod}
										</p>
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
											<p className="text-base leading-4 ">
												₱ {transaction.type === "Delivery" ? transaction.totalPrice - delFeeData.deliveryFeeData.delFee : transaction.totalPrice}
											</p>
										</div>

										{/* ANCHOR Delivery fee */}
										<div className="flex justify-between w-full">
											<p className="text-base leading-4 ">Delivery</p>
											<p className="text-base leading-4 ">₱ {transaction.type === "Delivery" ? delFeeData.deliveryFeeData.delFee : "-"}</p>
										</div>
									</div>

									{/* ANCHOR Total price */}
									<div className="flex items-center justify-between w-full">
										<p className="text-base font-bold leading-4">Total</p>
										<p className="text-base font-bold leading-4">₱ {transaction.totalPrice}</p>
									</div>
									<div className="flex flex-col items-center justify-center w-full pt-1 space-y-6 md:pt-4 xl:pt-8 md:space-y-8">
										<Link href="/user/history">
											<button className="px-20 py-2 font-medium text-white transition-all bg-green-700 rounded shadow cursor-pointer hover:bg-green-600">
												<a>Back to My Orders</a>
											</button>
										</Link>
									</div>
								</div>
								{/* !SECTION */}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

Tracker.layout = "consumer";
