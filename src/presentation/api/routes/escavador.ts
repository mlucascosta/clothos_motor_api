/**
 * @fileoverview Router de Rotas para API Escavador — Motor de Consultas Reduto Finder
 *
 * @module escavador
 *
 * ## Contexto
 *
 * Este arquivo centraliza todas as rotas HTTP que expõem os endpoints da API Escavador
 * através do motor (`clothos_motor_api`). O Escavador é um provider de dados judiciais
 * brasileiro que fornece acesso a processos, pessoas, instituições e monitoramentos via
 * duas versões de API: V1 (legacy, suporta múltiplos recursos) e V2 (moderna, focada em processos).
 *
 * ## Arquitetura
 *
 * ### Mounting
 * - Base path no app: `/api/escavador`
 * - Rotas V1: `/api/escavador/v1/*` (mapeiam para `https://api.escavador.com/api/v1/*`)
 * - Rotas V2: `/api/escavador/v2/*` (mapeiam para `https://api.escavador.com/api/v2/*`)
 *
 * ### Autenticação
 * - Bearer Token (via env var `ESCAVADOR_API_KEY`)
 * - Passado automaticamente em todos os requests via `EscavadorHttpClient`
 * - Header: `Authorization: Bearer <token>`
 * - Configurado em `buildHttp(version)`
 *
 * ### Pipeline de Requisição
 * 1. Cliente bate em `/api/escavador/v1/saldo` (ex)
 * 2. Handler extrai params, valida com Zod
 * 3. Instancia operation (`new ObterSaldo(buildHttp())`)
 * 4. Operation executa chamada para `https://api.escavador.com/api/v1/quantidade-creditos`
 * 5. Response convertida para JSON e retornada (ou erro 500 se falhar)
 * 6. Resultado persistido em `rawStore` para auditoria
 *
 * ### Error Handling
 * - Either<SourceError, T> pattern para erros tipados
 * - Erros retornam HTTP 500 com `{ error, kind }`
 * - Validation errors retornam HTTP 422 com detalhes Zod
 * - Bad requests retornam HTTP 400
 *
 * ### Persistência de Auditoria
 * - Cada request gravado em `rawStore`: gateway, fonte, tipo_param, param, resultado, status
 * - Permite rastreabilidade completa de chamadas ao Escavador
 *
 * ## Endpoints V1 (42 rotas)
 *
 * ### Seção: Saldo
 * - `GET /v1/saldo` — Consulta saldo e créditos disponíveis na API Escavador
 *
 * ### Seção: Buscas Assíncronas (Async Results)
 * - `GET /v1/buscas-assincronas` — Lista todas as buscas assíncronas iniciadas (com paginação)
 * - `GET /v1/buscas-assincronas/:id` — Obter resultado de uma busca assíncrona específica por ID
 *
 * ### Seção: Processos — Iniciar Buscas (POST, async)
 * - `POST /v1/processos/tribunal/cpf-cnpj` — Inicia busca de processos por CPF/CNPJ em tribunais (async)
 * - `POST /v1/processos/tribunal/envolvido` — Inicia busca por nome de envolvido em tribunais (async)
 * - `POST /v1/processos/tribunal/oab` — Inicia busca por número OAB de advogado (async)
 * - `POST /v1/processos/administrativo/nup` — Inicia busca por NUP (número único de protocolo) em órgãos admin (async)
 * - `POST /v1/processos/pesquisar` — Inicia busca de processo por número CNJ no tribunal (async)
 * - `POST /v1/processos/tribunal/lote` — Inicia busca em lote com múltiplos CPF/CNPJ/OAB/nomes (async)
 *
 * ### Seção: Processos — Diários Oficiais
 * - `GET /v1/processos/diarios-oficiais/numero` — Busca processos em diários oficiais por número
 * - `GET /v1/processos/diarios-oficiais/oab` — Busca processos em diários oficiais por OAB
 *
 * ### Seção: Processos — Detalhes
 * - `GET /v1/processos/:numero_cnj` — Obter detalhes completos de um processo por número CNJ
 * - `GET /v1/processos/:numero_cnj/movimentacoes` — Listar movimentações (updates) de um processo
 * - `GET /v1/processos/:id/envolvidos-diarios` — Listar partes envolvidas extraídas de diários oficiais
 *
 * ### Seção: Movimentações
 * - `GET /v1/movimentacoes/:id` — Obter detalhes de uma movimentação específica
 *
 * ### Seção: Busca Geral (Full Text)
 * - `GET /v1/busca` — Full-text search (query param: `q`, `tipo` opcional, `page` opcional)
 *
 * ### Seção: Pessoas
 * - `GET /v1/pessoas/:id` — Obter dados de uma pessoa específica
 * - `GET /v1/pessoas/:id/processos` — Listar processos envolvendo uma pessoa (com paginação)
 * - `GET /v1/pessoas/:id/publicacoes` — Listar publicações em diários oficiais (com paginação)
 *
 * ### Seção: Instituições
 * - `GET /v1/instituicoes/:id` — Obter dados de uma instituição
 * - `GET /v1/instituicoes/:id/pessoas` — Listar pessoas associadas a uma instituição (com paginação)
 * - `GET /v1/instituicoes/:id/processos` — Listar processos envolvendo uma instituição (com paginação)
 *
 * ### Seção: Monitoramentos Diários Oficiais
 * - `GET /v1/monitoramentos` — Listar todos os monitoramentos de diários oficiais (com paginação)
 * - `POST /v1/monitoramentos` — Criar novo monitoramento de diário oficial
 * - `GET /v1/monitoramentos/:id` — Obter detalhes de um monitoramento específico
 * - `PUT /v1/monitoramentos/:id` — Editar monitoramento (ativo, callback_url, nome)
 * - `DELETE /v1/monitoramentos/:id` — Remover monitoramento
 * - `GET /v1/monitoramentos/:id/aparicoes` — Listar aparições/publicações detectadas por monitoramento
 * - `POST /v1/monitoramentos/:id/testar-callback` — Testar webhook callback do monitoramento
 * - `GET /v1/monitoramentos/:id/origens` — Listar origens de diários monitorados
 *
 * ### Seção: Monitoramentos Tribunal
 * - `GET /v1/monitoramentos/tribunal` — Listar monitoramentos de tribunal (site do tribunal)
 * - `POST /v1/monitoramentos/tribunal` — Criar monitoramento de tribunal
 * - `GET /v1/monitoramentos/tribunal/:id` — Obter monitoramento de tribunal
 * - `PUT /v1/monitoramentos/tribunal/:id` — Editar monitoramento de tribunal
 * - `DELETE /v1/monitoramentos/tribunal/:id` — Remover monitoramento de tribunal
 *
 * ### Seção: Callbacks V1
 * - `GET /v1/callbacks` — Listar callbacks recebidos (com paginação)
 * - `POST /v1/callbacks/recebidos` — Marcar callbacks como recebidos (idempotente)
 * - `POST /v1/callbacks/reenviar` — Reenviar um callback específico
 *
 * ### Seção: Auxiliares
 * - `GET /v1/tribunais` — Listar todos os tribunais disponíveis (com filtro `tipo` opcional)
 * - `GET /v1/tribunais/:id` — Obter detalhes de um tribunal específico
 * - `GET /v1/orgaos-administrativos` — Listar órgãos administrativos (com paginação)
 * - `GET /v1/diarios-oficiais/origens` — Listar origens de diários oficiais (com filtro `estado` opcional)
 *
 * ## Endpoints V2 (50+ rotas)
 *
 * ### Seção: Consulta de Processos
 * - `GET /v2/processos/numero_cnj/:numero` — Obter processo por número CNJ
 * - `GET /v2/processos/movimentacoes/:numero_cnj` — Listar movimentações de um processo (paginado)
 * - `GET /v2/processos/envolvido` — Buscar processos por envolvido (nome ou CPF/CNPJ)
 * - `GET /v2/processos/envolvido/resumo` — Resumo de processos por envolvido
 * - `GET /v2/processos/advogado/:oab` — Buscar processos por OAB de advogado (paginado)
 * - `GET /v2/processos/advogado/:oab/resumo` — Resumo de processos por advogado
 * - `GET /v2/processos/:numero_cnj/documentos` — Listar documentos públicos de um processo (paginado)
 * - `GET /v2/processos/:numero_cnj/autos` — Listar autos (case files) de um processo (paginado)
 * - `GET /v2/processos/:numero_cnj/envolvidos` — Listar partes envolvidas em um processo
 *
 * ### Seção: Atualização de Processos
 * - `POST /v2/processos/atualizacao` — Solicitar atualização em lote de processos (async)
 * - `GET /v2/processos/atualizacao/:id` — Consultar status de atualização em lote
 * - `POST /v2/processos/:id/atualizacao` — Solicitar atualização de um processo (async)
 * - `GET /v2/processos/:id/atualizacao` — Consultar status de atualização de processo
 *
 * ### Seção: Resumo de Processos (IA)
 * - `POST /v2/processos/:id/resumo` — Solicitar resumo inteligente de processo (async, usa IA)
 * - `GET /v2/processos/:id/resumo` — Obter resumo gerado
 * - `GET /v2/processos/:id/resumo/status` — Consultar status de geração de resumo
 *
 * ### Seção: Monitoramento de Novos Processos
 * - `POST /v2/monitoramentos/novos-processos` — Criar monitoramento de novos processos
 * - `GET /v2/monitoramentos/novos-processos` — Listar monitoramentos de novos processos
 * - `GET /v2/monitoramentos/novos-processos/:id` — Obter monitoramento específico
 * - `PATCH /v2/monitoramentos/novos-processos/:id` — Editar monitoramento de novos processos
 * - `DELETE /v2/monitoramentos/novos-processos/:id` — Remover monitoramento
 * - `GET /v2/monitoramentos/novos-processos/:id/processos` — Listar processos encontrados
 *
 * ### Seção: Monitoramento de Processos
 * - `POST /v2/monitoramentos/processos` — Criar monitoramento de processo específico
 * - `GET /v2/monitoramentos/processos` — Listar monitoramentos de processos
 * - `GET /v2/monitoramentos/processos/:id` — Obter monitoramento específico
 * - `DELETE /v2/monitoramentos/processos/:id` — Remover monitoramento
 *
 * ### Seção: Callback V2
 * - `GET /v2/callbacks` — Listar callbacks V2
 * - `POST /v2/callbacks/recebidos` — Marcar callbacks como recebidos
 * - `POST /v2/callbacks/:id/reenviar` — Reenviar callback específico
 *
 * ### Seção: Certificados Digitais
 * - `GET /v2/certificados` — Listar certificados digitais cadastrados
 * - `POST /v2/certificados` — Criar novo certificado
 * - `GET /v2/certificados/:id` — Obter certificado específico
 * - `DELETE /v2/certificados/:id` — Remover certificado
 * - `POST /v2/certificados/:id/autenticacoes` — Configurar autenticações do certificado
 * - `DELETE /v2/certificados/:id/autenticacoes/:autenticacaoId` — Remover autenticação
 *
 * ### Seção: Tribunais e Sistemas
 * - `GET /v2/tribunais/sistemas` — Listar sistemas de tribunais disponíveis
 * - `GET /v2/tribunais` — Listar tribunais (V2)
 *
 * ### Seção: Download de Documentos
 * - `GET /v2/documentos/:id/download` — Download direto de documento PDF
 *
 * ## Variáveis de Ambiente Necessárias
 * - `ESCAVADOR_API_KEY` — Token de autenticação Bearer para API Escavador
 * - `ESCAVADOR_BASE_URL` — URL base (padrão: `https://api.escavador.com`)
 *
 * ## Exemplo de Uso (curl)
 * ```bash
 * # V1 — Consultar saldo
 * curl -X GET http://localhost:3000/api/escavador/v1/saldo \\
 *   -H "Authorization: Bearer <token>"
 *
 * # V1 — Buscar processos por CPF
 * curl -X POST http://localhost:3000/api/escavador/v1/processos/tribunal/cpf-cnpj \\
 *   -H "Authorization: Bearer <token>" \\
 *   -H "Content-Type: application/json" \\
 *   -d '{ "cpf_cnpj": "12345678901234" }'
 *
 * # V2 — Obter processo por CNJ
 * curl -X GET http://localhost:3000/api/escavador/v2/processos/numero_cnj/0000001-00.0000.0.00.0000 \\
 *   -H "Authorization: Bearer <token>"
 * ```
 *
 * @see {@link EscavadorHttpClient} — Cliente HTTP para V1
 * @see {@link EscavadorV2HttpClient} — Cliente HTTP para V2
 * @see @infrastructure/providers/escavador/operations — Implementations dos operations
 */

