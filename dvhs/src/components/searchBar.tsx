// import { useState } from "react";
// import "../css/searchBar.css";
// import { ListingGrid } from "./mlsComponents/listingGrid";

// // const API_URL = process.env.VITE_SPARK_API_URL;
// // // const API_KEY = process.env.VITE_SPARK_API_KEY;
// // const API_ACCESS_TOKEN = process.env.VITE_SPARK_API_ACCESS_TOKEN;
// // const API_URL = import.meta.env.VITE_SPARK_API_URL;
// // const API_ACCESS_TOKEN = import.meta.env.VITE_SPARK_API_ACCESS_TOKEN;

// interface ListingSummary {
//   Id: string;
//   ListPrice: number;
//   BedsTotal: number;
//   BathsTotal: number;
//   LivingArea: number;
//   MlsStatus: string;
//   UnparsedAddress: string;
//   thumbnail: string;
// }

// export default function SearchBar() {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState<ListingSummary[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [hasSearched, setHasSearched] = useState(false);

//   const handleSearchSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!query.trim()) return;

//     setHasSearched(true);
//     setLoading(true);
//     setError(null);

//     // try {
//     //   const url = `${API_URL}/listings?SearchQuery=${encodeURIComponent(
//     //     query
//     //   )}`;
//     //   const resp = await fetch(url, {
//     //     headers: {
//     //       Authorization: `OAuth ${API_ACCESS_TOKEN}`,
//     //       Accept: "application/json",
//     //     },
//     //   });
//     //   if (!resp.ok) {
//     //     throw new Error(`Error fetching listings: ${resp.status}`);
//     //   }
//     //   const data = await resp.json();

//     //   const rawListings = data?.D?.Results || data?.results || data || [];
//     //   interface RawListing {
//     //     Id: string;
//     //     ListPrice: number;
//     //     BedsTotal: number;
//     //     BathsTotal: number;
//     //     LivingArea: number;
//     //     MlsStatus: string;
//     //     StreetNumber?: string;
//     //     StreetDirPrefix?: string;
//     //     StreetName?: string;
//     //     StreetSuffix?: string;
//     //     City?: string;
//     //     StateOrProvince?: string;
//     //     PostalCode?: string;
//     //   }

//     //   const listings: ListingSummary[] = await Promise.all(
//     //     (rawListings as RawListing[]).map(async (item: RawListing) => {
//     //       const addressParts = [
//     //         item.StreetNumber,
//     //         item.StreetDirPrefix,
//     //         item.StreetName,
//     //         item.StreetSuffix,
//     //       ]
//     //         .filter(Boolean)
//     //         .join(" ");
//     //       const cityStateZip = [
//     //         item.City,
//     //         item.StateOrProvince,
//     //         item.PostalCode,
//     //       ]
//     //         .filter(Boolean)
//     //         .join(", ");
//     //       const fullAddress = `${addressParts}, ${cityStateZip}`;
//     //       // /listings/20250529171059596164000000/photos
//     //       const thumbUrl = `${API_URL}/listings/${item.Id}/photos`;
//     //       const thumbResp = await fetch(thumbUrl, {
//     //         headers: {
//     //           Authorization: `OAuth ${API_ACCESS_TOKEN}`,
//     //           Accept: "application/json",
//     //         },
//     //       });
//     //       if (!thumbResp.ok) {
//     //         throw new Error(`Error fetching thumbnail: ${thumbResp.status}`);
//     //       }
//     //       const thumbData = await thumbResp.json();
//     //       const thumbnail = thumbData?.D?.Results?.[0]?.Uri800 || "";

//     //       return {
//     //         Id: item.Id,
//     //         ListPrice: item.ListPrice,
//     //         BedsTotal: item.BedsTotal,
//     //         BathsTotal: item.BathsTotal,
//     //         LivingArea: item.LivingArea,
//     //         MlsStatus: item.MlsStatus,
//     //         UnparsedAddress: fullAddress,
//     //         thumbnail: thumbnail,
//     //       };
//     //     })
//     //   );

//     //   setResults(listings);
//     // } catch (err) {
//     //   console.error("Search error:", err);
//     //   setError(err instanceof Error ? err.message : "Failed to fetch listings");
//     //   setResults([]);
//     // } finally {
//     //   setLoading(false);
//     // }

//     try {
//       const r = await fetch(
//         `/api/listings?search=${encodeURIComponent(query)}`
//       );
//       if (!r.ok) {
//         throw new Error(`search failed: ${r.status}`);
//       }
//       const { results: bare } = (await r.json()) as {
//         results: ListingSummary[];
//       };

