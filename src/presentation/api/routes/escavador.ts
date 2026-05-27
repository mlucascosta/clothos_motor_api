import { Hono } from 'hono';
import { z } from 'zod';
import { isLeft } from '../../../shared/domain/Either.js';
import { EscavadorHttpClient } from '../../../infrastructure/providers/escavador/EscavadorHttpClient.js';
import { EscavadorV2HttpClient } from '../../../infrastructure/providers/escavador/EscavadorV2HttpClient.js';
import { rawStore } from '../../../infrastructure/persistence/index.js';

// ──── Operations V1 ────
import { IniciarBuscaProcessosCpfCnpj } from '../../../infrastructure/providers/escavador/operations/IniciarBuscaProcessosCpfCnpj.js';
import { IniciarBuscaProcessosEnvolvido } from '../../../infrastructure/providers/escavador/operations/IniciarBuscaProcessosEnvolvido.js';
import { IniciarBuscaProcessosOab } from '../../../infrastructure/providers/escavador/operations/IniciarBuscaProcessosOab.js';
import { IniciarBuscaProcessoNup } from '../../../infrastructure/providers/escavador/operations/IniciarBuscaProcessoNup.js';
import { IniciarBuscaProcessosLote } from '../../../infrastructure/providers/escavador/operations/IniciarBuscaProcessosLote.js';
import { IniciarBuscaProcesso } from '../../../infrastructure/providers/escavador/operations/IniciarBuscaProcesso.js';
import { ObterBuscaAssincrona } from '../../../infrastructure/providers/escavador/operations/ObterBuscaAssincrona.js';
import { ListarBuscasAssincronas } from '../../../infrastructure/providers/escavador/operations/ListarBuscasAssincronas.js';
import { ObterSaldo } from '../../../infrastructure/providers/escavador/operations/ObterSaldo.js';
import { BuscarGeral } from '../../../infrastructure/providers/escavador/operations/BuscarGeral.js';
import { ObterPessoa } from '../../../infrastructure/providers/escavador/operations/ObterPessoa.js';
import { ObterProcessosPessoa } from '../../../infrastructure/providers/escavador/operations/ObterProcessosPessoa.js';
import { BuscarPublicacoes } from '../../../infrastructure/providers/escavador/operations/BuscarPublicacoes.js';
import { ObterInstituicao } from '../../../infrastructure/providers/escavador/operations/ObterInstituicao.js';
import { ObterProcessosInstituicao } from '../../../infrastructure/providers/escavador/operations/ObterProcessosInstituicao.js';
import { ObterPessoasInstituicao } from '../../../infrastructure/providers/escavador/operations/ObterPessoasInstituicao.js';
import { ObterDetalhesProcesso } from '../../../infrastructure/providers/escavador/operations/ObterDetalhesProcesso.js';
import { ObterMovimentacoesProcesso } from '../../../infrastructure/providers/escavador/operations/ObterMovimentacoesProcesso.js';
import { ObterMovimentacao } from '../../../infrastructure/providers/escavador/operations/ObterMovimentacao.js';
import { ObterEnvolvidosProcesso } from '../../../infrastructure/providers/escavador/operations/ObterEnvolvidosProcesso.js';
import { BuscarProcessosDiarioPorNumero } from '../../../infrastructure/providers/escavador/operations/BuscarProcessosDiarioPorNumero.js';
import { BuscarProcessosDiarioPorOab } from '../../../infrastructure/providers/escavador/operations/BuscarProcessosDiarioPorOab.js';
import { CriarMonitoramento } from '../../../infrastructure/providers/escavador/operations/CriarMonitoramento.js';
import { ListarMonitoramentos } from '../../../infrastructure/providers/escavador/operations/ListarMonitoramentos.js';
import { ObterMonitoramento } from '../../../infrastructure/providers/escavador/operations/ObterMonitoramento.js';
import { EditarMonitoramento } from '../../../infrastructure/providers/escavador/operations/EditarMonitoramento.js';
import { RemoverMonitoramento } from '../../../infrastructure/providers/escavador/operations/RemoverMonitoramento.js';
import { ObterAparicoes } from '../../../infrastructure/providers/escavador/operations/ObterAparicoes.js';
import { TestarCallbackMonitoramento } from '../../../infrastructure/providers/escavador/operations/TestarCallbackMonitoramento.js';
import { ObterOrigensMonitoramento } from '../../../infrastructure/providers/escavador/operations/ObterOrigensMonitoramento.js';
import { CriarMonitoramentoTribunal } from '../../../infrastructure/providers/escavador/operations/CriarMonitoramentoTribunal.js';
import { ListarMonitoramentosTribunal } from '../../../infrastructure/providers/escavador/operations/ListarMonitoramentosTribunal.js';
import { ObterMonitoramentoTribunal } from '../../../infrastructure/providers/escavador/operations/ObterMonitoramentoTribunal.js';
import { EditarMonitoramentoTribunal } from '../../../infrastructure/providers/escavador/operations/EditarMonitoramentoTribunal.js';
import { RemoverMonitoramentoTribunal } from '../../../infrastructure/providers/escavador/operations/RemoverMonitoramentoTribunal.js';
import { ListarCallbacks } from '../../../infrastructure/providers/escavador/operations/ListarCallbacks.js';
import { MarcarCallbacksRecebidos } from '../../../infrastructure/providers/escavador/operations/MarcarCallbacksRecebidos.js';
import { ReenviarCallback } from '../../../infrastructure/providers/escavador/operations/ReenviarCallback.js';
import { ListarTribunais } from '../../../infrastructure/providers/escavador/operations/ListarTribunais.js';
import { ObterTribunal } from '../../../infrastructure/providers/escavador/operations/ObterTribunal.js';
import { ListarOrgaosAdministrativos } from '../../../infrastructure/providers/escavador/operations/ListarOrgaosAdministrativos.js';
import { ListarOrigensDiariosOficiais } from '../../../infrastructure/providers/escavador/operations/ListarOrigensDiariosOficiais.js';

