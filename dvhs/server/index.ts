console.log("Starting server...");
import express from "express";
// import mlsSearchRouter from "./mlsSearchRoute";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// app.use("/api", mlsSearchRouter);

const PORT = process.env.PORT || 5000;
const API_URL = process.env.VITE_SPARK_API_URL;
const API_ACCESS_TOKEN = process.env.VITE_SPARK_API_ACCESS_TOKEN;

async function sparkGet(path: string) {
  const resp = await fetch(`${API_URL}${path}`, {
    headers: {
      Authorization: `OAuth ${API_ACCESS_TOKEN}`,
      Accept: "application/json",
    },
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Spark ${resp.status}: ${txt}`);
  }
  return resp.json();
}

interface Listing {
  Id: string;
  ListPrice: number;
  BedsTotal: number;
  BathsTotal: number;
  LivingArea: number;
  MlsStatus: string;
  UnparsedAddress: string;
}

// app.get(`/api/listings`, async (req, res) => {
//   try {
//     const q = req.query.search as string;
//     const json = await sparkGet(
//       `/listings?SearchQuery=${encodeURIComponent(q)}`
//     );

//     const results = (json.D?.Results ?? []).map((l: Listing) => {
//       return {
//         Id: l.Id,
//         ListPrice: l.ListPrice,
//         BedsTotal: l.BedsTotal,
//         BathsTotal: l.BathsTotal,
//         LivingArea: l.LivingArea,
//         MlsStatus: l.MlsStatus,
//         UnparsedAddress: l.UnparsedAddress,
//       };
//     });
//     res.json({ results });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: (err as Error).message });
//   }
// });

app.get("/api/listings", async (req, res) => {
  try {
    const q = (req.query.search as string)?.trim();
    if (!q) {
      res.json({ results: [] });
      return;
    }

    /* Build a very tolerant filter:
       • looks for q in UnparsedAddress   (for “8429 E Del …” kind of searches)
       • OR    in City                   (for “Surprise” / “Phoenix”)
       • case-insensitive because Spark “contains” is insensitive by default
    */
    const filter = encodeURIComponent(
      `Contains(UnparsedAddress,'${q}') or Contains(City,'${q}')`
    );

    // select only the fields the front-end needs
    const select =
      "Id,ListPrice,BedsTotal,BathsTotal,LivingArea,MlsStatus," +
      "UnparsedAddress,StreetNumber,StreetDirPrefix,StreetName," +
      "StreetSuffix,City,StateOrProvince,PostalCode";

    const json = await sparkGet(
      `/listings?$filter=${filter}&$select=${select}&$top=60`
    );

    const results = (json.D?.Results ?? []).map((l: Listing) => ({
      Id: l.Id,
      ListPrice: l.ListPrice,
      BedsTotal: l.BedsTotal,
      BathsTotal: l.BathsTotal,
      LivingArea: l.LivingArea,
      MlsStatus: l.MlsStatus,
      UnparsedAddress: l.UnparsedAddress,
    }));

    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get(`/api/Listings/:Id/photo`, async (req, res) => {
  try {
    const { Id } = req.params;
    const json = await sparkGet(`/listings/${Id}/photos?$top=1`);
    const uri = json.D?.Results?.[0]?.Uri640 || "";
    res.json({ uri });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.listen(PORT, () => console.log(`MLS proxy is running on port ${PORT}`));