import { rawStore } from '@infrastructure/persistence/index.js';
import { EscavadorHttpClient } from '@infrastructure/providers/escavador/EscavadorHttpClient.js';
import { isLeft } from '@shared/domain/Either.js';
import { Hono } from 'hono';
import { z } from 'zod';
import { handleOp, handleOpVoid } from '../handleOp.js';
import { parseInput } from '../parseInput.js';

// ═══════════════════════════════════════════════════════════════════════════
// IMPORTS — Operations V1 e V2
// ═══════════════════════════════════════════════════════════════════════════

import { BuscarGeral } from '@infrastructure/providers/escavador/operations/BuscarGeral.js';
import { BuscarProcessosDiarioPorNumero } from '@infrastructure/providers/escavador/operations/BuscarProcessosDiarioPorNumero.js';
import { BuscarProcessosDiarioPorOab } from '@infrastructure/providers/escavador/operations/BuscarProcessosDiarioPorOab.js';
import { BuscarPublicacoes } from '@infrastructure/providers/escavador/operations/BuscarPublicacoes.js';
import { CriarMonitoramento } from '@infrastructure/providers/escavador/operations/CriarMonitoramento.js';
import { CriarMonitoramentoTribunal } from '@infrastructure/providers/escavador/operations/CriarMonitoramentoTribunal.js';
import { EditarMonitoramento } from '@infrastructure/providers/escavador/operations/EditarMonitoramento.js';
import { EditarMonitoramentoTribunal } from '@infrastructure/providers/escavador/operations/EditarMonitoramentoTribunal.js';
// ──── Operations V1 ────
import { IniciarBuscaLote } from '@infrastructure/providers/escavador/operations/IniciarBuscaLote.js';
import { IniciarBuscaProcesso } from '@infrastructure/providers/escavador/operations/IniciarBuscaProcesso.js';
import { IniciarBuscaProcessoNup } from '@infrastructure/providers/escavador/operations/IniciarBuscaProcessoNup.js';
import { IniciarBuscaProcessosLote } from '@infrastructure/providers/escavador/operations/IniciarBuscaProcessosLote.js';
import { IniciarBuscaProcessosOab } from '@infrastructure/providers/escavador/operations/IniciarBuscaProcessosOab.js';
import { ListarBuscasAssincronas } from '@infrastructure/providers/escavador/operations/ListarBuscasAssincronas.js';
import { ListarCallbacks } from '@infrastructure/providers/escavador/operations/ListarCallbacks.js';
import { ListarMonitoramentos } from '@infrastructure/providers/escavador/operations/ListarMonitoramentos.js';
import { ListarMonitoramentosTribunal } from '@infrastructure/providers/escavador/operations/ListarMonitoramentosTribunal.js';
import { ListarOrgaosAdministrativos } from '@infrastructure/providers/escavador/operations/ListarOrgaosAdministrativos.js';
import { ListarOrigensDiariosOficiais } from '@infrastructure/providers/escavador/operations/ListarOrigensDiariosOficiais.js';
import { ListarTribunais } from '@infrastructure/providers/escavador/operations/ListarTribunais.js';
import { MarcarCallbacksRecebidos } from '@infrastructure/providers/escavador/operations/MarcarCallbacksRecebidos.js';
import { ObterAparicoes } from '@infrastructure/providers/escavador/operations/ObterAparicoes.js';
import { ObterBuscaAssincrona } from '@infrastructure/providers/escavador/operations/ObterBuscaAssincrona.js';
import { ObterDetalhesProcesso } from '@infrastructure/providers/escavador/operations/ObterDetalhesProcesso.js';
import { ObterEnvolvidosProcesso } from '@infrastructure/providers/escavador/operations/ObterEnvolvidosProcesso.js';
import { ObterInstituicao } from '@infrastructure/providers/escavador/operations/ObterInstituicao.js';
import { ObterMonitoramento } from '@infrastructure/providers/escavador/operations/ObterMonitoramento.js';
import { ObterMonitoramentoTribunal } from '@infrastructure/providers/escavador/operations/ObterMonitoramentoTribunal.js';
import { ObterMovimentacao } from '@infrastructure/providers/escavador/operations/ObterMovimentacao.js';
import { ObterMovimentacoesProcesso } from '@infrastructure/providers/escavador/operations/ObterMovimentacoesProcesso.js';
import { ObterOrigensMonitoramento } from '@infrastructure/providers/escavador/operations/ObterOrigensMonitoramento.js';
import { ObterPessoa } from '@infrastructure/providers/escavador/operations/ObterPessoa.js';
import { ObterPessoasInstituicao } from '@infrastructure/providers/escavador/operations/ObterPessoasInstituicao.js';
import { ObterProcessosInstituicao } from '@infrastructure/providers/escavador/operations/ObterProcessosInstituicao.js';
import { ObterProcessosPessoa } from '@infrastructure/providers/escavador/operations/ObterProcessosPessoa.js';
import { ObterSaldo } from '@infrastructure/providers/escavador/operations/ObterSaldo.js';
import { ObterTribunal } from '@infrastructure/providers/escavador/operations/ObterTribunal.js';
import { ReenviarCallback } from '@infrastructure/providers/escavador/operations/ReenviarCallback.js';
import { RemoverMonitoramento } from '@infrastructure/providers/escavador/operations/RemoverMonitoramento.js';
import { RemoverMonitoramentoTribunal } from '@infrastructure/providers/escavador/operations/RemoverMonitoramentoTribunal.js';
import { TestarCallbackMonitoramento } from '@infrastructure/providers/escavador/operations/TestarCallbackMonitoramento.js';

import { BuscarProcessosPorAdvogado } from '@infrastructure/providers/escavador/operations/v2/BuscarProcessosPorAdvogado.js';
import { BuscarProcessosPorEnvolvido } from '@infrastructure/providers/escavador/operations/v2/BuscarProcessosPorEnvolvido.js';
import { CriarAutenticacaoCertificado } from '@infrastructure/providers/escavador/operations/v2/CriarAutenticacaoCertificado.js';
import { CriarCertificado } from '@infrastructure/providers/escavador/operations/v2/CriarCertificado.js';
import { CriarMonitoramentoNovosProcessos } from '@infrastructure/providers/escavador/operations/v2/CriarMonitoramentoNovosProcessos.js';
import { CriarMonitoramentoProcesso } from '@infrastructure/providers/escavador/operations/v2/CriarMonitoramentoProcesso.js';
// ──── Operations V2 ────
import { DownloadDocumento } from '@infrastructure/providers/escavador/operations/v2/DownloadDocumento.js';
import { EditarMonitoramentoNovosProcessos } from '@infrastructure/providers/escavador/operations/v2/EditarMonitoramentoNovosProcessos.js';
import { ListarCallbacksV2 } from '@infrastructure/providers/escavador/operations/v2/ListarCallbacksV2.js';
import { ListarCertificados } from '@infrastructure/providers/escavador/operations/v2/ListarCertificados.js';
import { ListarMonitoramentosNovosProcessos } from '@infrastructure/providers/escavador/operations/v2/ListarMonitoramentosNovosProcessos.js';
import { ListarMonitoramentosProcesso } from '@infrastructure/providers/escavador/operations/v2/ListarMonitoramentosProcesso.js';
import { ListarSistemasTribunais } from '@infrastructure/providers/escavador/operations/v2/ListarSistemasTribunais.js';
import { ListarTribunaisV2 } from '@infrastructure/providers/escavador/operations/v2/ListarTribunaisV2.js';
import { MarcarCallbacksRecebidosV2 } from '@infrastructure/providers/escavador/operations/v2/MarcarCallbacksRecebidosV2.js';
import { ObterAutosProcesso } from '@infrastructure/providers/escavador/operations/v2/ObterAutosProcesso.js';
import { ObterCertificado } from '@infrastructure/providers/escavador/operations/v2/ObterCertificado.js';
import { ObterDocumentosProcesso } from '@infrastructure/providers/escavador/operations/v2/ObterDocumentosProcesso.js';
import { ObterEnvolvidosProcessoV2 } from '@infrastructure/providers/escavador/operations/v2/ObterEnvolvidosProcessoV2.js';
import { ObterMonitoramentoNovosProcessos } from '@infrastructure/providers/escavador/operations/v2/ObterMonitoramentoNovosProcessos.js';
import { ObterMonitoramentoProcesso } from '@infrastructure/providers/escavador/operations/v2/ObterMonitoramentoProcesso.js';
import { ObterMovimentacoesV2 } from '@infrastructure/providers/escavador/operations/v2/ObterMovimentacoesV2.js';
import { ObterProcessoPorCnj } from '@infrastructure/providers/escavador/operations/v2/ObterProcessoPorCnj.js';
import { ObterResultadosMonitoramentoNovosProcessos } from '@infrastructure/providers/escavador/operations/v2/ObterResultadosMonitoramentoNovosProcessos.js';
import { ObterResumoProcesso } from '@infrastructure/providers/escavador/operations/v2/ObterResumoProcesso.js';
import { ObterStatusAtualizacaoLote } from '@infrastructure/providers/escavador/operations/v2/ObterStatusAtualizacaoLote.js';
import { ObterStatusAtualizacaoProcesso } from '@infrastructure/providers/escavador/operations/v2/ObterStatusAtualizacaoProcesso.js';
import { ObterStatusResumoProcesso } from '@infrastructure/providers/escavador/operations/v2/ObterStatusResumoProcesso.js';
import { ReenviarCallbackV2 } from '@infrastructure/providers/escavador/operations/v2/ReenviarCallbackV2.js';
import { RemoverAutenticacaoCertificado } from '@infrastructure/providers/escavador/operations/v2/RemoverAutenticacaoCertificado.js';
import { RemoverCertificado } from '@infrastructure/providers/escavador/operations/v2/RemoverCertificado.js';
import { RemoverMonitoramentoNovosProcessos } from '@infrastructure/providers/escavador/operations/v2/RemoverMonitoramentoNovosProcessos.js';
import { RemoverMonitoramentoProcesso } from '@infrastructure/providers/escavador/operations/v2/RemoverMonitoramentoProcesso.js';
import { ResumoProcessosPorAdvogado } from '@infrastructure/providers/escavador/operations/v2/ResumoProcessosPorAdvogado.js';
import { ResumoProcessosPorEnvolvido } from '@infrastructure/providers/escavador/operations/v2/ResumoProcessosPorEnvolvido.js';
import { SolicitarAtualizacaoLote } from '@infrastructure/providers/escavador/operations/v2/SolicitarAtualizacaoLote.js';
import { SolicitarAtualizacaoProcesso } from '@infrastructure/providers/escavador/operations/v2/SolicitarAtualizacaoProcesso.js';
import { SolicitarResumoProcesso } from '@infrastructure/providers/escavador/operations/v2/SolicitarResumoProcesso.js';

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURAÇÃO E INICIALIZAÇÃO
// ═══════════════════════════════════════════════════════════════════════════

/** Constrói cliente HTTP Escavador com autenticação Bearer */
const buildHttp = () => {
  const apiKey = process.env['ESCAVADOR_API_KEY'] ?? '';
  const baseUrl = process.env['ESCAVADOR_BASE_URL'] ?? 'https://api.escavador.com';
  return new EscavadorHttpClient(apiKey, baseUrl, 'escavador');
};

/** Router Hono que centraliza todas as rotas Escavador (V1 e V2) */
const escavador = new Hono();

// ═══════════════════════════════════════════════════════════════════════════
// V1 — ESCAVADOR API V1 — 42 ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════
//
// Rotas legado do Escavador que cobrem: saldo, buscas assíncronas, processos,
// pessoas, instituições, monitoramentos, callbacks, e dados auxiliares (tribunais).
//
// Pattern: Cada rota valida input → executa operation → persiste em rawStore → retorna JSON
// Erros retornam HTTP 500 com { error, kind } estruturado
//

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: SALDO
// ══════════════════════════════════════════════════════════════════════════════════
// Endpoint para consultar créditos/saldo disponível na API Escavador

/**
 * GET /v1/saldo
 *
 * Consulta o saldo de créditos disponíveis na API Escavador.
 * Retorna quantidade de créditos, saldo em R$ e descrição formatada.
 *
 * @route GET /api/escavador/v1/saldo
 * @returns {Object} { quantidade_creditos: number, saldo: number, saldo_descricao: string }
 * @status 200 OK
 * @status 500 Se falhar na API Escavador
 *
 * @example
 * GET /api/escavador/v1/saldo
 * Authorization: Bearer <token>
 *
 * Response:
 * {
 *   "quantidade_creditos": 1500,
 *   "saldo": 15.00,
 *   "saldo_descricao": "R$ 15,00"
 * }
 */
