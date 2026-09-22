import { type ReactNode } from 'react'
import { Keyboard, Database, ShieldCheck } from 'lucide-react'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/80 text-slate-800">
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {children}
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">FinControl</span>
            <span>•</span>
            <span>Gestão Financeira &amp; IHC</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <Database className="w-3.5 h-3.5" />
              <span>Dados 100% locais</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="hidden md:inline-flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-slate-400" />
              <span>Atalhos: Pressione <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono">N</kbd> para nova despesa</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>WCAG 2.1 AA</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
