import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const projectRoot = process.cwd();
const svgPath = path.join(projectRoot, 'src/assets/brand/logo-mark.svg');
const publicDir = path.join(projectRoot, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function generate() {
  const svgBuffer = fs.readFileSync(svgPath);

  // Copy favicon.svg
  fs.copyFileSync(svgPath, path.join(publicDir, 'favicon.svg'));

  // icon-192.png
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  // icon-512.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));

  // apple-touch-icon.png (180x180 with white background and padding)
  const innerSize = Math.round(180 * (1 - 0.12 * 2)); // ~136px
  const innerBuffer = await sharp(svgBuffer)
    .resize(innerSize, innerSize)
    .toBuffer();

  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([
      {
        input: innerBuffer,
        gravity: 'centre'
      }
    ])
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // favicon.ico (32x32 png format)
  // Standard ICO with single PNG payload
  const png32Buffer = await sharp(svgBuffer).resize(32, 32).png().toBuffer();

  // Minimal valid ICO container embedding PNG
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // image type 1 = icon
  icoHeader.writeUInt16LE(1, 4); // 1 image

  const icoEntry = Buffer.alloc(16);
  icoEntry.writeUInt8(32, 0); // width
  icoEntry.writeUInt8(32, 1); // height
  icoEntry.writeUInt8(0, 2); // color palette (0 = no palette)
  icoEntry.writeUInt8(0, 3); // reserved
  icoEntry.writeUInt16LE(1, 4); // color planes
  icoEntry.writeUInt16LE(32, 6); // bits per pixel
  icoEntry.writeUInt32LE(png32Buffer.length, 8); // image size
  icoEntry.writeUInt32LE(6 + 16, 12); // image offset

  const icoBuffer = Buffer.concat([icoHeader, icoEntry, png32Buffer]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

  // site.webmanifest
  const manifest = {
    name: 'Universitas',
    short_name: 'Universitas',
    description: 'Consultoria em pesquisa quantitativa e qualitativa',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#1F3A5F',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };

  fs.writeFileSync(
    path.join(publicDir, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2)
  );

  console.log(
    '✅ Todos os ícones e site.webmanifest foram gerados com sucesso.'
  );
}

generate().catch((err) => {
  console.error('Erro ao gerar ícones:', err);
  process.exit(1);
});
