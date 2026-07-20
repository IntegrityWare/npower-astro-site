import React from "react";
import JsonLd from "@/components/shared/JsonLd";
import { getProductStructuredData } from "@/seo-content/productStructuredData";

export default function ReStudioStructuredData() {
  return <JsonLd data={getProductStructuredData("power-surfacing-re-studio")} />;
}
