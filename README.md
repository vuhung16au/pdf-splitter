# PDF Splitter

A web application that splits multi-paged PDF files into single-paged PDF files and packages them as a ZIP archive for download.

## Features

- Upload single or multiple PDF files via drag-and-drop or file picker
- Split multi-page PDFs into single-page PDF files
- Package the split files into a ZIP archive
- Download the ZIP file automatically
- File size validation (max 100MB per file)
- Modern UI with Tailwind CSS
- Responsive design for both desktop and mobile
- Dark mode support
- **Robust error handling** with graceful degradation
- **Custom error boundaries** to prevent application crashes
- **Detailed error messages** for user guidance
- **Fallback UI** for various error scenarios

## File Structure

- `page.tsx` - Main page with the UI layout
- `PdfUploader.tsx` - Component for handling file uploads and processing
- `DragDropArea.tsx` - Component for drag and drop functionality
- `pdfUtils.ts` - Utility functions for PDF splitting using pdf-lib
- `ErrorBoundary.tsx` - Custom component for catching and handling UI errors
- `error.tsx` - Global error handler for Next.js application
- `not-found.tsx` - Custom 404 page for handling non-existent routes

## Libraries Used

- **pdf-lib**: For PDF manipulation
- **file-saver**: For downloading the generated files
- **jszip**: For creating ZIP archives
- **next.js & react**: For the application framework
- **tailwindcss**: For styling

## Usage

1. Upload one or more PDF files by dragging them into the upload area or clicking to browse (max file size: 100MB per file)
2. Click "Split PDFs" to process your files
3. Each page of your PDFs will be extracted as a separate PDF file with the naming format "originalname-XX.pdf"
4. The ZIP file "pdf-splitted.zip" containing all individual PDFs will be downloaded automatically

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Installation

```bash
# Clone the repository
git clone https://github.com/vuhung16au/pdf-splitter.git
cd pdf-splitter

# Install dependencies
npm install
# or
yarn install

# Run the development server
npm run dev
```

## Technologies

- Next.js 15.3.2
- React 19
- TypeScript
- Tailwind CSS 4
- pdf-lib 1.17.1
- JSZip 3.10.1
- File Saver 2.0.5

## Error Handling

The application implements comprehensive error handling to ensure a smooth user experience:

- **React Error Boundaries**: Catch errors in the component tree and prevent the entire app from crashing
- **Graceful PDF Processing**: Handles corrupted or invalid PDFs with detailed error messages
- **File Validation**: Checks file types, sizes, and content before processing
- **Visual Feedback**: Provides clear error states in the UI for immediate user feedback
- **API Error Handling**: Proper error responses for API routes with appropriate HTTP status codes
- **Global Error Handling**: App-wide error handling for uncaught exceptions
- **Custom 404 Page**: User-friendly page for non-existent routes

## Deployment

The application has been deployed on Vercel and is available at: [https://pdf-splitter-eta.vercel.app/](https://pdf-splitter-eta.vercel.app/)

If you want to deploy your own instance, the easiest way is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Security

- All PDF processing happens client-side in the browser
- No data is sent to any server
- Files are never stored on the server
- File size limit (100MB) prevents browser performance issues

## Testing

The application has a comprehensive test suite using Cypress for both component and end-to-end tests:

- **Component Tests**: Test individual React components in isolation
- **End-to-End Tests**: Test the full application from a user perspective
- **PDF Utilities Tests**: Unit tests for the PDF processing functions

To run tests:

```bash
# Run all tests
npm test

# Run only component tests
npm run test:component

# Run only E2E tests (recommended)
npm run test:e2e

# Run browser-specific tests
npm run test:chrome
npm run test:firefox
npm run test:safari
npm run test:browsers  # Run tests in all browsers

# Run UI responsiveness tests
npm run cypress run --spec "cypress/e2e/responsive-ui.cy.ts"

# Run browser compatibility tests
npm run cypress run --spec "cypress/e2e/browser-compatibility.cy.ts"

# Open Cypress UI for interactive testing
npm run cypress
```

**Note:** For continuous integration or deployment workflows, we recommend using the E2E tests (`npm run test:e2e`), which are more stable and better represent real user experiences. The responsive UI and browser compatibility tests ensure that the application works well across different device sizes and browsers.

See [cypress/README.md](cypress/README.md) for detailed testing documentation.
