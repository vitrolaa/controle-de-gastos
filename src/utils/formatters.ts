import { MONTH_NAMES } from '../constants/categories'

/**
 * Formata um valor numérico para a moeda selecionada (padrão EUR/BRL amigável).
 */
export function formatCurrency(amount: number, currency: 'EUR' | 'BRL' = 'EUR'): string {
  const locale = currency === 'EUR' ? 'pt-PT' : 'pt-BR'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formata uma string de data ISO (YYYY-MM-DD) para exibição legível (DD/MM/YYYY)
 */
export function formatDate(dateString: string): string {
  if (!dateString) return ''
  const parts = dateString.split('-')
  if (parts.length !== 3) return dateString
  const [year, month, day] = parts
  return `${day}/${month}/${year}`
}

/**
 * Formata data em formato extenso amigável (ex: "18 de Março")
 */
export function formatDateExtended(dateString: string): string {
  if (!dateString) return ''
  const parts = dateString.split('-')
  if (parts.length !== 3) return dateString
  const [_, month, day] = parts
  const monthIndex = parseInt(month, 10) - 1
  return `${parseInt(day, 10)} de ${MONTH_NAMES[monthIndex]}`
}

/**
 * Formata percentual com 1 casa decimal
 */
export function formatPercent(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '0%'
  return `${Math.round(value * 10) / 10}%`
}

/**
 * Retorna rótulo de Mês e Ano (ex: "Março de 2025")
 */
export function getMonthYearLabel(year: number, month: number): string {
  const monthName = MONTH_NAMES[month - 1] || ''
  return `${monthName} de ${year}`
}

/**
 * Retorna a data de hoje no formato YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
