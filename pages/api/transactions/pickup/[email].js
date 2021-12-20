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
		// Get transaction
		case "GET":
			try {
				const transaction = await Transaction.findOne({ email: email });
				if (!transaction) return res.status(404).json({ success: false, msg: "Transaction does not exist." });

				res.status(200).json({ success: true, data: transaction });
			} catch (err) {
				res.status(400).json({ success: false, msg: err });
			}
			break;

		// Update transaction (status)
		case "PUT":
			try {
				const updatedTransaction = await Transaction.updateOne({ email: email }, req.body, {
					new: true,
					runValidators: true,
				});

				res.status(200).json({
					success: true,
					msg: "Transaction updated successfully.",
					data: updatedTransaction,
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
