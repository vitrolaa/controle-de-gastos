import type { Expense, MonthlyBudgetMap } from '../types/expense'


/**
 * Gera despesas de exemplo realistas para o mês atual e anterior
 */
export function generateSeedExpenses(): Expense[] {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0')
  const prevMonthNum = now.getMonth() === 0 ? 12 : now.getMonth()
  const prevYearNum = now.getMonth() === 0 ? currentYear - 1 : currentYear
  const prevMonth = String(prevMonthNum).padStart(2, '0')

  return [
    {
      id: 'seed-1',
      description: 'Aluguel do Apartamento',
      amount: 1650.0,
      date: `${currentYear}-${currentMonth}-01`,
      category: 'housing',
      type: 'fixed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-2',
      description: 'Supermercado Mensal',
      amount: 450.8,
      date: `${currentYear}-${currentMonth}-03`,
      category: 'food',
      type: 'variable',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-3',
      description: 'Conta de Luz e Água',
      amount: 185.5,
      date: `${currentYear}-${currentMonth}-05`,
      category: 'bills',
      type: 'fixed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-4',
      description: 'Transporte / Metrô Mensal',
      amount: 120.0,
      date: `${currentYear}-${currentMonth}-06`,
      category: 'transport',
      type: 'fixed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-5',
      description: 'Jantar Restaurante Italiano',
      amount: 110.0,
      date: `${currentYear}-${currentMonth}-08`,
      category: 'food',
      type: 'variable',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-6',
      description: 'Assinatura Internet Fibra + Streaming',
      amount: 99.9,
      date: `${currentYear}-${currentMonth}-10`,
      category: 'bills',
      type: 'fixed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-7',
      description: 'Farmácia & Vitaminas',
      amount: 68.5,
      date: `${currentYear}-${currentMonth}-12`,
      category: 'health',
      type: 'variable',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-8',
      description: 'Cinema e Pipoca com Amigos',
      amount: 55.0,
      date: `${currentYear}-${currentMonth}-14`,
      category: 'leisure',
      type: 'variable',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-9',
      description: 'Curso Online de TypeScript & React',
      amount: 79.9,
      date: `${currentYear}-${currentMonth}-15`,
      category: 'education',
      type: 'variable',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-10',
      description: 'Combustível / Gasolina Posto',
      amount: 150.0,
      date: `${currentYear}-${currentMonth}-17`,
      category: 'transport',
      type: 'variable',
      createdAt: new Date().toISOString(),
    },
    // Despesas do mês anterior para comparação
    {
      id: 'seed-11',
      description: 'Aluguel do Apartamento',
      amount: 1650.0,
      date: `${prevYearNum}-${prevMonth}-01`,
      category: 'housing',
      type: 'fixed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-12',
      description: 'Compras de Supermercado',
      amount: 520.0,
      date: `${prevYearNum}-${prevMonth}-05`,
      category: 'food',
      type: 'variable',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-13',
      description: 'Conta de Luz e Gás',
      amount: 195.0,
      date: `${prevYearNum}-${prevMonth}-10`,
      category: 'bills',
      type: 'fixed',
      createdAt: new Date().toISOString(),
    },
  ]
}

const EXPENSES_STORAGE_KEY = 'fincontrol_expenses_clean'
const BUDGETS_STORAGE_KEY = 'fincontrol_budgets_clean'
const CURRENCY_STORAGE_KEY = 'controle_gastos_currency_v1'

export function loadExpensesFromStorage(): Expense[] {
  try {
    const raw = localStorage.getItem(EXPENSES_STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => !String(item.id).startsWith('seed-'))
    }
    return []
  } catch (error) {
    console.error('Erro ao ler despesas do localStorage:', error)
    return []
  }
}

export function saveExpensesToStorage(expenses: Expense[]): void {
  try {
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses))
  } catch (error) {
    console.error('Erro ao salvar despesas no localStorage:', error)
  }
}

export function loadBudgetsFromStorage(): MonthlyBudgetMap {
  try {
    const raw = localStorage.getItem(BUDGETS_STORAGE_KEY)
    if (!raw) {
      return {}
    }
    return JSON.parse(raw) || {}
  } catch (error) {
    console.error('Erro ao ler orçamentos do localStorage:', error)
    return {}
  }
}

export function saveBudgetsToStorage(budgets: MonthlyBudgetMap): void {
  try {
    localStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(budgets))
  } catch (error) {
    console.error('Erro ao salvar orçamentos no localStorage:', error)
  }
}

export function loadCurrencyPreference(): 'EUR' | 'BRL' {
  try {
    const val = localStorage.getItem(CURRENCY_STORAGE_KEY)
    return val === 'EUR' ? 'EUR' : 'BRL'
  } catch {
    return 'BRL'
  }
}

export function saveCurrencyPreference(currency: 'EUR' | 'BRL'): void {
  try {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency)
  } catch (error) {
    console.error('Erro ao salvar moeda no localStorage:', error)
  }
}
