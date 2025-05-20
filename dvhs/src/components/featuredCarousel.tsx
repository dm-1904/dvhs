import { useRef } from "react";
import { Link } from "react-router-dom";

/* ─────────── Swiper imports ─────────── */
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
  /* create refs so we can use custom arrow buttons */
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  return (
    <section className="featured-wrapper">
      <h2 className="featured-heading">Featured Listings</h2>

      {/* custom arrows */}
      <button
        ref={prevRef}
        className="nav-arrow prev"
        aria-label="Previous"
      />
      <button
        ref={nextRef}
        className="nav-arrow next"
        aria-label="Next"
      />

      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper: import("swiper").Swiper) => {
          // @ts-expect-error: swiper types don’t know our refs
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-expect-error: swiper types don’t know our refs
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        pagination={{ clickable: true }}
        loop
        spaceBetween={16}
        slidesPerView={3}
        breakpoints={{
          1200: { slidesPerView: 3 },
          700: { slidesPerView: 2 },
          0: { slidesPerView: 1.2 },
        }}
        className="card-slider"
      >
        {listings.map((l) => (
          <SwiperSlide key={l.id}>
            <Link
              to={l.href}
              className="listing-card"
            >
              <img
                src={l.image}
                alt={l.address}
              />
              <div className="card-body">
                <h3 className="price">{l.price}</h3>

                <div className="badge-heart">
                  <span className="badge">VIRTUAL TOUR</span>
                  <span className="heart">♡</span>
                </div>

                <p className="address">{l.address}</p>

                <div className="meta">
                  <span>{l.beds}</span> | <span>{l.baths}</span> |{" "}
                  <span>{l.sqft}</span>
                </div>

                <span className="status">ACTIVE</span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <Link
        to="/listings"
        className="view-more-btn"
      >
        VIEW MORE
      </Link>
    </section>
  );
}