//       const full: ListingSummary[] = await Promise.all(
//         bare.map(async (l) => {
//           const pRes = await fetch(`/api/Listings/${l.Id}/photo`);
//           const { uri } = await pRes.json();
//           return {
//             Id: l.Id,
//             ListPrice: l.ListPrice,
//             BedsTotal: l.BedsTotal,
//             BathsTotal: l.BathsTotal,
//             LivingArea: l.LivingArea,
//             MlsStatus: l.MlsStatus,
//             UnparsedAddress: l.UnparsedAddress,
//             thumbnail: uri || "",
//           } as ListingSummary;
//         })
//       );
//       setResults(full);
//     } catch (err) {
//       console.error(err);
//       setError((err as Error).message);
//       setResults([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section
//       className="search-bar-header"
//       aria-label="filters"
//     >
//       <div className="search-bar-box">
//         <form onSubmit={handleSearchSubmit}>
//           <input
//             type="text"
//             placeholder="Enter a city or address..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             aria-label="Search"
//           />

//           {/* {query && (
//             <button
//               type="button"
//               className="icon-btn clear-btn"
//               onClick={() => setQuery("")}
//               aria-label="Clear search text"
//             >
//               Clear
//             </button>
//           )} */}

//           <button
//             type="submit"
//             className="icon-btn submit-btn"
//             id="search-btn"
//             aria-label="Submit search"
//           >
//             Search
//           </button>
//         </form>
//       </div>

//       <div className="search-bar-filter-row">
//         <button className="search-bar-filter-btn">Price ▾</button>
//         <button className="search-bar-filter-btn">Beds & Baths ▾</button>
//         <button className="search-bar-filter-btn">Home Type ▾</button>
//         <button className="search-bar-filter-btn">More ▾</button>

//         <button className="search-bar-save-btn">Save search</button>
//       </div>
//       {error && <p className="text-red-600 mb-4">{error}</p>}
//       {loading && <p className="text-gray-600 mb-4">Searching listings...</p>}
//       {/* No results message (after a search has been attempted) */}
//       {!loading && hasSearched && results.length === 0 && !error && (
//         <p className="text-gray-700 mb-4">
//           No listings found for "<strong>{query}</strong>".
//         </p>
//       )}

//       {/* Listings Grid */}
//       {!loading && results.length > 0 && <ListingGrid listings={results} />}
//     </section>
//   );
// }

import { FormEvent, useState } from "react";
import "../css/searchBar.css";
import { ListingGrid } from "./mlsComponents/listingGrid";

/** -------- types shared with the card / grid components -------- */
export interface ListingSummary {
  Id: string;
  ListPrice: number;
  BedsTotal: number;
  BathsTotal: number;
  LivingArea: number;
  MlsStatus: string;
  UnparsedAddress: string;
  thumbnail: string; // filled after a 2nd request to /api/listings/:id/photo
}

/** -------- component -------- */
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ListingSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  /** main submit handler */
  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setHasSearched(true);
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      /* 1️⃣ ask the proxy for matching listings ------------------- */
      const listingsResp = await fetch(
        `/api/listings?search=${encodeURIComponent(q)}`
      );

      if (!listingsResp.ok) {
        throw new Error(`search failed: ${listingsResp.status}`);
      }

      const { results: bareListings } = (await listingsResp.json()) as {
        results: Omit<ListingSummary, "thumbnail">[];
      };

      /* 2️⃣ fetch 1 thumbnail for every listing in parallel ------- */
      const listingsWithThumbs: ListingSummary[] = await Promise.all(
        bareListings.map(async (l) => {
          try {
            const photoResp = await fetch(`/api/listings/${l.Id}/photo`);
            if (!photoResp.ok) throw new Error("photo 404");

            const { uri } = (await photoResp.json()) as { uri: string };
            return { ...l, thumbnail: uri || "" };
          } catch {
            // fall back to empty string (the card shows a placeholder)
            return { ...l, thumbnail: "" };
          }
        })
      );

      setResults(listingsWithThumbs);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Unexpected error – see console"
      );
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------- render --------------------------- */
  return (
    <section
      className="search-bar-header"
      aria-label="filters"
    >
      {/* ── input box ───────────────────────────────────────────── */}
      <div className="search-bar-box">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search by city, address, MLS # …"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />

          <button
            type="submit"
            className="icon-btn submit-btn"
            id="search-btn"
            aria-label="Submit search"
          >
            Search
          </button>
        </form>
      </div>

      {/* ── quick filters row (non-functional placeholders) ─────── */}
      <div className="search-bar-filter-row">
        <button className="search-bar-filter-btn">Price ▾</button>
        <button className="search-bar-filter-btn">Beds & Baths ▾</button>
        <button className="search-bar-filter-btn">Home Type ▾</button>
        <button className="search-bar-filter-btn">More ▾</button>
        <button className="search-bar-save-btn">Save search</button>
      </div>

      {/* ── messages / states ───────────────────────────────────── */}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="text-gray-600 mb-4">Searching…</p>}
      {!loading && hasSearched && results.length === 0 && !error && (
        <p className="text-gray-700 mb-4">
          No listings found for “<strong>{query}</strong>”.
        </p>
      )}

      {/* ── results grid ────────────────────────────────────────── */}
      {!loading && results.length > 0 && <ListingGrid listings={results} />}
    </section>
  );
}
