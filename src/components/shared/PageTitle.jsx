import { useEffect } from "react";

const DEFAULT_TITLE = "nPowerSoftware Power Surfacing | CAD, Sub-D Modeling and Reverse Engineering Software";

export default function PageTitle({ title }) {
  useEffect(() => {
    document.title = title || DEFAULT_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);
  return null;
}