escavador.get('/v1/quantidade-creditos', (c) =>
  handleOp(c, { gateway: 'escavador-v1', fonte: 'saldo', tipo_param: null, param: null }, () =>
    new ObterSaldo(buildHttp()).execute(),
  ),
);

// ──── Buscas Assíncronas — listar e consultar ────

escavador.get('/v1/buscas-assincronas', async (c) => {
  const pagina = Number(c.req.query('page') ?? '1');
  return handleOp(
    c,
    { gateway: 'escavador-v1', fonte: 'buscas-assincronas/listar', tipo_param: null, param: null },
    () => new ListarBuscasAssincronas(buildHttp()).execute({ pagina }),
  );
});

escavador.get('/v1/buscas-assincronas/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);
  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'buscas-assincronas/obter',
      tipo_param: 'id',
      param: String(id),
    },
    () => new ObterBuscaAssincrona(buildHttp()).execute({ id }),
  );
});

// ──── Processos — Buscas Assíncronas (iniciar) ────

escavador.post('/v1/processos/tribunal/cpf-cnpj', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(
    z.object({
      cpf_cnpj: z.string().min(11).max(18),
      tribunais: z.array(z.string()).optional(),
    }),
    body,
  );
  if (!parsed.ok) return c.json({ error: parsed.error, details: parsed.details }, 422);

  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'processos/tribunal/cpf-cnpj',
      tipo_param: 'cpf_cnpj',
      param: parsed.data.cpf_cnpj,
      statusCode: 202,
    },
    () =>
      new IniciarBuscaLote(buildHttp()).execute({
        tipo: 'busca_por_documento',
        cpfCnpj: parsed.data.cpf_cnpj,
        ...(parsed.data.tribunais !== undefined ? { tribunais: parsed.data.tribunais } : {}),
      }),
  );
});

/**
 * POST /v1/processos/tribunal/envolvido
 *
 * Inicia busca de processos por nome de envolvido (pessoa) em tribunais.
 *
 * @route POST /api/escavador/v1/processos/tribunal/envolvido
 * @body {string} nome - Nome da pessoa envolvida
 * @body {string[]} [tribunais] - Array opcional de IDs de tribunais
 * @returns {Object} { id: number, status: 'pending' }
 * @status 202 Accepted
 */
escavador.post('/v1/processos/tribunal/envolvido', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(
    z.object({
      nome: z.string().min(1),
      tribunais: z.array(z.string()).optional(),
    }),
    body,
  );
  if (!parsed.ok) return c.json({ error: parsed.error, details: parsed.details }, 422);

  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'processos/tribunal/envolvido',
      tipo_param: 'nome',
      param: parsed.data.nome,
      statusCode: 202,
    },
    () =>
      new IniciarBuscaLote(buildHttp()).execute({
        tipo: 'busca_por_nome',
        nome: parsed.data.nome,
        ...(parsed.data.tribunais !== undefined ? { tribunais: parsed.data.tribunais } : {}),
      }),
  );
});

/**
 * POST /v1/processos/tribunal/oab
 *
 * Inicia busca de processos por número OAB de advogado em tribunais.
 *
 * @route POST /api/escavador/v1/processos/tribunal/oab
 * @body {string} oab - Número OAB do advogado (ex: "123456/SP")
 * @body {string[]} [tribunais] - Array opcional de IDs de tribunais
 * @returns {Object} { id: number, status: 'pending' }
 * @status 202 Accepted
 */
escavador.post('/v1/processos/tribunal/oab', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(
    z.object({
      numero_oab: z.string().min(1),
      estado_oab: z.string().length(2),
      tribunais: z.array(z.string()).optional(),
    }),
    body,
  );
  if (!parsed.ok) return c.json({ error: parsed.error, details: parsed.details }, 422);

  const op = new IniciarBuscaProcessosOab(buildHttp());
  const input: Parameters<typeof op.execute>[0] = {
    numero_oab: parsed.data.numero_oab,
    estado_oab: parsed.data.estado_oab,
  };
  if (parsed.data.tribunais !== undefined) input.tribunais = parsed.data.tribunais;
  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'processos/tribunal/oab',
      tipo_param: 'numero_oab',
      param: `${parsed.data.numero_oab}/${parsed.data.estado_oab}`,
      statusCode: 202,
    },
    () => op.execute(input),
  );
});

/**
 * POST /v1/processos/administrativo/nup
 *
 * Inicia busca de processo administrativo por NUP (Número Único de Protocolo).
 * Busca em órgãos administrativos, não em tribunais.
 *
 * @route POST /api/escavador/v1/processos/administrativo/nup
 * @body {string} nup - NUP (número único de protocolo)
 * @returns {Object} { id: number, status: 'pending' }
 * @status 202 Accepted
 */
escavador.post('/v1/processos/administrativo/nup', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(z.object({ nup: z.string().min(1) }), body);
  if (!parsed.ok) return c.json({ error: parsed.error, details: parsed.details }, 422);

  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'processos/administrativo/nup',
      tipo_param: 'nup',
      param: parsed.data.nup,
      statusCode: 202,
    },
    () => new IniciarBuscaProcessoNup(buildHttp()).execute({ nup: parsed.data.nup }),
  );
});

/**
 * POST /v1/processos/pesquisar
 *
 * Inicia busca de processo por número CNJ no tribunal.
 *
 * @route POST /api/escavador/v1/processos/pesquisar
 * @body {string} numero_cnj - Número CNJ do processo
 * @body {string[]} [tribunais] - Array opcional de IDs de tribunais
 * @returns {Object} { id: number, status: 'pending' }
 * @status 202 Accepted
 */
escavador.post('/v1/processos/pesquisar', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(
    z.object({
      numero_cnj: z.string().min(1),
    }),
    body,
  );
  if (!parsed.ok) return c.json({ error: parsed.error, details: parsed.details }, 422);

  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'processos/pesquisar',
      tipo_param: 'numero_cnj',
      param: parsed.data.numero_cnj,
      statusCode: 202,
    },
    () => new IniciarBuscaProcesso(buildHttp()).execute({ numero_cnj: parsed.data.numero_cnj }),
  );
});

escavador.post('/v1/processos/tribunal/lote', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(
    z.object({
      tipo: z.enum(['busca_por_nome', 'busca_por_documento', 'busca_por_oab']),
      tribunais: z.array(z.string()).min(1),
      nome: z.string().optional(),
      numero_documento: z.string().optional(),
      numero_oab: z.string().optional(),
      estado_oab: z.string().optional(),
    }),
    body,
  );
  if (!parsed.ok) return c.json({ error: parsed.error, details: parsed.details }, 422);

  const op = new IniciarBuscaProcessosLote(buildHttp());
  const input: Parameters<typeof op.execute>[0] = {
    tipo: parsed.data.tipo,
    tribunais: parsed.data.tribunais,
    ...(parsed.data.nome !== undefined && { nome: parsed.data.nome }),
    ...(parsed.data.numero_documento !== undefined && {
      numero_documento: parsed.data.numero_documento,
    }),
    ...(parsed.data.numero_oab !== undefined && { numero_oab: parsed.data.numero_oab }),
    ...(parsed.data.estado_oab !== undefined && { estado_oab: parsed.data.estado_oab }),
  };
  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'processos/tribunal/lote',
      tipo_param: null,
      param: null,
      statusCode: 202,
    },
    () => op.execute(input),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: PROCESSOS — DIÁRIOS OFICIAIS (2 GET endpoints)
// ══════════════════════════════════════════════════════════════════════════════════
// Busca de processos em diários oficiais públicos (pesquisa síncrona).

/**
 * GET /v1/processos/diarios-oficiais/numero
 *
 * Busca processos em diários oficiais por número.
 *
 * @route GET /api/escavador/v1/processos/diarios-oficiais/numero?numero=<número>
 * @queryParam {string} numero - Número do processo (obrigatório)
 * @returns {Array} Array de processos encontrados em diários
 * @status 200 OK
 * @status 400 Parâmetro numero ausente
 */
escavador.get('/v1/processos/diarios-oficiais/numero', async (c) => {
  const numero = c.req.query('numero') ?? '';
  if (!numero) return c.json({ error: 'Parâmetro numero obrigatório' }, 400);

  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'processos/diarios-oficiais/numero',
      tipo_param: 'numero',
      param: numero,
    },
    () => new BuscarProcessosDiarioPorNumero(buildHttp()).execute({ numero }),
  );
});

/**
 * GET /v1/processos/diarios-oficiais/oab
 *
 * Busca processos em diários oficiais por número OAB de advogado.
 *
 * @route GET /api/escavador/v1/processos/diarios-oficiais/oab?oab=<oab>
 * @queryParam {string} oab - Número OAB (obrigatório)
 * @returns {Array} Array de processos encontrados
 * @status 200 OK
 */
escavador.get('/v1/processos/diarios-oficiais/oab', async (c) => {
  const oab = c.req.query('oab') ?? '';
  if (!oab) return c.json({ error: 'Parâmetro oab obrigatório' }, 400);

  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'processos/diarios-oficiais/oab',
      tipo_param: 'oab',
      param: oab,
    },
    () => new BuscarProcessosDiarioPorOab(buildHttp()).execute({ oab }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: PROCESSOS — DETALHES (3 GET endpoints)
// ══════════════════════════════════════════════════════════════════════════════════
// Recuperação de detalhes, movimentações e envolvidos de processos.

/**
 * GET /v1/processos/:numero_cnj
 *
 * Obter detalhes completos de um processo pelo número CNJ.
 *
 * @route GET /api/escavador/v1/processos/{numero_cnj}
 * @param {string} numero_cnj - Número CNJ do processo
 * @returns {Object} Detalhes completos do processo
 * @status 200 OK
 */
escavador.get('/v1/processos/:numero_cnj', async (c) => {
  const numeroCnj = c.req.param('numero_cnj');
  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'processos/obter',
      tipo_param: 'numero_cnj',
      param: numeroCnj,
    },
    () => new ObterDetalhesProcesso(buildHttp()).execute({ numeroCnj }),
  );
});

/**
 * GET /v1/processos/:numero_cnj/movimentacoes
 *
 * Listar movimentações (updates) de um processo com paginação.
 *
 * @route GET /api/escavador/v1/processos/{numero_cnj}/movimentacoes?page=1
 * @param {string} numero_cnj - Número CNJ
 * @queryParam {number} page - Página (padrão: 1)
 * @returns {Array} Array de movimentações
 * @status 200 OK
 */
escavador.get('/v1/processos/:numero_cnj/movimentacoes', async (c) => {
  const numeroCnj = c.req.param('numero_cnj');
  const pagina = Number(c.req.query('page') ?? '1');
  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'processos/movimentacoes',
      tipo_param: 'numero_cnj',
      param: numeroCnj,
    },
    () => new ObterMovimentacoesProcesso(buildHttp()).execute({ numeroCnj, pagina }),
  );
});

/**
 * GET /v1/processos/:id/envolvidos-diarios
 *
 * Listar partes envolvidas extraídas de diários oficiais de um processo.
 *
 * @route GET /api/escavador/v1/processos/{id}/envolvidos-diarios
 * @param {number} id - ID do processo
 * @returns {Array} Array de envolvidos
 * @status 200 OK
 * @status 400 ID inválido (não é número)
 */
