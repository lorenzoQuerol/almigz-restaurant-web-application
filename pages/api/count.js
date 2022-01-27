import { getSession } from "next-auth/react";

import createConnection from "@utils/mongoDBConnection";
import Transaction from "@models/TransactionModel";

async function handler(req, res) {
	await createConnection();
	const session = await getSession({ req });
	const {
		query: { email },
		method,
	} = req;

	switch (method) {
		// Get count of transactions (PROTECTED)
		case "GET":
			if (session) {
				try {
					// Get count of transactions in the database
					const count = await Transaction.count({});

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
