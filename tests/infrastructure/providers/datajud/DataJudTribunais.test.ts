import {
  DATAJUD_TRIBUNAIS,
  DATAJUD_TRIBUNAIS_MAP,
  getDataJudEndpoint,
  isValidTribunal,
} from '../../../../src/infrastructure/providers/datajud/DataJudTribunais';

describe('DataJudTribunais', () => {
  it('contém 91 tribunais', () => {
    expect(DATAJUD_TRIBUNAIS.length).toBe(91);
  });

  it('cada tribunal tem sigla, nome e endpoint', () => {
    for (const t of DATAJUD_TRIBUNAIS) {
      expect(t.sigla).toBeDefined();
      expect(t.nome).toBeDefined();
      expect(t.endpoint).toMatch(/^https:\/\/api-publica\.datajud\.cnj\.jus\.br\/api_publica_/);
    }
  });

  it('siglas são únicas', () => {
    const siglas = DATAJUD_TRIBUNAIS.map((t) => t.sigla);
    const unique = new Set(siglas);
    expect(unique.size).toBe(siglas.length);
  });

  it('DATAJUD_TRIBUNAIS_MAP mapeia sigla para endpoint', () => {
    expect(DATAJUD_TRIBUNAIS_MAP.tjsp).toBe(
      'https://api-publica.datajud.cnj.jus.br/api_publica_tjsp/_search',
    );
    expect(DATAJUD_TRIBUNAIS_MAP.tst).toBe(
      'https://api-publica.datajud.cnj.jus.br/api_publica_tst/_search',
    );
    expect(DATAJUD_TRIBUNAIS_MAP.trf1).toBe(
      'https://api-publica.datajud.cnj.jus.br/api_publica_trf1/_search',
    );
  });

  describe('getDataJudEndpoint', () => {
    it('retorna endpoint para sigla válida (lowercase)', () => {
      expect(getDataJudEndpoint('tjsp')).toContain('api_publica_tjsp');
    });

    it('retorna endpoint para sigla válida (uppercase)', () => {
      expect(getDataJudEndpoint('TJSP')).toContain('api_publica_tjsp');
    });

    it('retorna undefined para sigla inválida', () => {
      expect(getDataJudEndpoint('invalido')).toBeUndefined();
    });
  });

  describe('isValidTribunal', () => {
    it('retorna true para sigla válida', () => {
      expect(isValidTribunal('tjsp')).toBe(true);
      expect(isValidTribunal('TJSP')).toBe(true);
    });

    it('retorna false para sigla inválida', () => {
      expect(isValidTribunal('invalido')).toBe(false);
      expect(isValidTribunal('')).toBe(false);
    });
  });
});
