"use client";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/react-pdf/pdf.worker.min.js";

interface PdfViewerProps {
  file: string | File;
  onExtract?: (pages: { page: number; text: string }[]) => void;
}

export default function PdfViewer({ file, onExtract }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
  if (!file) return;

  (async () => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const doc = await loadingTask.promise;

      setNumPages(doc.numPages);
      setPageNumber(1);

      const allText: { page: number; text: string }[] = [];

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str);
        allText.push({ page: i, text: strings.join(" ") });
      }

      onExtract?.(allText);
    } catch (err) {
      console.error("PDF extract failed:", err);
    }
  })();
}, [file]);



  return (
    <div className="flex flex-col items-center gap-4">
      <Document
        file={file}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={<div>Loading PDF...</div>}
        error={<div>Failed to load PDF.</div>}
      >
        <Page pageNumber={pageNumber} width={500} />
      </Document>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
          disabled={pageNumber <= 1}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {pageNumber} of {numPages}
        </span>
        <button
          onClick={() => setPageNumber((p) => Math.min(numPages || 1, p + 1))}
          disabled={pageNumber >= (numPages || 1)}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
