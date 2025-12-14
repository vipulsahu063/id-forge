import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";

// Define interfaces for query results
interface AdminRow extends RowDataPacket {
  id: number;
  password_hash: string;
}

interface StationRow extends RowDataPacket {
  id: number;
  password_hash: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    console.log("Full session:", session);  // Debug log

    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return Response.json(
        { success: false, message: "New passwords do not match" },
        { status: 400 }
      );
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return Response.json(
        { 
          success: false, 
          message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character" 
        },
        { status: 400 }
      );
    }

    // Check user role and get current password hash
    const userRole = session?.user?.role;
    console.log("User role:", userRole);  // Debug log
    console.log("Session user:", session.user);  // Debug log

    if (!userRole) {
      return Response.json(
        { success: false, message: "User role not found in session" },
        { status: 400 }
      );
    }

    let currentPasswordHash: string;
    let userId: number;

    if (userRole === "admin") {
      const [rows] = await db.query(
        'SELECT id, password_hash FROM admin WHERE username = ?',
        [session?.user?.email]
      ) as [AdminRow[], unknown];

      if (rows.length === 0) {
        return Response.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      currentPasswordHash = rows[0].password_hash;
      userId = rows[0].id;
    } else if (userRole === "station") {
      const [rows] = await db.query(
        'SELECT id, password_hash FROM stations WHERE station_id = ?',
        [session?.user?.station_id]
      ) as [StationRow[], unknown];

      if (rows.length === 0) {
        return Response.json(
          { success: false, message: "Station not found" },
          { status: 404 }
        );
      }

      currentPasswordHash = rows[0].password_hash;
      userId = rows[0].id;
    } else {
      return Response.json(
        { success: false, message: "Invalid user role: " + userRole },
        { status: 400 }
      );
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, currentPasswordHash);

    if (!isValidPassword) {
      return Response.json(
        { success: false, message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password in database
    if (userRole === "admin") {
      await db.query(
        'UPDATE admin SET password_hash = ? WHERE id = ?',
        [newPasswordHash, userId]
      );
    } else {
      await db.query(
        'UPDATE stations SET password_hash = ? WHERE id = ?',
        [newPasswordHash, userId]
      );
    }

    return Response.json(
      { success: true, message: "Password updated successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error('Change password error:', error);
    return Response.json(
      { success: false, message: "Failed to update password" },
      { status: 500 }
    );
  }
}
