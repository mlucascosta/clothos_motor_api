import type { JobProcessor } from '@application/jobs/JobWorker.js';
import { CircuitBreaker } from '@infrastructure/circuit-breaker/CircuitBreaker.js';
import { LaravelPiiResolver } from '@infrastructure/crypto/LaravelPiiResolver.js';
import { FinderJobRepository } from '@infrastructure/database/FinderJobRepository.js';
import { ApiBrasilCadastroPfExecutor } from '@infrastructure/providers/apibrasil/ApiBrasilCadastroPfExecutor.js';
import { ApiBrasilExecutor } from '@infrastructure/providers/apibrasil/ApiBrasilExecutor.js';
import { ApiBrasilHttpClient } from '@infrastructure/providers/apibrasil/ApiBrasilHttpClient.js';
import { ApiBrasilScoreQuodExecutor } from '@infrastructure/providers/apibrasil/ApiBrasilScoreQuodExecutor.js';
import { Cnpj as ApiBrasilCnpj } from '@infrastructure/providers/apibrasil/operations/Cnpj.js';
import { CpfDados as ApiBrasilCpfDados } from '@infrastructure/providers/apibrasil/operations/CpfDados.js';
import { ScoreCreditoQuod as ApiBrasilScoreCreditoQuod } from '@infrastructure/providers/apibrasil/operations/ScoreCreditoQuod.js';
import { BrasilApiExecutor } from '@infrastructure/providers/brasilapi/BrasilApiExecutor.js';
import { BrasilApiHttpClient } from '@infrastructure/providers/brasilapi/BrasilApiHttpClient.js';
import { Cnpj } from '@infrastructure/providers/brasilapi/operations/Cnpj.js';
import { DataJudExecutor } from '@infrastructure/providers/datajud/DataJudExecutor.js';
import { DataJudHttpClient } from '@infrastructure/providers/datajud/DataJudHttpClient.js';
import { BuscarProcessoPorNumero } from '@infrastructure/providers/datajud/operations/BuscarProcessoPorNumero.js';
import { DirectDataCnpjExecutor } from '@infrastructure/providers/directdata/DirectDataCnpjExecutor.js';
import { DirectDataExecutor } from '@infrastructure/providers/directdata/DirectDataExecutor.js';
import { DirectDataHttpClient } from '@infrastructure/providers/directdata/DirectDataHttpClient.js';
import { CadastroPessoaFisica } from '@infrastructure/providers/directdata/operations/CadastroPessoaFisica.js';
import { CadastroPessoaJuridica } from '@infrastructure/providers/directdata/operations/CadastroPessoaJuridica.js';
import { ProcessosJudiciaisCompleta } from '@infrastructure/providers/directdata/operations/ProcessosJudiciaisCompleta.js';
import { EscavadorExecutor } from '@infrastructure/providers/escavador/EscavadorExecutor.js';
import { EscavadorHttpClient } from '@infrastructure/providers/escavador/EscavadorHttpClient.js';
import { BuscarGeral } from '@infrastructure/providers/escavador/operations/BuscarGeral.js';
import { IniciarBuscaLote } from '@infrastructure/providers/escavador/operations/IniciarBuscaLote.js';
import { ObterBuscaAssincrona } from '@infrastructure/providers/escavador/operations/ObterBuscaAssincrona.js';
import { ObterInstituicao } from '@infrastructure/providers/escavador/operations/ObterInstituicao.js';
import { ObterPessoa } from '@infrastructure/providers/escavador/operations/ObterPessoa.js';
import { ObterProcessosInstituicao } from '@infrastructure/providers/escavador/operations/ObterProcessosInstituicao.js';
import { ObterProcessosPessoa } from '@infrastructure/providers/escavador/operations/ObterProcessosPessoa.js';
import { FonteDataExecutor } from '@infrastructure/providers/fontedata/FonteDataExecutor.js';
import { FonteDataHttpClient } from '@infrastructure/providers/fontedata/FonteDataHttpClient.js';
import {
  CadastroPfBasicaSchema,
  CadastroPjBasicaSchema,
  CafirImoveisSchema,
  CarAmbientalSchema,
  CeisSancoesSchema,
  ConsultaCnpjReceitaSchema,
  ConsultaVeicularSchema,
  HistoricoVeiculosSchema,
  ProcessosAgrupadaSchema,
} from '@infrastructure/providers/fontedata/dtos/FonteDataDtos.js';
import { FonteDataQuery } from '@infrastructure/providers/fontedata/operations/FonteDataQuery.js';
import { InfosimplesCertidoesExecutor } from '@infrastructure/providers/infosimples/InfosimplesCertidoesExecutor.js';
import { InfosimplesCpfExecutor } from '@infrastructure/providers/infosimples/InfosimplesCpfExecutor.js';
import { InfosimplesExecutor } from '@infrastructure/providers/infosimples/InfosimplesExecutor.js';
import { InfosimplesHttpClient } from '@infrastructure/providers/infosimples/InfosimplesHttpClient.js';
import { CadastroPessoaFisica as InfosimplesCadastroPessoaFisica } from '@infrastructure/providers/infosimples/operations/CadastroPessoaFisica.js';
import { CadastroPessoaJuridica as InfosimplesCadastroPessoaJuridica } from '@infrastructure/providers/infosimples/operations/CadastroPessoaJuridica.js';
import { PgfnCertidao } from '@infrastructure/providers/infosimples/operations/PgfnCertidao.js';
import { PortalTransparenciaCeis } from '@infrastructure/providers/infosimples/operations/PortalTransparenciaCeis.js';
import { PortalTransparenciaCnep } from '@infrastructure/providers/infosimples/operations/PortalTransparenciaCnep.js';
import { TstCndt } from '@infrastructure/providers/infosimples/operations/TstCndt.js';
import {
  type ProviderEnvironment,
  optionalConfiguration,
  requiredConfiguration,
} from '@shared/infrastructure/configuration.js';
import type { Pool } from 'pg';
import { FinderJobProcessor } from './FinderJobProcessor.js';
import { type RegisteredSource, SourceRegistry } from './SourceRegistry.js';

