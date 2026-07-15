/**
 * @fileoverview Testes dos utilitários de identificadores (CPF e CNPJ alfanumérico).
 * Cobre o formato legado numérico e o novo CNPJ alfanumérico (12 alfanuméricos + 2 DV).
 * @module tests/shared/domain/identifiers
 */

import { cleanDocument, isCnpj, isCpf, isCpfOrCnpj } from '../../../src/shared/domain/identifiers';
import { hashCpfIfNeeded } from '../../../src/shared/domain/privacy/hashCpf';

describe('cleanDocument', () => {
  it('remove máscara e mantém letras (uppercase)', () => {
    expect(cleanDocument('12.ABC.345/01DE-35')).toBe('12ABC34501DE35');
  });

  it('remove máscara de CPF numérico', () => {
    expect(cleanDocument('123.456.789-01')).toBe('12345678901');
  });

  it('normaliza letras minúsculas para maiúsculas', () => {
    expect(cleanDocument('12abc34501de35')).toBe('12ABC34501DE35');
  });
});

describe('isCpf', () => {
  it('aceita CPF de 11 dígitos (com e sem máscara)', () => {
    expect(isCpf('12345678901')).toBe(true);
    expect(isCpf('123.456.789-01')).toBe(true);
  });

  it('rejeita valores que não são 11 dígitos', () => {
    expect(isCpf('1234567890')).toBe(false);
    expect(isCpf('11222333000181')).toBe(false); // CNPJ numérico
    expect(isCpf('12ABC34501DE35')).toBe(false); // CNPJ alfanumérico
  });
});

describe('isCnpj', () => {
  it('aceita CNPJ numérico legado (14 dígitos)', () => {
    expect(isCnpj('11222333000181')).toBe(true);
    expect(isCnpj('11.222.333/0001-81')).toBe(true);
  });

  it('aceita CNPJ alfanumérico (12 alfanuméricos + 2 DV numéricos)', () => {
    expect(isCnpj('12ABC34501DE35')).toBe(true);
    expect(isCnpj('12.ABC.345/01DE-35')).toBe(true);
  });

  it('rejeita CNPJ com DV não-numérico (posições 13-14 devem ser dígitos)', () => {
    expect(isCnpj('12ABC34501DEFG')).toBe(false);
  });

  it('rejeita CPF e tamanhos inválidos', () => {
    expect(isCnpj('12345678901')).toBe(false);
    expect(isCnpj('12ABC34501DE3')).toBe(false); // 13 chars
  });
});

describe('isCpfOrCnpj', () => {
  it('aceita CPF, CNPJ numérico e CNPJ alfanumérico', () => {
    expect(isCpfOrCnpj('12345678901')).toBe(true);
    expect(isCpfOrCnpj('11222333000181')).toBe(true);
    expect(isCpfOrCnpj('12ABC34501DE35')).toBe(true);
  });

  it('rejeita lixo', () => {
    expect(isCpfOrCnpj('abc')).toBe(false);
    expect(isCpfOrCnpj('12345')).toBe(false);
  });
});

describe('hashCpfIfNeeded — interação com CNPJ alfanumérico', () => {
  it('hasheia CPF de 11 dígitos quando tipo_param=cpf_cnpj', () => {
    const out = hashCpfIfNeeded('cpf_cnpj', '123.456.789-01');
    expect(out).toHaveLength(64);
    expect(out).not.toContain('123');
  });

  it('NÃO hasheia CNPJ alfanumérico mesmo que tenha letras (dado público em claro)', () => {
    const cnpj = '12ABC34501DE35';
    expect(hashCpfIfNeeded('cpf_cnpj', cnpj)).toBe(cnpj);
  });

  it('NÃO confunde CNPJ alfanumérico com 3 letras como CPF de 11 dígitos', () => {
    // sem preservar letras, replace(/\D/g,'') daria 11 dígitos e hashearia por engano
    const cnpj = '123ABC45678901'; // 14 chars: 11 dígitos + 3 letras
    expect(hashCpfIfNeeded('cpf_cnpj', cnpj)).toBe(cnpj);
  });

  it('NÃO hasheia CNPJ numérico legado', () => {
    const cnpj = '11222333000181';
    expect(hashCpfIfNeeded('cpf_cnpj', cnpj)).toBe(cnpj);
  });

  // P16: o Finder envia tipo_param='cpf' (não 'cpf_cnpj'). O gate antigo, preso a
  // 'cpf_cnpj', deixava TODO CPF do Finder ser gravado em texto claro em raw_results.param
  // — violação direta de "CPF nunca em texto claro". A garantia agora é pelo VALOR.
  it('hasheia CPF quando tipo_param=cpf (caminho do Finder)', () => {
    const out = hashCpfIfNeeded('cpf', '123.456.789-01');
    expect(out).toHaveLength(64);
    expect(out).not.toContain('123');
  });

  it('hasheia CPF de 11 dígitos mesmo com tipo_param nulo (falha segura)', () => {
    const out = hashCpfIfNeeded(null, '12345678901');
    expect(out).toHaveLength(64);
    expect(out).not.toBe('12345678901');
  });

  it('NÃO hasheia CNPJ numérico (14 dígitos) sob tipo_param=cnpj', () => {
    const cnpj = '11222333000181';
    expect(hashCpfIfNeeded('cnpj', cnpj)).toBe(cnpj);
  });

  it('NÃO hasheia número de processo CNJ (20 dígitos)', () => {
    const cnj = '00000000020248260100';
    expect(hashCpfIfNeeded('numero_cnj', cnj)).toBe(cnj);
  });
});
