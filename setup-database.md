# Database Setup Instructions

## Prerequisites
1. Install MySQL Server on your machine
2. Create a database user with appropriate permissions

## Setup Steps

1. **Install MySQL** (if not already installed):
   - Download from https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP for Windows

2. **Update Environment Variables**:
   Edit `.env.local` file with your MySQL server details:
   ```
   DATABASE_HOST=your_mysql_host_or_ip
   DATABASE_PORT=3306
   DATABASE_USER=your_username
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=guesthouse_db
   JWT_SECRET=your_very_secure_random_string_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Create Database**:
   Connect to your MySQL server and run:
   ```sql
   CREATE DATABASE IF NOT EXISTS guesthouse_db;
   ```

4. **Run Database Schema**:
   Execute the SQL script in `scripts/mysql_schema.sql` using your MySQL client:
   ```bash
   mysql -h your_host -u your_username -p guesthouse_db < scripts/mysql_schema.sql
   ```

5. **Default Login**:
   - Email: admin@example.com
   - Password: admin123

## Notes
- The schema includes a default admin user
- All tables use UUID primary keys for better security
- Foreign key constraints ensure data integrity
- The database is optimized with proper indexes