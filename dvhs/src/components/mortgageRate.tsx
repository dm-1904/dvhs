import { useEffect, useState } from "react";
import "../css/mortgageRate.css";

interface RateSlice {
  frm_30: string;
  frm_15: string;
  week: string;
}

export const MortgageRate = () => {
  const [rates, setRates] = useState<RateSlice | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://api.api-ninjas.com/v1/mortgagerate", {
          headers: {
            "X-Api-Key": import.meta.env.VITE_API_INTEREST_RATE_KEY ?? "",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch mortgage rates");

        const json = await res.json();

        if (Array.isArray(json) && json.length) {
          setRates(json[0].data);
        } else {
          throw new Error("Unexpected API response");
        }
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message ?? "Unknown error");
        } else {
          setError("Unknown error");
        }
      }
    })();
  }, []);

  if (error || !rates) return null;

  const asOf = new Date(rates.week).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mortgage-bar">
      <span className="label">
        *Current Mortgage Interest Rates as of {asOf}:{" "}
      </span>
      <span className="rate">30-Year Fixed {rates.frm_30}%</span>
      <span className="rate">15-Year Fixed {rates.frm_15}%</span>
    </div>
  );
};
