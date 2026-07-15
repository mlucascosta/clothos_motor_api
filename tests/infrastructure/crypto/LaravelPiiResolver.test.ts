import { describe, expect, it } from '@jest/globals';
import { LaravelPiiResolver } from '../../../src/infrastructure/crypto/LaravelPiiResolver';

const KEY_HEX = 'ab'.repeat(32);
const CPF_CIPHERTEXT =
  'eyJpdiI6IjZpWVZMbkxnOUg1MUdxM0EzNVhQeEE9PSIsInZhbHVlIjoicmx2ajNBenQvZFJVN2k5RWZKTHFoUT09IiwibWFjIjoiNTAxMmFhNDgxNDM4NzkzNDhjZTg3NjRmNGNhMTFhMDUxNzRlYTc0NzY2MThkNDEzNTRlMTBhNzYzOTQ3NTZiOCIsInRhZyI6IiJ9';
const PROFILE_CIPHERTEXT =
  'eyJpdiI6InJYMWx0ZnNvT3FyczBXNzF0YlhMUkE9PSIsInZhbHVlIjoiWmtZRlNlT0tydHQ4UmJMN2NwZFJnM2YzUXBROU1hUjViWG53anhvYzFFWT0iLCJtYWMiOiIwNzZjM2YzYWUzMTIyNGFkZTA4OTkyMjFlM2VhOTIxMDczNDY4ZmZiNWRmZTZiODVjZDZkNDMzZGZjYzMzZTc4IiwidGFnIjoiIn0=';

describe('LaravelPiiResolver', () => {
  it('não é construído sem ENCRYPTION_KEY (CPF fica indisponível, não quebra)', () => {
    expect(LaravelPiiResolver.fromEnvironment({})).toBeUndefined();
    expect(LaravelPiiResolver.fromEnvironment({ ENCRYPTION_KEY: 'curta' })).toBeUndefined();
  });

  it('resolve o CPF cifrado (porta CpfIdentifierResolver)', async () => {
    const resolver = LaravelPiiResolver.fromEnvironment({ ENCRYPTION_KEY: KEY_HEX });
    expect(resolver).toBeDefined();
    await expect(resolver?.resolve(CPF_CIPHERTEXT, 'v1')).resolves.toBe('12345678901');
  });

  it('resolve o perfil como mapa de strings', async () => {
    const resolver = LaravelPiiResolver.fromEnvironment({ ENCRYPTION_KEY: KEY_HEX });
    await expect(resolver?.resolveProfile(PROFILE_CIPHERTEXT, 'v1')).resolves.toEqual({
      birthdate: '1985-03-14',
    });
  });

  it('rejeita key_id desconhecido', async () => {
    const resolver = LaravelPiiResolver.fromEnvironment({ ENCRYPTION_KEY: KEY_HEX });
    await expect(resolver?.resolve(CPF_CIPHERTEXT, 'v9')).rejects.toThrow('unknown_key_id');
  });
});