escavador.get('/v1/processos/:id/envolvidos-diarios', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'processos/envolvidos-diarios',
      tipo_param: 'id',
      param: String(id),
    },
    () => new ObterEnvolvidosProcesso(buildHttp()).execute({ id }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: MOVIMENTAÇÕES (1 GET endpoint)
// ══════════════════════════════════════════════════════════════════════════════════

/**
 * GET /v1/movimentacoes/:id
 *
 * Obter detalhes de uma movimentação específica de processo.
 *
 * @route GET /api/escavador/v1/movimentacoes/{id}
 * @param {number} id - ID da movimentação
 * @returns {Object} Detalhes da movimentação
 * @status 200 OK
 */
escavador.get('/v1/movimentacoes/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  return handleOp(
    c,
    { gateway: 'escavador-v1', fonte: 'movimentacoes/obter', tipo_param: 'id', param: String(id) },
    () => new ObterMovimentacao(buildHttp()).execute({ id }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: BUSCA GERAL (1 GET endpoint — Full Text Search)
// ══════════════════════════════════════════════════════════════════════════════════

/**
 * GET /v1/busca
 *
 * Full-text search em toda a base do Escavador (processos, pessoas, instituições).
 *
 * @route GET /api/escavador/v1/busca?q=<query>&tipo=pessoa&page=1
 * @queryParam {string} q - Termo de busca (obrigatório)
 * @queryParam {string} [tipo] - Filtro tipo: 'pessoa', 'processo', 'instituicao' (opcional)
 * @queryParam {number} [page] - Página (padrão: 1)
 * @returns {Array} Array de resultados
 * @status 200 OK
 */
escavador.get('/v1/busca', async (c) => {
  const query = c.req.query('q') ?? '';
  if (!query) return c.json({ error: 'Parâmetro q obrigatório' }, 400);

  const tipoRaw = c.req.query('tipo');
  const pagina = Number(c.req.query('page') ?? '1');

  const op = new BuscarGeral(buildHttp());
  const input: Parameters<typeof op.execute>[0] = { query, pagina };
  if (tipoRaw === 'pessoa' || tipoRaw === 'processo' || tipoRaw === 'instituicao')
    input.tipo = tipoRaw;
  return handleOp(
    c,
    { gateway: 'escavador-v1', fonte: 'busca', tipo_param: 'query', param: query },
    () => op.execute(input),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: PESSOAS (3 GET endpoints)
// ══════════════════════════════════════════════════════════════════════════════════
// Endpoints para consultar dados de pessoas e seu envolvimento em processos.

/**
 * GET /v1/pessoas/:id
 *
 * Obter dados de uma pessoa específica (nome, dados públicos, etc).
 *
 * @route GET /api/escavador/v1/pessoas/{id}
 * @param {number} id - ID da pessoa
 * @returns {Object} Dados públicos da pessoa
 * @status 200 OK
 */
escavador.get('/v1/pessoas/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  return handleOp(
    c,
    { gateway: 'escavador-v1', fonte: 'pessoas/obter', tipo_param: 'id', param: String(id) },
    () => new ObterPessoa(buildHttp()).execute({ id }),
  );
});

/**
 * GET /v1/pessoas/:id/processos
 *
 * Listar todos os processos envolvendo uma pessoa com paginação.
 *
 * @route GET /api/escavador/v1/pessoas/{id}/processos?page=1
 * @param {number} id - ID da pessoa
 * @queryParam {number} [page] - Página (padrão: 1)
 * @returns {Array} Array de processos
 */
escavador.get('/v1/pessoas/:id/processos', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const pagina = Number(c.req.query('page') ?? '1');
  return handleOp(
    c,
    { gateway: 'escavador-v1', fonte: 'pessoas/processos', tipo_param: 'id', param: String(id) },
    () => new ObterProcessosPessoa(buildHttp()).execute({ id, pagina }),
  );
});

/**
 * GET /v1/pessoas/:id/publicacoes
 *
 * Listar publicações em diários oficiais envolvendo uma pessoa.
 *
 * @route GET /api/escavador/v1/pessoas/{id}/publicacoes?page=1
 * @param {number} id - ID da pessoa
 * @queryParam {number} [page] - Página (padrão: 1)
 * @returns {Array} Array de publicações
 */
escavador.get('/v1/pessoas/:id/publicacoes', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const pagina = Number(c.req.query('page') ?? '1');
  return handleOp(
    c,
    { gateway: 'escavador-v1', fonte: 'pessoas/publicacoes', tipo_param: 'id', param: String(id) },
    () => new BuscarPublicacoes(buildHttp()).execute({ entidadeId: id, pagina }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: INSTITUIÇÕES (3 GET endpoints)
// ══════════════════════════════════════════════════════════════════════════════════

/**
 * GET /v1/instituicoes/:id
 *
 * Obter dados de uma instituição (nome, tipo, contatos, etc).
 *
 * @route GET /api/escavador/v1/instituicoes/{id}
 * @param {number} id - ID da instituição
 * @returns {Object} Dados públicos da instituição
 * @status 200 OK
 */
escavador.get('/v1/instituicoes/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  return handleOp(
    c,
    { gateway: 'escavador-v1', fonte: 'instituicoes/obter', tipo_param: 'id', param: String(id) },
    () => new ObterInstituicao(buildHttp()).execute({ id }),
  );
});

/**
 * GET /v1/instituicoes/:id/pessoas
 *
 * Listar pessoas associadas a uma instituição.
 *
 * @route GET /api/escavador/v1/instituicoes/{id}/pessoas?page=1
 */
escavador.get('/v1/instituicoes/:id/pessoas', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const pagina = Number(c.req.query('page') ?? '1');
  return handleOp(
    c,
    { gateway: 'escavador-v1', fonte: 'instituicoes/pessoas', tipo_param: 'id', param: String(id) },
    () => new ObterPessoasInstituicao(buildHttp()).execute({ id, pagina }),
  );
});

/**
 * GET /v1/instituicoes/:id/processos
 *
 * Listar processos envolvendo uma instituição.
 *
 * @route GET /api/escavador/v1/instituicoes/{id}/processos?page=1
 */
escavador.get('/v1/instituicoes/:id/processos', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const pagina = Number(c.req.query('page') ?? '1');
  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'instituicoes/processos',
      tipo_param: 'id',
      param: String(id),
    },
    () => new ObterProcessosInstituicao(buildHttp()).execute({ id, pagina }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: MONITORAMENTOS DIÁRIOS OFICIAIS (8 endpoints: 1 GET, 1 POST, 1 GET:id, etc)
// ══════════════════════════════════════════════════════════════════════════════════
// Monitorar publicações em diários oficiais com callbacks automáticos quando detectadas.

const CriarMonitoramentoSchema = z.object({
  nome: z.string().min(1),
  tipo: z.string().min(1),
  identificador: z.string().min(1),
  callback_url: z.string().url().optional(),
  tribunais: z.array(z.number().int()).optional(),
});

const EditarMonitoramentoSchema = z.object({
  ativo: z.boolean().optional(),
  callback_url: z.string().url().optional(),
  nome: z.string().optional(),
});

const CriarMonitoramentoTribunalSchema = z.object({
  tipo: z.string().min(1),
  identificador: z.string().min(1),
  tribunal: z.number().int(),
  callback_url: z.string().url().optional(),
});

const EditarMonitoramentoTribunalSchema = z.object({
  ativo: z.boolean().optional(),
  callback_url: z.string().url().optional(),
});

/**
 * GET /v1/monitoramentos
 *
 * Listar monitoramentos de diários oficiais com filtro opcional ativo/inativos.
 *
 * @route GET /api/escavador/v1/monitoramentos?page=1&ativo=true
 * @queryParam {number} [page] - Página (padrão: 1)
 * @queryParam {boolean} [ativo] - Filtro por status ativo (true/false)
 * @returns {Array} Array de monitoramentos
 */
escavador.get('/v1/monitoramentos', async (c) => {
  const pagina = Number(c.req.query('page') ?? '1');
  const ativoRaw = c.req.query('ativo');
  const ativo = ativoRaw === 'true' ? true : ativoRaw === 'false' ? false : undefined;

  const op = new ListarMonitoramentos(buildHttp());
  const input: Parameters<typeof op.execute>[0] = { pagina };
  if (ativo !== undefined) input.ativo = ativo;
  return handleOp(
    c,
    { gateway: 'escavador-v1', fonte: 'monitoramentos/listar', tipo_param: null, param: null },
    () => op.execute(input),
  );
});

/**
 * POST /v1/monitoramentos
 *
 * Criar novo monitoramento de diário oficial.
 *
 * @route POST /api/escavador/v1/monitoramentos
 * @body {string} nome - Nome do monitoramento
 * @body {string} tipo - Tipo de monitoramento (ex: "entrada", "publicacao")
 * @body {string} identificador - Identificador a monitorar
 * @body {string} [callback_url] - URL para webhook callback
 * @body {number[]} [tribunais] - Array de IDs de tribunais
 * @returns {Object} Monitoramento criado
 * @status 201 Created
 */
escavador.post('/v1/monitoramentos', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(CriarMonitoramentoSchema, body);
  if (!parsed.ok) return c.json({ error: parsed.error, details: parsed.details }, 422);

  const op = new CriarMonitoramento(buildHttp());
  const input: Parameters<typeof op.execute>[0] = {
    nome: parsed.data.nome,
    tipo: parsed.data.tipo,
    identificador: parsed.data.identificador,
  };
  if (parsed.data.callback_url !== undefined) input.callback_url = parsed.data.callback_url;
  if (parsed.data.tribunais !== undefined) input.tribunais = parsed.data.tribunais;
  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'monitoramentos/criar',
      tipo_param: null,
      param: null,
      statusCode: 201,
    },
    () => op.execute(input),
  );
});

escavador.get('/v1/monitoramentos/tribunal', async (c) => {
  const pagina = Number(c.req.query('page') ?? '1');
  const ativoRaw = c.req.query('ativo');
  const ativo = ativoRaw === 'true' ? true : ativoRaw === 'false' ? false : undefined;

  const op = new ListarMonitoramentosTribunal(buildHttp());
  const input: Parameters<typeof op.execute>[0] = { pagina };
  if (ativo !== undefined) input.ativo = ativo;
  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'monitoramentos/tribunal/listar',
      tipo_param: null,
      param: null,
    },
    () => op.execute(input),
  );
});

escavador.post('/v1/monitoramentos/tribunal', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(CriarMonitoramentoTribunalSchema, body);
  if (!parsed.ok) return c.json({ error: parsed.error, details: parsed.details }, 422);

  const op = new CriarMonitoramentoTribunal(buildHttp());
  const input: Parameters<typeof op.execute>[0] = {
    tipo: parsed.data.tipo,
    identificador: parsed.data.identificador,
    tribunal: parsed.data.tribunal,
  };
  if (parsed.data.callback_url !== undefined) input.callback_url = parsed.data.callback_url;
  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'monitoramentos/tribunal/criar',
      tipo_param: null,
      param: null,
      statusCode: 201,
    },
    () => op.execute(input),
  );
});

escavador.get('/v1/monitoramentos/tribunal/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'monitoramentos/tribunal/obter',
      tipo_param: 'id',
      param: String(id),
    },
    () => new ObterMonitoramentoTribunal(buildHttp()).execute({ id }),
  );
});

escavador.put('/v1/monitoramentos/tribunal/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(EditarMonitoramentoTribunalSchema, body);
  if (!parsed.ok) return c.json({ error: parsed.error, details: parsed.details }, 422);

  const op = new EditarMonitoramentoTribunal(buildHttp());
  const input: Parameters<typeof op.execute>[0] = { id };
  if (parsed.data.ativo !== undefined) input.ativo = parsed.data.ativo;
  if (parsed.data.callback_url !== undefined) input.callback_url = parsed.data.callback_url;
  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'monitoramentos/tribunal/editar',
      tipo_param: 'id',
      param: String(id),
    },
    () => op.execute(input),
  );
});

escavador.delete('/v1/monitoramentos/tribunal/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);
  return handleOpVoid(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'monitoramentos/tribunal/remover',
      tipo_param: 'id',
      param: String(id),
    },
    () => new RemoverMonitoramentoTribunal(buildHttp()).execute({ id }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: MONITORAMENTOS — :id routes
// ══════════════════════════════════════════════════════════════════════════════════

escavador.get('/v1/monitoramentos/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  return handleOp(
    c,
    { gateway: 'escavador-v1', fonte: 'monitoramentos/obter', tipo_param: 'id', param: String(id) },
    () => new ObterMonitoramento(buildHttp()).execute({ id }),
  );
});

escavador.put('/v1/monitoramentos/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(EditarMonitoramentoSchema, body);
  if (!parsed.ok) return c.json({ error: parsed.error, details: parsed.details }, 422);

  const op = new EditarMonitoramento(buildHttp());
  const input: Parameters<typeof op.execute>[0] = { id };
  if (parsed.data.ativo !== undefined) input.ativo = parsed.data.ativo;
  if (parsed.data.callback_url !== undefined) input.callback_url = parsed.data.callback_url;
  if (parsed.data.nome !== undefined) input.nome = parsed.data.nome;
  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'monitoramentos/editar',
      tipo_param: 'id',
      param: String(id),
    },
    () => op.execute(input),
  );
});

escavador.delete('/v1/monitoramentos/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);
  return handleOpVoid(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'monitoramentos/remover',
      tipo_param: 'id',
      param: String(id),
    },
    () => new RemoverMonitoramento(buildHttp()).execute({ id }),
  );
});

escavador.get('/v1/monitoramentos/:id/aparicoes', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const pagina = Number(c.req.query('page') ?? '1');
  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'monitoramentos/aparicoes',
      tipo_param: 'id',
      param: String(id),
    },
    () => new ObterAparicoes(buildHttp()).execute({ id, pagina }),
  );
});

escavador.post('/v1/monitoramentos/:id/testar-callback', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);
  return handleOpVoid(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'monitoramentos/testar-callback',
      tipo_param: 'id',
      param: String(id),
    },
    () => new TestarCallbackMonitoramento(buildHttp()).execute({ id }),
  );
});

