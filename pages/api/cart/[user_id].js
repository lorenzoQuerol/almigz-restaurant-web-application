import createConnection from "@utils/mongoDBConnection";
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
        // Update cart
        case "PUT":
            try {
                const cart = await User.findByIdAndUpdate(user_id, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!cart) return res.status(404).json({ success: false, msg: "User not found." });

                res.status(200).json({
                    success: true,
                    msg: "Cart updated successfully.",
                    data: cart,
                });
            } catch (err) {
                res.status(400).json({ success: false, msg: err });
            }
            break;

        // Get cart
        case "GET":
            try {
                const cart = await User.findById(user_id, "cart");
                if (!cart) return res.status(404).json({ success: false, msg: "User not found." });

                res.status(200).json({ success: true, data: cart });
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