// ──── Operations V2 ────
import { DownloadDocumento } from '../../../infrastructure/providers/escavador/operations/v2/DownloadDocumento.js';
import { ObterProcessoPorCnj } from '../../../infrastructure/providers/escavador/operations/v2/ObterProcessoPorCnj.js';
import { ObterMovimentacoesV2 } from '../../../infrastructure/providers/escavador/operations/v2/ObterMovimentacoesV2.js';
import { BuscarProcessosPorEnvolvido } from '../../../infrastructure/providers/escavador/operations/v2/BuscarProcessosPorEnvolvido.js';
import { ResumoProcessosPorEnvolvido } from '../../../infrastructure/providers/escavador/operations/v2/ResumoProcessosPorEnvolvido.js';
import { BuscarProcessosPorAdvogado } from '../../../infrastructure/providers/escavador/operations/v2/BuscarProcessosPorAdvogado.js';
import { ResumoProcessosPorAdvogado } from '../../../infrastructure/providers/escavador/operations/v2/ResumoProcessosPorAdvogado.js';
import { ObterDocumentosProcesso } from '../../../infrastructure/providers/escavador/operations/v2/ObterDocumentosProcesso.js';
import { ObterAutosProcesso } from '../../../infrastructure/providers/escavador/operations/v2/ObterAutosProcesso.js';
import { ObterEnvolvidosProcessoV2 } from '../../../infrastructure/providers/escavador/operations/v2/ObterEnvolvidosProcessoV2.js';
import { SolicitarAtualizacaoLote } from '../../../infrastructure/providers/escavador/operations/v2/SolicitarAtualizacaoLote.js';
import { ObterStatusAtualizacaoLote } from '../../../infrastructure/providers/escavador/operations/v2/ObterStatusAtualizacaoLote.js';
import { ObterStatusAtualizacaoProcesso } from '../../../infrastructure/providers/escavador/operations/v2/ObterStatusAtualizacaoProcesso.js';
import { SolicitarAtualizacaoProcesso } from '../../../infrastructure/providers/escavador/operations/v2/SolicitarAtualizacaoProcesso.js';
import { SolicitarResumoProcesso } from '../../../infrastructure/providers/escavador/operations/v2/SolicitarResumoProcesso.js';
import { ObterResumoProcesso } from '../../../infrastructure/providers/escavador/operations/v2/ObterResumoProcesso.js';
import { ObterStatusResumoProcesso } from '../../../infrastructure/providers/escavador/operations/v2/ObterStatusResumoProcesso.js';
import { CriarMonitoramentoNovosProcessos } from '../../../infrastructure/providers/escavador/operations/v2/CriarMonitoramentoNovosProcessos.js';
import { ListarMonitoramentosNovosProcessos } from '../../../infrastructure/providers/escavador/operations/v2/ListarMonitoramentosNovosProcessos.js';
import { ObterMonitoramentoNovosProcessos } from '../../../infrastructure/providers/escavador/operations/v2/ObterMonitoramentoNovosProcessos.js';
import { RemoverMonitoramentoNovosProcessos } from '../../../infrastructure/providers/escavador/operations/v2/RemoverMonitoramentoNovosProcessos.js';
import { ObterResultadosMonitoramentoNovosProcessos } from '../../../infrastructure/providers/escavador/operations/v2/ObterResultadosMonitoramentoNovosProcessos.js';
import { EditarMonitoramentoNovosProcessos } from '../../../infrastructure/providers/escavador/operations/v2/EditarMonitoramentoNovosProcessos.js';
import { CriarMonitoramentoProcesso } from '../../../infrastructure/providers/escavador/operations/v2/CriarMonitoramentoProcesso.js';
import { ListarMonitoramentosProcesso } from '../../../infrastructure/providers/escavador/operations/v2/ListarMonitoramentosProcesso.js';
import { ObterMonitoramentoProcesso } from '../../../infrastructure/providers/escavador/operations/v2/ObterMonitoramentoProcesso.js';
import { RemoverMonitoramentoProcesso } from '../../../infrastructure/providers/escavador/operations/v2/RemoverMonitoramentoProcesso.js';
import { ListarCallbacksV2 } from '../../../infrastructure/providers/escavador/operations/v2/ListarCallbacksV2.js';
import { MarcarCallbacksRecebidosV2 } from '../../../infrastructure/providers/escavador/operations/v2/MarcarCallbacksRecebidosV2.js';
import { ReenviarCallbackV2 } from '../../../infrastructure/providers/escavador/operations/v2/ReenviarCallbackV2.js';
import { CriarCertificado } from '../../../infrastructure/providers/escavador/operations/v2/CriarCertificado.js';
import { ListarCertificados } from '../../../infrastructure/providers/escavador/operations/v2/ListarCertificados.js';
import { ObterCertificado } from '../../../infrastructure/providers/escavador/operations/v2/ObterCertificado.js';
import { RemoverCertificado } from '../../../infrastructure/providers/escavador/operations/v2/RemoverCertificado.js';
import { CriarAutenticacaoCertificado } from '../../../infrastructure/providers/escavador/operations/v2/CriarAutenticacaoCertificado.js';
import { RemoverAutenticacaoCertificado } from '../../../infrastructure/providers/escavador/operations/v2/RemoverAutenticacaoCertificado.js';
import { ListarSistemasTribunais } from '../../../infrastructure/providers/escavador/operations/v2/ListarSistemasTribunais.js';
import { ListarTribunaisV2 } from '../../../infrastructure/providers/escavador/operations/v2/ListarTribunaisV2.js';

