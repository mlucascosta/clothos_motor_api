import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { errorHandler } from './middlewares/errorHandler.js';
import { datajud } from './routes/datajud.js';
import { directdata } from './routes/directdata.js';
import { escavador } from './routes/escavador.js';
import { health } from './routes/health.js';

const app = new Hono();

app.use('*', logger());
app.use('*', errorHandler);

app.route('/health', health);
app.route('/api/escavador', escavador);
app.route('/api/datajud', datajud);
app.route('/api/directdata', directdata);

app.notFound((c) => c.json({ error: 'Rota não encontrada' }, 404));

export { app };
