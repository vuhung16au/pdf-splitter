import { test, expect, Page } from '@playwright/test';

test.describe('Browser Compatibility Tests - Safari', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('/');
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should display main UI elements properly', async ({ page }: { page: Page }) => {
    // Header content should be visible
    await expect(page.locator('header h1')).toBeVisible();
    await expect(page.locator('header h1')).toContainText('PDF Splitter');
    await expect(page.locator('header p')).toBeVisible();
    
    // PDF uploader should be visible and styled correctly
    const uploader = page.locator('[data-testid="pdf-uploader"]');
    await expect(uploader).toBeVisible();
    
    // How it works section should be visible
    await expect(page.locator('h3:has-text("How it works")')).toBeVisible();
    await expect(page.locator('ol > li')).toHaveCount(4);
  });

  test('should handle file upload correctly', async ({ page }: { page: Page }) => {
    // Create a more realistic PDF file content
    const pdfContent = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34, 0x0A]); // %PDF-1.4 header
    
    // Upload a test PDF file using the file input directly
    const fileInput = page.locator('[data-testid="dragdrop-area"] input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from(pdfContent)
    });

    // Wait for the file to be processed and UI to update
    try {
      await page.waitForSelector('[data-testid="selected-files-title"]', { state: 'visible', timeout: 20000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/single-file-wait-fail.png', fullPage: true });
      console.error('selected-files-title not found. Page content:', await page.content());
      throw e;
    }

    // Verify file appears in the list
    await expect(page.locator('[data-testid="selected-files-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="selected-file-name"]')).toContainText('test.pdf');

    // Use Clear button to remove file
    await page.locator('[data-testid="clear-button"]').click();
    await expect(page.locator('[data-testid="selected-files-title"]')).not.toBeVisible();
  });

  test('should allow file removal', async ({ page }: { page: Page }) => {
    // Create a more realistic PDF file content
    const pdfContent = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34, 0x0A]); // %PDF-1.4 header
    
    // Upload a file first using the file input directly
    const fileInput = page.locator('[data-testid="dragdrop-area"] input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from(pdfContent)
    });

    // Wait for the file to be processed and UI to update
    try {
      await page.waitForSelector('[data-testid="selected-files-title"]', { state: 'visible', timeout: 20000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/file-removal-wait-fail.png', fullPage: true });
      console.error('selected-files-title not found. Page content:', await page.content());
      throw e;
    }

    // Verify file appears in the list
    await expect(page.locator('[data-testid="selected-files-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="selected-file-name"]')).toContainText('test.pdf');

    // Use Remove button to remove file
    await page.locator('[data-testid="selected-file-item"] button:has-text("Remove")').click();
    await expect(page.locator('[data-testid="selected-files-title"]')).not.toBeVisible();
  });

  test('should handle multiple file uploads', async ({ page }: { page: Page }) => {
    // Create more realistic PDF file content
    const pdfContent1 = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34, 0x0A]); // %PDF-1.4 header
    const pdfContent2 = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34, 0x0A]); // %PDF-1.4 header
    
    // Upload multiple files using the file input directly
    const fileInput = page.locator('[data-testid="dragdrop-area"] input[type="file"]');
    await fileInput.setInputFiles([
      {
        name: 'test1.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from(pdfContent1)
      },
      {
        name: 'test2.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from(pdfContent2)
      }
    ]);

    // Wait for the files to be processed and UI to update
    try {
      await page.waitForSelector('[data-testid="selected-files-title"]', { state: 'visible', timeout: 20000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/multiple-files-wait-fail.png', fullPage: true });
      console.error('selected-files-title not found. Page content:', await page.content());
      throw e;
    }

    // Verify both files appear in the list
    await expect(page.locator('[data-testid="selected-files-title"]')).toBeVisible();
    await expect(page.locator('text=test1.pdf')).toBeVisible();
    await expect(page.locator('text=test2.pdf')).toBeVisible();

    // Remove first file using Remove button
    await page.locator('text=test1.pdf').locator('..').locator('button:has-text("Remove")').click();
    await expect(page.locator('text=test1.pdf')).not.toBeVisible();
    await expect(page.locator('text=test2.pdf')).toBeVisible();

    // Use Clear button to remove all
    await page.locator('[data-testid="clear-button"]').click();
    await expect(page.locator('text=test2.pdf')).not.toBeVisible();
  });

  test('should maintain interactive elements functionality', async ({ page }: { page: Page }) => {
    // Check that the file input is functional
    const fileInput = page.locator('[data-testid="dragdrop-area"] input[type="file"]');
    await expect(fileInput).toHaveAttribute('accept', 'application/pdf');
    
    // Verify visible text and interactive elements
    await expect(page.locator('text=click to select PDF files')).toBeVisible();
    await expect(page.locator('[data-testid="dragdrop-area"]')).toBeVisible();
  });

  test('should properly handle flexbox layout in Safari', async ({ page }: { page: Page }) => {
    // Check responsive layout
    await page.setViewportSize({ width: 768, height: 1024 }); // Tablet size
    await page.waitForTimeout(200); // Give time for responsive adjustments
    await expect(page.locator('header h1')).toBeVisible();
    await expect(page.locator('[data-testid="pdf-uploader"]')).toBeVisible();
  });

  test('should process file uploads correctly in Safari', async ({ page }: { page: Page }) => {
    // Create a more realistic PDF file content
    const pdfContent = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34, 0x0A]); // %PDF-1.4 header
    
    // Upload a test file using the file input directly
    const fileInput = page.locator('[data-testid="dragdrop-area"] input[type="file"]');
    await fileInput.setInputFiles({
      name: 'safari-test.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from(pdfContent)
    });
    
    // Wait for the file to be processed and UI to update
    try {
      await page.waitForSelector('[data-testid="selected-files-title"]', { state: 'visible', timeout: 20000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/safari-process-upload-wait-fail.png', fullPage: true });
      console.error('selected-files-title not found. Page content:', await page.content());
      throw e;
    }
    
    // Verify file appears in the list
    await expect(page.locator('[data-testid="selected-files-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="selected-file-name"]')).toContainText('safari-test.pdf');
  });
});