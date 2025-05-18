const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Main build process
 */
async function build() {
  try {
    console.log('🔨 Starting build process...');
    const startTime = Date.now();

    // Step 1: Clean dist directory
    console.log('🧹 Cleaning dist directory...');
    if (fs.existsSync('./dist')) {
      fs.rmSync('./dist', { recursive: true, force: true });
    }
    fs.mkdirSync('./dist');

    // Step 2: Compile TypeScript with tsc (preserves decorator metadata)
    console.log('📝 Compiling TypeScript with tsc...');
    execSync('npx tsc -p tsconfig.prod.json', { stdio: 'inherit' });

    // Step 3: Copy any non-TypeScript files that should be included in the build
    console.log('📋 Copying additional files...');
    copyNonTsFiles();

    const buildTime = Date.now() - startTime;
    console.log(`✅ Build completed in ${buildTime}ms`);
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}


/**
 * Copy non-TypeScript files to the dist directory
 */
function copyNonTsFiles() {
  const sourceDir = './src';
  const targetDir = './dist';

  const copyRecursively = (source, target) => {
    if (fs.statSync(source).isDirectory()) {
      // Skip test directories
      if (source.includes('__tests__') || source.includes('node_modules')) {
        return;
      }

      // Ensure target directory exists
      if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
      }

      // Copy files in the directory
      const files = fs.readdirSync(source);
      for (const file of files) {
        const sourceFile = path.join(source, file);
        const targetFile = path.join(target, file);
        
        if (fs.statSync(sourceFile).isDirectory()) {
          copyRecursively(sourceFile, targetFile);
        } else if (!sourceFile.endsWith('.ts') && !sourceFile.endsWith('.tsx')) {
          fs.copyFileSync(sourceFile, targetFile);
          console.log(`   Copied ${sourceFile}`);
        }
      }
    }
  };

  copyRecursively(sourceDir, targetDir);
}

// Run the build process
build().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});