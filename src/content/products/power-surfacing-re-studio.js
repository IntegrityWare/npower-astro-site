// Single source of truth for the /products/power-surfacing-re-studio page.
// All visible page components and metadata read from this file.

export const RE_STUDIO_CONTENT = {
  meta: {
    title: "Power Surfacing RE Studio | Scan-to-CAD Reverse Engineering",
    description: "Convert 3D scans, STL files and polygon meshes into editable CAD surfaces and solids with standalone Power Surfacing RE Studio software.",
    canonicalPath: "/products/power-surfacing-re-studio",
    index: true,
  },
  hero: {
    h1: "Power Surfacing RE Studio",
    subtitle: "Power Surfacing RE Studio is standalone Windows reverse-engineering and scan-to-CAD software for reconstructing mechanical, organic and hybrid parts — converting 3D scan meshes, STL files and polygon models into editable CAD surfaces and solids.",
  },
  intro: {
    heading: "Convert 3D Scan and Mesh Data into Editable CAD",
    paragraphs: [
      "Power Surfacing RE Studio is built for reverse engineers, 3D scan technicians, industrial designers, medical and prosthetics professionals, and artists who need to turn polygon mesh data into real, editable CAD geometry. Typical starting points include 3D scan meshes, STL files, Wavefront OBJ meshes, ZBrush and other sculpted models, and SOLIDWORKS Topology Study output.",
      "Power Surfacing RE Studio reverse engineers freeform organic parts, mechanical parts and hybrid parts that combine both. Its ability to identify and extract mechanical surfaces and solids — planes, cylinders, cones, spheres, extruded and revolved shapes — makes it a powerful choice for almost any reverse-engineering task.",
      "From that mesh data, RE Studio reconstructs high-quality, G2-continuous NURBS surfaces and solid bodies that can be modified, measured and used in downstream engineering workflows. Because RE Studio includes the complete Power Surfacing Studio toolset, reconstructed geometry can be combined with dimension-driven sketches, feature-based solids and freeform Sub-D modeling — all in one standalone Windows application, with no third-party CAD license required.",
    ],
  },
  featuresHeading: "Power Surfacing RE Studio Features",
  features: [
    {
      title: "Mesh Import and Preparation",
      text: "Import STL and Wavefront OBJ files, as well as SOLIDWORKS Topology Study meshes. Built-in mesh repair, smoothing and hole-filling tools prepare scanned or sculpted data for reconstruction.",
    },
    {
      title: "Quad Wrap Retopology",
      text: "Quad Wrap generates a clean quad layout that follows the curvature flow of the underlying mesh, producing a structured foundation for high-quality surface reconstruction.",
    },
    {
      title: "Sub-D Surface Reconstruction",
      text: "Rebuild scanned and sculpted meshes as editable Sub-D geometry. The Shrink Wrap tool captures very fine surface detail without adding polygons, preserving detail on jewelry, cutlery and consumer products.",
    },
    {
      title: "Automatic and Analytic Surface Fitting",
      text: "Automatically identify and extract mechanical surfaces and solids — planes, cylinders, cones, spheres, extruded and revolved shapes — so mechanical regions of a scan become true analytic CAD geometry rather than approximations.",
    },
    {
      title: "Dimension-Driven Sketching",
      text: "Create sketches controlled by parametric dimensions, constraints and relationships — part of the complete Power Surfacing Studio toolset included in RE Studio.",
    },
    {
      title: "Feature-Based Solid Modeling",
      text: "Build models with a construction history that can be edited and rolled back at any time, combining reconstructed scan geometry with conventional CAD features.",
    },
    {
      title: "Surface and Solid Creation",
      text: "Convert Sub-D geometry into Brep NURBS surfaces with G2 edge continuity, and create solid bodies. Advanced shelling supports variable wall thickness on complex geometry.",
    },
    {
      title: "CAD Export",
      text: "Export reconstructed surfaces and solids to STEP, STL and Wavefront OBJ, or transfer geometry as native SOLIDWORKS features.",
    },
  ],
  workflow: {
    heading: "How the Scan-to-CAD Workflow Works",
    steps: [
      { title: "Import scan or polygon mesh data", text: "Load STL or OBJ data, or bring in sculpted meshes and SOLIDWORKS Topology Study output." },
      { title: "Inspect and prepare the mesh", text: "Repair defects, fill holes and smooth noisy regions so the mesh is ready for reconstruction." },
      { title: "Generate a quad layout", text: "Use Quad Wrap retopology to create a clean quad structure that follows the curvature flow of the mesh." },
      { title: "Build editable Sub-D geometry", text: "Reconstruct the shape as editable Sub-D geometry, using Shrink Wrap to capture fine surface detail." },
      { title: "Fit analytic or freeform surfaces", text: "Automatically identify and extract planes, cylinders, cones, spheres, extruded and revolved shapes where appropriate, keeping freeform regions as smooth NURBS surfaces." },
      { title: "Create surfaces or solids", text: "Convert to Brep NURBS surfaces with G2 edge continuity and build solid bodies, including shelled parts with variable wall thickness." },
      { title: "Export to downstream CAD", text: "Export the reconstructed model to STEP, STL or Wavefront OBJ, or transfer it as native SOLIDWORKS features." },
    ],
  },
  formats: {
    heading: "Supported Input and Output Formats",
    inputs: ["STL", "Wavefront OBJ meshes", "Sculpted meshes (e.g. ZBrush exports via STL/OBJ)", "SOLIDWORKS Topology Study meshes"],
    outputs: ["STEP", "STL", "Wavefront OBJ", "Native SOLIDWORKS features"],
    notSupported: [
      "PLY — not supported; convert PLY scans to STL or OBJ before import",
      "IGES, SAT and Parasolid export — not supported; use STEP, STL, OBJ or native SOLIDWORKS features",
    ],
  },
  faqs: [
    { q: "What is Power Surfacing RE Studio?", a: "Power Surfacing RE Studio is standalone Windows reverse-engineering and scan-to-CAD software that reconstructs 3D scan meshes, STL files and polygon models as editable NURBS surfaces and solids. It includes the complete Power Surfacing Studio modeling toolset." },
    { q: "Does Power Surfacing RE Studio require SOLIDWORKS?", a: "No. RE Studio is a fully standalone Windows application and does not require SOLIDWORKS or any other third-party CAD license." },
    { q: "Can it convert STL meshes into CAD?", a: "Yes. RE Studio imports STL files and reconstructs them as editable NURBS surfaces and solid bodies that can be exported to STEP, STL or Wavefront OBJ, or transferred as native SOLIDWORKS features." },
    { q: "What is Quad Wrap?", a: "Quad Wrap is RE Studio's retopology tool. It generates a clean quad layout that follows the curvature flow of the underlying mesh, producing a structured foundation for high-quality Sub-D and NURBS surface reconstruction." },
    { q: "Can it create editable NURBS surfaces?", a: "Yes. RE Studio converts Sub-D geometry into Brep NURBS surfaces with G2 edge continuity, and can automatically identify and extract mechanical surfaces and solids such as planes, cylinders, cones, spheres, extruded and revolved shapes." },
    { q: "Can it create solid CAD models?", a: "Yes. RE Studio creates solid bodies as well as surfaces, and supports advanced shelling with variable wall thickness on complex geometry." },
    { q: "Which file formats does it support?", a: "Inputs: STL and Wavefront OBJ files, plus SOLIDWORKS Topology Study meshes. Outputs: STEP, STL, Wavefront OBJ and native SOLIDWORKS features. PLY, IGES, SAT and Parasolid are not supported." },
    { q: "How does RE Studio differ from Power Surfacing Studio?", a: "Power Surfacing Studio focuses on standalone CAD, Sub-D surfacing, sketching and feature-based modeling. RE Studio includes the entire Studio toolset and adds reverse-engineering capabilities for reconstructing scanned and polygonal mesh data." },
    { q: "How does RE Studio differ from Power Surfacing RE for SOLIDWORKS?", a: "RE Studio is a standalone Windows application that exports via STEP, STL and Wavefront OBJ, or transfers geometry as native SOLIDWORKS features. Power Surfacing RE for SOLIDWORKS runs as an add-in inside SOLIDWORKS, where reconstructed geometry becomes SOLIDWORKS surface and solid bodies integrated with the feature tree." },
    { q: "Is a free trial available?", a: "Yes. A free trial of Power Surfacing RE Studio is available from the trial downloads page." },
  ],
  relatedLinks: [
    { label: "Power Surfacing RE for SOLIDWORKS", path: "/products/power-surfacing-re-solidworks" },
    { label: "Compare Power Surfacing Products", path: "/products/comparison" },
    { label: "Geomagic Design X Alternative", path: "/geomagic-design-x-alternative" },
    { label: "QuickSurface Alternative", path: "/quicksurface-alternative" },
    { label: "Download a Free Trial", path: "/pricing/trials" },
  ],
};