import { getSession } from "next-auth/react";
import { hash } from "bcryptjs";
import createConnection from "@utils/mongoDBConnection";
import User from "@models/UserModel";

export default async function handler(req, res) {
	await createConnection();
	const session = await getSession({ req });
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
						const user = await User.findOne({ email: email });
						if (!user) return res.status(404).json({ success: false, message: "User not found" });

						// Rehash if password changed
						const samePassword = req.body.password === user.password ? true : false;
						if (!samePassword) req.body.password = await hash(req.body.password, 12);

						await User.findOneAndUpdate({ email: email }, req.body, {
							new: true,
						});

						res.status(200).json({
							success: true,
							message: "User account updated",
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

		// Get user (PUBLIC - UNPROTECTED)
		case "GET":
			try {
				const user = await User.findOne({ email: email }, { _id: false, __v: false, isAdmin: false, isDelete: false, transactions: false });
				if (!user) return res.status(404).json({ success: false, message: "User not found" });

				res.status(200).json({ success: true, message: "Successful query", user });
			} catch (err) {
				res.status(400).json({ success: false, message: "An error occurred" });
			}
			break;

		// Delete user (PROTECTED)
		case "DELETE":
			if (session) {
				if (session.user.email === email) {
					try {
						const deletedUser = await User.findOneAndDelete({ email: email });
						if (!deletedUser) return res.status(404).json({ success: false, message: "User not found" });

						res.status(200).json({
							success: true,
							message: "User account deleted",
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

		default:
			res.status(500).json({ success: false, message: "Route is not valid" });
			break;
	}
}
