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
		query: { invoiceNum },
		method,
	} = req;

	switch (method) {
		// Get transaction (PROTECTED) - accessible only by authorized users and admins
		case "GET":
			if (session) {
				if (session.user.email || session.user.isAdmin) {
					try {
						const transaction = await Transaction.findOne({ invoiceNum: invoiceNum });
						if (!transaction) return res.status(404).json({ success: false, msg: "Transaction does not exist." });

						res.status(200).json({ success: true, data: transaction });
					} catch (err) {
						res.status(400).json({ success: false, msg: `Error getting transaction: ${err.message}` });
					}
				} else {
					res.status(401).json({ success: false, msg: "Unauthorized user." });
				}
			} else {
				res.status(401).json({ success: false, msg: "User not signed in." });
			}
			break;

		// Update transaction [status change] (ADMIN-PROTECTED)
		case "PUT":
			if (session) {
				if (session.user.isAdmin) {
					try {
						const updatedTransaction = await Transaction.findOneAndUpdate({ invoiceNum: invoiceNum }, req.body, {
							new: true,
							runValidators: true,
						});

						if (!updatedTransaction) return res.status(404).json({ success: false, msg: "Transaction does not exist." });

						res.status(200).json({
							success: true,
							msg: "Transaction updated successfully.",
						});
					} catch (err) {
						res.status(400).json({ success: false, msg: `Error updating transaction: ${err.message}` });
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
