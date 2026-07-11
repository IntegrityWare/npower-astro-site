import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import { Mail, CheckCircle, Zap, Megaphone, BookOpen, CalendarDays } from "lucide-react";

const TOPICS = [
  { id: "software_updates", label: "Software Updates", description: "New versions, features, and improvements", icon: Zap },
  { id: "release_announcements", label: "Release Announcements", description: "Major product launches and releases", icon: Megaphone },
  { id: "workflow_tips", label: "Workflow Tips", description: "Scan-to-CAD, Sub-D, and reverse engineering techniques", icon: BookOpen },
  { id: "events_webinars", label: "Events & Webinars", description: "Trade shows, conferences, and live webinars", icon: CalendarDays },
];

export default function NewsletterSignup() {
  const [form, setForm] = useState({ name: "", email: "", interests: ["software_updates", "release_announcements"] });
  const [status, setStatus] = useState("idle"); // idle | saving | done | error

  const toggleInterest = (id) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(id) ? f.interests.filter((i) => i !== id) : [...f.interests, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("saving");
    try {
      await base44.entities.NewsletterSubscriber.create(form);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <PageTitle
        title="Newsletter Signup | nPower Software"
        description="Subscribe to the nPower Software newsletter for the latest Power Surfacing updates, release announcements, and industry workflow tips."
      />
      <PageHero
        title="Stay in the Loop"
        subtitle="Subscribe to receive the latest software updates, release announcements, and industry workflow tips — straight to your inbox."
        breadcrumbs={[{ label: "Newsletter" }]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {status === "done" ? (
            <div className="text-center bg-slate-50 border border-slate-200 rounded-2xl p-12">
              <CheckCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">You're subscribed!</h2>
              <p className="text-slate-600">Thanks for signing up. Watch your inbox for the latest from nPower Software.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-bold text-slate-900">Subscribe to the Newsletter</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="nl-name" className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                  <input
                    id="nl-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="nl-email" className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                  <input
                    id="nl-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <p className="text-sm font-medium text-slate-700 mb-3">What would you like to receive?</p>
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {TOPICS.map((topic) => {
                  const Icon = topic.icon;
                  const selected = form.interests.includes(topic.id);
                  return (
                    <button
                      type="button"
                      key={topic.id}
                      onClick={() => toggleInterest(topic.id)}
                      className={`text-left rounded-xl border p-4 transition-colors ${selected ? "border-red-500 bg-red-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${selected ? "text-red-600" : "text-slate-400"}`} />
                        <span className="text-sm font-semibold text-slate-900">{topic.label}</span>
                      </div>
                      <p className="text-xs text-slate-500">{topic.description}</p>
                    </button>
                  );
                })}
              </div>

              {status === "error" && (
                <p className="text-sm text-red-600 mb-4">Something went wrong — please try again.</p>
              )}

              <button
                type="submit"
                disabled={status === "saving"}
                className="btn-anim w-full sm:w-auto px-8 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-60"
              >
                {status === "saving" ? "Subscribing..." : "Subscribe"}
              </button>
              <p className="text-xs text-slate-400 mt-4">We respect your inbox. Unsubscribe anytime — we never share your email.</p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}