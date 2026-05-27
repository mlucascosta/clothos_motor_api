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

Para mais informações, [fale conosco](https://www.escavador.com/fale-conosco).

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

Na API V2, é possível receber callbacks para diversos eventos, como o callback associado a uma solicitação de atualização de um processo.
Para fazer uso dessa funcionalidade, é necessário configurar uma URL de callback no painel da API.

### O que é um callback

Um callback (também chamado de webhook) é uma chamada HTTP enviada pela API para uma URL da sua aplicação sempre que um evento relevante acontece.
Em vez de sua aplicação consultar a API repetidamente para saber se houve atualização (polling), a API notifica você automaticamente.

### Como o mecanismo funciona

1. Você cadastra uma URL de callback no painel da API.
2. Um evento acontece na plataforma (por exemplo, atualização de processo ou novo resultado assíncrono).
3. A API envia uma requisição HTTP para a URL cadastrada, com os dados do evento.
4. Sua aplicação processa a notificação e retorna uma resposta HTTP de sucesso.

### Configurando uma URL de callback

Para configurar sua URL de callback, acesse a [página de callbacks](https://api.escavador.com/callbacks) no painel da API.
Nessa página, você pode informar a URL que receberá as notificações de eventos da API, como atualizações de processo e resultados assíncronos.
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
Visite a página de [histórico](https://api.escavador.com/v2/docs/#creditos) para saber como consultar seu saldo.
Consulte também a [página de preços](https://api.escavador.com/servicos) para saber mais sobre os custos de cada versão.

## Paginação

Algumas rotas da API utilizam paginação para retornar resultados em blocos menores, evitando respostas muito grandes e tornando o consumo da API mais eficiente.

Em geral, as respostas paginadas retornam:

- Os dados da página atual (em `items`)
- Metadados de paginação (como página atual, total de páginas e total de itens)
- Links para navegação entre páginas

Um exemplo comum de estrutura paginada é:

```
{
  "items": [{ "id": 1, "nome": "Exemplo" }],
  "links": {
    "first": "https://api.escavador.com/api/v2/recurso?page=1",
    "last": "https://api.escavador.com/api/v2/recurso?page=2",
    "prev": null,
    "next": "https://api.escavador.com/api/v2/recurso?page=2"
  },
  "meta": {
    "current_page": 1,
    "per_page": 25,
    "total": 50,
    "total_pages": 2
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

<aside class="notice">
⚠️ Na API do Escavador Business, o formato de paginação não é escolhido pelo consumidor da API.
Cada rota já define o modelo de paginação (numerada ou por cursor), e a integração deve seguir o contrato daquela rota.

Na prática:

- Se a rota retornar campos como `current_page`, `last_page` e `per_page`, trate como paginação numerada.
- Se a rota retornar cursor/ponteiro de continuidade, siga esse cursor para avançar na navegação.
- Sempre priorize os links e metadados devolvidos na resposta, em vez de montar URLs manualmente.
</aside>

### Como percorrer as páginas

1. Faça a primeira requisição conforme os parâmetros esperados pela rota.
2. Processe os itens retornados em `data`.
3. Use os metadados e links de paginação retornados (`next`, `current_page`, etc.).
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

## Certificados Digitais

### POST /api/v2/certificados

**Criar certificado digital**

Realiza o upload de um certificado.
Opcionalmente, permite enviar as configurações de 2FA no mesmo request.

<aside class="notice">
Para preencher corretamente as configurações, consulte as siglas válidas na rota
<a href="/v2/docs/tribunais#listar-tribunais-disponveis">Listar Tribunais disponíveis</a> e os sistemas compatíveis na rota
<a href="/v2/docs/tribunais#listar-sistemas-disponveis">Listar Sistemas disponíveis</a>.
</aside>

- Requer autenticação: sim

#### Body Params

- `certificado` (file, required): O arquivo do certificado digital (.pfx ou .p12).
- `senha` (string, required): A senha do certificado.
- `autenticacoes` (object[], optional): Lista de configurações de 2FA.
- `autenticacoes[].tribunal` (string, optional): A sigla do tribunal.
- `autenticacoes[].sistemas` (array<string>, optional): Lista com os nomes dos sistemas.
- `autenticacoes[].secret_2fa` (string, optional): O código secreto do 2FA.

#### Responses

- Status 201
```json
{
    "id": 17,
    "nome": "ANA MARIA",
    "cpf": "11111111111",
    "criado_em": "2025-06-10T13:40:27+00:00",
    "expira_em": "2026-06-10T00:00:00+00:00",
    "autenticacoes": [
        {
            "id": 1,
            "tribunal": "TRF4",
            "sistema": "EPROC",
            "criado_em": "2025-11-28T15:43:21+00:00",
            "atualizado_em": "2025-11-28T15:43:21+00:00"
        },
        {
            "id": 2,
            "tribunal": "TRF2",
            "sistema": "EPROC-SJES",
            "criado_em": "2025-11-28T17:12:41+00:00",
            "atualizado_em": "2025-11-28T17:12:41+00:00"
        },
        {
            "id": 3,
            "tribunal": "TRF2",
            "sistema": "EPROC-SJRJ",
            "criado_em": "2025-11-28T17:12:41+00:00",
            "atualizado_em": "2025-11-28T17:12:41+00:00"
        }
    ]
}
```

- Status 422
```json
{
    "code": "UNPROCESSABLE_ENTITY",
    "message": "Não foi possível processar a solicitação",
    "errors": [],
    "appends": null
}
```

### GET /api/v2/certificados

**Listar certificados digitais**

Retorna a lista paginada de certificados digitais vinculados à conta da organização.

- Requer autenticação: sim

#### Query Params

- `cpf` (string, optional): Filtra os certificados pelo CPF do titular.

#### Responses

- Status 200
```json
{
    "items": [
        {
            "id": 17,
            "nome": "ANA MARIA",
            "cpf": "11111111111",
            "criado_em": "2025-06-10T13:40:27+00:00",
            "expira_em": "2026-06-10T00:00:00+00:00"
        }
    ],
    "links": {
        "next": null,
        "prev": null,
        "first": "https://api.escavador.com/api/v2/certificados?page=1",
        "last": "https://api.escavador.com/api/v2/certificados?page=1"
    },
    "paginator": {
        "current_page": 1,
        "per_page": 20,
        "total": 1,
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

### GET /api/v2/certificados/{id}

**Buscar certificado digital**

Retorna os dados detalhados de um certificado específico, incluindo suas configurações de 2FA.

- Requer autenticação: sim

#### URL Params

- `id` (integer, required): O ID do certificado.

#### Responses

- Status 200
```json
{
    "id": 17,
    "nome": "ANA MARIA",
    "cpf": "11111111111",
    "criado_em": "2025-06-10T13:40:27+00:00",
    "expira_em": "2026-06-10T00:00:00+00:00",
    "autenticacoes": [
        {
            "id": 1,
            "tribunal": "TRF4",
            "sistema": "EPROC",
            "criado_em": "2025-11-28T15:43:21+00:00",
            "atualizado_em": "2025-11-28T15:43:21+00:00"
        },
        {
            "id": 2,
            "tribunal": "TRF2",
            "sistema": "EPROC-SJES",
            "criado_em": "2025-11-28T17:12:41+00:00",
            "atualizado_em": "2025-11-28T17:12:41+00:00"
        },
        {
            "id": 3,
            "tribunal": "TRF2",
            "sistema": "EPROC-SJRJ",
            "criado_em": "2025-11-28T17:12:41+00:00",
            "atualizado_em": "2025-11-28T17:12:41+00:00"
        }
    ]
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### DELETE /api/v2/certificados/{id}

**Remover um certificado**

Remove o certificado digital e todos as suas configurações de autenticação.

- Requer autenticação: sim

#### URL Params

- `id` (integer, required): O ID do certificado a ser excluído.

#### Responses

- Status 204
```json
{}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### POST /api/v2/certificados/{id}/autenticacoes

**Configurar autenticações**

Adiciona novas configurações de 2FA ou atualiza a secret de sistemas já vinculados ao certificado.
O que for enviado será criado/atualizado, o que não for enviado será mantido inalterado.

 <aside class="notice">
 Para preencher corretamente as configurações, consulte as siglas válidas na rota
 <a href="/v2/docs/tribunais#listar-tribunais-disponveis">Listar Tribunais disponíveis</a> e os sistemas compatíveis na rota
 <a href="/v2/docs/tribunais#listar-sistemas-disponveis">Listar Sistemas disponíveis</a>.
 </aside>

- Requer autenticação: sim

#### URL Params

- `id` (integer, required): O ID do certificado.

#### Body Params

- `autenticacoes` (object[], required): Lista de configurações.
- `autenticacoes[].tribunal` (string, required): A sigla do tribunal.
- `autenticacoes[].sistemas` (array<string>, required): Lista com os nomes dos sistemas.
- `autenticacoes[].secret_2fa` (string, required): O código secreto do 2FA.

#### Responses

- Status 200
```json
{
    "id": 17,
    "nome": "ANA MARIA",
    "cpf": "11111111111",
    "criado_em": "2025-06-10T13:40:27+00:00",
    "expira_em": "2026-06-10T00:00:00+00:00",
    "autenticacoes": [
        {
            "id": 1,
            "tribunal": "TRF4",
            "sistema": "EPROC",
            "criado_em": "2025-11-28T15:43:21+00:00",
            "atualizado_em": "2025-11-28T15:43:21+00:00"
        },
        {
            "id": 2,
            "tribunal": "TRF2",
            "sistema": "EPROC-SJES",
            "criado_em": "2025-11-28T17:12:41+00:00",
            "atualizado_em": "2025-11-28T17:12:41+00:00"
        },
        {
            "id": 3,
            "tribunal": "TRF2",
            "sistema": "EPROC-SJRJ",
            "criado_em": "2025-11-28T17:12:41+00:00",
            "atualizado_em": "2025-11-28T17:12:41+00:00"
        }
    ]
}
```

- Status 404
```json
{
    "error": "NotFound"
}
```

### DELETE /api/v2/certificados/{id}/autenticacoes/{autenticacaoId}

**Remover uma autenticação**

Remove a autenticação de um sistema específico deste certificado.

- Requer autenticação: sim

#### URL Params

- `id` (integer, required): O ID do certificado.
- `autenticacaoId` (integer, required): O ID da autenticação a ser removida.

#### Responses

- Status 204
```json
{}
```

## Tribunais

### GET /api/v2/tribunais/sistemas

**Listar Sistemas disponíveis**

Retorna a lista de sistemas dos tribunais.

- Requer autenticação: sim

#### Query Params

- `tribunais` (array, optional): Filtra os sistemas a partir das siglas de tribunais enviadas.
- `utiliza_certificado_digital` (boolean, optional): Filtra os sistemas que utilizam certificado digital.
- `utiliza_2fa` (boolean, optional): Filtra os sistemas que utilizam autenticação de dois fatores (2FA).

#### Responses

- Status 200
```json
{
    "items": [
        {
            "sistema_nome": "PJE",
            "tribunal_sigla": "CNJ",
            "tribunal_nome": "Conselho Nacional de Justiça",
            "utiliza_certificado_digital": 1,
            "utiliza_2fa": 1
        },
        {
            "sistema_nome": "SITE",
            "tribunal_sigla": "STF",
            "tribunal_nome": "Supremo Tribunal Federal",
            "utiliza_certificado_digital": 0,
            "utiliza_2fa": 0
        },
        {
            "sistema_nome": "ESAJ",
            "tribunal_sigla": "TJAL",
            "tribunal_nome": "Tribunal de Justiça de Alagoas",
            "utiliza_certificado_digital": 0,
            "utiliza_2fa": 0
        },
        {
            "sistema_nome": "PROJUDI",
            "tribunal_sigla": "TJAL",
            "tribunal_nome": "Tribunal de Justiça de Alagoas",
            "utiliza_certificado_digital": 0,
            "utiliza_2fa": 0
        },
        {
            "sistema_nome": "EPROC",
            "tribunal_sigla": "TJRS",
            "tribunal_nome": "Tribunal de Justiça do Rio Grande do Sul",
            "utiliza_certificado_digital": 1,
            "utiliza_2fa": 1
        },
        {
            "sistema_nome": "PJE",
            "tribunal_sigla": "TJRS",
            "tribunal_nome": "Tribunal de Justiça do Rio Grande do Sul",
            "utiliza_certificado_digital": 1,
            "utiliza_2fa": 1
        },
        {
            "sistema_nome": "tucujuris",
            "tribunal_sigla": "TJAP",
            "tribunal_nome": "Tribunal de Justiça do Amapá",
            "utiliza_certificado_digital": 0,
            "utiliza_2fa": 0
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

### GET /api/v2/tribunais

**Listar Tribunais disponíveis**

Retorna a lista de tribunais que são utilizados na V2, utilize essa rota caso queira filtrar os processos por tribunal nas rotas que possuem essa opção.

- Requer autenticação: sim

#### Query Params

- `estados` (array<string>, optional): Filtra os tribunais de acordo com os estados enviados.

#### Responses

- Status 200
```json
{
    "items": [
        {
            "nome": "Supremo Tribunal Federal",
            "sigla": "STF",
            "categoria": null,
            "estados": []
        },
        {
            "nome": "Tribunal Regional do Trabalho da 1ª Região",
            "sigla": "TRT-1",
            "categoria": null,
            "estados": [
                {
                    "nome": "Rio de Janeiro",
                    "sigla": "RJ"
                }
            ]
        },
        {
            "nome": "Tribunal Regional do Trabalho da 2ª Região",
            "sigla": "TRT-2",
            "categoria": null,
            "estados": [
                {
                    "nome": "São Paulo",
                    "sigla": "SP"
                }
            ]
        },
        {
            "nome": "Tribunal Regional do Trabalho da 3ª Região",
            "sigla": "TRT-3",
            "categoria": null,
            "estados": [
                {
                    "nome": "Minas Gerais",
                    "sigla": "MG"
                }
            ]
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

## Atualização de processos

### POST /api/v2/processos/lote/solicitar-atualizacao

**Solicitar atualização de processos em lote**

Solicita a atualização de múltiplos processos nos sistemas dos Tribunais.
Permite definir configurações globais (como download de autos ou uso de credenciais) que serão aplicadas a todos os processos do lote.
Cada processo do lote será validado individualmente. Se um processo já possuir uma atualização recente ou em andamento, ele será identificado na resposta de erro do lote.
A cobrança é realizada individualmente por processo criado.

- Requer autenticação: sim

#### Body Params

- `processos` (array, required): Lista de objetos contendo os números dos processos.
- `enviar_callback` (boolean, optional): Se `enviar_callback=1`, um callback será enviado para sua URL configurada para cada processo que concluir a atualização.
- `documentos_publicos` (boolean, optional): Se `documentos_publicos=1`, serão baixados os documentos públicos para todos os processos do lote.
- `autos` (boolean, optional): Se `autos=1`, baixa os autos completos dos processos do lote. Requer credenciais (`utilizar_certificado=1` ou `usuario` e `senha`) e não pode ser usado com `documentos_publicos`.
- `utilizar_certificado` (boolean, optional): Se `utilizar_certificado=1`, a autenticação das buscas que exigem login será feita com certificado digital.
- `certificado_id` (integer, optional): Se `utilizar_certificado=1`, você pode informar o ID do certificado a ser usado no lote. Se não for informado, um certificado válido cadastrado será selecionado aleatoriamente.
- `usuario` (string, optional): Usuário de acesso utilizado em cada busca aos tribunais deste lote (quando aplicável).
- `senha` (string, optional): Senha de acesso utilizada em cada busca aos tribunais deste lote (quando aplicável).
- `ignorar_atualizados` (boolean, optional): Se `ignorar_atualizados=1`, processos com atualização recente ou em andamento são ignorados sem erro individual; o lote só retorna erro se nenhum processo puder ser processado.

#### Responses

- Status 200
```json
{
    "id": 56,
    "status_geral": "PENDENTE",
    "criado_em": "2026-02-10T14:22:25+00:00",
    "total": 3,
    "pendente": 3,
    "sucesso": 0,
    "nao_encontrado": 0,
    "erro": 0,
    "processos": {
        "pendente": [
            {
                "numero_cnj": "08025173520198230010"
            },
            {
                "numero_cnj": "30012639320168060072"
            },
            {
                "numero_cnj": "10300069720158260114"
            }
        ],
        "sucesso": [],
        "nao_encontrado": [],
        "erro": []
    }
}
```

- Status 422
```json
{
    "code": "UNPROCESSABLE_ENTITY",
    "message": "Não foi possível processar a solicitação",
    "errors": {
        "processos.0.numero_cnj": [
            "O número do processo não está no formato CNJ."
        ]
    },
    "appends": null
}
```

- Status 422
```json
{
    "code": "UNPROCESSABLE_ENTITY",
    "message": "Não foi possível processar a solicitação",
    "errors": {
        "0802517-35.2019.8.23.0010": {
            "message": "Esse processo já está sendo atualizado.",
            "appends": {
                "ultima_verificacao": {
                    "id": 519,
                    "status": "NA_FILA",
                    "motivo_erro": null,
                    "criado_em": "2026-02-10T16:01:05+00:00",
                    "numero_cnj": "0802517-35.2019.8.23.0010",
                    "concluido_em": null,
                    "opcoes": [],
                    "enviar_callback": "NAO"
                }
            }
        },
        "3001263-93.2016.8.06.0072": {
            "message": "Esse processo já está sendo atualizado.",
            "appends": {
                "ultima_verificacao": {
                    "id": 520,
                    "status": "NA_FILA",
                    "motivo_erro": null,
                    "criado_em": "2026-02-10T16:01:05+00:00",
                    "numero_cnj": "3001263-93.2016.8.06.0072",
                    "concluido_em": null,
                    "opcoes": [],
                    "enviar_callback": "NAO"
                }
            }
        },
        "1030006-97.2015.8.26.0114": {
            "message": "Esse processo já está sendo atualizado.",
            "appends": {
                "ultima_verificacao": {
                    "id": 455,
                    "status": "NA_FILA",
                    "motivo_erro": null,
                    "criado_em": "2026-02-10T14:22:25+00:00",
                    "numero_cnj": "1030006-97.2015.8.26.0114",
                    "concluido_em": null,
                    "opcoes": [],
                    "enviar_callback": "NAO"
                }
            }
        }
    },
    "appends": null
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

### GET /api/v2/processos/lote/{id}/status

**Status de uma atualização de processos em lote**

Retorna o progresso atual de um lote de atualizações solicitado.

Os processos dentro do lote podem assumir diferentes estados individualmente, mas o lote é considerado concluído quando todos os seus processos saírem da fila de processamento.




### Status do Lote
Campo | Descrição
--------- | -------
PENDENTE | O lote foi criado, mas nenhum processo começou a ser atualizado.
PROCESSANDO | O lote possui processos em execução ou aguardando sincronização.
FINALIZADO | Todos os processos do lote terminaram sua execução (com sucesso ou erro).

- Requer autenticação: sim

#### URL Params

- `id` (string, required): O identificador único do lote retornado no momento da criação.

#### Responses

- Status 200
```json
{
    "id": 56,
    "status_geral": "FINALIZADO",
    "criado_em": "2026-02-10T14:22:25+00:00",
    "total": 3,
    "pendente": 0,
    "sucesso": 2,
    "nao_encontrado": 0,
    "erro": 1,
    "processos": {
        "pendente": [],
        "sucesso": [
            {
                "numero_cnj": "08025173520198230010"
            },
            {
                "numero_cnj": "30012639320168060072"
            }
        ],
        "nao_encontrado": [],
        "erro": [
            {
                "numero_cnj": "10300069720158260114",
                "motivo": "LOGIN_INVALIDO"
            }
        ]
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

### GET /api/v2/processos/numero_cnj/{numero}/status-atualizacao

**Status de uma atualização de processo**

Retorna o status de uma solicitação de atualização de um processo. Se nenhuma solicitação foi criada, retorna o status de atualização do processo.

Caso uma solicitação de processo tenha sido criada, esses são os possíveis status da solicitação:

Acesse a [página de respostas](/v2/docs/respostas#estrutura-statusatualizacaoprocesso) para detalhes sobre os dados retornados.




#### Status de atualização do Processo

O campo `ultima_verificacao.status`, que existe quando `ultima_verificacao` é diferente de `null`, indica o status geral da atualização do processo, considerando a última solicitação de atualização feita. Os possíveis valores são descritos na tabela abaixo:
Valor | Descrição
--------- | -------
PENDENTE | Aguardando o robô ir buscar as informações no Tribunal.
SUCESSO | Atualizou no Tribunal corretamente.
NAO_ENCONTRADO |  O robô não encontrou o processo no sistema do Tribunal (Processo físico, segredo de justiça, arquivado, etc).
ERRO | Teve alguma falha ao tentar atualizar o processo.

- Requer autenticação: sim

#### URL Params

- `numero` (string, required): Número único do processo. <b>Obrigatório estar no formato de CNJ.</b>

#### Responses

- Status 200
```json
{
    "numero_cnj": "0000000-00.0000.0.00.0000",
    "data_ultima_verificacao": "2023-03-02T21:31:56+00:00",
    "tempo_desde_ultima_verificacao": "há 2 meses",
    "ultima_verificacao": null
}
```

- Status 200
```json
{
    "numero_cnj": "0000000-00.0000.0.00.0000",
    "data_ultima_verificacao": "2023-03-02T21:31:56+00:00",
    "tempo_desde_ultima_verificacao": "há 2 meses",
    "ultima_verificacao": {
        "id": 1,
        "status": "PENDENTE",
        "criado_em": "2023-05-10T18:54:24+00:00",
        "concluido_em": "2023-05-10T18:54:24+00:00"
    }
}
```

- Status 200
```json
{
    "numero_cnj": "0000000-00.0000.0.00.0000",
    "data_ultima_verificacao": "2023-05-10T18:56:24+00:00",
    "tempo_desde_ultima_verificacao": "há 1 minuto",
    "ultima_verificacao": {
        "id": 1,
        "status": "SUCESSO",
        "criado_em": "2023-05-10T18:54:24+00:00",
        "concluido_em": "2023-05-10T18:56:33+00:00"
    }
}
```

- Status 200
```json
{
    "numero_cnj": "0000000-00.0000.0.00.0000",
    "data_ultima_verificacao": null,
    "tempo_desde_ultima_verificacao": null,
    "ultima_verificacao": null
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

### POST /api/v2/processos/numero_cnj/{numero}/solicitar-atualizacao

**Solicitar atualização de um processo**

Solicita a atualização de um processo nos sistemas dos Tribunais para obter as informações mais recentes. A operação é ideal para sincronizar dados e obter acesso a novos andamentos ou documentos.

É possível solicitar download dos documentos públicos ou dos autos do processo, que são documentos restritos e exigem autenticação. Para autenticação via certificado digital, você pode cadastrá-los em https://api.escavador.com/servicos. A escolha entre as opções afeta o custo da solicitação.

A atualização é uma tarefa assíncrona. Após o envio, você deve consultar o endpoint de status ou configurar um webhook para aguardar a conclusão. Com o status SUCESSO, os dados atualizados e os documentos estarão disponíveis para consulta nos endpoints apropriados.

- Requer autenticação: sim

#### URL Params

- `numero` (string, required): Número único do processo. <b>Obrigatório estar no formato de CNJ.</b>

#### Body Params

- `enviar_callback` (integer, optional): Se `enviar_callback=1`, um callback será enviado para sua URL configurada quando o processo for atualizado.
- `documentos_publicos` (integer, optional): Se `documentos_publicos=1`, serão baixados os documentos públicos do processo. Não pode ser usado junto com `autos=1`.
- `autos` (integer, optional): Se `autos=1`, serão baixados os autos completos do processo (documentos restritos). Requer autenticação via certificado ou usuário/senha. **Importante**: A API Escavador atualmente não possui suporte para acesso a autos em tribunais com a seguinte combinação de autenticação: a) usuário e senha; mais b) um segundo fator/multi fator de autenticação (2FA/MFA). Recomendamos verificar os requisitos de autenticação do tribunal específico para garantir o sucesso da solicitação de atualização.
- `utilizar_certificado` (boolean, optional): Se `utilizar_certificado=1`, um dos certificados cadastrados na sua conta será utilizado para a autenticação no tribunal. Obrigatório se `autos=1` e não for informado `usuario` e `senha`.
- `certificado_id` (integer, optional): O ID de um certificado específico que você cadastrou. Se não for enviado, um certificado aleatório da sua conta será selecionado.
- `usuario` (string, optional): Usuário de acesso ao sistema do tribunal. Obrigatório se `autos=1` e não for informado `utilizar_certificado=1`.
- `senha` (string, optional): Senha de acesso ao sistema do tribunal. Obrigatório se `autos=1` e não for informado `utilizar_certificado=1`.
- `documentos_especificos` (string, optional): Se `autos == 1`, você pode especificar quais documentos deseja receber.<br><code>INICIAIS</code>: Serão baixados somente os documentos da primeira data do processo.

#### Responses

- Status 200
```json
{
    "id": 125,
    "status": "PENDENTE",
    "numero_cnj": "0000000-00.0000.0.00.0000",
    "criado_em": "2023-05-10T19:09:43+00:00",
    "concluido_em": null
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

## Consulta de processos

### GET /api/v2/processos/numero_cnj/{numero}

**Processo por numeração CNJ**

Retorna dados completos da capa de um processo judicial brasileiro a partir da numeração CNJ.
Este endpoint fornece informações detalhadas da capa, incluindo partes envolvidas, audiências,
dados de todas as fontes (tribunais) onde o processo tramitou, e outras informações relevantes para acompanhamento processual.

Os dados retornados são da base do Escavador. Caso precise de informações mais recentes,
utilize a rota de [solicitar atualização de um processo](/v2/docs/atualizacao-de-processos#solicitar-atualizao-de-um-processo) e,
depois da conclusão, consulte novamente os endpoints do processo.




### Contexto de Uso

Este endpoint é fundamental para:
- Obter informações das partes envolvidas (autor, réu, advogados)
- Verificar dados da capa e audiências do processo
- Acessar dados de múltiplas instâncias (1º e 2º grau)
- Identificar assuntos jurídicos e classificações do processo

OBS: Caso precise consultar as movimentações do processo, utilize a rota de
[movimentações de um processo](/v2/docs/consulta-de-processos#movimentacoes-de-um-processo).

### Formato do Número CNJ

O número CNJ segue o padrão: `NNNNNNN-DD.AAAA.J.TT.OOOO`
- NNNNNNN: Número sequencial do processo
- DD: Dígitos verificadores
- AAAA: Ano de ajuizamento
- J: Segmento da justiça (8=Estadual, 4=Federal/TRF, 5=Trabalho, etc)
- TT: Tribunal
- OOOO: Vara/Origem

Exemplo: `0018063-19.2013.8.26.0002`

- Requer autenticação: sim

#### URL Params

- `numero` (string, required): Número único do processo no formato CNJ. Aceita formatos: `NNNNNNN-DD.AAAA.J.TT.OOOO` ou `NNNNNNNDDAAAAJTTOOOO` (20 dígitos sem formatação).

#### Responses

- Status 200
```json
{
    "numero_cnj": "1024000-20.2015.2.23.0000",
    "titulo_polo_ativo": "Maria da Conceição de Oliveira",
    "titulo_polo_passivo": "João da Silva",
    "ano_inicio": 2015,
    "data_inicio": "2015-11-21",
    "estado_origem": {
        "nome": "São Paulo",
        "sigla": "SP"
    },
    "unidade_origem": {
        "nome": "01 VARA JUIZADO ESPECIAL CIVEL DE CAMPINAS",
        "endereco": "Avenida Francisco Xavier de Arruda Camargo, 300",
        "classificacao": "JE - Juizado Especial",
        "cidade": "São Paulo",
        "estado": {
            "nome": "São Paulo",
            "sigla": "SP"
        },
        "tribunal_sigla": "TJSP"
    },
    "data_ultima_movimentacao": "2018-07-25",
    "quantidade_movimentacoes": 103,
    "fontes_tribunais_estao_arquivadas": false,
    "data_ultima_verificacao": "2023-02-09T14:30:11+00:00",
    "tempo_desde_ultima_verificacao": "há 1 mês",
    "processos_relacionados": [
        {
            "numero": "8027909-02.2019.8.05.0000"
        },
        {
            "numero": "8028150-73.2019.8.05.0000"
        }
    ],
    "fontes": [
        {
            "id": 3,
            "processo_fonte_id": 14626,
            "descricao": "TJSP - 1º grau",
            "nome": "Tribunal de Justiça de São Paulo",
            "sigla": "TJSP",
            "tipo": "TRIBUNAL",
            "data_inicio": "2015-11-27",
            "data_ultima_movimentacao": "2018-07-25",
            "segredo_justica": null,
            "arquivado": null,
            "status_predito": "INATIVO",
            "grau": 1,
            "grau_formatado": "Primeiro Grau",
            "fisico": false,
            "sistema": "ESAJ",
            "capa": {
                "classe": "PROCEDIMENTO COMUM CIVEL",
                "assunto": "RESPONSABILIDADE CIVIL",
                "assuntos_normalizados": [
                    {
                        "id": 3642,
                        "nome": "Responsabilidade Civil",
                        "nome_com_pai": "DIREITO CIVIL > Responsabilidade Civil",
                        "path_completo": "DIREITO CIVIL | Responsabilidade Civil",
                        "bloqueado": false
                    }
                ],
                "assunto_principal_normalizado": {
                    "id": 3642,
                    "nome": "Responsabilidade Civil",
                    "nome_com_pai": "DIREITO CIVIL > Responsabilidade Civil",
                    "path_completo": "DIREITO CIVIL | Responsabilidade Civil",
                    "bloqueado": false
                },
                "area": "CIVEL",
                "orgao_julgador": "01 VARA JUIZADO ESPECIAL CIVEL DE CAMPINAS",
                "orgao_julgador_normalizado": {
                    "nome": "01 VARA JUIZADO ESPECIAL CIVEL DE CAMPINAS",
                    "endereco": "Avenida Francisco Xavier de Arruda Camargo, 300",
                    "classificacao": "JE - Juizado Especial",
                    "cidade": "São Paulo",
                    "estado": {
                        "nome": "São Paulo",
                        "sigla": "SP"
                    },
                    "tribunal_sigla": "TJSP"
                },
                "situacao": "Baixado",
                "valor_causa": {
                    "valor": "50000.0000",
                    "moeda": "R$",
                    "valor_formatado": "R$ 50.000,00"
                },
                "data_distribuicao": "2015-11-27",
                "data_arquivamento": null,
                "informacoes_complementares": null
            },
            "audiencias": [
                {
                    "tipo": "Instrução",
                    "data": "2024-10-17",
                    "quantidade_pessoas": 2,
                    "situacao": "Cancelada"
                }
            ],
            "url": "https://esaj.tjsp.jus.br/cpopg/search.do?conversationId=&dadosConsulta.localPesquisa.cdLocal=-1&cbPesquisa=NUMPROC&dadosConsulta.tipoNuProcesso=UNIFICADO&numeroDigitoAnoUnificado=1024000-20.2015&foroNumeroUnificado=0000&dadosConsulta.valorConsultaNuUnificado=1024000-20.2015.2.23.0000&dadosConsulta.valorConsulta=",
            "tribunal": {
                "id": 102,
                "nome": "Tribunal de Justiça de São Paulo",
                "sigla": "TJSP",
                "categoria": null
            },
            "quantidade_movimentacoes": 68,
            "quantidade_envolvidos": 7,
            "data_ultima_verificacao": "2023-02-09T14:30:11+00:00",
            "envolvidos": [
                {
                    "nome": "Maria da Conceição de Oliveira",
                    "quantidade_processos": 1,
                    "tipo_pessoa": "FISICA",
                    "advogados": [
                        {
                            "nome": "Marta Brandao de Oliveira",
                            "quantidade_processos": 21,
                            "tipo_pessoa": "FISICA",
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "ADVOGADO",
                            "tipo_normalizado": "Advogado",
                            "polo": "ADVOGADO",
                            "cpf": "00000000000",
                            "nome_normalizado": "Marta Brandao de Oliveira",
                            "oabs": [
                                {
                                    "uf": "SP",
                                    "tipo": "ADVOGADO",
                                    "numero": 123123
                                }
                            ]
                        },
                        {
                            "nome": "Fernando Marçal",
                            "quantidade_processos": 10,
                            "tipo_pessoa": "FISICA",
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "ADVOGADO",
                            "tipo_normalizado": "Advogado",
                            "polo": "ADVOGADO",
                            "cpf": "00000000000",
                            "nome_normalizado": "Fernando Marçal",
                            "oabs": [
                                {
                                    "uf": "SP",
                                    "tipo": "ADVOGADO",
                                    "numero": 123123
                                }
                            ]
                        }
                    ],
                    "prefixo": null,
                    "sufixo": null,
                    "tipo": "REQUERENTE",
                    "tipo_normalizado": "Requerente",
                    "polo": "ATIVO",
                    "cpf": "00000000000",
                    "nome_normalizado": "Maria da Conceição de Oliveira"
                },
                {
                    "nome": "Joao da Silva",
                    "quantidade_processos": 97,
                    "tipo_pessoa": "FISICA",
                    "advogados": [
                        {
                            "nome": "Antonio Carlos de Souza",
                            "quantidade_processos": 37,
                            "tipo_pessoa": "FISICA",
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "ADVOGADO",
                            "tipo_normalizado": "Advogado",
                            "polo": "ADVOGADO",
                            "cpf": "00000000000",
                            "nome_normalizado": "Antonio Carlos de Souza",
                            "oabs": [
                                {
                                    "uf": "SP",
                                    "tipo": "ADVOGADO",
                                    "numero": 123123
                                }
                            ]
                        },
                        {
                            "nome": "Fabiane Santos Carvalho",
                            "quantidade_processos": 33,
                            "tipo_pessoa": "FISICA",
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "ADVOGADO",
                            "tipo_normalizado": "Advogado",
                            "polo": "ADVOGADO",
                            "cpf": "00000000000",
                            "nome_normalizado": "Fabiane Santos Carvalho",
                            "oabs": [
                                {
                                    "uf": "SP",
                                    "tipo": "ADVOGADO",
                                    "numero": 123123
                                }
                            ]
                        }
                    ],
                    "prefixo": null,
                    "sufixo": null,
                    "tipo": "REQUERIDO",
                    "tipo_normalizado": "Requerido",
                    "polo": "PASSIVO",
                    "cpf": "00000000000",
                    "nome_normalizado": "Joao da Silva"
                },
                {
                    "nome": "Marcos Tira Teima",
                    "quantidade_processos": 126,
                    "tipo_pessoa": "FISICA",
                    "prefixo": null,
                    "sufixo": null,
                    "tipo": "JUIZ",
                    "tipo_normalizado": "Juiz",
                    "polo": "NENHUM"
                }
            ]
        },
        {
            "id": 6,
            "processo_fonte_id": 14566,
            "descricao": "TJSP - 2º grau",
            "nome": "Tribunal de Justiça de São Paulo",
            "sigla": "TJSP",
            "tipo": "TRIBUNAL",
            "data_inicio": "2017-06-01",
            "data_ultima_movimentacao": "2018-04-26",
            "segredo_justica": null,
            "arquivado": null,
            "status_predito": "INATIVO",
            "grau": 2,
            "grau_formatado": "Segundo Grau",
            "fisico": false,
            "sistema": "ESAJ",
            "capa": {
                "classe": "APELACAO CIVEL",
                "assunto": "DIREITO CIVIL-RESPONSABILIDADE CIVIL-INDENIZACAO POR DANO MORAL",
                "assuntos_normalizados": [
                    {
                        "id": 3644,
                        "nome": "Indenização por Dano Moral",
                        "nome_com_pai": "Responsabilidade Civil > Indenização por Dano Moral",
                        "path_completo": "DIREITO CIVIL | Responsabilidade Civil | Indenização por Dano Moral",
                        "bloqueado": false
                    }
                ],
                "assunto_principal_normalizado": {
                    "id": 3644,
                    "nome": "Indenização por Dano Moral",
                    "nome_com_pai": "Responsabilidade Civil > Indenização por Dano Moral",
                    "path_completo": "DIREITO CIVIL | Responsabilidade Civil | Indenização por Dano Moral",
                    "bloqueado": false
                },
                "area": "CIVEL",
                "orgao_julgador": "01 VARA JUIZADO ESPECIAL CIVEL DE CAMPINAS",
                "orgao_julgador_normalizado": {
                    "nome": "01 VARA JUIZADO ESPECIAL CIVEL DE CAMPINAS",
                    "endereco": "Avenida Francisco Xavier de Arruda Camargo, 300",
                    "classificacao": "JE - Juizado Especial",
                    "cidade": "São Paulo",
                    "estado": {
                        "nome": "São Paulo",
                        "sigla": "SP"
                    },
                    "tribunal_sigla": "TJSP"
                },
                "situacao": "Baixado",
                "valor_causa": {
                    "valor": "50000.0000",
                    "moeda": "R$",
                    "valor_formatado": "R$ 50.000,00"
                },
                "data_distribuicao": "2017-06-01",
                "data_arquivamento": null,
                "informacoes_complementares": null
            },
            "audiencias": [],
            "url": "https://esaj.tjsp.jus.br/cposg/search.do?conversationId=&paginaConsulta=0&cbPesquisa=NUMPROC&numeroDigitoAnoUnificado=1024000-20.2015&foroNumeroUnificado=0000&dePesquisaNuUnificado=1024000-20.2015.8.22.0000&dePesquisaNuUnificado=UNIFICADO&dePesquisa=&tipoNuProcesso=UNIFICADO&uuidCaptcha=sajcaptcha_e6c6a295c5404a6887d81483bdd96048&g-recaptcha-response=",
            "tribunal": {
                "id": 102,
                "nome": "Tribunal de Justiça de São Paulo",
                "sigla": "TJSP",
                "categoria": null
            },
            "quantidade_movimentacoes": 35,
            "quantidade_envolvidos": 7,
            "data_ultima_verificacao": "2023-02-09T14:30:00+00:00",
            "envolvidos": [
                {
                    "nome": "Maria da Conceição de Oliveira",
                    "quantidade_processos": 1,
                    "tipo_pessoa": "FISICA",
                    "advogados": [
                        {
                            "nome": "Fabiane Santos Carvalho",
                            "quantidade_processos": 21,
                            "tipo_pessoa": "FISICA",
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "ADVOGADO",
                            "tipo_normalizado": "Advogado",
                            "polo": "ADVOGADO",
                            "cpf": "00000000000",
                            "nome_normalizado": "Fabiane Santos Carvalho",
                            "oabs": [
                                {
                                    "uf": "SP",
                                    "tipo": "ADVOGADO",
                                    "numero": 123123
                                }
                            ]
                        },
                        {
                            "nome": "Antonio Carlos de Souza",
                            "quantidade_processos": 10,
                            "tipo_pessoa": "FISICA",
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "ADVOGADO",
                            "tipo_normalizado": "Advogado",
                            "polo": "ADVOGADO",
                            "cpf": "00000000000",
                            "nome_normalizado": "Antonio Carlos de Souza",
                            "oabs": [
                                {
                                    "uf": "SP",
                                    "tipo": "ADVOGADO",
                                    "numero": 123123
                                }
                            ]
                        }
                    ],
                    "prefixo": null,
                    "sufixo": null,
                    "tipo": "APELANTE",
                    "tipo_normalizado": "Apelante",
                    "polo": "ATIVO",
                    "cpf": "00000000000",
                    "nome_normalizado": "Maria da Conceicao de Oliveira"
                },
                {
                    "nome": "Joao da Silva",
                    "quantidade_processos": 97,
                    "tipo_pessoa": "FISICA",
                    "advogados": [
                        {
                            "nome": "",
                            "quantidade_processos": 37,
                            "tipo_pessoa": "FISICA",
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "ADVOGADO",
                            "tipo_normalizado": "Advogado",
                            "polo": "ADVOGADO",
                            "cpf": "00000000000",
                            "nome_normalizado": "Marta Brandao de Oliveira",
                            "oabs": [
                                {
                                    "uf": "SP",
                                    "tipo": "ADVOGADO",
                                    "numero": 123123
                                }
                            ]
                        },
                        {
                            "nome": "Fernando Marçal",
                            "quantidade_processos": 33,
                            "tipo_pessoa": "FISICA",
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "ADVOGADO",
                            "tipo_normalizado": "Advogado",
                            "polo": "ADVOGADO",
                            "cpf": "00000000000",
                            "nome_normalizado": "Fernando Marçal",
                            "oabs": [
                                {
                                    "uf": "SP",
                                    "tipo": "ADVOGADO",
                                    "numero": 123123
                                }
                            ]
                        }
                    ],
                    "prefixo": null,
                    "sufixo": null,
                    "tipo": "APELADO",
                    "tipo_normalizado": "Apelado",
                    "polo": "PASSIVO",
                    "cpf": "00000000000",
                    "nome_normalizado": "Joao da Silva"
                },
                {
                    "nome": "Ronaldo de Assis",
                    "quantidade_processos": 86,
                    "tipo_pessoa": "FISICA",
                    "prefixo": null,
                    "sufixo": null,
                    "tipo": "RELATOR",
                    "tipo_normalizado": "Juiz",
                    "polo": "NENHUM",
                    "cpf": "00000000000",
                    "nome_normalizado": "Ronaldo de Assis"
                }
            ]
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

### GET /api/v2/processos/numero_cnj/{numero}/movimentacoes

**Movimentações de um processo**

Retorna as movimentações de um processo a partir do número CNJ a partir dos dados já indexados no Escavador.

Uma movimentação é cada andamento/evento registrado no histórico processual por uma fonte (tribunal ou diário oficial),
como por exemplo: distribuição, conclusão, juntada de petição/documento, publicação, despacho,
decisão, sentença, baixa ou arquivamento. Em geral, cada item representa uma alteração relevante
no estado do processo ao longo do tempo.

Para obter movimentações mais recentes, solicite antes uma atualização do processo em [solicitar atualização de um processo](/v2/docs/atualizacao-de-processos#solicitar-atualizao-de-um-processo).

Acesse a [página de respostas](/v2/docs/respostas#estrutura-movimentao) para detalhes sobre os dados retornados.





### Formato do Número CNJ

O número CNJ segue o padrão: `NNNNNNN-DD.AAAA.J.TT.OOOO`
- NNNNNNN: Número sequencial do processo
- DD: Dígitos verificadores
- AAAA: Ano de ajuizamento
- J: Segmento da justiça (8=Estadual, 4=Federal/TRF, 5=Trabalho, etc)
- TT: Tribunal
- OOOO: Vara/Origem

Exemplo: `0018063-19.2013.8.26.0002`
<aside class="notice">
### Como funciona a paginação

Esta rota utiliza paginação por cursor.
- Os parâmetros de paginação `cursor` e `li` já são retornados montados no campo `links` da resposta da API.
  Para avançar de página, basta reutilizar a URL de próximo link (`next`) com esses parâmetros.

</aside>

- Requer autenticação: sim

#### URL Params

- `numero` (string, required): Número único do processo no formato CNJ. Aceita formatos: `NNNNNNN-DD.AAAA.J.TT.OOOO` ou `NNNNNNNDDAAAAJTTOOOO` (20 dígitos sem formatação).

#### Query Params

- `limit` (integer, optional): Quantidade de movimentações por página. Deve ser múltiplo de 50, com mínimo 50 e máximo 500. Ex.: 50, 100, 150...500.</br> <small><strong>OBS</strong>: Se limit não for informado, o valor padrão retornado será <b>20</b></small>.
- `ordem` (string, optional): Ordenação das movimentações por data. Valores aceitos: `asc` ou `desc`. Padrão: `desc`.

#### Responses

- Status 200
```json
{
    "items": [
        {
            "id": 853879,
            "data": "2018-07-25",
            "tipo": "ANDAMENTO",
            "conteudo": "CERTIDAO DE CARTORIO EXPEDIDA",
            "fonte": {
                "fonte_id": 3,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 1,
                "grau_formatado": "Primeiro Grau"
            }
        },
        {
            "id": 853877,
            "data": "2018-07-25",
            "tipo": "ANDAMENTO",
            "conteudo": "CERTIDAO DE CARTORIO EXPEDIDA",
            "fonte": {
                "fonte_id": 3,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 1,
                "grau_formatado": "Primeiro Grau"
            }
        },
        {
            "id": 853875,
            "data": "2018-07-25",
            "tipo": "ANDAMENTO",
            "conteudo": "ARQUIVADO DEFINITIVAMENTE",
            "fonte": {
                "fonte_id": 3,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 1,
                "grau_formatado": "Primeiro Grau"
            }
        },
        {
            "id": 853881,
            "data": "2018-06-05",
            "tipo": "ANDAMENTO",
            "conteudo": "SUSPENSAO DO PRAZO",
            "fonte": {
                "fonte_id": 3,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 1,
                "grau_formatado": "Primeiro Grau"
            }
        },
        {
            "id": 853883,
            "data": "2018-06-02",
            "tipo": "ANDAMENTO",
            "conteudo": "SUSPENSAO DO PRAZO",
            "fonte": {
                "fonte_id": 3,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 1,
                "grau_formatado": "Primeiro Grau"
            }
        },
        {
            "id": 853885,
            "data": "2018-05-24",
            "tipo": "ANDAMENTO",
            "conteudo": "CERTIDAO DE PUBLICACAO EXPEDIDA",
            "fonte": {
                "fonte_id": 3,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 1,
                "grau_formatado": "Primeiro Grau"
            }
        },
        {
            "id": 853887,
            "data": "2018-05-23",
            "tipo": "ANDAMENTO",
            "conteudo": "REMETIDO AO DJE",
            "fonte": {
                "fonte_id": 3,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 1,
                "grau_formatado": "Primeiro Grau"
            }
        },
        {
            "id": 853889,
            "data": "2018-05-10",
            "tipo": "ANDAMENTO",
            "conteudo": "PROFERIDO DESPACHO",
            "fonte": {
                "fonte_id": 3,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 1,
                "grau_formatado": "Primeiro Grau"
            }
        },
        {
            "id": 853896,
            "data": "2018-05-04",
            "tipo": "ANDAMENTO",
            "conteudo": "DECISAO DE 2ª INSTANCIA - RECURSO NAO PROVIDO - JUNTADA",
            "fonte": {
                "fonte_id": 3,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 1,
                "grau_formatado": "Primeiro Grau"
            }
        },
        {
            "id": 853895,
            "data": "2018-05-04",
            "tipo": "ANDAMENTO",
            "conteudo": "EMBARGOS DE DECLARACAO ACOLHIDOS",
            "fonte": {
                "fonte_id": 3,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 1,
                "grau_formatado": "Primeiro Grau"
            }
        },
        {
            "id": 853893,
            "data": "2018-05-04",
            "tipo": "ANDAMENTO",
            "conteudo": "TRANSITO EM JULGADO AS PARTES - PROC. EM ANDAMENTO",
            "fonte": {
                "fonte_id": 3,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 1,
                "grau_formatado": "Primeiro Grau"
            }
        },
        {
            "id": 853891,
            "data": "2018-05-04",
            "tipo": "ANDAMENTO",
            "conteudo": "CONCLUSOS PARA DESPACHO",
            "fonte": {
                "fonte_id": 3,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 1,
                "grau_formatado": "Primeiro Grau"
            }
        },
        {
            "id": 853897,
            "data": "2018-04-26",
            "tipo": "ANDAMENTO",
            "conteudo": "RECEBIDOS OS AUTOS DO TRIBUNAL DE JUSTICA",
            "fonte": {
                "fonte_id": 3,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 1,
                "grau_formatado": "Primeiro Grau"
            }
        },
        {
            "id": 849990,
            "data": "2018-04-26",
            "tipo": "ANDAMENTO",
            "conteudo": "EXPEDIDO CERTIDAO",
            "fonte": {
                "fonte_id": 6,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 2,
                "grau_formatado": "Segundo Grau"
            }
        },
        {
            "id": 849988,
            "data": "2018-04-26",
            "tipo": "ANDAMENTO",
            "conteudo": "BAIXA DEFINITIVA",
            "fonte": {
                "fonte_id": 6,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 2,
                "grau_formatado": "Segundo Grau"
            }
        },
        {
            "id": 849986,
            "data": "2018-04-26",
            "tipo": "ANDAMENTO",
            "conteudo": "EXPEDIDO CERTIDAO DE BAIXA DE RECURSO",
            "fonte": {
                "fonte_id": 6,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 2,
                "grau_formatado": "Segundo Grau"
            }
        },
        {
            "id": 849992,
            "data": "2018-03-28",
            "tipo": "ANDAMENTO",
            "conteudo": "EXPEDIDO CERTIDAO",
            "fonte": {
                "fonte_id": 6,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 2,
                "grau_formatado": "Segundo Grau"
            }
        },
        {
            "id": 849994,
            "data": "2018-03-26",
            "tipo": "ANDAMENTO",
            "conteudo": "JULGADO VIRTUALMENTE",
            "fonte": {
                "fonte_id": 6,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 2,
                "grau_formatado": "Segundo Grau"
            }
        },
        {
            "id": 849998,
            "data": "2018-03-06",
            "tipo": "ANDAMENTO",
            "conteudo": "EXPEDIDO CERTIDAO",
            "fonte": {
                "fonte_id": 6,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 2,
                "grau_formatado": "Segundo Grau"
            }
        },
        {
            "id": 849996,
            "data": "2018-03-06",
            "tipo": "ANDAMENTO",
            "conteudo": "CONCLUSOS PARA O RELATOR (EXPEDIDO TERMO COM CONCLUSAO)",
            "fonte": {
                "fonte_id": 6,
                "nome": "Tribunal de Justiça de São Paulo",
                "tipo": "TRIBUNAL",
                "sigla": "TJSP",
                "grau": 2,
                "grau_formatado": "Segundo Grau"
            }
        }
    ],
    "links": {
        "next": "https://api.escavador.com/api/v2/processos/numero_cnj/1024000-20.2015.8.22.0000/movimentacoes?cursor=eyJkYXRhIjoiMjAxOC0wMy0wNiAwMDowMDowMCIsIm1vdmltZW50YWNhb19pZCI6ODQ5OTk2LCJfcG9pbnRzVG9OZXh0SXRlbXMiOnRydWV9&li=216029777"
    },
    "paginator": {
        "per_page": 20
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

- Status 422
```json
{
    "code": "NUMERO_CNJ_INVALIDO",
    "message": "O número do processo não está no formato CNJ.",
    "errors": null,
    "appends": null
}
```

### GET /api/v2/envolvido/processos

**Processos do envolvido por Nome ou CPF/CNPJ**

Retorna os processos de um envolvido a partir do nome ou CPF/CNPJ.

<aside class="notice">Ao buscar processos pelo CPF, pode ocorrer da pessoa em questão possuir homônimos, o que torna o nome do CPF informado não único no Brasil.
Além disso, se os processos em que essa pessoa esteja envolvida não possuírem o CPF informado nos sistemas dos Tribunais, os resultados podem não ser retornados.
Nesse caso, é recomendável realizar a busca pelo nome da parte e filtrar pelo estado da pessoa, o que cobre a grande maioria dos casos.
Para saber mais sobre o algoritmo de matching, acesse a <a href="https://suporte-api.escavador.com/hc/pt-br/articles/13916942181915-O-Algoritmo-de-Match-na-API-do-Escavador" rel=nofollow target="_blank">página da Central de Ajuda.</a> </aside>

Acesse a [página de respostas](/v2/docs/respostas#estrutura-processo) para detalhes sobre os dados retornados.

- Requer autenticação: sim

#### Query Params

- `nome` (string, optional): Nome do envolvido. <b>Obrigatório</b> se `cpf_cnpj` não for enviado.
- `cpf_cnpj` (string, optional): CPF/CNPJ do envolvido. <b>Obrigatório</b> se `nome` não for enviado.
- `limit` (integer, optional): Quantidade de processos por página. Pode ser 50 ou 100.
- `tribunais` (array, optional): Filtra processos a partir das siglas de tribunais enviadas.
- `incluir_homonimos` (boolean, optional): Inclui processos de envolvidos do mesmo nome que não identificamos o CPF. Disponível apenas para busca por CPF <br>Default: `false`.
- `status` (string, optional): Filtra processos a partir do status do processo, pode ser `ATIVO` ou `INATIVO`. Obs. A classificação do status é feito por IA e vai considerar a última atualização que possuímos do processo na nossa base.
- `data_minima` (string, optional): Filtra processos que iniciaram após a data informada. A data deve ser estar no formato AAAA-MM-DD.
- `data_maxima` (string, optional): Filtra processos que iniciaram antes da data informada. A data deve ser estar no formato AAAA-MM-DD e, caso a data minima seja enviada, deve ser maior que a data minima.

#### Responses

- Status 200
```json
{
    "envolvido_encontrado": {
        "nome": "Engenharia e Construcoes Ltda",
        "tipo_pessoa": "JURIDICA",
        "quantidade_processos": 2
    },
    "items": [
        {
            "numero_cnj": "1060225-21.2023.5.56.0002",
            "titulo_polo_ativo": "Joao da Silva",
            "titulo_polo_passivo": "Empresa de Engenharia e outros",
            "ano_inicio": 2023,
            "data_inicio": "2023-03-11",
            "estado_origem": {
                "nome": "São Paulo",
                "sigla": "SP"
            },
            "unidade_origem": {
                "nome": "01 VARA JUIZADO ESPECIAL CIVEL DE CAMPINAS",
                "endereco": "Avenida Francisco Xavier de Arruda Camargo, 300",
                "classificacao": "JE - Juizado Especial",
                "cidade": "São Paulo",
                "estado": {
                    "nome": "São Paulo",
                    "sigla": "SP"
                },
                "tribunal_sigla": "TJSP"
            },
            "data_ultima_movimentacao": "2023-03-11",
            "quantidade_movimentacoes": 2,
            "fontes_tribunais_estao_arquivadas": false,
            "data_ultima_verificacao": "2023-03-14T19:00:14+00:00",
            "tempo_desde_ultima_verificacao": "há 15 minutos",
            "processos_relacionados": [
                {
                    "numero": "8027909-02.2019.8.05.0000"
                },
                {
                    "numero": "8028150-73.2019.8.05.0000"
                }
            ],
            "fontes": [
                {
                    "id": 47,
                    "processo_fonte_id": 1048903,
                    "descricao": "TRT-2 - 1º grau",
                    "nome": "Tribunal Regional do Trabalho da 2ª Região",
                    "sigla": "TRT-2",
                    "tipo": "TRIBUNAL",
                    "data_inicio": "2023-03-11",
                    "data_ultima_movimentacao": "2023-03-11",
                    "segredo_justica": false,
                    "arquivado": null,
                    "status_predito": "ATIVO",
                    "grau": 1,
                    "grau_formatado": "Primeiro Grau",
                    "fisico": false,
                    "sistema": "PJE",
                    "capa": {
                        "classe": "ACAO TRABALHISTA - RITO ORDINARIO",
                        "assunto": "SALARIO POR FORA - INTEGRACAO",
                        "assuntos_normalizados": [
                            {
                                "id": 6870,
                                "nome": "Horas Extras",
                                "nome_com_pai": "Duração do Trabalho > Horas Extras",
                                "path_completo": "DIREITO DO TRABALHO | Direito Individual do Trabalho  | Duração do Trabalho | Horas Extras",
                                "bloqueado": false
                            },
                            {
                                "id": 7041,
                                "nome": "Salário por Fora - Integração",
                                "nome_com_pai": "Salário/Diferença Salarial > Salário por Fora - Integração",
                                "path_completo": "DIREITO DO TRABALHO | Direito Individual do Trabalho  | Verbas Remuneratórias, Indenizatórias e Benefícios | Salário/Diferença Salarial | Salário por Fora - Integração",
                                "bloqueado": false
                            }
                        ],
                        "assunto_principal_normalizado": {
                            "id": 7041,
                            "nome": "Salário por Fora - Integração",
                            "nome_com_pai": "Salário/Diferença Salarial > Salário por Fora - Integração",
                            "path_completo": "DIREITO DO TRABALHO | Direito Individual do Trabalho  | Verbas Remuneratórias, Indenizatórias e Benefícios | Salário/Diferença Salarial | Salário por Fora - Integração",
                            "bloqueado": false
                        },
                        "area": "TRABALHISTA",
                        "orgao_julgador": "01 VARA JUIZADO ESPECIAL CIVEL DE CAMPINAS",
                        "orgao_julgador_normalizado": {
                            "nome": "01 VARA JUIZADO ESPECIAL CIVEL DE CAMPINAS",
                            "endereco": "Avenida Francisco Xavier de Arruda Camargo, 300",
                            "classificacao": "JE - Juizado Especial",
                            "cidade": "São Paulo",
                            "estado": {
                                "nome": "São Paulo",
                                "sigla": "SP"
                            },
                            "tribunal_sigla": "TJSP"
                        },
                        "situacao": "Baixado",
                        "valor_causa": {
                            "valor": "310455.6100",
                            "moeda": "R$",
                            "valor_formatado": "R$ 310.455,61"
                        },
                        "data_distribuicao": "2023-03-11",
                        "data_arquivamento": null,
                        "informacoes_complementares": null
                    },
                    "url": "https://pje.trt2.jus.br/consultaprocessual/detalhe-processo/10003246720235020007",
                    "tribunal": {
                        "id": 13,
                        "nome": "Tribunal Regional do Trabalho da 2ª Região",
                        "sigla": "TRT-2",
                        "categoria": null
                    },
                    "quantidade_movimentacoes": 2,
                    "data_ultima_verificacao": "2023-03-14T19:00:14+00:00",
                    "envolvidos": [
                        {
                            "nome": "Joao da Silva",
                            "quantidade_processos": 1,
                            "tipo_pessoa": "FISICA",
                            "advogados": [
                                {
                                    "nome": "Paulo Roberto de Oliveira",
                                    "quantidade_processos": 3,
                                    "tipo_pessoa": "FISICA",
                                    "prefixo": null,
                                    "sufixo": null,
                                    "tipo": "ADVOGADO",
                                    "tipo_normalizado": "Advogado",
                                    "polo": "ADVOGADO",
                                    "cpf": "00000000000",
                                    "oabs": [
                                        {
                                            "uf": "SP",
                                            "tipo": "ADVOGADO",
                                            "numero": 123123
                                        }
                                    ]
                                },
                                {
                                    "nome": "Daniel Felipe Assis",
                                    "quantidade_processos": 8,
                                    "tipo_pessoa": "FISICA",
                                    "prefixo": null,
                                    "sufixo": null,
                                    "tipo": "ADVOGADO",
                                    "tipo_normalizado": "Advogado",
                                    "polo": "ADVOGADO",
                                    "oabs": [
                                        {
                                            "uf": "SP",
                                            "tipo": "ADVOGADO",
                                            "numero": 123123
                                        }
                                    ]
                                }
                            ],
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "RECLAMANTE",
                            "tipo_normalizado": "Reclamante",
                            "polo": "ATIVO",
                            "cpf": "00000000000"
                        },
                        {
                            "nome": "Empresa de Engenharia e outros",
                            "quantidade_processos": 2,
                            "tipo_pessoa": "JURIDICA",
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "RECLAMADO",
                            "tipo_normalizado": "Reclamado",
                            "polo": "PASSIVO",
                            "cnpj": "00000000000000"
                        },
                        {
                            "nome": "Empresa de Construcoes",
                            "quantidade_processos": 2,
                            "tipo_pessoa": "JURIDICA",
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "RECLAMADO",
                            "tipo_normalizado": "Reclamado",
                            "polo": "PASSIVO",
                            "cnpj": "00000000000000"
                        },
                        {
                            "nome": "Engenharia e Construcoes Ltda",
                            "quantidade_processos": 66,
                            "tipo_pessoa": "JURIDICA",
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "RECLAMADO",
                            "tipo_normalizado": "Reclamado",
                            "polo": "PASSIVO",
                            "cnpj": "00000000000000"
                        },
                        {
                            "nome": "Construtora e Incorporadora Ltda",
                            "quantidade_processos": 1,
                            "tipo_pessoa": "JURIDICA",
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "RECLAMADO",
                            "tipo_normalizado": "Reclamado",
                            "polo": "PASSIVO",
                            "cnpj": "00000000000000"
                        }
                    ]
                }
            ]
        },
        {
            "numero_cnj": "0205615-29.2023.3.12.0026",
            "titulo_polo_ativo": "Maria Almeida Sampaio",
            "titulo_polo_passivo": "Engenharia e Construcoes Ltda",
            "ano_inicio": 2023,
            "data_inicio": "2023-03-10",
            "data_ultima_movimentacao": "2023-03-10",
            "quantidade_movimentacoes": 2,
            "fontes_tribunais_estao_arquivadas": false,
            "data_ultima_verificacao": "2023-03-14T19:00:14+00:00",
            "tempo_desde_ultima_verificacao": "há 15 minutos",
            "fontes": [
                {
                    "id": 355,
                    "processo_fonte_id": 1048904,
                    "descricao": "TRT-20 - 1º grau",
                    "nome": "Tribunal Regional do Trabalho da 20ª Região",
                    "sigla": "TRT-20",
                    "tipo": "TRIBUNAL",
                    "data_inicio": "2023-03-10",
                    "data_ultima_movimentacao": "2023-03-10",
                    "segredo_justica": false,
                    "arquivado": null,
                    "grau": 1,
                    "grau_formatado": "Primeiro Grau",
                    "fisico": false,
                    "sistema": "PJE",
                    "capa": {
                        "classe": "ACAO TRABALHISTA - RITO ORDINARIO",
                        "assunto": "ISONOMIA/DIFERENCA SALARIAL",
                        "assuntos_normalizados": [
                            {
                                "id": 6793,
                                "nome": "isonomia/Diferença Salarial",
                                "nome_com_pai": "Enquadramento > isonomia/Diferença Salarial",
                                "path_completo": "DIREITO DO TRABALHO | Direito Individual do Trabalho  | Categoria Profissional Especial | Bancários | Enquadramento | isonomia/Diferença Salarial",
                                "bloqueado": false
                            },
                            {
                                "id": 6978,
                                "nome": "Adicional de Periculosidade",
                                "nome_com_pai": "Adicional > Adicional de Periculosidade",
                                "path_completo": "DIREITO DO TRABALHO | Direito Individual do Trabalho  | Verbas Remuneratórias, Indenizatórias e Benefícios | Adicional | Adicional de Periculosidade",
                                "bloqueado": false
                            }
                        ],
                        "assunto_principal_normalizado": {
                            "id": 6793,
                            "nome": "isonomia/Diferença Salarial",
                            "nome_com_pai": "Enquadramento > isonomia/Diferença Salarial",
                            "path_completo": "DIREITO DO TRABALHO | Direito Individual do Trabalho  | Categoria Profissional Especial | Bancários | Enquadramento | isonomia/Diferença Salarial",
                            "bloqueado": false
                        },
                        "area": "TRABALHISTA",
                        "orgao_julgador": "01 VARA JUIZADO ESPECIAL CIVEL DE CAMPINAS",
                        "orgao_julgador_normalizado": {
                            "nome": "01 VARA JUIZADO ESPECIAL CIVEL DE CAMPINAS",
                            "endereco": "Avenida Francisco Xavier de Arruda Camargo, 300",
                            "classificacao": "JE - Juizado Especial",
                            "cidade": "São Paulo",
                            "estado": {
                                "nome": "São Paulo",
                                "sigla": "SP"
                            },
                            "tribunal_sigla": "TJSP"
                        },
                        "valor_causa": {
                            "valor": "292319.7200",
                            "moeda": "R$",
                            "valor_formatado": "R$ 292.319,72"
                        },
                        "data_distribuicao": "2023-03-10",
                        "data_arquivamento": null,
                        "informacoes_complementares": null
                    },
                    "url": "https://pje.trt20.jus.br/consultaprocessual/detalhe-processo/00002054020235200002",
                    "tribunal": {
                        "id": 31,
                        "nome": "Tribunal Regional do Trabalho da 20ª Região",
                        "sigla": "TRT-20",
                        "categoria": null
                    },
                    "quantidade_movimentacoes": 2,
                    "data_ultima_verificacao": "2023-03-14T19:00:14+00:00",
                    "envolvidos": [
                        {
                            "nome": "Maria Almeida Sampaio",
                            "quantidade_processos": 1,
                            "tipo_pessoa": "FISICA",
                            "advogados": [
                                {
                                    "nome": "Petrucio Silveira",
                                    "quantidade_processos": 16,
                                    "tipo_pessoa": "FISICA",
                                    "prefixo": null,
                                    "sufixo": null,
                                    "tipo": "ADVOGADO",
                                    "tipo_normalizado": "Advogado",
                                    "polo": "ADVOGADO",
                                    "cpf": "00000000000",
                                    "oabs": [
                                        {
                                            "uf": "SE",
                                            "tipo": "ADVOGADO",
                                            "numero": 123123
                                        }
                                    ]
                                },
                                {
                                    "nome": "Kevin Correia Borges",
                                    "quantidade_processos": 8,
                                    "tipo_pessoa": "FISICA",
                                    "prefixo": null,
                                    "sufixo": null,
                                    "tipo": "ADVOGADO",
                                    "tipo_normalizado": "Advogado",
                                    "polo": "ADVOGADO",
                                    "cpf": "00000000000",
                                    "oabs": [
                                        {
                                            "uf": "SE",
                                            "tipo": "ADVOGADO",
                                            "numero": 123123
                                        }
                                    ]
                                }
                            ],
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "RECLAMANTE",
                            "tipo_normalizado": "Reclamante",
                            "polo": "ATIVO",
                            "cpf": "00000000000"
                        },
                        {
                            "nome": "Engenharia e Construcoes Ltda",
                            "quantidade_processos": 66,
                            "tipo_pessoa": "JURIDICA",
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "RECLAMADO",
                            "tipo_normalizado": "Reclamado",
                            "polo": "PASSIVO",
                            "cnpj": "00000000000000"
                        }
                    ]
                }
            ]
        }
    ],
    "links": {
        "next": "https://api.escavador.com/api/v2/envolvido/processos?nome=Joao%20da%20Silva&cursor=eyJwcm9jZXNzby5kYXRhX2luaWNpbyI6IjIwMjItMDctMDUgMDA6MDA6MDAiLCJwcm9jZXNzby5pZCI6MTEwNjg3NSwiX3BvaW50c1RvTmV4dEl0ZW1zIjp0cnVlfQ&li=216025845"
    },
    "paginator": {
        "per_page": 20
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

### GET /api/v2/envolvido/resumo

**Resumo de Processos do envolvido por Nome ou CPF/CNPJ**

Retorna a quantidade de processos de um envolvido a partir do nome ou CPF/CNPJ.

- Requer autenticação: sim

#### Query Params

- `nome` (string, optional): Nome do envolvido. <b>Obrigatório</b> se `cpf_cnpj` não for enviado.
- `cpf_cnpj` (string, optional): CPF/CNPJ do envolvido. <b>Obrigatório</b> se `nome` não for enviado.

#### Responses

- Status 200
```json
{
    "nome": "Empresa Fantasia S.A",
    "tipo_pessoa": "JURIDICA",
    "quantidade_processos": 3516803
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

### GET /api/v2/advogado/processos

**Processos de um advogado por OAB**

Retorna os processos de um advogado a partir da OAB

Acesse a [página de respostas](/v2/docs/respostas#estrutura-processo) para detalhes sobre os dados retornados.

- Requer autenticação: sim

#### Query Params

- `oab_estado` (string, required): Estado da OAB.
- `oab_numero` (string, required): Número da OAB.
- `oab_tipo` (string, optional): Tipo da OAB, pode ser informado caso o mesmo número exista para diferentes tipos. Pode ser `ADVOGADO`, `SUPLEMENTAR`, `ESTAGIARIO` ou `CONSULTOR_ESTRANGEIRO`.
- `limit` (integer, optional): Quantidade de processos por página. Pode ser 50 ou 100.
- `tribunais` (array, optional): Filtra processos a partir das siglas de tribunais enviadas.
- `status` (string, optional): Filtra processos a partir do status do processo, pode ser `ATIVO` ou `INATIVO`. Obs. A classificação do status é feito por IA e vai considerar a última atualização que possuímos do processo na nossa base.
- `data_minima` (string, optional): Filtra processos que iniciaram após a data informada. A data deve ser estar no formato AAAA-MM-DD.
- `data_maxima` (string, optional): Filtra processos que iniciaram antes da data informada. A data deve ser estar no formato AAAA-MM-DD e, caso a data minima seja enviada, deve ser maior que a data minima.

#### Responses

- Status 200
```json
{
    "advogado_encontrado": {
        "nome": "JOÃO DA SILVA",
        "tipo": "ADVOGADO",
        "quantidade_processos": 521
    },
    "items": [
        {
            "numero_cnj": "0000000-00.2022.2.03.0000",
            "titulo_polo_ativo": "Marcio Castro Chagas",
            "titulo_polo_passivo": "Mauro Emerson Gomes",
            "ano_inicio": 2022,
            "data_inicio": "2023-02-10",
            "estado_origem": {
                "nome": "São Paulo",
                "sigla": "SP"
            },
            "unidade_origem": {
                "nome": "01 VARA JUIZADO ESPECIAL CIVEL DE CAMPINAS",
                "endereco": "Avenida Francisco Xavier de Arruda Camargo, 300",
                "classificacao": "JE - Juizado Especial",
                "cidade": "São Paulo",
                "estado": {
                    "nome": "São Paulo",
                    "sigla": "SP"
                },
                "tribunal_sigla": "TJSP"
            },
            "data_ultima_movimentacao": "2023-02-10",
            "quantidade_movimentacoes": 1,
            "fontes_tribunais_estao_arquivadas": false,
            "data_ultima_verificacao": "2023-03-14T18:06:59+00:00",
            "tempo_desde_ultima_verificacao": "há 2 horas",
            "processos_relacionados": [
                {
                    "numero": "8027909-02.2019.8.05.0000"
                },
                {
                    "numero": "8028150-73.2019.8.05.0000"
                }
            ],
            "fontes": [
                {
                    "id": 1104,
                    "processo_fonte_id": 1125512,
                    "descricao": "TSE - 3º grau",
                    "nome": "Tribunal Superior Eleitoral",
                    "sigla": "TSE",
                    "tipo": "TRIBUNAL",
                    "data_inicio": "2023-02-10",
                    "data_ultima_movimentacao": "2023-02-10",
                    "segredo_justica": false,
                    "arquivado": null,
                    "status_predito": "ATIVO",
                    "grau": 3,
                    "grau_formatado": "Superior",
                    "fisico": false,
                    "sistema": "UNIFICADO",
                    "capa": {
                        "classe": "RECURSO ESPECIAL ELEITORAL",
                        "assunto": "DIREITO ELEITORAL",
                        "assuntos_normalizados": [
                            {
                                "id": 3388,
                                "nome": "Eleições",
                                "nome_com_pai": "Conselhos Regionais de Fiscalização Profissional e Afins > Eleições",
                                "path_completo": "DIREITO ADMINISTRATIVO E OUTRAS MATÉRIAS DE DIREITO PÚBLICO | Organização Político-administrativa / Administração Pública | Conselhos Regionais de Fiscalização Profissional e Afins | Eleições",
                                "bloqueado": false
                            },
                            {
                                "id": 3935,
                                "nome": "Propaganda eleitoral",
                                "nome_com_pai": "Campanha Eleitoral > Propaganda eleitoral",
                                "path_completo": "DIREITO ELEITORAL E PROCESSO ELEITORAL DO STF | Eleição | Campanha Eleitoral | Propaganda eleitoral",
                                "bloqueado": false
                            },
                            {
                                "id": 4564,
                                "nome": "DIREITO ELEITORAL",
                                "nome_com_pai": "DIREITO ELEITORAL",
                                "path_completo": "DIREITO ELEITORAL",
                                "bloqueado": false
                            },
                            {
                                "id": 4717,
                                "nome": "Eleições",
                                "nome_com_pai": "DIREITO ELEITORAL > Eleições",
                                "path_completo": "DIREITO ELEITORAL | Eleições",
                                "bloqueado": false
                            },
                            {
                                "id": 4904,
                                "nome": "Propaganda Política",
                                "nome_com_pai": "Partidos Políticos > Propaganda Política",
                                "path_completo": "DIREITO ELEITORAL | Partidos Políticos | Propaganda Política",
                                "bloqueado": false
                            },
                            {
                                "id": 5770,
                                "nome": "Propaganda Política - Propaganda Eleitoral - Impulsionamento",
                                "nome_com_pai": "Propaganda Política - Propaganda Eleitoral > Propaganda Política - Propaganda Eleitoral - Impulsionamento",
                                "path_completo": "DIREITO ELEITORAL | Eleições | Propaganda Política - Propaganda Eleitoral | Propaganda Política - Propaganda Eleitoral - Impulsionamento",
                                "bloqueado": false
                            }
                        ],
                        "assunto_principal_normalizado": {
                            "id": 4564,
                            "nome": "DIREITO ELEITORAL",
                            "nome_com_pai": "DIREITO ELEITORAL",
                            "path_completo": "DIREITO ELEITORAL",
                            "bloqueado": false
                        },
                        "area": null,
                        "orgao_julgador": "01 VARA JUIZADO ESPECIAL CIVEL DE CAMPINAS",
                        "orgao_julgador_normalizado": {
                            "nome": "01 VARA JUIZADO ESPECIAL CIVEL DE CAMPINAS",
                            "endereco": "Avenida Francisco Xavier de Arruda Camargo, 300",
                            "classificacao": "JE - Juizado Especial",
                            "cidade": "São Paulo",
                            "estado": {
                                "nome": "São Paulo",
                                "sigla": "SP"
                            },
                            "tribunal_sigla": "TJSP"
                        },
                        "situacao": "Baixado",
                        "valor_causa": {
                            "valor": null,
                            "moeda": null,
                            "valor_formatado": null
                        },
                        "data_distribuicao": "2023-02-10",
                        "data_arquivamento": null,
                        "informacoes_complementares": null
                    },
                    "url": "https://consultaunificadapje.tse.jus.br/#/public/resultado/0000000-00.2022.2.03.0000",
                    "tribunal": {
                        "id": 36,
                        "nome": "Tribunal Superior Eleitoral",
                        "sigla": "TSE",
                        "categoria": null
                    },
                    "quantidade_movimentacoes": 1,
                    "data_ultima_verificacao": "2023-03-14T18:06:59+00:00",
                    "envolvidos": [
                        {
                            "nome": "Marcio Castro Chagas",
                            "quantidade_processos": 1,
                            "tipo_pessoa": null,
                            "advogados": [
                                {
                                    "nome": "João Paulo de Silva",
                                    "quantidade_processos": 5,
                                    "tipo_pessoa": "FISICA",
                                    "prefixo": null,
                                    "sufixo": null,
                                    "tipo": "ADVOGADO",
                                    "tipo_normalizado": "Advogado",
                                    "polo": "ADVOGADO",
                                    "cpf": "00000000000",
                                    "oabs": [
                                        {
                                            "uf": "CE",
                                            "tipo": "ADVOGADO",
                                            "numero": 123023
                                        }
                                    ]
                                }
                            ],
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "AUTOR",
                            "tipo_normalizado": "Autor",
                            "polo": "ATIVO"
                        },
                        {
                            "nome": "Mauro Emerson Gomes",
                            "quantidade_processos": 1,
                            "tipo_pessoa": "JURIDICA",
                            "advogados": [
                                {
                                    "nome": "Roberta dos Santos Conceição",
                                    "quantidade_processos": 49,
                                    "tipo_pessoa": "FISICA",
                                    "prefixo": null,
                                    "sufixo": null,
                                    "tipo": "ADVOGADO",
                                    "tipo_normalizado": "Advogado",
                                    "polo": "ADVOGADO",
                                    "cpf": "00000000000",
                                    "oabs": [
                                        {
                                            "uf": "CE",
                                            "tipo": "ADVOGADO",
                                            "numero": 123123
                                        }
                                    ]
                                },
                                {
                                    "nome": "Luiz Carlos Silveira",
                                    "quantidade_processos": 31,
                                    "tipo_pessoa": "JURIDICA",
                                    "prefixo": null,
                                    "sufixo": null,
                                    "tipo": "ADVOGADO",
                                    "tipo_normalizado": "Advogado",
                                    "polo": "ADVOGADO",
                                    "oabs": [
                                        {
                                            "uf": "CE",
                                            "tipo": "ADVOGADO",
                                            "numero": 123123
                                        }
                                    ]
                                }
                            ],
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "REU",
                            "tipo_normalizado": "Réu",
                            "polo": "PASSIVO"
                        },
                        {
                            "nome": "Rede Servicos Online do Brasil Ltda",
                            "quantidade_processos": 10996,
                            "tipo_pessoa": "JURIDICA",
                            "advogados": [
                                {
                                    "nome": "Joana D'Arc de Souza",
                                    "quantidade_processos": 101,
                                    "tipo_pessoa": "FISICA",
                                    "prefixo": null,
                                    "sufixo": null,
                                    "tipo": "ADVOGADO",
                                    "tipo_normalizado": "Advogado",
                                    "polo": "ADVOGADO",
                                    "cpf": "00000000000",
                                    "oabs": [
                                        {
                                            "uf": "SP",
                                            "tipo": "ADVOGADO",
                                            "numero": 123123
                                        }
                                    ]
                                }
                            ],
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "REU",
                            "tipo_normalizado": "Réu",
                            "polo": "PASSIVO",
                            "cnpj": "00000000000000"
                        }
                    ]
                }
            ]
        }
    ],
    "links": {
        "next": "https://api.escavador.com/api/v2/advogado/processos?oab_estado=SP&oab_numero=123123&cursor=eyJwcm9jZXNzby5kYXRhX2luaWNpbyI6IjIwMjEtMDEtMTkgMDA6MDA6MDAiLCJwcm9jZXNzby5pZCI6MTEwNzI0NCwiX3BvaW50c1RvTmV4dEl0ZW1zIjp0cnVlfQ&li=216038277"
    },
    "paginator": {
        "per_page": 20
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

### GET /api/v2/advogado/resumo

**Resumo de processos do advogado por OAB**

Retorna um resumo do advogado a partir do oab, mostrando a quantidade de processos e o tipo da oab informada

- Requer autenticação: sim

#### Query Params

- `oab_estado` (string, required): Estado da OAB.
- `oab_numero` (string, required): Número da OAB.
- `oab_tipo` (string, optional): Tipo da OAB, pode ser informado caso o mesmo número exista para diferentes tipos. Pode ser `ADVOGADO`, `SUPLEMENTAR`, `ESTAGIARIO` ou `CONSULTOR_ESTRANGEIRO`.

#### Responses

- Status 200
```json
{
    "nome": "Fulano da Silva",
    "tipo": "ADVOGADO",
    "quantidade_processos": 153
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

### GET /api/v2/processos/numero_cnj/{numero}/documentos-publicos

**Documentos públicos de um processo**

Retorna uma lista dos documentos públicos de um processo a partir da numeração CNJ, que estão na base do Escavador. Caso precise atualizar os documentos, utilize a rota de [solicitar atualização de um processo](/v2/docs/atualizacao-de-processos#solicitar-atualizao-de-um-processo) com o parâmetro `documentos_publicos=1`.

- Requer autenticação: sim

#### URL Params

- `numero` (string, required): Número único do processo. <b>Obrigatório estar no formato de CNJ.</b>

#### Query Params

- `limit` (integer, optional): Quantidade de documentos por página. Pode ser 50 ou 100.

#### Responses

- Status 200
```json
{
    "items": [
        {
            "id": 11404,
            "titulo": "Despacho",
            "descricao": "Despacho | Despacho",
            "data": "2024-06-17 18:02:36",
            "tipo": "PUBLICO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 2,
            "key": "M3VLQSs0M1ZoaVgwaVlEc3pqSldJWDViUkdkckdtYk9BQ2hnSDFOODQ0N2dUNlpCbVM5S1ZPakpvN2JGcGJMMWhuMlJFbDBCZXNjVHY5eHV5UE1BQnc9PQ==",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/M3VLQSs0M1ZoaVgwaVlEc3pqSldJWDViUkdkckdtYk9BQ2hnSDFOODQ0N2dUNlpCbVM5S1ZPakpvN2JGcGJMMWhuMlJFbDBCZXNjVHY5eHV5UE1BQnc9PQ=="
            }
        },
        {
            "id": 11333,
            "titulo": "Despacho",
            "descricao": "Despacho | Despacho",
            "data": "2024-06-05 16:06:51",
            "tipo": "PUBLICO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": null,
            "key": "N2dGS0VWMFJoaUZyZFdsVzFja3pObDFiWFVwWE5sVndHRWpjSU9KWEg0MlpGeVpDYTFGSW5RbDBCeVlvM3NTSldJa0NCQ2hLZHpNOE4zR3dndG1BQ1E9PQ==",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/N2dGS0VWMFJoaUZyZFdsVzFja3pObDFiWFVwWE5sVndHRWpjSU9KWEg0MlpGeVpDYTFGSW5RbDBCeVlvM3NTSldJa0NCQ2hLZHpNOE4zR3dndG1BQ1E9PQ=="
            }
        },
        {
            "id": 10840,
            "titulo": "Despacho",
            "descricao": "Despacho | Despacho",
            "data": "2024-04-09 19:39:16",
            "tipo": "PUBLICO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 1,
            "key": "R3lDRlNWa1pIV1hWcDVZVEJrR1ZWUm5oZDFWSVZKcGpHTm1lV1FJZ1FRWFQwNFZCZkZ2ZlNkTlJKWlpSaGZMZGJXZ1h6eGFHWWdCQmNoR29QVE5ETGdndG1BQ0E9PQ==",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/R3lDRlNWa1pIV1hWcDVZVEJrR1ZWUm5oZDFWSVZKcGpHTm1lV1FJZ1FRWFQwNFZCZkZ2ZlNkTlJKWlpSaGZMZGJXZ1h6eGFHWWdCQmNoR29QVE5ETGdndG1BQ0E9PQ=="
            }
        },
        {
            "id": 14826,
            "titulo": "Despacho",
            "descricao": "Despacho | Despacho",
            "data": "2024-03-19 18:25:33",
            "tipo": "PUBLICO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 1,
            "key": "O2VSU1lGQm5rR0Zra1dIVU5ka3lRMjFhYkpKaFpYQ0pjS09LbXZWWFozVEdaRmZhU0lkSWRRcFFBeVdoTEpVQllSRWxaS1hBZGRkZk5RTXZnZ0FDZ1E9PQ==",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/O2VSU1lGQm5rR0Zra1dIVU5ka3lRMjFhYkpKaFpYQ0pjS09LbXZWWFozVEdaRmZhU0lkSWRRcFFBeVdoTEpVQllSRWxaS1hBZGRkZk5RTXZnZ0FDZ1E9PQ==O2VSU1lGQm5rR0Zra1dIVU5ka3lRMjFhYkpKaFpYQ0pjS09LbXZWWFozVEdaRmZhU0lkSWRRcFFBeVdoTEpVQllSRWxaS1hBZGRkZk5RTXZnZ0FDZ1E9PQ=="
            }
        },
        {
            "id": 10808,
            "titulo": "Despacho",
            "descricao": "Despacho | Despacho",
            "data": "2024-03-08 10:37:25",
            "tipo": "PUBLICO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": null,
            "key": "T3REUllLa3dIRkpoZFhkbFpjRmZKa1ZFVlZNa1pUdmhlTmxJc1ZWQklRbElkVmdZVW5wWlRBQlhlVWdGSWRkblZsRFlGZ0FUQUJDWmdFQT09",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/T3REUllLa3dIRkpoZFhkbFpjRmZKa1ZFVlZNa1pUdmhlTmxJc1ZWQklRbElkVmdZVW5wWlRBQlhlVWdGSWRkblZsRFlGZ0FUQUJDWmdFQT09"
            }
        },
        {
            "id": 10041,
            "titulo": "Acórdão",
            "descricao": "Acórdão | Acórdão",
            "data": "2024-02-22 22:38:37",
            "tipo": "PUBLICO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 2,
            "key": "P0ZLVk5QVWdoRmpGZkRaWFlHVmxaM2RIVkhWeVZGRGpOT3JkRWRVU2ZGWGRHSmtNbEdpVFZRQWRBdURJaUVjRExBZ0VJQ0FCU0FSWk1BQ3c9PQ==",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/P0ZLVk5QVWdoRmpGZkRaWFlHVmxaM2RIVkhWeVZGRGpOT3JkRWRVU2ZGWGRHSmtNbEdpVFZRQWRBdURJaUVjRExBZ0VJQ0FCU0FSWk1BQ3c9PQ=="
            }
        },
        {
            "id": 18561,
            "titulo": "Despacho",
            "descricao": "Despacho | Despacho",
            "data": "2024-02-07 14:54:00",
            "tipo": "PUBLICO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 2,
            "key": "MzZWVkpWWkZWY1RqVkdWZFpFWkFaM1pUYzJGbWRWWnhYWFpjU1lGSWVrR0ZIWVZaVWxHSk9qTmxIa1dYVkZRQ0FJQ1lWQ0tETkFJQT09",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/MzZWVkpWWkZWY1RqVkdWZFpFWkFaM1pUYzJGbWRWWnhYWFpjU1lGSWVrR0ZIWVZaVWxHSk9qTmxIa1dYVkZRQ0FJQ1lWQ0tETkFJQT09"
            }
        },
        {
            "id": 95986,
            "titulo": "Despacho",
            "descricao": "Despacho | Despacho",
            "data": "2024-01-09 13:52:05",
            "tipo": "PUBLICO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 1,
            "key": "W1ZWS0pIVk5sRldIVm1Sa1VIV0ZZbVZpUVhJcElVVGpHZFNFWm9YWlpXZGZhT1pFa05ETkpZdFZDQlpDWWdFR3dNd0FDRU1NQkFDZz09",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/W1ZWS0pIVk5sRldIVm1Sa1VIV0ZZbVZpUVhJcElVVGpHZFNFWm9YWlpXZGZhT1pFa05ETkpZdFZDQlpDWWdFR3dNd0FDRU1NQkFDZz09"
            }
        },
        {
            "id": 94232,
            "titulo": "Acórdão",
            "descricao": "Acórdão | Acórdão",
            "data": "2023-12-02 06:37:41",
            "tipo": "PUBLICO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 1,
            "key": "D0ZGSk5Ka1dIZ0ZJb2RrVmZGWkZaUkpFQ0tkQ1FKbVZIUkRkVkdOT3BEUmQxQmhrVmZkU1pOTEl3WlZaQmdBdEFGQ0lFQ1dCT0NBZz09",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/D0ZGSk5Ka1dIZ0ZJb2RrVmZGWkZaUkpFQ0tkQ1FKbVZIUkRkVkdOT3BEUmQxQmhrVmZkU1pOTEl3WlZaQmdBdEFGQ0lFQ1dCT0NBZz09"
            }
        },
        {
            "id": 92398,
            "titulo": "Decisão",
            "descricao": "Decisão | Decisão",
            "data": "2023-10-30 23:57:39",
            "tipo": "PUBLICO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 1,
            "key": "T2hWVk5LQWZWWVJoa1lFQmxVZFluUlZGWnBjVk5XV3pGZFpJU05sRlFzQ0FXWkxFaUJKVVRTcFNlZ3BJQ0ZGZ1VIV0VBZ3dNR0NJTUFJQT09",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/T2hWVk5LQWZWWVJoa1lFQmxVZFluUlZGWnBjVk5XV3pGZFpJU05sRlFzQ0FXWkxFaUJKVVRTcFNlZ3BJQ0ZGZ1VIV0VBZ3dNR0NJTUFJQT09"
            }
        },
        {
            "id": 98409,
            "titulo": "Sentença",
            "descricao": "Sentença | Sentença",
            "data": "2023-09-26 23:01:43",
            "tipo": "PUBLICO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 1,
            "key": "O0ZLVlVGS0hZVlpaWW1sVVRlZE5qSUxWZkVIVnpWS2dFU0FGeFRZVmJZWkZIYkVVU2dGa0FFU1FZUVFNV2FSbUZJZ1pDQUFJQ0VDQmNBZz09",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/O0ZLVlVGS0hZVlpaWW1sVVRlZE5qSUxWZkVIVnpWS2dFU0FGeFRZVmJZWkZIYkVVU2dGa0FFU1FZUVFNV2FSbUZJZ1pDQUFJQ0VDQmNBZz09"
            }
        },
        {
            "id": 94210,
            "titulo": "Ata da Audiência",
            "descricao": "Ata da Audiência | Ata da Audiência",
            "data": "2023-09-26 11:21:40",
            "tipo": "PUBLICO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 1,
            "key": "P1ZaVk5MWldUVlZaRmZJVkpaTlFIZGRQYldwRmVUVUtkWEpGSU1WVEpXZW1GU1lGWk5LQ0pCQ2tXUlJIZW1HS1lWQ1NWZ1RHZ0NBSUVNR0lBZz09",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/P1ZaVk5MWldUVlZaRmZJVkpaTlFIZGRQYldwRmVUVUtkWEpGSU1WVEpXZW1GU1lGWk5LQ0pCQ2tXUlJIZW1HS1lWQ1NWZ1RHZ0NBSUVNR0lBZz09"
            }
        }
    ],
    "links": {
        "next": null,
        "prev": null,
        "first": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos?page=1",
        "last": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos?page=1"
    },
    "paginator": {
        "current_page": 1,
        "per_page": 20,
        "total": 12,
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
    "code": "NOT_FOUND",
    "message": "Recurso não encontrado",
    "errors": null,
    "appends": null
}
```

- Status 422
```json
{
    "code": "NUMERO_CNJ_INVALIDO",
    "message": "O número do processo não está no formato CNJ.",
    "errors": null,
    "appends": null
}
```

### GET /api/v2/processos/numero_cnj/{numero}/autos

**Autos do processo (públicos e restritos)**

Retorna a lista paginada de todos os documentos de um processo (públicos e restritos), conhecidos como "autos", que estão na base do Escavador.

O acesso a este endpoint requer que você tenha previamente solicitado a atualização do processo com a opção `autos=1` e obtido o status `SUCESSO`. Essa etapa é necessária para garantir a permissão de acesso aos documentos restritos. Para obter os autos mais recentes, utilize a rota de [solicitar atualização de um processo](/v2/docs/atualizacao-de-processos#solicitar-atualizao-de-um-processo).

- Requer autenticação: sim

#### URL Params

- `numero` (string, required): Número único do processo. <b>Obrigatório estar no formato de CNJ.</b>

#### Query Params

- `limit` (integer, optional): Quantidade de documentos por página. Os valores permitidos são 50 ou 100. Padrão: 50.

#### Responses

- Status 200
```json
{
    "items": [
        {
            "id": 11404,
            "titulo": "Despacho",
            "descricao": "Despacho | Despacho",
            "data": "2024-06-17 18:02:36",
            "tipo": "RESTRITO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 2,
            "key": "M3VLQSs0M1ZoaVgwaVlEc3pqSldJWDViUkdkckdtYk9BQ2hnSDFOODQ0N2dUNlpCbVM5S1ZPakpvN2JGcGJMMWhuMlJFbDBCZXNjVHY5eHV5UE1BQnc9PQ==",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/M3VLQSs0M1ZoaVgwaVlEc3pqSldJWDViUkdkckdtYk9BQ2hnSDFOODQ0N2dUNlpCbVM5S1ZPakpvN2JGcGJMMWhuMlJFbDBCZXNjVHY5eHV5UE1BQnc9PQ=="
            }
        },
        {
            "id": 11333,
            "titulo": "Despacho",
            "descricao": "Despacho | Despacho",
            "data": "2024-06-05 16:06:51",
            "tipo": "RESTRITO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": null,
            "key": "N2dGS0VWMFJoaUZyZFdsVzFja3pObDFiWFVwWE5sVndHRWpjSU9KWEg0MlpGeVpDYTFGSW5RbDBCeVlvM3NTSldJa0NCQ2hLZHpNOE4zR3dndG1BQ1E9PQ==",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/N2dGS0VWMFJoaUZyZFdsVzFja3pObDFiWFVwWE5sVndHRWpjSU9KWEg0MlpGeVpDYTFGSW5RbDBCeVlvM3NTSldJa0NCQ2hLZHpNOE4zR3dndG1BQ1E9PQ=="
            }
        },
        {
            "id": 10840,
            "titulo": "Despacho",
            "descricao": "Despacho | Despacho",
            "data": "2024-04-09 19:39:16",
            "tipo": "RESTRITO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 1,
            "key": "R3lDRlNWa1pIV1hWcDVZVEJrR1ZWUm5oZDFWSVZKcGpHTm1lV1FJZ1FRWFQwNFZCZkZ2ZlNkTlJKWlpSaGZMZGJXZ1h6eGFHWWdCQmNoR29QVE5ETGdndG1BQ0E9PQ==",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/R3lDRlNWa1pIV1hWcDVZVEJrR1ZWUm5oZDFWSVZKcGpHTm1lV1FJZ1FRWFQwNFZCZkZ2ZlNkTlJKWlpSaGZMZGJXZ1h6eGFHWWdCQmNoR29QVE5ETGdndG1BQ0E9PQ=="
            }
        },
        {
            "id": 14826,
            "titulo": "Despacho",
            "descricao": "Despacho | Despacho",
            "data": "2024-03-19 18:25:33",
            "tipo": "RESTRITO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 1,
            "key": "O2VSU1lGQm5rR0Zra1dIVU5ka3lRMjFhYkpKaFpYQ0pjS09LbXZWWFozVEdaRmZhU0lkSWRRcFFBeVdoTEpVQllSRWxaS1hBZGRkZk5RTXZnZ0FDZ1E9PQ==",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/O2VSU1lGQm5rR0Zra1dIVU5ka3lRMjFhYkpKaFpYQ0pjS09LbXZWWFozVEdaRmZhU0lkSWRRcFFBeVdoTEpVQllSRWxaS1hBZGRkZk5RTXZnZ0FDZ1E9PQ==O2VSU1lGQm5rR0Zra1dIVU5ka3lRMjFhYkpKaFpYQ0pjS09LbXZWWFozVEdaRmZhU0lkSWRRcFFBeVdoTEpVQllSRWxaS1hBZGRkZk5RTXZnZ0FDZ1E9PQ=="
            }
        },
        {
            "id": 10808,
            "titulo": "Despacho",
            "descricao": "Despacho | Despacho",
            "data": "2024-03-08 10:37:25",
            "tipo": "RESTRITO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": null,
            "key": "T3REUllLa3dIRkpoZFhkbFpjRmZKa1ZFVlZNa1pUdmhlTmxJc1ZWQklRbElkVmdZVW5wWlRBQlhlVWdGSWRkblZsRFlGZ0FUQUJDWmdFQT09",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/T3REUllLa3dIRkpoZFhkbFpjRmZKa1ZFVlZNa1pUdmhlTmxJc1ZWQklRbElkVmdZVW5wWlRBQlhlVWdGSWRkblZsRFlGZ0FUQUJDWmdFQT09"
            }
        },
        {
            "id": 10041,
            "titulo": "Acórdão",
            "descricao": "Acórdão | Acórdão",
            "data": "2024-02-22 22:38:37",
            "tipo": "RESTRITO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 2,
            "key": "P0ZLVk5QVWdoRmpGZkRaWFlHVmxaM2RIVkhWeVZGRGpOT3JkRWRVU2ZGWGRHSmtNbEdpVFZRQWRBdURJaUVjRExBZ0VJQ0FCU0FSWk1BQ3c9PQ==",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/P0ZLVk5QVWdoRmpGZkRaWFlHVmxaM2RIVkhWeVZGRGpOT3JkRWRVU2ZGWGRHSmtNbEdpVFZRQWRBdURJaUVjRExBZ0VJQ0FCU0FSWk1BQ3c9PQ=="
            }
        },
        {
            "id": 18561,
            "titulo": "Despacho",
            "descricao": "Despacho | Despacho",
            "data": "2024-02-07 14:54:00",
            "tipo": "PUBLICO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 2,
            "key": "MzZWVkpWWkZWY1RqVkdWZFpFWkFaM1pUYzJGbWRWWnhYWFpjU1lGSWVrR0ZIWVZaVWxHSk9qTmxIa1dYVkZRQ0FJQ1lWQ0tETkFJQT09",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/MzZWVkpWWkZWY1RqVkdWZFpFWkFaM1pUYzJGbWRWWnhYWFpjU1lGSWVrR0ZIWVZaVWxHSk9qTmxIa1dYVkZRQ0FJQ1lWQ0tETkFJQT09"
            }
        },
        {
            "id": 95986,
            "titulo": "Despacho",
            "descricao": "Despacho | Despacho",
            "data": "2024-01-09 13:52:05",
            "tipo": "PUBLICO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 1,
            "key": "W1ZWS0pIVk5sRldIVm1Sa1VIV0ZZbVZpUVhJcElVVGpHZFNFWm9YWlpXZGZhT1pFa05ETkpZdFZDQlpDWWdFR3dNd0FDRU1NQkFDZz09",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/W1ZWS0pIVk5sRldIVm1Sa1VIV0ZZbVZpUVhJcElVVGpHZFNFWm9YWlpXZGZhT1pFa05ETkpZdFZDQlpDWWdFR3dNd0FDRU1NQkFDZz09"
            }
        },
        {
            "id": 94232,
            "titulo": "Acórdão",
            "descricao": "Acórdão | Acórdão",
            "data": "2023-12-02 06:37:41",
            "tipo": "RESTRITO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 1,
            "key": "D0ZGSk5Ka1dIZ0ZJb2RrVmZGWkZaUkpFQ0tkQ1FKbVZIUkRkVkdOT3BEUmQxQmhrVmZkU1pOTEl3WlZaQmdBdEFGQ0lFQ1dCT0NBZz09",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/D0ZGSk5Ka1dIZ0ZJb2RrVmZGWkZaUkpFQ0tkQ1FKbVZIUkRkVkdOT3BEUmQxQmhrVmZkU1pOTEl3WlZaQmdBdEFGQ0lFQ1dCT0NBZz09"
            }
        },
        {
            "id": 92398,
            "titulo": "Decisão",
            "descricao": "Decisão | Decisão",
            "data": "2023-10-30 23:57:39",
            "tipo": "RESTRITO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 1,
            "key": "T2hWVk5LQWZWWVJoa1lFQmxVZFluUlZGWnBjVk5XV3pGZFpJU05sRlFzQ0FXWkxFaUJKVVRTcFNlZ3BJQ0ZGZ1VIV0VBZ3dNR0NJTUFJQT09",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/T2hWVk5LQWZWWVJoa1lFQmxVZFluUlZGWnBjVk5XV3pGZFpJU05sRlFzQ0FXWkxFaUJKVVRTcFNlZ3BJQ0ZGZ1VIV0VBZ3dNR0NJTUFJQT09"
            }
        },
        {
            "id": 98409,
            "titulo": "Sentença",
            "descricao": "Sentença | Sentença",
            "data": "2023-09-26 23:01:43",
            "tipo": "RESTRITO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 1,
            "key": "O0ZLVlVGS0hZVlpaWW1sVVRlZE5qSUxWZkVIVnpWS2dFU0FGeFRZVmJZWkZIYkVVU2dGa0FFU1FZUVFNV2FSbUZJZ1pDQUFJQ0VDQmNBZz09",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/O0ZLVlVGS0hZVlpaWW1sVVRlZE5qSUxWZkVIVnpWS2dFU0FGeFRZVmJZWkZIYkVVU2dGa0FFU1FZUVFNV2FSbUZJZ1pDQUFJQ0VDQmNBZz09"
            }
        },
        {
            "id": 94210,
            "titulo": "Ata da Audiência",
            "descricao": "Ata da Audiência | Ata da Audiência",
            "data": "2023-09-26 11:21:40",
            "tipo": "RESTRITO",
            "extensao_arquivo": "pdf",
            "quantidade_paginas": 1,
            "key": "P1ZaVk5MWldUVlZaRmZJVkpaTlFIZGRQYldwRmVUVUtkWEpGSU1WVEpXZW1GU1lGWk5LQ0pCQ2tXUlJIZW1HS1lWQ1NWZ1RHZ0NBSUVNR0lBZz09",
            "links": {
                "api": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos/P1ZaVk5MWldUVlZaRmZJVkpaTlFIZGRQYldwRmVUVUtkWEpGSU1WVEpXZW1GU1lGWk5LQ0pCQ2tXUlJIZW1HS1lWQ1NWZ1RHZ0NBSUVNR0lBZz09"
            }
        }
    ],
    "links": {
        "next": null,
        "prev": null,
        "first": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos?page=1",
        "last": "https://api.escavador.com/api/v2/processos/numero_cnj/9213798-66.2024.2.00.6793/documentos?page=1"
    },
    "paginator": {
        "current_page": 1,
        "per_page": 20,
        "total": 12,
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
    "code": "NOT_FOUND",
    "message": "Recurso não encontrado",
    "errors": null,
    "appends": null
}
```

- Status 422
```json
{
    "code": "NUMERO_CNJ_INVALIDO",
    "message": "O número do processo não está no formato CNJ.",
    "errors": null,
    "appends": null
}
```

### GET /api/v2/processos/numero_cnj/{numero}/documentos/{key}

**Download do PDF de um Documento**

Permite baixar um documento de um processo em formato PDF, utilizando a numeração CNJ e uma chave de acesso exclusiva para cada documento.

Acesse a [lista de documentos públicos](/v2/docs/consulta-de-processos#documentos-publicos-de-um-processo) para mais detalhes sobre os documentos e a chave, fornecida por nós.

- Requer autenticação: sim

#### URL Params

- `numero` (string, required): Número único do processo. <b>Obrigatório estar no formato de CNJ.</b>
- `key` (string, required): Chave disponibilizada pela nossa API

#### Responses

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
    "code": "NOT_FOUND",
    "message": "Recurso não encontrado",
    "errors": null,
    "appends": null
}
```

### GET /api/v2/processos/numero_cnj/{numero}/envolvidos

**Envolvidos de um processo**

Retorna uma lista dos envolvidos de um processo a partir da numeração CNJ.

- Requer autenticação: sim

#### URL Params

- `numero` (string, required): Número único do processo. <b>Obrigatório estar no formato de CNJ.</b>

#### Query Params

- `limit` (integer, optional): Quantidade de envolvidos por página. Pode ser 50 ou 100.

#### Responses

- Status 200
```json
{
    "items": [
        {
            "nome": "Município de Gravataí / RS",
            "quantidade_processos": 4177,
            "tipo_pessoa": "JURIDICA",
            "cpf": null,
            "cnpj": "87.890.992/0001-58",
            "participacoes_processo": [
                {
                    "tipo": "REQUERIDO",
                    "tipo_normalizado": "Requerido",
                    "polo": "PASSIVO",
                    "prefixo": null,
                    "sufixo": null,
                    "advogados": [],
                    "fonte": {
                        "processo_fonte_id": 715246906,
                        "id": 2827,
                        "tipo": "TRIBUNAL",
                        "nome": "Tribunal de Justiça do Rio Grande do Sul",
                        "sigla": "TJRS",
                        "grau": 1,
                        "grau_formatado": "Primeiro Grau"
                    }
                }
            ]
        },
        {
            "nome": "João da Silva",
            "quantidade_processos": 567,
            "tipo_pessoa": "FISICA",
            "cpf": "123.456.789-00",
            "cnpj": null,
            "participacoes_processo": [
                {
                    "tipo": "Apelado",
                    "tipo_normalizado": "Apelado",
                    "polo": "PASSIVO",
                    "prefixo": null,
                    "sufixo": null,
                    "advogados": [],
                    "fonte": {
                        "processo_fonte_id": 987654321,
                        "id": 5678,
                        "tipo": "TRIBUNAL",
                        "nome": "Supremo Tribunal Federal",
                        "sigla": "STF",
                        "grau": 3,
                        "grau_formatado": "Superior"
                    }
                }
            ]
        },
        {
            "nome": "Município de Porto Alegre / RS",
            "quantidade_processos": 2345,
            "tipo_pessoa": "JURIDICA",
            "cpf": null,
            "cnpj": "98.765.432/0001-12",
            "participacoes_processo": [
                {
                    "tipo": "REQUERIDO",
                    "tipo_normalizado": "Requerido",
                    "polo": "ATIVO",
                    "prefixo": null,
                    "sufixo": null,
                    "advogados": [],
                    "fonte": {
                        "processo_fonte_id": 112233445,
                        "id": 9101,
                        "tipo": "TRIBUNAL",
                        "nome": "Tribunal Regional Federal",
                        "sigla": "TRF",
                        "grau": 1,
                        "grau_formatado": "Primeiro Grau"
                    }
                }
            ]
        },
        {
            "nome": "Maria Oliveira",
            "quantidade_processos": 890,
            "tipo_pessoa": "FISICA",
            "cpf": "987.654.321-00",
            "cnpj": null,
            "participacoes_processo": [
                {
                    "tipo": "AGRAVADO",
                    "tipo_normalizado": "Agravado",
                    "polo": "PASSIVO",
                    "prefixo": null,
                    "sufixo": null,
                    "advogados": [
                        {
                            "nome": "Danielle Almeida",
                            "quantidade_processos": 1,
                            "tipo_pessoa": "FISICA",
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "Advogado",
                            "tipo_normalizado": "Advogado",
                            "polo": "ADVOGADO",
                            "cpf": null,
                            "cnpj": null
                        }
                    ],
                    "fonte": {
                        "processo_fonte_id": 223344556,
                        "id": 3344,
                        "tipo": "TRIBUNAL",
                        "nome": "Tribunal de Justiça do Rio de Janeiro",
                        "sigla": "TJRJ",
                        "grau": 2,
                        "grau_formatado": "Segundo Grau"
                    }
                }
            ]
        },
        {
            "nome": "Associação ABC",
            "quantidade_processos": 456,
            "tipo_pessoa": "JURIDICA",
            "cpf": null,
            "cnpj": "11.222.333/0001-44",
            "participacoes_processo": [
                {
                    "tipo": "Apelado",
                    "tipo_normalizado": "Apelado",
                    "polo": null,
                    "prefixo": null,
                    "sufixo": null,
                    "advogados": [
                        {
                            "nome": "Ana Souza",
                            "quantidade_processos": 1,
                            "tipo_pessoa": "FISICA",
                            "prefixo": null,
                            "sufixo": null,
                            "tipo": "Advogado",
                            "tipo_normalizado": "Advogado",
                            "polo": "ADVOGADO",
                            "cpf": null,
                            "cnpj": null,
                            "oabs": [
                                {
                                    "uf": "SP",
                                    "tipo": "ADVOGADO",
                                    "numero": 123456
                                }
                            ]
                        }
                    ],
                    "fonte": {
                        "processo_fonte_id": 445566778,
                        "id": 5566,
                        "tipo": "TRIBUNAL",
                        "nome": "Tribunal de Justiça de Minas Gerais",
                        "sigla": "TJMG",
                        "grau": 1,
                        "grau_formatado": "Primeiro Grau"
                    }
                }
            ]
        }
    ],
    "links": {
        "next": "https://api.escavador.com/api/v2/processos/numero_cnj/87.890.992/0001-58/envolvidos?cursor=eyJlbnZvbHZpZG9fcHJvY2Vzc28uaWQiOjE5OSwiX3BvaW50c1RvTmV4dEl0ZW1zIjp0cnVlfQ&li=1262"
    },
    "paginator": {
        "per_page": 20
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
    "code": "NOT_FOUND",
    "message": "Recurso não encontrado",
    "errors": null,
    "appends": null
}
```

- Status 422
```json
{
    "code": "NUMERO_CNJ_INVALIDO",
    "message": "O número do processo não está no formato CNJ.",
    "errors": null,
    "appends": null
}
```

## Resumo de processos (IA)

### POST /api/v2/processos/numero_cnj/{numero}/ia/resumo/solicitar-atualizacao

**Solicita a geração/atualização do resumo inteligente de um processo.**

Esta rota registra uma solicitação para gerar ou atualizar o resumo inteligente do processo. O resumo é baseado nos dados mais recentes disponíveis em nossa base. Para garantir que o resumo reflita as últimas alterações no tribunal, recomenda-se primeiro atualizar o processo através da rota [Atualizar Processo](/v2/docs/atualizacao-de-processos#solicitar-atualizao-de-um-processo).

<aside class="notice">
Para a implementação completa do fluxo (solicitar, acompanhar status e buscar resumo), consulte: [Fluxo de implementação: Resumo de processos (IA)](/v2/docs/fluxo-resumo-processos-ia).
</aside>

- Requer autenticação: sim

#### URL Params

- `numero` (string, required): Número único do processo. <b>Obrigatório estar no formato de CNJ.</b>

#### Responses

- Status 201
```json
{
    "id": 2001596,
    "status": "PENDENTE",
    "criado_em": "2025-01-13T21:01:26+00:00",
    "numero_cnj": "8118778-37.2021.8.05.0001",
    "concluido_em": null
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
    "code": "NOT_FOUND",
    "message": "Recurso não encontrado",
    "errors": null,
    "appends": null
}
```

- Status 422
```json
{
    "code": "NUMERO_CNJ_INVALIDO",
    "message": "O número do processo não está no formato CNJ.",
    "errors": null,
    "appends": null
}
```

### GET /api/v2/processos/numero_cnj/{numero}/ia/resumo

**Resumo inteligente de um processo**

Retorna o resumo inteligente do processo, caso o resumo já exista. No retorno, são exibidos o número CNJ do processo, o conteúdo do resumo (normalmente um texto resumido com os elementos essenciais do processo) e a data de atualização do resumo.
<aside class="notice">
Para a implementação correta em produção, consulte o fluxo recomendado em: [Fluxo de implementação: Resumo de processos (IA)](/v2/docs/fluxo-resumo-processos-ia).
</aside>

- Requer autenticação: sim

#### URL Params

- `numero` (string, required): Número único do processo. <b>Obrigatório estar no formato de CNJ.</b>

#### Responses

- Status 200
```json
{
    "numero_cnj": "8118778-37.2021.8.05.0001",
    "conteudo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis a nibh sit amet tellus elementum rhoncus. Mauris ullamcorper posuere odio sodales dictum. Etiam pellentesque euismod quam, a accumsan metus. Fusce lobortis, ipsum eget feugiat efficitur, urna nisi rhoncus tortor, vel interdum libero odio ac ligula. Phasellus sapien massa, malesuada eget augue eget, consectetur gravida elit. In at ipsum tempor, blandit metus quis, semper mauris. Nunc in sem ullamcorper, vestibulum ex et, volutpat velit.",
    "atualizado_em": "2025-01-13T21:01:33+00:00"
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
    "code": "NOT_FOUND",
    "message": "Recurso não encontrado",
    "errors": null,
    "appends": null
}
```

- Status 422
```json
{
    "code": "NUMERO_CNJ_INVALIDO",
    "message": "O número do processo não está no formato CNJ.",
    "errors": null,
    "appends": null
}
```

### GET /api/v2/processos/numero_cnj/{numero}/ia/resumo/status

**Status da solicitação de resumo inteligente**

Permite consultar o status atual do resumo inteligente para um determinado processo.
O status pode indicar, por exemplo, que a solicitação foi concluída (FINALIZADO) ou permanece em aberto.
<aside class="notice">
Para o encadeamento completo entre solicitação, status e leitura do resumo, consulte: [Fluxo de implementação: Resumo de processos (IA)](/v2/docs/fluxo-resumo-processos-ia).
</aside>



### Status da solicitação de resumo inteligente
Campo | Descrição
--------- | -------
PENDENTE | Aguardando o robô gerar o resumo inteligente.
FINALIZADO | Resumo inteligente gerado com sucesso.

- Requer autenticação: sim

#### URL Params

- `numero` (string, required): Número único do processo. <b>Obrigatório estar no formato de CNJ.</b>

#### Query Params

- `id` (integer, optional): Id da solicitação de resumo.

#### Responses

- Status 200
```json
{
    "id": 2001596,
    "status": "FINALIZADO",
    "criado_em": "2025-01-13T21:01:27+00:00",
    "numero_cnj": "8118778-37.2021.8.05.0001",
    "concluido_em": "2025-01-13T21:01:33+00:00"
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
    "code": "NOT_FOUND",
    "message": "Recurso não encontrado",
    "errors": null,
    "appends": null
}
```

- Status 422
```json
{
    "code": "NUMERO_CNJ_INVALIDO",
    "message": "O número do processo não está no formato CNJ.",
    "errors": null,
    "appends": null
}
```

## Monitoramento de novos processos

### POST /api/v2/monitoramentos/novos-processos

**Criar monitoramento**

O termo enviado será monitorado nas capas e nos envolvidos dos processos. Todos os processos que contiverem o termo serão enviados.




#### Callbacks relacionados
Evento | Descrição
--------- | -------
<a href="/v2/docs/callbacks#monitoramento-de-novos-processos-novo-processo-encontrado">novo_processo</a> | Ocorre quando um monitoramento de novos processos encontra algum processo novo.

- Requer autenticação: sim

#### Body Params

- `termo` (string, required): Termo a ser monitorado. Pode ser o nome de um envolvido, um CPF/CNPJ ou algum termo genérico que apareça na capa do processo.
- `variacoes` (array<string>, optional): Lista de variações do termo a ser monitorado. Caso o processo dê match com alguma variação, será alertado. É permitido o registro de até duas variações.
- `termos_auxiliares` (array<object>, optional): Lista de termos e condições para o alerta do monitoramento. As condições que podem ser utilizadas são as seguintes:<br/><b>CONTEM</b>: apenas irá alertar se o processo tiver todos os nomes informados.<br/><b>NAO_CONTEM</b>: apenas irá alertar se não tiver nenhum dos termos informados.<br/><b>CONTEM_ALGUMA</b>: apenas irá alertar, se tiver pelo menos 1 dos termos informados.
- `tribunais` (array<string>, optional): Lista de siglas dos tribunais específicos que o monitoramento deve ser feito, caso não seja informado, o monitoramento será feito em todos os tribunais.

#### Responses

- Status 200
```json
{
    "id": 111,
    "termo": "Fulano",
    "criado_em": "2023-11-23T18:12:12+00:00",
    "variacoes": [],
    "termos_auxiliares": [],
    "tribunais_especificos": []
}
```

- Status 200
```json
{
    "id": 112,
    "termo": "Fulano de tal",
    "tipo": "TERMO",
    "criado_em": "2023-11-23 18:15:13",
    "variacoes": [
        " de tal",
        " de tal e tal"
    ]
}
```

- Status 200
```json
{
    "id": 112,
    "termo": "Fulano de tal",
    "tipo": "TERMO",
    "criado_em": "2023-11-23 18:15:13",
    "termos_auxiliares": {
        "CONTEM": [
            "Fulano"
        ],
        "NAO_CONTEM": [
            "Fulano de tal"
        ],
        "CONTEM_ALGUMA": [
            "Fulano",
            "Fulano de tal"
        ]
    }
}
```

- Status 200
```json
{
    "id": 112,
    "termo": "Fulano de tal",
    "tipo": "TERMO",
    "criado_em": "2023-11-23 18:15:13",
    "variacoes": [
        " de tal",
        " de tal e tal"
    ],
    "termos_auxiliares": {
        "CONTEM": [
            "Fulano"
        ],
        "NAO_CONTEM": [
            "Fulano de tal"
        ],
        "CONTEM_ALGUMA": [
            "Fulano",
            "Fulano de tal"
        ]
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

### GET /api/v2/monitoramentos/novos-processos

**Listar monitoramentos**

Retorna todos os monitoramentos de novos processos do usuário

- Requer autenticação: sim

#### Responses

- Status 200
```json
{
    "items": [
        {
            "id": 103,
            "termo": "EMPRESA SA",
            "criado_em": "2023-11-22T22:13:43+00:00",
            "variacoes": [],
            "termos_auxiliares": [],
            "tribunais_especificos": []
        },
        {
            "id": 111,
            "termo": "Fulano",
            "criado_em": "2023-11-23T18:12:12+00:00",
            "variacoes": [],
            "termos_auxiliares": [],
            "tribunais_especificos": []
        },
        {
            "id": 112,
            "termo": "Fulano de tal",
            "criado_em": "2023-11-23T18:15:13+00:00",
            "variacoes": [
                "Fulano d. tal",
                "Fulano de t."
            ],
            "termos_auxiliares": {
                "CONTEM": [
                    "Fulana"
                ],
                "NAO_CONTEM": [
                    "Outra pessoa"
                ]
            },
            "tribunais_especificos": []
        }
    ],
    "links": {
        "next": null,
        "prev": null,
        "first": "http://api.escavador.com/api/v2/monitoramentos/novos-processos?page=1",
        "last": "http://api.escavador.com/api/v2/monitoramentos/novos-processos?page=1"
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

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

### GET /api/v2/monitoramentos/novos-processos/{id}

**Buscar monitoramento**

Retorna um monitoramento de novos processos a partir do id

- Requer autenticação: sim

#### URL Params

- `id` (integer, required): Id do monitoramento.

#### Responses

- Status 200
```json
{
    "id": 111,
    "termo": "Fulano",
    "criado_em": "2023-11-23T18:12:12+00:00",
    "variacoes": [],
    "termos_auxiliares": [],
    "tribunais_especificos": []
}
```

- Status 200
```json
{
    "id": 112,
    "termo": "Fulano de tal",
    "tipo": "TERMO",
    "criado_em": "2023-11-23 18:15:13",
    "variacoes": [
        " de tal",
        " de tal e tal"
    ]
}
```

- Status 200
```json
{
    "id": 112,
    "termo": "Fulano de tal",
    "tipo": "TERMO",
    "criado_em": "2023-11-23 18:15:13",
    "termos_auxiliares": {
        "CONTEM": [
            "Fulano"
        ],
        "NAO_CONTEM": [
            "Fulano de tal"
        ],
        "CONTEM_ALGUMA": [
            "Fulano",
            "Fulano de tal"
        ]
    }
}
```

- Status 200
```json
{
    "id": 112,
    "termo": "Fulano de tal",
    "tipo": "TERMO",
    "criado_em": "2023-11-23 18:15:13",
    "variacoes": [
        " de tal",
        " de tal e tal"
    ],
    "termos_auxiliares": {
        "CONTEM": [
            "Fulano"
        ],
        "NAO_CONTEM": [
            "Fulano de tal"
        ],
        "CONTEM_ALGUMA": [
            "Fulano",
            "Fulano de tal"
        ]
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

### DELETE /api/v2/monitoramentos/novos-processos/{id}

**Remover monitoramento**

Remove um monitoramento de novos processos a partir do id

- Requer autenticação: sim

#### URL Params

- `id` (integer, required): Id do monitoramento.

#### Responses

- Status 204
```json
{}
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

### GET /api/v2/monitoramentos/novos-processos/{id}/resultados

**Listar processos encontrados**

Retorna os resultados do monitoramento de novos procesos, a partir do seu ID.

- Requer autenticação: sim

#### URL Params

- `id` (integer, required): Id do monitoramento.

#### Responses

- Status 200
```json
{
    "items": [
        {
            "numero_cnj": "3833283-72.2025.4.02.8208",
            "data_inicio": "2025-03-05",
            "tribunal": "TRT-11",
            "match": "<b>João da Silva</b> requerente 92969887215 sind dos emp em estab bancarios no...",
            "estado_origem": {
                "nome": "Amazonas",
                "sigla": "AM"
            }
        },
        {
            "numero_cnj": "6903212-72.2025.2.00.3259",
            "data_inicio": "2024-12-09",
            "tribunal": "TRT-10",
            "match": "expedido(a) intimacao a(o) <b>João da Silva</b>",
            "estado_origem": {
                "nome": "Amazonas",
                "sigla": "AM"
            }
        }
    ],
    "links": {
        "next": null
    },
    "paginator": {
        "per_page": 20
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

### PATCH /api/v2/monitoramentos/novos-processos/{id}

**Editar um monitoramento**

Edita um monitoramento de novos processos.

A atualização dos campos `variacoes`, `termos_auxiliares` e `tribunais` segue uma lógica de **substituição completa**: ao enviar um campo, sua lista de valores substitui inteiramente a anterior. Campos não enviados na requisição permanecem inalterados.

- Requer autenticação: sim

#### URL Params

- `id` (integer, required): Id do monitoramento.

#### Body Params

- `variacoes` (array<string>, optional): Lista de variações do termo a ser monitorado. É permitido o registro de até duas variações. <br/><br/>- Para <strong>remover todas</strong> as variações, envie um array vazio <code>[]</code>.
- `termos_auxiliares` (object[], optional): Lista de termos e condições para o alerta do monitoramento. As condições que podem ser utilizadas são as seguintes:<br/><b>CONTEM</b>: apenas irá alertar se o processo conter todos os nomes informados.<br/><b>NAO_CONTEM</b>: apenas irá alertar se não tiver nenhum dos termos informados.<br/><b>CONTEM_ALGUMA</b>: apenas irá alertar, se tiver pelo menos 1 dos termos informados.<br/><br/>- Para <strong>substituir</strong> a lista existente, envie um novo array. A lista antiga será completamente descartada.<br/>  _Exemplo:_ Se existiam as regras <code>[{"condicao": "CONTEM", "termo": "João"}]</code> e você envia <code>[{"condicao": "NAO_CONTEM", "termo": "Maria"}]</code>, a regra <code>CONTEM</code> original será removida e apenas a nova regra <code>NAO_CONTEM</code> permanecerá.<br/>- Para <strong>remover todos</strong> os termos auxiliares, envie um array vazio <code>[]</code>.
- `tribunais` (array<string>, optional): Lista de siglas dos tribunais específicos onde o monitoramento deve ser feito.<br/><br/>- Para <strong>remover todos</strong> os tribunais específicos (voltando a monitorar em todos os tribunais), envie um array vazio <code>[]</code>.

#### Responses

- Status 200
```json
{
    "id": 111,
    "termo": "Fulano",
    "criado_em": "2023-11-23T18:12:12+00:00",
    "variacoes": [],
    "termos_auxiliares": [],
    "tribunais_especificos": []
}
```

- Status 200
```json
{
    "id": 112,
    "termo": "Fulano de tal",
    "tipo": "TERMO",
    "criado_em": "2023-11-23 18:15:13",
    "variacoes": [
        " de tal",
        " de tal e tal"
    ]
}
```

- Status 200
```json
{
    "id": 112,
    "termo": "Fulano de tal",
    "tipo": "TERMO",
    "criado_em": "2023-11-23 18:15:13",
    "termos_auxiliares": {
        "CONTEM": [
            "Fulano"
        ],
        "NAO_CONTEM": [
            "Fulano de tal"
        ],
        "CONTEM_ALGUMA": [
            "Fulano",
            "Fulano de tal"
        ]
    }
}
```

- Status 200
```json
{
    "id": 112,
    "termo": "Fulano de tal",
    "tipo": "TERMO",
    "criado_em": "2023-11-23 18:15:13",
    "variacoes": [
        " de tal",
        " de tal e tal"
    ],
    "termos_auxiliares": {
        "CONTEM": [
            "Fulano"
        ],
        "NAO_CONTEM": [
            "Fulano de tal"
        ],
        "CONTEM_ALGUMA": [
            "Fulano",
            "Fulano de tal"
        ]
    }
}
```

## Monitoramento de processos

### POST /api/v2/monitoramentos/processos

**Criar um monitoramento**

O número do processo informado será monitorado nos tribunais e diários oficiais. Todas as movimentações e publicações encontradas serão enviadas.
Ao criar um monitoramento, ele começará com o status <b>PENDENTE</b> e será alterado para <b>ENCONTRADO</b> assim que nosso robô localizar o processo no sistema do tribunal.
Se o processo não for encontrado, o status será atualizado para <b>NAO_ENCONTRADO</b> e não haverá cobrança.





#### Callbacks relacionados
Evento | Descrição
--------- | -------
<a href="/v2/docs/callbacks#monitoramento-de-processos-nova-movimentao-encontrada">nova_movimentacao</a> | Ocorre quando um monitoramento de processo encontra uma nova movimentação no tribunal ou diário oficial.
<a href="/v2/docs/callbacks#monitoramento-de-processos-processo-verificado">processo_verificado</a> | Ocorre quando um monitoramento de processo vai ao tribunal, mas não encontra uma nova movimentação.
<a href="/v2/docs/callbacks#monitoramento-de-processos-processo-encontrado">processo_encontrado</a> | É enviado assim que nosso robô localiza o processo no sistema do tribunal e o status do monitoramento é alterado para <b>ENCONTRADO</b>.
<a href="/v2/docs/callbacks#monitoramento-de-processos-processo-no-encontrado">processo_nao_encontrado</a> | Ocorre quando o processo não é encontrado no sistema do tribunal e o status do monitoramento é alterado para <b>NAO_ENCONTRADO</b>.

- Requer autenticação: sim

#### Body Params

- `numero` (string, required): Númeração CNJ do processo.
- `tribunal` (string, optional): Sigla do tribunal a ser monitorado. Caso não deseje acompanhar o processo no tribunal de origem, como em situações em que o processo está no STF com a mesma numeração.
- `frequencia` (string, optional): Quantidade de dias em que o robô buscará atualizações nos sistemas dos tribunais.<br/><b>Valores permitidos</b>:<br>`DIARIA`: De segunda a sexta.<br>`SEMANAL`: 1 vez na semana (O dia é escolhido pelo Escavador). <br>Default: `DIARIA`.

#### Responses

- Status 200
```json
{
    "id": 17,
    "numero": "0000001-00.2024.6.14.0000",
    "criado_em": "2024-11-19T20:35:09+00:00",
    "data_ultima_verificacao": null,
    "tribunais": [
        {
            "id": 50,
            "nome": "Tribunal Regional Eleitoral do Pará",
            "sigla": "TRE-PA",
            "categoria": null
        }
    ],
    "frequencia": "DIARIA",
    "status": "PENDENTE"
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

### GET /api/v2/monitoramentos/processos

**Listar os monitoramentos**

Retorna todos os monitoramentos de processos do usuário

- Requer autenticação: sim

#### Responses

- Status 200
```json
{
    "items": [
        {
            "id": 1566931,
            "numero": "0800493-92.2024.8.14.0112",
            "criado_em": "2024-10-02T16:15:45+00:00",
            "data_ultima_verificacao": null,
            "tribunais": [
                {
                    "id": 90,
                    "nome": "Tribunal de Justiça do Pará",
                    "sigla": "TJPA",
                    "categoria": null
                }
            ],
            "frequencia": "DIARIA",
            "status": "ENCONTRADO"
        },
        {
            "id": 1567024,
            "numero": "1002089-72.2023.8.26.0260",
            "criado_em": "2024-10-02T18:01:34+00:00",
            "data_ultima_verificacao": null,
            "tribunais": [
                {
                    "id": 102,
                    "nome": "Tribunal de Justiça de São Paulo",
                    "sigla": "TJSP",
                    "categoria": null
                }
            ],
            "frequencia": "DIARIA",
            "status": "ENCONTRADO"
        },
        {
            "id": 1567034,
            "numero": "1157146-44.2024.8.26.0100",
            "criado_em": "2024-10-02T18:15:48+00:00",
            "data_ultima_verificacao": null,
            "tribunais": [
                {
                    "id": 102,
                    "nome": "Tribunal de Justiça de São Paulo",
                    "sigla": "TJSP",
                    "categoria": null
                }
            ],
            "frequencia": "DIARIA",
            "status": "ENCONTRADO"
        }
    ],
    "links": {
        "next": null,
        "prev": null,
        "first": "https://api.escavador.com/api/v2/monitoramentos/processos?page=1",
        "last": "https://api.escavador.com/api/v2/monitoramentos/processos?page=1"
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

- Status 402
```json
{
    "error": "Você não possui saldo em crédito da API."
}
```

### GET /api/v2/monitoramentos/processos/{id}

**Buscar um monitoramento**

Retorna um monitoramento de processos a partir do id

- Requer autenticação: sim

#### URL Params

- `id` (integer, required): Id do monitoramento.

#### Responses

- Status 200
```json
{
    "id": 17,
    "numero": "0000001-00.2024.6.14.0000",
    "criado_em": "2024-11-19T20:35:09+00:00",
    "data_ultima_verificacao": null,
    "tribunais": [
        {
            "id": 50,
            "nome": "Tribunal Regional Eleitoral do Pará",
            "sigla": "TRE-PA",
            "categoria": null
        }
    ],
    "frequencia": "DIARIA",
    "status": "PENDENTE"
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

### DELETE /api/v2/monitoramentos/processos/{id}

**Remover um monitoramento**

Remove um monitoramento de processos a partir do id

- Requer autenticação: sim

#### URL Params

- `id` (integer, required): Id do monitoramento.

#### Responses

- Status 204
```json
{}
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

## Callback

### GET /api/v2/callbacks

**Listar callbacks**

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

### POST /api/v2/callbacks/marcar-recebidos

**Marcar callbacks como recebidos**

Marca os callbacks enviados pela API como recebidos.

Os callbacks que estão em tentativa (next_run_at diferente de null) não podem ser marcados como recebidos. Example: [1,12,42]

- Requer autenticação: sim

#### Body Params

- `ids` (array<int>, required): Os ids dos callbacks que foram recebidos, máximo de 20 por vez.

#### Responses

- Status 200
```json
[]
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

### POST /api/v2/callbacks/{id}/reenviar

**Reenviar callback**

Reenvia o callback informado.

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