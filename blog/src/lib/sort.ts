import type { CollectionEntry } from 'astro:content';


export function sortDocs(entries: CollectionEntry<'docs'>[]) {
    return entries
        .filter((e) => !e.data.draft)
        .sort((a, b) =>
            a.data.group.localeCompare(b.data.group) || a.data.order - b.data.order
        );
}