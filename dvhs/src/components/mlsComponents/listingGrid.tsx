import React from "react";
import { ListingCard } from "./listingCard";
import { ListingSummary } from "../searchBar";
import "../../css/mlsComponents.css";

interface ListingGridProps {
  listings: ListingSummary[];
}

export const ListingGrid: React.FC<ListingGridProps> = ({ listings }) => (
  <div className="listing-grid">
    {listings.map((listing) => (
      <ListingCard
        key={listing.Id}
        listing={listing}
      />
    ))}
  </div>
);
