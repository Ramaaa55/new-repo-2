import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import { FileProcessingResult } from '../types';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(' ') + '\n';
  }
  
  return text;
}

async function extractTextFromImage(file: File): Promise<string> {
  const worker = await createWorker();
  const imageUrl = URL.createObjectURL(file);
  const { data: { text } } = await worker.recognize(imageUrl);
  await worker.terminate();
  URL.revokeObjectURL(imageUrl);
  return text;
}

export async function processFile(file: File): Promise<FileProcessingResult> {
  try {
    if (file.type === 'application/pdf') {
      const text = await extractTextFromPDF(file);
      return { text };
    } else if (file.type.startsWith('image/')) {
      const text = await extractTextFromImage(file);
      return { text };
    } else if (file.type === 'text/plain') {
      const text = await file.text();
      return { text };
    } else {
      return { text: '', error: 'Unsupported file type' };
    }
  } catch (error) {
    return { text: '', error: 'Error processing file' };
  }
}