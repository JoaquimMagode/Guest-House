const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function fixAdminPassword() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'admin',
      database: 'guesthouse_db'
    });

    // Hash the password with bcryptjs (same as auth.ts)
    const passwordHash = await bcrypt.hash('admin123', 12);
    
    // Update admin user password
    await connection.execute(
      'UPDATE users SET password_hash = ? WHERE email = ?',
      [passwordHash, 'admin@example.com']
    );

    console.log('Admin password updated successfully!');
    console.log('You can now login with: admin@example.com / admin123');

    await connection.end();
  } catch (error) {
    console.error('Failed to update password:', error.message);
  }
}

fixAdminPassword();