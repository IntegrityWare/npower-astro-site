import React from "react";
import { Link } from '@/lib/link';
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import CTASection from "@/components/shared/CTASection";
import { CalendarDays, MapPin, Monitor, Ticket } from "lucide-react";

const EVENTS = [
  {
    type: "Trade Show",
    name: "3DEXPERIENCE World 2027",
    date: "February 2027",
    location: "Houston, TX, USA",
    description: "Visit the nPower Software booth to see live demonstrations of Power Surfacing and Power Surfacing RE inside SOLIDWORKS, and talk with our engineering team.",
  },
  {
    type: "Webinar",
    name: "Scan-to-CAD Masterclass: From Raw Mesh to Manufacturing-Ready Solid",
    date: "September 2026",
    location: "Online — Live Webinar",
    description: "A live walkthrough of the full reverse engineering workflow in Power Surfacing RE Studio, including Quad Wrap retopology, Shrink Wrap detail capture, and STEP export.",
  },
  {
    type: "Trade Show",
    name: "RAPID + TCT 2027",
    date: "Spring 2027",
    location: "USA",
    description: "North America's largest additive manufacturing event. See how Power Surfacing RE converts 3D scans and topology optimization meshes into clean CAD geometry.",
  },
  {
    type: "Webinar",
    name: "Freeform Sub-D Design in SOLIDWORKS",
    date: "October 2026",
    location: "Online — Live Webinar",
    description: "Learn how Power Surfacing brings Class A freeform surfacing to SOLIDWORKS, with live Q&A covering push-pull editing, edge weighting, and feature tree integration.",
  },
  {
    type: "Conference",
    name: "Develop3D Live",
    date: "2027",
    location: "United Kingdom",
    description: "Join nPower Software at one of Europe's leading product development conferences for sessions on Sub-D modeling and reverse engineering workflows.",
  },
];

const typeIcon = { "Trade Show": Ticket, Webinar: Monitor, Conference: CalendarDays };

export default function Events() {
  return (
    <div>
      <PageTitle
        title="Events & Webinars | nPower Software"
        description="Upcoming trade shows, industry conferences, and live webinars where nPower Software will be presenting Power Surfacing products."
      />
      <PageHero
        title="Events & Webinars"
        subtitle="Meet the nPower Software team at upcoming trade shows, industry conferences, and live webinars."
        breadcrumbs={[{ label: "Events" }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Upcoming Events</h2>
          <div className="space-y-5">
            {EVENTS.map((event) => {
              const Icon = typeIcon[event.type] || CalendarDays;
              return (
                <div key={event.name} className="card-anim bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row gap-5">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">{event.type}</span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500"><CalendarDays className="w-3.5 h-3.5" /> {event.date}</span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1.5">{event.name}</h3>
                    <p className="text-sm text-slate-600">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 bg-neutral-950 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Never miss an event</h3>
            <p className="text-slate-400 text-sm mb-5">Subscribe to our newsletter to get event announcements and webinar invitations.</p>
            <Link to="/newsletter" className="btn-anim inline-block px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg">
              Subscribe to the Newsletter
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Want a Private Demo Instead?"
        subtitle="Can't make an event? Our team is happy to give you a personalized product demonstration."
        actions={[
          { label: "Request a Demo", path: "/contact" },
          { label: "Watch Product Demos", path: "/resources/demos" },
        ]}
      />
    </div>
  );
}