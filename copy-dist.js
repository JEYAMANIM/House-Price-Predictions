import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('frontend/frontend/dist');
const destDir = path.resolve('dist');

if (fs.existsSync(srcDir)) {
  fs.cpSync(srcDir, destDir, { recursive: true });
  console.log('Successfully copied frontend build to ./dist');
} else {
  console.error('Source directory frontend/frontend/dist does not exist.');
  process.exit(1);
}
