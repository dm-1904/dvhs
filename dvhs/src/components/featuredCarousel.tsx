import { useKeenSlider } from "keen-slider/react";
import { Link } from "react-router-dom";
import "keen-slider/keen-slider.min.css";
import "../css/featuredCarousel.css";

interface Listing {
  id: string;
  image: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  address: string;
  href: string;
}

const listings: Listing[] = [
  {
    id: "1",
    image: "/exampleHouse.png",
    price: "$589,900",
    beds: "2 Beds",
    baths: "2 Baths",
    sqft: "1,800 sqft",
    address: "1234 Desert Valley Dr, Phoenix, AZ 85001",
    href: "/listings/1",
  },
  {
    id: "2",
    image: "/exampleHouse.png",
    price: "$701,900",
    beds: "4 Beds",
    baths: "3 Baths",
    sqft: "2,400 sqft",
    address: "15501 W Bell Rd, Surprise, AZ 85374",
    href: "/listings/2",
  },
  {
    id: "3",
    image: "/exampleHouse.png",
    price: "$489,900",
    beds: "2 Beds",
    baths: "2 Baths",
    sqft: "2,800 sqft",
    address: "3345 W Waddell Rd, Phoenix, AZ 85001",
    href: "/listings/3",
  },
  {
    id: "4",
    image: "/exampleHouse.png",
    price: "$601,000",
    beds: "3 Beds",
    baths: "2.5 Baths",
    sqft: "1,800 sqft",
    address: "1234 Desert Valley Dr, Scottsdale, AZ 85001",
    href: "/listings/4",
  },
  {
    id: "5",
    image: "/exampleHouse.png",
    price: "$225,000",
    beds: "2 Beds",
    baths: "2 Baths",
    sqft: "1,800 sqft",
    address: "987 W Camino Del Sol, Phoenix, AZ 85001",
    href: "/listings/5",
  },
  {
    id: "6",
    image: "/exampleHouse.png",
    price: "$389,900",
    beds: "3 Beds",
    baths: "2 Baths",
    sqft: "2,100 sqft",
    address: "634 E Bell Rd, Phoenix, AZ 85001",
    href: "/listings/6",
  },
];
export default function FeaturedCarousel() {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 3, spacing: 18 },
    breakpoints: {
      "(max-width: 1200px)": {
        slides: { perView: 2.2, spacing: 16 },
      },
      "(max-width: 700px)": {
        slides: { perView: 1.2, spacing: 12 },
      },
    },
    loop: true,
    dragSpeed: 0.8,
  });
  return (
    <section className="featured-wrapper">
      <h2 className="featured-heading">Featured Listings</h2>
      <button
        className="arrow left"
        onClick={() => instanceRef.current?.prev()}
      />
      <button
        className="arrow right"
        onClick={() => instanceRef.current?.next()}
      />
      <div
        ref={sliderRef}
        className="keen-slider card-slider"
      >
        {listings.map((listing) => (
          <Link
            to={listing.href}
            key={listing.id}
            className="keen-slider__slide listing-card"
          >
            <img
              src={listing.image}
              alt={listing.address}
            />
            <div className="card-body">
              <h3 className="price">{listing.price}</h3>
              <div className="badge-heart">
                <span className="badge">VIRTUAL TOUR</span>
                <span className="heart">♡</span>
              </div>
              <p className="address">{listing.address}</p>
              <div className="meta">
                <span>{listing.beds}</span> | <span>{listing.baths}</span> |{" "}
                <span>{listing.sqft}</span>
              </div>
              <span className="status">ACTIVE</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="dots">
        {listings.slice(0, 2).map((_, i) => (
          <button
            key={i}
            className="dot"
            onClick={() => instanceRef.current?.moveToIdx(i * 3)}
          />
        ))}
      </div>

      <Link
        to="/listings"
        className="view-more-btn"
      >
        VIEW MORE
      </Link>
    </section>
  );
}
