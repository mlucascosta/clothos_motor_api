import type { ProcessoDto } from '../dtos/ProcessoDto.js';

export interface ProcessoInternal {
  numeroCnj: string;
  tribunal: string;
  dataAjuizamento?: string;
  tipoAcao?: string;
  valorCausa?: number;
  ativo: boolean;
  partes: Array<{ nome: string; tipoParte: string }>;
  ultimaMovimentacao?: string;
}

export class ProcessoMapper {
  toInternal(dto: ProcessoDto): ProcessoInternal {
    const result: ProcessoInternal = {
      numeroCnj: dto.numero_cnj,
      tribunal: dto.tribunal,
      ativo: dto.ativo ?? true,
      partes: (dto.partes ?? []).map((p) => ({ nome: p.nome, tipoParte: p.tipo_parte })),
    };
    if (dto.data_ajuizamento !== undefined) result.dataAjuizamento = dto.data_ajuizamento;
    if (dto.tipo_acao !== undefined) result.tipoAcao = dto.tipo_acao;
    if (dto.valor_causa !== undefined) result.valorCausa = dto.valor_causa;
    if (dto.ultima_movimentacao !== undefined) result.ultimaMovimentacao = dto.ultima_movimentacao;
    return result;
  }
}
