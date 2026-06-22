/**
 * @fileoverview Operation — Registradores / Matrícula Pedido
 * Endpoint: POST consultas/registradores/matric/pedido
 * @module infrastructure/providers/infosimples/operations/RegistradoresMatricPedido
 */
import { isLeft } from '@shared/domain/Either.js';
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';
import { parseInfosimplesResponse } from '../InfosimplesCodeHandler.js';
import {
  type RegistradoresMatricPedidoItem,
  RegistradoresMatricPedidoResponseSchema,
} from '../dtos/RegistradoresMatricPedidoDto.js';
import type { IInfosimplesOperation } from '../ports/IInfosimplesOperation.js';

export class RegistradoresMatricPedido
  implements IInfosimplesOperation<RegistradoresMatricPedidoItem>
{
  readonly path = 'consultas/registradores/matric/pedido';

  constructor(private readonly http: IHttpClient) {}

  async execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, RegistradoresMatricPedidoItem>> {
    const cleanParams: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') cleanParams[k] = v;
    }
    const result = await this.http.request<unknown>(this.path, {
      method: 'POST',
      params: cleanParams,
    });
    if (isLeft(result)) return result;
    return parseInfosimplesResponse(RegistradoresMatricPedidoResponseSchema, result.value);
  }
}
