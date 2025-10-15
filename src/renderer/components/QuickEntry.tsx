import React, { useState, useEffect } from 'react'
import { Clock, Plus } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { DurationInput } from './DurationInput'

export const QuickEntry: React.FC = () => {
  const { setSelectedDate, loadEntries } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [activity, setActivity] = useState('')
  const [duration, setDuration] = useState('')
  const [tags, setTags] = useState('')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Limpa o formulário quando o modal fecha
  useEffect(() => {
    if (!isOpen) {
      setActivity('')
      setDuration('')
      setTags('')
      setNote('')
      setIsLoading(false)
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!duration.trim()) {
      alert('Por favor, preencha a duração')
      return
    }

    const durationMinutes = parseInt(duration)
    if (isNaN(durationMinutes) || durationMinutes <= 0) {
      alert('Por favor, insira uma duração válida em minutos')
      return
    }

    setIsLoading(true)

    try {
      console.log('Criando entrada rápida:', { activity, durationMinutes, tags, note })
      
      // Cria uma entrada com duração específica
      const result = await window.electronAPI.startEntry(
        activity.trim() || 'Atividade sem nome', 
        tags.trim() || undefined, 
        note.trim() || undefined,
        durationMinutes
      )
      
      console.log('Resultado startEntry:', result)
      
      if (result.success && result.id) {
        // Para a entrada imediatamente para simular uma entrada com duração específica
        const stopResult = await window.electronAPI.stopEntry(result.id)
        
        console.log('Resultado stopEntry:', stopResult)
        
        if (stopResult.success) {
          // Recarrega as entradas
          await loadEntries()
          
          // Limpa o formulário
          setActivity('')
          setDuration('')
          setTags('')
          setNote('')
          setIsOpen(false)
          
          alert('Atividade adicionada com sucesso!')
        } else {
          alert('Erro ao finalizar atividade: ' + (stopResult.error || 'Erro desconhecido'))
        }
      } else {
        alert('Erro ao adicionar atividade: ' + (result.error || 'Erro desconhecido'))
      }
    } catch (error) {
      console.error('Erro ao adicionar atividade:', error)
      alert('Erro ao adicionar atividade')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="glass-card rounded-xl p-4 hover:bg-glass-white-strong transition-all duration-200 w-full text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Plus size={20} className="text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Adicionar Atividade</h3>
            <p className="text-sm text-gray-600">Inserir atividade com duração específica</p>
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className="glass-card rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Adicionar Atividade Rápida</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Atividade *
          </label>
          <input
            type="text"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="input-glass w-full"
            placeholder="Ex: Reunião com cliente"
            disabled={isLoading}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duração *
          </label>
          <DurationInput
            value={duration}
            onChange={setDuration}
            disabled={isLoading}
            placeholder="Selecione a duração"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="input-glass w-full"
              placeholder="Ex: reunião, cliente"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nota
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input-glass w-full"
              placeholder="Ex: Discussão de projeto"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <Clock size={16} />
          Adicionar
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="btn-secondary px-6"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
