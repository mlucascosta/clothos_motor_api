/**
 * @fileoverview Operation CadastroPessoaJuridica — Infosimples API.
 * Consulta dados cadastrais de pessoa jurídica via Receita Federal (CNPJ).
 * Endpoint: POST /consultas/receita-federal/cnpj
 * @module infrastructure/providers/infosimples/operations/CadastroPessoaJuridica
 */

import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IHttpClient } from '../../../../shared/infrastructure/IHttpClient.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';
import { parseOrSchemaError } from '../../../../shared/domain/parseOrSchemaError.js';
import { z } from 'zod';

/**
 * Schema específico dos dados retornados por esta operação.
 * Baseado no OpenAPI: /consultas/receita-federal/cnpj
 */
const CadastroPessoaJuridicaDataSchema = z.object({
  cnpj: z.string().describe('CNPJ da pessoa jurídica'),
  razao_social: z.string().optional().describe('Razão social'),
  nome_fantasia: z.string().optional().describe('Nome fantasia'),
  situacao: z.string().optional().describe('Situação cadastral'),
  data_inscricao: z.string().optional().describe('Data de inscrição'),
  data_atualizacao: z.string().optional().describe('Data da última atualização'),
  cnae_fiscal: z.string().optional().describe('CNAE fiscal principal'),
  tipo_logradouro: z.string().optional().describe('Tipo de logradouro'),
  logradouro: z.string().optional().describe('Nome do logradouro'),
  numero: z.string().optional().describe('Número do endereço'),
  complemento: z.string().optional().nullable().describe('Complemento do endereço'),
  bairro: z.string().optional().describe('Bairro'),
  cep: z.string().optional().describe('CEP'),
  cidade: z.string().optional().describe('Cidade'),
  uf: z.string().optional().describe('Unidade Federativa'),
});

export type CadastroPessoaJuridicaData = z.infer<typeof CadastroPessoaJuridicaDataSchema>;

/**
 * Schema de resposta desta operação específica.
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
  data: z.array(CadastroPessoaJuridicaDataSchema).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
});

/**
 * Operation para endpoint `/consultas/receita-federal/cnpj`.
 * Consulta cadastro de pessoa jurídica na Receita Federal.
 *
 * @class CadastroPessoaJuridica
 * @implements {IInfosimplesOperation<CadastroPessoaJuridicaData>}
 */
export class CadastroPessoaJuridica
  implements IInfosimplesOperation<CadastroPessoaJuridicaData>
{
  readonly path = 'consultas/receita-federal/cnpj';
  readonly requiredParams = ['cnpj'];

  constructor(private readonly http: IHttpClient) {}

  /**
   * Executa consulta de CNPJ na Receita Federal.
   *
   * @param {Record<string, string | undefined>} params - Query params (deve conter `cnpj`)
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
        data: CadastroPessoaJuridicaData[] | null;
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

    if (result._tag === 'Left') return result;

    return parseOrSchemaError(ResponseSchema, result.value, 'infosimples');
  }
}
