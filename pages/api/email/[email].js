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
		// Get user email
		case "GET":
			try {
				const result = await User.findOne({ email: email }, "email");
				if (!result) return res.status(404).json({ success: false, msg: "Email does not exist in the system. Please register for an account." });

				res.status(200).json({ success: true, email: result });
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
