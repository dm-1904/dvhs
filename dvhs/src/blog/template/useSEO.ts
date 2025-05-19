import { useEffect } from "react";

export interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  shareImg: string; // full URL
  jsonLd: Record<string, unknown>;
}

export function useSEO({
  title,
  description,
  canonical,
  shareImg,
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    /* -------- <title> -------- */
    document.title = title;

    /* -------- description -------- */
    setMetaTag("description", description);

    /* -------- canonical -------- */
    setLinkTag("canonical", canonical);

    /* -------- Open Graph -------- */
    setMetaProperty("og:type", "article");
    setMetaProperty("og:title", title);
    setMetaProperty("og:description", description);
    setMetaProperty("og:url", canonical);
    setMetaProperty("og:image", shareImg);

    /* -------- Twitter -------- */
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", shareImg);

    /* -------- JSON-LD -------- */
    setJsonLd(jsonLd);
  }, [title, description, canonical, shareImg, jsonLd]);
}

/* Helpers */
function setMetaTag(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setMetaProperty(property: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLinkTag(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(data: Record<string, unknown>) {
  let script = document.head.querySelector<HTMLScriptElement>(
    'script[data-jsonld="article"]'
  );
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.jsonld = "article";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}
