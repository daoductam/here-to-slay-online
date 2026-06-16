/**
 * convert-to-webp.js
 *
 * Offline script: Convert all PNG images in client/public/assets/ to WebP.
 * Run once with: node scripts/convert-to-webp.js
 *
 * - Recursively finds all .png files under client/public/assets/
 * - Creates .webp sibling file at quality 85
 * - Does NOT delete original .png files (safe rollback)
 * - Idempotent: re-running overwrites existing .webp files
 */

const path = require('path');
const fs = require('fs');
const sharp = require(require.resolve('sharp', {
  paths: [path.join(__dirname, '..', 'client', 'node_modules')]
}));

const ASSETS_DIR = path.join(__dirname, '..', 'client', 'public', 'assets');
const WEBP_QUALITY = 85;

function findPngFiles(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findPngFiles(fullPath, results);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
      results.push(fullPath);
    }
  }
  return results;
}

function formatBytes(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

async function convertFile(pngPath) {
  const webpPath = pngPath.replace(/\.png$/i, '.webp');
  const relativePath = path.relative(ASSETS_DIR, pngPath);

  try {
    const originalSize = fs.statSync(pngPath).size;
    await sharp(pngPath)
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath);
    const newSize = fs.statSync(webpPath).size;
    const saved = ((1 - newSize / originalSize) * 100).toFixed(0);
    console.log(`  ✓ ${relativePath.replace(/\\/g, '/')} (${formatBytes(originalSize)} → ${formatBytes(newSize)}, -${saved}%)`);
    return { success: true, originalSize, newSize };
  } catch (err) {
    console.error(`  ✗ ${relativePath.replace(/\\/g, '/')} — ${err.message}`);
    return { success: false, originalSize: 0, newSize: 0 };
  }
}

async function main() {
  console.log('🔍 Scanning for PNG files in:', ASSETS_DIR);
  console.log('');

  if (!fs.existsSync(ASSETS_DIR)) {
    console.error('❌ Assets directory not found:', ASSETS_DIR);
    process.exit(1);
  }

  const pngFiles = findPngFiles(ASSETS_DIR);
  console.log(`📦 Found ${pngFiles.length} PNG files. Converting to WebP (quality: ${WEBP_QUALITY})...\n`);

  let totalOriginal = 0;
  let totalNew = 0;
  let successCount = 0;
  let errorCount = 0;

  for (const pngPath of pngFiles) {
    const result = await convertFile(pngPath);
    if (result.success) {
      totalOriginal += result.originalSize;
      totalNew += result.newSize;
      successCount++;
    } else {
      errorCount++;
    }
  }

  const totalSaved = ((1 - totalNew / totalOriginal) * 100).toFixed(0);
  console.log('');
  console.log('─'.repeat(60));
  console.log(`✅ Done: ${successCount} converted, ${errorCount} failed`);
  console.log(`📊 Total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB → ${(totalNew / 1024 / 1024).toFixed(2)} MB (-${totalSaved}%)`);
  console.log('─'.repeat(60));

  if (errorCount > 0) {
    console.log(`\n⚠️  ${errorCount} file(s) failed. Check errors above.`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
