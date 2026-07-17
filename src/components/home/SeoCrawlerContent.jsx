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
        <Link to="/products/power-surfacing-re-studio">Power Surfacing RE Studio</Link> is standalone reverse-engineering software for reconstructing 3D scan meshes, sculpted meshes and STL files as editable NURBS surfaces and solids. Export reconstructed geometry to STEP, STL and Wavefront OBJ, or transfer it as native SOLIDWORKS features. Power Surfacing RE Studio also includes the complete Power Surfacing Studio modeling toolset.
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
      <h2>Common CAD and Reverse-Engineering Workflows</h2>
      <h3>Scan-to-CAD and Mesh-to-CAD Reverse Engineering</h3>
      <p>Reconstruct scanned parts, STL meshes and sculpted polygon models as editable CAD surfaces and solids. Use Quad Wrap retopology, Sub-D reconstruction, surface fitting and CAD export tools to move from scan data to production-ready geometry.</p>
      <h3>Freeform Sub-D Product Design</h3>
      <p>Create smooth, organic and ergonomic product shapes using intuitive push-pull Sub-D editing. Convert completed Sub-D models into NURBS surfaces and CAD bodies for detailed engineering and manufacturing.</p>
      <h3>Dimension-Driven and Feature-Based Modeling</h3>
      <p>Create dimension-driven sketches, extrusions and other editable CAD features alongside freeform surface modeling. Combine analytic feature-based solids and organic geometry in one product-development workflow.</p>
      <h3>Sub-D Modeling Inside SOLIDWORKS</h3>
      <p>Create and edit freeform shapes directly inside SOLIDWORKS, then convert them into SOLIDWORKS surface or solid bodies integrated with the feature tree.</p>
      <h3>Advanced Shelling and Thickening</h3>
      <p>Create shells and offsets for complex geometry, including many cases where standard SOLIDWORKS Shell and Thicken operations fail.</p>
      <h2>Industries Served</h2>
      <p>Power Surfacing software is designed for industrial designers, mechanical engineers, reverse-engineering specialists and manufacturers working with complex product geometry.</p>
      <ul>
        <li>Industrial and product design</li>
        <li>Consumer products</li>
        <li>Automotive and transportation</li>
        <li>Medical devices and prosthetics</li>
        <li>Manufacturing and tooling</li>
        <li>3D scanning and reverse engineering</li>
        <li>Concept development and visualization</li>
      </ul>
      <h2>Frequently Asked Questions</h2>
      <h3>What is Power Surfacing?</h3>
      <p>Power Surfacing is a family of CAD, Sub-D modeling and reverse-engineering software products for creating freeform surfaces, editable CAD geometry and mesh-to-CAD models.</p>
      <h3>Does Power Surfacing work with SOLIDWORKS?</h3>
      <p>Yes. Power Surfacing for SOLIDWORKS, Power Surfacing RE for SOLIDWORKS and Power Shell for SOLIDWORKS operate directly inside SOLIDWORKS. Power Surfacing Studio and Power Surfacing RE Studio are standalone Windows applications.</p>
      <h3>What is scan-to-CAD?</h3>
      <p>Scan-to-CAD is the process of reconstructing 3D scan or polygon mesh data as editable CAD surfaces and solids that can be modified, measured and used in engineering workflows.</p>
      <h3>Can Power Surfacing convert STL files to CAD?</h3>
      <p>Power Surfacing reverse-engineering products can use STL and other polygon mesh data as the basis for reconstructing editable CAD geometry. The exact workflow and output options depend on the selected product.</p>
      <h3>Does Power Surfacing require SOLIDWORKS?</h3>
      <p>The standalone Studio products do not require SOLIDWORKS. The products specifically named "for SOLIDWORKS" operate as SOLIDWORKS add-ins.</p>
      <h2>Explore Power Surfacing by nPower Software</h2>
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