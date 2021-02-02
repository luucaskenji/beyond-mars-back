# Beyond Mars

Este projeto é uma API utilizada pelo projeto Beyond Mars, o qual consome esta API para armazenar usuários em banco de dados, além de fotos com número de reações destes usuários (curtidas). Tais fotos são obtidas pelo front-end através de uma API da NASA, a qual fornece imagens de Marte.

## Features

✅ CRUD de usuários

✅ Criar no banco de dados de fotos para armazenar curtidas

## O que é a API?

A API é composta pelas seguintes rotas:

- **POST `/users`**

    Cria novo gênero com nome dado, mudando a primeira para maiúscula, devendo ter no mínimo 2
    e no máximo 20 caracteres. Espera JSON no formato:

    ```json
    {
        "name": "Alberto"
    }
    ```

    Responde com JSON no formato:

    ```json
    {
        "id": 453,
        "name": "Alberto",
        "session": {
            "id": 449,
            "token": "a47d9af9-558a7-41e2-840f-fe417sdgsaw"
        }
    }
    ```    

- **PUT `/users/:id`**

    Edita nome de determinado usuário, especificado pelo id dado como parâmetro na rota. A primeira letra
    do nome é automaticamente mudada para maiúscula, e deve ter entre 2 e 20 caracteres. Espera JSON no formato:

    ```json
    {
        "name": "Maria"
    }
    ```

    Responde com JSON no formato:

    ```json
    {
        "id": 453,
        "name": "Maria",
        "createdAt": "2021-02-02T01:18:26.272Z",
        "updatedAt": "2021-02-02T01:20:32.437Z"
    }
    ```

- **POST `/users/:id/sign-out`**

    Encerra a sessão do usuário identificado pelo id passado como parâmetro na rota. Não recebe ou responde nenhum JSON.

- **POST `/photos/:id/likes`**

    Adiciona ou atualiza, no banco de dados, foto com id passado como parâmetro na rota. O número de likes é incrementado em 1. Não espera nada no corpo.
    Responde com JSON no formato:

    ```json
    {
        "id": 790,
        "likes": 1,
        "updatedAt": "2021-02-02T01:22:37.946Z",
        "createdAt": "2021-02-02T01:22:37.946Z"
    }
    ```

- **POST `/photos/:id/dislikes`**

    Decrementa em 1 o número de likes da foto passada como parâmetro na rota. Retorna erro caso a foto não conste no banco de dados. Não espera nada no corpo.
    Responde com JSON no formato:

    ```json
    {
        "id": 790,
        "likes": 0,
        "createdAt": "2021-02-02T01:22:37.946Z",
        "updatedAt": "2021-02-02T01:23:43.831Z"
    }
    ```

- **GET `/photos/:id/likes`**

    Retorna a foto com id especificado, com o número de likes. Não espera nada no corpo.
    Responde com JSON no formato:

    ```json
    {
        "id": 790,
        "likes": 0
    }
    ```

Algumas rotas usam validação através de token, o qual é guardado como cookie ao fazer login.

## Como rodar o projeto?

1. Instale o NodeJS [https://nodejs.org/en/](https://nodejs.org/en/)
2. Instale o Postgres 13 [https://www.postgresql.org/](https://www.postgresql.org/)
3. Crie uma nova database

    ```bash
    $ psql
    $ CREATE DATABASE uma_nova_database;
    ```

4. Clone o projeto
5. Crie o arquivo .env a partir do arquivo .env.example e preencha os valores com a url para a database criada e a porta a ser usada.
6. Instale as dependências

    ```bash
    npm i
    ```

7. Rode as migrations

    ```bash
    npx sequilize-cli db:migrate
    ```

8. Rode a aplicação 🙂

    ```bash
    npm run dev
    ```