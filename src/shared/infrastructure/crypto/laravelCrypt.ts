/**
 * @fileoverview Decifra o formato do `Illuminate\Encryption\Encrypter` do Laravel (AES-256-CBC).
 * @module shared/infrastructure/crypto/laravelCrypt
 *
 * O Laravel cifra CPF e perfil do investigado com este formato; o motor decifra em memória
 * para chamar os providers. Espelha `encryptString`/`decryptString` (serialize=false):
 *
 *   base64( json({ iv, value, mac, tag }) )
 *   mac = hmac_sha256( key, iv_b64 || value_b64 )   // iv/value são as strings base64
 *   value = base64( AES-256-CBC(plaintext_utf8, key, iv) )
 *
 * O valor claro nunca é logado nem persistido — vive só no retorno desta função, em memória.
 */

import { Buffer } from 'node:buffer';
import { createDecipheriv, createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Decifra uma string cifrada pelo Encrypter do Laravel.
 *
 * @param payloadB64 Payload base64 externo (o que `encryptString` produz).
 * @param key Chave AES em bytes crus (32 bytes = AES-256). No Laravel vem de `hex2bin(ENCRYPTION_KEY)`.
 * @returns O texto claro.
 * @throws Error('invalid_encrypted_payload') formato inválido; Error('invalid_encrypted_mac') MAC não confere.
 */
export function laravelDecryptString(payloadB64: string, key: Buffer): string {
  let outer: Record<string, unknown>;
  try {
    outer = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf8')) as Record<
      string,
      unknown
    >;
  } catch {
    throw new Error('invalid_encrypted_payload');
  }

  const iv = outer['iv'];
  const value = outer['value'];
  const mac = outer['mac'];
  if (typeof iv !== 'string' || typeof value !== 'string' || typeof mac !== 'string') {
    throw new Error('invalid_encrypted_payload');
  }

  // MAC sobre as strings base64 concatenadas, com a chave crua. Comparação constante.
  const expectedMac = createHmac('sha256', key)
    .update(iv + value)
    .digest('hex');
  const macBuf = Buffer.from(mac, 'utf8');
  const expBuf = Buffer.from(expectedMac, 'utf8');
  if (macBuf.length !== expBuf.length || !timingSafeEqual(macBuf, expBuf)) {
    throw new Error('invalid_encrypted_mac');
  }

  const decipher = createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'base64'));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(value, 'base64')),
    decipher.final(),
  ]);
  return plaintext.toString('utf8');
}
