# User Management System

A professional desktop application built with Electron, React, and SQLite for managing user information, payments, and tracking financial records.

## Features

- **Secure Login System**: Admin authentication with encrypted passwords
- **Dashboard**: Overview of total users, amounts, and recent payments
- **User Management**: Add, view, and manage user profiles
- **Comprehensive User Details**: Store all required user information including:
  - Personal details (Name, Mobile)
  - Family information (Father, Relative, Spouse names and mobile numbers)
  - Identification numbers (ID, B.No, S.ID No, V No)
  - Dates (Admission, Validity/Expiry)
  - Financial information (Total Amount)
  - Photo uploads (4 separate photos)
- **Payment Tracking**: Record and track received amounts with dates
- **Financial Reports**: View total amounts, received amounts, and remaining balances
- **Search & Filter**: Easy user search and filtering capabilities
- **Professional UI**: Modern, responsive design with Tailwind CSS

## Screenshots

The application includes:
1. **Login Page**: Secure authentication
2. **Dashboard**: Statistics and overview
3. **Users List**: Table view with search functionality
4. **Add User**: Comprehensive form for new user registration
5. **User Details**: Complete user profile with payment management

## Technology Stack

- **Frontend**: React 18 with modern hooks
- **Desktop Framework**: Electron 28
- **Database**: SQLite3 with encrypted storage
- **Styling**: Tailwind CSS for professional design
- **Build Tools**: Webpack 5 with Babel
- **Security**: bcryptjs for password hashing

## Installation

### Prerequisites

- Node.js 16+ 
- npm or yarn package manager

### Setup Instructions

1. **Clone or download the project**
   ```bash
   cd user-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the application**
   ```bash
   npm run build
   ```

4. **Start the application**
   ```bash
   npm start
   ```

### Development Mode

For development with hot reloading:
```bash
npm run dev
```

## Building for Distribution

### Windows (.exe)
```bash
npm run dist
```
The executable will be created in the `dist` folder.

### macOS (.dmg)
```bash
npm run dist
```
The DMG file will be created in the `dist` folder.

### Linux (.AppImage)
```bash
npm run dist
```
The AppImage will be created in the `dist` folder.

## Default Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

**Important**: Change these credentials after first login for security.

## Database Structure

The application uses SQLite with the following tables:

- **users**: Main user information
- **user_photos**: Photo storage and management
- **payments**: Payment tracking and history
- **admin_users**: Admin authentication

## File Structure

```
user-management-app/
├── main.js                 # Electron main process
├── package.json           # Dependencies and scripts
├── webpack.config.js      # Webpack configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── src/
│   ├── index.html         # Main HTML file
│   ├── js/
│   │   ├── App.js         # Main React component
│   │   └── components/    # React components
│   │       ├── Login.js
│   │       ├── Dashboard.js
│   │       ├── Users.js
│   │       ├── AddUser.js
│   │       └── UserDetail.js
│   └── styles/
│       └── input.css      # Tailwind CSS input
└── dist/                  # Built application
```

## Usage Guide

### Adding a New User
1. Navigate to "Add User" from the sidebar
2. Fill in all required fields (Name and Mobile are mandatory)
3. Upload 4 photos as required
4. Click "Add User" to save

### Managing Payments
1. Go to "Users" and click "View Details" on any user
2. Click "Add Payment" button
3. Enter amount and payment date
4. Submit to record the payment

### Viewing Reports
- **Dashboard**: Overview of all statistics
- **Users**: Complete list with search functionality
- **User Details**: Individual user profile with payment history

## Security Features

- Password encryption using bcryptjs
- SQL injection prevention with parameterized queries
- Secure IPC communication between main and renderer processes
- Input validation and sanitization

## Customization

### Styling
Modify `src/styles/input.css` to customize the appearance using Tailwind CSS classes.

### Database Fields
Edit the database schema in `main.js` to add or modify user fields.

### Business Logic
Modify the React components to adjust business rules and workflows.

## Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all dependencies are installed with `npm install`
2. **Database Issues**: Check if the SQLite database file has proper permissions
3. **Photo Upload**: Ensure the photos directory is writable

### Performance

- The application is optimized for desktop use
- SQLite provides fast local database operations
- React ensures smooth UI interactions

## Support

For issues or questions:
1. Check the console for error messages
2. Verify all dependencies are correctly installed
3. Ensure proper file permissions

## License

MIT License - Feel free to modify and distribute as needed.

## Future Enhancements

Potential improvements:
- Export functionality (PDF, Excel)
- Backup and restore capabilities
- Multi-language support
- Advanced reporting and analytics
- Cloud synchronization
- User roles and permissions
