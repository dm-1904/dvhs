import React from "react";
import "../css/priceFilter.css"; // adjust path as needed

export type SortOrder = "asc" | "desc";

interface Props {
  /** Current sort order coming from parent state */
  order: SortOrder;
  /** Callback fired with the *next* order after user clicks */
  onChange: (next: SortOrder) => void;
}

export const PriceFilter: React.FC<Props> = ({ order, onChange }) => {
  const arrow = order === "asc" ? "▲" : "▼";

  function handleClick() {
    const next: SortOrder = order === "asc" ? "desc" : "asc";
    onChange(next);
  }

  return (
    <button
      className="psb-btn"
      onClick={handleClick}
      aria-label={`Sort price ${order === "asc" ? "descending" : "ascending"}`}
    >
      Price&nbsp;{arrow}
    </button>
  );
};
