const { execSync } = require('child_process');
const path = require('path');

// Skip backend installation on Vercel (only install frontend)
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;

console.log('Installing frontend dependencies...');
try {
  execSync('npm install', { 
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
    shell: true
  });
  console.log('Frontend dependencies installed successfully!');
} catch (error) {
  console.error('Failed to install frontend dependencies');
  process.exit(1);
}

// Only install backend if not on Vercel
if (!isVercel) {
  console.log('Installing backend dependencies...');
  try {
    execSync('npm install', { 
      cwd: path.join(__dirname, 'backend'),
      stdio: 'inherit',
      shell: true
    });
    console.log('Backend dependencies installed successfully!');
  } catch (error) {
    console.error('Failed to install backend dependencies');
    process.exit(1);
  }
} else {
  console.log('Skipping backend installation (Vercel build)');
}

console.log('All dependencies installed successfully!');

