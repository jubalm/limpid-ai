#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const pathIndex = args.indexOf('--path');
const targetBase = pathIndex !== -1 && args[pathIndex + 1]
  ? path.resolve(args[pathIndex + 1])
  : process.cwd();

const sourceDir = path.join(__dirname, '..', '.claude');
const targetDir = path.join(targetBase, '.claude');

// Check if source directory exists
if (!fs.existsSync(sourceDir)) {
  console.error('❌ Error: .claude/ directory not found in package');
  process.exit(1);
}

// Check if target already exists
if (fs.existsSync(targetDir)) {
  console.log('⚠️  .claude/ directory already exists at:', targetDir);
  console.log('');

  // Simple prompt for overwrite
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Overwrite? [y/N] ', (answer) => {
    rl.close();

    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      installLimpid();
    } else {
      console.log('Installation cancelled.');
      process.exit(0);
    }
  });
} else {
  installLimpid();
}

function installLimpid() {
  try {
    // Copy .claude directory
    console.log('📦 Installing LimpidAI to:', targetBase);

    // Use cp -r for reliable recursive copy
    execSync(`cp -r "${sourceDir}" "${targetDir}"`, { stdio: 'inherit' });

    console.log('');
    console.log('✅ LimpidAI installed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('  1. /limpid:probe        # Discover your codebase');
    console.log('  2. /limpid:curate       # Set up structure');
    console.log('  3. /limpid:assimilate   # Document features');
    console.log('');
    console.log('Or use the orchestrator:');
    console.log('  @curator "set up LimpidAI"');
    console.log('');
    console.log('Docs: https://github.com/jubalm/limpid-ai');

  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    process.exit(1);
  }
}
