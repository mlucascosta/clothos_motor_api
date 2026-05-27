import {
  DataJudSearchRequestSchema,
  DataJudProcessoRequestSchema,
  DataJudClasseRequestSchema,
  DataJudOrgaoRequestSchema,
  DataJudEnvolvidoRequestSchema,
} from '../../../../src/infrastructure/providers/datajud/dtos/DataJudSearchRequestDto';

describe('DataJud DTOs', () => {
  describe('DataJudSearchRequestSchema', () => {
    it('valida DSL completa', () => {
      const parsed = DataJudSearchRequestSchema.safeParse({
        query: { match_all: {} },
        size: 50,
        from: 10,
        sort: [{ '@timestamp': { order: 'asc' } }],
        _source: ['numeroProcesso', 'classe'],
      });
      expect(parsed.success).toBe(true);
    });

    it('aplica defaults', () => {
      const parsed = DataJudSearchRequestSchema.safeParse({
        query: { match_all: {} },
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.size).toBe(10);
        expect(parsed.data.from).toBe(0);
      }
    });

    it('rejeita size > 100', () => {
      const parsed = DataJudSearchRequestSchema.safeParse({
        query: { match_all: {} },
        size: 101,
      });
      expect(parsed.success).toBe(false);
    });

    it('rejeita sem query', () => {
      const parsed = DataJudSearchRequestSchema.safeParse({
        size: 10,
      });
      expect(parsed.success).toBe(false);
    });
  });

  describe('DataJudProcessoRequestSchema', () => {
    it('valida numeroProcesso', () => {
      const parsed = DataJudProcessoRequestSchema.safeParse({
        numeroProcesso: '1004634-81.2023.8.26.0045',
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.size).toBe(1);
      }
    });

    it('rejeita numeroProcesso muito curto', () => {
      const parsed = DataJudProcessoRequestSchema.safeParse({
        numeroProcesso: '123',
      });
      expect(parsed.success).toBe(false);
    });

    it('rejeita numeroProcesso muito longo', () => {
      const parsed = DataJudProcessoRequestSchema.safeParse({
        numeroProcesso: '1'.repeat(26),
      });
      expect(parsed.success).toBe(false);
    });
  });

  describe('DataJudClasseRequestSchema', () => {
    it('valida classeNome', () => {
      const parsed = DataJudClasseRequestSchema.safeParse({
        classeNome: 'Procedimento Comum Cível',
        size: 20,
      });
      expect(parsed.success).toBe(true);
    });

    it('valida classeCodigo', () => {
      const parsed = DataJudClasseRequestSchema.safeParse({
        classeCodigo: 1116,
      });
      expect(parsed.success).toBe(true);
    });

    it('rejeita sem classeNome nem classeCodigo', () => {
      const parsed = DataJudClasseRequestSchema.safeParse({
        size: 20,
      });
      expect(parsed.success).toBe(false);
    });
  });

  describe('DataJudOrgaoRequestSchema', () => {
    it('valida orgaoJulgador', () => {
      const parsed = DataJudOrgaoRequestSchema.safeParse({
        orgaoJulgador: '1ª Vara Cível',
      });
      expect(parsed.success).toBe(true);
    });

    it('rejeita orgaoJulgador vazio', () => {
      const parsed = DataJudOrgaoRequestSchema.safeParse({
        orgaoJulgador: '',
      });
      expect(parsed.success).toBe(false);
    });
  });

  describe('DataJudEnvolvidoRequestSchema', () => {
    it('valida nome', () => {
      const parsed = DataJudEnvolvidoRequestSchema.safeParse({
        nome: 'João Silva',
      });
      expect(parsed.success).toBe(true);
    });

    it('valida cpfCnpj', () => {
      const parsed = DataJudEnvolvidoRequestSchema.safeParse({
        cpfCnpj: '12345678901',
      });
      expect(parsed.success).toBe(true);
    });

    it('valida nome e cpfCnpj juntos', () => {
      const parsed = DataJudEnvolvidoRequestSchema.safeParse({
        nome: 'João Silva',
        cpfCnpj: '12345678901',
      });
      expect(parsed.success).toBe(true);
    });
  });
});
