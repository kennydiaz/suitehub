import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Colección del blog. Cada artículo es un .md en src/content/blog/.
 * El campo `lang` decide en qué índice aparece (/blog para es, /en/blog para en).
 * El slug de la URL es el nombre del archivo sin el sufijo de idioma.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.enum(['es', 'en']).default('es'),
    slug: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Kenny Diaz'),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
