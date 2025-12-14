import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';

// Define interface for station query result
interface StationRow extends RowDataPacket {
  station_id: string;
  station_name: string;
  password_hash: string;
}

export async function POST(req: Request) {
  try {
    const { stationName, username, password } = await req.json();
    
    if (!stationName || !username || !password) {
      return Response.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const [existing] = await db.query(
      'SELECT * FROM stations WHERE station_id = ?',
      [username]
    ) as [StationRow[], unknown];

    if (existing.length > 0) {
      return Response.json(
        { success: false, message: 'Username already exists' },
        { status: 409 }
      );
    }

    // Hash password before storing
    const password_hash = await bcrypt.hash(password, 10);

    // Insert new station with hashed password
    await db.query(
      'INSERT INTO stations (station_name, station_id, password_hash) VALUES (?, ?, ?)',
      [stationName, username, password_hash]
    );

    return Response.json(
      { success: true, message: 'Station created successfully' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating station:', error);
    return Response.json(
      { success: false, message: 'Database error occurred' },
      { status: 500 }
    );
  }
}
