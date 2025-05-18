import type React from "react";
import { useState } from "react";
import "../css/blog.css";

interface Post {
  id: number;
  title: string;
  date: string;
  image: string;
  excerpt: string;
  slug: string;
}

/* ───────────────────────────────────────────
   Dummy data – replace with API call or CMS  */
const ALL_POSTS: Post[] = [
  {
    id: 1,
    title: "Phoenix Market Update – May 2025",
    date: "May 10, 2025",
    image: "/blog/may_market.jpg",
    excerpt:
      "Inventory is creeping up, but mortgage rates remain steady. Here's what it means for buyers and sellers…",
    slug: "/blog/phoenix-market-update-may-2025",
  },
  {
    id: 2,
    title: "5 Mistakes to Avoid When Pricing Your West Valley Home",
    date: "Apr 28, 2025",
    image: "/blog/pricing_mistakes.jpg",
    excerpt:
      "Setting the right price is the #1 factor in how fast (and for how much) your property sells…",
    slug: "/blog/5-pricing-mistakes-west-valley",
  },
  // …more posts…
];

const RECENT = ALL_POSTS.slice(0, 5);

export const BlogHome: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="blog-root">
      <aside className={`post-menu ${menuOpen ? "open" : ""}`}>
        <button
          className="close-btn"
          onClick={() => setMenuOpen(false)}
        >
          X
        </button>
        <h3>All Posts</h3>
        <ul>
          {ALL_POSTS.map((post) => (
            <li key={post.id}>
              <a href={post.slug}>{post.title}</a>
            </li>
          ))}
        </ul>
      </aside>

      <header className="blog-header">
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(true)}
        >
          ☰ Posts
        </button>
        <h1>Phoenix Valley Real-Estate Insights</h1>
        <p className="synopsis">
          Welcome to the Ryon Group Blog — your resource for up-to-date market
          insights, tips for buyers &amp; sellers, and everything happening in
          Greater Phoenix real estate. We publish new posts regularly, so check
          back often!
        </p>
      </header>

      <section className="recent-feed">
        {RECENT.map((post) => (
          <a
            key={post.id}
            href={post.slug}
            className="feed-item"
          >
            <img
              src={post.image}
              alt={post.title}
            />
            <div className="feed-info">
              <h3>{post.title}</h3>
              <time>{post.date}</time>
              <p>{post.excerpt}</p>
            </div>
          </a>
        ))}
      </section>
    </div>
  );
};
