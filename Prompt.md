# Main prompt 

Write a TypeScript program to split multi-paged PDF file(s) into (zipped) single-paged PDF files.

Web interface:

Input: 
- Upload feature: Users can upload single or multiple PDF files. 
- Users can drag/drop PDF files to upload 
Output: 
- Users can download single-paged PDF files in zip format 

PDF splitting process: 

If user uploads a 5-page PDF files, named "input.pdf", then split it into 5 single-paged files, named: 
"input-01.pdf"
"input-02.pdf"
"input-03.pdf"
"input-04.pdf"
"input-05.pdf"
zip 5 PDF files to "pdf-splitted.zip" and allow user to download it. 

if user upload more than 1 files, then split in similar manner and put all single-paged pdf files "pdf-splitted.zip" and allow user to download it.

User interface: 
- Use tailwind css
- Morden UI 
- Simple and clean

File structure / filenames: Help me decide it.

# generate `LICENSE.md` and claim it to be MIT license 

# Add `.gitignore`

# Add disclaimer to this page: "We don't store any data in our server"

# Cypress 

## Setting up Cypress in your Next.js project

## Createing a basic test

- Upload a single PDF file
- Split the PDF into single pages
- Download the ZIP file

## Running Cypress tests

e2e tests:
- Upload multiple PDF files
- Split the PDFs into single pages
- Download the ZIP file

- Testing error handling
- Upload an invalid PDF file
- Check for error messages

- Testing drag-and-drop functionality
- Drag and drop a PDF file
- Check if the file is uploaded successfully

- Testing UI responsiveness
- Resize the browser window
- Check if the UI elements are responsive

## Testing file size validation

- Upload a PDF file larger than 100MB (please help me create a mock file)
- Check for error messages
- Upload a PDF file smaller than 100MB
- Check if the file is uploaded successfully

## Test cross-browser compatibility

- Test the application in different browsers (Chrome, Firefox, Safari)

## Running tests in CI/CD