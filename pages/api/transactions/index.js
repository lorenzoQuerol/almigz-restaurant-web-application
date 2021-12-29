import createConnection from "@utils/mongoDBConnection";
import Transaction from "@models/TransactionModel";

async function handler(req, res) {
	// Create connection to database
	await createConnection();

	// Unpack the request
	const {
		query: { email },
		method,
	} = req;

	switch (method) {
		// Get all transactions
		case "GET":
			try {
				const transactions = await Transaction.find({}, { __v: false });
				if (!transactions) return res.status(404).json({ success: false, msg: "Transactions cannot be found." });

				res.status(200).json({ success: true, data: transactions });
			} catch (err) {
				res.status(400).json({ success: false, msg: err });
			}
			break;

		// Create new transaction document
		case "POST":
			const transaction = await Transaction.create(req.body);

			try {
				res.status(201).json({
					success: true,
					msg: "Transaction made sucessfully.",
					data: transaction,
				});
			} catch (err) {
				res.status(400).json({ success: false, msg: err });
			}
			break;

		default:
			res.status(500).json({ success: false, msg: "Route is not valid." });
			break;
	}
}

export default handler;
