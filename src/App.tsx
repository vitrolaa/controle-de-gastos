import { useState, useEffect, useCallback } from 'react'
import { ToastProvider } from './hooks/useToast'
import { ToastContainer } from './components/common/Toast'
import { AuthProvider } from './hooks/useAuth'
import { Header } from './components/dashboard/Header'
import { SummaryCards } from './components/dashboard/SummaryCards'
import { ChartsSection } from './components/dashboard/ChartsSection'
import { ExpenseList } from './components/dashboard/ExpenseList'
import { ExpenseFormModal } from './components/dashboard/ExpenseFormModal'
import { BudgetModal } from './components/dashboard/BudgetModal'
import { ConfirmDialog } from './components/common/ConfirmDialog'
import { CloudSyncBanner } from './components/dashboard/CloudSyncBanner'
import { AuthModal } from './components/auth/AuthModal'
import { SupabaseConfigModal } from './components/auth/SupabaseConfigModal'
import { AppLayout } from './components/layout/AppLayout'
import { useExpenses } from './hooks/useExpenses'
import type { Expense, ExpenseFormData } from './types/expense'
import { formatCurrency } from './utils/formatters'

function ExpenseApp() {
  const {
    filteredExpenses,
    currentBudget,
    currency,
    filter,
    summary,
    categoryChartData,
    dailyChartData,
    isSyncing,
    setCurrency,
    setFilter,
    addExpense,
    updateExpense,
    deleteExpense,
    setMonthlyBudget,
  } = useExpenses()

  // Estados de Modais e Diálogos
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [isBudgetOpen, setIsBudgetOpen] = useState(false)
  const [deleteCandidate, setDeleteCandidate] = useState<Expense | null>(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  // Atalho de Teclado 'N' para nova despesa
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)

      if (isInput) return

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        setEditingExpense(null)
        setIsFormOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleOpenNewExpense = () => {
    setEditingExpense(null)
    setIsFormOpen(true)
  }

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setIsFormOpen(true)
  }

  const handleSaveExpense = (data: ExpenseFormData) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data)
    } else {
      addExpense(data)
    }
  }

  const handleDeleteRequest = (expense: Expense) => {
    setDeleteCandidate(expense)
  }

  const handleConfirmDelete = () => {
    if (deleteCandidate) {
      deleteExpense(deleteCandidate.id)
      setDeleteCandidate(null)
    }
  }

  const handleCurrencyToggle = useCallback(() => {
    setCurrency(currency === 'EUR' ? 'BRL' : 'EUR')
  }, [currency, setCurrency])

  const handleMonthChange = useCallback(
    (month: number, year: number) => {
      setFilter({ month, year })
    },
    [setFilter]
  )

  return (
    <>
      <Header
        currentMonth={filter.month}
        currentYear={filter.year}
        currency={currency}
        isSyncing={isSyncing}
        onMonthChange={handleMonthChange}
        onCurrencyToggle={handleCurrencyToggle}
        onOpenNewExpense={handleOpenNewExpense}
        onOpenBudgetModal={() => setIsBudgetOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenConfig={() => setIsConfigOpen(true)}
      />

      <AppLayout>
        {/* Banner de Sincronização em Nuvem (quando em modo local) */}
        <CloudSyncBanner
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenConfig={() => setIsConfigOpen(true)}
        />

        {/* Totalizadores e Resumo Financeiro */}
        <SummaryCards
          summary={summary}
          currency={currency}
          onOpenBudgetModal={() => setIsBudgetOpen(true)}
        />

        {/* Visualização Gráfica (Donut + Barras Diárias) */}
        <ChartsSection
          categoryData={categoryChartData}
          dailyData={dailyChartData}
          summary={summary}
          currency={currency}
        />

        {/* Listagem de Transações com Filtros e Ações */}
        <ExpenseList
          expenses={filteredExpenses}
          filter={filter}
          currency={currency}
          onFilterChange={setFilter}
          onEdit={handleEditExpense}
          onDeleteRequest={handleDeleteRequest}
          onAddNew={handleOpenNewExpense}
        />
      </AppLayout>

      {/* Modal de Formulário (Adicionar / Editar) */}
      <ExpenseFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveExpense}
        editingExpense={editingExpense}
        currency={currency}
      />

      {/* Modal de Configuração do Teto Orçamentário */}
      <BudgetModal
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        currentBudget={currentBudget}
        month={filter.month}
        year={filter.year}
        currency={currency}
        onSave={(amount) => setMonthlyBudget(filter.year, filter.month, amount)}
      />

      {/* Modal de Autenticação Supabase */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onOpenConfig={() => {
          setIsAuthOpen(false)
          setIsConfigOpen(true)
        }}
      />

      {/* Modal de Configuração de Chaves da API Supabase */}
      <SupabaseConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />

      {/* Diálogo de Confirmação para Eliminação */}
      <ConfirmDialog
        isOpen={deleteCandidate !== null}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Despesa?"
        message={
          deleteCandidate
            ? `Tem a certeza que deseja eliminar "${deleteCandidate.description}" no valor de ${formatCurrency(
                deleteCandidate.amount,
                currency
              )}? Esta ação não pode ser desfeita.`
            : 'Tem a certeza que deseja eliminar esta despesa?'
        }
        confirmText="Sim, Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* Notificações Toast para Feedback Imediato */}
      <ToastContainer />
    </>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ExpenseApp />
      </AuthProvider>
    </ToastProvider>
  )
}
