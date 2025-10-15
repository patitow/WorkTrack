import React, { useState } from 'react'
import { Clock, Tag, FileText, Trash2, Edit3 } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { formatTimeFromTimestamp, formatDuration, parseDateFromAPI } from '@/utils/time'
import { Entry } from '@/types'
import { EditEntryModal } from './EditEntryModal'

interface EntryItemProps {
  entry: Entry
  onEdit?: (entry: Entry) => void
  onDelete?: (id: number) => void
}

const EntryItem: React.FC<EntryItemProps> = ({ entry, onEdit, onDelete }) => {
  const startTime = formatTimeFromTimestamp(entry.start_ts)
  const endTime = entry.end_ts ? formatTimeFromTimestamp(entry.end_ts) : 'Em andamento'
  
  // Calcula duração baseada nos timestamps se duration_minutes não estiver disponível
  let duration = 'Calculando...'
  if (entry.duration_minutes !== null && entry.duration_minutes !== undefined) {
    duration = formatDuration(entry.duration_minutes)
  } else if (entry.end_ts && entry.start_ts) {
    // Calcula duração em tempo real se não tiver duration_minutes
    const durationMs = entry.end_ts - entry.start_ts
    const durationMinutes = Math.floor(durationMs / 60000)
    duration = formatDuration(durationMinutes)
  }

  return (
    <div className="glass-card rounded-xl p-4 hover:bg-glass-white-strong transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-800">{entry.activity}</h3>
            {entry.tags && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Tag size={12} />
                <span>{entry.tags}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{startTime} - {endTime}</span>
            </div>
            <div className="font-medium text-primary-600">
              {duration}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(entry.start_ts).toLocaleDateString('pt-BR')}
            </div>
          </div>
          
          {entry.note && (
            <div className="mt-2 flex items-start gap-1 text-sm text-gray-600">
              <FileText size={14} className="mt-0.5 flex-shrink-0" />
              <span>{entry.note}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit?.(entry)}
            className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
            title="Editar"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete?.(entry.id!)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export const EntriesList: React.FC = () => {
  const { entries, selectedDate, updateEntry } = useAppStore()
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async (id: number, data: { activity: string; tags?: string; note?: string }) => {
    const result = await updateEntry(id, data)
    if (result.success) {
      setIsEditModalOpen(false)
      setEditingEntry(null)
    }
    return result
  }

  const handleCloseEdit = () => {
    setIsEditModalOpen(false)
    setEditingEntry(null)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta entrada?')) {
      try {
        const result = await window.electronAPI.deleteEntry(id)
        if (result.success) {
          // Recarrega as entradas
          const { loadEntries } = useAppStore.getState()
          await loadEntries(selectedDate)
        } else {
          alert('Erro ao excluir entrada: ' + result.error)
        }
      } catch (error) {
        alert('Erro ao excluir entrada')
      }
    }
  }

  if (entries.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <Clock size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Nenhuma entrada registrada para hoje</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Entradas de {parseDateFromAPI(selectedDate).toLocaleDateString('pt-BR')}
        </h2>
        <div className="text-sm text-gray-500">
          {entries.length} {entries.length === 1 ? 'entrada' : 'entradas'}
        </div>
      </div>
      
      {entries.map((entry) => (
        <EntryItem
          key={entry.id}
          entry={entry}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
      
      <EditEntryModal
        entry={editingEntry}
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />
    </div>
  )
}
