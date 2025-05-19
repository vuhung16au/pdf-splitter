import DragDropArea from '../../app/components/DragDropArea';

describe('DragDropArea Component', () => {
  // Define stub outside to make it accessible in all test cases
  let onFilesDropSpy: any;
  
  beforeEach(() => {
    // Create a stub for onFilesDrop
    onFilesDropSpy = cy.stub().as('onFilesDropSpy');
    
    cy.mount(
      <DragDropArea 
        onFilesDrop={onFilesDropSpy}
        isLoading={false} 
      />
    );
  });

  it('should render drag and drop area', () => {
    cy.contains('Drag and drop PDF files here').should('be.visible');
    cy.contains('or click to select PDF files').should('be.visible');
  });

  it('should change styling on drag over', () => {
    // Need to target the specific drag drop area div that has onDragEnter handler
    cy.get('div').contains('Drag and drop PDF files here').parent().parent()
      .trigger('dragenter')
      .should('have.class', 'border-blue-500');
  });

  it('should handle file drops with PDF files', () => {
    // Create a fake PDF file
    const testFile = new File(['test PDF content'], 'test.pdf', { type: 'application/pdf' });
    
    // Simulate file drop
    cy.get('div').first().trigger('drop', {
      dataTransfer: {
        files: [testFile],
        types: ['Files'],
      },
    });

    // Check if onFilesDrop was called with the correct file
    cy.get('@onFilesDropSpy').should('have.been.calledOnce');
  });

  it('should show error for non-PDF files', () => {
    // Create a fake non-PDF file
    const testFile = new File(['test text content'], 'test.txt', { type: 'text/plain' });
    
    // Simulate file drop
    cy.get('div').first().trigger('drop', {
      dataTransfer: {
        files: [testFile],
        types: ['Files'],
      },
    });

    // Check for error message
    cy.contains('Please select PDF files only').should('be.visible');
  });

  it('should be disabled when loading', () => {
    // Remount with loading state
    cy.mount(
      <DragDropArea 
        onFilesDrop={onFilesDropSpy} 
        isLoading={true} 
      />
    );

    // Check if it shows processing state
    cy.contains('Processing...').should('be.visible');
    cy.contains('Please wait while we split your PDFs').should('be.visible');
    cy.get('div').first().should('have.class', 'opacity-70');
    cy.get('div').first().should('have.class', 'cursor-not-allowed');
  });

  it('should open file dialog when clicked', () => {
    const inputSpy = cy.spy(HTMLInputElement.prototype, 'click').as('inputSpy');
    cy.get('div').first().click();
    cy.get('@inputSpy').should('have.been.called');
  });
});
