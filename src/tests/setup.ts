import '@testing-library/jest-dom'

// Mock do electronAPI
Object.defineProperty(window, 'electronAPI', {
  value: {
    startEntry: jest.fn(),
    pauseEntry: jest.fn(),
    stopEntry: jest.fn(),
    getCurrentEntry: jest.fn(),
    getEntries: jest.fn(),
    updateEntry: jest.fn(),
    deleteEntry: jest.fn(),
    getMonthlyReport: jest.fn(),
    getWeeklyReport: jest.fn(),
    getSettings: jest.fn(),
    updateSettings: jest.fn(),
    setDayOff: jest.fn(),
    removeDayOff: jest.fn(),
    getDayOffs: jest.fn(),
    setVacation: jest.fn(),
    removeVacation: jest.fn(),
    getVacations: jest.fn(),
    exportData: jest.fn(),
    importData: jest.fn(),
    createBackup: jest.fn(),
    restoreBackup: jest.fn(),
  },
  writable: true,
})

// Mock do ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock do matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
