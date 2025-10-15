import { create } from 'zustand'
import { AppState, AppAction, Entry, Settings, MonthlyReport, TrackerState } from '@/types'

// Adiciona a definição de tipo para window.electronAPI
declare global {
  interface Window {
    electronAPI: {
      startEntry: (activity: string, tags?: string, note?: string, durationMinutes?: number) => Promise<{ success: boolean; id?: number; error?: string }>;
      getCurrentEntry: () => Promise<{ entry?: Entry; error?: string }>;
      pauseEntry: (id: number) => Promise<{ success: boolean; error?: string }>;
      stopEntry: (id: number) => Promise<{ success: boolean; error?: string }>;
      getEntries: (date: string) => Promise<{ entries?: Entry[]; error?: string }>;
      updateEntry: (id: number, data: { activity?: string; tags?: string; note?: string }) => Promise<{ success: boolean; error?: string }>;
      getSettings: () => Promise<{ settings?: Settings; error?: string }>;
      getMonthlyReport: (year: number, month: number) => Promise<{ report?: MonthlyReport; error?: string }>;
    };
  }
}

interface AppStore extends AppState {
  // Actions
  dispatch: (action: AppAction) => void
  startTracking: (activity: string, tags?: string, note?: string, durationMinutes?: number) => Promise<void>
  pauseTracking: () => Promise<void>
  resumeTracking: () => Promise<void>
  stopTracking: () => Promise<void>
  updateTime: () => void
  loadEntries: (date?: string) => Promise<void>
  updateEntry: (id: number, data: { activity?: string; tags?: string; note?: string }) => Promise<{ success: boolean; error?: string }>
  loadSettings: () => Promise<void>
  loadMonthlyReport: (year: number, month: number) => Promise<void>
  setCurrentDate: (date: string) => void
  setSelectedDate: (date: string) => void
}

const initialTrackerState: TrackerState = {
  currentEntry: null,
  isRunning: false,
  isPaused: false,
  currentTime: 0,
  startTime: null,
  pauseTime: null,
}

const initialState: AppState = {
  tracker: initialTrackerState,
  entries: [],
  settings: {},
  currentDate: new Date().toISOString().split('T')[0],
  selectedDate: new Date().toISOString().split('T')[0],
  monthlyReport: null,
  isLoading: false,
  error: null,
}

