import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import { verifyPassword } from "@/app/lib/password";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required");
                }

                await connectDB();

                // Find user with password field included
                const user = await User.findOne({ email: credentials.email }).select(
                    "+password"
                );

                if (!user || !user.password) {
                    throw new Error("Invalid email or password");
                }

                // Verify password
                const isValid = await verifyPassword(
                    credentials.password,
                    user.password
                );

                if (!isValid) {
                    throw new Error("Invalid email or password");
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                };
            },
        }),
    ],

    callbacks: {
        async signIn({ user }) {
            await connectDB();

            const existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
                await User.create({
                    name: user.name,
                    email: user.email,
                    provider: "google",
                });
            }
            return true;
        },

        async session({ session }) {
            await connectDB();

            const dbUser = await User.findOne({ email: session.user?.email });
            if (dbUser) {
                // 👇 EXTREMELY IMPORTANT
                (session.user as any).id = dbUser._id.toString();
            }

            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};
