import React from "react";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import CTASection from "@/components/shared/CTASection";
import CategorizedFAQ from "@/components/shared/CategorizedFAQ";

const CATEGORIES = [
  {
    category: "Installation",
    items: [
      {
        q: "Do the Studio products require SOLIDWORKS or any other CAD system?",
        a: "No. Power Surfacing Studio and Power Surfacing RE Studio are fully standalone applications — no third-party CAD license is required to install or run them.",
      },
      {
        q: "What are the system requirements for the Studio products?",
        a: "The Studio products run on Windows 10 or Windows 11 (64-bit) with a dedicated graphics card that supports OpenGL Shaders. See our System Requirements page for full details.",
      },
      {
        q: "I installed the software but it won't start. What should I check?",
        a: "First, make sure your graphics drivers are up to date — most startup and display issues are driver related. If the problem persists, temporarily disable your firewall and re-install, or contact support@npowersoftwarenew.com with your system details.",
      },
    ],
  },
  {
    category: "Licensing",
    items: [
      {
        q: "How do I activate my Studio license?",
        a: "Launch the application and open the License dialog from the Help menu. Enter the License ID and Password from your purchase invoice, and the license activates over the internet. Contact support@npowersoftwarenew.com if you need offline activation.",
      },
      {
        q: "Can I move my license to a different computer?",
        a: "Yes. Deactivate the license from the License dialog on the old machine first, then activate it on the new machine. Always deactivate before reformatting or replacing a computer to avoid losing the activation.",
      },
      {
        q: "What is the difference between the perpetual license and the annual subscription?",
        a: "A perpetual license is a one-time purchase that you own forever, with an optional annual maintenance plan for updates and support. The annual subscription has a lower upfront cost and includes all updates and support while active. See our Pricing page for current rates.",
      },
    ],
  },
  {
    category: "General",
    items: [
      {
        q: "How do I start a new model in Power Surfacing Studio?",
        a: "Start from one of the Sub-D primitives (box, cylinder, torus, and more) or create a dimension-driven sketch and build from it. Then use push-pull editing, Extrude, Inset, Insert Loops, Bridge, and the other Sub-D tools to shape your design.",
      },
      {
        q: "What makes RE Studio different from Studio?",
        a: "Power Surfacing RE Studio is focused on reverse engineering — converting 3D scans, sculpted meshes, and polygonal files into NURBS surfaces using tools like Quad Wrap retopology and Shrink Wrap. Power Surfacing Studio is focused on freeform Sub-D design and Class A surfacing from scratch.",
      },
      {
        q: "Can the Studio products convert my Sub-D model to a precise CAD solid?",
        a: "Yes. Both Studio products convert Sub-D geometry into Class A NURBS surfaces or solid bodies with G2 edge continuity, ready for downstream CAD and manufacturing.",
      },
    ],
  },
  {
    category: "Import / Export",
    items: [
      {
        q: "What file types can the Studio products import?",
        a: "Power Surfacing Studio imports .OBJ and .FBX meshes from tools like Modo, 3ds Max, and Maya. Power Surfacing RE Studio additionally imports .STL files and point cloud (OBJ) data from 3D scanners.",
      },
      {
        q: "What file types can I export to?",
        a: "Converted NURBS surfaces and solids can be exported to STEP, IGES, and SAT formats, which are readable by virtually every downstream CAD system.",
      },
      {
        q: "Can I bring a ZBrush sculpt into RE Studio?",
        a: "Yes. Export your sculpt from ZBrush as an OBJ or STL file and import it into Power Surfacing RE Studio, where the automated Quad Wrap and Shrink Wrap tools convert it into clean, CAD-ready NURBS geometry.",
      },
    ],
  },
];

export default function FAQStudio() {
  return (
    <div>
      <PageTitle
        title="FAQ — Studio Products | nPower Software"
        description="Frequently asked questions for Power Surfacing Studio and Power Surfacing RE Studio — installation, licensing, modeling, and import/export."
      />
      <PageHero
        title="FAQ — Studio Products"
        subtitle="Answers to common questions about Power Surfacing Studio and Power Surfacing RE Studio, our standalone design and reverse engineering applications."
        breadcrumbs={[
          { label: "Resources", path: "/resources" },
          { label: "FAQ", path: "/resources/faq" },
          { label: "Studio Products" },
        ]}
      />
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategorizedFAQ categories={CATEGORIES} />
        </div>
      </section>
      <CTASection
        title="Still Have Questions?"
        subtitle="Our support team is happy to help with installation, licensing, or modeling questions."
        actions={[
          { label: "Contact Support", path: "/support/contact" },
          { label: "Download a Trial", path: "/pricing/trials" },
        ]}
      />
    </div>
  );
}
