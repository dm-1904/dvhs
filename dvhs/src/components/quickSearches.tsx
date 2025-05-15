import { Link } from "react-router-dom";
import "../css/quickSearches.css";

interface Searches {
  location: string;
}

const searches: Searches[] = [
  { location: "Surprise" },
  { location: "Corte Bella" },
  { location: "Goodyear" },
  { location: "Litchfield Park" },
  { location: "Marley Park" },
  { location: "Vistancia" },
  { location: "Pebblecreek" },
  { location: "Rancho Gabriela" },
  { location: "Sun City" },
  { location: "Sun City West" },
  { location: "Sun City Grand" },
  { location: "Waddell" },
  { location: "Wigwam" },
];

export default function QuickSearches() {
  return (
    <section className="quick-searches">
      <h2 className="quick-searches-heading">Quick Searches</h2>
      <span className="heading-underline" />
      <div className="quick-searches-grid">
        {searches.map((search) => (
          <div
            key={search.location}
            className="quick-search-card"
          >
            <Link
              key={location}
              to={`/search/${search.location}`}
              className="quick-search-card"
            >
              <h3>Homes for Sale in {search.location}</h3>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
