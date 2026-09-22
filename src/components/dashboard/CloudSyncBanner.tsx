import { useState } from 'react'
import { Cloud, ArrowRight, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

interface CloudSyncBannerProps {
  onOpenAuth: () => void
  onOpenConfig: () => void
}

export function CloudSyncBanner({ onOpenAuth, onOpenConfig }: CloudSyncBannerProps) {
  const { user, isConfigured } = useAuth()
  const [isDismissed, setIsDismissed] = useState(false)

  // Não exibe se o usuário já estiver autenticado na nuvem ou se tiver dispensado o aviso
  if (user || isDismissed) return null

  return (
    <div className="bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/70 rounded-2xl p-4 flex items-center justify-between gap-4 animate-fade-in">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Cloud className="w-5 h-5" />
        </div>
        <div className="min-w-0 text-xs sm:text-sm">
          <p className="font-bold text-slate-900">
            Aceda aos seus gastos no Telemóvel e no Computador
          </p>
          <p className="text-slate-600 text-xs mt-0.5 truncate sm:whitespace-normal">
            {isConfigured
              ? 'Inicie sessão com a sua conta Supabase para sincronização em nuvem em tempo real.'
              : 'Conecte o seu projeto Supabase gratuito para salvar os dados na nuvem com PostgreSQL.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isConfigured ? (
          <button
            type="button"
            onClick={onOpenAuth}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-all shadow-xs"
          >
            <span>Iniciar Sessão</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenConfig}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-all shadow-xs"
          >
            <span>Conectar Supabase</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
          aria-label="Dispensar aviso"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
