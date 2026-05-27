# API Documentation

Gerado automaticamente por laravel-apidoc-next.

## Bem-vindo à API do Escavador Business

A API do Escavador Business foi criada para simplificar o acesso a dados públicos jurídicos no Brasil por meio de uma integração confiável, padronizada e pronta para uso em produção.

Com ela, sua aplicação pode consultar e processar informações de pessoas, empresas e processos de forma estruturada, sem depender de coletas manuais em múltiplas fontes.

Nesta documentação, você encontrará:

- Descrição funcional de cada endpoint.
- Exemplos de requisição e resposta.
- Modelos prontos de uso em `bash`, `javascript`, `php` e `python`.
- Orientações de autenticação, callbacks e paginação para integrações server-to-server.

## Limite de requisições

O limite de requisições no uso da API é de 500 requisições por minuto.

## Versões

A API do Escavador Business possui duas versões: V1 e V2.
Você pode encontrar mais informações sobre cada uma delas abaixo.
Também consulte a página de preços para saber mais sobre os custos de cada versão.
É importante identificar quais recursos da API você irá utilizar para escolher a versão mais adequada.

**API V1**: Conta com funcionalidades de busca e monitoramento de processos, pessoas e empresas, além de consulta e monitoramento em diários oficiais.

API Endpoint: `https://api.escavador.com/api/v1`

