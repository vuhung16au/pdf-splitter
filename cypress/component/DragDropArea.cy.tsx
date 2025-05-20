import DragDropArea from '../../app/components/DragDropArea';

describe('DragDropArea Component', () => {
  let onFilesDropSpy: any;

  beforeEach(() => {
    onFilesDropSpy = cy.stub().as('onFilesDropSpy');
    cy.mount(
      <DragDropArea 
        onFilesDrop={onFilesDropSpy}
        isLoading={false} 
      />
    );
  });

  it('should render drag and drop area', () => {
    cy.get('[data-testid="dragdrop-area"]').should('exist');
    cy.contains('Drag and drop PDF files here').should('be.visible');
    cy.contains('or click to select PDF files').should('be.visible');
  });

  it('should change styling on drag over', () => {
    cy.get('[data-testid="dragdrop-area"]')
      .trigger('dragenter')
      .should('have.class', 'border-blue-500')
      .and('have.class', 'bg-blue-100');
  });

  it('should handle file drops with PDF files', () => {
    const testFile = new File(['test PDF content'], 'test.pdf', { type: 'application/pdf' });
    cy.get('[data-testid="dragdrop-area"]').trigger('drop', {
      dataTransfer: {
        files: [testFile],
        types: ['Files'],
      },
    });
    cy.get('@onFilesDropSpy').should('have.been.calledOnce');
  });

  it('should show error if some files are not PDFs', () => {
    const pdfFile = new File(['test PDF content'], 'test.pdf', { type: 'application/pdf' });
    const txtFile = new File(['test text content'], 'test.txt', { type: 'text/plain' });
    cy.get('[data-testid="dragdrop-area"]').trigger('drop', {
      dataTransfer: {
        files: [pdfFile, txtFile],
        types: ['Files'],
      },
    });
    cy.contains('Some files were not PDFs and were ignored').should('be.visible');
  });

  it('should be disabled when loading', () => {
    cy.mount(
      <DragDropArea 
        onFilesDrop={onFilesDropSpy} 
        isLoading={true} 
      />
    );
    cy.get('[data-testid="dragdrop-area"]').should('have.class', 'opacity-50').and('have.class', 'cursor-not-allowed');
    cy.contains('Processing...').should('be.visible');
  });

  it('should open file dialog when clicking the span', () => {
    const inputSpy = cy.spy(HTMLInputElement.prototype, 'click').as('inputSpy');
    cy.get('[data-testid="dragdrop-area"] span').contains('click to select PDF files').click();
    cy.get('@inputSpy').should('have.been.called');
  });
});
