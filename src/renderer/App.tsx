import React, { useEffect } from 'react'
import { Clock } from './components/Clock'
import { Tracker } from './components/Tracker'
import { EntriesList } from './components/EntriesList'
import { Calendar } from './components/Calendar'
import { StatsCard } from './components/StatsCard'
import { QuickEntry } from './components/QuickEntry'
import { useAppStore } from './stores/useAppStore'

function App() {
  const { 
    loadEntries, 
    loadSettings, 
    loadMonthlyReport, 
    selectedDate, 
    monthlyReport,
    isLoading,
    error 
  } = useAppStore()

  // Carrega dados iniciais
  useEffect(() => {
    const initializeApp = async () => {
      await loadSettings()
      await loadEntries()
      
      const currentDate = new Date()
      await loadMonthlyReport(currentDate.getFullYear(), currentDate.getMonth() + 1)
    }

    initializeApp()
  }, [loadSettings, loadEntries, loadMonthlyReport])

  // Recarrega relatório mensal quando a data selecionada muda
  useEffect(() => {
    const date = new Date(selectedDate)
    loadMonthlyReport(date.getFullYear(), date.getMonth() + 1)
  }, [selectedDate, loadMonthlyReport])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="glass-card-strong rounded-2xl p-8 text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Erro</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Recarregar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 text-shadow">
                WorkTrack
              </h1>
              <p className="text-gray-600 mt-1">
                Controle seu banco de horas pessoal
              </p>
            </div>
            <Clock />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna principal - Tracker e Entradas */}
            <div className="lg:col-span-2 space-y-6">
              <Tracker />
              <QuickEntry />
              <EntriesList />
            </div>

            {/* Sidebar - Calendário e Estatísticas */}
            <div className="space-y-6">
              <Calendar />
              {monthlyReport && <StatsCard report={monthlyReport} />}
            </div>
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card-strong rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
