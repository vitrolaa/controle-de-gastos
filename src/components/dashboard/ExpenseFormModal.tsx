import { useState, useEffect, type FormEvent } from 'react'
import type { Expense, ExpenseFormData, ExpenseCategory, ExpenseType } from '../../types/expense'
import { CATEGORY_LIST } from '../../constants/categories'
import { Modal } from '../common/Modal'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import { getTodayDateString } from '../../utils/formatters'
import { Calendar, Tag, Check, DollarSign } from 'lucide-react'

interface ExpenseFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ExpenseFormData) => void
  editingExpense?: Expense | null
  currency: 'EUR' | 'BRL'
}

interface FormErrors {
  description?: string
  amount?: string
  date?: string
}

export function ExpenseFormModal({
  isOpen,
  onClose,
  onSave,
  editingExpense,
  currency,
}: ExpenseFormModalProps) {
  const [description, setDescription] = useState('')
  const [amountStr, setAmountStr] = useState('')
  const [date, setDate] = useState(getTodayDateString())
  const [category, setCategory] = useState<ExpenseCategory>('food')
  const [type, setType] = useState<ExpenseType>('variable')
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (isOpen) {
      if (editingExpense) {
        setDescription(editingExpense.description)
        setAmountStr(editingExpense.amount.toString())
        setDate(editingExpense.date)
        setCategory(editingExpense.category)
        setType(editingExpense.type)
      } else {
        setDescription('')
        setAmountStr('')
        setDate(getTodayDateString())
        setCategory('food')
        setType('variable')
      }
      setErrors({})
      setTouched({})
    }
  }, [isOpen, editingExpense])

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!description.trim()) {
      newErrors.description = 'A descrição é obrigatória.'
    } else if (description.trim().length < 2) {
      newErrors.description = 'A descrição deve ter pelo menos 2 caracteres.'
    }

    const parsedAmount = parseFloat(amountStr.replace(',', '.'))
    if (!amountStr.trim()) {
      newErrors.amount = 'O valor é obrigatório.'
    } else if (isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'O valor deve ser um número positivo superior a 0.'
    }

    if (!date) {
      newErrors.date = 'A data da despesa é obrigatória.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setTouched({ description: true, amount: true, date: true })

    if (!validate()) {
      return
    }

    const parsedAmount = parseFloat(amountStr.replace(',', '.'))

    onSave({
      description: description.trim(),
      amount: Math.round(parsedAmount * 100) / 100,
      date,
      category,
      type,
    })

    onClose()
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validate()
  }

  const currencySymbol = currency === 'EUR' ? '€' : 'R$'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingExpense ? 'Editar Despesa' : 'Registrar Nova Despesa'}
      description={
        editingExpense
          ? 'Atualize os dados da despesa selecionada'
          : 'Preencha os dados do gasto para manter seu orçamento sob controle'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4.5" noValidate>
        {/* Campo: Descrição */}
        <Input
          label="Descrição do Gasto"
          placeholder="Ex: Supermercado, Aluguel, Cinema..."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
            if (touched.description) validate()
          }}
          onBlur={() => handleBlur('description')}
          error={touched.description ? errors.description : undefined}
          required
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Campo: Valor */}
          <Input
            label={`Valor (${currencySymbol})`}
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            leftIcon={<DollarSign className="w-4 h-4" />}
            value={amountStr}
            onChange={(e) => {
              setAmountStr(e.target.value)
              if (touched.amount) validate()
            }}
            onBlur={() => handleBlur('amount')}
            error={touched.amount ? errors.amount : undefined}
            required
          />

          {/* Campo: Data */}
          <Input
            label="Data"
            type="date"
            leftIcon={<Calendar className="w-4 h-4" />}
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
              if (touched.date) validate()
            }}
            onBlur={() => handleBlur('date')}
            error={touched.date ? errors.date : undefined}
            required
          />
        </div>

        {/* Campo: Tipo de Gasto (Fixo vs Variável) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Tipo de Despesa
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setType('fixed')}
              className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                type === 'fixed'
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                  type === 'fixed' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                }`}
              >
                {type === 'fixed' && <Check className="w-2.5 h-2.5" />}
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900">Gasto Fixo</span>
                <span className="block text-[11px] text-slate-500 mt-0.5">
                  Recorrente (aluguel, contas)
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setType('variable')}
              className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                type === 'variable'
                  ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                  type === 'variable' ? 'border-amber-500 bg-amber-500 text-white' : 'border-slate-300'
                }`}
              >
                {type === 'variable' && <Check className="w-2.5 h-2.5" />}
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900">Gasto Variável</span>
                <span className="block text-[11px] text-slate-500 mt-0.5">
                  Oscilante (lazer, compras)
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Campo: Categoria (Seleção visual com Ícones para redução de carga cognitiva) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>Categoria</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200/80 rounded-xl bg-slate-50/40">
            {CATEGORY_LIST.map((cat) => {
              const Icon = cat.icon
              const isSelected = category === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-white border-indigo-600 shadow-xs ring-2 ring-indigo-500/20 font-semibold'
                      : 'border-transparent hover:bg-white text-slate-600 hover:text-slate-900'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center mb-1"
                    style={{
                      backgroundColor: `${cat.color}15`,
                      color: cat.color,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] leading-tight truncate max-w-full">
                    {cat.label.split('/')[0].split('&')[0].trim()}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Ações do Formulário */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {editingExpense ? 'Salvar Alterações' : 'Adicionar Despesa'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
