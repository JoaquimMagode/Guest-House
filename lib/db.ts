import mysql from 'mysql2/promise'

function getPool() {
  return mysql.createPool({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306'),
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'guesthouse_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: false
  })
}

export default {
  execute: (sql: string, params?: any[]) => getPool().execute(sql, params),
  query: (sql: string, params?: any[]) => getPool().query(sql, params)
}