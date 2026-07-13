import type { JobProcessor } from '@application/jobs/JobWorker.js';
import { FinderJobRepository } from '@infrastructure/database/FinderJobRepository.js';
import { ApiBrasilExecutor } from '@infrastructure/providers/apibrasil/ApiBrasilExecutor.js';
import { ApiBrasilHttpClient } from '@infrastructure/providers/apibrasil/ApiBrasilHttpClient.js';
import { Cnpj as ApiBrasilCnpj } from '@infrastructure/providers/apibrasil/operations/Cnpj.js';
import { BrasilApiExecutor } from '@infrastructure/providers/brasilapi/BrasilApiExecutor.js';
import { BrasilApiHttpClient } from '@infrastructure/providers/brasilapi/BrasilApiHttpClient.js';
import { Cnpj } from '@infrastructure/providers/brasilapi/operations/Cnpj.js';
import { DataJudExecutor } from '@infrastructure/providers/datajud/DataJudExecutor.js';
import { DataJudHttpClient } from '@infrastructure/providers/datajud/DataJudHttpClient.js';
import { BuscarProcessoPorNumero } from '@infrastructure/providers/datajud/operations/BuscarProcessoPorNumero.js';
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
import { InfosimplesExecutor } from '@infrastructure/providers/infosimples/InfosimplesExecutor.js';
import { InfosimplesHttpClient } from '@infrastructure/providers/infosimples/InfosimplesHttpClient.js';
import { CadastroPessoaJuridica as InfosimplesCadastroPessoaJuridica } from '@infrastructure/providers/infosimples/operations/CadastroPessoaJuridica.js';
import type { Pool } from 'pg';
import { FinderJobProcessor } from './FinderJobProcessor.js';
import { type RegisteredSource, SourceRegistry } from './SourceRegistry.js';

export interface FinderSourceEnvironment {
  readonly [key: string]: string | undefined;
}

const ESCAVADOR_BASE_URL = 'https://api.escavador.com';
const DATAJUD_BASE_URL = 'https://api-publica.datajud.cnj.jus.br';
const DIRECTDATA_BASE_URL = 'https://apiv3.directd.com.br';

function requiredConfiguration(environment: FinderSourceEnvironment, name: string): string {
  const value = environment[name]?.trim();
  if (value === undefined || value.length === 0) {
    throw new Error(`missing_provider_configuration:${name}`);
  }
  return value;
}

function directDataToken(environment: FinderSourceEnvironment): string {
  return (
    environment['DIRECTDATA_TOKEN']?.trim() ||
    environment['DIRECTDATA_APIKEY']?.trim() ||
    requiredConfiguration(environment, 'DIRECTDATA_TOKEN')
  );
}

function optionalConfiguration(
  environment: FinderSourceEnvironment,
  name: string,
): string | undefined {
  const value = environment[name]?.trim();
  return value && value.length > 0 ? value : undefined;
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
      stage: 1,
      executor: new DirectDataExecutor({
        cadastroPessoaFisica: new CadastroPessoaFisica(directDataHttp),
        cadastroPessoaJuridica: new CadastroPessoaJuridica(directDataHttp),
        processosJudiciaisCompleta: new ProcessosJudiciaisCompleta(directDataHttp),
      }),
    },
    {
      id: 'escavador',
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
  }

  return new SourceRegistry(sources, {
    identity: ['directdata', 'escavador'],
    judicial: ['datajud'],
    full: ['directdata', 'escavador', 'datajud'],
    public_cnpj: ['brasilapi_cnpj'],
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
  return new FinderJobProcessor(registry, new FinderJobRepository(pool)).process;
}
