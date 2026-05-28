// PATCH LOTE 7+8 — adicionar em validation-map.ts:
//
// // Lote 7 — Prefeituras IPTU + Sefaz
// 'consultas/pref/mg/belo-horizonte/cndiptu': ['identificador', 'data_inicio', 'data_fim'],
// 'consultas/pref/mg/belo-horizonte/iptu': ['identificador'],
// 'consultas/pref/rj/rio-janeiro/iptu': ['inscricao'],
// 'consultas/pref/sp/campinas/iptu': ['codigo_cartografico', 'nome_devedor'],
// 'consultas/pref/sp/sao-paulo/dados-imovel': ['cadastro_imovel', 'ano_exercicio'],
// 'consultas/pref/sp/sao-paulo/debitos-iptu': ['cadastro_imovel'],
// 'consultas/pref/sp/sao-paulo/iptu2via': ['sql', 'parcela', 'ano'],
// 'consultas/pref/sp/sao-paulo/iptu': ['sql'],
// 'consultas/sefaz/df/iptu': ['inscricao_imovel'],
// 'consultas/sefaz/spu/certidao-imoveis': ['tipo_certidao'],
// (sefaz/spu/dados-imoveis não tem params required — sem entrada no mapa)
//
// // Lote 8 — Registradores
// 'consultas/registradores/certid/pedido': ['uf', 'municipio', 'cartorio', 'tipo_certidao', 'matricula'],
// 'consultas/registradores/matric/pedido': ['matricula', 'uf', 'municipio', 'cartorio', 'finalidade'],
// (certid/download, certid/recibo, info-conta, matric/download, matric/lista, matric/recibo não têm params required)
