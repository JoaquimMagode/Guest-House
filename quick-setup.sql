-- Quick MySQL setup - Run this in MySQL Workbench or Command Line Client
CREATE DATABASE IF NOT EXISTS guesthouse_db;
USE guesthouse_db;

-- Create users table
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role ENUM('admin', 'manager') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create guesthouses table
CREATE TABLE guesthouses (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
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

-- Create rooms table
CREATE TABLE rooms (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  guesthouse_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  capacity INT NOT NULL DEFAULT 1,
  price_per_night DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (guesthouse_id) REFERENCES guesthouses(id) ON DELETE CASCADE
);

-- Create room_availability table
CREATE TABLE room_availability (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  room_id VARCHAR(36) NOT NULL,
  date DATE NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_room_date (room_id, date),
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Create photos table
CREATE TABLE photos (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  guesthouse_id VARCHAR(36) NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (guesthouse_id) REFERENCES guesthouses(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, role) VALUES 
('admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2JlWK7McqG', 'Admin User', 'admin');

SELECT 'Database setup completed!' as status;