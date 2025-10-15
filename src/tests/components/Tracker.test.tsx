import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Tracker } from '@/components/Tracker'
import { useAppStore } from '@/stores/useAppStore'

// Mock do store
jest.mock('@/stores/useAppStore')

const mockUseAppStore = useAppStore as jest.MockedFunction<typeof useAppStore>

describe('Tracker Component', () => {
  const mockStartTracking = jest.fn()
  const mockPauseTracking = jest.fn()
  const mockResumeTracking = jest.fn()
  const mockStopTracking = jest.fn()
  const mockUpdateTime = jest.fn()

  const defaultTrackerState = {
    currentEntry: null,
    isRunning: false,
    isPaused: false,
    currentTime: 0,
    startTime: null,
    pauseTime: null,
  }

  beforeEach(() => {
    mockUseAppStore.mockReturnValue({
      tracker: defaultTrackerState,
      startTracking: mockStartTracking,
      pauseTracking: mockPauseTracking,
      resumeTracking: mockResumeTracking,
      stopTracking: mockStopTracking,
      updateTime: mockUpdateTime,
    } as any)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders start form when not running', () => {
    render(<Tracker />)
    
    expect(screen.getByPlaceholderText('Nome da atividade')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Tags (opcional)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Nota (opcional)')).toBeInTheDocument()
    expect(screen.getByText('Iniciar')).toBeInTheDocument()
  })

  it('shows current entry when running', () => {
    const currentEntry = {
      id: 1,
      user_id: 1,
      activity: 'Desenvolvimento',
      start_ts: Date.now(),
    }

    mockUseAppStore.mockReturnValue({
      tracker: {
        ...defaultTrackerState,
        currentEntry,
        isRunning: true,
      },
      startTracking: mockStartTracking,
      pauseTracking: mockPauseTracking,
      resumeTracking: mockResumeTracking,
      stopTracking: mockStopTracking,
      updateTime: mockUpdateTime,
    } as any)

    render(<Tracker />)
    
    expect(screen.getByText('Desenvolvimento')).toBeInTheDocument()
    expect(screen.getByText('Pausar')).toBeInTheDocument()
    expect(screen.getByText('Parar')).toBeInTheDocument()
  })

  it('calls startTracking when start button is clicked', async () => {
    render(<Tracker />)
    
    const activityInput = screen.getByPlaceholderText('Nome da atividade')
    const startButton = screen.getByText('Iniciar')

    fireEvent.change(activityInput, { target: { value: 'Test Activity' } })
    fireEvent.click(startButton)

    await waitFor(() => {
      expect(mockStartTracking).toHaveBeenCalledWith('Test Activity', undefined, undefined)
    })
  })

  it('shows alert when trying to start without activity name', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    
    render(<Tracker />)
    
    const startButton = screen.getByText('Iniciar')
    fireEvent.click(startButton)

    expect(alertSpy).toHaveBeenCalledWith('Por favor, digite o nome da atividade')
    
    alertSpy.mockRestore()
  })

  it('calls pauseTracking when pause button is clicked', async () => {
    const currentEntry = {
      id: 1,
      user_id: 1,
      activity: 'Desenvolvimento',
      start_ts: Date.now(),
    }

    mockUseAppStore.mockReturnValue({
      tracker: {
        ...defaultTrackerState,
        currentEntry,
        isRunning: true,
      },
      startTracking: mockStartTracking,
      pauseTracking: mockPauseTracking,
      resumeTracking: mockResumeTracking,
      stopTracking: mockStopTracking,
      updateTime: mockUpdateTime,
    } as any)

    render(<Tracker />)
    
    const pauseButton = screen.getByText('Pausar')
    fireEvent.click(pauseButton)

    await waitFor(() => {
      expect(mockPauseTracking).toHaveBeenCalled()
    })
  })

  it('shows resume button when paused', () => {
    const currentEntry = {
      id: 1,
      user_id: 1,
      activity: 'Desenvolvimento',
      start_ts: Date.now(),
    }

    mockUseAppStore.mockReturnValue({
      tracker: {
        ...defaultTrackerState,
        currentEntry,
        isRunning: true,
        isPaused: true,
      },
      startTracking: mockStartTracking,
      pauseTracking: mockPauseTracking,
      resumeTracking: mockResumeTracking,
      stopTracking: mockStopTracking,
      updateTime: mockUpdateTime,
    } as any)

    render(<Tracker />)
    
    expect(screen.getByText('Retomar')).toBeInTheDocument()
    expect(screen.getByText('Pausado')).toBeInTheDocument()
  })

  it('calls stopTracking when stop button is clicked', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true)
    const currentEntry = {
      id: 1,
      user_id: 1,
      activity: 'Desenvolvimento',
      start_ts: Date.now(),
    }

    mockUseAppStore.mockReturnValue({
      tracker: {
        ...defaultTrackerState,
        currentEntry,
        isRunning: true,
      },
      startTracking: mockStartTracking,
      pauseTracking: mockPauseTracking,
      resumeTracking: mockResumeTracking,
      stopTracking: mockStopTracking,
      updateTime: mockUpdateTime,
    } as any)

    render(<Tracker />)
    
    const stopButton = screen.getByText('Parar')
    fireEvent.click(stopButton)

    await waitFor(() => {
      expect(mockStopTracking).toHaveBeenCalled()
    })
    
    confirmSpy.mockRestore()
  })

  it('does not call stopTracking when confirmation is cancelled', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false)
    const currentEntry = {
      id: 1,
      user_id: 1,
      activity: 'Desenvolvimento',
      start_ts: Date.now(),
    }

    mockUseAppStore.mockReturnValue({
      tracker: {
        ...defaultTrackerState,
        currentEntry,
        isRunning: true,
      },
      startTracking: mockStartTracking,
      pauseTracking: mockPauseTracking,
      resumeTracking: mockResumeTracking,
      stopTracking: mockStopTracking,
      updateTime: mockUpdateTime,
    } as any)

    render(<Tracker />)
    
    const stopButton = screen.getByText('Parar')
    fireEvent.click(stopButton)

    await waitFor(() => {
      expect(mockStopTracking).not.toHaveBeenCalled()
    })
    
    confirmSpy.mockRestore()
  })
})
