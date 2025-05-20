import PdfUploader from '../../app/components/PdfUploader';

describe('PdfUploader Component', () => {
  beforeEach(() => {
    // Stub FileReader to simulate PDF and non-PDF detection
    cy.window().then((win) => {
      cy.stub(win, 'FileReader').callsFake(function (this: any) {
        this.readAsArrayBuffer = (file: File) => {
          if (file.type === 'application/pdf') {
            // Simulate PDF magic number: 0x25 0x50 0x44 0x46 ("%PDF")
            const arr = new Uint8Array([0x25, 0x50, 0x44, 0x46]);
            this.result = arr.buffer;
            if (this.onload) {
              this.onload({ target: this });
            }
          } else {
            // Not a PDF
            const arr = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
            this.result = arr.buffer;
            if (this.onload) {
              this.onload({ target: this });
            }
          }
        };
      });
    });
    cy.mount(<PdfUploader />);
  });

  it('should render DragDropArea', () => {
    cy.get('[data-testid="pdf-uploader"]').should('exist');
    cy.contains('Drag and drop PDF files here').should('be.visible');
  });

  it('should handle file upload via drop zone', () => {
    const testFile = new File(['test PDF content'], 'test.pdf', { type: 'application/pdf' });
    cy.get('[data-testid="pdf-uploader"]').trigger('drop', {
      dataTransfer: {
        files: [testFile],
        types: ['Files'],
      },
    });
    cy.contains('test.pdf').should('be.visible');
    cy.contains(/\d+\.\d+ KB/).should('be.visible');
  });

  it('should show split and clear buttons when files are uploaded', () => {
    const testFile = new File(['test PDF content'], 'test.pdf', { type: 'application/pdf' });
    cy.get('[data-testid="pdf-uploader"]').trigger('drop', {
      dataTransfer: {
        files: [testFile],
        types: ['Files'],
      },
    });
    cy.contains('button', 'Split PDFs').should('be.visible');
    cy.contains('button', 'Clear').click();
  });

  it('should remove a file when Remove button is clicked', () => {
    const testFile = new File(['test PDF content'], 'test.pdf', { type: 'application/pdf' });
    cy.get('[data-testid="pdf-uploader"]').trigger('drop', {
      dataTransfer: {
        files: [testFile],
        types: ['Files'],
      },
    });
    cy.contains('button', 'Remove').click();
    cy.contains('test.pdf').should('not.exist');
  });

  it('should clear files when Clear button is clicked', () => {
    const testFile1 = new File(['test PDF content'], 'test1.pdf', { type: 'application/pdf' });
    const testFile2 = new File(['test PDF content'], 'test2.pdf', { type: 'application/pdf' });
    cy.get('[data-testid="pdf-uploader"]').trigger('drop', {
      dataTransfer: {
        files: [testFile1, testFile2],
        types: ['Files'],
      },
    });
    cy.contains('button', 'Clear').click();
    cy.contains('test1.pdf').should('not.exist');
    cy.contains('test2.pdf').should('not.exist');
  });
});
