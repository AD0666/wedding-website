const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicJsonPath = path.join(__dirname, 'public.json');
const uploadsDir = path.join(__dirname, 'uploads', 'public');
const thumbnailsDir = path.join(__dirname, 'uploads', 'thumbnails', 'public');

if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

const data = JSON.parse(fs.readFileSync(publicJsonPath, 'utf8'));

async function generateThumbnails() {
  let generated = 0;
  for (const entry of data) {
    if (typeof entry === 'object' && entry.original && entry.thumbnail) {
      const originalPath = path.join(__dirname, 'uploads', entry.original);
      const thumbnailPath = path.join(__dirname, entry.thumbnail);
      if (!fs.existsSync(thumbnailPath)) {
        try {
          await sharp(originalPath)
            .resize(300, 200, { fit: 'cover' })
            .toFile(thumbnailPath);
          console.log('Generated thumbnail for', entry.original);
          generated++;
        } catch (err) {
          console.error('Failed to generate thumbnail for', entry.original, err.message);
        }
      }
    }
  }
  if (generated === 0) {
    console.log('All thumbnails already exist.');
  } else {
    console.log(`Generated ${generated} thumbnails.`);
  }
}

generateThumbnails(); 