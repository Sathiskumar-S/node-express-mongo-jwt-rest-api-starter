// models/index.js
import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import { removeExtensionFromFile } from '../middleware/utils/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`✅ Models path: ${__dirname}`);

export default () => {
  fs.readdirSync(__dirname)
    .filter((file) => {
      const modelFile = removeExtensionFromFile(file);
      return modelFile !== 'index';
    })
    .forEach((file) => {
      const absolutePath = path.join(__dirname, file);
      const fileURL = pathToFileURL(absolutePath).href;
      import(fileURL).then(() => {}).catch((err) => {
        console.error(`❌ Failed to import model: ${file}\n`, err);
      });
    });
};
