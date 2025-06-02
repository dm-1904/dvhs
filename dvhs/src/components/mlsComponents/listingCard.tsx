import React from "react";
import { Link } from "react-router-dom";
import { ListingSummary } from "../searchBar";
import "../../css/mlsComponents.css";

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

  return (
    <Link
      to={`/listing/${listing.Id}`}
      className="listing-card-box"
    >
      {/* image */}
      <div className="listing-card-image-box">
        {listing.thumbnail ? (
          <img
            src={listing.thumbnail}
            alt={listing.UnparsedAddress}
            className="listing-card-image"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder-house.png";
            }}
          />
        ) : (
          <div className="no-image">No Image</div>
        )}
        <span className="mls-status">{listing.MlsStatus ?? "—"}</span>
      </div>

      {/* text */}
      <div className="listing-data-box">
        <p className="listing-price">{priceStr}</p>
        <p className="listing-address">
          {listing.UnparsedAddress ?? "Address unavailable"}
        </p>
        <p className="listing-bed-bath-area">
          {beds} Beds&nbsp;|&nbsp;{baths} Baths&nbsp;|&nbsp;{area}&nbsp;sq ft
        </p>
        <div className="listing-tour-fav-box">
          <div className="virtual-tour">
            <span>VIRTUAL TOUR</span>
          </div>
          <div className="favorite">
            <span id="favorite-btn">★</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
