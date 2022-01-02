import createConnection from "@utils/mongoDBConnection";
import { hash } from "bcryptjs";

import Admin from "@models/AdminModel";

async function handler(req, res) {
    // Create connection to database
    await createConnection();

    // Unpack the request to get method
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const admins = await Admin.find({}, { __v: false });

                res.status(200).json({ success: true, data: admins });
            } catch (err) {
                res.status(400).json({ success: false, msg: err });
            }
            break;

        case "POST":
            try {
                const duplicate = await Admin.findOne({ email: req.body.email });

                // Check if there is a duplicate account in the system
                if (duplicate)
                    return res.status(400).json({
                        success: false,
                        msg: "Email address already exists in the system. Please use a different email address.",
                    });

                // Encrypt password
                req.body.password = await hash(req.body.password, 12);

                // Create new document
                const admin = await Admin.create(req.body);

                res.status(201).json({
                    success: true,
                    msg: "Admin account created successfully.",
                    data: admin,
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
