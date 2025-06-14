import { FormEvent, useEffect, useState } from "react";
import "../css/searchBar.css";
import { ListingGrid } from "./mlsComponents/listingGrid";
import { PriceModal } from "./mlsComponents/mlsModals/priceModal";

/* ───────────────────────────────────────────────────────── helpers ── */
export interface ListingSummary {
  Id: string;
  ListPrice: number;
  BedsTotal: number;
  BathsTotal: number;
  LivingArea: number;
  MlsStatus: string;
  UnparsedAddress: string;
  thumbnail: string; // filled client-side
}

function parseInput(raw: string): { city: string; state: string } | null {
  const t = raw.trim().replace(/\s{2,}/g, " ");
  if (!t) return null;
  const [city = "", maybeState] = t.split(/[, ]+/);
  const state =
    maybeState && maybeState.length === 2 ? maybeState.toUpperCase() : "AZ";
  return { city, state };
}

const LS_RESULTS_KEY = "dvhs.results";
const LS_QUERY_KEY = "dvhs.lastQuery";

/* ───────────────────────────────────────────────────────── component ── */
export default function SearchBar() {
  /* ------------- search text & results ---------------------------- */
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ListingSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  /* ------------- modal / filter state ---------------------------- */
  const [priceModalOpen, setPriceModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    bedsMin: "",
    bathsMin: "",
    sqftMin: "",
    propertyTypes: [] as string[],
  });

  async function runSearch(localFilters = filters) {
    const parsed = parseInput(query);
    if (!parsed) return; // no valid city -> do nothing

    setHasSearched(true);
    setLoading(true);
    setError(null);
    setResults([]);

    /* build qs exactly as Express expects */
    const qs = new URLSearchParams({
      city: parsed.city,
      state: parsed.state,
      top: "25",
      priceMin: localFilters.priceMin,
      priceMax: localFilters.priceMax,
      bedsMin: localFilters.bedsMin,
      bathsMin: localFilters.bathsMin,
      sqftMin: localFilters.sqftMin,
      propertyTypes: localFilters.propertyTypes.join(","),
    }).toString();

    try {
      const res = await fetch(`/api/listings?${qs}`);
      if (!res.ok) throw new Error(`search failed: ${res.status}`);

      const { results: bare } = (await res.json()) as {
        results: Omit<ListingSummary, "thumbnail">[];
      };

      const withThumbs: ListingSummary[] = await Promise.all(
        bare.map(async (l) => {
          try {
            const p = await fetch(`/api/listings/${l.Id}/photo`);
            const { uri } = p.ok ? await p.json() : { uri: "" };
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
  }

  /* ───────────────────────── load / persist results (localStorage) ── */
  useEffect(() => {
    const cached = localStorage.getItem(LS_RESULTS_KEY);
    const lastQ = localStorage.getItem(LS_QUERY_KEY);
    if (cached) {
      try {
        setResults(JSON.parse(cached));
        setHasSearched(true);
      } catch {
        // intentionally ignore JSON parse errors
      }
    }
    if (lastQ) setQuery(lastQ);
  }, []);

  useEffect(() => {
    if (results.length)
      localStorage.setItem(LS_RESULTS_KEY, JSON.stringify(results));
  }, [results]);

  /* ───────────────────────────── submit handler ─────────────────── */
  async function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    localStorage.setItem(LS_QUERY_KEY, query); // persist query
    await runSearch(); // run search with current filters
  }

  /* ─────────────────────────────── UI ───────────────────────────── */
  return (
    <section
      className="search-bar-header"
      aria-label="filters"
    >
      {/* text input / search btn */}
      <div className="search-bar-box">
        <form onSubmit={handleSearchSubmit}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search by city (e.g. "Surprise, AZ")…'
            aria-label="City search"
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

      {/* filter buttons */}
      <div className="search-bar-filter-row">
        <button
          className="search-bar-filter-btn-price"
          onClick={() => setPriceModalOpen(true)}
        >
          Price ▾
        </button>

        {/* other buttons (beds, home-type, more)… */}
        <button className="search-bar-filter-btn-beds">Beds & Baths ▾</button>
        <button className="search-bar-filter-btn-home-type">Home Type ▾</button>
        <button className="search-bar-filter-btn-more">More ▾</button>

        <button className="search-bar-save-btn">Save search</button>
      </div>

      {/* price modal */}
      <PriceModal
        isOpen={priceModalOpen}
        onClose={() => setPriceModalOpen(false)}
        onApply={(min, max) => {
          const next = { ...filters, priceMin: min, priceMax: max };
          setFilters(next); // update local state
          setPriceModalOpen(false); // hide the modal
          runSearch(next); // 🔑 immediately re-search
        }}
      />

      {/* messages & results */}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="text-gray-600 mb-4">Searching…</p>}
      {!loading && hasSearched && results.length === 0 && !error && (
        <p>No listings found for “{query}”.</p>
      )}
      {!loading && results.length > 0 && <ListingGrid listings={results} />}
    </section>
  );
}
