/**
 * Demo / trial registration campaigns mirrored from npowersoftware.com
 * (Keap / Infusionsoft web forms).
 */

export const LEGACY_DOWNLOAD_BASE = "https://www.npowersoftware.com";

/** Shared Power Surfacing + Power Surfacing RE for SOLIDWORKS demo form */
export const POWER_SURFACING_DEMO = {
  id: "power-surfacing-demo",
  title: "Power Surfacing Demo",
  intro:
    "Please register to download the Power Surfacing and Power Surfacing RE for SOLIDWORKS demo.",
  submitLabel: "Download Power Surfacing",
  legacyPageUrl: `${LEGACY_DOWNLOAD_BASE}/NewDownloadPowerSurfacing.html`,
  privacyUrl: "/privacy",
  formAction: "https://rv346.infusionsoft.app/app/form/process/f3ad262b3e851e2b59baccd73e765df0",
  formXid: "f3ad262b3e851e2b59baccd73e765df0",
  formName: "Download Power Surfacing Campaign",
  infusionsoftVersion: "1.70.0.794081",
  followUpOption: {
    name: "inf_option_Sendmefollowupemailtutorialsdocumentationinformationetc",
    value: "314",
    label: "Send me follow up email (tutorials, documentation, information, etc.)",
  },
  existingCustomerOption: {
    name: "inf_option_IamanexistingnPowerSoftwareCustomer",
    value: "316",
    label: "I am an existing nPower Software Customer",
  },
};

export const POWER_SHELL_DEMO = {
  id: "power-shell-demo",
  title: "Power Shell Demo",
  intro: "Please register to download the Power Shell for SOLIDWORKS demo.",
  submitLabel: "Download Power Shell",
  legacyPageUrl: `${LEGACY_DOWNLOAD_BASE}/NewDownloadPowerShell.html`,
  privacyUrl: "/privacy",
  formAction: "https://rv346.infusionsoft.app/app/form/process/96097ee222178cec5300ada5a21cf22c",
  formXid: "96097ee222178cec5300ada5a21cf22c",
  formName: "Download Power Shell Campaign",
  infusionsoftVersion: "1.70.0.978189",
  followUpOption: {
    name: "inf_option_SendnPowerEmailNewsletterandUpdates",
    value: "420",
    label: "Send nPower email newsletter and updates",
  },
  existingCustomerOption: {
    name: "inf_option_IamanexistingnPowerSoftwareCustomer",
    value: "422",
    label: "I am an existing nPower Software Customer",
  },
};

/** Standalone MeshToCAD / RE Studio lineage demo on the legacy site */
export const RE_STUDIO_DEMO = {
  id: "re-studio-demo",
  title: "Standalone Reverse Engineering Demo",
  intro:
    "Please register to download the standalone reverse-engineering / Mesh-to-CAD demo used for Power Surfacing RE Studio evaluation.",
  submitLabel: "Download Trial",
  legacyPageUrl: `${LEGACY_DOWNLOAD_BASE}/NewCyborgMeshToCADDownload.html`,
  privacyUrl: "/privacy",
  formAction: "https://rv346.infusionsoft.com/app/form/process/6469cdfa2f7ec1b3a970d1e28b658047",
  formXid: "6469cdfa2f7ec1b3a970d1e28b658047",
  formName: "Download Cyborg3D Campaign",
  infusionsoftVersion: "1.70.0.60109",
  followUpOption: null,
  existingCustomerOption: null,
};

/**
 * Power Surfacing Studio registration — uses the same Keap campaign fields as the
 * Power Surfacing demo until a Studio-specific form is configured.
 */
export const POWER_SURFACING_STUDIO_DEMO = {
  ...POWER_SURFACING_DEMO,
  id: "power-surfacing-studio-demo",
  title: "Power Surfacing Studio Demo",
  intro: "Please register to download the Power Surfacing Studio trial.",
  submitLabel: "Download Power Surfacing Studio",
};

