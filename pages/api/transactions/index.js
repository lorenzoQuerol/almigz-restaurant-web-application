import { getSession } from "next-auth/react";

import createConnection from "@utils/mongoDBConnection";
import Transaction from "@models/TransactionModel";

async function handler(req, res) {
	await createConnection();
	const session = await getSession({ req });

	// Unpack the request
	const {
		query: { limit, offset },
		method,
	} = req;

	switch (method) {
		// Get all transactions (ADMIN-PROTECTED)
		case "GET":
			if (session) {
				if (session.user.isAdmin) {
					try {
						let transactions;
						if (limit) transactions = await Transaction.find({}, { _id: false, __v: false }).sort({ dateCreated: -1 }).skip(Number(offset)).limit(Number(limit));
						else transactions = await Transaction.find({}, { _id: false, __v: false });
						if (!transactions) return res.status(404).json({ success: false, message: "Transactions not found" });

						res.status(200).json({ success: true, message: "Successful query", transactions });
					} catch (err) {
						res.status(400).json({ success: false, message: `An error occurred` });
					}
				} else {
					res.status(401).json({ success: false, message: "User not allowed" });
				}
			} else {
				res.status(401).json({ success: false, message: "User not logged in" });
			}
			break;

		// Create new transaction (PROTECTED)
		case "POST":
			if (session) {
				if (session.user.email === req.body.email) {
					try {
						const transaction = await Transaction.create(req.body);

						res.status(201).json({
							success: true,
							message: "Transaction made sucessfully",
							transaction,
						});
					} catch (err) {
						res.status(400).json({
							success: false,
							message: "An error occurred",
						});
					}
				} else {
					res.status(401).json({ success: false, message: "User not allowed" });
				}
			} else {
				res.status(401).json({ success: false, message: "User not logged in" });
			}
			break;

		default:
			res.status(500).json({ success: false, message: "Route is not valid." });
			break;
	}
}

export default handler;
