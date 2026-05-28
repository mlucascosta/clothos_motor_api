/**
 * @fileoverview Testes e2e — Infosimples / Social + Imóveis/Rural (Lotes 5 e 6)
 * Cobre todos os 25 endpoints dos lotes 5 e 6.
 * 3 casos por endpoint: sucesso, sucesso-sem-resultado (603), falha upstream.
 * Endpoints com required recebem caso 400 adicional.
 * @module tests/presentation/api/infosimples-lote5-lote6.test
 */

// ── Mocks são hoistados antes dos imports ──────────────────────────────────

// Mock do validation-map com os novos required params (só literais, sem require).
jest.mock('../../../src/infrastructure/providers/infosimples/operations/validation-map', () => ({
  infosimplesRequiredParams: {
    // Original
    'consultas/receita-federal/cpf': ['cpf'],
    'consultas/receita-federal/cnpj': ['cnpj'],
    'consultas/cenprot-sp/protestos': [{ oneOf: ['cpf', 'cnpj'] }],
    'consultas/ieptb/protestos': [{ oneOf: ['cpf', 'cnpj'] }],
    'consultas/ieptb/protestos/detalhes-sp': ['obter_detalhes'],
    cpf: ['cpf'],
    cnpj: ['cnpj'],
    // Lote 5 — com required
    'consultas/dataprev/fap': ['cnpj_estabelecimento'],
    'consultas/dataprev/qualificacao': ['nis', 'name', 'birthdate', 'cpf'],
    'consultas/cnis/pre-inscricao': ['cpf', 'nome', 'data_nascimento'],
    'consultas/sit/caepi': ['ca'],
    // Lote 6 — com required
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
  },
}));

