import { supabase } from "@utils/supabaseClient";
import createConnection from "@utils/mongoDBConnection";

async function handler(req, res) {
	// Unpack the request
	const {
		query: { id },
		method,
	} = req;

	switch (method) {
		// Get user (PROTECTED)
		case "GET":
			break;

		// Update user (PROTECTED)
		case "PUT":
			break;

		// Delete user (PROTECTED)
		case "DELETE":
			try {
				const { data: user, error } = await supabase.auth.api.deleteUser(id, process.env.SUPABASE_SERVICE_ROLE_KEY);
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
