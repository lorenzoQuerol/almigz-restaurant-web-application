import createConnection from "@utils/mongoDBConnection";
import User from "@models/UserModel";

async function handler(req, res) {
	await createConnection();
	const {
		query: { email },
		method,
	} = req;

	switch (method) {
		// Get user email (UNPROTECTED)
		case "GET":
			try {
				const result = await User.findOne({ email: email }, "email");
				if (!result) return res.status(404).json({ success: false, message: "Email not found, please register for an account" });

				res.status(200).json({ success: true, message: "Successful query", result });
			} catch (err) {
				res.status(400).json({ success: false, message: "An error occurred" });
			}
			break;

		default:
			res.status(500).json({ success: false, message: "Route is not valid" });
			break;
	}
}

export default handler;
