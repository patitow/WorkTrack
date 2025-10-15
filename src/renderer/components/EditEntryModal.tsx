import React, { useState, useEffect } from 'react'
import { X, Save, Tag, FileText } from 'lucide-react'
import { Entry } from '@/types'

interface EditEntryModalProps {
  entry: Entry | null
  isOpen: boolean
  onClose: () => void
  onSave: (id: number, data: { activity: string; tags?: string; note?: string }) => Promise<{ success: boolean; error?: string }>
}

export const EditEntryModal: React.FC<EditEntryModalProps> = ({ entry, isOpen, onClose, onSave }) => {
  const [activity, setActivity] = useState('')
  const [tags, setTags] = useState('')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (entry) {
      setActivity(entry.activity || '')
      setTags(entry.tags || '')
      setNote(entry.note || '')
      setError(null)
    }
  }, [entry])

  const handleSave = async () => {
    if (!entry?.id) return

    if (!activity.trim()) {
      setError('Nome da atividade é obrigatório')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await onSave(entry.id, {
        activity: activity.trim(),
        tags: tags.trim() || undefined,
        note: note.trim() || undefined,
      })

      if (result.success) {
        onClose()
      } else {
        setError(result.error || 'Erro ao salvar alterações')
      }
    } catch (error) {
      setError('Erro ao salvar alterações')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen || !entry) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-card-strong rounded-2xl p-6 w-full max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Editar Atividade</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Atividade *
            </label>
            <input
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-glass w-full"
              placeholder="Digite o nome da atividade"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag size={16} className="inline mr-1" />
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-glass w-full"
              placeholder="Ex: trabalho, projeto, reunião"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-1" />
              Nota
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-glass w-full h-20 resize-none"
              placeholder="Observações sobre a atividade..."
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !activity.trim()}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}
