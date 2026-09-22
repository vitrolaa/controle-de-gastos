import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const LOCAL_STORAGE_URL_KEY = 'fincontrol_supabase_url'
const LOCAL_STORAGE_KEY_KEY = 'fincontrol_supabase_anon_key'

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || ''
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

  const localUrl = localStorage.getItem(LOCAL_STORAGE_URL_KEY) || ''
  const localKey = localStorage.getItem(LOCAL_STORAGE_KEY_KEY) || ''

  const url = (envUrl && !envUrl.includes('seu-projeto')) ? envUrl : localUrl
  const anonKey = (envKey && !envKey.includes('sua-chave')) ? envKey : localKey

  return {
    url: url.trim(),
    anonKey: anonKey.trim(),
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials()
  return Boolean(url && anonKey && url.startsWith('http'))
}

export function saveSupabaseCredentials(url: string, anonKey: string): void {
  localStorage.setItem(LOCAL_STORAGE_URL_KEY, url.trim())
  localStorage.setItem(LOCAL_STORAGE_KEY_KEY, anonKey.trim())
  window.location.reload()
}

export function clearSupabaseCredentials(): void {
  localStorage.removeItem(LOCAL_STORAGE_URL_KEY)
  localStorage.removeItem(LOCAL_STORAGE_KEY_KEY)
  window.location.reload()
}

const credentials = getSupabaseCredentials()

// Cliente Supabase ou fallback seguro para evitar falha no carregamento inicial
const dummyUrl = 'https://placeholder-project.supabase.co'
const dummyKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy'

export const supabase: SupabaseClient = createClient(
  credentials.url || dummyUrl,
  credentials.anonKey || dummyKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)
