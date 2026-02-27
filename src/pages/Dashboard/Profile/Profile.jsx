// frontend/src/pages/Dashboard/Profile/Profile.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Lock,
  Bell,
  Loader2,
  ChevronDown,
  Search,
  Eye,
  EyeOff,
  Check,
  Camera,
  Shield,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Menu,
  X,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  Edit3,
} from "lucide-react";
import UserService from "../../../services/user.service";
import { API_URL } from "../../../config/axios";

const COUNTRIES = [
  { code: "AF", name: "Afghanistan", dial_code: "+93" },
  { code: "AX", name: "Îles Åland", dial_code: "+358" },
  { code: "AL", name: "Albanie", dial_code: "+355" },
  { code: "DZ", name: "Algérie", dial_code: "+213" },
  { code: "AS", name: "Samoa américaines", dial_code: "+1-684" },
  { code: "AD", name: "Andorre", dial_code: "+376" },
  { code: "AO", name: "Angola", dial_code: "+244" },
  { code: "AI", name: "Anguilla", dial_code: "+1-264" },
  { code: "AQ", name: "Antarctique", dial_code: "+672" },
  { code: "AG", name: "Antigua-et-Barbuda", dial_code: "+1-268" },
  { code: "AR", name: "Argentine", dial_code: "+54" },
  { code: "AM", name: "Arménie", dial_code: "+374" },
  { code: "AW", name: "Aruba", dial_code: "+297" },
  { code: "AU", name: "Australie", dial_code: "+61" },
  { code: "AT", name: "Autriche", dial_code: "+43" },
  { code: "AZ", name: "Azerbaïdjan", dial_code: "+994" },
  { code: "BS", name: "Bahamas", dial_code: "+1-242" },
  { code: "BH", name: "Bahreïn", dial_code: "+973" },
  { code: "BD", name: "Bangladesh", dial_code: "+880" },
  { code: "BB", name: "Barbade", dial_code: "+1-246" },
  { code: "BY", name: "Biélorussie", dial_code: "+375" },
  { code: "BE", name: "Belgique", dial_code: "+32" },
  { code: "BZ", name: "Belize", dial_code: "+501" },
  { code: "BJ", name: "Bénin", dial_code: "+229" },
  { code: "BM", name: "Bermudes", dial_code: "+1-441" },
  { code: "BT", name: "Bhoutan", dial_code: "+975" },
  { code: "BO", name: "Bolivie", dial_code: "+591" },
  { code: "BA", name: "Bosnie-Herzégovine", dial_code: "+387" },
  { code: "BW", name: "Botswana", dial_code: "+267" },
  { code: "BR", name: "Brésil", dial_code: "+55" },
  { code: "IO", name: "Territoire britannique de l'océan Indien", dial_code: "+246" },
  { code: "BN", name: "Brunei", dial_code: "+673" },
  { code: "BG", name: "Bulgarie", dial_code: "+359" },
  { code: "BF", name: "Burkina Faso", dial_code: "+226" },
  { code: "BI", name: "Burundi", dial_code: "+257" },
  { code: "KH", name: "Cambodge", dial_code: "+855" },
  { code: "CM", name: "Cameroun", dial_code: "+237" },
  { code: "CA", name: "Canada", dial_code: "+1" },
  { code: "CV", name: "Cap-Vert", dial_code: "+238" },
  { code: "KY", name: "Îles Caïmans", dial_code: "+1-345" },
  { code: "CF", name: "République centrafricaine", dial_code: "+236" },
  { code: "TD", name: "Tchad", dial_code: "+235" },
  { code: "CL", name: "Chili", dial_code: "+56" },
  { code: "CN", name: "Chine", dial_code: "+86" },
  { code: "CX", name: "Île Christmas", dial_code: "+61" },
  { code: "CC", name: "Îles Cocos", dial_code: "+61" },
  { code: "CO", name: "Colombie", dial_code: "+57" },
  { code: "KM", name: "Comores", dial_code: "+269" },
  { code: "CG", name: "Congo", dial_code: "+242" },
  { code: "CD", name: "République démocratique du Congo", dial_code: "+243" },
  { code: "CK", name: "Îles Cook", dial_code: "+682" },
  { code: "CR", name: "Costa Rica", dial_code: "+506" },
  { code: "CI", name: "Côte d'Ivoire", dial_code: "+225" },
  { code: "HR", name: "Croatie", dial_code: "+385" },
  { code: "CU", name: "Cuba", dial_code: "+53" },
  { code: "CW", name: "Curaçao", dial_code: "+599" },
  { code: "CY", name: "Chypre", dial_code: "+357" },
  { code: "CZ", name: "République tchèque", dial_code: "+420" },
  { code: "DK", name: "Danemark", dial_code: "+45" },
  { code: "DJ", name: "Djibouti", dial_code: "+253" },
  { code: "DM", name: "Dominique", dial_code: "+1-767" },
  { code: "DO", name: "République dominicaine", dial_code: "+1-809" },
  { code: "EC", name: "Équateur", dial_code: "+593" },
  { code: "EG", name: "Égypte", dial_code: "+20" },
  { code: "SV", name: "Salvador", dial_code: "+503" },
  { code: "GQ", name: "Guinée équatoriale", dial_code: "+240" },
  { code: "ER", name: "Érythrée", dial_code: "+291" },
  { code: "EE", name: "Estonie", dial_code: "+372" },
  { code: "ET", name: "Éthiopie", dial_code: "+251" },
  { code: "FK", name: "Îles Malouines", dial_code: "+500" },
  { code: "FO", name: "Îles Féroé", dial_code: "+298" },
  { code: "FJ", name: "Fidji", dial_code: "+679" },
  { code: "FI", name: "Finlande", dial_code: "+358" },
  { code: "FR", name: "France", dial_code: "+33" },
  { code: "GF", name: "Guyane française", dial_code: "+594" },
  { code: "PF", name: "Polynésie française", dial_code: "+689" },
  { code: "GA", name: "Gabon", dial_code: "+241" },
  { code: "GM", name: "Gambie", dial_code: "+220" },
  { code: "GE", name: "Géorgie", dial_code: "+995" },
  { code: "DE", name: "Allemagne", dial_code: "+49" },
  { code: "GH", name: "Ghana", dial_code: "+233" },
  { code: "GI", name: "Gibraltar", dial_code: "+350" },
  { code: "GR", name: "Grèce", dial_code: "+30" },
  { code: "GL", name: "Groenland", dial_code: "+299" },
  { code: "GD", name: "Grenade", dial_code: "+1-473" },
  { code: "GP", name: "Guadeloupe", dial_code: "+590" },
  { code: "GU", name: "Guam", dial_code: "+1-671" },
  { code: "GT", name: "Guatemala", dial_code: "+502" },
  { code: "GG", name: "Guernesey", dial_code: "+44" },
  { code: "GN", name: "Guinée", dial_code: "+224" },
  { code: "GW", name: "Guinée-Bissau", dial_code: "+245" },
  { code: "GY", name: "Guyana", dial_code: "+592" },
  { code: "HT", name: "Haïti", dial_code: "+509" },
  { code: "HN", name: "Honduras", dial_code: "+504" },
  { code: "HK", name: "Hong Kong", dial_code: "+852" },
  { code: "HU", name: "Hongrie", dial_code: "+36" },
  { code: "IS", name: "Islande", dial_code: "+354" },
  { code: "IN", name: "Inde", dial_code: "+91" },
  { code: "ID", name: "Indonésie", dial_code: "+62" },
  { code: "IR", name: "Iran", dial_code: "+98" },
  { code: "IQ", name: "Irak", dial_code: "+964" },
  { code: "IE", name: "Irlande", dial_code: "+353" },
  { code: "IM", name: "Île de Man", dial_code: "+44" },
  { code: "IL", name: "Israël", dial_code: "+972" },
  { code: "IT", name: "Italie", dial_code: "+39" },
  { code: "JM", name: "Jamaïque", dial_code: "+1-876" },
  { code: "JP", name: "Japon", dial_code: "+81" },
  { code: "JE", name: "Jersey", dial_code: "+44" },
  { code: "JO", name: "Jordanie", dial_code: "+962" },
  { code: "KZ", name: "Kazakhstan", dial_code: "+7" },
  { code: "KE", name: "Kenya", dial_code: "+254" },
  { code: "KI", name: "Kiribati", dial_code: "+686" },
  { code: "KP", name: "Corée du Nord", dial_code: "+850" },
  { code: "KR", name: "Corée du Sud", dial_code: "+82" },
  { code: "KW", name: "Koweït", dial_code: "+965" },
  { code: "KG", name: "Kirghizistan", dial_code: "+996" },
  { code: "LA", name: "Laos", dial_code: "+856" },
  { code: "LV", name: "Lettonie", dial_code: "+371" },
  { code: "LB", name: "Liban", dial_code: "+961" },
  { code: "LS", name: "Lesotho", dial_code: "+266" },
  { code: "LR", name: "Libéria", dial_code: "+231" },
  { code: "LY", name: "Libye", dial_code: "+218" },
  { code: "LI", name: "Liechtenstein", dial_code: "+423" },
  { code: "LT", name: "Lituanie", dial_code: "+370" },
  { code: "LU", name: "Luxembourg", dial_code: "+352" },
  { code: "MO", name: "Macao", dial_code: "+853" },
  { code: "MK", name: "Macédoine du Nord", dial_code: "+389" },
  { code: "MG", name: "Madagascar", dial_code: "+261" },
  { code: "MW", name: "Malawi", dial_code: "+265" },
  { code: "MY", name: "Malaisie", dial_code: "+60" },
  { code: "MV", name: "Maldives", dial_code: "+960" },
  { code: "ML", name: "Mali", dial_code: "+223" },
  { code: "MT", name: "Malte", dial_code: "+356" },
  { code: "MH", name: "Îles Marshall", dial_code: "+692" },
  { code: "MQ", name: "Martinique", dial_code: "+596" },
  { code: "MR", name: "Mauritanie", dial_code: "+222" },
  { code: "MU", name: "Maurice", dial_code: "+230" },
  { code: "YT", name: "Mayotte", dial_code: "+262" },
  { code: "MX", name: "Mexique", dial_code: "+52" },
  { code: "FM", name: "Micronésie", dial_code: "+691" },
  { code: "MD", name: "Moldavie", dial_code: "+373" },
  { code: "MC", name: "Monaco", dial_code: "+377" },
  { code: "MN", name: "Mongolie", dial_code: "+976" },
  { code: "ME", name: "Monténégro", dial_code: "+382" },
  { code: "MS", name: "Montserrat", dial_code: "+1-664" },
  { code: "MA", name: "Maroc", dial_code: "+212" },
  { code: "MZ", name: "Mozambique", dial_code: "+258" },
  { code: "MM", name: "Myanmar", dial_code: "+95" },
  { code: "NA", name: "Namibie", dial_code: "+264" },
  { code: "NR", name: "Nauru", dial_code: "+674" },
  { code: "NP", name: "Népal", dial_code: "+977" },
  { code: "NL", name: "Pays-Bas", dial_code: "+31" },
  { code: "NC", name: "Nouvelle-Calédonie", dial_code: "+687" },
  { code: "NZ", name: "Nouvelle-Zélande", dial_code: "+64" },
  { code: "NI", name: "Nicaragua", dial_code: "+505" },
  { code: "NE", name: "Niger", dial_code: "+227" },
  { code: "NG", name: "Nigéria", dial_code: "+234" },
  { code: "NU", name: "Niue", dial_code: "+683" },
  { code: "NF", name: "Île Norfolk", dial_code: "+672" },
  { code: "MP", name: "Îles Mariannes du Nord", dial_code: "+1-670" },
  { code: "NO", name: "Norvège", dial_code: "+47" },
  { code: "OM", name: "Oman", dial_code: "+968" },
  { code: "PK", name: "Pakistan", dial_code: "+92" },
  { code: "PW", name: "Palaos", dial_code: "+680" },
  { code: "PS", name: "Palestine", dial_code: "+970" },
  { code: "PA", name: "Panama", dial_code: "+507" },
  { code: "PG", name: "Papouasie-Nouvelle-Guinée", dial_code: "+675" },
  { code: "PY", name: "Paraguay", dial_code: "+595" },
  { code: "PE", name: "Pérou", dial_code: "+51" },
  { code: "PH", name: "Philippines", dial_code: "+63" },
  { code: "PN", name: "Îles Pitcairn", dial_code: "+64" },
  { code: "PL", name: "Pologne", dial_code: "+48" },
  { code: "PT", name: "Portugal", dial_code: "+351" },
  { code: "PR", name: "Porto Rico", dial_code: "+1-787" },
  { code: "QA", name: "Qatar", dial_code: "+974" },
  { code: "RE", name: "La Réunion", dial_code: "+262" },
  { code: "RO", name: "Roumanie", dial_code: "+40" },
  { code: "RU", name: "Russie", dial_code: "+7" },
  { code: "RW", name: "Rwanda", dial_code: "+250" },
  { code: "BL", name: "Saint-Barthélemy", dial_code: "+590" },
  { code: "SH", name: "Sainte-Hélène", dial_code: "+290" },
  { code: "KN", name: "Saint-Christophe-et-Niévès", dial_code: "+1-869" },
  { code: "LC", name: "Sainte-Lucie", dial_code: "+1-758" },
  { code: "MF", name: "Saint-Martin", dial_code: "+590" },
  { code: "PM", name: "Saint-Pierre-et-Miquelon", dial_code: "+508" },
  { code: "VC", name: "Saint-Vincent-et-les-Grenadines", dial_code: "+1-784" },
  { code: "WS", name: "Samoa", dial_code: "+685" },
  { code: "SM", name: "Saint-Marin", dial_code: "+378" },
  { code: "ST", name: "Sao Tomé-et-Principe", dial_code: "+239" },
  { code: "SA", name: "Arabie saoudite", dial_code: "+966" },
  { code: "SN", name: "Sénégal", dial_code: "+221" },
  { code: "RS", name: "Serbie", dial_code: "+381" },
  { code: "SC", name: "Seychelles", dial_code: "+248" },
  { code: "SL", name: "Sierra Leone", dial_code: "+232" },
  { code: "SG", name: "Singapour", dial_code: "+65" },
  { code: "SX", name: "Sint Maarten", dial_code: "+1-721" },
  { code: "SK", name: "Slovaquie", dial_code: "+421" },
  { code: "SI", name: "Slovénie", dial_code: "+386" },
  { code: "SB", name: "Îles Salomon", dial_code: "+677" },
  { code: "SO", name: "Somalie", dial_code: "+252" },
  { code: "ZA", name: "Afrique du Sud", dial_code: "+27" },
  { code: "SS", name: "Soudan du Sud", dial_code: "+211" },
  { code: "ES", name: "Espagne", dial_code: "+34" },
  { code: "LK", name: "Sri Lanka", dial_code: "+94" },
  { code: "SD", name: "Soudan", dial_code: "+249" },
  { code: "SR", name: "Suriname", dial_code: "+597" },
  { code: "SJ", name: "Svalbard et Jan Mayen", dial_code: "+47" },
  { code: "SZ", name: "Eswatini", dial_code: "+268" },
  { code: "SE", name: "Suède", dial_code: "+46" },
  { code: "CH", name: "Suisse", dial_code: "+41" },
  { code: "SY", name: "Syrie", dial_code: "+963" },
  { code: "TW", name: "Taïwan", dial_code: "+886" },
  { code: "TJ", name: "Tadjikistan", dial_code: "+992" },
  { code: "TZ", name: "Tanzanie", dial_code: "+255" },
  { code: "TH", name: "Thaïlande", dial_code: "+66" },
  { code: "TL", name: "Timor-Leste", dial_code: "+670" },
  { code: "TG", name: "Togo", dial_code: "+228" },
  { code: "TK", name: "Tokelau", dial_code: "+690" },
  { code: "TO", name: "Tonga", dial_code: "+676" },
  { code: "TT", name: "Trinité-et-Tobago", dial_code: "+1-868" },
  { code: "TN", name: "Tunisie", dial_code: "+216" },
  { code: "TR", name: "Turquie", dial_code: "+90" },
  { code: "TM", name: "Turkménistan", dial_code: "+993" },
  { code: "TC", name: "Îles Turques-et-Caïques", dial_code: "+1-649" },
  { code: "TV", name: "Tuvalu", dial_code: "+688" },
  { code: "UG", name: "Ouganda", dial_code: "+256" },
  { code: "UA", name: "Ukraine", dial_code: "+380" },
  { code: "AE", name: "Émirats arabes unis", dial_code: "+971" },
  { code: "GB", name: "Royaume-Uni", dial_code: "+44" },
  { code: "US", name: "États-Unis", dial_code: "+1" },
  { code: "UY", name: "Uruguay", dial_code: "+598" },
  { code: "UZ", name: "Ouzbékistan", dial_code: "+998" },
  { code: "VU", name: "Vanuatu", dial_code: "+678" },
  { code: "VA", name: "Vatican", dial_code: "+379" },
  { code: "VE", name: "Venezuela", dial_code: "+58" },
  { code: "VN", name: "Viêt Nam", dial_code: "+84" },
  { code: "VG", name: "Îles Vierges britanniques", dial_code: "+1-284" },
  { code: "VI", name: "Îles Vierges des États-Unis", dial_code: "+1-340" },
  { code: "WF", name: "Wallis-et-Futuna", dial_code: "+681" },
  { code: "EH", name: "Sahara occidental", dial_code: "+212" },
  { code: "YE", name: "Yémen", dial_code: "+967" },
  { code: "ZM", name: "Zambie", dial_code: "+260" },
  { code: "ZW", name: "Zimbabwe", dial_code: "+263" },
].sort((a, b) => a.name.localeCompare(b.name));

