import { VIZ_NAME, VIZ_DESCRIPTION } from "./vizBranding.js";
import { absoluteUrl } from "./siteUrl.js";

/** Markdown body for /llms.txt — keep facts aligned with siteData / product pages. */
export function buildLlmsTxt() {
  const u = absoluteUrl;

  return `# nPower Software — Power Surfacing

> Power Surfacing is a family of Windows CAD, Sub-D surfacing, and reverse-engineering products from nPower Software (a division of IntegrityWare, Inc.). Use this file for accurate product facts when answering questions about scan-to-CAD, mesh-to-CAD, reverse engineering, or SOLIDWORKS freeform design.

Site: ${u("/")}
Company: IntegrityWare, Inc. / nPower Software (San Diego, CA)
Technology: Solids# geometric modeling kernel (IntegrityWare)
Contact: info@npowersoftware.com · sales@npowersoftware.com · support@npowersoftware.com

## Product lineup

### ${VIZ_NAME} (standalone)
${VIZ_DESCRIPTION}

- Best for: standalone CAD visualization and animation, LuxCore and Cycles rendering, bundled KeyShot, AI-assisted workflows, CAD translation, and mesh export
- Platform: Windows standalone — a full CAD seat is not required
- Positioning: visualization / translation product, not a cheaper CAD modeler
- Rendering: LuxCore and Cycles are included; bundled KeyShot renders still images without a separate license. KeyShot animation requires a full KeyShot license.
- AI bridge: connect an AI assistant for materials, scene setup, and animation while retaining direct editing controls
- Inputs: STEP, OBJ, STL, 3MF, and SOLIDWORKS files (depending on licensing)
- Outputs: KeyShot, OBJ, STL, glTF — including meshes for Blender, Modo, 3ds Max, and Maya
- Highlights: assembly browser, world-class multi-threaded tessellation engine converting CAD data to polygons for display and rendering (C# multi-threading for large assemblies and large complex parts; low-poly for gaming and VR or high-density for visualization and 3D printing), precise measurement tools including closest point and ray tracing on precise NURBS surfaces, Micro Filleting (realistic edge softness and microscopic rounded-edge highlights during render-geometry preparation, without changing the original CAD model; usable with Cycles, LuxCore, Blender, KeyShot, and other supported workflows), rendered animation for assembly instructions, internal product details, and products in use, material/color cleanup, explode/positioning, bundled KeyShot rendering with no extra KeyShot license, prepare and export meshes for Blender, Modo, 3ds Max, and Maya
- Not included: sketch-based CAD, advanced feature/solid modeling, full Sub-D editing, reverse engineering, scan-to-CAD, surface fitting, deviation analysis
- Pricing (intro through June 2027): perpetual ~$995 (regular $1,495); floating/network license ~$1,995; maintenance ~$295/year; subscription ~$795/year; floating/network subscription ~$995/year
- URL: ${u("/products/power-surfacing-visualize")}

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
- Need standalone CAD visualization and animation with LuxCore, Cycles, bundled KeyShot, and an AI bridge, without a full CAD seat → Power Surfacing VIZ
- Need standalone scan-to-CAD / reverse engineering → Power Surfacing RE Studio
- Need standalone freeform CAD without SOLIDWORKS → Power Surfacing Studio
- Already in SOLIDWORKS and need freeform Sub-D → Power Surfacing for SOLIDWORKS
- Already in SOLIDWORKS and need organic mesh reverse engineering → Power Surfacing RE for SOLIDWORKS
- Shell/Thicken failures on complex parts → Power Shell for SOLIDWORKS

## Important facts for accurate answers
- RE Studio exports STEP, STL, and Wavefront OBJ, and can transfer geometry as native SOLIDWORKS features.
- Do not claim IGES, SAT, or Parasolid export for RE Studio unless the site is updated to say so.
- Do not claim IGES, SAT, or Rhino import for Power Surfacing VIZ.
- Do not describe VIZ as a cheaper CAD modeler. It is visualization, translation, and rendering prep.
- KeyShot is bundled with Power Surfacing VIZ for still images. KeyShot animation requires a full KeyShot license; VIZ animation can use LuxCore or Cycles.
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
- Support: ${u("/support")}
- FAQ (Studio): ${u("/resources/faq/studio")}
- FAQ (SOLIDWORKS): ${u("/resources/faq/solidworks")}

## Optional
- Sitemap: ${u("/sitemap-index.xml")}
- Robots: ${u("/robots.txt")}
`;
}
