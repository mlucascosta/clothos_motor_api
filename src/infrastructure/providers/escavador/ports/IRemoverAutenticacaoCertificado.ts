import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';

export interface IRemoverAutenticacaoCertificado {
  execute(input: { id: number; autenticacaoId: number }): Promise<Either<SourceError, void>>;
}
