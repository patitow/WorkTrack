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
  [key: string]: string
}

export interface MonthlyReport {
  year: number
  month: number
  totalWorkedMinutes: number
  totalTargetMinutes: number
  balanceMinutes: number
  entries: Entry[]
  dayOffs: string[]
  vacations: Vacation[]
  dailyBreakdown: DailyBreakdown[]
}

export interface DailyBreakdown {
  date: string
  workedMinutes: number
  targetMinutes: number
  balanceMinutes: number
  entries: Entry[]
}

export interface TrackerState {
  currentEntry: Entry | null
  isRunning: boolean
  isPaused: boolean
  currentTime: number
  startTime: number | null
  pauseTime: number | null
}

export interface AppState {
  tracker: TrackerState
  entries: Entry[]
  settings: Settings
  currentDate: string
  selectedDate: string
  monthlyReport: MonthlyReport | null
  isLoading: boolean
  error: string | null
}

export type TrackerAction = 
  | { type: 'START_TRACKING'; payload: { activity: string; tags?: string; note?: string } }
  | { type: 'PAUSE_TRACKING' }
  | { type: 'RESUME_TRACKING' }
  | { type: 'STOP_TRACKING' }
  | { type: 'UPDATE_TIME' }
  | { type: 'SET_CURRENT_ENTRY'; payload: Entry | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

export type AppAction = 
  | TrackerAction
  | { type: 'SET_ENTRIES'; payload: Entry[] }
  | { type: 'SET_SETTINGS'; payload: Settings }
  | { type: 'SET_CURRENT_DATE'; payload: string }
  | { type: 'SET_SELECTED_DATE'; payload: string }
  | { type: 'SET_MONTHLY_REPORT'; payload: MonthlyReport | null }
