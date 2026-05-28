/**
 * @fileoverview Router de Rotas para API DirectData — Motor de Consultas Reduto Finder
 *
 * @module directdata
 *
 * ## Contexto
 *
 * Este arquivo centraliza todas as rotas HTTP que expõem os 128 endpoints do marketplace
 * de APIs da DirectData (https://app.directd.com.br/marketplace/apis).
 *
 * ## Autenticação
 * - Bearer Token (via env var DIRECTDATA_APIKEY ou DIRECTDATA_TOKEN)
 * - Passado automaticamente em todos os requests via DirectDataHttpClient
 *
 * ## Pipeline de Requisição
 * 1. Cliente bate em /api/directdata/{endpoint}
 * 2. Handler extrai query params, valida presença de obrigatórios
 * 3. Operation executa chamada para https://apiv3.directd.com.br/api/{endpoint}
 * 4. Response convertida para JSON e retornada (ou erro 500 se falhar)
 * 5. Resultado persistido em rawStore para auditoria
 *
 * ## Endpoints (128 APIs)
 */

import { Hono } from 'hono';
import type { Context } from 'hono';
import { rawStore } from '../../../infrastructure/persistence/index.js';
import { DirectDataHttpClient } from '../../../infrastructure/providers/directdata/DirectDataHttpClient.js';
import { ConsultarDirectData } from '../../../infrastructure/providers/directdata/operations/ConsultarDirectData.js';
import { isLeft } from '../../../shared/domain/Either.js';
import type { Either } from '../../../shared/domain/Either.js';
import type { SourceError } from '../../../shared/domain/errors/SourceError.js';

const GW = 'directdata';
const BASE_URL = 'https://apiv3.directd.com.br';

function buildHttp(): DirectDataHttpClient {
  const token = process.env['DIRECTDATA_TOKEN'] ?? process.env['DIRECTDATA_APIKEY'] ?? '';
  return new DirectDataHttpClient(token, BASE_URL);
}

const directdata = new Hono();

async function handleOp<T>(
  c: Context,
  opts: {
    gateway: string;
    fonte: string;
    tipo_param: string | null;
    param: string | null;
    statusCode?: number;
  },
  execute: () => Promise<Either<SourceError, T>>,
): Promise<Response> {
  const result = await execute();
  const base = {
    gateway: opts.gateway,
    fonte: opts.fonte,
    tipo_param: opts.tipo_param,
    param: opts.param,
    created_at: new Date(),
  };
  if (isLeft(result)) {
    rawStore.save({
      ...base,
      result: { message: result.value.message },
      status: 'error',
      error_kind: result.value.kind,
    });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500) as Response;
  }
  rawStore.save({ ...base, result: result.value, status: 'success' });
  return c.json(
    result.value,
    (opts.statusCode ?? 200) as import('hono/utils/http-status').ContentfulStatusCode,
  ) as Response;
}

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: * API - Recuperar consulta pelo UID
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/Historico', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'Historico',
      tipo_param: 'consultauid',
      param: c.req.query('ConsultaUid') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/Historico',
        params: {
          ConsultaUid: c.req.query('ConsultaUid') ?? undefined,
          Extensao: c.req.query('Extensao') ?? undefined,
        },
      }),
  );
});

