// POST /api/v1/processos/tribunal/cpf-cnpj  (ASYNC — retorna ID para polling)
import type { Either } from '../../../../shared/domain/Either.js';
import type { SourceError } from '../../../../shared/domain/errors/SourceError.js';
import type { IniciarBuscaResponse } from '../dtos/BuscaAssincronaDto.js';

export interface IniciarBuscaProcessosCpfCnpjInput {
  cpfCnpj: string;
  tribunais?: string[];
}

export interface IIniciarBuscaProcessosCpfCnpj {
  execute(input: IniciarBuscaProcessosCpfCnpjInput): Promise<Either<SourceError, IniciarBuscaResponse>>;
}
