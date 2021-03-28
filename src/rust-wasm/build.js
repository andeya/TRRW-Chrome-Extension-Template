const fs = require('fs');
const shell = require('shelljs');

const customFiles = fs
  .readdirSync('./')
  .filter(
    fname =>
      fname.endsWith('.wasm') ||
      fname.endsWith('.js') ||
      fname.endsWith('.jsx') ||
      fname.endsWith('.ts') ||
      fname.endsWith('.tsx'),
  )
  .filter(fname => fname !== 'build.js');

function exec(...args) {
  console.debug(args.join());
  const result = shell.exec(...args);
  if (result.code !== 0) {
    throw new Error(result.stderr);
  }
  return result;
}

function distinctArray(arr) {
  let i, j;
  const result = [];
  const len = arr.length;
  for (i = 0; i < len; i++) {
    for (j = i + 1; j < len; j++) {
      if (arr[i] === arr[j]) {
        j = ++i;
      }
    }
    result.push(arr[i]);
  }
  return result;
}

function wasmPackBuild() {
  let oldObj = {};
  let readme = '';
  let gitignore = '';
  try {
    oldObj = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    readme = fs.readFileSync('README.md', 'utf8') || '';
    gitignore = fs.readFileSync('.gitignore', 'utf8') || '';
  } catch {
    void 0;
  }

  try {
    const flags = process.argv.slice(2).join(' ') || '';
    exec(`cd ${__dirname} && wasm-pack build --out-dir=./` + flags);
  } catch {
    void 0;
  }

  const newObj = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  newObj.name = oldObj.name;
  newObj.version = oldObj.version || newObj.version;
  newObj.files.push(...customFiles);
  newObj.files = distinctArray(newObj.files);
  fs.writeFileSync('package.json', JSON.stringify(newObj, null, '  '), 'utf8');
  fs.writeFileSync('README.md', readme, 'utf8');
  fs.writeFileSync('.gitignore', gitignore, 'utf8');
}

wasmPackBuild();
