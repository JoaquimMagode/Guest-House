@echo off
echo Running MySQL setup...
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
mysql.exe -u root -p < "c:\Users\Joaquim Magode\Documents\GitHub\Guest-House\quick-setup.sql"
pause