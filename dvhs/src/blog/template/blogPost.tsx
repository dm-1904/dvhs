import React from "react";
import { useSEO } from "./useSEO";
import "../../css/blogPost.css";

interface BlogPostProps {
  title: string;
  description: string;
  author: string;
  date: string; // ISO, e.g., "2025-05-14"
  coverImg: string; // /path or https://…
  slug: string; // "/blog/my-post"
  tags?: string[];
  children: React.ReactNode;
}

/* ---- site constants ---- */
const SITE_URL = "https://example.com";
const SITE_NAME = "Phoenix Valley Real-Estate Blog";
const DEFAULT_IMG = "/blog/default-share.jpg";

export default function BlogPost({
  title,
  description,
  author,
  date,
  coverImg,
  slug,
  tags = [],
  children,
}: BlogPostProps) {
  /* full URLs */
  const canonical = `${SITE_URL}${slug}`;
  const shareImg = coverImg || DEFAULT_IMG;

  /* schema.org Article JSON-LD */
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: [`${SITE_URL}${shareImg}`],
    author: { "@type": "Person", name: author },
    datePublished: date,
    dateModified: date,
    mainEntityOfPage: canonical,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
  };

  /* inject SEO on mount/update */
  useSEO({
    title: `${title} | ${SITE_NAME}`,
    description,
    canonical,
    shareImg: `${SITE_URL}${shareImg}`,
    jsonLd: articleLd,
  });

  /* post markup */
  return (
    <article className="blog-post">
      <header>
        <h1>{title}</h1>
        <p className="meta">
          <time dateTime={date}>
            {new Date(date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>{" "}
          · by {author}
        </p>
        <img
          src={coverImg}
          alt={`${title} – hero`}
          className="cover-img"
        />
      </header>

      <section className="post-body">{children}</section>

      {tags.length > 0 && (
        <footer className="tag-list">
          <h3>Tags:</h3>
          <ul>
            {tags.map((t) => (
              <li key={t}>
                <a href={`/tag/${t.toLowerCase()}`}>{t}</a>
              </li>
            ))}
          </ul>
        </footer>
      )}
    </article>
  );
}
