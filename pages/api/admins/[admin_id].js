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
        case "PUT":
            try {
                const admin = await Admin.findByIdAndUpdate(admin_id, req.body, {
                    new: true,
                    runValidators: true,
                });

                if (!admin) return res.status(400).json({ success: false });

                res.status(200).json({ success: true, data: admin });
            } catch (err) {
                res.status(400).json({ success: false, msg: err });
            }
            break;

        case "GET":
            try {
                const admin = await Admin.findById(admin_id);
                if (!admin) return res.status(400).json({ success: false });

                res.status(200).json({ success: true, data: admin });
            } catch (err) {
                res.status(400).json({ success: false, msg: err });
            }
            break;

        case "DELETE":
            try {
                // Check if admin account is not deletable
                const admin = await Admin.findOne({ _id: admin_id, isDelete: false });
                if (admin)
                    return res
                        .status(400)
                        .json({ success: false, msg: "This admin account cannot be deleted!" });

                const deletedAdmin = await Admin.deleteOne({ _id: admin_id });
                if (!deletedAdmin) return res.status(400).json({ success: false });

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
