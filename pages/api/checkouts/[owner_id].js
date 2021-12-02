import createConnection from "@utils/createConnection";
import Checkout from "@models/CheckoutModel";

async function handler(req, res) {
    // Create connection to database
    await createConnection();

    // Unpack the request
    const {
        query: { owner_id },
        method,
    } = req;

    switch (method) {
        // Update checkout
        case "PUT":
            try {
                const checkout = await Checkout.updateOne({ ownerId: owner_id }, req.body, {
                    new: true,
                    runValidators: true,
                });

                if (!checkout) return res.status(404).json({ success: false });

                res.status(200).json({ success: true, data: checkout });
            } catch (err) {
                res.status(400).json({ success: false, msg: err });
            }
            break;

        // Get checkout
        case "GET":
            try {
                const checkout = await Checkout.findOne({ ownerId: owner_id });
                if (!checkout) return res.status(404).json({ success: false });

                res.status(200).json({ success: true, data: checkout });
            } catch (err) {
                res.status(400).json({ success: false, msg: err });
            }
            break;

        // Delete checkout
        case "DELETE":
            try {
                const deletedCheckout = await Checkout.deleteOne({ ownerId: owner_id });
                if (!deletedCheckout) return res.status(404).json({ success: false });

                res.status(200).json({ success: true, data: deletedCheckout });
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
