import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";

// Define types for database results
interface AdminRow extends RowDataPacket {
  id: number;
  username: string;
  password_hash: string;
}

interface StationRow extends RowDataPacket {
  id: number;
  station_id: string;
  station_name: string;
  password_hash: string;
}

// EXPORT authOptions - this is critical!
export const authOptions: NextAuthOptions = {
  providers: [
    // Admin Login Provider
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        try {
          const [rows] = await db.query(
            'SELECT * FROM admin WHERE username = ?',
            [credentials.email]
          ) as [AdminRow[], unknown];

          if (rows.length === 0) {
            throw new Error("Invalid credentials");
          }

          const admin = rows[0];
          const isValid = await bcrypt.compare(credentials.password, admin.password_hash);

          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: admin.id.toString(),
            email: admin.username,
            role: "admin" as const
          };
        } catch {
          throw new Error("Authentication failed");
        }
      }
    }),

    // Station Login Provider
    CredentialsProvider({
      id: "station-login",
      name: "Station Login",
      credentials: {
        station_id: { label: "Station ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.station_id || !credentials?.password) {
          throw new Error("Station ID and password required");
        }

        try {
          const [rows] = await db.query(
            'SELECT * FROM stations WHERE station_id = ?',
            [credentials.station_id]
          ) as [StationRow[], unknown];

          if (rows.length === 0) {
            throw new Error("Invalid credentials");
          }

          const station = rows[0];
          const isValid = await bcrypt.compare(credentials.password, station.password_hash);

          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: station.id.toString(),
            station_id: station.station_id,
            station_name: station.station_name,
            role: "station" as const
          };
        } catch {
          throw new Error("Authentication failed");
        }
      }
    })
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },

  pages: {
    signIn: "/station/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.station_id = user.station_id as string;
        token.station_name = user.station_name as string;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.station_id = token.station_id as string;
        session.user.station_name = token.station_name as string;
        session.user.email = token.email as string;
      }
      return session;
    }
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