/** Map product ids → registration campaign */
export const PRODUCT_TRIAL_CAMPAIGNS = {
  "power-surfacing-solidworks": POWER_SURFACING_DEMO,
  "power-surfacing-re-solidworks": POWER_SURFACING_DEMO,
  "power-shell-solidworks": POWER_SHELL_DEMO,
  "power-surfacing-re-studio": RE_STUDIO_DEMO,
  "power-surfacing-studio": POWER_SURFACING_STUDIO_DEMO,
};

/** Country values accepted by the Keap Power Surfacing download form */
export const COUNTRIES = [
  "Afghanistan", "Åland Islands", "Albania", "Algeria", "American Samoa", "Andorra", "Angola",
  "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia",
  "Austria", "Azerbaijan", "Bahamas (the)", "Bahrain", "Bangladesh", "Barbados", "Belarus",
  "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia (Plurinational State of)",
  "Bonaire, Sint Eustatius and Saba", "Bosnia and Herzegovina", "Botswana", "Bouvet Island",
  "Brazil", "British Indian Ocean Territory (the)", "Brunei Darussalam", "Bulgaria", "Burkina Faso",
  "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Cayman Islands (the)",
  "Central African Republic (the)", "Chad", "Chile", "China", "Christmas Island",
  "Cocos (Keeling) Islands (the)", "Colombia", "Comoros (the)",
  "Congo (the Democratic Republic of the)", "Congo (the)", "Cook Islands (the)", "Costa Rica",
  "Côte d'Ivoire", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czech Republic (the)", "Denmark",
  "Djibouti", "Dominica", "Dominican Republic (the)", "Ecuador", "Egypt", "El Salvador",
  "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (the) [Malvinas]",
  "Faroe Islands (the)", "Fiji", "Finland", "France", "French Guiana", "French Polynesia",
  "French Southern Territories (the)", "Gabon", "Gambia (the)", "Georgia", "Germany", "Ghana",
  "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey",
  "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands",
  "Holy See (the)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia",
  "Iran (Islamic Republic of)", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica",
  "Japan", "Jersey", "Johnston Island", "Jordan", "Kazakhstan", "Kenya", "Kiribati",
  "Korea (the Democratic People's Republic of)", "Korea (the Republic of)", "Kuwait",
  "Kyrgyzstan", "Lao People's Democratic Republic (the)", "Latvia", "Lebanon", "Lesotho",
  "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao",
  "Macedonia (the former Yugoslav Republic of)", "Madagascar", "Malawi", "Malaysia", "Maldives",
  "Mali", "Malta", "Marshall Islands (the)", "Martinique", "Mauritania", "Mauritius", "Mayotte",
  "Mexico", "Micronesia (Federated States of)", "Midway Islands", "Moldova (the Republic of)",
  "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands (the)", "New Caledonia", "New Zealand", "Nicaragua",
  "Niger (the)", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands (the)", "Norway",
  "Oman", "Pakistan", "Palau", "Palestine, State of", "Panama", "Papua New Guinea", "Paraguay",
  "Peru", "Philippines (the)", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar",
  "Réunion", "Romania", "Russian Federation (the)", "Rwanda", "Saint Barthélemy",
  "Saint Helena, Ascension and Tristan da Cunha", "Saint Kitts and Nevis", "Saint Lucia",
  "Saint Martin (French part)", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia",
  "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten (Dutch part)", "Slovakia", "Slovenia",
  "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands",
  "South Sudan", "Southern Rhodesia", "Spain", "Sri Lanka", "Sudan (the)", "Suriname",
  "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic",
  "Taiwan (Province of China)", "Tajikistan", "Tanzania, United Republic of", "Thailand",
  "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Turks and Caicos Islands (the)", "Tuvalu", "Uganda", "Ukraine",
  "United Arab Emirates (the)", "United Kingdom", "United States",
  "United States Minor Outlying Islands (the)", "Upper Volta", "Uruguay", "Uzbekistan",
  "Vanuatu", "Venezuela (Bolivarian Republic of)", "Viet Nam", "Virgin Islands (British)",
  "Virgin Islands (U.S.)", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe",
];