directdata.get('/Historico/ObterRetornoConsultaAsync', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'Historico/ObterRetornoConsultaAsync',
      tipo_param: 'consultauid',
      param: c.req.query('ConsultaUid') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/Historico/ObterRetornoConsultaAsync',
        params: { ConsultaUid: c.req.query('ConsultaUid') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: AML - Anti Money Laundering (Vínculos Societários)
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/AML', async (c) => {
  return handleOp(
    c,
    { gateway: GW, fonte: 'AML', tipo_param: 'cpf', param: c.req.query('CPF') ?? 'null' },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/AML',
        params: { CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: ANTT - Consulta de Regularidade da Transportadora
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/ANTTConsultaRegularidadeTransportadora', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'ANTTConsultaRegularidadeTransportadora',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/ANTTConsultaRegularidadeTransportadora',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          CNPJ: c.req.query('CNPJ') ?? undefined,
          RNTRC: c.req.query('RNTRC') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: APF Rural - Autorização Provisória de Funcionamento Rural
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/APFRural', async (c) => {
  return handleOp(
    c,
    { gateway: GW, fonte: 'APFRural', tipo_param: 'cnpj', param: c.req.query('CNPJ') ?? 'null' },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/APFRural',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          CPF: c.req.query('CPF') ?? undefined,
          NumeroAPF: c.req.query('NumeroAPF') ?? undefined,
          NumeroCAR: c.req.query('NumeroCAR') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Acordos de Leniência
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/AcordosLeniencia', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'AcordosLeniencia',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/AcordosLeniencia',
        params: { CNPJ: c.req.query('CNPJ') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Antifraude Chave PIX
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/AntifraudePix', async (c) => {
  const documento_val = c.req.query('DOCUMENTO');
  if (!documento_val) return c.json({ error: 'Parâmetro DOCUMENTO obrigatório' }, 400);
  const chave_val = c.req.query('CHAVE');
  if (!chave_val) return c.json({ error: 'Parâmetro CHAVE obrigatório' }, 400);
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'AntifraudePix',
      tipo_param: 'documento',
      param: c.req.query('DOCUMENTO') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/AntifraudePix',
        params: {
          DOCUMENTO: c.req.query('DOCUMENTO') ?? undefined,
          CHAVE: c.req.query('CHAVE') ?? undefined,
          TIPO: c.req.query('TIPO') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Auxílio Emergencial
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/AuxilioEmergencial', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'AuxilioEmergencial',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/AuxilioEmergencial',
        params: { CPF: c.req.query('CPF') ?? undefined, NIS: c.req.query('NIS') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Auxílio Reconstrução
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/AuxilioReconstrucao', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'AuxilioReconstrucao',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/AuxilioReconstrucao',
        params: { CPF: c.req.query('CPF') ?? undefined, NIS: c.req.query('NIS') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Banco Central - Quadro Geral de Inabilitados
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/BancoCentralInabilitados', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'BancoCentralInabilitados',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/BancoCentralInabilitados',
        params: { CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Banco Central - Quadro Geral de Proibidos
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/BancoCentralProibidos', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'BancoCentralProibidos',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/BancoCentralProibidos',
        params: { CNPJ: c.req.query('CNPJ') ?? undefined, CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Beneficiário Final
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/BeneficiarioFinal', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'BeneficiarioFinal',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/BeneficiarioFinal',
        params: { CNPJ: c.req.query('CNPJ') ?? undefined, CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Benefício de Prestação Continuada - BPC
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/BeneficioPrestacaoContinuada', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'BeneficioPrestacaoContinuada',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/BeneficioPrestacaoContinuada',
        params: { CPF: c.req.query('CPF') ?? undefined, NIS: c.req.query('NIS') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Benefícios Sociais - Pessoa Física
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/BeneficiosSociais', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'BeneficiosSociais',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/BeneficiosSociais',
        params: { CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Bet Safe Compliance
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/BetSafeCompliance', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'BetSafeCompliance',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/BetSafeCompliance',
        params: { CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Boa Vista - Acerta Completo Positivo Pessoa Física
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/BoaVistaAcertaCompletoPositivoPF', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'BoaVistaAcertaCompletoPositivoPF',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/BoaVistaAcertaCompletoPositivoPF',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Boa Vista - Acerta Mais Positivo Pessoa Física
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/BoaVistaAcertaMaisPositivoPF', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'BoaVistaAcertaMaisPositivoPF',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/BoaVistaAcertaMaisPositivoPF',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Boa Vista - Define Limite Positivo Pessoa Jurídica
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/BoaVistaDefineLimitePositivoPJ', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'BoaVistaDefineLimitePositivoPJ',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/BoaVistaDefineLimitePositivoPJ',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Boa Vista - Risco Positivo Pessoa Jurídica
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/BoaVistaRiscoPositivoPJ', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'BoaVistaRiscoPositivoPJ',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/BoaVistaRiscoPositivoPJ',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Bolsa Família
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/BolsaFamilia', async (c) => {
  return handleOp(
    c,
    { gateway: GW, fonte: 'BolsaFamilia', tipo_param: 'nis', param: c.req.query('NIS') ?? 'null' },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/BolsaFamilia',
        params: {
          NIS: c.req.query('NIS') ?? undefined,
          MESREFERENCIA: c.req.query('MESREFERENCIA') ?? undefined,
          ANOREFERENCIA: c.req.query('ANOREFERENCIA') ?? undefined,
          MESCOMPETENCIA: c.req.query('MESCOMPETENCIA') ?? undefined,
          ANOCOMPETENCIA: c.req.query('ANOCOMPETENCIA') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CADIN - Secretaria da Fazenda
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CADINSecretariaFazendaEstaduais', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CADINSecretariaFazendaEstaduais',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CADINSecretariaFazendaEstaduais',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          CNPJ: c.req.query('CNPJ') ?? undefined,
          UF: c.req.query('UF') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CADIN - Secretaria da Fazenda - São Paulo
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CADINSecretariaFazendaSP', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CADINSecretariaFazendaSP',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CADINSecretariaFazendaSP',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CAFIR - Cadastros de Imóveis Rurais
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CadastroImoveisRurais', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CadastroImoveisRurais',
      tipo_param: 'cib',
      param: c.req.query('CIB') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CadastroImoveisRurais',
        params: {
          CIB: c.req.query('CIB') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CAF - Cadastro Nacional de Agricultura Familiar - PF
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CAFCadastroNacionalAgriculturaPF', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CAFCadastroNacionalAgriculturaPF',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CAFCadastroNacionalAgriculturaPF',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CAF - Cadastro Nacional de Agricultura Familiar - PJ
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CAFCadastroNacionalAgriculturaPJ', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CAFCadastroNacionalAgriculturaPJ',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CAFCadastroNacionalAgriculturaPJ',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CARF - Conselho Administrativo de Recursos Fiscais
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CARFConselhoAdministrativodeRecursosFiscais', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CARFConselhoAdministrativodeRecursosFiscais',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CARFConselhoAdministrativodeRecursosFiscais',
        params: { CPF: c.req.query('CPF') ?? undefined, CNPJ: c.req.query('CNPJ') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CAR - Cadastro Ambiental Rural
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CadastroAmbientalRural', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CadastroAmbientalRural',
      tipo_param: 'numerocar',
      param: c.req.query('NumeroCAR') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CadastroAmbientalRural',
        params: {
          NumeroCAR: c.req.query('NumeroCAR') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CCD - Certidão Conjunta de Débitos - Pessoa Física
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CertidaoConjuntaDebitosPessoaFisica', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CertidaoConjuntaDebitosPessoaFisica',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CertidaoConjuntaDebitosPessoaFisica',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          DATANASCIMENTO: c.req.query('DATANASCIMENTO') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CCD - Certidão Conjunta de Débitos - Pessoa Jurídica
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CertidaoConjuntaDebitosPessoaJuridica', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CertidaoConjuntaDebitosPessoaJuridica',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CertidaoConjuntaDebitosPessoaJuridica',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CEAF - Cadastro de Expulsões da Administração Federal
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CadastroExpulsoesAdministracaoFederal', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CadastroExpulsoesAdministracaoFederal',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CadastroExpulsoesAdministracaoFederal',
        params: { CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CEIS - Cadastro de Empresas Inidôneas e Suspensas
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CadastroEmpresasInidoneasSuspensas', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CadastroEmpresasInidoneasSuspensas',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CadastroEmpresasInidoneasSuspensas',
        params: { CNPJ: c.req.query('CNPJ') ?? undefined, CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CEPIM - Cadastro de Entidades Privadas Sem Fins Lucrativos Impedidas
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CadastroEntidadesPrivadasImpedidas', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CadastroEntidadesPrivadasImpedidas',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CadastroEntidadesPrivadasImpedidas',
        params: { CNPJ: c.req.query('CNPJ') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CNDIR - Certidão Negativa de Débitos e Dívida Ativa da União de Imóvel Rural
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CertidaoNegativaDebitosImovelRural', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CertidaoNegativaDebitosImovelRural',
      tipo_param: 'cib',
      param: c.req.query('CIB') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CertidaoNegativaDebitosImovelRural',
        params: {
          CIB: c.req.query('CIB') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CNDM - Certidão Negativa de Débitos Municipal
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CertidaoNegativaDebitosMunicipal', async (c) => {
  const municipio_val = c.req.query('MUNICIPIO');
  if (!municipio_val) return c.json({ error: 'Parâmetro MUNICIPIO obrigatório' }, 400);
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CertidaoNegativaDebitosMunicipal',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CertidaoNegativaDebitosMunicipal',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          IM: c.req.query('IM') ?? undefined,
          CPF: c.req.query('CPF') ?? undefined,
          MUNICIPIO: c.req.query('MUNICIPIO') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CND - Certidão Negativa de Débitos
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CertidaoNegativaDebitos', async (c) => {
  const uf_val = c.req.query('UF');
  if (!uf_val) return c.json({ error: 'Parâmetro UF obrigatório' }, 400);
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CertidaoNegativaDebitos',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CertidaoNegativaDebitos',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          IE: c.req.query('IE') ?? undefined,
          CPF: c.req.query('CPF') ?? undefined,
          UF: c.req.query('UF') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CNEP - Cadastro Nacional de Empresas Punidas
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CadastroNacionalEmpresasPunidas', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CadastroNacionalEmpresasPunidas',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CadastroNacionalEmpresasPunidas',
        params: { CNPJ: c.req.query('CNPJ') ?? undefined, CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CNH - Carteira Nacional de Habilitação
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CarteiraNacionalHabilitacao', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CarteiraNacionalHabilitacao',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CarteiraNacionalHabilitacao',
        params: { CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CNIA - Cadastro Nacional de Condenações Cíveis por Ato de Improbidade Administrativa e Inelegibilidade
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CadastroNacionalImprobidadeAdministrativa', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CadastroNacionalImprobidadeAdministrativa',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CadastroNacionalImprobidadeAdministrativa',
        params: { CNPJ: c.req.query('CNPJ') ?? undefined, CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CNJ - Mandados de Prisão
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CNJMandadosPrisao', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CNJMandadosPrisao',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CNJMandadosPrisao',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          NOME: c.req.query('NOME') ?? undefined,
          NOMEMAE: c.req.query('NOMEMAE') ?? undefined,
          NOMEPAI: c.req.query('NOMEPAI') ?? undefined,
          ALCUNHA: c.req.query('ALCUNHA') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CONFEA/CREA - Conselho Federal de Engenharia e Agronomia
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CONFEA', async (c) => {
  return handleOp(
    c,
    { gateway: GW, fonte: 'CONFEA', tipo_param: 'cpf', param: c.req.query('CPF') ?? 'null' },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CONFEA',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          REGISTRONACIONAL: c.req.query('REGISTRONACIONAL') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CVM - Comissão de Valores Mobiliários
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CVMComissaodeValoresMobiliarios', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CVMComissaodeValoresMobiliarios',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CVMComissaodeValoresMobiliarios',
        params: { CPF: c.req.query('CPF') ?? undefined, CNPJ: c.req.query('CNPJ') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CVM - Processos Administrativos Sancionadores
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CVMProcessosAdministrativosSancionadores', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CVMProcessosAdministrativosSancionadores',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CVMProcessosAdministrativosSancionadores',
        params: { CPF: c.req.query('CPF') ?? undefined, CNPJ: c.req.query('CNPJ') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Cadastro + Receita Federal - Pessoa Física
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CadastroReceitaPessoaFisica', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CadastroReceitaPessoaFisica',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CadastroReceitaPessoaFisica',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Cadastro - Pessoa Física - Básica
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CadastroPessoaFisica', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CadastroPessoaFisica',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CadastroPessoaFisica',
        params: { CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Cadastro - Pessoa Física - Plus
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CadastroPessoaFisicaPlus', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CadastroPessoaFisicaPlus',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CadastroPessoaFisicaPlus',
        params: { CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Cadastro - Pessoa Jurídica - Básica
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CadastroPessoaJuridica', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CadastroPessoaJuridica',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CadastroPessoaJuridica',
        params: { CNPJ: c.req.query('CNPJ') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Cadastro - Pessoa Jurídica - Plus
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CadastroPessoaJuridicaPlus', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CadastroPessoaJuridicaPlus',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CadastroPessoaJuridicaPlus',
        params: { CNPJ: c.req.query('CNPJ') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Certificado Anbima EDU
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/AnbimaCertificadoEDU', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'AnbimaCertificadoEDU',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/AnbimaCertificadoEDU',
        params: { CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Consulta Veicular
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/ConsultaVeicular', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'ConsultaVeicular',
      tipo_param: 'placa',
      param: c.req.query('PLACA') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/ConsultaVeicular',
        params: { PLACA: c.req.query('PLACA') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Consulta Veicular - Frotas PF e PJ
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/ConsultaVeicularFrotas', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'ConsultaVeicularFrotas',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/ConsultaVeicularFrotas',
        params: { CPF: c.req.query('CPF') ?? undefined, CNPJ: c.req.query('CNPJ') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Consultoria Geral da União - CGU
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CGUConsultoriaGeralUniao', async (c) => {
  const tipo_val = c.req.query('TIPO');
  if (!tipo_val) return c.json({ error: 'Parâmetro TIPO obrigatório' }, 400);
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CGUConsultoriaGeralUniao',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CGUConsultoriaGeralUniao',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          CNPJ: c.req.query('CNPJ') ?? undefined,
          TIPO: c.req.query('TIPO') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Correios - Busca CEP
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CorreiosBuscaCEP', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CorreiosBuscaCEP',
      tipo_param: 'endereco',
      param: c.req.query('ENDERECO') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CorreiosBuscaCEP',
        params: { ENDERECO: c.req.query('ENDERECO') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: DAP - Declaração de Aptidão ao Pronaf - Pessoa Física
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/DAPPessoaFisica', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'DAPPessoaFisica',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/DAPPessoaFisica',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: DAP - Declaração de Aptidão ao Pronaf - Pessoa Jurídica
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/DAPPessoaJuridica', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'DAPPessoaJuridica',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/DAPPessoaJuridica',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Detalhamento Negativo QUOD
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/DetalhamentoNegativo', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'DetalhamentoNegativo',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/DetalhamentoNegativo',
        params: { CPF: c.req.query('CPF') ?? undefined, CNPJ: c.req.query('CNPJ') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Dossiê QUOD - Completo
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/DossieCreditoCompleto', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'DossieCreditoCompleto',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/DossieCreditoCompleto',
        params: { CPF: c.req.query('CPF') ?? undefined, CNPJ: c.req.query('CNPJ') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: EU Financial Sanctions List
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/EUFinancialList', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'EUFinancialList',
      tipo_param: 'nome',
      param: c.req.query('NOME') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/EUFinancialList',
        params: { NOME: c.req.query('NOME') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Enriquecimento de Lead
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/EnriquecimentoLead', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'EnriquecimentoLead',
      tipo_param: 'celular',
      param: c.req.query('CELULAR') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/EnriquecimentoLead',
        params: {
          CELULAR: c.req.query('CELULAR') ?? undefined,
          EMAIL: c.req.query('EMAIL') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: FBI - Most Wanted
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/FBIMostWanted', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'FBIMostWanted',
      tipo_param: 'nome',
      param: c.req.query('NOME') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/FBIMostWanted',
        params: { NOME: c.req.query('NOME') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: FGTS - Regularidade do Empregador
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/CaixaRegularidadeEmpregadorFGTS', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'CaixaRegularidadeEmpregadorFGTS',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/CaixaRegularidadeEmpregadorFGTS',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: FINCEN - Financial Crimes Enforcement Network
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/FinCEN', async (c) => {
  return handleOp(
    c,
    { gateway: GW, fonte: 'FinCEN', tipo_param: 'nome', param: c.req.query('NOME') ?? 'null' },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/FinCEN',
        params: { NOME: c.req.query('NOME') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Garantia Safra
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/GarantiaSafra', async (c) => {
  return handleOp(
    c,
    { gateway: GW, fonte: 'GarantiaSafra', tipo_param: 'cpf', param: c.req.query('CPF') ?? 'null' },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/GarantiaSafra',
        params: { CPF: c.req.query('CPF') ?? undefined, NIS: c.req.query('NIS') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Histórico Veicular PF e PJ - São Paulo
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/HistoricoVeiculos', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'HistoricoVeiculos',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/HistoricoVeiculos',
        params: { CPF: c.req.query('CPF') ?? undefined, CNPJ: c.req.query('CNPJ') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: IBAMA - Certidão Negativa de Débitos
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/IBAMACertidaoNegativaDebitos', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'IBAMACertidaoNegativaDebitos',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/IBAMACertidaoNegativaDebitos',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: IBAMA - Certidão Negativa de Embargo
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/IBAMACertidaoNegativaEmbargos', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'IBAMACertidaoNegativaEmbargos',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/IBAMACertidaoNegativaEmbargos',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: IBAMA - Certificado de Regularidade
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/IBAMACertificadoRegularidade', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'IBAMACertificadoRegularidade',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/IBAMACertificadoRegularidade',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: IBAMA - Consulta de Autuações Ambientais
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/IBAMAConsultaAutuacoesAmbientais', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'IBAMAConsultaAutuacoesAmbientais',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/IBAMAConsultaAutuacoesAmbientais',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: INTERPOL
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/Interpol', async (c) => {
  return handleOp(
    c,
    { gateway: GW, fonte: 'Interpol', tipo_param: 'nome', param: c.req.query('NOME') ?? 'null' },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/Interpol',
        params: {
          NOME: c.req.query('NOME') ?? undefined,
          SOBRENOME: c.req.query('SOBRENOME') ?? undefined,
          DATANASCIMENTO: c.req.query('DATANASCIMENTO') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: MPT - Ministério Público do Trabalho
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/MinisterioPublicoTrabalho', async (c) => {
  const regiao_val = c.req.query('REGIAO');
  if (!regiao_val) return c.json({ error: 'Parâmetro REGIAO obrigatório' }, 400);
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'MinisterioPublicoTrabalho',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/MinisterioPublicoTrabalho',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          CPF: c.req.query('CPF') ?? undefined,
          REGIAO: c.req.query('REGIAO') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Ministério Público Federal - Certidão Negativa
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/MPFCertidaoNegativa', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'MPFCertidaoNegativa',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/MPFCertidaoNegativa',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Ministério Público do Estado de Mato Grosso (MPMT) - Procedimentos Investigatórios Extrajudiciais
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/MPMTMinisterioPublicoMatoGrosso', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'MPMTMinisterioPublicoMatoGrosso',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/MPMTMinisterioPublicoMatoGrosso',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Ministério do Trabalho - PIS
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/MinisterioTrabalhoPIS', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'MinisterioTrabalhoPIS',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/MinisterioTrabalhoPIS',
        params: { CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Ministério do Trabalho e do Emprego (MTE) - Infrações Trabalhistas
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/MTEInfracoesTrabalhistas', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'MTEInfracoesTrabalhistas',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/MTEInfracoesTrabalhistas',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          CNPJ: c.req.query('CNPJ') ?? undefined,
          TIPO: c.req.query('TIPO') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: NFe - Nota Fiscal Eletrônica - Completa
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/NotaFiscalEletronicaCompleta', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'NotaFiscalEletronicaCompleta',
      tipo_param: 'chave',
      param: c.req.query('CHAVE') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/NotaFiscalEletronicaCompleta',
        params: {
          CHAVE: c.req.query('CHAVE') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: NFe - Nota Fiscal Eletrônica - Inutilizações
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/NotaFiscalEletronicaInutilizacao', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'NotaFiscalEletronicaInutilizacao',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/NotaFiscalEletronicaInutilizacao',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          ANO: c.req.query('ANO') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Nível Socioeconômico e Renda Estimada
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/NivelSocioeconomico', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'NivelSocioeconomico',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/NivelSocioeconomico',
        params: { CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

directdata.get('/NivelSocioeconomico/Crypt', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'NivelSocioeconomico/Crypt',
      tipo_param: 'query',
      param: c.req.query('query') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/NivelSocioeconomico/Crypt',
        params: { query: c.req.query('query') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: OFAC - Sanctions List (SND and Non-SDN)
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/OFAC', async (c) => {
  return handleOp(
    c,
    { gateway: GW, fonte: 'OFAC', tipo_param: 'nome', param: c.req.query('NOME') ?? 'null' },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/OFAC',
        params: { NOME: c.req.query('NOME') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: PEP - Pessoa Exposta Politicamente
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/PessoaExpostaPoliticamente', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'PessoaExpostaPoliticamente',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/PessoaExpostaPoliticamente',
        params: { CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: PEP Estendida - Pessoa Exposta Politicamente + Parentescos
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/PEPParentescos', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'PEPParentescos',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/PEPParentescos',
        params: { CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: PETI -  Programa de Erradicação do Trabalho Infantil
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/PETITrabalhoInfantil', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'PETITrabalhoInfantil',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/PETITrabalhoInfantil',
        params: { CPF: c.req.query('CPF') ?? undefined, NIS: c.req.query('NIS') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: PGFN - Lista de Devedores da União
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/PGFNListaDevedoresUniao', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'PGFNListaDevedoresUniao',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/PGFNListaDevedoresUniao',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Polícia Civil - Antecedentes Criminais
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/PoliciaCivilAntecedentesCriminais', async (c) => {
  const uf_val = c.req.query('UF');
  if (!uf_val) return c.json({ error: 'Parâmetro UF obrigatório' }, 400);
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'PoliciaCivilAntecedentesCriminais',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/PoliciaCivilAntecedentesCriminais',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          RG: c.req.query('RG') ?? undefined,
          NOMEMAE: c.req.query('NOMEMAE') ?? undefined,
          NOME: c.req.query('NOME') ?? undefined,
          DATANASCIMENTO: c.req.query('DATANASCIMENTO') ?? undefined,
          GENERO: c.req.query('GENERO') ?? undefined,
          UF: c.req.query('UF') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Polícia Federal - Antecedentes Criminais
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/PoliciaFederalAntecedentesCriminais', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'PoliciaFederalAntecedentesCriminais',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/PoliciaFederalAntecedentesCriminais',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          NOME: c.req.query('NOME') ?? undefined,
          DATANASCIMENTO: c.req.query('DATANASCIMENTO') ?? undefined,
          NOMEMAE: c.req.query('NOMEMAE') ?? undefined,
          NOMEPAI: c.req.query('NOMEPAI') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Polícia Rodoviária Federal - Infrações
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/PRFInfracoes', async (c) => {
  const placa_val = c.req.query('PLACA');
  if (!placa_val) return c.json({ error: 'Parâmetro PLACA obrigatório' }, 400);
  const renavam_val = c.req.query('RENAVAM');
  if (!renavam_val) return c.json({ error: 'Parâmetro RENAVAM obrigatório' }, 400);
  const tipo_val = c.req.query('TIPO');
  if (!tipo_val) return c.json({ error: 'Parâmetro TIPO obrigatório' }, 400);
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'PRFInfracoes',
      tipo_param: 'placa',
      param: c.req.query('PLACA') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/PRFInfracoes',
        params: {
          PLACA: c.req.query('PLACA') ?? undefined,
          RENAVAM: c.req.query('RENAVAM') ?? undefined,
          TIPO: c.req.query('TIPO') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Processos Judiciais - Agrupada (Base)
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/ProcessosJudiciaisAgrupada', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'ProcessosJudiciaisAgrupada',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/ProcessosJudiciaisAgrupada',
        params: { CPF: c.req.query('CPF') ?? undefined, CNPJ: c.req.query('CNPJ') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Processos Judiciais - Completa (Base)
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/ProcessosJudiciaisCompleta', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'ProcessosJudiciaisCompleta',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/ProcessosJudiciaisCompleta',
        params: { CPF: c.req.query('CPF') ?? undefined, CNPJ: c.req.query('CNPJ') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Processos Judiciais - Simplificada (Base)
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/ProcessosJudiciaisSimplificada', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'ProcessosJudiciaisSimplificada',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/ProcessosJudiciaisSimplificada',
        params: { CPF: c.req.query('CPF') ?? undefined, CNPJ: c.req.query('CNPJ') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Protestos - SP
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/ProtestosSP', async (c) => {
  return handleOp(
    c,
    { gateway: GW, fonte: 'ProtestosSP', tipo_param: 'cnpj', param: c.req.query('CNPJ') ?? 'null' },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/ProtestosSP',
        params: { CNPJ: c.req.query('CNPJ') ?? undefined, CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Protestos Nacional - IEPTB Online
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/ProtestosOnline', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'ProtestosOnline',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/ProtestosOnline',
        params: { CNPJ: c.req.query('CNPJ') ?? undefined, CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Receita Federal - Pessoa Física
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/ReceitaFederalPessoaFisica', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'ReceitaFederalPessoaFisica',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/ReceitaFederalPessoaFisica',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          DATANASCIMENTO: c.req.query('DATANASCIMENTO') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Receita Federal - Pessoa Jurídica
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/ReceitaFederalPessoaJuridica', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'ReceitaFederalPessoaJuridica',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/ReceitaFederalPessoaJuridica',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          QSA: c.req.query('QSA') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Receita Federal - Pessoa Jurídica - QSA + Participação Societária
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/ReceitaPJParticipacaoSocietaria', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'ReceitaPJParticipacaoSocietaria',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/ReceitaPJParticipacaoSocietaria',
        params: { CNPJ: c.req.query('CNPJ') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Registration Data - Argentina
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/RegistrationDataArgentina', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'RegistrationDataArgentina',
      tipo_param: 'dni',
      param: c.req.query('DNI') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/RegistrationDataArgentina',
        params: { DNI: c.req.query('DNI') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Registration Data - Brazil
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/RegistrationDataBrazil', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'RegistrationDataBrazil',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/RegistrationDataBrazil',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          NAME: c.req.query('NAME') ?? undefined,
          SURNAME: c.req.query('SURNAME') ?? undefined,
          DOB: c.req.query('DOB') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Registration Data - México
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/RegistrationDataMexico', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'RegistrationDataMexico',
      tipo_param: 'curp',
      param: c.req.query('CURP') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/RegistrationDataMexico',
        params: { CURP: c.req.query('CURP') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Registro Nacional de Población - CURP - México
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/RenapoMexico', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'RenapoMexico',
      tipo_param: 'curp',
      param: c.req.query('CURP') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/RenapoMexico',
        params: {
          CURP: c.req.query('CURP') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Restituição Imposto de Renda - IRPF
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/RestituicaoIRPF', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'RestituicaoIRPF',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/RestituicaoIRPF',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          DATANASCIMENTO: c.req.query('DATANASCIMENTO') ?? undefined,
          ANOEXERCICIO: c.req.query('ANOEXERCICIO') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: SCR Analítico - Resumo BACEN
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/SCRBacen', async (c) => {
  return handleOp(
    c,
    { gateway: GW, fonte: 'SCRBacen', tipo_param: 'cnpj', param: c.req.query('CNPJ') ?? 'null' },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/SCRBacen',
        params: { CNPJ: c.req.query('CNPJ') ?? undefined, CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: SCR Detalhada - Resumo BACEN
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/SCRBacenDetalhada', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'SCRBacenDetalhada',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/SCRBacenDetalhada',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          CPF: c.req.query('CPF') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Score de Crédito - QUOD
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/Score', async (c) => {
  return handleOp(
    c,
    { gateway: GW, fonte: 'Score', tipo_param: 'cpf', param: c.req.query('CPF') ?? 'null' },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/Score',
        params: { CPF: c.req.query('CPF') ?? undefined, CNPJ: c.req.query('CNPJ') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Seguro Defeso
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/SeguroDefeso', async (c) => {
  return handleOp(
    c,
    { gateway: GW, fonte: 'SeguroDefeso', tipo_param: 'cpf', param: c.req.query('CPF') ?? 'null' },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/SeguroDefeso',
        params: { CPF: c.req.query('CPF') ?? undefined, NIS: c.req.query('NIS') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Similarity - Argentina
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/SimilarityArgentina', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'SimilarityArgentina',
      tipo_param: 'dni',
      param: c.req.query('DNI') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/SimilarityArgentina',
        params: {
          DNI: c.req.query('DNI') ?? undefined,
          NAME: c.req.query('NAME') ?? undefined,
          SURNAME: c.req.query('SURNAME') ?? undefined,
          DOB: c.req.query('DOB') ?? undefined,
          ADDRESS: c.req.query('ADDRESS') ?? undefined,
          CITY: c.req.query('CITY') ?? undefined,
          STATE: c.req.query('STATE') ?? undefined,
          POSTCODE: c.req.query('POSTCODE') ?? undefined,
          PHONE: c.req.query('PHONE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Similarity - Brazil
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/Similarity', async (c) => {
  return handleOp(
    c,
    { gateway: GW, fonte: 'Similarity', tipo_param: 'cpf', param: c.req.query('CPF') ?? 'null' },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/Similarity',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          NAME: c.req.query('NAME') ?? undefined,
          SURNAME: c.req.query('SURNAME') ?? undefined,
          DOB: c.req.query('DOB') ?? undefined,
          ADDRESS: c.req.query('ADDRESS') ?? undefined,
          CITY: c.req.query('CITY') ?? undefined,
          STATE: c.req.query('STATE') ?? undefined,
          POSTCODE: c.req.query('POSTCODE') ?? undefined,
          PHONE: c.req.query('PHONE') ?? undefined,
        },
      }),
  );
});

directdata.get('/Similarity/Crypt', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'Similarity/Crypt',
      tipo_param: 'query',
      param: c.req.query('query') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/Similarity/Crypt',
        params: { query: c.req.query('query') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Similarity - México
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/SimilarityMexico', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'SimilarityMexico',
      tipo_param: 'curp',
      param: c.req.query('CURP') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/SimilarityMexico',
        params: {
          CURP: c.req.query('CURP') ?? undefined,
          NAME: c.req.query('NAME') ?? undefined,
          SURNAME: c.req.query('SURNAME') ?? undefined,
          DOB: c.req.query('DOB') ?? undefined,
          ADDRESS: c.req.query('ADDRESS') ?? undefined,
          CITY: c.req.query('CITY') ?? undefined,
          STATE: c.req.query('STATE') ?? undefined,
          POSTCODE: c.req.query('POSTCODE') ?? undefined,
          PHONE: c.req.query('PHONE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Simples Nacional
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/SimplesNacional', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'SimplesNacional',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/SimplesNacional',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Sintegra - Cadastro Centralizado de Contribuinte - CCC
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/SintegraCCC', async (c) => {
  const uf_val = c.req.query('UF');
  if (!uf_val) return c.json({ error: 'Parâmetro UF obrigatório' }, 400);
  return handleOp(
    c,
    { gateway: GW, fonte: 'SintegraCCC', tipo_param: 'cnpj', param: c.req.query('CNPJ') ?? 'null' },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/SintegraCCC',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          IE: c.req.query('IE') ?? undefined,
          CPF: c.req.query('CPF') ?? undefined,
          UF: c.req.query('UF') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Sintegra - Cadastros Estaduais
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/Sintegra', async (c) => {
  const uf_val = c.req.query('UF');
  if (!uf_val) return c.json({ error: 'Parâmetro UF obrigatório' }, 400);
  return handleOp(
    c,
    { gateway: GW, fonte: 'Sintegra', tipo_param: 'cnpj', param: c.req.query('CNPJ') ?? 'null' },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/Sintegra',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          IE: c.req.query('IE') ?? undefined,
          CPF: c.req.query('CPF') ?? undefined,
          UF: c.req.query('UF') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Suframa - CNPJ
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/SuframaCNPJ', async (c) => {
  return handleOp(
    c,
    { gateway: GW, fonte: 'SuframaCNPJ', tipo_param: 'cnpj', param: c.req.query('CNPJ') ?? 'null' },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/SuframaCNPJ',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: TCU - Certidão Negativa de Licitante Inidôneo
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/TCUCertidaoNegativaLicitanteInidoneo', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'TCUCertidaoNegativaLicitanteInidoneo',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/TCUCertidaoNegativaLicitanteInidoneo',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: TCU - Certidão Negativa de Processo
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/TCUCertidaoNegativaProcesso', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'TCUCertidaoNegativaProcesso',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/TCUCertidaoNegativaProcesso',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: TCU - Consulta Consolidada de Pessoa Jurídica - APF
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/TCUConsultaConsolidadaPessoaJuridica', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'TCUConsultaConsolidadaPessoaJuridica',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/TCUConsultaConsolidadaPessoaJuridica',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: TJ - Certidão Cível, Criminal e Fiscal - Tribunal de Justiça
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/TJCertidaoCivelCriminalFiscal', async (c) => {
  const uf_val = c.req.query('UF');
  if (!uf_val) return c.json({ error: 'Parâmetro UF obrigatório' }, 400);
  const tipo_val = c.req.query('TIPO');
  if (!tipo_val) return c.json({ error: 'Parâmetro TIPO obrigatório' }, 400);
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'TJCertidaoCivelCriminalFiscal',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/TJCertidaoCivelCriminalFiscal',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          CNPJ: c.req.query('CNPJ') ?? undefined,
          NOME: c.req.query('NOME') ?? undefined,
          DATANASCIMENTO: c.req.query('DATANASCIMENTO') ?? undefined,
          NOMEMAE: c.req.query('NOMEMAE') ?? undefined,
          NOMEPAI: c.req.query('NOMEPAI') ?? undefined,
          RG: c.req.query('RG') ?? undefined,
          GENERO: c.req.query('GENERO') ?? undefined,
          UF: c.req.query('UF') ?? undefined,
          TIPO: c.req.query('TIPO') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: TJ - Tribunal de Justiça - Processos
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/TribunalJustica', async (c) => {
  const uf_val = c.req.query('UF');
  if (!uf_val) return c.json({ error: 'Parâmetro UF obrigatório' }, 400);
  const grau_val = c.req.query('GRAU');
  if (!grau_val) return c.json({ error: 'Parâmetro GRAU obrigatório' }, 400);
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'TribunalJustica',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/TribunalJustica',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          CNPJ: c.req.query('CNPJ') ?? undefined,
          NOMEPARTE: c.req.query('NOMEPARTE') ?? undefined,
          NUMEROPROCESSO: c.req.query('NUMEROPROCESSO') ?? undefined,
          UF: c.req.query('UF') ?? undefined,
          GRAU: c.req.query('GRAU') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: TRF - Tribunal Regional Federal (Certidão Cível, Eleitoral ou Criminal)
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/TribunalRegionalFederal', async (c) => {
  const regiao_val = c.req.query('REGIAO');
  if (!regiao_val) return c.json({ error: 'Parâmetro REGIAO obrigatório' }, 400);
  const tipo_val = c.req.query('TIPO');
  if (!tipo_val) return c.json({ error: 'Parâmetro TIPO obrigatório' }, 400);
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'TribunalRegionalFederal',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/TribunalRegionalFederal',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          CPF: c.req.query('CPF') ?? undefined,
          REGIAO: c.req.query('REGIAO') ?? undefined,
          TIPO: c.req.query('TIPO') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: TRT - Tribunal Regional do Trabalho
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/TribunalRegionalTrabalho', async (c) => {
  const regiao_val = c.req.query('REGIAO');
  if (!regiao_val) return c.json({ error: 'Parâmetro REGIAO obrigatório' }, 400);
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'TribunalRegionalTrabalho',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/TribunalRegionalTrabalho',
        params: {
          CNPJ: c.req.query('CNPJ') ?? undefined,
          CPF: c.req.query('CPF') ?? undefined,
          REGIAO: c.req.query('REGIAO') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: TSE - Certidão de Quitação Eleitoral
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/TSECertidaodeQuitacaoEleitoral', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'TSECertidaodeQuitacaoEleitoral',
      tipo_param: 'nome',
      param: c.req.query('NOME') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/TSECertidaodeQuitacaoEleitoral',
        params: {
          NOME: c.req.query('NOME') ?? undefined,
          CPF: c.req.query('CPF') ?? undefined,
          NOMEMAE: c.req.query('NOMEMAE') ?? undefined,
          NOMEPAI: c.req.query('NOMEPAI') ?? undefined,
          NUMEROTITULOELEITORAL: c.req.query('NUMEROTITULOELEITORAL') ?? undefined,
          DATANASCIMENTO: c.req.query('DATANASCIMENTO') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: TSE - Situação Eleitoral
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/SituacaoEleitoral', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'SituacaoEleitoral',
      tipo_param: 'nome',
      param: c.req.query('NOME') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/SituacaoEleitoral',
        params: {
          NOME: c.req.query('NOME') ?? undefined,
          CPF: c.req.query('CPF') ?? undefined,
          NUMEROTITULOELEITORAL: c.req.query('NUMEROTITULOELEITORAL') ?? undefined,
          DATANASCIMENTO: c.req.query('DATANASCIMENTO') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: TSE - Título e Local de Votação
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/TituloLocalVotacao', async (c) => {
  const datanascimento_val = c.req.query('DATANASCIMENTO');
  if (!datanascimento_val) return c.json({ error: 'Parâmetro DATANASCIMENTO obrigatório' }, 400);
  const nomemae_val = c.req.query('NOMEMAE');
  if (!nomemae_val) return c.json({ error: 'Parâmetro NOMEMAE obrigatório' }, 400);
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'TituloLocalVotacao',
      tipo_param: 'nome',
      param: c.req.query('NOME') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/TituloLocalVotacao',
        params: {
          NOME: c.req.query('NOME') ?? undefined,
          CPF: c.req.query('CPF') ?? undefined,
          NUMEROTITULOELEITORAL: c.req.query('NUMEROTITULOELEITORAL') ?? undefined,
          DATANASCIMENTO: c.req.query('DATANASCIMENTO') ?? undefined,
          NOMEMAE: c.req.query('NOMEMAE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: TST - Certidão Negativa de Débitos Trabalhistas
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/TSTCertidaoNegativaDebitosTrabalhistas', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'TSTCertidaoNegativaDebitosTrabalhistas',
      tipo_param: 'cpf',
      param: c.req.query('CPF') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/TSTCertidaoNegativaDebitosTrabalhistas',
        params: {
          CPF: c.req.query('CPF') ?? undefined,
          CNPJ: c.req.query('CNPJ') ?? undefined,
          GERARCOMPROVANTE: c.req.query('GERARCOMPROVANTE') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: UK Hm Treasury - Financial Sanctions
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/UKHmTreasury', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'UKHmTreasury',
      tipo_param: 'nome',
      param: c.req.query('NOME') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/UKHmTreasury',
        params: { NOME: c.req.query('NOME') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: UNSCCL - United Nations Security Council Consolidated List
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/UnitedNationsSecurityList', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'UnitedNationsSecurityList',
      tipo_param: 'nome',
      param: c.req.query('NOME') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/UnitedNationsSecurityList',
        params: { NOME: c.req.query('NOME') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Verificação de Empregador - Trabalho Forçado
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/VerificacaoEmpregadorTrabalhoForcado', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'VerificacaoEmpregadorTrabalhoForcado',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/VerificacaoEmpregadorTrabalhoForcado',
        params: { CNPJ: c.req.query('CNPJ') ?? undefined, CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Veículos - FIPE
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/ConsultaVeicularFipe', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'ConsultaVeicularFipe',
      tipo_param: 'placa',
      param: c.req.query('PLACA') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/ConsultaVeicularFipe',
        params: {
          PLACA: c.req.query('PLACA') ?? undefined,
          CHASSI: c.req.query('CHASSI') ?? undefined,
        },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Vínculo Empregatício
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/VinculoEmpregaticio', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'VinculoEmpregaticio',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/VinculoEmpregaticio',
        params: { CNPJ: c.req.query('CNPJ') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Vínculos Societários
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/VinculosSocietarios', async (c) => {
  return handleOp(
    c,
    {
      gateway: GW,
      fonte: 'VinculosSocietarios',
      tipo_param: 'cnpj',
      param: c.req.query('CNPJ') ?? 'null',
    },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/VinculosSocietarios',
        params: { CNPJ: c.req.query('CNPJ') ?? undefined, CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: Óbito
// ══════════════════════════════════════════════════════════════════════════════════

directdata.get('/Obito', async (c) => {
  return handleOp(
    c,
    { gateway: GW, fonte: 'Obito', tipo_param: 'cpf', param: c.req.query('CPF') ?? 'null' },
    () =>
      new ConsultarDirectData(buildHttp()).execute({
        path: '/api/Obito',
        params: { CPF: c.req.query('CPF') ?? undefined },
      }),
  );
});

export { directdata };
