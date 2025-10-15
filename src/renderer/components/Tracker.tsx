import React, { useState, useEffect } from 'react'
import { Play, Pause, Square, Clock } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { formatTime } from '@/utils/time'

export const Tracker: React.FC = () => {
  const { tracker, startTracking, pauseTracking, resumeTracking, stopTracking, updateTime } = useAppStore()
  const [activity, setActivity] = useState('')
  const [tags, setTags] = useState('')
  const [note, setNote] = useState('')

  // Atualiza o tempo a cada segundo quando está rodando
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (tracker.isRunning && !tracker.isPaused) {
      interval = setInterval(() => {
        updateTime()
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [tracker.isRunning, tracker.isPaused, updateTime])

  const handleStart = async () => {
    // Permite iniciar sem nome da atividade
    const activityName = activity.trim() || 'Atividade sem nome'
    
    await startTracking(activityName, tags.trim() || undefined, note.trim() || undefined)
    setActivity('')
    setTags('')
    setNote('')
  }

  const handlePause = async () => {
    if (tracker.isPaused) {
      await resumeTracking()
    } else {
      await pauseTracking()
    }
  }

  const handleStop = async () => {
    if (confirm('Tem certeza que deseja parar o tracking atual?')) {
      try {
        await stopTracking()
      } catch (error) {
        console.error('Erro ao parar tracking:', error)
        // Força o reset do estado em caso de erro
        const { dispatch } = useAppStore.getState()
        dispatch({ type: 'SET_LOADING', payload: false })
        dispatch({ type: 'SET_CURRENT_ENTRY', payload: null })
      }
    }
  }

  const getCurrentDisplayTime = () => {
    if (tracker.currentEntry && tracker.currentEntry.start_ts) {
      const now = Date.now()
      const elapsed = now - tracker.currentEntry.start_ts
      return formatTime(elapsed)
    }
    return formatTime(tracker.currentTime)
  }

  return (
    <div className="glass-card-strong rounded-3xl p-8 text-center">
      <div className="mb-6">
        <div className="text-6xl font-bold text-primary-500 mb-2 text-shadow-lg">
          {getCurrentDisplayTime()}
        </div>
        {tracker.currentEntry && (
          <div className="text-lg text-gray-600">
            {tracker.currentEntry.activity}
          </div>
        )}
      </div>

      {!tracker.isRunning ? (
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Nome da atividade (opcional)"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="input-glass w-full max-w-md mx-auto"
              onKeyPress={(e) => e.key === 'Enter' && handleStart()}
            />
          </div>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Tags (opcional)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="input-glass flex-1"
            />
            <input
              type="text"
              placeholder="Nota (opcional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input-glass flex-1"
            />
          </div>
          <button
            onClick={handleStart}
            className="btn-primary text-xl px-8 py-4 rounded-2xl flex items-center gap-3 mx-auto"
          >
            <Play size={24} />
            Iniciar
          </button>
        </div>
      ) : (
        <div className="flex gap-4 justify-center">
          <button
            onClick={handlePause}
            className={`btn-secondary text-lg px-6 py-3 rounded-xl flex items-center gap-2 ${
              tracker.isPaused ? 'bg-accent-500 hover:bg-accent-600 text-white' : ''
            }`}
          >
            {tracker.isPaused ? <Play size={20} /> : <Pause size={20} />}
            {tracker.isPaused ? 'Retomar' : 'Pausar'}
          </button>
          <button
            onClick={handleStop}
            className="btn-secondary text-lg px-6 py-3 rounded-xl flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white"
          >
            <Square size={20} />
            Parar
          </button>
        </div>
      )}

      {tracker.isPaused && (
        <div className="mt-4 text-accent-600 font-medium flex items-center justify-center gap-2">
          <Clock size={16} />
          Pausado
        </div>
      )}
    </div>
  )
}
