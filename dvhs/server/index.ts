// console.log("Starting server...");
// // import mlsSearchRouter from "./mlsSearchRoute";
// import fetch from "node-fetch";
// import express from "express";
// import dotenv from "dotenv";
// dotenv.config();

// const app = express();

// // app.get("/api/ping", function (_req: express.Request, res: express.Response) {
// //   res.send("pong");
// // });
// // app.use("/api", mlsSearchRouter);

// const PORT = process.env.PORT;
// const API_URL = process.env.VITE_SPARK_API_URL;
// const API_ACCESS_TOKEN = process.env.VITE_SPARK_API_ACCESS_TOKEN;

// async function sparkGet(path: string) {
//   // console.log("oauth", API_ACCESS_TOKEN);
//   const resp = await fetch(`${API_URL}${path}`, {
//     // <<-----
//     headers: {
//       Authorization: `OAuth ${API_ACCESS_TOKEN}`,
//       Accept: "application/json",
//     },
//   });
//   if (!resp.ok) {
//     const txt = await resp.text();
//     console.error(`Spark API error: ${resp.status} ${txt}`);
//     throw new Error(`Spark ${resp.status}: ${txt}`);
//   }
//   return resp.json();
// }

// interface Listing {
//   Id: string;
//   ListPrice: number;
//   BedsTotal: number;
//   BathsTotal: number;
//   LivingArea: number;
//   MlsStatus: string;
//   UnparsedAddress: string;
// }

// app.get("/api/listings", async (req, res) => {
//   try {
//     const city = ((req.query.city as string) || "").replace(/'/g, "''");
//     const state = ((req.query.state as string) || "AZ").toUpperCase();
//     const top = Number(req.query.top) || 25;
//     // console.log("city", city, "state", state, "top", top);
//     if (!city) {
//       res.status(400).json({ error: "city query-param is required" });
//       return;
//     }

//     /* ✨ URL-encode the filter */
//     const filter = encodeURIComponent(
//       `City eq '${city}' and StateOrProvince eq '${state}'`
//     );
//     const path = `/listings?_filter=${filter}&$top=${top}`;

//     // const path = `/listings?_filter=${filter}`;

//     const json = await sparkGet(path); // <<-----

//     const results = (json.D?.Results ?? []).map((l: Listing) => ({
//       Id: l.Id,
//       ListPrice: l.ListPrice,
//       BedsTotal: l.BedsTotal,
//       BathsTotal: l.BathsTotal,
//       LivingArea: l.LivingArea,
//       MlsStatus: l.MlsStatus,
//       UnparsedAddress: l.UnparsedAddress,
//     }));

//     console.log(`results ${JSON.stringify(results)}`);

//     res.json({ results });
//   } catch (err) {
//     console.error(err);
//     const e = err as Error & { status?: number };
//     res.status(e.status || 500).json({ error: e.message });
//   }
// });

// app.get(`/api/Listings/:Id/photo`, async (req, res) => {
//   try {
//     const { Id } = req.params;
//     const json = await sparkGet(`/listings/${Id}/photos?$top=1`); // <<-----
//     const uri = json.D?.Results?.[0]?.Uri640 || "";
//     res.json({ uri });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: (err as Error).message });
//   }
// });

// app.listen(PORT, () => console.log(`MLS proxy is running on port ${PORT}`));
/**********************************************************************
 * server/index.ts
 * --------------------------------------------------------------------
 *  ▸  Express “MLS proxy” that adds OAuth and hands the React app
 *     only the data it needs (Id, price, beds, etc. + first thumbnail).
 *********************************************************************/

import dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";

dotenv.config();

console.log("Starting server…");

const app = express();

const PORT = process.env.PORT;
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
    console.error(`Spark API error ${resp.status}: ${txt}`);
    throw Object.assign(new Error(txt), { status: resp.status });
  }

  return resp.json();
}

interface SparkListing {
  Id: string;
  StandardFields: {
    ListPrice: number;
    BedsTotal: number;
    BathsTotal: number;
    LivingArea: number;
    MlsStatus: string;
    UnparsedAddress: string;
  };
}

interface ListingSummary {
  Id: string;
  ListPrice: number;
  BedsTotal: number;
  BathsTotal: number;
  LivingArea: number;
  MlsStatus: string;
  UnparsedAddress: string;
}

/* ------------------------------------------------------------------ */
/*  GET /api/listings                                                  */
/* ------------------------------------------------------------------ */
app.get("/api/listings", async (req, res) => {
  try {
    const city = ((req.query.city as string) || "").replace(/'/g, "''");
    const state = ((req.query.state as string) || "AZ").toUpperCase();
    const top = Number(req.query.top) || 25;

    if (!city) {
      res.status(400).json({ error: "city query-param is required" });
      return;
    }

    /* ------------- build Spark query -------------------------------- */
    const filter = encodeURIComponent(
      `City eq '${city}' and StateOrProvince eq '${state}'`
    );

    const SELECT =
      "ListingKey,ListPrice,BedsTotal,BathsTotal,LivingArea," +
      "MlsStatus,UnparsedAddress";

    const path = `/listings?_filter=${filter}&$select=${SELECT}&$top=${top}`;

    /* ------------- call Spark --------------------------------------- */
    const json = await sparkGet(path);

    const results: ListingSummary[] = (json.D?.Results ?? []).map(
      (l: SparkListing) => {
        const s = l.StandardFields;
        return {
          Id: l.Id,
          ListPrice: s.ListPrice,
          BedsTotal: s.BedsTotal,
          BathsTotal: s.BathsTotal,
          LivingArea: s.LivingArea,
          MlsStatus: s.MlsStatus,
          UnparsedAddress: s.UnparsedAddress,
        };
      }
    );

    /* ------------- dev-only: show one full record ------------------- */
    // console.log("results", results.slice(0, 5));
    // localStorage.setItem("lastResults", JSON.stringify(results));

    res.json({ results });
  } catch (err) {
    const e = err as Error & { status?: number };
    res.status(e.status || 500).json({ error: e.message });
  }
});

/* ------------------------------------------------------------------ */
/*  GET /api/listings/:Id/photo  – first photo (640 px)                */
/* ------------------------------------------------------------------ */
app.get("/api/listings/:Id/photo", async (req, res) => {
  try {
    const { Id } = req.params;
    const json = await sparkGet(`/listings/${Id}/photos?$top=1`);
    const uri = json.D?.Results?.[0]?.Uri640 || "";
    res.json({ uri });
  } catch (err) {
    const e = err as Error & { status?: number };
    res.status(e.status || 500).json({ error: e.message });
  }
});

/* ------------------------------------------------------------------ */
/*  Boot                                                               */
/* ------------------------------------------------------------------ */
app.listen(PORT, () =>
  console.log(`MLS proxy is running on http://localhost:${PORT}`)
);
