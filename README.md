# 📢 Plataforma para Denúncias Públicas

Este projeto foi desenvolvido como parte da disciplina **Práticas Extensionistas III** da **UNOESC – Universidade do Oeste de Santa Catarina**, com o objetivo de proporcionar uma solução tecnológica para melhorar a comunicação entre a população e os órgãos públicos responsáveis por infraestrutura urbana.

## 🧾 Descrição

A plataforma Cuida+ é uma aplicação web completa que permite que cidadãos registrem, acompanhem e interajam com denúncias sobre problemas urbanos, servindo como uma ponte direta e transparente com a gestão pública.

O sistema permite que o usuário se cadastre, envie relatos com anexos (imagens, vídeos, documentos), e acompanhe o status da sua denúncia.

## 👥 Integrantes

- Lucas Rafael da Silva
- Leticia Grassmann Dallacosta

## 🧠 Orientador

- Prof. Jean Carlos Hennrichs

## 🛠️ Pilha de Tecnologias do Protótipo

### 📦 Frontend

| Tecnologia                | Descrição                                                                 |
| ------------------------- | ------------------------------------------------------------------------- |
| **Next.js & React**       | Framework para construção da interface reativa e renderizada no servidor. |
| **TypeScript**            | Garante a tipagem e a robustez do código.                                 |
| **Tailwind CSS**          | Framework de estilização para um design moderno e responsivo.             |
| **react-hook-form & zod** | Para gerenciamento e validação de formulários de forma eficiente.         |
| **recharts**              | Biblioteca para a criação dos gráficos do dashboard.                      |

### ⚙️ Backend

| Tecnologia               | Descrição                                                       |
| ------------------------ | --------------------------------------------------------------- |
| **Node.js & Express.js** | Ambiente de execução e framework para a construção da API REST. |
| **Sequelize**            | ORM para a comunicação com o banco de dados PostgreSQL.         |
| **jsonwebtoken (JWT)**   | Para a geração e validação de tokens de autenticação.           |
| **bcryptjs**             | Para a criptografia segura de senhas (hashing).                 |
| **multer**               | Middleware para o processamento de uploads de arquivos.         |

### 🗄️ Banco de Dados

| Tecnologia     | Descrição                                              |
| -------------- | ------------------------------------------------------ |
| **PostgreSQL** | Sistema de Gerenciamento de Banco de Dados relacional. |

## 🧪 Entregas da Etapa 1 (Modelagem)

| Item                                      | Status    |
| ----------------------------------------- | --------- |
| ✅ Diagrama Entidade-Relacionamento       | Concluído |
| ✅ Diagrama de Classes                    | Concluído |
| ✅ Diagrama de Casos de Uso               | Concluído |
| ✅ Diagrama de Sequência                  | Concluído |
| ✅ Diagrama de Atividades                 | Concluído |
| ✅ Repositório com documentação no GitHub | Concluído |

## 🚀 Entregas da Etapa 2 (Implementação do MVP)

A etapa final consiste na implementação de um protótipo funcional (MVP) da solução computacional proposta. O objetivo é demonstrar as principais funcionalidades do sistema, utilizando preferencialmente tecnologias web.

### ✅ Itens Entregues

| Item                                                               | Status             |
| ------------------------------------------------------------------ | ------------------ |
| 🗂️ Modelo relacional do banco de dados (atualizado após a Etapa 1) | ✅ Concluído       |
| 🛠️ Construção do banco de dados no SGBD (deve estar funcional)     | ✅ Concluído       |
| 🧩 Implementação da interface principal da solução proposta        | ✅ Concluído       |
| 🔐 Implementação da interface de login de acesso à solução         | ✅ Concluído       |
| ✍️ Implementação de no mínimo uma interface de CRUD                | ✅ Concluído       |
| 🔎 Implementação de no mínimo uma interface de consulta/relatório  | ✅ Concluído       |
| 📬 Implementação de uma interface de formulário de contato         | ✅ Concluído       |
| 📁 Publicação dos diagramas/modelos e códigos no GitHub            | ✅ Concluído       |
| 🎥 Apresentação do projeto (vídeo ou slides no GitHub)             | Em desenvolvimento |

## 📂 Estrutura do Repositório

```
📁 plataforma-denuncias-publicas/
├── 📁 backend/
├── 📁 frontend/
├── 📁 preview/
├── 📁 diagramas/
│   ├── diagrama-er.png
│   ├── diagrama-classes.png
│   ├── diagrama-casos-uso.png
│   ├── diagrama-sequencia.png
│   ├── diagrama-atividades.png
│
├── 📁 documentos/
│   ├── relatorio-parcial.pdf
│
├── 📄 README.md
├── 📄 .gitignore
└── 📄 LICENSE
```

## 🚀 Guia de Instalação e Execução

Siga os passos abaixo para rodar o projeto completo localmente.

### Pré-requisitos

- Node.js (versão 18.x ou superior)
- npm ou yarn
- Um servidor PostgreSQL ativo.

1. Clonar o Repositório

```
git clone https://github.com/3lucasrs/plataforma-denuncias-publicas.git
cd cuida-mais
```

2. Configurar o Backend

```
# Navegue até a pasta do backend
cd backend

# Instale as dependências
npm install

# Crie o arquivo de variáveis de ambiente a partir do exemplo
cp .env.example .env
```

Abra o arquivo .env e preencha com suas credenciais do PostgreSQL e um segredo JWT.

```
# backend/.env
PORT=3030
DB_NAME=cuida_mais_db
DB_USER=seu_usuario_postgres
DB_PASS=sua_senha_postgres
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=gere_um_segredo_forte_aqui
JWT_EXPIRES_IN=1h
```

3. Configurar o Frontend

```
# A partir da pasta raiz do projeto, navegue até o frontend
cd ../frontend

# Instale as dependências
npm install

# Crie o arquivo de variáveis de ambiente local a partir do exemplo
cp .env.example .env.local
```

O arquivo .env.local já estará configurado para apontar para o seu backend local.

4. Rodar a Aplicação

Você precisará de dois terminais abertos.

No primeiro terminal (Backend):

```
# Dentro da pasta /backend
npm run dev
```

O servidor backend iniciará na porta 3030.

No segundo terminal (Frontend):

```
# Dentro da pasta /frontend
npm run dev
```

A aplicação frontend estará acessível em http://localhost:3000 (ou outra porta).

## 🔗 Links Úteis

- [UNOESC](https://www.unoesc.edu.br)

> Projeto desenvolvido com foco na **comunidade local**, alinhando tecnologia e cidadania 💡
