import createConnection from "@utils/mongoDBConnection";
import { hash, compare } from "bcryptjs";

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
		// Update user
		case "PUT":
			try {
				// Find user
				const user = await User.findOne({ email: email }, { __v: false, cart: false });
				if (!user) return res.status(404).json({ success: false, msg: "User not found." });

				// Check to see if password was changed, re-hash if changed
				const samePassword = await compare(req.body.password, user.password);
				if (!samePassword) user.password = await hash(req.body.password, 12);

				// Update user
				const updatedUser = await User.findOne({ email: email }, user, {
					new: true,
					runValidators: true,
				});

				res.status(200).json({
					success: true,
					msg: "User account updated successfully.",
					data: updatedUser,
				});
			} catch (err) {
				res.status(400).json({ success: false, msg: err });
			}
			break;

		// Get user
		case "GET":
			try {
				const user = await User.findOne({ email: email }, { __v: false, cart: false });
				if (!user) return res.status(404).json({ success: false, msg: "User not found." });

				res.status(200).json({ success: true, data: user });
			} catch (err) {
				res.status(400).json({ success: false, msg: err });
			}
			break;

		// Delete user
		case "DELETE":
			try {
				const deletedUser = await User.findOneAndDelete({ email: email });
				if (!deletedUser) return res.status(404).json({ success: false, msg: "User not found." });

				res.status(200).json({
					success: true,
					msg: "User account deleted successfully.",
					data: deletedUser,
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
