import {
  TribunalDataJudEnum,
  TRIBUNAIS_DATAJUD_VALUES,
  isTribunalDataJudEnum,
  parseTribunalDataJudEnum,
  TribunalDataJudEnumSchema,
} from '../../../../src/infrastructure/providers/datajud/TribunalDataJudEnum';

describe('TribunalDataJudEnum', () => {
  it('contém 91 valores', () => {
    expect(TRIBUNAIS_DATAJUD_VALUES.length).toBe(91);
  });

  it('todos os valores são lowercase', () => {
    for (const v of TRIBUNAIS_DATAJUD_VALUES) {
      expect(v).toBe(v.toLowerCase());
    }
  });

  it('não há duplicatas', () => {
    const unique = new Set(TRIBUNAIS_DATAJUD_VALUES);
    expect(unique.size).toBe(TRIBUNAIS_DATAJUD_VALUES.length);
  });

  describe('isTribunalDataJudEnum', () => {
    it('retorna true para sigla válida', () => {
      expect(isTribunalDataJudEnum('tjsp')).toBe(true);
      expect(isTribunalDataJudEnum('TJSP')).toBe(true);
      expect(isTribunalDataJudEnum('Trt1')).toBe(true);
    });

    it('retorna false para sigla inválida', () => {
      expect(isTribunalDataJudEnum('invalido')).toBe(false);
      expect(isTribunalDataJudEnum('')).toBe(false);
    });
  });

  describe('parseTribunalDataJudEnum', () => {
    it('parseia sigla válida', () => {
      expect(parseTribunalDataJudEnum('tjsp')).toBe(TribunalDataJudEnum.TJSP);
      expect(parseTribunalDataJudEnum('TJSP')).toBe(TribunalDataJudEnum.TJSP);
    });

    it('retorna null para sigla inválida', () => {
      expect(parseTribunalDataJudEnum('invalido')).toBeNull();
    });

    it('parseia TREs com hífen', () => {
      expect(parseTribunalDataJudEnum('tre-sp')).toBe(TribunalDataJudEnum.TRE_SP);
      expect(parseTribunalDataJudEnum('tre-rj')).toBe(TribunalDataJudEnum.TRE_RJ);
    });
  });

  describe('TribunalDataJudEnumSchema', () => {
    it('valida enum válido', () => {
      const parsed = TribunalDataJudEnumSchema.safeParse('tjsp');
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data).toBe(TribunalDataJudEnum.TJSP);
      }
    });

    it('rejeita valor inválido', () => {
      const parsed = TribunalDataJudEnumSchema.safeParse('invalido');
      expect(parsed.success).toBe(false);
    });
  });

  it('inclui todos os tipos de tribunal', () => {
    const superiores = ['tst', 'tse', 'stj', 'stm'];
    const trfs = Array.from({ length: 6 }, (_, i) => `trf${i + 1}`);
    const tjs = [
      'tjac', 'tjal', 'tjam', 'tjap', 'tjba', 'tjce', 'tjdft', 'tjes',
      'tjgo', 'tjma', 'tjmg', 'tjms', 'tjmt', 'tjpa', 'tjpb', 'tjpe',
      'tjpi', 'tjpr', 'tjrj', 'tjrn', 'tjro', 'tjrr', 'tjrs', 'tjsc',
      'tjse', 'tjsp', 'tjto',
    ];
    const trts = Array.from({ length: 24 }, (_, i) => `trt${i + 1}`);
    const tres = [
      'tre-ac', 'tre-al', 'tre-am', 'tre-ap', 'tre-ba', 'tre-ce', 'tre-dft',
      'tre-es', 'tre-go', 'tre-ma', 'tre-mg', 'tre-ms', 'tre-mt', 'tre-pa',
      'tre-pb', 'tre-pe', 'tre-pi', 'tre-pr', 'tre-rj', 'tre-rn', 'tre-ro',
      'tre-rr', 'tre-rs', 'tre-sc', 'tre-se', 'tre-sp', 'tre-to',
    ];
    const tjms = ['tjmmg', 'tjmrs', 'tjmsp'];

    const todos = [...superiores, ...trfs, ...tjs, ...trts, ...tres, ...tjms];
    expect(TRIBUNAIS_DATAJUD_VALUES.sort()).toEqual(todos.sort());
  });
});
