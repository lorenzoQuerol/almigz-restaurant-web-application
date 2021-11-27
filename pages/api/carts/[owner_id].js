import createConnection from "@utils/mongoDBConnection";
import Cart from "@models/CartModel";

async function handler(req, res) {
    // Create connection to database
    await createConnection();

    // Unpack the request
    const {
        query: { owner_id },
        method,
    } = req;

    switch (method) {
        // Update cart
        case "PUT":
            try {
                const cart = await Cart.updateOne({ ownerId: owner_id }, req.body, {
                    new: true,
                    runValidators: true,
                });

                if (!cart) return res.status(404).json({ success: false });

                res.status(200).json({ success: true, data: cart });
            } catch (err) {
                res.status(400).json({ success: false, msg: err });
            }
            break;

        // Get cart
        case "GET":
            try {
                const cart = await Cart.findOne({ ownerId: owner_id });
                if (!cart) return res.status(404).json({ success: false });

                res.status(200).json({ success: true, data: cart });
            } catch (err) {
                res.status(400).json({ success: false, msg: err });
            }
            break;

        // Delete cart
        case "DELETE":
            try {
                const deletedCart = await Cart.deleteOne({ ownerId: owner_id });
                if (!deletedCart) return res.status(404).json({ success: false });

                res.status(200).json({ success: true, data: deletedCart });
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
