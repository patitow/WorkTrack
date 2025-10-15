import React from 'react'

interface DurationInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

export const DurationInput: React.FC<DurationInputProps> = ({ 
  value, 
  onChange, 
  disabled = false, 
  placeholder = "Selecione a duração" 
}) => {
  // Parse do valor atual (formato "HH:MM" ou minutos)
  const parseValue = (val: string) => {
    if (!val) return { hours: 0, minutes: 0 }
    
    // Se é formato HH:MM
    if (val.includes(':')) {
      const [h, m] = val.split(':').map(Number)
      return { hours: h || 0, minutes: m || 0 }
    }
    
    // Se é apenas minutos
    const totalMinutes = parseInt(val) || 0
    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60
    }
  }

  const { hours, minutes } = parseValue(value)

  const handleHoursChange = (newHours: number) => {
    const totalMinutes = newHours * 60 + minutes
    onChange(totalMinutes.toString())
  }

  const handleMinutesChange = (newMinutes: number) => {
    const totalMinutes = hours * 60 + newMinutes
    onChange(totalMinutes.toString())
  }

  const formatDisplay = () => {
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="flex items-center gap-1">
        <select
          value={hours}
          onChange={(e) => handleHoursChange(parseInt(e.target.value))}
          disabled={disabled}
          className="input-glass w-16 text-center"
        >
          {Array.from({ length: 25 }, (_, i) => (
            <option key={i} value={i}>
              {i.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
        <span className="text-gray-500 text-sm">h</span>
      </div>
      
      <div className="flex items-center gap-1">
        <select
          value={minutes}
          onChange={(e) => handleMinutesChange(parseInt(e.target.value))}
          disabled={disabled}
          className="input-glass w-16 text-center"
        >
          {Array.from({ length: 60 }, (_, i) => (
            <option key={i} value={i}>
              {i.toString().padStart(2, '0')}
            </option>
          ))}
        </select>
        <span className="text-gray-500 text-sm">m</span>
      </div>
      
      <div className="text-xs text-gray-500 ml-2">
        ({formatDisplay()})
      </div>
    </div>
  )
}
