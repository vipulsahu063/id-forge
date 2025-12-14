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

    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const [result] = await db.query(
      'DELETE FROM officers WHERE id = ?',
      [id]
    ) as [ResultSetHeader, unknown];

    if (result.affectedRows === 0) {
      return Response.json(
        { success: false, message: "Officer not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Officer deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting officer:', error);
    return Response.json(
      { success: false, message: "Failed to delete officer" },
      { status: 500 }
    );
  }
}
