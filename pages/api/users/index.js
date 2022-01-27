import { hash } from "bcryptjs";
import { getSession } from "next-auth/react";
import createConnection from "@utils/mongoDBConnection";
import User from "@models/UserModel";

async function handler(req, res) {
	await createConnection();
	const session = await getSession({ req });
	const { method } = req;

	switch (method) {
		// Get all users (ADMIN-PROTECTED)
		case "GET":
			if (session) {
				if (session.user.isAdmin) {
					try {
						const users = await User.find({}, { __v: false, _id: false, transactions: false });
						if (!users) return res.status(404).json({ success: false, message: "Cannot get users" });

						res.status(200).json({ success: true, message: "Successful query", users });
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

		// Create new user (UNPROTECTED)
		case "POST":
			try {
				// Check for duplicates
				const duplicate = await User.findOne({ email: req.body.email });
				if (duplicate)
					return res.status(400).json({
						success: false,
						message: "User already registered",
					});

				if (req.body.password) req.body.password = await hash(req.body.password, 12);

				const user = await User.create(req.body);

				res.status(201).json({
					success: true,
					message: "User account created",
					user,
				});
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
