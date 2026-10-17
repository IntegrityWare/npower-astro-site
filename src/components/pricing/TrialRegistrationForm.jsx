import React, { useEffect, useId, useRef, useState } from "react";
import { Link } from "@/lib/link";
import { Download } from "lucide-react";
import { COUNTRIES } from "@/lib/trialDownloads";
import { loadRegistrationVerification, submitVerifiedRegistration } from "@/lib/keapRegistration";

/**
 * Duplicates the Keap registration form from
 * npowersoftware.com/NewDownloadPowerSurfacing.html (and sibling campaigns).
 * Posts directly to the Infusionsoft/Keap process endpoint.
 */
export default function TrialRegistrationForm({ campaign }) {
  const formRef = useRef(null);
  const submittingRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState("");
  const uid = useId().replace(/:/g, "");
  const emailId = `trial-email-${uid}`;
  const firstId = `trial-first-${uid}`;
  const lastId = `trial-last-${uid}`;
  const companyId = `trial-company-${uid}`;
  const phoneId = `trial-phone-${uid}`;
  const countryId = `trial-country-${uid}`;
  const websiteId = `trial-website-${uid}`;
  const followId = `trial-follow-${uid}`;
  const existingId = `trial-existing-${uid}`;

  useEffect(() => {
    setInitialized(true);
    if (!campaign?.recaptchaSiteKey) return;
    // Preload only; verification is requested when the visitor submits.
    loadRegistrationVerification(campaign).catch(() => {});
    const reset = () => { submittingRef.current = false; setSubmitting(false); };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, [campaign]);

  if (!campaign) return null;

  const onSubmit = async (event) => {
    event.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setError("");
    try {
      if (await submitVerifiedRegistration(formRef.current, campaign)) return;
    } catch {
      setError("We could not complete verification. Your information is still here. Please try again; if it continues, allow the verification service in your browser or contact support.");
    }
    submittingRef.current = false;
    setSubmitting(false);
  };

  const fieldClass =
    "w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500";

  return (
    <form
      ref={formRef}
      id={`inf_form_${campaign.formXid}`}
      name={campaign.formName}
      acceptCharset="UTF-8"
      action={campaign.formAction}
      method="POST"
      onSubmit={onSubmit}
      className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8"
    >
      <input type="hidden" name="inf_form_xid" value={campaign.formXid} />
      <input type="hidden" name="inf_form_name" value={campaign.formName} />
      <input type="hidden" name="infusionsoft_version" value={campaign.infusionsoftVersion} />
      <input type="hidden" name="inf_custom_CustomerType" value="" />

      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{campaign.title}</h3>
        <p className="text-sm text-slate-600 mb-3">{campaign.intro}</p>
        <p className="text-sm text-slate-500">
          <Link to={campaign.privacyUrl} className="text-red-600 hover:text-red-700 font-medium">
            Privacy Statement
          </Link>
          <span className="mx-2">·</span>
          <span>
            <span className="text-red-600">*</span> denotes required fields
          </span>
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div className="sm:col-span-2">
          <label htmlFor={emailId} className="block text-sm font-medium text-slate-700 mb-1.5">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id={emailId}
            name="inf_field_Email"
            type="email"
            required
            autoComplete="email"
            placeholder="Email *"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor={firstId} className="block text-sm font-medium text-slate-700 mb-1.5">
            First Name <span className="text-red-600">*</span>
          </label>
          <input
            id={firstId}
            name="inf_field_FirstName"
            type="text"
            required
            autoComplete="given-name"
            placeholder="First Name *"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor={lastId} className="block text-sm font-medium text-slate-700 mb-1.5">
            Last Name <span className="text-red-600">*</span>
          </label>
          <input
            id={lastId}
            name="inf_field_LastName"
            type="text"
            required
            autoComplete="family-name"
            placeholder="Last Name *"
            className={fieldClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={companyId} className="block text-sm font-medium text-slate-700 mb-1.5">
            Company <span className="text-red-600">*</span>
          </label>
          <input
            id={companyId}
            name="inf_field_Company"
            type="text"
            required
            autoComplete="organization"
            placeholder="Company *"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor={phoneId} className="block text-sm font-medium text-slate-700 mb-1.5">
            Phone
          </label>
          <input
            id={phoneId}
            name="inf_field_Phone1"
            type="tel"
            autoComplete="tel"
            placeholder="Phone"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor={countryId} className="block text-sm font-medium text-slate-700 mb-1.5">
            Country
          </label>
          <select id={countryId} name="inf_field_Country" defaultValue="" className={fieldClass}>
            <option value="">Please select one</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={websiteId} className="block text-sm font-medium text-slate-700 mb-1.5">
            Website
          </label>
          <input
            id={websiteId}
            name="inf_field_Website"
            type="text"
            autoComplete="url"
            placeholder="Website"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {campaign.followUpOption && (
          <label className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer">
            <input
              id={followId}
              type="checkbox"
              name={campaign.followUpOption.name}
              value={campaign.followUpOption.value}
              className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500"
            />
            <span>{campaign.followUpOption.label}</span>
          </label>
        )}
        {campaign.existingCustomerOption && (
          <label className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer">
            <input
              id={existingId}
              type="checkbox"
              name={campaign.existingCustomerOption.name}
              value={campaign.existingCustomerOption.value}
              className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500"
            />
            <span>{campaign.existingCustomerOption.label}</span>
          </label>
        )}
      </div>

      {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={!initialized || submitting}
        aria-busy={submitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-wait rounded-lg transition-colors"
      >
        <Download className="w-4 h-4" />
        {!initialized ? "Loading registration…" : submitting ? "Verifying registration…" : campaign.submitLabel}
      </button>

      <noscript><p className="mt-4 text-sm text-red-700">Please enable JavaScript to verify and submit your registration.</p></noscript>

      <p className="mt-4 text-xs text-slate-500">
        Registration is required before trial download links are provided. Submitting this form completes registration for your selected product.
      </p>
    </form>
  );
}
