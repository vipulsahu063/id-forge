import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { ResultSetHeader } from "mysql2";

export async function DELETE(
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
    const stationId = id;

    // First, delete related officers (if any)
    await db.query('DELETE FROM officers WHERE station_id = (SELECT station_id FROM stations WHERE id = ?)', [stationId]);

    // Then delete the station
    const [result] = await db.query(
      'DELETE FROM stations WHERE id = ?', 
      [stationId]
    ) as [ResultSetHeader, unknown];

    if (result.affectedRows === 0) {
      return Response.json(
        { success: false, message: "Station not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Station deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting station:', error);
    return Response.json(
      { success: false, message: "Failed to delete station" },
      { status: 500 }
    );
  }
}
