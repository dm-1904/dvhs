/*
  SearchBar

  ▸ Builds a QS the proxy understands:
      /api/listings?city=Surprise&state=AZ&top=25&priceMin=400000&bedsMin=3…
  ▸ Runs a search whenever the user:
      – hits the main "Search" button
      – clicks "Apply" in any modal
*/

import { FormEvent, useEffect, useState } from "react";
import "../css/searchBar.css";
import { ListingGrid } from "./mlsComponents/listingGrid";
import { PriceModal } from "./mlsComponents/mlsModals/priceModal";
import { BedBathModal } from "./mlsComponents/mlsModals/bedBathModal";
import { PropertyTypeModal } from "./mlsComponents/mlsModals/homeType";
import { ActiveFiltersBar } from "./mlsComponents/activeFiltersBar";

/* ──────────────────────── shared types ──────────────────────── */
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

export interface FiltersState {
  priceMin: string;
  priceMax: string;
  bedsMin: string;
  bathsMin: string;
  sqftMin: string;
  den: boolean;
  /** comma-separated Spark values (“Single Family Residence”, “Townhouse”…). */
  propertyTypes: string[];
}

/* ──────────────────────── helpers ───────────────────────────── */
function parseInput(raw: string): { city: string; state: string } | null {
  const text = raw.trim().replace(/\s{2,}/g, " ");
  if (!text) return null;

  const [city = "", maybeState] = text.split(/[, ]+/);
  const state =
    maybeState && maybeState.length === 2 ? maybeState.toUpperCase() : "AZ";
  return { city, state };
}

const LS_RESULTS_KEY = "dvhs.results";
const LS_QUERY_KEY = "dvhs.lastQuery";

/* ───────────────────────── component ────────────────────────── */
export default function SearchBar() {
  /* ---------- search textbox & results ----------- */
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ListingSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  /* ---------- filters & modal state -------------- */
  const [priceOpen, setPriceOpen] = useState(false);
  const [bedBathOpen, setBedBathOpen] = useState(false);
  const [ptypeModalOpen, setPtypeModalOpen] = useState(false);

  const [filters, setFilters] = useState<FiltersState>({
    priceMin: "",
    priceMax: "",
    bedsMin: "",
    bathsMin: "",
    sqftMin: "",
    den: false,
    propertyTypes: [],
  });

  /* ---------- read localStorage on mount --------- */
  useEffect(() => {
    const cached = localStorage.getItem(LS_RESULTS_KEY);
    const lastQ = localStorage.getItem(LS_QUERY_KEY);
    if (cached) {
      try {
        setResults(JSON.parse(cached));
        setHasSearched(true);
      } catch {
        // ignore invalid JSON
      }
    }
    if (lastQ) setQuery(lastQ);
  }, []);

  /* ---------- persist new results ---------------- */
  useEffect(() => {
    if (results.length) {
      localStorage.setItem(LS_RESULTS_KEY, JSON.stringify(results));
    }
  }, [results]);

  /* ───────────────────────── runSearch ───────────────────────── */
  async function runSearch(custom = filters) {
    const parsed = parseInput(query);
    if (!parsed) return; // invalid city → do nothing

    setHasSearched(true);
    setLoading(true);
    setError(null);
    setResults([]);

    /* Build QS exactly like the Express router expects */
    const qs = new URLSearchParams({
      city: parsed.city,
      state: parsed.state,
      top: "25",

      /* optional params – blank strings are ignored by Express */
      priceMin: custom.priceMin,
      priceMax: custom.priceMax,
      bedsMin: custom.bedsMin,
      bathsMin: custom.bathsMin,
      sqftMin: custom.sqftMin,
      den: custom.den ? "true" : "",
      propertyTypes: custom.propertyTypes.join(","),
    });

    try {
      const res = await fetch(`/api/listings?${qs.toString()}`);
      if (!res.ok) throw new Error(`search failed: ${res.status}`);

      const { results: bare } = (await res.json()) as {
        results: Omit<ListingSummary, "thumbnail">[];
      };

      /* thumbnail fetches in parallel */
      const withThumbs = await Promise.all(
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
      setError(err instanceof Error ? err.message : "Unexpected error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  /* ---------- main form submit ------------------- */
  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    localStorage.setItem(LS_QUERY_KEY, query);
    await runSearch(); // run with current filters
  }

  /* ───────────────────────── UI ──────────────────────────────── */
  return (
    <section
      className="search-bar-header"
      aria-label="filters"
    >
      {/* ▸ search bar */}
      <div className="search-bar-box">
        <form onSubmit={handleSubmit}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search by city (e.g. "Surprise, AZ")…'
            aria-label="City search"
          />
          <button
            type="submit"
            id="search-btn"
            className="icon-btn submit-btn"
          >
            Search
          </button>
        </form>
      </div>

      {/* ▸ filter row */}
      <div className="search-bar-filter-row">
        {/* Price */}
        <button
          className="search-bar-filter-btn-price"
          onClick={() => setPriceOpen(true)}
        >
          Price ▾
        </button>
        <PriceModal
          isOpen={priceOpen}
          onClose={() => setPriceOpen(false)}
          onApply={(min, max) => {
            const next = { ...filters, priceMin: min, priceMax: max };
            setFilters(next);
            setPriceOpen(false);
            runSearch(next);
          }}
        />

        {/* Beds & Baths */}
        <button
          className="search-bar-filter-btn-beds"
          onClick={() => setBedBathOpen(true)}
        >
          Beds &amp; Baths ▾
        </button>
        <BedBathModal
          isOpen={bedBathOpen}
          onClose={() => setBedBathOpen(false)}
          onApply={(beds, baths, den) => {
            const next = { ...filters, bedsMin: beds, bathsMin: baths, den };
            setFilters(next);
            setBedBathOpen(false);
            runSearch(next);
          }}
        />

        {/* (future) Home Type & More buttons */}
        <button
          className="search-bar-filter-btn-home-type"
          onClick={() => setPtypeModalOpen(true)}
        >
          Home Type ▾
        </button>

        <PropertyTypeModal
          isOpen={ptypeModalOpen}
          onClose={() => setPtypeModalOpen(false)}
          onApply={(types) => {
            const next = { ...filters, propertyTypes: types };
            setFilters(next);
            runSearch(next); // immediately re-search
          }}
        />

        <button className="search-bar-filter-btn-more">More ▾</button>

        <button className="search-bar-save-btn">Save search</button>
      </div>

      <ActiveFiltersBar
        filters={filters}
        onUpdate={(next) => {
          setFilters(next);
          runSearch(next); // immediately re-query
        }}
        onReset={() => {
          const cleared: FiltersState = {
            priceMin: "",
            priceMax: "",
            bedsMin: "",
            bathsMin: "",
            sqftMin: "",
            den: false,
            propertyTypes: [],
          };
          setFilters(cleared);
          runSearch(cleared);
        }}
      />

      {/* ▸ feedback + results */}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="text-gray-600 mb-4">Searching…</p>}
      {!loading && hasSearched && results.length === 0 && !error && (
        <p>No listings found for “{query}”.</p>
      )}
      {!loading && results.length > 0 && <ListingGrid listings={results} />}
    </section>
  );
}
