import createConnection from "@utils/mongoDBConnection";
import Admin from "@models/AdminModel";

async function handler(req, res) {
    // Create connection to database
    await createConnection();

    // Unpack the request
    const {
        query: { admin_id },
        method,
    } = req;

    switch (method) {
        // Update admin
        case "PUT":
            try {
                /* 
                    TODO: If password changed, re-hash password before updating 
                */

                const admin = await Admin.findByIdAndUpdate(admin_id, req.body, {
                    new: true,
                    runValidators: true,
                });

                if (!admin)
                    return res.status(404).json({ success: false, msg: "Admin not found." });

                res.status(200).json({
                    success: true,
                    msg: "Admin account updated successfully.",
                    data: admin,
                });
            } catch (err) {
                res.status(400).json({ success: false, msg: err });
            }
            break;

        // Get admin
        case "GET":
            try {
                const admin = await Admin.findById(admin_id);
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
                const deletedAdmin = await Admin.deleteOne({ _id: admin_id, isDelete: true });
                if (!deletedAdmin)
                    return res.status(400).json({
                        success: false,
                        msg: "This admin account cannot be found or deleted.",
                    });

                res.status(200).json({ success: true, msg: deletedAdmin });
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
