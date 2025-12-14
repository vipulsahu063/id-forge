import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// Define interfaces for query results
interface OfficerRow extends RowDataPacket {
  id: number;
  station_id: string;
  custom_fields: string | Record<string, unknown>;
  created_at: string;
}

interface StationRow extends RowDataPacket {
  station_id: string;
}

// GET - Fetch officers (existing)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const stationId = searchParams.get('station_id');

    if (!stationId) {
      return Response.json(
        { success: false, message: "Station ID is required" },
        { status: 400 }
      );
    }

    const [officers] = await db.query(
      `SELECT id, station_id, custom_fields, created_at 
       FROM officers 
       WHERE station_id = ? 
       ORDER BY created_at DESC`,
      [stationId]
    ) as [OfficerRow[], unknown];

    // Parse JSON custom_fields
    const parsedOfficers = officers.map((officer) => ({
      ...officer,
      custom_fields: typeof officer.custom_fields === 'string' 
        ? JSON.parse(officer.custom_fields) 
        : officer.custom_fields
    }));

    return Response.json({ success: true, data: parsedOfficers });

  } catch (error) {
    console.error('Error fetching officers:', error);
    return Response.json(
      { success: false, message: "Failed to fetch officers" },
      { status: 500 }
    );
  }
}

// POST - Add new officer
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { station_id, custom_fields } = await req.json();

    console.log('=== API RECEIVED ===');
    console.log('Station ID:', station_id);
    console.log('Custom fields received:', custom_fields);
    console.log('Custom fields JSON string:', JSON.stringify(custom_fields));
    console.log('===================');

    // Validate
    if (!station_id || !custom_fields) {
      return Response.json(
        { success: false, message: "Station ID and custom fields are required" },
        { status: 400 }
      );
    }

    // Check if station exists
    const [station] = await db.query(
      'SELECT station_id FROM stations WHERE station_id = ?',
      [station_id]
    ) as [StationRow[], unknown];

    if (station.length === 0) {
      return Response.json(
        { success: false, message: "Station not found" },
        { status: 404 }
      );
    }

    // Insert officer with custom fields as JSON
    const [result] = await db.query(
      `INSERT INTO officers (station_id, custom_fields, created_at) 
       VALUES (?, ?, NOW())`,
      [station_id, JSON.stringify(custom_fields)]
    ) as [ResultSetHeader, unknown];

    return Response.json({
      success: true,
      message: "Officer added successfully",
      data: {
        id: result.insertId,
        station_id,
        custom_fields,
      }
    });

  } catch (error) {
    console.error('Error adding officer:', error);
    return Response.json(
      { success: false, message: "Failed to add officer" },
      { status: 500 }
    );
  }
}
