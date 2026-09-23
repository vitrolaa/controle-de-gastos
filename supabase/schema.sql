-- ==============================================================================
-- ESQUEMA SQL PARA SUPABASE - FINCONTROL (CONTROLE DE GASTOS MENSAIS)
-- ==============================================================================
-- Execute este script no "SQL Editor" do painel do seu projeto Supabase:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Criação da Tabela de Despesas (expenses)
create table if not exists public.expenses (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
    description text not null,
    amount numeric(12, 2) not null check (amount > 0),
    date date not null,
    category text not null,
    type text not null check (type in ('fixed', 'variable')),
    created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. Criação da Tabela de Tetos Orçamentários Mensais (budgets)
create table if not exists public.budgets (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
    month_year text not null, -- formato 'YYYY-MM'
    amount numeric(12, 2) not null check (amount >= 0),
    created_at timestamptz default timezone('utc'::text, now()) not null,
    constraint unique_user_month unique(user_id, month_year)
);

-- 3. Índices para Otimização de Consultas Rápidas
create index if not exists idx_expenses_user_date on public.expenses(user_id, date desc);
create index if not exists idx_budgets_user_month on public.budgets(user_id, month_year);

-- 4. Habilitação de Segurança em Nível de Linha (Row Level Security - RLS)
alter table public.expenses enable row level security;
alter table public.budgets enable row level security;

-- 5. Políticas de Segurança RLS para 'expenses' (Isolamento Total por Usuário)
drop policy if exists "Usuários podem consultar apenas as suas próprias despesas" on public.expenses;
create policy "Usuários podem consultar apenas as suas próprias despesas"
    on public.expenses for select
    using (auth.uid() = user_id);

drop policy if exists "Usuários podem criar despesas associadas a si próprios" on public.expenses;
create policy "Usuários podem criar despesas associadas a si próprios"
    on public.expenses for insert
    with check (auth.uid() = user_id);

drop policy if exists "Usuários podem atualizar as suas próprias despesas" on public.expenses;
create policy "Usuários podem atualizar as suas próprias despesas"
    on public.expenses for update
    using (auth.uid() = user_id);

drop policy if exists "Usuários podem excluir as suas próprias despesas" on public.expenses;
create policy "Usuários podem excluir as suas próprias despesas"
    on public.expenses for delete
    using (auth.uid() = user_id);

-- 6. Políticas de Segurança RLS para 'budgets'
drop policy if exists "Usuários podem consultar os seus próprios orçamentos" on public.budgets;
create policy "Usuários podem consultar os seus próprios orçamentos"
    on public.budgets for select
    using (auth.uid() = user_id);

drop policy if exists "Usuários podem inserir os seus próprios orçamentos" on public.budgets;
create policy "Usuários podem inserir os seus próprios orçamentos"
    on public.budgets for insert
    with check (auth.uid() = user_id);

drop policy if exists "Usuários podem atualizar os seus próprios orçamentos" on public.budgets;
create policy "Usuários podem atualizar os seus próprios orçamentos"
    on public.budgets for update
    using (auth.uid() = user_id);

drop policy if exists "Usuários podem excluir os seus próprios orçamentos" on public.budgets;
create policy "Usuários podem excluir os seus próprios orçamentos"
    on public.budgets for delete
    using (auth.uid() = user_id);

-- 7. Habilitação de Replicação em Tempo Real (Realtime)
-- Permite que alterações no celular atualizem instantaneamente a tela do PC
alter publication supabase_realtime add table public.expenses;
alter publication supabase_realtime add table public.budgets;
