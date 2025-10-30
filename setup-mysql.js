const mysql = require('mysql2/promise');

async function setupDatabase() {
  try {
    // Connect to MySQL server (without specifying database)
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'cjMaster25@#'
    });

    console.log('Connected to MySQL server');

    // Create database
    await connection.execute('CREATE DATABASE IF NOT EXISTS guesthouse_db');
    console.log('Database created or already exists');

    // Use the database
    await connection.execute('USE guesthouse_db');

    // Create tables
    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        role ENUM('admin', 'manager') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS guesthouses (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        address TEXT,
        city VARCHAR(255),
        country VARCHAR(255),
        manager_id VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS rooms (
        id VARCHAR(36) PRIMARY KEY,
        guesthouse_id VARCHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        capacity INT NOT NULL DEFAULT 1,
        price_per_night DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (guesthouse_id) REFERENCES guesthouses(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS room_availability (
        id VARCHAR(36) PRIMARY KEY,
        room_id VARCHAR(36) NOT NULL,
        date DATE NOT NULL,
        is_available BOOLEAN NOT NULL DEFAULT TRUE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_room_date (room_id, date),
        FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS photos (
        id VARCHAR(36) PRIMARY KEY,
        guesthouse_id VARCHAR(36) NOT NULL,
        url TEXT NOT NULL,
        caption TEXT,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (guesthouse_id) REFERENCES guesthouses(id) ON DELETE CASCADE
      );
    `;

    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }

    console.log('Tables created successfully');

    // Insert default admin user
    const adminExists = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['admin@example.com']
    );

    if (adminExists[0].length === 0) {
      const { v4: uuidv4 } = require('uuid');
      await connection.execute(
        `INSERT INTO users (id, email, password_hash, full_name, role) VALUES 
         (?, 'admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2JlWK7McqG', 'Admin User', 'admin')`,
        [uuidv4()]
      );
      console.log('Default admin user created');
    } else {
      console.log('Default admin user already exists');
    }

    await connection.end();
    console.log('Database setup completed successfully!');
    console.log('You can now login with: admin@example.com / admin123');

  } catch (error) {
    console.error('Database setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();