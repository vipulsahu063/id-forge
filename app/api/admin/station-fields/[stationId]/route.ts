import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

// Define interfaces for query results
interface CustomFieldRow extends RowDataPacket {
  id: number;
  field_name: string;
  field_label: string;
  field_type: string;
  field_options: string | null;
  is_required: boolean;
  field_order: number;
}

interface StationRow extends RowDataPacket {
  station_id: string;
}

// GET - Fetch custom fields for a station
export async function GET(
  req: Request,
  { params }: { params: Promise<{ stationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { stationId } = await params;

    const [fields] = await db.query(
      `SELECT 
        id, 
        field_name, 
        field_label, 
        field_type, 
        field_options, 
        is_required, 
        field_order 
      FROM station_custom_fields 
      WHERE station_id = ? 
      ORDER BY field_order ASC`,
      [stationId]
    ) as [CustomFieldRow[], unknown];

    return Response.json({ 
      success: true, 
      data: fields 
    });

  } catch (error) {
    console.error('Error fetching custom fields:', error);
    return Response.json(
      { success: false, message: "Failed to fetch fields" },
      { status: 500 }
    );
  }
}

// POST - Save/Update custom fields for a station
export async function POST(
  req: Request,
  { params }: { params: Promise<{ stationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { stationId } = await params;
    const { fields } = await req.json();

    // Validate
    if (!fields || !Array.isArray(fields)) {
      return Response.json(
        { success: false, message: "Invalid fields data" },
        { status: 400 }
      );
    }

    // Check if station exists
    const [station] = await db.query(
      'SELECT station_id FROM stations WHERE station_id = ?',
      [stationId]
    ) as [StationRow[], unknown];

    if (station.length === 0) {
      return Response.json(
        { success: false, message: "Station not found" },
        { status: 404 }
      );
    }

    // Delete existing fields for this station
    await db.query(
      'DELETE FROM station_custom_fields WHERE station_id = ?',
      [stationId]
    );

    // Insert new fields
    if (fields.length > 0) {
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        
        // Generate field_name from label if not provided
        const fieldName = field.field_name || 
          field.field_label.toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_|_$/g, '');

        await db.query(
          `INSERT INTO station_custom_fields 
          (station_id, field_name, field_label, field_type, field_options, is_required, field_order) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            stationId,
            fieldName,
            field.field_label,
            field.field_type,
            field.field_options || null,
            field.is_required ? 1 : 0,
            i
          ]
        );
      }
    }

    return Response.json({
      success: true,
      message: "Custom fields saved successfully",
    });

  } catch (error) {
    console.error('Error saving custom fields:', error);
    return Response.json(
      { success: false, message: "Failed to save fields" },
      { status: 500 }
    );
  }
}

// DELETE - Remove all custom fields for a station
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ stationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== "admin") {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { stationId } = await params;

    await db.query(
      'DELETE FROM station_custom_fields WHERE station_id = ?',
      [stationId]
    );

    return Response.json({
      success: true,
      message: "All custom fields deleted successfully",
    });

  } catch (error) {
    console.error('Error deleting custom fields:', error);
    return Response.json(
      { success: false, message: "Failed to delete fields" },
      { status: 500 }
    );
  }
}