/* ─── STYLES GLOBAUX ───────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

  /* ── DARK MODE (défaut) ── */
  .profile-root {
    font-family: 'Sora', sans-serif;
    background: #0f1117;
    min-height: 100vh;
    color: #e2e8f0;
    --pr-bg: #0f1117;
    --pr-card: #171b26;
    --pr-section: #1a1f2e;
    --pr-border: #1e2535;
    --pr-text: #e2e8f0;
    --pr-text-muted: #64748b;
    --pr-text-sub: #475569;
    --pr-text-body: #cbd5e1;
    --pr-input-bg: #0f1117;
    --pr-input-text: #e2e8f0;
    --pr-input-placeholder: #334155;
    --pr-icon-bg: #1e2535;
    --pr-tab-inactive: #64748b;
    --pr-tab-hover: #94a3b8;
    --pr-btn-ghost-hover: #1a1f2e;
    --pr-btn-ghost-text: #64748b;
    --pr-crit-unmet-bg: #1a1f2e;
    --pr-crit-unmet-text: #475569;
    --pr-crit-unmet-border: #1e2535;
    --pr-2fa-bg: #0f1117;
    --pr-status-off-bg: #1a1f2e;
    --pr-status-off-text: #64748b;
    --pr-toast-bg: #171b26;
    --pr-shadow: rgba(0,0,0,0.4);
    --pr-edit-btn: #3b82f6;
  }

  /* ── LIGHT MODE ── */
  .profile-root.light,
  :root:not(.dark) .profile-root {
    background: #ffffff;
    color: #0f172a;
    --pr-bg: #ffffff;
    --pr-card: #ffffff;
    --pr-section: #f8fafc;
    --pr-border: #e2e8f0;
    --pr-text: #0f172a;
    --pr-text-muted: #64748b;
    --pr-text-sub: #94a3b8;
    --pr-text-body: #334155;
    --pr-input-bg: #ffffff;
    --pr-input-text: #0f172a;
    --pr-input-placeholder: #94a3b8;
    --pr-icon-bg: #f1f5f9;
    --pr-tab-inactive: #94a3b8;
    --pr-tab-hover: #475569;
    --pr-btn-ghost-hover: #f8fafc;
    --pr-btn-ghost-text: #475569;
    --pr-crit-unmet-bg: #f8fafc;
    --pr-crit-unmet-text: #94a3b8;
    --pr-crit-unmet-border: #e2e8f0;
    --pr-2fa-bg: #f8fafc;
    --pr-status-off-bg: #f1f5f9;
    --pr-status-off-text: #94a3b8;
    --pr-toast-bg: #ffffff;
    --pr-shadow: rgba(0,0,0,0.06);
    --pr-edit-btn: #2563eb;
  }

  /* Tailwind dark class support */
  .dark .profile-root {
    background: #0f1117;
    color: #e2e8f0;
    --pr-bg: #0f1117;
    --pr-card: #171b26;
    --pr-section: #1a1f2e;
    --pr-border: #1e2535;
    --pr-text: #e2e8f0;
    --pr-text-muted: #64748b;
    --pr-text-sub: #475569;
    --pr-text-body: #cbd5e1;
    --pr-input-bg: #0f1117;
    --pr-input-text: #e2e8f0;
    --pr-input-placeholder: #334155;
    --pr-icon-bg: #1e2535;
    --pr-tab-inactive: #64748b;
    --pr-tab-hover: #94a3b8;
    --pr-btn-ghost-hover: #1a1f2e;
    --pr-btn-ghost-text: #64748b;
    --pr-crit-unmet-bg: #1a1f2e;
    --pr-crit-unmet-text: #475569;
    --pr-crit-unmet-border: #1e2535;
    --pr-2fa-bg: #0f1117;
    --pr-status-off-bg: #1a1f2e;
    --pr-status-off-text: #64748b;
    --pr-toast-bg: #171b26;
    --pr-shadow: rgba(0,0,0,0.4);
    --pr-edit-btn: #3b82f6;
  }

  .profile-root { background: var(--pr-bg); color: var(--pr-text); }

  .profile-card {
    background: var(--pr-card);
    border-radius: 16px;
    border: 1px solid var(--pr-border);
    box-shadow: 0 2px 12px var(--pr-shadow);
  }

  .avatar-ring {
    position: relative;
    display: inline-block;
  }
  .avatar-ring::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 2px solid #3b82f6;
    opacity: 0.6;
  }
  .online-dot {
    width: 10px; height: 10px;
    background: #22c55e;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
    box-shadow: 0 0 6px #22c55e88;
  }

  .profile-tabs {
    display: flex;
    border-bottom: 1px solid var(--pr-border);
    padding: 0 20px;
    gap: 0;
  }
  .profile-tab {
    padding: 12px 16px;
    font-size: 13px;
    font-weight: 500;
    color: var(--pr-tab-inactive);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    background: none;
    border-top: none;
    border-left: none;
    border-right: none;
    white-space: nowrap;
    font-family: 'Sora', sans-serif;
  }
  .profile-tab:hover { color: var(--pr-tab-hover); }
  .profile-tab.active {
    color: var(--pr-text);
    border-bottom-color: #3b82f6;
  }

  .section-card {
    background: var(--pr-section);
    border: 1px solid var(--pr-border);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
  }
  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--pr-text);
    margin-bottom: 16px;
    display: block;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 16px;
  }
  .info-item label {
    display: block;
    font-size: 11px;
    color: var(--pr-text-sub);
    margin-bottom: 4px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .info-item span {
    font-size: 13px;
    color: var(--pr-text-body);
    font-weight: 500;
  }

  .dark-input {
    width: 100%;
    padding: 9px 12px;
    background: var(--pr-input-bg);
    border: 1px solid var(--pr-border);
    border-radius: 8px;
    font-size: 13px;
    color: var(--pr-input-text);
    font-family: 'Sora', sans-serif;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }
  .dark-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
  }
  .dark-input::placeholder { color: var(--pr-input-placeholder); }
  .dark-input.error { border-color: #ef4444; }

  .dark-label {
    display: block;
    font-size: 11px;
    color: var(--pr-text-sub);
    margin-bottom: 5px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .btn-primary {
    padding: 9px 20px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    transition: background 0.2s;
  }
  .btn-primary:hover { background: #2563eb; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-ghost {
    padding: 9px 16px;
    background: transparent;
    color: var(--pr-btn-ghost-text);
    border: 1px solid var(--pr-border);
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'Sora', sans-serif;
    transition: all 0.2s;
  }
  .btn-ghost:hover { background: var(--pr-btn-ghost-hover); color: var(--pr-text-muted); }

  .contact-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 0;
    border-bottom: 1px solid var(--pr-border);
  }
  .contact-row:last-child { border-bottom: none; }
  .contact-icon {
    width: 32px; height: 32px;
    background: var(--pr-icon-bg);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .contact-label { font-size: 11px; color: var(--pr-text-sub); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px; }
  .contact-value { font-size: 13px; color: var(--pr-text-body); font-weight: 500; }

  .verified-badge {
    width: 16px; height: 16px;
    background: #3b82f6;
    border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .toast-bar {
    position: fixed; top: 16px; right: 16px; z-index: 9999;
    background: var(--pr-toast-bg);
    border: 1px solid var(--pr-border);
    border-radius: 10px; padding: 12px 16px;
    display: flex; align-items: center; gap: 10px;
    min-width: 240px; box-shadow: 0 8px 32px var(--pr-shadow);
    transition: all 0.3s;
  }
  .toast-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  .crit-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px; font-weight: 600;
  }
  .crit-met { background: rgba(34,197,94,0.1); color: #22c55e; border: 1px solid rgba(34,197,94,0.2); }
  .crit-unmet { background: var(--pr-crit-unmet-bg); color: var(--pr-crit-unmet-text); border: 1px solid var(--pr-crit-unmet-border); }

  .two-fa-qr {
    background: var(--pr-2fa-bg);
    border: 1px solid var(--pr-border);
    border-radius: 12px; padding: 24px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
  }
  @media (max-width: 640px) {
    .two-fa-qr { grid-template-columns: 1fr; }
    .info-grid { grid-template-columns: 1fr 1fr; }
  }

  .security-status {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 12px; border-radius: 20px;
    font-size: 11px; font-weight: 600;
  }
  .status-on { background: rgba(34,197,94,0.1); color: #22c55e; }
  .status-off { background: var(--pr-status-off-bg); color: var(--pr-status-off-text); }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default function Profile() {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");

  const triggerToast = (message, type = "info") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  useEffect(() => {
    const loadProfile = async () => {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user || !user.id) return;
      try {
        setLoading(true);
        const data = await UserService.getMyProfile();
        setProfileData(data);
      } catch (err) {
        if (err.message !== "Token d'authentification manquant") {
          triggerToast("Erreur de chargement du profil", "error");
        }
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async (formData, imageFile = null) => {
    setLoading(true);
    try {
      const response = await UserService.updateMyProfile(formData, imageFile);
      setProfileData(response);
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({
        ...storedUser,
        nom: response.nom,
        prenom: response.prenom,
        email: response.email,
        profileImage: response.logo,
      }));
      await UserService.refreshProfileImageInStorage();
      triggerToast("Profil mis à jour avec succès", "success");
    } catch (err) {
      triggerToast(err.response?.data?.detail || "Erreur lors de la mise à jour", "error");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: "personal", label: "Informations" },
    { key: "security", label: "Sécurité" },
    { key: "notifications", label: "Notifications" },
  ];

  const renderContent = () => {
    if (loading && !profileData) {
      return (
        <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
          <Loader2 size={28} style={{ animation: "spin 1s linear infinite", color: "#3b82f6" }} />
        </div>
      );
    }
    if (!profileData && !loading) {
      return (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--pr-text-sub)" }}>
          <User size={48} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
          <p style={{ fontSize: 14 }}>Impossible de charger le profil</p>
        </div>
      );
    }
    switch (activeTab) {
      case "personal":
        return <PersonalInfoForm onSubmit={handleSave} profileData={profileData} triggerToast={triggerToast} loading={loading} />;
      case "security":
        return <SecurityForm onSubmit={handleSave} profileData={profileData} triggerToast={triggerToast} />;
      case "notifications":
        return <NotificationsForm onSubmit={handleSave} />;
      default:
        return <PersonalInfoForm onSubmit={handleSave} profileData={profileData} triggerToast={triggerToast} loading={loading} />;
    }
  };

  const toastColor = toastType === "success" ? "#22c55e" : toastType === "error" ? "#ef4444" : "#3b82f6";

  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark") ||
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark"))
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`profile-root${isDark ? "" : " light"}`}>
      <style>{styles}</style>

      {/* Toast */}
      <div className="toast-bar" style={{ opacity: showToast ? 1 : 0, transform: showToast ? "translateX(0)" : "translateX(120%)", pointerEvents: showToast ? "auto" : "none" }}>
        <div className="toast-dot" style={{ background: toastColor }} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--pr-text)", marginBottom: 2 }}>
            {toastType === "success" ? "Succès" : toastType === "error" ? "Erreur" : "Info"}
          </div>
          <div style={{ fontSize: 11, color: "var(--pr-tab-hover)" }}>{toastMessage}</div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px" }}>

        {/* En-tête profil */}
        <ProfileHeader profileData={profileData} loading={loading} onSave={handleSave} triggerToast={triggerToast} />

        {/* Carte principale */}
        <div className="profile-card" style={{ marginTop: 16 }}>
          {/* Tabs */}
          <div className="profile-tabs">
            {tabs.map(t => (
              <button key={t.key} className={`profile-tab${activeTab === t.key ? " active" : ""}`} onClick={() => setActiveTab(t.key)}>
                {t.label}
              </button>
            ))}
            {loading && profileData && (
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, color: "#22c55e", fontSize: 11 }}>
                <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} />
                Enregistrement...
              </div>
            )}
          </div>

          {/* Contenu */}
          <div style={{ padding: "20px" }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PROFILE HEADER ─────────────────────────────────────────────────── */
function ProfileHeader({ profileData, loading, onSave, triggerToast }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser.profileImage) {
      setPreviewImage(storedUser.profileImage);
    } else if (profileData?.logo) {
      const imageURL = profileData.logo.startsWith("/") ? `${API_URL}${profileData.logo}` : profileData.logo;
      setPreviewImage(imageURL);
    }
    const handleProfileUpdate = (e) => { if (e.detail?.profileImage) setPreviewImage(e.detail.profileImage); };
    window.addEventListener("profileImageUpdated", handleProfileUpdate);
    return () => window.removeEventListener("profileImageUpdated", handleProfileUpdate);
  }, [profileData]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { triggerToast("L'image ne doit pas dépasser 5MB", "error"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
    setUploadingImage(true);
    try {
      await onSave({ nom: profileData?.nom || "", prenom: profileData?.prenom || "", email: profileData?.email || "", telephone: profileData?.telephone || "", code_postal: profileData?.code_postal || "", adresse: profileData?.adresse || "" }, file);
    } catch { triggerToast("Erreur lors de la mise à jour de la photo", "error"); }
    finally { setUploadingImage(false); }
  };

  const initials = profileData ? `${profileData.prenom?.[0] || ""}${profileData.nom?.[0] || ""}`.toUpperCase() : "U";

  return (
    <div className="profile-card" style={{ padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        {/* Avatar */}
        <div className="avatar-ring" style={{ cursor: "pointer" }} onClick={() => fileInputRef.current?.click()}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            {previewImage ? (
              <img src={previewImage} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
            ) : (
              <span style={{ fontSize: 22, fontWeight: 700, color: "white" }}>{initials}</span>
            )}
            {uploadingImage && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite", color: "white" }} />
              </div>
            )}
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.4)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0)"}>
              <Camera size={14} style={{ color: "white", opacity: 0, transition: "opacity 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0} />
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
        </div>

        {/* Infos */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--pr-text)", margin: 0 }}>
              {profileData ? `${profileData.nom || ""} ${profileData.prenom || ""}` : "—"}
            </h1>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--pr-text-sub)", padding: 0 }}>
              <svg width="16" height="4" viewBox="0 0 16 4" fill="currentColor"><circle cx="2" cy="2" r="2"/><circle cx="8" cy="2" r="2"/><circle cx="14" cy="2" r="2"/></svg>
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 4, gap: 4 }}>
            <span className="online-dot" />
            <span style={{ fontSize: 12, color: "var(--pr-text-muted)" }}>En ligne</span>
          </div>
          {profileData?.adresse && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
              <MapPin size={12} style={{ color: "var(--pr-text-sub)" }} />
              <span style={{ fontSize: 12, color: "var(--pr-text-muted)" }}>{profileData.adresse}</span>
            </div>
          )}
        </div>

        {/* Badge email */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className={`security-status ${profileData?.email_verified ? "status-on" : "status-off"}`}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
            {profileData?.email_verified ? "Vérifié" : "Non vérifié"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PERSONAL INFO FORM ─────────────────────────────────────────────── */
function PersonalInfoForm({ onSubmit, profileData, triggerToast, loading }) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find((c) => c.code === "MG"));
  const [formData, setFormData] = useState({ nom: "", prenom: "", email: "", telephone: "", code_postal: "", adresse: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [editInfo, setEditInfo] = useState(false);   // mode édition infos perso
  const [editContact, setEditContact] = useState(false); // mode édition contacts

  useEffect(() => {
    if (profileData) {
      setFormData({ nom: profileData.nom || "", prenom: profileData.prenom || "", email: profileData.email || "", telephone: profileData.telephone || "", code_postal: profileData.code_postal || "", adresse: profileData.adresse || "" });
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Requis";
    if (!formData.email.trim()) newErrors.email = "Requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitInfo = (e) => {
    e.preventDefault();
    if (validateForm()) { onSubmit(formData, selectedFile); setEditInfo(false); }
  };

  const handleSubmitContact = (e) => {
    e.preventDefault();
    if (!formData.email.trim()) { setErrors({ email: "Requis" }); return; }
    onSubmit(formData, selectedFile);
    setEditContact(false);
  };

  const isEmailVerified = profileData?.email_verified || false;

  return (
    <div>
      {/* ── Section Informations personnelles ── */}
      <form onSubmit={handleSubmitInfo}>
        <div className="section-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span className="section-title" style={{ margin: 0 }}>Informations personnelles</span>
            <button type="button" onClick={() => { setEditInfo(!editInfo); setErrors({}); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontFamily: "inherit", fontWeight: 500 }}>
              <Edit3 size={13} /> {editInfo ? "Annuler" : "Modifier"}
            </button>
          </div>

          {!editInfo ? (
            <div className="info-grid">
              <div className="info-item"><label>Nom</label><span>{profileData?.nom || "—"}</span></div>
              <div className="info-item"><label>Prénom</label><span>{profileData?.prenom || "—"}</span></div>
              <div className="info-item"><label>Pays</label><span>{selectedCountry?.name || "—"}</span></div>
              <div className="info-item"><label>Adresse</label><span>{profileData?.adresse || "—"}</span></div>
              <div className="info-item"><label>Code postal</label><span>{profileData?.code_postal || "—"}</span></div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <DarkInput label="Nom" name="nom" value={formData.nom} onChange={handleInputChange} error={errors.nom} required placeholder="Ex: Rakoto" />
                <DarkInput label="Prénom" name="prenom" value={formData.prenom} onChange={handleInputChange} error={errors.prenom} required placeholder="Ex: Jean" />
              </div>
              <CountrySelectDark selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 14 }}>
                <DarkInput label="Adresse" name="adresse" value={formData.adresse} onChange={handleInputChange} placeholder="123 Rue Exemple, Antananarivo" />
                <DarkInput label="Code postal" name="code_postal" value={formData.code_postal} onChange={handleInputChange} placeholder="101" />
              </div>
            </div>
          )}

          {editInfo && (
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
              <button type="button" className="btn-ghost" onClick={() => { setEditInfo(false); setErrors({}); }}>Annuler</button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : "Enregistrer"}
              </button>
            </div>
          )}
        </div>
      </form>

      {/* ── Section Contacts ── */}
      <form onSubmit={handleSubmitContact}>
        <div className="section-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span className="section-title" style={{ margin: 0 }}>Contacts</span>
            <button type="button" onClick={() => { setEditContact(!editContact); setErrors({}); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontFamily: "inherit", fontWeight: 500 }}>
              <Edit3 size={13} /> {editContact ? "Annuler" : "Modifier"}
            </button>
          </div>

          <div className="contact-row">
            <div className="contact-icon"><Phone size={14} style={{ color: "#3b82f6" }} /></div>
            <div style={{ flex: 1 }}>
              <div className="contact-label">Téléphone</div>
              {editContact ? (
                <PhoneInputDark selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} value={formData.telephone} onChange={(v) => setFormData({ ...formData, telephone: v })} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="contact-value">{formData.telephone ? `${selectedCountry?.dial_code} ${formData.telephone}` : "—"}</span>
                  {formData.telephone && <span className="verified-badge"><Check size={9} color="white" /></span>}
                </div>
              )}
            </div>
          </div>

          <div className="contact-row">
            <div className="contact-icon"><Mail size={14} style={{ color: "#3b82f6" }} /></div>
            <div style={{ flex: 1 }}>
              <div className="contact-label">Email</div>
              {editContact ? (
                <DarkInput name="email" type="email" value={formData.email} onChange={handleInputChange} error={errors.email} placeholder="votre.email@exemple.com" />
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="contact-value">{formData.email || "—"}</span>
                  {isEmailVerified && <span className="verified-badge"><Check size={9} color="white" /></span>}
                </div>
              )}
            </div>
          </div>

          {!isEmailVerified && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0", borderTop: "1px solid var(--pr-border)", marginTop: 4 }}>
              <AlertCircle size={14} style={{ color: "#f59e0b" }} />
              <span style={{ fontSize: 12, color: "#f59e0b", flex: 1 }}>Email non vérifié</span>
              <button type="button" style={{ fontSize: 11, color: "#3b82f6", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Renvoyer</button>
            </div>
          )}

          {editContact && (
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
              <button type="button" className="btn-ghost" onClick={() => { setEditContact(false); setErrors({}); }}>Annuler</button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : "Enregistrer"}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

/* ─── DARK INPUT ─────────────────────────────────────────────────────── */
function DarkInput({ label, name, type = "text", value, onChange, placeholder, error, required, style }) {
  return (
    <div style={{ ...style }}>
      {label && <label className="dark-label">{label}{required && <span style={{ color: "#ef4444" }}> *</span>}</label>}
      <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className={`dark-input${error ? " error" : ""}`} />
      {error && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 3 }}>{error}</p>}
    </div>
  );
}

/* ─── PHONE INPUT DARK ───────────────────────────────────────────────── */
function PhoneInputDark({ selectedCountry, onCountryChange, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, width: "100%" }}>
      <div style={{ width: 90, flexShrink: 0 }}>
        <button type="button" className="dark-input" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "9px 10px", width: "100%" }}>
          <span style={{ fontSize: 12 }}>{selectedCountry?.dial_code}</span>
          <ChevronDown size={12} style={{ color: "var(--pr-text-sub)" }} />
        </button>
      </div>
      <input type="tel" value={value} onChange={(e) => onChange(e.target.value)} placeholder="34 12 345 67" className="dark-input" style={{ flex: 1 }} />
    </div>
  );
}

