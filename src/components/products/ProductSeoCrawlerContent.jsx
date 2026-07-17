import React from "react";

// Hidden, crawler-readable mirror of the product page content.
// Driven by the same product data as the visible page, so it stays in sync automatically.
export default function ProductSeoCrawlerContent({ product }) {
  return (
    <div className="sr-only" aria-hidden="false">
      <p>{product.description}</p>
      <h2>{product.tagline}</h2>
      <p>{product.platform} software · {product.category}</p>
      <h2>Quick Facts</h2>
      <p>Imports: {product.inputs.join(", ")}. Exports: {product.outputs.join(", ")}.</p>
      <h2>Who Is It For</h2>
      <ul>
        {product.whoIsItFor.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <h2>Key Benefits</h2>
      <ul>
        {product.benefits.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <h2>Key Features</h2>
      <ul>
        {product.features.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <h2>Use Cases</h2>
      <ul>
        {product.useCases.map((item) => <li key={item}>{item}</li>)}
      </ul>
      {product.pricing?.options && (
        <>
          <h2>Pricing</h2>
          <ul>
            {product.pricing.options.map((opt) => (
              <li key={opt.label}>{opt.label} — {opt.price}{opt.period || ""}{opt.detail ? `. ${opt.detail}` : ""}</li>
            ))}
          </ul>
          {product.pricing.note && <p>{product.pricing.note}</p>}
        </>
      )}
      <ul>
        <li><a href="/pricing/trials">Download a Free Trial</a></li>
        <li><a href="/products/comparison">Compare Power Surfacing Products</a></li>
        <li><a href="/resources/demos">Watch Product Demos</a></li>
      </ul>
    </div>
  );
}