const GW_V1 = 'escavador-v1';
const GW_V2 = 'escavador-v2';

function buildHttpV1(): EscavadorHttpClient {
  const apiKey = process.env['ESCAVADOR_API_KEY'] ?? '';
  const baseUrl = process.env['ESCAVADOR_BASE_URL'] ?? 'https://api.escavador.com';
  return new EscavadorHttpClient(apiKey, baseUrl);
}

function buildHttpV2(): EscavadorV2HttpClient {
  const apiKey = process.env['ESCAVADOR_API_KEY'] ?? '';
  const baseUrl = process.env['ESCAVADOR_BASE_URL'] ?? 'https://api.escavador.com';
  return new EscavadorV2HttpClient(apiKey, baseUrl);
}

const escavador = new Hono();

// ═══════════════════════════════════════════════════════════════════════════
// V1 — Escavador API v1
// ═══════════════════════════════════════════════════════════════════════════

// ──── Saldo ────

escavador.get('/saldo', async (c) => {
  const op = new ObterSaldo(buildHttpV1());
  const result = await op.execute();
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'saldo', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'saldo', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

// ──── Buscas Assíncronas ────

escavador.get('/buscas-assincronas', async (c) => {
  const pagina = Number(c.req.query('page') ?? '1');
  const op = new ListarBuscasAssincronas(buildHttpV1());
  const result = await op.execute({ pagina });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'buscas-assincronas', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'buscas-assincronas', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/buscas-assincronas/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new ObterBuscaAssincrona(buildHttpV1());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'buscas-assincronas/obter', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'buscas-assincronas/obter', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

// ──── Processos — Buscas Assíncronas (iniciar) ────

escavador.post('/processos/tribunal/cpf-cnpj', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = z.object({
    cpf_cnpj: z.string().min(11).max(18),
    tribunais: z.array(z.string()).optional(),
  }).safeParse(body);
  if (!parsed.success) return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const op = new IniciarBuscaProcessosCpfCnpj(buildHttpV1());
  const input: Parameters<typeof op.execute>[0] = { cpfCnpj: parsed.data.cpf_cnpj };
  if (parsed.data.tribunais !== undefined) input.tribunais = parsed.data.tribunais;

  const result = await op.execute(input);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'processos/tribunal/cpf-cnpj', tipo_param: 'cpf_cnpj', param: parsed.data.cpf_cnpj, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'processos/tribunal/cpf-cnpj', tipo_param: 'cpf_cnpj', param: parsed.data.cpf_cnpj, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 202);
});

escavador.post('/processos/tribunal/envolvido', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = z.object({
    nome: z.string().min(1),
    tribunais: z.array(z.string()).optional(),
  }).safeParse(body);
  if (!parsed.success) return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const op = new IniciarBuscaProcessosEnvolvido(buildHttpV1());
  const input: Parameters<typeof op.execute>[0] = { nome: parsed.data.nome };
  if (parsed.data.tribunais !== undefined) input.tribunais = parsed.data.tribunais;

  const result = await op.execute(input);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'processos/tribunal/envolvido', tipo_param: 'nome', param: parsed.data.nome, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'processos/tribunal/envolvido', tipo_param: 'nome', param: parsed.data.nome, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 202);
});

escavador.post('/processos/tribunal/oab', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = z.object({
    oab: z.string().min(1),
    tribunais: z.array(z.string()).optional(),
  }).safeParse(body);
  if (!parsed.success) return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const op = new IniciarBuscaProcessosOab(buildHttpV1());
  const input: Parameters<typeof op.execute>[0] = { oab: parsed.data.oab };
  if (parsed.data.tribunais !== undefined) input.tribunais = parsed.data.tribunais;

  const result = await op.execute(input);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'processos/tribunal/oab', tipo_param: 'oab', param: parsed.data.oab, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'processos/tribunal/oab', tipo_param: 'oab', param: parsed.data.oab, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 202);
});

escavador.post('/processos/administrativo/nup', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = z.object({ nup: z.string().min(1) }).safeParse(body);
  if (!parsed.success) return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const op = new IniciarBuscaProcessoNup(buildHttpV1());
  const result = await op.execute({ nup: parsed.data.nup });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'processos/administrativo/nup', tipo_param: 'nup', param: parsed.data.nup, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'processos/administrativo/nup', tipo_param: 'nup', param: parsed.data.nup, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 202);
});

escavador.post('/processos/pesquisar', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = z.object({
    numero_cnj: z.string().min(1),
    tribunais: z.array(z.string()).optional(),
  }).safeParse(body);
  if (!parsed.success) return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const op = new IniciarBuscaProcesso(buildHttpV1());
  const input: Parameters<typeof op.execute>[0] = { numero_cnj: parsed.data.numero_cnj };
  if (parsed.data.tribunais !== undefined) input.tribunais = parsed.data.tribunais;

  const result = await op.execute(input);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'processos/pesquisar', tipo_param: 'numero_cnj', param: parsed.data.numero_cnj, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'processos/pesquisar', tipo_param: 'numero_cnj', param: parsed.data.numero_cnj, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 202);
});

