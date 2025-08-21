# 🏗️ Contractor Attendance System - Frontend

A modern Vue.js application for managing contractor attendance with role-based access control and real-time data synchronization.

## 🚀 Overview

This is the frontend application for the Contractor Attendance System built with Vue 3, Vuetify 3, and Firebase. It provides a comprehensive solution for managing contractor attendance, user management, and administrative tasks with different access levels for various user roles.

## 👥 User Roles & Access

- **Admin**: Full system access, user management, system administration
- **HR**: Human resources management, worker oversight, attendance reports
- **Finance**: Financial reports, payroll management, cost analysis
- **Manager**: Team management, attendance monitoring, operational oversight
- **Guard**: Attendance scanning, check-in/check-out operations

## 🔒 Authentication & Security

The system includes comprehensive authentication features:

- **Firebase Authentication**: Secure user authentication with email/password
- **Role-based Access Control**: Different dashboards and permissions per role
- **Password Management**: 
  - Forgot password functionality
  - Force password change for first-time users
  - Secure password update options
- **Session Management**: Persistent login state with automatic route restoration

## 🛠️ Tech Stack

### Frontend Technologies
- **Vue 3**: Progressive JavaScript framework with Composition API
- **Vuetify 3**: Material Design component library
- **Pinia**: Modern state management for Vue
- **Vue Router**: Client-side routing with navigation guards
- **Vite**: Fast build tool with HMR (Hot Module Replacement)

### Firebase Integration
- **Firebase Authentication**: User authentication and management
- **Cloud Firestore**: Real-time NoSQL database
- **Firebase SDK**: Client-side Firebase integration

### Development Tools
- **ESLint**: Code linting and formatting
- **TypeScript Support**: Type checking and IntelliSense
- **Auto-Import**: Automatic component importing

## 📁 Project Structure

```
contractor_attendance_system/
├── src/
│   ├── components/          # Reusable Vue components
│   │   ├── App/            # Application-level components
│   │   └── Core/           # Core UI components (Charts, Dialogs)
│   ├── layouts/            # Page layouts
│   ├── pages/              # Page components
│   ├── views/              # Role-specific dashboard views
│   │   ├── Admin/          # Admin dashboard and children
│   │   ├── HR/             # HR dashboard and children
│   │   ├── Finance/        # Finance dashboard and children
│   │   ├── Manager/        # Manager dashboard and children
│   │   └── Guard/          # Guard scanning interface
│   ├── stores/             # Pinia state management
│   ├── router/             # Vue Router configuration
│   ├── services/           # API services and utilities
│   ├── plugins/            # Vue plugins configuration
│   ├── locales/            # Internationalization files
│   └── styles/             # Global styles and themes
├── public/                 # Static assets
└── functions/              # Firebase Functions (Backend)
```

## 🔥 Features

### 🔐 Authentication System
- Secure login with Firebase Authentication
- Role-based dashboard routing
- Password reset functionality
- Force password change for new users
- Session persistence across page refreshes

### 📊 Dashboard Management
- **Admin Dashboard**: Complete system administration
- **HR Dashboard**: Human resources management
- **Finance Dashboard**: Financial reporting and analysis
- **Manager Dashboard**: Team and project management
- **Guard Interface**: Simple scanning and check-in system

### 🎨 UI/UX Features
- Material Design with Vuetify 3
- Responsive design for all devices
- Dark/Light theme support
- Multi-language support (English, Sinhala, Tamil)
- Real-time data updates

### 📱 Progressive Web App
- Offline functionality
- Fast loading with Vite
- Mobile-optimized interface

## 💿 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun
- Firebase project setup

### Step 1: Install Dependencies

Choose your preferred package manager:

| Package Manager | Command        |
|----------------|----------------|
| [yarn](https://yarnpkg.com/getting-started) | `yarn install` |
| [npm](https://docs.npmjs.com/cli/v7/commands/npm-install) | `npm install` |
| [pnpm](https://pnpm.io/installation) | `pnpm install` |
| [bun](https://bun.sh/#getting-started) | `bun install` |

### Step 2: Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore
3. Copy your Firebase configuration
4. Update `src/firebase.js` with your configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### Step 3: Environment Setup

Ensure your Firebase Functions are deployed (see `../functions/README.md`)

## 🚀 Development

### Starting Development Server

To start the development server with hot-reload:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev

# Using bun
bun run dev
```

The application will be available at `http://localhost:3000` (or next available port)

### Building for Production

To build the project for production:

```bash
# Using npm
npm run build

# Using yarn
yarn build

# Using pnpm
pnpm build

# Using bun
bun run build
```

## 🔑 Default Login Credentials

**Admin User:**
- Email: `admin@printcare.com`
- Password: `Admin@123`

*Note: You'll be prompted to change the password on first login*

## 🏗️ Architecture

### State Management
- **Pinia Stores**: Modular state management
  - `auth.js`: Authentication state and user management
  - `theme.js`: Theme and UI preferences
  - `language.js`: Internationalization state

### Routing Structure
- **Public Routes**: Login page
- **Protected Routes**: Role-based dashboard access
- **Navigation Guards**: Authentication and authorization checks
- **Route Persistence**: Maintains current page on refresh

### Component Organization
- **Layouts**: Shared page structures
- **Views**: Page-level components for each role
- **Components**: Reusable UI components
- **Core Components**: Charts, dialogs, and utilities

## 🔧 Configuration

### Firebase Setup
The application connects to Firebase for:
- User authentication
- Firestore database operations
- Cloud Functions API calls

### Theme Customization
Located in `src/plugins/vuetify.js`:
- Light and dark theme variants
- Custom color schemes
- Material Design 3 integration

### Internationalization
Supported languages in `src/locales/`:
- English (`en.json`)
- Sinhala (`si.json`)
- Tamil (`ta.json`)

## 🛡️ Security Features

- **Authentication Guards**: Prevent unauthorized access
- **Role-based Access Control**: Different permissions per user type
- **Session Management**: Secure token handling
- **CORS Configuration**: Proper cross-origin request handling
- **Input Validation**: Client-side form validation

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interfaces
- Accessible navigation

## 🚀 Performance

- **Vite**: Lightning-fast development builds
- **Code Splitting**: Lazy-loaded routes
- **Tree Shaking**: Optimized bundle size
- **Hot Module Replacement**: Instant updates during development

## � API Integration

Connects to Firebase Functions backend:
- Authentication endpoints
- User management APIs
- Attendance tracking
- Worker management
- Reporting functions

## 📋 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the Firebase documentation
- Review Vuetify documentation
- Create an issue in the repository
