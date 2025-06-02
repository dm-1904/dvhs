import React from "react";
import { Link } from "react-router-dom";

interface ListingSummary {
  Id: string;
  ListPrice?: number;
  BedsTotal?: number;
  BathsTotal?: number;
  LivingArea?: number;
  MlsStatus?: string;
  UnparsedAddress?: string;
  thumbnail?: string;
}

interface ListingCardProps {
  listing: ListingSummary;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const priceStr =
    typeof listing.ListPrice === "number"
      ? "$" + listing.ListPrice.toLocaleString()
      : "N/A";

  const beds = listing.BedsTotal ?? "—";
  const baths = listing.BathsTotal ?? "—";
  const area =
    typeof listing.LivingArea === "number"
      ? listing.LivingArea.toLocaleString()
      : "—";

  const status = listing.MlsStatus ?? "—";
  const addr = listing.UnparsedAddress ?? "Address unavailable";

  return (
    <Link
      to={`/listing/${listing.Id}`}
      className="block bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300"
    >
      {/* ── image ─────────────────────────────────────────────── */}
      <div className="relative">
        {listing.thumbnail ? (
          <img
            src={listing.thumbnail}
            alt={addr}
            className="w-full h-48 object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder-house.png";
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded">
          {status}
        </span>
      </div>

      {/* ── text ──────────────────────────────────────────────── */}
      <div className="p-4">
        <p className="text-lg font-semibold text-gray-800">{priceStr}</p>
        <p className="text-sm text-gray-600">
          {beds} Beds&nbsp;|&nbsp;{baths} Baths&nbsp;|&nbsp;{area}&nbsp;sq ft
        </p>
        <p className="text-sm text-gray-800 mt-1">{addr}</p>
      </div>
    </Link>
  );
};
