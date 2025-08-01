const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const app = express();
app.use(cors());

const uploadBase = path.join(__dirname, 'uploads');
const publicDir = path.join(uploadBase, 'public');
const privateDir = path.join(uploadBase, 'private');
const publicListPath = path.join(__dirname, 'public.json');
const thumbnailsDir = path.join(__dirname, 'uploads', 'thumbnails', 'public');
const brideGroomPath = path.join(__dirname, 'bride-groom.json');
const brideGroomUploadsDir = path.join(__dirname, 'uploads', 'bride-groom');
const couplePhotosDir = path.join(__dirname, 'uploads', 'couple-photos');
const couplePhotosListPath = path.join(__dirname, 'couple-photos.json');

// Ensure directories exist
[uploadBase, publicDir, privateDir, couplePhotosDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});
if (!fs.existsSync(publicListPath)) fs.writeFileSync(publicListPath, JSON.stringify([]));
if (!fs.existsSync(couplePhotosListPath)) fs.writeFileSync(couplePhotosListPath, JSON.stringify([]));
if (!fs.existsSync(thumbnailsDir)) fs.mkdirSync(thumbnailsDir, { recursive: true });
if (!fs.existsSync(brideGroomUploadsDir)) fs.mkdirSync(brideGroomUploadsDir, { recursive: true });

// Multer setup
const publicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
      if (!fs.existsSync(thumbnailsDir)) {
        fs.mkdirSync(thumbnailsDir, { recursive: true });
      }
    }
    if (!fs.existsSync(thumbnailsDir)) {
      fs.mkdirSync(thumbnailsDir, { recursive: true });
    }
    cb(null, publicDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const privateStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(privateDir)) fs.mkdirSync(privateDir, { recursive: true });
    cb(null, privateDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const uploadPublic = multer({ storage: publicStorage });
const uploadPrivate = multer({ storage: privateStorage });

app.post('/upload/public', uploadPublic.array('photos'), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }
  let publicList = JSON.parse(fs.readFileSync(publicListPath, 'utf8'));
  let added = 0;
  for (const file of req.files) {
    // Generate thumbnail
    const thumbName = 'thumb-' + file.filename;
    const thumbPath = path.join(thumbnailsDir, thumbName);
    try {
    await sharp(file.path)
      .resize(300, 200, { fit: 'cover' })
      .toFile(thumbPath);
      // Check if both files exist before adding
      if (fs.existsSync(file.path) && fs.existsSync(thumbPath)) {
    publicList.push({
      original: 'public/' + file.filename,
      thumbnail: 'thumbnails/public/' + thumbName
    });
        added++;
      } else {
        console.error('Failed to verify existence of original or thumbnail for', file.filename);
      }
    } catch (err) {
      console.error('Failed to generate thumbnail for', file.filename, err.message);
    }
  }
  fs.writeFileSync(publicListPath, JSON.stringify(publicList, null, 2));
  if (added === 0) {
    return res.status(500).send('No files were added due to errors.');
  }
  res.status(200).send('Files uploaded and stored locally!');
});

app.post('/upload/private', uploadPrivate.array('photos'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }
  res.status(200).send('Files uploaded and stored locally!');
});

app.get('/public-photos', (req, res) => {
  let publicList = JSON.parse(fs.readFileSync(publicListPath, 'utf8'));
  // Filter out malformed entries
  publicList = publicList.filter(entry =>
    typeof entry === 'object' &&
    entry !== null &&
    typeof entry.original === 'string' &&
    typeof entry.thumbnail === 'string' &&
    entry.original.length > 0 &&
    entry.thumbnail.length > 0
  );
  res.json(publicList);
});

app.get('/bride-groom-photos', (req, res) => {
  if (!fs.existsSync(brideGroomPath)) {
    return res.status(404).json({ error: 'Bride and groom data not found.' });
  }
  const data = JSON.parse(fs.readFileSync(brideGroomPath, 'utf8'));
  res.json(data);
});

app.get('/couple-photos', (req, res) => {
  try {
    if (!fs.existsSync(couplePhotosListPath)) {
      return res.json({ photos: [] });
    }
    
    const couplePhotosList = JSON.parse(fs.readFileSync(couplePhotosListPath, 'utf8'));
    const photos = couplePhotosList.map(photo => `/uploads/couple-photos/${photo}`);
    
    res.json({ photos });
  } catch (error) {
    console.error('Error reading couple photos:', error);
    res.json({ photos: [] });
  }
});

app.use('/uploads/public', express.static(publicDir));
app.use('/uploads/thumbnails/public', express.static(thumbnailsDir));
app.use('/uploads/bride-groom', express.static(brideGroomUploadsDir));
app.use('/uploads/couple-photos', express.static(couplePhotosDir));

// Serve React build files for production
if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
  // Serve static files from the React app build directory
  app.use(express.static(path.join(__dirname, 'build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 