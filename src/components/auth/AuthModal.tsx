import { useState, type FormEvent } from 'react'
import { Modal } from '../common/Modal'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import { useAuth } from '../../hooks/useAuth'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CloudCheck,
  Sparkles,
  Settings2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenConfig: () => void
}

export function AuthModal({ isOpen, onClose, onOpenConfig }: AuthModalProps) {
  const { isConfigured, signIn, signUp, enterDemoMode } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor, introduza um endereço de email válido.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setIsLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) {
          setErrorMessage(error)
        } else {
          onClose()
        }
      } else {
        const { error, confirmationRequired } = await signUp(email, password)
        if (error) {
          setErrorMessage(error)
        } else if (confirmationRequired) {
          setSuccessMessage(
            'Conta criada com sucesso! Enviámos um email de confirmação para validar a sua conta antes de iniciar sessão.'
          )
        } else {
          setSuccessMessage('Conta criada com sucesso! Iniciando sessão...')
          setTimeout(() => onClose(), 1200)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoClick = () => {
    enterDemoMode()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Iniciar Sessão' : 'Criar Nova Conta'}
      description="Sincronize os seus gastos entre o computador e o telemóvel na nuvem"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Aviso caso Supabase não esteja configurado */}
        {!isConfigured && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Supabase não conectado</p>
                <p className="mt-0.5 text-amber-700">
                  Para autenticação na nuvem, configure as credenciais do seu projeto Supabase.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenConfig}
              className="text-xs font-bold text-amber-900 underline hover:text-amber-950 shrink-0"
            >
              Configurar
            </button>
          </div>
        )}

        {/* Abas Alternadoras: Login / Registo */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode('login')
              setErrorMessage(null)
              setSuccessMessage(null)
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Iniciar Sessão
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register')
              setErrorMessage(null)
              setSuccessMessage(null)
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* Mensagens de Sucesso e Erro */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          <Input
            label="Email"
            type="email"
            placeholder="seu.email@exemplo.com"
            leftIcon={<Mail className="w-4 h-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <div className="relative">
            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              leftIcon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8.5 text-slate-400 hover:text-slate-600 p-1"
              aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
            disabled={!isConfigured}
            icon={<CloudCheck className="w-4 h-4" />}
          >
            {mode === 'login' ? 'Entrar com Supabase' : 'Registar Conta Gratuita'}
          </Button>
        </form>

        {/* Divisor */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-slate-400">ou experimente</span>
          </div>
        </div>

        {/* Botão de Modo Demonstração (Redução de Fricção / IHC) */}
        <button
          type="button"
          onClick={handleDemoClick}
          className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Continuar em Modo Demonstração (Dados Locais)</span>
        </button>

        {/* Link para configurar Supabase */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onOpenConfig}
            className="text-xs text-slate-500 hover:text-indigo-600 inline-flex items-center gap-1 transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Configurar chaves da API Supabase</span>
          </button>
        </div>
      </div>
    </Modal>
  )
}
