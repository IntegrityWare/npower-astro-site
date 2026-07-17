import React from "react";
import JsonLd from "@/components/shared/JsonLd";

export default function SiteStructuredData() {
  const origin = "https://www.npowersoftware.com";
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "nPower Software",
          url: origin,
          logo: origin + "/assets/favicon.png",
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "nPower Software — Power Surfacing",
          url: origin,
        }}
      />
    </>
  );
}