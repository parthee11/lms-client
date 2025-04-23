// This script generates the env-config.js file based on the current environment variables
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get environment variables
const env = process.env;

// Create the content for env-config.js
const content = `// This file is auto-generated - DO NOT EDIT
window.env = {
  REACT_APP_API_URL: "${"https://lms-backend2-zob0.onrender.com" || 'http://localhost:5000'}",
  VITE_REACT_APP_API_URL: "${"https://lms-backend2-zob0.onrender.com" || 'http://localhost:5000'}"
};
`;

// Write to the public directory
const outputPath = path.resolve(__dirname, '../public/env-config.js');
fs.writeFileSync(outputPath, content);

console.log(`Generated env-config.js with API URL: ${"https://lms-backend2-zob0.onrender.com" || 'http://localhost:5000'}`);