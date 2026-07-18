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
        q: "I just installed a demo of Power Surfacing and the plugin is not visible. What did I miss?",
        a: "Most likely an error occurred during installation. Please try one or more of these suggestions:\n\n1) Check that the installer year matches the version of SOLIDWORKS you are using.\n2) Ensure that you are installing the plugin in the current working SOLIDWORKS directory.\n3) Temporarily disable your firewall, then re-install the plugin. Some firewalls are known to block or interfere with installation.\n4) Uninstall, then re-install the plugin.",
      },
      {
        q: 'I just installed Power Surfacing and I get an error "could not initialize application, Error 9 (IPM)" upon starting up SOLIDWORKS. What happened?',
        a: 'There are two possible reasons for this error:\n\n1) The plugin was installed in the incorrect directory. Power Surfacing needs to be installed in the current working directory of SOLIDWORKS. The standard directory generally looks similar to C:/Program Files/SolidWorks Corp/SOLIDWORKS.\n\n2) The plugin needs Administrator privileges from SOLIDWORKS to complete the installation. Right-click on the SOLIDWORKS icon on your desktop, choose "Properties," open the "Compatibility" tab, and check "Run as Administrator," then run SOLIDWORKS. Note: this generally only needs to be done once after the installation.',
      },
      {
        q: "The plugin's toolbar is not visible in SOLIDWORKS, and toggling the checkbox in the Add-In Manager does nothing. What do I do?",
        a: "Most likely an error occurred during installation. Please try one or more of these suggestions:\n\n1) Check that the installer year matches the version of SOLIDWORKS you are using.\n2) Ensure that you are installing the plugin in the current working SOLIDWORKS directory.\n3) Temporarily disable your firewall, then re-install the plugin.\n4) Uninstall, then re-install the plugin.",
      },
    ],
  },
  {
    category: "Licensing",
    items: [
      {
        q: "How do I activate my Power Surfacing license?",
        a: "Node-locked licenses (v5.0+) are activated directly from the license dialog inside SOLIDWORKS (Power Surfacing > License). Network licenses are activated through the Network License Manager — refer to the activation instructions in your purchase invoice. For step-by-step help, see our Installation & Licensing page or contact support@npowersoftware.com.",
      },
      {
        q: "I am attempting to activate my license and I receive an error. What can I do to fix this?",
        a: 'Common error messages:\n\n5008 — "Invalid Activation Data": The License ID or Password was entered incorrectly. Please ensure that you typed the codes correctly.\n\n5010 — "Different Product": The product License ID does not match the product installer. Either your installer version differs from your license version (upgrade your license or obtain the older installer), or you are incorrectly activating a Network License, which must be activated through the Network License Manager.\n\n5013 — "No Remaining Activations": Licenses allow only one activation by default. If you receive this error, the activation is already in use — follow the license deactivation instructions before re-activating.\n\nIf you continue to experience difficulties, contact our support team at support@npowersoftware.com.',
      },
      {
        q: "How do I deactivate my Power Surfacing license?",
        a: 'For v5.0+ licenses, use the deactivate option in the license dialog (Power Surfacing > License).\n\nFor v2–v4 licenses: 1) Open SOLIDWORKS on the current machine. 2) Go to the Power Surfacing drop-down menu and click "License." 3) Click "Deactivate" in the dialog that appears. 4) Go to your SOLIDWORKS root directory and email the file Power_Surfacing_1.ini, along with your License ID, to support@npowersoftware.com.',
      },
      {
        q: "How do I transfer my Power Surfacing license to another machine?",
        a: "Starting with version 5.0, license transfer is handled through the license dialog (node-locked) or the Network License Manager (network licenses). For earlier versions, follow the license deactivation instructions — once the deactivation is complete, your license is released and can be re-activated on another machine.",
      },
      {
        q: "I need to reformat/refresh/update my machine. Do I need to deactivate my license?",
        a: "Yes, license deactivation is necessary prior to reformatting, refreshing, or doing any major updates to your machine. Failure to do so may result in a license loss. nPower Software is not responsible for lost license activations.",
      },
      {
        q: "Are Network (floating) licenses available for the Power Surfacing products?",
        a: "Yes, network licenses are available for the Power Surfacing products.",
      },
      {
        q: "How can I tell what product or type of license is installed on my machine?",
        a: 'Open the nPower License Utility dialog located under Power Surfacing > License. The product name will be listed there. Note: if the nPower License Utility lists "Power Surfacing Demo" as the product name, there is no valid, active license available on the machine.',
      },
    ],
  },
  {
    category: "General",
    items: [
      {
        q: "How do I start a model?",
        a: "Use one of the primitives in the Power Surfacing drop-down, or create a sketch and use Create From Sketch in the drop-down on the left of the toolbar. After you set the parameters of the primitive, click the green check to enter Power Surfacing editing mode.",
      },
      {
        q: "How do I use a specific tool?",
        a: 'All of the Power Surfacing tools are documented in our help file, which can be found by clicking the "?" button in the Power Surfacing toolbar. You can also browse our Documentation and Tutorials pages on this site.',
      },
      {
        q: "Why doesn't transparency mode work?",
        a: "In order to access the transparency feature, your graphics card must support at least OpenGL 3.3 or above.",
      },
      {
        q: 'Why can\'t I see the Sub-D box after the "Create Box" command?',
        a: 'Your graphics card is unsupported but still passed our graphics card check. To fix this, navigate to Tools > Power Surfacing > Options... and under "General" check the "Disable shaders" box.',
      },
      {
        q: "I installed a new version and the UI is messed up. How do I restore the user interface?",
        a: 'The following steps should restore your user interface to show the correct tools and icons:\n\n1) Close both the Power Surfacing and Power Surfacing RE tabs by clicking the "X" on the tabs.\n2) Go to Tools > Add-ins and turn off both checkmarks for Power Surfacing.\n3) Quit SOLIDWORKS.\n4) Restart SOLIDWORKS as Administrator (right-click SLDWorks.exe and choose "Run as Administrator").\n5) Go to Tools > Add-ins and turn Power Surfacing back on.',
      },
    ],
  },
  {
    category: "Upgrades & Subscriptions",
    items: [
      {
        q: "How do I upgrade to the latest version of the software?",
        a: 'Visit our Downloads page to get the latest installer. If you are using a standalone license and are current on maintenance, the license should be picked up automatically. If you are on a Network License, you may also need to re-link the new version of SOLIDWORKS through the NLM: run the NLM on the client machine, navigate to File > Link to SolidWorks, and choose the appropriate version — a "Linked Successful" message should appear. For additional questions, contact support@npowersoftware.com.',
      },
      {
        q: "Am I eligible to get the latest version?",
        a: "Users who are up to date on the annual maintenance subscription are eligible for patch releases and the next major release. Users who do not meet this description will need to purchase an upgrade.",
      },
      {
        q: "Is the maintenance subscription required?",
        a: "No. However, users without maintenance subscriptions are ineligible for upgrades to patch releases or the latest major release.",
      },
    ],
  },
  {
    category: "Import / Export",
    items: [
      {
        q: "What file types can be imported by Power Surfacing?",
        a: "Supported file types include: .OBJ, .FBX, and .pmodel (a Power Surfacing native file format).",
      },
      {
        q: "What file types can I export my file into?",
        a: ".OBJ, .FBX, or .pmodel (a Power Surfacing native file format). You can also convert your Sub-D model into a SOLIDWORKS surface or solid and save in any of the file formats supported by SOLIDWORKS.",
      },
      {
        q: "How do I import an .STL file?",
        a: '.STL file imports are supported by Power Surfacing RE only. This option can be found in the Power Surfacing drop-down menu, "Import Scanned/Reference Mesh."',
      },
    ],
  },
];

export default function FAQSolidworks() {
  return (
    <div>
      <PageTitle
        title="FAQ — SOLIDWORKS Products | nPower Software"
        description="Frequently asked questions for Power Surfacing, Power Surfacing RE, and Power Shell for SOLIDWORKS — installation, licensing, upgrades, and import/export."
      />
      <PageHero
        title="FAQ — SOLIDWORKS Products"
        subtitle="Answers to common questions about Power Surfacing, Power Surfacing RE, and Power Shell for SOLIDWORKS."
        breadcrumbs={[
          { label: "Resources", path: "/resources" },
          { label: "FAQ", path: "/resources/faq" },
          { label: "SOLIDWORKS Products" },
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
          { label: "Installation & Licensing Help", path: "/support/installation" },
        ]}
      />
    </div>
  );
}
