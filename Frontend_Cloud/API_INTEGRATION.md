# API Integration Guide

## Overview
The frontend has been integrated with the backend APIs. All services are configured to communicate with `http://localhost:8080`.

## Services Created

### 1. **api.js** - Base API Configuration
- Location: `src/services/api.js`
- Axios instance with interceptors
- Automatically adds Bearer token to all requests
- Handles 401 errors (redirects to login)

### 2. **authService.js** - Authentication APIs
- `register(username, password, email)` - Register new user
- `login(username, password)` - Login and store token
- `verifyOTP(otp)` - Verify 2FA code
- `logout()` - Clear local storage
- `getCurrentUser()` - Get logged in user
- `isAuthenticated()` - Check if user is logged in
- `isAdmin()` - Check if user has admin role

### 3. **vmService.js** - VM Management APIs
- `createVM(vmData)` - Create new VM
- `getMyVMs()` - Get user's VMs
- `executeInVM(clientId, vmId, command)` - Execute command
- `startVM(vmId)` - Start VM
- `stopVM(vmId)` - Stop VM
- `getVMDetails(vmId)` - Get VM information

### 4. **adminService.js** - Admin APIs
- `getAllUsers()` - Get all users
- `getUserDetails(userId)` - Get specific user
- `getAllClients()` - Get all PCs
- `getClientDetails(clientId)` - Get PC details
- `getAllVMs()` - Get all VMs
- `getVMById(vmId)` - Get specific VM
- `getVMsOnClient(clientId)` - Get VMs on a PC

## Routes Configured

### Public Routes (No Authentication Required)
- `/login` - Login page
- `/register` - Registration page
- `/2fa` - Two-factor authentication
- `/forgot-password` - Password recovery
- `/reset-password` - Reset password

### User Routes (Authentication Required)
- `/user/dashboard` - User dashboard with VMs
- `/user/create-vm` - Create new VM
- `/user/profile` - User profile

### Admin Routes (Admin Role Required)
- `/admin/dashboard` - Admin dashboard
- `/admin/user/:userId` - User details
- `/admin/client/:clientId` - PC details
- `/admin/all-vms` - All VMs listing
- `/admin/profile` - Admin profile

## Protected Route Components

### ProtectedRoute
- Checks if user is authenticated
- Redirects to `/login` if not authenticated

### AdminRoute
- Checks if user is authenticated AND has admin role
- Redirects to `/login` if not authenticated
- Redirects to `/user/dashboard` if not admin

### PublicRoute
- Redirects authenticated users to their dashboard
- Admins go to `/admin/dashboard`
- Users go to `/user/dashboard`

## Authentication Flow

1. **Login**: User enters username/password → API call → Token stored in localStorage → Redirect based on role
2. **Protected Pages**: Check token → If invalid/missing, redirect to login
3. **Logout**: Clear localStorage → Redirect to login

## Token Storage

Tokens are stored in localStorage:
- `token` - JWT authentication token
- `user` - User object with role information

## API Endpoints Mapped

### User Endpoints
- `POST /auth/register` - Register
- `POST /auth/login` - Login
- `GET /auth/otp/verify` - OTP verification
- `POST /vms/create` - Create VM
- `GET /vms/my` - Get my VMs
- `POST /vms/exec` - Execute command

### Admin Endpoints
- `GET /admin/users` - All users
- `GET /admin/users/:userId` - User details
- `GET /admin/clients` - All clients/PCs
- `GET /admin/clients/:clientId` - Client details
- `GET /admin/vms` - All VMs
- `GET /admin/clients/:clientId/vms` - VMs on client

## Next Steps for Full Integration

### User Dashboard (UserDashboard.jsx)
1. Replace mock data with `getMyVMs()` API call
2. Implement VM start/stop functionality
3. Connect terminal modal to `executeInVM()` API

### Create VM Page (CreateVM.jsx)
1. Connect form submission to `createVM()` API
2. Add validation and error handling
3. Redirect to dashboard after successful creation

### Admin Dashboard (AdminDashboard.jsx)
1. Replace mock data with `getAllUsers()` API call
2. Implement user search functionality
3. Calculate real-time statistics from API data

### User Details (UserDetails.jsx)
- ✅ Already integrated with `getUserDetails(userId)` API
- Shows user information and connected PCs

### All VMs Page (AllVMs.jsx)
1. Replace mock data with `getAllVMs()` API call
2. Implement filtering by status
3. Add search functionality

## Running the Application

1. **Start Backend**: Ensure backend is running on `http://localhost:8080`
2. **Start Frontend**: `npm run dev`
3. **Access**: Open `http://localhost:5173`

## Environment Configuration

To change the API base URL, edit `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080'; // Change this
```

For production, you can use environment variables:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
```

Then create `.env` file:
```
VITE_API_URL=https://your-production-api.com
```
