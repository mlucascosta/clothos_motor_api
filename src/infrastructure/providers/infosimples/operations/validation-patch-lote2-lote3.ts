// PATCH LOTE 2+3 — adicionar em validation-map.ts:
//
//   // Lote 2 — Antecedentes Criminais
//   // 'consultas/antecedentes-criminais/mg' — sem required (rg e cpf opcionais)
//   'consultas/antecedentes-criminais/pf/emit': ['nome', 'birthdate'],
//   'consultas/antecedentes-criminais/pf/val': ['certidao_codigo', 'birthdate'],
//   'consultas/antecedentes-criminais/sp': ['nome', 'birthdate', 'genero'],
//
//   // Lote 3 — BCB, B3, CADE, CVM, MPF, MP-SP
//   // 'consultas/bcb/cheques-sem-fundo' — sem required (credenciais opcionais)
//   'consultas/bcb/valores-receber': [{ oneOf: ['cpf', 'cnpj'] }],
//   'consultas/b3/participantes': ['cnpj'],
//   // 'consultas/cade/processos' — sem required (processo opcional)
//   // 'consultas/cvm/participante' — sem required (name/cpf/cnpj opcionais)
//   // 'consultas/cvm/processo-administrativo' — sem required
//   // 'consultas/cvm/sancionadores' — sem required
//   'consultas/mpf/amazonia-protege': [{ oneOf: ['cpf', 'cnpj'] }],
//   'consultas/mpf/certidao-negativa': [{ oneOf: ['cpf', 'cnpj'] }],
//   'consultas/mpf/lava-jato': ['termos'],
//   'consultas/mpf/processos': ['query'],
//   // 'consultas/mp/sp/inquerito-civil' — sem required (cpf/cnpj/nome opcionais)
