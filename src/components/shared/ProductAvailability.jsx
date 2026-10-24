import React, { useId, useState } from "react";
import { CheckCircle } from "lucide-react";

const BETA_PRODUCTS = [
  { id: "power-surfacing-re-solidworks", label: "Power Surfacing RE" },
  { id: "power-surfacing-re-studio", label: "Power Surfacing RE Studio" },
];

const SALES_EMAIL = "sales@npowersoftware.com";

const fieldClass =
  "w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500";

export function InBetaBanner({ contentWidth = "max-w-7xl" }) {
  return (
    <section className="bg-white border-b border-red-100">
      <div className={`${contentWidth} mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center`}>
        <p className="text-3xl md:text-5xl font-bold text-red-600">In Beta, Releasing Very Soon</p>
      </div>
    </section>
  );
}

export function ComingSoonBanner({ defaultProductId }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-white border-b border-red-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <p className="text-4xl md:text-6xl font-bold text-red-600">Coming Soon</p>
        <button
          type="button"
          className="btn-anim mt-6 px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          Sign up for the beta program
        </button>
        {open && (
          <BetaSignupForm defaultProductId={defaultProductId} />
        )}
      </div>
    </section>
  );
}

function BetaSignupForm({ defaultProductId }) {
  const uid = useId().replace(/:/g, "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [selected, setSelected] = useState(() =>
    BETA_PRODUCTS.some((product) => product.id === defaultProductId) ? [defaultProductId] : []
  );
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function toggleProduct(id) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (selected.length === 0) {
      setError("Choose at least one product to beta test.");
      return;
    }
    const products = BETA_PRODUCTS.filter((product) => selected.includes(product.id)).map((product) => product.label);
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company.trim() || "(not provided)"}`,
      `Beta test: ${products.join(", ")}`,
    ].join("\n");
    window.location.href = `mailto:${SALES_EMAIL}?subject=${encodeURIComponent("Beta program signup")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6 text-left">
        <CheckCircle className="w-8 h-8 text-red-600 mb-3" />
        <h2 className="text-lg font-bold text-slate-900 mb-2">Finish sending your signup</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Your email app should open with this request addressed to {SALES_EMAIL}. Send that message to join the beta program.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6 text-left">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Beta program signup</h2>
      <p className="text-sm text-slate-600 mb-5">
        <span className="text-red-600">*</span> required
      </p>
      <div className="space-y-4">
        <div>
          <label htmlFor={`${uid}-name`} className="block text-sm font-medium text-slate-700 mb-1.5">
            Name <span className="text-red-600">*</span>
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className="block text-sm font-medium text-slate-700 mb-1.5">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor={`${uid}-company`} className="block text-sm font-medium text-slate-700 mb-1.5">
            Company
          </label>
          <input
            id={`${uid}-company`}
            name="company"
            type="text"
            autoComplete="organization"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className={fieldClass}
          />
        </div>
        <fieldset>
          <legend className="block text-sm font-medium text-slate-700 mb-2">
            Which product do you want to beta test? <span className="text-red-600">*</span>
          </legend>
          <div className="space-y-2">
            {BETA_PRODUCTS.map((product) => (
              <label key={product.id} className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="beta-product"
                  value={product.label}
                  checked={selected.includes(product.id)}
                  onChange={() => toggleProduct(product.id)}
                  className="mt-0.5 rounded border-slate-300 text-red-600 focus:ring-red-500"
                />
                <span>{product.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="btn-anim px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
        >
          Sign up
        </button>
      </div>
    </form>
  );
}
