/**
 * @fileoverview Middleware de autenticação Bearer token para rotas internas do motor.
 * Usa comparação em tempo constante (via SHA-256) para prevenir timing attacks.
 * O segredo é lido da env var MOTOR_INTERNAL_SECRET a cada requisição.
 * @module presentation/api/middlewares/bearerAuth
 */

import { createHash } from 'node:crypto';
import type { Context, Next } from 'hono';

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(createHash('sha256').update(a).digest());
  const bufB = Buffer.from(createHash('sha256').update(b).digest());
  if (bufA.length !== bufB.length) return false;
  let diff = 0;
  for (let i = 0; i < bufA.length; i++) {
    diff |= bufA[i]! ^ bufB[i]!;
  }
  return diff === 0;
}

/**
 * Middleware Hono que valida o header `Authorization: Bearer <token>` contra
 * a env var `MOTOR_INTERNAL_SECRET`. A comparação usa SHA-256 de ambos os lados
 * para equalizar o comprimento e aplicar XOR bit a bit — imune a timing attacks.
 *
 * Retorna:
 * - 500 se `MOTOR_INTERNAL_SECRET` não estiver configurada
 * - 401 se o header estiver ausente, malformado ou o token não bater
 *
 * @param c - Contexto Hono da requisição
 * @param next - Próximo handler na cadeia (chamado apenas se autenticado)
 * @returns Resposta HTTP — passthrough em sucesso, 401/500 em falha
 */
export async function bearerAuth(c: Context, next: Next): Promise<Response> {
  const secret = process.env['MOTOR_INTERNAL_SECRET'];
  if (!secret) {
    return c.json({ error: 'Servidor mal configurado' }, 500);
  }

  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Não autorizado' }, 401);
  }

  const token = authHeader.slice(7);
  if (!timingSafeEqual(token, secret)) {
    return c.json({ error: 'Não autorizado' }, 401);
  }

  await next();
  return c.res;
}
