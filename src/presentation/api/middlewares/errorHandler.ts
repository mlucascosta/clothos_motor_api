/**
 * @fileoverview Middleware global de tratamento de erros não capturados.
 * Deve ser registrado como o primeiro middleware após o logger para garantir
 * que qualquer exceção lançada por handlers subsequentes seja capturada.
 * @module presentation/api/middlewares/errorHandler
 */

import type { Context, Next } from 'hono';
import { logger } from '@shared/infrastructure/logger.js';

/**
 * Middleware Hono que captura exceções não tratadas em handlers e middlewares subsequentes.
 * Retorna HTTP 500 com mensagem genérica para não vazar detalhes internos ao cliente.
 *
 * @param c - Contexto Hono da requisição
 * @param next - Próximo handler/middleware na cadeia
 * @returns Resposta HTTP — passthrough em sucesso, 500 em exceção não tratada
 */
export async function errorHandler(c: Context, next: Next): Promise<Response> {
  try {
    await next();
    return c.res;
  } catch (err) {
    logger.error({ err }, 'Unhandled error');
    return c.json({ error: 'Erro interno do servidor' }, 500);
  }
}
