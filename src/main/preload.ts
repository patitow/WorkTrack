import { contextBridge, ipcRenderer } from 'electron'

// Tipos para a API exposta
export interface ElectronAPI {
  // Tracker
  startEntry: (activity: string, tags?: string, note?: string, durationMinutes?: number) => Promise<{ success: boolean; id?: number; error?: string }>
  pauseEntry: (id: number) => Promise<{ success: boolean; error?: string }>
  stopEntry: (id: number) => Promise<{ success: boolean; error?: string }>
  getCurrentEntry: () => Promise<{ entry: any | null; error?: string }>
  
  // Entries
  getEntries: (date?: string) => Promise<{ entries: any[]; error?: string }>
  updateEntry: (id: number, data: any) => Promise<{ success: boolean; error?: string }>
  deleteEntry: (id: number) => Promise<{ success: boolean; error?: string }>
  
  // Reports
  getMonthlyReport: (year: number, month: number) => Promise<{ report: any; error?: string }>
  getWeeklyReport: (year: number, week: number) => Promise<{ report: any; error?: string }>
  
  // Settings
  getSettings: () => Promise<{ settings: any; error?: string }>
  updateSettings: (settings: any) => Promise<{ success: boolean; error?: string }>
  
  // Day offs and vacations
  setDayOff: (date: string) => Promise<{ success: boolean; error?: string }>
  removeDayOff: (date: string) => Promise<{ success: boolean; error?: string }>
  getDayOffs: (year: number, month: number) => Promise<{ dayOffs: string[]; error?: string }>
  
  setVacation: (startDate: string, endDate: string) => Promise<{ success: boolean; error?: string }>
  removeVacation: (id: number) => Promise<{ success: boolean; error?: string }>
  getVacations: (year: number, month: number) => Promise<{ vacations: any[]; error?: string }>
  
  // Export/Import
  exportData: (format: 'csv' | 'json', year: number, month: number) => Promise<{ data: string; error?: string }>
  importData: (data: string, format: 'csv' | 'json') => Promise<{ success: boolean; error?: string }>
  
  // Backup
  createBackup: () => Promise<{ success: boolean; filePath?: string; error?: string }>
  restoreBackup: (filePath: string) => Promise<{ success: boolean; error?: string }>
  
  // Fix timestamps
  fixTimestamps: () => Promise<{ success: boolean; error?: string }>
  createTestEntries: () => Promise<{ success: boolean; error?: string }>
  showAllEntries: () => Promise<{ success: boolean; error?: string }>
  createEntryForDate: (year: number, month: number, day: number, activity?: string) => Promise<{ success: boolean; error?: string }>
}

// Expõe a API de forma segura
const electronAPI: ElectronAPI = {
  // Tracker
  startEntry: (activity, tags, note, durationMinutes) => ipcRenderer.invoke('tracker:start', { activity, tags, note, durationMinutes }),
  pauseEntry: (id) => ipcRenderer.invoke('tracker:pause', id),
  stopEntry: (id) => ipcRenderer.invoke('tracker:stop', id),
  getCurrentEntry: () => ipcRenderer.invoke('tracker:getCurrent'),
  
  // Entries
  getEntries: (date) => ipcRenderer.invoke('entries:get', date),
  updateEntry: (id, data) => ipcRenderer.invoke('entries:update', { id, data }),
  deleteEntry: (id) => ipcRenderer.invoke('entries:delete', id),
  
  // Reports
  getMonthlyReport: (year, month) => ipcRenderer.invoke('reports:monthly', { year, month }),
  getWeeklyReport: (year, week) => ipcRenderer.invoke('reports:weekly', { year, week }),
  
  // Settings
  getSettings: () => ipcRenderer.invoke('settings:get'),
  updateSettings: (settings) => ipcRenderer.invoke('settings:update', settings),
  
  // Day offs and vacations
  setDayOff: (date) => ipcRenderer.invoke('dayoffs:set', date),
  removeDayOff: (date) => ipcRenderer.invoke('dayoffs:remove', date),
  getDayOffs: (year, month) => ipcRenderer.invoke('dayoffs:get', { year, month }),
  
  setVacation: (startDate, endDate) => ipcRenderer.invoke('vacations:set', { startDate, endDate }),
  removeVacation: (id) => ipcRenderer.invoke('vacations:remove', id),
  getVacations: (year, month) => ipcRenderer.invoke('vacations:get', { year, month }),
  
  // Export/Import
  exportData: (format, year, month) => ipcRenderer.invoke('data:export', { format, year, month }),
  importData: (data, format) => ipcRenderer.invoke('data:import', { data, format }),
  
  // Backup
  createBackup: () => ipcRenderer.invoke('backup:create'),
  restoreBackup: (filePath) => ipcRenderer.invoke('backup:restore', filePath),
  
  // Fix timestamps
  fixTimestamps: () => ipcRenderer.invoke('fix:timestamps'),
  createTestEntries: () => ipcRenderer.invoke('create:test-entries'),
  showAllEntries: () => ipcRenderer.invoke('show:all-entries'),
  createEntryForDate: (year: number, month: number, day: number, activity?: string) => ipcRenderer.invoke('create:entry-for-date', year, month, day, activity),
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// Declaração de tipos globais
declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
