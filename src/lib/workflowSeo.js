// Per-workflow SEO metadata, H1 overrides, FAQs, and internal links

export const WORKFLOW_SEO = {
  "reverse-engineering": {
    title: "Reverse Engineering Software for Mechanical Parts",
    description: "Recreate mechanical parts, replacement components, tooling, and legacy designs from 3D scans as accurate, editable CAD models.",
    h1: "Reverse Engineer Mechanical and Replacement Parts",
    related: [
      { label: "Scan-to-CAD software", path: "/workflows/scan-to-cad" },
      { label: "Convert meshes into editable CAD", path: "/workflows/mesh-to-cad" },
      { label: "3D scan to SOLIDWORKS", path: "/3d-scan-to-solidworks" },
      { label: "Pricing and free trials", path: "/pricing" },
    ],
    faqs: [
      { q: "What software converts a 3D scan into editable CAD?", a: "Power Surfacing RE Studio (standalone) and Power Surfacing RE for SOLIDWORKS (add-in) convert 3D scan meshes into editable NURBS surfaces and solid CAD models, with export to STEP, IGES, and SAT or native SOLIDWORKS bodies." },
      { q: "Can worn or damaged parts be reverse engineered?", a: "Yes. Mesh repair, smoothing, and hole-filling tools clean up scan defects before surface fitting, and automatic recognition of analytic shapes such as planes, cylinders, spheres, and cones helps recover the original design intent." },
      { q: "Can the reconstructed CAD model be compared with the original scan?", a: "Yes. A distance display measures the approximation accuracy between the reconstructed geometry and the reference scan mesh." },
      { q: "What file formats can be imported and exported?", a: "STL and Wavefront OBJ meshes (including OBJ point clouds) can be imported. Power Surfacing RE Studio exports STEP, IGES, and SAT; the SOLIDWORKS add-in creates native solid and surface bodies." },
    ],
  },
  "scan-to-cad": {
    title: "Scan-to-CAD Software for Editable Parametric Models",
    description: "Transform scan data into accurate, editable CAD geometry with mesh cleanup, analytic feature extraction, NURBS surfacing, and accuracy checks.",
    h1: "Scan-to-CAD Software for Parametric Models",
    related: [
      { label: "Reverse engineering mechanical parts", path: "/workflows/reverse-engineering" },
      { label: "STL to CAD reconstruction", path: "/workflows/stl-obj-to-cad" },
      { label: "Automatic surfacing and mesh-to-NURBS", path: "/automatic-surfacing" },
      { label: "Geomagic Design X alternative", path: "/geomagic-design-x-alternative" },
    ],
    faqs: [
      { q: "What is scan-to-CAD software?", a: "Scan-to-CAD software converts raw 3D scanner output — mesh or point data — into clean CAD surfaces and solids that can be edited, dimensioned, and manufactured, rather than leaving you with an uneditable polygon mesh." },
      { q: "Can scan data become a parametric CAD model?", a: "Yes. Power Surfacing RE Studio includes the full Power Surfacing Studio toolset, so reconstructed geometry can be combined with dimension-driven sketches and a feature-based construction history." },
      { q: "Which 3D scanners are supported?", a: "Any scanner that exports STL or OBJ files. OBJ point clouds are also supported in Power Surfacing RE Studio." },
      { q: "Is a trial or product demonstration available?", a: "Yes. Free trial downloads are available for every Power Surfacing product, and recorded demos are available in the video library." },
    ],
  },
  "mesh-to-cad": {
    title: "Mesh-to-CAD Software for Editable Solid Models",
    description: "Convert STL, OBJ, and polygon meshes into editable solid and surface CAD models for redesign, manufacturing, and legacy part recreation.",
    h1: "Convert Meshes Into Editable CAD Models",
    related: [
      { label: "STL to editable CAD and STEP", path: "/workflows/stl-obj-to-cad" },
      { label: "ZBrush and sculpted mesh conversion", path: "/workflows/sculpted-mesh-to-cad" },
      { label: "Mesh-to-NURBS automatic surfacing", path: "/automatic-surfacing" },
      { label: "QUICKSURFACE alternative", path: "/quicksurface-alternative" },
    ],
    faqs: [
      { q: "What is the difference between mesh conversion and CAD reconstruction?", a: "Simply importing a mesh into a CAD file leaves it as uneditable polygons. Power Surfacing reconstructs the shape — automatic Quad Wrap retopology creates a clean Sub-D structure that converts to NURBS surfaces with G2 edge continuity, producing genuinely editable geometry." },
      { q: "Can OBJ files be converted to CAD?", a: "Yes. Both STL and Wavefront OBJ meshes can be imported and converted into NURBS surfaces and solid bodies." },
      { q: "What output formats are available?", a: "Power Surfacing RE Studio exports STEP, IGES, and SAT. Power Surfacing RE for SOLIDWORKS creates native SOLIDWORKS solid and surface bodies in the feature tree." },
    ],
  },
  "stl-obj-to-cad": {
    title: "STL to Editable CAD and STEP Conversion",
    description: "Turn STL scan meshes into editable CAD and STEP models. Rebuild features, surfaces, and solids instead of simply wrapping polygon data.",
    h1: "Convert STL Files Into Editable CAD and STEP",
    related: [
      { label: "Mesh-to-CAD software", path: "/workflows/mesh-to-cad" },
      { label: "Scan-to-CAD workflow", path: "/workflows/scan-to-cad" },
      { label: "3D scan to SOLIDWORKS", path: "/3d-scan-to-solidworks" },
      { label: "Pricing and demonstration", path: "/pricing" },
    ],
    faqs: [
      { q: "Can an STL file be converted into a parametric CAD model?", a: "Yes. Power Surfacing RE Studio converts STL meshes into NURBS solids and surfaces, and its dimension-driven, feature-based toolset lets you continue modeling parametrically on top of the reconstructed geometry." },
      { q: "Can STL be converted to STEP?", a: "Yes. Power Surfacing RE Studio exports reconstructed geometry to STEP, as well as IGES and SAT." },
      { q: "Why not just insert the STL into my CAD system?", a: "Inserting an STL places uneditable polygon facets inside a CAD file. Reconstruction rebuilds real surfaces and solids — geometry you can shell, fillet, dimension, and modify like any native CAD model." },
    ],
  },
  "sculpted-mesh-to-cad": {
    title: "ZBrush & Sculpted Mesh to CAD Conversion",
    description: "Convert ZBrush, Mudbox, and other sculpted meshes into production-ready NURBS CAD surfaces while preserving fine sculpted detail.",
    related: [
      { label: "Mesh-to-CAD software", path: "/workflows/mesh-to-cad" },
      { label: "Freeform Sub-D design", path: "/workflows/freeform-sub-d" },
      { label: "Reverse engineering mechanical parts", path: "/workflows/reverse-engineering" },
    ],
    faqs: [
      { q: "Can ZBrush models be converted to CAD?", a: "Yes. Sculpted meshes from ZBrush, Mudbox, and similar tools can be converted into production-ready NURBS surfaces and solids." },
      { q: "Do fine sculpted details survive the conversion?", a: "The Shrink Wrap tool captures fine surface detail without adding polygons, and Quad Wrap retopology follows curvature flow so creases and ridges are not washed out." },
      { q: "Which products handle sculpted meshes?", a: "Power Surfacing RE Studio (standalone, with STEP/IGES/SAT export) and Power Surfacing RE for SOLIDWORKS (creates native SOLIDWORKS bodies)." },
    ],
  },
  "freeform-sub-d": {
    title: "Freeform Sub-D Design Software | nPower",
    description: "Create smooth, organic freeform shapes with subdivision surface modeling and convert them into Class A NURBS surfaces and solid bodies.",
    related: [
      { label: "Industrial design in SOLIDWORKS", path: "/workflows/industrial-design-solidworks" },
      { label: "Power Surfacing Studio", path: "/products/power-surfacing-studio" },
      { label: "Shelling and thickening complex geometry", path: "/workflows/shelling-thickening" },
    ],
    faqs: [
      { q: "What is Sub-D modeling?", a: "Subdivision surface (Sub-D) modeling lets you push, pull, and sculpt a control cage while previewing a smooth limit surface in real time — like working with digital clay." },
      { q: "Can Sub-D surfaces become NURBS?", a: "Yes. Sub-D geometry converts to Brep NURBS with G2 edge continuity, suitable for manufacturing and downstream CAD systems." },
      { q: "Do I need SOLIDWORKS for Sub-D design?", a: "No. Power Surfacing Studio is a complete standalone application. Power Surfacing for SOLIDWORKS offers the same Sub-D approach inside SOLIDWORKS." },
    ],
  },
  "industrial-design-solidworks": {
    title: "Industrial Design in SOLIDWORKS with Sub-D",
    description: "Create ergonomic, organic industrial designs directly inside SOLIDWORKS using Sub-D surfacing integrated with the feature tree.",
    related: [
      { label: "Freeform Sub-D design", path: "/workflows/freeform-sub-d" },
      { label: "Power Surfacing for SOLIDWORKS", path: "/products/power-surfacing-solidworks" },
      { label: "3D scan to SOLIDWORKS", path: "/3d-scan-to-solidworks" },
    ],
    faqs: [
      { q: "How does Sub-D modeling work inside SOLIDWORKS?", a: "Power Surfacing creates Power Body macro-features that behave like native SOLIDWORKS features, so freeform Sub-D shapes live in the feature tree alongside standard parametric features." },
      { q: "Can Power Surfacing bodies be used in assemblies?", a: "Yes. Power Surface bodies can be created and edited directly from SOLIDWORKS assemblies, as instances or references." },
      { q: "What mesh formats can be imported?", a: "OBJ and FBX meshes from tools like Modo, 3ds Max, and Maya can be imported and converted into Class A SOLIDWORKS surface or solid bodies." },
    ],
  },
  "shelling-thickening": {
    title: "Shelling & Thickening Complex CAD Geometry",
    description: "Shell and thicken complex, organic, or imported geometry that standard SOLIDWORKS Shell and Thicken commands cannot handle.",
    related: [
      { label: "Power Shell for SOLIDWORKS", path: "/products/power-shell-solidworks" },
      { label: "Reverse engineering mechanical parts", path: "/workflows/reverse-engineering" },
      { label: "Freeform Sub-D design", path: "/workflows/freeform-sub-d" },
    ],
    faqs: [
      { q: "Why do native shell commands fail on complex parts?", a: "Offsetting complex or organic geometry with small radii, large radii, or intersecting surfaces is a difficult problem for standard CAD offset algorithms. Power Shell uses technology built specifically for these complex offsetting cases." },
      { q: "What does Power Shell include?", a: "Shell, Hollow, and Thicken commands — Power Shell works on solids and Power Thicken works on surfaces — with live preview, undo/redo, and full SOLIDWORKS feature tree integration." },
      { q: "Is Power Shell included with other products?", a: "Yes. Power Shell and Power Thicken are included free with Power Surfacing and Power Surfacing RE for SOLIDWORKS, and equivalent shelling tools are included in the Studio products." },
    ],
  },
};