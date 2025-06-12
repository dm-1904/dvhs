// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import axios from "axios";
// import {
//   LeadUploadSchema,
//   LeadUpload,
// } from "../../../../common/schemas/leadUploadSchema";
// import { z } from "zod";

// export const UploadSpreadsheet: React.FC = () => {
//   const [busy, setBusy] = useState(false);

//   const handleFileUpload = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = event.target.files?.[0];
//     if (!file || busy) return;

//     setBusy(true);
//     const data = await file.arrayBuffer();
//     const workbook = XLSX.read(data, { type: "array" });
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     const jsonData = XLSX.utils.sheet_to_json(worksheet);

//     const validRows: LeadUpload[] = [];
//     const invalidRows: {
//       row: Record<string, unknown>;
//       error: z.ZodFormattedError<unknown>;
//     }[] = [];

//     jsonData.forEach((row) => {
//       const typedRow = row as Record<string, unknown>;
//       const result = LeadUploadSchema.safeParse(typedRow);
//       if (result.success) {
//         validRows.push(result.data);
//       } else {
//         invalidRows.push({ row: typedRow, error: result.error.format() });
//       }
//     });

//     if (invalidRows.length > 0) {
//       console.warn("Invalid rows found:", invalidRows);
//       alert(`${invalidRows.length} invalid row(s) skipped.`);
//     }

//     try {
//       await axios.post("/api/leads/upload", { rows: validRows });
//       alert("File uploaded successfully!");
//     } catch (err) {
//       console.error("Error uploading file:", err);
//       alert("Failed to upload file.");
//     }
//   };

//   return (
//     <div>
//       <h2>Upload Spreadsheet</h2>
//       <input
//         type="file"
//         accept=".xlsx, .xls"
//         onChange={handleFileUpload}
//       />
//     </div>
//   );
// };

import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import {
  LeadUploadSchema,
  LeadUpload,
} from "../../../../common/schemas/leadUploadSchema";
import { HEADERS } from "../../../../common/sheetUploadMap";
import { z } from "zod";

export const UploadSpreadsheet: React.FC = () => {
  const [busy, setBusy] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || busy) return;

    setBusy(true);
    await new Promise((resolve) => setTimeout(resolve, 0));
    try {
      // ① read workbook
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(ws, {
        defval: "",
      });

      // ② optional header remap (Excel → camelCase)
      const mapRow = (r: Record<string, unknown>): Record<string, unknown> => {
        const out: Record<string, unknown> = {};

        // iterate over every cell in the row
        for (const [rawKey, value] of Object.entries(r)) {
          const cleanKey = (rawKey || "").trim();
          const target = HEADERS[cleanKey];
          if (!target) continue; // skip unknown columns

          // special handling: choose first non-empty phone
          if (target === "phone") {
            if (!out.phone && value) out.phone = String(value).trim();
            continue;
          }

          out[target] = typeof value === "string" ? value.trim() : value;
        }

        return out;
      };

      // ③ validate with Zod
      const valid: LeadUpload[] = [];
      const bad: {
        row: Record<string, unknown>;
        err: z.ZodFormattedError<unknown>;
      }[] = [];

      rawRows.forEach((r) => {
        const parsed = LeadUploadSchema.safeParse(mapRow(r));
        if (parsed.success) {
          valid.push(parsed.data);
        } else {
          bad.push({ row: r, err: parsed.error.format() });
        }
      });

      if (bad.length) {
        console.warn("Skipped invalid rows:", bad);
        alert(`${bad.length} invalid row(s) skipped.`);
      }

      if (!valid.length) {
        alert("No valid rows to upload.");
        return;
      }

      // ④ upload
      await axios.post("/api/leads/upload", valid, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert(`✅ Uploaded ${valid.length} lead(s).`);
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed.");
    } finally {
      setBusy(false);
      e.target.value = ""; // clear the file input
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="font-semibold">Upload Spreadsheet</h2>
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        disabled={busy}
        onChange={handleFileUpload}
      />
      {busy && <p>Uploading…</p>}
    </div>
  );
};
