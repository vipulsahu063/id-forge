import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";

// Define interface for station query result
interface StationRow extends RowDataPacket {
  id: number;
  station_name: string;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { newPassword } = await req.json();

    // Validate password
    if (!newPassword) {
      return Response.json(
        { success: false, message: "New password is required" },
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

    // Check if station exists
    const [station] = await db.query(
      'SELECT id, station_name FROM stations WHERE id = ?',
      [id]
    ) as [StationRow[], unknown];

    if (station.length === 0) {
      return Response.json(
        { success: false, message: "Station not found" },
        { status: 404 }
      );
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.query(
      'UPDATE stations SET password_hash = ? WHERE id = ?',
      [passwordHash, id]
    );

    return Response.json(
      { 
        success: true, 
        message: `Password reset successfully for ${station[0].station_name}` 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error resetting password:', error);
    return Response.json(
      { success: false, message: "Failed to reset password" },
      { status: 500 }
    );
  }
}
