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
  category: string;
}

/* ───────────────────────────────────────────
   Dummy data – replace with API call or CMS  */
const ALL_POSTS: Post[] = [
  {
    id: 1,
    title: "Phoenix Market Update – May 2025",
    slug: "/blog/phoenix-market-update-may-2025",
    image: "/blog/may_market.jpg",
    excerpt: "Inventory is creeping up…",
    date: "May 10, 2025",
    category: "Market News",
  },
  {
    id: 2,
    title: "5 Pricing Mistakes in West Valley",
    slug: "/blog/pricing-mistakes-west-valley",
    image: "/blog/pricing_mistakes.jpg",
    excerpt: "Setting the right price…",
    date: "Apr 28, 2025",
    category: "Seller Tips",
  },
  {
    id: 3,
    title: "Buyer’s Guide to Phoenix Suburbs",
    slug: "/blog/buyers-guide-suburbs",
    image: "/blog/buyers_guide.jpg",
    excerpt: "What to look out for…",
    date: "Apr 15, 2025",
    category: "Buyer Tips",
  },
  {
    id: 4,
    title: "Understanding Mortgage Rates",
    slug: "/blog/understanding-mortgage-rates",
    image: "/blog/mortgage_rates.jpg",
    excerpt: "Why rates fluctuate…",
    date: "Apr 2, 2025",
    category: "Finance",
  },
  {
    id: 5,
    title: "How to Stage Your Home",
    slug: "/blog/how-to-stage-your-home",
    image: "/blog/staging.jpg",
    excerpt: "First impressions matter…",
    date: "Mar 20, 2025",
    category: "Seller Tips",
  },
  {
    id: 6,
    title: "Retirement Communities in Phoenix",
    slug: "/blog/retirement-communities-phoenix",
    image: "/blog/retirement_communities.jpg",
    excerpt: "Discover the best retirement communities in Phoenix.",
    date: "May 11, 2025",
    category: "Retirement Communities",
  },
];

const groupedPosts = ALL_POSTS.reduce<Record<string, Post[]>>((acc, post) => {
  acc[post.category] = acc[post.category] || [];
  acc[post.category].push(post);
  return acc;
}, {});

const RECENT = ALL_POSTS.slice(-5).reverse();

export const BlogHome: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="blog-root">
      <aside className={`post-menu ${menuOpen ? "open" : ""}`}>
        <button
          className="close-btn"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          X
        </button>
        <h3>All Posts</h3>
        {/* <ul>
          {ALL_POSTS.map((post) => (
            <li key={post.id}>
              <a href={post.slug}>{post.title}</a>
            </li>
          ))}
        </ul> */}

        <nav className="menu-categories">
          {Object.entries(groupedPosts).map(([category, posts]) => (
            <div className="category-section">
              <h3>{category}</h3>
              <ul>
                {posts.map((posts) => (
                  <li key={posts.id}>
                    <a
                      href={posts.slug}
                      onClick={() => setMenuOpen(false)}
                    >
                      {posts.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <header className="blog-header">
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(true)}
          aria-label="Open posts menu"
        >
          ☰ Posts
        </button>
        <h1>Phoenix Valley Real-Estate Insights</h1>
        <p className="synopsis">
          Welcome to your resource for up-to-date market insights, tips for
          buyers &amp; sellers, and everything happening in Greater Phoenix real
          estate. We publish new posts regularly, so check back often!
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
