import createConnection from "@utils/mongoDBConnection";
import { hash, compare } from "bcryptjs";

import Admin from "@models/AdminModel";

async function handler(req, res) {
    // Create connection to database
    await createConnection();

    // Unpack the request
    const {
        query: { email },
        method,
    } = req;

    switch (method) {
        // Update admin
        case "PUT":
            try {
                // Find admin
                const admin = await Admin.findOne({ email: email }, { __v: false, cart: false });
                if (!admin)
                    return res.status(404).json({ success: false, msg: "Admin not found." });

                // Check to see if password was changed, re-hash if changed
                const samePassword = await compare(req.body.password, admin.password);
                if (!samePassword) admin.password = await hash(req.body.password, 12);

                // Update user
                const updatedAdmin = await Admin.findByIdAndUpdate(admin._id, admin, {
                    new: true,
                    runValidators: true,
                });

                res.status(200).json({
                    success: true,
                    msg: "Admin account updated successfully.",
                    data: updatedAdmin,
                });
            } catch (err) {
                res.status(400).json({ success: false, msg: err });
            }
            break;

        // Get admin
        case "GET":
            try {
                const admin = await Admin.findOne({ email: email }, { __v: false, cart: false });
                if (!admin)
                    return res.status(400).json({ success: false, msg: "Admin not found." });

                res.status(200).json({ success: true, data: admin });
            } catch (err) {
                res.status(400).json({ success: false, msg: err });
            }
            break;

        // Delete admin
        case "DELETE":
            try {
                // Check if admin account is deletable
                const deletedAdmin = await Admin.deleteOne({ email: email, isDelete: true });
                if (!deletedAdmin)
                    return res.status(400).json({
                        success: false,
                        msg: "This admin account cannot be found or deleted.",
                    });

                res.status(200).json({
                    success: true,
                    msg: "Admin account deleted successfully.",
                    data: deletedAdmin,
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
