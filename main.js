const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');

let mainWindow;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    title: 'User Management System'
  });

  mainWindow.loadFile('src/index.html');
  
  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');
    
    // Initialize SQL.js
    const SQL = await initSqlJs({
      locateFile: file => path.join(__dirname, 'public', file)
    });
    
    console.log('SQL.js initialized successfully');
    
    // Create or load database
    const dbPath = path.join(__dirname, 'users.db');
    let db;
    
    try {
      // Try to load existing database
      const fs = require('fs');
      if (fs.existsSync(dbPath)) {
        console.log('Loading existing database...');
        const data = fs.readFileSync(dbPath);
        db = new SQL.Database(data);
      } else {
        console.log('Creating new database...');
        db = new SQL.Database();
      }
    } catch (error) {
      console.log('Error loading database, creating new one:', error.message);
      db = new SQL.Database();
    }
    
    console.log('Creating tables...');
    
    // Create tables
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      mobile TEXT NOT NULL,
      father_name TEXT,
      father_mobile TEXT,
      relative_name TEXT,
      relative_mobile TEXT,
      spouse_name TEXT,
      spouse_mobile TEXT,
      id_number TEXT,
      b_number TEXT,
      s_id_number TEXT,
      v_number TEXT,
      admission_date TEXT,
      validity_date TEXT,
      total_amount REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS user_photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      photo_path TEXT NOT NULL,
      photo_order INTEGER NOT NULL,
      original_filename TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);
    
    // Add missing columns to existing table if they don't exist
    try {
      db.run("ALTER TABLE user_photos ADD COLUMN original_filename TEXT");
    } catch (e) {
      // Column already exists, ignore error
    }
    
    try {
      db.run("ALTER TABLE user_photos ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP");
    } catch (e) {
      // Column already exists, ignore error
    }

    db.run(`CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      amount REAL NOT NULL,
      payment_date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log('Tables created successfully');

    // Insert default admin user if not exists
    const adminCount = db.exec("SELECT COUNT(*) as count FROM admin_users");
    if (adminCount.length === 0 || adminCount[0].values[0][0] === 0) {
      console.log('Creating default admin user...');
      const defaultPassword = 'admin123';
      const hash = await bcrypt.hash(defaultPassword, 10);
      db.run("INSERT INTO admin_users (username, password_hash) VALUES (?, ?)", ['admin', hash]);
    }
    
    // Save database to file
    const fs = require('fs');
    const data = db.export();
    fs.writeFileSync(dbPath, data);
    
    // Store database instance globally
    global.db = db;
    
    console.log('Database initialization completed successfully');
    
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// IPC handlers for database operations
ipcMain.handle('login', async (event, username, password) => {
  try {
    const result = global.db.exec("SELECT * FROM admin_users WHERE username = ?", [username]);
    if (result.length === 0 || result[0].values.length === 0) {
      return { success: false, message: 'Invalid credentials' };
    }
    
    const row = result[0];
    const columns = row.columns;
    const values = row.values[0];
    const user = {};
    columns.forEach((col, index) => {
      user[col] = values[index];
    });
    
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (isMatch) {
      return { success: true, user: { id: user.id, username: user.username } };
    } else {
      return { success: false, message: 'Invalid credentials' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Database error' };
  }
});

ipcMain.handle('get-dashboard-stats', async () => {
  try {
    const usersResult = global.db.exec("SELECT COUNT(*) as total_users FROM users");
    const amountResult = global.db.exec("SELECT COALESCE(SUM(total_amount), 0) as total_amount FROM users");
    const paymentsResult = global.db.exec("SELECT COALESCE(SUM(amount), 0) as total_received FROM payments");
    const recentPaymentsResult = global.db.exec("SELECT * FROM payments ORDER BY created_at DESC LIMIT 5");
    
    const totalUsers = usersResult.length > 0 ? usersResult[0].values[0][0] : 0;
    const totalAmount = amountResult.length > 0 ? amountResult[0].values[0][0] : 0;
    const totalReceived = paymentsResult.length > 0 ? paymentsResult[0].values[0][0] : 0;
    
    // Convert recent payments to proper format
    const recentPayments = [];
    if (recentPaymentsResult.length > 0) {
      const columns = recentPaymentsResult[0].columns;
      recentPaymentsResult[0].values.forEach(row => {
        const payment = {};
        columns.forEach((col, index) => {
          payment[col] = row[index];
        });
        recentPayments.push(payment);
      });
    }
    
    return {
      totalUsers: totalUsers,
      totalAmount: totalAmount,
      totalReceived: totalReceived,
      recentPayments: recentPayments
    };
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return {
      totalUsers: 0,
      totalAmount: 0,
      totalReceived: 0,
      recentPayments: []
    };
  }
});

ipcMain.handle('get-users', async () => {
  try {
    const result = global.db.exec("SELECT * FROM users ORDER BY created_at DESC");
    const users = [];
    
    if (result.length > 0) {
      const columns = result[0].columns;
      result[0].values.forEach(row => {
        const user = {};
        columns.forEach((col, index) => {
          user[col] = row[index];
        });
        users.push(user);
      });
    }
    
    return users;
  } catch (error) {
    console.error('Get users error:', error);
    return [];
  }
});

ipcMain.handle('add-user', async (event, userData) => {
  try {
    const sql = `INSERT INTO users (
      name, mobile, father_name, father_mobile, relative_name, relative_mobile,
      spouse_name, spouse_mobile, id_number, b_number, s_id_number, v_number,
      admission_date, validity_date, total_amount
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const params = [
      userData.name, userData.mobile, userData.father_name, userData.father_mobile,
      userData.relative_name, userData.relative_mobile, userData.spouse_name,
      userData.spouse_mobile, userData.id_number, userData.b_number,
      userData.s_id_number, userData.v_number, userData.admission_date,
      userData.validity_date, userData.total_amount
    ];
    
    global.db.run(sql, params);
    
    // Get the last inserted ID
    const result = global.db.exec("SELECT last_insert_rowid() as id");
    const userId = result.length > 0 ? result[0].values[0][0] : 1;
    
    // Save database
    const fs = require('fs');
    const data = global.db.export();
    fs.writeFileSync(path.join(__dirname, 'users.db'), data);
    
    return { success: true, userId: userId };
  } catch (error) {
    console.error('Add user error:', error);
    return { success: false, message: error.message };
  }
});

