import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

// Define interfaces for query results
interface CountResult extends RowDataPacket {
  total?: number;
  recent?: number;
}

interface OfficerCustomFields extends RowDataPacket {
  custom_fields: string | Record<string, unknown>;
}

interface FieldConfig extends RowDataPacket {
  field_name: string;
  field_type: string;
}

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

    // Get total officers count
    const [totalResult] = await db.query(
      'SELECT COUNT(*) as total FROM officers WHERE station_id = ?',
      [stationId]
    ) as [CountResult[], unknown];
    const totalOfficers = totalResult[0]?.total || 0;

    // Get officers added this month
    const [recentResult] = await db.query(
      `SELECT COUNT(*) as recent 
       FROM officers 
       WHERE station_id = ? 
       AND MONTH(created_at) = MONTH(CURRENT_DATE()) 
       AND YEAR(created_at) = YEAR(CURRENT_DATE())`,
      [stationId]
    ) as [CountResult[], unknown];
    const recentAdditions = recentResult[0]?.recent || 0;

    // Get all officers with their custom fields
    const [officers] = await db.query(
      'SELECT custom_fields FROM officers WHERE station_id = ?',
      [stationId]
    ) as [OfficerCustomFields[], unknown];

    // Get station custom fields configuration
    const [fieldConfig] = await db.query(
      'SELECT field_name, field_type FROM station_custom_fields WHERE station_id = ?',
      [stationId]
    ) as [FieldConfig[], unknown];

    // Calculate incomplete records (officers missing required field values)
    let incompleteRecords = 0;
    
    if (officers.length > 0 && fieldConfig.length > 0) {
      officers.forEach((officer) => {
        const customFields = typeof officer.custom_fields === 'string' 
          ? JSON.parse(officer.custom_fields) 
          : officer.custom_fields;

        // Check if any field is empty or missing
        const hasIncompleteFields = fieldConfig.some((field) => {
          const value = customFields[field.field_name];
          return !value || value === '' || value === null;
        });

        if (hasIncompleteFields) {
          incompleteRecords++;
        }
      });
    }

    // Calculate completion rate
    const completionRate = totalOfficers > 0 
      ? Math.round(((totalOfficers - incompleteRecords) / totalOfficers) * 100)
      : 0;

    return Response.json({
      success: true,
      data: {
        totalOfficers,
        incompleteRecords,
        recentAdditions,
        completionRate,
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return Response.json(
      { success: false, message: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
