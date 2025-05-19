import PdfUploader from '../../app/components/PdfUploader';

describe('PdfUploader Component', () => {
  beforeEach(() => {
    cy.mount(<PdfUploader />);
  });

  it('should render DragDropArea', () => {
    cy.get('[data-testid="pdf-uploader"]').should('exist');
    cy.get('[data-testid="pdf-uploader"]').contains('Drag and drop PDF files here').should('be.visible');
  });

  it('should handle file upload via drop zone', () => {
    // Create a fake PDF file
    const testFile = new File(['test PDF content'], 'test.pdf', { type: 'application/pdf' });
    
    // Simulate file drop
    cy.get('[data-testid="pdf-uploader"]').first().trigger('drop', {
      dataTransfer: {
        files: [testFile],
        types: ['Files'],
      },
    });

    // Check if file appears in the list
    cy.contains('Selected Files (1)').should('be.visible');
    cy.contains('test.pdf').should('be.visible');
  });

  it('should show error for non-PDF files', () => {
    // Create a fake non-PDF file
    const testFile = new File(['test text content'], 'test.txt', { type: 'text/plain' });
    
    // Simulate file drop
    cy.get('[data-testid="pdf-uploader"]').first().trigger('drop', {
      dataTransfer: {
        files: [testFile],
        types: ['Files'],
      },
    });

    // Process the files to trigger error validation
    cy.contains('Split PDFs').click();
    
    // Check for error message
    cy.contains('is not a valid PDF').should('be.visible');
  });

  it('should show split button when files are uploaded', () => {
    // Create a fake PDF file
    const testFile = new File(['test PDF content'], 'test.pdf', { type: 'application/pdf' });
    
    // Simulate file drop
    cy.get('[data-testid="pdf-uploader"]').first().trigger('drop', {
      dataTransfer: {
        files: [testFile],
        types: ['Files'],
      },
    });

    // Check if Split PDFs button is visible
    cy.contains('button', 'Split PDFs').should('be.visible');
  });

  it('should clear files when clear button is clicked', () => {
    // Create a fake PDF file
    const testFile = new File(['test PDF content'], 'test.pdf', { type: 'application/pdf' });
    
    // Simulate file drop
    cy.get('[data-testid="pdf-uploader"]').first().trigger('drop', {
      dataTransfer: {
        files: [testFile],
        types: ['Files'],
      },
    });

    // Click clear button
    cy.contains('button', 'Clear').click();
    
    // Check if file list is cleared
    cy.contains('Selected Files').should('not.exist');
  });
});
