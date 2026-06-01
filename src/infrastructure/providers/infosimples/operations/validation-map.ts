/**
 * @fileoverview Mapa de parâmetros obrigatórios por operação Infosimples.
 * Usado pela rota para validação pré-requisição.
 * @module infrastructure/providers/infosimples/operations/validation-map
 */

/**
 * Regra de validação "pelo menos um dos params".
 * Usado para endpoints que aceitam cpf OU cnpj (não ambos obrigatórios).
 */
export type OneOfGroup = { oneOf: string[] };

/**
 * Parâmetros obrigatórios por operação.
 * - `string[]` → todos devem estar presentes
 * - `OneOfGroup` → ao menos um do grupo deve estar presente
 */
export type ValidationRule = (string | OneOfGroup)[];

/**
 * Mapa: chave = path Infosimples (ex: 'consultas/cenprot-sp/protestos').
 * Alias curtos (ex: 'cpf') também são aceitos.
 */
export const infosimplesRequiredParams: Record<string, ValidationRule> = {
  // RFB (Receita Federal)
  'consultas/receita-federal/cpf': ['cpf'],
  'consultas/receita-federal/cnpj': ['cnpj'],

  // Protestos
  'consultas/cenprot-sp/protestos': [{ oneOf: ['cpf', 'cnpj'] }],
  'consultas/ieptb/protestos': [{ oneOf: ['cpf', 'cnpj'] }],
  'consultas/ieptb/protestos/detalhes-sp': ['obter_detalhes'],

  // Lote 2 — Antecedentes Criminais
  // 'consultas/antecedentes-criminais/mg' — sem required (rg e cpf opcionais)
  'consultas/antecedentes-criminais/pf/emit': ['nome', 'birthdate'],
  'consultas/antecedentes-criminais/pf/val': ['certidao_codigo', 'birthdate'],
  'consultas/antecedentes-criminais/sp': ['nome', 'birthdate', 'genero'],

  // Lote 3 — BCB, B3, CADE, CVM, MPF, MP-SP
  // 'consultas/bcb/cheques-sem-fundo' — sem required (credenciais opcionais)
  'consultas/bcb/valores-receber': [{ oneOf: ['cpf', 'cnpj'] }],
  'consultas/b3/participantes': ['cnpj'],
  // 'consultas/cade/processos' — sem required (processo opcional)
  // 'consultas/cvm/participante' — sem required (name/cpf/cnpj opcionais)
  // 'consultas/cvm/processo-administrativo' — sem required
  // 'consultas/cvm/sancionadores' — sem required
  'consultas/mpf/amazonia-protege': [{ oneOf: ['cpf', 'cnpj'] }],
  'consultas/mpf/certidao-negativa': [{ oneOf: ['cpf', 'cnpj'] }],
  'consultas/mpf/lava-jato': ['termos'],
  'consultas/mpf/processos': ['query'],
  // 'consultas/mp/sp/inquerito-civil' — sem required (cpf/cnpj/nome opcionais)

  // Lote 4 — Portal Transparência
  'consultas/portal-transparencia/auxilio': ['data_inicio', 'data_fim'],
  'consultas/portal-transparencia/bolsa': ['data_inicio', 'data_fim'],
  'consultas/portal-transparencia/bpc': ['cpf'],
  'consultas/portal-transparencia/busca': ['query'],
  'consultas/portal-transparencia/ceaf': ['cpf'],
  'consultas/portal-transparencia/ceis': [{ oneOf: ['cpf', 'cnpj'] }],
  'consultas/portal-transparencia/cepim': ['cnpj'],
  'consultas/portal-transparencia/cnep': [{ oneOf: ['cpf', 'cnpj'] }],
  'consultas/portal-transparencia/convenios': ['convenente'],
  'consultas/portal-transparencia/leniencia': ['cnpj'],
  'consultas/portal-transparencia/peti': ['cpf'],
  'consultas/portal-transparencia/repasse': ['ano', 'localidade'],
  'consultas/portal-transparencia/safra': ['cpf'],
  'consultas/portal-transparencia/servidor': ['cpf'],
  // 'consultas/portal-transparencia/seguro' — sem parâmetros obrigatórios

  // Lote 5 — Social
  'consultas/dataprev/fap': ['cnpj_estabelecimento'],
  'consultas/dataprev/qualificacao': ['nis', 'name', 'birthdate', 'cpf'],
  'consultas/cnis/pre-inscricao': ['cpf', 'nome', 'data_nascimento'],
  'consultas/sit/caepi': ['ca'],

  // Lote 6 — Imóveis/Rural
  'consultas/car/demonstrativo': ['car'],
  'consultas/car/demonstrativo-pdf': ['car'],
  'consultas/car/download-shapefile': ['car'],
  'consultas/car/imovel': ['car'],
  'consultas/incra/coordenadas': ['numero_certificacao'],
  'consultas/incra/sigef/detalhes-parcela': ['codigo_parcela'],
  'consultas/sncr/ccir': ['codigo_imovel', 'uf_sede', 'municipio_sede'],
  'consultas/sncr/imoveis': ['uf', 'municipio'],
  'consultas/onr/mapa-registro-imoveis': ['camada'],
  'consultas/ibama/autuacoes': ['ano'],
  'consultas/diario-oficial/sp/valor-venal': ['codigo_ipva', 'ano_fabricacao'],

  // Lote 7 — Prefeituras IPTU + Sefaz
  'consultas/pref/mg/belo-horizonte/cndiptu': ['identificador', 'data_inicio', 'data_fim'],
  'consultas/pref/mg/belo-horizonte/iptu': ['identificador'],
  'consultas/pref/rj/rio-janeiro/iptu': ['inscricao'],
  'consultas/pref/sp/campinas/iptu': ['codigo_cartografico', 'nome_devedor'],
  'consultas/pref/sp/sao-paulo/dados-imovel': ['cadastro_imovel', 'ano_exercicio'],
  'consultas/pref/sp/sao-paulo/debitos-iptu': ['cadastro_imovel'],
  'consultas/pref/sp/sao-paulo/iptu2via': ['sql', 'parcela', 'ano'],
  'consultas/pref/sp/sao-paulo/iptu': ['sql'],
  'consultas/sefaz/df/iptu': ['inscricao_imovel'],
  'consultas/sefaz/spu/certidao-imoveis': ['tipo_certidao'],
  // 'consultas/sefaz/spu/dados-imoveis' — sem parâmetros obrigatórios

  // Lote 8 — Registradores
  // 'consultas/registradores/certid/download' — sem parâmetros obrigatórios
  'consultas/registradores/certid/pedido': [
    'uf',
    'municipio',
    'cartorio',
    'tipo_certidao',
    'matricula',
  ],
  // 'consultas/registradores/certid/recibo' — sem parâmetros obrigatórios
  // 'consultas/registradores/info-conta' — sem parâmetros obrigatórios
  // 'consultas/registradores/matric/download' — sem parâmetros obrigatórios
  // 'consultas/registradores/matric/lista' — sem parâmetros obrigatórios
  'consultas/registradores/matric/pedido': [
    'matricula',
    'uf',
    'municipio',
    'cartorio',
    'finalidade',
  ],
  // 'consultas/registradores/matric/recibo' — sem parâmetros obrigatórios

  // Aliases curtos (backward-compat)
  cpf: ['cpf'],
  cnpj: ['cnpj'],
};
