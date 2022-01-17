import createConnection from "@utils/mongoDBConnection";
import User from "@models/UserModel";

async function handler(req, res) {
	// Create connection to database
	await createConnection();

	// Unpack the request
	const {
		query: { email },
		method,
	} = req;

	switch (method) {
		// Push new transaction into user's history
		case "PUT":
			try {
				const user = await User.findOneAndUpdate(
					{ email: email },
					{ $push: { transactions: req.body } },
					{
						new: true,
						runValidators: true,
					}
				);
				if (!user) return res.status(404).json({ success: false, msg: "User not found." });

				res.status(200).json({
					success: true,
					msg: "Transaction history updated successfully.",
				});
			} catch (err) {
				res.status(400).json({ success: false, msg: `Error updating transaction history: ${err.message}` });
			}
			break;

		// Get history
		case "GET":
			try {
				const transactions = await User.findOne({ email: email }, "transactions");
				if (!transactions) return res.status(404).json({ success: false, msg: "User not found." });

				res.status(200).json({ success: true, data: transactions });
			} catch (err) {
				res.status(400).json({ success: false, msg: `Error getting transaction history: ${err.message}` });
			}
			break;

		default:
			res.status(500).json({ success: false, msg: "Route is not valid." });
			break;
	}
}

export default handler;