Para acessar a documentação da V1 da API, clique [aqui](https://api.escavador.com/v1/docs).

**API V2**: Conta com a funcionalidade de busca de processos e se diferencia da V1 por ter uma maior quantidade de informações estruturadas, de forma mais detalhada.

API Endpoint: `https://api.escavador.com/api/v2`

Para acessar a documentação da V2 da API, clique [aqui](https://api.escavador.com/v2/docs).

## Autenticação

### Personal Access Token (PAT) no padrão Bearer

A API do Escavador Business utiliza autenticação baseada em Personal Access Tokens (PAT) no padrão Bearer Token, amplamente adotado em integrações server-to-server.

Nesse modelo, o cliente gera, por meio de um painel seguro de gerenciamento, um token de acesso privado de visualização única. Após a criação, esse segredo não é exibido novamente. Para isso, é necessário ter uma conta na plataforma. Você pode fazer isso [aqui](https://api.escavador.com/).

O token deve ser enviado em todas as requisições HTTP no cabeçalho `Authorization`, com o prefixo `Bearer`.

```
Authorization: Bearer seu-token-aqui
```

### Regras de uso do PAT

- O PAT é destinado exclusivamente a comunicações server-to-server.
- O token não deve ser exposto em aplicações cliente (frontend), reduzindo a superfície de ataque.
- O token não substitui nem reutiliza credenciais sensíveis do usuário, como login e senha.

### Práticas de segurança adotadas

- Transmissão segura via HTTPS (TLS 1.2 ou superior), protegendo o token contra interceptação.
- Revogação imediata pelo próprio cliente, diretamente na plataforma.
- Escopo de uso controlado, limitado ao contexto da integração.

### Responsabilidade e resposta a incidentes

A guarda segura do token é uma responsabilidade compartilhada entre plataforma e cliente, seguindo o modelo padrão da indústria para credenciais de integração.
Em caso de suspeita de comprometimento, o token pode ser revogado e substituído rapidamente, sem impacto em outras credenciais ou acessos.

### Autenticando na API

Acesse o painel da API na [página de gestão de tokens](https://api.escavador.com/tokens).
Clique no botão `+ Criar Token`, forneça um nome para seu token e certifique-se de copiar o token gerado, pois ele não será exibido novamente.
Use o token gerado no cabeçalho das requisições para se autenticar na API.

Com o token gerado, envie o header `Authorization` com o valor `Bearer {seu-token-gerado}`.

## Painel da API

O [painel da API](https://api.escavador.com/painel) do Escavador é uma ferramenta que facilita o gerenciamento do seu uso da API. Nele, você pode acessar:

- Histórico de requisições
- Gerenciamento de tokens
- Configuração e monitoramento de callbacks
- Recarga de créditos
- Visualização de monitoramentos de tribunais e diários oficiais
- Faturas
- Preços das rotas

## Bibliotecas

### Python

Possuímos um SDK em Python com suporte para ambas as versões da API.
Para entender como utilizar o SDK, consulte nosso repositório no [GitHub](https://www.github.com/Escavador/escavador-python).

## Callbacks

As rotas da API V1 contam com a possibilidade de enviar callbacks. Essa é uma forma de receber novos eventos em seus monitoramentos ou resultados em buscas assíncronas, sem a necessidade de fazer novas requisições.

### O que é um callback

Um callback (também chamado de webhook) é uma chamada HTTP enviada pela API para uma URL da sua aplicação sempre que um evento relevante acontece.
Em vez de sua aplicação consultar a API repetidamente para saber se houve atualização (polling), a API notifica você automaticamente.

### Como o mecanismo funciona

1. Você cadastra uma URL de callback no painel da API.
2. Um evento acontece na plataforma (por exemplo, novo resultado de monitoramento ou conclusão de busca assíncrona).
3. A API envia uma requisição HTTP para a URL cadastrada, com os dados do evento.
4. Sua aplicação processa a notificação e retorna uma resposta HTTP de sucesso.

### Configurando uma URL de callback

Para configurar sua URL de callback, acesse a [página de callbacks](https://api.escavador.com/callbacks) no painel da API.
Nessa página, você pode informar a URL que receberá as notificações de monitoramentos e buscas assíncronas.
Quando novos eventos ou resultados forem gerados, eles serão enviados para a URL configurada.

### Token para validar callbacks da API

Com a URL de callbacks configurada, é importante validar se o callback recebido é, de fato, da API do Escavador Business.
Para isso, gere um token de segurança no painel da API.
Ao receber novos callbacks do Escavador, você pode validar se o token enviado é o mesmo que você gerou. O token é enviado no header `Authorization`.

### Boas práticas de implementação

- Exponha um endpoint específico para callbacks, com HTTPS obrigatório.
- Valide a autenticidade da chamada (conforme subseção de token para validação de callbacks).
- Trate o recebimento como processo idempotente: o mesmo evento não deve gerar efeitos duplicados.
- Responda rapidamente a requisição e processe tarefas pesadas de forma assíncrona no seu backend.
- Registre logs de recebimento e falha para facilitar observabilidade e auditoria.

## Saldo

Você pode consultar o custo, em centavos, de uma requisição no header `Creditos-Utilizados`, presente na resposta.
Visite a página de [histórico](https://api.escavador.com/v1/docs/#creditos) para saber como consultar seu saldo.
Consulte também a [página de preços](https://api.escavador.com/servicos) para saber mais sobre os custos de cada versão.

## Paginação

Algumas rotas da API utilizam paginação para retornar resultados em blocos menores, evitando respostas muito grandes e tornando o consumo da API mais eficiente.

Em geral, as respostas paginadas retornam:

- Os dados da página atual (normalmente em `data`)
- Metadados de paginação (como página atual, total de páginas e total de itens)
- Links para navegação entre páginas

Um exemplo comum de estrutura paginada é:

```
{
  "data": [{ "id": 1, "nome": "Exemplo" }],
  "links": {
    "first": "https://api.escavador.com/api/v1/recurso?page=1",
    "last": "https://api.escavador.com/api/v1/recurso?page=42",
    "prev": null,
    "next": "https://api.escavador.com/api/v1/recurso?page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 42,
    "per_page": 25,
    "to": 25,
    "total": 1032
  }
}
```

### Paginação numerada x paginação por cursor

Existem dois formatos comuns de paginação em APIs:

1. Paginação numerada (offset/page): navegação por número de página, como `?page=2&per_page=25`.
2. Paginação por cursor (cursor-based): navegação por um marcador de continuidade, como `?cursor=eyJpZCI6MTIzfQ==&limit=25`.

Principais diferenças:

- Navegação: paginação numerada permite pular para páginas específicas; cursor segue fluxo sequencial (próximo/anterior).
- Estabilidade em bases dinâmicas: cursor tende a ser mais estável quando dados são inseridos ou alterados durante a leitura, reduzindo duplicidades ou lacunas.
- Simplicidade: paginação numerada é mais simples para interfaces com paginação visual tradicional (ex.: página 7 de 42).
- Performance em grandes volumes: cursor costuma escalar melhor em listagens grandes e ordenadas por chave estável (ex.: `id`, `created_at`).

Na API do Escavador Business, o formato de paginação não é escolhido pelo consumidor da API.
Cada rota já define o modelo de paginação (numerada ou por cursor), e a integração deve seguir o contrato daquela rota.

Na prática:

- Se a rota retornar campos como `current_page`, `last_page` e `per_page`, trate como paginação numerada.
- Se a rota retornar cursor/ponteiro de continuidade, siga esse cursor para avançar na navegação.
- Sempre priorize os links e metadados devolvidos na resposta, em vez de montar URLs manualmente.

### Como percorrer as páginas

1. Faça a primeira requisição conforme os parâmetros esperados pela rota.
2. Processe os itens retornados em `data`.
3. Use os metadados e links de paginação retornados (`next`, `current_page`, cursor, etc.).
4. Continue requisitando enquanto houver próxima página.

### Boas práticas

- Sempre utilize os links de paginação retornados pela API, quando disponíveis.
- Evite assumir quantidade fixa de páginas: novos registros podem alterar o total durante a coleta.
- Em sincronizações longas, registre a última página processada para retomada em caso de falha.
- Considere o limite de requisições por minuto ao iterar muitas páginas.

### Atenção a mudanças de dados durante a navegação

Em consultas com atualização frequente, o conjunto de resultados pode mudar entre uma página e outra. Para minimizar duplicidades ou perdas:

- Utilize filtros determinísticos (por exemplo, período, ordenação e status), quando a rota permitir.
- Armazene um identificador único dos itens já processados.
- Trate o consumo de dados paginados como um processo incremental, garantindo idempotência no processamento dos itens, independentemente de inconsistências na paginação.

## Busca

### GET /api/v1/busca

**Buscar por termo**

Pesquisa um termo no Escavador.

O resultado da pesquisa pode incluir pessoas, instituições e diários oficiais, dependendo dos parâmetros fornecidos.

 O endpoint suporta pesquisas avançadas utilizando operadores lógicos para refinar os resultados.

- Requer autenticação: sim

#### Query Params

- `q` (string, required): O termo a ser pesquisado. Você pode pesquisar entre aspas duplas para match perfeito. <br/><br/>Se o parâmetro **utilizar_operadores_logicos=1** for informado, você pode tilizar os operados lógicos **AND**, **OR** e **NOT** para pesquisas avançadas e agrupar condições usando parênteses:<br/><div style="margin-left: 15px;">**João AND Silva**: retornará resultados que incluem ambos os termos "João" e "Silva".<br/>**(João OR Silva) AND Maria**: retornará resultados que incluem o termo "Maria" e pelo menos um dos termos "João" ou "Silva".<br/>**"Maria Silva" AND ("João Silva" OR "José Silva") AND NOT "santos"**: retornará resultados que incluem "Maria Silva" e pelo menos um dos termos "João Silva" ou "José Silva" e que não incluem o termo "santos".</div>
- `qo` (string, required): Tipo da entidade a ser pesquisada. Os valores podem ser:<br/><div style="margin-left: 15px;">**t**: Para pesquisar todos os tipos de entidades.<br/>**p**: Para pesquisar apenas as pessoas.<br/>**c**: Retorna a lista de pessoas, <u>com os respectivos ids no Escavador</u>.<br/>**i**: Para pesquisar apenas as instituições.<br/>**d**: Para pesquisar apenas os Diários Oficiais.<br/>**en**: Para pesquisar as pessoas e instituições que são envolvidas em processos.</div>
- `qs` (string, optional): Se o parâmetro **qo** (tipo da entidade) for igual a **'d'** (Diário Oficial), você pode definir a ordenação dos resultados da pesquisa. Os valores podem ser:<br/><div style="margin-left: 15px;">**d**: Ordena os resultados do mais recente para o mais antigo.<br/>**a**: Ordena os resultados do mais antigo para o mais recente.</div>
- `limit` (integer, optional): Número de itens que serão retornados por página. Default: 20
- `page` (integer, optional): Número da página, respeitando o limite informado.
- `utilizar_operadores_logicos` (integer, optional): **0** para pesquisa normal e **1** para pesquisa avançada. Default: 0

#### Responses

- Status 200
```json
{
    "paginator": {
        "total": 4,
        "total_pages": 1,
        "current_page": 1,
        "per_page": 20
    },
    "links": {
        "prev": null,
        "next": "https://api.escavador.com/api/v1/busca?q=Jo%C3%A3o%20da%20Silva&qo=t&page=2"
    },
    "items": [
        {
            "id": 4236069,
            "diario_id": 4236069,
            "numero_pagina": 31,
            "diario_sigla": "DOMNAT-RN",
            "diario_nome": "Diário Oficial do Município de Natal (Rio Grande do Norte)",
            "diario_data": "2011-08-12",
            "caderno": "Padrão",
            "caderno_url": "P",
            "texto": " JOAO SILVA...",
            "diario_edicao": "2094",
            "link": "https://www.escavador.com/diarios/4236069/DOMNAT-RN/P/2011-08-12?page=31",
            "link_api": "https://api.escavador.com/api/v1/diarios/4236069?page=31",
            "tipo_resultado": "Diario"
        },
        {
            "id": 13115517,
            "nome": "João Silva",
            "resumo": "De acordo com os dados indexados: João Silva Santos ...",
            "atuacao_formacao": null,
            "areas_atuacao": null,
            "nome_em_citacoes": null,
            "quantidade_processos": 90,
            "tipos_juridico": [
                {
                    "label": "REQUERENTE",
                    "quantidade_processos": 14
                },
                {
                    "label": "AUTOR",
                    "quantidade_processos": 14
                },
                {
                    "label": "RECLAMANTE",
                    "quantidade_processos": 10
                },
                {
                    "label": "REQUERIDO",
                    "quantidade_processos": 7
                },
                {
                    "label": "EXECUTADO",
                    "quantidade_processos": 6
                },
                {
                    "label": "APELANTE",
                    "quantidade_processos": 6
                },
                {
                    "label": "AGRAVADO",
                    "quantidade_processos": 5
                },
                {
                    "label": "RECORRIDO",
                    "quantidade_processos": 4
                },
                {
                    "label": "RECORRENTE",
                    "quantidade_processos": 3
                },
                {
                    "label": "INVTARDO",
                    "quantidade_processos": 2
                }
            ],
            "tem_processo": 1,
            "slug": "joao-silva",
            "url_id": 13337879,
            "link": "https://www.escavador.com/sobre/13337879/joao-silva",
            "link_api": "https://api.escavador.com/api/v1/pessoas/13115517",
            "tipo_resultado": "Pessoa",
            "oab_numero": [
                "1234"
            ],
            "tem_curriculo": 0,
            "updated_at": "2022-08-09 06:41:42",
            "tem_patente": 0
        },
        {
            "id": 7372109,
            "nome": "Joao Silva Company",
            "resumo": "De acordo com os dados indexados: Joao Silva Company possui 622 processos indexados, até então, pelo Escavador. Com 492 processos no Estado de São Paulo...",
            "sigla": "",
            "pais": "Brasil",
            "quantidade_pessoas": 0,
            "quantidade_processos": 622,
            "tipos_juridico": [
                {
                    "label": "REQUERIDO",
                    "quantidade_processos": 312
                },
                {
                    "label": "POLO PASSIVO",
                    "quantidade_processos": 61
                },
                {
                    "label": "RÉU",
                    "quantidade_processos": 28
                },
                {
                    "label": "TERCEIRO INTERESSADO",
                    "quantidade_processos": 18
                },
                {
                    "label": "RECLAMADO",
                    "quantidade_processos": 17
                },
                {
                    "label": "RECORRIDO",
                    "quantidade_processos": 14
                },
                {
                    "label": "AGRAVADO",
                    "quantidade_processos": 9
                },
                {
                    "label": "RECORRENTE",
                    "quantidade_processos": 7
                },
                {
                    "label": "APELADO",
                    "quantidade_processos": 4
                },
                {
                    "label": "INTERESSADO",
                    "quantidade_processos": 2
                }
            ],
            "tem_processo": 1,
            "slug": "njoao-silva-company",
            "url_id": 227162960,
            "link": "https://www.escavador.com/sobre/227162960/joao-silva-company",
            "link_api": "https://api.escavador.com/api/v1/instituicoes/7372109",
            "tipo_resultado": "Instituicao",
            "updated_at": "2022-08-12 06:42:34",
            "tem_patente": 0
        }
    ]
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

## Saldo da API

### GET /api/v1/quantidade-creditos

**Consultar saldo**

Retorna o saldo atual do usuário na API.

- Requer autenticação: sim

#### Responses

- Status 200
```json
{
    "quantidade_creditos": 99,
    "saldo": 0.99,
    "saldo_descricao": "R$ 0,99"
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

## Callback

### POST /api/v1/callbacks/marcar-recebidos

**Marcar callbacks como recebidos**

Marca os callbacks enviados pela API como recebidos.

Os callbacks que estão em tentativa (next_run_at diferente de null) não podem ser marcados como recebidos. Example: [1,12,42]

- Requer autenticação: sim

#### Body Params

- `ids` (array<int>, required): Os ids dos callbacks que foram recebidos, máximo de 20 por vez.

#### Responses

- Status 200
```json
{
    "items": [
        {
            "id": 1,
            "uuid": "027efc36e537d8f9b89c73869b69c941",
            "usuario_id": 1,
            "objeto_id": 1,
            "objeto_type": "ApiMonitoramento",
            "url": "http://api.teste.com/webhook",
            "attempts": 11,
            "next_run_at": "2018-01-18 19:57:44",
            "delivered_at": null,
            "created_at": "2018-01-16 22:38:19",
            "updated_at": "2018-01-18 19:57:44",
            "resultado": {
                "event": "update_time",
                "event_data": {
                    "updated_at": "05/08/2023 05:18:24"
                },
                "app": {
                    "id": 1,
                    "vip": true,
                    "monitor": {
                        "origens": [
                            "TRF5"
                        ],
                        "tipo": "UNICO",
                        "valor": "0000000-00.0000.0.00.0000",
                        "frequencia": "SEMANAL",
                        "cron": "28 16 * * 4",
                        "status": "FOUND",
                        "incluir_docpub": false,
                        "incluir_autos": false
                    },
                    "created_at": "21/03/2023 19:45:55",
                    "frequencia": "SEMANAL"
                },
                "processo": {
                    "origem": "TRF5",
                    "instancia": "PRIMEIRO_GRAU",
                    "extra_instancia": "",
                    "sistema": "PJE",
                    "numero_unico": "0000000-00.0000.0.00.0000"
                },
                "uuid": "027efc36e537d8f9b89c73869b69c941"
            },
            "status": "Em tentativa"
        },
        {
            "id": 2,
            "uuid": "d4e07ee0de82864c32c218e04f7e41ef",
            "usuario_id": 2,
            "objeto_id": 3,
            "objeto_type": "ApiAsync",
            "evento": "resultado_processo_async",
            "url": "https://api.teste.com/webhook",
            "attempts": 0,
            "next_run_at": null,
            "delivered_at": "2022-08-15 18:16:37",
            "created_at": "2022-08-15 18:16:37",
            "updated_at": "2022-08-15 18:16:37",
            "resultado": {
                "id": 1,
                "created_at": {
                    "date": "2022-08-15 18:16:24",
                    "timezone_type": 3,
                    "timezone": "UTC"
                },
                "enviar_callback": "SIM",
                "link_api": "https://api.escavador.com/api/v1/async/resultados/1",
                "numero_processo": "0000000-00.0000.0.00.0000",
                "resposta": {
                    "numero_unico": "0000000-00.0000.0.00.0000",
                    "origem": "TRT-5",
                    "instancias": [
                        {
                            "url": null,
                            "sistema": "PJE",
                            "instancia": "PRIMEIRO_GRAU",
                            "extra_instancia": "",
                            "segredo": false,
                            "numero": null,
                            "assunto": "Piso Salarial da Categoria / Salário Mínimo Profissional",
                            "classe": "Ação Trabalhista - Rito Ordinário",
                            "area": "Trabalhista",
                            "data_distribuicao": "29/10/2018",
                            "orgao_julgador": "27ª Vara do Trabalho de Salvador",
                            "moeda_valor_causa": null,
                            "valor_causa": null,
                            "arquivado": false,
                            "data_arquivamento": null,
                            "fisico": null,
                            "last_update_time": "15/08/2022 18:12",
                            "situacoes": [],
                            "dados": [
                                {
                                    "tipo": "Outros Assuntos",
                                    "valor": "Acordo e Convenção Coletivos de Trabalho\nAjuda / Tíquete Alimentação\nAviso Prévio\nContrato Individual de Trabalho\nDIREITO DO TRABALHO\nDIREITO PROCESSUAL CIVIL E DO TRABALHO\nDepósito / Diferença de Recolhimento\nDescontos Salariais - Devolução\nDireito Coletivo\nDuração do Trabalho\nExpurgos Inflacionários\nFGTS\nHoras Extras\nIndenização\nLevantamento / Liberação\nMulta Convencional\nMulta Prevista em Norma Coletiva\nMulta de 40% do FGTS\nMulta do Art. 475-J do CPC\nMulta do Artigo 467 da CLT\nMulta do Artigo 477 da CLT\nPenalidades Processuais\nReflexos\nRemuneração, Verbas Indenizatórias e Benefícios\nRepouso Semanal Remunerado e Feriado\nRescisão do Contrato de Trabalho\nSalário / Diferença Salarial\nSeguro Desemprego\nVerbas Rescisórias"
                                }
                            ],
                            "partes": [
                                {
                                    "id": 1,
                                    "tipo": "AUTOR",
                                    "nome": "ANTONIO",
                                    "principal": true,
                                    "polo": "ATIVO",
                                    "documento": {
                                        "tipo": "CPF",
                                        "numero": "00000000000"
                                    }
                                },
                                {
                                    "id": 2,
                                    "tipo": "ADVOGADO",
                                    "nome": "Walter",
                                    "principal": true,
                                    "polo": "ATIVO",
                                    "documento": {
                                        "tipo": "CPF",
                                        "numero": "00000000000"
                                    },
                                    "advogado_de": 1,
                                    "oabs": [
                                        {
                                            "numero": "1234",
                                            "uf": "BA"
                                        }
                                    ]
                                },
                                {
                                    "id": 3,
                                    "tipo": "RÉU",
                                    "nome": "DISTRIBUIDORA S/A",
                                    "principal": true,
                                    "polo": "PASSIVO",
                                    "documento": {
                                        "tipo": "CNPJ",
                                        "numero": "00000000000000"
                                    }
                                }
                            ],
                            "movimentacoes": [
                                {
                                    "id": 4,
                                    "data": "10/08/2022",
                                    "conteudo": "Decorrido o prazo de ANTONIO em 09/08/2022"
                                },
                                {
                                    "id": 3,
                                    "data": "09/08/2022",
                                    "conteudo": "Disponibilizado\n(a) o(a) intimação no Diário da Justiça Eletrônico"
                                },
                                {
                                    "id": 2,
                                    "data": "09/08/2022",
                                    "conteudo": "Publicado(a) o(a) intimação em 09/08/2022"
                                },
                                {
                                    "id": 1,
                                    "data": "08/08/2022",
                                    "conteudo": "Expedido(a) intimação a(o) DISTRIBUIDORA S/A"
                                }
                            ],
                            "audiencias": [
                                {
                                    "data": "12/02/2019 15:06",
                                    "audiencia": "",
                                    "situacao": "Realizada",
                                    "numero_pessoas": 0
                                }
                            ]
                        }
                    ]
                },
                "status": "SUCESSO",
                "status_callback": null,
                "tipo": "BUSCA_PROCESSO",
                "tribunal": {
                    "sigla": "TRT-5",
                    "nome": "TRT da 5ª Região",
                    "busca_processo": 1,
                    "busca_nome": 0,
                    "busca_oab": 0,
                    "disponivel_autos": 1,
                    "busca_documento": 1
                },
                "valor": "0000000-00.0000.0.00.0000",
                "event": "resultado_processo_async",
                "uuid": "d4e07ee0de82864c32c218e04f7e41ef"
            },
            "status": "Sucesso"
        },
        {
            "id": 3,
            "uuid": "0ab19863f3050147808331b3f16a15eb",
            "usuario_id": 2,
            "objeto_id": 3,
            "objeto_type": "Monitoramento",
            "evento": "diario_movimentacao_nova",
            "url": "https://api.teste.com/webhook",
            "attempts": 11,
            "next_run_at": null,
            "delivered_at": "2023-06-07 16:15:06",
            "created_at": "2023-06-04 16:46:08",
            "updated_at": "2023-06-07 16:15:06",
            "resultado": {
                "event": "diario_movimentacao_nova",
                "monitoramento": [
                    {
                        "id": 1,
                        "processo_id": 1,
                        "tribunal_processo_id": null,
                        "pasta_id": null,
                        "nome": null,
                        "termo": "0000000-00.0000.0.00.0000",
                        "categoria": "",
                        "tipo": "PROCESSO",
                        "alertar_apenas_novo_processo": 0,
                        "limite_aparicoes": null,
                        "enviar_email_principal": 1,
                        "origem_criacao": null,
                        "desativado": "NAO",
                        "desativado_motivo": null,
                        "bloqueado_ate": null,
                        "nao_monitorar_ate": null,
                        "api": "SIM",
                        "dados_adicionais": null,
                        "data_ultima_aparicao": {
                            "date": "2023-06-01 00:00:00",
                            "timezone_type": 3,
                            "timezone": "UTC"
                        },
                        "descricao": "Processo nº 0000000-00.0000.0.00.0000",
                        "aparicoes_nao_visualizadas": 1,
                        "quantidade_aparicoes_mes": 1,
                        "bloqueado_temporariamente": null,
                        "oab_principal": null,
                        "numero_diarios_monitorados": 171,
                        "numero_diarios_disponiveis": 173,
                        "tribunal_sigla": null,
                        "tribunal_disponivel": true,
                        "usuario_pode_visualizar": true,
                        "quantidade_aparicoes_por_tipo": {
                            "tribunal": [],
                            "diario": 1
                        },
                        "quantidade_aparicoes_nao_visualizadas_por_tipo": {
                            "tribunal": [],
                            "diario": 1,
                            "referencias": 0
                        },
                        "quantidade_sugestoes_nao_verificadas": 0,
                        "termos_auxiliares": [],
                        "processo": {
                            "id": 1,
                            "numero_antigo": null,
                            "numero_novo": "0000000-00.0000.0.00.0000",
                            "is_cnj": 1,
                            "enviado_trimon_em": "2022-01-22 23:26:17",
                            "created_at": null,
                            "updated_at": "2023-06-04 16:31:01",
                            "origem_tribunal_id": 26,
                            "filtrado_em": null,
                            "enviado_nursery_em": null,
                            "link": "https://www.escavador.com/processos/852608/processo-0000000-0000000000000-do-trt-da-15-regiao",
                            "link_api": "https://api.escavador.com/api/v1/processos/1",
                            "data_movimentacoes": "16/07/2013 a 01/06/2023",
                            "data_primeira_movimentacao": "16/07/2013",
                            "url": {
                                "id": 1,
                                "slug": "processo-00000000000000000-do-trt-da-15-regiao",
                                "objeto_type": "Processo",
                                "objeto_id": 1,
                                "redirect": 12,
                                "created_at": null,
                                "anuncio_ocultado_em": null
                            }
                        }
                    }
                ],
                "movimentacao": {
                    "id": 1,
                    "secao": "Secretaria da Segunda Turma",
                    "texto_categoria": "",
                    "diario_oficial_id": 1,
                    "processo_id": 1,
                    "pagina": 4553,
                    "complemento": null,
                    "tipo": "Agravo de Instrumento em Recurso de Revista",
                    "subtipo": null,
                    "conteudo": "<p><font class=\"\"><b>complemento:</b> Complemento Processo Eletrônico</font></p><div>",
                    "data": "2023-06-01T00:00:00.000000Z",
                    "letras_processo": "",
                    "subprocesso": null,
                    "elasticsearch_status": "NOT_INDEXED",
                    "created_at": "2023-06-04 16:31:01",
                    "updated_at": "2023-06-04 16:31:01",
                    "descricao_pequena": "Movimentação do processo 0000000-00.0000.0.00.0000",
                    "diario_oficial": "01/06/2023 | TST - Judiciário",
                    "estado": "Brasil",
                    "envolvidos": [
                        {
                            "id": 1,
                            "nome": "Maria",
                            "objeto_type": "Pessoa",
                            "pivot_tipo": "RELATOR",
                            "pivot_outros": "NAO",
                            "pivot_extra_nome": "Min.",
                            "link": "https://www.escavador.com/sobre/1/maria",
                            "link_api": "https://api.escavador.com/api/v1/pessoas/1",
                            "nome_sem_filtro": "Maria",
                            "envolvido_tipo": "Relator",
                            "envolvido_extra_nome": "Min.",
                            "oab": "",
                            "advogado_de": null
                        }
                    ],
                    "link": "https://www.escavador.com/diarios/0000000/TST/J/2023-06-01/1/movimentacao-do-processo-0000000-0000000000000",
                    "link_api": "https://api.escavador.com/api/v1/movimentacoes/1",
                    "data_formatada": "01/06/2023",
                    "objeto_type": "Movimentacao",
                    "link_pdf": "https://www.escavador.com/diarios/00000/TST/J/2023-06-01/pdf/baixar?page=4553",
                    "link_pdf_api": "https://api.escavador.com/api/v1/diarios/000000/pdf/pagina/4553/baixar",
                    "snippet": "conteudo do snippet",
                    "processo": {
                        "id": 1,
                        "numero_antigo": null,
                        "numero_novo": "0000000-00.0000.0.00.0000",
                        "is_cnj": 1,
                        "enviado_trimon_em": "2022-01-22 23:26:17",
                        "created_at": null,
                        "updated_at": "2023-06-04 16:31:01",
                        "origem_tribunal_id": 26,
                        "filtrado_em": null,
                        "enviado_nursery_em": null,
                        "link": "https://www.escavador.com/processos/852608/processo-0000000-0000000000000-do-trt-da-15-regiao",
                        "link_api": "https://api.escavador.com/api/v1/processos/1",
                        "data_movimentacoes": "16/07/2013 a 01/06/2023",
                        "data_primeira_movimentacao": "16/07/2013",
                        "url": {
                            "id": 1,
                            "slug": "processo-0000000-0000000000000-do-trt-da-15-regiao",
                            "objeto_type": "Processo",
                            "objeto_id": 1,
                            "redirect": 12,
                            "created_at": null,
                            "anuncio_ocultado_em": null
                        }
                    },
                    "diario": {
                        "id": 1,
                        "path": "",
                        "origem_id": 1,
                        "plugin": "TRT",
                        "edicao": "3734/2023",
                        "tipo": "Judiciário",
                        "tipo_url": "J",
                        "tipo_ocr": "OCR_1",
                        "tipo_exibicao": "MOVIMENTACOES",
                        "data": "2023-06-01",
                        "data_disponibilizacao": null,
                        "data_publicacao": "2023-06-01",
                        "qtd_paginas": 9292,
                        "pdf_key": null,
                        "pdf_key_backblaze": "diarios",
                        "pdf_pages": 9292,
                        "external_storage_id": 1890431,
                        "created_at": "2023-06-04 16:28:24",
                        "elasticsearch_status": "NOT_INDEXED",
                        "atena_status": "INDEXED",
                        "vespa_ultima_indexacao": "2023-06-04 16:40:08",
                        "descricao": "Tribunal Superior do Trabalho",
                        "objeto_type": "Diario",
                        "origem": {
                            "id": 3,
                            "nome": "Tribunal Superior do Trabalho",
                            "sigla": "TST",
                            "tipo": null,
                            "db": "JURIDICO",
                            "estado": "Brasil-TST",
                            "competencia": "Brasil",
                            "categoria": "Diários do Judiciário",
                            "created_at": "2015-10-14T05:28:45.000000Z",
                            "updated_at": "2015-10-14T05:28:45.000000Z"
                        }
                    },
                    "url": {
                        "id": 1,
                        "slug": "movimentacao-do-processo-0000000-0000000000000",
                        "objeto_type": "Movimentacao",
                        "objeto_id": 1,
                        "redirect": null,
                        "created_at": "2023-06-04T16:31:01.000000Z",
                        "anuncio_ocultado_em": null
                    }
                },
                "uuid": "0ab19863f3050147808331b3f16a15eb"
            },
            "status": "Sucesso"
        }
    ]
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### GET /api/v1/callbacks

**Listar os callbacks**

Consultar todos os callbacks recebidos pela API.

- Requer autenticação: sim

#### Query Params

- `data_maxima` (string, optional): Data e hora (em UTC) máxima dos callbacks listados.
- `data_minima` (string, optional): Data e hora (em UTC) mínima dos callbacks listados.
- `evento` (string, optional): Evento que gerou o callback. <br><b>Obrigatório o uso do `item_tipo` e `item_id`</b>
- `item_tipo` (string, optional): Tipo do item relacionado ao callback. <br/><b>Valores permitidos: `busca_assincrona`, `monitoramento_tribunal`, `monitoramento_diario`</b>
- `item_id` (integer, optional): Id do item relacionado ao callback.<br/><b>Obrigatório o uso do `item_tipo`</b>
- `status` (string, optional): Status do callback. <br/><b>Valores permitidos: `sucesso`, `em_tentativa`, `erro`</b>

#### Responses

- Status 200
```json
{
    "paginator": {
        "total": 2,
        "total_pages": 1,
        "current_page": 1,
        "per_page": 20
    },
    "links": {
        "prev": null,
        "next": null
    },
    "items": [
        {
            "id": 1,
            "uuid": "027efc36e537d8f9b89c73869b69c941",
            "usuario_id": 1,
            "objeto_id": 1,
            "objeto_type": "ApiMonitoramento",
            "url": "http://api.teste.com/webhook",
            "attempts": 11,
            "next_run_at": "2018-01-18 19:57:44",
            "delivered_at": null,
            "created_at": "2018-01-16 22:38:19",
            "updated_at": "2018-01-18 19:57:44",
            "resultado": {
                "event": "update_time",
                "event_data": {
                    "updated_at": "05/08/2023 05:18:24"
                },
                "app": {
                    "id": 1,
                    "vip": true,
                    "monitor": {
                        "origens": [
                            "TRF5"
                        ],
                        "tipo": "UNICO",
                        "valor": "0000000-00.0000.0.00.0000",
                        "frequencia": "SEMANAL",
                        "cron": "28 16 * * 4",
                        "status": "FOUND",
                        "incluir_docpub": false,
                        "incluir_autos": false
                    },
                    "created_at": "21/03/2023 19:45:55",
                    "frequencia": "SEMANAL"
                },
                "processo": {
                    "origem": "TRF5",
                    "instancia": "PRIMEIRO_GRAU",
                    "extra_instancia": "",
                    "sistema": "PJE",
                    "numero_unico": "0000000-00.0000.0.00.0000"
                },
                "uuid": "027efc36e537d8f9b89c73869b69c941"
            },
            "status": "Em tentativa"
        },
        {
            "id": 2,
            "uuid": "d4e07ee0de82864c32c218e04f7e41ef",
            "usuario_id": 2,
            "objeto_id": 3,
            "objeto_type": "ApiAsync",
            "evento": "resultado_processo_async",
            "url": "https://api.teste.com/webhook",
            "attempts": 0,
            "next_run_at": null,
            "delivered_at": "2022-08-15 18:16:37",
            "created_at": "2022-08-15 18:16:37",
            "updated_at": "2022-08-15 18:16:37",
            "resultado": {
                "id": 1,
                "created_at": {
                    "date": "2022-08-15 18:16:24",
                    "timezone_type": 3,
                    "timezone": "UTC"
                },
                "enviar_callback": "SIM",
                "link_api": "https://api.escavador.com/api/v1/async/resultados/1",
                "numero_processo": "0000000-00.0000.0.00.0000",
                "resposta": {
                    "numero_unico": "0000000-00.0000.0.00.0000",
                    "origem": "TRT-5",
                    "instancias": [
                        {
                            "url": null,
                            "sistema": "PJE",
                            "instancia": "PRIMEIRO_GRAU",
                            "extra_instancia": "",
                            "segredo": false,
                            "numero": null,
                            "assunto": "Piso Salarial da Categoria / Salário Mínimo Profissional",
                            "classe": "Ação Trabalhista - Rito Ordinário",
                            "area": "Trabalhista",
                            "data_distribuicao": "29/10/2018",
                            "orgao_julgador": "27ª Vara do Trabalho de Salvador",
                            "moeda_valor_causa": null,
                            "valor_causa": null,
                            "arquivado": false,
                            "data_arquivamento": null,
                            "fisico": null,
                            "last_update_time": "15/08/2022 18:12",
                            "situacoes": [],
                            "dados": [
                                {
                                    "tipo": "Outros Assuntos",
                                    "valor": "Acordo e Convenção Coletivos de Trabalho\nAjuda / Tíquete Alimentação\nAviso Prévio\nContrato Individual de Trabalho\nDIREITO DO TRABALHO\nDIREITO PROCESSUAL CIVIL E DO TRABALHO\nDepósito / Diferença de Recolhimento\nDescontos Salariais - Devolução\nDireito Coletivo\nDuração do Trabalho\nExpurgos Inflacionários\nFGTS\nHoras Extras\nIndenização\nLevantamento / Liberação\nMulta Convencional\nMulta Prevista em Norma Coletiva\nMulta de 40% do FGTS\nMulta do Art. 475-J do CPC\nMulta do Artigo 467 da CLT\nMulta do Artigo 477 da CLT\nPenalidades Processuais\nReflexos\nRemuneração, Verbas Indenizatórias e Benefícios\nRepouso Semanal Remunerado e Feriado\nRescisão do Contrato de Trabalho\nSalário / Diferença Salarial\nSeguro Desemprego\nVerbas Rescisórias"
                                }
                            ],
                            "partes": [
                                {
                                    "id": 1,
                                    "tipo": "AUTOR",
                                    "nome": "ANTONIO",
                                    "principal": true,
                                    "polo": "ATIVO",
                                    "documento": {
                                        "tipo": "CPF",
                                        "numero": "00000000000"
                                    }
                                },
                                {
                                    "id": 2,
                                    "tipo": "ADVOGADO",
                                    "nome": "Walter",
                                    "principal": true,
                                    "polo": "ATIVO",
                                    "documento": {
                                        "tipo": "CPF",
                                        "numero": "00000000000"
                                    },
                                    "advogado_de": 1,
                                    "oabs": [
                                        {
                                            "numero": "1234",
                                            "uf": "BA"
                                        }
                                    ]
                                },
                                {
                                    "id": 3,
                                    "tipo": "RÉU",
                                    "nome": "DISTRIBUIDORA S/A",
                                    "principal": true,
                                    "polo": "PASSIVO",
                                    "documento": {
                                        "tipo": "CNPJ",
                                        "numero": "00000000000000"
                                    }
                                }
                            ],
                            "movimentacoes": [
                                {
                                    "id": 4,
                                    "data": "10/08/2022",
                                    "conteudo": "Decorrido o prazo de ANTONIO em 09/08/2022"
                                },
                                {
                                    "id": 3,
                                    "data": "09/08/2022",
                                    "conteudo": "Disponibilizado\n(a) o(a) intimação no Diário da Justiça Eletrônico"
                                },
                                {
                                    "id": 2,
                                    "data": "09/08/2022",
                                    "conteudo": "Publicado(a) o(a) intimação em 09/08/2022"
                                },
                                {
                                    "id": 1,
                                    "data": "08/08/2022",
                                    "conteudo": "Expedido(a) intimação a(o) DISTRIBUIDORA S/A"
                                }
                            ],
                            "audiencias": [
                                {
                                    "data": "12/02/2019 15:06",
                                    "audiencia": "",
                                    "situacao": "Realizada",
                                    "numero_pessoas": 0
                                }
                            ]
                        }
                    ]
                },
                "status": "SUCESSO",
                "status_callback": null,
                "tipo": "BUSCA_PROCESSO",
                "tribunal": {
                    "sigla": "TRT-5",
                    "nome": "TRT da 5ª Região",
                    "busca_processo": 1,
                    "busca_nome": 0,
                    "busca_oab": 0,
                    "disponivel_autos": 1,
                    "busca_documento": 1
                },
                "valor": "0000000-00.0000.0.00.0000",
                "event": "resultado_processo_async",
                "uuid": "d4e07ee0de82864c32c218e04f7e41ef"
            },
            "status": "Sucesso"
        },
        {
            "id": 3,
            "uuid": "0ab19863f3050147808331b3f16a15eb",
            "usuario_id": 2,
            "objeto_id": 3,
            "objeto_type": "Monitoramento",
            "evento": "diario_movimentacao_nova",
            "url": "https://api.teste.com/webhook",
            "attempts": 11,
            "next_run_at": null,
            "delivered_at": "2023-06-07 16:15:06",
            "created_at": "2023-06-04 16:46:08",
            "updated_at": "2023-06-07 16:15:06",
            "resultado": {
                "event": "diario_movimentacao_nova",
                "monitoramento": [
                    {
                        "id": 1,
                        "processo_id": 1,
                        "tribunal_processo_id": null,
                        "pasta_id": null,
                        "nome": null,
                        "termo": "0000000-00.0000.0.00.0000",
                        "categoria": "",
                        "tipo": "PROCESSO",
                        "alertar_apenas_novo_processo": 0,
                        "limite_aparicoes": null,
                        "enviar_email_principal": 1,
                        "origem_criacao": null,
                        "desativado": "NAO",
                        "desativado_motivo": null,
                        "bloqueado_ate": null,
                        "nao_monitorar_ate": null,
                        "api": "SIM",
                        "dados_adicionais": null,
                        "data_ultima_aparicao": {
                            "date": "2023-06-01 00:00:00",
                            "timezone_type": 3,
                            "timezone": "UTC"
                        },
                        "descricao": "Processo nº 0000000-00.0000.0.00.0000",
                        "aparicoes_nao_visualizadas": 1,
                        "quantidade_aparicoes_mes": 1,
                        "bloqueado_temporariamente": null,
                        "oab_principal": null,
                        "numero_diarios_monitorados": 171,
                        "numero_diarios_disponiveis": 173,
                        "tribunal_sigla": null,
                        "tribunal_disponivel": true,
                        "usuario_pode_visualizar": true,
                        "quantidade_aparicoes_por_tipo": {
                            "tribunal": [],
                            "diario": 1
                        },
                        "quantidade_aparicoes_nao_visualizadas_por_tipo": {
                            "tribunal": [],
                            "diario": 1,
                            "referencias": 0
                        },
                        "quantidade_sugestoes_nao_verificadas": 0,
                        "termos_auxiliares": [],
                        "processo": {
                            "id": 1,
                            "numero_antigo": null,
                            "numero_novo": "0000000-00.0000.0.00.0000",
                            "is_cnj": 1,
                            "enviado_trimon_em": "2022-01-22 23:26:17",
                            "created_at": null,
                            "updated_at": "2023-06-04 16:31:01",
                            "origem_tribunal_id": 26,
                            "filtrado_em": null,
                            "enviado_nursery_em": null,
                            "link": "https://www.escavador.com/processos/852608/processo-0001260-9020135150042-do-trt-da-15-regiao",
                            "link_api": "https://api.escavador.com/api/v1/processos/1",
                            "data_movimentacoes": "16/07/2013 a 01/06/2023",
                            "data_primeira_movimentacao": "16/07/2013",
                            "url": {
                                "id": 1,
                                "slug": "processo-00000000000000000-do-trt-da-15-regiao",
                                "objeto_type": "Processo",
                                "objeto_id": 1,
                                "redirect": 12,
                                "created_at": null,
                                "anuncio_ocultado_em": null
                            }
                        }
                    }
                ],
                "movimentacao": {
                    "id": 1,
                    "secao": "Secretaria da Segunda Turma",
                    "texto_categoria": "",
                    "diario_oficial_id": 1,
                    "processo_id": 1,
                    "pagina": 4553,
                    "complemento": null,
                    "tipo": "Agravo de Instrumento em Recurso de Revista",
                    "subtipo": null,
                    "conteudo": "<p><font class=\"\"><b>complemento:</b> Complemento Processo Eletrônico</font></p><div>",
                    "data": "2023-06-01T00:00:00.000000Z",
                    "letras_processo": "",
                    "subprocesso": null,
                    "elasticsearch_status": "NOT_INDEXED",
                    "created_at": "2023-06-04 16:31:01",
                    "updated_at": "2023-06-04 16:31:01",
                    "descricao_pequena": "Movimentação do processo 0000000-00.0000.0.00.0000",
                    "diario_oficial": "01/06/2023 | TST - Judiciário",
                    "estado": "Brasil",
                    "envolvidos": [
                        {
                            "id": 1,
                            "nome": "Maria",
                            "objeto_type": "Pessoa",
                            "pivot_tipo": "RELATOR",
                            "pivot_outros": "NAO",
                            "pivot_extra_nome": "Min.",
                            "link": "https://www.escavador.com/sobre/1/maria",
                            "link_api": "https://api.escavador.com/api/v1/pessoas/1",
                            "nome_sem_filtro": "Maria",
                            "envolvido_tipo": "Relator",
                            "envolvido_extra_nome": "Min.",
                            "oab": "",
                            "advogado_de": null
                        }
                    ],
                    "link": "https://www.escavador.com/diarios/0000000/TST/J/2023-06-01/1/movimentacao-do-processo-0000000-0000000000000",
                    "link_api": "https://api.escavador.com/api/v1/movimentacoes/1",
                    "data_formatada": "01/06/2023",
                    "objeto_type": "Movimentacao",
                    "link_pdf": "https://www.escavador.com/diarios/00000/TST/J/2023-06-01/pdf/baixar?page=4553",
                    "link_pdf_api": "https://api.escavador.com/api/v1/diarios/000000/pdf/pagina/4553/baixar",
                    "snippet": "conteudo do snippet",
                    "processo": {
                        "id": 1,
                        "numero_antigo": null,
                        "numero_novo": "0000000-00.0000.0.00.0000",
                        "is_cnj": 1,
                        "enviado_trimon_em": "2022-01-22 23:26:17",
                        "created_at": null,
                        "updated_at": "2023-06-04 16:31:01",
                        "origem_tribunal_id": 26,
                        "filtrado_em": null,
                        "enviado_nursery_em": null,
                        "link": "https://www.escavador.com/processos/852608/processo-0000000-0000000000000-do-trt-da-15-regiao",
                        "link_api": "https://api.escavador.com/api/v1/processos/1",
                        "data_movimentacoes": "16/07/2013 a 01/06/2023",
                        "data_primeira_movimentacao": "16/07/2013",
                        "url": {
                            "id": 1,
                            "slug": "processo-0000000-0000000000000-do-trt-da-15-regiao",
                            "objeto_type": "Processo",
                            "objeto_id": 1,
                            "redirect": 12,
                            "created_at": null,
                            "anuncio_ocultado_em": null
                        }
                    },
                    "diario": {
                        "id": 1,
                        "path": "",
                        "origem_id": 1,
                        "plugin": "TRT",
                        "edicao": "3734/2023",
                        "tipo": "Judiciário",
                        "tipo_url": "J",
                        "tipo_ocr": "OCR_1",
                        "tipo_exibicao": "MOVIMENTACOES",
                        "data": "2023-06-01",
                        "data_disponibilizacao": null,
                        "data_publicacao": "2023-06-01",
                        "qtd_paginas": 9292,
                        "pdf_key": null,
                        "pdf_key_backblaze": "diarios",
                        "pdf_pages": 9292,
                        "external_storage_id": 1890431,
                        "created_at": "2023-06-04 16:28:24",
                        "elasticsearch_status": "NOT_INDEXED",
                        "atena_status": "INDEXED",
                        "vespa_ultima_indexacao": "2023-06-04 16:40:08",
                        "descricao": "Tribunal Superior do Trabalho",
                        "objeto_type": "Diario",
                        "origem": {
                            "id": 3,
                            "nome": "Tribunal Superior do Trabalho",
                            "sigla": "TST",
                            "tipo": null,
                            "db": "JURIDICO",
                            "estado": "Brasil-TST",
                            "competencia": "Brasil",
                            "categoria": "Diários do Judiciário",
                            "created_at": "2015-10-14T05:28:45.000000Z",
                            "updated_at": "2015-10-14T05:28:45.000000Z"
                        }
                    },
                    "url": {
                        "id": 1,
                        "slug": "movimentacao-do-processo-0000000-0000000000000",
                        "objeto_type": "Movimentacao",
                        "objeto_id": 1,
                        "redirect": null,
                        "created_at": "2023-06-04T16:31:01.000000Z",
                        "anuncio_ocultado_em": null
                    }
                },
                "uuid": "0ab19863f3050147808331b3f16a15eb"
            },
            "status": "Sucesso"
        }
    ]
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### POST /api/v1/callbacks/{id}/reenviar

**Reenviar callback**

Reevia o callback informado.

- Requer autenticação: sim

#### URL Params

- `id` (integer, required): O id do callback que será reenviado.</br> <b> Atenção:</b> Callbacks que estão sendo enviados (em tentativa), não podem ser reenviados.

#### Responses

- Status 200
```json
{
    "message": "Callback reenviado com sucesso!"
}
```

- Status 422
```json
{
    "error": "Unauthenticated"
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

## Monitoramento de Diários Oficiais

### GET /api/v1/monitoramentos/{monitoramentoId}/origens

**Listar diários oficiais monitorados**

Retorna os diários oficiais de um monitoramento pelo identificador do monitoramento.

- Requer autenticação: sim

#### URL Params

- `monitoramentoId` (integer, required): Identificador numérico de um monitoramento de diários.

#### Responses

- Status 200
```json
[
    {
        "id": 4,
        "nome": "TRT da 1ª Região",
        "sigla": "TRT-1",
        "tipo": null,
        "db": "JURIDICO",
        "estado": "RJ",
        "competencia": "Rio de Janeiro",
        "categoria": "Tribunais Regionais do Trabalho",
        "created_at": "2015-11-05T02:32:33.000000Z",
        "updated_at": "2015-11-05T02:32:33.000000Z",
        "pivot": {
            "monitoramento_id": 13,
            "origem_id": 4,
            "created_at": "2022-08-15T14:09:56.000000Z",
            "updated_at": "2022-08-15T14:09:56.000000Z"
        }
    },
    {
        "id": 5,
        "nome": "TRT da 2ª Região",
        "sigla": "TRT-2",
        "tipo": null,
        "db": "JURIDICO",
        "estado": "SP",
        "competencia": "São Paulo",
        "categoria": "Tribunais Regionais do Trabalho",
        "created_at": "2015-11-05T02:32:33.000000Z",
        "updated_at": "2015-11-05T02:32:33.000000Z",
        "pivot": {
            "monitoramento_id": 13,
            "origem_id": 5,
            "created_at": "2022-08-15T14:09:56.000000Z",
            "updated_at": "2022-08-15T14:09:56.000000Z"
        }
    }
]
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### GET /api/v1/monitoramentos

**Listar monitoramentos**

Retorna uma lista paginada com os monitoramentos de diários oficiais do usuário autenticado.

Quando `pasta_id` for informado, apenas os monitoramentos da pasta serão retornados.

- Requer autenticação: sim

#### Query Params

- `page` (integer, optional): Número da página da paginação.

#### Responses

- Status 200
```json
{
    "items": [
        {
            "id": 1,
            "processo_id": 1,
            "tribunal_processo_id": null,
            "pasta_id": null,
            "nome": null,
            "termo": "0000000-00.0000.0.00.0000",
            "categoria": "",
            "tipo": "PROCESSO",
            "alertar_apenas_novo_processo": 0,
            "limite_aparicoes": null,
            "enviar_email_principal": 1,
            "desativado": "NAO",
            "desativado_motivo": null,
            "bloqueado_ate": null,
            "nao_monitorar_ate": null,
            "api": "SIM",
            "dados_adicionais": null,
            "qtd_aparicoes": 11,
            "descricao": "Processo nº 0000000-00.0000.0.00.0000",
            "aparicoes_nao_visualizadas": 0,
            "quantidade_aparicoes_mes": 0,
            "bloqueado_temporariamente": null,
            "variacao_principal": null,
            "data_ultima_aparicao": "03/10/2019",
            "numero_diarios_monitorados": 171,
            "numero_diarios_disponiveis": 171,
            "tribunal_sigla": null,
            "tribunal_disponivel": true,
            "usuario_pode_visualizar": true,
            "quantidade_aparicoes_por_tipo": {
                "tribunal": [],
                "diario": 0
            },
            "termos_auxiliares": [],
            "pasta": null,
            "sugestoes_limitadas": [],
            "processo": {
                "id": 852608,
                "numero_antigo": null,
                "numero_novo": "0000000-00.0000.0.00.0000",
                "is_cnj": 1,
                "enviado_trimon_em": "2022-01-22 23:26:17",
                "created_at": null,
                "updated_at": null,
                "origem_tribunal_id": 26,
                "filtrado_em": null,
                "enviado_nursery_em": null,
                "link": "https://www.escavador.com/processos/1/processo-0000000-0000000000000-do-trt-da-15-regiao",
                "link_api": "https://api.escavador.com/api/v1/processos/1",
                "data_movimentacoes": "16/07/2013 a 03/10/2019",
                "data_primeira_movimentacao": "16/07/2013",
                "origem": {
                    "id": 18,
                    "nome": "TRT da 15ª Região",
                    "sigla": "TRT-15",
                    "tipo": null,
                    "db": "JURIDICO",
                    "estado": "SP",
                    "competencia": "São Paulo",
                    "categoria": "Tribunais Regionais do Trabalho",
                    "created_at": "2015-10-14T03:43:20.000000Z",
                    "updated_at": "2015-10-14T03:43:20.000000Z"
                },
                "url": {
                    "id": 1,
                    "slug": "processo-0000000-0000000000000-do-trt-da-15-regiao",
                    "objeto_type": "Processo",
                    "objeto_id": 852608,
                    "redirect": null,
                    "anuncio_ocultado_em": null
                }
            },
            "tribunal_processo": null
        },
        {
            "id": 2,
            "processo_id": null,
            "tribunal_processo_id": null,
            "pasta_id": null,
            "nome": null,
            "termo": "teste",
            "categoria": "",
            "tipo": "TERMO",
            "alertar_apenas_novo_processo": 0,
            "limite_aparicoes": null,
            "enviar_email_principal": 1,
            "desativado": "NAO",
            "desativado_motivo": null,
            "bloqueado_ate": null,
            "nao_monitorar_ate": null,
            "api": "SIM",
            "dados_adicionais": null,
            "qtd_aparicoes": 0,
            "descricao": "teste",
            "aparicoes_nao_visualizadas": 0,
            "quantidade_aparicoes_mes": 0,
            "bloqueado_temporariamente": null,
            "variacao_principal": null,
            "data_ultima_aparicao": null,
            "numero_diarios_monitorados": 2,
            "numero_diarios_disponiveis": 171,
            "tribunal_sigla": null,
            "tribunal_disponivel": false,
            "usuario_pode_visualizar": true,
            "quantidade_aparicoes_por_tipo": {
                "tribunal": [],
                "diario": 0
            },
            "termos_auxiliares": [
                {
                    "condicao": "NAO_CONTEM",
                    "termo": "nao"
                },
                {
                    "condicao": "CONTEM",
                    "termo": "contem isso"
                },
                {
                    "condicao": "CONTEM",
                    "termo": "e isso"
                },
                {
                    "condicao": "CONTEM_ALGUMA",
                    "termo": "alguma"
                }
            ],
            "pasta": null,
            "sugestoes_limitadas": [],
            "processo": null,
            "tribunal_processo": null
        }
    ],
    "links": {
        "prev": null,
        "next": null,
        "first": "https://api.escavador.com/api/v1/monitoramentos?page=1",
        "last": "https://api.escavador.com/api/v1/monitoramentos?page=1"
    },
    "paginator": {
        "current_page": 1,
        "per_page": 20,
        "total": 3,
        "total_pages": 1
    }
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### GET /api/v1/monitoramentos/{monitoramento}

**Buscar monitoramento**

Retorna um monitoramento pelo seu identificador.

- Requer autenticação: sim

#### URL Params

- `monitoramento` (integer, required): Identificador numérico de um monitoramento de diários.

#### Responses

- Status 200
```json
{
    "status": "success",
    "monitoramento": {
        "id": 1,
        "processo_id": null,
        "tribunal_processo_id": null,
        "pasta_id": null,
        "nome": null,
        "termo": "teste",
        "categoria": "",
        "tipo": "TERMO",
        "alertar_apenas_novo_processo": 0,
        "limite_aparicoes": null,
        "enviar_email_principal": 1,
        "origem_criacao": null,
        "desativado": "NAO",
        "desativado_motivo": null,
        "bloqueado_ate": null,
        "nao_monitorar_ate": null,
        "api": "SIM",
        "dados_adicionais": null,
        "data_ultima_aparicao": {
            "date": "2023-06-01 00:00:00",
            "timezone_type": 3,
            "timezone": "UTC"
        },
        "descricao": "teste",
        "aparicoes_nao_visualizadas": 0,
        "quantidade_aparicoes_mes": 0,
        "bloqueado_temporariamente": null,
        "oab_principal": null,
        "numero_diarios_monitorados": 2,
        "numero_diarios_disponiveis": 171,
        "tribunal_sigla": null,
        "tribunal_disponivel": false,
        "usuario_pode_visualizar": true,
        "quantidade_aparicoes_por_tipo": {
            "tribunal": [],
            "diario": 0
        },
        "quantidade_aparicoes_nao_visualizadas_por_tipo": {
            "tribunal": [],
            "diario": 0,
            "referencias": 0
        },
        "quantidade_sugestoes_nao_verificadas": 0,
        "termos_auxiliares": [
            {
                "condicao": "NAO_CONTEM",
                "termo": "nao"
            },
            {
                "condicao": "CONTEM",
                "termo": "contem isso"
            },
            {
                "condicao": "CONTEM",
                "termo": "e isso"
            },
            {
                "condicao": "CONTEM_ALGUMA",
                "termo": "alguma"
            }
        ],
        "variacoes": [
            {
                "variacao": "exame",
                "gerada": "SIM",
                "tipo": null,
                "formato_oab": null
            },
            {
                "variacao": "avaliacao",
                "gerada": "SIM",
                "tipo": null,
                "formato_oab": null
            }
        ]
    }
}
```

- Status 200
```json
{
    "status": "success",
    "monitoramento": {
        "id": 1,
        "processo_id": 1,
        "tribunal_processo_id": null,
        "pasta_id": null,
        "nome": null,
        "termo": "0000000-00.0000.0.00.0000",
        "categoria": "",
        "tipo": "PROCESSO",
        "alertar_apenas_novo_processo": 0,
        "limite_aparicoes": null,
        "enviar_email_principal": 1,
        "origem_criacao": null,
        "desativado": "NAO",
        "desativado_motivo": null,
        "bloqueado_ate": null,
        "nao_monitorar_ate": null,
        "api": "SIM",
        "dados_adicionais": null,
        "data_ultima_aparicao": {
            "date": "2019-10-03 00:00:00",
            "timezone_type": 3,
            "timezone": "UTC"
        },
        "descricao": "Processo nº 0000000-00.0000.0.00.0000",
        "aparicoes_nao_visualizadas": 0,
        "quantidade_aparicoes_mes": 0,
        "bloqueado_temporariamente": null,
        "oab_principal": null,
        "numero_diarios_monitorados": 171,
        "numero_diarios_disponiveis": 171,
        "tribunal_sigla": null,
        "tribunal_disponivel": true,
        "usuario_pode_visualizar": true,
        "quantidade_aparicoes_por_tipo": {
            "tribunal": [],
            "diario": 0
        },
        "quantidade_aparicoes_nao_visualizadas_por_tipo": {
            "tribunal": [],
            "diario": 0,
            "referencias": 0
        },
        "quantidade_sugestoes_nao_verificadas": 0,
        "termos_auxiliares": [],
        "variacoes": [],
        "processo": {
            "id": 1,
            "numero_antigo": null,
            "numero_novo": "0000000-00.0000.0.00.0000",
            "is_cnj": 1,
            "enviado_trimon_em": "2022-01-22 23:26:17",
            "created_at": null,
            "updated_at": null,
            "origem_tribunal_id": 26,
            "filtrado_em": null,
            "link": "https://www.escavador.com/processos/1/processo-0000000-0000000000000-do-trt-da-15-regiao",
            "link_api": "https://api.escavador.com/api/v1/processos/1",
            "data_movimentacoes": "16/07/2013 a 03/10/2019",
            "data_primeira_movimentacao": "16/07/2013",
            "origem": {
                "id": 18,
                "nome": "TRT da 15ª Região",
                "sigla": "TRT-15",
                "tipo": null,
                "db": "JURIDICO",
                "estado": "SP",
                "competencia": "São Paulo",
                "categoria": "Tribunais Regionais do Trabalho",
                "created_at": "2015-10-14T03:43:20.000000Z",
                "updated_at": "2015-10-14T03:43:20.000000Z"
            },
            "url": {
                "id": 1,
                "slug": "processo-0000000-0000000000000-do-trt-da-15-regiao",
                "objeto_type": "Processo",
                "objeto_id": 1,
                "redirect": null,
                "anuncio_ocultado_em": null
            }
        }
    }
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### PUT /api/v1/monitoramentos/{monitoramento}

**Editar monitoramento**

Edita um monitoramento de diário oficial. É possível alterar os Diários monitorados, ou as variações do monitoramento.

- Requer autenticação: sim

#### URL Params

- `monitoramento` (integer, required): Identificador numérico de um monitoramento de diários.

#### Body Params

- `origens_ids` (array<int>, optional): Array de ids dos diários que deseja monitorar.<br/>Saiba como encontrar esses ids em <a href="/v1/docs/diarios-oficiais#retornar-origens">Retornar origens</a>.<br/><b>Obrigatório se `tipo = termo`</b>.
- `variacoes` (array<string>, optional): Array de strings com as variações do termo monitorado.

#### Responses

- Status 200
```json
{
    "status": "success",
    "monitoramento": {
        "id": 1,
        "processo_id": null,
        "tribunal_processo_id": null,
        "pasta_id": null,
        "nome": null,
        "termo": "teste",
        "categoria": "",
        "tipo": "TERMO",
        "alertar_apenas_novo_processo": 0,
        "limite_aparicoes": null,
        "enviar_email_principal": true,
        "origem_criacao": null,
        "desativado": "NAO",
        "desativado_motivo": null,
        "bloqueado_ate": null,
        "nao_monitorar_ate": null,
        "api": "SIM",
        "dados_adicionais": null,
        "data_ultima_aparicao": null,
        "descricao": "teste",
        "aparicoes_nao_visualizadas": 0,
        "quantidade_aparicoes_mes": 0,
        "bloqueado_temporariamente": null,
        "oab_principal": null,
        "numero_diarios_monitorados": 4,
        "numero_diarios_disponiveis": 171,
        "tribunal_sigla": null,
        "tribunal_disponivel": false,
        "usuario_pode_visualizar": true,
        "quantidade_aparicoes_por_tipo": {
            "tribunal": [],
            "diario": 0
        },
        "quantidade_aparicoes_nao_visualizadas_por_tipo": {
            "tribunal": [],
            "diario": 0,
            "referencias": 0
        },
        "quantidade_sugestoes_nao_verificadas": 0,
        "termos_auxiliares": [
            {
                "condicao": "NAO_CONTEM",
                "termo": "nao"
            },
            {
                "condicao": "CONTEM",
                "termo": "contem isso"
            },
            {
                "condicao": "CONTEM",
                "termo": "e isso"
            },
            {
                "condicao": "CONTEM_ALGUMA",
                "termo": "alguma"
            }
        ],
        "variacoes": [],
        "pasta": null,
        "emails": []
    }
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### DELETE /api/v1/monitoramentos/{monitoramento}

**Remover monitoramento**

Remove um monitoramento de diário cadastrado pelo usuário baseado no seu identificador.

- Requer autenticação: sim

#### URL Params

- `monitoramento` (integer, required): Identificador numérico de um monitoramento de diários.

#### Responses

- Status 200
```json
{
    "status": "success"
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### GET /api/v1/monitoramentos/{monitoramento}/aparicoes

**Retornar aparições**

Retorna as aparições de um monitoramento pelo identificador do monitoramento.

- Requer autenticação: sim

#### URL Params

- `monitoramento` (integer, required): Identificador numérico de um monitoramento de diários.

#### Responses

- Status 200
```json
{
    "items": [
        {
            "bloqueado": false,
            "conteudo_snippet": "Complemento: ( Numeração única: 0001260 90.2013.5.15.0042 AIRR ) 505 - Agravo de Instrumento em...",
            "data_diario": {
                "date": "2017-04-19 00:00:00",
                "timezone_type": 3,
                "timezone": "UTC"
            },
            "data_diario_formatada": "19/04/2017",
            "data_processo": {
                "date": "2017-04-19 00:00:00",
                "timezone_type": 3,
                "timezone": "UTC"
            },
            "data_processo_formatada": "19/04/2017",
            "id": 285784215,
            "monitoramento_descricao": "Processo nº 0001260-90.2013.5.15.0042",
            "monitoramento_id": 1043943,
            "monitoramento_termo": "0001260-90.2013.5.15.0042",
            "monitoramento_variacoes": [],
            "monitoramento_tipo": "PROCESSO",
            "documentos": [],
            "numero_processo": "0001260-90.2013.5.15.0042",
            "objeto_id": 181759703,
            "objeto_type": "Movimentacao",
            "pagina": null,
            "processo_eh_monitorado": 1043943,
            "nome_diario": "TRT da 15ª Região",
            "sigla_diario": "TRT-15",
            "nome_caderno": "Judiciário",
            "tipo_url": "J",
            "movimentacao": {
                "id": 181759703,
                "secao": "SEÇÃO DE PROCESSAMENTO DE AGRAVOS DE INSTRUMENTO - Edital",
                "texto_categoria": "",
                "diario_oficial_id": 443431,
                "processo_id": 852608,
                "pagina": null,
                "complemento": null,
                "tipo": null,
                "subtipo": null,
                "conteudo": "<p><font style=\"font-size:small;font-family:Arial, sans-serif;\"><b>Complemento:</b> ( Numeração única: 0001260 90.2013.5.15.0042 AIRR ) 505 - Agravo de Instrumento em Recurso de Revista - Ac. 33356/2016 VARA DO TRABALHO DE RIBEIRÃO PRETO 2A</font></p><div><p><span style=\"font-size:small;font-family:Arial, sans-serif;font-weight:bold;\"> A VISTA DOS AUTOS SE DARÁ POR CONSULTA AO<br> PROCESSO PRINCIPAL NA PÁGINA DO TRIBUNAL NA<br> INTERNET, ACESSANDO AS IMAGENS DISPONÍVEIS NO<br> \"VISUALIZADOR DE DOCUMENTOS\" - Ato Regulamentar<br> GP/VPJ/CR n° 01/2011, exceto os autos que tramitam em<br> ''SEGREDO DE JUSTIÇA'', cujas imagens serão disponibilizadas no<br> balcão da Secretaria Judiciária.</span></p></div>",
                "snippet": "Complemento: ( Numeração única: 0001260 90.2013.5.15.0042 AIRR ) 505 - Agravo de Instrumento em Recurso de Revista - Ac. 33356/2016 VARA DO TRABALHO DE RIBEIRÃO PRETO 2A A VISTA...",
                "data": {
                    "date": "2017-04-19 00:00:00",
                    "timezone_type": 3,
                    "timezone": "UTC"
                },
                "letras_processo": "AIRR",
                "subprocesso": null,
                "created_at": null,
                "updated_at": null,
                "descricao_pequena": "Movimentação do processo AIRR-0001260-90.2013.5.15.0042",
                "diario_oficial": "19/04/2017 | TRT-15 - Judiciário",
                "estado": "São Paulo",
                "envolvidos": [
                    {
                        "id": 429197,
                        "nome": "José Fernando Godoy Deléo",
                        "objeto_type": "Pessoa",
                        "pivot_tipo": "ADVOGADO",
                        "pivot_outros": "NAO",
                        "pivot_extra_nome": "(130738- SP-D - Prc.Fls.: 130)",
                        "link": "https://www.escavador.com/sobre/10009577/jose-fernando-godoy-deleo",
                        "link_api": "https://api.escavador.com/api/v1/pessoas/9763738",
                        "nome_sem_filtro": "José Fernando Godoy Deléo",
                        "envolvido_tipo": "Advogado",
                        "envolvido_extra_nome": "(130738- SP-D - Prc.Fls.: 130)",
                        "oab": "130738/SP",
                        "advogado_de": null
                    },
                    {
                        "id": 1539496,
                        "nome": "Prisma Medical Ltda",
                        "objeto_type": "Instituicao",
                        "pivot_tipo": "AGRAVADO",
                        "pivot_outros": "NAO",
                        "pivot_extra_nome": null,
                        "link": "https://www.escavador.com/sobre/27285957/prisma-medical-ltda",
                        "link_api": "https://api.escavador.com/api/v1/instituicoes/2749961",
                        "nome_sem_filtro": "Prisma Medical Ltda",
                        "envolvido_tipo": "Agravado",
                        "envolvido_extra_nome": "",
                        "oab": "",
                        "advogado_de": null
                    }
                ],
                "link": "https://www.escavador.com/processos/852608/processo-0001260-9020135150042-do-trt-da-15-regiao?ano=2017#movimentacao-181759703",
                "link_api": "https://api.escavador.com/api/v1/movimentacoes/181759703",
                "link_pdf": null,
                "link_pdf_api": null,
                "data_formatada": "19/04/2017",
                "objeto_type": "Movimentacao",
                "people_filtered": [],
                "processo": {
                    "id": 852608,
                    "numero_antigo": null,
                    "numero_novo": "0001260-90.2013.5.15.0042",
                    "created_at": null,
                    "updated_at": null,
                    "link": "https://www.escavador.com/processos/852608/processo-0001260-9020135150042-do-trt-da-15-regiao",
                    "link_api": "https://api.escavador.com/api/v1/processos/852608",
                    "data_movimentacoes": "16/07/2013 a 03/10/2019",
                    "url": {
                        "id": 91859204,
                        "slug": "processo-0001260-9020135150042-do-trt-da-15-regiao",
                        "objeto_type": "Processo",
                        "objeto_id": 852608,
                        "redirect": null,
                        "anuncio_ocultado_em": null
                    }
                }
            },
            "texto_ao_redor": null,
            "visualizado": "SIM"
        },
        {
            "bloqueado": false,
            "conteudo_snippet": "Complemento: ( Numeração única: 0001260 90.2013.5.15.0042 RO ) 204 - 3a CÂMARA - Recurso Ordinário...",
            "data_diario": {
                "date": "2017-03-16 00:00:00",
                "timezone_type": 3,
                "timezone": "UTC"
            },
            "data_diario_formatada": "16/03/2017",
            "data_processo": {
                "date": "2017-03-16 00:00:00",
                "timezone_type": 3,
                "timezone": "UTC"
            },
            "data_processo_formatada": "16/03/2017",
            "id": 285784216,
            "monitoramento_descricao": "Processo nº 0001260-90.2013.5.15.0042",
            "monitoramento_id": 1043943,
            "monitoramento_termo": "0001260-90.2013.5.15.0042",
            "monitoramento_variacoes": [],
            "monitoramento_tipo": "PROCESSO",
            "documentos": [],
            "numero_processo": "0001260-90.2013.5.15.0042",
            "objeto_id": 231623312,
            "objeto_type": "Movimentacao",
            "pagina": null,
            "processo_eh_monitorado": 1043943,
            "nome_diario": "TRT da 15ª Região",
            "sigla_diario": "TRT-15",
            "nome_caderno": "Judiciário",
            "tipo_url": "J",
            "movimentacao": {
                "id": 231623312,
                "secao": "SEÇÃO DE PROCESSAMENTO DE AGRAVOS DE INSTRUMENTO - Edital",
                "texto_categoria": "",
                "diario_oficial_id": 517213,
                "processo_id": 852608,
                "pagina": null,
                "complemento": null,
                "tipo": null,
                "subtipo": null,
                "conteudo": "<p><font style=\"font-size:small;font-family:Arial, sans-serif;\"><b>Complemento:</b> ( Numeração única: 0001260 90.2013.5.15.0042 RO ) 204 - 3a CÂMARA - Recurso Ordinário - Ac. 33356/2016 VARA DO TRABALHO DE RIBEIRÃO PRETO 2A</font></p><div><p><span style=\"font-size:small;font-family:Arial, sans-serif;\"> DESPACHO: \"Recurso de Revista Recorrente(s): Marcio William<br> Pires Advogado(a)(s): Angelo Luiz Feijó Bazo (SP - 248039)<br> Recorrido(a)(s): Prisma Medical Ltda. - EPP Advogado(a)(s): José<br> Fernando Godoy Deléo (SP - 130738) PRESSUPOSTOS<br> EXTRÍNSECOS Tempestivo o recurso (decisão publicada em<br> 18/11/2016; recurso apresentado em 22/1 1/2016). Regular a<br> representação processual. Desnecessário o preparo.<br> PRESSUPOSTOS INTRÍNSECOS DIREITO PROCESSUAL CIVIL<br> E DO TRABALHO / Atos Processuais / Nulidade / Cerceamento de<br> Defesa. Não reputo configurado o alegado cerceamento de defesa,<br> tendo em vista que a v. decisãoestá fundamentada na apreciação<br> de fatos e provas, cujo reexame é vedado nesta fase pela Súmula<br> 126 do C. TST. Duração do Trabalho / Horas Extras. A v. decisão<br> referenteao tema em destaqueé resultado da apreciação das<br> provas (aplicação da Súmula 126 do C. TST), as quais foram<br> valoradas de acordo com as regras previstas no art. 371 do<br> CPC/2015. Nessa hipótese, por não se lastrear o julgado em tese<br> de direito, inviável a aferição de ofensa aos dispositivos<br> constitucional e legais invocados e de divergência jurisprudencial.<br> Contrato Individual de Trabalho / Alteração Contratual ou das<br> Condições de Trabalho / Acúmulo de Função. Rescisão do Contrato<br> de Trabalho / Verbas Rescisórias. Contrato Individual de Trabalho /<br> FGTS. Rescisão do Contrato de Trabalho / Verbas Rescisórias /<br> Multa [de 40%] do FGTS. Rescisão do Contrato de Trabalho /<br> Verbas Rescisórias / Multa do Artigo 467 da CLT. Rescisão do<br> Contrato de Trabalho / Verbas Rescisórias / Multa do Artigo 477 da<br> CLT. As questões relativas aos temas em destaqueforam<br> solucionadas com base na análise dos fatos e provas. Nessa<br> hipótese, por não se lastrear o v. julgado em tese de direito, inviável<br> a aferição de ofensa aos dispositivos constitucionais e legais<br> invocados e de divergência jurisprudencial. Incidência da Súmula<br> 126 do C. TST. DIREITO PROCESSUAL CIVIL E DO TRABALHO<br> / Partes e Procuradores / Sucumbência / Honorários Advocatícios.<br> No que se refere ao tema em destaque, o v. acórdão decidiu em<br> consonância com as Súmulas 219 e 329do C. TST, o que<br> inviabiliza o recurso, de acordo com o art. 896, § 7°, da CLT, c/c a<br> Súmula 333 do C. TST. CONCLUSÃO DENEGO seguimento ao<br> recurso de revista. Publique-se e intime-se. Campinas, 03 de março<br> de 2017. Edmundo Fraga Lopes - Desembargador Vice-Presidente</span></p><p><span style=\"font-size:small;font-family:Arial, sans-serif;\"> Judicial\"</span></p><p><span style=\"font-size:small;font-family:Arial, sans-serif;\"> A VISTA DOS AUTOS SE DARÁ POR CONSULTA AO<br> PROCESSO PRINCIPAL NA PÁGINA DO TRIBUNAL NA<br> INTERNET, ACESSANDO AS IMAGENS DISPONÍVEIS NO<br> \"VISUALIZADOR DE DOCUMENTOS\" - Ato Regulamentar<br> GP/VPJ/CR n° 01/2011, exceto os autos que tramitam em<br> ''SEGREDO DE JUSTIÇA'', cujas imagens serão disponibilizadas no<br> balcão da Secretaria Judiciária.</span></p></div>",
                "snippet": "Complemento: ( Numeração única: 0001260 90.2013.5.15.0042 RO ) 204 - 3a CÂMARA - Recurso Ordinário - Ac. 33356/2016 VARA DO TRABALHO DE RIBEIRÃO PRETO 2A DESPACHO: \"Recurso de...",
                "data": {
                    "date": "2017-03-16 00:00:00",
                    "timezone_type": 3,
                    "timezone": "UTC"
                },
                "letras_processo": "RO",
                "subprocesso": null,
                "created_at": null,
                "updated_at": null,
                "descricao_pequena": "Movimentação do processo RO-0001260-90.2013.5.15.0042",
                "diario_oficial": "16/03/2017 | TRT-15 - Judiciário",
                "estado": "São Paulo",
                "envolvidos": [
                    {
                        "id": 20069,
                        "nome": "Angelo Luiz Feijó Bazo",
                        "objeto_type": "Pessoa",
                        "pivot_tipo": "ADVOGADO",
                        "pivot_outros": "NAO",
                        "pivot_extra_nome": "(248039-SP-D - Prc.Fls.: 16)",
                        "link": "https://www.escavador.com/sobre/9914060/angelo-luiz-feijo-bazo",
                        "link_api": "https://api.escavador.com/api/v1/pessoas/9666802",
                        "nome_sem_filtro": "Angelo Luiz Feijó Bazo",
                        "envolvido_tipo": "Advogado",
                        "envolvido_extra_nome": "(248039-SP-D - Prc.Fls.: 16)",
                        "oab": "248039/SP",
                        "advogado_de": null
                    },
                    {
                        "id": 429197,
                        "nome": "José Fernando Godoy Deléo",
                        "objeto_type": "Pessoa",
                        "pivot_tipo": "ADVOGADO",
                        "pivot_outros": "NAO",
                        "pivot_extra_nome": "(130738- SP-D - Prc.Fls.: 130)",
                        "link": "https://www.escavador.com/sobre/10009577/jose-fernando-godoy-deleo",
                        "link_api": "https://api.escavador.com/api/v1/pessoas/9763738",
                        "nome_sem_filtro": "José Fernando Godoy Deléo",
                        "envolvido_tipo": "Advogado",
                        "envolvido_extra_nome": "(130738- SP-D - Prc.Fls.: 130)",
                        "oab": "130738/SP",
                        "advogado_de": null
                    },
                    {
                        "id": 1539495,
                        "nome": "Marcio William Pires",
                        "objeto_type": "Pessoa",
                        "pivot_tipo": "RECORRENTE",
                        "pivot_outros": "NAO",
                        "pivot_extra_nome": null,
                        "link": "https://www.escavador.com/sobre/13747211/marcio-william-pires",
                        "link_api": "https://api.escavador.com/api/v1/pessoas/13524849",
                        "nome_sem_filtro": "Marcio William Pires",
                        "envolvido_tipo": "Recorrente",
                        "envolvido_extra_nome": "",
                        "oab": "",
                        "advogado_de": null
                    },
                    {
                        "id": 1539496,
                        "nome": "Prisma Medical Ltda",
                        "objeto_type": "Instituicao",
                        "pivot_tipo": "RECORRIDO",
                        "pivot_outros": "NAO",
                        "pivot_extra_nome": null,
                        "link": "https://www.escavador.com/sobre/27285957/prisma-medical-ltda",
                        "link_api": "https://api.escavador.com/api/v1/instituicoes/2749961",
                        "nome_sem_filtro": "Prisma Medical Ltda",
                        "envolvido_tipo": "Recorrido",
                        "envolvido_extra_nome": "",
                        "oab": "",
                        "advogado_de": null
                    }
                ],
                "link": "https://www.escavador.com/processos/852608/processo-0001260-9020135150042-do-trt-da-15-regiao?ano=2017#movimentacao-231623312",
                "link_api": "https://api.escavador.com/api/v1/movimentacoes/231623312",
                "link_pdf": null,
                "link_pdf_api": null,
                "data_formatada": "16/03/2017",
                "objeto_type": "Movimentacao",
                "people_filtered": [],
                "processo": {
                    "id": 852608,
                    "numero_antigo": null,
                    "numero_novo": "0001260-90.2013.5.15.0042",
                    "created_at": null,
                    "updated_at": null,
                    "link": "https://www.escavador.com/processos/852608/processo-0001260-9020135150042-do-trt-da-15-regiao",
                    "link_api": "https://api.escavador.com/api/v1/processos/852608",
                    "data_movimentacoes": "16/07/2013 a 03/10/2019",
                    "url": {
                        "id": 91859204,
                        "slug": "processo-0001260-9020135150042-do-trt-da-15-regiao",
                        "objeto_type": "Processo",
                        "objeto_id": 852608,
                        "redirect": null,
                        "anuncio_ocultado_em": null
                    }
                }
            },
            "texto_ao_redor": null,
            "visualizado": "SIM"
        }
    ],
    "links": {
        "prev": null,
        "next": null,
        "first": "https://api.escavador.com/api/v1/monitoramentos/1043943/aparicoes?page=1",
        "last": "https://api.escavador.com/api/v1/monitoramentos/1043943/aparicoes?page=1"
    },
    "paginator": {
        "current_page": 1,
        "per_page": 20,
        "total": 11,
        "total_pages": 1
    }
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### POST /api/v1/monitoramentos

**Criar monitoramento**

Cadastra um termo ou processo para ser monitorado nos diários oficiais.




#### Callbacks relacionados
Evento | Descrição
--------- | -------
<a href="/v1/docs/callbacks#uma-nova-publicacao-foi-encontrada-pelo-monitoramento-de-diarios-oficiais-e-o-escavador-identificou-o-processo">diario_movimentacao_nova</a> | Foi encontrado algum resultado novo para o monitoramento e o Escavador identificou qual o processo na página do Diário Oficial.
<a href="/v1/docs/callbacks#nova-publicao-encontrada-no-monitoramento-de-dirios-oficiais">diario_citacao_nova</a> | Foi encontrado algum resultado novo e o Escavador não identificou qual é o processo na página do Diário Oficial ou não tem processo nessa página.

- Requer autenticação: sim

#### Body Params

- `tipo` (string, required): O tipo do valor a ser monitorado.<br/><b>Valores permitidos: `termo`, `processo`</b>.
- `termo` (string, optional): O termo a ser monitorado nos diários.<br/><b>Obrigatório se `tipo = termo`</b>.
- `origens_ids` (array<int>, optional): Array de ids dos diários que deseja monitorar.<br/>Saiba como encontrar esses ids em <a href="/v1/docs/diarios-oficiais#retornar-origens">Retornar origens</a>.<br/><b>Obrigatório se `tipo = termo`</b>.
- `processo_id` (integer, optional): O id do processo a ser monitorado nos diários.<br/>Saiba como encontrar esse id em <a href="/v1/docs/processos#buscar-processos-dos-dirios-oficiais-por-nmero">Buscar processos dos Diários Oficiais por número</a>.<br/><b>Obrigatório se `tipo = processo`.</b>.
- `variacoes` (array<string>, optional): Array de strings com as variações do termo monitorado. O array deve ter no máximo 3 variações.
- `termos_auxiliares` (array<object>, optional): Array de objetos com termos e condições para o alerta do monitoramento. As condições que podem ser utilizadas são as seguintes:<br/><b>CONTEM</b>: apenas irá alertar se na página tiver todos os nomes informados.<br/><b>NAO_CONTEM</b>: apenas irá alertar se não tiver nenhum dos termos informados.<br/><b>CONTEM_ALGUMA</b>: apenas irá alertar, se tiver pelo menos 1 dos termos informados.
- `limite_aparicoes` (integer, optional): Limite máximo de novos resultados (movimentações, processos, etc) capturados por mês, <b>caso `tipo = termo`</b>. <br/><b>Atenção</b>: Ao atingir este limite dentro do mês, o monitoramento interrompe a captura de novos dados até ao próximo mês. <br/>

#### Responses

- Status 200
```json
{
    "status": "success",
    "monitoramento": {
        "limite_aparicoes": null,
        "categoria": "",
        "api": "SIM",
        "enviar_email_principal": true,
        "nome": null,
        "termo": "teste",
        "tipo": "TERMO",
        "tribunal_processo_id": null,
        "processo_id": null,
        "id": 1,
        "descricao": "teste",
        "aparicoes_nao_visualizadas": 0,
        "quantidade_aparicoes_mes": 0,
        "bloqueado_temporariamente": null,
        "oab_principal": null,
        "data_ultima_aparicao": null,
        "numero_diarios_monitorados": 2,
        "numero_diarios_disponiveis": 171,
        "tribunal_sigla": null,
        "tribunal_disponivel": false,
        "usuario_pode_visualizar": true,
        "quantidade_aparicoes_por_tipo": {
            "tribunal": [],
            "diario": 0
        },
        "quantidade_aparicoes_nao_visualizadas_por_tipo": {
            "tribunal": [],
            "diario": 0,
            "referencias": 0
        },
        "quantidade_sugestoes_nao_verificadas": 0,
        "termos_auxiliares": [
            {
                "condicao": "NAO_CONTEM",
                "termo": "nao"
            },
            {
                "condicao": "CONTEM",
                "termo": "contem isso"
            },
            {
                "condicao": "CONTEM",
                "termo": "e isso"
            },
            {
                "condicao": "CONTEM_ALGUMA",
                "termo": "alguma"
            }
        ],
        "variacoes": [
            {
                "variacao": "exame",
                "gerada": "SIM",
                "tipo": null,
                "formato_oab": null
            },
            {
                "variacao": "avaliacao",
                "gerada": "SIM",
                "tipo": null,
                "formato_oab": null
            }
        ],
        "sugestoes_limitadas": [],
        "pasta": null
    }
}
```

- Status 200
```json
{
    "status": "success",
    "monitoramento": {
        "limite_aparicoes": null,
        "categoria": "",
        "api": "SIM",
        "enviar_email_principal": true,
        "nome": null,
        "tipo": "PROCESSO",
        "tribunal_processo_id": null,
        "processo_id": 1,
        "termo": "0000000-00.0000.0.00.0000",
        "id": 1,
        "data_ultima_aparicao": {
            "date": "2019-10-03 00:00:00",
            "timezone_type": 3,
            "timezone": "UTC"
        },
        "descricao": "Processo nº 0000000-00.0000.0.00.0000",
        "aparicoes_nao_visualizadas": 0,
        "quantidade_aparicoes_mes": 0,
        "bloqueado_temporariamente": null,
        "oab_principal": null,
        "numero_diarios_monitorados": 171,
        "numero_diarios_disponiveis": 171,
        "tribunal_sigla": null,
        "tribunal_disponivel": true,
        "usuario_pode_visualizar": true,
        "quantidade_aparicoes_por_tipo": {
            "tribunal": [],
            "diario": 0
        },
        "quantidade_aparicoes_nao_visualizadas_por_tipo": {
            "tribunal": [],
            "diario": 0,
            "referencias": 0
        },
        "quantidade_sugestoes_nao_verificadas": 0,
        "termos_auxiliares": [],
        "variacoes": [],
        "sugestoes_limitadas": [],
        "pasta": null,
        "processo": {
            "id": 852608,
            "numero_antigo": null,
            "numero_novo": "0000000-00.0000.0.00.0000",
            "is_cnj": 1,
            "enviado_trimon_em": "2022-01-22 23:26:17",
            "created_at": null,
            "updated_at": null,
            "origem_tribunal_id": 26,
            "filtrado_em": null,
            "link": "https://www.escavador.com/processos/1/processo-000000000-00000000000-do-trt-da-15-regiao",
            "link_api": "https://api.escavador.com/api/v1/processos/1",
            "data_movimentacoes": "16/07/2013 a 03/10/2019",
            "data_primeira_movimentacao": "16/07/2013",
            "url": {
                "id": 1,
                "slug": "processo-000000000-00000000000-do-trt-da-15-regiao",
                "objeto_type": "Processo",
                "objeto_id": 1,
                "redirect": null,
                "anuncio_ocultado_em": null
            }
        }
    }
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### POST /api/v1/monitoramentos/testcallback

**Testar callback do monitoramento**

Rota usada para testar o retorno enviado quando ocorre uma aparição no
monitoramento de Diários Oficiais, o seguinte objeto será enviado por um POST para a url registrada como callback.

- Requer autenticação: sim

#### Body Params

- `callback` (string, required): URL do servidor do usuário, para receber o callback de exemplo.
- `tipo` (string, optional): Tipo do objeto do callback, ou seja, se o callback corresponde a uma página do diário oficial ou a movimentação de um processo.<br/>Se não for informado, é enviado o exemplo de movimentação.<br/><b>Valores permitidos: `movimentacao`, `diario`</b>.

#### Responses

- Status 200
```json
{
    "event": "diario_movimentacao_nova",
    "monitoramento": [
        {
            "id": 70960,
            "processo_id": 3503,
            "tribunal_processo_id": null,
            "pasta_id": null,
            "termo": null,
            "categoria": "PROCESSO",
            "tipo": "PROCESSO",
            "limite_aparicoes": 5,
            "enviar_email_principal": 1,
            "desativado": "NAO",
            "bloqueado_ate": null,
            "api": "NAO",
            "descricao": "Processo nº 0000735-18.2014.5.23.0021",
            "aparicoes_nao_visualizadas": 0,
            "quantidade_aparicoes_mes": 0,
            "bloqueado_temporariamente": null,
            "variacao_principal": null,
            "data_ultima_aparicao": "15/12/2017",
            "numero_diarios_monitorados": null,
            "numero_diarios_disponiveis": 137,
            "tribunal_sigla": null,
            "tribunal_disponivel": true,
            "termos_auxiliares": [],
            "processo": {
                "id": 3503,
                "numero_antigo": null,
                "numero_novo": "0000735-18.2014.5.23.0021",
                "created_at": null,
                "updated_at": null,
                "link": "https://api.escavador.com/processos/3503/processo-0000735-1820145230021-do-trt-da-23-regiao",
                "link_api": "https://api.escavador.com/api/v1/processos/3503",
                "data_movimentacoes": "20/06/2014 a 15/12/2017",
                "url": {
                    "id": 90662892,
                    "slug": "processo-0000735-1820145230021-do-trt-da-23-regiao",
                    "objeto_type": "Processo",
                    "objeto_id": 3503,
                    "redirect": null
                }
            }
        }
    ],
    "movimentacao": {
        "id": 3736,
        "secao": "1<sup>a</sup> VT RONDONÓPOLIS - PJe",
        "texto_categoria": null,
        "diario_oficial_id": 12,
        "processo_id": 3503,
        "pagina": null,
        "complemento": null,
        "tipo": "Intimação",
        "subtipo": null,
        "conteudo": "<p class=\"content-small content-bold \">PODER JUDICI&#193;RIO<br>JUSTI&#199;A DO TRABALHO</p><br><p class=\"content-small content-bold \">TRIBUNAL REGIONAL DO TRABALHO DA 23a REGI&#195;O</p><br><p class=\"content-small content-bold \">1a VARA DO TRABALHO DE RONDON&#211;POLIS<br>-    (66) 34267787 -</p><br><p class=\"content-small content-bold \"><span href=\"mailto:Vtroo1@trt23.jus.br\">Vtroo1@trt23.jus.br</span></p><br><p class=\"content-small content-bold \">PROCESSO N&#176;: 0000735-18.2014.5.23.0021</p><br><p class=\"content-small \">AUTOR:EDMUNDO DIONISIO INACIO NETO</p><br><p class=\"content-small \">R&#201;U: PETROCAL INDUSTRIA E COMERCIO DE CAL S.A</p><br><p class=\"content-small content-bold \">INTIMA&#199;&#195;O</p><br><p class=\"content-small \">Fica Vossa Senhoria INTIMADO(A) do r. Despacho/Senten&#231;a a<br>seguir:</p><br><p class=\"content-small content-bold \">DESPACHO - ID N&#176; b1fcef9:</p><br><p class=\"content-small \">&quot;1. Considerando que a r&#233; encontra-se em recupera&#231;&#227;o judicial,<br>reconsidero o despacho de Id. 36c6730.</p><br><p class=\"content-small \">2. Diante dos termos do art. 115 da Lei 11.101/2005, o qual<br>estabelece que a compet&#234;ncia da Justi&#231;a do Trabalho se esgota<br>com a quantifica&#231;&#227;o do d&#233;bito e expedi&#231;&#227;o de certid&#227;o de cr&#233;dito<br>para habilita&#231;&#227;o perante o ju&#237;zo da recupera&#231;&#227;o judicial, determino<br>a expedi&#231;&#227;o das referidas certid&#245;es, entrega aos respectivos<br>credores e remessa dos autos ao arquivo provis&#243;rio.</p><br><p class=\"content-small \">3. Observando-se os termos do Provimento 001/2012 da<br>Corregedoria Geral da Justi&#231;a do Trabalho, fa&#231;a-se constar nas</p><br><p class=\"content-small \">certid&#245;es que tal documento dever&#225; ser apresentado ao<br>Administrador Judicial, informando o endere&#231;o.</p><br><p class=\"content-small \">4.    Intimem-se.</p><br><p class=\"content-small \">5.    Tudo cumprido, revisem-se os autos e remetam-se ao arquivo<br>provis&#243;rio.&quot;</p><br><p class=\"content-small \">Rondon&#243;polis/MT, Sexta-feira, 13 de Fevereiro de 2015.</p><br><p class=\"content-small content-bold \">Gilberto Luiz Hollenbach<br>Gylberto dos Reis Corr&#234;a</p>",
        "data": "2015-02-13 00:00:00",
        "letras_processo": "RTOrd",
        "subprocesso": null,
        "created_at": null,
        "updated_at": null,
        "descricao_pequena": "Movimentação do processo RTOrd-0000735-18.2014.5.23.0021",
        "diario_oficial": "13/02/2015 | TRT-23 - Judiciário",
        "estado": "Mato Grosso",
        "envolvidos": [
            {
                "id": 12227,
                "nome": "Adenir Alves da Silva Carruesco",
                "objeto_type": "Pessoa",
                "pivot_tipo": "RELATOR",
                "pivot_outros": "NAO",
                "pivot_extra_nome": null,
                "link": "https://api.escavador.com/sobre/9911089/adenir-alves-da-silva-carruesco",
                "link_api": "https://api.escavador.com/api/v1/pessoas/9663756",
                "nome_sem_filtro": "Adenir Alves da Silva Carruesco",
                "envolvido_tipo": null
            },
            {
                "id": 12262,
                "nome": "Edmundo Dionisio Inacio Neto",
                "objeto_type": "Pessoa",
                "pivot_tipo": "RECLAMANTE",
                "pivot_outros": "NAO",
                "pivot_extra_nome": null,
                "link": "https://api.escavador.com/sobre/12762632/edmundo-dionisio-inacio-neto",
                "link_api": "https://api.escavador.com/api/v1/pessoas/12540270",
                "nome_sem_filtro": "Edmundo Dionisio Inacio Neto",
                "envolvido_tipo": null
            },
            {
                "id": 12263,
                "nome": "Gylberto dos Reis Corrêa",
                "objeto_type": "Pessoa",
                "pivot_tipo": "ADVOGADO",
                "pivot_outros": "NAO",
                "pivot_extra_nome": null,
                "link": "https://api.escavador.com/sobre/9911108/gylberto-dos-reis-correa",
                "link_api": "https://api.escavador.com/api/v1/pessoas/9663775",
                "nome_sem_filtro": "Gylberto dos Reis Corrêa",
                "envolvido_tipo": null
            },
            {
                "id": 12264,
                "nome": "Petrocal Industria e Comercio de Cal S/A",
                "objeto_type": "Instituicao",
                "pivot_tipo": "RECLAMADO",
                "pivot_outros": "NAO",
                "pivot_extra_nome": null,
                "link": "https://api.escavador.com/sobre/27056536/petrocal-industria-e-comercio-de-cal-s-a",
                "link_api": "https://api.escavador.com/api/v1/instituicoes/2519049",
                "nome_sem_filtro": "Petrocal Industria e Comercio de Cal S/A",
                "envolvido_tipo": null
            },
            {
                "id": 12265,
                "nome": "Gilberto Luiz Hollenbach",
                "objeto_type": "Pessoa",
                "pivot_tipo": "ADVOGADO",
                "pivot_outros": "NAO",
                "pivot_extra_nome": null,
                "link": "https://api.escavador.com/sobre/9911109/gilberto-luiz-hollenbach",
                "link_api": "https://api.escavador.com/api/v1/pessoas/9663776",
                "nome_sem_filtro": "Gilberto Luiz Hollenbach",
                "envolvido_tipo": null
            }
        ],
        "link": "https://api.escavador.com/processos/3503/processo-0000735-1820145230021-do-trt-da-23-regiao?ano=2015#movimentacao-3736",
        "link_api": "https://api.escavador.com/api/v1/movimentacoes/3736",
        "data_formatada": "13/02/2015",
        "processo": {
            "id": 3503,
            "numero_antigo": null,
            "numero_novo": "0000735-18.2014.5.23.0021",
            "created_at": null,
            "updated_at": null,
            "link": "https://api.escavador.com/processos/3503/processo-0000735-1820145230021-do-trt-da-23-regiao",
            "link_api": "https://api.escavador.com/api/v1/processos/3503",
            "data_movimentacoes": "20/06/2014 a 15/12/2017",
            "url": {
                "id": 90662892,
                "slug": "processo-0000735-1820145230021-do-trt-da-23-regiao",
                "objeto_type": "Processo",
                "objeto_id": 3503,
                "redirect": null
            }
        }
    }
}
```

- Status 200
```json
{
    "event": "diario_citacao_nova",
    "monitoramento": [
        {
            "id": 1030,
            "processo_id": null,
            "tribunal_processo_id": null,
            "pasta_id": null,
            "termo": "Contrato n° 02/2011",
            "categoria": null,
            "tipo": "TERMO",
            "limite_aparicoes": 5,
            "enviar_email_principal": 1,
            "desativado": "NAO",
            "bloqueado_ate": null,
            "api": "NAO",
            "descricao": "Contrato n° 02/2011",
            "aparicoes_nao_visualizadas": 14,
            "quantidade_aparicoes_mes": 0,
            "bloqueado_temporariamente": null,
            "variacao_principal": null,
            "data_ultima_aparicao": "01/09/2017",
            "numero_diarios_monitorados": 1,
            "numero_diarios_disponiveis": 137,
            "tribunal_sigla": null,
            "tribunal_disponivel": false,
            "termos_auxiliares": []
        }
    ],
    "diario": {
        "id": 188168,
        "path": null,
        "origem_id": 32,
        "plugin": "DOESP",
        "edicao": "20151024",
        "tipo": "Legislativo",
        "tipo_url": "legislativo",
        "tipo_exibicao": "PAGINADO",
        "data": "2015-10-24",
        "qtd_paginas": 48,
        "created_at": "2015-11-04 10:24:18",
        "elasticsearch_status": "INDEXED",
        "descricao": "Diário Oficial do Estado de São Paulo",
        "origem": {
            "id": 32,
            "nome": "Diário Oficial do Estado de São Paulo",
            "sigla": "DOESP",
            "db": "JURIDICO",
            "estado": "SP",
            "competencia": "São Paulo",
            "categoria": "Diários do Executivo"
        }
    },
    "pagina_diario": {
        "numero_pagina": 24,
        "conteudo": "<p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO LEGAIS os atos de admissão dos servidores em exame e determino, por consequência, os respectivos registros, nos termos e para os fins do disposto no inciso V, do artigo 2°, da Lei Complementar Estadual n° 709/93. Autorizo vista e extração de cópias dos autos no Cartório do Corpo de Auditores, observadas as cautelas de estilo.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Proc.: TC—001957/003/10. Órgão: Prefeitura Municipal de Amparo. Assunto: Admissão de Pessoal - tempo determinado (processos seletivos - 4/2008, 5/2008, 2/2009, 3/2009, 4/2009, 5/2009, 86613-0/08). Exercício: 2009. Responsável: Paulo Turato Miotta - Prefeito Municipal. Funções/Profissionais Admitidos (Interessados): Médico Plantonista (editais 3/2009 e 5/2009): Adalberto Jose de Oliveira Neto; Adalberto Jose de Oliveira Neto; Chrislaine Aparecida Zwicker; Giuliano Dimarzio; Maria Carolina Maciel de Azevedo Gouveia. Médico Plantonista - Neurologista (edital 4/2008): Patricia Horn Barbosa Prata. Médico Plantonista</span></p><p><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">-    Saúde do Trabalhador (edital 2/2009): Maria Carolina Maciel de Azevedo Gouveia. Médico PSF (processo 86613-0/08 e edital 3/2009): Amadeu da Silva Zullino; Amadeu da Silva Zullino; Andreia de Oliveira Gallardo; Andreia de Oliveira Gallardo; Geraldo Afonso Moreira Gomes; Geraldo Afonso Moreira Gomes. Professor de Educação Física (edital 5/2008): Carlos Gutenberg Neves Carline. Professor de Educação Infantil, Ensino Fundamental e Educação de Jovens e Adultos (edital 5/2008 e 4/2009): Adriana Aparecida Morandim; Adriana Cristina Ferrario; Adriana Cristina Ferrario; Alice Mariano; Alice Mariano; Andrea Aparecida Nogueira do Nascimento; Angela Maria da Silva; Ariane Sanches de Souza; Claricelia Regina Panegassi Simoes; Claricelia Regina Panegassi Simoes; Daniela Maria de Lima; Daniela Maria de Lima; Diana Aparecida Givanini Silva; Fabiana Cassia Chila-ver Nunes; Fabiana Cassia Chilaver Nunes; Fatima Aparecida Guimaraes Panegassi; Fatima Aparecida Guimaraes Panegassi; Izildinha Aparecida Bozzi Guadaguini; Janaina Beatriz Paulista; Janaina Beatriz Paulista Brianti; Juliana Spagiari; Katia Cristina Pereira Batoni da Silva; Kelly Cristina de Souza Boianosk; Kelly Cristina de Souza Boianosk; Kelly Cristina de Souza Boianosk; Luci Mara Aparecida de Almeida Giraldi; Maria Aparecida Avanci Toloto; Maria Cristina Rampazo Geraldi; Neusete Cefronio dos Santos Costa; Neusete Cefronio dos Santos Costa; Nilza Maria Darin Bernardi; Ofelia Aparecida Bueno de Moraes Ferreira; Ronilda Benedita de Almeida Lucas; Roseli Luzia Berlofa Marchi; Rosemeire Goncalves; Sandra de Moraes Vieira; Sara Luz Silveira Costa; Silmara de Cassia da Silva; Silvana de Souza Godoy Moreira; Simone Cristina Martinelle; Simone Cristina Martinelle; Simone Onofrio de Godoy; Tais Rodrigues; Vera Aparecida Cunha Peruffo; Viviane Aparecida de Souza; Adriana Augusta da Silva Righetti Marinho; Aldaisa Pires de Camargo; Alessandra de Souza Guarizzo; Angela Maria da Silva; Beatriz Panigassi Alves da Silveira; Claudia Helbig; Darcia Fernanda da Silva Costa; Denise Xavier de Souza; Elaine Assulfi; Elaine Aparecida Bianchi Leite; Elenice Cavalcante; Eliana Montini Colombo; Elisangela da Costa Rodrigues; Elisangela Luz Silveira Alves de Oliveira; Erica Raimunda Rodrigues da Silva; Fatima Cristina de Assis Reis; Fernanda Aparecida da Costa; Janaina Cristina Turolla; Katia Lima das Eyras Salomao; Kelly Cristina de Souza Boianosk; Laura dos Santos; Leila Rosana Broleze; Lidia Cristina Pagan; Lisa Marla de Moraes Camillo; Luciana Sibinelli; Luzia Toledo Mariano; Maria Clarete Ferreira Cezar Geroto; Maria Cristiane Cerezer Rodrigues; Maria Lilia Craveiro; Maria Zilda da Silva; Marilda Segalla Pires; Marilia Barichelo; Marilia Fernanda Galli; Marilsa Antonia do Prado de Oliveira; Marisa Rodrigues; Mirian Helena Ferreira de Lima; Natalia Aparecida Camilotti Codo; Natalia Fatima Conti; Neide Maria de Santana Ribeiro; Neusa Mariana de Oliveira; Nilze Marlei Franco Pavani; Patricia Aline Taddeo; Patricia Aparecida Cezar da Silva; Patricia Aparecida de Freitas; Priscila Adriana Gallo; Rafaela Pavani Zuchi; Raquel Cristina Moraes; Renata do Nascimento Mourao; Renata Urbano Moro Alves; Roberta Cerezer de Assis; Rosilane Divina Carvalho; Sabrina de Oliveira Maciel de Souza; Sandra Regina Rampazo Borgonove; Selma Cristina de Moraes Benedito; Silmara Cassia Rodrigues; Silvana Lemos Santos Garcia; Simone Cristina Cau Simenton Geraldi; Tais Aparecida de Godoy Souza; Thais Cerqueira Jorge Nogueira; Valeria Regina Cezar; Priscila Lemos Bueno; Rosana Aparecida Camargo; Viviane Tenorio de Oliveira; Aline Crepaldi Prebelli; Patricia Helena Lino de Almeida; Katia Cristina Pereira Batoni da Silva; Carla Priscila Rosa Botelho Candreva; Fabiana Paladini Groppo; Helena Maria Ribeiro Urbano; Juliana Spagiari; Patricia Maria Pires de Camargo Mozer; Silvia Amelia de Marco; Valeria da Silva Del Buono; Naiara Scavassa; Angela Maria da Silva; Eliana Montini Colombo; Marisa Alexandre Bispo Cazotti; Marisa da Costa Rodrigues; Marta Regina Goulart; Silmara de Cassia da Silva; Viviane Aparecida de Souza. Professor Telessala (edital 5/2008): Elaine Maria Benites Polidoro; Roberta Maria Pavani Manzolli Bertoni. Instrução: UR/3 - Campinas / DSF - I. Advogados: Dr. Douglas Gomes Pupo - OAB/SP n. 73.103, Dra. Ana Cláudia de Morais Lixandrão - OAB/SP n° 185.590, Dra. Marina Roque Nóbrega de Assis - OAB/SP - 223.486, Dra. Isabel Cristina da Silva Rocha - OAB/SP n. 133,044, Dra. Claudete de Moraes Zamana OAB/SP 143.592 e outros; Dra. Débora de Carvalho Baptista - OAB/SP n. 91.307, Dra. Marcela Belic Cheru-bine - OAB/SP n. 113.601, Dra. Marlene Batista do Nascimento</span></p><p><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">-    OAB/SP 316.527. Sentença: Fls. 505/511.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: As admissões de pessoal por tempo determinado ora em exame foram precedidas de processos seletivos e alguns deles pautados por provas e títulos. Quanto à seleção mediante análise curricular, noto que os critérios de pontuação foram expressamente previstos no edital. Cumprida, pois, a Deliberação TC-A - 15248/026/04. Considero, além disto, que os argumentos referentes à legislação que deu fundamento às contratações possam ser acolhidos e que restou configurada a necessidade temporária de excepcional interesse público. À vista dos elementos de instrução processual e diante da relevância dos serviços prestados, julgo regulares as admissões em exame e determino o registro dos atos. Recomendo ao município, no entanto, que não deixe de cumprir a regra do inciso II do artigo 37 da CF, sobretudo porque há muitos cargos vagos, de provimento efetivo no Quadro de Pessoal. Desde logo, autorizo aos interessados vista e extração de cópia no Cartório do Corpo de Auditores, observadas as cautelas legais.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Proc.: TC-001985/003/13. Contratante: PREFEITURA MUNICIPAL DE CAMPO LIMPO PAULISTA. Responsável: ARMANDO HASHIMOTO - EX-PREFEITO MUNICIPAL. Contratada: RÁPIDO LUXO DE CAMPINAS. Objeto: ALIENAÇÃO DE ÁREA PERTENCENTE AO PATRIMÔNIO DO MUNICÍPIO CONFORME ANEXO I - MEMORIAL DESCRITIVO DO SISTEMA DE LAZER QUE POR FORCA DO ART. 3° DA LC 396/10 PASSA A SER CLASSIFICADO NA CATEGORIA DE \"BEM PATRIMONIAL DISPONÍVEL\". Em exame: LICITAÇÃO CONCORRÊNCIA PÚBLICA N° 05/201 1 E CONTRATO N° 119/2011. ADVOGADOS: GRAZIELA NOBRE-GA DA SILVA (OAB/SP 247.092); EDUARDO L. DE QUEIROZ E SOUZA (OAB/SP 109.013). INSTRUÇÃO: UR-3 UNIDADE REGIONAL DE CAMPINAS/DSF-I. Sentença: Fls. 154/157.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO REGULARES a licitação Concorrência Pública n° 05/2011 e o contrato n° 119/2011, determinando à origem que atente ao correto cumprimento da lei em todos os procedimentos licitatórios porvindouros, sob pena de serem considerados irregulares por esta e. Corte de Contas em suas futuras análises. Autorizo vista e extração de cópias Cartório do Corpo de Auditores, observadas as cautelas de estilo.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Proc.: TC-002231/003/13. ÓRGÃO CONCESSOR: Prefeitura Municipal de Bragança Paulista. Responsáveis: João Afonso Sólis - Ex-Prefeito; Fernão Dias da Silva Leme - Prefeito. BENEFICIÁRIA: Associação de Escritores de Bragança Paulista. Assunto: Repasses ao Terceiro Setor - Subvenção. Valor: R$ 15.000,00. Exercício: 2012. INSTRUÇÃO: UR-3 Campinas/DSF-I. Sentença: Fls. 121/123.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO REGULAR a prestação de contas dos repasses em apreço, nos termos e para os fins do disposto no artigo 33, inciso I, da Lei Complementar n° 709/93, dando-se, em consequência, quitação ao responsável nos termos do artigo 34 do mesmo diploma legal, liberando a entidade para novos benefícios. Autorizo vista e extração de cópias no Cartório do Corpo de Auditores, observadas as cautelas de estilo.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Proc.: TC-002513/003/13. ÓRGÃO CONCESSOR: Prefeitura Municipal de Capivari. Responsáveis: Luis Donizeti Campaci -Ex-Prefeito; Rodrigo Abdala Proença - Prefeito. BENEFICIÁRIA: Santa Casa de Misericórdia de Capivari. Assunto: Repasses ao Terceiro Setor - Auxílio. Valor: R$ 100.1 52,81. Exercício: 2012. INSTRUÇÃO: UR-03 Campinas/DSF-I. Sentença: Fls. 75/76. ADVOGADOS: Marcos Jordão Teixeira do Amaral Filho (OAB/SP 74.481) e outros.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO REGULAR a prestação de contas dos repasses em apreço, nos termos e para os fins do disposto no artigo 33, inciso I, da Lei Complementar n° 709/93, dando-se, em consequência, quitação ao responsável nos termos do artigo 34 do mesmo diploma legal, liberando a entidade para novos benefícios. Autorizo vista e extração de cópias no Cartório do Corpo de Auditores, observadas as cautelas de estilo.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Proc.: TC-041330/026/12. Órgão: Prefeitura Municipal de Campinas. Responsável: Jonas Donizette Ferreira - Prefeito. Assunto: Admissão de Pessoal - Concurso público. INTERESSADOS: Lilian Cristina Fosco e outros. Exercício: 2014. INSTRUÇÃO: UR-10 Araras/DSF-I. Sentença: Fls. 197/198</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO LEGAIS os atos de admissão dos servidores em exame e determino, por consequência, os respectivos registros, nos termos e para os fins do disposto no inciso V, do artigo 2°, da Lei Complementar Estadual n° 709/93. Autorizo vista e extração de cópias dos autos no Cartório do Corpo de Auditores, observadas as cautelas de estilo.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">SENTENÇAS DO AUDITOR SAMY WURMAN</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">PROCESSO: TC-4037/989/15. ÓRGÃO: PREFEITURA MUNICIPAL DE SÃO PEDRO DO TURVO. RESPONSÁVEL: JOSÉ CARLOS DAMASCENO - PREFEITO. ASSUNTO: ADMISSÃO DE PESSOAL - TEMPO DETERMINADO. INTERESSADOS: CINTIA DAMASCENO E OUTROS. EXERCÍCIO: 2014. INSTRUÇÃO: UR-4 - REGIONAL DE MARÍLIA/DSF-II.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO LEGAIS os atos de admissão dos servidores em exame (Eventos 10.1 a 10.5), e determino por consequência, o respectivo registro, nos termos e para os fins do disposto no inciso V, do artigo 2°, da Lei Complementar Estadual n° 709/93. Por fim, esclareço que, por se tratar de procedimento eletrônico, na conformidade da Resolução n° 1/2011, a íntegra da decisão e demais documentos poderá ser obtido mediante regular cadastramento no Sistema de Processo Eletrônico - e.TCESP, na página <span href=\"http://api.tce.sp.gov.br\">api.tce.sp.gov.br</span>.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Publique-se.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">PROCESSO: TC-4468/989/14. ÓRGÃO: FUNDAÇÃO EDUCACIONAL DE BARRETOS. RESPONSÁVEL: REGINALDO DA SILVA - REITOR. ASSUNTO: ADMISSÃO DE PESSOAL - CONCURSO PÚBLICO. INTERESSADOS: ANGELA MARIA MACUCO DO PRADO BRUNELLI E OUTROS. EXERCÍCIO: 2013. INSTRUÇÃO: UR-8 - REGIONAL DE SÃO JOSÉ DO RIO PRETO/DSF-II. PROCURADORES: DENIS MARCOS VELOSO SOARES - OAB/SP N° 229.059 E SOLANGE SOUSA SANTOS DE PAULA - OAB/SP N° 319.662 (EVENTO 23.1).</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO LEGAIS os atos de admissão dos servidores em exame (Evento 10.1) e determino, por consequência, os respectivos registros, nos termos e para os fins do disposto no inciso V, do artigo 2°, da Lei Complementar Estadual n° 709/93. Por fim, esclareço que, por se tratar de procedimento eletrônico, na conformidade da Resolução n° 1/2011, a íntegra da decisão e demais documentos poderão ser obtidos mediante regular cadastramento no Sistema de Processo Eletrônico - e.TCESP, na página <span href=\"http://api.tce.sp.gov.br\">api.tce.sp.gov.br</span>.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Publique-se.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">PROCESSO: TC-2984/989/13. ÓRGÃO: PREFEITURA MUNICIPAL DE BARRA BONITA. RESPONSÁVEL: JOSÉ CARLOS DE MELLO TEIXEIRA - PREFEITO À ÉPOCA. ASSUNTO: ADMISSÃO DE PESSOAL - CONCURSO PÚBLICO. INTERESSADOS: KLEBER NOGUEIRA LIMA E CARLOS EDUARDO MACEDO. EXERCÍCIO: 2012. INSTRUÇÃO: UR-02 - REGIONAL DE BAURU/DSF-II.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO LEGAIS os atos de admissão dos servidores em exame e determino, por consequência, os respectivos registros, nos termos e para os fins do disposto no inciso V, do artigo 2°, da Lei Complementar Estadual n° 709/93. Por fim, esclareço que, por se tratar de procedimento eletrônico, na conformidade da Resolução n° 1/2011, a íntegra da decisão e demais documentos poderão ser obtidos mediante regular cadastramento no Sistema de Processo Eletrônico - e.TCESP, na página api. tce.sp.gov.br. (REPUBLICADO POR TER SAÍDO COM INCORREÇÃO NO DOE DE 03/06/2015)</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Publique-se.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">PROCESSO: TC-2342/989/15. ÓRGÃO: PREFEITURA MUNICIPAL DE BARRA BONITA. RESPONSÁVEL: GLAUBER GUILHERME BELARMINO - PREFEITO. ASSUNTO: ADMISSÃO DE PESSOAL - CONCURSO PÚBLICO. INTERESSADOS: GEAN CARLOS VICENTE JUNIOR E OUTROS. EXERCÍCIO: 2014. INSTRUÇÃO: UR-2 - REGIONAL DE BAURU/DSF-II. PROCURADORA: FABIANA BALBINO VIEIRA - OAB/SP N° 238.056.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO LEGAIS os atos de admissão dos servidores em exame (Evento 11.1) e determino, por consequência, os respectivos registros, nos termos e para os fins do disposto no inciso V, do artigo 2°, da Lei Complementar Estadual n° 709/93. Determino que o Órgão para que observe com rigor os limites de despesas com gastos com pessoal previstos na Lei de Responsabilidade Fiscal, sob pena de, na persistência da mencionada falha, aplicação de multa pecuniária ao responsável. Por fim, esclareço que, por se tratar de procedimento eletrônico, na conformidade da Resolução n° 1/2011, a íntegra da decisão e demais documentos poderão ser obtidos mediante regular cadastramento no Sistema de Processo Eletrônico - e.TCESP, na página <span href=\"http://api.tce.sp.gov.br\">api.tce.sp.gov.br</span>.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Publique-se.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">PROCESSO: TC-5644/989/15. ÓRGÃO: PREFEITURA MUNICIPAL DE ADAMANTINA. RESPONSÁVEL: IVO FRANCISCO DOS SANTOS JÚNIOR - PREFEITO. ASSUNTO: ADMISSÃO DE PESSOAL - TEMPO DETERMINADO. INTERESSADOS: Agente Comu-nitario de Saude Carina Aparecida Sakamoto Borelli; Fernanda Cristina da Silva; Silmara de Fatima Correa Ajudante Geral Ade-mira de Souza; Aide dos Santos Conceição; Alessandra Nascimento da Silva; Alessandra Regina da Silva; Alice Ramos de Oliveira; Aline Lourenço da Silva; Amanda Alves Vitorino; Andreia Sensiarelli; Angelica Justino Ferreira de Souza; Ariane Francino de Moraes Auxliar de Enfermagem Michele Nunes Dias Correa Enfermeiro Mirna Juliana Fialho de Brito. EXERCÍCIO: 2014. INSTRUÇÃO: UR-5 - REGIONAL DE PRESIDENTE PRUDENTE/DSF-II.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO LEGAIS os atos de admissão Ademira de Souza, Aide dos Santos Conceição, Alessandra Nascimento da Silva, Alessandra Regina da Silva, Alice Ramos de Oliveira, Aline Lourenço da Silva, Amanda Alves Vitorino, Andreia Sensiarelli, Angelica Justino Ferreira de Souza e Ariane Francino de Moraes (Ajudante Geral), registrando-os, nos termos do artigo 2°, inciso V, da Lei Complementar Estadual n° 709/93, exceção às admissões de MIRNA JULIANA FIALHO DE BRITO (ENFERMEIRO), MICHELE NUNES DIAS CORREA (AUXILIAR DE ENFERMA-</span></p><p><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">GEM), CARINA APARECIDA SAKAMOTO BORELLI, FERNANDA CRISTINA DA SILVA e SILMARA DE FATIMA CORREA (AGENTE COMUNITÁRIO DE SAÚDE) as quais JULGO ILEGAIS, negando-lhes o registro. Outrossim, nos termos do artigo 104, inciso II da Lei Complementar n° 709/93, aplico ao Senhor Ivo Francisco dos Santos Júnior, multa no valor de 200(duzentas) UFESP's. Por fim, esclareço que, por se tratar de procedimento eletrônico, na conformidade da Resolução n° 1/2011, a íntegra da decisão e demais documentos poderão ser obtidos mediante regular cadastramento no Sistema de Processo Eletrônico - e.TCESP, na página <span href=\"http://api.tce.sp.gov.br\">api.tce.sp.gov.br</span>.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Publique-se.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">PROCESSO: TC-7572/989/15. ÓRGÃO: PREFEITURA MUNICIPAL DE SANTO ANDRÉ. RESPONSÁVEL: CARLOS ALBERTO GRANA - PREFEITO. ASSUNTO: ADMISSÃO DE PESSOAL - CONCURSO PÚBLICO (SUBSEQUENTE). INTERESSADOS: RUBENS GALLINO JÚNIOR E OUTROS. EXERCÍCIO: 2014. INSTRUÇÃO: DF-4.3/DSF-II.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO LEGAIS os atos de admissão dos servidores relacionados no Evento 8.1 e determino, por consequência, os respectivos registros, nos termos e para os fins do disposto no inciso V, do artigo 2°, da Lei Complementar Estadual n° 709/93. Por fim, esclareço que, por se tratar de procedimento eletrônico, na conformidade da Resolução n° 1/2011, a íntegra da decisão e demais documentos poderão ser obtidos mediante regular cadastramento no Sistema de Processo Eletrônico - e.TCESP, na página <span href=\"http://api.tce.sp.gov.br\">api.tce.sp.gov.br</span>.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Publique-se.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">PROCESSO: TC-6905/989/15. ÓRGÃO: CÃMARA MUNICIPAL DE RIBEIRÃO PRETO. RESPONSÁVEL: WALTER GOMES DE OLIVEIRA - PRESIDENTE. ASSUNTO: ADMISSÃO DE PESSOAL - CONCURSO PÚBLICO (SUBSEQUENTE). INTERESSADOS: MARIANA DE SOPUZA CARBONE E OUTROS. EXERCÍCIO: 2014. INSTRUÇÃO: UR-17 - REGIONAL DE ITUVERAVA/DSF-I.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO LEGAIS os atos de admissão dos servidores relacionados nos Evento 8.1) e determino, por consequência, os respectivos registros, nos termos e para os fins do disposto no inciso V, do artigo 2°, da Lei Complementar Estadual n° 709/93. Por fim, esclareço que, por se tratar de procedimento eletrônico, na conformidade da Resolução n° 1/2011, a íntegra da decisão e demais documentos poderão ser obtidos mediante regular cadastramento no Sistema de Processo Eletrônico - e.TCESP, na página <span href=\"http://api.tce.sp.gov.br\">api.tce.sp.gov.br</span>.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Publique-se.</span></p><p><span class=\"content-small\" style=\"font-family:Arial, sans-serif;\">SENTENÇA DO AUDITOR JOSUÉ ROMERO</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">SENTENÇAS PROFERIDAS PELO AUDITOR JOSUÉ ROMERO</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Proc.: TC-000022/016/13. Órgão: PREFEITURA MUNICIPAL DE ITAÍ. Responsável: LUIZ ANTONIO PASCHOAL - PREFEITO. Assunto: ADMISSÃO DE PESSOAL - TEMPO DETERMINADO. INTERESSADOS: ELISABETE APARECIDA FERREIRA SOUZA E OUTROS. Exercício: 2011. Advogado: JOSÉ ANTONIO GOMES IGNACIO JUNIOR - OAB/SP N° 119.663. INSTRUÇÃO: UR-16 UNIDADE REGIONAL DE ITAPEVA / DSF-I. Sentença: Fls. 114/115.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO LEGAIS os atos de admissão em exame, registrando-os, nos termos do artigo 2°, inciso V, da Lei Complementar Estadual n° 709/93, com recomendação para que a Administração privilegie as admissões para seu quadro de pessoal, nos termos do inciso II, artigo 37, da Constituição Federal. Autorizo vista e extração de cópias dos autos no Cartório do Corpo de Auditores, observadas as cautelas de estilo.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Proc.: TC-000042/011/12. Órgão: FUNDO DE PREVIDÊNCIA MUNICIPAL DE VALENTIM GENTIL. Responsável: ADILSON JESUS PEREZ SEGURO - GESTOR. Assunto: PRESTAÇÃO DE CONTAS DO GESTOR PREVIDÊNCIA MUNICIPAL DE 2011. DISTRIBUIÇÃO: CONSELHEIRO ANTONIO ROQUE CITADINI E AUDITOR JOSUÉ ROMERO. INSTRUÇÃO: UR-11 UNIDADE REGIONAL DE FERNANDÓPOLIS / DSF-II. Sentença: Fls. 130/132.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos motivos expressos na sentença referida, JULGO REGULARES, COM RESSALVA, as contas anuais de 2011 do Fundo de Previdência Municipal de Valentim Gentil, conforme artigo 33, inciso II, da Lei Complementar n° 709/93, recomendando a observância ao prazo de remessa de documentação a este E. Tribunal. Determino a verificação, em próxima Fiscalização, das medidas conciliatórias relativas ao acerto das divergências constatadas quanto aos valores na área de Investimentos. Quito o responsável, Sr. Adilson Jesus Perez Segura, nos termos do artigo 35, do mesmo diploma legal. Excetuo os atos pendentes de julgamento por este Tribunal. Autorizo vista e extração de cópias dos autos no Cartório do Corpo de Auditores, observadas as cautelas de estilo.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Proc.: TC-66/006/09. Contratante: PREFEITURA MUNICIPAL DE MORRO AGUDO. Responsável: GILBERTO CÉSAR BARBE-TI - EX-PREFEITO. Contratada: VANDERLEI JOEL BALLMANN SISTEMAS. Objeto: LOCAÇÃO DE SOFTWARE NAS ÁREAS DE CONTABILIDADE PÚBLICA, CONTROLE FUNDEF, PONTO ELETRÔNICO, FOLHA DE PAGAMENTO, RECURSOS HUMANOS, COMPRAS E LICITAÇÕES E PRESTAÇÃO DE SERVIÇOS TÉCNICOS DE IMPLANTAÇÃO, ALTERAÇÃO E SUPORTE OPERACIONAL DOS SISTEMAS LOCADOS. Em exame: CONVITE N° 21/2006 E CONTRATO N° 108/06 DE 31/05/2006. ADVOGADOS: ELIEZER PEREIRA MARTINS - OAB/SP 168.735 E OUTROS. INSTRUÇÃO: UR-17 UNIDADE REGIONAL DE ITUVERAVA/DSF-I. DISTRIBUIÇÃO: CONSELHEIRO RENATO MARTINS COSTA E AUDITOR JOSUÉ ROMERO. Sentença: Fls. 278/281.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO IRREGULARES a licitação e o subsequente contrato, aplicando-se, por via de consequência, o disposto nos incisos XV e XXVII, do artigo 2°, da Lei Complementar Estadual n° 709/93. Outrossim, nos termos do artigo 104, inciso II da Lei Complementar n° 709/93, aplico ao responsável, Sr. Gilberto César Barbeti - Ex-Prefeito, multa no valor de 200 (duzentas) UFESP's. Autorizo vista e extração de cópias no Cartório do Conselheiro Renato Martins Costa, observadas as cautelas de estilo.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Proc.: TC-374/016/10. Órgão: PREFEITURA MUNICIPAL DE ITARARÉ. Responsável: LUIZ CÉSAR PERÚCIO, EX-PREFEITO. Assunto: ADMISSÃO DE PESSOAL - TEMPO DETERMINADO. INTERESSADOS: AGENTE COMUNITÁRIO DE SAÚDE, ADEMIR MARIA PINTO, ADRIANA CRISTINA PAULINO, ANE PRISCILA CAMARGO, DAYANE FRANCINE PAULINO, DIRCEU SOARES DE AGOSTINHO, EDICLEIA JUSSIMARA DOS SANTOS VAZ, JOSIANE DE OLIVEIRA FERNANDES, MAGDALENA RUIVO DE LARA, VERI-DIANA FERRAZ DE SOUZA BANDIGA; AGENTE VETOR, DANI EDSON DE ALMEIDA, OBERDAM VINICIUS CORREA, ROSENILDA PRESTES ZACARIAS, VANDERLEI DINO FERREIRA, CLAUDIA DOS SANTOS, EDNA DELL ANHOL, JANES AMELIA NUNES DA SILVA; BORRACHEIRO, ANTONIO SANTO CIQUELERO; NUTRICIONISTA, MARIAH NOGUEIRA GHIZZI PEREIRA. Exercício: 2009. INSTRUÇÃO: UR-16 UNIDADE REGIONAL DE ITAPEVA/DSF-I. DISTRIBUIÇÃO: CONSELHEIRO ANTONIO ROQUE CITADINI E AUDITOR JOSUÉ ROMERO. Sentença: Fls. 183/186.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO ILEGAIS os atos de admissão de fls. 03/06, negando-lhes registro e aplicando-se, por via de consequência, o disposto nos incisos XV e XXVII, do artigo 2°, da Lei Complementar Estadual n° 709/93. Autorizo vista e extração de cópias dos autos no Cartório do Corpo de Auditores, observadas as cautelas de estilo.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Proc.: TC-000519/007/11. Órgão: CÂMARA MUNICIPAL DE PIRACAIA. Responsável: WANDERLEY DE OLIVEIRA. Assunto: ADMISSÃO DE PESSOAL - CONCURSO PROCESSO SELETIVO. Interessado: GUSTAVO BUZATTO BURATTI. Exercício: 2012. INSTRUÇÃO: UR-7 UNIDADE REGIONAL DE SÃO JOSÉ DOS CAMPOS DSF-II. Sentença: Fls. 31/32.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO LEGAL o ato de admissão em exame, registrando-o, conforme artigo 2°, inciso V, da Lei Complementar Estadual n° 709/93. Autorizo vista e extração de cópias dos autos no Cartório do Corpo de Auditores, observadas as cautelas de estilo.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Proc.: TC-000694/008/11. Órgão: PREFEITURA MUNICIPAL DE COLÔMBIA. Responsável: FÁBIO ALEXANDRE BARBOSA</span></p><p><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">-    EX-PREFEITO. Assunto: ADMISSÃO DE PESSOAL - TEMPO DETERMINADO. INTERESSADOS: AJUDANTE DE SERVIÇOS GERAIS, RITA DE CASSIA DA SILVA FERNANDES, ROSANGELA APARECIDA PEREIRA, SIMONI CRISTINA DE CASTRO, ADRIA PEREIRA DA SILVA LOUZADA, ALINE APARECIDA DOS SANTOS COTA, CLAUDIA REGINA A P DE SOUZA, FRANCISCA DE SOUZA SILVA SANTOS, JOSEFA AUGUSTA DA SILVA, LUCIMAR MARIA CONCEICAO DA SILVA, MARIA DO SOCORRO DE SOUSA SILVA, MARIA JOSE DE SOUZA QUEIROZ, MARIA ROSALIA DE MEDEIROS, NILCE ALVES DE LIMA, SANDRA APARECIDA ALVES DA SILVA, SANDRA APARECIDA DOS SANTOS, SIMONE ANTONIA FRANCISCO, TEREZINHA MODESTO MENEZES, UDMEA DE AQUINO RODRIGUES, VALTELENA PIRES DE LIMA, INSPETOR DE ALUNOS, LIDIANE BATISTA ARAUJO, LIDIANE LOUZADA DE LIMA, VANUSA BARBINO SIQUEIRA, INSTRUTOR DE INFOR-MATICA EDUCACIONAL, FELIPE ORMUNDO PORTELA, GISELE RAMOS QUEIROZ, LETICIA DA SILVA LOUZADA, PATRICIA APARECIDA FERNANDES CORRADINI, INSTRUTOR DE MUSICA, CARLOS ALBERTO COLTRI, MARCIO ISRAEL HYGINO, MEDICO, ULISSES CALANDRIN, ANA MARIA QUEIROZ, IOLANDA CORREIA BRAGA CANCADO, JOSE BERNARDES, PROFESSOR DE EDUCACAO BASICA, ALESSANDRA MONTEIRO PRADO, ANDREIA AGUETONI DA SILVA, CARLOS ANTONIO DONIZETE MONTEIRO, DANIELA DE LIMA ALVES, ELAINE CRISTINA DO NASCIMENTO, ELIANA M T SILVEIRA EICHEL, FABIANA DE CARVALHO BENICIO, HILDA DO CARMO SOUZA COUTINHO, ILMAVERISSIMO DE SOUZA, JOANA DARC BORGES BRANDINO, JORGE BENEDITO DE OLIVEIRA RAMALHO, JUCELIA RODRIGUES FERREIRA, LILIAN APARECIDA MACHADO, LUCIANA DE OLIVEIRA DIAS, LURDES MARIA PEREIRA, MARCOS ANTONIO FRANCO, MARCOS YAMAGUTI, MARIA APARECIDA TEIXEIRA HOROIVA, MARIA CRISTINA TUNUSSI DA SILVA, MARIA DE JESUS SOUZA TAMBURUS, MARIANA CRISTINA MACHADO, MIRIAN ISABEL DE BRITO MIDORIKAWA, PRISCILA FARIA DE ALMEIDA, REGIANE BATISTA ARAUJO, REGINA CELIA SARAIVA, RENATA RODRIGUES DA SILVA PEDRO, SAMIA MARIA MACHADO SHIMOMURA,TAUANA CAMILA JORDAO, YARA RODRIGUES DOS SANTOS, SANDRA VIANA PEREIRA ROMANI, ANETE LOPES CANCADO DOS SANTOS, CLAUDIA APARECIDA ALVES PAULA ALEXANDRE, MILENE FABIANA DE OLIVEIRA, MILESSANDRA MOLINA BRAGANHOLO, TATIANE TEIXEIRA CUNHA, VIVIANE ZAGO ALVES, LEIDIANE SAMARA BORGES, CARLA CRISTINA CASTRO RAMOS DE OLIVEIRA, FABIANA BARBOSA, HERICA FERNANDA PANTANO DE CARVALHO LIMA, LIDIANE CRISTINA PEREIRA, LILIANE FERREIRA DE OLIVEIRA, LUZIA APARECIDA DE SOUZA ISIDORO, MARIA APARECIDA MAGALHAES PINHA, MICHELI CRISTINA GONCALVES DA SILVA, PATRICIA FONSECA FERREIRA, ROSINEI MACHADO GUIMARAES, SELMA DAS DORES PEREIRA, SILVIA HELENA FERNANDES DA SILVA, VANES-SA CARLA MUNIZ, IRMA DE PAULA CUSTODIO PRADO, PROFESSOR DE EDUCACAO FISICA, ALEXANDRE DOS REIS PINTO, JOSE CARLOS DE SOUZA, MARIA JOSE FERNANDES CORRADINI, PROFESSOR DE PRE ESCOLA, CRISTIANE MENDES MARTINS, LUCIANA DOMINGOS ZAGO, LUCIANA DOS SANTOS, TECNICO EM ENFERMAGEM, DAIANA APARECIDA DA SILVA, SAKIKO KEI-MOTI SIMOMURA, VIGIA, DIOGO SOUZA DA SILVA, EDVALDO DA SILVA ROCHA, HUMBERTO CUSTODIO DA SILVA. Exercício: 2010. INSTRUÇÃO: UR-8 UNIDADE REGIONAL DE SÃO JOSÉ DO RIO PRETO / DSF-II. Sentença: Fls. 210/214.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO ILEGAIS os atos de admissão em exame, negando-lhes registro e aplicando-se, por via de consequência, o disposto nos incisos XV e XXVII, do artigo 2°, da Lei Complementar Estadual n° 709/93. Autorizo vista e extração de cópias dos autos no Cartório do Corpo de Auditores, observadas as cautelas de estilo.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Proc.: TC-000724/018/11. Órgão: PREFEITURA MUNICIPAL DE BASTOS. Responsável: EXERCÍCIO DE 2011 - VIRGÍNIA PEREIRA DA SILVA FERNANDES - PREFEITA; EXERCÍCIO DE 2012 - VIRGÍNIA PEREIRA DA SILVA FERNANDES - PREFEITA. Assunto: ADMISSÃO DE PESSOAL - CONCURSO. INTERESSADOS: EXERCÍCIO DE 2011 - FERNANDA MARIA DALBELO DE OLIVEIRA E OUTROS; EXERCÍCIO DE 2012 - JANAINA GULDONI E OUTROS. Exercício: 2011 E 2012. AUDITOR: JOSUÉ ROMERO. INSTRUÇÃO: UR-18 UNIDADE REGIONAL DE ADAMANTINA/ DSF-II. Sentença: Fls. 269/271.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO LEGAIS os atos de admissão dos servidores em exame e determino, por consequência, os respectivos registros, nos termos e para os fins do disposto no inciso V, do artigo 2°, da Lei Complementar Estadual n° 709/93. Autorizo vista e extração de cópias dos autos no Cartório do Corpo de Auditores, observadas as cautelas de estilo.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Proc.: TC-000739/001/12. Órgão: PREFEITURA MUNICIPAL DE GLICÉRIO. Responsável: ENÉAS XAVIER DA CUNHA - EX-PREFEITO. Assunto: ADMISSÃO DE PESSOAL - TEMPO DETERMINADO N° 001/2011. INTERESSADOS: DIEGO QUINTINO DE OLIVEIRA E OUTROS. Exercício: 2011. Advogado: WAGNER CASTILHO SUGANO - OAB/SP N° 119.298. DISTRIBUIÇÃO: CONSELHEIRO DIMAS EDUARDO RAMALHO E AUDITOR JOSUÉ ROMERO. INSTRUÇÃO: UR-1 UNIDADE REGIONAL DE ARAÇA-TUBA/DSF-I. Sentença: Fls. 73/74.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO LEGAIS os atos de admissão em exame, registrando-os, conforme artigo 2°, inciso V, da Lei Complementar Estadual n° 709/93. Autorizo vista e extração de cópias dos autos no Cartório do Corpo de Auditores, observadas as cautelas de estilo.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Proc.: TC-000817/010/12. Órgão: PREFEITURA MUNICIPAL DE ANALÂNDIA. Responsável: LUIZ ANTONIO APARECIDO GARBUIO - PREFEITO. Assunto: ADMISSÃO DE PESSOAL - CONCURSOS PÚBLICOS N°S 14/2010, 15/2010, 18/2010, 19/2010, 20/2010. INTERESSADOS: MARCELO MANGUEIRA CAVALCANTE E OUTROS. Exercício: 2012. INSTRUÇÃO: UR-10 REGIONAL DE ARARAS/DSF-I. ADVOGADOS: FLÁVIA MARIA PALAVÉRI</span></p><p><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">-    OAB/SP 137.889 E OUTROS. Sentença: Fls. 364/366.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">EXTRATO: Pelos fundamentos expostos na sentença referida, JULGO LEGAIS os atos de admissão em exame, registrando-os, conforme artigo 2°, inciso V, da Lei Complementar Estadual n° 709/93. Recomendo, doravante, a Administração observar, com rigor, os ditames previstos na Lei de Responsabilidade Fiscal, Lei Complementar n° 101/00, artigo 22, parágrafo único, inciso IV, em especial no tocante aos limites de gastos com pessoal. Autorizo vista e extração de cópias dos autos no Cartório do Corpo de Auditores, observadas as cautelas de estilo.</span></p><p style=\"text-indent:14pt;\"><span class=\"content-x-small\" style=\"font-family:Arial, sans-serif;\">Proc.: TC-001041/013/08. Contratante: PREFEITURA MUNICIPAL DE GAVIÃO PEIXOTO. Responsável: ALEXANDRE MARUC-CI BASTOS - EX-PREFEITO. Contratada: ACERT ASSESS ORIA E CONSULTORIA LTDA. Objeto: ASSESSORIA E CONSULTORIA CONTÁBIL E ORÇAMENTARIA, ASSIM COMO DE CONTROLES DA LEGISLAÇÃO VIGENTE NAS ÁREAS CONTÁBIL, FISCAL E ORCAMENTÁRIA. Em exame: CONVITE N° 014/2007, CONTRATO N° 31/07, DE 01/03/2007 E TERMO DE PRORROGAÇÃO CONTRATUAL N° 98/07, DE 21/12/2007, PARA PRORROGAÇÃO DO CONTRATO PELO PERÍODO DE 12 MESE E ATUALIZAÇÃO MONETÁRIA PARA R$ 18.774,00. ADVOGADOS: EMERSON DE HYPOLITO - OAB/SP N° 147.410 E OUTROS. DISTRIBUIÇÃO: CONSELHEIRO RENATO MARTINS COSTA E AUDITOR JOSUÉ ROMERO. INSTRUÇÃO: UR-13 UNIDADE REGIONAL DE ARARA-QUARA/DSF-I. Sentença: Fls. 375/379.</span></p>"
    }
}
```

## Diários Oficiais

### GET /api/v1/origens

**Retornar origens**

Retorna as origens de todos os diários disponíveis no Escavador.

- Requer autenticação: sim

#### Responses

- Status 200
```json
[
    {
        "show": false,
        "nome": "São Paulo",
        "selected": false,
        "checked": 0,
        "diarios": [
            {
                "id": 5,
                "nome": "TRT da 2ª Região",
                "sigla": "TRT-2",
                "tipo": null,
                "db": "JURIDICO",
                "estado": "SP",
                "competencia": "São Paulo",
                "categoria": "Tribunais Regionais do Trabalho",
                "created_at": "2015-10-15T05:03:49.000000Z",
                "updated_at": "2015-10-15T05:03:49.000000Z",
                "selected": false,
                "pivot": {
                    "estado_id": 25,
                    "origem_id": 5,
                    "created_at": "2018-08-07T18:10:52.000000Z",
                    "updated_at": "2018-08-07T18:10:52.000000Z"
                }
            },
            {
                "id": 18,
                "nome": "TRT da 15ª Região",
                "sigla": "TRT-15",
                "tipo": null,
                "db": "JURIDICO",
                "estado": "SP",
                "competencia": "São Paulo",
                "categoria": "Tribunais Regionais do Trabalho",
                "created_at": "2015-10-14T03:43:20.000000Z",
                "updated_at": "2015-10-14T03:43:20.000000Z",
                "selected": false,
                "pivot": {
                    "estado_id": 25,
                    "origem_id": 18,
                    "created_at": "2018-08-07T18:10:52.000000Z",
                    "updated_at": "2018-08-07T18:10:52.000000Z"
                }
            },
            {
                "id": 32,
                "nome": "Diário Oficial do Estado de São Paulo",
                "sigla": "DOESP",
                "tipo": null,
                "db": "JURIDICO",
                "estado": "SP",
                "competencia": "São Paulo",
                "categoria": "Diários do Executivo",
                "created_at": "2015-10-13T17:51:24.000000Z",
                "updated_at": "2015-10-13T17:51:24.000000Z",
                "selected": false,
                "pivot": {
                    "estado_id": 25,
                    "origem_id": 32,
                    "created_at": "2018-08-07T18:10:52.000000Z",
                    "updated_at": "2018-08-07T18:10:52.000000Z"
                }
            }
        ]
    }
]
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### GET /api/v1/diarios/{id}/pdf/pagina/{pagina}/baixar

**Download do PDF da página do Diário Oficial**

Retorna em formato PDF, uma página do Diário Oficial pelo seu identificador no Escavador.

- Requer autenticação: sim

#### URL Params

- `id` (integer, required): Identificador numérico de um Diário Oficial.
- `pagina` (integer, required): Número da página do Diário Oficial, respeitando o limite informado. Valor padrão: 1.

## Monitoramento no site do Tribunal

### GET /api/v1/monitoramentos-tribunal

**Retornar monitoramentos**

Retorna todos os monitoramentos criados pelo usuário.

- Requer autenticação: sim

#### Responses

- Status 200
```json
{
    "items": [
        {
            "id": 1,
            "origem": "TJDF",
            "tipo": "UNICO",
            "valor": "0000000-00.0000.0.00.0000",
            "cron": "4 4 * * 1-5",
            "status": "ENCONTRADO",
            "frequencia": "DIARIA",
            "desativado": false
        },
        {
            "id": 2,
            "origem": "TRT-2",
            "tipo": "UNICO",
            "valor": "0000000-00.0000.0.00.0000",
            "cron": "5 5 * * 1-5",
            "status": "ENCONTRADO",
            "frequencia": "DIARIA",
            "desativado": false
        },
        {
            "id": 3,
            "origem": "TRT-2",
            "tipo": "UNICO",
            "valor": "0000000-00.0000.0.00.0000",
            "cron": "6 6 * * 1-5",
            "status": "ENCONTRADO",
            "frequencia": "DIARIA",
            "desativado": false
        }
    ],
    "links": {
        "first": "http://api.escavador.com/api/v1/monitoramentos-tribunal?page=1",
        "last": "http://api.escavador.com/api/v1/monitoramentos-tribunal?page=1",
        "prev": null,
        "next": null
    },
    "paginator": {
        "current_page": 1,
        "per_page": 20,
        "total": 3,
        "total_pages": 1
    }
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### GET /api/v1/monitoramentos-tribunal/{monitoramentoId}

**Retornar monitoramento**

Retorna um monitoramento pelo identificador.

- Requer autenticação: sim

#### URL Params

- `monitoramentoId` (integer, required): Identificador numérico do monitoramento.

#### Responses

- Status 200
```json
{
    "id": 1,
    "origem": "TJDF",
    "tipo": "UNICO",
    "valor": "0000000-00.0000.0.00.0000",
    "cron": "4 4 * * 1-5",
    "status": "ENCONTRADO",
    "frequencia": "DIARIA",
    "desativado": false
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### PUT /api/v1/monitoramentos-tribunal/{monitoramentoId}

**Editar um monitoramento**

Edita um monitoramento de sistema do tribunal. É possível alterar apenas a frequência do monitoramento.

{
  "status": "success"
}

- Requer autenticação: sim

#### URL Params

- `monitoramentoId` (string, required): 

#### Body Params

- `frequencia` (string, optional): Quantidade de dias que o robô vai buscar por atualizações.<br/><b>Valores permitidos</b>:<br>`DIARIA`: De segunda a sexta.<br>`SEMANAL`: 1 vez na semana (O dia é escolhido pelo Escavador). <br>Default: `DIARIA`.

#### Responses

- Status 200
```json
{
  "status": "success"
}
```

### DELETE /api/v1/monitoramentos-tribunal/{id}

**Remover monitoramento**

Remove um monitoramento pelo identificador cadastrado pelo usuário.

- Requer autenticação: sim

#### URL Params

- `id` (integer, required): Identificador numérico do monitoramento.

#### Responses

- Status 200
```json
{
    "id": 1,
    "monitor": {
        "origem": "TJSP",
        "tipo": "UNICO",
        "valor": "0000000-00.0000.0.00.0000"
    },
    "deleted_at": "0000-00-00 00:00:00"
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### POST /api/v1/monitoramentos-tribunal

**Registrar novo monitoramento**

Cadastra o número de um processo para ser monitorado nos tribunais. Ao encontrar algo novo, um callback é enviado para a sua <a href="http://api.escavador.com/callbacks" target="_blank">url definida</a>. Você pode consultar todos os <a href="/v1/docs/callbacks#listar-os-callbacks">callbacks enviados e os status</a>.




### Callbacks relacionados
Evento | Descrição
--------- | -------
<a href="/v1/docs/callbacks#processo-encontrado-no-monitoramento-do-site-do-tribunal">update_status</a> | Quando um Monitoramento do site do Tribunal é criado para o tipo UNICO (numeração CNJ do Processo), o Escavador vai procurar pela existência daquele processo nos sistemas dos Tribunais e informar se encontrou ou não o processo.
<a href="/v1/docs/callbacks#novo-andamento-encontrado-no-monitoramento-do-site-do-tribunal">movimentacao_nova</a> | Foi encontrado um novo andamento no Processo no Sistema do Tribunal. Apenas para monitoramento do tipo UNICO (numeração CNJ do Processo).
<a href="/v1/docs/callbacks#nova-informao-da-capa-processo-encontrada-no-monitoramento-do-site-do-tribunal">processo_dado_novo</a> | Foi encontrada uma nova informação nova na capa do processo. Apenas para monitoramento do tipo UNICO (numeração CNJ do Processo).
<a href="/v1/docs/callbacks#novo-envolvido-encontrado-no-monitoramento-do-site-do-tribunal">envolvido_novo</a> | Foi encontrado um novo envolvido no processo. Apenas para monitoramento do tipo UNICO (numeração CNJ do Processo).
<a href="/v1/docs/callbacks#novo-processo-encontrado-no-monitoramento-do-site-do-tribunal">novo_processo_envolvido</a> | Foi encontrado um novo processo para o monitoramento de nome ou documento. Apenas para monitoramentos do tipo NUMDOC ou NOME.

- Requer autenticação: sim

#### Body Params

- `tipo` (string, required): O tipo do valor a ser monitorado. <br/><b>Valores permitidos</b>:<br>`UNICO`:Numeração CNJ do processo. O monitoramento vai procurar por andamentos novos.<br>`NUMDOC`: CPF, CNPJ ou OAB. O monitoramento vai procurar processos novos relacionados a esse documento. <br>`NOME`: Nome do envolvido no processo. O monitoramento vai procurar processos novos relacionados a esse nome<br>`ALTERNATIVO`: Numeração alternativa do processo para o STF ou STJ.
- `estado_oab` (string, optional): Estado da OAB. Se o valor enviado é um número de oab, <b>é necessário informar o estado (UF) da oab na requisição</b>
- `valor` (string, required): O número de processo, nome ou documento a ser monitorado.
- `tribunal` (string, required): Tribunal a ser pesquisado, opcional para tipo=`UNICO`. Passar outro tribunal para o tipo=`UNICO`, vai forçar o monitoramento no tribunal informado. Consulte os <a href="/v1/docs/tribunais-e-orgaos-administrativos#retornar-sistemas-dos-tribunais-disponveis">Tribunais disponíveis</a>.
- `frequencia` (string, optional): Quantidade de dias que o robô vai buscar por atualizações.<br/><b>Valores permitidos</b>:<br>`DIARIA`: De segunda a sexta.<br>`SEMANAL`: 1 vez na semana (O dia é escolhido pelo Escavador). <br>Default: `DIARIA`.
- `tipo_numero` (string, optional): Se `tribunal == STF` é possivel enviar o número de processo no formato de classe e número (Ex: **HC 211509**) passando `tipo_numero == "classe_numero".` <br> Se `tribunal == STJ` é possível enviar o número de processo no formato de número de registro (Ex: **2021/0179885-9**) passando `tipo_numero == "numero_registro"`.

#### Responses

- Status 200
```json
{
    "id": 1,
    "vip": true,
    "monitor": {
        "origens": [
            "TRT-5"
        ],
        "tipo": "UNICO",
        "valor": "0000000-00.0000.0.00.0000",
        "frequencia": "DIARIO",
        "cron": "45 21 * * 1-5",
        "status": "FOUND",
        "incluir_docpub": false,
        "incluir_autos": false
    },
    "created_at": "15/08/2022 16:21:29",
    "frequencia": "DIARIA"
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

## Pessoas

### GET /api/v1/pessoas/{pessoaId}

**Obter pessoa**

Retorna dados relacionados a uma pessoa pelo seu identificador.

- Requer autenticação: sim

#### URL Params

- `pessoaId` (integer, required): Identificador numérico de uma Pessoa.

#### Responses

- Status 200
```json
{
    "id": 1,
    "nome": "Fulano de Tal",
    "lattes_id": "K4431049Z3",
    "resumo": "Possui graduação em LICENCIATURA PLENA EM PEDAGOGIA pela Universidade Federal do Amapá (2003) ....",
    "ultimos_processos": [
        {
            "id": 1,
            "numero_antigo": null,
            "numero_novo": "0000000-00.0000.0.00.0000",
            "is_cnj": 1,
            "enviado_trimon_em": "2022-04-19 09:24:18",
            "created_at": null,
            "updated_at": null,
            "origem_tribunal_id": 13,
            "filtrado_em": null,
            "tipo_envolvido": "AGRAVADO",
            "link": "https://www.escavador.com/processos/5970031/processo-0000000-0000000000000-do-caderno-tribunal-superior-do-trabalho",
            "link_api": "https://api.escavador.com/api/v1/processos/1",
            "data_movimentacoes": "07/12/2012 a 31/01/2013",
            "data_primeira_movimentacao": "07/12/2012",
            "envolvidos_ultima_movimentacao": [
                {
                    "id": 12,
                    "nome": "Viação",
                    "objeto_type": "Instituicao",
                    "pivot_tipo": "AGRAVADO",
                    "pivot_outros": "NAO",
                    "pivot_extra_nome": null,
                    "link": "https://www.escavador.com/sobre/12/viacao",
                    "link_api": "https://api.escavador.com/api/v1/instituicoes/12",
                    "nome_sem_filtro": "Viação",
                    "envolvido_tipo": "Agravado",
                    "envolvido_extra_nome": "",
                    "oab": "",
                    "advogado_de": null
                }
            ]
        }
    ],
    "quantidade_processos": 0,
    "estados_com_mais_processos": [],
    "oabs": [],
    "curriculo_lattes": {
        "lattes_id": "K0000000",
        "pessoa_id": 1,
        "titulo_bolsista": null,
        "resumo": "Possui graduação em LICENCIATURA PLENA EM PEDAGOGIA pela Universidade Federal do Amapá (2003)....",
        "linhas_de_pesquisa": null,
        "ultima_atualizacao": "2017-12-14",
        "areas_de_atuacao": "Grande área: Ciências Humanas / Área: Educação. \nGrande área: Ciências Humanas / Área: Psicologia. \nGrande área: Ciências Humanas / Área: Teologia. \nGrande área: Ciências Humanas / Área: Sociologia. ",
        "nome_em_citacoes": "TAL, B. E. G.",
        "outras_informacoes_relevantes": null,
        "formacoes": [
            {
                "id": 1,
                "ano_inicio": 2015,
                "ano_fim": 2015,
                "tipo": "Especialização em NEUROPSICOPEDAGOGIA CLINICO HOSPITALAR INSTITUCIONAL",
                "titulo": "Titulo",
                "orientador": "John Doe",
                "orientador_id": null,
                "outros_dados": "",
                "instituicao_id": 1,
                "nome_instituicao": null,
                "lattes_id": "K0000000",
                "usuario_id": null,
                "link_instituicao": "https://www.escavador.com/sobre/1/faculdade",
                "nome_instituicao_relacionada": "Faculdade"
            }
        ],
        "pos_doutorados": [],
        "formacoes_complementares": [
            {
                "id": 1,
                "descricao": "Trabalhando",
                "ano_inicio": 2017,
                "ano_fim": 2017,
                "lattes_id": "K0000000"
            }
        ],
        "idiomas": [
            {
                "id": 6,
                "nome": "Francês",
                "bandeira": "France.png",
                "pivot": {
                    "lattes_id": "K4431049Z3",
                    "idioma_id": 6,
                    "descricao": "Compreende Razoavelmente, Fala Razoavelmente, Lê Razoavelmente, Escreve Pouco."
                }
            }
        ],
        "organizacoes_eventos": [
            {
                "id": 11445263,
                "descricao": "TAL, B. E. G. . SEMANA DA ACADEMIA. 2015. (Outro).",
                "lattes_id": "K00000000"
            }
        ],
        "participacoes_eventos": [
            {
                "id": 1,
                "descricao": "2º SEMINÁRIO",
                "lattes_id": "K00000000"
            }
        ],
        "participacoes_bancas": [],
        "orientacoes": [],
        "producoes_bibliograficas": [
            {
                "id": 1,
                "ano": null,
                "autor": null,
                "descricao": "TAL, B. E. G. . BIBLIOGRAFIA SOBRE FULANO DE TAL",
                "lattes_id": "K00000000"
            }
        ],
        "outras_producoes": [],
        "projetos": [],
        "projetos_desenvolvimento": [],
        "premios": [
            {
                "id": 1,
                "ano": 2017,
                "descricao": "3º lugar em desempenho",
                "lattes_id": "K00000000"
            }
        ],
        "endereco_profissional": null,
        "atuacoes_profissionais": [
            {
                "id": 1,
                "ano_inicio": 2011,
                "ano_fim": 2016,
                "titulo": null,
                "outras_informacoes": null,
                "descricao": "CARGO",
                "instituicao_id": 1,
                "nome_instituicao": null,
                "lattes_id": "K000000000",
                "usuario_id": null,
                "link_instituicao": "https://www.escavador.com/sobre/1/camara",
                "nome_instituicao_relacionada": "Camara"
            }
        ]
    },
    "comissoes_julgadoras": [],
    "orientadores": [],
    "link": "https://www.escavador.com/sobre/1/fulano-de-tal",
    "link_api": "https://api.escavador.com/api/v1/pessoas/1",
    "created_at": null
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### GET /api/v1/pessoas/{pessoaId}/processos

**Processos de uma Pessoa**

Retorna os processos de uma pessoa que saíram em Diários Oficiais e estão no Escavador.

- Requer autenticação: sim

#### URL Params

- `pessoaId` (integer, required): Identificador numérico de uma Pessoa.

#### Query Params

- `limit` (integer, optional): Limita o número dos registros listados. Caso não seja enviado, aplica-se o limite padrão de 20 registros. Limite máximo: 60.
- `page` (integer, optional): Número da página, respeitando o limite informado.

#### Responses

- Status 200
```json
{
    "paginator": {
        "total": 1,
        "total_pages": 1,
        "current_page": 1,
        "per_page": 60
    },
    "links": {
        "prev": null,
        "next": null
    },
    "items": [
        {
            "id": 1,
            "numero_antigo": null,
            "numero_novo": "0000000-00.0000.0.00.0000",
            "is_cnj": 1,
            "enviado_trimon_em": "2022-04-19 09:24:18",
            "created_at": null,
            "updated_at": null,
            "origem_tribunal_id": 13,
            "filtrado_em": null,
            "enviado_nursery_em": null,
            "tipo_envolvido": "AGRAVADO",
            "diario_sigla": "TST",
            "diario_nome": "Tribunal Superior do Trabalho (Brasil)",
            "estado": "Brasil-TST",
            "data_movimentacoes": "07/12/2012 a 31/01/2013",
            "quantidade_movimentacoes": 3,
            "envolvidos_ultima_movimentacao": [
                {
                    "id": 1,
                    "nome": "Viação",
                    "objeto_type": "Instituicao",
                    "pivot_tipo": "AGRAVADO",
                    "pivot_outros": "NAO",
                    "pivot_extra_nome": null,
                    "link": "https://www.escavador.com/sobre/1/viacao",
                    "link_api": "https://api.escavador.com/api/v1/instituicoes/1",
                    "nome_sem_filtro": "Viação",
                    "envolvido_tipo": "Agravado",
                    "envolvido_extra_nome": "",
                    "oab": "",
                    "advogado_de": null
                }
            ],
            "tipo_ultima_movimentacao": "Pauta de Julgamento",
            "link": "https://www.escavador.com/processos/5970031/processo-0000000-0000000000000-do-caderno-tribunal-superior-do-trabalho",
            "link_api": "https://api.escavador.com/api/v1/processos/1",
            "url": {
                "id": 1,
                "slug": "processo-0000000-0000000000000-do-caderno-tribunal-superior-do-trabalho",
                "objeto_type": "Processo",
                "objeto_id": 1,
                "redirect": null,
                "created_at": null,
                "anuncio_ocultado_em": null
            }
        }
    ]
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

## Instituições

### GET /api/v1/instituicoes/{instituicaoId}

**Obter Instituição**

Retorna dados relacionados a uma instituição pelo seu identificador.

- Requer autenticação: sim

#### URL Params

- `instituicaoId` (integer, required): Identificador numérico de uma Instituição.

#### Responses

- Status 200
```json
{
    "id": 1,
    "nome": "Instituto Brasileiro",
    "sigla": "IB",
    "pais": "Brasil",
    "ultimos_processos": [
        {
            "id": 50234,
            "numero_antigo": null,
            "numero_novo": "0000000-00.0000.0.0.0001",
            "is_cnj": 1,
            "enviado_trimon_em": "2022-04-19 18:55:35",
            "created_at": null,
            "updated_at": null,
            "origem_tribunal_id": 21,
            "filtrado_em": null,
            "tipo_envolvido": "AGRAVADO | RECORRIDO | RECLAMADO",
            "link": "https://www.escavador.com/processos/50234/processo-0000000-0000000000001-do-tribunal-superior-do-trabalho",
            "link_api": "https://api.escavador.com/api/v1/processos/1",
            "data_movimentacoes": "17/10/2013 a 09/03/2022",
            "data_primeira_movimentacao": "17/10/2013",
            "envolvidos_ultima_movimentacao": [
                {
                    "id": 1,
                    "nome": "João Silva",
                    "objeto_type": "Pessoa",
                    "pivot_tipo": "ADVOGADO",
                    "pivot_outros": "NAO",
                    "pivot_extra_nome": null,
                    "link": "https://www.escavador.com/sobre/1/joao-silva",
                    "link_api": "https://api.escavador.com/api/v1/pessoas/1",
                    "nome_sem_filtro": "João Silva",
                    "envolvido_tipo": "Advogado",
                    "envolvido_extra_nome": "",
                    "oab": "12345/DF",
                    "advogado_de": null
                },
                {
                    "id": 2,
                    "nome": "Atelie da Maria",
                    "objeto_type": "Instituicao",
                    "pivot_tipo": "RECLAMADO",
                    "pivot_outros": "NAO",
                    "pivot_extra_nome": null,
                    "link": "https://www.escavador.com/sobre/2/atelie-da-maria",
                    "link_api": "https://api.escavador.com/api/v1/instituicoes/2",
                    "nome_sem_filtro": "Atelie da Maria",
                    "envolvido_tipo": "Reclamado",
                    "envolvido_extra_nome": "",
                    "oab": "",
                    "advogado_de": null
                }
            ],
            "url": {
                "id": 90709623,
                "slug": "processo-0000757-9420135100014-do-tribunal-superior-do-trabalho",
                "objeto_type": "Processo",
                "objeto_id": 50234,
                "redirect": null,
                "anuncio_ocultado_em": null
            }
        }
    ],
    "quantidade_processos": 321,
    "estados_com_mais_processos": [
        {
            "estado": "São Paulo",
            "qtd": 100
        }
    ],
    "link": "https://www.escavador.com/sobre/1/instituto-brasileiro",
    "link_api": "https://api.escavador.com/api/v1/instituicoes/1",
    "created_at": null
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### GET /api/v1/instituicoes/{instituicaoId}/processos

**Processos de uma Instituição**

Retorna os processos de uma instituição que saíram em Diários Oficiais e estão no Escavador.

- Requer autenticação: sim

#### URL Params

- `instituicaoId` (integer, required): Identificador numérico de uma Instituição.

#### Query Params

- `limit` (integer, optional): Limita o número dos registros listados. Caso não seja enviado, aplica-se o limite padrão de 20 registros. Limite máximo: 60.
- `page` (integer, optional): Número da página, respeitando o limite informado.

#### Responses

- Status 200
```json
{
    "paginator": {
        "total": 321,
        "total_pages": 17,
        "current_page": 1,
        "per_page": 20
    },
    "links": {
        "prev": null,
        "next": "https://api.escavador.com/api/v1/instituicoes/1/processos?page=2"
    },
    "items": [
        {
            "id": 1,
            "numero_antigo": null,
            "numero_novo": "0000000-00.0000.0.00.0000",
            "is_cnj": 1,
            "enviado_trimon_em": "2022-03-17 22:07:05",
            "created_at": null,
            "updated_at": null,
            "origem_tribunal_id": 102,
            "filtrado_em": null,
            "tipo_envolvido": "",
            "diario_sigla": "DJSP",
            "diario_nome": "Diário de Justiça do Estado de São Paulo (São Paulo)",
            "estado": "SP",
            "data_movimentacoes": "01/03/2017 a 10/03/2017",
            "quantidade_movimentacoes": 2,
            "envolvidos_ultima_movimentacao": [
                {
                    "id": 10,
                    "nome": "UB - Universidade Brasileira",
                    "objeto_type": "Instituicao",
                    "pivot_tipo": "AGRAVADO",
                    "pivot_outros": "NAO",
                    "pivot_extra_nome": null,
                    "link": "https://www.escavador.com/sobre/10/ub-universidade-brasileira",
                    "link_api": "https://api.escavador.com/api/v1/instituicoes/10",
                    "nome_sem_filtro": "UB - Universidade Brasileira",
                    "envolvido_tipo": "Agravado",
                    "envolvido_extra_nome": "",
                    "oab": "",
                    "advogado_de": null
                },
                {
                    "id": 11,
                    "nome": "Katia Rosa Machado de Oliveira",
                    "objeto_type": "Pessoa",
                    "pivot_tipo": "ADVOGADO",
                    "pivot_outros": "NAO",
                    "pivot_extra_nome": null,
                    "link": "https://www.escavador.com/sobre/12/katia-machado-",
                    "link_api": "https://api.escavador.com/api/v1/pessoas/12",
                    "nome_sem_filtro": "Katia Machado",
                    "envolvido_tipo": "Advogado",
                    "envolvido_extra_nome": "",
                    "oab": "1234/SP",
                    "advogado_de": null
                },
                {
                    "id": 12,
                    "nome": "Luiza Maia Fugimoto",
                    "objeto_type": "Pessoa",
                    "pivot_tipo": "AGRAVANTE",
                    "pivot_outros": "NAO",
                    "pivot_extra_nome": null,
                    "link": "https://www.escavador.com/sobre/12/luiza-fugimoto",
                    "link_api": "https://api.escavador.com/api/v1/pessoas/12",
                    "nome_sem_filtro": "Luiza Maia Fugimoto",
                    "envolvido_tipo": "Agravante",
                    "envolvido_extra_nome": "",
                    "oab": "",
                    "advogado_de": null
                }
            ],
            "tipo_ultima_movimentacao": "Agravo de Instrumento",
            "link": "https://www.escavador.com/processos/1/processo-0000000-0000000000000-do-diario-de-justica-do-estado-de-sao-paulo",
            "link_api": "https://api.escavador.com/api/v1/processos/1",
            "url": {
                "id": 1,
                "slug": "processo-0000000-0000000000000-do-diario-de-justica-do-estado-de-sao-paulo",
                "objeto_type": "Processo",
                "objeto_id": 1,
                "redirect": null,
                "anuncio_ocultado_em": null
            }
        },
        {
            "id": 2,
            "numero_antigo": "0000.00.00.000000-0",
            "numero_novo": "9999999-99.9999.9.99.9999",
            "is_cnj": 1,
            "enviado_trimon_em": "2022-03-17 22:07:05",
            "created_at": null,
            "updated_at": null,
            "origem_tribunal_id": 102,
            "filtrado_em": null,
            "tipo_envolvido": "",
            "diario_sigla": "DJSP",
            "diario_nome": "Diário de Justiça do Estado de São Paulo (São Paulo)",
            "estado": "SP",
            "data_movimentacoes": "01/03/2017 a 10/03/2017",
            "quantidade_movimentacoes": 2,
            "envolvidos_ultima_movimentacao": [
                {
                    "id": 10,
                    "nome": "UB - Universidade Brasileira",
                    "objeto_type": "Instituicao",
                    "pivot_tipo": "AGRAVADO",
                    "pivot_outros": "NAO",
                    "pivot_extra_nome": null,
                    "link": "https://www.escavador.com/sobre/10/ub-universidade-brasileira",
                    "link_api": "https://api.escavador.com/api/v1/instituicoes/10",
                    "nome_sem_filtro": "UB - Universidade Brasileira",
                    "envolvido_tipo": "Agravado",
                    "envolvido_extra_nome": "",
                    "oab": "",
                    "advogado_de": null
                },
                {
                    "id": 11,
                    "nome": "Katia Rosa Machado de Oliveira",
                    "objeto_type": "Pessoa",
                    "pivot_tipo": "ADVOGADO",
                    "pivot_outros": "NAO",
                    "pivot_extra_nome": null,
                    "link": "https://www.escavador.com/sobre/12/katia-machado-",
                    "link_api": "https://api.escavador.com/api/v1/pessoas/12",
                    "nome_sem_filtro": "Katia Machado",
                    "envolvido_tipo": "Advogado",
                    "envolvido_extra_nome": "",
                    "oab": "1234/SP",
                    "advogado_de": null
                },
                {
                    "id": 12,
                    "nome": "Luiza Fugimoto",
                    "objeto_type": "Pessoa",
                    "pivot_tipo": "AGRAVANTE",
                    "pivot_outros": "NAO",
                    "pivot_extra_nome": null,
                    "link": "https://www.escavador.com/sobre/12/luiza-fugimoto",
                    "link_api": "https://api.escavador.com/api/v1/pessoas/12",
                    "nome_sem_filtro": "Luiza Fugimoto",
                    "envolvido_tipo": "Agravante",
                    "envolvido_extra_nome": "",
                    "oab": "",
                    "advogado_de": null
                }
            ],
            "tipo_ultima_movimentacao": "Agravo de Instrumento",
            "link": "https://www.escavador.com/processos/1/processo-9999999-9999999999999-do-diario-de-justica-do-estado-de-sao-paulo",
            "link_api": "https://api.escavador.com/api/v1/processos/2",
            "url": {
                "id": 1,
                "slug": "processo-9999999-9999999999999-do-diario-de-justica-do-estado-de-sao-paulo",
                "objeto_type": "Processo",
                "objeto_id": 2,
                "redirect": null,
                "anuncio_ocultado_em": null
            }
        }
    ]
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### GET /api/v1/instituicoes/{instituicaoId}/pessoas

**Pessoas de uma Instituição**

Retorna as pessoas que estão associadas a uma instituição.

- Requer autenticação: sim

#### URL Params

- `instituicaoId` (integer, required): Identificador numérico de uma Instituição.

#### Query Params

- `limit` (integer, optional): Limita o número dos registros listados. Caso não seja enviado, aplica-se o limite padrão de 20 registros. Limite máximo: 60.
- `page` (integer, optional): Número da página, respeitando o limite informado.

#### Responses

- Status 200
```json
{
    "paginator": {
        "total": 2,
        "total_pages": 1,
        "current_page": 1,
        "per_page": 20
    },
    "links": {
        "prev": null,
        "next": null
    },
    "items": [
        {
            "id": 1,
            "formacao": {
                "usuario_id": null,
                "lattes_id": "ABC56100Y1",
                "tipo": "formacao",
                "ano_inicio": 2012,
                "ano_fim": 2014
            },
            "nome": "Maria de Souza",
            "link": "https://www.escavador.com/sobre/1/maria-de-souza",
            "link_api": "https://api.escavador.com/api/v1/pessoas/1"
        },
        {
            "id": 2,
            "formacao": {
                "usuario_id": null,
                "lattes_id": "ABC97051Z1",
                "tipo": "formacao",
                "ano_inicio": 2017,
                "ano_fim": null
            },
            "nome": "João José",
            "link": "https://www.escavador.com/sobre/2/joao-jose",
            "link_api": "https://api.escavador.com/api/v1/pessoas/2"
        }
    ]
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

## Processos

### GET /api/v1/processos/{processoId}

**Retornar um processo**

Retorna um processo pelo seu identificador no Escavador.

- Requer autenticação: sim

#### URL Params

- `processo` (integer, required): Identificador numérico do processo no Escavador.
- `processoId` (string, required): 

#### Responses

- Status 200
```json
{
    "id": 1,
    "numero_antigo": null,
    "numero_novo": "0000000-00.0000.0.00.0000",
    "is_cnj": 1,
    "enviado_trimon_em": "2022-01-23 12:29:21",
    "created_at": null,
    "updated_at": null,
    "origem_tribunal_id": 16,
    "filtrado_em": null,
    "enviado_nursery_em": null,
    "diario_sigla": "TRT-5",
    "diario_nome": "TRT da 5ª Região (Bahia)",
    "estado": "BA",
    "data_movimentacoes": "30/01/2015 a 24/05/2022",
    "quantidade_movimentacoes": 27,
    "ultimas_movimentacoes_resumo": [
        {
            "id": 1,
            "data": "2022-05-24T00:00:00.000000Z",
            "link_api": "https://api.escavador.com/api/v1/movimentacoes/1",
            "envolvidos_resumo": [
                {
                    "id": 1,
                    "nome": "Elba",
                    "objeto_type": "Pessoa",
                    "pivot_tipo": "ADVOGADO",
                    "pivot_outros": "NAO",
                    "pivot_extra_nome": null,
                    "link": "https://www.escavador.com/sobre/9923641/elba",
                    "link_api": "https://api.escavador.com/api/v1/pessoas/1",
                    "nome_sem_filtro": "Elba",
                    "envolvido_tipo": "Advogado",
                    "envolvido_extra_nome": "",
                    "oab": "00000/BA",
                    "advogado_de": null
                }
            ],
            "quantidade_envolvidos": 7,
            "conteudo_resumo": "Conteudo .... "
        }
    ],
    "envolvidos_ultima_movimentacao": [
        {
            "id": 47056,
            "nome": "Elba",
            "objeto_type": "Pessoa",
            "pivot_tipo": "ADVOGADO",
            "pivot_outros": "NAO",
            "pivot_extra_nome": null,
            "link": "https://www.escavador.com/sobre/1/elba",
            "link_api": "https://api.escavador.com/api/v1/pessoas/1",
            "nome_sem_filtro": "Elba",
            "envolvido_tipo": "Advogado",
            "envolvido_extra_nome": "",
            "oab": "00000/BA",
            "advogado_de": null
        }
    ],
    "tipo_ultima_movimentacao": "Ação Trabalhista - Rito Ordinário"
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### GET /api/v1/processos/{processoId}/movimentacoes

**Movimentações de um processo que saíram em Diários Oficiais**

Retorna as movimentações de um Processo pelo identificador do processo no Escavador.

- Requer autenticação: sim

#### URL Params

- `processoId` (integer, required): Identificador numérico de um processo no Escavador.

#### Query Params

- `limit` (integer, optional): Limita o número dos registros listados. Caso não seja enviado, aplica-se o limite padrão de 20 registros. Limite máximo: 60.
- `page` (integer, optional): Número da página, respeitando o limite informado.

#### Responses

- Status 200
```json
{
    "items": [
        {
            "id": 1,
            "secao": "26<sup>a</sup>. Vara do Trabalho de Salvador",
            "texto_categoria": "<p class=\"content-small \">Rela&#231;&#227;o emitida em 29/01/2015 16:10:20</p><br><p class=\"content-small \">Ficam os Senhores Advogados abaixo mencionados notificados dos</p><br><p class=\"content-small \">ATOS praticados nos processos aos quais est&#227;o vinculados:</p>",
            "diario_oficial_id": 140,
            "processo_id": 1,
            "pagina": null,
            "complemento": null,
            "tipo": "Notificação DJ",
            "subtipo": null,
            "conteudo": "<p class=\"content-small \">-    RECEBER CR&#201;DITO EM 05 DIAS EVITANDO-SE<br>ARQUIVAMENTO. - ADV AUTOR: CARLOS BRUNO CAMPOS<br>ROCHA BOMFIM.</p>",
            "snippet": "- RECEBER CR&#201;DITO EM 05 DIAS EVITANDO-SE ARQUIVAMENTO. - ADV AUTOR: CARLOS BRUNO CAMPOS ROCHA BOMFIM.",
            "data": "2015-01-30",
            "letras_processo": "RTOrd",
            "subprocesso": null,
            "created_at": null,
            "updated_at": null,
            "descricao_pequena": "Movimentação do processo RTOrd-0000000-00.0000.0.00.0000",
            "diario_oficial": "30/01/2015 | TRT-5 - Judiciário",
            "estado": "Bahia",
            "envolvidos": [
                {
                    "id": 2,
                    "nome": "Fulano de Tal",
                    "objeto_type": "Pessoa",
                    "pivot_tipo": "ADVOGADO",
                    "pivot_outros": "NAO",
                    "pivot_extra_nome": null,
                    "link": "https://www.escavador.com/sobre/1/fulano-de-tal",
                    "link_api": "https://api.escavador.com/api/v1/pessoas/1",
                    "nome_sem_filtro": "Fulano de Tal",
                    "envolvido_tipo": "Advogado",
                    "envolvido_extra_nome": "",
                    "oab": "00000/BA",
                    "advogado_de": 62
                }
            ],
            "link": "https://www.escavador.com/processos/125060/processo-0000000-0000000000000-do-trt-da-5-regiao?ano=2015#movimentacao-132229",
            "link_api": "https://api.escavador.com/api/v1/movimentacoes/1",
            "link_pdf": null,
            "link_pdf_api": null,
            "data_formatada": "30/01/2015",
            "objeto_type": "Movimentacao",
            "people_filtered": [],
            "diario": {
                "id": 140,
                "origem_id": 8,
                "plugin": "TRT",
                "edicao": "1656/2015",
                "tipo": "Judiciário",
                "tipo_url": "J",
                "data": "2015-01-30",
                "data_disponibilizacao": null,
                "data_publicacao": "2015-01-30",
                "tipo_exibicao": "MOVIMENTACOES",
                "qtd_paginas": null,
                "created_at": "2015-10-14 15:02:24",
                "descricao": "TRT da 5ª Região",
                "objeto_type": "Diario",
                "origem": {
                    "id": 8,
                    "nome": "TRT da 5ª Região",
                    "sigla": "TRT-5",
                    "tipo": null,
                    "db": "JURIDICO",
                    "estado": "BA",
                    "competencia": "Bahia",
                    "categoria": "Tribunais Regionais do Trabalho",
                    "created_at": "2015-10-14T15:02:24.000000Z",
                    "updated_at": "2015-10-14T15:02:24.000000Z"
                }
            }
        }
    ],
    "links": {
        "prev": null,
        "next": null,
        "first": "https://api.escavador.com/api/v1/processos/1/movimentacoes?page=1",
        "last": "https://api.escavador.com/api/v1/processos/1/movimentacoes?page=1"
    },
    "paginator": {
        "current_page": 1,
        "per_page": 20,
        "total": 13,
        "total_pages": 1
    }
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### GET /api/v1/oab/{estado}/{numero}/processos

**Buscar processos dos Diários Oficiais por OAB**

Busca processos que estão nos Diários Oficiais do Escavador que estão relacionados ao OAB informado.
Como essa busca é feita em cima  de dados extraídos das páginas dos Diários Oficiais, não é garantido vir todos os processos da OAB informada.

- Requer autenticação: sim

#### URL Params

- `estado` (string, required): Sigla do Estado da OAB.
- `numero` (string, required): Número da OAB.

#### Query Params

- `page` (integer, optional): Número da página, respeitando o limite informado.

#### Responses

- Status 200
```json
{
    "paginator": {
        "total": 404,
        "total_pages": 21,
        "current_page": 1,
        "per_page": 20
    },
    "links": {
        "prev": null,
        "next": "https://api.escavador.com/api/v1/oab/BA/23267/processos?page=2"
    },
    "items": [
        {
            "id": 1,
            "numero_antigo": "00000/0000-000-00-00.0",
            "numero_novo": "0000000-00.0000.0.00.0000",
            "is_cnj": 1,
            "enviado_trimon_em": "2022-01-23 12:29:21",
            "created_at": null,
            "updated_at": null,
            "origem_tribunal_id": 16,
            "filtrado_em": null,
            "enviado_nursery_em": null,
            "tipo_envolvido": "ADVOGADO",
            "quantidade_movimentacoes_envolvido_faz_parte": 7,
            "taxa_movimentacoes_envolvido_faz_parte": 1,
            "diario_sigla": "TRT-5",
            "diario_nome": "TRT da 5ª Região (Bahia)",
            "estado": "BA",
            "data_movimentacoes": "17/01/2013 a 30/01/2015",
            "quantidade_movimentacoes": 7,
            "envolvidos_ultima_movimentacao": [
                {
                    "id": 2,
                    "nome": "Fulano de tal",
                    "objeto_type": "Pessoa",
                    "pivot_tipo": "RECLAMANTE",
                    "pivot_outros": "NAO",
                    "pivot_extra_nome": null,
                    "link": "https://www.escavador.com/sobre/1/fulano-de-tal",
                    "link_api": "https://api.escavador.com/api/v1/pessoas/1",
                    "nome_sem_filtro": "Fulano de Tal",
                    "envolvido_tipo": "Reclamante",
                    "envolvido_extra_nome": "",
                    "oab": "00000/BA",
                    "advogado_de": null
                },
                {
                    "id": 3,
                    "nome": "Fulana de Tal",
                    "objeto_type": "Pessoa",
                    "pivot_tipo": "ADVOGADO",
                    "pivot_outros": "NAO",
                    "pivot_extra_nome": null,
                    "link": "https://www.escavador.com/sobre/2/fulana-de-tal",
                    "link_api": "https://api.escavador.com/api/v1/pessoas/2",
                    "nome_sem_filtro": "Fulana de Tal",
                    "envolvido_tipo": "Advogado",
                    "envolvido_extra_nome": "",
                    "oab": "00000/BA",
                    "advogado_de": 31
                }
            ],
            "link": "https://www.escavador.com/processos/1/processo-0000000-0000000000090-do-trt-da-5-regiao",
            "link_api": "https://api.escavador.com/api/v1/processos/1",
            "url": {
                "id": 1,
                "slug": "processo-0000000-0000000000000-do-trt-da-5-regiao",
                "objeto_type": "Processo",
                "objeto_id": 1,
                "redirect": null,
                "created_at": "2022-01-23 12:29:21",
                "anuncio_ocultado_em": null
            }
        },
        {
            "id": 2,
            "numero_antigo": "00000/0000-000-00-00.0",
            "numero_novo": "0000000-00.0000.0.00.0000",
            "is_cnj": 1,
            "enviado_trimon_em": "2022-01-23 12:29:21",
            "created_at": null,
            "updated_at": null,
            "origem_tribunal_id": 16,
            "filtrado_em": null,
            "enviado_nursery_em": null,
            "tipo_envolvido": "ADVOGADO | ADVOGADO | ADVOGADO",
            "quantidade_movimentacoes_envolvido_faz_parte": 13,
            "taxa_movimentacoes_envolvido_faz_parte": 1,
            "diario_sigla": "TRT-5",
            "diario_nome": "TRT da 5ª Região (Bahia)",
            "estado": "BA",
            "data_movimentacoes": "14/11/2012 a 30/01/2015",
            "quantidade_movimentacoes": 13,
            "envolvidos_ultima_movimentacao": [
                {
                    "id": 2,
                    "nome": "Fulano de tal",
                    "objeto_type": "Pessoa",
                    "pivot_tipo": "RECLAMANTE",
                    "pivot_outros": "NAO",
                    "pivot_extra_nome": null,
                    "link": "https://www.escavador.com/sobre/1/fulano-de-tal",
                    "link_api": "https://api.escavador.com/api/v1/pessoas/1",
                    "nome_sem_filtro": "Fulano de Tal",
                    "envolvido_tipo": "Reclamante",
                    "envolvido_extra_nome": "",
                    "oab": "00000/BA",
                    "advogado_de": null
                },
                {
                    "id": 3,
                    "nome": "Fulana de Tal",
                    "objeto_type": "Pessoa",
                    "pivot_tipo": "ADVOGADO",
                    "pivot_outros": "NAO",
                    "pivot_extra_nome": null,
                    "link": "https://www.escavador.com/sobre/2/fulana-de-tal",
                    "link_api": "https://api.escavador.com/api/v1/pessoas/2",
                    "nome_sem_filtro": "Fulana de Tal",
                    "envolvido_tipo": "Advogado",
                    "envolvido_extra_nome": "",
                    "oab": "00000/BA",
                    "advogado_de": 31
                }
            ],
            "link": "https://www.escavador.com/processos/125060/processo-0122300-0820095050026-do-trt-da-5-regiao",
            "link_api": "https://api.escavador.com/api/v1/processos/125060",
            "url": {
                "id": 90784449,
                "slug": "processo-0122300-0820095050026-do-trt-da-5-regiao",
                "objeto_type": "Processo",
                "objeto_id": 125060,
                "redirect": null,
                "created_at": "2022-01-23 12:29:21",
                "anuncio_ocultado_em": null
            }
        }
    ]
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### GET /api/v1/processos/numero/{numero}

**Buscar processos dos Diários Oficiais por número**

Busca processos que estão nos Diários Oficiais do Escavador e contenham o número único informado.

- Requer autenticação: sim

#### URL Params

- `numero` (string, required): Número único do processo.

#### Query Params

- `match_exato` (boolean, optional): Se match_exato == 1, a busca será feita pelo número inteiro do processo pesquisado. Default: 0.

#### Responses

- Status 200
```json
[
    {
        "id": 1,
        "numero_antigo": null,
        "numero_novo": "0000000-00.0000.0.00.0000",
        "is_cnj": 1,
        "enviado_trimon_em": "2022-01-11 20:33:54",
        "created_at": "2018-10-31 06:29:00",
        "updated_at": "2022-08-09 09:00:22",
        "origem_tribunal_id": 16,
        "filtrado_em": null,
        "enviado_nursery_em": null,
        "diario_sigla": "TRT-5",
        "diario_nome": "TRT da 5ª Região (Bahia)",
        "estado": "BA",
        "data_movimentacoes": "30/10/2018 a 08/08/2022",
        "quantidade_movimentacoes": 20,
        "ultimas_movimentacoes_resumo": [
            {
                "id": 1,
                "data": "2022-08-08T00:00:00.000000Z",
                "link_api": "https://api.escavador.com/api/v1/movimentacoes/1",
                "envolvidos_resumo": [
                    {
                        "id": 1,
                        "nome": "Fulano de Tal",
                        "objeto_type": "Pessoa",
                        "pivot_tipo": "ADVOGADO",
                        "pivot_outros": "NAO",
                        "pivot_extra_nome": null,
                        "link": "https://www.escavador.com/sobre/1/fulano-de-tal",
                        "link_api": "https://api.escavador.com/api/v1/pessoas/1",
                        "nome_sem_filtro": "Fulano de Tal",
                        "envolvido_tipo": "Advogado",
                        "envolvido_extra_nome": "",
                        "oab": "00000/BA",
                        "advogado_de": null
                    }
                ],
                "quantidade_envolvidos": 9,
                "conteudo_resumo": "Conteudo "
            }
        ]
    }
]
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### GET /api/v1/processos/{processoId}/envolvidos

**Envolvidos de um Processo que saíram em Diários Oficiais**

Retorna os envolvidos de um Processo pelo identificador do processo no Escavador.

- Requer autenticação: sim

#### URL Params

- `processoId` (integer, required): Identificador numérico de um Processo.

#### Query Params

- `limit` (integer, optional): Limita o número dos registros listados. Caso não seja enviado, aplica-se o limite padrão de 20 registros. Limite máximo: 60.
- `page` (integer, optional): Número da página, respeitando o limite informado.

#### Responses

- Status 200
```json
{
    "paginator": {
        "total": 3,
        "total_pages": 1,
        "current_page": 1,
        "per_page": 20
    },
    "links": {
        "prev": null,
        "next": null
    },
    "items": [
        {
            "id": 2,
            "nome": "Edilson Batista",
            "objeto_type": "Pessoa",
            "link": "https://www.escavador.com/sobre/6/edilson-batista",
            "link_api": "https://api.escavador.com/api/v1/pessoas/6",
            "nome_sem_filtro": "Edilson Batista",
            "envolvido_tipo": "Autor",
            "envolvido_extra_nome": "",
            "oab": "",
            "advogado_de": null
        },
        {
            "id": 5,
            "nome": "Empresa de Refrigerantes - Me",
            "objeto_type": "Instituicao",
            "link": "https://www.escavador.com/sobre/3/empresa-de-refrigerantes-me",
            "link_api": "https://api.escavador.com/api/v1/instituicoes/3",
            "nome_sem_filtro": "Empresa de Refrigerantes - Me",
            "envolvido_tipo": "Réu",
            "envolvido_extra_nome": "",
            "oab": "",
            "advogado_de": null
        },
        {
            "id": 3,
            "nome": "Maria de Souza",
            "objeto_type": "Pessoa",
            "link": "https://www.escavador.com/sobre/8/maria-de-souza",
            "link_api": "https://api.escavador.com/api/v1/pessoas/8",
            "nome_sem_filtro": "Maria de Souza",
            "envolvido_tipo": "Advogado",
            "envolvido_extra_nome": "",
            "oab": "5051/BR",
            "advogado_de": null
        }
    ]
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### POST /api/v1/tribunal/async/lote

**Pesquisar processos no site do tribunal em lote (assíncrono)**

Faz uma busca em todos os tribunais enviados para o tipo de busca escolhido, uma alternativa para a chamadas iguais para diferentes tribunais.
A busca é feita diretamente nos sites dos tribunais, pelos robôs do Escavador.
O tempo de busca é afetado pelo tempo de resposta dos sites dos tribunais, pela presença de captchas e outros fatores.
Como há possibilidade do tempo de resposta ser longo, essa rota funciona de maneira assíncrona.
Após solicitar as informações do processo, caso tenha informado, você irá receber um callback (POST)
como resultado e também um link para consultar o [resultado](/v1/docs/busca-assincrona#resultado-especfico-de-uma-busca-assncrona) através do campo `link_api`.

<aside class="notice"> *<a href="/v1/docs/tribunais-e-orgaos-administrativos#retornar-sistemas-dos-tribunais-disponveis">Consulte os tribunais</a> para saber a disponibilidade para esse tipo de busca.</aside>



#### Callbacks relacionados
Evento | Descrição
--------- | -------
<a href="/v1/docs/callbacks#resultado-da-busca-assincrona-por-oab-no-site-do-tribunal">resultado_busca_oab_async</a> | A busca assíncrona de processos por OAB foi concluída e o usuário marcou a opção de receber por callback.
<a href="/v1/docs/callbacks#resultado-da-busca-assincrona-por-cpf-ou-cnpj-no-site-do-tribunal">resultado_busca_documento_async</a> | A busca assíncrona de processos por CPF ou CNPJ foi concluída e o usuário marcou a opção de receber por callback.
<a href="/v1/docs/callbacks#resultado-da-busca-assincrona-de-nome-do-envolvido-no-site-do-tribunal">resultado_busca_nome_async</a> | A busca assíncrona de processos pelo nome da parte foi concluída e o usuário marcou a opção de receber por callback.

- Requer autenticação: sim

#### Body Params

- `tipo` (string, required): tipo da busca que será realizada, possíveis valores: `busca_por_nome, busca_por_documento, busca_por_oab`
- `tribunais` (array<string>, required): Siglas dos tribunais onde os valores serão buscados.
- `nome` (string, optional): Se o tipo da busca é `busca_por_nome`<b> é necessário informar o nome na requisição </b>
- `numero_documento` (string, optional): Se o tipo da busca é `busca_por_documento` <b>é necessário informar o número do documento na requisição</b>
- `numero_oab` (string, optional): Se o tipo da busca é `busca_por_oab` <b>é necessário informar o número da oab na requisição</b>
- `estado_oab` (string, optional): Se o tipo da busca é `busca_por_oab` <b>é necessário informar o estado (UF) da oab na requisição</b>
- `send_callback` (integer, optional): Se `send_callback == 1`, todas as respostas serão enviadas para a url de callback do usuário, uma alternativa caso não queira ficar consultando o resultado. Default: `0`.

#### Responses

- Status 200
```json
{
    "items": [
        {
            "id": 135,
            "created_at": {
                "date": "2021-10-21 12:50:15.000000",
                "timezone_type": 3,
                "timezone": "UTC"
            },
            "enviar_callback": "NAO",
            "link_api": "http://api.escavador.com/api/v1/async/resultados/135",
            "resposta": null,
            "status": "PENDENTE",
            "motivo_erro": null,
            "status_callback": null,
            "tipo": "BUSCA_POR_NOME",
            "opcoes": null,
            "tribunal": {
                "sigla": "TJSP",
                "nome": "Tribunal de Justiça de São Paulo",
                "busca_processo": 1,
                "busca_nome": 1,
                "busca_oab": 1,
                "busca_documento": 1,
                "disponivel_autos": 0,
                "documentos_publicos": 1,
                "quantidade_creditos_busca_processo": 5,
                "quantidade_creditos_busca_nome": 3,
                "quantidade_creditos_busca_documento": 4,
                "quantidade_creditos_busca_oab": 4
            },
            "valor": "Ronaldo"
        },
        {
            "id": 136,
            "created_at": {
                "date": "2021-10-21 12:50:15.000000",
                "timezone_type": 3,
                "timezone": "UTC"
            },
            "enviar_callback": "NAO",
            "link_api": "http://api.escavador.com/api/v1/async/resultados/136",
            "resposta": null,
            "status": "PENDENTE",
            "motivo_erro": null,
            "status_callback": null,
            "tipo": "BUSCA_POR_NOME",
            "opcoes": null,
            "tribunal": {
                "sigla": "TJBA",
                "nome": "Tribunal de Justiça da Bahia",
                "busca_processo": 1,
                "busca_nome": 1,
                "busca_oab": 0,
                "busca_documento": 1,
                "disponivel_autos": 0,
                "documentos_publicos": 1,
                "quantidade_creditos_busca_processo": 5,
                "quantidade_creditos_busca_nome": 5,
                "quantidade_creditos_busca_documento": 5,
                "quantidade_creditos_busca_oab": null
            },
            "valor": "Ronaldo"
        },
        {
            "id": 137,
            "created_at": {
                "date": "2021-10-21 12:50:15.000000",
                "timezone_type": 3,
                "timezone": "UTC"
            },
            "enviar_callback": "NAO",
            "link_api": "http://api.escavador.com/api/v1/async/resultados/137",
            "resposta": null,
            "status": "PENDENTE",
            "motivo_erro": null,
            "status_callback": null,
            "tipo": "BUSCA_POR_NOME",
            "opcoes": null,
            "tribunal": {
                "sigla": "TJES",
                "nome": "Tribunal de Justiça do Espírito Santo",
                "busca_processo": 1,
                "busca_nome": 1,
                "busca_oab": 1,
                "busca_documento": 0,
                "disponivel_autos": 0,
                "documentos_publicos": 1,
                "quantidade_creditos_busca_processo": 5,
                "quantidade_creditos_busca_nome": null,
                "quantidade_creditos_busca_documento": null,
                "quantidade_creditos_busca_oab": null
            },
            "valor": "Ronaldo"
        },
        {
            "error": "A busca por nome não está disponível em TRF1"
        }
    ]
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### POST /api/v1/processo-tribunal/{numero}/async

**Pesquisar processo no site do tribunal (assíncrono)**

A busca é feita diretamente nos sites dos tribunais, pelos robôs do Escavador.
O tempo de busca é afetado pelo
tempo de resposta dos sites dos tribunais, pela presença de captchas e outros fatores. Como há possibilidade do tempo de resposta
ser longo, essa rota funciona de maneira assíncrona. Após solicitar as informações do processo,
caso tenha informado, você irá receber um callback (POST) como resultado e também  um link para consultar o
[resultado](/v1/docs/busca-assincrona#todos-os-resultados-das-buscas-assncronas) através do campo `link_api`.



### Campos no retorno da API
Parâmetro | Tipo | Descrição
--------- | ------- | -------
id | int | Id do resultado da busca.
numero_processo | string | Numeração do processo.
resposta | string | Informações do processo.
link_api | string | Link para consultar o resultado pela API.
status | string | Status do resultado da busca:<br/><div style="margin-left:15px">`PENDENTE`: As informações do processo ainda estão sendo pesquisadas<br/>`SUCESSO`: As informações do processo já estão disponíveis<br/>`ERRO`: Não conseguiu coletar as informações do processo<br/>`NAO_ENCONTRADO`: Não encontrou o processo</div>

### Campos do processo na resposta
Campo | Tipo | Descrição
--------- | ------- | -------
numero_unico | String | Número único desse processo.
origem | String | Tribunal de onde esse processo foi extraido.
instancias | Object[] | Lista com as informações do processo em cada uma das instâncias do tribunal.
instancias[].instancia | String | Instância a qual esse objeto representa, note que pode haver mais de um objeto contendo todas as informações abaixo em uma determinada instância.
instancias[].segredo | Boolean | Determina se o processo está em segredo de justiça. Em caso afirmativo, as informações em seguida serão nulas ou vazias.
instancias[].numero | String | Número antigo do processo nessa instância.
instancias[].url | String | URL para o local exato de onde as informações dessa instância foram extraidas.
instancias[].assunto | String | Assunto da instância do processo.
instancias[].classe | String | Classe judicial da instância do processo.
instancias[].area | String | Área do direito do processo. Ex.: Cívil, Criminal, Trabalhista e etc.
instancias[].data_distribuicao | String | Data que foi distribuido o processo no tribunal. Possui o formato dd/mm/aaaa.
instancias[].orgao_julgador | String | Orgão julgador da instância do processo.
instancias[].valor_causa | String | Valor da causa nesta instância.
instancias[].sistema | String | Sistema eletronico em que essa instância se encontra.
instancias[].dados | Object[] | Lista de dados arbitrários no cabeçalho dessa instância.
instancias[].dados[].tipo | String | Não assuma que esse campo sempre tem um determinado valor, o mesmo pode mudar a depender do processo e/ou tribunal.
instancias[].dados[].valor | String | Não assuma que esse campo sempre tem um determinado valor, o mesmo pode mudar a depender do processo e/ou tribunal.
instancias[].partes | Object[] | Lista de envolvidos no processo nessa instância.
instancias[].partes[].id | Integer | Indice de referência, usado no campo advogado_de.
instancias[].partes[].tipo | String | Tipo do Envolvido.
instancias[].partes[].nome | String | Nome do Envolvido.
instancias[].partes[].principal | Boolean | Informa se o envolvido é uma parte principal, por padrão vem o valor true caso não encontre essa informação no tribunal.
instancias[].partes[].advogado_de | Integer | Contém o id do envolvido o qual o envolvido atual é o advogado, se o envolvido for uma advogado e o tribunal informar a relação envolvido-advogado.
instancias[].partes[].polo | String | O tipo do polo deste envolvido.
instancias[].documento | Object[] | Documento de identificação do envolvido.
instancias[].documento[].numero | String | Numero do documento de identificação do envolvido.
instancias[].documento[].tipo | String | Tipo do documento de identificação do envolvido. Podendo ser CPF ou CNPJ.
instancias[].documentos_publicos[] | Object[] | Documentos Públicos relacionados ao processo que são retornados quando o parâmetro documentos_publicos é enviado.
instancias[].movimentacoes | Object[] | Lista de movimentações do processo, ordenada na ordem em que a movimentação apareceu no tribunal.
instancias[].movimentacoes[].data | String | Data da movimentação no tribunal. Possui o formato dd/mm/aaaa.
instancias[].movimentacoes[].conteudo | String | Conteudo da movimentação no tribunal. Pode possuir varias linhas sendo separadas por
.
instancias[].audiencias | Object[] | Lista de audiências ocorridas.
instancias[].audiencias[].data | String | Data de uma audiência no tribunal. Possui o formato dd/mm/aaaa.
instancias[].audiencias[].audiencia | String | Tipo da audiência no tribunal.
instancias[].audiencias[].situacao | String | A situação da audiência no tribunal.
instancias[].audiencias[].numero_pessoas | Integer | Numero de pessoas na audiência no tribunal.
instancias[].arquivado | Boolean | Indica se o processo foi arquivado, em certos casos, essa informação pode não ser obtida, retornando NULL
instancias[].data_arquivamento | String | Indica a data em que o processo foi arquivado
instancias[].fisico | Boolean | Indica se o processo é do tipo físico
#### Callbacks relacionados
Evento | Descrição
--------- | -------
<a href="/v1/docs/callbacks#resultado-da-busca-assincrona-do-processo-no-site-do-tribunal">resultado_processo_async</a> | A busca assíncrona do processo foi concluída e o usuário marcou a opção de receber por callback.

- Requer autenticação: sim

#### URL Params

- `processo` (integer, required): Numeração única (CNJ) do processo.
- `numero` (string, required): 

#### Body Params

- `send_callback` (integer, optional): Se `send_callback == 1`, a resposta será enviada para a url de callback do usuário, uma alternativa caso não queira ficar consultando o resultado. Default: 0.
- `wait` (integer, optional): Se `wait == 1`, a requisição irá durar até 1 minuto e caso consiga as informações do processo nesse tempo, a resposta vem de forma síncrona. Caso passe 2 minutos, se não tiver resposta do processo, o fluxo ocorrerá da forma assíncrona. Default: 0.
- `autos` (integer, optional): Se `autos == 1`, o Escavador vai trazer também os documentos dos autos do processo no atributo `documentos_restritos` e é necessário informar usuário e senha ou ter certificado digital cadastrado na API do Escavador Business. **Obs:** Essa opção aumenta o custo da rota. **Importante**: A API Escavador atualmente não possui suporte para acesso a autos em tribunais com a seguinte combinação de autenticação: a) usuário e senha; mais b) um segundo fator/multi fator de autenticação (2FA/MFA). Recomendamos verificar os requisitos de autenticação do tribunal específico para garantir o sucesso da solicitação de busca. Default: 0.
- `documentos_publicos` (integer, optional): Se `documentos_publicos == 1`, o Escavador vai trazer também os documentos públicos do processo no atributo `documentos_publicos` **Obs:** Essa opção aumenta o custo da rota.  Default: 0.
- `usuario` (string, optional): Se `autos == 1`, informe o login do advogado cadastrado no tribunal específico.
- `senha` (string, optional): Se `autos == 1`, informe a senha do advogado cadastrado no tribunal específico. **Obs:** A senha será encriptada, armazenada durante o download dos autos e deletada após o uso.
- `origem` (string, optional): Sigla da origem do processo (Ex: **STJ**, **STF**, **SEEU**, ...). Esse parâmetro serve para forçar a consulta em uma origem diferente do processo. <b>Atenção:</b> Ao utilizar esse parâmetro a consulta será cobrada mesmo que o processo não seja encontrado.
- `tipo_numero` (string, optional): Se `origem == STF` é possivel enviar o número de processo no formato de classe e número (Ex: **HC 211509**) passando `tipo_numero == "classe_numero".` <br> Se `origem == STJ` é possível enviar o número de processo no formato de número de registro (Ex: **2021/0179885-9**) passando `tipo_numero == "numero_registro"`. <br> <b>Atenção:</b> Ao enviar um número do tipo `numero_registro` remova a barra do número! </br> Ex: **2021/0179885-9** deve ser enviado como **20210179885-9**  .
- `dias_ultima_atualizacao` (integer, optional): Caso a gente possua uma versão antiga do processo em nossa base de dados, você pode informar o número de dias desde a última consulta do processo. Se a última atualização do processo for há menos dias que o informado, retornaremos os dados sem precisar consultar os tribunais e a resposta será mais rápida.
- `utilizar_certificado` (integer, optional): Se `utilizar_certificado == 1`, e você possui certificados da OAB registrados no Escavador, é possível utilizá-los para realizar buscas em vez de usar credenciais tradicionais (usuário e senha). Default: 0.
- `certificado_id` (integer, optional): Se `utilizar_certificado == 1`, você pode especificar um certificado registrado para realizar a busca. Se não especificar um, será escolhido aleatoriamente um dos seus certificados.
- `documentos_especificos` (string, optional): Se `autos == 1`, você pode especificar quais documentos deseja receber.<br><code>INICIAIS</code>: Nossos robôs vão baixar somente os documentos da primeira data do processo.

#### Responses

- Status 200
```json
{
    "id": 1,
    "created_at": {
        "date": "2022-08-15 18:16:24",
        "timezone_type": 3,
        "timezone": "UTC"
    },
    "enviar_callback": "SIM",
    "link_api": "https://api.escavador.com/api/v1/async/resultados/1",
    "numero_processo": "0000000-00.0000.0.00.0000",
    "resposta": null,
    "status": "PENDENTE",
    "motivo_erro": null,
    "status_callback": null,
    "tipo": "BUSCA_PROCESSO",
    "opcoes": null,
    "tribunal": {
        "sigla": "TRT-5",
        "nome": "TRT da 5ª Região",
        "busca_processo": 1,
        "busca_nome": 0,
        "busca_oab": 0,
        "busca_documento": 1,
        "disponivel_autos": 1,
        "documentos_publicos": 1,
        "quantidade_creditos_busca_processo": 5,
        "quantidade_creditos_busca_nome": 7,
        "quantidade_creditos_busca_documento": 7,
        "quantidade_creditos_busca_oab": 7
    },
    "valor": "0000000-00.0000.0.00.0000"
}
```

- Status 200
```json
{
    "id": 1,
    "created_at": {
        "date": "2023-04-19 14:10:10",
        "timezone_type": 3,
        "timezone": "UTC"
    },
    "enviar_callback": "NAO",
    "link_api": "https://api.escavador.com/api/v1/async/resultados/1",
    "numero_processo": "0000000",
    "resposta": {
        "numero_unico": "0000000-00.0000.0.00.0000",
        "origem": "TJBA",
        "instancias": [
            {
                "url": "https://consultapublicapje.tjba.jus.br/pje/ConsultaPublica/listView.seam",
                "sistema": "PJE",
                "instancia": "PRIMEIRO_GRAU",
                "extra_instancia": "",
                "segredo": false,
                "numero": null,
                "assunto": "DIREITO CIVIL (899) - Obrigações (7681) - Preferências e Privilégios Creditórios",
                "classe": "HABILITAÇÃO (38)",
                "area": null,
                "data_distribuicao": "19/01/2022",
                "orgao_julgador": "1ª V EMPRESARIAL DE SALVADOR",
                "moeda_valor_causa": null,
                "valor_causa": null,
                "arquivado": true,
                "data_arquivamento": "01/09/2022",
                "fisico": null,
                "last_update_time": "19/04/2023 14:12",
                "situacoes": [],
                "dados": [
                    {
                        "tipo": "Processo referência",
                        "valor": "0000000-00.0000.0.00.0000"
                    }
                ],
                "partes": [
                    {
                        "id": 1,
                        "tipo": "REQUERENTE",
                        "nome": "MARIA",
                        "principal": true,
                        "polo": "ATIVO",
                        "documento": {
                            "tipo": "CPF",
                            "numero": "000.000.000-00"
                        }
                    },
                    {
                        "id": 2,
                        "tipo": "ADVOGADO",
                        "nome": "JOAO",
                        "principal": true,
                        "polo": "ATIVO",
                        "documento": {
                            "tipo": "CPF",
                            "numero": "000.000.000-00"
                        },
                        "advogado_de": 1,
                        "oabs": [
                            {
                                "numero": "12345",
                                "uf": "BA"
                            }
                        ]
                    }
                ],
                "movimentacoes": [
                    {
                        "id": 1,
                        "data": "03/12/2022",
                        "conteudo": "Certidão de publicação no DJe (Certidão de publicação no DJe)"
                    },
                    {
                        "id": 12,
                        "data": "24/10/2022",
                        "conteudo": "Decorrido prazo de EMPRESARIAL LTDA - EPP em 27/09/2022 23:59."
                    }
                ],
                "documentos_publicos": [
                    {
                        "posicao_id": 8,
                        "titulo": "Certidão de publicação no DJe (Certidão de publicação no DJe)",
                        "descricao": "",
                        "data": "03/12/2022",
                        "tipo": "DOCUMENTO_PUBLICO",
                        "unique_name": "tjba-PJE",
                        "size": 72503,
                        "is_on_s3": true,
                        "is_compressed": false,
                        "possivel_restrito": false,
                        "paginas": 3,
                        "updated_at": "30/01/2023 23:17:05",
                        "movid": 1,
                        "link_api": "https://api.escavador.com/api/v1/processo-tribunal/documentos-publicos/",
                        "extensao": "pdf"
                    }
                ],
                "audiencias": []
            }
        ]
    },
    "status": "SUCESSO",
    "motivo_erro": null,
    "status_callback": null,
    "tipo": "BUSCA_PROCESSO",
    "opcoes": {
        "documentos_publicos": true
    },
    "tribunal": {
        "sigla": "TJBA",
        "nome": "Tribunal de Justiça da Bahia",
        "busca_processo": 1,
        "busca_nome": 1,
        "busca_oab": 1,
        "busca_documento": 1,
        "disponivel_autos": 1,
        "documentos_publicos": 1,
        "quantidade_creditos_busca_processo": 5,
        "quantidade_creditos_busca_nome": 7,
        "quantidade_creditos_busca_documento": 7,
        "quantidade_creditos_busca_oab": 7
    },
    "valor": "0000000-00.0000.0.00.0000"
}
```

- Status 200
```json
{
    "id": 1,
    "created_at": {
        "date": "2023-04-19 14:10:10",
        "timezone_type": 3,
        "timezone": "UTC"
    },
    "enviar_callback": "NAO",
    "link_api": "https://api.escavador.com/api/v1/async/resultados/1",
    "numero_processo": "0000000",
    "resposta": {
        "numero_unico": "0000000-00.0000.0.00.0000",
        "origem": "TJBA",
        "instancias": [
            {
                "url": "https://consultapublicapje.tjba.jus.br/pje/ConsultaPublica/listView.seam",
                "sistema": "PJE",
                "instancia": "PRIMEIRO_GRAU",
                "extra_instancia": "",
                "segredo": false,
                "numero": null,
                "assunto": "DIREITO CIVIL (899) - Obrigações (7681) - Preferências e Privilégios Creditórios",
                "classe": "HABILITAÇÃO (38)",
                "area": null,
                "data_distribuicao": "19/01/2022",
                "orgao_julgador": "1ª V EMPRESARIAL DE SALVADOR",
                "moeda_valor_causa": null,
                "valor_causa": null,
                "arquivado": true,
                "data_arquivamento": "01/09/2022",
                "fisico": null,
                "last_update_time": "19/04/2023 14:12",
                "situacoes": [],
                "dados": [
                    {
                        "tipo": "Processo referência",
                        "valor": "0000000-00.0000.0.00.0000"
                    }
                ],
                "partes": [
                    {
                        "id": 1,
                        "tipo": "REQUERENTE",
                        "nome": "MARIA",
                        "principal": true,
                        "polo": "ATIVO",
                        "documento": {
                            "tipo": "CPF",
                            "numero": "000.000.000-00"
                        }
                    },
                    {
                        "id": 2,
                        "tipo": "ADVOGADO",
                        "nome": "JOAO",
                        "principal": true,
                        "polo": "ATIVO",
                        "documento": {
                            "tipo": "CPF",
                            "numero": "000.000.000-00"
                        },
                        "advogado_de": 1,
                        "oabs": [
                            {
                                "numero": "12345",
                                "uf": "BA"
                            }
                        ]
                    }
                ],
                "movimentacoes": [
                    {
                        "id": 1,
                        "data": "03/12/2022",
                        "conteudo": "Certidão de publicação no DJe (Certidão de publicação no DJe)"
                    },
                    {
                        "id": 12,
                        "data": "24/10/2022",
                        "conteudo": "Decorrido prazo de EMPRESARIAL LTDA - EPP em 27/09/2022 23:59."
                    }
                ],
                "documentos_publicos": [
                    {
                        "posicao_id": 8,
                        "titulo": "Certidão de publicação no DJe (Certidão de publicação no DJe)",
                        "descricao": "",
                        "data": "03/12/2022",
                        "tipo": "DOCUMENTO_PUBLICO",
                        "unique_name": "tjba-PJE",
                        "size": 72503,
                        "is_on_s3": true,
                        "is_compressed": false,
                        "possivel_restrito": false,
                        "paginas": 3,
                        "updated_at": "30/01/2023 23:17:05",
                        "movid": 1,
                        "link_api": "https://api.escavador.com/api/v1/processo-tribunal/documentos-publicos/",
                        "extensao": "pdf"
                    }
                ],
                "audiencias": []
            }
        ]
    },
    "status": "SUCESSO",
    "motivo_erro": null,
    "status_callback": null,
    "tipo": "BUSCA_PROCESSO",
    "opcoes": {
        "documentos_publicos": true
    },
    "tribunal": {
        "sigla": "TJBA",
        "nome": "Tribunal de Justiça da Bahia",
        "busca_processo": 1,
        "busca_nome": 1,
        "busca_oab": 1,
        "busca_documento": 1,
        "disponivel_autos": 1,
        "documentos_publicos": 1,
        "quantidade_creditos_busca_processo": 5,
        "quantidade_creditos_busca_nome": 7,
        "quantidade_creditos_busca_documento": 7,
        "quantidade_creditos_busca_oab": 7
    },
    "valor": "0000000-00.0000.0.00.0000"
}
```

- Status 200
```json
{
    "id": 1,
    "created_at": {
        "date": "2023-04-27 17:35:16",
        "timezone_type": 3,
        "timezone": "UTC"
    },
    "enviar_callback": "NAO",
    "link_api": "https://api.escavador.com/api/v1/async/resultados/1",
    "numero_processo": "0000000-00.0000.0.00.0000",
    "resposta": {
        "message": "Nossos robôs não conseguiram acessar as informações no site do TRF1. Tente novamente mais tarde"
    },
    "status": "ERRO",
    "motivo_erro": null,
    "status_callback": null,
    "tipo": "BUSCA_PROCESSO",
    "opcoes": {
        "tentativas": 2,
        "documentos_publicos": true
    },
    "tribunal": {
        "sigla": "TRF1",
        "nome": "TRF da 1ª Região",
        "busca_processo": 1,
        "busca_nome": 1,
        "busca_oab": 1,
        "busca_documento": 1,
        "disponivel_autos": 1,
        "documentos_publicos": 1,
        "quantidade_creditos_busca_processo": 5,
        "quantidade_creditos_busca_nome": 7,
        "quantidade_creditos_busca_documento": 7,
        "quantidade_creditos_busca_oab": 7
    },
    "valor": "0000000-00.0000.0.00.0000"
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### POST /api/v1/tribunal/{origem}/busca-por-nome/async

**Pesquisar processos no site do tribunal por nome do envolvido (assíncrono)**

A busca é feita diretamente nos sites dos tribunais, pelos robôs do Escavador.
O tempo de busca é afetado pelo tempo de resposta dos sites dos tribunais,
pela presença de captchas e outros fatores. Como há possibilidade do tempo de resposta ser longo, essa rota funciona de maneira assíncrona.
Após solicitar as informações do processo, caso tenha informado, você irá receber um callback (POST) como resultado e também  um link para consultar o
[resultado](/v1/docs/busca-assincrona#todos-os-resultados-das-buscas-assncronas) através do campo `link_api`.

<aside class="notice"> *<a href="/v1/docs/tribunais-e-orgaos-administrativos#retornar-sistemas-dos-tribunais-disponveis">Consulte os tribunais</a> para saber a disponibilidade para esse tipo de busca.</aside>



### Campos no retorno da API
Campo | Tipo | Descrição
---- | ----- |-----
id | Integer | Id do resultado da busca.
tipo | Integer | BUSCA_POR_NOME
valor | String | Nome do envolvido informado.
resposta | String | Informações dos processos.
link_api | String | Link para consultar o resultado pela API.
status | String | Status do resultado da busca:<br/><div style="margin-left:15px">`PENDENTE`: As informações ainda estão sendo pesquisadas <br/>`SUCESSO`: As informações já estão disponíveis <br/>`ERRO`: Não conseguiu coletar as informações</div>

#### Callbacks relacionados
Evento | Descrição
--------- | -------
<a href="/v1/docs/callbacks#resultado-da-busca-assincrona-de-nome-do-envolvido-no-site-do-tribunal">resultado_busca_nome_async</a> | A busca assíncrona de processos pelo nome da parte foi concluída e o usuário marcou a opção de receber por callback.

- Requer autenticação: sim

#### URL Params

- `origem` (string, required): Tribunal de origem do processo.

#### Body Params

- `nome` (string, required): Nome do envolvido.
- `permitir_parcial` (integer, optional): A busca por nome é feita em todos os sistemas daquele Tribunal (Ex: Esaj, Prodjudi...). Se `permitir_parcial == 1` e tiver sucesso apenas em parte dos sistemas pesquisados, a informação será entregue parcialmente. Default: `0`.
- `send_callback` (integer, optional): Se `send_callback == 1`, a resposta será enviada para a url de callback do usuário, uma alternativa caso não queira ficar consultando o resultado. Default: `0`.

#### Responses

- Status 200
```json
{
    "id": 1,
    "created_at": {
        "date": "2022-08-15 19:52:34",
        "timezone_type": 3,
        "timezone": "UTC"
    },
    "enviar_callback": "NAO",
    "link_api": "https://api.escavador.com/api/v1/async/resultados/1",
    "resposta": null,
    "status": "PENDENTE",
    "motivo_erro": null,
    "status_callback": null,
    "tipo": "BUSCA_POR_NOME",
    "opcoes": null,
    "tribunal": {
        "sigla": "TJSP",
        "nome": "Tribunal de Justiça de São Paulo",
        "busca_processo": 1,
        "busca_nome": 1,
        "busca_oab": 1,
        "busca_documento": 1,
        "disponivel_autos": 1,
        "documentos_publicos": 1,
        "quantidade_creditos_busca_processo": 5,
        "quantidade_creditos_busca_nome": 7,
        "quantidade_creditos_busca_documento": 7,
        "quantidade_creditos_busca_oab": 7
    },
    "valor": "Fulano de Tal"
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### POST /api/v1/tribunal/{origem}/busca-por-documento/async

**Pesquisar processos no site do tribunal por CPF ou CNPJ (assíncrono)**

A busca é feita diretamente nos sites dos tribunais, pelos robôs do Escavador.
O tempo de busca é afetado pelo tempo de resposta dos sites dos tribunais, pela presença de captchas e outros fatores.
Como há possibilidade do tempo de resposta ser longo, essa rota funciona de maneira assíncrona.
Após solicitar as informações do processo, caso tenha informado, você irá receber um callback (POST)
como resultado e também um link para consultar o [resultado](/v1/docs/busca-assincrona#resultado-especfico-de-uma-busca-assncrona) através do campo `link_api`.

<aside class="notice"> *<a href="/v1/docs/tribunais-e-orgaos-administrativos#retornar-sistemas-dos-tribunais-disponveis">Consulte os tribunais</a> para saber a disponibilidade para esse tipo de busca.</aside>



#### Callbacks relacionados
Evento | Descrição
--------- | -------
<a href="/v1/docs/callbacks#resultado-da-busca-assincrona-por-cpf-ou-cnpj-no-site-do-tribunal">resultado_busca_documento_async</a> | A busca assíncrona de processos por CPF ou CNPJ foi concluída e o usuário marcou a opção de receber por callback.

- Requer autenticação: sim

#### URL Params

- `origem` (string, required): 

#### Body Params

- `numero_documento` (string, required): Numeração do documento (CPF ou CNPJ) do envolvido.
- `permitir_parcial` (integer, optional): A busca por nome é feita em todos os sistemas daquele Tribunal (Ex: Esaj, Prodjudi...). Se `permitir_parcial == 1` e tiver sucesso apenas em parte dos sistemas pesquisados, a informação será entregue parcialmente. Default: `0`.
- `send_callback` (integer, optional): Se `send_callback == 1`, a resposta será enviada para a url de callback do usuário, uma alternativa caso não queira ficar consultando o resultado. Default: `0`.

#### Responses

- Status 200
```json
{
    "id": 1,
    "created_at": {
        "date": "2022-08-16 13:05:31",
        "timezone_type": 3,
        "timezone": "UTC"
    },
    "enviar_callback": "NAO",
    "link_api": "https://api.escavador.com/api/v1/async/resultados/1",
    "resposta": null,
    "status": "PENDENTE",
    "motivo_erro": null,
    "status_callback": null,
    "tipo": "BUSCA_POR_DOCUMENTO",
    "opcoes": null,
    "tribunal": {
        "sigla": "TJPA",
        "nome": "Tribunal de Justiça do Pará",
        "busca_processo": 1,
        "busca_nome": 1,
        "busca_oab": 1,
        "busca_documento": 1,
        "disponivel_autos": 1,
        "documentos_publicos": 1,
        "quantidade_creditos_busca_processo": 5,
        "quantidade_creditos_busca_nome": 7,
        "quantidade_creditos_busca_documento": 7,
        "quantidade_creditos_busca_oab": 7
    },
    "valor": "00.000.000/0000-00"
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### POST /api/v1/tribunal/{origem}/busca-por-oab/async

**Pesquisar processos no site do tribunal por OAB (assíncrono)**

A busca é feita diretamente nos sites dos tribunais, pelos robôs do Escavador.
O tempo de busca é afetados pelo tempo de resposta dos sites dos tribunais, pela presença de captchas e outros fatores.
Como há possibilidade do tempo de resposta ser longo, essa rota funciona de maneira assíncrona.
Após solicitar as informações do processo, caso tenha informado, você irá receber um callback (POST)
como resultado e também um link para consultar o [resultado](/v1/docs/busca-assincrona#resultado-especfico-de-uma-busca-assncrona) através do campo `link_api`.

<aside class="notice"> *<a href="/v1/docs/tribunais-e-orgaos-administrativos#retornar-sistemas-dos-tribunais-disponveis">Consulte os tribunais</a> para saber a disponibilidade para esse tipo de busca.</aside>



#### Callbacks relacionados
Evento | Descrição
--------- | -------
<a href="/v1/docs/callbacks#resultado-da-busca-assincrona-por-oab-no-site-do-tribunal">resultado_busca_oab_async</a> | A busca assíncrona de processos por OAB foi concluída e o usuário marcou a opção de receber por callback.

- Requer autenticação: sim

#### URL Params

- `origem` (string, required): Tribunal de origem do processo.

#### Body Params

- `numero_oab` (string, required): Número da OAB.
- `estado_oab` (string, required): Sigla do Estado da OAB.
- `permitir_parcial` (integer, optional): A busca por nome é feita em todos os sistemas daquele Tribunal (Ex: Esaj, Prodjudi...). Se `permitir_parcial == 1` e tiver sucesso apenas em parte dos sistemas pesquisados, a informação será entregue parcialmente. Default: `0`.
- `send_callback` (integer, optional): Se `send_callback == 1`, a resposta será enviada para a url de callback do usuário, uma alternativa caso não queira ficar consultando o resultado. Default: `0`.

#### Responses

- Status 200
```json
{
    "id": 38,
    "created_at": {
        "date": "2021-09-16 10:44:20.000000",
        "timezone_type": 3,
        "timezone": "UTC"
    },
    "enviar_callback": "NAO",
    "link_api": "https://api.escavador.com/api/v1/async/resultados/38",
    "resposta": null,
    "status": "PENDENTE",
    "motivo_erro": null,
    "status_callback": null,
    "tipo": "BUSCA_POR_OAB",
    "opcoes": null,
    "tribunal": {
        "sigla": "TJES",
        "nome": "Tribunal de Justiça do Espírito Santo",
        "busca_processo": 1,
        "busca_nome": 0,
        "busca_oab": 1,
        "busca_documento": 1,
        "disponivel_autos": 0,
        "documentos_publicos": 1,
        "quantidade_creditos_busca_processo": 5,
        "quantidade_creditos_busca_nome": null,
        "quantidade_creditos_busca_documento": null
    },
    "valor": "BA1234"
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### POST /api/v1/processo-administrativo/{numero_nup}/async

**Pesquisar processo administrativo com NUP (assíncrono)**

A busca é feita diretamente nos sites dos órgãos e entidades da Administração Pública federal, pelos robôs do Escavador.
O tempo de busca é afetado pelo
tempo de resposta dos sites dos órgãos, pela presença de captchas e outros fatores. Como há possibilidade do tempo de resposta
ser longo, essa rota funciona de maneira assíncrona. Após solicitar as informações do processo,
caso tenha informado, você irá receber um callback (POST) como resultado e também  um link para consultar o
[resultado](/v1/docs/busca-assincrona#todos-os-resultados-das-buscas-assncronas) através do campo `link_api`.



### Campos no retorno da API
Parâmetro | Tipo | Descrição
--------- | ------- | -------
id | int | Id do resultado da busca.
numero_processo | string | Numeração do processo.
resposta | string | Informações do processo.
link_api | string | Link para consultar o resultado pela API.
status | string | Status do resultado da busca:<br/><div style="margin-left:15px">`PENDENTE`: As informações do processo ainda estão sendo pesquisadas<br/>`SUCESSO`: As informações do processo já estão disponíveis<br/>`ERRO`: Não conseguiu coletar as informações do processo<br/>`NAO_ENCONTRADO`: Não encontrou o processo</div>

### Campos do processo na resposta
Campo | Tipo | Descrição
--------- | ------- | -------
numero_unico | String | Número único desse processo.
numero_alternativo | String | Número alternativo desse processo.
origem | String | Origem administrativa de onde esse processo foi extraido.
instancias | Object[] | Lista com as informações do processo em cada uma das instâncias do tribunal.
instancias[].instancia | String | Instância a qual esse objeto representa, note que pode haver mais de um objeto contendo todas as informações abaixo em uma determinada instância.
instancias[].segredo | Boolean | Determina se o processo está em segredo de justiça. Em caso afirmativo, as informações em seguida serão nulas ou vazias.
instancias[].numero | String | Número antigo do processo nessa instância.
instancias[].url | String | URL para o local exato de onde as informações dessa instância foram extraidas.
instancias[].assunto | String | Assunto da instância do processo.
instancias[].classe | String | Classe judicial da instância do processo.
instancias[].area | String | Área do direito do processo. Ex.: Cívil, Criminal, Trabalhista e etc.
instancias[].data_distribuicao | String | Data que foi distribuido o processo no tribunal. Possui o formato dd/mm/aaaa.
instancias[].orgao_julgador | String | Orgão julgador da instância do processo.
instancias[].valor_causa | String | Valor da causa nesta instância.
instancias[].sistema | String | Sistema eletronico em que essa instância se encontra.
instancias[].dados | Object[] | Lista de dados arbitrários no cabeçalho dessa instância.
instancias[].dados[].tipo | String | Não assuma que esse campo sempre tem um determinado valor, o mesmo pode mudar a depender do processo e/ou tribunal.
instancias[].dados[].valor | String | Não assuma que esse campo sempre tem um determinado valor, o mesmo pode mudar a depender do processo e/ou tribunal.
instancias[].partes | Object[] | Lista de envolvidos no processo nessa instância.
instancias[].partes[].id | Integer | Indice de referência, usado no campo advogado_de.
instancias[].partes[].tipo | String | Tipo do Envolvido.
instancias[].partes[].nome | String | Nome do Envolvido.
instancias[].partes[].principal | Boolean | Informa se o envolvido é uma parte principal, por padrão vem o valor true caso não encontre essa informação no tribunal.
instancias[].partes[].advogado_de | Integer | Contém o id do envolvido o qual o envolvido atual é o advogado, se o envolvido for uma advogado e o tribunal informar a relação envolvido-advogado.
instancias[].partes[].polo | String | O tipo do polo deste envolvido.
instancias[].documento | Object[] | Documento de identificação do envolvido.
instancias[].documento[].numero | String | Numero do documento de identificação do envolvido.
instancias[].documento[].tipo | String | Tipo do documento de identificação do envolvido. Podendo ser CPF ou CNPJ.
instancias[].documentos_publicos[] | Object[] | Documentos Públicos relacionados ao processo que são retornados quando o parâmetro documentos_publicos é enviado.
instancias[].movimentacoes | Object[] | Lista de movimentações do processo, ordenada na ordem em que a movimentação apareceu no tribunal.
instancias[].movimentacoes[].data | String | Data da movimentação no tribunal. Possui o formato dd/mm/aaaa.
instancias[].movimentacoes[].conteudo | String | Conteudo da movimentação no tribunal. Pode possuir varias linhas sendo separadas por
.
instancias[].audiencias | Object[] | Lista de audiências ocorridas.
instancias[].audiencias[].data | String | Data de uma audiência no tribunal. Possui o formato dd/mm/aaaa.
instancias[].audiencias[].audiencia | String | Tipo da audiência no tribunal.
instancias[].audiencias[].situacao | String | A situação da audiência no tribunal.
instancias[].audiencias[].numero_pessoas | Integer | Numero de pessoas na audiência no tribunal.
instancias[].arquivado | Boolean | Indica se o processo foi arquivado, em certos casos, essa informação pode não ser obtida, retornando NULL
instancias[].data_arquivamento | String | Indica a data em que o processo foi arquivado
instancias[].fisico | Boolean | Indica se o processo é do tipo físico
#### Callbacks relacionados
Evento | Descrição
--------- | -------
<a href="/v1/docs/callbacks#resultado-da-busca-assncrona-do-processo-no-site-do-tribunal">resultado_processo_async</a> | A busca assíncrona do processo foi concluída e o usuário marcou a opção de receber por callback.

- Requer autenticação: sim

#### URL Params

- `numero_nup` (integer, required): Número único de protocolo (NUP). <br> <b>Atenção:</b> Ao enviar remova a barra do número! </br> Ex: **14152.167442/2022-10** deve ser enviado como **14152.167442-2022-10**.

#### Body Params

- `send_callback` (integer, optional): Se `send_callback == 1`, a resposta será enviada para a url de callback do usuário, uma alternativa caso não queira ficar consultando o resultado. Default: 0.
- `wait` (integer, optional): Se `wait == 1`, a requisição irá durar até 1 minuto e caso consiga as informações do processo nesse tempo, a resposta vem de forma síncrona. Caso passe 2 minutos, se não tiver resposta do processo, o fluxo ocorrerá da forma assíncrona. Default: 0.
- `origem` (string, optional): Sigla da origem administrativa do processo (Ex: **MTE**, **ANP**, **SUSEP**, ...). </br> <b>Atenção:</b> Ao informar a `origem` diretamente, é possivel enviar o número de processoem outro formato (Ex: **0001-2023**).
- `dias_ultima_atualizacao` (integer, optional): Caso a gente possua uma versão antiga do processo em nossa base de dados, você pode informar o número de dias desde a última consulta do processo. Se a última atualização do processo for há menos dias que o informado, retornaremos os dados sem precisar consultar os sistemas e a resposta será mais rápida.

#### Responses

- Status 200
```json
{
    "id": 17,
    "created_at": {
        "date": "2024-11-08 19:14:00",
        "timezone_type": 3,
        "timezone": "UTC"
    },
    "enviar_callback": "NAO",
    "link_api": "https://api.escavador.com/api/v1/async/resultados/17",
    "numero_processo": "00000000000000000",
    "resposta": null,
    "status": "PENDENTE",
    "motivo_erro": null,
    "status_callback": null,
    "tipo": "BUSCA_PROCESSO",
    "opcoes": {
        "origem": "ANAC"
    },
    "origem_administrativa": {
        "sigla": "ANAC",
        "nome": null,
        "codigo": "00000"
    },
    "valor": "00000000000000000"
}
```

- Status 200
```json
{
    "id": 1,
    "created_at": {
        "date": "2024-12-08 14:00:10",
        "timezone_type": 3,
        "timezone": "UTC"
    },
    "enviar_callback": "SIM",
    "link_api": "https://api.escavador.com/api/v1/async/resultados/1",
    "numero_processo": "0000000",
    "resposta": {
        "numero_alternativo": "00000000000000000",
        "numero_unico": "00000000000000000",
        "origem": "ANAC",
        "instancias": [
            {
                "url": "https://sei.anac.gov.br/sei/modulos/pesquisa/md_pesq_processo_pesquisar.php?acao_externa=protocolo_pesquisar&acao_origem_externa=protocolo_pesquisar&id_orgao_acesso_externo=0",
                "sistema": "SEI",
                "instancia": "DESCONHECIDA",
                "extra_instancia": "",
                "tipo_precatorio": null,
                "segredo": false,
                "numero": null,
                "numeros_alternativos": [
                    {
                        "numero": "00000000000000000",
                        "tipo": "ALTERNATIVO"
                    }
                ],
                "assunto": "A definir: pendente de alteração pela Unidade",
                "classe": null,
                "area": null,
                "data_distribuicao": "19/05/2021",
                "orgao_julgador": null,
                "moeda_valor_causa": null,
                "valor_causa": null,
                "arquivado": null,
                "data_arquivamento": null,
                "fisico": null,
                "last_update_time": "09/12/2024 14:52",
                "situacoes": [],
                "dados": [],
                "partes": [
                    {
                        "id": 1,
                        "tipo": "Interessado(a)",
                        "nome": "Banco Do Brasil",
                        "principal": true,
                        "polo": null,
                        "documento": {
                            "tipo": null,
                            "numero": null
                        }
                    }
                ],
                "movimentacoes": [
                    {
                        "id": 1,
                        "data": "20/05/2021",
                        "conteudo": "Conclusão do processo na unidade\nUnidade: COFATI-REC"
                    }
                ],
                "documentos_publicos": [],
                "audiencias": []
            }
        ]
    },
    "status": "SUCESSO",
    "motivo_erro": null,
    "status_callback": null,
    "tipo": "BUSCA_PROCESSO",
    "opcoes": [],
    "origem_administrativa": {
        "sigla": "ANAC",
        "nome": null,
        "codigo": "00000"
    },
    "valor": "00000000000000000"
}
```

- Status 200
```json
{
    "id": 1,
    "created_at": {
        "date": "2024-12-08 14:00:10",
        "timezone_type": 3,
        "timezone": "UTC"
    },
    "enviar_callback": "SIM",
    "link_api": "https://api.escavador.com/api/v1/async/resultados/1",
    "numero_processo": "0000000",
    "resposta": {
        "numero_alternativo": "00000000000000000",
        "numero_unico": "00000000000000000",
        "origem": "ANAC",
        "instancias": [
            {
                "url": "https://sei.anac.gov.br/sei/modulos/pesquisa/md_pesq_processo_pesquisar.php?acao_externa=protocolo_pesquisar&acao_origem_externa=protocolo_pesquisar&id_orgao_acesso_externo=0",
                "sistema": "SEI",
                "instancia": "DESCONHECIDA",
                "extra_instancia": "",
                "tipo_precatorio": null,
                "segredo": false,
                "numero": null,
                "numeros_alternativos": [
                    {
                        "numero": "00000000000000000",
                        "tipo": "ALTERNATIVO"
                    }
                ],
                "assunto": "A definir: pendente de alteração pela Unidade",
                "classe": null,
                "area": null,
                "data_distribuicao": "19/05/2021",
                "orgao_julgador": null,
                "moeda_valor_causa": null,
                "valor_causa": null,
                "arquivado": null,
                "data_arquivamento": null,
                "fisico": null,
                "last_update_time": "09/12/2024 14:52",
                "situacoes": [],
                "dados": [],
                "partes": [
                    {
                        "id": 1,
                        "tipo": "Interessado(a)",
                        "nome": "Banco Do Brasil",
                        "principal": true,
                        "polo": null,
                        "documento": {
                            "tipo": null,
                            "numero": null
                        }
                    }
                ],
                "movimentacoes": [
                    {
                        "id": 1,
                        "data": "20/05/2021",
                        "conteudo": "Conclusão do processo na unidade\nUnidade: COFATI-REC"
                    }
                ],
                "documentos_publicos": [],
                "audiencias": []
            }
        ]
    },
    "status": "SUCESSO",
    "motivo_erro": null,
    "status_callback": null,
    "tipo": "BUSCA_PROCESSO",
    "opcoes": [],
    "origem_administrativa": {
        "sigla": "ANAC",
        "nome": null,
        "codigo": "00000"
    },
    "valor": "00000000000000000"
}
```

- Status 200
```json
{
    "id": 1,
    "created_at": {
        "date": "2024-11-08 19:14:00",
        "timezone_type": 3,
        "timezone": "UTC"
    },
    "enviar_callback": "NAO",
    "link_api": "https://api.escavador.com/api/v1/async/resultados/1",
    "numero_processo": "00000000000000000",
    "resposta": {
        "message": "Nossos robôs não conseguiram acessar as informações no site do ANAC. Tente novamente mais tarde"
    },
    "status": "ERRO",
    "motivo_erro": null,
    "status_callback": null,
    "tipo": "BUSCA_PROCESSO",
    "opcoes": {
        "tentativas": 2
    },
    "origem_administrativa": {
        "sigla": "ANAC",
        "nome": null,
        "codigo": "00000"
    },
    "valor": "00000000000000000"
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

## Movimentações

### GET /api/v1/movimentacoes/{movimentaco}

**Retornar uma movimentação**

Retorna uma movimentação pelo seu identificador no Escavador.

- Requer autenticação: sim

#### URL Params

- `movimentacao` (integer, required): Identificador numérico da movimentação no Escavador.
- `movimentaco` (string, required): 

#### Responses

- Status 200
```json
{
    "id": 1,
    "secao": "Seção Especializada I (Publicações do PJe-JT)",
    "texto_categoria": "",
    "diario_oficial_id": 1,
    "processo_id": 1,
    "pagina": null,
    "complemento": null,
    "tipo": "Acórdão DEJT",
    "subtipo": null,
    "conteudo": "<font class=\"content-small \">TRABALHO DA 8a REGIAO</font><br><font class=\"content-small \">R&#201;U    KEDNA VIDAL FERREIRA</font><br><font class=\"content-small \">73442488249</font><br><font class=\"content-small \">R&#201;U    SINDICATO DOS EMPREGADOS    NO</font><br><font class=\"content-small \">COMERCIO DO ESTADO DO PARA</font><br><font class=\"content-small \">PODER JUDICI&#193;RIO<br>JUSTI&#199;A DO TRABALHO</font><br><font class=\"content-small content-bold \">PROCESSO n&#176; 0000047-39.2014.5.08.0000 ()</font><br><font class=\"content-small \">AUTOR: MINIST&#201;RIO P&#218;BLICO DO TRABALHO<br>Doutora Carla Afonso de N&#243;voa Melo</font><br><font class=\"content-small \">R&#201;US: SINDICATO DOS EMPREGADOS NO COM&#201;RCIO DO<br>ESTADO DO PAR&#193; (SEC/PA)</font><br><font class=\"content-small \">KEDNA VIDAL FERREIRA (PANIFICADORA MULTPAES)</font><br><font class=\"content-small content-bold \">RELATORA: Desembargadora Rosita de Nazar&#233; Sidrim Nassar<br>Ementa</font><br><font class=\"content-small \">A&#199;&#195;O RESCIS&#211;RIA. CONCILIA&#199;&#195;O JUDICIAL. MULTA POR<br>DESCUMPRIMENTO DA OBRIGA&#199;&#195;O. NATUREZA.<br>DESTINA&#199;&#195;O. O artigo 13 da Lei 7.347/85 pressup&#245;e a exist&#234;ncia<br>de condena&#231;&#227;o em dinheiro e indeniza&#231;&#227;o pelo dano. A concilia&#231;&#227;o</font><br><font class=\"content-small \">efetuada em processo contencioso, embora tenha origem na<br>vontade das partes, tamb&#233;m opera a vontade do Estado, sendo por<br>isso consumada com a homologa&#231;&#227;o judicial, a partir de quando<br>ter&#225; valor de senten&#231;a (artigo 449/CPC), a qual, por fic&#231;&#227;o do<br>legislador processual, foi equiparada &#224; senten&#231;a de m&#233;rito (artigo<br>269, III/CPC) desconstitu&#237;vel somente por rescis&#243;ria (artigo<br>831/CLT; artigo 485/CPC; S&#250;mula 100, V, TST). No que se refere &#224;<br>indeniza&#231;&#227;o, em que pese eventual execu&#231;&#227;o ter origem em multa,<br>esta, nos termos em que foi homologada, caracteriza-se como multa<br>compensat&#243;ria. Sendo assim, caracterizados os dois elementos<br>previstos na norma legal, na esfera trabalhista, os recursos<br>advindos de multa eventualmente executada por descumprimento<br>de obriga&#231;&#227;o, deve reverter ao Fundo de Amparo ao Trabalhador<br>(FAT), ante a aus&#234;ncia do fundo estabelecido na Lei 7.347/85.<br></font><font class=\"content-small content-bold \">Relat&#243;rio</font><br><font class=\"content-small \">Vistos, relatados e discutidos estes autos de A&#231;&#227;o Rescis&#243;ria, em<br>que figuram, como autor e r&#233;us, as acima indicadas.</font><br><font class=\"content-small \">MINIST&#201;RIO P&#218;BLICO DO TRABALHO prop&#244;s A&#231;&#227;o Rescis&#243;ria,<br>com pedido liminar, em face ao Sindicato dos Empregados no<br>Com&#233;rcio do Estado do Par&#225; e Kedna Vidal Ferreira (Panificadora<br>Multpaes), reclamante e reclamada, respectivamente, no processo<br>n&#176; 0002102-55.2013.5.08.0110, em tr&#226;mite na 1<sup>a</sup> Vara do Trabalho<br>de Tucuru&#237; (Pa), visando desconstituir a senten&#231;a homologat&#243;ria do<br>acordo, ao fundamento de que a integralidade do valor da multa ali<br>prevista deve ser destinada ao FAT, sob pena de viola&#231;&#227;o ao artigo<br>13 da Lei 7.347/85 e artigo 100, par&#225;grafo &#250;nico, da Lei n. 8.078/90.<br>Conforme decis&#227;o monocr&#225;tica ID 78748, esta relatora,<br>considerando preenchidos os requisitos autorizadores, deferiu a<br>medida cautelar postulada e determinou a suspens&#227;o dos efeitos da<br>senten&#231;a homologat&#243;ria do acordo fimado naquele processo (A&#231;&#227;o<br>Civil P&#250;blica 0002102-55.2013.5.08.0110), no que se refere &#224;<br>destina&#231;&#227;o dos valores eventualmente executados em decorr&#234;ncia<br>da multa por descumprimento da obriga&#231;&#227;o.</font><br><font class=\"content-small \">Os r&#233;us n&#227;o contestaram a a&#231;&#227;o.</font><br><font class=\"content-small \">Raz&#245;es finais apresentadas apenas pelo autor, ID 1256l9d.<br>Dispensada a manifesta&#231;&#227;o do Minist&#233;rio P&#250;blico do Trabalho,<br>conforme artigo 103, par&#225;grafo &#250;nico, do RI/TRT-8a.<br></font><font class=\"content-small content-bold \">Fundamenta&#231;&#227;o<br></font><font class=\"content-small \">ADMISSIBILIDADE</font><br><font class=\"content-small \">Por terem sido observados os pressupostos espec&#237;ficos, ratifica-se<br>a admissibilidade da A&#231;&#227;o Rescis&#243;ria.</font><br><font class=\"content-small content-bold \">M&#233;rito</font><br><font class=\"content-small \">A decis&#227;o que o Minist&#233;rio P&#250;blico do Trabalho pretende ver<br>rescindida &#233; a senten&#231;a homologat&#243;ria do acordo firmado no<br>processo 0002102-55.2013.5.08.0110, que tramita perante a 1a<br>Vara do Trabalho de Tucuru&#237; (Pa), no que se refere &#224; destina&#231;&#227;o</font><br><font class=\"content-small \">dos valores que eventualmente possam ser executados, em<br>decorr&#234;ncia de multa por descumprimento das condi&#231;&#245;es<br>pactuadas.</font><br><font class=\"content-small \">Considerando que as partes n&#227;o apresentaram qualquer fato novo<br>que viesse a alterar a decis&#227;o liminar, havendo o autor, inclusive,<br>ratificado integralmente a peti&#231;&#227;o inicial, mantenho a decis&#227;o<br>proferida anteriormente, a qual a seguir transcrevo:</font><br><font class=\"content-small \">&quot;Alega o autor que o acordo homologado pelo Ju&#237;zo viola<br>diretamente o dispositivo legal, uma vez que &quot;em A&#231;&#227;o Civil P&#250;blica<br>a indeniza&#231;&#227;o reverter&#225; integralmente a um fundo, e n&#227;o ao<br>sindicato autor da a&#231;&#227;o&quot; (ID 68493), sendo aquele, no judici&#225;rio<br>trabalhista, o Fundo de Amparo ao Trabalhador (FAT).</font><br><font class=\"content-small \">Requer, em pedido liminar, com fundamento no artigo 273 do CPC,<br>a antecipa&#231;&#227;o dos efeitos da tutela, ou, alternativamente, se outro<br>for o entendimento, com base nos princ&#237;pios da fungibilidade e da<br>instrumentalidade do processo, a concess&#227;o de medida liminar<br>acautelat&#243;ria, nos termos do artigo 798 do CPC.</font><br><font class=\"content-small \">Aduz que o periculum in mora est&#225; evidenciado uma vez que, na<br>ocorr&#234;ncia de abertura do estabelecimento em feriados, havendo<br>descumprimento do acordo, o sindicato receberia os valores<br>decorrentes de eventual execu&#231;&#227;o da multa ali prevista, os quais,<br>nos termos do artigo 13 da Lei 7.347/85, deveriam ser destinados<br>ao Fundo de Amparo ao Trabalhador-FAT. O fumus boni iuris, por<br>sua vez, porque h&#225; jurisprud&#234;ncia pac&#237;fica no C. TST e neste<br>Regional no sentido de destinar integralmente ao FAT os valores<br>devidos a t&#237;tulo de multa.</font><br><font class=\"content-small \">Conforme o que se tem registrado nestes autos e nos autos da a&#231;&#227;o<br>mencionada pelo autor, o sindicato r&#233;u ajuizou A&#231;&#227;o Civil P&#250;blica,<br>com pedido de antecipa&#231;&#227;o dos efeitos da tutela, visando a inibir<br>conduta da empresa r&#233; em exigir de seus empregados o trabalho<br>em feriados.</font><br><font class=\"content-small \">Ap&#243;s o deferimento do pedido de antecipa&#231;&#227;o da tutela, na<br>audi&#234;ncia inaugural designada para o dia 29.10.2013, as partes<br>resolveram conciliar prevendo a possibilidade de abertura do<br>estabelecimento em feriados, mediante acordo coletivo, sob pena<br>de multa no valor de R$500,00 (quinhentos reais), por feriado, e<br>R$500,00 (quinhentos reais), por empregado que viesse a trabalhar<br>no respectivo feriado, a reverter em favor do sindicato autor daquela<br>a&#231;&#227;o.</font><br><font class=\"content-small \">Instado a se manifestar sobre os termos do acordo, o &#243;rg&#227;o<br>ministerial requereu que a multa fosse revertida ao Fundo de<br>Amparo ao Trabalhador (FAT), nos termos do artigo 13 da Lei n.<br>7.347/85, bem como que fosse observada a legisla&#231;&#227;o municipal<br>quanto ao trabalho em feriados, na forma do artigo 6-A da Lei<br>10.101/2000.</font><br><font class=\"content-small \">O Ju&#237;zo, por&#233;m, resolveu homologar o acordo em sua integralidade,<br>raz&#227;o pela qual foi ajuizada a presente a&#231;&#227;o.</font><br><font class=\"content-small \">No que se refere &#224; destina&#231;&#227;o de valores pecuni&#225;rios em a&#231;&#245;es<br>coletivas h&#225; entendimento majorit&#225;rio na jurisprud&#234;ncia trabalhista<br>no sentido de ser determinado que esses valores sejam revertidos<br>integralmente ao Fundo de Amparo ao Trabalhador. Isso ocorre<br>tanto porque a norma legal estabelece que essas quantias devem<br>ser revertidas a um fundo gerido por um Conselho Federal ou por<br>Conselhos Estaduais, quanto porque o sindicato tem sua pr&#243;pria<br>fonte de custeio.</font><br><font class=\"content-small \">Contudo, no presente caso, h&#225; uma particularidade a diferenciar a<br>mat&#233;ria, eis que eventual execu&#231;&#227;o de valor teria origem em multa<br>estipulada no acordo e n&#227;o em decis&#227;o judicial e o dispositivo legal<br>refere-se &#224; condena&#231;&#227;o proveniente de indeniza&#231;&#227;o pelo dano<br>causado. Diz o referido artigo:</font><br><font class=\"content-small \">Art. 13. Havendo condena&#231;&#227;o em dinheiro, a indeniza&#231;&#227;o pelo dano<br>causado reverter&#225; a um fundo gerido por um Conselho Federal ou<br>por Conselhos Estaduais de que participar&#227;o necessariamente o<br>Minist&#233;rio P&#250;blico e representantes da comunidade, sendo seus<br>recursos destinados &#224; reconstitui&#231;&#227;o dos bens lesados. (grifou-se)<br>&#167; 1o. Enquanto o fundo n&#227;o for regulamentado, o dinheiro ficar&#225;<br>depositado em estabelecimento oficial de cr&#233;dito, em conta com<br>corre&#231;&#227;o monet&#225;ria. (Renumerado do par&#225;grafo &#250;nico pela Lei n&#176;<br>12.288, de 2010)</font><br><font class=\"content-small \">A aus&#234;ncia de condena&#231;&#227;o e indeniza&#231;&#227;o foram os fundamentos<br>adotados na a&#231;&#227;o civil p&#250;blica para homologa&#231;&#227;o do acordo nos<br>termos em que foi proposto. Disse o Juiz que o Minist&#233;rio P&#250;blico do<br>Trabalho, em sua manifesta&#231;&#227;o, reconheceu que &quot;a natureza da<br>multa cominada n&#227;o &#233; indenizat&#243;ria, n&#227;o se presta a reparar<br>qualquer dano eventualmente causado, logo &#233; de se concluir que tal<br>comina&#231;&#227;o pecuni&#225;ria n&#227;o se insere na previs&#227;o do art. 13 da Lei n.<br>7.347/85, que trata, expressamente, de condena&#231;&#227;o em dinheiro<br>decorrente de indeniza&#231;&#227;o por dano causado&quot;. (ID 68596)</font><br><font class=\"content-small \">A concilia&#231;&#227;o efetivada em processo contencioso, embora tenha<br>origem na vontade das partes, tamb&#233;m opera a vontade do Estado,<br>sendo por isso consumada com a homologa&#231;&#227;o judicial, a partir de<br>quando ter&#225; valor de senten&#231;a (artigo 449/CPC), a qual, por fic&#231;&#227;o<br>do legislador processual, foi equiparada &#224; senten&#231;a de m&#233;rito (artigo<br>269, III/CPC) desconstitu&#237;vel somente por rescis&#243;ria (artigo<br>831/CLT; artigo 485/CPC; S&#250;mula 100, V, TST).</font><br><font class=\"content-small \">Nestes termos, tratando-se de senten&#231;a de m&#233;rito, pode-se afirmar<br>que houve condena&#231;&#227;o, a exemplo do que diz o dispositivo legal<br>apontado pelo autor como violado.</font><br><font class=\"content-small \">No que se refere &#224; indeniza&#231;&#227;o, tamb&#233;m mencionada na norma, em<br>que pese eventual execu&#231;&#227;o ter origem em multa, esta, nos termos<br>em que foi homologada, caracteriza-se como multa compensat&#243;ria,<br>definida por De Pl&#225;cido e Silva como &quot;justa indeniza&#231;&#227;o pelo n&#227;o</font><br><font class=\"content-small \">cumprimento da obriga&#231;&#227;o&quot;1.</font><br><font class=\"content-small \">Afastados, assim, os dois fatores que a princ&#237;pio impediam a<br>aplica&#231;&#227;o da norma ao caso concreto, entende-se presentes os<br>requisitos autorizadores &#224; concess&#227;o da liminar requerida, uma vez<br>que o artigo 13, &#167; 1&#176;, da Lei n. 7.347/85 estabelece que a<br>condena&#231;&#227;o em dinheiro ser&#225; revertida a um fundo do qual<br>participar&#225;, necessariamente, o Minist&#233;rio P&#250;blico e os recursos<br>ser&#227;o destinados &#224; reconstitui&#231;&#227;o dos bens lesados. Na aus&#234;ncia<br>de regulamenta&#231;&#227;o do referido fundo o dinheiro ser&#225; depositado em<br>estabelecimento oficial de cr&#233;dito.</font><br><font class=\"content-small \">Na esfera trabalhista, ante a aus&#234;ncia do fundo federal mencionado<br>na lei, foi pacificado entendimento no sentido de que eventuais<br>valores pecuni&#225;rios devem reverter ao Fundo de Amparo ao<br>Trabalhador (FAT), tendo em vista que a norma objetiva reparar o<br>dano social, da&#237; porque os recursos devem ser destinados &#224;<br>comunidade lesada.</font><br><font class=\"content-small \">Ademais, os sindicatos possuem suas fontes de receita para<br>proporcionar o custeio de suas atividades, dentre estas, as<br>fiscaliza&#231;&#245;es e implementa&#231;&#245;es de pol&#237;ticas que visem educar os<br>empregadores a cumprir e fazerem cumprir as legisla&#231;&#245;es vigentes,<br>n&#227;o se justificando a destina&#231;&#227;o dos valores porventura decorrentes<br>desta a&#231;&#227;o civil p&#250;blica para fazer frente a despesas para as quais<br>possui, originariamente, a correspondente fonte de custeio.</font><br><font class=\"content-small \">Com estes fundamentos, defiro o pedido liminar, determinando a<br>suspens&#227;o dos efeitos da senten&#231;a homologat&#243;ria do acordo<br>firmado nos autos da Reclama&#231;&#227;o Trabalhista 0002102&#172;<br>55.2013.5.08.0110, no que se refere &#224; destina&#231;&#227;o dos valores<br>eventualmente executados em decorr&#234;ncia da multa ali prevista&quot;.<br>Nestes termos, com base no que prescreve o artigo 13 da Lei<br>7.347/85, julga-se procedente a a&#231;&#227;o rescis&#243;ria.</font><br><font class=\"content-small \">1. De Pl&#225;cido e Silva. Vocabul&#225;rio</font><br><font class=\"content-small \">Jur&#237;dico. Volume III. p. 1043). MULTA COMPENSAT&#211;RIA: Segundo<br>o sentido do adjetivo, que qualifica a esp&#233;cie, &#233; a que se institui no<br>contrato, representando a pr&#233;via determina&#231;&#227;o dos preju&#237;zos, que<br>possam advir pela inexecu&#231;&#227;o do contrato, como indeniza&#231;&#227;o ou<br>pagamento, que venha contrabalan&#231;ar o montante dos mesmos<br>preju&#237;zos. Estes preju&#237;zos entendem-se as perdas e danos<br>resultantes ou consequentes da falta de cumprimento do contrato.<br>Nela, assim, n&#227;o est&#225; inclu&#237;da a multa morat&#243;ria, entendida como os<br>juros que s&#227;o devidos pela incurs&#227;o em mora do contratante<br>relapso, ou a que se convenciona, para ser devida pelo<br>retardamento do contrato. Consistindo a multa compensat&#243;ria numa<br>justa indeniza&#231;&#227;o pelo n&#227;o cumprimento da obriga&#231;&#227;o, entende-que<br>o pedido deve recair ou nela ou na obriga&#231;&#227;o, n&#227;o nas duas. Torna-<br>se, pois, alternativa, cabendo a escolha ao credor. A multa<br>compensat&#243;ria, que se distingue pelo car&#225;ter de indeniza&#231;&#227;o que</font><br><font class=\"content-small \">traz consigo, &#233; tamb&#233;m conhecida pelas denomina&#231;&#245;es de multa<br>contratual, multa convencional, pena convencional ou cl&#225;usula<br>penal.</font><br><font class=\"content-small content-bold \">Recurso da parte<br>Item de recurso<br>Conclus&#227;o do recurso</font><br><font class=\"content-small \">Ante o exposto, admito a presente a&#231;&#227;o; no m&#233;rito, acolhem-se os<br>pedidos para, em ju&#237;zo rescindendo, desconstituir parcialmente a<br>senten&#231;a homologat&#243;ria do acordo nos autos da A&#231;&#227;o Civil P&#250;blica<br>0002102-55.2013.5.08.0110 no que diz respeito &#224; destina&#231;&#227;o de<br>valores eventualmente executados a t&#237;tulo de multa por<br>descumprimento do acordo e, em ju&#237;zo rescis&#243;rio, determinar que<br>referido valor decorrente das multas por abertura de<br>estabelecimento em dias feriados e por empregado que trabalhar no<br>respectivo feriado seja destinado integralmente ao Fundo de<br>Amparo ao Trabalho (FAT), mantendo a senten&#231;a homologat&#243;ria em<br>seus demais termos. Custas, pelos r&#233;us, pro rata, na quantia de<br>R$20,00 (vinte reais) sobre o valor da a&#231;&#227;o, R$1.000,00 (um mil<br>reais).</font><br><font class=\"content-small content-bold \">Ac&#243;rd&#227;o</font><br><font class=\"content-small \">ACORDAM OS DESEMBARGADORES DA SE&#199;&#195;O<br>ESPECIALIZADA I, DO TRIBUNAL REGIONAL DO TRABALHO DA<br>OITAVA REGI&#195;O, UNANIMEMENTE, EM ADMITIR A PRESENTE<br>A&#199;&#195;O; NO M&#201;RITO, por maioria de votos, vencido o<br>Excelent&#237;ssimo Desembargador Walter Roberto Paro,, acolhem-se<br>os pedidos para, em ju&#237;zo rescindendo, desconstituir parcialmente a<br>senten&#231;a homologat&#243;ria do acordo nos autos da A&#231;&#227;o Civil P&#250;blica<br>0002102-55.2013.5.08.0110 no que diz respeito &#224; destina&#231;&#227;o de<br>valores eventualmente executados a t&#237;tulo de multa por<br>descumprimento do acordo e, em ju&#237;zo rescis&#243;rio, determinar que<br>referido valor decorrente das multas por abertura de<br>estabelecimento em dias feriados e por empregado que trabalhar no<br>respectivo feriado seja destinado integralmente ao Fundo de<br>Amparo ao Trabalho (FAT); sem diverg&#234;ncia, manter a senten&#231;a<br>homologat&#243;ria do acordo em seus demais termos. Custas, pelos<br>r&#233;us, pro rata, na quantia de R$20,00 (vinte reais) sobre o valor da<br>a&#231;&#227;o, R$1.000,00 (um mil reais).</font><br><font class=\"content-small \">Sala de Sess&#245;es da Se&#231;&#227;o Especializada I, do Tribunal Regional do<br>Trabalho da Oitava Regi&#227;o. Bel&#233;m, 12 de fevereiro de 2015.</font><br><font class=\"content-small content-bold \">ROSITA DE NAZAR&#201; SIDRIM NASSAR - Relatora</font>",
    "data": "2015-02-13T00:00:00.000000Z",
    "letras_processo": "AR",
    "subprocesso": null,
    "elasticsearch_status": "INDEXED",
    "created_at": null,
    "updated_at": null,
    "descricao_pequena": "Movimentação do processo AR-0000000-00.0000.0.00.0000",
    "diario_oficial": "13/02/2015 | TRT-8 - Judiciário",
    "estado": "Pará e Amapá",
    "envolvidos": [
        {
            "id": 1,
            "nome": "Fulano de tal",
            "objeto_type": "Pessoa",
            "pivot_tipo": "AUTOR",
            "pivot_outros": "NAO",
            "pivot_extra_nome": null,
            "link": "https://www.escavador.com/sobre/1/fulano-de-tal",
            "link_api": "https://api.escavador.com/api/v1/pessoas/1",
            "nome_sem_filtro": "Procuradoria Regional do",
            "envolvido_tipo": "Autor",
            "envolvido_extra_nome": "",
            "oab": "",
            "advogado_de": null
        }
    ],
    "link": "https://www.escavador.com/diarios/1/TRT-8/J/2015-02-13/1/movimentacao-do-processo-0000000-0000000000000",
    "link_api": "https://api.escavador.com/api/v1/movimentacoes/1",
    "data_formatada": "13/02/2015",
    "objeto_type": "Movimentacao",
    "link_pdf": null,
    "link_pdf_api": null,
    "snippet": "TRABALHO DA 8a REGIAO R&#201;U KEDNA VIDAL FERREIRA 73442488249 R&#201;U SINDICATO DOS EMPREGADOS NO COMERCIO DO ESTADO DO PARA PODER JUDICI&#193;RIO JUSTI&#199;A DO TRABALHO...",
    "processo": {
        "id": 1,
        "numero_antigo": null,
        "numero_novo": "0000000-00.0000.0.00.0000",
        "is_cnj": 1,
        "enviado_trimon_em": "2022-01-23 14:55:35",
        "created_at": null,
        "updated_at": null,
        "origem_tribunal_id": 19,
        "filtrado_em": null,
        "enviado_nursery_em": null,
        "link": "https://www.escavador.com/processos/1/processo-0000000-0000000000000-do-trt-da-8-regiao",
        "link_api": "https://api.escavador.com/api/v1/processos/1",
        "data_movimentacoes": "24/02/2014 a 13/02/2015",
        "data_primeira_movimentacao": "24/02/2014",
        "url": {
            "id": 1,
            "slug": "processo-0000000-0000000000000-do-trt-da-8-regiao",
            "objeto_type": "Processo",
            "objeto_id": 1,
            "redirect": null,
            "created_at": null,
            "anuncio_ocultado_em": null
        }
    },
    "url": {
        "id": 1,
        "slug": "movimentacao-do-processo-0000000-0000000000000",
        "objeto_type": "Movimentacao",
        "objeto_id": 1,
        "redirect": null,
        "created_at": null,
        "anuncio_ocultado_em": null
    }
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

## Tribunais e Órgãos Administrativos

### GET /api/v1/tribunal/origens

**Retornar Sistemas dos tribunais disponíveis**

Retorna os sistemas de tribunais disponíveis no Escavador.



#### Campos da origem

Campo|Tipo|Descrição
----|----|----
sigla | string | Sigla do tribunal
nome | string | Nome do tribunal
busca_processo | integer | Se tem a busca de processo disponível
busca_nome | integer | Se tem a busca e monitoramento por nome da parte disponível
busca_oab | integer | Se tem a busca e monitoramento por OAB disponível
busca_documento | integer | Se tem a busca e monitoramento por CPF ou CNPJ disponível
disponivel_autos | integer | Se os autos estão disponíveis
documentos_publicos | integer | Se retorna os documentos públicos de um processo
utilizar_certificado_digital | integer | Se é possível utilizar certificado digital na busca

- Requer autenticação: sim

#### Responses

- Status 200
```json
{
    "items": [
        {
            "sigla": "STF",
            "nome": "Supremo Tribunal Federal",
            "busca_processo": 1,
            "busca_nome": 1,
            "busca_oab": 0,
            "busca_documento": 0,
            "disponivel_autos": 0,
            "documentos_publicos": 1,
            "utilizar_certificado_digital": 0
        },
        {
            "sigla": "CNJ",
            "nome": "Conselho Nacional de Justiça",
            "busca_processo": 1,
            "busca_nome": 1,
            "busca_oab": 1,
            "busca_documento": 1,
            "disponivel_autos": 1,
            "documentos_publicos": 1,
            "utilizar_certificado_digital": 0
        },
        {
            "sigla": "STJ",
            "nome": "Superior Tribunal de Justiça",
            "busca_processo": 1,
            "busca_nome": 1,
            "busca_oab": 0,
            "busca_documento": 0,
            "disponivel_autos": 1,
            "documentos_publicos": 1,
            "utilizar_certificado_digital": 0
        }
    ]
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### GET /api/v1/tribunal/origens/{origem}

**Retornar detalhes de um Tribunal**

Retorna os detalhes de um tribunal específico, mostrando as opções disponíveis e custos.



#### Campos da origem

Campo|Tipo|Descrição
----|----|----
sigla | string | Sigla do tribunal
nome | string | Nome do tribunal
busca_processo | integer | Se tem a busca de processo disponível
busca_nome | integer | Se tem a busca e monitoramento por nome da parte disponível
busca_oab | integer | Se tem a busca e monitoramento por OAB disponível
busca_documento | integer | Se tem a busca e monitoramento por CPF ou CNPJ disponível
disponivel_autos | integer | Se os autos estão disponíveis
documentos_publicos | integer | Se retorna os documentos públicos de um processo
utilizar_certificado_digital | integer | Se é possível utilizar certificado digital na busca

- Requer autenticação: sim

#### URL Params

- `origem` (string, required): 

#### Responses

- Status 200
```json
{
    "sigla": "STF",
    "nome": "Supremo Tribunal Federal",
    "busca_processo": 1,
    "busca_nome": 1,
    "busca_oab": 0,
    "busca_documento": 0,
    "disponivel_autos": 0,
    "documentos_publicos": 1,
    "utilizar_certificado_digital": 0
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### GET /api/v1/orgao-administrativo/origens

**Retornar Órgãos administrativos disponíveis**

Retorna os órgãos administrativos disponíveis no Escavador.



#### Campos da origem

Campo|Tipo|Descrição
----|----|----
sigla | string | Sigla do órgão administrativo
nome | string | Nome do órgão administrativo
busca_processo | integer | Se tem a busca de processo disponível
busca_nome | integer | Se tem a busca e monitoramento por nome da parte disponível
busca_oab | integer | Se tem a busca e monitoramento por OAB disponível
busca_documento | integer | Se tem a busca e monitoramento por CPF ou CNPJ disponível
disponivel_autos | integer | Se os autos estão disponíveis
documentos_publicos | integer | Se retorna os documentos públicos de um processo
utilizar_certificado_digital | integer | Se é possível utilizar certificado digital na busca

- Requer autenticação: sim

#### Responses

- Status 200
```json
{
    "items": [
        {
            "sigla": "MTE",
            "nome": "Ministério do Trabalho e Emprego",
            "busca_processo": 1,
            "busca_nome": 0,
            "busca_oab": 0,
            "busca_documento": 0,
            "disponivel_autos": 0,
            "documentos_publicos": 0,
            "utilizar_certificado_digital": 0
        },
        {
            "sigla": "ANP",
            "nome": "Agência Nacional do Petróleo",
            "busca_processo": 1,
            "busca_nome": 0,
            "busca_oab": 0,
            "busca_documento": 0,
            "disponivel_autos": 0,
            "documentos_publicos": 0,
            "utilizar_certificado_digital": 0
        },
        {
            "sigla": "SUSEP",
            "nome": "Superintendência de Seguros Privados",
            "busca_processo": 1,
            "busca_nome": 0,
            "busca_oab": 0,
            "busca_documento": 0,
            "disponivel_autos": 0,
            "documentos_publicos": 0,
            "utilizar_certificado_digital": 0
        },
        {
            "sigla": "ME",
            "nome": "Ministério da Economia",
            "busca_processo": 1,
            "busca_nome": 0,
            "busca_oab": 0,
            "busca_documento": 0,
            "disponivel_autos": 0,
            "documentos_publicos": 0,
            "utilizar_certificado_digital": 0
        }
    ]
}
```

- Status 401
```json
{
    "error": "Unauthenticated"
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

## Busca Assíncrona

### GET /api/v1/async/resultados

**Todos os resultados das buscas assíncronas**

Consultar todos os resultados das buscas assíncronas (Busca de <a href="/v1/docs/processos#pesquisar-processo-no-site-do-tribunal-assncrono">processos</a>,
<a href="/v1/docs/processos#pesquisar-processos-no-site-do-tribunal-por-cpf-ou-cnpj-assncrono">documentos</a>,
<a href="/v1/docs/processos#pesquisar-processos-no-site-do-tribunal-por-nome-do-envolvido-assncrono">nomes</a> e
<a href="/v1/docs/processos#pesquisar-processos-no-site-do-tribunal-por-oab-assncrono">OABs</a> em sistemas de tribunais).



### Tipos de busca assíncrona
Campo | Descrição
--------- | -------
BUSCA_POR_NOME|Busca processos pelo nome em tribunais.
BUSCA_POR_DOCUMENTO | Busca processos pelo documento (CPF ou CNPJ) em tribunais.
BUSCA_PROCESSO | Busca processo pela numeração CNJ.

- Requer autenticação: sim

#### Responses

- Status 200
```json
{
    "items": [
        {
            "id": 1,
            "created_at": {
                "date": "2022-08-16 13:27:15",
                "timezone_type": 3,
                "timezone": "UTC"
            },
            "enviar_callback": "NAO",
            "link_api": "https://api.escavador.com/api/v1/async/resultados/1",
            "resposta": [
                {
                    "nome": "ESAJ",
                    "url": "https://esaj.tjsp.jus.br/cpopg/open.do",
                    "instancia": "PRIMEIRO_GRAU",
                    "status": "ok",
                    "sistema_limitou_resultados": false,
                    "mensagem": null,
                    "processos": [
                        {
                            "numero_unico": "0000000-00.0000.0.00.0000",
                            "data": "15/08/2022",
                            "url": "https://esaj.tjsp.jus.br/cpopg/show.do?processo.codigo=4H000927U0000&processo",
                            "sistema": "ESAJ",
                            "instancia": "PRIMEIRO_GRAU",
                            "extra_instancia": "4H000927U0000"
                        },
                        {
                            "numero_unico": "0000000-00.0000.0.00.0000",
                            "data": "15/08/2022",
                            "url": "https://esaj.tjsp.jus.br/cpopg/show.do?processo.codigo=05001FMUR0000&processo",
                            "sistema": "ESAJ",
                            "instancia": "PRIMEIRO_GRAU",
                            "extra_instancia": "05001FMUR0000"
                        },
                        {
                            "numero_unico": "0000000-00.0000.0.00.0000",
                            "data": "04/08/2022",
                            "url": "https://esaj.tjsp.jus.br/cpopg/show.do?processo.codigo=0G0009CIF0000&processo",
                            "sistema": "ESAJ",
                            "instancia": "PRIMEIRO_GRAU",
                            "extra_instancia": "0G0009CIF0000"
                        }
                    ]
                },
                {
                    "nome": "ESAJ",
                    "url": "https://esaj.tjsp.jus.br/cposg/open.do",
                    "instancia": "SEGUNDO_GRAU",
                    "status": "ok",
                    "sistema_limitou_resultados": false,
                    "mensagem": null,
                    "processos": []
                }
            ],
            "status": "SUCESSO",
            "motivo_erro": null,
            "status_callback": null,
            "tipo": "BUSCA_POR_DOCUMENTO",
            "opcoes": null,
            "tribunal": {
                "sigla": "TJSP",
                "nome": "Tribunal de Justiça de São Paulo",
                "busca_processo": 1,
                "busca_nome": 1,
                "busca_oab": 1,
                "disponivel_autos": 1,
                "busca_documento": 1,
                "quantidade_creditos_busca_processo": 5,
                "quantidade_creditos_busca_nome": 7,
                "quantidade_creditos_busca_documento": 7,
                "quantidade_creditos_busca_oab": 7
            },
            "valor": "00.000.000/0000-00"
        },
        {
            "id": 2,
            "created_at": {
                "date": "2023-02-24 13:48:12",
                "timezone_type": 3,
                "timezone": "UTC"
            },
            "enviar_callback": "NAO",
            "link_api": "https://api.escavador.com/api/v1/async/resultados/7867247",
            "numero_processo": "0000000-00.0000.0.00.0000",
            "resposta": {
                "numero_unico": "0000000-00.0000.0.00.0000",
                "origem": "TJBA",
                "instancias": [
                    {
                        "url": "https://consultapublicapje.tjba.jus.br/pje/ConsultaPublica/listView.seam",
                        "sistema": "PJE",
                        "instancia": "PRIMEIRO_GRAU",
                        "extra_instancia": "",
                        "segredo": false,
                        "numero": null,
                        "assunto": "DIREITO TRIBUTÁRIO (14) - Impostos (5916) - IPTU/ Imposto Predial e Territorial Urbano (5952",
                        "classe": "EXECUÇÃO FISCAL (1116)",
                        "area": null,
                        "data_distribuicao": "10/09/2021",
                        "orgao_julgador": "13ª V DA FAZENDA PÚBLICA DE SALVADOR",
                        "moeda_valor_causa": null,
                        "valor_causa": null,
                        "arquivado": false,
                        "data_arquivamento": null,
                        "fisico": null,
                        "last_update_time": "24/02/2023 14:11",
                        "situacoes": [],
                        "dados": [],
                        "partes": [
                            {
                                "id": 1,
                                "tipo": "EXEQUENTE",
                                "nome": "SECRETARIA DE DESENVOLVIMENTO URBANO",
                                "principal": true,
                                "polo": "ATIVO",
                                "documento": {
                                    "tipo": null,
                                    "numero": null
                                }
                            },
                            {
                                "id": 2,
                                "tipo": "EXECUTADO",
                                "nome": "Maria",
                                "principal": true,
                                "polo": "PASSIVO",
                                "documento": {
                                    "tipo": "CPF",
                                    "numero": "000.000.000-00"
                                }
                            }
                        ],
                        "movimentacoes": [
                            {
                                "id": 13,
                                "data": "15/02/2023",
                                "conteudo": "Expedição de sentença."
                            },
                            {
                                "id": 12,
                                "data": "15/02/2023",
                                "conteudo": "Disponibilizado no DJ Eletrônico em #Não preenchido#"
                            },
                            {
                                "id": 11,
                                "data": "07/10/2022",
                                "conteudo": "Expedição de decisão."
                            },
                            {
                                "id": 10,
                                "data": "07/10/2022",
                                "conteudo": "Extinto o processo por ausência de pressupostos processuais"
                            },
                            {
                                "id": 9,
                                "data": "07/10/2022",
                                "conteudo": "Sentença (Sentença)"
                            },
                            {
                                "id": 8,
                                "data": "01/10/2022",
                                "conteudo": "Conclusos para decisão"
                            },
                            {
                                "id": 7,
                                "data": "24/05/2022",
                                "conteudo": "Decorrido prazo de SECRETARIA DE DESENVOLVIMENTO URBANO DE SALVADOR em 23/05/2022 23:59."
                            },
                            {
                                "id": 6,
                                "data": "25/04/2022",
                                "conteudo": "Juntada de Petição de Petição (outras)"
                            },
                            {
                                "id": 5,
                                "data": "01/04/2022",
                                "conteudo": "Expedição de decisão."
                            },
                            {
                                "id": 4,
                                "data": "08/03/2022",
                                "conteudo": "Decisão de Saneamento e de Organização do Processo"
                            },
                            {
                                "id": 3,
                                "data": "08/03/2022",
                                "conteudo": "Decisão (Decisão)"
                            },
                            {
                                "id": 2,
                                "data": "10/09/2021",
                                "conteudo": "Conclusos para despacho"
                            },
                            {
                                "id": 1,
                                "data": "10/09/2021",
                                "conteudo": "Distribuído por sorteio"
                            }
                        ],
                        "audiencias": []
                    }
                ]
            },
            "status": "SUCESSO",
            "motivo_erro": null,
            "status_callback": null,
            "tipo": "BUSCA_PROCESSO",
            "opcoes": null,
            "tribunal": {
                "sigla": "TJBA",
                "nome": "Tribunal de Justiça da Bahia",
                "busca_processo": 1,
                "busca_nome": 1,
                "busca_oab": 1,
                "busca_documento": 1,
                "disponivel_autos": 1,
                "documentos_publicos": 1,
                "quantidade_creditos_busca_processo": 5,
                "quantidade_creditos_busca_nome": 7,
                "quantidade_creditos_busca_documento": 7,
                "quantidade_creditos_busca_oab": 7
            },
            "valor": "0000000-00.0000.0.00.0000"
        },
        {
            "id": 3,
            "created_at": {
                "date": "2022-08-16 12:43:26",
                "timezone_type": 3,
                "timezone": "UTC"
            },
            "enviar_callback": "NAO",
            "link_api": "https://api.escavador.com/api/v1/async/resultados/3",
            "resposta": [
                {
                    "nome": "PROJUDI",
                    "url": "https://sistemas.tjes.jus.br/projudi/publico/buscas/ProcessosParte",
                    "instancia": null,
                    "status": "ok",
                    "sistema_limitou_resultados": false,
                    "mensagem": null,
                    "processos": []
                },
                {
                    "nome": "PJE",
                    "url": "https://sistemas.tjes.jus.br/pje/ConsultaPublica/listView.seam",
                    "instancia": "PRIMEIRO_GRAU",
                    "status": "ok",
                    "sistema_limitou_resultados": false,
                    "mensagem": null,
                    "processos": [
                        {
                            "numero_unico": "0000000-00.0000.0.00.0000",
                            "data": null,
                            "url": "https://sistemas.tjes.jus.br/pje/ConsultaPublica/listView.seam",
                            "sistema": "PJE",
                            "instancia": "PRIMEIRO_GRAU",
                            "extra_instancia": null
                        }
                    ]
                },
                {
                    "nome": "PJE",
                    "url": "https://sistemas.tjes.jus.br/pje2g/ConsultaPublica/listView.seam",
                    "instancia": "TURMA_RECURSAL",
                    "status": "ok",
                    "sistema_limitou_resultados": false,
                    "mensagem": null,
                    "processos": []
                }
            ],
            "status": "SUCESSO",
            "motivo_erro": null,
            "status_callback": "NAO_ENVIADO",
            "tipo": "BUSCA_POR_NOME",
            "opcoes": null,
            "tribunal": {
                "sigla": "TJES",
                "nome": "Tribunal de Justiça do Espírito Santo",
                "busca_processo": 1,
                "busca_nome": 1,
                "busca_oab": 1,
                "busca_documento": 1,
                "disponivel_autos": 1,
                "documentos_publicos": 1,
                "quantidade_creditos_busca_processo": 5,
                "quantidade_creditos_busca_nome": 7,
                "quantidade_creditos_busca_documento": 7,
                "quantidade_creditos_busca_oab": 7
            },
            "valor": "MARIA"
        }
    ],
    "links": {
        "prev": null,
        "next": "https://api.escavador.com/api/v1/async/resultados?page=2",
        "first": "https://api.escavador.com/api/v1/async/resultados?page=1",
        "last": "https://api.escavador.com/api/v1/async/resultados?page=2"
    },
    "paginator": {
        "current_page": 1,
        "per_page": 20,
        "total": 21,
        "total_pages": 2
    }
}
```

### GET /api/v1/async/resultados/{id}

**Resultado específico de uma busca assíncrona**

Consultar um resultado específico de uma busca assíncrona (Busca de <a href="/v1/docs/processos#pesquisar-processo-no-site-do-tribunal-assncrono">processos</a>,
<a href="/v1/docs/processos#pesquisar-processos-no-site-do-tribunal-por-cpf-ou-cnpj-assncrono">documentos</a>,
<a href="/v1/docs/processos#pesquisar-processos-no-site-do-tribunal-por-nome-do-envolvido-assncrono">nomes</a> e
<a href="/v1/docs/processos#pesquisar-processos-no-site-do-tribunal-por-nome-do-envolvido-assncrono">OABs </a> em sistemas de tribunais).

- Requer autenticação: sim

#### URL Params

- `id` (integer, required): Identificador numérico do resultado da busca.

#### Responses

- Status 200
```json
{
    "id": 2,
    "created_at": {
        "date": "2023-02-24 13:48:12",
        "timezone_type": 3,
        "timezone": "UTC"
    },
    "enviar_callback": "NAO",
    "link_api": "https://api.escavador.com/api/v1/async/resultados/7867247",
    "numero_processo": "0000000-00.0000.0.00.0000",
    "resposta": {
        "numero_unico": "0000000-00.0000.0.00.0000",
        "origem": "TJBA",
        "instancias": [
            {
                "url": "https://consultapublicapje.tjba.jus.br/pje/ConsultaPublica/listView.seam",
                "sistema": "PJE",
                "instancia": "PRIMEIRO_GRAU",
                "extra_instancia": "",
                "segredo": false,
                "numero": null,
                "assunto": "DIREITO TRIBUTÁRIO (14) - Impostos (5916) - IPTU/ Imposto Predial e Territorial Urbano (5952",
                "classe": "EXECUÇÃO FISCAL (1116)",
                "area": null,
                "data_distribuicao": "10/09/2021",
                "orgao_julgador": "13ª V DA FAZENDA PÚBLICA DE SALVADOR",
                "moeda_valor_causa": null,
                "valor_causa": null,
                "arquivado": false,
                "data_arquivamento": null,
                "fisico": null,
                "last_update_time": "24/02/2023 14:11",
                "situacoes": [],
                "dados": [],
                "partes": [
                    {
                        "id": 1,
                        "tipo": "EXEQUENTE",
                        "nome": "SECRETARIA DE DESENVOLVIMENTO URBANO",
                        "principal": true,
                        "polo": "ATIVO",
                        "documento": {
                            "tipo": null,
                            "numero": null
                        }
                    },
                    {
                        "id": 2,
                        "tipo": "EXECUTADO",
                        "nome": "Maria",
                        "principal": true,
                        "polo": "PASSIVO",
                        "documento": {
                            "tipo": "CPF",
                            "numero": "868.589.205-87"
                        }
                    }
                ],
                "movimentacoes": [
                    {
                        "id": 13,
                        "data": "15/02/2023",
                        "conteudo": "Expedição de sentença."
                    },
                    {
                        "id": 12,
                        "data": "15/02/2023",
                        "conteudo": "Disponibilizado no DJ Eletrônico em #Não preenchido#"
                    },
                    {
                        "id": 11,
                        "data": "07/10/2022",
                        "conteudo": "Expedição de decisão."
                    },
                    {
                        "id": 10,
                        "data": "07/10/2022",
                        "conteudo": "Extinto o processo por ausência de pressupostos processuais"
                    },
                    {
                        "id": 9,
                        "data": "07/10/2022",
                        "conteudo": "Sentença (Sentença)"
                    },
                    {
                        "id": 8,
                        "data": "01/10/2022",
                        "conteudo": "Conclusos para decisão"
                    },
                    {
                        "id": 7,
                        "data": "24/05/2022",
                        "conteudo": "Decorrido prazo de SECRETARIA DE DESENVOLVIMENTO URBANO DE SALVADOR em 23/05/2022 23:59."
                    },
                    {
                        "id": 6,
                        "data": "25/04/2022",
                        "conteudo": "Juntada de Petição de Petição (outras)"
                    },
                    {
                        "id": 5,
                        "data": "01/04/2022",
                        "conteudo": "Expedição de decisão."
                    },
                    {
                        "id": 4,
                        "data": "08/03/2022",
                        "conteudo": "Decisão de Saneamento e de Organização do Processo"
                    },
                    {
                        "id": 3,
                        "data": "08/03/2022",
                        "conteudo": "Decisão (Decisão)"
                    },
                    {
                        "id": 2,
                        "data": "10/09/2021",
                        "conteudo": "Conclusos para despacho"
                    },
                    {
                        "id": 1,
                        "data": "10/09/2021",
                        "conteudo": "Distribuído por sorteio"
                    }
                ],
                "audiencias": []
            }
        ]
    },
    "status": "SUCESSO",
    "motivo_erro": null,
    "status_callback": null,
    "tipo": "BUSCA_PROCESSO",
    "opcoes": null,
    "tribunal": {
        "sigla": "TJBA",
        "nome": "Tribunal de Justiça da Bahia",
        "busca_processo": 1,
        "busca_nome": 1,
        "busca_oab": 1,
        "busca_documento": 1,
        "disponivel_autos": 1,
        "documentos_publicos": 1,
        "quantidade_creditos_busca_processo": 5,
        "quantidade_creditos_busca_nome": 7,
        "quantidade_creditos_busca_documento": 7,
        "quantidade_creditos_busca_oab": 7
    },
    "valor": "0000000-00.0000.0.00.0000"
}
```

- Status 200
```json
{
    "id": 1,
    "created_at": {
        "date": "2023-04-27 17:35:16",
        "timezone_type": 3,
        "timezone": "UTC"
    },
    "enviar_callback": "NAO",
    "link_api": "https://api.escavador.com/api/v1/async/resultados/1",
    "numero_processo": "0000000-00.0000.0.00.0000",
    "resposta": {
        "message": "Nossos robôs não conseguiram acessar as informações no site do TRF1. Tente novamente mais tarde"
    },
    "status": "ERRO",
    "motivo_erro": null,
    "status_callback": null,
    "tipo": "BUSCA_PROCESSO",
    "opcoes": {
        "tentativas": 2,
        "documentos_publicos": true
    },
    "tribunal": {
        "sigla": "TRF1",
        "nome": "TRF da 1ª Região",
        "busca_processo": 1,
        "busca_nome": 1,
        "busca_oab": 1,
        "busca_documento": 1,
        "disponivel_autos": 1,
        "documentos_publicos": 1,
        "quantidade_creditos_busca_processo": 5,
        "quantidade_creditos_busca_nome": 7,
        "quantidade_creditos_busca_documento": 7,
        "quantidade_creditos_busca_oab": 7
    },
    "valor": "0000000-00.0000.0.00.0000"
}
```