/**
 * @fileoverview Global teardown — executado após todos os testes de integração.
 *
 * Nota: globalSetup/globalTeardown rodam em processo isolado do Jest, separado
 * dos workers de teste. O pool singleton do módulo pool.ts pertence ao processo
 * de cada worker (fechado pelo afterAll de cada suite). Aqui apenas logamos a conclusão.
 */

export default async function globalTeardown(): Promise<void> {
  console.info('[integration-tests] Teardown concluído.');
}
