import {
  DollarSign,
  PieChart,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  Banknote,
  Wallet,
} from 'lucide-react'
import type { MonthlySummary } from '../../types/expense'
import { formatCurrency, formatPercent } from '../../utils/formatters'

interface SummaryCardsProps {
  summary: MonthlySummary
  currency: 'EUR' | 'BRL'
  onOpenBudgetModal: () => void
}

export function SummaryCards({ summary, currency, onOpenBudgetModal }: SummaryCardsProps) {
  const hasSalary = summary.budget > 0
  const isOverBudget = hasSalary && summary.remainingBudget < 0
  const isNearLimit = hasSalary && !isOverBudget && summary.budgetUsagePercent >= 80

  const getSalaryStatus = () => {
    if (!hasSalary) {
      return {
        label: 'Não informado',
        badgeClass: 'bg-slate-100 text-slate-600',
        progressClass: 'bg-slate-300',
        icon: Banknote,
      }
    }
    if (isOverBudget) {
      return {
        label: 'Gastou mais que o salário',
        badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200',
        progressClass: 'bg-rose-500',
        icon: AlertTriangle,
      }
    }
    if (isNearLimit) {
      return {
        label: 'Atenção ao limite',
        badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
        progressClass: 'bg-amber-500',
        icon: AlertTriangle,
      }
    }
    return {
      label: 'Sobra positiva',
      badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      progressClass: 'bg-emerald-500',
      icon: CheckCircle,
    }
  }

  const status = getSalaryStatus()
  const StatusIcon = status.icon

  return (
    <section aria-label="Resumo Financeiro Mensal" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* Card 1: Salário / Renda Mensal */}
      <div className="bg-white rounded-2xl p-4.5 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between">
        <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-emerald-500 to-teal-600" />
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Salário / Renda
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Banknote className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>

          {hasSalary ? (
            <div>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {formatCurrency(summary.budget, currency)}
              </span>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                Rendimento líquido mensal
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold text-slate-700">Salário não definido</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Defina quanto ganha para calcular a sobra.
              </p>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onOpenBudgetModal}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            <span>{hasSalary ? 'Alterar salário' : 'Inserir salário'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card 2: Gasto Total do Mês */}
      <div className="bg-white rounded-2xl p-4.5 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between">
        <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-indigo-500 to-indigo-600" />
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total de Gastos
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrency(summary.total, currency)}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {summary.expenseCount} {summary.expenseCount === 1 ? 'gasto registado' : 'gastos registados'}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Consumo:</span>
          <span className="font-semibold text-slate-700">
            {hasSalary ? formatPercent(summary.budgetUsagePercent) : 'Sem teto'}
          </span>
        </div>
      </div>

      {/* Card 3: Saldo Restante do Salário */}
      <div className="bg-white rounded-2xl p-4.5 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between">
        <div
          className={`absolute top-0 left-0 h-1 w-full ${
            isOverBudget
              ? 'bg-rose-500'
              : isNearLimit
              ? 'bg-amber-500'
              : hasSalary
              ? 'bg-teal-500'
              : 'bg-slate-300'
          }`}
        />
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Sobra do Salário
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isOverBudget
                  ? 'bg-rose-50 text-rose-600'
                  : isNearLimit
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-teal-50 text-teal-600'
              }`}
            >
              <Wallet className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>

          {hasSalary ? (
            <div>
              <span
                className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
                  isOverBudget ? 'text-rose-600' : 'text-slate-900'
                }`}
              >
                {formatCurrency(summary.remainingBudget, currency)}
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <StatusIcon className="w-3.5 h-3.5 text-current" />
                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${status.badgeClass}`}>
                  {status.label}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold text-slate-700">Aguardando salário</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Insira o salário para acompanhar a sobra.
              </p>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100">
          {hasSalary ? (
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${status.progressClass}`}
                style={{ width: `${Math.min(summary.budgetUsagePercent, 100)}%` }}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenBudgetModal}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              + Adicionar salário
            </button>
          )}
        </div>
      </div>

      {/* Card 4: Gastos Fixos vs. Variáveis */}
      <div className="bg-white rounded-2xl p-4.5 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between">
        <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-blue-500 to-amber-500" />
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Fixos vs. Variáveis
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <PieChart className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <span className="text-[10px] text-slate-500 block">Fixos</span>
              <p className="text-sm font-bold text-slate-900 truncate">
                {formatCurrency(summary.fixedTotal, currency)}
              </p>
              <span className="text-[10px] text-blue-600 font-semibold">
                {formatPercent(summary.fixedPercent)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Variáveis</span>
              <p className="text-sm font-bold text-slate-900 truncate">
                {formatCurrency(summary.variableTotal, currency)}
              </p>
              <span className="text-[10px] text-amber-600 font-semibold">
                {formatPercent(summary.variablePercent)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${summary.fixedPercent}%` }}
            />
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${summary.variablePercent}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
