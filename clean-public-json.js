const fs = require('fs');
const path = require('path');

const publicJsonPath = path.join(__dirname, 'public.json');
const data = JSON.parse(fs.readFileSync(publicJsonPath, 'utf8'));

const cleaned = data.filter(entry =>
  typeof entry === 'object' &&
  entry !== null &&
  typeof entry.original === 'string' &&
  typeof entry.thumbnail === 'string' &&
  entry.original.length > 0 &&
  entry.thumbnail.length > 0
);

fs.writeFileSync(publicJsonPath, JSON.stringify(cleaned, null, 2));
console.log(`Cleaned public.json. Kept ${cleaned.length} valid entries.`); 