escavador.get('/v1/monitoramentos/:id/origens', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'monitoramentos/origens',
      tipo_param: 'id',
      param: String(id),
    },
    () => new ObterOrigensMonitoramento(buildHttp()).execute({ id }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: CALLBACKS V1 (3 endpoints)
// ══════════════════════════════════════════════════════════════════════════════════
// Gerenciar callbacks enviados pelo Escavador (webhooks quando monitoramento detecta).

/**
 * GET /v1/callbacks
 *
 * Listar callbacks recebidos do Escavador.
 *
 * @route GET /api/escavador/v1/callback?page=1
 * @queryParam {number} [page] - Página (padrão: 1)
 * @returns {Array} Array de callbacks
 */
escavador.get('/v1/callbacks', async (c) => {
  const pagina = Number(c.req.query('page') ?? '1');
  return handleOp(
    c,
    { gateway: 'escavador-v1', fonte: 'callbacks/listar', tipo_param: null, param: null },
    () => new ListarCallbacks(buildHttp()).execute({ pagina }),
  );
});

escavador.post('/v1/callbacks/recebidos', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(z.object({ ids: z.array(z.number().int()).min(1) }), body);
  if (!parsed.ok) return c.json({ error: parsed.error, details: parsed.details }, 422);

  return handleOpVoid(
    c,
    { gateway: 'escavador-v1', fonte: 'callbacks/recebidos', tipo_param: null, param: null },
    () => new MarcarCallbacksRecebidos(buildHttp()).execute({ ids: parsed.data.ids }),
  );
});

escavador.post('/v1/callbacks/:id/reenviar', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  return handleOp(
    c,
    { gateway: 'escavador-v1', fonte: 'callbacks/reenviar', tipo_param: 'id', param: String(id) },
    () => new ReenviarCallback(buildHttp()).execute({ id }),
  );
});

// ══════════════════════════════════════════════════════════════════════════════════
// SEÇÃO: AUXILIARES (4 GET endpoints)
// ══════════════════════════════════════════════════════════════════════════════════
// Dados de suporte: tribunais, órgãos administrativos, diários.

/**
 * GET /v1/tribunais
 *
 * Listar todos os tribunais disponíveis no Escavador.
 *
 * @route GET /api/escavador/v1/tribunais?tipo=<tipo>
 * @queryParam {string} [tipo] - Filtro por tipo de tribunal (opcional)
 * @returns {Array} Array de tribunais
 */
escavador.get('/v1/tribunais', async (c) => {
  const tipo = c.req.query('tipo');
  const op = new ListarTribunais(buildHttp());
  const input: { tipo?: string } = {};
  if (tipo !== undefined) input.tipo = tipo;
  return handleOp(
    c,
    { gateway: 'escavador-v1', fonte: 'tribunais/listar', tipo_param: null, param: null },
    () => op.execute(input),
  );
});

escavador.get('/v1/tribunais/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  return handleOp(
    c,
    { gateway: 'escavador-v1', fonte: 'tribunais/obter', tipo_param: 'id', param: String(id) },
    () => new ObterTribunal(buildHttp()).execute({ id }),
  );
});

escavador.get('/v1/orgaos-administrativos', async (c) => {
  const pagina = Number(c.req.query('page') ?? '1');
  return handleOp(
    c,
    {
      gateway: 'escavador-v1',
      fonte: 'orgaos-administrativos/listar',
      tipo_param: null,
      param: null,
    },
    () => new ListarOrgaosAdministrativos(buildHttp()).execute({ pagina }),
  );
});

escavador.get('/v1/diarios-oficiais/origens', async (c) => {
  const estado = c.req.query('estado');
  const op = new ListarOrigensDiariosOficiais(buildHttp());
  const input: { estado?: string } = {};
  if (estado !== undefined) input.estado = estado;
  return handleOp(
    c,
    { gateway: 'escavador-v1', fonte: 'diarios-oficiais/origens', tipo_param: null, param: null },
    () => op.execute(input),
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// V2 — Escavador API v2
// ═══════════════════════════════════════════════════════════════════════════

// ──── Consulta de Processos ────

/**
 * @route GET /v2/processos/numero_cnj/:numero
 * @description Obter detalhes completos de um processo específico por número CNJ
 * @param {string} numero - Número único CNJ do processo (ex: 0000001-00.0000.0.00.0000)
 * @returns {Object} Detalhes do processo (número, status, partes, datas importantes, movimentações resumidas)
 * @status 200 - Processo encontrado e retornado com sucesso
 * @status 400 - Número de processo inválido
 * @status 500 - Erro ao consultar API Escavador
 * @example
 * // Requisição
 * GET /api/escavador/v2/processos/numero_cnj/0000001-00.0000.0.00.0000
 * // Resposta (200)
 * {
 *   "numero": "0000001-00.0000.0.00.0000",
 *   "status": "Ativo",
 *   "tribunal": "TJ/SP",
 *   "partes": [...],
 *   "datas": { "distribuicao": "2022-01-15", "ultima_atualizacao": "2024-05-25" }
 * }
 */
escavador.get('/v2/processos/numero_cnj/:numero', async (c) => {
  const numero = c.req.param('numero');
  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/processos/obter',
      tipo_param: 'numero_cnj',
      param: numero,
    },
    () => new ObterProcessoPorCnj(buildHttp()).execute({ numero }),
  );
});

/**
 * @route GET /v2/processos/movimentacoes/:numero_cnj
 * @description Listar todas as movimentações (atualizações) de um processo específico com paginação
 * @param {string} numero_cnj - Número CNJ do processo
 * @queryParam {number} page - Número da página (padrão: 1)
 * @returns {Array} Array de movimentações do processo com datas, tipos e descrições
 * @status 200 - Movimentações encontradas e listadas
 * @status 400 - Número CNJ inválido
 * @status 500 - Erro ao consultar API Escavador
 * @example
 * // Requisição
 * GET /api/escavador/v2/processos/movimentacoes/0000001-00.0000.0.00.0000?page=1
 * // Resposta (200)
 * {
 *   "data": [
 *     { "id": 123, "tipo": "Sentença", "data": "2024-05-20", "descricao": "Sentença prolatada..." },
 *     { "id": 122, "tipo": "Audiência", "data": "2024-04-15", "descricao": "Audiência realizada..." }
 *   ],
 *   "pagination": { "page": 1, "total": 45, "por_pagina": 20 }
 * }
 */
escavador.get('/v2/processos/movimentacoes/:numero_cnj', async (c) => {
  const numero_cnj = c.req.param('numero_cnj');
  const pagina = Number(c.req.query('page') ?? '1');
  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/processos/movimentacoes',
      tipo_param: 'numero_cnj',
      param: numero_cnj,
    },
    () => new ObterMovimentacoesV2(buildHttp()).execute({ numero_cnj, pagina }),
  );
});

/**
 * @route GET /v2/processos/envolvido
 * @description Buscar processos por envolvido (pessoa ou empresa) — filtro por nome ou CPF/CNPJ com paginação
 * @queryParam {string} [nome] - Nome da pessoa/empresa a buscar
 * @queryParam {string} [cpf_cnpj] - CPF ou CNPJ (formato com pontos/hífens)
 * @queryParam {number} page - Número da página (padrão: 1)
 * @returns {Array} Array de processos envolvendo a pessoa/empresa
 * @status 200 - Processos encontrados (pode ser array vazio)
 * @status 400 - Nome ou CPF/CNPJ inválido
 * @status 500 - Erro ao consultar API Escavador
 * @example
 * // Requisição por nome
 * GET /api/escavador/v2/processos/envolvido?nome=João%20Silva&page=1
 * // Requisição por CPF
 * GET /api/escavador/v2/processos/envolvido?cpf_cnpj=XXX.XXX.XXX-XX
 * // Resposta (200)
 * {
 *   "data": [{ "id": 1, "numero_cnj": "0000001-00...", "tribunal": "TJ/SP", "status": "Ativo" }],
 *   "pagination": { "page": 1, "total": 25, "por_pagina": 20 }
 * }
 */
escavador.get('/v2/envolvido/processos', async (c) => {
  const op = new BuscarProcessosPorEnvolvido(buildHttp());
  const input: Parameters<typeof op.execute>[0] = {};
  const nome = c.req.query('nome');
  const cpf_cnpj = c.req.query('cpf_cnpj');
  const cursor = c.req.query('cursor');
  const li = c.req.query('li');
  if (nome !== undefined) input.nome = nome;
  if (cpf_cnpj !== undefined) input.cpf_cnpj = cpf_cnpj;
  if (cursor !== undefined) input.cursor = cursor;
  if (li !== undefined) input.li = li;
  const tipoParam = cpf_cnpj !== undefined ? 'cpf_cnpj' : nome !== undefined ? 'nome' : null;
  const paramVal = cpf_cnpj ?? nome ?? null;
  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/processos/envolvido',
      tipo_param: tipoParam,
      param: paramVal,
    },
    () => op.execute(input),
  );
});

/**
 * @route GET /v2/processos/envolvido/resumo
 * @description Obter resumo estatístico de processos envolvendo uma pessoa/empresa (sem listar processos individuais)
 * @queryParam {string} [nome] - Nome da pessoa/empresa
 * @queryParam {string} [cpf_cnpj] - CPF ou CNPJ
 * @returns {Object} Resumo com: total de processos, distribuição por tipo, status, valor total em disputa
 * @status 200 - Resumo obtido com sucesso
 * @status 400 - Parâmetros inválidos
 * @status 500 - Erro ao consultar API Escavador
 * @example
 * GET /api/escavador/v2/processos/envolvido/resumo?nome=Empresa%20Ltda
 * // Resposta (200)
 * {
 *   "total_processos": 12,
 *   "por_tipo": { "cível": 8, "trabalhista": 3, "criminal": 1 },
 *   "por_status": { "ativo": 10, "finalizado": 2 },
 *   "valor_total_disputa": 5500000.50
 * }
 */
escavador.get('/v2/envolvido/resumo', async (c) => {
  const op = new ResumoProcessosPorEnvolvido(buildHttp());
  const input: Parameters<typeof op.execute>[0] = {};
  const nome = c.req.query('nome');
  const cpf_cnpj = c.req.query('cpf_cnpj');
  if (nome !== undefined) input.nome = nome;
  if (cpf_cnpj !== undefined) input.cpf_cnpj = cpf_cnpj;
  const tipoParam = cpf_cnpj !== undefined ? 'cpf_cnpj' : nome !== undefined ? 'nome' : null;
  const paramVal = cpf_cnpj ?? nome ?? null;
  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/processos/envolvido/resumo',
      tipo_param: tipoParam,
      param: paramVal,
    },
    () => op.execute(input),
  );
});

/**
 * @route GET /v2/processos/advogado/:oab
 * @description Listar processos de um advogado específico por número OAB com paginação
 * @param {string} oab - Número OAB do advogado (formato: XXXXXX/Estado ou XXXXXX)
 * @queryParam {number} page - Número da página (padrão: 1)
 * @returns {Array} Array de processos onde o advogado atuou
 * @status 200 - Processos encontrados
 * @status 400 - Número OAB inválido
 * @status 500 - Erro ao consultar API Escavador
 * @example
 * GET /api/escavador/v2/processos/advogado/123456/SP?page=1
 * // Resposta (200)
 * {
 *   "data": [{ "id": 1, "numero_cnj": "0000001-00...", "tribunal": "TJ/SP", "atuacao": "Réu" }],
 *   "pagination": { "page": 1, "total": 45, "por_pagina": 20 }
 * }
 */
escavador.get('/v2/processos/advogado', async (c) => {
  const oab_numero = c.req.query('oab_numero') ?? '';
  const oab_estado = c.req.query('oab_estado');
  const oab_tipo = c.req.query('oab_tipo');
  const pagina = Number(c.req.query('page') ?? '1');
  if (!oab_numero) return c.json({ error: 'Parâmetro oab_numero obrigatório' }, 400);
  const param = oab_estado ? `${oab_numero}/${oab_estado}` : oab_numero;
  return handleOp(
    c,
    { gateway: 'escavador-v2', fonte: 'v2/processos/advogado', tipo_param: 'oab', param },
    () =>
      new BuscarProcessosPorAdvogado(buildHttp()).execute({
        oab_numero,
        ...(oab_estado && { oab_estado }),
        ...(oab_tipo && { oab_tipo }),
        pagina,
      }),
  );
});

