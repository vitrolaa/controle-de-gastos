import { useState, type FormEvent } from 'react'
import { Modal } from '../common/Modal'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  isSupabaseConfigured,
} from '../../lib/supabaseClient'
import {
  Database,
  Key,
  ExternalLink,
  Trash2,
  Code2,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react'

interface SupabaseConfigModalProps {
  isOpen: boolean
  onClose: () => void
}

const SQL_SCHEMA_CODE = `-- 1. Criação da Tabela de Despesas (expenses)
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
    month_year text not null,
    amount numeric(12, 2) not null check (amount >= 0),
    created_at timestamptz default timezone('utc'::text, now()) not null,
    constraint unique_user_month unique(user_id, month_year)
);

-- 3. Índices de Otimização
create index if not exists idx_expenses_user_date on public.expenses(user_id, date desc);
create index if not exists idx_budgets_user_month on public.budgets(user_id, month_year);

-- 4. Habilitar Segurança em Nível de Linha (RLS)
alter table public.expenses enable row level security;
alter table public.budgets enable row level security;

-- 5. Políticas RLS para 'expenses'
drop policy if exists "Usuários podem consultar apenas as suas próprias despesas" on public.expenses;
create policy "Usuários podem consultar apenas as suas próprias despesas"
    on public.expenses for select using (auth.uid() = user_id);

drop policy if exists "Usuários podem criar despesas associadas a si próprios" on public.expenses;
create policy "Usuários podem criar despesas associadas a si próprios"
    on public.expenses for insert with check (auth.uid() = user_id);

drop policy if exists "Usuários podem atualizar as suas próprias despesas" on public.expenses;
create policy "Usuários podem atualizar as suas próprias despesas"
    on public.expenses for update using (auth.uid() = user_id);

drop policy if exists "Usuários podem excluir as suas próprias despesas" on public.expenses;
create policy "Usuários podem excluir as suas próprias despesas"
    on public.expenses for delete using (auth.uid() = user_id);

-- 6. Políticas RLS para 'budgets'
drop policy if exists "Usuários podem consultar os seus próprios orçamentos" on public.budgets;
create policy "Usuários podem consultar os seus próprios orçamentos"
    on public.budgets for select using (auth.uid() = user_id);

drop policy if exists "Usuários podem inserir os seus próprios orçamentos" on public.budgets;
create policy "Usuários podem inserir os seus próprios orçamentos"
    on public.budgets for insert with check (auth.uid() = user_id);

drop policy if exists "Usuários podem atualizar os seus próprios orçamentos" on public.budgets;
create policy "Usuários podem atualizar os seus próprios orçamentos"
    on public.budgets for update using (auth.uid() = user_id);

drop policy if exists "Usuários podem excluir os seus próprios orçamentos" on public.budgets;
create policy "Usuários podem excluir os seus próprios orçamentos"
    on public.budgets for delete using (auth.uid() = user_id);

-- 7. Replicação em Tempo Real (Realtime)
alter publication supabase_realtime add table public.expenses;
alter publication supabase_realtime add table public.budgets;`

export function SupabaseConfigModal({ isOpen, onClose }: SupabaseConfigModalProps) {
  const [activeTab, setActiveTab] = useState<'api' | 'sql'>('api')
  const currentCreds = getSupabaseCredentials()
  const [url, setUrl] = useState(currentCreds.url)
  const [anonKey, setAnonKey] = useState(currentCreds.anonKey)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!url.trim() || !url.startsWith('https://')) {
      setError('A URL do Supabase deve iniciar com https:// (ex: https://xyz.supabase.co)')
      return
    }
    if (!anonKey.trim() || anonKey.trim().length < 20) {
      setError('A Anon Key fornecida parece inválida. Verifique no painel do Supabase.')
      return
    }

    saveSupabaseCredentials(url, anonKey)
    onClose()
  }

  const handleClear = () => {
    if (confirm('Tem certeza de que deseja limpar as credenciais salvas do Supabase?')) {
      clearSupabaseCredentials()
      onClose()
    }
  }

  const handleCopySQL = async () => {
    try {
      await navigator.clipboard.writeText(SQL_SCHEMA_CODE)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configuração do Supabase"
      description="Gerencie a conexão e as tabelas do PostgreSQL na nuvem"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Abas */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('api')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'api'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Credenciais da API</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sql')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'sql'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Script SQL das Tabelas</span>
          </button>
        </div>

        {activeTab === 'api' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Aviso sobre o erro "Could not find the table":</p>
                <p className="mt-0.5 text-amber-800">
                  Esse erro ocorre quando as tabelas ainda não foram criadas no banco de dados.
                  Acesse a aba <strong>"Script SQL das Tabelas"</strong> acima, copie o código e execute no SQL Editor do Supabase.
                </p>
              </div>
            </div>

            <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3.5 text-xs text-indigo-900 leading-relaxed flex items-start gap-2.5">
              <Database className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Onde obter a URL e Anon Key?</p>
                <p className="mt-0.5 text-indigo-700">
                  No painel em{' '}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-bold inline-flex items-center gap-1 hover:text-indigo-900"
                  >
                    supabase.com/dashboard <ExternalLink className="w-3 h-3" />
                  </a>
                  , acesse <strong>Project Settings &gt; API</strong>.
                </p>
              </div>
            </div>

            <Input
              label="Project URL"
              placeholder="https://seu-projeto.supabase.co"
              leftIcon={<Database className="w-4 h-4" />}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError(null)
              }}
              required
            />

            <Input
              label="Anon / Public API Key"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              leftIcon={<Key className="w-4 h-4" />}
              value={anonKey}
              onChange={(e) => {
                setAnonKey(e.target.value)
                setError(null)
              }}
              type="password"
              required
            />

            {error && (
              <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {isSupabaseConfigured() ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 className="w-4 h-4 text-rose-500" />}
                  onClick={handleClear}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                >
                  Desconectar
                </Button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  Salvar e Conectar
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-3.5">
            <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-3.5 text-xs text-indigo-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold">Como resolver o erro de tabelas não encontradas:</p>
                <ol className="list-decimal list-inside text-indigo-800 mt-1 space-y-0.5">
                  <li>Clique no botão abaixo para copiar o script SQL completo.</li>
                  <li>
                    Abra o{' '}
                    <a
                      href="https://supabase.com/dashboard/project/_/sql"
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-bold inline-flex items-center gap-1 hover:text-indigo-900"
                    >
                      SQL Editor do Supabase <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>Cole e clique em <strong>Run</strong> (ou Ctrl + Enter).</li>
                </ol>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                icon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                onClick={handleCopySQL}
                className="shrink-0 self-start sm:self-center"
              >
                {copied ? 'Código Copiado!' : 'Copiar Script SQL'}
              </Button>
            </div>

            <div className="relative">
              <pre className="bg-slate-900 text-slate-200 text-[11px] p-4 rounded-xl font-mono overflow-x-auto max-h-64 border border-slate-800 leading-relaxed select-all">
                {SQL_SCHEMA_CODE}
              </pre>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button type="button" variant="secondary" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
