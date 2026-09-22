export type ExpenseType = 'fixed' | 'variable'

export type ExpenseCategory =
  | 'housing'
  | 'food'
  | 'transport'
  | 'leisure'
  | 'health'
  | 'education'
  | 'bills'
  | 'others'

export interface Expense {
  id: string
  description: string
  amount: number
  date: string // formato ISO YYYY-MM-DD
  category: ExpenseCategory
  type: ExpenseType
  createdAt: string
}

export type ExpenseFormData = Omit<Expense, 'id' | 'createdAt'>

export interface CategoryInfo {
  id: ExpenseCategory
  label: string
  color: string
  bgColor: string
  textColor: string
  borderColor: string
}

export interface MonthlyBudgetMap {
  [key: string]: number // Formato 'YYYY-MM': valor
}

export interface ExpenseFilter {
  month: number // 1 a 12
  year: number
  category: ExpenseCategory | 'all'
  type: ExpenseType | 'all'
  search: string
}

export interface MonthlySummary {
  total: number
  budget: number
  remainingBudget: number
  budgetUsagePercent: number
  fixedTotal: number
  variableTotal: number
  fixedPercent: number
  variablePercent: number
  expenseCount: number
}
