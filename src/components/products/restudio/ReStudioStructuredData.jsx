import React from "react";
import JsonLd from "@/components/shared/JsonLd";

export default function ReStudioStructuredData({ product }) {
  const origin = "https://www.npowersoftware.com";
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Power Surfacing RE Studio",
        operatingSystem: "Windows",
        applicationCategory: "DesignApplication",
        applicationSubCategory: "Reverse Engineering / Scan-to-CAD",
        description: "Standalone Windows reverse-engineering and scan-to-CAD software for reconstructing 3D scan meshes, STL files and polygon models as editable CAD surfaces and solids.",
        url: origin + "/products/power-surfacing-re-studio",
        screenshot: product.image,
        publisher: { "@type": "Organization", name: "nPower Software" },
        installUrl: origin + "/pricing/trials",
        offers: [
          {
            "@type": "Offer",
            name: "Perpetual License",
            price: "6995",
            priceCurrency: "USD",
            url: origin + "/products/power-surfacing-re-studio",
          },
          {
            "@type": "Offer",
            name: "Annual Subscription (first year)",
            price: "2995",
            priceCurrency: "USD",
            url: origin + "/products/power-surfacing-re-studio",
          },
        ],
      }}
    />
  );
}