// Keap's hosted form uses this token field and WEBFORM_SUBMIT action.
// Keep validation on this page; Keap validates the token and owns the success redirect.
let verificationLibrary;

function withTimeout(operation, message) {
  let timer;
  return Promise.race([
    operation,
    new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(message)), 20000); }),
  ]).finally(() => clearTimeout(timer));
}

export function loadRegistrationVerification(campaign) {
  if (window.grecaptcha?.enterprise) return Promise.resolve(window.grecaptcha.enterprise);
  if (!verificationLibrary) {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${encodeURIComponent(campaign.recaptchaSiteKey)}`;
    script.async = true;
    verificationLibrary = withTimeout(new Promise((resolve, reject) => {
      script.onload = () => window.grecaptcha?.enterprise
        ? resolve(window.grecaptcha.enterprise)
        : reject(new Error("Registration verification did not load."));
      script.onerror = () => reject(new Error("Registration verification could not load."));
      document.head.appendChild(script);
    }), "Registration verification took too long to load.").catch((error) => {
      script.remove();
      verificationLibrary = undefined;
      throw error;
    });
  }
  return verificationLibrary;
}

export async function getRegistrationToken(campaign) {
  const verification = await loadRegistrationVerification(campaign);
  return withTimeout(new Promise((resolve, reject) => {
    verification.ready(() => {
      Promise.resolve().then(() => verification.execute(campaign.recaptchaSiteKey, {
        action: "WEBFORM_SUBMIT",
      })).then(resolve, reject);
    });
  }), "Registration verification took too long. Please try again.");
}

const pendingForms = new WeakSet();

export async function submitVerifiedRegistration(form, campaign, verify = getRegistrationToken) {
  if (pendingForms.has(form) || !form.reportValidity()) return false;
  pendingForms.add(form);
  try {
    const token = await verify(campaign);
    if (typeof token !== "string" || !token.trim()) throw new Error("Registration verification was not completed.");
    if (!form.reportValidity()) return false;
    const doc = form.ownerDocument;
    const view = doc.defaultView;
    for (const [name, value] of Object.entries({
      "g-enterprise-recaptcha-response": token,
      screenResolution: `${view.screen.width}x${view.screen.height}`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })) {
      let field = form.elements.namedItem(name);
      if (!field) {
        field = doc.createElement("input");
        field.type = "hidden";
        field.name = name;
        form.appendChild(field);
      }
      field.value = value;
    }
    // Native POST preserves all entered values and checkbox choices. Do not
    // redirect locally before Keap has accepted the registration.
    view.HTMLFormElement.prototype.submit.call(form);
    return true;
  } finally {
    pendingForms.delete(form);
  }
}
