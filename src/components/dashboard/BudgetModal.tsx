import { useState, useEffect, type FormEvent } from 'react'
import { Modal } from '../common/Modal'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import { getMonthYearLabel } from '../../utils/formatters'
import { Banknote, Sparkles } from 'lucide-react'

interface BudgetModalProps {
  isOpen: boolean
  onClose: () => void
  currentBudget: number
  month: number
  year: number
  currency: 'EUR' | 'BRL'
  onSave: (amount: number) => void
}

export function BudgetModal({
  isOpen,
  onClose,
  currentBudget,
  month,
  year,
  currency,
  onSave,
}: BudgetModalProps) {
  const [amountStr, setAmountStr] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setAmountStr(currentBudget > 0 ? currentBudget.toString() : '')
      setError(null)
    }
  }, [isOpen, currentBudget])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const val = parseFloat(amountStr.replace(',', '.'))
    if (isNaN(val) || val < 0) {
      setError('Por favor, insira um valor válido (zero ou superior).')
      return
    }
    onSave(val)
    onClose()
  }

  const applyPreset = (preset: number) => {
    setAmountStr(preset.toString())
    setError(null)
  }

  const currencySymbol = currency === 'EUR' ? '€' : 'R$'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Salário / Renda Mensal"
      description={`Defina o seu rendimento disponível para ${getMonthYearLabel(year, month)}`}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4.5">
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-950 flex items-start gap-2.5">
          <Banknote className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Como funciona?</p>
            <p className="mt-0.5 text-emerald-800">
              O FinControl usará este valor como base para calcular exatamente quanto sobra do seu salário após todos os gastos do mês.
            </p>
          </div>
        </div>

        <Input
          label={`Salário Líquido ou Orçamento (${currencySymbol})`}
          type="number"
          step="0.01"
          min="0"
          value={amountStr}
          onChange={(e) => {
            setAmountStr(e.target.value)
            if (error) setError(null)
          }}
          placeholder="Ex: 2500.00"
          error={error || undefined}
          hint="Informe o seu salário mensal ou digite 0 para remover."
          leftIcon={<Banknote className="w-4 h-4" />}
          autoFocus
        />

        {/* Sugestões Rápidas de Salário */}
        <div>
          <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Valores Sugeridos</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {[1000, 1500, 2000, 2500, 3500, 5000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyPreset(preset)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                {currencySymbol} {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Guardar Salário
          </Button>
        </div>
      </form>
    </Modal>
  )
}