escavador.post('/processos/tribunal/lote', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const LoteItemSchema = z.object({
    cpf_cnpj: z.string().optional(),
    nome: z.string().optional(),
    oab: z.string().optional(),
  });

  const parsed = z.object({
    itens: z.array(LoteItemSchema).min(1),
    tribunais: z.array(z.string()).optional(),
  }).safeParse(body);
  if (!parsed.success) return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const op = new IniciarBuscaProcessosLote(buildHttpV1());
  const input: Parameters<typeof op.execute>[0] = {
    itens: parsed.data.itens.map((i) => ({
      ...(i.cpf_cnpj !== undefined && { cpfCnpj: i.cpf_cnpj }),
      ...(i.nome !== undefined && { nome: i.nome }),
      ...(i.oab !== undefined && { oab: i.oab }),
    })),
  };
  if (parsed.data.tribunais !== undefined) input.tribunais = parsed.data.tribunais;

  const result = await op.execute(input);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'processos/tribunal/lote', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'processos/tribunal/lote', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 202);
});

// ──── Processos — Diários Oficiais ────

escavador.get('/processos/diarios-oficiais/numero', async (c) => {
  const numero = c.req.query('numero') ?? '';
  if (!numero) return c.json({ error: 'Parâmetro numero obrigatório' }, 400);

  const op = new BuscarProcessosDiarioPorNumero(buildHttpV1());
  const result = await op.execute({ numero });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'processos/diarios-oficiais/numero', tipo_param: 'numero', param: numero, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'processos/diarios-oficiais/numero', tipo_param: 'numero', param: numero, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/processos/diarios-oficiais/oab', async (c) => {
  const oab = c.req.query('oab') ?? '';
  if (!oab) return c.json({ error: 'Parâmetro oab obrigatório' }, 400);

  const op = new BuscarProcessosDiarioPorOab(buildHttpV1());
  const result = await op.execute({ oab });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'processos/diarios-oficiais/oab', tipo_param: 'oab', param: oab, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'processos/diarios-oficiais/oab', tipo_param: 'oab', param: oab, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

// ──── Processos — Detalhes ────

escavador.get('/processos/:numero_cnj', async (c) => {
  const numeroCnj = c.req.param('numero_cnj');
  const op = new ObterDetalhesProcesso(buildHttpV1());
  const result = await op.execute({ numeroCnj });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'processos/obter', tipo_param: 'numero_cnj', param: numeroCnj, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'processos/obter', tipo_param: 'numero_cnj', param: numeroCnj, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/processos/:numero_cnj/movimentacoes', async (c) => {
  const numeroCnj = c.req.param('numero_cnj');
  const pagina = Number(c.req.query('page') ?? '1');
  const op = new ObterMovimentacoesProcesso(buildHttpV1());
  const result = await op.execute({ numeroCnj, pagina });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'processos/movimentacoes', tipo_param: 'numero_cnj', param: numeroCnj, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'processos/movimentacoes', tipo_param: 'numero_cnj', param: numeroCnj, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/processos/:id/envolvidos-diarios', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new ObterEnvolvidosProcesso(buildHttpV1());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'processos/envolvidos-diarios', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'processos/envolvidos-diarios', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

// ──── Movimentações ────

escavador.get('/movimentacoes/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new ObterMovimentacao(buildHttpV1());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'movimentacoes/obter', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'movimentacoes/obter', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

// ──── Busca Geral ────

escavador.get('/busca', async (c) => {
  const query = c.req.query('q') ?? '';
  if (!query) return c.json({ error: 'Parâmetro q obrigatório' }, 400);

  const tipoRaw = c.req.query('tipo');
  const pagina = Number(c.req.query('page') ?? '1');

  const op = new BuscarGeral(buildHttpV1());
  const input: Parameters<typeof op.execute>[0] = { query, pagina };
  if (tipoRaw === 'pessoa' || tipoRaw === 'processo' || tipoRaw === 'instituicao') input.tipo = tipoRaw;
  const result = await op.execute(input);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'busca', tipo_param: 'query', param: query, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'busca', tipo_param: 'query', param: query, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

// ──── Pessoas ────

escavador.get('/pessoas/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new ObterPessoa(buildHttpV1());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'pessoas/obter', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'pessoas/obter', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/pessoas/:id/processos', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const pagina = Number(c.req.query('page') ?? '1');
  const op = new ObterProcessosPessoa(buildHttpV1());
  const result = await op.execute({ id, pagina });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'pessoas/processos', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'pessoas/processos', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/pessoas/:id/publicacoes', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const pagina = Number(c.req.query('page') ?? '1');
  const op = new BuscarPublicacoes(buildHttpV1());
  const result = await op.execute({ entidadeId: id, pagina });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'pessoas/publicacoes', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'pessoas/publicacoes', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

// ──── Instituições ────

escavador.get('/instituicoes/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new ObterInstituicao(buildHttpV1());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'instituicoes/obter', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'instituicoes/obter', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/instituicoes/:id/pessoas', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const pagina = Number(c.req.query('page') ?? '1');
  const op = new ObterPessoasInstituicao(buildHttpV1());
  const result = await op.execute({ id, pagina });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'instituicoes/pessoas', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'instituicoes/pessoas', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/instituicoes/:id/processos', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const pagina = Number(c.req.query('page') ?? '1');
  const op = new ObterProcessosInstituicao(buildHttpV1());
  const result = await op.execute({ id, pagina });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'instituicoes/processos', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'instituicoes/processos', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

// ──── Monitoramentos Diários Oficiais ────

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

escavador.get('/monitoramentos', async (c) => {
  const pagina = Number(c.req.query('page') ?? '1');
  const ativoRaw = c.req.query('ativo');
  const ativo = ativoRaw === 'true' ? true : ativoRaw === 'false' ? false : undefined;

  const op = new ListarMonitoramentos(buildHttpV1());
  const input: Parameters<typeof op.execute>[0] = { pagina };
  if (ativo !== undefined) input.ativo = ativo;
  const result = await op.execute(input);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/listar', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/listar', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.post('/monitoramentos', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = CriarMonitoramentoSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const op = new CriarMonitoramento(buildHttpV1());
  const input: Parameters<typeof op.execute>[0] = {
    nome: parsed.data.nome,
    tipo: parsed.data.tipo,
    identificador: parsed.data.identificador,
  };
  if (parsed.data.callback_url !== undefined) input.callback_url = parsed.data.callback_url;
  if (parsed.data.tribunais !== undefined) input.tribunais = parsed.data.tribunais;

  const result = await op.execute(input);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/criar', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/criar', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 201);
});

escavador.get('/monitoramentos/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new ObterMonitoramento(buildHttpV1());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/obter', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/obter', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.put('/monitoramentos/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = EditarMonitoramentoSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const op = new EditarMonitoramento(buildHttpV1());
  const input: Parameters<typeof op.execute>[0] = { id };
  if (parsed.data.ativo !== undefined) input.ativo = parsed.data.ativo;
  if (parsed.data.callback_url !== undefined) input.callback_url = parsed.data.callback_url;
  if (parsed.data.nome !== undefined) input.nome = parsed.data.nome;

  const result = await op.execute(input);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/editar', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/editar', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.delete('/monitoramentos/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new RemoverMonitoramento(buildHttpV1());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/remover', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/remover', tipo_param: 'id', param: String(id), result: null, status: 'success', created_at: new Date() });
  return c.body(null, 204);
});

escavador.get('/monitoramentos/:id/aparicoes', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const pagina = Number(c.req.query('page') ?? '1');
  const op = new ObterAparicoes(buildHttpV1());
  const result = await op.execute({ id, pagina });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/aparicoes', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/aparicoes', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.post('/monitoramentos/:id/testar-callback', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new TestarCallbackMonitoramento(buildHttpV1());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/testar-callback', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/testar-callback', tipo_param: 'id', param: String(id), result: null, status: 'success', created_at: new Date() });
  return c.body(null, 204);
});

escavador.get('/monitoramentos/:id/origens', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new ObterOrigensMonitoramento(buildHttpV1());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/origens', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/origens', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

// ──── Monitoramentos Tribunal ────

escavador.get('/monitoramentos/tribunal', async (c) => {
  const pagina = Number(c.req.query('page') ?? '1');
  const ativoRaw = c.req.query('ativo');
  const ativo = ativoRaw === 'true' ? true : ativoRaw === 'false' ? false : undefined;

  const op = new ListarMonitoramentosTribunal(buildHttpV1());
  const input: Parameters<typeof op.execute>[0] = { pagina };
  if (ativo !== undefined) input.ativo = ativo;
  const result = await op.execute(input);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/tribunal/listar', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/tribunal/listar', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.post('/monitoramentos/tribunal', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = CriarMonitoramentoTribunalSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const op = new CriarMonitoramentoTribunal(buildHttpV1());
  const input: Parameters<typeof op.execute>[0] = {
    tipo: parsed.data.tipo,
    identificador: parsed.data.identificador,
    tribunal: parsed.data.tribunal,
  };
  if (parsed.data.callback_url !== undefined) input.callback_url = parsed.data.callback_url;

  const result = await op.execute(input);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/tribunal/criar', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/tribunal/criar', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 201);
});

escavador.get('/monitoramentos/tribunal/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new ObterMonitoramentoTribunal(buildHttpV1());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/tribunal/obter', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/tribunal/obter', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.put('/monitoramentos/tribunal/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = EditarMonitoramentoTribunalSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const op = new EditarMonitoramentoTribunal(buildHttpV1());
  const input: Parameters<typeof op.execute>[0] = { id };
  if (parsed.data.ativo !== undefined) input.ativo = parsed.data.ativo;
  if (parsed.data.callback_url !== undefined) input.callback_url = parsed.data.callback_url;

  const result = await op.execute(input);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/tribunal/editar', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/tribunal/editar', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.delete('/monitoramentos/tribunal/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new RemoverMonitoramentoTribunal(buildHttpV1());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/tribunal/remover', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'monitoramentos/tribunal/remover', tipo_param: 'id', param: String(id), result: null, status: 'success', created_at: new Date() });
  return c.body(null, 204);
});

// ──── Callbacks V1 ────

escavador.get('/callbacks', async (c) => {
  const pagina = Number(c.req.query('page') ?? '1');
  const op = new ListarCallbacks(buildHttpV1());
  const result = await op.execute({ pagina });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'callbacks/listar', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'callbacks/listar', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.post('/callbacks/recebidos', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = z.object({ ids: z.array(z.number().int()).min(1) }).safeParse(body);
  if (!parsed.success) return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const op = new MarcarCallbacksRecebidos(buildHttpV1());
  const result = await op.execute({ ids: parsed.data.ids });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'callbacks/recebidos', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'callbacks/recebidos', tipo_param: null, param: null, result: null, status: 'success', created_at: new Date() });
  return c.body(null, 204);
});

escavador.post('/callbacks/reenviar', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = z.object({ id: z.number().int() }).safeParse(body);
  if (!parsed.success) return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const op = new ReenviarCallback(buildHttpV1());
  const result = await op.execute({ id: parsed.data.id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'callbacks/reenviar', tipo_param: 'id', param: String(parsed.data.id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'callbacks/reenviar', tipo_param: 'id', param: String(parsed.data.id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

// ──── Auxiliares ────

escavador.get('/tribunais', async (c) => {
  const tipo = c.req.query('tipo');
  const op = new ListarTribunais(buildHttpV1());
  const input: { tipo?: string } = {};
  if (tipo !== undefined) input.tipo = tipo;
  const result = await op.execute(input);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'tribunais/listar', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'tribunais/listar', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/tribunais/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new ObterTribunal(buildHttpV1());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'tribunais/obter', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'tribunais/obter', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/orgaos-administrativos', async (c) => {
  const pagina = Number(c.req.query('page') ?? '1');
  const op = new ListarOrgaosAdministrativos(buildHttpV1());
  const result = await op.execute({ pagina });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'orgaos-administrativos/listar', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'orgaos-administrativos/listar', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/diarios-oficiais/origens', async (c) => {
  const estado = c.req.query('estado');
  const op = new ListarOrigensDiariosOficiais(buildHttpV1());
  const input: { estado?: string } = {};
  if (estado !== undefined) input.estado = estado;
  const result = await op.execute(input);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V1, fonte: 'diarios-oficiais/origens', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V1, fonte: 'diarios-oficiais/origens', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

// ═══════════════════════════════════════════════════════════════════════════
// V2 — Escavador API v2
// ═══════════════════════════════════════════════════════════════════════════

// ──── Consulta de Processos ────

escavador.get('/v2/processos/numero_cnj/:numero', async (c) => {
  const numero = c.req.param('numero');
  const op = new ObterProcessoPorCnj(buildHttpV2());
  const result = await op.execute({ numero });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/obter', tipo_param: 'numero_cnj', param: numero, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/obter', tipo_param: 'numero_cnj', param: numero, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/v2/processos/movimentacoes/:numero_cnj', async (c) => {
  const numero_cnj = c.req.param('numero_cnj');
  const pagina = Number(c.req.query('page') ?? '1');
  const op = new ObterMovimentacoesV2(buildHttpV2());
  const result = await op.execute({ numero_cnj, pagina });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/movimentacoes', tipo_param: 'numero_cnj', param: numero_cnj, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/movimentacoes', tipo_param: 'numero_cnj', param: numero_cnj, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/v2/processos/envolvido', async (c) => {
  const op = new BuscarProcessosPorEnvolvido(buildHttpV2());
  const input: Parameters<typeof op.execute>[0] = {};
  const nome = c.req.query('nome');
  const cpf_cnpj = c.req.query('cpf_cnpj');
  const pagina = Number(c.req.query('page') ?? '1');
  if (nome !== undefined) input.nome = nome;
  if (cpf_cnpj !== undefined) input.cpf_cnpj = cpf_cnpj;
  input.pagina = pagina;
  const result = await op.execute(input);
  const tipoParam = cpf_cnpj !== undefined ? 'cpf_cnpj' : nome !== undefined ? 'nome' : null;
  const paramVal = cpf_cnpj ?? nome ?? null;
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/envolvido', tipo_param: tipoParam, param: paramVal, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/envolvido', tipo_param: tipoParam, param: paramVal, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/v2/processos/envolvido/resumo', async (c) => {
  const op = new ResumoProcessosPorEnvolvido(buildHttpV2());
  const input: Parameters<typeof op.execute>[0] = {};
  const nome = c.req.query('nome');
  const cpf_cnpj = c.req.query('cpf_cnpj');
  if (nome !== undefined) input.nome = nome;
  if (cpf_cnpj !== undefined) input.cpf_cnpj = cpf_cnpj;
  const result = await op.execute(input);
  const tipoParam = cpf_cnpj !== undefined ? 'cpf_cnpj' : nome !== undefined ? 'nome' : null;
  const paramVal = cpf_cnpj ?? nome ?? null;
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/envolvido/resumo', tipo_param: tipoParam, param: paramVal, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/envolvido/resumo', tipo_param: tipoParam, param: paramVal, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/v2/processos/advogado/:oab', async (c) => {
  const oab = c.req.param('oab');
  const pagina = Number(c.req.query('page') ?? '1');
  const op = new BuscarProcessosPorAdvogado(buildHttpV2());
  const result = await op.execute({ oab, pagina });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/advogado', tipo_param: 'oab', param: oab, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/advogado', tipo_param: 'oab', param: oab, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/v2/processos/advogado/:oab/resumo', async (c) => {
  const oab = c.req.param('oab');
  const op = new ResumoProcessosPorAdvogado(buildHttpV2());
  const result = await op.execute({ oab });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/advogado/resumo', tipo_param: 'oab', param: oab, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/advogado/resumo', tipo_param: 'oab', param: oab, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/v2/processos/:numero_cnj/documentos', async (c) => {
  const numero_cnj = c.req.param('numero_cnj');
  const pagina = Number(c.req.query('page') ?? '1');
  const op = new ObterDocumentosProcesso(buildHttpV2());
  const result = await op.execute({ numero_cnj, pagina });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/documentos', tipo_param: 'numero_cnj', param: numero_cnj, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/documentos', tipo_param: 'numero_cnj', param: numero_cnj, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/v2/processos/:numero_cnj/autos', async (c) => {
  const numero_cnj = c.req.param('numero_cnj');
  const pagina = Number(c.req.query('page') ?? '1');
  const op = new ObterAutosProcesso(buildHttpV2());
  const result = await op.execute({ numero_cnj, pagina });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/autos', tipo_param: 'numero_cnj', param: numero_cnj, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/autos', tipo_param: 'numero_cnj', param: numero_cnj, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/v2/processos/:numero_cnj/envolvidos', async (c) => {
  const numero_cnj = c.req.param('numero_cnj');
  const op = new ObterEnvolvidosProcessoV2(buildHttpV2());
  const result = await op.execute({ numero_cnj });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/envolvidos', tipo_param: 'numero_cnj', param: numero_cnj, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/envolvidos', tipo_param: 'numero_cnj', param: numero_cnj, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

// ──── Atualização de Processos V2 ────

escavador.post('/v2/processos/atualizacao', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = z.object({ processos_ids: z.array(z.number().int()).min(1) }).safeParse(body);
  if (!parsed.success) return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const op = new SolicitarAtualizacaoLote(buildHttpV2());
  const result = await op.execute({ processos_ids: parsed.data.processos_ids });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/atualizacao/lote', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/atualizacao/lote', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 202);
});

escavador.get('/v2/processos/atualizacao/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new ObterStatusAtualizacaoLote(buildHttpV2());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/atualizacao/lote/status', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/atualizacao/lote/status', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/v2/processos/:id/atualizacao', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new ObterStatusAtualizacaoProcesso(buildHttpV2());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/atualizacao/status', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/atualizacao/status', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.post('/v2/processos/:id/atualizacao', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new SolicitarAtualizacaoProcesso(buildHttpV2());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/atualizacao/solicitar', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/atualizacao/solicitar', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 202);
});

// ──── Resumo de Processos (IA) V2 ────

escavador.post('/v2/processos/:id/resumo', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new SolicitarResumoProcesso(buildHttpV2());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/resumo/solicitar', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/resumo/solicitar', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 202);
});

escavador.get('/v2/processos/:id/resumo', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new ObterResumoProcesso(buildHttpV2());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/resumo/obter', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/resumo/obter', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/v2/processos/:id/resumo/status', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new ObterStatusResumoProcesso(buildHttpV2());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/resumo/status', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/resumo/status', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

// ──── Download de Documento V2 ────

escavador.get('/v2/documentos/:id/download', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const apiKey = process.env['ESCAVADOR_API_KEY'] ?? '';
  const baseUrl = process.env['ESCAVADOR_BASE_URL'] ?? 'https://api.escavador.com';
  const op = new DownloadDocumento(apiKey, baseUrl);
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/documentos/download', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/processos/documentos/download', tipo_param: 'id', param: String(id), result: { size: result.value.byteLength }, status: 'success', created_at: new Date() });
  return c.body(new Uint8Array(result.value), 200, { 'Content-Type': 'application/pdf' });
});

// ──── Monitoramentos V2 — Novos Processos ────

escavador.get('/v2/monitoramentos/novos-processos', async (c) => {
  const pagina = Number(c.req.query('page') ?? '1');
  const op = new ListarMonitoramentosNovosProcessos(buildHttpV2());
  const result = await op.execute({ pagina });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/novos-processos/listar', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/novos-processos/listar', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.post('/v2/monitoramentos/novos-processos', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = z.object({
    variacao_busca: z.string().min(1),
    tribunais: z.array(z.number().int()).optional(),
    callback_url: z.string().url().optional(),
  }).safeParse(body);
  if (!parsed.success) return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const op = new CriarMonitoramentoNovosProcessos(buildHttpV2());
  const input: Parameters<typeof op.execute>[0] = { variacao_busca: parsed.data.variacao_busca };
  if (parsed.data.tribunais !== undefined) input.tribunais = parsed.data.tribunais;
  if (parsed.data.callback_url !== undefined) input.callback_url = parsed.data.callback_url;

  const result = await op.execute(input);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/novos-processos/criar', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/novos-processos/criar', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 201);
});

escavador.get('/v2/monitoramentos/novos-processos/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new ObterMonitoramentoNovosProcessos(buildHttpV2());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/novos-processos/obter', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/novos-processos/obter', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.patch('/v2/monitoramentos/novos-processos/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = z.object({
    variacao_busca: z.string().optional(),
    tribunais: z.array(z.number().int()).optional(),
    callback_url: z.string().url().optional(),
    ativo: z.boolean().optional(),
  }).safeParse(body);
  if (!parsed.success) return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const op = new EditarMonitoramentoNovosProcessos(buildHttpV2());
  const input: Parameters<typeof op.execute>[0] = { id };
  if (parsed.data.variacao_busca !== undefined) input.variacao_busca = parsed.data.variacao_busca;
  if (parsed.data.tribunais !== undefined) input.tribunais = parsed.data.tribunais;
  if (parsed.data.callback_url !== undefined) input.callback_url = parsed.data.callback_url;
  if (parsed.data.ativo !== undefined) input.ativo = parsed.data.ativo;

  const result = await op.execute(input);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/novos-processos/editar', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/novos-processos/editar', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.delete('/v2/monitoramentos/novos-processos/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new RemoverMonitoramentoNovosProcessos(buildHttpV2());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/novos-processos/remover', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/novos-processos/remover', tipo_param: 'id', param: String(id), result: null, status: 'success', created_at: new Date() });
  return c.body(null, 204);
});

escavador.get('/v2/monitoramentos/novos-processos/:id/resultados', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const pagina = Number(c.req.query('page') ?? '1');
  const op = new ObterResultadosMonitoramentoNovosProcessos(buildHttpV2());
  const result = await op.execute({ id, pagina });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/novos-processos/resultados', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/novos-processos/resultados', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

// ──── Monitoramentos V2 — Processos ────

escavador.get('/v2/monitoramentos/processos', async (c) => {
  const pagina = Number(c.req.query('page') ?? '1');
  const op = new ListarMonitoramentosProcesso(buildHttpV2());
  const result = await op.execute({ pagina });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/processos/listar', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/processos/listar', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.post('/v2/monitoramentos/processos', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = z.object({
    processo_id: z.number().int(),
    callback_url: z.string().url().optional(),
  }).safeParse(body);
  if (!parsed.success) return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const op = new CriarMonitoramentoProcesso(buildHttpV2());
  const input: Parameters<typeof op.execute>[0] = { processo_id: parsed.data.processo_id };
  if (parsed.data.callback_url !== undefined) input.callback_url = parsed.data.callback_url;

  const result = await op.execute(input);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/processos/criar', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/processos/criar', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 201);
});

escavador.get('/v2/monitoramentos/processos/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new ObterMonitoramentoProcesso(buildHttpV2());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/processos/obter', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/processos/obter', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.delete('/v2/monitoramentos/processos/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new RemoverMonitoramentoProcesso(buildHttpV2());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/processos/remover', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/monitoramentos/processos/remover', tipo_param: 'id', param: String(id), result: null, status: 'success', created_at: new Date() });
  return c.body(null, 204);
});

// ──── Callbacks V2 ────

escavador.get('/v2/callbacks', async (c) => {
  const pagina = Number(c.req.query('page') ?? '1');
  const op = new ListarCallbacksV2(buildHttpV2());
  const result = await op.execute({ pagina });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/callbacks/listar', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/callbacks/listar', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.post('/v2/callbacks/recebidos', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = z.object({ ids: z.array(z.number().int()).min(1).max(20) }).safeParse(body);
  if (!parsed.success) return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const op = new MarcarCallbacksRecebidosV2(buildHttpV2());
  const result = await op.execute({ ids: parsed.data.ids });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/callbacks/recebidos', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/callbacks/recebidos', tipo_param: null, param: null, result: null, status: 'success', created_at: new Date() });
  return c.body(null, 204);
});

escavador.post('/v2/callbacks/:id/reenviar', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new ReenviarCallbackV2(buildHttpV2());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/callbacks/reenviar', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/callbacks/reenviar', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

// ──── Certificados V2 ────

escavador.get('/v2/certificados', async (c) => {
  const op = new ListarCertificados(buildHttpV2());
  const result = await op.execute();
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/certificados/listar', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/certificados/listar', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.post('/v2/certificados', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = z.object({
    nome: z.string().min(1),
    arquivo_base64: z.string().min(1),
    senha: z.string().min(1),
  }).safeParse(body);
  if (!parsed.success) return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const op = new CriarCertificado(buildHttpV2());
  const result = await op.execute(parsed.data);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/certificados/criar', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/certificados/criar', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 201);
});

escavador.get('/v2/certificados/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new ObterCertificado(buildHttpV2());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/certificados/obter', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/certificados/obter', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.delete('/v2/certificados/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const op = new RemoverCertificado(buildHttpV2());
  const result = await op.execute({ id });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/certificados/remover', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/certificados/remover', tipo_param: 'id', param: String(id), result: null, status: 'success', created_at: new Date() });
  return c.body(null, 204);
});

escavador.post('/v2/certificados/:id/autenticacoes', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'ID inválido' }, 400);

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = z.object({
    tipo: z.string().min(1),
    valor: z.string().optional(),
  }).safeParse(body);
  if (!parsed.success) return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const op = new CriarAutenticacaoCertificado(buildHttpV2());
  const input: Parameters<typeof op.execute>[0] = { id, tipo: parsed.data.tipo };
  if (parsed.data.valor !== undefined) input.valor = parsed.data.valor;

  const result = await op.execute(input);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/certificados/autenticacoes/criar', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/certificados/autenticacoes/criar', tipo_param: 'id', param: String(id), result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 201);
});

