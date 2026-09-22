# Sistema de Controle de Gastos Mensais

Aplicação web desenvolvida com **React, TypeScript e Supabase** para planejamento e gestão financeira pessoal. Permite o registro de despesas, controle de orçamentos e sincronização dos dados em nuvem.

## Tecnologias Utilizadas

* **React + TypeScript** — Interface do usuário e tipagem estática
* **Vite** — Ferramenta de desenvolvimento e build
* **Supabase** — Banco de dados PostgreSQL na nuvem e autenticação
* **GitHub Pages** — Hospedagem estática e deploy contínuo

## Funcionalidades

### Gestão de Despesas

* Adicione despesas
* Edite despesas existentes
* Categorize seus gastos
* Registre valores e datas

### Controle de Orçamentos

* Defina limites de gastos por categoria
* Acompanhe os valores definidos para cada categoria

### Sincronização em Nuvem

* Armazenamento dos dados no Supabase
* Acesso aos dados através de diferentes dispositivos
* Sincronização dos dados em tempo real

### Design Intuitivo

* Interface simples e organizada
* Foco na experiência do usuário
* Interface acessível e responsiva

## Configuração e Instalação Local

Para executar o projeto em sua máquina para fins de desenvolvimento:

### Clone o repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### Instale as dependências

```bash
npm install
```

### Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=seu_project_url_aqui
VITE_SUPABASE_ANON_KEY=sua_publishable_key_aqui
```

### Execute o projeto

```bash
npm run dev
```

## Configuração do Banco de Dados

Para que a aplicação funcione corretamente, execute o seguinte script SQL no **SQL Editor** do seu projeto Supabase para criar as tabelas necessárias:

```sql
-- Criar tabela de despesas
create table if not exists expenses (
  id uuid default gen_random_uuid() primary key,
  description text not null,
  amount numeric not null,
  category text not null,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar tabela de orçamentos
create table if not exists budgets (
  id uuid default gen_random_uuid() primary key,
  category text not null unique,
  limit_amount numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## Deploy

O projeto está configurado para publicação automática no **GitHub Pages**.

Certifique-se de configurar os seguintes **Repository Secrets** no seu repositório do GitHub:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Essas variáveis são utilizadas durante o processo de build para configurar a conexão da aplicação com o Supabase.

Para configurar os Secrets, acesse:

**Repository → Settings → Secrets and variables → Actions**

Adicione:

| Secret                   | Descrição                         |
| ------------------------ | --------------------------------- |
| `VITE_SUPABASE_URL`      | URL do projeto Supabase           |
| `VITE_SUPABASE_ANON_KEY` | Chave pública do projeto Supabase |

## Autor

Desenvolvido por **Vitor Brito De Bastos**.
