/**
 * @fileoverview DTOs de certificados digitais e autenticação (API Escavador v2).
 * Define schemas para certificados usados em operações autenticadas na API.
 * @module infrastructure/providers/escavador/dtos/v2/CertificadoDto
 */

import { z } from 'zod';

/**
 * Schema de autenticação associada a um certificado.
 * Pode ser chave privada, token, ou outra forma de autenticação.
 *
 * @type {ZodSchema}
 */
export const AutenticacaoDtoSchema = z.object({
  /** ID único da autenticação */
  id: z.number().int(),
  /** Tipo de autenticação (ex: "private_key", "api_token") */
  tipo: z.string(),
  /** Valor da autenticação (criptografado ou mascarado) (opcional) */
  valor: z.string().optional(),
  /** Timestamp ISO 8601 de criação */
  criado_em: z.string().optional(),
});

/**
 * Schema de certificado digital usado em operações na API.
 * Certificados permitem operações autenticadas como login de sistema, etc.
 *
 * @type {ZodSchema}
 */
export const CertificadoDtoSchema = z.object({
  /** ID único do certificado */
  id: z.number().int(),
  /** Nome descritivo do certificado */
  nome: z.string(),
  /** Data de validade do certificado (ISO 8601) (opcional) */
  validade: z.string().optional(),
  /** Se certificado está ativo para uso (opcional, padrão true) */
  ativo: z.boolean().optional(),
  /** Timestamp ISO 8601 de criação */
  criado_em: z.string().optional(),
  /** Array de autenticações associadas ao certificado */
  autenticacoes: z.array(AutenticacaoDtoSchema).optional(),
});

/**
 * Schema de resposta com listagem de certificados.
 *
 * @type {ZodSchema}
 */
export const ListarCertificadosResponseSchema = z.object({
  /** Array de certificados */
  items: z.array(CertificadoDtoSchema),
  /** Total de certificados (opcional) */
  total: z.number().int().min(0).optional(),
});

/**
 * Autenticação associada a um certificado.
 *
 * @typedef {Object} AutenticacaoDto
 */
export type AutenticacaoDto = z.infer<typeof AutenticacaoDtoSchema>;

/**
 * Certificado digital para operações autenticadas.
 *
 * @typedef {Object} CertificadoDto
 */
export type CertificadoDto = z.infer<typeof CertificadoDtoSchema>;

/**
 * Resposta com listagem de certificados.
 *
 * @typedef {Object} ListarCertificadosResponse
 */
export type ListarCertificadosResponse = z.infer<typeof ListarCertificadosResponseSchema>;
