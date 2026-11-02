import * as pdfjsLib from 'pdfjs-dist';

// Use UNPKG / CDNJS worker matching pdfjs-dist version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export interface RenderedPdfPage {
  pageNumber: number;
  dataUrl: string;
}

/**
 * Helper to convert dataURL base64 string to Uint8Array safely
 */
function dataURLtoUint8Array(dataurl: string): Uint8Array {
  try {
    const parts = dataurl.split(',');
    const base64Str = parts.length > 1 ? parts[1] : parts[0];
    const cleanBase64 = base64Str.replace(/\s/g, '');
    const bstr = atob(cleanBase64);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return u8arr;
  } catch (e) {
    console.error('Error decoding base64 data URL:', e);
    return new Uint8Array(0);
  }
}

/**
 * Converts any base64 Data URL or raw PDF string into a browser Blob Object URL for 100% reliable native viewing
 */
export function dataUrlToBlobUrl(dataUrl: string): string {
  try {
    if (dataUrl.startsWith('blob:')) {
      return dataUrl;
    }
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
    const u8arr = dataURLtoUint8Array(dataUrl);
    if (u8arr.length === 0) return dataUrl;
    const blob = new Blob([u8arr.buffer as ArrayBuffer], { type: mime });
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error('Error creating Blob URL:', e);
    return dataUrl;
  }
}

/**
 * Given a PDF Data URL or ArrayBuffer, extracts each PDF page rendered into a crisp PNG Data URL.
 */
export async function convertPdfToImages(
  pdfDataUrlOrBuffer: string | ArrayBuffer | Blob
): Promise<RenderedPdfPage[]> {
  try {
    let loadingTask;

    if (pdfDataUrlOrBuffer instanceof Blob) {
      const buffer = await pdfDataUrlOrBuffer.arrayBuffer();
      loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
    } else if (typeof pdfDataUrlOrBuffer === 'string') {
      if (pdfDataUrlOrBuffer.startsWith('data:') || pdfDataUrlOrBuffer.length > 500) {
        const u8arr = dataURLtoUint8Array(pdfDataUrlOrBuffer);
        if (u8arr.length === 0) return [];
        loadingTask = pdfjsLib.getDocument({ data: u8arr });
      } else {
        loadingTask = pdfjsLib.getDocument({ url: pdfDataUrlOrBuffer });
      }
    } else {
      loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfDataUrlOrBuffer) });
    }

    const pdf = await loadingTask.promise;
    const pages: RenderedPdfPage[] = [];

    for (let i = 1; i <= Math.min(100, pdf.numPages); i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 }); // High resolution 1.5x scale

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) continue;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport: viewport,
        canvas: canvas as any,
      }).promise;

      const dataUrl = canvas.toDataURL('image/png');
      pages.push({
        pageNumber: i,
        dataUrl,
      });
    }

    return pages;
  } catch (err) {
    console.error('Error rendering PDF with PDF.js:', err);
    return [];
  }
}