ipcMain.handle('get-user', async (event, userId) => {
  try {
    const userResult = global.db.exec("SELECT * FROM users WHERE id = ?", [userId]);
    if (userResult.length === 0 || userResult[0].values.length === 0) {
      return null;
    }
    
    // Convert user result to object
    const columns = userResult[0].columns;
    const values = userResult[0].values[0];
    const user = {};
    columns.forEach((col, index) => {
      user[col] = values[index];
    });
    
    const paymentsResult = global.db.exec("SELECT * FROM payments WHERE user_id = ? ORDER BY payment_date DESC", [userId]);
    const payments = [];
    
    if (paymentsResult.length > 0) {
      const paymentColumns = paymentsResult[0].columns;
      paymentsResult[0].values.forEach(row => {
        const payment = {};
        paymentColumns.forEach((col, index) => {
          payment[col] = row[index];
        });
        payments.push(payment);
      });
    }
    
    return {
      user: user,
      payments: payments
    };
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
});

ipcMain.handle('add-payment', async (event, paymentData) => {
  try {
    global.db.run("INSERT INTO payments (user_id, amount, payment_date) VALUES (?, ?, ?)", 
      [paymentData.userId, paymentData.amount, paymentData.paymentDate]);
    
    // Get the last inserted ID
    const result = global.db.exec("SELECT last_insert_rowid() as id");
    const paymentId = result.length > 0 ? result[0].values[0][0] : 1;
    
    // Save database
    const fs = require('fs');
    const data = global.db.export();
    fs.writeFileSync(path.join(__dirname, 'users.db'), data);
    
    return { success: true, paymentId: paymentId };
  } catch (error) {
    console.error('Add payment error:', error);
    return { success: false, message: error.message };
  }
});

ipcMain.handle('update-user', async (event, { userId, ...userData }) => {
  try {
    if (!global.db) {
      return { success: false, message: 'Database not initialized' };
    }
    
    // Update user information
    global.db.run(`
      UPDATE users SET 
        name = ?, mobile = ?, father_name = ?, father_mobile = ?,
        relative_name = ?, relative_mobile = ?, spouse_name = ?, spouse_mobile = ?,
        id_number = ?, b_number = ?, s_id_number = ?, v_number = ?,
        admission_date = ?, validity_date = ?, total_amount = ?
      WHERE id = ?
    `, [
      userData.name, userData.mobile, userData.father_name, userData.father_mobile,
      userData.relative_name, userData.relative_mobile, userData.spouse_name, userData.spouse_mobile,
      userData.id_number, userData.b_number, userData.s_id_number, userData.v_number,
      userData.admission_date, userData.validity_date, userData.total_amount, userId
    ]);
    
    // Save database
    const fs = require('fs');
    const data = global.db.export();
    fs.writeFileSync(path.join(__dirname, 'users.db'), data);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, message: error.message };
  }
});

