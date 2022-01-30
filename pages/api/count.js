import { getSession } from "next-auth/react";

import createConnection from "@utils/mongoDBConnection";
import Transaction from "@models/TransactionModel";
import User from "@models/UserModel";

async function handler(req, res) {
	await createConnection();
	const session = await getSession({ req });
	const {
		query: { filter },
		method,
	} = req;

	switch (method) {
		// Get count of transactions (PROTECTED)
		case "GET":
			if (session) {
				try {
					let count;
					// Get count of ALL transactions in the database
					if (filter === "transactions") count = await Transaction.count({});

					// Get count of COMPLETE transactions in the database
					if (filter === "complete") count = await Transaction.count({ orderStatus: 4 });

					// Get count of ACTIVE transactions in the database
					if (filter === "active") count = await Transaction.count({ orderStatus: { $gt: 0, $lt: 4 } });

					// Get count of users in database
					if (filter === "users") count = await User.count({});

					res.status(200).json({ success: true, message: "Successful query", count });
				} catch (err) {
					res.status(400).json({ success: false, message: "An error occurred" });
				}
			} else {
				res.status(401).json({ success: false, message: "User not logged in" });
			}
			break;

		default:
			res.status(500).json({ success: false, message: "Route is not valid" });
			break;
	}
}

export default handler;
