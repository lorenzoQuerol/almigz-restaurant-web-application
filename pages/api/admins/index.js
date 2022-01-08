import { getSession } from "next-auth/react";

import createConnection from "@utils/mongoDBConnection";
import User from "@models/UserModel";

async function handler(req, res) {
	// Create connection to database
	await createConnection();

	// Get session
	const session = await getSession({ req });

	// Unpack the request to get method
	const { method } = req;

	switch (method) {
		// Get all admins (ADMIN-PROTECTED)
		case "GET":
			if (session) {
				if (session.user.isAdmin) {
					try {
						const admins = await User.find({ isAdmin: true }, { _id: false, __v: false });
						res.status(404).json({ success: false, msg: `Admins not found.` });

						res.status(200).json({ success: true, data: admins });
					} catch (err) {
						res.status(400).json({ success: false, msg: `Error getting all admins: ${err.message}` });
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
