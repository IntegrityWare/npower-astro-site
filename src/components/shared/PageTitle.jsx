import { useEffect } from "react";

const DEFAULT_TITLE = "nPowerSoftware Power Surfacing | CAD, Sub-D Modeling and Reverse Engineering Software";
const DEFAULT_DESCRIPTION = "Power Surfacing software for CAD design and reverse engineering. Dimension-driven sketching, feature-based modeling, freeform Sub-D design, NURBS surfacing, scan-to-CAD, and mesh-to-CAD workflows.";

function setMetaDescription(content) {
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", content);
}

export default function PageTitle({ title, description }) {
  useEffect(() => {
    document.title = title || DEFAULT_TITLE;
    setMetaDescription(description || DEFAULT_DESCRIPTION);
    return () => {
      document.title = DEFAULT_TITLE;
      setMetaDescription(DEFAULT_DESCRIPTION);
    };
  }, [title, description]);
  return null;
}