export const VISUALIZE_CONTENT = {
  meta: {
    title: "Power Surfacing Viz | CAD Visualization & KeyShot Rendering",
    description:
      "Standalone CAD visualization and rendering-prep software with KeyShot bundled. Import engineering models, clean up assemblies, and create product visuals — no extra KeyShot license and no full CAD seat required.",
    canonicalPath: "/products/power-surfacing-visualize",
    index: true,
  },
  hero: {
    h1: "Power Surfacing Viz",
    subtitle:
      "CAD import, IntegrityWare tessellation, bundled KeyShot rendering, and mesh export for Blender, Modo, 3ds Max, and Maya.",
  },
  intro: {
    heading: "CAD visualization, translation, and rendering prep",
    paragraphs: [
      "Power Surfacing Viz is a standalone CAD visualization and rendering-prep system with KeyShot bundled. Import engineering models, clean up assemblies, convert CAD data to meshes with IntegrityWare’s world-class tessellation engine, and create product visuals without needing a full CAD seat — and without buying a separate KeyShot license. Prepare and export meshes for other visualization packages such as Blender, Modo, 3ds Max, and Maya.",
      "Use Power Surfacing Viz for CAD visualization, CAD translation, and rendering preparation. Power Surfacing Studio is great for modeling geometry, including CAD modeling, sketching, and Sub-D. Power Surfacing RE Studio is great for reverse engineering. Power Surfacing Viz excels at visualizing and rendering geometry.",
      "With Power Surfacing Viz, import engineering models, clean them up, tessellate, and create product visuals without paying for or tying up a full modeling license. A full CAD seat is not required.",
      "Power Surfacing Viz is based on the popular Power Translators product, which imported STEP and SOLIDWORKS data into 3ds Max for high-quality rendering. The added benefit is that Power Surfacing Viz is standalone and does not require a separate license of any other third-party product.",
    ],
  },
  productExample: {
    images: [
      {
        src: "/assets/viz-swim-motor-red-transparent.png",
        alt: "Product visualization of a swim motor with a transparent housing and red components, revealing the internal assembly",
      },
      {
        src: "/assets/viz-swim-motor-yellow-black.png",
        alt: "Product visualization of a swim motor with a yellow housing and black handle and rear guard",
      },
    ],
    caption: "Product visualization",
    videos: [
      {
        src: "/assets/viz-import-tessellate.mp4",
        title: "Importing/Tessellating on 24 Core Ultra 9",
      },
      {
        src: "/assets/viz-keyshot-in-action.mp4",
        title: "Keyshot in action",
      },
    ],
  },
  tessellation: {
    heading: "Interactive Visualization",
    body: "Visualize the tessellation and adjust the tessellation settings to get the appropriate mesh density for a rendering application or an interactive visualization application. Mesh density can be inspected and adjusted for rendering or real-time display. Adjustments to the mesh include maximum angle, maximum chord height, and maximum edge length (see image 2 below). Tessellation tolerances can be adjusted for multiple objects, or for all objects in an assembly, and those updates are applied in parallel.",
    images: [
      {
        src: "/assets/viz-interactive-tessellation-assembly.jpg",
        alt: "Interactive tessellation of a full vehicle suspension. The tires and shock absorbers are shown as a blue mesh so density can be inspected and adjusted.",
        caption: "Full suspension assembly.",
      },
      {
        src: "/assets/viz-interactive-tessellation-all.jpg",
        alt: "The same vehicle suspension with tessellation applied to every part. The whole assembly is shown as a blue mesh.",
        caption: "Multi-object Updating",
      },
      {
        src: "/assets/viz-interactive-tessellation-detail.jpg",
        alt: "Close-up of a vehicle suspension. The shock absorbers are shown as a blue mesh so density can be inspected, with the surrounding parts shown as a gray mesh.",
        caption: "Mesh density close-up.",
      },
    ],
    linkLabel: "How Solids# technology works",
    linkPath: "/technology",
  },
  renderingOptions: {
    heading: "Multiple Rendering Options",
    intro: "Power Surfacing VIZ packages three rendering options: LuxCore, KeyShot, and Cycles. Each brings its own strengths, giving you a choice of approaches for product imagery, lighting, materials, and animation.",
    environment: "Use different HDRI (high dynamic range image) environments to simulate real-world lighting, from a bright outdoor scene to a softly lit interior or a studio setup. The environment supplies surrounding light that shapes shadows, highlights, and reflections. Comparing the same model under several HDRI environments helps you evaluate how its materials, colors, and finishes will look in different settings.",
    stills: [
      {
        name: "LuxCore",
        strength: "Physically based lighting and reflections",
        description: "LuxCore simulates how light travels through a scene to create photographic results. It is a strong choice for images where reflections, indirect lighting, and the relationship between a product and its environment are central to the presentation.",
        src: "/assets/viz-projector-luxcore.png",
        alt: "LuxCore rendering of a metallic projector with a blue lens cap, reflected in a ground surface under environment lighting",
        caption: "LuxCore - environment lighting and ground reflections",
      },
      {
        name: "KeyShot",
        strength: "Product materials and finishes",
        description: "The bundled version of KeyShot is great for high-quality still-image generation. Realistic materials and environment lighting help show metals, plastics, and coatings in polished product visuals. To create animations in KeyShot, you will need to purchase a full version of KeyShot.",
        src: "/assets/viz-projector-keyshot.png",
        alt: "KeyShot rendering of a metallic projector showing soft highlights across its housing and a blue lens cap",
        caption: "KeyShot - metallic finishes and product presentation",
      },
    ],
    animation: {
      name: "Cycles",
      strength: "Versatile rendering for stills and animation",
      description: "Cycles combines physically based rendering with a flexible approach to materials and lighting. Use it for still images or animated product presentations, such as this projector turntable, to show a design from multiple angles and reveal how its surfaces respond as the view changes.",
      src: "/assets/viz-projector-cycles-turntable.mp4",
      poster: "/assets/viz-projector-cycles-poster.jpg",
      title: "Cycles projector turntable",
      caption: "Cycles - projector turntable animation",
    },
  },
  remoteRendering: {
    heading: "Remote rendering for faster animation batches",
    intro: "The free Power Surfacing Render Worker is highly optimized for rendering animations. Render images and animation batches on this computer or a different one. Send jobs from VIZ and let your render machines process the queue while you continue working.",
    benefits: [
      {
        title: "Parallel frames and GPU geometry caching",
        body: "Unmodified geometry is cached on the GPU and shared between frames, reducing repeated geometry uploads. Depending on the GPU load for each frame and available memory, two or more frames can use the GPU at the same time. Parallel processing helps keep the GPU busy throughout an animation batch. Per-frame rendering is 5 to 10 times faster than rendering individual frames one at a time.",
      },
      {
        title: "Add more render machines",
        body: "Install the Render Worker on multiple Windows computers to process queued work across your machines. Connect VIZ and the workers to a shared queue folder that each computer can read and write. No Render Worker license key is required.",
      },
    ],
    hardwareHeading: "Recommended rendering hardware",
    hardwareIntro: "The Render Worker can run on smaller machines. For high-performance GPU rendering, we strongly recommend an NVIDIA GeForce RTX or equivalent compatible GPU with at least 8 GB of dedicated GPU memory (VRAM).",
    memoryAdvice: "For large assemblies or fine tessellation settings, choose more GPU memory. Higher polygon counts, textures, and simultaneous renders all increase memory demand. Check the graphics card's VRAM separately from the computer's system RAM.",
    examples: [
      { gpu: "GeForce RTX 5060 Ti", memory: "8 GB GPU memory", price: "Around $1,500", detail: "A starting point for smaller scenes and animation batches." },
      { gpu: "GeForce RTX 5070", memory: "12 GB GPU memory", price: "Around $2,300", detail: "More memory for larger assemblies and finer tessellation." },
      { gpu: "GeForce RTX 5080", memory: "16 GB GPU memory", price: "Around $3,200", detail: "Additional GPU performance and memory for demanding scenes." },
    ],
    pricingNote: "Approximate USD prices for complete desktop computers, based on Costco listings reviewed October 23, 2026. Configurations, promotions, prices, and availability vary; check the current listing before purchasing.",
    retailerUrl: "https://www.costco.com/gaming-computers.html?refine=30004%2B15456",
    retailerLabel: "Browse Costco desktop computers",
    specsUrl: "https://www.nvidia.com/en-us/geforce/graphics-cards/50-series/",
    specsLabel: "Check NVIDIA GPU specifications",
    downloadPath: "/pricing/downloads/#render-worker",
    detailsPath: "/products/power-surfacing-render-worker",
  },
  viewBasedTessellation: {
    heading: "View-Based Tessellation",
    images: [
      {
        src: "/assets/viz-view-based-without.png",
        alt: "Blue rendered sphere, elbow and torus without View-Based Tessellation, showing faceted edge outlines",
        caption: "Without View-Based Tessellation",
      },
      {
        src: "/assets/viz-view-based-with.png",
        alt: "The same blue sphere, elbow and torus with View-Based Tessellation, showing smoother edge outlines",
        caption: "With View-Based Tessellation",
      },
      {
        src: "/assets/viz-view-based-without-closeup.png",
        alt: "Close-up without View-Based Tessellation showing polygonal facets along the elbow end and curved silhouettes",
        caption: "Without View-Based Tessellation - close-up",
      },
      {
        src: "/assets/viz-view-based-with-closeup.png",
        alt: "Close-up with View-Based Tessellation showing smooth edge outlines on the blue elbow, sphere and torus",
        caption: "With View-Based Tessellation - close-up",
      },
      {
        wide: true,
        src: "/assets/viz-view-based-top.png",
        alt: "Top view of the sphere, elbow and torus with visible triangle edges showing the tessellated mesh",
        caption: "Top view - tessellated mesh",
      },
    ],
    paragraphs: [
      "Use View-Based Tessellation to refine geometry around hard edges and fillet edges for the view you want to render. Finer tessellation helps preserve edge definition, smooth curved outlines, and reduce visible facets in close-up images.",
      "Refinement is especially useful where small radii and curved transitions catch light. Giving these areas more geometric detail helps highlights flow across fillets and keeps product silhouettes clean at the scale shown in the image.",
    ],
    benefits: [
      "Refine hard-edge outlines for cleaner, more accurate product profiles.",
      "Add detail along fillet edges for smoother curves and more continuous highlights.",
      "Improve close-up and presentation renders by reducing visible tessellation artifacts.",
    ],
  },
  edgeVertexRendering: {
    heading: "Rendering for Technical Illustration",
    paragraphs: [
      "Turn CAD models into clear technical illustrations by rendering edges, silhouettes, and vertices alongside shaded surfaces. Edge outlines define part boundaries and curved profiles, while visible vertex markers highlight corners and connections.",
      "Use these illustrations in product documentation, assembly guides, training materials, and design presentations. Combine linework with color, shading, or transparency to explain the shape of a part and how an assembly fits together.",
    ],
    groups: [
      {
        heading: "Silhouettes and surface curves",
        description: "Silhouette outlines make the overall shape easy to read. Add surface curves to show how a form bends and to give an illustration more geometric detail.",
        images: [
          {
            src: "/assets/viz-illustration-torus-silhouette.png",
            alt: "Curved tube illustration with black silhouette outlines and softly shaded white surfaces",
            caption: "Silhouette outlines",
          },
          {
            src: "/assets/viz-illustration-torus-crosshatch.png",
            alt: "Red shaded curved tube with black crossing surface curves and outlined end faces",
            caption: "Surface curves and crosshatching",
          },
        ],
      },
      {
        heading: "Edge Rendering",
        description: "Use colored edges to reveal the shape and internal structure of an assembly while keeping selected components shaded. View the complete arbor press or expand the close-up to examine its gears, rack, and fasteners.",
        images: [
          {
            src: "/assets/viz-edge-render-arbor.png",
            alt: "Arbor press with blue frame edges, a red rack, teal plate edges, and shaded gears, fasteners, and handle",
            caption: "Edge-rendered assembly",
          },
          {
            src: "/assets/viz-edge-render-arbor-close-up.png",
            alt: "Close-up of the arbor press with colored edges revealing the rack, gears, and fasteners",
            caption: "Edge rendering close-up",
          },
        ],
      },
      {
        heading: "Highlight edges and vertices",
        description: "Contrasting edge colors and vertex markers draw attention to the structure of a model. The close-up makes it easy to see where edges meet around fasteners, holes, and curved transitions.",
        images: [
          {
            src: "/assets/viz-illustration-colored-edges.png",
            alt: "Arbor press assembly detail with red edge curves and yellow-green vertex markers",
            caption: "Colored edges and vertex markers",
          },
          {
            src: "/assets/viz-illustration-vertices-detail.png",
            alt: "Close-up of an arbor press fastener with red edges and yellow-green markers at the vertices",
            caption: "Edge and vertex close-up",
          },
        ],
      },
      {
        heading: "Illustrate Assembly Components",
        compactImages: true,
        description: "Keep component boundaries readable in a shaded product illustration, or combine edges with transparent materials to reveal internal relationships. These arbor press examples show several ways to present the same assembly.",
        images: [
          {
            src: "/assets/viz-illustration-arbor-press.png",
            alt: "Complete blue arbor press with black edge outlines, a vertical rack and an orange handle on a white background",
            caption: "Shaded assembly with edge outlines",
          },
          {
            src: "/assets/viz-illustration-cycles.png",
            alt: "Cycles render of an arbor press with transparent blue components and black edges revealing the internal assembly",
            caption: "Cycles render - transparent assembly",
          },
        ],
      },
    ],
  },
  microFilleting: {
    heading: "Micro Filleting",
    oneLine:
      "Turn unrealistically sharp CAD edges into believable manufactured edges—without changing the CAD model.",
    summary:
      "Micro Filleting adds the subtle edge rounding that makes CAD models look real. Power Surfacing Viz automatically enhances hard edges with microscopic render geometry and optimized normals, creating natural specular highlights without modifying the original CAD model or requiring thousands of manually modeled fillets.",
    images: [
      {
        src: "/assets/viz-micro-fillets-none.png",
        alt: "Arbor press base and support plate with sharp edges and no micro-fillets",
        caption: "No Micro-Fillets",
      },
      {
        src: "/assets/viz-micro-fillets-small.png",
        alt: "Arbor press base and support plate with small micro-fillets and subtle edge highlights",
        caption: "Small Micro-Fillets",
      },
      {
        src: "/assets/viz-micro-fillets-larger.png",
        alt: "Arbor press base and support plate with larger micro-fillets and more pronounced edge highlights",
        caption: "Larger Micro-Fillets",
      },
    ],
    paragraphs: [
      "Micro Filleting in Power Surfacing Viz adds realistic edge softness to CAD models without requiring tiny fillets to be modeled in the original geometry.",
      "CAD models often contain mathematically sharp edges that are convenient for design and manufacturing, but those edges can look unnatural in a high-quality render. In the real world, even seemingly sharp manufactured parts have small edge breaks that catch light and create subtle highlights.",
    ],
  },
  animation: {
    heading: "Rendered animation",
    paragraphs: [
      "Rendered animations extend a product visual into motion. They can walk someone through how a product is assembled, show details a still image leaves hidden, or present the product as it is used.",
      "The example below is a rendered animation of a shaver: an animated reveal of the interior workings. It also shows transparency, with see-through parts so you can see inside the product.",
      "For animations rendered in KeyShot, you will need to purchase a full version of KeyShot. The bundled KeyShot version is for high-quality still-image generation.",
    ],
    usesHeading: "Animation options include:",
    uses: [
      "Explode: move components apart or bring them together to explain assembly order, part relationships, and how a product is built.",
      "Rotate: turn individual parts or an entire assembly to show a design from multiple angles, create a turntable, or demonstrate moving components.",
      "Transparency: change the transparency of housings and other parts over time to reveal internal components while retaining the surrounding product context.",
      "Cutting geometry: animate cutting geometry through a model to reveal sections, internal shapes, and details that would otherwise be hidden.",
    ],
    video: {
      src: "/assets/viz-shaver-reveal.mp4",
      poster: "/assets/viz-shaver-reveal-poster.jpg",
      caption: "Animated reveal of the interior workings of a shaver, also showing transparency with see-through parts so you can see inside the product.",
    },
  },
  keyshot: {
    heading: "Bundled KeyShot for high-quality images",
    body: "Power Surfacing Viz includes a bundled version of KeyShot for high-quality still-image generation, with no separate KeyShot license required for those images. To create animations in KeyShot, you will need to purchase a full version of KeyShot. Power Surfacing Studio and Power Surfacing RE Studio also include these bundled KeyShot image-rendering capabilities.",
  },
  lineup: {
    heading: "Where Viz sits in the Power Surfacing family",
    intro:
      "The standalone products form a stair-step. Power Surfacing Studio and Power Surfacing RE Studio each include the full functionality of Power Surfacing Viz plus the KeyShot render engine.",
    steps: [
      {
        name: "Power Surfacing Viz",
        path: "/products/power-surfacing-visualize",
        role: "CAD import/export, cleanup, lightweight edits, bundled KeyShot, and mesh export for Blender, Modo, 3ds Max, and Maya",
      },
      {
        name: "Power Surfacing Studio",
        path: "/products/power-surfacing-studio",
        role: "Full Viz functionality plus CAD, sketching, Sub-D modeling, and the KeyShot render engine",
      },
      {
        name: "Power Surfacing RE Studio",
        path: "/products/power-surfacing-re-studio",
        role: "Full Viz and Studio functionality plus reverse engineering and the KeyShot render engine",
      },
    ],
  },
  featuresHeading: "What Viz includes",
  features: [
    {
      title: "CAD and mesh import",
      text: "Import STEP, OBJ, STL, 3MF, and other common CAD and mesh formats. Open SOLIDWORKS files or receive a direct export from SOLIDWORKS, depending on licensing.",
    },
    {
      title: "Assembly organization",
      text: "Use an assembly browser to navigate parts and organize materials so large engineering models are ready for visualization.",
    },
    {
      title: "Precise NURBS measurement",
      text: "Precise measurement tools include closest point and ray tracing on precise NURBS surfaces.",
    },
    {
      title: "Interactive Visualization",
      text: "Visualize the tessellation and adjust the tessellation settings to get the appropriate mesh density for a rendering application or an interactive visualization application. Tessellation tolerances can be adjusted for multiple objects, or for all objects in an assembly, and those updates are applied in parallel.",
    },
    {
      title: "Micro Filleting",
      text: "Turn unrealistically sharp CAD edges into believable manufactured edges—without changing the CAD model.",
    },
    {
      title: "Visibility and cleanup",
      text: "Show or hide faces and parts, assign materials, and clean up colors so the model looks right in KeyShot and other visualization tools.",
    },
    {
      title: "Lightweight positioning",
      text: "Create exploded views and simple part positioning for product visuals without entering a full CAD modeling workflow.",
    },
    {
      title: "Bundled KeyShot rendering",
      text: "Create high-quality still images with bundled KeyShot. KeyShot animation requires purchasing a full version of KeyShot.",
    },
    {
      title: "Rendered animation",
      text: "Create rendered animations with exploded views, rotation, transparency changes, and moving cutting geometry to explain assemblies and reveal internal workings.",
    },
    {
      title: "Visualization export",
      text: "Export to KeyShot, OBJ, STL, and glTF. Prepare low-poly or high-density meshes for visualization packages such as Blender, Modo, 3ds Max, and Maya, and for 3D printing.",
    },
  ],
  workflow: {
    heading: "A typical Viz workflow",
    steps: [
      { title: "Import the engineering model", text: "Bring in STEP, SOLIDWORKS, OBJ, STL, or 3MF data." },
      { title: "Organize the assembly", text: "Use the assembly browser to find parts, hide what you do not need, and group materials." },
      { title: "Tessellate CAD to meshes", text: "IntegrityWare’s world-class tessellation engine converts CAD surfaces into meshes. C# multi-threading keeps it very fast on large assemblies and large complex parts. Produce low-poly models for gaming and virtual reality, or high-density meshes for visualization and 3D printing." },
      { title: "Assign materials and color", text: "Clean up colors and apply materials so the model is ready for product imagery." },
      { title: "Position or Animate", text: "Position components, create exploded views, rotate parts or assemblies, animate transparency, or move cutting geometry to reveal sections and internal details." },
      { title: "Render or export", text: "Create high-quality still images with bundled KeyShot, or prepare and export meshes to OBJ, STL, or glTF for Blender, Modo, 3ds Max, Maya, and other visualization packages. KeyShot animation requires purchasing a full version of KeyShot." },
    ],
  },
  formats: {
    heading: "Supported input and output formats",
    inputs: [
      "STEP",
      "OBJ",
      "STL",
      "3MF",
      "SOLIDWORKS files (open or receive by export, depending on licensing)",
    ],
    outputs: [
      "KeyShot",
      "OBJ — Blender, Modo, 3ds Max, Maya, gaming, VR, and other visualization packages",
      "STL — 3D printing and mesh exchange",
      "glTF",
    ],
  },
  faqs: [
    {
      q: "Is Power Surfacing Viz a CAD modeler?",
      a: "No. It is a CAD visualization, translation, and rendering-prep product. Use Power Surfacing Studio for standalone CAD, sketching, and Sub-D modeling, and Power Surfacing RE Studio for reverse engineering and scan-to-CAD.",
    },
    {
      q: "Do I need a full CAD seat to use Viz?",
      a: "No. Viz is a standalone Windows application. A full CAD modeling seat is not required to import engineering models, clean them up, and create product visuals.",
    },
    {
      q: "How does Viz convert CAD data to meshes?",
      a: "Viz uses IntegrityWare’s world-class tessellation engine to convert CAD surfaces into meshes. The engine leverages C# multi-threading so tessellation stays very fast on large assemblies and large complex parts. It can produce both low-poly models for gaming and virtual reality and high-density meshes for visualization and 3D printing. You control tessellation so imported CAD data is ready for KeyShot and for export to packages such as Blender, Modo, 3ds Max, and Maya.",
    },
    {
      q: "Can Viz produce low-poly and high-density meshes?",
      a: "Yes. IntegrityWare’s tessellation engine can produce low-poly models for gaming and virtual reality, and high-density meshes for visualization and 3D printing. You set tessellation density for the job.",
    },
    {
      q: "Does Viz include KeyShot? Do I need a separate KeyShot license?",
      a: "KeyShot is bundled with Power Surfacing Viz for high-quality still-image generation. You do not need a separate KeyShot license for those images. To create animations in KeyShot, you will need to purchase a full version of KeyShot. Power Surfacing Studio and Power Surfacing RE Studio also include the bundled KeyShot image-rendering capabilities.",
    },
    {
      q: "Can Viz export meshes for Blender, Modo, 3ds Max, or Maya?",
      a: "Yes. Prepare visualization-quality meshes in Viz and export OBJ, STL, or glTF for other visualization packages such as Blender, Modo, 3ds Max, and Maya. You can also render in Viz with bundled KeyShot.",
    },
    {
      q: "How is this related to Power Translators?",
      a: "Power Surfacing Viz is based on the popular Power Translators product, which imported STEP and SOLIDWORKS data into 3ds Max for high-quality rendering. Power Surfacing Viz is standalone and does not require a separate license of any other third-party product.",
    },
    {
      q: "When should I choose Studio or RE Studio instead?",
      a: "Choose Studio when you need sketch-based CAD, feature modeling, or full Sub-D creation. Choose RE Studio when you need reverse engineering, scan-to-CAD, surface fitting, or deviation analysis. Both Studio and RE Studio include the full functionality of Viz plus the KeyShot render engine.",
    },
    {
      q: "Do Studio and RE Studio include Viz and KeyShot?",
      a: "Yes. Power Surfacing Studio and Power Surfacing RE Studio each include the full functionality of Power Surfacing Viz and bundled KeyShot for high-quality still images. A separate Viz license is not required. KeyShot animation requires purchasing a full version of KeyShot.",
    },
    {
      q: "Is a free trial available?",
      a: "Yes. A free trial of Power Surfacing Viz is available from the trial downloads page.",
    },
  ],
  relatedLinks: [
    { label: "Power Surfacing Studio", path: "/products/power-surfacing-studio" },
    { label: "Power Surfacing RE Studio", path: "/products/power-surfacing-re-studio" },
    { label: "Compare Power Surfacing Products", path: "/products/comparison" },
  ],
};
