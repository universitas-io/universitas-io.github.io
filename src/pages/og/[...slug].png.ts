import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { listOgPages, type OgPage } from '../../lib/og';
import { site } from '../../../site.config';

const fontPath = path.resolve(
  process.cwd(),
  'node_modules/@fontsource/manrope/files/manrope-latin-800-normal.woff'
);
const fontData = fs.readFileSync(fontPath);

const logoPath = path.resolve(process.cwd(), 'src/assets/brand/logo-mark.svg');
const logoSvg = fs.readFileSync(logoPath, 'utf-8');
const logoUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`;
const host = new URL(site.url).host;

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await listOgPages();
  return pages.map((page) => ({
    params: { slug: page.slug },
    props: page
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const page = (props as OgPage) || {
    title: 'Universitas',
    lang: 'pt'
  };

  const title = page.title || 'Universitas';
  const lang = page.lang || 'pt';

  const subtitle =
    lang === 'pt'
      ? 'Consultoria em Pesquisa Quantitativa e Qualitativa'
      : 'Quantitative and Qualitative Research Consultancy';

  const fontSize = title.length > 55 ? 44 : title.length > 35 ? 50 : 58;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          backgroundColor: '#0F2340',
          padding: '72px 80px',
          boxSizing: 'border-box',
          position: 'relative'
        },
        children: [
          // Background subtle accent bar at top
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 8,
                background: 'linear-gradient(90deg, #3BA7E0 0%, #6CC24A 100%)'
              }
            }
          },

          // Top Header: Logo mark + Brand name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: 24
              },
              children: [
                {
                  type: 'img',
                  props: {
                    src: logoUri,
                    width: 72,
                    height: 72
                  }
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column'
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            color: '#FFFFFF',
                            fontSize: 28,
                            fontWeight: 800,
                            letterSpacing: '-0.02em'
                          },
                          children: 'UNIVERSITAS'
                        }
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            color: '#3BA7E0',
                            fontSize: 15,
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase'
                          },
                          children:
                            lang === 'pt'
                              ? 'Método · Ética · Transparência'
                              : 'Method · Ethics · Transparency'
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },

          // Center: Page Title
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                maxWidth: 1040,
                margin: '24px 0'
              },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: {
                      color: '#FFFFFF',
                      fontSize,
                      fontWeight: 800,
                      lineHeight: 1.2,
                      letterSpacing: '-0.025em',
                      margin: 0
                    },
                    children: title
                  }
                }
              ]
            }
          },

          // Bottom Footer: Subtitle on left, domain on right
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                paddingTop: 28
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      color: '#94A3B8',
                      fontSize: 20,
                      fontWeight: 500
                    },
                    children: subtitle
                  }
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      color: '#3BA7E0',
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: '-0.01em'
                    },
                    children: host
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Manrope',
          data: fontData,
          weight: 800,
          style: 'normal'
        }
      ]
    }
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
};
