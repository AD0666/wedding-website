# Password Protection Feature

## Overview
The wedding website now includes password protection to ensure only invited guests can access the content.

## Features

### Password Gate
- **Generic Password**: All users use the same password: `wedding2025`
- **Beautiful Design**: Wedding-themed password screen with animated hearts and gradient background
- **Persistent Login**: Once authenticated, users stay logged in until they manually logout
- **Mobile Responsive**: Works perfectly on all device sizes

### Authentication Flow
1. User visits the website
2. Password gate appears with wedding branding
3. User enters the password (`wedding2025`)
4. Upon successful authentication, the main website loads
5. User can logout using the lock icon (🔒) in the navigation

### Security Features
- **Client-side Storage**: Authentication state stored in localStorage
- **Session Persistence**: Users remain logged in across browser sessions
- **Logout Functionality**: Users can logout to return to password gate
- **No Server-side Authentication**: Simple client-side protection for basic access control

## Technical Implementation

### Components
- `PasswordGate.tsx`: Main password protection component
- `PasswordGate.css`: Styling for the password screen
- Modified `App.tsx`: Integrated password protection logic

### Key Functions
- `handlePasswordCorrect()`: Called when correct password is entered
- `handleLogout()`: Clears authentication and returns to password gate
- `localStorage.getItem('weddingAuth')`: Checks if user is already authenticated

### Password Configuration
The password is set in `PasswordGate.tsx`:
```typescript
const CORRECT_PASSWORD = 'wedding2025';
```

## Customization

### Changing the Password
To change the password, edit the `CORRECT_PASSWORD` constant in `src/components/PasswordGate.tsx`.

### Styling
The password gate styling can be customized in `src/components/PasswordGate.css`.

### Text Content
Update the wedding couple names, date, and other text in `PasswordGate.tsx`.

## Usage Instructions

### For Website Visitors
1. Visit the wedding website
2. Enter the password: `wedding2025`
3. Click "Enter" or press Enter key
4. Browse the website normally
5. Use the lock icon (🔒) in navigation to logout

### For Developers
1. The password protection is automatically active
2. Test by clearing localStorage or using incognito mode
3. Password gate appears before any website content loads

## Browser Compatibility
- Works on all modern browsers
- Requires JavaScript enabled
- Uses localStorage for session persistence
- Responsive design for mobile and desktop

## Security Notes
- This is client-side protection only
- Password is visible in the source code
- Suitable for basic access control
- For higher security, consider server-side authentication 