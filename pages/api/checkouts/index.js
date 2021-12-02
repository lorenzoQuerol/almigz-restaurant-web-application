import createConnection from "@utils/mongoDBConnection";
import Checkout from "@models/CheckoutModel";

async function handler(req, res) {
    // Create connection to database
    await createConnection();

    // Unpack the request to get method
    const { method } = req;

    switch (method) {
        // Get all checkout documents
        case "GET":
            try {
                const checkouts = await Checkout.find({});

                res.status(200).json({ success: true, data: checkouts });
            } catch (err) {
                res.status(400).json({ success: false, msg: err });
            }
            break;

        // Create new checkout document
        case "POST":
            try {
                const newCheckout = await Checkout.create(req.body);

                res.status(201).json({ success: true, data: newCheckout });
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