escavador.delete('/v2/certificados/:id/autenticacoes/:autenticacaoId', async (c) => {
  const id = Number(c.req.param('id'));
  const autenticacaoId = Number(c.req.param('autenticacaoId'));
  if (Number.isNaN(id) || Number.isNaN(autenticacaoId)) return c.json({ error: 'ID inválido' }, 400);

  const op = new RemoverAutenticacaoCertificado(buildHttpV2());
  const result = await op.execute({ id, autenticacaoId });
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/certificados/autenticacoes/remover', tipo_param: 'id', param: String(id), result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/certificados/autenticacoes/remover', tipo_param: 'id', param: String(id), result: null, status: 'success', created_at: new Date() });
  return c.body(null, 204);
});

// ──── Tribunais V2 ────

escavador.get('/v2/tribunais/sistemas', async (c) => {
  const op = new ListarSistemasTribunais(buildHttpV2());
  const result = await op.execute();
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/tribunais/sistemas', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/tribunais/sistemas', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

escavador.get('/v2/tribunais', async (c) => {
  const sistemaIdRaw = c.req.query('sistema_id');
  const op = new ListarTribunaisV2(buildHttpV2());
  const input: Parameters<typeof op.execute>[0] = {};
  if (sistemaIdRaw !== undefined) {
    const id = Number(sistemaIdRaw);
    if (!Number.isNaN(id)) input.sistema_id = id;
  }
  const result = await op.execute(input);
  if (isLeft(result)) {
    rawStore.save({ gateway: GW_V2, fonte: 'v2/tribunais/listar', tipo_param: null, param: null, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind, created_at: new Date() });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500);
  }
  rawStore.save({ gateway: GW_V2, fonte: 'v2/tribunais/listar', tipo_param: null, param: null, result: result.value, status: 'success', created_at: new Date() });
  return c.json(result.value, 200);
});

export { escavador };
