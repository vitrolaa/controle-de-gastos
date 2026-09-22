import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useToast, type ToastType, type ToastItem } from '../../hooks/useToast'

interface ToastIconProps {
  type: ToastType
}

function ToastIcon({ type }: ToastIconProps) {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" aria-hidden="true" />
    case 'error':
      return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" aria-hidden="true" />
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />
    case 'info':
    default:
      return <Info className="w-5 h-5 text-indigo-500 shrink-0" aria-hidden="true" />
  }
}

function ToastCard({ toast }: { toast: ToastItem }) {
  const { removeToast } = useToast()

  const borderClass = {
    success: 'border-l-4 border-l-emerald-500 bg-white shadow-lg shadow-emerald-500/10',
    error: 'border-l-4 border-l-rose-500 bg-white shadow-lg shadow-rose-500/10',
    warning: 'border-l-4 border-l-amber-500 bg-white shadow-lg shadow-amber-500/10',
    info: 'border-l-4 border-l-indigo-500 bg-white shadow-lg shadow-indigo-500/10',
  }[toast.type]

  return (
    <div
      role="status"
      className={`flex items-start gap-3 p-4 rounded-xl border border-slate-200/80 backdrop-blur-sm transition-all duration-300 transform animate-fade-in ${borderClass} max-w-md w-full`}
    >
      <ToastIcon type={toast.type} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => removeToast(toast.id)}
        className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const { toasts } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-auto"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
