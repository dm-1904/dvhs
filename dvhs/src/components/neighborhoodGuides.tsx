import { Link } from "react-router-dom";
import "../css/neighborhoodGuides.css";

interface CityCard {
  name: string;
  img: string;
  blurb: string;
  href: string;
}

const cities: CityCard[] = [
  {
    name: "Goodyear",
    img: "/goodyear.jpg",
    blurb:
      "Goodyear is surrounded by desert vistas, golf courses, parks, palm‑lined streets, and scenic mountain views.",
    href: "/guides/goodyear",
  },
  {
    name: "Sun City",
    img: "/sunCity.jpg",
    blurb:
      "Arizona’s famous active‑adult community with golf, recreation centers, and year‑round sunshine.",
    href: "/guides/sun-city",
  },
  {
    name: "Surprise",
    img: "/surprise.jpg",
    blurb:
      "Surprise combines new‑build neighborhoods, MLB spring training, and quick access to the White Tank Mountains.",
    href: "/guides/surprise",
  },
];

export default function NeighborhoodGuides() {
  return (
    <section className="guides-wrapper">
      <h2 className="guides-heading">Neighborhood Guides</h2>

      <div className="guide-grid">
        {cities.map((city) => (
          <Link
            key={city.name}
            to={city.href}
            className="guide-card"
          >
            <img
              src={city.img}
              alt={city.name}
            />
            <div className="guide-overlay">
              <h3 className="guide-title">{city.name}</h3>
              <p className="guide-blurb">{city.blurb}</p>
              {/* outline element */}
              <span className="guide-border" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