// Mock do registry — usa require() das novas operations dentro do factory.
// O jest.mock factory roda no contexto de módulo isolado do jest, após transforms,
// então require() aqui funciona corretamente.
jest.mock('../../../src/infrastructure/providers/infosimples/operations/registry', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { CaixaRegularidade } = require('../../../src/infrastructure/providers/infosimples/operations/CaixaRegularidade');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { FgtsGuia } = require('../../../src/infrastructure/providers/infosimples/operations/FgtsGuia');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { FgtsGuiaRapida } = require('../../../src/infrastructure/providers/infosimples/operations/FgtsGuiaRapida');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { DataprevFap } = require('../../../src/infrastructure/providers/infosimples/operations/DataprevFap');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { DataprevQualificacao } = require('../../../src/infrastructure/providers/infosimples/operations/DataprevQualificacao');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { CnisPreInscricao } = require('../../../src/infrastructure/providers/infosimples/operations/CnisPreInscricao');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { FazendaSped } = require('../../../src/infrastructure/providers/infosimples/operations/FazendaSped');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { SitCaepi } = require('../../../src/infrastructure/providers/infosimples/operations/SitCaepi');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { SitTrabalhoEscravo } = require('../../../src/infrastructure/providers/infosimples/operations/SitTrabalhoEscravo');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { CarDemonstrativo } = require('../../../src/infrastructure/providers/infosimples/operations/CarDemonstrativo');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { CarDemonstrativoPdf } = require('../../../src/infrastructure/providers/infosimples/operations/CarDemonstrativoPdf');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { CarDownloadShapefile } = require('../../../src/infrastructure/providers/infosimples/operations/CarDownloadShapefile');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { CarImovel } = require('../../../src/infrastructure/providers/infosimples/operations/CarImovel');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { IncraCoordenadas } = require('../../../src/infrastructure/providers/infosimples/operations/IncraCoordenadas');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { IncraSigefDetalhesParcela } = require('../../../src/infrastructure/providers/infosimples/operations/IncraSigefDetalhesParcela');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { IncraSigefParcelas } = require('../../../src/infrastructure/providers/infosimples/operations/IncraSigefParcelas');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { IncraSigefRequerimentos } = require('../../../src/infrastructure/providers/infosimples/operations/IncraSigefRequerimentos');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { SncrCcir } = require('../../../src/infrastructure/providers/infosimples/operations/SncrCcir');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { SncrImoveis } = require('../../../src/infrastructure/providers/infosimples/operations/SncrImoveis');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { OnrMapaRegistroImoveis } = require('../../../src/infrastructure/providers/infosimples/operations/OnrMapaRegistroImoveis');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { IbamaAutuacoes } = require('../../../src/infrastructure/providers/infosimples/operations/IbamaAutuacoes');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { IbamaCertidaoDebitos } = require('../../../src/infrastructure/providers/infosimples/operations/IbamaCertidaoDebitos');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { IbamaCertidaoEmbargos } = require('../../../src/infrastructure/providers/infosimples/operations/IbamaCertidaoEmbargos');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { IbamaCertificadoRegularidade } = require('../../../src/infrastructure/providers/infosimples/operations/IbamaCertificadoRegularidade');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { DiarioOficialSpValorVenal } = require('../../../src/infrastructure/providers/infosimples/operations/DiarioOficialSpValorVenal');
  // Original operations
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { CadastroPessoaFisica } = require('../../../src/infrastructure/providers/infosimples/operations/CadastroPessoaFisica');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { CadastroPessoaJuridica } = require('../../../src/infrastructure/providers/infosimples/operations/CadastroPessoaJuridica');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { CenprotSpProtestos } = require('../../../src/infrastructure/providers/infosimples/operations/CenprotSpProtestos');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { IeptbProtestos } = require('../../../src/infrastructure/providers/infosimples/operations/IeptbProtestos');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { IeptbProtestosDetalhes } = require('../../../src/infrastructure/providers/infosimples/operations/IeptbProtestosDetalhes');

  const reg: Record<string, (http: unknown) => unknown> = {
    'consultas/receita-federal/cpf': (h) => new CadastroPessoaFisica(h),
    'consultas/receita-federal/cnpj': (h) => new CadastroPessoaJuridica(h),
    'consultas/cenprot-sp/protestos': (h) => new CenprotSpProtestos(h),
    'consultas/ieptb/protestos': (h) => new IeptbProtestos(h),
    'consultas/ieptb/protestos/detalhes-sp': (h) => new IeptbProtestosDetalhes(h),
    cpf: (h) => new CadastroPessoaFisica(h),
    cnpj: (h) => new CadastroPessoaJuridica(h),
    // Lote 5
    'consultas/caixa/regularidade': (h) => new CaixaRegularidade(h),
    'consultas/fgts/guia': (h) => new FgtsGuia(h),
    'consultas/fgts/guia-rapida': (h) => new FgtsGuiaRapida(h),
    'consultas/dataprev/fap': (h) => new DataprevFap(h),
    'consultas/dataprev/qualificacao': (h) => new DataprevQualificacao(h),
    'consultas/cnis/pre-inscricao': (h) => new CnisPreInscricao(h),
    'consultas/fazenda/sped': (h) => new FazendaSped(h),
    'consultas/sit/caepi': (h) => new SitCaepi(h),
    'consultas/sit/trabalho-escravo': (h) => new SitTrabalhoEscravo(h),
    // Lote 6
    'consultas/car/demonstrativo': (h) => new CarDemonstrativo(h),
    'consultas/car/demonstrativo-pdf': (h) => new CarDemonstrativoPdf(h),
    'consultas/car/download-shapefile': (h) => new CarDownloadShapefile(h),
    'consultas/car/imovel': (h) => new CarImovel(h),
    'consultas/incra/coordenadas': (h) => new IncraCoordenadas(h),
    'consultas/incra/sigef/detalhes-parcela': (h) => new IncraSigefDetalhesParcela(h),
    'consultas/incra/sigef/parcelas': (h) => new IncraSigefParcelas(h),
    'consultas/incra/sigef/requerimentos': (h) => new IncraSigefRequerimentos(h),
    'consultas/sncr/ccir': (h) => new SncrCcir(h),
    'consultas/sncr/imoveis': (h) => new SncrImoveis(h),
    'consultas/onr/mapa-registro-imoveis': (h) => new OnrMapaRegistroImoveis(h),
    'consultas/ibama/autuacoes': (h) => new IbamaAutuacoes(h),
    'consultas/ibama/certidao-debitos': (h) => new IbamaCertidaoDebitos(h),
    'consultas/ibama/certidao-embargos': (h) => new IbamaCertidaoEmbargos(h),
    'consultas/ibama/certificado-regularidade': (h) => new IbamaCertificadoRegularidade(h),
    'consultas/diario-oficial/sp/valor-venal': (h) => new DiarioOficialSpValorVenal(h),
  };

  return {
    resolveOperation: (key: string, http: unknown) => {
      const factory = reg[key.toLowerCase()];
      if (!factory) throw new Error(`Operação Infosimples desconhecida: ${key}`);
      return factory(http);
    },
    listSupportedOperations: () => Object.keys(reg),
  };
});

