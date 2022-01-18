import { hash, compare } from "bcryptjs";
import { getSession } from "next-auth/react";

import createConnection from "@utils/mongoDBConnection";
import User from "@models/UserModel";

async function handler(req, res) {
	// Create connection to database
	await createConnection();

	// Get session
	const session = await getSession({ req });

	// Unpack the request
	const {
		query: { email },
		method,
	} = req;

	switch (method) {
		// Update user (PROTECTED)
		case "PUT":
			if (session) {
				if (session.user.email === email) {
					try {
						// Find user
						const user = await User.findOne({ email: email });
						if (!user) return res.status(404).json({ success: false, msg: "User not found." });

						// Check to see if password was changed, re-hash if changed
						const samePassword = req.body.password === user.password ? true : false;
						if (!samePassword) req.body.password = await hash(req.body.password, 12);

						// Update user request
						await User.findOneAndUpdate({ email: email }, req.body, {
							new: true,
							runValidators: true,
						});

						res.status(200).json({
							success: true,
							msg: "User account updated successfully.",
						});
					} catch (err) {
						res.status(400).json({ success: false, msg: `Error updating user: ${err.message}` });
					}
				} else {
					res.status(401).json({ success: false, msg: "Unauthorized user." });
				}
			} else {
				res.status(401).json({ success: false, msg: "User not signed in." });
			}
			break;

		// Get user (PUBLIC - UNPROTECTED)
		case "GET":
			try {
				const user = await User.findOne({ email: email }, { _id: false, __v: false, isAdmin: false, isDelete: false, cart: false });
				if (!user) return res.status(404).json({ success: false, msg: "User not found." });

				res.status(200).json({ success: true, data: user });
			} catch (err) {
				res.status(400).json({ success: false, msg: `Error getting user: ${err.message}` });
			}
			break;

		// Delete user (PROTECTED)
		case "DELETE":
			if (session) {
				if (session.user.email === email) {
					try {
						const deletedUser = await User.findOneAndDelete({ email: email });
						if (!deletedUser) return res.status(404).json({ success: false, msg: "User not found." });

						res.status(200).json({
							success: true,
							msg: "User account deleted successfully.",
						});
					} catch (err) {
						res.status(400).json({ success: false, msg: `Error deleting user: ${err.message}` });
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
