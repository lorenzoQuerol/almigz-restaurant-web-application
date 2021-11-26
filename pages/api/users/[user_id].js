import createConnection from "@utils/createConnection";
import User from "@models/UserModel";

async function handler(req, res) {
    // Create connection to database
    await createConnection();

    // Unpack the request
    const {
        query: { user_id },
        method,
    } = req;

    switch (method) {
        // Update user
        case "PUT":
            try {
                const user = await User.findByIdAndUpdate(user_id, req.body, {
                    new: true,
                    runValidators: true,
                });

                if (!user) return res.status(404).json({ success: false });

                res.status(200).json({ success: true, data: user });
            } catch (err) {
                res.status(400).json({ success: false, msg: err });
            }
            break;

        // Get user
        case "GET":
            try {
                const user = await User.findById(user_id);
                if (!user) return res.status(404).json({ success: false });

                res.status(200).json({ success: true, data: user });
            } catch (err) {
                res.status(400).json({ success: false, msg: err });
            }
            break;

        // Delete user
        case "DELETE":
            try {
                const deletedUser = await User.deleteOne({ _id: user_id });
                if (!deletedUser) return res.status(404).json({ success: false });

                res.status(200).json({ success: true, data: deletedUser });
            } catch (err) {
                res.status(400).json({ success: false, msg: err });
            }
            break;

        default:
            res.status(400).json({ success: false });
            break;
    }
}

export default handler;
