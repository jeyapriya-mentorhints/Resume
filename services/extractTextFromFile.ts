// src/services/extractTextFromFile.ts

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import mammoth from "mammoth";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "pdf":
      return extractPdfText(file);
    case "docx":
      return extractDocxText(file);
    case "txt":
      return normalizeText(await file.text());
    default:
      throw new Error("Unsupported file type");
  }
}

async function extractPdfText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    text +=
      content.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ") + "\n";
  }
  console.log("Extracted PDF Text:", text); 
  return normalizeText(text);
}

async function extractDocxText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return normalizeText(result.value || "");
}

function normalizeText(text: string): string {
    console.log("Raw Extracted Text:", text);
  return text
    .replace(/\r/g, "\n")
    .replace(/\n{2,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}
//src/services/extractTextFromFile.ts

// import * as pdfjsLib from "pdfjs-dist";
// import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
// import mammoth from "mammoth";

// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Extracts clean textual data from a supported file type (PDF, DOCX, TXT)
 */
// export async function extractTextFromFile(file: File): Promise<string> {
//   try {
//     const ext = file.name.split(".").pop()?.toLowerCase();

//     if (!ext) throw new Error("Unknown file type");

//     switch (ext) {
//       case "pdf":
//         return await extractPdfText(file);
//       case "docx":
//         return await extractDocxText(file);
//       case "txt":
//         return normalizeText(await file.text());
//       default:
//         throw new Error(`Unsupported file type: ${ext}`);
//     }
//   } catch (err) {
//     console.error("❌ Error extracting text from file:", err);
//     throw new Error("Failed to process the uploaded file. Please check the file or try again.");
//   }
// }

// /**
//  * Extracts text from PDF using pdfjs
//  */
// async function extractPdfText(file: File): Promise<string> {
//   const buffer = await file.arrayBuffer();
//   const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

//   const pages: string[] = [];

//   for (let i = 1; i <= pdf.numPages; i++) {
//     const page = await pdf.getPage(i);
//     const content = await page.getTextContent();

//     const pageText = content.items
//       .map((item: any) => (typeof item.str === "string" ? item.str : ""))
//       .join(" ");

//     pages.push(pageText);
//   }

//   const combined = pages.join("\n\n");
//   console.debug("✅ Extracted PDF text length:", combined.length);

//   return normalizeText(combined);
// }

// /**
//  * Extracts text from DOCX documents using Mammoth.
//  */
// async function extractDocxText(file: File): Promise<string> {
//   const buffer = await file.arrayBuffer();
//   const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
//   console.debug("✅ Extracted DOCX text length:", value?.length || 0);
//   return normalizeText(value || "");
// }

// /**
//  * Cleans and normalizes extracted text for parsing
//  */
// function normalizeText(text: string): string {
//   return text
//     .replace(/\r/g, "\n")
//     .replace(/[ \t]+/g, " ")
//     .replace(/\n{2,}/g, "\n\n")
//     .replace(/[^\S\n]+/g, " ")
//     .replace(/\u00A0/g, " ") // handle non-breaking spaces
//     .trim();
// }
