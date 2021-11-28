import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import { compare } from "bcryptjs";

import User from "@models/UserModel";

export default NextAuth({
    // Configure JWT
    session: {
        jwt: true,
    },

    // Specify Provider
    providers: [
        Providers.Credentials({
            async authorize(req, res) {
                // Create connection to database
                await createConnection();

                // Unpack the request
                const {
                    query: { password, email },
                } = req;

                try {
                    // Get user via email
                    const result = await User.findOne({ email: email });

                    if (!result)
                        return res
                            .status(404)
                            .json({ success: false, msg: "User cannot be found." });

                    // Check hashed password with database password
                    const checkPassword = await compare(password, result.password);

                    if (!checkPassword) res.status(401).json({ success: false, msg: err });

                    res.status(200).json({ success: true, data: result });
                } catch (err) {
                    res.status(500).json({ success: false, msg: err });
                }
            },
        }),
    ],
});
