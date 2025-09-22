import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (ctx, next) => {
  const res = await next();
  console.log("WEWE")
  if (!res.headers.get('Content-Type')?.includes('charset=')) {
    res.headers.set('Content-Type', 'text/html; charset=utf-8');
  }
  return res;
};
