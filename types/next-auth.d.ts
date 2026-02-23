import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "user" | "admin" | "master_admin";
        } & DefaultSession["user"];
    }

    interface User {
        role: "user" | "admin" | "master_admin";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: "user" | "admin" | "master_admin";
    }
}
