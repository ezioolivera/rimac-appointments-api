import mysql, { Pool } from 'mysql2/promise';

let pool: Pool | null = null;

export function getMysqlPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,

      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    });
  }

  return pool;
}