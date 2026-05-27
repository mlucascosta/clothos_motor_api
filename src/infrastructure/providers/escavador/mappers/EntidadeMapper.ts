import type { EntidadeDto } from '../dtos/EntidadeDto.js';

export interface EntidadeInternal {
  id: number;
  nome: string;
  tipo: string;
  documento?: string;
  quantidadeProcessos: number;
  urlEscavador?: string;
}

export class EntidadeMapper {
  toInternal(dto: EntidadeDto): EntidadeInternal {
    const result: EntidadeInternal = {
      id: dto.id,
      nome: dto.nome,
      tipo: dto.tipo,
      quantidadeProcessos: dto.quantidade_processos ?? 0,
    };
    const doc = dto.cnpj ?? dto.cpf;
    if (doc !== undefined) result.documento = doc;
    if (dto.url_escavador !== undefined) result.urlEscavador = dto.url_escavador;
    return result;
  }
}
