/**
 * @fileoverview Operation CadastroPessoaFisica — Infosimples API.
 * Consulta dados cadastrais de pessoa física via Receita Federal (CPF).
 * Endpoint: POST /consultas/receita-federal/cpf
 * @module infrastructure/providers/infosimples/operations/CadastroPessoaFisica
 */

import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { InfosimplesResponseSchema } from '../dtos/InfosimplesResponseDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { parseOrSchemaError } from '@shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

/**
 * Schema específico dos dados retornados por esta operação.
 * Baseado no OpenAPI: /consultas/receita-federal/cpf
 */
const CadastroPessoaFisicaDataSchema = z.object({
  cpf: z.string().describe('CPF da pessoa física'),
  nome: z.string().optional().describe('Nome completo'),
  situacao: z.string().optional().describe('Situação cadastral (Ativa, Cancelada, etc.)'),
  data_inscricao: z.string().optional().describe('Data de inscrição'),
  data_cancelamento: z.string().optional().nullable().describe('Data de cancelamento, se houver'),
  data_atualizacao: z.string().optional().describe('Data da última atualização'),
  descricao_situacao: z.string().optional().describe('Descrição da situação'),
});

export type CadastroPessoaFisicaData = z.infer<typeof CadastroPessoaFisicaDataSchema>;

/**
 * Schema de resposta desta operação específica.
 * Estende o schema genérico com tipos específicos para `data`.
 */
const ResponseSchema = z.object({
  code: z.number(),
  code_message: z.string(),
  header: z.object({
    api_version: z.string().optional(),
    billable: z.boolean().optional(),
    price: z.number().optional(),
    elapsed_time_in_milliseconds: z.number().optional(),
  }).passthrough(),
  data: z.array(CadastroPessoaFisicaDataSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
});

/**
 * Operation para endpoint `/consultas/receita-federal/cpf`.
 * Consulta cadastro de pessoa física na Receita Federal.
 *
 * @class CadastroPessoaFisica
 * @implements {IInfosimplesOperation<CadastroPessoaFisicaData>}
 */
export class CadastroPessoaFisica
  implements IInfosimplesOperation<CadastroPessoaFisicaData>
{
  readonly path = 'consultas/receita-federal/cpf';
  readonly requiredParams = ['cpf'];

  constructor(private readonly http: IHttpClient) {}

  /**
   * Executa consulta de CPF na Receita Federal.
   *
   * @param {Record<string, string | undefined>} params - Query params (deve conter `cpf`)
   * @returns {Promise<Either<SourceError, { code, data, errors, ... }>>}
   */
  async execute(
    params: Record<string, string | undefined>,
  ): Promise<
    Either<
      SourceError,
      {
        code: number;
        code_message: string;
        header: Record<string, unknown>;
        data: CadastroPessoaFisicaData[] | null;
        errors: string[];
        data_count: number;
      }
    >
  > {
    // Limpar params undefined
    const cleanParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        cleanParams[key] = value;
      }
    }

    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });

    if (isLeft(result)) return result;

    return parseOrSchemaError(ResponseSchema, result.value, 'infosimples');
  }
}
