import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    draft: z.boolean().default(false),
    group: z.string().default('General'),
    order: z.number().default(0),
  }),
});

export const collections = { docs };
