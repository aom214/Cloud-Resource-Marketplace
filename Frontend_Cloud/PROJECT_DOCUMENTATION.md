# Cloud VM Marketplace - Frontend

A modern, feature-rich frontend application for managing cloud virtual machines with separate user and admin dashboards.

## 🚀 Features

### Authentication Pages
- **Login** - User authentication with email and password
- **Register** - New user registration with role selection (User/Admin)
- **Two-Factor Authentication (2FA)** - Enhanced security with 6-digit verification
- **Forgot Password** - Password recovery flow
- **Reset Password** - Set new password with validation

### User Dashboard
- **Dashboard Overview** - Statistics and VM metrics
  - Total VMs count
  - Running VMs status
  - CPU and Memory allocation
  - Visual VM cards with detailed specifications
- **Create VM** - Interactive VM creation form
  - CPU cores selection (2, 4, 8, 16)
  - Memory selection (4, 8, 16, 32 GB)
  - Storage selection (100, 250, 500, 1000 GB)
  - OS selection (Ubuntu, Windows Server, CentOS, Debian, Fedora)
- **VM Terminal** - Interactive terminal for running VMs
  - Client ID and VM ID configuration
  - Command execution interface
  - Real-time output display
- **User Profile** - Manage personal information and settings

### Admin Dashboard
- **Admin Overview** - Platform-wide statistics
  - Total users and active users
  - All VMs across platform
  - Connected PCs count
  - Total storage allocation
- **User Management** - View all users with details
  - User cards showing PCs and VMs
  - Quick access to user details
- **User Details** - Individual user information
  - Contact information
  - Connected PCs overview
  - VM statistics
- **PC Details** - Physical computer information
  - System specifications
  - VMs hosted on the PC
  - Resource allocation
- **All VMs** - Complete VM listing across platform
  - Filter by status (All, Running, Stopped, Pending)
  - Search functionality
  - User and PC association info
- **Admin Profile** - Admin account settings

## 🎨 Design Features

- **Light Theme** - Clean, modern light theme throughout
- **Gradient Accents** - Beautiful indigo-to-purple gradients
- **Responsive Design** - Mobile-friendly layouts
- **Interactive Cards** - Hover effects and smooth transitions
- **Icon Integration** - SVG icons for visual clarity
- **Status Indicators** - Color-coded status badges
- **Terminal UI** - Professional terminal interface for VM interaction

## 📁 Project Structure

```
src/
├── login/
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   └── Card.jsx
│   └── pages/
│       ├── Login.jsx
│       ├── Register.jsx
│       ├── TwoFactorAuth.jsx
│       ├── ForgotPassword.jsx
│       └── ResetPassword.jsx
├── users_dashboard/
│   ├── components/
│   │   ├── VMCard.jsx
│   │   ├── TerminalModal.jsx
│   │   ├── StatsCard.jsx
│   │   └── Navbar.jsx
│   └── pages/
│       ├── UserDashboard.jsx
│       ├── CreateVM.jsx
│       └── UserProfile.jsx
├── admin_dashboard/
│   ├── components/
│   │   ├── UserCard.jsx
│   │   ├── PCCard.jsx
│   │   └── AdminStatsCard.jsx
│   └── pages/
│       ├── AdminDashboard.jsx
│       ├── UserDetails.jsx
│       ├── PCDetails.jsx
│       ├── AllVMs.jsx
│       └── AdminProfile.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## 🛠️ Technologies Used

- **React 19** - Latest React version
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## 🗺️ Routes

### Authentication Routes
- `/login` - Login page
- `/register` - Registration page
- `/2fa` - Two-factor authentication
- `/forgot-password` - Forgot password
- `/reset-password` - Reset password

### User Routes
- `/user/dashboard` - User dashboard
- `/user/create-vm` - Create new VM
- `/user/profile` - User profile

### Admin Routes
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - Users list
- `/admin/user/:userId` - User details
- `/admin/user/:userId/pc/:pcId` - PC details
- `/admin/all-vms` - All VMs across platform
- `/admin/profile` - Admin profile

## 📝 TODO: Backend Integration

The following features require backend API integration:

1. **Authentication**
   - Login API endpoint
   - Registration API endpoint
   - 2FA verification
   - Password reset flow

2. **User Dashboard**
   - Fetch user's VMs
   - Create VM API
   - Start/Stop VM operations
   - Terminal command execution

3. **Admin Dashboard**
   - Fetch all users
   - Fetch user details
   - Fetch PC details
   - Fetch all VMs
   - User management operations

4. **Profile Management**
   - Update user profile
   - Update admin profile
   - Change password
   - 2FA setup

## 🎯 Key Components

### Reusable Components
- **Button** - Customizable button with variants
- **Input** - Form input with labels and icons
- **Card** - Container with shadow and border
- **VMCard** - VM display card with specs
- **StatsCard** - Statistics display card
- **TerminalModal** - Interactive terminal interface
- **Navbar** - Navigation bar for dashboards

## 🔐 Security Notes

- All routes currently accessible without authentication
- TODO: Implement route guards for protected routes
- TODO: Add JWT token management
- TODO: Implement role-based access control

## 🎨 Customization

The application uses Tailwind CSS for styling. Key colors:
- Primary: Indigo (500-600)
- Secondary: Purple (500-600)
- Accent: Pink (500-600)
- Success: Green (500-600)
- Warning: Yellow (500-600)
- Error: Red (500-600)

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

This project is proprietary and confidential.

---

Built with ❤️ using React and Tailwind CSS