export type FinderSourceEnvironment = ProviderEnvironment;

const ESCAVADOR_BASE_URL = 'https://api.escavador.com';
const DATAJUD_BASE_URL = 'https://api-publica.datajud.cnj.jus.br';
const DIRECTDATA_BASE_URL = 'https://apiv3.directd.com.br';

function directDataToken(environment: FinderSourceEnvironment): string {
  return (
    environment['DIRECTDATA_TOKEN']?.trim() ||
    environment['DIRECTDATA_APIKEY']?.trim() ||
    requiredConfiguration(environment, 'DIRECTDATA_TOKEN')
  );
}

export function createCnpjFinderSourceRegistry(
  environment: FinderSourceEnvironment = process.env,
): SourceRegistry {
  const escavadorApiKey = requiredConfiguration(environment, 'ESCAVADOR_API_KEY');
  const dataJudApiKey = requiredConfiguration(environment, 'DATAJUD_APIKEY');
  const directDataApiKey = directDataToken(environment);
  const escavadorHttp = new EscavadorHttpClient(
    escavadorApiKey,
    environment['ESCAVADOR_BASE_URL']?.trim() || ESCAVADOR_BASE_URL,
  );
  const dataJudHttp = new DataJudHttpClient(
    dataJudApiKey,
    environment['DATAJUD_BASE_URL']?.trim() || DATAJUD_BASE_URL,
  );
  const directDataHttp = new DirectDataHttpClient(
    directDataApiKey,
    environment['DIRECTDATA_BASE_URL']?.trim() || DIRECTDATA_BASE_URL,
  );
  const brasilApiHttp = new BrasilApiHttpClient(
    environment['BRASILAPI_BASE_URL']?.trim() || undefined,
  );
  const infosimplesApiKey = optionalConfiguration(environment, 'INFOSIMPLES_API_KEY');
  const apiBrasilApiKey = optionalConfiguration(environment, 'APIBRASIL_API_KEY');
  const apiBrasilDeviceToken = optionalConfiguration(environment, 'APIBRASIL_DEVICE_TOKEN');

  const sources: RegisteredSource[] = [
    {
      id: 'directdata',
      aliases: ['directdata_qsa'],
      stage: 1,
      executor: new DirectDataExecutor({
        cadastroPessoaFisica: new CadastroPessoaFisica(directDataHttp),
        cadastroPessoaJuridica: new CadastroPessoaJuridica(directDataHttp),
        processosJudiciaisCompleta: new ProcessosJudiciaisCompleta(directDataHttp),
      }),
    },
    {
      id: 'escavador',
      aliases: ['escavador_summary', 'escavador_detalhes'],
      stage: 1,
      executor: new EscavadorExecutor({
        buscarGeral: new BuscarGeral(escavadorHttp),
        obterPessoa: new ObterPessoa(escavadorHttp),
        obterProcessosPessoa: new ObterProcessosPessoa(escavadorHttp),
        obterInstituicao: new ObterInstituicao(escavadorHttp),
        obterProcessosInstituicao: new ObterProcessosInstituicao(escavadorHttp),
        iniciarBuscaLote: new IniciarBuscaLote(escavadorHttp),
        obterBuscaAssincrona: new ObterBuscaAssincrona(escavadorHttp),
      }),
    },
    {
      id: 'datajud',
      aliases: ['datajud_processos'],
      stage: 2,
      dependsOn: ['escavador'],
      requiresCandidate: true,
      executor: new DataJudExecutor(new BuscarProcessoPorNumero(dataJudHttp)),
    },
    {
      id: 'brasilapi_cnpj',
      stage: 1,
      executor: new BrasilApiExecutor(new Cnpj(brasilApiHttp)),
    },
    {
      // Processos judiciais da empresa por CNPJ (endpoint DirectData recebe CPF/CNPJ,
      // não número de processo). Fonte própria — o dispatch por identifierKind do
      // DirectDataExecutor não distinguiria duas fontes CNPJ (qsa × processos).
      id: 'directdata_processos',
      stage: 1,
      executor: new DirectDataCnpjExecutor(
        new ProcessosJudiciaisCompleta(directDataHttp),
        'directdata_processos',
      ),
    },
  ];
  if (infosimplesApiKey !== undefined) {
    const infosimplesHttp = new InfosimplesHttpClient(
      infosimplesApiKey,
      environment['INFOSIMPLES_BASE_URL']?.trim() || undefined,
    );
    sources.push({
      id: 'infosimples_cnpj',
      stage: 1,
      executor: new InfosimplesExecutor(new InfosimplesCadastroPessoaJuridica(infosimplesHttp)),
    });
    sources.push({
      id: 'infosimples_ceis',
      stage: 1,
      executor: new InfosimplesExecutor(
        new PortalTransparenciaCeis(infosimplesHttp),
        'infosimples_ceis',
      ),
    });
    sources.push({
      id: 'infosimples_cnep',
      stage: 1,
      executor: new InfosimplesExecutor(
        new PortalTransparenciaCnep(infosimplesHttp),
        'infosimples_cnep',
      ),
    });
    sources.push({
      // Receita Federal CPF. Só roda com identifierKind CPF — o CPF chega DECIFRADO no
      // contexto (LaravelPiiResolver); `birthdate` vem do subject_profile quando presente.
      id: 'infosimples_cpf',
      stage: 1,
      executor: new InfosimplesCpfExecutor(new InfosimplesCadastroPessoaFisica(infosimplesHttp)),
    });
    sources.push({
      // Agregado PGFN (CND federal) + TST (CNDT) numa única fonte comercial; aceita
      // CPF e CNPJ. Endpoints a homologar (gate técnico §6) — registrar não ativa nada.
      id: 'infosimples_certidoes',
      stage: 1,
      executor: new InfosimplesCertidoesExecutor(
        new PgfnCertidao(infosimplesHttp),
        new TstCndt(infosimplesHttp),
      ),
    });
  }
  if (apiBrasilApiKey !== undefined && apiBrasilDeviceToken !== undefined) {
    const apiBrasilHttp = new ApiBrasilHttpClient(
      apiBrasilApiKey,
      apiBrasilDeviceToken,
      environment['APIBRASIL_BASE_URL']?.trim() || undefined,
    );
    sources.push({
      id: 'apibrasil_cadastro_pj',
      stage: 1,
      executor: new ApiBrasilExecutor(new ApiBrasilCnpj(apiBrasilHttp)),
    });
    sources.push({
      // Cadastro PF (CpfDados). CPF chega DECIFRADO no contexto; o guard de error:true
      // em HTTP 200 vive no ApiBrasilHttpClient.
      id: 'apibrasil_cadastro_pf',
      stage: 1,
      executor: new ApiBrasilCadastroPfExecutor(new ApiBrasilCpfDados(apiBrasilHttp)),
    });
    sources.push({
      // Score QUOD — dispatch por identifierKind (CPF/CNPJ) no executor.
      id: 'apibrasil_score_quod',
      stage: 1,
      executor: new ApiBrasilScoreQuodExecutor(new ApiBrasilScoreCreditoQuod(apiBrasilHttp)),
    });
  }

  // Fonte Data (RB-05): fallback de contingência com custo MEDIDO (X-Request-Cost).
  // Gated por env como InfoSimples/APIBrasil; as source_definitions ficam is_active=false
  // até homologação jurídica (FONTEDATA-IMPLEMENTACAO §6) — registrar aqui não ativa nada.
  const fonteDataApiKey = optionalConfiguration(environment, 'FONTEDATA_API_KEY');
  if (fonteDataApiKey !== undefined) {
    const fonteDataHttp = new FonteDataHttpClient(
      fonteDataApiKey,
      environment['FONTEDATA_BASE_URL']?.trim() || undefined,
    );
    const cnpjParams = (ctx: { identifierKind: string; identifier: string }) =>
      ctx.identifierKind === 'CNPJ' ? { cnpj: ctx.identifier } : null;
    sources.push({
      id: 'fontedata_cnpj',
      stage: 1,
      executor: new FonteDataExecutor(
        new FonteDataQuery(fonteDataHttp, 'consulta-cnpj-receita', ConsultaCnpjReceitaSchema),
        'fontedata_cnpj',
        cnpjParams,
      ),
    });
    sources.push({
      id: 'fontedata_cadastro_pj',
      stage: 1,
      executor: new FonteDataExecutor(
        new FonteDataQuery(fonteDataHttp, 'cadastro-pj-basica', CadastroPjBasicaSchema),
        'fontedata_cadastro_pj',
        cnpjParams,
      ),
    });
    sources.push({
      id: 'fontedata_cadastro_pf',
      stage: 1,
      executor: new FonteDataExecutor(
        new FonteDataQuery(fonteDataHttp, 'cadastro-pf-basica', CadastroPfBasicaSchema),
        'fontedata_cadastro_pf',
        // CPF chega DECIFRADO no contexto (LaravelPiiResolver); sem resolver, a fonte
        // simplesmente não roda — nunca CPF em claro fora da memória.
        (ctx) => (ctx.identifierKind === 'CPF' ? { cpf: ctx.identifier } : null),
      ),
    });

    // Fase 1/2 (doc §4/§5): compliance/judicial/rural aceitam CPF (decifrado) e CNPJ;
    // veiculares aceitam PLACA/CHASSI (kinds em adição ao SourceContext pela outra
    // frente — comparação segura via string até o union incorporar os novos kinds).
    const cpfCnpjParams = (ctx: { identifierKind: string; identifier: string }) =>
      ctx.identifierKind === 'CPF'
        ? { cpf: ctx.identifier }
        : ctx.identifierKind === 'CNPJ'
          ? { cnpj: ctx.identifier }
          : null;
    const placaChassiParams = (ctx: { identifierKind: string; identifier: string }) => {
      const kind = ctx.identifierKind as string;
      return kind === 'PLACA'
        ? { placa: ctx.identifier }
        : kind === 'CHASSI'
          ? { chassi: ctx.identifier }
          : null;
    };
    sources.push({
      id: 'fontedata_ceis',
      stage: 1,
      executor: new FonteDataExecutor(
        new FonteDataQuery(fonteDataHttp, 'ceis-sancoes', CeisSancoesSchema),
        'fontedata_ceis',
        cpfCnpjParams,
      ),
    });
    sources.push({
      id: 'fontedata_processos',
      stage: 1,
      executor: new FonteDataExecutor(
        new FonteDataQuery(fonteDataHttp, 'processos-agrupada', ProcessosAgrupadaSchema),
        'fontedata_processos',
        cpfCnpjParams,
      ),
    });
    sources.push({
      id: 'fontedata_car',
      stage: 1,
      executor: new FonteDataExecutor(
        new FonteDataQuery(fonteDataHttp, 'car-ambiental', CarAmbientalSchema),
        'fontedata_car',
        cpfCnpjParams,
      ),
    });
    sources.push({
      id: 'fontedata_cafir',
      stage: 1,
      executor: new FonteDataExecutor(
        new FonteDataQuery(fonteDataHttp, 'cafir-imoveis', CafirImoveisSchema),
        'fontedata_cafir',
        cpfCnpjParams,
      ),
    });
    sources.push({
      id: 'fontedata_veicular',
      stage: 1,
      executor: new FonteDataExecutor(
        new FonteDataQuery(fonteDataHttp, 'consulta-veicular', ConsultaVeicularSchema),
        'fontedata_veicular',
        placaChassiParams,
      ),
    });
    sources.push({
      id: 'fontedata_veicular_hist',
      stage: 1,
      executor: new FonteDataExecutor(
        new FonteDataQuery(fonteDataHttp, 'historico-veiculos', HistoricoVeiculosSchema),
        'fontedata_veicular_hist',
        placaChassiParams,
      ),
    });
  }

  return new SourceRegistry(sources, {
    identity: ['directdata', 'escavador'],
    judicial: ['datajud', 'directdata_processos'],
    full: ['directdata', 'escavador', 'datajud', 'directdata_processos'],
    // Fonte Data entra como FALLBACK do grupo apenas quando registrada (chave presente):
    // grupo com fonte inexistente derruba o plan() com unknown_source.
    public_cnpj:
      fonteDataApiKey === undefined ? ['brasilapi_cnpj'] : ['brasilapi_cnpj', 'fontedata_cnpj'],
  });
}

