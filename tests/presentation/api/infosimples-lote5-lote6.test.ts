/**
 * @fileoverview Testes e2e — Infosimples / Social + Imóveis/Rural (Lotes 5 e 6)
 * Cobre todos os 25 endpoints dos lotes 5 e 6.
 * 3 casos por endpoint: sucesso, sucesso-sem-resultado (603), falha upstream.
 * Endpoints com required recebem caso 400 adicional.
 * @module tests/presentation/api/infosimples-lote5-lote6.test
 */

import { rawStore } from '../../../src/infrastructure/persistence/index';
import { app } from '../../../src/presentation/api/app';

// Mockar registry para que as novas operations sejam resolvidas
// sem modificar o registry.ts de produção.
jest.mock('../../../src/infrastructure/providers/infosimples/operations/registry', () => {
  const { CaixaRegularidade } = require('../../../src/infrastructure/providers/infosimples/operations/CaixaRegularidade');
  const { FgtsGuia } = require('../../../src/infrastructure/providers/infosimples/operations/FgtsGuia');
  const { FgtsGuiaRapida } = require('../../../src/infrastructure/providers/infosimples/operations/FgtsGuiaRapida');
  const { DataprevFap } = require('../../../src/infrastructure/providers/infosimples/operations/DataprevFap');
  const { DataprevQualificacao } = require('../../../src/infrastructure/providers/infosimples/operations/DataprevQualificacao');
  const { CnisPreInscricao } = require('../../../src/infrastructure/providers/infosimples/operations/CnisPreInscricao');
  const { FazendaSped } = require('../../../src/infrastructure/providers/infosimples/operations/FazendaSped');
  const { SitCaepi } = require('../../../src/infrastructure/providers/infosimples/operations/SitCaepi');
  const { SitTrabalhoEscravo } = require('../../../src/infrastructure/providers/infosimples/operations/SitTrabalhoEscravo');
  const { CarDemonstrativo } = require('../../../src/infrastructure/providers/infosimples/operations/CarDemonstrativo');
  const { CarDemonstrativoPdf } = require('../../../src/infrastructure/providers/infosimples/operations/CarDemonstrativoPdf');
  const { CarDownloadShapefile } = require('../../../src/infrastructure/providers/infosimples/operations/CarDownloadShapefile');
  const { CarImovel } = require('../../../src/infrastructure/providers/infosimples/operations/CarImovel');
  const { IncraCoordenadas } = require('../../../src/infrastructure/providers/infosimples/operations/IncraCoordenadas');
  const { IncraSigefDetalhesParcela } = require('../../../src/infrastructure/providers/infosimples/operations/IncraSigefDetalhesParcela');
  const { IncraSigefParcelas } = require('../../../src/infrastructure/providers/infosimples/operations/IncraSigefParcelas');
  const { IncraSigefRequerimentos } = require('../../../src/infrastructure/providers/infosimples/operations/IncraSigefRequerimentos');
  const { SncrCcir } = require('../../../src/infrastructure/providers/infosimples/operations/SncrCcir');
  const { SncrImoveis } = require('../../../src/infrastructure/providers/infosimples/operations/SncrImoveis');
  const { OnrMapaRegistroImoveis } = require('../../../src/infrastructure/providers/infosimples/operations/OnrMapaRegistroImoveis');
  const { IbamaAutuacoes } = require('../../../src/infrastructure/providers/infosimples/operations/IbamaAutuacoes');
  const { IbamaCertidaoDebitos } = require('../../../src/infrastructure/providers/infosimples/operations/IbamaCertidaoDebitos');
  const { IbamaCertidaoEmbargos } = require('../../../src/infrastructure/providers/infosimples/operations/IbamaCertidaoEmbargos');
  const { IbamaCertificadoRegularidade } = require('../../../src/infrastructure/providers/infosimples/operations/IbamaCertificadoRegularidade');
  const { DiarioOficialSpValorVenal } = require('../../../src/infrastructure/providers/infosimples/operations/DiarioOficialSpValorVenal');
  // Original operations
  const { CadastroPessoaFisica } = require('../../../src/infrastructure/providers/infosimples/operations/CadastroPessoaFisica');
  const { CadastroPessoaJuridica } = require('../../../src/infrastructure/providers/infosimples/operations/CadastroPessoaJuridica');
  const { CenprotSpProtestos } = require('../../../src/infrastructure/providers/infosimples/operations/CenprotSpProtestos');
  const { IeptbProtestos } = require('../../../src/infrastructure/providers/infosimples/operations/IeptbProtestos');
  const { IeptbProtestosDetalhes } = require('../../../src/infrastructure/providers/infosimples/operations/IeptbProtestosDetalhes');

  const registry: Record<string, (http: unknown) => unknown> = {
    // Original
    'consultas/receita-federal/cpf': (http) => new CadastroPessoaFisica(http),
    'consultas/receita-federal/cnpj': (http) => new CadastroPessoaJuridica(http),
    'consultas/cenprot-sp/protestos': (http) => new CenprotSpProtestos(http),
    'consultas/ieptb/protestos': (http) => new IeptbProtestos(http),
    'consultas/ieptb/protestos/detalhes-sp': (http) => new IeptbProtestosDetalhes(http),
    cpf: (http) => new CadastroPessoaFisica(http),
    cnpj: (http) => new CadastroPessoaJuridica(http),
    // Lote 5
    'consultas/caixa/regularidade': (http) => new CaixaRegularidade(http),
    'consultas/fgts/guia': (http) => new FgtsGuia(http),
    'consultas/fgts/guia-rapida': (http) => new FgtsGuiaRapida(http),
    'consultas/dataprev/fap': (http) => new DataprevFap(http),
    'consultas/dataprev/qualificacao': (http) => new DataprevQualificacao(http),
    'consultas/cnis/pre-inscricao': (http) => new CnisPreInscricao(http),
    'consultas/fazenda/sped': (http) => new FazendaSped(http),
    'consultas/sit/caepi': (http) => new SitCaepi(http),
    'consultas/sit/trabalho-escravo': (http) => new SitTrabalhoEscravo(http),
    // Lote 6
    'consultas/car/demonstrativo': (http) => new CarDemonstrativo(http),
    'consultas/car/demonstrativo-pdf': (http) => new CarDemonstrativoPdf(http),
    'consultas/car/download-shapefile': (http) => new CarDownloadShapefile(http),
    'consultas/car/imovel': (http) => new CarImovel(http),
    'consultas/incra/coordenadas': (http) => new IncraCoordenadas(http),
    'consultas/incra/sigef/detalhes-parcela': (http) => new IncraSigefDetalhesParcela(http),
    'consultas/incra/sigef/parcelas': (http) => new IncraSigefParcelas(http),
    'consultas/incra/sigef/requerimentos': (http) => new IncraSigefRequerimentos(http),
    'consultas/sncr/ccir': (http) => new SncrCcir(http),
    'consultas/sncr/imoveis': (http) => new SncrImoveis(http),
    'consultas/onr/mapa-registro-imoveis': (http) => new OnrMapaRegistroImoveis(http),
    'consultas/ibama/autuacoes': (http) => new IbamaAutuacoes(http),
    'consultas/ibama/certidao-debitos': (http) => new IbamaCertidaoDebitos(http),
    'consultas/ibama/certidao-embargos': (http) => new IbamaCertidaoEmbargos(http),
    'consultas/ibama/certificado-regularidade': (http) => new IbamaCertificadoRegularidade(http),
    'consultas/diario-oficial/sp/valor-venal': (http) => new DiarioOficialSpValorVenal(http),
  };

  return {
    resolveOperation: (key: string, http: unknown) => {
      const factory = registry[key.toLowerCase()];
      if (!factory) throw new Error(`Operação Infosimples desconhecida: ${key}`);
      return factory(http);
    },
    listSupportedOperations: () => Object.keys(registry),
  };
});

// Mockar validation-map para incluir os novos required params
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

  const noResult = envelope({ code: 603, code_message: 'Dados não encontrados' });

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
          JSON.stringify(envelope({
            data_count: 1,
            data: [{ cnpj: '33200056000149', razao_social: 'Empresa Teste', situacao: 'Regular' }],
          })),
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
      const body = (await res.json()) as Record<string, unknown>;
      expect(body.data_count).toBe(1);
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

    it('sucesso — retorna 200 com lista de trabalho escravo', async () => {
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
      const res = await app.request(`${PATH}?codigo_imovel=12345&uf_sede=SP&municipio_sede=SãoPaulo`, { method: 'POST' });
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
      const res = await app.request(`${PATH}?codigo_imovel=12345&uf_sede=SP&municipio_sede=SãoPaulo`, { method: 'POST' });
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
      const res = await app.request(`${PATH}?uf=SP&municipio=SãoPaulo`, { method: 'POST' });
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
      const res = await app.request(`${PATH}?uf=SP&municipio=SãoPaulo`, { method: 'POST' });
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
