/**
 * Drop-in replacement for react-router-dom's Link that renders a plain <a> tag.
 * Used so React components render cleanly as static HTML in Astro without needing
 * a router context.
 */
export function Link({ to, href, children, ...props }) {
  return <a href={to ?? href} {...props}>{children}</a>;
}
