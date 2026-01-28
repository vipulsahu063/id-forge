import { db } from '@/lib/db';

export async function GET() {
  try {
    // mysql2 pool.query() returns [rows, fields]
    const [rows] = await db.execute('SELECT * FROM stations');
    // or: const [rows, fields] = await db.query('SELECT * FROM stations');
    
    return Response.json({ success: true, data: rows });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
