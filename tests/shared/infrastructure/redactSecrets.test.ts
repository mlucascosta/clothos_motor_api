/**
 * @fileoverview Testes da redação de credenciais em mensagens de erro.
 * Único mecanismo que impede segredo de provider vazar para SourceError.message,
 * que propaga até o ledger de jobs. Cobertura ampla é requisito, não conforto.
 * @module tests/shared/infrastructure/redactSecrets
 */

import { redactSecrets } from '../../../src/shared/infrastructure/redactSecrets';

const SECRET = 'sk_live_51H8xQ2eZvKYlo2C';

describe('redactSecrets — querystring', () => {
  it.each([
    ['token', `https://api.x/v1?token=${SECRET}`],
    ['access_token', `https://api.x/v1?access_token=${SECRET}`],
    ['refresh_token', `https://api.x/v1?refresh_token=${SECRET}`],
    ['client_secret', `https://api.x/v1?client_secret=${SECRET}`],
    ['api_key', `https://api.x/v1?api_key=${SECRET}`],
    ['apikey', `https://api.x/v1?apikey=${SECRET}`],
    ['X-API-Key', `https://api.x/v1?X-API-Key=${SECRET}`],
    ['TOKEN maiúsculo', `https://api.x/v1?TOKEN=${SECRET}`],
    ['password', `https://api.x/v1?password=${SECRET}`],
    ['segundo param', `https://api.x/v1?page=2&client_secret=${SECRET}`],
  ])('redige %s', (_label, input) => {
    const out = redactSecrets(input);
    expect(out).not.toContain(SECRET);
    expect(out).toContain('[REDACTED]');
  });

  it('preserva o nome do parâmetro para diagnóstico', () => {
    expect(redactSecrets(`https://api.x/v1?access_token=${SECRET}`)).toBe(
      'https://api.x/v1?access_token=[REDACTED]',
    );
  });

  it('não redige parâmetros inofensivos', () => {
    const input = 'https://api.x/v1?cnpj=11222333000181&page=2';
    expect(redactSecrets(input)).toBe(input);
  });

  it('redige apenas o parâmetro sensível, mantendo os demais', () => {
    const out = redactSecrets(`https://api.x/v1?cnpj=11222333000181&token=${SECRET}&page=2`);
    expect(out).toBe('https://api.x/v1?cnpj=11222333000181&token=[REDACTED]&page=2');
  });
});

describe('redactSecrets — headers e schemes de autorização', () => {
  it.each([
    ['Bearer', `Request failed: Authorization: Bearer ${SECRET}`],
    ['APIKey (DataJud)', `Request failed: Authorization: APIKey ${SECRET}`],
    ['Basic', `Request failed: Authorization: Basic ${SECRET}`],
    ['X-API-Key (FonteData)', `Request failed: X-API-Key: ${SECRET}`],
    ['DeviceToken (ApiBrasil)', `Request failed: DeviceToken: ${SECRET}`],
  ])('redige %s', (_label, input) => {
    const out = redactSecrets(input);
    expect(out).not.toContain(SECRET);
    expect(out).toContain('[REDACTED]');
  });

  it('redige Bearer solto, sem prefixo de header', () => {
    expect(redactSecrets(`bad credentials for Bearer ${SECRET}`)).not.toContain(SECRET);
  });

  it('não redige header inofensivo', () => {
    const input = 'Request failed: Content-Type: application/json';
    expect(redactSecrets(input)).toBe(input);
  });
});

describe('redactSecrets — corpo JSON', () => {
  it.each([
    ['token', `{"token":"${SECRET}"}`],
    ['apiKey camelCase', `{"apiKey":"${SECRET}"}`],
    ['client_secret', `{"client_secret":"${SECRET}"}`],
    ['password', `{"password":"${SECRET}"}`],
  ])('redige %s', (_label, input) => {
    expect(redactSecrets(input)).not.toContain(SECRET);
  });

  it('não redige campo de negócio', () => {
    const input = `{"cnpj":"11222333000181","nome":"ACME"}`;
    expect(redactSecrets(input)).toBe(input);
  });
});

describe('redactSecrets — robustez', () => {
  it('string vazia', () => {
    expect(redactSecrets('')).toBe('');
  });

  it('mensagem sem segredo passa intacta', () => {
    const input = 'TypeError: fetch failed';
    expect(redactSecrets(input)).toBe(input);
  });

  it('múltiplos segredos na mesma mensagem', () => {
    const out = redactSecrets(`?token=${SECRET} e Authorization: Bearer ${SECRET}`);
    expect(out).not.toContain(SECRET);
  });
});
