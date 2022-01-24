import { getSession } from "next-auth/react";
import { supabase } from "@utils/supabaseClient";

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
				const { email, password, first_name, last_name, address, contact1, contact2 } = req.body;

				// Register into authentication pool
				let { user, error } = await supabase.auth.signUp(
					{
						email: email,
						password: password,
					},
					{
						data: { first_name: first_name, last_name: last_name, address: address, contact1: contact1, contact2: contact2 },
					}
				);

				// Insert record into profiles table
				await supabase
					.from("profiles")
					.insert([
						{ id: user.id, email: email, password: password, first_name: first_name, last_name: last_name, address: address, contact1: contact1, contact2: contact2 },
					]);

				res.status(200).json({ user: user, error });
			} catch (error) {
				res.status(500).json({ error: error });
			}
			break;

		default:
			res.status(500).json({ success: false, msg: "Route is not valid" });
			break;
	}
}

export default handler;
