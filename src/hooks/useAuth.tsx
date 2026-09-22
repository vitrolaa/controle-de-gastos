import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

interface AuthContextValue {
  user: User | null
  session: Session | null
  isLoading: boolean
  isConfigured: boolean
  isDemoMode: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string) => Promise<{ error: string | null; confirmationRequired?: boolean }>
  signOut: () => Promise<void>
  enterDemoMode: () => void
  exitDemoMode: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const DEMO_MODE_STORAGE_KEY = 'fincontrol_demo_mode'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    return localStorage.getItem(DEMO_MODE_STORAGE_KEY) === 'true'
  })

  const configured = isSupabaseConfigured()

  useEffect(() => {
    if (!configured) {
      setIsLoading(false)
      return
    }

    // Obter sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    }).catch(() => {
      setIsLoading(false)
    })

    // Ouvir alterações de estado de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          setIsDemoMode(false)
          localStorage.removeItem(DEMO_MODE_STORAGE_KEY)
        }
        setIsLoading(false)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [configured])

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!configured) {
        return { error: 'O Supabase ainda não foi configurado. Insira a URL e a Anon Key.' }
      }
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            return { error: 'Email ou senha incorretos. Por favor, tente novamente.' }
          }
          return { error: error.message }
        }
        setIsDemoMode(false)
        localStorage.removeItem(DEMO_MODE_STORAGE_KEY)
        return { error: null }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Falha ao autenticar com o Supabase'
        return { error: msg }
      }
    },
    [configured]
  )

  const signUp = useCallback(
    async (email: string, password: string) => {
      if (!configured) {
        return { error: 'O Supabase ainda não foi configurado. Insira a URL e a Anon Key.' }
      }
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        })
        if (error) {
          if (error.message.includes('already registered')) {
            return { error: 'Este email já se encontra registado. Inicie sessão em vez disso.' }
          }
          return { error: error.message }
        }
        const confirmationRequired = data.session === null
        if (data.session) {
          setIsDemoMode(false)
          localStorage.removeItem(DEMO_MODE_STORAGE_KEY)
        }
        return { error: null, confirmationRequired }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Falha ao registar utilizador no Supabase'
        return { error: msg }
      }
    },
    [configured]
  )

  const signOut = useCallback(async () => {
    if (configured) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setSession(null)
    setIsDemoMode(false)
    localStorage.removeItem(DEMO_MODE_STORAGE_KEY)
  }, [configured])

  const enterDemoMode = useCallback(() => {
    setIsDemoMode(true)
    localStorage.setItem(DEMO_MODE_STORAGE_KEY, 'true')
  }, [])

  const exitDemoMode = useCallback(() => {
    setIsDemoMode(false)
    localStorage.removeItem(DEMO_MODE_STORAGE_KEY)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isConfigured: configured,
        isDemoMode,
        signIn,
        signUp,
        signOut,
        enterDemoMode,
        exitDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider')
  }
  return ctx
}
