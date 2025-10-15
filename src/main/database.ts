import DatabaseLib from 'better-sqlite3'
import { join } from 'path'
import { app } from 'electron'

export interface Entry {
  id?: number
  user_id: number
  activity: string
  start_ts: number
  pause_intervals?: string
  end_ts?: number
  duration_minutes?: number
  tags?: string
  note?: string
  created_at?: string
  updated_at?: string
}

export interface DailyTarget {
  id?: number
  user_id: number
  weekday: number
  target_minutes: number
}

export interface DayOff {
  id?: number
  user_id: number
  date: string
}

export interface Vacation {
  id?: number
  user_id: number
  start_date: string
  end_date: string
}

export interface Settings {
  key: string
  value: string
}

export class Database {
  private db: DatabaseLib.Database
  private readonly userId = 1 // Por enquanto, usuário único

  constructor() {
    const userDataPath = app.getPath('userData')
    const dbPath = join(userDataPath, 'worktrack.db')
    
    this.db = new DatabaseLib(dbPath)
    this.initializeTables()
    this.initializeDefaultData()
  }

  private initializeTables(): void {
    // Tabela de usuários (opcional para multi-profile)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Tabela de metas diárias
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS daily_targets (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        weekday INTEGER NOT NULL,
        target_minutes INTEGER NOT NULL DEFAULT 480,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        UNIQUE(user_id, weekday)
      )
    `)

    // Tabela de entradas de tempo
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        activity TEXT NOT NULL,
        start_ts INTEGER NOT NULL,
        pause_intervals TEXT,
        end_ts INTEGER,
        duration_minutes INTEGER,
        tags TEXT,
        note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `)

