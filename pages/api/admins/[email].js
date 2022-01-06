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
		// Update admin - used for changing role [normal/admin] (ADMIN-PROTECTED)
		case "PUT":
			if (session) {
				if (session.user.isAdmin) {
					try {
						// Find admin
						const admin = await User.findOne({ email: email, isAdmin: true });
						if (!admin) return res.status(404).json({ success: false, msg: "Admin not found." });

						// Update user
						await User.findOneAndUpdate({ email: email, isAdmin: true }, admin, {
							new: true,
							runValidators: true,
						});

						res.status(200).json({
							success: true,
							msg: "Admin account updated successfully.",
						});
					} catch (err) {
						res.status(400).json({ success: false, msg: `Error updating admin: ${err.message}` });
					}
				} else {
					res.status(401).json({ success: false, msg: "Unauthorized user." });
				}
			} else {
				res.status(401).json({ success: false, msg: "User not signed in." });
			}
			break;

		// Get admin (ADMIN-PROTECTED)
		case "GET":
			if (session) {
				if (session.user.isAdmin) {
					try {
						const admin = await User.findOne({ email: email, isAdmin: true }, { _id: false, __v: false, cart: false });
						if (!admin) return res.status(400).json({ success: false, msg: "User not found." });

						res.status(200).json({ success: true, data: admin });
					} catch (err) {
						res.status(400).json({ success: false, msg: `Error getting admin: ${err.message}` });
					}
				} else {
					res.status(401).json({ success: false, msg: "Unauthorized user." });
				}
			} else {
				res.status(401).json({ success: false, msg: "User not signed in." });
			}
			break;

		// Delete admin (ADMIN-PROTECTED)
		case "DELETE":
			if (session) {
				if (session.user.isAdmin) {
					try {
						// Check if admin account is deletable
						const deletedAdmin = await User.findOneAndDelete({ email: email, isAdmin: true, isDelete: true });
						if (!deletedAdmin)
							return res.status(404).json({
								success: false,
								msg: "This admin account cannot be found or deleted.",
							});

						res.status(200).json({
							success: true,
							msg: "User account deleted successfully.",
						});
					} catch (err) {
						res.status(400).json({ success: false, msg: `Error deleting admin: ${err.message}` });
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
