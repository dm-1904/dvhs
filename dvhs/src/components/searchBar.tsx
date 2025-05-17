import { useState } from "react";
import "../css/searchHeader.css";

export default function SearchBar() {
  const [query, setQuery] = useState("Surprise AZ homes");

  return (
    <section
      className="search-bar-header"
      aria-label="filters"
    >
      <div className="search-bar-box">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            /* TODO: trigger search */
          }}
        >
          <input
            type="text"
            placeholder="Address, neighborhood, city, ZIP"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />

          {/* {query && (
            <button
              type="button"
              className="icon-btn clear-btn"
              onClick={() => setQuery("")}
              aria-label="Clear search text"
            >
              Clear
            </button>
          )} */}

          <button
            type="submit"
            className="icon-btn submit-btn"
            aria-label="Submit search"
          >
            Search
          </button>
        </form>
      </div>

      <div className="search-bar-filter-row">
        <button className="search-bar-filter-btn">Price ▾</button>
        <button className="search-bar-filter-btn">Beds & Baths ▾</button>
        <button className="search-bar-filter-btn">Home Type ▾</button>
        <button className="search-bar-filter-btn">More ▾</button>

        <button className="search-bar-save-btn">Save search</button>
      </div>
    </section>
  );
}
