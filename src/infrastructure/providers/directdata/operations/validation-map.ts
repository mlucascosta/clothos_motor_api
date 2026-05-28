/**
 * @fileoverview Mapa de validação de parâmetros obrigatórios por endpoint DirectData.
 * Gerado automaticamente a partir do swagger.json.
 * @module infrastructure/providers/directdata/operations/validation-map
 */

/**
 * Mapa de endpoints → array de nomes de parâmetros obrigatórios.
 */
export const directDataRequiredParams: Record<string, string[]> = {
  AntifraudePix: ['DOCUMENTO', 'CHAVE'],
  CGUConsultoriaGeralUniao: ['TIPO'],
  CertidaoNegativaDebitos: ['UF'],
  CertidaoNegativaDebitosMunicipal: ['MUNICIPIO'],
  MinisterioPublicoTrabalho: ['REGIAO'],
  PRFInfracoes: ['PLACA', 'RENAVAM', 'TIPO'],
  PoliciaCivilAntecedentesCriminais: ['UF'],
  Sintegra: ['UF'],
  SintegraCCC: ['UF'],
  TJCertidaoCivelCriminalFiscal: ['UF', 'TIPO'],
  TituloLocalVotacao: ['DATANASCIMENTO', 'NOMEMAE'],
  TribunalJustica: ['UF', 'GRAU'],
  TribunalRegionalFederal: ['REGIAO', 'TIPO'],
  TribunalRegionalTrabalho: ['REGIAO'],
};
