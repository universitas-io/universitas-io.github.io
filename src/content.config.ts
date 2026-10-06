import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const commonSchema = z.object({
  title: z.string().min(1),
  seoTitle: z.string().optional(),
  description: z.string().min(1).max(155),
  translationKey: z.string().regex(/^[a-z0-9-]+$/),
  draft: z.boolean().default(false)
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/services' }),
  schema: ({ image }) =>
    commonSchema.extend({
      tier: z.enum([
        'research-data',
        'visualization-dissemination',
        'editorial-review',
        'core',
        'complementary'
      ]),
      order: z.number(),
      icon: z.string(),
      summary: z.string(),
      audiences: z.array(z.string()).default([]),
      tools: z.array(z.string()).default([]),
      deliverables: z.array(z.string()).default([]),
      faq: z
        .array(
          z.object({
            q: z.string(),
            a: z.string()
          })
        )
        .default([]),
      examples: z
        .object({
          title: z.string(),
          description: z.string().optional(),
          items: z.array(
            z.object({
              title: z.string(),
              url: z.string().optional(),
              description: z.string().optional(),
              image: z
                .object({
                  src: image(),
                  alt: z.string()
                })
                .optional(),
              images: z
                .array(
                  z.object({
                    src: image(),
                    alt: z.string()
                  })
                )
                .optional()
            })
          )
        })
        .optional()
    })
});

const audiences = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/audiences' }),
  schema: commonSchema.extend({
    order: z.number(),
    icon: z.string(),
    summary: z.string(),
    painPoints: z.array(z.string()).default([]),
    services: z.array(z.string()).default([]),
    faq: z
      .array(
        z.object({
          q: z.string(),
          a: z.string()
        })
      )
      .default([])
  })
});

const cases = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/cases' }),
  schema: ({ image }) =>
    commonSchema.extend({
      order: z.number().default(99),
      client: z.string().optional(),
      sector: z.enum(['academia', 'business', 'public', 'ngo']),
      services: z.array(z.string()).default([]),
      tools: z.array(z.string()).default([]),
      cover: z
        .object({
          src: image(),
          alt: z.string().min(1)
        })
        .optional(),
      gallery: z
        .array(
          z.object({
            src: image(),
            alt: z.string().min(1)
          })
        )
        .default([]),
      links: z
        .array(
          z.object({
            label: z.string(),
            url: z.string()
          })
        )
        .default([]),
      featured: z.boolean().default(false),
      date: z.coerce.date().optional()
    })
});

const insights = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/insights' }),
  schema: ({ image }) =>
    commonSchema.extend({
      author: z.preprocess(
        (val) => (val === '' ? undefined : val),
        reference('team').optional()
      ),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      cover: z
        .object({
          src: image(),
          alt: z.string().min(1)
        })
        .optional(),
      featured: z.boolean().default(false),
      translationOptional: z.boolean().default(false)
    })
});

const team = defineCollection({
  loader: glob({ pattern: '*.{yaml,yml}', base: './src/content/team' }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      photo: z
        .object({
          src: image(),
          alt: z.string().min(1)
        })
        .optional(),
      role: z.object({
        pt: z.string(),
        en: z.string()
      }),
      bio: z.object({
        pt: z.string(),
        en: z.string()
      }),
      education: z
        .object({
          pt: z.array(z.string()),
          en: z.array(z.string())
        })
        .or(z.array(z.string()).transform((arr) => ({ pt: arr, en: arr })))
        .default({ pt: [], en: [] }),
      areas: z
        .object({
          pt: z.array(z.string()),
          en: z.array(z.string())
        })
        .or(z.array(z.string()).transform((arr) => ({ pt: arr, en: arr })))
        .default({ pt: [], en: [] }),
      links: z
        .object({
          lattes: z.string().optional(),
          orcid: z.string().optional(),
          linkedin: z.string().optional(),
          website: z.string().optional()
        })
        .default({}),
      order: z.number().default(1),
      draft: z.boolean().default(false)
    })
});

export const collections = {
  services,
  audiences,
  cases,
  insights,
  team
};
