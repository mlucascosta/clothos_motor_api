import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { health } from './routes/health.js';
import { escavador } from './routes/escavador.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = new Hono();

app.use('*', logger());
app.use('*', errorHandler);

app.route('/health', health);
app.route('/api/escavador', escavador);

app.notFound((c) => c.json({ error: 'Rota não encontrada' }, 404));

export { app };
