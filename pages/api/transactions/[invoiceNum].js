import { getSession } from "next-auth/react";
import createConnection from "@utils/mongoDBConnection";
import Transaction from "@models/TransactionModel";

async function handler(req, res) {
	await createConnection();
	const session = await getSession({ req });
	const {
		query: { invoiceNum },
		method,
	} = req;

	switch (method) {
		// Get transaction (PROTECTED)
		case "GET":
			if (session) {
				if (session.user.email || session.user.isAdmin) {
					try {
						const transaction = await Transaction.findOne({ invoiceNum: invoiceNum });
						if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found" });

						res.status(200).json({ success: true, message: "Successful query", transaction });
					} catch (err) {
						res.status(400).json({ success: false, message: "An error occurred" });
					}
				} else {
					res.status(401).json({ success: false, message: "User not allowed" });
				}
			} else {
				res.status(401).json({ success: false, message: "User not logged in" });
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

						if (!updatedTransaction) return res.status(404).json({ success: false, message: "Transaction not found" });

						res.status(200).json({
							success: true,
							message: "Transaction updated",
						});
					} catch (err) {
						res.status(400).json({ success: false, message: "An error occurred" });
					}
				} else {
					res.status(401).json({ success: false, message: "User not allowed" });
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
