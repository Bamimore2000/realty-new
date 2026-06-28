import { PDFDocument, StandardFonts, rgb, PDFFont } from "pdf-lib";

export interface PDFFillOptions {
  // Common options
  font?: PDFFont;
  fontSize?: number;
  textColor?: ReturnType<typeof rgb>;

  // For text drawing
  textDrawings?: Array<{
    text: string;
    x: number;
    y: number;
    pageIndex?: number;
    size?: number;
    font?: PDFFont;
    color?: ReturnType<typeof rgb>;
  }>;

  // For AcroForms
  formFields?: Record<string, string | boolean | number>;
}

/**
 * Load an existing PDF file
 * @param pdfUrlOrBuffer - URL or ArrayBuffer of the PDF to load
 */
export async function loadPDF(
  pdfUrlOrBuffer: string | ArrayBuffer,
): Promise<PDFDocument> {
  if (typeof pdfUrlOrBuffer === "string") {
    const response = await fetch(pdfUrlOrBuffer);
    if (!response.ok)
      throw new Error(`Failed to fetch PDF: ${response.status}`);
    const pdfBuffer = await response.arrayBuffer();
    return PDFDocument.load(pdfBuffer);
  }
  return PDFDocument.load(pdfUrlOrBuffer);
}

/**
 * Fill an AcroForm PDF with field values
 * @param pdfDoc - Loaded PDF document
 * @param fields - Object of field names and values
 */
export async function fillAcroForm(
  pdfDoc: PDFDocument,
  fields: Record<string, string | boolean | number>,
): Promise<void> {
  const form = pdfDoc.getForm();

  for (const [fieldName, value] of Object.entries(fields)) {
    try {
      const field = form.getField(fieldName);

      if (typeof value === "boolean") {
        const checkBox = form.getCheckBox(fieldName);
        if (value) {
          checkBox.check();
        } else {
          checkBox.uncheck();
        }
      } else if (typeof value === "string" || typeof value === "number") {
        const textField = form.getTextField(fieldName);
        textField.setText(String(value));
      }
    } catch (error) {
      console.warn(`Field "${fieldName}" not found or type mismatch:`, error);
    }
  }
}

/**
 * Draw text on specific pages of a PDF
 */
export async function drawTextOnPDF(
  pdfDoc: PDFDocument,
  drawings: PDFFillOptions["textDrawings"],
  options: {
    defaultFont?: PDFFont;
    defaultSize?: number;
    defaultColor?: ReturnType<typeof rgb>;
  } = {},
): Promise<void> {
  const defaultFont =
    options.defaultFont || (await pdfDoc.embedFont(StandardFonts.Helvetica));
  const defaultSize = options.defaultSize || 12;
  const defaultColor = options.defaultColor || rgb(0, 0, 0);

  for (const drawing of drawings || []) {
    const pages = pdfDoc.getPages();
    const pageIndex = drawing.pageIndex || 0;
    if (pageIndex >= pages.length) {
      console.warn(
        `Page index ${pageIndex} out of range (total ${pages.length} pages)`,
      );
      continue;
    }

    const page = pages[pageIndex];
    const { width, height } = page.getSize();

    page.drawText(drawing.text, {
      x: drawing.x,
      y: height - drawing.y, // Flip Y coordinate since PDF uses bottom-left origin
      size: drawing.size || defaultSize,
      font: drawing.font || defaultFont,
      color: drawing.color || defaultColor,
    });
  }
}

/**
 * Complete PDF filling utility
 * @param pdfUrlOrBuffer - URL or ArrayBuffer of the PDF
 * @param options - Filling options
 */
export async function fillPDF(
  pdfUrlOrBuffer: string | ArrayBuffer,
  options: PDFFillOptions,
): Promise<{ pdfBytes: Uint8Array; pdfBuffer: Buffer; pdfBase64: string }> {
  const pdfDoc = await loadPDF(pdfUrlOrBuffer);

  const defaultFont =
    options.font || (await pdfDoc.embedFont(StandardFonts.Helvetica));

  // Fill AcroForm if fields are provided
  if (options.formFields) {
    await fillAcroForm(pdfDoc, options.formFields);
  }

  // Draw text if drawings are provided
  if (options.textDrawings) {
    await drawTextOnPDF(pdfDoc, options.textDrawings, {
      defaultFont,
      defaultSize: options.fontSize,
      defaultColor: options.textColor,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const pdfBuffer = Buffer.from(pdfBytes);
  const pdfBase64 = pdfBuffer.toString("base64");

  return { pdfBytes, pdfBuffer, pdfBase64 };
}

/**
 * Helper to get field names from an AcroForm PDF
 */
export async function getFormFieldNames(
  pdfUrlOrBuffer: string | ArrayBuffer,
): Promise<string[]> {
  const pdfDoc = await loadPDF(pdfUrlOrBuffer);

  // Check for XFA form (which pdf-lib doesn't support well)
  const catalog = pdfDoc.catalog;
  const acroForm = catalog.get("AcroForm");
  console.log("AcroForm present:", !!acroForm);

  const form = pdfDoc.getForm();
  const fields = form.getFields();

  console.log("Total fields found:", fields.length);
  console.log("Field details:");
  fields.forEach((field, index) => {
    const name = field.getName();
    console.log(`- Field ${index}:`, {
      name,
      type: field.constructor.name,
      isSet: !!name,
    });
  });

  return fields.map((field) => field.getName()).filter((name) => !!name);
}