/**
 * @route GET /v2/processos/advogado/:oab/resumo
 * @description Obter resumo estatístico de processos de um advogado (sem listar individuais)
 * @param {string} oab - Número OAB do advogado
 * @returns {Object} Resumo com: total de processos, distribuição por tipo, tribunais principais, valor em disputa
 * @status 200 - Resumo obtido com sucesso
 * @status 400 - OAB inválido
 * @status 500 - Erro ao consultar API Escavador
 * @example
 * GET /api/escavador/v2/processos/advogado/123456/SP/resumo
 * // Resposta (200)
 * {
 *   "total_processos": 87,
 *   "por_tipo": { "cível": 65, "trabalhista": 15, "criminal": 7 },
 *   "tribunais_principais": ["TJ/SP", "STF", "TST"],
 *   "valor_total": 12500000.75
 * }
 */
escavador.get('/v2/processos/advogado/resumo', async (c) => {
  const oab_numero = c.req.query('oab_numero') ?? '';
  const oab_estado = c.req.query('oab_estado');
  if (!oab_numero) return c.json({ error: 'Parâmetro oab_numero obrigatório' }, 400);
  const param = oab_estado ? `${oab_numero}/${oab_estado}` : oab_numero;
  return handleOp(
    c,
    { gateway: 'escavador-v2', fonte: 'v2/processos/advogado/resumo', tipo_param: 'oab', param },
    () =>
      new ResumoProcessosPorAdvogado(buildHttp()).execute({
        oab: oab_numero,
        ...(oab_estado && { oab_estado }),
      }),
  );
});

/**
 * @route GET /v2/processos/:numero_cnj/documentos
 * @description Listar todos os documentos públicos (petições, sentências, etc.) de um processo com paginação
 * @param {string} numero_cnj - Número CNJ do processo
 * @queryParam {number} page - Número da página (padrão: 1)
 * @returns {Array} Array de documentos com metadata (tipo, data, tamanho, URL download)
 * @status 200 - Documentos encontrados (pode ser array vazio se processo não tem documentos públicos)
 * @status 400 - CNJ inválido
 * @status 500 - Erro ao consultar API Escavador
 * @example
 * GET /api/escavador/v2/processos/0000001-00.0000.0.00.0000/documentos?page=1
 * // Resposta (200)
 * {
 *   "data": [
 *     { "id": 1, "tipo": "Sentença", "data": "2024-05-20", "tamanho_kb": 245, "url_download": "/v2/documentos/1/download" },
 *     { "id": 2, "tipo": "Petição", "data": "2024-04-15", "tamanho_kb": 120, "url_download": "/v2/documentos/2/download" }
 *   ],
 *   "pagination": { "page": 1, "total": 8, "por_pagina": 20 }
 * }
 */
escavador.get('/v2/processos/:numero_cnj/documentos', async (c) => {
  const numero_cnj = c.req.param('numero_cnj');
  const pagina = Number(c.req.query('page') ?? '1');
  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/processos/documentos',
      tipo_param: 'numero_cnj',
      param: numero_cnj,
    },
    () => new ObterDocumentosProcesso(buildHttp()).execute({ numero_cnj, pagina }),
  );
});

/**
 * @route GET /v2/processos/:numero_cnj/autos
 * @description Listar autos (case files/volumes) de um processo com metadados e paginação
 * @param {string} numero_cnj - Número CNJ do processo
 * @queryParam {number} page - Número da página (padrão: 1)
 * @returns {Array} Array de autos com: número do auto, data de abertura, quantidade de folhas, documentos
 * @status 200 - Autos encontrados
 * @status 400 - CNJ inválido
 * @status 500 - Erro ao consultar API Escavador
 * @example
 * GET /api/escavador/v2/processos/0000001-00.0000.0.00.0000/autos?page=1
 * // Resposta (200)
 * {
 *   "data": [
 *     { "id": 1, "numero": "001", "data_abertura": "2022-01-15", "folhas": 45 },
 *     { "id": 2, "numero": "002", "data_abertura": "2023-06-22", "folhas": 67 }
 *   ],
 *   "pagination": { "page": 1, "total": 3, "por_pagina": 20 }
 * }
 */
escavador.get('/v2/processos/:numero_cnj/autos', async (c) => {
  const numero_cnj = c.req.param('numero_cnj');
  const pagina = Number(c.req.query('page') ?? '1');
  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/processos/autos',
      tipo_param: 'numero_cnj',
      param: numero_cnj,
    },
    () => new ObterAutosProcesso(buildHttp()).execute({ numero_cnj, pagina }),
  );
});

/**
 * @route GET /v2/processos/:numero_cnj/envolvidos
 * @description Listar todas as partes envolvidas (litigantes, advogados, terceiros) em um processo
 * @param {string} numero_cnj - Número CNJ do processo
 * @returns {Object} Estrutura com: partes, advogados, representantes, terceiros interessados com seus dados de contato
 * @status 200 - Envolvidos encontrados
 * @status 400 - CNJ inválido
 * @status 500 - Erro ao consultar API Escavador
 * @example
 * GET /api/escavador/v2/processos/0000001-00.0000.0.00.0000/envolvidos
 * // Resposta (200)
 * {
 *   "partes": [
 *     { "id": 1, "tipo": "Autor", "nome": "João Silva", "cpf": "XXX.XXX.XXX-XX", "advogado": "Dr. Pedro" },
 *     { "id": 2, "tipo": "Réu", "nome": "Empresa XYZ LTDA", "cnpj": "XX.XXX.XXX/XXXX-XX" }
 *   ],
 *   "terceiros": [{ "id": 3, "tipo": "Interbancário", "nome": "Banco ABC" }]
 * }
 */
escavador.get('/v2/processos/:numero_cnj/envolvidos', async (c) => {
  const numero_cnj = c.req.param('numero_cnj');
  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/processos/envolvidos',
      tipo_param: 'numero_cnj',
      param: numero_cnj,
    },
    () => new ObterEnvolvidosProcessoV2(buildHttp()).execute({ numero_cnj }),
  );
});

// ──── Atualização de Processos V2 ────

/**
 * @route POST /v2/processos/atualizacao
 * @description Solicitar atualização em lote de múltiplos processos (operação assíncrona)
 * @param {Array<number>} processos_ids - Array de IDs dos processos a atualizar (mínimo 1)
 * @returns {Object} Status da solicitação de atualização com ID do batch e timestamp
 * @status 202 - Solicitação aceita e enfileirada
 * @status 400 - Body inválido
 * @status 422 - Payload não atende aos critérios de validação
 * @status 500 - Erro ao processar solicitação
 * @example
 * POST /api/escavador/v2/processos/atualizacao
 * {
 *   "processos_ids": [123, 456, 789]
 * }
 * // Resposta (202)
 * {
 *   "id": 1,
 *   "status": "pending",
 *   "processados": 0,
 *   "total": 3,
 *   "created_at": "2024-05-27T10:30:00Z"
 * }
 */
escavador.post('/v2/processos/atualizacao', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(
    z.object({
      processos: z.array(z.object({ numero_cnj: z.string().min(1) })).min(1),
      enviar_callback: z.boolean().optional(),
    }),
    body,
  );
  if (!parsed.ok) return c.json({ error: parsed.error, details: parsed.details }, 422);

  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/processos/atualizacao/lote',
      tipo_param: null,
      param: null,
      statusCode: 202,
    },
    () =>
      new SolicitarAtualizacaoLote(buildHttp()).execute({
        processos: parsed.data.processos,
        ...(parsed.data.enviar_callback !== undefined && {
          enviar_callback: parsed.data.enviar_callback,
        }),
      }),
  );
});

/**
 * @route GET /v2/processos/atualizacao/:id
 * @description Obter status de uma solicitação de atualização em lote
 * @param {number} id - ID da solicitação de atualização
 * @returns {Object} Status do batch: total processados, erros, progresso e timestamp
 * @status 200 - Status obtido com sucesso
 * @status 400 - ID inválido
 * @status 500 - Erro ao consultar status
 * @example
 * GET /api/escavador/v2/processos/atualizacao/1
 * // Resposta (200)
 * {
 *   "id": 1,
 *   "status": "processing",
 *   "processados": 2,
 *   "total": 3,
 *   "erros": [],
 *   "updated_at": "2024-05-27T10:31:00Z"
 * }
 */
escavador.get('/v2/processos/atualizacao/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/processos/atualizacao/lote/status',
      tipo_param: 'id',
      param: String(id),
    },
    () => new ObterStatusAtualizacaoLote(buildHttp()).execute({ id }),
  );
});

/**
 * @route GET /v2/processos/:id/atualizacao
 * @description Obter status de atualização de um processo específico
 * @param {number} id - ID do processo
 * @returns {Object} Status de atualização: última sincronização, informações modificadas, timestamp
 * @status 200 - Status obtido com sucesso
 * @status 400 - ID inválido
 * @status 500 - Erro ao consultar status
 * @example
 * GET /api/escavador/v2/processos/123/atualizacao
 * // Resposta (200)
 * {
 *   "id": 123,
 *   "status": "updated",
 *   "last_sync": "2024-05-27T10:30:00Z",
 *   "campos_modificados": ["status", "data_sentenca"],
 *   "updated_at": "2024-05-27T10:31:00Z"
 * }
 */
escavador.get('/v2/processos/:id/atualizacao', async (c) => {
  const id = c.req.param('id');
  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/processos/atualizacao/status',
      tipo_param: 'numero_cnj',
      param: id,
    },
    () => new ObterStatusAtualizacaoProcesso(buildHttp()).execute({ id }),
  );
});

/**
 * @route POST /v2/processos/:id/atualizacao
 * @description Solicitar atualização imediata de um processo específico
 * @param {number} id - ID do processo
 * @returns {Object} Confirmação de solicitação com timestamp
 * @status 202 - Solicitação aceita e enfileirada
 * @status 400 - ID inválido
 * @status 500 - Erro ao processar solicitação
 * @example
 * POST /api/escavador/v2/processos/123/atualizacao
 * // Resposta (202)
 * {
 *   "id": 123,
 *   "status": "update_requested",
 *   "created_at": "2024-05-27T10:30:00Z"
 * }
 */
escavador.post('/v2/processos/:id/atualizacao', async (c) => {
  const id = c.req.param('id');
  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/processos/atualizacao/solicitar',
      tipo_param: 'numero_cnj',
      param: id,
      statusCode: 202,
    },
    () => new SolicitarAtualizacaoProcesso(buildHttp()).execute({ id }),
  );
});

// ──── Resumo de Processos (IA) V2 ────

/**
 * @route POST /v2/processos/:id/resumo
 * @description Solicitar geração de resumo de processo via IA (operação assíncrona)
 * @param {number} id - ID do processo
 * @returns {Object} Confirmação de solicitação com ID do job
 * @status 202 - Solicitação aceita e enfileirada para processamento IA
 * @status 400 - ID inválido
 * @status 500 - Erro ao processar solicitação
 * @example
 * POST /api/escavador/v2/processos/123/resumo
 * // Resposta (202)
 * {
 *   "id": 123,
 *   "job_id": "job_abc123",
 *   "status": "processing",
 *   "created_at": "2024-05-27T10:30:00Z"
 * }
 */
escavador.post('/v2/processos/:id/resumo', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);
  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/processos/resumo/solicitar',
      tipo_param: 'numero_cnj',
      param: String(id),
      statusCode: 202,
    },
    () => new SolicitarResumoProcesso(buildHttp()).execute({ id }),
  );
});

/**
 * @route GET /v2/processos/:id/resumo
 * @description Obter resumo gerado por IA de um processo
 * @param {number} id - ID do processo
 * @returns {Object} Resumo estruturado: fatos, decisão, partes envolvidas, análise jurídica
 * @status 200 - Resumo obtido com sucesso
 * @status 400 - ID inválido
 * @status 500 - Erro ao consultar resumo
 * @example
 * GET /api/escavador/v2/processos/123/resumo
 * // Resposta (200)
 * {
 *   "id": 123,
 *   "resumo": "Ação civil por cobrança...",
 *   "fatos": ["Contrato de empréstimo...", "Inadimplemento em..."],
 *   "decisao": "Sentença condenatória",
 *   "generated_at": "2024-05-27T10:31:00Z"
 * }
 */
escavador.get('/v2/processos/:id/resumo', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);
  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/processos/resumo/obter',
      tipo_param: 'numero_cnj',
      param: String(id),
    },
    () => new ObterResumoProcesso(buildHttp()).execute({ id }),
  );
});

/**
 * @route GET /v2/processos/:id/resumo/status
 * @description Verificar status da geração de resumo de um processo
 * @param {number} id - ID do processo
 * @returns {Object} Status do processamento de IA: estado, progresso, estimativa de conclusão
 * @status 200 - Status obtido com sucesso
 * @status 400 - ID inválido
 * @status 500 - Erro ao consultar status
 * @example
 * GET /api/escavador/v2/processos/123/resumo/status
 * // Resposta (200)
 * {
 *   "id": 123,
 *   "status": "processing",
 *   "progress": 65,
 *   "estimated_completion": "2024-05-27T10:35:00Z"
 * }
 */
