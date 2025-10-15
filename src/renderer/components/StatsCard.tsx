import React from 'react'
import { Clock, Target, TrendingUp, TrendingDown } from 'lucide-react'
import { formatDuration } from '@/utils/time'
import { MonthlyReport } from '@/types'

interface StatsCardProps {
  report: MonthlyReport
}

export const StatsCard: React.FC<StatsCardProps> = ({ report }) => {
  const workedHours = Math.floor(report.totalWorkedMinutes / 60)
  const workedMinutes = report.totalWorkedMinutes % 60
  const targetHours = Math.floor(report.totalTargetMinutes / 60)
  const targetMinutes = report.totalTargetMinutes % 60
  const balanceHours = Math.floor(Math.abs(report.balanceMinutes) / 60)
  const balanceMinutes = Math.abs(report.balanceMinutes) % 60

  const isPositive = report.balanceMinutes > 0
  const isNegative = report.balanceMinutes < 0

  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Clock size={20} className="text-primary-500" />
        Resumo do Mês
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Horas trabalhadas */}
        <div className="glass-card-light rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary-600">
            {workedHours}h {workedMinutes}m
          </div>
          <div className="text-sm text-gray-600">Trabalhadas</div>
        </div>

        {/* Meta */}
        <div className="glass-card-light rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-700">
            {targetHours}h {targetMinutes}m
          </div>
          <div className="text-sm text-gray-600">Meta</div>
        </div>
      </div>

      {/* Saldo */}
      <div className="mt-4">
        <div className={`glass-card-light rounded-xl p-4 text-center ${
          isPositive ? 'bg-green-50 border-green-200' : 
          isNegative ? 'bg-red-50 border-red-200' : 
          'bg-blue-50 border-blue-200'
        }`}>
          <div className={`text-2xl font-bold flex items-center justify-center gap-2 ${
            isPositive ? 'text-green-600' : 
            isNegative ? 'text-red-600' : 
            'text-blue-600'
          }`}>
            {isPositive ? <TrendingUp size={24} /> : 
             isNegative ? <TrendingDown size={24} /> : 
             <Target size={24} />}
            {balanceHours}h {balanceMinutes}m
          </div>
          <div className="text-sm text-gray-600">
            {isPositive ? 'Horas extras' : 
             isNegative ? 'Faltas' : 
             'Meta atingida'}
          </div>
        </div>
      </div>

      {/* Estatísticas adicionais */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="text-center">
          <div className="font-semibold text-gray-700">{report.entries.length}</div>
          <div className="text-gray-500">Entradas</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-700">{report.dayOffs.length}</div>
          <div className="text-gray-500">Dias de folga</div>
        </div>
      </div>
    </div>
  )
}
