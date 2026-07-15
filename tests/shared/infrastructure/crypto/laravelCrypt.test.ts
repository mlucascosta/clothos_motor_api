import { Buffer } from 'node:buffer';
import { describe, expect, it } from '@jest/globals';
import { laravelDecryptString } from '../../../../src/shared/infrastructure/crypto/laravelCrypt';

/**
 * Vetores gerados pelo PRÓPRIO Encrypter do Laravel (chave 0xab×32). Provam compatibilidade
 * cross-language: se o formato do Laravel mudar, este teste quebra alto.
 */
const KEY = Buffer.from('ab'.repeat(32), 'hex');
const CPF_CIPHERTEXT =
  'eyJpdiI6IjZpWVZMbkxnOUg1MUdxM0EzNVhQeEE9PSIsInZhbHVlIjoicmx2ajNBenQvZFJVN2k5RWZKTHFoUT09IiwibWFjIjoiNTAxMmFhNDgxNDM4NzkzNDhjZTg3NjRmNGNhMTFhMDUxNzRlYTc0NzY2MThkNDEzNTRlMTBhNzYzOTQ3NTZiOCIsInRhZyI6IiJ9';
const PROFILE_CIPHERTEXT =
  'eyJpdiI6InJYMWx0ZnNvT3FyczBXNzF0YlhMUkE9PSIsInZhbHVlIjoiWmtZRlNlT0tydHQ4UmJMN2NwZFJnM2YzUXBROU1hUjViWG53anhvYzFFWT0iLCJtYWMiOiIwNzZjM2YzYWUzMTIyNGFkZTA4OTkyMjFlM2VhOTIxMDczNDY4ZmZiNWRmZTZiODVjZDZkNDMzZGZjYzMzZTc4IiwidGFnIjoiIn0=';

describe('laravelDecryptString — compatível com o Encrypter do Laravel', () => {
  it('decifra um CPF cifrado pelo Laravel', () => {
    expect(laravelDecryptString(CPF_CIPHERTEXT, KEY)).toBe('12345678901');
  });

  it('decifra o perfil (JSON) cifrado pelo Laravel', () => {
    expect(laravelDecryptString(PROFILE_CIPHERTEXT, KEY)).toBe('{"birthdate":"1985-03-14"}');
  });

  it('rejeita MAC adulterado (chave errada)', () => {
    const wrongKey = Buffer.from('cd'.repeat(32), 'hex');
    expect(() => laravelDecryptString(CPF_CIPHERTEXT, wrongKey)).toThrow('invalid_encrypted_mac');
  });

  it('rejeita payload malformado', () => {
    expect(() => laravelDecryptString('não é base64 json', KEY)).toThrow(
      'invalid_encrypted_payload',
    );
  });
});
