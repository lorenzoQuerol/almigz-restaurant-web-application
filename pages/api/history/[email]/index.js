import { getSession } from "next-auth/react";
import createConnection from "@utils/mongoDBConnection";
import User from "@models/UserModel";

async function handler(req, res) {
	await createConnection();
	const session = await getSession({ req });
	const {
		query: { email },
		method,
	} = req;

	switch (method) {
		// Push new transaction into user's history (PROTECTED)
		case "PUT":
			if (session) {
				if (session.user.email === email) {
					try {
						const user = await User.findOneAndUpdate(
							{ email: email },
							{ $push: { transactions: req.body } },
							{
								new: true,
								runValidators: true,
							}
						);
						if (!user) return res.status(404).json({ success: false, message: "User not found" });

						res.status(200).json({
							success: true,
							message: "Transaction history updated",
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

		// Get history (PROTECTED)
		case "GET":
			if (session) {
				if (session.user.email === email) {
					try {
						let { transactions } = await User.findOne({ email: email }, "transactions");
						if (!transactions) return res.status(404).json({ success: false, message: "User not found" });

						res.status(200).json({ success: true, message: "Successful query", transactions });
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