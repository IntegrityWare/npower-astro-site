import React, { useState } from "react";
import useContactForm from "@/components/shared/useContactForm";
import PageHero from "@/components/shared/PageHero";
import PageTitle from "@/components/shared/PageTitle";
import { Mail, Phone, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactSupport() {
  const [form, setForm] = useState({ name: "", email: "", product: "", subject: "", message: "" });

  const { submitted, sending, error, handleSubmit } = useContactForm("support", form);

  return (
    <div>
      <PageTitle
        title="Contact Support — Technical Help | nPower Software"
        description="Get technical help from the Power Surfacing support team — installation, licensing, and product questions."
      />
      <PageHero
        title="Contact Support"
        subtitle="Get help from the Power Surfacing support team."
        breadcrumbs={[
          { label: "Support", path: "/support" },
          { label: "Contact Support" },
        ]}
      />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="text-center py-16">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Message Sent</h2>
                  <p className="text-slate-600">We'll get back to you as soon as possible. Thank you for contacting Power Surfacing support.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" aria-busy={sending}>
                  <div className="hidden" aria-hidden="true">
                    <label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
                  </div>
                  {error && <p role="alert" className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">{error} <a className="underline" href="mailto:support@npowersoftware.com">support@npowersoftware.com</a></p>}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="support-name" className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                      <input type="text" required id="support-name" name="name" maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                    <div>
                      <label htmlFor="support-email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                      <input type="email" required id="support-email" name="email" maxLength={254} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="support-product" className="block text-sm font-medium text-slate-700 mb-1.5">Product</label>
                    <select id="support-product" name="product" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                      <option value="">Select a product</option>
                      <option>Power Surfacing Viz</option>
                      <option>Power Surfacing RE Studio</option>
                      <option>Power Surfacing Studio</option>
                      <option>Power Surfacing for SOLIDWORKS</option>
                      <option>Power Surfacing RE for SOLIDWORKS</option>
                      <option>Power Shell for SOLIDWORKS</option>
                      <option>General / Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="support-subject" className="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
                    <input type="text" required id="support-subject" name="subject" maxLength={160} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                  </div>
                  <div>
                    <label htmlFor="support-message" className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                    <textarea required rows={5} id="support-message" name="message" maxLength={5000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
                  </div>
                  <button type="submit" disabled={sending} className="disabled:cursor-wait disabled:opacity-60 flex items-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                    <Send className="w-4 h-4" /> {sending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-4">Contact Information</h3>
                <div className="space-y-4 text-sm">
                  <a href="mailto:support@npowersoftware.com" className="flex items-center gap-3 text-slate-600 hover:text-red-600 transition-colors">
                    <Mail className="w-5 h-5 text-red-500" /> support@npowersoftware.com
                  </a>
                  <a href="tel:+18585928866" className="flex items-center gap-3 text-slate-600 hover:text-red-600 transition-colors">
                    <Phone className="w-5 h-5 text-red-500" /> Contact Sales
                  </a>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="w-5 h-5 text-red-500" /> Mon-Fri 9am-5pm EST
                  </div>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-bold text-red-900 mb-2">Quick Tip</h3>
                <p className="text-sm text-red-700">Include your product version, SOLIDWORKS version (if applicable), and a description of the issue for the fastest support response.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
