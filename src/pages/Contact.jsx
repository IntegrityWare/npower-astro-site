import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "@/components/shared/PageHero";
import { Mail, Phone, MapPin, Send, CheckCircle, Headphones, Download } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", interest: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <PageHero
        title="Contact Us"
        subtitle="Get in touch with the nPowerSoftware team for sales, demos, or general inquiries."
        breadcrumbs={[{ label: "Contact" }]}
      />
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="text-center py-16">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You</h2>
                  <p className="text-slate-600">Your message has been sent. Our team will respond within one business day.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                      <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                      <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Company</label>
                    <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">I'm interested in</label>
                    <select value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select an option</option>
                      <option>Product demo</option>
                      <option>Pricing information</option>
                      <option>Technical consultation</option>
                      <option>Partnership opportunities</option>
                      <option>General inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>
                  <button type="submit" className="flex items-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    <Send className="w-4 h-4" /> Send Message
                  </button>
                </form>
              )}
            </div>
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-4">nPowerSoftware</h3>
                <div className="space-y-4 text-sm">
                  <a href="mailto:info@npowersoftware.com" className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors">
                    <Mail className="w-5 h-5 text-blue-500" /> info@npowersoftware.com
                  </a>
                  <a href="tel:+1-800-555-0199" className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors">
                    <Phone className="w-5 h-5 text-blue-500" /> Contact Sales
                  </a>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-3">Quick Links</h3>
                <div className="space-y-2">
                  <Link to="/support/contact" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    <Headphones className="w-4 h-4" /> Technical Support
                  </Link>
                  <Link to="/pricing/trials" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    <Download className="w-4 h-4" /> Download Trial
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}