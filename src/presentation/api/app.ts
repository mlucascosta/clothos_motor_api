/**
 * @fileoverview Configuração da aplicação Hono — entrada do motor de consultas.
 *
 * Ordem dos middlewares globais:
 * 1. logger — request/response logging estruturado
 * 2. errorHandler — captura exceções não tratadas em toda a cadeia
 * 3. bearerAuth (apenas /api/*) — autenticação interna via MOTOR_INTERNAL_SECRET
 *
 * Rotas públicas: /health
 * Rotas protegidas: /api/apibrasil, /api/escavador, /api/datajud, /api/directdata, /api/infosimples
 * @module presentation/api/app
 */

import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { bearerAuth } from './middlewares/bearerAuth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { apibrasil } from './routes/apibrasil.js';
import { brasilapi } from './routes/brasilapi.js';
import { datajud } from './routes/datajud.js';
import { directdata } from './routes/directdata.js';
import { escavador } from './routes/escavador.js';
import { health } from './routes/health.js';
import { infosimples } from './routes/infosimples.js';

const app = new Hono();

app.use('*', logger());
app.use('*', errorHandler);
app.use('/api/*', bearerAuth);

app.route('/health', health);
app.route('/api/apibrasil', apibrasil);
app.route('/api/brasilapi', brasilapi);
app.route('/api/escavador', escavador);
app.route('/api/datajud', datajud);
app.route('/api/directdata', directdata);
app.route('/api/infosimples', infosimples);

app.notFound((c) => c.json({ error: 'Rota não encontrada' }, 404));

export { app };
