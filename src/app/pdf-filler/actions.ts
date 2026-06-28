"use server";

import { fillPDF, getFormFieldNames } from "@/lib/pdf-filler";

export async function processPDFFill(
  pdfBuffer: ArrayBuffer,
  fieldValues: Record<string, string>,
): Promise<{ pdfBase64: string; success: boolean; error?: string }> {
  try {
    const result = await fillPDF(pdfBuffer, {
      formFields: fieldValues,
    });

    return { pdfBase64: result.pdfBase64, success: true };
  } catch (error) {
    console.error("Error filling PDF:", error);
    return {
      pdfBase64: "",
      success: false,
      error: "Failed to fill PDF. Please check your file and try again.",
    };
  }
}

export async function extractFormFields(
  pdfBuffer: ArrayBuffer,
): Promise<{
  fieldNames: string[];
  success: boolean;
  error?: string;
  totalFieldsFound: number;
}> {
  try {
    const fieldNames = await getFormFieldNames(pdfBuffer);
    console.log("Fields received in action:", fieldNames);
    return {
      fieldNames,
      success: true,
      totalFieldsFound: fieldNames.length,
    };
  } catch (error) {
    console.error("Error extracting form fields:", error);
    return {
      fieldNames: [],
      success: false,
      error: "Failed to extract form fields. Please try another PDF.",
      totalFieldsFound: 0,
    };
  }
}
