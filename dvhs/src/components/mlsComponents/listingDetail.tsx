import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ListingSummary } from "../searchBar";

const LS_RESULTS_KEY = "dvhs.results";

const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [listing, setListing] = useState<ListingSummary | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------- optimistic data from localStorage ---------- */
  useEffect(() => {
    if (!id) return;
    const cached = localStorage.getItem(LS_RESULTS_KEY);
    if (cached) {
      try {
        const arr = JSON.parse(cached) as ListingSummary[];
        const hit = arr.find((l) => l.Id === id);
        if (hit) setListing(hit);
      } catch {
        /* ignore */
      }
    }
  }, [id]);

  /* ---------- always refresh from API + fetch big photo ---------- */
  useEffect(() => {
    if (!id) return;

    const run = async () => {
      setLoading(true);
      try {
        /* detail (falls back to cached if 404) */
        const detRes = await fetch(`/api/listings/${id}`);
        if (detRes.ok) {
          const data: ListingSummary = await detRes.json();
          setListing((prev) => ({ ...data, thumbnail: prev?.thumbnail || "" }));
        }

        /* photo */
        const photoRes = await fetch(`/api/listings/${id}/photo`);
        if (photoRes.ok) {
          const { uri } = await photoRes.json();
          if (uri) setPhotoUrl(uri);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id]);

  /* ---------- format helpers ---------- */
  const fmtPrice = listing?.ListPrice?.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const fmtArea = listing?.LivingArea?.toLocaleString();

  /* ---------- render ---------- */
  if (loading && !listing) return <div>Loading listing details…</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!listing) return null;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      {(photoUrl || listing.thumbnail) && (
        <img
          src={photoUrl || listing.thumbnail}
          alt={listing.UnparsedAddress}
          style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
        />
      )}

      <h2 style={{ fontSize: "1.5em", marginBottom: 8 }}>
        {listing.UnparsedAddress}
      </h2>

      <p style={{ fontWeight: 700, fontSize: "1.2em", margin: "4px 0" }}>
        {fmtPrice ?? "—"}
      </p>

      <p style={{ margin: "4px 0" }}>
        {listing.BedsTotal ?? "—"} Beds • {listing.BathsTotal ?? "—"} Baths •{" "}
        {fmtArea ?? "—"} sq ft
      </p>

      <p style={{ margin: "4px 0" }}>Status: {listing.MlsStatus ?? "—"}</p>
    </div>
  );
};

export default ListingDetail;
