import {
  Wallet,
  Plus,
  Banknote,
  ChevronLeft,
  ChevronRight,
  Cloud,
  CloudCheck,
  CloudUpload,
  LogOut,
  LogIn,
  Settings2,
} from 'lucide-react'
import { MONTH_NAMES } from '../../constants/categories'
import { Button } from '../common/Button'
import { useAuth } from '../../hooks/useAuth'

interface HeaderProps {
  currentMonth: number
  currentYear: number
  currency: 'EUR' | 'BRL'
  isSyncing?: boolean
  onMonthChange: (month: number, year: number) => void
  onCurrencyToggle: () => void
  onOpenNewExpense: () => void
  onOpenBudgetModal: () => void
  onOpenAuth: () => void
  onOpenConfig: () => void
}

export function Header({
  currentMonth,
  currentYear,
  currency,
  isSyncing = false,
  onMonthChange,
  onCurrencyToggle,
  onOpenNewExpense,
  onOpenBudgetModal,
  onOpenAuth,
  onOpenConfig,
}: HeaderProps) {
  const { user, isConfigured, signOut } = useAuth()

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      onMonthChange(12, currentYear - 1)
    } else {
      onMonthChange(currentMonth - 1, currentYear)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      onMonthChange(1, currentYear + 1)
    } else {
      onMonthChange(currentMonth + 1, currentYear)
    }
  }

  const years = [2024, 2025, 2026, 2027, 2028]

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          {/* Logo e Título da Aplicação */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
                <Wallet className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    FinControl
                  </h1>
                  {user ? (
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                      {isSyncing ? (
                        <>
                          <CloudUpload className="w-3 h-3 animate-pulse text-emerald-600" />
                          <span>A sincronizar</span>
                        </>
                      ) : (
                        <>
                          <CloudCheck className="w-3 h-3 text-emerald-600" />
                          <span>Nuvem</span>
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Cloud className="w-3 h-3 text-amber-600" />
                      <span>Modo Local</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Controlo de Gastos Mensais &amp; Sincronização Supabase
                </p>
              </div>
            </div>

            {/* Ações no mobile: Moeda e Login */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={onCurrencyToggle}
                className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
              >
                {currency === 'EUR' ? '€' : 'R$'}
              </button>

              {user ? (
                <button
                  type="button"
                  onClick={signOut}
                  className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50"
                  title="Terminar sessão"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-600 text-white flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Entrar</span>
                </button>
              )}
            </div>
          </div>

          {/* Navegação de Período (Mês e Ano) */}
          <div className="flex items-center justify-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80 self-center lg:self-auto">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl hover:bg-white text-slate-600 hover:text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-1">
              <select
                value={currentMonth}
                onChange={(e) => onMonthChange(parseInt(e.target.value, 10), currentYear)}
                className="text-xs sm:text-sm font-semibold text-slate-800 bg-transparent border-0 focus:ring-0 cursor-pointer pr-1"
                aria-label="Selecionar mês"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx + 1}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={currentYear}
                onChange={(e) => onMonthChange(currentMonth, parseInt(e.target.value, 10))}
                className="text-xs sm:text-sm font-semibold text-slate-800 bg-transparent border-0 focus:ring-0 cursor-pointer"
                aria-label="Selecionar ano"
              >
                {years.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl hover:bg-white text-slate-600 hover:text-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
              aria-label="Próximo mês"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Ações Rápidas (Desktop & Mobile) */}
          <div className="flex items-center justify-end flex-wrap gap-2 sm:gap-2.5">
            {/* Botão de Moeda */}
            <button
              type="button"
              onClick={onCurrencyToggle}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
              title="Alternar Moeda (EUR / BRL)"
            >
              {currency === 'EUR' ? '€ Euro' : 'R$ BRL'}
            </button>

            {/* Configuração Supabase */}
            <button
              type="button"
              onClick={onOpenConfig}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
              title={isConfigured ? 'Supabase Conectado (Clique para gerir)' : 'Configurar Chaves Supabase'}
            >
              <Settings2 className="w-4 h-4" />
            </button>

            {/* Definir Salário */}
            <Button
              variant="outline"
              size="sm"
              icon={<Banknote className="w-4 h-4 text-emerald-600" />}
              onClick={onOpenBudgetModal}
              title="Definir o seu salário ou rendimento do mês"
            >
              <span className="hidden sm:inline">Definir Salário</span>
              <span className="sm:hidden">Salário</span>
            </Button>

            {/* Nova Despesa */}
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={onOpenNewExpense}
              title="Registar nova despesa (Tecla N)"
            >
              <span className="hidden sm:inline">Nova Despesa</span>
              <span className="sm:hidden">Novo</span>
            </Button>

            {/* Utilizador / Login no Desktop */}
            <div className="hidden lg:flex items-center pl-2 border-l border-slate-200">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="block text-xs font-bold text-slate-800 truncate max-w-[120px]">
                      {user.email?.split('@')[0]}
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-semibold">Conectado</span>
                  </div>
                  <button
                    type="button"
                    onClick={signOut}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Terminar Sessão"
                    aria-label="Terminar sessão"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<LogIn className="w-4 h-4" />}
                  onClick={onOpenAuth}
                >
                  Entrar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
