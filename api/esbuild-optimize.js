const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

/**
 * Optimize compiled JavaScript files with esbuild
 */
async function optimize() {
  try {
    console.log('🔄 Starting optimization process...');
    const startTime = Date.now();

    // Find all JavaScript files in the dist directory
    const jsFiles = glob.sync('dist/**/*.js');

    // Skip files that might cause issues with GraphQL schema
    const filesToSkip = [
      // Skip GraphQL schema-related files to preserve type information
      'dist/infrastructure/graphql',
    ];

    const optimizationPromises = jsFiles.map(async (file) => {
      const outputFile = file;
      const fileContents = fs.readFileSync(file, 'utf8');

      // Process the file with esbuild for minification
      const result = await esbuild.transform(fileContents, {
        minify: true,
        target: 'node16',
        format: 'cjs',
        sourcemap: true,
        // Preserve names - important for GraphQL schema which relies on type names
        keepNames: true,
      });

      // Write the optimized file
      fs.writeFileSync(outputFile, result.code);
      
      // Write the source map
      fs.writeFileSync(`${outputFile}.map`, result.map);
      
      return outputFile;
    });

    // Wait for all optimization tasks to complete
    const optimizedFiles = await Promise.all(optimizationPromises);
    
    const buildTime = Date.now() - startTime;
    console.log(`✅ Optimization completed for ${optimizedFiles.length} files in ${buildTime}ms`);
  } catch (error) {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
  }
}

// Run the optimization
optimize().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});