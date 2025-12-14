import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'elite',
  database: 'umeed_ki_kiran',
  waitForConnections: true,
  connectionLimit: 10
});