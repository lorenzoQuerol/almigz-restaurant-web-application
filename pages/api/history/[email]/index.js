import { getSession } from "next-auth/react";
import createConnection from "@utils/mongoDBConnection";
import User from "@models/UserModel";

async function handler(req, res) {
	await createConnection();
	const session = await getSession({ req });
	const {
		query: { email, offset, limit, filter },
		method,
	} = req;

	let filterBy;
	switch (filter) {
		case "Latest":
			filterBy = { "transactions.dateCreated": -1 };
			break;

		case "Oldest":
			filterBy = { "transactions.dateCreated": 1 };
			break;

		case "Price: Lowest to Highest":
			filterBy = { "transactions.totalPrice": 1 };
			break;

		case "Price: Highest to Lowest":
			filterBy = { "transactions.totalPrice": -1 };
			break;
	}

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
						let result;
						let transactions = [];

						if (limit) {
							result = await User.aggregate()
								.match({ email: email })
								.unwind("transactions")
								.project("transactions")
								.sort(filterBy)
								.skip(Number(offset))
								.limit(Number(limit));

							result.forEach((t) => {
								transactions.push(t.transactions);
							});
						} else {
							result = await User.find({ email: email }, "transactions");
						}

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
