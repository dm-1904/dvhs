/*
   SearchBar – requests   GET /api/listings?city=Surprise&state=AZ&top=25
               thumbnails GET /api/listings/:id/photo
 */
import { FormEvent, useState } from "react";
import "../css/searchBar.css";
import { ListingGrid } from "./mlsComponents/listingGrid";

/* -------------- shared type ------------------------------------- */
export interface ListingSummary {
  Id: string;
  ListPrice: number;
  BedsTotal: number;
  BathsTotal: number;
  LivingArea: number;
  MlsStatus: string;
  UnparsedAddress: string;
  thumbnail: string; // filled in client-side
}

/* -------------- helpers ----------------------------------------- */
function parseInput(raw: string): { city: string; state: string } | null {
  // Accept “Surprise, AZ”  or  “Surprise AZ”  (state optional)
  const cleaned = raw.trim().replace(/\s{2,}/g, " ");
  if (!cleaned) return null;

  const parts = cleaned.split(/[, ]+/);
  const city = parts[0];
  const state =
    parts[1] && parts[1].length === 2 ? parts[1].toUpperCase() : "AZ";

  return { city, state };
}

/* -------------- component --------------------------------------- */
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ListingSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  /* ---- submit -------------------------------------------------- */
  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const parsed = parseInput(query);
    if (!parsed) return; // empty input -- do nothing

    setHasSearched(true);
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      /* 1️⃣ ── fetch listings from the Express proxy */
      const qs = new URLSearchParams({
        city: parsed.city,
        state: parsed.state,
        top: "25",
      }).toString();

      const listRes = await fetch(`/api/listings?${qs}`); // <<-----
      if (!listRes.ok) throw new Error(`search failed: ${listRes.status}`);

      const { results: bare } = (await listRes.json()) as {
        results: Omit<ListingSummary, "thumbnail">[];
      };

      /* 2️⃣ ── in parallel fetch one photo for every listing */
      const withThumbs: ListingSummary[] = await Promise.all(
        bare.map(async (l) => {
          try {
            const photoRes = await fetch(`/api/listings/${l.Id}/photo`); // <<-----
            if (!photoRes.ok) throw new Error("photo 404");

            const { uri } = (await photoRes.json()) as { uri: string };
            return { ...l, thumbnail: uri || "" };
          } catch {
            return { ...l, thumbnail: "" };
          }
        })
      );

      setResults(withThumbs);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  /* ---- UI ------------------------------------------------------ */
  return (
    <section
      className="search-bar-header"
      aria-label="filters"
    >
      {/* ▸ input box */}
      <div className="search-bar-box">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search by city (e.g. “Surprise, AZ”)…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />
          <button
            type="submit"
            className="icon-btn submit-btn"
            id="search-btn"
          >
            Search
          </button>
        </form>
      </div>

      {/* ▸ dummy filter buttons – left unchanged */}
      <div className="search-bar-filter-row">
        <button className="search-bar-filter-btn">Price ▾</button>
        <button className="search-bar-filter-btn">Beds & Baths ▾</button>
        <button className="search-bar-filter-btn">Home Type ▾</button>
        <button className="search-bar-filter-btn">More ▾</button>
        <button className="search-bar-save-btn">Save search</button>
      </div>

      {/* ▸ status messages */}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="text-gray-600 mb-4">Searching…</p>}
      {!loading && hasSearched && results.length === 0 && !error && (
        <p className="text-gray-700 mb-4">
          No listings found for “<strong>{query}</strong>”.
        </p>
      )}

      {/* ▸ results */}
      {!loading && results.length > 0 && <ListingGrid listings={results} />}
    </section>
  );
}
