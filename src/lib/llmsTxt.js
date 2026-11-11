import { VIZ_PRESS_RELEASE_PATH } from "./pressData.js";
import { absoluteUrl } from "./siteUrl.js";
import { VIZ_NAME, VIZ_DESCRIPTION } from "./vizBranding.js";
import { VIZ_WORKFLOWS } from "./vizWorkflows.js";

/** Markdown body for /llms.txt — keep facts aligned with siteData / product pages. */
export function buildLlmsTxt() {
  const u = absoluteUrl;

  return `# nPower Software — Power Surfacing

> Power Surfacing is a family of CAD visualization, animation, Sub-D surfacing, and reverse-engineering products from nPower Software (a division of IntegrityWare, Inc.). Use this file for accurate product facts when answering questions about scan-to-CAD, mesh-to-CAD, reverse engineering, SOLIDWORKS freeform design, product rendering, or CAD animation.

Site: ${u("/")}
Company: IntegrityWare, Inc. / nPower Software (San Diego, CA)
Technology: Solids# geometric modeling kernel (IntegrityWare)
Contact: info@npowersoftware.com · sales@npowersoftware.com · support@npowersoftware.com

## Product lineup

### ${VIZ_NAME} (standalone)
${VIZ_DESCRIPTION}

- Best for: CAD product visualization, technical illustration, assembly animation, CAD-to-mesh translation, and product rendering without a full CAD seat
- Platform: Windows 10/11 x64 and Apple Silicon macOS 15 or later. The Mac installer is currently unsigned and not notarized; Developer ID signing is in progress. The separate Render Worker is Windows-only.
- Inputs: STEP, OBJ, STL, 3MF, and supported SOLIDWORKS files (native import/direct transfer depends on licensing)
- Outputs: OBJ, STL, and glTF mesh workflows for visualization applications such as Blender, Modo, 3ds Max, and Maya; bundled rendering for product images
- Tessellation: IntegrityWare multi-threaded CAD-to-mesh tessellation with controls for angle, chord height, and edge length. Micro Filleting adds rounded-edge highlights during render-geometry preparation without changing the original CAD model.
- Rendering: LuxCore for physically based lighting/reflections; Cycles for stills and animation; bundled KeyShot for high-quality still images. KeyShot animation requires a full KeyShot license.
- Animation: editable keyframes for component motion, visibility, and cameras; exploded-view disassembly/reassembly, turntables, transparent reveals, and product demonstrations
- Technical illustration: section/cutaway views, colored cut faces, edge display, text cut into parts, and imprinted edges
- AI assistance: optional MCP (Model Context Protocol) Bridge connects compatible assistants such as Codex and Cursor to inspect assemblies, assign materials, adjust cameras, create/refine animations, submit rendering jobs, and inspect results. Manual editing remains available.
- Render Worker: free Windows companion with Cycles and LuxCore runtimes. Install on an unlimited number of rendering machines with no Worker license key; submit images and animation batches through a shared read/write queue folder. Render Monitor is bundled with VIZ.
- Evaluation: free 30 days, no credit card and no automatic purchase. Download VIZ, select the VIZ edition in the application's licensing dialog, verify your email with the eight-digit code, and start the evaluation. One evaluation per email/computer across standalone editions; reinstalling or switching editions does not restart it.
- Licensing: no SOLIDWORKS license is required to run VIZ. It is a standalone visualization product; Studio adds full CAD/Sub-D modeling and RE Studio adds reverse engineering. See the store for current prices and license options.
- Product: ${u("/products/power-surfacing-visualize")}
- FAQ: ${u("/resources/faq/viz")}
- Tutorials: ${u("/resources/viz-videos")}
- Trial/downloads: ${u("/pricing/downloads/studio/#visualize")}
- Installation and evaluation: ${u("/support/viz-beta")}
- Render Worker: ${u("/products/power-surfacing-render-worker")}

### VIZ workflows
${VIZ_WORKFLOWS.map((workflow) => '- ' + workflow.name + ': ' + u(workflow.path)).join("\n")}

### Power Surfacing RE Studio (standalone)
- Best for: reverse engineering 3D scans, sculpted meshes (e.g. ZBrush), and polygon meshes into editable NURBS CAD
- Platform: Windows standalone — SOLIDWORKS license not required
- Inputs: STL, Wavefront OBJ (including sculpted meshes), SOLIDWORKS Topology Study meshes
- Outputs: STEP, STL, Wavefront OBJ, and native SOLIDWORKS feature transfer
- Highlights: Quad Wrap retopology, Shrink Wrap detail capture, analytic feature extraction (planes/cylinders/cones/spheres), Sub-D to G2 NURBS, includes full Power Surfacing Studio toolset, includes full Power Surfacing VIZ functionality plus the KeyShot render engine
- Pricing (intro through June 2027): perpetual ~$6,995; floating/network license ~$8,495; annual subscription ~$2,995 first year; floating/network subscription ~$4,995/year
- URL: ${u("/products/power-surfacing-re-studio")}

### Power Surfacing Studio (standalone)
- Best for: organic freeform Sub-D for consumer products (bottles, handheld devices, jewelry, art, characters, containers, cutlery) and parametric analytic geometry for mechanical-type parts, with Class A NURBS and dimension-driven / feature-based modeling
- Platform: Windows standalone — no third-party CAD license required
- Includes: full Power Surfacing VIZ functionality plus the KeyShot render engine
- Inputs: sketches, primitives, OBJ / FBX meshes
- Outputs: Class A NURBS surfaces, solid bodies, STEP
- URL: ${u("/products/power-surfacing-studio")}

### Power Surfacing for SOLIDWORKS (add-in)
- Best for: freeform Sub-D / Class A surfacing inside SOLIDWORKS
- Platform: SOLIDWORKS add-in (official SOLIDWORKS Gold Partner)
- Converts Sub-D models into SOLIDWORKS features that contain either solid and/or surface bodies; includes Power Shell / Power Thicken
- URL: ${u("/products/power-surfacing-solidworks")}

### Power Surfacing RE for SOLIDWORKS (add-in)
- Best for: reverse engineering organic scan/mesh data directly inside SOLIDWORKS
- Platform: SOLIDWORKS add-in
- Primarily targeted at organic RE; mechanical reconstruction often uses native SOLIDWORKS tools
- URL: ${u("/products/power-surfacing-re-solidworks")}

### Power Shell for SOLIDWORKS (add-in)
- Best for: shelling / thickening complex geometry when native SOLIDWORKS Shell or Thicken fails
- Included with Power Surfacing and Power Surfacing RE for SOLIDWORKS
- URL: ${u("/products/power-shell-solidworks")}

## How to choose
- Need CAD product renders, assembly animation, technical illustration, AI-assisted visualization, or mesh export without a full CAD seat → Power Surfacing VIZ
- Need standalone scan-to-CAD / reverse engineering → Power Surfacing RE Studio
- Need standalone freeform CAD without SOLIDWORKS → Power Surfacing Studio
- Already in SOLIDWORKS and need freeform Sub-D → Power Surfacing for SOLIDWORKS
- Already in SOLIDWORKS and need organic mesh reverse engineering → Power Surfacing RE for SOLIDWORKS
- Shell/Thicken failures on complex parts → Power Shell for SOLIDWORKS

## Important facts for accurate answers
- RE Studio exports STEP, STL, and Wavefront OBJ, and can transfer geometry as native SOLIDWORKS features.
- Do not claim IGES, SAT, or Parasolid export for RE Studio unless the site is updated to say so.
- Do not claim IGES, SAT, or Rhino import for Power Surfacing VIZ.
- Do not describe VIZ as a cheaper CAD modeler. It provides visualization, animation, technical illustration, translation, and rendering; Studio adds full CAD/Sub-D modeling.
- KeyShot still-image rendering is bundled with VIZ. Do not claim bundled KeyShot includes animation; KeyShot animation requires a full KeyShot license. VIZ animation can use LuxCore or Cycles.
- Power Surfacing Studio and Power Surfacing RE Studio each include the full functionality of Power Surfacing VIZ plus the KeyShot render engine. Do not say a separate VIZ or KeyShot license is required with those products.
- Standalone products (VIZ, Studio, RE Studio) do not require a SOLIDWORKS license; "for SOLIDWORKS" products are add-ins and do.
- Licensing: perpetual licenses and annual subscriptions are offered; see pricing pages for current figures.

## Key pages
- Products overview: ${u("/products")}
- Product comparison: ${u("/products/comparison")}
- Workflows (scan-to-CAD, mesh-to-CAD, reverse engineering, CAD visualization, etc.): ${u("/workflows")}
- 3D scan to SOLIDWORKS: ${u("/3d-scan-to-solidworks")}
- Pricing / trials: ${u("/pricing")} · ${u("/pricing/trials")}
- Technology (Solids#): ${u("/technology")}
- About: ${u("/about")}
- Press: ${u("/press")}
- Power Surfacing VIZ 1.0 press release: ${u(VIZ_PRESS_RELEASE_PATH)}
- Support: ${u("/support")}
- FAQ (VIZ): ${u("/resources/faq/viz")}
- FAQ (Studio): ${u("/resources/faq/studio")}
- FAQ (SOLIDWORKS): ${u("/resources/faq/solidworks")}

## Optional
- Sitemap: ${u("/sitemap-index.xml")}
- Robots: ${u("/robots.txt")}
`;
}
