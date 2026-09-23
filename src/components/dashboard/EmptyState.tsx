import { Receipt, SearchX, Plus, FilterX } from 'lucide-react'
import { Button } from '../common/Button'

interface EmptyStateProps {
  isFiltered?: boolean
  onAction: () => void
  onClearFilters?: () => void
}

export function EmptyState({ isFiltered = false, onAction, onClearFilters }: EmptyStateProps) {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-800">
          Nenhuma transação encontrada
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
          Não foram encontrados gastos correspondentes aos filtros ou termo de pesquisa selecionados.
        </p>
        {onClearFilters && (
          <Button
            variant="outline"
            size="sm"
            icon={<FilterX className="w-4 h-4" />}
            onClick={onClearFilters}
          >
            Limpar todos os filtros
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
        <Receipt className="w-7 h-7" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-slate-800">
        Nenhum gasto registrado neste mês
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mt-1 mb-6">
        Comece adicionando uma despesa para acompanhar seu orçamento e analisar gráficos detalhados.
      </p>
      <Button
        variant="primary"
        size="md"
        icon={<Plus className="w-4 h-4" />}
        onClick={onAction}
      >
        Registrar Primeira Despesa
      </Button>
    </div>
  )
}
