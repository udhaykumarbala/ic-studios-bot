#!/usr/bin/env node

/**
 * Development script for IC Studios Bot
 * Helps with local development and testing
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if required files exist
const requiredFiles = [
  'src/index.js',
  'src/system_prompt.js',
  'src/template.js',
  'wrangler.toml',
  'package.json'
];

console.log('🔍 Checking required files...');
const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
  console.error('❌ Missing required files:');
  missingFiles.forEach(file => console.error(`   - ${file}`));
  process.exit(1);
}

console.log('✅ All required files present');

// Check if dependencies are installed
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  const install = spawn('npm', ['install'], { stdio: 'inherit' });
  
  install.on('close', (code) => {
    if (code === 0) {
      startDev();
    } else {
      console.error('❌ Failed to install dependencies');
      process.exit(1);
    }
  });
} else {
  startDev();
}

function startDev() {
  console.log('🚀 Starting development server...');
  console.log('📝 Remember to set GOOGLE_API_KEY secret:');
  console.log('   wrangler secret put GOOGLE_API_KEY');
  console.log('');
  
  // Start Wrangler dev server
  const dev = spawn('npx', ['wrangler', 'dev', '--remote'], { 
    stdio: 'inherit',
    env: { ...process.env }
  });

  dev.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Development server exited with code ${code}`);
    }
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n👋 Shutting down development server...');
    dev.kill();
    process.exit(0);
  });
} 