escavador.get('/v2/processos/:id/resumo/status', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);
  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/processos/resumo/status',
      tipo_param: 'numero_cnj',
      param: String(id),
    },
    () => new ObterStatusResumoProcesso(buildHttp()).execute({ id }),
  );
});

// ──── Download de Documento V2 ────

/**
 * @route GET /v2/documentos/:id/download
 * @description Download de documento PDF de um processo
 * @param {number} id - ID do documento
 * @returns {Buffer} Conteúdo PDF do documento em base64 ou binário
 * @status 200 - Documento enviado com sucesso (application/pdf)
 * @status 400 - ID inválido
 * @status 500 - Erro ao recuperar documento
 * @example
 * GET /api/escavador/v2/documentos/5/download
 * // Resposta (200) Content-Type: application/pdf
 * [PDF binary content]
 */
escavador.get('/v2/documentos/:id/download', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new DownloadDocumento(buildHttp());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({
      gateway: 'escavador-v2',
      fonte: 'v2/processos/documentos/download',
      tipo_param: 'id',
      param: String(id),
      result: { message: result.value.message },
      status: 'error',
      error_kind: result.value.kind,
      created_at: new Date(),
    });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({
    gateway: 'escavador-v2',
    fonte: 'v2/processos/documentos/download',
    tipo_param: 'id',
    param: String(id),
    result: { size: result.value.byteLength },
    status: 'success',
    created_at: new Date(),
  });
  return c.body(new Uint8Array(result.value), 200, { 'Content-Type': 'application/pdf' });
});

/**
 * @route POST /v2/monitoramentos/novos-processos
 * @description Criar novo monitoramento de processos com filtros de busca
 * @param {string} variacao_busca - Termo de busca ou nome (obrigatório)
 * @queryParam {Array<number>} tribunais - IDs dos tribunais a monitorar (opcional)
 * @queryParam {string} callback_url - URL para webhooks de notificação (opcional)
 * @returns {Object} Monitoramento criado com ID e configuração
 * @status 201 - Monitoramento criado com sucesso
 * @status 400 - Body inválido
 * @status 422 - Payload não atende aos critérios de validação
 * @status 500 - Erro ao criar monitoramento
 * @example
 * POST /api/escavador/v2/monitoramentos/novos-processos
 * {
 *   "variacao_busca": "Empresa ABC LTDA",
 *   "tribunais": [1, 5],
 *   "callback_url": "https://app.example.com/webhooks/escavador"
 * }
 * // Resposta (201)
 * {
 *   "id": 25,
 *   "variacao_busca": "Empresa ABC LTDA",
 *   "tribunais": [1, 5],
 *   "ativo": true,
 *   "created_at": "2024-05-27T10:30:00Z"
 * }
 */
escavador.get('/v2/monitoramentos/novos-processos', async (c) => {
  const pagina = Number(c.req.query('page') ?? '1');
  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/monitoramentos/novos-processos/list',
      tipo_param: null,
      param: null,
    },
    () => new ListarMonitoramentosNovosProcessos(buildHttp()).execute({ pagina }),
  );
});

escavador.post('/v2/monitoramentos/novos-processos', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(
    z.object({
      variacao_busca: z.string().min(1),
      tribunais: z.array(z.number().int()).optional(),
      callback_url: z.string().url().optional(),
    }),
    body,
  );
  if (!parsed.ok) return c.json({ error: parsed.error, details: parsed.details }, 422);

  const op = new CriarMonitoramentoNovosProcessos(buildHttp());
  const input: Parameters<typeof op.execute>[0] = { variacao_busca: parsed.data.variacao_busca };
  if (parsed.data.tribunais !== undefined) input.tribunais = parsed.data.tribunais;
  if (parsed.data.callback_url !== undefined) input.callback_url = parsed.data.callback_url;
  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/monitoramentos/novos-processos/criar',
      tipo_param: null,
      param: null,
      statusCode: 201,
    },
    () => op.execute(input),
  );
});

/**
 * @route GET /v2/monitoramentos/novos-processos/:id
 * @description Obter detalhes de um monitoramento de novos processos
 * @param {number} id - ID do monitoramento
 * @returns {Object} Configuração completa do monitoramento incluindo histórico
 * @status 200 - Monitoramento obtido com sucesso
 * @status 400 - ID inválido
 * @status 500 - Erro ao consultar monitoramento
 * @example
 * GET /api/escavador/v2/monitoramentos/novos-processos/25
 * // Resposta (200)
 * {
 *   "id": 25,
 *   "variacao_busca": "Empresa ABC LTDA",
 *   "tribunais": [1, 5],
 *   "callback_url": "https://app.example.com/webhooks/escavador",
 *   "ativo": true,
 *   "created_at": "2024-05-27T10:30:00Z",
 *   "updated_at": "2024-05-27T10:30:00Z"
 * }
 */
escavador.get('/v2/monitoramentos/novos-processos/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/monitoramentos/novos-processos/obter',
      tipo_param: 'id',
      param: String(id),
    },
    () => new ObterMonitoramentoNovosProcessos(buildHttp()).execute({ id }),
  );
});

/**
 * @route PATCH /v2/monitoramentos/novos-processos/:id
 * @description Atualizar configuração de um monitoramento de novos processos
 * @param {number} id - ID do monitoramento
 * @param {string} variacao_busca - Novo termo de busca (opcional)
 * @param {Array<number>} tribunais - Novos tribunais (opcional)
 * @param {string} callback_url - Nova URL de webhook (opcional)
 * @param {boolean} ativo - Ativar/desativar monitoramento (opcional)
 * @returns {Object} Monitoramento atualizado
 * @status 200 - Monitoramento atualizado com sucesso
 * @status 400 - ID inválido ou body inválido
 * @status 422 - Payload não atende aos critérios de validação
 * @status 500 - Erro ao atualizar monitoramento
 * @example
 * PATCH /api/escavador/v2/monitoramentos/novos-processos/25
 * {
 *   "tribunais": [1, 5, 10],
 *   "ativo": false
 * }
 * // Resposta (200)
 * {
 *   "id": 25,
 *   "variacao_busca": "Empresa ABC LTDA",
 *   "tribunais": [1, 5, 10],
 *   "ativo": false,
 *   "updated_at": "2024-05-27T10:31:00Z"
 * }
 */
escavador.patch('/v2/monitoramentos/novos-processos/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(
    z.object({
      variacao_busca: z.string().optional(),
      tribunais: z.array(z.number().int()).optional(),
      callback_url: z.string().url().optional(),
      ativo: z.boolean().optional(),
    }),
    body,
  );
  if (!parsed.ok) return c.json({ error: parsed.error, details: parsed.details }, 422);

  const op = new EditarMonitoramentoNovosProcessos(buildHttp());
  const input: Parameters<typeof op.execute>[0] = { id };
  if (parsed.data.variacao_busca !== undefined) input.variacao_busca = parsed.data.variacao_busca;
  if (parsed.data.tribunais !== undefined) input.tribunais = parsed.data.tribunais;
  if (parsed.data.callback_url !== undefined) input.callback_url = parsed.data.callback_url;
  if (parsed.data.ativo !== undefined) input.ativo = parsed.data.ativo;
  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/monitoramentos/novos-processos/editar',
      tipo_param: 'id',
      param: String(id),
    },
    () => op.execute(input),
  );
});

/**
 * @route DELETE /v2/monitoramentos/novos-processos/:id
 * @description Remover um monitoramento de novos processos
 * @param {number} id - ID do monitoramento
 * @returns {null} Sem conteúdo
 * @status 204 - Monitoramento removido com sucesso
 * @status 400 - ID inválido
 * @status 500 - Erro ao remover monitoramento
 * @example
 * DELETE /api/escavador/v2/monitoramentos/novos-processos/25
 * // Resposta (204) No Content
 */
escavador.delete('/v2/monitoramentos/novos-processos/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);
  return handleOpVoid(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/monitoramentos/novos-processos/remover',
      tipo_param: 'id',
      param: String(id),
    },
    () => new RemoverMonitoramentoNovosProcessos(buildHttp()).execute({ id }),
  );
});

escavador.get('/v2/monitoramentos/novos-processos/:id/resultados', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const pagina = Number(c.req.query('page') ?? '1');
  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/monitoramentos/novos-processos/resultados',
      tipo_param: 'id',
      param: String(id),
    },
    () => new ObterResultadosMonitoramentoNovosProcessos(buildHttp()).execute({ id, pagina }),
  );
});

// ──── Monitoramentos V2 — Processos ────

/**
 * @route GET /v2/monitoramentos/processos
 * @description Listar monitoramentos de processos específicos com paginação
 * @queryParam {number} page - Número da página (padrão: 1)
 * @returns {Object} Array de monitoramentos com metadados de paginação
 * @status 200 - Monitoramentos listados com sucesso
 * @status 500 - Erro ao consultar API Escavador
 * @example
 * GET /api/escavador/v2/monitoramentos/processos?page=1
 * // Resposta (200)
 * {
 *   "data": [
 *     { "id": 1, "processo_id": 123, "ativo": true, "callback_url": "https://..." }
 *   ],
 *   "pagination": { "page": 1, "total": 5, "por_pagina": 10 }
 * }
 */
escavador.get('/v2/monitoramentos/processos', async (c) => {
  const pagina = Number(c.req.query('page') ?? '1');
  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/monitoramentos/processos/listar',
      tipo_param: null,
      param: null,
    },
    () => new ListarMonitoramentosProcesso(buildHttp()).execute({ pagina }),
  );
});

/**
 * @route POST /v2/monitoramentos/processos
 * @description Criar novo monitoramento para um processo específico
 * @param {number} processo_id - ID do processo a monitorar (obrigatório)
 * @param {string} callback_url - URL para webhooks de notificação (opcional)
 * @returns {Object} Monitoramento criado com ID e configuração
 * @status 201 - Monitoramento criado com sucesso
 * @status 400 - Body inválido
 * @status 422 - Payload não atende aos critérios de validação
 * @status 500 - Erro ao criar monitoramento
 * @example
 * POST /api/escavador/v2/monitoramentos/processos
 * {
 *   "processo_id": 123,
 *   "callback_url": "https://app.example.com/webhooks/escavador"
 * }
 * // Resposta (201)
 * {
 *   "id": 10,
 *   "processo_id": 123,
 *   "callback_url": "https://app.example.com/webhooks/escavador",
 *   "ativo": true,
 *   "created_at": "2024-05-27T10:30:00Z"
 * }
 */
escavador.post('/v2/monitoramentos/processos', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(
    z.object({
      processo_id: z.number().int(),
      callback_url: z.string().url().optional(),
    }),
    body,
  );
  if (!parsed.ok) return c.json({ error: parsed.error, details: parsed.details }, 422);

  const op = new CriarMonitoramentoProcesso(buildHttp());
  const input: Parameters<typeof op.execute>[0] = { processo_id: parsed.data.processo_id };
  if (parsed.data.callback_url !== undefined) input.callback_url = parsed.data.callback_url;
  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/monitoramentos/processos/criar',
      tipo_param: null,
      param: null,
      statusCode: 201,
    },
    () => op.execute(input),
  );
});

/**
 * @route GET /v2/monitoramentos/processos/:id
 * @description Obter detalhes de um monitoramento de processo específico
 * @param {number} id - ID do monitoramento
 * @returns {Object} Configuração completa do monitoramento
 * @status 200 - Monitoramento obtido com sucesso
 * @status 400 - ID inválido
 * @status 500 - Erro ao consultar monitoramento
 * @example
 * GET /api/escavador/v2/monitoramentos/processos/10
 * // Resposta (200)
 * {
 *   "id": 10,
 *   "processo_id": 123,
 *   "callback_url": "https://app.example.com/webhooks/escavador",
 *   "ativo": true,
 *   "created_at": "2024-05-27T10:30:00Z",
 *   "updated_at": "2024-05-27T10:30:00Z"
 * }
 */
escavador.get('/v2/monitoramentos/processos/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/monitoramentos/processos/obter',
      tipo_param: 'id',
      param: String(id),
    },
    () => new ObterMonitoramentoProcesso(buildHttp()).execute({ id }),
  );
});

/**
 * @route DELETE /v2/monitoramentos/processos/:id
 * @description Remover um monitoramento de processo específico
 * @param {number} id - ID do monitoramento
 * @returns {null} Sem conteúdo
 * @status 204 - Monitoramento removido com sucesso
 * @status 400 - ID inválido
 * @status 500 - Erro ao remover monitoramento
 * @example
 * DELETE /api/escavador/v2/monitoramentos/processos/10
 * // Resposta (204) No Content
 */