    // Tabela de dias de folga
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS day_offs (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        UNIQUE(user_id, date)
      )
    `)

    // Tabela de férias
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS vacations (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `)

    // Tabela de configurações
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Índices para performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_entries_user_date ON entries(user_id, start_ts);
      CREATE INDEX IF NOT EXISTS idx_entries_status ON entries(user_id, end_ts);
      CREATE INDEX IF NOT EXISTS idx_dayoffs_user_date ON day_offs(user_id, date);
      CREATE INDEX IF NOT EXISTS idx_vacations_user_date ON vacations(user_id, start_date, end_date);
    `)
  }

  private initializeDefaultData(): void {
    // Cria usuário padrão se não existir
    const userExists = this.db.prepare('SELECT id FROM users WHERE id = ?').get(this.userId)
    if (!userExists) {
      this.db.prepare('INSERT INTO users (id, name) VALUES (?, ?)').run(this.userId, 'Usuário Principal')
    }

    // Configura metas padrão (40h semanais, 8h por dia)
    const defaultTargets = [
      { weekday: 1, minutes: 480 }, // Segunda
      { weekday: 2, minutes: 480 }, // Terça
      { weekday: 3, minutes: 480 }, // Quarta
      { weekday: 4, minutes: 480 }, // Quinta
      { weekday: 5, minutes: 480 }, // Sexta
      { weekday: 6, minutes: 0 },   // Sábado
      { weekday: 0, minutes: 0 },   // Domingo
    ]

    for (const target of defaultTargets) {
      const exists = this.db.prepare('SELECT id FROM daily_targets WHERE user_id = ? AND weekday = ?')
        .get(this.userId, target.weekday)
      
      if (!exists) {
        this.db.prepare('INSERT INTO daily_targets (user_id, weekday, target_minutes) VALUES (?, ?, ?)')
          .run(this.userId, target.weekday, target.minutes)
      }
    }

    // Configurações padrão
    const defaultSettings = [
      { key: 'weekly_target_hours', value: '40' },
      { key: 'week_starts_monday', value: 'true' },
      { key: 'theme', value: 'light' },
      { key: 'language', value: 'pt-BR' },
    ]

    for (const setting of defaultSettings) {
      const exists = this.db.prepare('SELECT key FROM settings WHERE key = ?').get(setting.key)
      if (!exists) {
        this.db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)')
          .run(setting.key, setting.value)
      }
    }
  }

  // Função para criar entradas de teste - TUDO LOCAL
  createTestEntries(): void {
    console.log('🧪 Criando entradas de teste LOCAIS...')
    
    // Criar entrada para 1º de outubro de 2025 às 10h LOCAL
    const oct1 = new Date(2025, 9, 1, 10, 0, 0, 0) // month é 0-indexed
    const oct1Timestamp = oct1.getTime()
    
    // Criar entrada para 1º de novembro de 2025 às 14h LOCAL
    const nov1 = new Date(2025, 10, 1, 14, 0, 0, 0)
    const nov1Timestamp = nov1.getTime()
    
    console.log('🧪 Timestamps de teste LOCAIS:', {
      oct1: oct1.toISOString(),
      oct1Local: oct1.toLocaleString('pt-BR'),
      oct1Timestamp,
      nov1: nov1.toISOString(),
      nov1Local: nov1.toLocaleString('pt-BR'),
      nov1Timestamp
    })
    
    // Inserir entradas de teste
    this.db.prepare(`
      INSERT INTO entries (user_id, activity, start_ts, end_ts, duration_minutes, tags, note)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(this.userId, 'Teste 1º Outubro', oct1Timestamp, oct1Timestamp + (2 * 60 * 60 * 1000), 120, 'teste', 'Entrada de teste para 1º de outubro')
    
    this.db.prepare(`
      INSERT INTO entries (user_id, activity, start_ts, end_ts, duration_minutes, tags, note)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(this.userId, 'Teste 1º Novembro', nov1Timestamp, nov1Timestamp + (1 * 60 * 60 * 1000), 60, 'teste', 'Entrada de teste para 1º de novembro')
    
    console.log('✅ Entradas de teste LOCAIS criadas!')
  }

  // Função para criar entrada em qualquer dia específico
  createEntryForDate(year: number, month: number, day: number, activity: string = 'Teste'): void {
    console.log(`🧪 Criando entrada para ${day}/${month}/${year}...`)
    
    const date = new Date(year, month - 1, day, 10, 0, 0, 0) // 10h da manhã
    const timestamp = date.getTime()
    const endTimestamp = timestamp + (2 * 60 * 60 * 1000) // 2 horas depois
    
    console.log('📅 Data criada:', {
      date: date.toLocaleString('pt-BR'),
      timestamp,
      endTimestamp
    })
    
    this.db.prepare(`
      INSERT INTO entries (user_id, activity, start_ts, end_ts, duration_minutes, tags, note)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(this.userId, activity, timestamp, endTimestamp, 120, 'teste', `Entrada de teste para ${day}/${month}/${year}`)
    
    console.log(`✅ Entrada criada para ${day}/${month}/${year}!`)
  }

  // Função para mostrar TODAS as entradas do banco
  showAllEntries(): void {
    console.log('📋 MOSTRANDO TODAS AS ENTRADAS DO BANCO:')
    
    const allEntries = this.db.prepare('SELECT * FROM entries WHERE user_id = ? ORDER BY start_ts DESC').all(this.userId) as Entry[]
    
    console.log(`📊 Total de entradas: ${allEntries.length}`)
    
    allEntries.forEach((entry, index) => {
      const startDate = new Date(entry.start_ts)
      const endDate = entry.end_ts ? new Date(entry.end_ts) : null
      
      console.log(`📝 Entrada ${index + 1}:`, {
        id: entry.id,
        activity: entry.activity,
        start_ts: entry.start_ts,
        end_ts: entry.end_ts,
        startLocal: startDate.toLocaleString('pt-BR'),
        endLocal: endDate ? endDate.toLocaleString('pt-BR') : 'Não finalizada',
        startISO: startDate.toISOString(),
        endISO: endDate ? endDate.toISOString() : null,
        duration_minutes: entry.duration_minutes,
        tags: entry.tags,
        note: entry.note
      })
    })
    
    console.log('📋 FIM DA LISTA DE ENTRADAS')
  }

  // Função para corrigir timestamps existentes (executar uma vez)
  fixTimestamps(): void {
    console.log('🔧 Corrigindo timestamps existentes...')
    
    const entries = this.db.prepare('SELECT * FROM entries WHERE user_id = ?').all(this.userId) as Entry[]
    
    for (const entry of entries) {
      const originalDate = new Date(entry.start_ts)
      const year = originalDate.getFullYear()
      const month = originalDate.getMonth()
      const day = originalDate.getDate()
      
      // Cria uma data local para o mesmo dia, mês e ano
      const localDate = new Date(year, month, day)
      const timezoneOffset = localDate.getTimezoneOffset() * 60000
      
      // Preserva a hora original mas ajusta para o dia correto com timezone
      const hourOfDay = entry.start_ts % (24 * 60 * 60 * 1000)
      const correctedStart = Date.UTC(year, month, day, 0, 0, 0, 0) + timezoneOffset + hourOfDay
      
      let correctedEnd = null
      if (entry.end_ts) {
        const endHourOfDay = entry.end_ts % (24 * 60 * 60 * 1000)
        correctedEnd = Date.UTC(year, month, day, 0, 0, 0, 0) + timezoneOffset + endHourOfDay
      }
      
      console.log('🔧 Corrigindo entrada:', {
        id: entry.id,
        original: new Date(entry.start_ts).toISOString(),
        originalLocal: originalDate.toLocaleString('pt-BR'),
        corrected: new Date(correctedStart).toISOString(),
        correctedLocal: new Date(correctedStart).toLocaleString('pt-BR'),
        timezoneOffset: timezoneOffset / 60000
      })
      
      this.db.prepare('UPDATE entries SET start_ts = ?, end_ts = ? WHERE id = ?')
        .run(correctedStart, correctedEnd, entry.id)
    }
    
    console.log('✅ Timestamps corrigidos!')
  }

  // Métodos para entradas de tempo - TUDO LOCAL, SEM FRESCURA
  startEntry(activity: string, tags?: string, note?: string, durationMinutes?: number): number {
    const now = new Date() // Data local atual
    const startTime = durationMinutes ? new Date(now.getTime() - (durationMinutes * 60 * 1000)) : now
    
    console.log('🚀 Criando entrada LOCAL:', {
      activity,
      durationMinutes,
      startTime: startTime.toLocaleString('pt-BR'),
      now: now.toLocaleString('pt-BR'),
      startTimeISO: startTime.toISOString(),
      nowISO: now.toISOString()
    })
    
    const stmt = this.db.prepare(`
      INSERT INTO entries (user_id, activity, start_ts, tags, note)
      VALUES (?, ?, ?, ?, ?)
    `)
    const result = stmt.run(this.userId, activity, startTime.getTime(), tags || null, note || null)
    return result.lastInsertRowid as number
  }

  pauseEntry(id: number): boolean {
    const entry = this.getEntry(id)
    if (!entry || entry.end_ts) return false

    const pauseIntervals = entry.pause_intervals ? JSON.parse(entry.pause_intervals) : []
    pauseIntervals.push({ start: new Date().getTime() }) // LOCAL

    const stmt = this.db.prepare('UPDATE entries SET pause_intervals = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    stmt.run(JSON.stringify(pauseIntervals), id)
    return true
  }

  resumeEntry(id: number): boolean {
    const entry = this.getEntry(id)
    if (!entry || entry.end_ts) return false

    const pauseIntervals = entry.pause_intervals ? JSON.parse(entry.pause_intervals) : []
    if (pauseIntervals.length === 0 || pauseIntervals[pauseIntervals.length - 1].end) return false

    pauseIntervals[pauseIntervals.length - 1].end = new Date().getTime() // LOCAL

    const stmt = this.db.prepare('UPDATE entries SET pause_intervals = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    stmt.run(JSON.stringify(pauseIntervals), id)
    return true
  }

  stopEntry(id: number): boolean {
    const entry = this.getEntry(id)
    if (!entry || entry.end_ts) return false

    const now = new Date().getTime() // LOCAL
    const pauseIntervals = entry.pause_intervals ? JSON.parse(entry.pause_intervals) : []
    
    // Finaliza pausa ativa se houver
    if (pauseIntervals.length > 0 && !pauseIntervals[pauseIntervals.length - 1].end) {
      pauseIntervals[pauseIntervals.length - 1].end = now
    }

    // Calcula duração total
    const totalPauseTime = pauseIntervals.reduce((total: number, interval: any) => {
      return total + (interval.end - interval.start)
    }, 0)

    const totalDurationMs = now - entry.start_ts - totalPauseTime
    const durationMinutes = Math.max(0, Math.floor(totalDurationMs / 60000))

    console.log('🛑 Parando entrada LOCAL:', {
      id,
      start_ts: entry.start_ts,
      end_ts: now,
      startLocal: new Date(entry.start_ts).toLocaleString('pt-BR'),
      endLocal: new Date(now).toLocaleString('pt-BR'),
      totalDurationMs,
      totalPauseTime,
      durationMinutes,
      pauseIntervals
    })

    const stmt = this.db.prepare(`
      UPDATE entries 
      SET end_ts = ?, pause_intervals = ?, duration_minutes = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `)
    stmt.run(now, JSON.stringify(pauseIntervals), durationMinutes, id)
    return true
  }

  getEntry(id: number): Entry | null {
    const stmt = this.db.prepare('SELECT * FROM entries WHERE id = ? AND user_id = ?')
    return stmt.get(id, this.userId) as Entry | null
  }

  getCurrentEntry(): Entry | null {
    const stmt = this.db.prepare(`
      SELECT * FROM entries 
      WHERE user_id = ? AND end_ts IS NULL 
      ORDER BY start_ts DESC 
      LIMIT 1
    `)
    return stmt.get(this.userId) as Entry | null
  }

  getEntries(date?: string): Entry[] {
    let query = 'SELECT * FROM entries WHERE user_id = ?'
    let params: any[] = [this.userId]

    if (date) {
      // Buscar todas as entradas do usuário
      const allEntries = this.db.prepare('SELECT * FROM entries WHERE user_id = ? ORDER BY start_ts DESC').all(this.userId) as Entry[]
      
      // Filtrar por data local
      const filteredEntries = allEntries.filter(entry => {
        const entryDate = new Date(entry.start_ts)
        const entryDateStr = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}-${String(entryDate.getDate()).padStart(2, '0')}`
        return entryDateStr === date
      })
      
      return filteredEntries
    }

    query += ' ORDER BY start_ts DESC'

    const stmt = this.db.prepare(query)
    const entries = stmt.all(...params) as Entry[]
    
    console.log('Entradas encontradas:', entries.length)
    return entries
  }

  updateEntry(id: number, data: Partial<Entry>): boolean {
    const allowedFields = ['activity', 'tags', 'note']
    const updates: string[] = []
    const values: any[] = []

    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = ?`)
        values.push(value)
      }
    }

    if (updates.length === 0) return false

    updates.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)

    const stmt = this.db.prepare(`UPDATE entries SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`)
    const result = stmt.run(...values, this.userId)
    return result.changes > 0
  }

  deleteEntry(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM entries WHERE id = ? AND user_id = ?')
    const result = stmt.run(id, this.userId)
    return result.changes > 0
  }

  // Métodos para relatórios
  getMonthlyReport(year: number, month: number): any {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59, 999)

    // Busca entradas do mês
    const entriesStmt = this.db.prepare(`
      SELECT * FROM entries 
      WHERE user_id = ? AND start_ts >= ? AND start_ts <= ?
      ORDER BY start_ts ASC
    `)
    const entries = entriesStmt.all(this.userId, startDate.getTime(), endDate.getTime()) as Entry[]

    // Busca dias de folga
    const dayOffsStmt = this.db.prepare(`
      SELECT date FROM day_offs 
      WHERE user_id = ? AND date >= ? AND date <= ?
    `)
    const dayOffs = dayOffsStmt.all(this.userId, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0])

    // Busca férias
    const vacationsStmt = this.db.prepare(`
      SELECT * FROM vacations 
      WHERE user_id = ? AND (
        (start_date <= ? AND end_date >= ?) OR
        (start_date <= ? AND end_date >= ?)
      )
    `)
    const vacations = vacationsStmt.all(
      this.userId,
      startDate.toISOString().split('T')[0],
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    )

    // Calcula totais
    const totalWorkedMinutes = entries.reduce((total, entry) => total + (entry.duration_minutes || 0), 0)
    const totalTargetMinutes = this.calculateMonthlyTarget(year, month, dayOffs, vacations)

    return {
      year,
      month,
      totalWorkedMinutes,
      totalTargetMinutes,
      balanceMinutes: totalWorkedMinutes - totalTargetMinutes,
      entries,
      dayOffs: dayOffs.map((d: any) => d.date),
      vacations,
      dailyBreakdown: this.calculateDailyBreakdown(entries, year, month)
    }
  }

  private calculateMonthlyTarget(year: number, month: number, dayOffs: any[], vacations: any[]): number {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    let totalMinutes = 0

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0]
      const weekday = date.getDay()

      // Verifica se é dia de folga ou férias
      const isDayOff = dayOffs.some(d => d.date === dateStr)
      const isVacation = vacations.some(v => dateStr >= v.start_date && dateStr <= v.end_date)

      if (!isDayOff && !isVacation) {
        const targetStmt = this.db.prepare('SELECT target_minutes FROM daily_targets WHERE user_id = ? AND weekday = ?')
        const target = targetStmt.get(this.userId, weekday) as { target_minutes: number } | null
        if (target) {
          totalMinutes += target.target_minutes
        }
      }
    }

    return totalMinutes
  }

  private calculateDailyBreakdown(entries: Entry[], year: number, month: number): any[] {
    const dailyData: { [key: string]: { worked: number; target: number; entries: Entry[] } } = {}

    // Agrupa entradas por dia
    entries.forEach(entry => {
      const date = new Date(entry.start_ts).toISOString().split('T')[0]
      if (!dailyData[date]) {
        dailyData[date] = { worked: 0, target: 0, entries: [] }
      }
      dailyData[date].worked += entry.duration_minutes || 0
      dailyData[date].entries.push(entry)
    })

    // Adiciona metas para cada dia
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0]
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { worked: 0, target: 0, entries: [] }
      }
      
      const weekday = date.getDay()
      const targetStmt = this.db.prepare('SELECT target_minutes FROM daily_targets WHERE user_id = ? AND weekday = ?')
      const target = targetStmt.get(this.userId, weekday) as { target_minutes: number } | null
      if (target) {
        dailyData[dateStr].target = target.target_minutes
      }
    }

    return Object.entries(dailyData).map(([date, data]) => ({
      date,
      workedMinutes: data.worked,
      targetMinutes: data.target,
      balanceMinutes: data.worked - data.target,
      entries: data.entries
    }))
  }

  // Métodos para configurações
  getSettings(): { [key: string]: string } {
    const stmt = this.db.prepare('SELECT key, value FROM settings')
    const rows = stmt.all() as { key: string; value: string }[]
    return rows.reduce((acc, row) => {
      acc[row.key] = row.value
      return acc
    }, {} as { [key: string]: string })
  }

  updateSettings(settings: { [key: string]: string }): boolean {
    const stmt = this.db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)')
    
    try {
      for (const [key, value] of Object.entries(settings)) {
        stmt.run(key, value)
      }
      return true
    } catch {
      return false
    }
  }

  // Métodos para dias de folga
  setDayOff(date: string): boolean {
    try {
      const stmt = this.db.prepare('INSERT OR IGNORE INTO day_offs (user_id, date) VALUES (?, ?)')
      const result = stmt.run(this.userId, date)
      return result.changes > 0
    } catch {
      return false
    }
  }

  removeDayOff(date: string): boolean {
    const stmt = this.db.prepare('DELETE FROM day_offs WHERE user_id = ? AND date = ?')
    const result = stmt.run(this.userId, date)
    return result.changes > 0
  }

  getDayOffs(year: number, month: number): string[] {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]
    
    const stmt = this.db.prepare('SELECT date FROM day_offs WHERE user_id = ? AND date >= ? AND date <= ?')
    const rows = stmt.all(this.userId, startDate, endDate) as { date: string }[]
    return rows.map(row => row.date)
  }

  // Métodos para férias
  setVacation(startDate: string, endDate: string): boolean {
    try {
      const stmt = this.db.prepare('INSERT INTO vacations (user_id, start_date, end_date) VALUES (?, ?, ?)')
      const result = stmt.run(this.userId, startDate, endDate)
      return result.changes > 0
    } catch {
      return false
    }
  }

  removeVacation(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM vacations WHERE id = ? AND user_id = ?')
    const result = stmt.run(id, this.userId)
    return result.changes > 0
  }

  getVacations(year: number, month: number): Vacation[] {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]
    
    const stmt = this.db.prepare(`
      SELECT * FROM vacations 
      WHERE user_id = ? AND (
        (start_date <= ? AND end_date >= ?) OR
        (start_date <= ? AND end_date >= ?)
      )
    `)
    return stmt.all(this.userId, startDate, startDate, endDate, endDate) as Vacation[]
  }

  // Métodos para export/import
  exportData(format: 'csv' | 'json', year: number, month: number): string {
    const report = this.getMonthlyReport(year, month)
    
    if (format === 'json') {
      return JSON.stringify(report, null, 2)
    } else {
      // CSV format
      const headers = ['Data', 'Atividade', 'Início', 'Fim', 'Duração (min)', 'Tags', 'Nota']
      const rows = report.entries.map((entry: Entry) => [
        new Date(entry.start_ts).toISOString().split('T')[0],
        entry.activity,
        new Date(entry.start_ts).toLocaleTimeString('pt-BR'),
        entry.end_ts ? new Date(entry.end_ts).toLocaleTimeString('pt-BR') : '',
        entry.duration_minutes || 0,
        entry.tags || '',
        entry.note || ''
      ])
      
      return [headers, ...rows].map(row => row.map((cell: any) => `"${cell}"`).join(',')).join('\n')
    }
  }

  // Método para backup
  getDatabasePath(): string {
    return this.db.name
  }

  close(): void {
    this.db.close()
  }
}
