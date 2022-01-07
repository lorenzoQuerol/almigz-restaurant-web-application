import { getSession } from "next-auth/react";

import createConnection from "@utils/mongoDBConnection";
import Transaction from "@models/TransactionModel";

async function handler(req, res) {
	// Create connection to database
	await createConnection();

	// Get session
	const session = await getSession({ req });

	// Unpack the request
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
					if (!count) return res.status(404).json({ success: false, msg: `Could not find transactions.` });

					res.status(200).json({ success: true, data: count });
				} catch (err) {
					res.status(400).json({ success: false, msg: `Error getting transactions count: ${err.message}` });
				}
			} else {
				res.status(401).json({ success: false, msg: "User not signed in." });
			}
			break;

		default:
			res.status(500).json({ success: false, msg: "Route is not valid." });
			break;
	}
}

export default handler;
