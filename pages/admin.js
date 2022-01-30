import { useState } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

import Dashboard from "@components/Dashboard";
import ManageTransactions from "@components/ManageTransactions";
import ManageMembers from "@components/ManageMembers";
import SummaryReports from "@components/SummaryReports";
import DashboardIcon from "@components/DashboardIcon";
import PeopleIcon from "@components/PeopleIcon";
import TicketIcon from "@components/TicketIcon";
import CogIcon from "@components/CogIcon";

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

export default function Admin(session) {
	const [currentTab, setCurrentTab] = useState("Dashboard");

	const navigationBar = [
		{ id: 1, name: "Dashboard", svg: <DashboardIcon /> },
		{ id: 2, name: "Transactions", svg: <TicketIcon /> },
		{ id: 3, name: "Management", svg: <PeopleIcon /> },
		{ id: 4, name: "Summary", svg: <CogIcon /> },
	];

	return (
		<div className="flex justify-center font-rale text-slate-900">
			{/* Navigation bar */}
			<div className="flex flex-col w-64 min-h-screen px-4 bg-white border-r ">
				<div className="flex flex-col justify-between flex-1">
					<nav>
						{navigationBar.map((item, index) => {
							if (item.name === currentTab) {
								return (
									<a
										className="flex items-center px-4 py-3 mt-5 text-white transition-colors bg-green-700 rounded-md cursor-pointer"
										onClick={(e) => setCurrentTab(item.name)}
									>
										{item.svg}
										<span className="mx-4 font-medium">{item.name}</span>
									</a>
								);
							} else {
								return (
									<a
										className="flex items-center px-4 py-3 mt-5 transition-colors rounded-md cursor-pointer hover:text-white hover:bg-green-700"
										onClick={(e) => setCurrentTab(item.name)}
									>
										{item.svg}
										<span className="mx-4 font-medium">{item.name}</span>
									</a>
								);
							}
						})}
					</nav>
				</div>
			</div>

			{/* Dashboard */}
			{currentTab === "Dashboard" && <Dashboard session={session} setCurrentTab={setCurrentTab} />}

			{/* Manage members card */}
			{currentTab === "Transactions" && <ManageTransactions />}

			{/* Manage members card */}
			{currentTab === "Management" && <ManageMembers />}

			{/* Manage members card */}
			{currentTab === "Summary" && <SummaryReports />}
		</div>
	);
}
