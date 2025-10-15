import {
  formatTime,
  formatDuration,
  formatTimeFromTimestamp,
  formatDate,
  formatDateShort,
  getWeekNumber,
  getStartOfWeek,
  getEndOfWeek,
  isToday,
  isCurrentWeek,
  getCurrentTime,
  getCurrentDate,
  addDays,
  subtractDays,
  getDaysInMonth,
  getMonthName,
  getWeekdayName,
} from '@/utils/time'

describe('Time Utils', () => {
  describe('formatTime', () => {
    it('should format milliseconds to HH:MM:SS', () => {
      expect(formatTime(3661000)).toBe('01:01:01')
      expect(formatTime(3600000)).toBe('01:00:00')
      expect(formatTime(60000)).toBe('01:00')
      expect(formatTime(30000)).toBe('00:30')
    })
  })

  describe('formatDuration', () => {
    it('should format minutes to hours and minutes', () => {
      expect(formatDuration(90)).toBe('1h 30m')
      expect(formatDuration(60)).toBe('1h 0m')
      expect(formatDuration(30)).toBe('30m')
      expect(formatDuration(0)).toBe('0m')
    })
  })

  describe('formatTimeFromTimestamp', () => {
    it('should format timestamp to time string', () => {
      const timestamp = new Date('2023-01-01T14:30:00').getTime()
      const result = formatTimeFromTimestamp(timestamp)
      expect(result).toMatch(/\d{2}:\d{2}:\d{2}/)
    })
  })

  describe('formatDate', () => {
    it('should format date to Brazilian format', () => {
      const date = new Date('2023-01-01T12:00:00Z')
      const result = formatDate(date)
      expect(result).toBe('01/01/2023')
    })
  })

  describe('formatDateShort', () => {
    it('should format date to short Brazilian format', () => {
      const date = new Date('2023-01-01T12:00:00Z')
      const result = formatDateShort(date)
      expect(result).toBe('01/01')
    })
  })

  describe('getWeekNumber', () => {
    it('should return correct week number', () => {
      const date = new Date('2023-01-01T12:00:00Z')
      const weekNumber = getWeekNumber(date)
      expect(weekNumber).toBeGreaterThan(0)
      expect(weekNumber).toBeLessThanOrEqual(54)
    })
  })

  describe('getStartOfWeek', () => {
    it('should return start of week (Monday)', () => {
      const date = new Date('2023-01-04') // Wednesday
      const startOfWeek = getStartOfWeek(date)
      expect(startOfWeek.getDay()).toBe(1) // Monday
    })
  })

  describe('getEndOfWeek', () => {
    it('should return end of week (Sunday)', () => {
      const date = new Date('2023-01-04') // Wednesday
      const endOfWeek = getEndOfWeek(date)
      expect(endOfWeek.getDay()).toBe(0) // Sunday
    })
  })

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date()
      expect(isToday(today)).toBe(true)
    })

    it('should return false for yesterday', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      expect(isToday(yesterday)).toBe(false)
    })
  })

  describe('isCurrentWeek', () => {
    it('should return true for current week', () => {
      const today = new Date()
      expect(isCurrentWeek(today)).toBe(true)
    })
  })

  describe('getCurrentTime', () => {
    it('should return current time in correct format', () => {
      const time = getCurrentTime()
      expect(time).toMatch(/\d{2}:\d{2}:\d{2}/)
    })
  })

  describe('getCurrentDate', () => {
    it('should return current date in ISO format', () => {
      const date = getCurrentDate()
      expect(date).toMatch(/\d{4}-\d{2}-\d{2}/)
    })
  })

  describe('addDays', () => {
    it('should add days to date', () => {
      const date = new Date('2023-01-01T12:00:00Z')
      const result = addDays(date, 5)
      expect(result.getUTCDate()).toBe(6)
    })
  })

  describe('subtractDays', () => {
    it('should subtract days from date', () => {
      const date = new Date('2023-01-06T12:00:00Z')
      const result = subtractDays(date, 5)
      expect(result.getUTCDate()).toBe(1)
    })
  })

  describe('getDaysInMonth', () => {
    it('should return correct days in month', () => {
      expect(getDaysInMonth(2023, 1)).toBe(31) // January
      expect(getDaysInMonth(2023, 2)).toBe(28) // February (non-leap year)
      expect(getDaysInMonth(2024, 2)).toBe(29) // February (leap year)
      expect(getDaysInMonth(2023, 4)).toBe(30) // April
    })
  })

  describe('getMonthName', () => {
    it('should return correct month names', () => {
      expect(getMonthName(1)).toBe('Janeiro')
      expect(getMonthName(12)).toBe('Dezembro')
      expect(getMonthName(0)).toBe('')
    })
  })

  describe('getWeekdayName', () => {
    it('should return correct weekday names', () => {
      expect(getWeekdayName(0)).toBe('Domingo')
      expect(getWeekdayName(1)).toBe('Segunda')
      expect(getWeekdayName(6)).toBe('Sábado')
    })
  })
})
