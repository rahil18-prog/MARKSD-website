import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imagesDir = path.join(__dirname, 'src', 'assets', 'images', 'hyrus');

const conversions = [
  { input: 'hero.jpg', output: 'hero.webp' },
  { input: 'processing.jpg', output: 'processing.webp' },
  { input: 'warehouse.jpg', output: 'warehouse.webp' },
  { input: 'recycling.jpg', output: 'recycling.webp' },
];

(async () => {
  try {
    for (const { input, output } of conversions) {
      const inputPath = path.join(imagesDir, input);
      const outputPath = path.join(imagesDir, output);
      
      await sharp(inputPath)
        .webp({ quality: 82 })
        .toFile(outputPath);
      
      console.log(`Converted: ${input} -> ${output}`);
    }
    
    console.log('\nAll images converted successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();