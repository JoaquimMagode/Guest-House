@echo off
echo Setting up MySQL database for Guest House...

REM Check if MySQL is running
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL is not installed or not in PATH
    echo Please install MySQL and add it to your PATH
    pause
    exit /b 1
)

echo Creating database and tables...
mysql -u root -p < init.sql

if %errorlevel% equ 0 (
    echo Database setup completed successfully!
    echo Default admin user: admin@example.com
    echo Default password: admin123
) else (
    echo Database setup failed!
)

pause