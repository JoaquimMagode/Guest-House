# MySQL Setup Instructions

## 1. Install MySQL
Download and install MySQL from: https://dev.mysql.com/downloads/mysql/

## 2. Start MySQL Service
- Open Services (services.msc)
- Find "MySQL80" service and start it
- Or use Command Prompt as Administrator: `net start mysql80`

## 3. Create Database
Open MySQL Command Line Client or MySQL Workbench and run:
```sql
CREATE DATABASE IF NOT EXISTS guesthouse_db;
USE guesthouse_db;
```

## 4. Import Schema
Run the init.sql file in MySQL:
```sql
SOURCE C:/Users/Joaquim Magode/Documents/GitHub/Guest-House/init.sql;
```

## 5. Update Environment
The .env.local file has been created with default settings:
- Host: localhost
- Port: 3306
- User: root
- Password: (empty - change if you set a root password)
- Database: guesthouse_db

## 6. Test Connection
Restart your Next.js application after MySQL setup is complete.