escavador.delete('/v2/monitoramentos/processos/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);
  return handleOpVoid(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/monitoramentos/processos/remover',
      tipo_param: 'id',
      param: String(id),
    },
    () => new RemoverMonitoramentoProcesso(buildHttp()).execute({ id }),
  );
});

// ──── Callbacks V2 ────

/**
 * @route GET /v2/callbacks
 * @description Listar callbacks pendentes e histórico com paginação
 * @queryParam {number} page - Número da página (padrão: 1)
 * @returns {Object} Array de callbacks com metadados de paginação
 * @status 200 - Callbacks listados com sucesso
 * @status 500 - Erro ao consultar API Escavador
 * @example
 * GET /api/escavador/v2/callbacks?page=1
 * // Resposta (200)
 * {
 *   "data": [
 *     { "id": 1, "evento": "processo_atualizado", "status": "pending", "tentativas": 1, "created_at": "2024-05-27T10:30:00Z" }
 *   ],
 *   "pagination": { "page": 1, "total": 50, "por_pagina": 20 }
 * }
 */
escavador.get('/v2/callbacks', async (c) => {
  const pagina = Number(c.req.query('page') ?? '1');
  return handleOp(
    c,
    { gateway: 'escavador-v2', fonte: 'v2/callbacks/listar', tipo_param: null, param: null },
    () => new ListarCallbacksV2(buildHttp()).execute({ pagina }),
  );
});

/**
 * @route POST /v2/callbacks/recebidos
 * @description Marcar callbacks como recebidos/processados
 * @param {Array<number>} ids - Array de IDs de callbacks (máximo 20, mínimo 1)
 * @returns {null} Sem conteúdo
 * @status 204 - Callbacks marcados com sucesso
 * @status 400 - Body inválido
 * @status 422 - Payload não atende aos critérios de validação
 * @status 500 - Erro ao processar requisição
 * @example
 * POST /api/escavador/v2/callbacks/recebidos
 * {
 *   "ids": [1, 2, 3, 4, 5]
 * }
 * // Resposta (204) No Content
 */
escavador.post('/v2/callbacks/recebidos', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(z.object({ ids: z.array(z.number().int()).min(1).max(20) }), body);
  if (!parsed.ok) return c.json({ error: parsed.error, details: parsed.details }, 422);

  return handleOpVoid(
    c,
    { gateway: 'escavador-v2', fonte: 'v2/callbacks/recebidos', tipo_param: null, param: null },
    () => new MarcarCallbacksRecebidosV2(buildHttp()).execute({ ids: parsed.data.ids }),
  );
});

/**
 * @route POST /v2/callbacks/:id/reenviar
 * @description Reenviar um callback específico
 * @param {number} id - ID do callback
 * @returns {Object} Confirmação de reenvio com novo status
 * @status 200 - Reenvio processado com sucesso
 * @status 400 - ID inválido
 * @status 500 - Erro ao reenviar callback
 * @example
 * POST /api/escavador/v2/callbacks/1/reenviar
 * // Resposta (200)
 * {
 *   "id": 1,
 *   "status": "resent",
 *   "tentativas": 2,
 *   "resent_at": "2024-05-27T10:31:00Z"
 * }
 */
escavador.post('/v2/callbacks/:id/reenviar', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/callbacks/reenviar',
      tipo_param: 'id',
      param: String(id),
    },
    () => new ReenviarCallbackV2(buildHttp()).execute({ id }),
  );
});

// ──── Certificados V2 ────

/**
 * @route GET /v2/certificados
 * @description Listar certificados digitais (e-CNPJ/e-CPF) cadastrados
 * @returns {Array} Array de certificados com metadados
 * @status 200 - Certificados listados com sucesso
 * @status 500 - Erro ao consultar API Escavador
 * @example
 * GET /api/escavador/v2/certificados
 * // Resposta (200)
 * {
 *   "data": [
 *     { "id": 1, "nome": "Certificado ABC LTDA", "tipo": "e-CNPJ", "valido_ate": "2025-12-31", "created_at": "2024-01-15T08:00:00Z" }
 *   ]
 * }
 */
escavador.get('/v2/certificados', async (c) => {
  return handleOp(
    c,
    { gateway: 'escavador-v2', fonte: 'v2/certificados/listar', tipo_param: null, param: null },
    () => new ListarCertificados(buildHttp()).execute(),
  );
});

/**
 * @route POST /v2/certificados
 * @description Fazer upload e registrar novo certificado digital
 * @param {string} nome - Nome identificador do certificado
 * @param {string} arquivo_base64 - Arquivo .p12 ou .pfx codificado em base64
 * @param {string} senha - Senha do certificado
 * @returns {Object} Certificado registrado com ID e validação
 * @status 201 - Certificado criado com sucesso
 * @status 400 - Body inválido
 * @status 422 - Payload não atende aos critérios de validação
 * @status 500 - Erro ao processar certificado
 * @example
 * POST /api/escavador/v2/certificados
 * {
 *   "nome": "Certificado ABC LTDA",
 *   "arquivo_base64": "MIIG...[truncated]",
 *   "senha": "senha_certificado_123"
 * }
 * // Resposta (201)
 * {
 *   "id": 1,
 *   "nome": "Certificado ABC LTDA",
 *   "tipo": "e-CNPJ",
 *   "valido_ate": "2025-12-31",
 *   "created_at": "2024-05-27T10:30:00Z"
 * }
 */
escavador.post('/v2/certificados', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(
    z.object({
      nome: z.string().min(1),
      arquivo_base64: z.string().min(1),
      senha: z.string().min(1),
    }),
    body,
  );
  if (!parsed.ok) return c.json({ error: parsed.error, details: parsed.details }, 422);

  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/certificados/criar',
      tipo_param: null,
      param: null,
      statusCode: 201,
    },
    () => new CriarCertificado(buildHttp()).execute(parsed.data),
  );
});

/**
 * @route GET /v2/certificados/:id
 * @description Obter detalhes de um certificado específico
 * @param {number} id - ID do certificado
 * @returns {Object} Detalhes completos do certificado incluindo validação
 * @status 200 - Certificado obtido com sucesso
 * @status 400 - ID inválido
 * @status 500 - Erro ao consultar certificado
 * @example
 * GET /api/escavador/v2/certificados/1
 * // Resposta (200)
 * {
 *   "id": 1,
 *   "nome": "Certificado ABC LTDA",
 *   "tipo": "e-CNPJ",
 *   "cnpj": "XX.XXX.XXX/XXXX-XX",
 *   "valido_ate": "2025-12-31",
 *   "autenticacoes": [],
 *   "created_at": "2024-01-15T08:00:00Z"
 * }
 */
escavador.get('/v2/certificados/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/certificados/obter',
      tipo_param: 'id',
      param: String(id),
    },
    () => new ObterCertificado(buildHttp()).execute({ id }),
  );
});

/**
 * @route DELETE /v2/certificados/:id
 * @description Remover um certificado digital
 * @param {number} id - ID do certificado
 * @returns {null} Sem conteúdo
 * @status 204 - Certificado removido com sucesso
 * @status 400 - ID inválido
 * @status 500 - Erro ao remover certificado
 * @example
 * DELETE /api/escavador/v2/certificados/1
 * // Resposta (204) No Content
 */
escavador.delete('/v2/certificados/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);
  return handleOpVoid(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/certificados/remover',
      tipo_param: 'id',
      param: String(id),
    },
    () => new RemoverCertificado(buildHttp()).execute({ id }),
  );
});

/**
 * @route POST /v2/certificados/:id/autenticacoes
 * @description Adicionar método de autenticação a um certificado
 * @param {number} id - ID do certificado
 * @param {string} tipo - Tipo de autenticação (obrigatório)
 * @param {string} valor - Valor específico do tipo (opcional, conforme tipo)
 * @returns {Object} Autenticação criada com ID
 * @status 201 - Autenticação criada com sucesso
 * @status 400 - ID inválido ou body inválido
 * @status 422 - Payload não atende aos critérios de validação
 * @status 500 - Erro ao processar autenticação
 * @example
 * POST /api/escavador/v2/certificados/1/autenticacoes
 * {
 *   "tipo": "password",
 *   "valor": "senha_123"
 * }
 * // Resposta (201)
 * {
 *   "id": 5,
 *   "certificado_id": 1,
 *   "tipo": "password",
 *   "created_at": "2024-05-27T10:30:00Z"
 * }
 */
escavador.post('/v2/certificados/:id/autenticacoes', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(
    z.object({
      tipo: z.string().min(1),
      valor: z.string().optional(),
    }),
    body,
  );
  if (!parsed.ok) return c.json({ error: parsed.error, details: parsed.details }, 422);

  const op = new CriarAutenticacaoCertificado(buildHttp());
  const input: Parameters<typeof op.execute>[0] = { id, tipo: parsed.data.tipo };
  if (parsed.data.valor !== undefined) input.valor = parsed.data.valor;
  return handleOp(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/certificados/autenticacoes/criar',
      tipo_param: 'id',
      param: String(id),
      statusCode: 201,
    },
    () => op.execute(input),
  );
});

/**
 * @route DELETE /v2/certificados/:id/autenticacoes/:autenticacaoId
 * @description Remover método de autenticação de um certificado
 * @param {number} id - ID do certificado
 * @param {number} autenticacaoId - ID da autenticação
 * @returns {null} Sem conteúdo
 * @status 204 - Autenticação removida com sucesso
 * @status 400 - IDs inválidos
 * @status 500 - Erro ao remover autenticação
 * @example
 * DELETE /api/escavador/v2/certificados/1/autenticacoes/5
 * // Resposta (204) No Content
 */
escavador.delete('/v2/certificados/:id/autenticacoes/:autenticacaoId', async (c) => {
  const id = Number(c.req.param('id'));
  const autenticacaoId = Number(c.req.param('autenticacaoId'));
  if (Number.isNaN(id) || Number.isNaN(autenticacaoId))
    return c.json({ error: 'ID inválido' }, 400);
  return handleOpVoid(
    c,
    {
      gateway: 'escavador-v2',
      fonte: 'v2/certificados/autenticacoes/remover',
      tipo_param: 'id',
      param: String(id),
    },
    () => new RemoverAutenticacaoCertificado(buildHttp()).execute({ id, autenticacaoId }),
  );
});

// ──── Tribunais V2 ────

/**
 * @route GET /v2/tribunais/sistemas
 * @description Listar sistemas de tribunais disponíveis (TJ, STF, TST, etc.)
 * @returns {Array} Array de sistemas com IDs e nomes
 * @status 200 - Sistemas listados com sucesso
 * @status 500 - Erro ao consultar API Escavador
 * @example
 * GET /api/escavador/v2/tribunais/sistemas
 * // Resposta (200)
 * {
 *   "data": [
 *     { "id": 1, "nome": "Superior Tribunal de Justiça", "sigla": "STJ" },
 *     { "id": 2, "nome": "Tribunal de Justiça do Estado de São Paulo", "sigla": "TJ/SP" }
 *   ]
 * }
 */
escavador.get('/v2/tribunais/sistemas', async (c) => {
  return handleOp(
    c,
    { gateway: 'escavador-v2', fonte: 'v2/tribunais/sistemas', tipo_param: null, param: null },
    () => new ListarSistemasTribunais(buildHttp()).execute(),
  );
});

/**
 * @route GET /v2/tribunais
 * @description Listar tribunais com filtro opcional por sistema
 * @queryParam {number} sistema_id - ID do sistema de tribunal para filtrar (opcional)
 * @returns {Array} Array de tribunais com metadados
 * @status 200 - Tribunais listados com sucesso
 * @status 500 - Erro ao consultar API Escavador
 * @example
 * GET /api/escavador/v2/tribunais?sistema_id=2
 * // Resposta (200)
 * {
 *   "data": [
 *     { "id": 10, "nome": "1ª Vara Cível", "sistema_id": 2, "estado": "SP", "cidade": "São Paulo" },
 *     { "id": 11, "nome": "2ª Vara Cível", "sistema_id": 2, "estado": "SP", "cidade": "São Paulo" }
 *   ]
 * }
 */
escavador.get('/v2/tribunais', async (c) => {
  const sistemaIdRaw = c.req.query('sistema_id');
  const op = new ListarTribunaisV2(buildHttp());
  const input: Parameters<typeof op.execute>[0] = {};
  if (sistemaIdRaw !== undefined) {
    const id = Number(sistemaIdRaw);
    if (!Number.isNaN(id)) input.sistema_id = id;
  }
  return handleOp(
    c,
    { gateway: 'escavador-v2', fonte: 'v2/tribunais/listar', tipo_param: null, param: null },
    () => op.execute(input),
  );
});

export { escavador };
