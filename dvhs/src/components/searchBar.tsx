/*
   SearchBar – requests   GET /api/listings?city=Surprise&state=AZ&top=25
               thumbnails GET /api/listings/:id/photo

  This query works in postman:
  /listings?_filter=City%20Eq%20'Surprise'%20And%20StateOrProvince%20Eq%20'AZ'
  %20And%20PropertyClass%20Ne%20'Rental'%20And%20PropertySubType%20Eq%20'Single
  %20Family%20Residence'%20And%20LivingArea%20Ge%201800%20And%20BedsTotal%20Ge%204
  %20And%20BathsTotal%20Ge%203%20And%20ListPrice%20Ge%20600000
  &$select=ListingKey,ListPrice,BedsTotal,BathsTotal,LivingArea,UnparsedAddress,MlsStatus&$top=25

 */
import { FormEvent, useState, useEffect } from "react";
import "../css/searchBar.css";
import { ListingGrid } from "./mlsComponents/listingGrid";
import { PriceModal } from "./mlsComponents/mlsModals/priceModal";

// interface FiltersState {
//   priceMin: string;
//   priceMax: string;
//   bedsMin: string;
//   bathsMin: string;
//   propertyTypes: string[];
//   seniorOnly: boolean;
// }

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

const LS_RESULTS_KEY = "dvhs.results";
const LS_QUERY_KEY = "dvhs.lastQuery";

/* -------------- component --------------------------------------- */
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ListingSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [priceModalOpen, setPriceModalOpen] = useState(false);

  /* ---- load last results from localStorage --------------------- */
  useEffect(() => {
    const stored = localStorage.getItem(LS_RESULTS_KEY);
    const lastQ = localStorage.getItem(LS_QUERY_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ListingSummary[];
        setResults(parsed);
        if (parsed.length) setHasSearched(true);
      } catch {
        /* ignore */
      }
    }
    if (lastQ) {
      setQuery(lastQ);
    }
  }, []);

  /* ----- persist every change -----*/
  useEffect(() => {
    if (results.length) {
      localStorage.setItem(LS_RESULTS_KEY, JSON.stringify(results));
    }
  }, [results]);

  /* ---- submit -------------------------------------------------- */
  const handleSearchSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // localStorage.removeItem("lastResults");

    const parsed = parseInput(query);
    if (!parsed) return; // empty input -- do nothing

    localStorage.setItem(LS_QUERY_KEY, query);

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
        <button
          className="search-bar-filter-btn-price"
          onClick={() => setPriceModalOpen(true)}
        >
          Price ▾
        </button>
        <PriceModal
          isOpen={priceModalOpen}
          onClose={() => setPriceModalOpen(false)}
        />
        <button className="search-bar-filter-btn-beds">Beds & Baths ▾</button>
        <button className="search-bar-filter-btn-home-type">Home Type ▾</button>
        <button className="search-bar-filter-btn-more">More ▾</button>
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
// function useEffect(arg0: () => void, arg1: never[]) {
//   throw new Error("Function not implemented.");
// }
