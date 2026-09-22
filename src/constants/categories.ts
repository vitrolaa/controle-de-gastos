import {
  Home,
  Utensils,
  Car,
  Tv,
  HeartPulse,
  GraduationCap,
  Receipt,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react'
import type { ExpenseCategory, CategoryInfo } from '../types/expense'

export interface CategoryDefinition extends CategoryInfo {
  icon: LucideIcon
}

export const CATEGORIES: Record<ExpenseCategory, CategoryDefinition> = {
  housing: {
    id: 'housing',
    label: 'Moradia / Habitação',
    color: '#3b82f6', // blue-500
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: Home,
  },
  food: {
    id: 'food',
    label: 'Alimentação',
    color: '#f97316', // orange-500
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    icon: Utensils,
  },
  transport: {
    id: 'transport',
    label: 'Transporte',
    color: '#8b5cf6', // purple-500
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    icon: Car,
  },
  bills: {
    id: 'bills',
    label: 'Contas & Serviços',
    color: '#06b6d4', // cyan-500
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    borderColor: 'border-cyan-200',
    icon: Receipt,
  },
  health: {
    id: 'health',
    label: 'Saúde & Bem-estar',
    color: '#10b981', // emerald-500
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    icon: HeartPulse,
  },
  education: {
    id: 'education',
    label: 'Educação & Cursos',
    color: '#6366f1', // indigo-500
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200',
    icon: GraduationCap,
  },
  leisure: {
    id: 'leisure',
    label: 'Lazer & Cultura',
    color: '#ec4899', // pink-500
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
    borderColor: 'border-pink-200',
    icon: Tv,
  },
  others: {
    id: 'others',
    label: 'Outros Gastos',
    color: '#64748b', // slate-500
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-200',
    icon: MoreHorizontal,
  },
}

export const CATEGORY_LIST = Object.values(CATEGORIES)

export const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]
