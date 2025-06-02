console.log("Starting server...");
// import mlsSearchRouter from "./mlsSearchRoute";
import fetch from "node-fetch";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// app.get("/api/ping", function (_req: express.Request, res: express.Response) {
//   res.send("pong");
// });
// app.use("/api", mlsSearchRouter);

const PORT = process.env.PORT;
const API_URL = process.env.VITE_SPARK_API_URL;
const API_ACCESS_TOKEN = process.env.VITE_SPARK_API_ACCESS_TOKEN;

async function sparkGet(path: string) {
  console.log("oauth", API_ACCESS_TOKEN);
  const resp = await fetch(`${API_URL}${path}`, {
    // <<-----
    headers: {
      Authorization: `OAuth ${API_ACCESS_TOKEN}`,
      Accept: "application/json",
    },
  });
  if (!resp.ok) {
    const txt = await resp.text();
    console.error(`Spark API error: ${resp.status} ${txt}`);
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

app.get("/api/listings", async (req, res) => {
  try {
    const city = ((req.query.city as string) || "").replace(/'/g, "''");
    const state = ((req.query.state as string) || "AZ").toUpperCase();
    const top = Number(req.query.top) || 25;

    if (!city) {
      res.status(400).json({ error: "city query-param is required" });
      return;
    }

    /* ✨ URL-encode the filter */
    const filter = encodeURIComponent(
      `City eq '${city}' and StateOrProvince eq '${state}'`
    );
    const path = `/listings?_filter=${filter}&$top=${top}`;

    // const path = `/listings?_filter=${filter}`;

    const json = await sparkGet(path); // <<-----

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
    const e = err as Error & { status?: number };
    res.status(e.status || 500).json({ error: e.message });
  }
});

app.get(`/api/Listings/:Id/photo`, async (req, res) => {
  try {
    const { Id } = req.params;
    const json = await sparkGet(`/listings/${Id}/photos?$top=1`); // <<-----
    const uri = json.D?.Results?.[0]?.Uri640 || "";
    res.json({ uri });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.listen(PORT, () => console.log(`MLS proxy is running on port ${PORT}`));
