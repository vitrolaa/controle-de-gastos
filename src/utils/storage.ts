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
      description: 'Renda / Aluguer do Apartamento',
      amount: 650.0,
      date: `${currentYear}-${currentMonth}-01`,
      category: 'housing',
      type: 'fixed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-2',
      description: 'Supermercado Quinzenal',
      amount: 142.8,
      date: `${currentYear}-${currentMonth}-03`,
      category: 'food',
      type: 'variable',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-3',
      description: 'Fatura de Eletricidade e Água',
      amount: 85.5,
      date: `${currentYear}-${currentMonth}-05`,
      category: 'bills',
      type: 'fixed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-4',
      description: 'Passe Navegante / Transporte Mensal',
      amount: 40.0,
      date: `${currentYear}-${currentMonth}-06`,
      category: 'transport',
      type: 'fixed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-5',
      description: 'Jantar Restaurante Italiano',
      amount: 54.0,
      date: `${currentYear}-${currentMonth}-08`,
      category: 'food',
      type: 'variable',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-6',
      description: 'Subscrição Internet Fibra + TV',
      amount: 34.9,
      date: `${currentYear}-${currentMonth}-10`,
      category: 'bills',
      type: 'fixed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-7',
      description: 'Farmácia & Vitaminas',
      amount: 28.5,
      date: `${currentYear}-${currentMonth}-12`,
      category: 'health',
      type: 'variable',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-8',
      description: 'Cinema e Pipocas com Amigos',
      amount: 22.0,
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
      description: 'Combustível Posto Galp',
      amount: 60.0,
      date: `${currentYear}-${currentMonth}-17`,
      category: 'transport',
      type: 'variable',
      createdAt: new Date().toISOString(),
    },
    // Despesas do mês anterior para comparação
    {
      id: 'seed-11',
      description: 'Renda do Apartamento',
      amount: 650.0,
      date: `${prevYearNum}-${prevMonth}-01`,
      category: 'housing',
      type: 'fixed',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-12',
      description: 'Compras Supermercado',
      amount: 290.0,
      date: `${prevYearNum}-${prevMonth}-05`,
      category: 'food',
      type: 'variable',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'seed-13',
      description: 'Eletricidade e Gás',
      amount: 92.0,
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
    console.error('Erro ao gravar despesas no localStorage:', error)
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
    console.error('Erro ao gravar orçamentos no localStorage:', error)
  }
}

export function loadCurrencyPreference(): 'EUR' | 'BRL' {
  try {
    const val = localStorage.getItem(CURRENCY_STORAGE_KEY)
    return val === 'BRL' ? 'BRL' : 'EUR'
  } catch {
    return 'EUR'
  }
}

export function saveCurrencyPreference(currency: 'EUR' | 'BRL'): void {
  try {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency)
  } catch (error) {
    console.error('Erro ao gravar moeda no localStorage:', error)
  }
}
