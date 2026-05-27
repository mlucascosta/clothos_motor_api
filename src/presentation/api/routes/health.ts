import { Hono } from 'hono';

const health = new Hono();

health.get('/', (c) =>
  c.json({ status: 'ok', service: 'clothos-motor', timestamp: new Date().toISOString() }),
);

export { health };
