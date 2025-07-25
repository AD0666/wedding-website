# Wedding Website

A beautiful wedding website built with React and Node.js.

## Features

- Photo gallery with public and private sections
- Bride and groom information
- Responsive design
- Image upload functionality
- Thumbnail generation

## Project Structure

- `src/` - React frontend application
- `server.js` - Node.js backend server
- `uploads/` - Image storage
- `public/` - Static assets

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/[YOUR_USERNAME]/[YOUR_REPO_NAME].git
cd [YOUR_REPO_NAME]
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
# Terminal 1: Start the backend server
node server.js

# Terminal 2: Start the React development server
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the website.

## Deployment to GitHub Pages

### Step 1: Prepare Your Repository

1. Create a new repository on GitHub
2. Update the `homepage` field in `package.json`:
   ```json
   "homepage": "https://[YOUR_GITHUB_USERNAME].github.io/[YOUR_REPO_NAME]"
   ```

### Step 2: Install gh-pages

```bash
npm install --save-dev gh-pages
```

### Step 3: Deploy

```bash
npm run deploy
```

### Step 4: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Select "gh-pages" branch and "/ (root)" folder
6. Click "Save"

Your website will be available at: `https://[YOUR_GITHUB_USERNAME].github.io/[YOUR_REPO_NAME]`

## Important Notes for GitHub Pages Deployment

- The backend server functionality (image uploads) will not work on GitHub Pages
- For testing purposes, you can:
  - Use static images in the `public/` folder
  - Mock the API responses
  - Deploy the backend separately (e.g., Heroku, Vercel, or Railway)

## Backend Deployment (Optional)

To deploy the backend server for full functionality:

1. **Heroku:**
   ```bash
   heroku create your-wedding-app
   git push heroku main
   ```

2. **Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Railway:**
   - Connect your GitHub repository
   - Railway will automatically deploy your Node.js app

## Environment Variables

Create a `.env` file for local development:
```
PORT=5000
NODE_ENV=development
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. 