// Handle photo upload and storage
ipcMain.handle('upload-photos', async (event, { userId, photos }) => {
  try {
    if (!global.db) {
      return { success: false, message: 'Database not initialized' };
    }
    
    const fs = require('fs');
    const path = require('path');
    
    // Create photos directory if it doesn't exist
    const photosDir = path.join(__dirname, 'photos', userId.toString());
    if (!fs.existsSync(photosDir)) {
      fs.mkdirSync(photosDir, { recursive: true });
    }
    
    // Clear existing photos for this user
    global.db.run("DELETE FROM user_photos WHERE user_id = ?", [userId]);
    
    const savedPhotos = [];
    
    for (let i = 0; i < photos.length; i++) {
      if (photos[i]) {
        const photoData = photos[i];
        const buffer = Buffer.from(photoData.data);
        const filename = `photo_${i + 1}_${Date.now()}.jpg`;
        const filePath = path.join(photosDir, filename);
        
        // Save photo to file system
        fs.writeFileSync(filePath, buffer);
        
        // Save photo info to database
        global.db.run(
          "INSERT INTO user_photos (user_id, photo_path, photo_order, original_filename) VALUES (?, ?, ?, ?)",
          [userId, filePath, i + 1, photoData.name]
        );
        
        savedPhotos.push({
          path: filePath,
          order: i + 1,
          filename: photoData.name
        });
      }
    }
    
    // Save database
    const data = global.db.export();
    fs.writeFileSync(path.join(__dirname, 'users.db'), data);
    
    return { success: true, photos: savedPhotos };
  } catch (error) {
    console.error('Error uploading photos:', error);
    return { success: false, message: error.message };
  }
});

// Handle get user photos
ipcMain.handle('get-user-photos', async (event, userId) => {
  try {
    if (!global.db) {
      return { success: false, message: 'Database not initialized' };
    }
    
    const result = global.db.exec("SELECT * FROM user_photos WHERE user_id = ? ORDER BY photo_order", [userId]);
    const photos = [];
    
    if (result.length > 0) {
      const columns = result[0].columns;
      result[0].values.forEach(row => {
        const photo = {};
        columns.forEach((col, index) => {
          photo[col] = row[index];
        });
        photos.push(photo);
      });
    }
    
    return { success: true, photos: photos };
  } catch (error) {
    console.error('Error getting user photos:', error);
    return { success: false, message: error.message };
  }
});

app.whenReady().then(() => {
  // Create window immediately
  createWindow();
  
  // Initialize database in background
  initializeDatabase().catch(error => {
    console.error('Failed to initialize database:', error);
  });
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (db) {
    db.close();
  }
});
