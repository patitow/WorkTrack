import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { formatDateShort, getDaysInMonth, getMonthName, isToday, formatDateForAPI } from '@/utils/time'

export const Calendar: React.FC = () => {
  const { selectedDate, setSelectedDate, monthlyReport } = useAppStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week'>('month')

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay()
  const adjustedFirstDay = firstDayOfMonth === 0 ? 0 : firstDayOfMonth // Domingo à esquerda

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleDateClick = (day: number) => {
    const date = new Date(year, month - 1, day)
    const dateStr = formatDateForAPI(date)
    console.log('🗓️ Calendar: Clicou no dia', day, 'do mês', month, 'ano', year)
    console.log('🗓️ Calendar: Data criada:', date.toLocaleString('pt-BR'))
    console.log('🗓️ Calendar: String formatada:', dateStr)
    setSelectedDate(dateStr)
  }

  const getDayStatus = (day: number) => {
    const date = new Date(year, month - 1, day)
    const dateStr = formatDateForAPI(date)
    
    if (monthlyReport) {
      const dayData = monthlyReport.dailyBreakdown.find(d => d.date === dateStr)
      if (dayData) {
        if (dayData.balanceMinutes > 0) {
          return 'positive' // Horas extras
        } else if (dayData.balanceMinutes < 0) {
          return 'negative' // Faltas
        } else {
          return 'neutral' // Meta atingida
        }
      }
    }
    
    return 'default'
  }

  const getDayStatusColor = (status: string) => {
    switch (status) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'neutral':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-white/60 text-gray-700 border-white/30'
    }
  }

  const renderMonthView = () => {
    const days = []
    
    // Dias vazios do início do mês
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-10 w-10" />
      )
    }
    
    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day)
      const dateStr = formatDateForAPI(date)
      const isSelected = selectedDate === dateStr
      const isTodayDate = isToday(date)
      const status = getDayStatus(day)
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
            h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200
            ${isSelected 
              ? 'bg-primary-500 text-white shadow-lg' 
              : `${getDayStatusColor(status)} hover:bg-white/80`
            }
            ${isTodayDate ? 'ring-2 ring-primary-300' : ''}
          `}
        >
          {day}
        </button>
      )
    }
    
    return days
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon size={20} className="text-primary-500" />
          <h2 className="text-lg font-semibold text-gray-800">Calendário</h2>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 text-gray-500 hover:text-primary-500 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 text-gray-500 hover:text-primary-500 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 text-center">
          {getMonthName(month)} {year}
        </h3>
      </div>

      {/* Cabeçalho dos dias da semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Grid do calendário */}
      <div className="grid grid-cols-7 gap-1">
        {renderMonthView()}
      </div>

      {/* Legenda */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="text-sm text-gray-600 mb-2">Legenda:</div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
            <span>Horas extras</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
            <span>Faltas</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div>
            <span>Meta atingida</span>
          </div>
        </div>
      </div>
    </div>
  )
}
