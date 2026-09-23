import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'
import { PieChart as PieIcon, BarChart3, Inbox } from 'lucide-react'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import type { MonthlySummary } from '../../types/expense'

interface CategoryChartItem {
  categoryKey: string
  name: string
  value: number
  color: string
  percent: number
}

interface DailyChartItem {
  day: string
  label: string
  fixed: number
  variable: number
  total: number
}

interface ChartsSectionProps {
  categoryData: CategoryChartItem[]
  dailyData: DailyChartItem[]
  summary: MonthlySummary
  currency: 'EUR' | 'BRL'
}

export function ChartsSection({
  categoryData,
  dailyData,
  summary,
  currency,
}: ChartsSectionProps) {
  const hasData = summary.total > 0

  return (
    <section aria-label="Visualização Gráfica" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Gráfico 1: Distribuição por Categoria (Donut) */}
      <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Gastos por Categoria
              </h2>
              <p className="text-xs text-slate-500">Distribuição proporcional no mês</p>
            </div>
          </div>
        </div>

        {!hasData ? (
          <div className="flex-1 min-h-[260px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Inbox className="w-10 h-10 stroke-[1.5] mb-2" />
            <p className="text-sm font-medium text-slate-600">Sem despesas no período</p>
            <p className="text-xs text-slate-400 max-w-xs mt-0.5">
              Adicione uma nova despesa para visualizar a divisão por categorias.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as CategoryChartItem
                        return (
                          <div className="bg-slate-900 text-white text-xs rounded-xl px-3 py-2 shadow-xl border border-slate-700">
                            <p className="font-bold">{data.name}</p>
                            <p className="text-indigo-300 font-semibold mt-0.5">
                              {formatCurrency(data.value, currency)} ({formatPercent(data.percent)})
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={600}
                  >
                    {categoryData.map((entry) => (
                      <Cell key={entry.categoryKey} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Centro do Donut com Total */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Total
                </span>
                <span className="text-sm sm:text-base font-extrabold text-slate-800">
                  {formatCurrency(summary.total, currency)}
                </span>
              </div>
            </div>

            {/* Legenda Customizada com Percentuais */}
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {categoryData.map((item) => (
                <div
                  key={item.categoryKey}
                  className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-700 font-medium truncate">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900 shrink-0 ml-1">
                    {formatPercent(item.percent)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gráfico 2: Evolução Diária (Barras Empilhadas: Fixos e Variáveis) */}
      <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Evolução Diária de Gastos
              </h2>
              <p className="text-xs text-slate-500">
                Picos de consumo ao longo dos dias do mês
              </p>
            </div>
          </div>
        </div>

        {!hasData ? (
          <div className="flex-1 min-h-[260px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <Inbox className="w-10 h-10 stroke-[1.5] mb-2" />
            <p className="text-sm font-medium text-slate-600">Sem atividade registrada</p>
            <p className="text-xs text-slate-400 max-w-xs mt-0.5">
              O gráfico de barras mostrará a dispersão diária das suas despesas fixas e variáveis.
            </p>
          </div>
        ) : (
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={dailyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickFormatter={(val) => `${val}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const totalDay = payload.reduce(
                        (sum, p) => sum + (Number(p.value) || 0),
                        0
                      )
                      return (
                        <div className="bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl border border-slate-700 min-w-[140px]">
                          <p className="font-bold text-slate-300 border-b border-slate-800 pb-1 mb-1.5">
                            Dia {label}
                          </p>
                          <div className="space-y-1">
                            {payload.map((entry, index) => (
                              <div
                                key={`item-${index}`}
                                className="flex justify-between items-center text-[11px]"
                              >
                                <span className="flex items-center gap-1.5">
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span>{entry.name}</span>
                                </span>
                                <span className="font-semibold ml-2">
                                  {formatCurrency(Number(entry.value), currency)}
                                </span>
                              </div>
                            ))}
                            <div className="border-t border-slate-800 pt-1 mt-1 flex justify-between font-bold text-indigo-300">
                              <span>Total:</span>
                              <span>{formatCurrency(totalDay, currency)}</span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingBottom: 12, fontSize: 12 }}
                />
                <Bar
                  dataKey="fixed"
                  name="Gastos Fixos"
                  stackId="a"
                  fill="#3b82f6"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="variable"
                  name="Gastos Variáveis"
                  stackId="a"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  )
}
