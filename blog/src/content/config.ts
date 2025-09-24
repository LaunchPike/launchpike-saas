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

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),                
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(), 
    draft: z.boolean().default(false),
  }),
});


export const collections = { docs, blog };
