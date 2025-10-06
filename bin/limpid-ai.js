#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const pathIndex = args.indexOf('--path');
const forceOverwrite = args.includes('--force');
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

// Files to install
const filesToInstall = [
  { src: 'commands/limpid/probe.md', dest: 'commands/limpid/probe.md' },
  { src: 'commands/limpid/curate.md', dest: 'commands/limpid/curate.md' },
  { src: 'commands/limpid/assimilate.md', dest: 'commands/limpid/assimilate.md' },
  { src: 'agents/curator.md', dest: 'agents/curator.md' }
];

installLimpid();

function installLimpid() {
  try {
    console.log('📦 Installing LimpidAI to:', targetBase);
    console.log('');

    let installed = 0;
    let skipped = 0;
    let updated = 0;

    // Create directories
    const dirsToCreate = [
      path.join(targetDir, 'commands/limpid'),
      path.join(targetDir, 'agents')
    ];

    dirsToCreate.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Copy files
    filesToInstall.forEach(({ src, dest }) => {
      const srcPath = path.join(sourceDir, src);
      const destPath = path.join(targetDir, dest);

      if (!fs.existsSync(srcPath)) {
        console.log(`⚠️  Source file not found: ${src}`);
        return;
      }

      const exists = fs.existsSync(destPath);

      if (exists && !forceOverwrite) {
        console.log(`⏭️  Skipped (already exists): ${dest}`);
        skipped++;
      } else {
        fs.copyFileSync(srcPath, destPath);
        if (exists) {
          console.log(`🔄 Updated: ${dest}`);
          updated++;
        } else {
          console.log(`✅ Installed: ${dest}`);
          installed++;
        }
      }
    });

    console.log('');
    console.log(`✨ Installation complete! (${installed} installed, ${updated} updated, ${skipped} skipped)`);
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

    if (skipped > 0 && !forceOverwrite) {
      console.log('');
      console.log('💡 Tip: Use --force to overwrite existing files');
    }

  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    process.exit(1);
  }
}
