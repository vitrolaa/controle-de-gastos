import { useState, useMemo } from 'react'
import {
  Search,
  Edit3,
  Trash2,
  Calendar,
  ArrowUpDown,
  Tag,
} from 'lucide-react'
import type { Expense, ExpenseCategory, ExpenseFilter } from '../../types/expense'
import { CATEGORIES, CATEGORY_LIST } from '../../constants/categories'
import { formatCurrency, formatDateExtended } from '../../utils/formatters'
import { EmptyState } from './EmptyState'

interface ExpenseListProps {
  expenses: Expense[]
  filter: ExpenseFilter
  currency: 'EUR' | 'BRL'
  onFilterChange: (partial: Partial<ExpenseFilter>) => void
  onEdit: (expense: Expense) => void
  onDeleteRequest: (expense: Expense) => void
  onAddNew: () => void
}

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'

export function ExpenseList({
  expenses,
  filter,
  currency,
  onFilterChange,
  onEdit,
  onDeleteRequest,
  onAddNew,
}: ExpenseListProps) {
  const [sortOption, setSortOption] = useState<SortOption>('date-desc')

  // Ordenação das despesas filtradas
  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
      if (sortOption === 'date-desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      if (sortOption === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      }
      if (sortOption === 'amount-desc') {
        return b.amount - a.amount
      }
      if (sortOption === 'amount-asc') {
        return a.amount - b.amount
      }
      return 0
    })
  }, [expenses, sortOption])

  const hasActiveFilters =
    filter.category !== 'all' || filter.type !== 'all' || filter.search.trim().length > 0

  const handleClearFilters = () => {
    onFilterChange({ category: 'all', type: 'all', search: '' })
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Barra de Filtros e Busca */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/40 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Histórico de Gastos</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {expenses.length} {expenses.length === 1 ? 'item' : 'itens'}
            </span>
          </div>

          {/* Campo de Busca Rápida */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filter.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              placeholder="Pesquisar por descrição..."
              className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              aria-label="Pesquisar gastos"
            />
          </div>
        </div>

        {/* Filtros em Linha: Tipo, Categoria e Ordenação */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          {/* Seletor de Tipo (Todos / Fixos / Variáveis) */}
          <div className="flex items-center bg-slate-200/60 p-1 rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => onFilterChange({ type: 'all' })}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter.type === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ type: 'fixed' })}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter.type === 'fixed'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fixos
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ type: 'variable' })}
              className={`px-3 py-1 rounded-lg transition-all ${
                filter.type === 'variable'
                  ? 'bg-white text-amber-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Variáveis
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Filtro de Categoria */}
            <div className="flex items-center gap-1.5 text-xs">
              <Tag className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              <select
                value={filter.category}
                onChange={(e) =>
                  onFilterChange({ category: e.target.value as ExpenseCategory | 'all' })
                }
                className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                aria-label="Filtrar por categoria"
              >
                <option value="all">Todas as Categorias</option>
                {CATEGORY_LIST.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenação */}
            <div className="flex items-center gap-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                aria-label="Ordenar despesas"
              >
                <option value="date-desc">Mais Recentes</option>
                <option value="date-asc">Mais Antigas</option>
                <option value="amount-desc">Maior Valor</option>
                <option value="amount-asc">Menor Valor</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo: Lista ou Estado Vazio */}
      {sortedExpenses.length === 0 ? (
        <EmptyState
          isFiltered={hasActiveFilters}
          onAction={onAddNew}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <>
          {/* Tabela para Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                  <th scope="col" className="py-3.5 pl-6 pr-3">
                    Despesa
                  </th>
                  <th scope="col" className="py-3.5 px-3">
                    Categoria
                  </th>
                  <th scope="col" className="py-3.5 px-3">
                    Tipo
                  </th>
                  <th scope="col" className="py-3.5 px-3">
                    Data
                  </th>
                  <th scope="col" className="py-3.5 px-3 text-right">
                    Valor
                  </th>
                  <th scope="col" className="py-3.5 pl-3 pr-6 text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {sortedExpenses.map((expense) => {
                  const cat = CATEGORIES[expense.category]
                  const Icon = cat.icon
                  const isFixed = expense.type === 'fixed'

                  return (
                    <tr
                      key={expense.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Descrição */}
                      <td className="py-3.5 pl-6 pr-3">
                        <span className="font-semibold text-slate-900 block truncate max-w-xs">
                          {expense.description}
                        </span>
                      </td>

                      {/* Categoria */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${cat.bgColor} ${cat.textColor} ${cat.borderColor}`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span>{cat.label.split('/')[0].trim()}</span>
                        </span>
                      </td>

                      {/* Tipo */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isFixed
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                              : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                          }`}
                        >
                          {isFixed ? 'Fixo' : 'Variável'}
                        </span>
                      </td>

                      {/* Data */}
                      <td className="py-3.5 px-3 text-xs text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDateExtended(expense.date)}</span>
                        </div>
                      </td>

                      {/* Valor */}
                      <td className="py-3.5 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(expense.amount, currency)}
                      </td>

                      {/* Ações */}
                      <td className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => onEdit(expense)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:ring-2 focus:ring-indigo-500"
                            title="Editar despesa"
                            aria-label={`Editar ${expense.description}`}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteRequest(expense)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:ring-2 focus:ring-rose-500"
                            title="Eliminar despesa"
                            aria-label={`Eliminar ${expense.description}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Cards para Mobile (Visão responsiva com redução de carga cognitiva) */}
          <div className="divide-y divide-slate-100 md:hidden">
            {sortedExpenses.map((expense) => {
              const cat = CATEGORIES[expense.category]
              const Icon = cat.icon
              const isFixed = expense.type === 'fixed'

              return (
                <div key={expense.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <h4 className="font-semibold text-slate-900 text-sm truncate">
                          {expense.description}
                        </h4>
                        <span className="text-xs text-slate-400">
                          {formatDateExtended(expense.date)}
                        </span>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900 text-base shrink-0">
                      {formatCurrency(expense.amount, currency)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${cat.bgColor} ${cat.textColor} ${cat.borderColor}`}
                      >
                        {cat.label.split('/')[0].trim()}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isFixed
                            ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}
                      >
                        {isFixed ? 'Fixo' : 'Variável'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(expense)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
                        aria-label={`Editar ${expense.description}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteRequest(expense)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100"
                        aria-label={`Eliminar ${expense.description}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
