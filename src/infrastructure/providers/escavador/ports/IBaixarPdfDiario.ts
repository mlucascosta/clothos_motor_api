// GET /api/v1/diarios-oficiais/{id}/pdf → retorna Buffer
import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';

export interface BaixarPdfDiarioInput {
  id: number;
}

export interface IBaixarPdfDiario {
  execute(input: BaixarPdfDiarioInput): Promise<Either<SourceError, Buffer>>;
}
