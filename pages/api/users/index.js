import createConnection from "@utils/mongoDBConnection";
import User from "@models/UserModel";

async function handler(req, res) {
    // Create connection to database
    await createConnection();

    // Unpack the request to get method
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const users = await User.find({});

                res.status(200).json({ success: true, data: users });
            } catch (err) {
                res.status(400).json({ success: false, msg: err });
            }
            break;

        case "POST":
            try {
                const duplicate = await User.findOne({ email: req.body.email });

                // Check if there is a duplicate account in the system
                if (duplicate)
                    return res.status(400).json({
                        success: false,
                        msg: "Email address already exists in the system. Please use a different email address!",
                    });

                const user = await User.create(req.body);

                res.status(201).json({ success: true, data: user });
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
