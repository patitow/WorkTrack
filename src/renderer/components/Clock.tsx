import React, { useState, useEffect } from 'react'
import { getCurrentTime } from '@/utils/time'

export const Clock: React.FC = () => {
  const [time, setTime] = useState(getCurrentTime())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="glass-card-strong rounded-2xl p-6 text-center">
      <div className="text-4xl font-bold text-gray-800 text-shadow">
        {time}
      </div>
      <div className="text-sm text-gray-600 mt-2">
        {new Date().toLocaleDateString('pt-BR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
    </div>
  )
}
