import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

export function jsxToHtml(node: ReactElement): string {
  return renderToStaticMarkup(node);
}