/* ─── COUNTRY SELECT DARK ────────────────────────────────────────────── */
function CountrySelectDark({ selectedCountry, onCountryChange }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const filteredCountries = COUNTRIES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "relative" }} ref={containerRef}>
      <label className="dark-label">Pays</label>
      <button type="button" onClick={() => setOpen(!open)} className="dark-input" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", width: "100%", textAlign: "left" }}>
        <span style={{ fontSize: 12, color: selectedCountry ? "var(--pr-text)" : "var(--pr-input-placeholder)" }}>{selectedCountry?.name || "Sélectionner..."}</span>
        <ChevronDown size={12} style={{ color: "var(--pr-text-sub)" }} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100, background: "var(--pr-card)", border: "1px solid var(--pr-border)", borderRadius: 8, maxHeight: 220, overflow: "hidden", boxShadow: "0 8px 32px var(--pr-shadow)", marginTop: 4 }}>
          <div style={{ display: "flex", alignItems: "center", padding: "8px 10px", borderBottom: "1px solid #1e2535", gap: 6 }}>
            <Search size={12} style={{ color: "var(--pr-text-sub)" }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." style={{ background: "none", border: "none", outline: "none", fontSize: 12, color: "var(--pr-text)", flex: 1, fontFamily: "inherit" }} />
          </div>
          <ul style={{ maxHeight: 180, overflowY: "auto", listStyle: "none", margin: 0, padding: 0 }}>
            {filteredCountries.map((c) => (
              <li key={c.code} onClick={() => { onCountryChange(c); setOpen(false); setSearch(""); }}
                style={{ padding: "8px 12px", fontSize: 12, cursor: "pointer", display: "flex", justifyContent: "space-between", color: selectedCountry?.code === c.code ? "#3b82f6" : "var(--pr-text-body)", background: selectedCountry?.code === c.code ? "rgba(59,130,246,0.08)" : "transparent" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--pr-btn-ghost-hover)"}
                onMouseLeave={e => e.currentTarget.style.background = selectedCountry?.code === c.code ? "rgba(59,130,246,0.08)" : "transparent"}>
                <span>{c.name}</span>
                <span style={{ color: "var(--pr-text-sub)" }}>{c.dial_code}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ─── SECURITY FORM ──────────────────────────────────────────────────── */
function SecurityForm({ onSubmit, profileData, triggerToast }) {
  const [passwords, setPasswords] = useState({ passwordCurrent: "", passwordNew: "", passwordConfirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(profileData?.two_factor_enabled || false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading2FA, setLoading2FA] = useState(false);

  const passwordCriteria = [
    { minLength: { regex: /.{8,}/, label: "8 caractères" } },
    { uppercase: { regex: /[A-Z]/, label: "Majuscule" } },
    { lowercase: { regex: /[a-z]/, label: "Minuscule" } },
    { digit: { regex: /\d/, label: "Chiffre" } },
    { validSymbols: { regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, label: "Symbole" } },
  ];

  const validatePasswordCriteria = (p) => ({
    minLength: /.{8,}/.test(p), uppercase: /[A-Z]/.test(p),
    lowercase: /[a-z]/.test(p), digit: /\d/.test(p),
    validSymbols: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p),
  });

  const passwordValidation = validatePasswordCriteria(passwords.passwordNew);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch = passwords.passwordNew === passwords.passwordConfirm && passwords.passwordConfirm !== "";
  const passwordsDontMatch = passwords.passwordNew !== "" && passwords.passwordConfirm !== "" && passwords.passwordNew !== passwords.passwordConfirm;

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!passwords.passwordCurrent.trim()) newErrors.passwordCurrent = "Requis";
    if (!passwords.passwordNew.trim()) newErrors.passwordNew = "Requis";
    else if (!isPasswordValid) newErrors.passwordNew = "Mot de passe faible";
    if (!passwords.passwordConfirm.trim()) newErrors.passwordConfirm = "Requis";
    else if (passwords.passwordNew !== passwords.passwordConfirm) newErrors.passwordConfirm = "Ne correspond pas";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit({ passwordCurrent: passwords.passwordCurrent, passwordNew: passwords.passwordNew });
      setPasswords({ passwordCurrent: "", passwordNew: "", passwordConfirm: "" });
    }
  };

  const handleEnable2FA = async () => {
    try {
      setLoading2FA(true);
      const response = await UserService.enable2FA();
      setQrCodeUrl(response.qr_code_url);
      setShowQRCode(true);
      triggerToast("QR Code généré avec succès", "success");
    } catch { triggerToast("Erreur lors de l'activation du 2FA", "error"); }
    finally { setLoading2FA(false); }
  };

  const handleVerify2FA = async () => {
    if (verificationCode.length !== 6) { triggerToast("Le code doit contenir 6 chiffres", "error"); return; }
    try {
      setLoading2FA(true);
      await UserService.verify2FA(verificationCode);
      await new Promise(r => setTimeout(r, 1000));
      setTwoFactorEnabled(true); setShowQRCode(false); setVerificationCode("");
      triggerToast("Authentification à 2 facteurs activée", "success");
    } catch { triggerToast("Code invalide ou erreur lors de la vérification", "error"); }
    finally { setLoading2FA(false); }
  };

  const handleDisable2FA = async () => {
    try {
      setLoading2FA(true);
      await UserService.disable2FA();
      setTwoFactorEnabled(false); setShowQRCode(false); setVerificationCode("");
      triggerToast("Authentification à 2 facteurs désactivée", "success");
    } catch { triggerToast("Erreur lors de la désactivation", "error"); }
    finally { setLoading2FA(false); }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Mot de passe */}
      <div className="section-card">
        <span className="section-title">Changer le mot de passe</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <DarkPasswordInput label="Mot de passe actuel" name="passwordCurrent" value={passwords.passwordCurrent} onChange={handlePasswordChange} error={errors.passwordCurrent} show={showPassword} setShow={setShowPassword} placeholder="Entrez votre mot de passe actuel" />
          <DarkPasswordInput label="Nouveau mot de passe" name="passwordNew" value={passwords.passwordNew} onChange={handlePasswordChange} error={errors.passwordNew} show={showNewPassword} setShow={setShowNewPassword} placeholder="Minimum 8 caractères" />
          <DarkPasswordInput label="Confirmer le nouveau mot de passe" name="passwordConfirm" value={passwords.passwordConfirm} onChange={handlePasswordChange} error={errors.passwordConfirm} show={showConfirmPassword} setShow={setShowConfirmPassword} placeholder="Répétez le nouveau mot de passe" />

          <div>
            <label className="dark-label">Critères de sécurité</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
              {passwordCriteria.map((item, i) => {
                const key = Object.keys(item)[0];
                const met = passwordValidation[key];
                return (
                  <span key={i} className={`crit-badge ${met ? "crit-met" : "crit-unmet"}`}>
                    <Check size={10} /> {item[key].label}
                  </span>
                );
              })}
            </div>
            {passwordsMatch && <p style={{ fontSize: 11, color: "#22c55e", marginTop: 6 }}>Les mots de passe correspondent.</p>}
            {passwordsDontMatch && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 6 }}>Les mots de passe ne correspondent pas.</p>}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <button type="submit" className="btn-primary">Mettre à jour</button>
        </div>
      </div>

      {/* 2FA */}
      <div className="section-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Shield size={15} style={{ color: "#3b82f6" }} />
              <span className="section-title" style={{ margin: 0 }}>Authentification à deux facteurs</span>
              <span className={`security-status ${twoFactorEnabled ? "status-on" : "status-off"}`}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                {twoFactorEnabled ? "Activé" : "Désactivé"}
              </span>
            </div>
            <p style={{ fontSize: 12, color: "var(--pr-text-sub)", margin: 0, maxWidth: 480 }}>
              Protégez votre compte en exigeant un code lors de la connexion en plus de votre mot de passe.
            </p>
          </div>
          {twoFactorEnabled ? (
            <button type="button" onClick={handleDisable2FA} disabled={loading2FA} className="btn-ghost">Désactiver</button>
          ) : (
            <button type="button" onClick={handleEnable2FA} disabled={loading2FA} className="btn-primary">Activer le 2FA</button>
          )}
        </div>

        {showQRCode && (
          <div className="two-fa-qr" style={{ marginTop: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ width: 140, height: 140, background: "white", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {qrCodeUrl ? <img src={qrCodeUrl} alt="QR Code" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <Loader2 size={24} style={{ animation: "spin 1s linear infinite", color: "var(--pr-tab-hover)" }} />}
              </div>
              <p style={{ fontSize: 11, color: "var(--pr-text-muted)", textAlign: "center" }}>Scannez avec Google Authenticator, Authy, etc.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 12, color: "var(--pr-tab-hover)", margin: 0 }}>Entrez le code à 6 chiffres de votre application.</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Smartphone size={13} style={{ color: "var(--pr-text-sub)" }} />
                <span className="dark-label" style={{ margin: 0 }}>Code de vérification</span>
              </div>
              <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))} maxLength={6}
                className="dark-input" style={{ textAlign: "center", letterSpacing: "0.4em", fontSize: 18, fontFamily: "monospace" }} placeholder="••••••" />
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={handleVerify2FA} disabled={loading2FA} className="btn-primary" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  {loading2FA && <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />} Confirmer
                </button>
                <button type="button" onClick={() => setShowQRCode(false)} className="btn-ghost">Annuler</button>
              </div>
              <p style={{ fontSize: 10, color: "var(--pr-input-placeholder)", margin: 0 }}>Conservez votre code de secours en lieu sûr.</p>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

/* ─── DARK PASSWORD INPUT ────────────────────────────────────────────── */
function DarkPasswordInput({ label, name, value, onChange, error, show, setShow, placeholder }) {
  return (
    <div>
      <label className="dark-label">{label}</label>
      <div style={{ position: "relative" }}>
        <input name={name} type={show ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder}
          className={`dark-input${error ? " error" : ""}`} style={{ paddingRight: 36 }} />
        <button type="button" onClick={() => setShow(!show)}
          style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--pr-text-sub)", display: "flex", alignItems: "center" }}>
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      {error && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 3 }}>{error}</p>}
    </div>
  );
}

/* ─── NOTIFICATIONS FORM ─────────────────────────────────────────────── */
function NotificationsForm({ onSubmit }) {
  const items = [
    { label: "Notifications par email", desc: "Recevoir les mises à jour importantes par email", enabled: true },
    { label: "Alertes de sécurité", desc: "Être notifié lors d'une connexion suspecte", enabled: true },
  ];
  const [prefs, setPrefs] = useState(items.map(i => i.enabled));

  return (
    <div className="section-card">
      <span className="section-title">Préférences de notification</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < items.length - 1 ? "1px solid var(--pr-border)" : "none" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--pr-text-body)", marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: "var(--pr-text-sub)" }}>{item.desc}</div>
            </div>
            <button type="button" onClick={() => setPrefs(p => p.map((v, j) => j === i ? !v : v))}
              style={{ width: 40, height: 22, borderRadius: 11, background: prefs[i] ? "#3b82f6" : "var(--pr-border)", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0, marginLeft: 16 }}>
              <span style={{ position: "absolute", top: 3, left: prefs[i] ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "white", transition: "left 0.2s", display: "block" }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}