import React from "react";
import "../../css/activeFiltersBar.css"; // adjust path as needed
import { FiltersState } from ".././searchBar"; // adjust path as needed

interface Props {
  filters: FiltersState;
  onUpdate: (next: FiltersState) => void;
  onReset: () => void;
}

export const ActiveFiltersBar: React.FC<Props> = ({
  filters,
  onUpdate,
  onReset,
}) => {
  /* transform FiltersState → visible chips */
  const chips = React.useMemo(() => {
    const arr: { id: string; label: string }[] = [];

    if (filters.priceMin || filters.priceMax) {
      const min = filters.priceMin
        ? `$${Number(filters.priceMin).toLocaleString()}`
        : "—";
      const max = filters.priceMax
        ? `$${Number(filters.priceMax).toLocaleString()}`
        : "—";
      arr.push({ id: "price", label: `Price: ${min}–${max}` });
    }
    if (filters.bedsMin)
      arr.push({ id: "bedsMin", label: `${filters.bedsMin}+ Beds` });
    if (filters.bathsMin)
      arr.push({ id: "bathsMin", label: `${filters.bathsMin}+ Baths` });
    if (filters.sqftMin)
      arr.push({ id: "sqftMin", label: `${filters.sqftMin}+ sq ft` });

    if (filters.propertyTypes.length) {
      arr.push({
        id: "ptype",
        label:
          filters.propertyTypes.length === 1
            ? `Type: ${filters.propertyTypes[0]}`
            : `Type: ${filters.propertyTypes.length} selected`,
      });
    }
    return arr;
  }, [filters]);

  /* click the “×” on a chip */
  function handleRemove(id: string) {
    const next: FiltersState = { ...filters };

    switch (id) {
      case "price":
        next.priceMin = "";
        next.priceMax = "";
        break;
      case "bedsMin":
        next.bedsMin = "";
        break;
      case "bathsMin":
        next.bathsMin = "";
        break;
      case "sqftMin":
        next.sqftMin = "";
        break;
      case "ptype":
        next.propertyTypes = [];
        break;
      default:
        break;
    }
    onUpdate(next);
  }

  if (chips.length === 0) return null;

  return (
    <div className="active-filters-bar">
      {chips.map((c) => (
        <span
          key={c.id}
          className="filter-chip"
        >
          {c.label}
          <button
            className="filter-chip-btn"
            aria-label={`Remove ${c.label}`}
            onClick={() => handleRemove(c.id)}
          >
            &times;
          </button>
        </span>
      ))}

      <button
        className="reset-filters-btn"
        onClick={onReset}
        aria-label="Reset all filters"
      >
        Reset&nbsp;All
      </button>
    </div>
  );
};