export const useAppStore = create<AppStore>((set, get) => ({
  ...initialState,

  dispatch: (action: AppAction) => {
    set((state) => {
      switch (action.type) {
        case 'START_TRACKING':
          return {
            ...state,
            tracker: {
              ...state.tracker,
              isRunning: true,
              isPaused: false,
              startTime: Date.now(),
              pauseTime: null,
            },
            isLoading: true,
            error: null,
          }

        case 'PAUSE_TRACKING':
          return {
            ...state,
            tracker: {
              ...state.tracker,
              isPaused: true,
              pauseTime: Date.now(),
            },
          }

        case 'RESUME_TRACKING':
          return {
            ...state,
            tracker: {
              ...state.tracker,
              isPaused: false,
              pauseTime: null,
            },
          }

        case 'STOP_TRACKING':
          return {
            ...state,
            tracker: {
              ...initialTrackerState,
            },
            isLoading: true,
          }

        case 'UPDATE_TIME':
          const { tracker } = state
          if (tracker.isRunning && !tracker.isPaused && tracker.startTime) {
            const now = Date.now()
            const elapsed = now - tracker.startTime
            return {
              ...state,
              tracker: {
                ...tracker,
                currentTime: elapsed,
              },
            }
          }
          return state

        case 'SET_CURRENT_ENTRY':
          return {
            ...state,
            tracker: {
              ...state.tracker,
              currentEntry: action.payload,
              isRunning: !!action.payload,
              isPaused: false,
            },
          }

        case 'SET_LOADING':
          return {
            ...state,
            isLoading: action.payload,
          }

        case 'SET_ERROR':
          return {
            ...state,
            error: action.payload,
            isLoading: false,
          }

        case 'SET_ENTRIES':
          return {
            ...state,
            entries: action.payload,
          }

        case 'SET_SETTINGS':
          return {
            ...state,
            settings: action.payload,
          }

        case 'SET_CURRENT_DATE':
          return {
            ...state,
            currentDate: action.payload,
          }

        case 'SET_SELECTED_DATE':
          return {
            ...state,
            selectedDate: action.payload,
          }

        case 'SET_MONTHLY_REPORT':
          return {
            ...state,
            monthlyReport: action.payload,
          }

        default:
          return state
      }
    })
  },

  startTracking: async (activity: string, tags?: string, note?: string, durationMinutes?: number) => {
    const { dispatch } = get()
    dispatch({ type: 'START_TRACKING', payload: { activity, tags, note } })

    try {
      const result = await window.electronAPI.startEntry(activity, tags, note, durationMinutes)
      if (result.success && result.id) {
        // Busca a entrada criada
        const currentResult = await window.electronAPI.getCurrentEntry()
        if (currentResult.entry) {
          dispatch({ type: 'SET_CURRENT_ENTRY', payload: currentResult.entry })
        }
        dispatch({ type: 'SET_LOADING', payload: false })
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Erro ao iniciar tracking' })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao iniciar tracking' })
    }
  },

  pauseTracking: async () => {
    const { tracker, dispatch } = get()
    if (!tracker.currentEntry?.id) return

    dispatch({ type: 'PAUSE_TRACKING' })

    try {
      const result = await window.electronAPI.pauseEntry(tracker.currentEntry.id)
      if (!result.success) {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Erro ao pausar tracking' })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao pausar tracking' })
    }
  },

  resumeTracking: async () => {
    const { tracker, dispatch } = get()
    if (!tracker.currentEntry?.id) return

    dispatch({ type: 'RESUME_TRACKING' })

    try {
      // Implementar resume no backend se necessário
      // Por enquanto, apenas atualiza o estado local
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao retomar tracking' })
    }
  },

  stopTracking: async () => {
    const { tracker, dispatch } = get()
    if (!tracker.currentEntry?.id) {
      dispatch({ type: 'SET_LOADING', payload: false })
      return
    }

    dispatch({ type: 'STOP_TRACKING' })

    try {
      const result = await window.electronAPI.stopEntry(tracker.currentEntry.id)
      if (result.success) {
        dispatch({ type: 'SET_CURRENT_ENTRY', payload: null })
        dispatch({ type: 'SET_LOADING', payload: false })
        // Recarrega as entradas do dia
        await get().loadEntries()
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Erro ao parar tracking' })
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao parar tracking' })
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  },

  updateTime: () => {
    const { dispatch } = get()
    dispatch({ type: 'UPDATE_TIME' })
  },

  loadEntries: async (date?: string) => {
    const { dispatch, selectedDate } = get()
    const targetDate = date || selectedDate
    console.log('🏪 Store: loadEntries chamado com targetDate:', targetDate)

    try {
      const result = await window.electronAPI.getEntries(targetDate)
      console.log('🏪 Store: Resultado getEntries:', result)
      if (result.entries) {
        dispatch({ type: 'SET_ENTRIES', payload: result.entries })
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Erro ao carregar entradas' })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar entradas' })
    }
  },

  updateEntry: async (id: number, data: { activity?: string; tags?: string; note?: string }) => {
    const { dispatch } = get()
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const result = await window.electronAPI.updateEntry(id, data)
      if (result.success) {
        // Recarrega as entradas para refletir as mudanças
        const { selectedDate } = get()
        const entriesResult = await window.electronAPI.getEntries(selectedDate)
        if (entriesResult.entries) {
          dispatch({ type: 'SET_ENTRIES', payload: entriesResult.entries })
        }
        dispatch({ type: 'SET_LOADING', payload: false })
        return { success: true }
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Erro ao atualizar entrada' })
        return { success: false, error: result.error }
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar entrada' })
      return { success: false, error: 'Erro ao atualizar entrada' }
    }
  },

  loadSettings: async () => {
    const { dispatch } = get()

    try {
      const result = await window.electronAPI.getSettings()
      if (result.settings) {
        dispatch({ type: 'SET_SETTINGS', payload: result.settings })
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Erro ao carregar configurações' })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar configurações' })
    }
  },

  loadMonthlyReport: async (year: number, month: number) => {
    const { dispatch } = get()

    try {
      console.log(`🏪 Store: loadMonthlyReport chamado para ${month}/${year}`)
      
      // Verifica se a API do Electron está disponível
      if (!window.electronAPI) {
        console.error('❌ Store: window.electronAPI não está disponível')
        dispatch({ type: 'SET_ERROR', payload: 'API do Electron não está disponível' })
        return
      }

      console.log(`🏪 Store: Chamando window.electronAPI.getMonthlyReport(${year}, ${month})`)
      const result = await window.electronAPI.getMonthlyReport(year, month)
      
      console.log(`🏪 Store: Resultado recebido:`, result)
      
      if (result.report) {
        console.log(`🏪 Store: Relatório carregado com sucesso`)
        dispatch({ type: 'SET_MONTHLY_REPORT', payload: result.report })
      } else {
        console.error(`🏪 Store: Erro no relatório:`, result.error)
        dispatch({ type: 'SET_ERROR', payload: result.error || 'Erro ao carregar relatório' })
      }
    } catch (error) {
      console.error(`🏪 Store: Erro ao carregar relatório:`, error)
      dispatch({ type: 'SET_ERROR', payload: `Erro ao carregar relatório: ${error instanceof Error ? error.message : 'Erro desconhecido'}` })
    }
  },

  setCurrentDate: (date: string) => {
    const { dispatch } = get()
    dispatch({ type: 'SET_CURRENT_DATE', payload: date })
  },

  setSelectedDate: (date: string) => {
    const { dispatch, loadEntries } = get()
    console.log('🏪 Store: setSelectedDate chamado com:', date)
    dispatch({ type: 'SET_SELECTED_DATE', payload: date })
    loadEntries(date)
  },
}))
