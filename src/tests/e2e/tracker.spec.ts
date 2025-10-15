import { test, expect } from '@playwright/test'

test.describe('WorkTrack E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the main interface', async ({ page }) => {
    await expect(page.getByText('WorkTrack')).toBeVisible()
    await expect(page.getByText('Controle seu banco de horas pessoal')).toBeVisible()
    await expect(page.getByPlaceholderText('Nome da atividade')).toBeVisible()
    await expect(page.getByText('Iniciar')).toBeVisible()
  })

  test('should start tracking when activity name is provided', async ({ page }) => {
    const activityInput = page.getByPlaceholderText('Nome da atividade')
    const startButton = page.getByText('Iniciar')

    await activityInput.fill('Desenvolvimento de funcionalidade')
    await startButton.click()

    // Verifica se o tracking foi iniciado
    await expect(page.getByText('Desenvolvimento de funcionalidade')).toBeVisible()
    await expect(page.getByText('Pausar')).toBeVisible()
    await expect(page.getByText('Parar')).toBeVisible()
  })

  test('should show alert when trying to start without activity name', async ({ page }) => {
    const startButton = page.getByText('Iniciar')
    
    // Mock do alert
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Por favor, digite o nome da atividade')
      await dialog.accept()
    })

    await startButton.click()
  })

  test('should pause and resume tracking', async ({ page }) => {
    // Inicia o tracking
    await page.getByPlaceholderText('Nome da atividade').fill('Teste de pausa')
    await page.getByText('Iniciar').click()

    // Pausa
    await page.getByText('Pausar').click()
    await expect(page.getByText('Retomar')).toBeVisible()
    await expect(page.getByText('Pausado')).toBeVisible()

    // Retoma
    await page.getByText('Retomar').click()
    await expect(page.getByText('Pausar')).toBeVisible()
  })

  test('should stop tracking with confirmation', async ({ page }) => {
    // Inicia o tracking
    await page.getByPlaceholderText('Nome da atividade').fill('Teste de parada')
    await page.getByText('Iniciar').click()

    // Mock do confirm
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Tem certeza que deseja parar o tracking atual?')
      await dialog.accept()
    })

    await page.getByText('Parar').click()

    // Verifica se voltou ao estado inicial
    await expect(page.getByPlaceholderText('Nome da atividade')).toBeVisible()
    await expect(page.getByText('Iniciar')).toBeVisible()
  })

  test('should display calendar', async ({ page }) => {
    await expect(page.getByText('Calendário')).toBeVisible()
    await expect(page.getByText('Legenda:')).toBeVisible()
  })

  test('should display clock', async ({ page }) => {
    const clockElement = page.locator('[data-testid="clock"]').first()
    await expect(clockElement).toBeVisible()
  })

  test('should handle keyboard shortcuts', async ({ page }) => {
    const activityInput = page.getByPlaceholderText('Nome da atividade')
    
    await activityInput.fill('Teste com Enter')
    await activityInput.press('Enter')

    // Verifica se o tracking foi iniciado
    await expect(page.getByText('Teste com Enter')).toBeVisible()
  })
})
