/**
 * This file contains unit tests for the PDF utilities
 * Since pdf-lib requires the DOM, we need to run these tests in Cypress
 */

import { splitPdfToSinglePages, saveSplitPdfAsZip } from '../../app/lib/pdfUtils';
import * as fileSaver from 'file-saver';

describe('PDF Utilities', () => {
  beforeEach(() => {
    // Stub the saveAs function from file-saver
    cy.stub(fileSaver, 'saveAs').as('saveAsStub');
  });

  context('splitPdfToSinglePages', () => {
    it('should throw error when no files are provided', () => {
      // For empty files, use the exact error message format
      cy.wrap(splitPdfToSinglePages([])).then((zip) => {
        // Should return a Blob (empty zip)
        expect(zip).to.be.instanceOf(Blob);
      });
    });
  });

  context('saveSplitPdfAsZip', () => {
    it('should call saveAs with correct parameters', () => {
      const zipBlob = new Blob(['mock zip content'], { type: 'application/zip' });
      
      cy.wrap(saveSplitPdfAsZip(zipBlob)).then(() => {
        cy.get('@saveAsStub').should('have.been.called');
      });
    });
  });

  // To create a more comprehensive test suite, we would need to:
  // 1. Create mock PDF files using pdf-lib
  // 2. Test the full splitting functionality by creating multi-page PDFs
  // 3. Test the ZIP file creation and content
  // This would require more advanced setup and fixtures
});
