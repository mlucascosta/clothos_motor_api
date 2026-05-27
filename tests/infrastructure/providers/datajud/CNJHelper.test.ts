import {
  extrairSiglaDoCNJ,
  limparCNJ,
  pareceCNJ,
} from '../../../../src/infrastructure/providers/datajud/CNJHelper';

describe('CNJHelper', () => {
  describe('extrairSiglaDoCNJ', () => {
    it('extrai TJSP do CNJ', () => {
      expect(extrairSiglaDoCNJ('1004634-81.2023.8.26.0045')).toBe('tjsp');
    });

    it('extrai TJMS do CNJ', () => {
      expect(extrairSiglaDoCNJ('0931245-20.2025.8.12.0001')).toBe('tjms');
    });

    it('extrai TJSE do CNJ', () => {
      expect(extrairSiglaDoCNJ('0000359-43.2026.8.25.0041')).toBe('tjse');
    });

    it('extrai TJMG do CNJ', () => {
      expect(extrairSiglaDoCNJ('0012345-67.2023.8.11.0001')).toBe('tjmg');
    });

    it('extrai TJBA do CNJ', () => {
      expect(extrairSiglaDoCNJ('0012345-67.2023.8.05.0001')).toBe('tjba');
    });

    it('extrai TJD do CNJ sem formatação', () => {
      expect(extrairSiglaDoCNJ('10046348120238260045')).toBe('tjsp');
    });

    it('extrai TRF1 (J=4, TR=01)', () => {
      expect(extrairSiglaDoCNJ('0012345-67.2023.4.01.0001')).toBe('trf1');
    });

    it('extrai TRT1 (J=5, TR=01)', () => {
      expect(extrairSiglaDoCNJ('0012345-67.2023.5.01.0001')).toBe('trt1');
    });

    it('extrai TRE-AC (J=6, TR=01)', () => {
      expect(extrairSiglaDoCNJ('0012345-67.2023.6.01.0001')).toBe('tre-ac');
    });

    it('extrai TJMMG (J=7, TR=01)', () => {
      expect(extrairSiglaDoCNJ('0012345-67.2023.7.01.0001')).toBe('tjmmg');
    });

    it('retorna null para CNJ inválido (muito curto)', () => {
      expect(extrairSiglaDoCNJ('123')).toBeNull();
    });

    it('retorna null para CNJ inválido (muito longo)', () => {
      expect(extrairSiglaDoCNJ('123456789012345678901')).toBeNull();
    });

    it('retorna null para TR inválido', () => {
      expect(extrairSiglaDoCNJ('0012345-67.2023.8.99.0001')).toBeNull();
    });

    it('retorna null para J inválido', () => {
      expect(extrairSiglaDoCNJ('0012345-67.2023.9.01.0001')).toBeNull();
    });
  });

  describe('limparCNJ', () => {
    it('remove formatação', () => {
      expect(limparCNJ('1004634-81.2023.8.26.0045')).toBe('10046348120238260045');
    });

    it('mantém sem formatação', () => {
      expect(limparCNJ('10046348120238260045')).toBe('10046348120238260045');
    });
  });

  describe('pareceCNJ', () => {
    it('aceita CNJ formatado', () => {
      expect(pareceCNJ('1004634-81.2023.8.26.0045')).toBe(true);
    });

    it('aceita CNJ sem formatação', () => {
      expect(pareceCNJ('10046348120238260045')).toBe(true);
    });

    it('rejeita string curta', () => {
      expect(pareceCNJ('123')).toBe(false);
    });
  });
});
