import { useState, useEffect, useMemo, useCallback } from 'react'
import type {
  Expense,
  ExpenseFormData,
  ExpenseFilter,
  MonthlyBudgetMap,
  MonthlySummary,
} from '../types/expense'
import { CATEGORIES } from '../constants/categories'
import {
  loadExpensesFromStorage,
  saveExpensesToStorage,
  loadBudgetsFromStorage,
  saveBudgetsToStorage,
  loadCurrencyPreference,
  saveCurrencyPreference,
  generateSeedExpenses,
} from '../utils/storage'
import { useToast } from './useToast'
import { useAuth } from './useAuth'
import { supabase } from '../lib/supabaseClient'

export function useExpenses() {
  const toast = useToast()
  const { user, isConfigured } = useAuth()

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    return user ? [] : loadExpensesFromStorage()
  })
  const [budgets, setBudgets] = useState<MonthlyBudgetMap>(() => {
    return user ? {} : loadBudgetsFromStorage()
  })
  const [currency, setCurrencyState] = useState<'EUR' | 'BRL'>(() => loadCurrencyPreference())
  const [isSyncing, setIsSyncing] = useState<boolean>(false)

  const now = new Date()
  const [filter, setFilterState] = useState<ExpenseFilter>({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    category: 'all',
    type: 'all',
    search: '',
  })

  // Sincronização e Carregamento com o Supabase quando logado
  const fetchCloudData = useCallback(async () => {
    if (!user || !isConfigured) return

    setIsSyncing(true)
    try {
      // 1. Carregar despesas
      const { data: expensesData, error: expError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (expError) {
        console.error('Erro ao carregar despesas do Supabase:', expError)
        setExpenses([])
      } else if (expensesData) {
        const mapped: Expense[] = expensesData.map((item) => ({
          id: item.id,
          description: item.description,
          amount: Number(item.amount),
          date: item.date,
          category: item.category,
          type: item.type,
          createdAt: item.created_at,
        }))
        setExpenses(mapped)
      } else {
        setExpenses([])
      }

      // 2. Carregar tetos orçamentários
      const { data: budgetsData, error: budError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)

      if (budError) {
        console.error('Erro ao carregar orçamentos do Supabase:', budError)
        setBudgets({})
      } else if (budgetsData && budgetsData.length > 0) {
        const budgetMap: MonthlyBudgetMap = {}
        budgetsData.forEach((b) => {
          budgetMap[b.month_year] = Number(b.amount)
        })
        setBudgets(budgetMap)
      } else {
        setBudgets({})
      }
    } catch (error) {
      console.error('Erro na sincronização com a nuvem:', error)
    } finally {
      setIsSyncing(false)
    }
  }, [user, isConfigured])

  // Efeito para carregar dados ao fazer login ou alterar usuário
  useEffect(() => {
    // Ao mudar de usuário ou logar, limpa o estado imediatamente
    setExpenses([])
    setBudgets({})

    if (user && isConfigured) {
      fetchCloudData()

      // Inscrição em Tempo Real (Supabase Realtime)
      const channel = supabase
        .channel(`user-sync-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'expenses',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            // Atualização silenciosa em tempo real
            fetchCloudData()
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'budgets',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchCloudData()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    } else {
      // Modo local: inicia com o storage local (que começa vazio)
      setExpenses(loadExpensesFromStorage())
      setBudgets(loadBudgetsFromStorage())
    }
  }, [user?.id, isConfigured, fetchCloudData])

  // Salvar no localStorage quando em modo local (sem usuário logado)
  useEffect(() => {
    if (!user) {
      saveExpensesToStorage(expenses)
    }
  }, [expenses, user])

  useEffect(() => {
    if (!user) {
      saveBudgetsToStorage(budgets)
    }
  }, [budgets, user])

  const setCurrency = useCallback((c: 'EUR' | 'BRL') => {
    setCurrencyState(c)
    saveCurrencyPreference(c)
  }, [])

  const setFilter = useCallback((partial: Partial<ExpenseFilter>) => {
    setFilterState((prev) => ({ ...prev, ...partial }))
  }, [])

  // Ações de Gestão de Despesas com suporte a Supabase
  const addExpense = useCallback(
    async (data: ExpenseFormData) => {
      if (user && isConfigured) {
        setIsSyncing(true)
        try {
          const { data: inserted, error } = await supabase
            .from('expenses')
            .insert({
              user_id: user.id,
              description: data.description,
              amount: data.amount,
              date: data.date,
              category: data.category,
              type: data.type,
            })
            .select()
            .single()

          if (error) {
            if (error.message.includes('Could not find the table') || error.message.includes('schema cache')) {
              toast.error(
                'Tabelas não criadas no Supabase',
                'Execute o script SQL no painel do Supabase para criar as tabelas "expenses" e "budgets".'
              )
            } else {
              toast.error('Erro ao salvar na nuvem', error.message)
            }
            return
          }

          if (inserted) {
            const newExp: Expense = {
              id: inserted.id,
              description: inserted.description,
              amount: Number(inserted.amount),
              date: inserted.date,
              category: inserted.category,
              type: inserted.type,
              createdAt: inserted.created_at,
            }
            setExpenses((prev) => [newExp, ...prev])
            toast.success('Despesa sincronizada', `"${data.description}" salva na nuvem.`)
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Falha na conexão'
          toast.error('Erro de conexão', msg)
        } finally {
          setIsSyncing(false)
        }
      } else {
        // Fallback Local
        const newExpense: Expense = {
          ...data,
          id: 'exp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
          createdAt: new Date().toISOString(),
        }
        setExpenses((prev) => [newExpense, ...prev])
        toast.success('Despesa adicionada', `"${data.description}" registrada localmente.`)
      }
    },
    [user, isConfigured, toast]
  )

  const updateExpense = useCallback(
    async (id: string, data: ExpenseFormData) => {
      // Atualização otimista
      setExpenses((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data } : item))
      )

      if (user && isConfigured) {
        setIsSyncing(true)
        try {
          const { error } = await supabase
            .from('expenses')
            .update({
              description: data.description,
              amount: data.amount,
              date: data.date,
              category: data.category,
              type: data.type,
            })
            .eq('id', id)
            .eq('user_id', user.id)

          if (error) {
            toast.error('Erro ao atualizar na nuvem', error.message)
            fetchCloudData() // Reverte
          } else {
            toast.success('Despesa atualizada', `"${data.description}" atualizada na nuvem.`)
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Falha na conexão'
          toast.error('Erro de conexão', msg)
          fetchCloudData()
        } finally {
          setIsSyncing(false)
        }
      } else {
        toast.success('Despesa atualizada', `"${data.description}" foi atualizada com sucesso.`)
      }
    },
    [user, isConfigured, toast, fetchCloudData]
  )

  const deleteExpense = useCallback(
    async (id: string) => {
      const target = expenses.find((e) => e.id === id)
      // Otimista
      setExpenses((prev) => prev.filter((item) => item.id !== id))

      if (user && isConfigured) {
        setIsSyncing(true)
        try {
          const { error } = await supabase
            .from('expenses')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

          if (error) {
            toast.error('Erro ao excluir na nuvem', error.message)
            fetchCloudData()
          } else {
            toast.info(
              'Despesa excluída',
              target ? `"${target.description}" removida da nuvem.` : 'Removida.'
            )
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Falha na conexão'
          toast.error('Erro de conexão', msg)
          fetchCloudData()
        } finally {
          setIsSyncing(false)
        }
      } else {
        toast.info(
          'Despesa excluída',
          target ? `"${target.description}" foi removida.` : 'A despesa foi removida.'
        )
      }
    },
    [expenses, user, isConfigured, toast, fetchCloudData]
  )

  const setMonthlyBudget = useCallback(
    async (year: number, month: number, amount: number) => {
      const key = `${year}-${String(month).padStart(2, '0')}`

      setBudgets((prev) => ({
        ...prev,
        [key]: amount,
      }))

      if (user && isConfigured) {
        setIsSyncing(true)
        try {
          const { error } = await supabase.from('budgets').upsert(
            {
              user_id: user.id,
              month_year: key,
              amount: amount,
            },
            { onConflict: 'user_id, month_year' }
          )

          if (error) {
            if (error.message.includes('Could not find the table') || error.message.includes('schema cache')) {
              toast.error(
                'Tabela budgets não encontrada',
                'Execute o script SQL no painel do Supabase para criar as tabelas "expenses" e "budgets".'
              )
            } else {
              toast.error('Erro ao salvar teto na nuvem', error.message)
            }
          } else {
            toast.success('Orçamento sincronizado', `Teto mensal salvo no Supabase.`)
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Falha na conexão'
          toast.error('Erro de conexão', msg)
        } finally {
          setIsSyncing(false)
        }
      } else {
        toast.success('Orçamento atualizado', `Teto mensal definido para o período selecionado.`)
      }
    },
    [user, isConfigured, toast]
  )

  const resetToSeed = useCallback(() => {
    const seed = generateSeedExpenses()
    setExpenses(seed)
    toast.info('Dados reiniciados', 'A lista foi restaurada com exemplos demonstrativos.')
  }, [toast])

  const clearAll = useCallback(() => {
    setExpenses([])
    toast.warning('Dados apagados', 'Todas as despesas foram removidas.')
  }, [toast])

  // Despesas filtradas pelo mês selecionado
  const monthYearKey = `${filter.year}-${String(filter.month).padStart(2, '0')}`

  const monthExpenses = useMemo(() => {
    return expenses.filter((e) => {
      if (!e.date) return false
      const [yStr, mStr] = e.date.split('-')
      return parseInt(yStr, 10) === filter.year && parseInt(mStr, 10) === filter.month
    })
  }, [expenses, filter.year, filter.month])

  // Despesas com todos os filtros (para a tabela)
  const filteredExpenses = useMemo(() => {
    return monthExpenses.filter((e) => {
      if (filter.category !== 'all' && e.category !== filter.category) return false
      if (filter.type !== 'all' && e.type !== filter.type) return false
      if (filter.search.trim()) {
        const query = filter.search.toLowerCase()
        const matchesDesc = e.description.toLowerCase().includes(query)
        const categoryLabel = CATEGORIES[e.category]?.label.toLowerCase() || ''
        const matchesCategory = categoryLabel.includes(query)
        if (!matchesDesc && !matchesCategory) return false
      }
      return true
    })
  }, [monthExpenses, filter.category, filter.type, filter.search])

  // Resumo Financeiro
  const currentBudget = budgets[monthYearKey] ?? 0

  const summary: MonthlySummary = useMemo(() => {
    let total = 0
    let fixedTotal = 0
    let variableTotal = 0

    monthExpenses.forEach((e) => {
      total += e.amount
      if (e.type === 'fixed') {
        fixedTotal += e.amount
      } else {
        variableTotal += e.amount
      }
    })

    const remainingBudget = currentBudget > 0 ? currentBudget - total : 0
    const budgetUsagePercent = currentBudget > 0 ? (total / currentBudget) * 100 : 0
    const fixedPercent = total > 0 ? (fixedTotal / total) * 100 : 0
    const variablePercent = total > 0 ? (variableTotal / total) * 100 : 0

    return {
      total,
      budget: currentBudget,
      remainingBudget,
      budgetUsagePercent,
      fixedTotal,
      variableTotal,
      fixedPercent,
      variablePercent,
      expenseCount: monthExpenses.length,
    }
  }, [monthExpenses, currentBudget])

  // Dados para Donut Chart
  const categoryChartData = useMemo(() => {
    const map: Record<string, number> = {}
    monthExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount
    })
    const total = summary.total
    return Object.entries(map)
      .map(([catKey, amount]) => {
        const catInfo = CATEGORIES[catKey as keyof typeof CATEGORIES]
        return {
          categoryKey: catKey,
          name: catInfo ? catInfo.label : catKey,
          value: Math.round(amount * 100) / 100,
          color: catInfo ? catInfo.color : '#94a3b8',
          percent: total > 0 ? Math.round((amount / total) * 1000) / 10 : 0,
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [monthExpenses, summary.total])

  // Dados para Bar Chart Diário
  const dailyChartData = useMemo(() => {
    const daysInMonth = new Date(filter.year, filter.month, 0).getDate()
    const daysMap: Record<number, { fixed: number; variable: number; total: number }> = {}

    for (let d = 1; d <= daysInMonth; d++) {
      daysMap[d] = { fixed: 0, variable: 0, total: 0 }
    }

    monthExpenses.forEach((e) => {
      const day = parseInt(e.date.split('-')[2], 10)
      if (daysMap[day]) {
        if (e.type === 'fixed') {
          daysMap[day].fixed += e.amount
        } else {
          daysMap[day].variable += e.amount
        }
        daysMap[day].total += e.amount
      }
    })

    return Array.from({ length: daysInMonth }, (_, idx) => {
      const day = idx + 1
      const info = daysMap[day]
      return {
        day: `${String(day).padStart(2, '0')}`,
        label: `Dia ${day}`,
        fixed: Math.round(info.fixed * 100) / 100,
        variable: Math.round(info.variable * 100) / 100,
        total: Math.round(info.total * 100) / 100,
      }
    })
  }, [monthExpenses, filter.year, filter.month])

  return {
    expenses,
    monthExpenses,
    filteredExpenses,
    budgets,
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
    resetToSeed,
    clearAll,
    refetch: fetchCloudData,
  }
}
