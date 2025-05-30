import React from "react";
import { ListingCard } from "./listingCard";

interface ListingSummary {
  Id: string;
  ListPrice: number;
  BedsTotal: number;
  BathsTotal: number;
  LivingArea: number;
  MlsStatus: string;
  UnparsedAddress: string;
  thumbnail: string;
}

interface ListingGridProps {
  listings: ListingSummary[];
}

export const ListingGrid: React.FC<ListingGridProps> = ({ listings }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard
          key={listing.Id}
          listing={listing}
        />
      ))}
    </div>
  );
};
