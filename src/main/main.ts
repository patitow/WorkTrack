import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { Database } from './database'
import { IpcHandlers } from './ipc-handlers'

class WorkTrackApp {
  private mainWindow: BrowserWindow | null = null
  private database: Database
  private ipcHandlers: IpcHandlers

  constructor() {
    this.database = new Database()
    this.ipcHandlers = new IpcHandlers(this.database)
    this.setupApp()
  }

  private setupApp(): void {
    // Desabilita aceleração de hardware para evitar erros de GPU
    app.disableHardwareAcceleration()
    
    app.whenReady().then(() => {
      this.createWindow()
      this.setupIpc()
      this.setupAppEvents()
    })

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow()
      }
    })
  }

  private createWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      icon: join(__dirname, '../assets/icon.png'),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: join(__dirname, 'preload.js'),
        webSecurity: true,
        allowRunningInsecureContent: false,
        experimentalFeatures: false,
      },
      titleBarStyle: 'default',
      show: false,
    })

    // Carrega o app React em desenvolvimento ou build
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:3000')
      this.mainWindow.webContents.openDevTools()
    } else {
      this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show()
    })

    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    })
  }

  private setupIpc(): void {
    this.ipcHandlers.registerHandlers()
  }

  private setupAppEvents(): void {
    // Configurações de segurança e eventos globais
    app.on('web-contents-created', (_, contents) => {
      contents.setWindowOpenHandler(() => {
        return { action: 'deny' }
      })
    })
  }
}

// Inicializa a aplicação
new WorkTrackApp()
