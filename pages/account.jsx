import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

import { useRouter } from "next/router";
import axios from "axios";
import { makeUseAxios } from "axios-hooks";

import Loading from "@components/Loading";
import UserSettings from "@components/UserSettings";
import TransactionHistory from "@components/TransactionHistory";

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

// Axios instances
const userAxios = makeUseAxios({
	axios: axios.create({ baseURL: process.env.NEXTAUTH_URL }),
});
const historyAxios = makeUseAxios({
	axios: axios.create({ baseURL: process.env.NEXTAUTH_URL }),
});

export default function Account(session) {
	const router = useRouter();
	const [{ data: userRes, loading: userLoading, error: userError }, userRefetch] = userAxios(`/api/users/${session.user.email}`);
	const [{ data: historyRes, loading: historyLoading, error: historyError }, historyRefetch] = historyAxios(`/api/history/${session.user.email}`);

	const [user, setUser] = useState({});
	const [transactions, setTransactions] = useState([]);

	// Page elements
	const [isLoading, setLoading] = useState(false);
	const [currentTab, setCurrentTab] = useState("User Settings");
	const [openTransaction, setOpenTransaction] = useState(false);
	const navigationBar = [
		{ id: "1", name: "User Settings", current: true },
		{ id: "2", name: "Transactions", current: false },
	];

	// For setting user and transaction states
	useEffect(() => {
		if (userRes) setUser(userRes.user);
		if (historyRes) setTransactions(historyRes.transactions);
	}, [userRes, historyRes]);

	// Refetch if path changes
	useEffect(() => {
		userRefetch();
		historyRefetch();
	}, [router.pathname]);

	// For refreshing client-side
	useEffect(() => {
		setLoading(false);
	}, [isLoading]);

	// Refresh client-side
	const refreshData = () => {
		router.replace(router.asPath);
		setLoading(true);
	};

	const handleCurrentTab = (name) => {
		setCurrentTab(name);
	};

	return (
		<>
			{userLoading ^ historyLoading ? (
				<Loading />
			) : (
				<div className="flex flex-col justify-center mx-10 my-10 md:mx-36 xl:mx-72 font-rale text-slate-900">
					<div className="flex flex-col justify-between mb-5 lg:flex-row">
						<div className="text-3xl font-bold text-green-700 lg:text-4xl">{currentTab}</div>
						<ul className="flex flex-row self-center mt-5 lg:mt-0">
							<li>
								{navigationBar.map((tab) => {
									tab.current = tab.name == currentTab ? true : false;
									return (
										<a
											onClick={(e) => {
												handleCurrentTab(tab.name);
											}}
											key={tab.id}
											className={
												tab.current
													? "self-center bg-green-700 px-3 py-2 mx-3 my-2 font-semibold text-white ease-in-out transition-colors duration-100 rounded-md cursor-pointer"
													: "self-center px-3 py-2 mx-3 my-2 hover:text-white transition-colors ease-in-out duration-200 hover:bg-green-700 rounded-md cursor-pointer"
											}
										>
											{tab.name}
										</a>
									);
								})}
							</li>
						</ul>
					</div>

					{/* User settings card */}
					{currentTab === "User Settings" && <UserSettings user={user} setUser={setUser} userRefetch={userRefetch} />}

					{/* Transaction history card */}
					{currentTab === "Transactions" && <TransactionHistory transactions={transactions} />}
				</div>
			)}
		</>
	);
}
