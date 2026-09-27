import { Page, Locator, expect } from '@playwright/test';

export class NavDrawerPage {
  readonly page: Page;
  readonly drawer: Locator;
  readonly secondaryDrawer: Locator;
  readonly secondaryScrim: Locator;
  readonly settingsTrigger: Locator;
  readonly documentationTrigger: Locator;
  readonly secondaryCloseBtn: Locator;
  readonly pipelinesTrigger: Locator;
  readonly themeToggleBtn: Locator;
  readonly versionItemBtn: Locator;
  readonly versionDialog: Locator;
  readonly versionDialogCloseBtn: Locator;
  readonly primaryOpenBtn: Locator;
  readonly primaryCloseBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.drawer = page.locator('.v-navigation-drawer');
    this.secondaryDrawer = page.getByTestId('secondary-navigation');
    this.secondaryScrim = page.getByTestId('secondary-navigation-scrim');
    this.settingsTrigger = page.getByTestId('settings-navigation-trigger');
    this.documentationTrigger = page.getByTestId('documentation-navigation-trigger');
    this.secondaryCloseBtn = page.getByTestId('secondary-navigation-close');
    this.pipelinesTrigger = page.getByTestId('pipelines-navigation-trigger');
    this.themeToggleBtn = this.drawer.locator('.v-list-item').filter({
      has: page.locator('.mdi-theme-light-dark'),
    });
    this.versionItemBtn = this.drawer.locator('.mdi-star').first();
    this.versionDialog = page.locator('.v-dialog');
    this.versionDialogCloseBtn = this.versionDialog.getByRole('button', { name: /ok|close/i });
    this.primaryOpenBtn = page.getByTestId('primary-navigation-open');
    this.primaryCloseBtn = page.getByTestId('primary-navigation-close');
  }

  async navigateTo(href: string) {
    const link = this.drawer.locator(`a[href="${href}"]`);
    await expect(link).toBeVisible({ timeout: 7000 });
    await link.click();
    await this.page.waitForURL(`**${href}`, { timeout: 10000 });
  }

  async toggleTheme() {
    await expect(this.themeToggleBtn).toBeVisible();
    await this.themeToggleBtn.click();
    // Breve pausa para permitir la transición de tema en Vuetify
    await this.page.waitForTimeout(400);
  }

  async openSettingsNavigation() {
    await this.settingsTrigger.scrollIntoViewIfNeeded();
    await this.settingsTrigger.click();
    await expect(this.secondaryDrawer).toBeVisible();
  }

  async openPipelinesNavigation() {
    await this.pipelinesTrigger.scrollIntoViewIfNeeded();
    await this.pipelinesTrigger.click();
    await expect(this.secondaryDrawer).toBeVisible();
  }

  async openDocumentationNavigation() {
    await this.documentationTrigger.scrollIntoViewIfNeeded();
    await this.documentationTrigger.click();
    await expect(this.secondaryDrawer).toBeVisible();
  }

  async closeSecondaryNavigation() {
    await this.secondaryCloseBtn.click();
    await expect(this.secondaryDrawer).not.toBeVisible();
  }

  secondaryItem(href: string) {
    return this.secondaryDrawer.locator(`[href="${href}"]`);
  }

  async openPrimaryNavigation() {
    await expect(this.primaryOpenBtn).toBeVisible();
    await this.primaryOpenBtn.click();
    await expect(this.drawer).toHaveClass(/v-navigation-drawer--active/);
    await expect.poll(async () => (await this.drawer.boundingBox())?.x).toBe(0);
  }

  async closePrimaryNavigation() {
    await expect(this.primaryCloseBtn).toBeVisible();
    await this.primaryCloseBtn.click();
    await expect(this.drawer).not.toHaveClass(/v-navigation-drawer--active/);
  }

  async getCurrentTheme(): Promise<'light' | 'dark'> {
    const app = this.page.locator('.v-application').first();
    const classAttr = (await app.getAttribute('class')) || '';
    if (classAttr.includes('v-theme--dark')) return 'dark';
    return 'light';
  }

  async openVersionDialog() {
    await this.versionItemBtn.scrollIntoViewIfNeeded();
    await expect(this.versionItemBtn).toBeVisible({ timeout: 7000 });
    await this.versionItemBtn.click();
    await expect(this.versionDialog).toBeVisible({ timeout: 7000 });
  }

  async closeVersionDialog() {
    if (await this.versionDialogCloseBtn.isVisible()) {
      await this.versionDialogCloseBtn.click();
    } else {
      await this.page.keyboard.press('Escape');
    }
    await expect(this.versionDialog).not.toBeVisible({ timeout: 5000 });
  }
}
