import type { ExecutionPlan } from './contracts.js';

/** Desfecho de um passo do plano congelado. `skipped` = fallback já coberto por outro membro. */
export type StepOutcome = 'completed' | 'failed' | 'skipped';

/**
 * Cobertura de uma investigação por produto (B4.5), na linguagem de REQUISITOS — não de fontes.
 * Alimenta a ConsumptionStateMachine (B4.3) do lado do Laravel.
 *
 * PONDERADA (REGRAS §14): cada requisito contribui com o seu PESO (máximo entre os membros do
 * grupo; default 1). Com todos os pesos = 1 o resultado degenera na contagem simples — o
 * contrato com o Laravel não muda, só a unidade (pontos em vez de fontes).
 */
export interface PlanCoverage {
  requiredTotal: number;
  requiredSucceeded: number;
  optionalTotal: number;
  optionalSucceeded: number;
}

/** Chave do requisito: o grupo de fallback, ou a própria fonte quando avulsa. */
function requirementKey(sourceCode: string, fallbackGroup: string | null): string {
  return fallbackGroup ?? `@${sourceCode}`;
}

/**
 * Um REQUISITO é uma fonte avulsa (sem grupo) OU um grupo de fallback inteiro. É essencial se a
 * fonte avulsa é `required` ou se QUALQUER membro do grupo é `required`. É satisfeito quando ao
 * menos um membro `completed`. Assim, C4 judicial {datajud required, directdata fallback} conta
 * como UM requisito essencial satisfeito se datajud OU directdata entregar.
 */
export function computeCoverage(
  plan: ExecutionPlan,
  outcomes: ReadonlyMap<string, StepOutcome>,
): PlanCoverage {
  const groups = new Map<string, { required: boolean; satisfied: boolean; weight: number }>();
  for (const step of plan.steps) {
    const key = requirementKey(step.source_code, step.fallback_group);
    const group = groups.get(key) ?? { required: false, satisfied: false, weight: 1 };
    group.required = group.required || step.required;
    // O peso do REQUISITO é o maior peso entre os membros: um fallback barato que substitui
    // uma primária pesada satisfaz o mesmo requisito, com o mesmo valor de cobertura.
    group.weight = Math.max(group.weight, step.weight ?? 1);
    if (outcomes.get(step.source_code) === 'completed') group.satisfied = true;
    groups.set(key, group);
  }

  const coverage: PlanCoverage = {
    requiredTotal: 0,
    requiredSucceeded: 0,
    optionalTotal: 0,
    optionalSucceeded: 0,
  };
  for (const group of groups.values()) {
    if (group.required) {
      coverage.requiredTotal += group.weight;
      if (group.satisfied) coverage.requiredSucceeded += group.weight;
    } else {
      coverage.optionalTotal += group.weight;
      if (group.satisfied) coverage.optionalSucceeded += group.weight;
    }
  }
  return coverage;
}

/** Índice source_code → grupo de fallback, para o skip best-effort no loop de execução. */
export function fallbackGroupBySource(plan: ExecutionPlan): ReadonlyMap<string, string | null> {
  return new Map(plan.steps.map((step) => [step.source_code, step.fallback_group]));
}