// ── Imports normais (após mocks) ──────────────────────────────────────────

import { rawStore } from '../../../src/infrastructure/persistence/index';
import { app } from '../../../src/presentation/api/app';

// ── Suite de testes ───────────────────────────────────────────────────────

describe('POST /api/infosimples — Social + Imóveis/Rural', () => {
  let saveSpy: jest.SpyInstance;
  let fetchSpy: jest.SpyInstance;

  const envelope = (overrides: object) => ({
    code: 0,
    code_message: 'OK',
    header: { api_version: '2', billable: true, price: 0.5, elapsed_time_in_milliseconds: 800 },
    data_count: 0,
    data: null,
    errors: [],
    ...overrides,
  });

  const noResult = {
    code: 603,
    code_message: 'Dados não encontrados',
    header: { api_version: '2', billable: true, price: 0.5 },
    data_count: 0,
    data: null,
    errors: [],
  };

  beforeEach(() => {
    process.env.INFOSIMPLES_TOKEN = 'test-token';
    saveSpy = jest.spyOn(rawStore, 'save').mockImplementation(() => {});
    fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(envelope({})), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  afterEach(() => {
    saveSpy.mockRestore();
    fetchSpy.mockRestore();
    jest.clearAllMocks();
  });

  // ──────────────────────────────────────────────
  // LOTE 5 — SOCIAL
  // ──────────────────────────────────────────────

  // ── consultas/caixa/regularidade ──
  describe('consultas/caixa/regularidade', () => {
    const PATH = '/api/infosimples/consultas/caixa/regularidade';

    it('sucesso — retorna 200 com dados de regularidade', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ cnpj: '33200056000149', razao_social: 'Empresa Teste', situacao: 'Regular' }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });
      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(0);
      expect(body.data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ gateway: 'infosimples', fonte: 'consultas/caixa/regularidade', status: 'success' }));
    });

    it('sucesso sem resultado — code 603, data null', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(`${PATH}?cnpj=00000000000000`, { method: 'POST' });
      expect(res.status).toBe(200);
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.code).toBe(603);
      expect(body.data).toBeNull();
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ gateway: 'infosimples', status: 'error' }));
    });
  });

  // ── consultas/fgts/guia ──
  describe('consultas/fgts/guia', () => {
    const PATH = '/api/infosimples/consultas/fgts/guia';

    it('sucesso — retorna 200 com guia FGTS', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ cnpj: '33200056000149', competencia: '2024-01', valor: 1500.0 }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect((await res.json() as Record<string, unknown>).data_count).toBe(1);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ gateway: 'infosimples', status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('connection refused'));
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });
  });

  // ── consultas/fgts/guia-rapida ──
  describe('consultas/fgts/guia-rapida', () => {
    const PATH = '/api/infosimples/consultas/fgts/guia-rapida';

    it('sucesso — retorna 200 com guia rápida FGTS', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ cnpj: '33200056000149', competencia: '2024-02', situacao: 'Pago' }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });
  });

  // ── consultas/dataprev/fap ──
  describe('consultas/dataprev/fap', () => {
    const PATH = '/api/infosimples/consultas/dataprev/fap';

    it('sucesso — retorna 200 com FAP', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ cnpj_estabelecimento: '33200056000149', fap: 1.2, resultado: 'Acima da média' }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?cnpj_estabelecimento=33200056000149`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(`${PATH}?cnpj_estabelecimento=00000000000000`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?cnpj_estabelecimento=33200056000149`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando cnpj_estabelecimento está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ── consultas/dataprev/qualificacao ──
  describe('consultas/dataprev/qualificacao', () => {
    const PATH = '/api/infosimples/consultas/dataprev/qualificacao';

    it('sucesso — retorna 200 com qualificação', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ nis: '12345678901', cpf: '11144477735', resultado: 'Qualificado' }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?nis=12345678901&name=João&birthdate=1990-01-01&cpf=11144477735`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(`${PATH}?nis=99999999999&name=Inexistente&birthdate=2000-01-01&cpf=99999999999`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?nis=12345678901&name=João&birthdate=1990-01-01&cpf=11144477735`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando parâmetros obrigatórios estão ausentes', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ── consultas/cnis/pre-inscricao ──
  describe('consultas/cnis/pre-inscricao', () => {
    const PATH = '/api/infosimples/consultas/cnis/pre-inscricao';

    it('sucesso — retorna 200 com pré-inscrição CNIS', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ cpf: '11144477735', nis: '12345678901', situacao: 'Ativo' }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?cpf=11144477735&nome=João+Silva&data_nascimento=1990-01-01`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(`${PATH}?cpf=99999999999&nome=Inexistente&data_nascimento=2000-01-01`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?cpf=11144477735&nome=João&data_nascimento=1990-01-01`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando parâmetros obrigatórios estão ausentes', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ── consultas/fazenda/sped ──
  describe('consultas/fazenda/sped', () => {
    const PATH = '/api/infosimples/consultas/fazenda/sped';

    it('sucesso — retorna 200 com SPED', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ cnpj: '33200056000149', situacao: 'Ativo' }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?cnpj=33200056000149`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });
  });

  // ── consultas/sit/caepi ──
  describe('consultas/sit/caepi', () => {
    const PATH = '/api/infosimples/consultas/sit/caepi';

    it('sucesso — retorna 200 com CAEPI', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ ca: '12345', equipamento: 'Capacete', situacao: 'Válido' }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?ca=12345`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(`${PATH}?ca=99999`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?ca=12345`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando ca está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ── consultas/sit/trabalho-escravo ──
  describe('consultas/sit/trabalho-escravo', () => {
    const PATH = '/api/infosimples/consultas/sit/trabalho-escravo';

    it('sucesso — retorna 200 com lista trabalho escravo', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ cpf: '11144477735', ano: '2023', trabalhadores_resgatados: 5 }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });
  });

  // ──────────────────────────────────────────────
  // LOTE 6 — IMÓVEIS / RURAL
  // ──────────────────────────────────────────────

  // ── consultas/car/demonstrativo ──
  describe('consultas/car/demonstrativo', () => {
    const PATH = '/api/infosimples/consultas/car/demonstrativo';

    it('sucesso — retorna 200 com demonstrativo CAR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ car: 'SP-3550308-A1B2C3D4', status: 'Ativo', area_total: 100.5 }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?car=SP-3550308-A1B2C3D4`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(`${PATH}?car=INVALIDO`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?car=SP-3550308-A1B2C3D4`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando car está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ── consultas/car/demonstrativo-pdf ──
  describe('consultas/car/demonstrativo-pdf', () => {
    const PATH = '/api/infosimples/consultas/car/demonstrativo-pdf';

    it('sucesso — retorna 200 com URL do PDF', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ car: 'SP-3550308-A1B2C3D4', url_pdf: 'https://example.com/file.pdf' }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?car=SP-3550308-A1B2C3D4`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(`${PATH}?car=INVALIDO`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?car=SP-3550308-A1B2C3D4`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando car está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ── consultas/car/download-shapefile ──
  describe('consultas/car/download-shapefile', () => {
    const PATH = '/api/infosimples/consultas/car/download-shapefile';

    it('sucesso — retorna 200 com URL do shapefile', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ car: 'SP-3550308-A1B2C3D4', url_shapefile: 'https://example.com/file.zip' }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?car=SP-3550308-A1B2C3D4`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(`${PATH}?car=INVALIDO`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?car=SP-3550308-A1B2C3D4`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando car está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ── consultas/car/imovel ──
  describe('consultas/car/imovel', () => {
    const PATH = '/api/infosimples/consultas/car/imovel';

    it('sucesso — retorna 200 com imóvel CAR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ car: 'SP-3550308-A1B2C3D4', tipo_imovel: 'Rural', area_total: 200.0 }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?car=SP-3550308-A1B2C3D4`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(`${PATH}?car=INVALIDO`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?car=SP-3550308-A1B2C3D4`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando car está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ── consultas/incra/coordenadas ──
  describe('consultas/incra/coordenadas', () => {
    const PATH = '/api/infosimples/consultas/incra/coordenadas';

    it('sucesso — retorna 200 com coordenadas INCRA', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ numero_certificacao: 'SP-1234567890', area: 50.0 }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?numero_certificacao=SP-1234567890`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(`${PATH}?numero_certificacao=INVALIDO`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?numero_certificacao=SP-1234567890`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando numero_certificacao está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ── consultas/incra/sigef/detalhes-parcela ──
  describe('consultas/incra/sigef/detalhes-parcela', () => {
    const PATH = '/api/infosimples/consultas/incra/sigef/detalhes-parcela';

    it('sucesso — retorna 200 com detalhes da parcela', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ codigo_parcela: 'ABC123', area: 75.5, situacao: 'Certificada' }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?codigo_parcela=ABC123`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(`${PATH}?codigo_parcela=INVALIDO`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?codigo_parcela=ABC123`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando codigo_parcela está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ── consultas/incra/sigef/parcelas ──
  describe('consultas/incra/sigef/parcelas', () => {
    const PATH = '/api/infosimples/consultas/incra/sigef/parcelas';

    it('sucesso — retorna 200 com parcelas SIGEF', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 2, data: [{ codigo_parcela: 'P001', area: 30.0 }, { codigo_parcela: 'P002', area: 45.0 }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });
  });

  // ── consultas/incra/sigef/requerimentos ──
  describe('consultas/incra/sigef/requerimentos', () => {
    const PATH = '/api/infosimples/consultas/incra/sigef/requerimentos';

    it('sucesso — retorna 200 com requerimentos SIGEF', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ numero_requerimento: 'REQ001', tipo: 'Certificação', situacao: 'Aprovado' }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });
  });

  // ── consultas/sncr/ccir ──
  describe('consultas/sncr/ccir', () => {
    const PATH = '/api/infosimples/consultas/sncr/ccir';

    it('sucesso — retorna 200 com CCIR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ codigo_imovel: '12345', denominacao: 'Fazenda Boa Vista', area_total: 500.0 }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?codigo_imovel=12345&uf_sede=SP&municipio_sede=SaoPaulo`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(`${PATH}?codigo_imovel=99999&uf_sede=SP&municipio_sede=Inexistente`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?codigo_imovel=12345&uf_sede=SP&municipio_sede=SaoPaulo`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando parâmetros obrigatórios estão ausentes', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ── consultas/sncr/imoveis ──
  describe('consultas/sncr/imoveis', () => {
    const PATH = '/api/infosimples/consultas/sncr/imoveis';

    it('sucesso — retorna 200 com imóveis SNCR', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ codigo_imovel: '12345', municipio: 'São Paulo', uf: 'SP' }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?uf=SP&municipio=SaoPaulo`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(`${PATH}?uf=ZZ&municipio=Inexistente`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?uf=SP&municipio=SaoPaulo`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando parâmetros obrigatórios estão ausentes', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ── consultas/onr/mapa-registro-imoveis ──
  describe('consultas/onr/mapa-registro-imoveis', () => {
    const PATH = '/api/infosimples/consultas/onr/mapa-registro-imoveis';

    it('sucesso — retorna 200 com mapa de registro de imóveis', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ camada: 'SP', municipio: 'São Paulo', cartorio: '1º RI SP' }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?camada=SP`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(`${PATH}?camada=ZZ`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?camada=SP`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando camada está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ── consultas/ibama/autuacoes ──
  describe('consultas/ibama/autuacoes', () => {
    const PATH = '/api/infosimples/consultas/ibama/autuacoes';

    it('sucesso — retorna 200 com autuações IBAMA', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ numero_auto: 'AUTO001', tipo_infracao: 'Desmatamento', valor_multa: 50000.0 }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?ano=2023`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(`${PATH}?ano=1800`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?ano=2023`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando ano está ausente', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  // ── consultas/ibama/certidao-debitos ──
  describe('consultas/ibama/certidao-debitos', () => {
    const PATH = '/api/infosimples/consultas/ibama/certidao-debitos';

    it('sucesso — retorna 200 com certidão de débitos IBAMA', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ cpf_cnpj: '11144477735', situacao: 'Negativa', data_emissao: '2024-01-01' }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });
  });

  // ── consultas/ibama/certidao-embargos ──
  describe('consultas/ibama/certidao-embargos', () => {
    const PATH = '/api/infosimples/consultas/ibama/certidao-embargos';

    it('sucesso — retorna 200 com certidão de embargos IBAMA', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ cpf_cnpj: '11144477735', situacao: 'Negativa', data_emissao: '2024-01-01' }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });
  });

  // ── consultas/ibama/certificado-regularidade ──
  describe('consultas/ibama/certificado-regularidade', () => {
    const PATH = '/api/infosimples/consultas/ibama/certificado-regularidade';

    it('sucesso — retorna 200 com certificado de regularidade IBAMA', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ cpf_cnpj: '11144477735', situacao: 'Regular', data_validade: '2025-01-01' }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?cpf=11144477735`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });
  });

  // ── consultas/diario-oficial/sp/valor-venal ──
  describe('consultas/diario-oficial/sp/valor-venal', () => {
    const PATH = '/api/infosimples/consultas/diario-oficial/sp/valor-venal';

    it('sucesso — retorna 200 com valor venal', async () => {
      fetchSpy.mockResolvedValueOnce(
        new Response(
          JSON.stringify(envelope({ data_count: 1, data: [{ codigo_ipva: 'ABC1234', ano_fabricacao: '2020', valor_venal: 85000.0 }] })),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      );
      const res = await app.request(`${PATH}?codigo_ipva=ABC1234&ano_fabricacao=2020`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'success' }));
    });

    it('sucesso sem resultado — code 603', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify(noResult), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      const res = await app.request(`${PATH}?codigo_ipva=XXX0000&ano_fabricacao=1900`, { method: 'POST' });
      expect(res.status).toBe(200);
      expect(((await res.json()) as Record<string, unknown>).code).toBe(603);
    });

    it('falha — upstream throw → 500', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('timeout'));
      const res = await app.request(`${PATH}?codigo_ipva=ABC1234&ano_fabricacao=2020`, { method: 'POST' });
      expect(res.status).toBe(500);
      expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({ status: 'error' }));
    });

    it('retorna 400 quando parâmetros obrigatórios estão ausentes', async () => {
      const res = await app.request(PATH, { method: 'POST' });
      expect(res.status).toBe(400);
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });
});
