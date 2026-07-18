/**
 * @fileoverview Composição do processador da fila `monitor` a partir do ambiente.
 *
 * O monitoramento usa só duas fontes (V6 §P10) — DataJud (Semanal) e Escavador
 * (Mensal) — então exige apenas as duas credenciais correspondentes. Diferente do
 * Finder, **não** depende de DirectData: um worker de monitoramento sobe sem ela.
 *
 * @module application/monitor/MonitorProcessorFactory
 */

import type { JobProcessor } from '@application/jobs/JobWorker.js';
import { DataJudExecutor } from '@infrastructure/providers/datajud/DataJudExecutor.js';
import { DataJudHttpClient } from '@infrastructure/providers/datajud/DataJudHttpClient.js';
import { BuscarProcessoPorNumero } from '@infrastructure/providers/datajud/operations/BuscarProcessoPorNumero.js';
import { EscavadorHttpClient } from '@infrastructure/providers/escavador/EscavadorHttpClient.js';
import { ObterMovimentacoesProcesso } from '@infrastructure/providers/escavador/operations/ObterMovimentacoesProcesso.js';
import {
  type ProviderEnvironment,
  requiredConfiguration,
} from '@shared/infrastructure/configuration.js';
import { MonitorJobProcessor } from './MonitorJobProcessor.js';

const ESCAVADOR_BASE_URL = 'https://api.escavador.com';
const DATAJUD_BASE_URL = 'https://api-publica.datajud.cnj.jus.br';

export function createMonitorJobProcessorFromEnvironment(
  environment: ProviderEnvironment = process.env,
): JobProcessor {
  const dataJudHttp = new DataJudHttpClient(
    requiredConfiguration(environment, 'DATAJUD_APIKEY'),
    environment['DATAJUD_BASE_URL']?.trim() || DATAJUD_BASE_URL,
  );
  const escavadorHttp = new EscavadorHttpClient(
    requiredConfiguration(environment, 'ESCAVADOR_API_KEY'),
    environment['ESCAVADOR_BASE_URL']?.trim() || ESCAVADOR_BASE_URL,
  );

  return new MonitorJobProcessor({
    cnj: new DataJudExecutor(new BuscarProcessoPorNumero(dataJudHttp)),
    escavador: new ObterMovimentacoesProcesso(escavadorHttp),
  }).process;
}
