import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import axios from "axios";
import { compare } from "bcryptjs";

export default NextAuth({
    // Configure JWT
    session: {
        jwt: true,
    },

    pages: {
        signIn: "/auth/login",
        //     signOut: "/auth/signout",
        //     error: "/auth/error", // Error code passed in query string as ?error=
        //     verifyRequest: "/auth/verify-request", // (used for check email message)
        //     newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
    },

    // Specify Provider
    providers: [
        Providers.Credentials({
            async authorize(credentials) {
                // Unpack the credentials
                const { email, password } = credentials;

                // Get user via email
                const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/users/${email}`);
                const user = res.data;
                if (!user) throw new Error("User not found.");

                // Check hashed password with database password
                const checkPassword = await compare(password, user.data.password);
                if (!checkPassword) throw new Error("Incorrect password.");

                return { email: user.data.email };
            },
        }),
    ],
});
