# Mobile Testing Guide

## 🧪 Testing Methods for Mobile Version

### Method 1: Browser Developer Tools (Recommended for Quick Testing)

1. **Start the development server:**
   ```bash
   cd wedding-website
   npm start
   ```

2. **Open browser and access:**
   ```
   http://localhost:3000
   ```

3. **Open Developer Tools:**
   - Press `F12` or right-click → "Inspect"
   - Click the mobile device icon (📱) in the toolbar
   - Select a mobile device from the dropdown

4. **Test different devices:**
   - iPhone 12 Pro (390x844)
   - Samsung Galaxy S20 (360x800)
   - iPad (768x1024)
   - Custom sizes by dragging handles

### Method 2: USB Debugging (Android)

#### Setup Android Device:
1. **Enable Developer Options:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options

2. **Enable USB Debugging:**
   - Turn on "USB Debugging"
   - Turn on "USB Debugging (Security Settings)"

3. **Connect via USB:**
   ```bash
   # Check if device is connected
   adb devices
   
   # Forward port to device
   adb reverse tcp:3000 tcp:3000
   ```

4. **Access on device:**
   ```
   http://localhost:3000
   ```

### Method 3: Network Testing (Same WiFi)

1. **Find your computer's IP address:**
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   # or
   ip addr
   ```

2. **Start server with host binding:**
   ```bash
   # Windows
   set HOST=0.0.0.0 && npm start
   
   # Mac/Linux
   HOST=0.0.0.0 npm start
   ```

3. **Access from mobile device:**
   ```
   http://YOUR_COMPUTER_IP:3000
   ```

### Method 4: ngrok (Public URL)

1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Start your development server:**
   ```bash
   npm start
   ```

3. **Create tunnel:**
   ```bash
   ngrok http 3000
   ```

4. **Use the provided URL** on any device

### Method 5: BrowserStack (Professional Testing)

1. **Sign up for BrowserStack** (free tier available)
2. **Upload your built project** or use live testing
3. **Test on real devices** in the cloud

## 📱 What to Test

### Navigation
- [ ] Hamburger menu opens/closes
- [ ] All navigation links work
- [ ] Menu closes after clicking a link
- [ ] Upload button functions properly

### Layout
- [ ] Text is readable on small screens
- [ ] Cards fit properly within viewport
- [ ] Images scale correctly
- [ ] Spacing looks good

### Interactions
- [ ] Touch targets are large enough (44px minimum)
- [ ] Buttons respond to touch
- [ ] Forms are easy to fill out
- [ ] Gallery images are touchable

### Performance
- [ ] Page loads quickly
- [ ] Scrolling is smooth
- [ ] Animations work well
- [ ] No lag or stuttering

### Orientation
- [ ] Test in portrait mode
- [ ] Test in landscape mode
- [ ] Layout adapts properly

## 🔧 Troubleshooting

### Common Issues:

1. **Can't access localhost from phone:**
   - Use Method 3 (Network) or Method 4 (ngrok)
   - Check firewall settings
   - Ensure both devices are on same WiFi

2. **USB Debugging not working:**
   - Install Android SDK Platform Tools
   - Enable USB debugging in developer options
   - Install device drivers

3. **Layout looks different:**
   - Clear browser cache
   - Test in incognito/private mode
   - Check for CSS conflicts

### Browser-Specific Testing:

- **Safari (iOS):** Test on actual iPhone/iPad
- **Chrome Mobile:** Use Chrome DevTools
- **Samsung Internet:** Test on Samsung device or BrowserStack
- **Firefox Mobile:** Use Firefox DevTools

## 📊 Testing Checklist

### Responsive Design
- [ ] 320px width (small phones)
- [ ] 375px width (iPhone SE)
- [ ] 414px width (iPhone 12 Pro Max)
- [ ] 768px width (tablets)
- [ ] 1024px width (large tablets)

### Functionality
- [ ] Navigation works
- [ ] Forms submit properly
- [ ] Gallery displays correctly
- [ ] Upload functionality works
- [ ] RSVP form is accessible

### User Experience
- [ ] Loading times are acceptable
- [ ] Touch interactions feel natural
- [ ] Text is readable
- [ ] Buttons are easy to tap
- [ ] Scrolling is smooth

## 🚀 Quick Start Commands

```bash
# Start development server
cd wedding-website
npm start

# For network access (Mac/Linux)
HOST=0.0.0.0 npm start

# For network access (Windows)
set HOST=0.0.0.0 && npm start

# Using ngrok
npm start
# In another terminal:
ngrok http 3000
``` 