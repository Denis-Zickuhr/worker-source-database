# worker-source-database

O aplicativo **worker-source-database** é responsável por povoar a fila de atualização de tabelas de scraping, consumir e processar essas mensagens. Ele também oferece uma API para servir as informações da tabela especificada, sendo um sistema multitabela.

## Início

### Scripts para Desenvolvimento

Este projeto possui dois tipos de aplicativos: **http-app** e **cli-app**.

### Iniciar o servidor HTTP

1. Para iniciar a aplicação HTTP em modo normal (sem assistir arquivos), use o seguinte comando:

    ```bash
    npm run http-app:start
    ```

2. Para iniciar a aplicação HTTP em modo de desenvolvimento (com live-reload utilizando o `nodemon`):

    ```bash
    npm run http-app:dev
    ```

### Iniciar a aplicação CLI

A aplicação CLI oferece duas ações principais: **producer** (produtor) e **consumer** (consumidor), que são executadas com parâmetros adicionais.

- Para iniciar a ação **producer** ou **consumer**, use o seguinte formato:

    ```bash
    npm run cli-app:dev -- -- action< producer | consumer > <parametros adicionais>
    ```

### Exemplo de comando para **producer**:

```bash
npm run cli-app:dev -- -- producer
```

### Exemplo de comando para **consumer**:

```bash
npm run cli-app:dev -- -- consumer
```

> **Observação**: Os aplicativos CLI precisam ser chamados com o formato acima para funcionar corretamente.

### Utilizando o Docker

Se preferir, o aplicativo também pode ser executado em um container Docker. Para isso, siga as instruções abaixo.

#### Construir e executar o Docker:

1. **Construir a imagem Docker**:

    ```bash
    docker build -t worker-source-database .
    ```

2. **Executar a aplicação no Docker**:

    ```bash
    docker run -d -p 3000:3000 worker-source-database
    ```

> **Nota**: O Docker é opcional, sendo necessário apenas se preferir rodar o aplicativo em containers.

## Dependências

- **Node.js** (Versão recomendada: LTS)
- **Docker** (Opcional, para rodar a aplicação em containers)

## Instalando as dependências

Se você estiver começando a trabalhar com o projeto localmente, siga os passos abaixo:

1. **Instalar as dependências do projeto**:

    ```bash
    npm install
    ```

2. **Compilar o código TypeScript**:

    ```bash
    npm run build
    ```

## Executando

1. Inicie o servidor HTTP:

    ```bash
    npm run http-app:start
    ```

2. Use o CLI para executar ações específicas, como **producer** ou **consumer**:

    - Para **producer**:

    ```bash
    npm run cli-app:dev -- -- producer
    ```

    - Para **consumer**:

    ```bash
    npm run cli-app:dev -- -- consumer
    ```

## Estrutura do Projeto

- **src/**: Código-fonte do projeto.
  - **core/**: Composição básica e estruturação da aplicação. 
  - **services/**: Lógica de negócio da aplicação. 
  - **adapters/**: Adaptadores e ferramentas externas. 
- **bin/**: Aplicação CLI e HTTP.
- Config.yml: Arquivo de configuração da aplicação

## Contribuindo

Se você gostaria de contribuir para o projeto, faça um fork e envie um pull request com suas modificações.

---