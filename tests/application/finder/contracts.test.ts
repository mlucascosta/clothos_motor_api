import { describe, expect, it } from '@jest/globals';
import { parseFinderJobPayload } from '../../../src/application/finder/contracts';

const base = {
  protocol_version: 2 as const,
  operation: 'full_query' as const,
  identifier: { kind: 'cnpj' as const, value: '00425201110010' },
  source_selection: { sources: ['qf_profile'] },
};

describe('FinderJobPayload — subject_profile cifrado', () => {
  it('aceita e preserva o subject_profile quando presente', () => {
    const parsed = parseFinderJobPayload({
      ...base,
      subject_profile: { ciphertext: 'eyJpdiI6...', key_id: 'v1' },
    });
    expect(parsed.subject_profile).toEqual({ ciphertext: 'eyJpdiI6...', key_id: 'v1' });
  });

  it('é opcional: payload sem subject_profile continua válido', () => {
    const parsed = parseFinderJobPayload(base);
    expect(parsed.subject_profile).toBeUndefined();
  });

  it('rejeita subject_profile sem key_id (protocolo inválido)', () => {
    expect(() => parseFinderJobPayload({ ...base, subject_profile: { ciphertext: 'x' } })).toThrow(
      'invalid_protocol_v2',
    );
  });

  it('rejeita subject_profile com chave desconhecida (strict)', () => {
    expect(() =>
      parseFinderJobPayload({
        ...base,
        subject_profile: { ciphertext: 'x', key_id: 'v1', birthdate: '1985-03-14' },
      }),
    ).toThrow('invalid_protocol_v2');
  });
});
