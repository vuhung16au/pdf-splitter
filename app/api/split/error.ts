import { NextResponse } from 'next/server';

/**
 * API Error Handler
 * This handles errors for the PDF splitting route
 */
export function GET(req: Request) {
  return NextResponse.json(
    { error: 'An error occurred with the PDF splitting service' },
    { status: 500 }
  );
}

export function POST(req: Request) {
  return NextResponse.json(
    { error: 'An error occurred while processing the PDF files' },
    { status: 500 }
  );
}
