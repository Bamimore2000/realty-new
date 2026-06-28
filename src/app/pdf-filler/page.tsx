"use client";

import React, { useState, useRef } from "react";
import { Upload, Download, FileText, Loader2, AlertCircle } from "lucide-react";
import { processPDFFill, extractFormFields } from "./actions";

export default function PDFillerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fieldNames, setFieldNames] = useState<string[]>([]);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setError(null);
    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();
      const result = await extractFormFields(buffer);
      console.log("Result from server:", result);

      if (result.success) {
        setFieldNames(result.fieldNames);
        const initialValues: Record<string, string> = {};
        result.fieldNames.forEach(field => {
          initialValues[field] = "";
        });
        setFieldValues(initialValues);
      } else {
        setError(result.error || "Failed to load PDF");
      }
    } catch (err) {
      setError("Failed to load PDF file");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProcessAndDownload = async () => {
    if (!selectedFile) {
      setError("Please select a PDF file first");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const result = await processPDFFill(buffer, fieldValues);

      if (result.success) {
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${result.pdfBase64}`;
        link.download = `filled-${selectedFile.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setError(result.error || "Failed to fill PDF");
      }
    } catch (err) {
      setError("An error occurred while filling the PDF");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <FileText className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            PDF Filler Tool
          </h1>
          <p className="text-gray-600">
            Upload a fillable PDF form, fill in the fields, and download the
            completed file
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <label
              htmlFor="pdf-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-12 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              {selectedFile ? (
                <>
                  <FileText className="w-12 h-12 text-green-600 mb-3" />
                  <p className="text-lg font-semibold text-gray-800">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Click to change file
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-lg font-semibold text-gray-600">
                    Click to upload PDF
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    or drag and drop a fillable PDF form
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          {fieldNames.length > 0 && (
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Fill in the Fields
              </h2>
              <div className="grid gap-4">
                {fieldNames.map((fieldName) => (
                  <div
                    key={fieldName}
                    className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center"
                  >
                    <label
                      htmlFor={`field-${fieldName}`}
                      className="text-sm font-medium text-gray-700 md:col-span-1"
                    >
                      {fieldName}
                    </label>
                    <input
                      id={`field-${fieldName}`}
                      type="text"
                      value={fieldValues[fieldName] || ""}
                      onChange={(e) =>
                        handleFieldChange(fieldName, e.target.value)
                      }
                      className="md:col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder={`Enter ${fieldName.toLowerCase()}...`}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={handleProcessAndDownload}
                  disabled={processing || loading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download Filled PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Extracting form fields...</p>
            </div>
          )}

          {selectedFile && !loading && fieldNames.length === 0 && (
            <div className="p-8 text-center">
              <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                No fillable form fields found in this PDF
              </p>
              <p className="text-gray-500 mb-4">
                This PDF might be a flat (image-based) PDF or it might not have
                interactive form fields yet.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try another PDF
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">How to use</h3>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>Upload a fillable PDF form (AcroForm format)</li>
            <li>Wait for the tool to extract all form fields</li>
            <li>Fill in the values for each field</li>
            <li>Click "Download Filled PDF" to get your completed document</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
