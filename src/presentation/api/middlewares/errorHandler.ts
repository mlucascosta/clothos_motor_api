import type { Context, Next } from 'hono';

export async function errorHandler(c: Context, next: Next): Promise<Response> {
  try {
    await next();
    return c.res;
  } catch (err) {
    console.error('Unhandled error:', err);
    return c.json({ error: 'Erro interno do servidor' }, 500);
  }
}
