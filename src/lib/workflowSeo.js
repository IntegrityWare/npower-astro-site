// Per-workflow SEO metadata, H1 overrides, FAQs, and internal links

export const WORKFLOW_SEO = {
  "reverse-engineering": {
    title: "Reverse Engineering Software for Mechanical Parts",
    description: "Recreate mechanical parts, replacement components, tooling, and legacy designs from 3D scans as accurate, editable CAD models.",
    h1: "Reverse Engineer Mechanical and Replacement Parts",
    sections: [
      { h2: "Recreate Discontinued and Legacy Components", body: "When original CAD data no longer exists, reverse engineering software for mechanical parts rebuilds it from the physical object. Scan the part, import the STL or OBJ mesh, and reconstruct an editable CAD solid that can be modified, re-toleranced, and manufactured again." },
      { h2: "Rebuild Editable CAD From Scanned Parts", body: "Power Surfacing doesn't just wrap the scan in polygons — automatic Quad Wrap retopology and Sub-D to NURBS conversion with G2 continuity produce real surfaces and solids. Analytic shapes such as planes, cylinders, spheres, and cones are automatically identified and parameterized, recovering true mechanical geometry." },
      { h2: "Account for Wear and Damaged Geometry", body: "Worn and damaged parts scan imperfectly. Mesh repair, smoothing, and hole-filling tools clean up tears, holes, and scan anomalies before surface fitting, so the reconstructed model reflects the intended design rather than the damage." },
      { h2: "Reconstruct Design Intent", body: "Because Power Surfacing RE Studio includes a full dimension-driven, feature-based modeling toolset, you can rebuild the part the way it was originally designed — sketches, features, and construction history — instead of settling for a static surface shell." },
      { h2: "Prepare Models for Manufacturing", body: "A distance display verifies how closely the reconstructed geometry matches the reference scan, and finished models export to STEP, STL, and OBJ — or transfer as native SOLIDWORKS features." },
    ],
    related: [
      { label: "Scan-to-CAD software", path: "/workflows/scan-to-cad" },
      { label: "Convert meshes into editable CAD", path: "/workflows/mesh-to-cad" },
      { label: "3D scan to SOLIDWORKS", path: "/3d-scan-to-solidworks" },
      { label: "Pricing and free trials", path: "/pricing" },
    ],
    faqs: [
      { q: "What software converts a 3D scan into editable CAD?", a: "Power Surfacing RE Studio (standalone) and Power Surfacing RE for SOLIDWORKS (add-in) convert 3D scan meshes into editable NURBS surfaces and solid CAD models, with export to STEP, STL, and OBJ or transfer as native SOLIDWORKS features." },
      { q: "Can worn or damaged parts be reverse engineered?", a: "Yes. Mesh repair, smoothing, and hole-filling tools clean up scan defects before surface fitting, and automatic recognition of analytic shapes such as planes, cylinders, spheres, and cones helps recover the original design intent." },
      { q: "Can the reconstructed CAD model be compared with the original scan?", a: "Yes. A distance display measures the approximation accuracy between the reconstructed geometry and the reference scan mesh." },
      { q: "What file formats can be imported and exported?", a: "STL and Wavefront OBJ meshes (including OBJ point clouds) can be imported. Power Surfacing RE Studio exports STEP, STL, and OBJ, and can transfer geometry as native SOLIDWORKS features. Power Surfacing RE for SOLIDWORKS reconstructs inside SOLIDWORKS as native features." },
    ],
  },
  "scan-to-cad": {
    title: "Scan-to-CAD Software for Editable Parametric Models",
    description: "Transform scan data into accurate, editable CAD geometry with mesh cleanup, analytic feature extraction, NURBS surfacing, and accuracy checks.",
    h1: "Scan-to-CAD Software for Parametric Models",
    sections: [
      { h2: "Convert 3D Scan Data Into Editable CAD", body: "Scan-to-CAD software bridges the gap between a 3D scanner and your CAD system. Power Surfacing imports STL and OBJ scan meshes — and OBJ point clouds in RE Studio — and converts them into editable NURBS surfaces and solids instead of leaving you with uneditable polygon data." },
      { h2: "Extract Mechanical Features From Scan Data", body: "Mechanical parts are built from analytic geometry. Power Surfacing RE Studio automatically identifies and parameterizes planes, cylinders, spheres, and cones in the scan, so prismatic regions come back as true analytic features rather than approximated freeform patches." },
      { h2: "Create Parametric Solids and Surfaces", body: "Because RE Studio includes the complete Power Surfacing Studio toolset, reconstructed geometry combines with dimension-driven sketches and a feature-based construction history — producing a genuinely parametric CAD model you can keep designing on." },
      { h2: "Validate the Model Against the Original Scan", body: "A distance display measures the deviation between the reconstructed surfaces and the reference scan mesh, so you can confirm accuracy before the model moves downstream." },
      { h2: "Export to Downstream CAD Systems", body: "Finished models export to STEP, STL, and OBJ for any CAD system, or transfer as native SOLIDWORKS features." },
    ],
    related: [
      { label: "Reverse engineering mechanical parts", path: "/workflows/reverse-engineering" },
      { label: "STL to CAD reconstruction", path: "/workflows/stl-obj-to-cad" },
      { label: "Automatic surfacing and mesh-to-NURBS", path: "/automatic-surfacing" },
      { label: "Compare Power Surfacing products", path: "/products/comparison" },
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
    sections: [
      { h2: "Supported Mesh Data", body: "Mesh-to-CAD software starts with the polygon data you already have. Power Surfacing imports STL and Wavefront OBJ meshes — 3D scans, FEA meshes, 3D printer files, sculpted models, and SOLIDWORKS Topology Study output — and prepares them with repair, smoothing, and hole-filling tools." },
      { h2: "From Polygon Mesh to NURBS Geometry", body: "Automatic Quad Wrap retopology rebuilds the mesh as a clean quad structure that follows curvature flow, and the resulting Sub-D model converts to Brep NURBS surfaces with G2 edge continuity — a patented IntegrityWare process. The Shrink Wrap tool captures fine detail without bloating the model." },
      { h2: "Editable Solid and Surface Output", body: "The result is a real CAD model, not a wrapped mesh: solids and surfaces you can shell, fillet, dimension, and modify. From RE Studio, export to STEP, STL, and OBJ, or transfer as native SOLIDWORKS features. Power Surfacing RE for SOLIDWORKS reconstructs directly inside SOLIDWORKS as native features." },
    ],
    related: [
      { label: "STL to editable CAD and STEP", path: "/workflows/stl-obj-to-cad" },
      { label: "ZBrush and sculpted mesh conversion", path: "/workflows/sculpted-mesh-to-cad" },
      { label: "Mesh-to-NURBS automatic surfacing", path: "/automatic-surfacing" },
      { label: "Compare Power Surfacing products", path: "/products/comparison" },
    ],
    faqs: [
      { q: "What is the difference between mesh conversion and CAD reconstruction?", a: "Simply importing a mesh into a CAD file leaves it as uneditable polygons. Power Surfacing reconstructs the shape — automatic Quad Wrap retopology creates a clean Sub-D structure that converts to NURBS surfaces with G2 edge continuity, producing genuinely editable geometry." },
      { q: "Can OBJ files be converted to CAD?", a: "Yes. Both STL and Wavefront OBJ meshes can be imported and converted into NURBS surfaces and solid bodies." },
      { q: "What output formats are available?", a: "Power Surfacing RE Studio exports STEP, STL, and OBJ, and can transfer geometry as native SOLIDWORKS features. Power Surfacing RE for SOLIDWORKS reconstructs directly inside SOLIDWORKS as native features." },
    ],
  },
  "stl-obj-to-cad": {
    title: "STL to Editable CAD and STEP Conversion",
    description: "Turn STL scan meshes into editable CAD and STEP models. Rebuild features, surfaces, and solids instead of simply wrapping polygon data.",
    h1: "Convert STL Files Into Editable CAD and STEP",
    sections: [
      { h2: "Mesh Import Is Not CAD Reconstruction", body: "Most CAD systems can open an STL file — but what you get is thousands of uneditable polygon facets sitting inside a CAD document. Converting STL to editable CAD means reconstructing the geometry: real surfaces and solids that respond to shelling, filleting, dimensioning, and every other CAD operation." },
      { h2: "How STL Reconstruction Works", body: "Power Surfacing repairs the mesh, runs automatic Quad Wrap retopology that follows curvature flow, and converts the resulting Sub-D structure into NURBS surfaces with G2 edge continuity. Analytic regions — planes, cylinders, spheres, cones — are automatically recognized and parameterized in RE Studio." },
      { h2: "STL to STEP and Native SOLIDWORKS Output", body: "Power Surfacing RE Studio exports the reconstructed model to STEP, STL, and OBJ for use in any downstream CAD system, or transfers geometry as native SOLIDWORKS features. Power Surfacing RE for SOLIDWORKS skips the file exchange entirely by reconstructing inside SOLIDWORKS as native features." },
    ],
    related: [
      { label: "Mesh-to-CAD software", path: "/workflows/mesh-to-cad" },
      { label: "Scan-to-CAD workflow", path: "/workflows/scan-to-cad" },
      { label: "3D scan to SOLIDWORKS", path: "/3d-scan-to-solidworks" },
      { label: "Pricing and demonstration", path: "/pricing" },
    ],
    faqs: [
      { q: "Can an STL file be converted into a parametric CAD model?", a: "Yes. Power Surfacing RE Studio converts STL meshes into NURBS solids and surfaces, and its dimension-driven, feature-based toolset lets you continue modeling parametrically on top of the reconstructed geometry." },
      { q: "Can STL be converted to STEP?", a: "Yes. Power Surfacing RE Studio exports reconstructed geometry to STEP, as well as STL and OBJ." },
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
      { q: "Which products handle sculpted meshes?", a: "Power Surfacing RE Studio (standalone, with STEP/STL/OBJ export and native SOLIDWORKS feature transfer) and Power Surfacing RE for SOLIDWORKS (reconstructs inside SOLIDWORKS as native features)." },
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
      { q: "What mesh formats can be imported?", a: "OBJ and FBX meshes from tools like Modo, 3ds Max, and Maya can be imported and converted into SOLIDWORKS features that contain either solid and/or surface bodies." },
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
  "cad-visualization": {
    title: "CAD Visualization and KeyShot Rendering Workflow",
    description: "Import engineering CAD, clean up assemblies, create product visuals with bundled KeyShot, and prepare and export meshes for Blender, Modo, 3ds Max, Maya, and other visualization packages.",
    h1: "CAD Visualization for Product Rendering",
    sections: [
      { h2: "Import Engineering CAD Without a Full CAD Seat", body: "Bring in STEP, IGES, SAT, Rhino, SOLIDWORKS, OBJ, STL, and 3MF data for visualization. Power Surfacing Visualize is a standalone Windows application, so a full CAD modeling license is not required to prepare models for product imagery." },
      { h2: "Clean Up Assemblies for Rendering", body: "Use the assembly browser, face and part visibility, tessellation controls, and material and color cleanup so engineering models are ready for product visuals instead of occupying a CAD seat for translation work." },
      { h2: "Render with Bundled KeyShot", body: "KeyShot is bundled with Power Surfacing Visualize. You do not need to purchase a separate KeyShot license to create product visuals. Power Surfacing Studio and Power Surfacing RE Studio also include the full Visualize functionality plus the KeyShot render engine." },
      { h2: "Export for Downstream Visualization", body: "Prepare visualization-quality meshes and export OBJ, STL, or glTF for other visualization packages such as Blender, Modo, 3ds Max, and Maya. You can also render in Visualize with bundled KeyShot, or export to KeyShot." },
    ],
    related: [
      { label: "Power Surfacing Visualize", path: "/products/power-surfacing-visualize" },
      { label: "Power Surfacing Studio", path: "/products/power-surfacing-studio" },
      { label: "Compare Power Surfacing products", path: "/products/comparison" },
    ],
    faqs: [
      { q: "What is a CAD visualization workflow?", a: "It is the path from an engineering CAD file to product visuals: import the model, clean up the assembly, control tessellation and materials, then render or export. Power Surfacing Visualize is built for that job." },
      { q: "Do I need a separate KeyShot license?", a: "No. KeyShot is bundled with Power Surfacing Visualize. Studio and RE Studio also include the KeyShot render engine, with no extra KeyShot license required." },
      { q: "Can I export meshes for Blender, Modo, 3ds Max, or Maya?", a: "Yes. Prepare the mesh in Visualize — tessellation, materials, visibility, and positioning — then export OBJ, STL, or glTF for Blender, Modo, 3ds Max, Maya, and other visualization packages." },
      { q: "Which product should I use for CAD visualization?", a: "Choose Power Surfacing Visualize when you need CAD import, cleanup, and rendering without a full CAD seat. Choose Studio or RE Studio when you also need modeling or reverse engineering — both include the full Visualize functionality plus KeyShot." },
    ],
  },
};