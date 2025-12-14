import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const [stations] = await db.query(
      `SELECT 
        id, 
        station_name, 
        station_id, 
        created_date
      FROM stations 
      ORDER BY created_date DESC`
    );

    return Response.json({ success: true, data: stations });

  } catch (error) {
    console.error('Error fetching stations:', error);
    return Response.json(
      { success: false, message: "Failed to fetch stations" },
      { status: 500 }
    );
  }
}
