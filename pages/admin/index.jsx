import { useEffect, React, useState, Fragment } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { makeUseAxios } from "axios-hooks";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import useAxios from "axios-hooks";

import PeopleIcon from "@components/PeopleIcon";
import TicketIcon from "@components/TicketIcon";
import PaperIcon from "@components/PaperIcon";

const months = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "August", "Sept.", "Oct.", "Nov.", "Dec."];
const status = ["INCOMING", "PROCESSED", "IN PREPARATION", "READY FOR PICKUP/DELIVERY", "COMPLETED ORDER", "CANCELLED ORDER"];
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

const getTransactions = makeUseAxios({
	axios: axios.create({ baseURL: process.env.NEXTAUTH_URL }),
});

const getUsers = makeUseAxios({
	axios: axios.create({ baseURL: process.env.NEXTAUTH_URL }),
});

export default function AdminPage(session) {
	const [transactions, setTransactions] = useState([]);
	const [recent, setRecent] = useState([]);
	const [users, setUsers] = useState([]);
	const [lastUpdate, setLastUpdate] = useState(new Date());

	const [{ data, loading, error }, refetch] = getTransactions({
		url: "/api/transactions",
	});

	const [{ data: userData, loading: userLoading, error: userError }, userRefetch] = getUsers({
		url: "/api/users",
	});

	useEffect(() => {
		setTimeout(() => {
			refetch();
			setLastUpdate(new Date());
		}, 60000);

		if (data) {
			setTransactions(data.transactions);
			setRecent(() => {
				let i,
					temp = [];
				for (i = 0; i <= 4; i++) temp.push(data.transactions[i]);
				return temp;
			});
		}
		if (userData) setUsers(userData.users);
	}, [data, userData]);

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
		// SECTION Current Statistics
		<div className="text-gray-800 font-rale">
			<div className="text-3xl font-bold">
				Welcome, <a className="text-green-700">{session.user.name}</a>
			</div>

			{/* NOTE 2 Column split */}
			<div className="flex flex-col xl:flex-row">
				{/* NOTE Left side */}
				<div className="flex-col">
					{/* SECTION Active orders card */}
					<div className="flex items-center w-full py-4 font-rale">
						<div className="w-full py-6 pl-6 pr-12 bg-white rounded shadow">
							<div className="flex items-center">
								<p className="text-lg font-semibold leading-4 md:pr-96">Active Orders</p>
							</div>

							<div className="items-center justify-between pt-8 md:flex">
								<div className="flex items-center">
									<div className="flex items-center justify-center w-12 h-12 bg-red-200 rounded-full">
										<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
										</svg>
									</div>
									<div className="pl-4">
										<p className="text-lg font-semibold leading-none w-11">{transactions.filter((t) => t.orderStatus == 0).length}</p>
										<p className="w-8 pt-2 text-xs leading-3 text-gray-500">Incoming</p>
									</div>
								</div>
								<div className="flex items-center pt-4 md:pt-0 md:pl-10">
									<div className="flex items-center justify-center w-12 h-12 bg-yellow-200 rounded-full">
										<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<div className="pl-4">
										<p className="text-lg font-semibold leading-none w-11">{transactions.filter((t) => t.orderStatus == 1).length}</p>
										<p className="w-8 pt-2 text-xs leading-3 text-gray-500">Processed</p>
									</div>
								</div>
								<div className="flex items-center pt-4 md:pt-0 md:pl-10">
									<div className="flex items-center justify-center w-12 h-12 bg-[#CF9FFF] rounded-full">
										<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
											/>
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
									</div>
									<div className="pl-4">
										<p className="text-lg font-semibold leading-nonew-11">{transactions.filter((t) => t.orderStatus == 2).length}</p>
										<p className="w-8 pt-2 text-xs leading-3 text-gray-500">Preparing</p>
									</div>
								</div>
								<div className="flex items-center pt-4 md:pt-0 md:pl-10">
									<div className="flex items-center justify-center w-12 h-12 bg-green-200 rounded-full">
										<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
											/>
										</svg>
									</div>
									<div className="pl-4">
										<p className="text-lg font-semibold leading-none w-11">{transactions.filter((t) => t.orderStatus == 3).length}</p>
										<p className="w-8 pt-2 text-xs leading-3 text-gray-500">Ready</p>
									</div>
								</div>
							</div>

							<div className="flex items-center justify-end mt-5">
								<p className="pl-6 text-xs leading-3 text-right text-gray-500">Last Update: {formatDate(lastUpdate)}</p>
							</div>
						</div>
					</div>
					{/* !SECTION */}

					{/* NOTE 2nd row */}
					<div className="flex flex-col sm:space-x-4 sm:flex-row">
						{/* NOTE Completed orders */}
						<div className="flex items-start w-full py-5 pl-6 bg-white rounded shadow">
							<TicketIcon />
							<div className="pl-3 pr-10 mt-1">
								<h3 className="text-base font-semibold leading-4">Completed Orders</h3>
								<div className="flex items-end mt-4">
									<h2 className="text-2xl font-bold leading-normal">{transactions.filter((t) => t.orderStatus == 5).length}</h2>
								</div>
							</div>
						</div>

						{/* NOTE Registered users */}
						<div className="flex items-start w-full py-5 pl-6 mt-4 bg-white rounded shadow sm:mt-0">
							<PeopleIcon />
							<div className="pl-3 pr-10 mt-1">
								<h3 className="text-base font-semibold leading-4">Registered Users</h3>
								<div className="flex items-end mt-4">
									<h2 className="text-2xl font-bold leading-normal">{users.length}</h2>
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-center px-8 py-6 mt-4 bg-white rounded shadow">
						<Link href="https://be.contentful.com/login">
							<a target="_blank">
								<div className="p-4 bg-green-700 rounded cursor-pointer">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="icon icon-tabler icon-tabler-discount"
										width={32}
										height={32}
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="#fff"
										fill="none"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path stroke="none" d="M0 0h24v24H0z" />
										<line x1={9} y1={15} x2={15} y2={9} />
										<circle cx="9.5" cy="9.5" r=".5" />
										<circle cx="14.5" cy="14.5" r=".5" />
										<path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7a2.2 2.2 0 0 0 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1a2.2 2.2 0 0 0 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55 v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55 v-1" />
									</svg>
								</div>
							</a>
						</Link>
						<div className="ml-6">
							<h3 className="mb-1 text-2xl font-semibold leading-5">Go to Contentful</h3>
							<p className="text-sm font-normal leading-5 tracking-normal text-gray-600">Edit page variables or add food items</p>
						</div>
					</div>
				</div>

				{/* NOTE Right side */}
				<div className="flex-col w-full">
					{/* SECTION Recent transactions card */}
					<div className="flex items-center justify-center py-4 xl:px-4">
						<div className="w-full p-5 bg-white rounded-md shadow">
							<h1 className="text-lg font-semibold">Recent Transactions</h1>
							{recent.map((item, index) => {
								return (
									<div className="flex items-center justify-between pt-5">
										<div className="flex items-center">
											<div className={`flex items-center rounded justify-center z-0 w-12 h-12 ${statColors[item.orderStatus]}`}>
												<PaperIcon />
											</div>
											<div className="flex flex-col">
												<p className={`pl-3 text-sm font-semibold ${statTextColors[item.orderStatus]}`}>{status[item.orderStatus]}</p>
												<p className="pl-3 text-sm font-medium text-gray-500">{formatDate(item.dateCreated)}</p>
											</div>
										</div>
										<Link href={`/admin/orders/${item.invoiceNum}`}>
											<p className="text-sm font-medium text-green-700 cursor-pointer">View</p>
										</Link>
									</div>
								);
							})}
							<Link href="/admin/transactions">
								<p className="pt-1 text-sm font-medium text-right text-green-700 cursor-pointer">View All &gt;&gt;</p>
							</Link>
						</div>
					</div>
					{/* !SECTION */}
				</div>
			</div>
		</div>

		// !SECTION
	);
}

AdminPage.layout = "admin";
