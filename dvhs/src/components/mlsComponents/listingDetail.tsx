import React, {use, useEffect, useState} from "react";
import { useParams, Link } from "react-router-dom";

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

interface ListingDetailData extends ListingSummary {
  images: string[];
  description: string;
}

const API_URL = import.meta.env.VITE_SPARK_API_URL;
const API_ACCESS_TOKEN = import.meta.env.VITE_SPARK_API_ACCESS_TOKEN;

const ListingDetail: React.FC = () => {
  const {Id} = useParams<{ Id: string }>();
  const [listing, setListing] = useState<ListingDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Id) return;
    const fetchListing = async () => {
      setLoading(true);
      setError(null);

      try {
        const url =
      }
    }
  })
}
