import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { compare } from "bcryptjs";

export default NextAuth({
	// Random string for hashing tokens
	secret: process.env.SECRET,

	// Configure JWT
	session: { strategy: "jwt" },
	jwt: {
		secret: process.env.JWT_SECRET,
		maxAge: 28800, // 8 hours
	},

	// Specify Provider
	providers: [
		CredentialsProvider({
			async authorize(credentials) {
				// Unpack the credentials
				const { email, password } = credentials;

				// Get user via email
				try {
					const res = await axios.get(`${process.env.NEXTAUTH_URL}/api/users/${email}`);
					let user = res.data.data;
					if (!user) return null;

					// Check hashed password with database password
					const checkPassword = await compare(password, user.password);
					if (!checkPassword) return null;

					// Return user object
					user = { name: `${user.firstName} ${user.lastName}`, email: user.email, isAdmin: user.isAdmin };
					return user;
				} catch (err) {
					return null;
				}
			},
		}),
	],

	pages: {
		signIn: "/auth/signIn",
	},

	// Check if the user logging in is an administrator. Fields returned in session:
	// Admin: user, email, isAdmin (Boolean)
	// User: user, email
	callbacks: {
		jwt: async ({ token, user }) => {
			if (user) token.isAdmin = user.isAdmin;
			return token;
		},

		session: async ({ session, token }) => {
			if (token.isAdmin) session.user.isAdmin = token.isAdmin;
			else delete session.user.isAdmin;

			delete session.user.image;

			return session;
		},
	},
});
