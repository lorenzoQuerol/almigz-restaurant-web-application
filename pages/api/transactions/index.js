import { getSession } from "next-auth/react";

import createConnection from "@utils/mongoDBConnection";
import Transaction from "@models/TransactionModel";
import transactionErrorHandler from "@handlers/transactionErrorHandler";

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
		// Get all transactions (ADMIN-PROTECTED)
		case "GET":
			if (session) {
				if (session.user.isAdmin) {
					try {
						const transactions = await Transaction.find({}, { _id: false, __v: false });
						if (!transactions) return res.status(404).json({ success: false, msg: "Transactions cannot be found." });

						res.status(200).json({ success: true, data: transactions });
					} catch (err) {
						res.status(400).json({ success: false, msg: `Error getting transactions: ${err.message}` });
					}
				} else {
					res.status(401).json({ success: false, msg: "Unauthorized user." });
				}
			} else {
				res.status(401).json({ success: false, msg: "User not signed in." });
			}
			break;

		// Create new transaction document (PROTECTED)
		case "POST":
			if (session) {
				if (user.session.email === email) {
					try {
						const transaction = await Transaction.create(req.body);
						res.status(201).json({
							success: true,
							msg: "Transaction made sucessfully.",
							data: transaction,
						});
					} catch (err) {
						const missingFields = transactionErrorHandler(err);
						res.status(400).json({
							success: false,
							msg: "Transaction creation failed.",
							missingFields: missingFields,
						});
					}
				} else {
					res.status(401).json({ success: false, msg: "Unauthorized user." });
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
