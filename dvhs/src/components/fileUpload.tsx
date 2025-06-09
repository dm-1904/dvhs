import React from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import {
  LeadUploadSchema,
  LeadUpload,
} from "../../../../common/schemas/leadUploadSchema";
import { z } from "zod";

export const UploadSpreadsheet = () => {
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const validRows: LeadUpload[] = [];
    const invalidRows: {
      row: Record<string, unknown>;
      error: z.ZodFormattedError<unknown>;
    }[] = [];

    jsonData.forEach((row) => {
      const typedRow = row as Record<string, unknown>;
      const result = LeadUploadSchema.safeParse(typedRow);
      if (result.success) {
        validRows.push(result.data);
      } else {
        invalidRows.push({ row: typedRow, error: result.error.format() });
      }
    });

    if (invalidRows.length > 0) {
      console.warn("Invalid rows found:", invalidRows);
      alert(`${invalidRows.length} invalid row(s) skipped.`);
    }

    try {
      await axios.post("/api/upload", { rows: validRows });
      alert("File uploaded successfully!");
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Failed to upload file.");
    }
  };

  return (
    <div>
      <h2>Upload Spreadsheet</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
      />
    </div>
  );
};