export function createFinderJobProcessorFromEnvironment(
  pool: Pool | null,
  environment: FinderSourceEnvironment = process.env,
): JobProcessor {
  const registry = createCnpjFinderSourceRegistry(environment);
  if (pool === null) {
    throw new Error('DATABASE_URL or MOTOR_DATABASE_URL is required to start worker');
  }
  // Decifra CPF/perfil com a MESMA chave AES do Laravel. Ausente a chave, o resolver é
  // undefined e o processor trata CPF como indisponível (fonte PF fica fora) — nunca em claro.
  const piiResolver = LaravelPiiResolver.fromEnvironment(environment);
  // Um breaker por slug de provider, reaproveitado entre fontes/jobs (estado vive no banco).
  const breakers = new Map<string, CircuitBreaker>();
  const circuitBreakerFor = (providerSlug: string): CircuitBreaker => {
    let breaker = breakers.get(providerSlug);
    if (breaker === undefined) {
      breaker = new CircuitBreaker(pool, providerSlug);
      breakers.set(providerSlug, breaker);
    }
    return breaker;
  };
  const options = {
    circuitBreakerFor,
    ...(piiResolver === undefined
      ? {}
      : { cpfIdentifierResolver: piiResolver, subjectProfileResolver: piiResolver }),
  };
  return new FinderJobProcessor(registry, new FinderJobRepository(pool), options).process;
}
