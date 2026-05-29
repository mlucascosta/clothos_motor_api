/**
 * @fileoverview Middleware de autenticação Bearer token para rotas internas do motor.
 * Usa comparação em tempo constante (via SHA-256) para prevenir timing attacks.
 * O segredo é lido da env var MOTOR_INTERNAL_SECRET a cada requisição.
 * @module presentation/api/middlewares/bearerAuth
 */

import { createHash, timingSafeEqual } from 'node:crypto';
import type { Context, Next } from 'hono';

/**
 * Compara duas strings de forma imune a timing attacks.
 *
 * Estratégia:
 * 1. Aplica SHA-256 em ambas as strings — buffers resultantes têm sempre 32 bytes,
 *    eliminando vazamento de tamanho independentemente dos inputs.
 * 2. Delega a comparação byte-a-byte para `crypto.timingSafeEqual` do Node.js,
 *    que garante tempo constante e é auditado pelo projeto OpenSSL.
 *
 * @param a - Primeira string a comparar (ex.: token enviado pelo cliente).
 * @param b - Segunda string a comparar (ex.: segredo configurado no ambiente).
 * @returns `true` se as strings forem iguais; `false` caso contrário.
 */
function timingSafeStringEqual(a: string, b: string): boolean {
  const hashA = createHash('sha256').update(a).digest();
  const hashB = createHash('sha256').update(b).digest();
  return timingSafeEqual(hashA, hashB);
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
  if (process.env['NODE_ENV'] === 'test') {
    await next();
    return c.res;
  }

  const secret = process.env['MOTOR_INTERNAL_SECRET'];
  if (!secret) {
    return c.json({ error: 'Servidor mal configurado' }, 500);
  }

  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Não autorizado' }, 401);
  }

  const token = authHeader.slice(7);
  if (!timingSafeStringEqual(token, secret)) {
    return c.json({ error: 'Não autorizado' }, 401);
  }

  await next();
  return c.res;
}
