import type React from "react";
import { useEffect, useMemo, useState } from "react";
import "../css/blog.css";

interface PostFromAPI {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  coverImg: string;
  slug: string;
  tags: string[]; // used as “categories”
  content: string;
}

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export const BlogHome: React.FC = () => {
  /* ---------------- state ---------------- */
  const [posts, setPosts] = useState<PostFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        console.log("BEFORE FETCH: Fetching posts from API:", API);
        const res = await fetch(`${API}/api/posts`);
        console.log("AFTER FETCH: Response status:", res.status);
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data: PostFromAPI[] = await res.json();
        /* newest first – Prisma already orders by date DESC, but
           we sort defensively in case that ever changes */
        data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setPosts(data);
      } catch (e: unknown) {
        console.error(e);
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------------- derived helpers ---------------- */
  /** Five most-recent posts */
  const recent = useMemo(() => posts.slice(0, 5), [posts]);

  /** Group by the post’s first tag (you can tweak) */
  const grouped = useMemo(() => {
    const map: Record<string, PostFromAPI[]> = {};
    for (const p of posts) {
      const cat = p.tags[0] ?? "Misc";
      (map[cat] ||= []).push(p);
    }
    return map;
  }, [posts]);

  /* ---------------- render ---------------- */
  if (loading) return <p className="blog-root">Loading posts…</p>;
  if (error) return <p className="blog-root error">Error: {error}</p>;

  return (
    <div className="blog-root">
      {/* ---------- slide-out menu ---------- */}
      <aside className={`post-menu ${menuOpen ? "open" : ""}`}>
        <button
          className="close-btn"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          ×
        </button>

        <nav className="menu-categories">
          {Object.entries(grouped).map(([cat, list]) => (
            <div
              key={cat}
              className="category-section"
            >
              <h3>{cat}</h3>
              <ul>
                {list.map((p) => (
                  <li key={p.id}>
                    <a
                      href={p.slug}
                      onClick={() => setMenuOpen(false)}
                    >
                      {p.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* ---------- header ---------- */}
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
          estate. We publish new posts regularly&mdash;check back often!
        </p>
      </header>

      {/* ---------- recent feed ---------- */}
      <section className="recent-feed">
        {recent.map((p) => (
          <a
            key={p.id}
            href={p.slug}
            className="feed-item"
          >
            <img
              src={p.coverImg}
              alt={p.title}
            />
            <div className="feed-info">
              <h3>{p.title}</h3>
              <time dateTime={p.date}>
                {new Date(p.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              <p>{p.description}</p>
            </div>
          </a>
        ))}
      </section>
    </div>
  );
};
