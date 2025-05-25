import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

export function jsxToHtml(node: ReactElement): string {
  return renderToStaticMarkup(node);
}

// const bodyHtml = jsxToHtml(bodyJsx);

// async function publish() {
//   await fetch(`${API}/posts`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       title:
//         "Homes for Sale in Surprise AZ: Why Everyone's Suddenly Talking About This Hidden Gem",
//       description:
//         "Discover why homes for sale in Surprise AZ are attracting attention. Learn about neighborhoods, prices, and the lifestyle that makes this West Valley city special.",
//       author: "Damon Ryon",
//       date: "2025-05-21",
//       coverImg: "/surprise.jpg",
//       slug: "/blog/homes-for-sale-in-surprise-az",
//       tags: ["Surprise AZ"],
//       content: bodyHtml,
//     }),
//   });
// }
