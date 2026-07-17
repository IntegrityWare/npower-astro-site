import React from "react";
import { Link } from "react-router-dom";

/* Screen-reader / crawler-only SEO content — invisible to visitors. */
export default function SeoCrawlerContent() {
  return (
    <section className="sr-only" aria-hidden="false">
      <p>
        Power Surfacing provides Windows-based CAD, Sub-D modeling and reverse-engineering software for industrial designers, engineers and manufacturers. Across the Power Surfacing product family, users can create dimension-driven sketches, feature-based solids and freeform Sub-D surfaces, or reconstruct scanned meshes, ZBrush models and STL files as editable CAD geometry. Choose from standalone applications or integrated SOLIDWORKS add-ins.
      </p>
      <h2>The Power Surfacing Product Family</h2>
      <p>
        <Link to="/products/power-surfacing-re-studio">Power Surfacing RE Studio</Link> is standalone reverse-engineering software for reconstructing 3D scan meshes, sculpted meshes and STL files as editable NURBS surfaces and solids. Export reconstructed geometry to formats including STEP, IGES and SAT. Power Surfacing RE Studio also includes the complete Power Surfacing Studio modeling toolset.
      </p>
      <p>
        <Link to="/products/power-surfacing-studio">Power Surfacing Studio</Link> is standalone CAD modeling software combining freeform Sub-D surfacing, dimension-driven sketching and feature-based solid modeling. No third-party CAD license is required.
      </p>
      <p>
        <Link to="/products/power-surfacing-solidworks">Power Surfacing for SOLIDWORKS</Link> is a freeform Sub-D modeling add-in for creating smooth organic shapes and high-quality surfaces directly inside SOLIDWORKS. Convert Power Surfacing models into SOLIDWORKS surface and solid bodies integrated with the feature tree.
      </p>
      <p>
        <Link to="/products/power-surfacing-re-solidworks">Power Surfacing RE for SOLIDWORKS</Link> provides mesh-to-CAD and reverse-engineering tools directly inside SOLIDWORKS. Reconstruct 3D scans, STL meshes and sculpted models using Quad Wrap retopology, Sub-D reconstruction and surface-fitting tools.
      </p>
      <p>
        <Link to="/products/power-shell-solidworks">Power Shell for SOLIDWORKS</Link> provides advanced shelling and thickening tools for complex geometry, including many cases where the standard SOLIDWORKS Shell and Thicken commands fail. Power Thicken is included.
      </p>
      <ul>
        <li><Link to="/products/comparison">Compare Power Surfacing Products</Link></li>
        <li><Link to="/workflows">CAD and Reverse-Engineering Workflows</Link></li>
        <li><Link to="/3d-scan-to-solidworks">3D Scan to SOLIDWORKS</Link></li>
        <li><Link to="/automatic-surfacing">Automatic Surfacing</Link></li>
        <li><Link to="/pricing/trials">Download a Free Trial</Link></li>
      </ul>
    </section>
  );
}