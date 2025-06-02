import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

const ListingDetail: React.FC = () => {
  // Get the listing ID from the URL parameters
  const { id } = useParams<{ id: string }>();

  // State for the listing data, photo URL, loading, and error
  const [listing, setListing] = useState<ListingSummary | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch listing detail data from the Spark API (via backend endpoint)
        const listingRes = await fetch(`/api/Listings/${id}`);
        if (!listingRes.ok) {
          if (listingRes.status === 404) {
            // If the backend route is not implemented or listing not found, use placeholder data
            const dummyListing: ListingSummary = {
              Id: "none",
              ListPrice: 0,
              BedsTotal: 0,
              BathsTotal: 0,
              LivingArea: 0,
              MlsStatus: "N/A",
              UnparsedAddress: "Address not available",
              thumbnail: "",
            };
            setListing(dummyListing);
            // Use a placeholder image for now
            setPhotoUrl("https://via.placeholder.com/600x400?text=No+Image");
            return; // Skip fetching photo from API
          } else {
            throw new Error(
              `Failed to fetch listing details (status ${listingRes.status})`
            );
          }
        }
        const listingData: ListingSummary = await listingRes.json();
        setListing(listingData);

        // Fetch the first photo for the listing
        try {
          const photoRes = await fetch(`/api/Listings/${id}/photo`);
          if (!photoRes.ok) {
            throw new Error("Photo fetch failed");
          }
          const photoData = await photoRes.json();
          if (Array.isArray(photoData) && photoData.length > 0) {
            // If the endpoint returns an array of photos, use the first one
            setPhotoUrl(photoData[0].uri);
          } else if (photoData && photoData.uri) {
            // If the endpoint returns a single photo object with a uri
            setPhotoUrl(photoData.uri);
          } else {
            // Unexpected format: use thumbnail as fallback
            setPhotoUrl(listingData.thumbnail);
          }
        } catch {
          // On error fetching photo, fall back to thumbnail (or leave blank if not available)
          setPhotoUrl(listingData.thumbnail);
        }
      } catch (err) {
        // Handle errors (e.g. network issues, server errors)
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Format price and area for display
  const formattedPrice = listing
    ? listing.ListPrice.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })
    : "";
  const formattedArea = listing ? listing.LivingArea.toLocaleString() : "";

  if (loading) {
    return <div>Loading listing details...</div>;
  }
  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }
  if (!listing) {
    return null; // No data to display (shouldn't happen if API returns data)
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px" }}>
      {/* Image section */}
      {(photoUrl || listing.thumbnail) && (
        <img
          src={photoUrl || listing.thumbnail}
          alt={`Photo of ${listing.UnparsedAddress}`}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        />
      )}

      {/* Listing details section */}
      <h2 style={{ fontSize: "1.5em", margin: "0 0 8px" }}>
        {listing.UnparsedAddress}
      </h2>
      <p style={{ fontWeight: "bold", fontSize: "1.2em", margin: "4px 0" }}>
        {formattedPrice}
      </p>
      <p style={{ margin: "4px 0" }}>
        {listing.BedsTotal} {listing.BedsTotal === 1 ? "Bed" : "Beds"} &bull;{" "}
        {listing.BathsTotal} {listing.BathsTotal === 1 ? "Bath" : "Baths"}{" "}
        &bull; {formattedArea} Sq Ft
      </p>
      <p style={{ margin: "4px 0" }}>Status: {listing.MlsStatus}</p>
    </div>
  );
};

export default ListingDetail;
