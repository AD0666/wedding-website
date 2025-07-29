const fs = require('fs');
const path = require('path');

const couplePhotosDir = path.join(__dirname, 'uploads', 'couple-photos');
const couplePhotosListPath = path.join(__dirname, 'couple-photos.json');

// Ensure directory exists
if (!fs.existsSync(couplePhotosDir)) {
  fs.mkdirSync(couplePhotosDir, { recursive: true });
}

// Initialize couple photos list if it doesn't exist
if (!fs.existsSync(couplePhotosListPath)) {
  fs.writeFileSync(couplePhotosListPath, JSON.stringify([], null, 2));
}

function updateCouplePhotosList() {
  try {
    const files = fs.readdirSync(couplePhotosDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
    
    fs.writeFileSync(couplePhotosListPath, JSON.stringify(imageFiles, null, 2));
    console.log(`✅ Updated couple photos list with ${imageFiles.length} photos:`);
    imageFiles.forEach(file => console.log(`   - ${file}`));
    
    return imageFiles;
  } catch (error) {
    console.error('❌ Error updating couple photos list:', error.message);
    return [];
  }
}

function listCouplePhotos() {
  try {
    if (!fs.existsSync(couplePhotosListPath)) {
      console.log('No couple photos list found. Run update to create one.');
      return;
    }
    
    const photos = JSON.parse(fs.readFileSync(couplePhotosListPath, 'utf8'));
    console.log(`📸 Found ${photos.length} couple photos:`);
    photos.forEach((photo, index) => {
      console.log(`   ${index + 1}. ${photo}`);
    });
  } catch (error) {
    console.error('❌ Error reading couple photos list:', error.message);
  }
}

function clearCouplePhotos() {
  try {
    const files = fs.readdirSync(couplePhotosDir);
    files.forEach(file => {
      const filePath = path.join(couplePhotosDir, file);
      fs.unlinkSync(filePath);
      console.log(`🗑️  Deleted: ${file}`);
    });
    
    fs.writeFileSync(couplePhotosListPath, JSON.stringify([], null, 2));
    console.log('✅ Cleared all couple photos');
  } catch (error) {
    console.error('❌ Error clearing couple photos:', error.message);
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'update':
    updateCouplePhotosList();
    break;
  case 'list':
    listCouplePhotos();
    break;
  case 'clear':
    clearCouplePhotos();
    break;
  default:
    console.log(`
🎭 Couple Photos Manager

Usage:
  node manage-couple-photos.js <command>

Commands:
  update  - Scan the couple-photos directory and update the photos list
  list    - Show all current couple photos
  clear   - Remove all couple photos and clear the list

Directory: ${couplePhotosDir}

Instructions:
1. Upload your couple photos to: ${couplePhotosDir}
2. Run: node manage-couple-photos.js update
3. The photos will automatically cycle every 20 seconds on the password page
    `);
} 