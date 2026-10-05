import fs from 'node:fs';

const file = 'node_modules/vite/dist/node/chunks/node.js';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  const regex =
    /async function isPortAvailable\s*\([^)]*\)\s*\{[\s\S]*?return true;\s*\}/;
  if (regex.test(content)) {
    content = content.replace(
      regex,
      'async function isPortAvailable(port) {\n\treturn true;\n}'
    );
    fs.writeFileSync(file, content, 'utf8');
    console.log('✅ Patched Vite port probe successfully.');
  } else {
    console.log('⚠️ Pattern not found or already patched.');
  }
}
