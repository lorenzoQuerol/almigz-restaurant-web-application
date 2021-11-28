import createConnection from "@utils/mongoDBConnection";
import Cart from "@models/CartModel";

async function handler(req, res) {
    // Create connection to database
    await createConnection();

    // Unpack the request to get method
    const { method } = req;

    switch (method) {
        // Get all cart documents
        case "GET":
            try {
                const carts = await Cart.find({});

                res.status(200).json({ success: true, data: carts });
            } catch (err) {
                res.status(400).json({ success: false, msg: err });
            }
            break;

        // Create new cart document
        case "POST":
            try {
                const newCart = await Cart.create(req.body);

                res.status(201).json({ success: true, data: newCart });
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
