/**
 * Drop-in replacement for react-router-dom's Link that renders a plain <a> tag.
 * Used so React components render cleanly as static HTML in Astro without needing
 * a router context.
 */
import { withTrailingSlash } from "@/lib/urls";

export function Link({ to, href, children, ...props }) {
  const target = to ?? href;
  return <a href={withTrailingSlash(target)} {...props}>{children}</a>;
}
