const { app } = require('electron');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

console.log('🧹 Database Reset Script');
console.log('This will clear all test data while preserving admin login credentials...');

async function resetDatabase() {
  try {
    const dbPath = path.join(__dirname, 'users.db');
    
    // Check if database exists
    if (!fs.existsSync(dbPath)) {
      console.log('❌ Database file not found. Nothing to reset.');
      return;
    }
    
    console.log('📁 Database found at:', dbPath);
    console.log('🗑️  Clearing all test data...');
    
    // Initialize SQL.js
    const initSqlJs = require('sql.js');
    const SQL = await initSqlJs({
      locateFile: file => path.join(__dirname, 'public', file)
    });
    
    // Load existing database
    const data = fs.readFileSync(dbPath);
    const db = new SQL.Database(data);
    
    // Clear all data from tables (but keep table structure)
    console.log('🗑️  Clearing users table...');
    db.run("DELETE FROM users");
    
    console.log('🗑️  Clearing user_photos table...');
    db.run("DELETE FROM user_photos");
    
    console.log('🗑️  Clearing payments table...');
    db.run("DELETE FROM payments");
    
    // Reset auto-increment counters
    console.log('🔄 Resetting auto-increment counters...');
    db.run("DELETE FROM sqlite_sequence WHERE name IN ('users', 'user_photos', 'payments')");
    
    // Clear photos directory if it exists
    const photosDir = path.join(__dirname, 'photos');
    if (fs.existsSync(photosDir)) {
      console.log('🗑️  Clearing photos directory...');
      fs.rmSync(photosDir, { recursive: true, force: true });
      console.log('✅ Photos directory cleared');
    }
    
    // Ensure admin user exists with default credentials
    console.log('🔐 Ensuring admin user exists...');
    const adminCount = db.exec("SELECT COUNT(*) as count FROM admin_users");
    if (adminCount.length === 0 || adminCount[0].values[0][0] === 0) {
      console.log('👤 Creating default admin user...');
      const defaultPassword = 'admin123';
      const hash = await bcrypt.hash(defaultPassword, 10);
      db.run("INSERT INTO admin_users (username, password_hash) VALUES (?, ?)", ['admin', hash]);
      console.log('✅ Admin user created: admin / admin123');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    // Save the cleaned database
    console.log('💾 Saving cleaned database...');
    const cleanedData = db.export();
    fs.writeFileSync(dbPath, cleanedData);
    
    console.log('✅ Database reset completed successfully!');
    console.log('');
    console.log('📋 What was cleared:');
    console.log('   - All users and their data');
    console.log('   - All user photos');
    console.log('   - All payment records');
    console.log('   - Photos directory');
    console.log('');
    console.log('🔐 What was preserved:');
    console.log('   - Admin login credentials (admin / admin123)');
    console.log('   - Database table structure');
    console.log('');
    console.log('🎯 You can now start fresh with a clean database!');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  }
}

// Run the reset
resetDatabase();

