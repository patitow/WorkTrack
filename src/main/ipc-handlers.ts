import { ipcMain, dialog } from 'electron'
import { Database } from './database'
import { writeFileSync, readFileSync, copyFileSync } from 'fs'
import { join } from 'path'
import { app } from 'electron'

export class IpcHandlers {
  constructor(private database: Database) {}

  registerHandlers(): void {
    // Tracker handlers
    ipcMain.handle('tracker:start', async (_, { activity, tags, note, durationMinutes }) => {
      try {
        const id = this.database.startEntry(activity, tags, note, durationMinutes)
        return { success: true, id }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    ipcMain.handle('tracker:pause', async (_, id: number) => {
      try {
        const success = this.database.pauseEntry(id)
        return { success }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    ipcMain.handle('tracker:stop', async (_, id: number) => {
      try {
        const success = this.database.stopEntry(id)
        return { success }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    ipcMain.handle('tracker:getCurrent', async () => {
      try {
        const entry = this.database.getCurrentEntry()
        return { entry }
      } catch (error) {
        return { entry: null, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    // Entries handlers
    ipcMain.handle('entries:get', async (_, date?: string) => {
      try {
        const entries = this.database.getEntries(date)
        return { entries }
      } catch (error) {
        return { entries: [], error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    ipcMain.handle('entries:update', async (_, { id, data }) => {
      try {
        const success = this.database.updateEntry(id, data)
        return { success }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    ipcMain.handle('entries:delete', async (_, id: number) => {
      try {
        const success = this.database.deleteEntry(id)
        return { success }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    // Reports handlers
    ipcMain.handle('reports:monthly', async (_, { year, month }) => {
      try {
        const report = this.database.getMonthlyReport(year, month)
        return { report }
      } catch (error) {
        return { report: null, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    ipcMain.handle('reports:weekly', async (_, { year, week }) => {
      try {
        // Implementar relatório semanal se necessário
        return { report: null, error: 'Relatório semanal não implementado' }
      } catch (error) {
        return { report: null, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    // Settings handlers
    ipcMain.handle('settings:get', async () => {
      try {
        const settings = this.database.getSettings()
        return { settings }
      } catch (error) {
        return { settings: {}, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    ipcMain.handle('settings:update', async (_, settings) => {
      try {
        const success = this.database.updateSettings(settings)
        return { success }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    // Day offs handlers
    ipcMain.handle('dayoffs:set', async (_, date: string) => {
      try {
        const success = this.database.setDayOff(date)
        return { success }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    ipcMain.handle('dayoffs:remove', async (_, date: string) => {
      try {
        const success = this.database.removeDayOff(date)
        return { success }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    ipcMain.handle('dayoffs:get', async (_, { year, month }) => {
      try {
        const dayOffs = this.database.getDayOffs(year, month)
        return { dayOffs }
      } catch (error) {
        return { dayOffs: [], error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    // Vacations handlers
    ipcMain.handle('vacations:set', async (_, { startDate, endDate }) => {
      try {
        const success = this.database.setVacation(startDate, endDate)
        return { success }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    ipcMain.handle('vacations:remove', async (_, id: number) => {
      try {
        const success = this.database.removeVacation(id)
        return { success }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    ipcMain.handle('vacations:get', async (_, { year, month }) => {
      try {
        const vacations = this.database.getVacations(year, month)
        return { vacations }
      } catch (error) {
        return { vacations: [], error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    // Export/Import handlers
    ipcMain.handle('data:export', async (_, { format, year, month }) => {
      try {
        const data = this.database.exportData(format, year, month)
        
        const result = await dialog.showSaveDialog({
          title: 'Exportar Dados',
          defaultPath: `worktrack-${year}-${month.toString().padStart(2, '0')}.${format}`,
          filters: [
            { name: format.toUpperCase(), extensions: [format] },
            { name: 'Todos os arquivos', extensions: ['*'] }
          ]
        })

        if (!result.canceled && result.filePath) {
          writeFileSync(result.filePath, data, 'utf8')
          return { success: true }
        }

        return { success: false, error: 'Exportação cancelada' }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    ipcMain.handle('data:import', async (_, { data, format }) => {
      try {
        // Implementar importação se necessário
        return { success: false, error: 'Importação não implementada' }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    // Backup handlers
    ipcMain.handle('backup:create', async () => {
      try {
        const dbPath = this.database.getDatabasePath()
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const backupPath = join(app.getPath('documents'), `worktrack-backup-${timestamp}.db`)

        copyFileSync(dbPath, backupPath)

        return { success: true, filePath: backupPath }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    ipcMain.handle('backup:restore', async (_, filePath: string) => {
      try {
        const dbPath = this.database.getDatabasePath()
        copyFileSync(filePath, dbPath)
        
        // Recria a conexão com o banco
        this.database.close()
        // Aqui seria necessário recriar a instância do database
        
        return { success: true }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    // Fix timestamps
    ipcMain.handle('fix:timestamps', async () => {
      try {
        this.database.fixTimestamps()
        return { success: true }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    ipcMain.handle('create:test-entries', async () => {
      try {
        this.database.createTestEntries()
        return { success: true }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    ipcMain.handle('show:all-entries', async () => {
      try {
        this.database.showAllEntries()
        return { success: true }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })

    ipcMain.handle('create:entry-for-date', async (event, year: number, month: number, day: number, activity?: string) => {
      try {
        this.database.createEntryForDate(year, month, day, activity)
        return { success: true }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }
      }
    })
  }
}
