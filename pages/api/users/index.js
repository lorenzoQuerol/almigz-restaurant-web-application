import { hash } from "bcryptjs";
import { getSession } from "next-auth/react";

import createConnection from "@utils/mongoDBConnection";
import User from "@models/UserModel";
import userErrorHandler from "@handlers/userErrorHandler";

async function handler(req, res) {
	// Create connection to database
	await createConnection();

	// Get session
	const session = await getSession({ req });

	// Unpack the request to get method
	const { method } = req;

	switch (method) {
		// Get all users (ADMIN-PROTECTED)
		case "GET":
			if (session) {
				if (session.user.isAdmin) {
					try {
						const users = await User.find({}, { __v: false, cart: false });
						if (!users) return res.status(404).json({ success: false, msg: `Users not found.` });

						res.status(200).json({ success: true, data: users });
					} catch (err) {
						res.status(400).json({ success: false, msg: `Error getting all users: ${err.message}` });
					}
				} else {
					res.status(401).json({ success: false, msg: "Unauthorized user." });
				}
			} else {
				res.status(401).json({ success: false, msg: "User not signed in." });
			}
			break;

		// Create new user (UNPROTECTED)
		case "POST":
			try {
				// Check if there is a duplicate account in the system
				const duplicate = await User.findOne({ email: req.body.email });
				if (duplicate)
					return res.status(400).json({
						success: false,
						msg: "Email address already exists in the system. Please use a different email address.",
					});

				// Encrypt password
				if (req.body.password) req.body.password = await hash(req.body.password, 12);

				// Create new document
				const user = await User.create(req.body);

				res.status(201).json({
					success: true,
					msg: "User account created successfully.",
					data: user,
				});
			} catch (err) {
				const missingFields = userErrorHandler(err);
				res.status(400).json({ success: false, msg: "User account creation failed.", missingFields: missingFields });
			}
			break;

		default:
			res.status(500).json({ success: false, msg: "Route is not valid." });
			break;
	}
}

export default handler;
