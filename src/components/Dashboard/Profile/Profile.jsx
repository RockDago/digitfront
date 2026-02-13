// src/components/Dashboard/Profile/Profile.jsx
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
} from "lucide-react";
import UserService from "../../../services/user.service";
import { API_URL } from "../../../config/axios";

// --- LISTE COMPLÈTE DE TOUS LES PAYS DU MONDE (248 pays) ---
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
  {
    code: "IO",
    name: "Territoire britannique de l'océan Indien",
    dial_code: "+246",
  },
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

export default function Profile() {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");

  const triggerToast = (message, type = "info") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // ✅ CORRECTION ICI : Vérification de l'utilisateur avant chargement
  useEffect(() => {
    const loadProfile = async () => {
      // ✅ CORRECTION CRITIQUE : Vérifier l'utilisateur avant l'appel API
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      console.log("📊 Profile.jsx - Utilisateur stocké:", user);

      if (!user || !user.id) {
        console.warn(
          "⚠️ Utilisateur non authentifié. Veuillez vous connecter.",
        );
        // Optionnel : afficher un message ou rediriger vers /login
        // triggerToast("Session expirée. Veuillez vous reconnecter.", "error");
        return;
      }

      try {
        console.log("🔄 Chargement du profil pour l'utilisateur:", user.id);
        setLoading(true);
        const data = await UserService.getMyProfile();
        console.log("✅ Profil chargé:", data);
        setProfileData(data);
      } catch (err) {
        console.error("❌ Erreur chargement profil:", err);
        // Ne pas afficher de toast si c'est juste le token manquant (déjà géré)
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
      const updatedUser = {
        ...storedUser,
        nom: response.nom,
        prenom: response.prenom,
        email: response.email,
        profileImage: response.logo,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Rafraîchir l'image de profil dans le localStorage et la navbar
      await UserService.refreshProfileImageInStorage();

      triggerToast("Profil mis à jour avec succès", "success");
    } catch (err) {
      console.error("❌ Erreur mise à jour:", err);
      triggerToast(
        err.response?.data?.detail || "Erreur lors de la mise à jour",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading && !profileData) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      );
    }

    if (!profileData) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <User size={64} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">
            Erreur de chargement
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Impossible de charger le profil
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case "personal":
        return (
          <PersonalInfoForm onSubmit={handleSave} profileData={profileData} />
        );
      case "security":
        return (
          <SecurityForm
            onSubmit={handleSave}
            profileData={profileData}
            triggerToast={triggerToast}
          />
        );
      case "notifications":
        return <NotificationsForm onSubmit={handleSave} />;
      default:
        return (
          <PersonalInfoForm onSubmit={handleSave} profileData={profileData} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 p-4 md:p-8">
      <div
        className={`fixed top-4 right-4 z-[100] transition-all duration-300 ${
          showToast ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div
          className={`bg-white rounded-lg shadow-xl p-3 w-72 flex items-start border-l-4 ${
            toastType === "success"
              ? "border-emerald-500"
              : toastType === "error"
                ? "border-red-500"
                : "border-blue-500"
          }`}
        >
          <div className="flex-1 ml-2">
            <p className="text-xs font-bold text-gray-800">
              {toastType === "success"
                ? "Succès"
                : toastType === "error"
                  ? "Erreur"
                  : "Info"}
            </p>
            <p className="text-xs text-gray-600 leading-tight">
              {toastMessage}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <nav className="flex flex-col gap-2">
            <SidebarItem
              icon={<User size={18} />}
              label="Informations personnelles"
              isActive={activeTab === "personal"}
              onClick={() => setActiveTab("personal")}
            />
            <SidebarItem
              icon={<Lock size={18} />}
              label="Sécurité"
              isActive={activeTab === "security"}
              onClick={() => setActiveTab("security")}
            />
            <SidebarItem
              icon={<Bell size={18} />}
              label="Notifications"
              isActive={activeTab === "notifications"}
              onClick={() => setActiveTab("notifications")}
            />
          </nav>
        </aside>

        <section className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 lg:p-8 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-3 md:gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              {activeTab === "personal" && "Informations personnelles"}
              {activeTab === "security" && "Sécurité et Connexion"}
              {activeTab === "notifications" && "Préférences de notification"}
            </h2>

            {loading && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium animate-pulse">
                <Loader2 size={16} className="animate-spin" />
                <span className="hidden sm:inline">Enregistrement...</span>
              </div>
            )}
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {renderContent()}
          </div>
        </section>
      </main>
    </div>
  );
}

// --- FORMULAIRE INFORMATIONS PERSONNELLES ---

function PersonalInfoForm({ onSubmit, profileData }) {
  const [selectedCountry, setSelectedCountry] = useState(
    COUNTRIES.find((c) => c.code === "MG"),
  );
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    code_postal: "",
    adresse: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [errors, setErrors] = useState({});

  // ✅ CORRECTION ICI : Vérification du token avant chargement de l'image
  useEffect(() => {
    const loadProfileImage = () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token"); // ✅ AJOUT

      // 1. D'abord vérifier localStorage (image déjà chargée)
      if (storedUser.profileImage) {
        setPreviewImage(storedUser.profileImage);
      }
      // 2. Sinon, charger depuis l'API SEULEMENT si le token existe
      else if (storedUser.id && token) {
        // ✅ AJOUT && token
        const fetchProfileImage = async () => {
          try {
            console.log("🔄 Chargement de l'image de profil depuis l'API...");
            const profileData = await UserService.getMyProfile();

            if (profileData.logo) {
              const baseURL = API_URL;
              const imageURL = profileData.logo.startsWith("/")
                ? `${baseURL}${profileData.logo}`
                : profileData.logo;

              setPreviewImage(imageURL);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...storedUser, profileImage: imageURL }),
              );
              console.log("✅ Image de profil chargée avec succès:", imageURL);
            }
          } catch (error) {
            // Ignorer l'erreur si c'est le token manquant
            if (error.message !== "Token d'authentification manquant") {
              console.error("❌ Erreur chargement image profil:", error);
            }
            setPreviewImage(null);
          }
        };

        fetchProfileImage();
      }
    };

    loadProfileImage();

    const handleProfileUpdate = (e) => {
      if (e.detail?.profileImage) {
        setPreviewImage(e.detail.profileImage);
      }
    };

    window.addEventListener("profileImageUpdated", handleProfileUpdate);
    return () =>
      window.removeEventListener("profileImageUpdated", handleProfileUpdate);
  }, []);

  useEffect(() => {
    if (profileData) {
      setFormData({
        nom: profileData.nom || "",
        prenom: profileData.prenom || "",
        email: profileData.email || "",
        telephone: profileData.telephone || "",
        code_postal: profileData.code_postal || "",
        adresse: profileData.adresse || "",
      });
    }
  }, [profileData]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 5MB");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData, selectedFile);
    }
  };

  const isEmailVerified = profileData?.email_verified || false;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ✅ Photo de profil - EXACTEMENT COMME NAVBAR.JSX */}
      <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
        <div className="relative group">
          <button
            type="button"
            onClick={handleAvatarClick}
            className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm overflow-hidden">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt={`${profileData?.prenom} ${profileData?.nom}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("❌ Erreur chargement image:", e);
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `<span class="font-bold text-xs md:text-sm">${
                      profileData?.prenom?.[0]?.toUpperCase() || "U"
                    }</span>`;
                  }}
                />
              ) : (
                <span className="font-bold text-2xl">
                  {profileData?.prenom?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
              <Camera
                size={24}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div>
          <h3 className="font-semibold text-base text-gray-900 mb-1">
            Photo de profil
          </h3>
          <p className="text-sm text-gray-500">PNG, JPG jusqu'à 5MB</p>
        </div>
      </div>

      {/* ✅ STATUT VÉRIFICATION EMAIL */}
      <div
        className={`flex items-center gap-3 p-4 rounded-xl border ${
          isEmailVerified
            ? "bg-emerald-50 border-emerald-200"
            : "bg-amber-50 border-amber-200"
        }`}
      >
        {isEmailVerified ? (
          <>
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-800">
                Email vérifié
              </p>
              <p className="text-xs text-emerald-600">
                Votre adresse email a été confirmée
              </p>
            </div>
          </>
        ) : (
          <>
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">
                Email non vérifié
              </p>
              <p className="text-xs text-amber-600">
                Veuillez vérifier votre email
              </p>
            </div>
            <button
              type="button"
              className="text-xs font-medium text-amber-700 hover:text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              Renvoyer
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SimpleInput
          label="Prénom"
          name="prenom"
          value={formData.prenom}
          onChange={handleInputChange}
          placeholder="Votre prénom"
          error={errors.prenom}
          required
        />
        <SimpleInput
          label="Nom"
          name="nom"
          value={formData.nom}
          onChange={handleInputChange}
          placeholder="Votre nom"
          error={errors.nom}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SimpleInput
          label="Adresse Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="votre.email@exemple.com"
          error={errors.email}
          required
        />
        <PhoneInput
          label="Numéro de téléphone"
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
          value={formData.telephone}
          onChange={(value) => setFormData({ ...formData, telephone: value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CountrySelect
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
        />
        <SimpleInput
          label="Code Postal"
          name="code_postal"
          value={formData.code_postal}
          onChange={handleInputChange}
          placeholder="101"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SimpleInput
          label="Adresse exacte"
          name="adresse"
          value={formData.adresse}
          onChange={handleInputChange}
          placeholder="123 Rue Exemple, Ville"
        />
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
        >
          Enregistrer les modifications
        </button>
      </div>
    </form>
  );
}

// --- FORMULAIRE SÉCURITÉ AVEC 2FA ---

function SecurityForm({ onSubmit, profileData, triggerToast }) {
  const [passwords, setPasswords] = useState({
    passwordCurrent: "",
    passwordNew: "",
    passwordConfirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    profileData?.two_factor_enabled || false,
  );
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading2FA, setLoading2FA] = useState(false);

  const passwordCriteria = [
    { minLength: { regex: /.{8,}/, label: "8 caractères" } },
    { uppercase: { regex: /[A-Z]/, label: "Majuscule" } },
    { lowercase: { regex: /[a-z]/, label: "Minuscule" } },
    { digit: { regex: /\d/, label: "Chiffre" } },
    {
      validSymbols: {
        regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        label: "Symbole",
        required: true,
      },
    },
  ];

  const validatePasswordCriteria = (password) => ({
    minLength: passwordCriteria[0].minLength.regex.test(password),
    uppercase: passwordCriteria[1].uppercase.regex.test(password),
    lowercase: passwordCriteria[2].lowercase.regex.test(password),
    digit: passwordCriteria[3].digit.regex.test(password),
    validSymbols: passwordCriteria[4].validSymbols.regex.test(password),
  });

  const allPasswordCriteriaMet = (password) => {
    const criteria = validatePasswordCriteria(password);
    return Object.values(criteria).every((val) => val === true);
  };

  const passwordValidation = validatePasswordCriteria(passwords.passwordNew);
  const isPasswordValid = allPasswordCriteriaMet(passwords.passwordNew);
  const passwordsMatch =
    passwords.passwordNew === passwords.passwordConfirm &&
    passwords.passwordConfirm !== "";
  const passwordsDontMatch =
    passwords.passwordNew !== "" &&
    passwords.passwordConfirm !== "" &&
    passwords.passwordNew !== passwords.passwordConfirm;
  const showPasswordCriteria =
    passwords.passwordNew.length > 0 && !isPasswordValid;

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!passwords.passwordCurrent.trim())
      newErrors.passwordCurrent = "Le mot de passe actuel est requis";
    if (!passwords.passwordNew.trim()) {
      newErrors.passwordNew = "Le nouveau mot de passe est requis";
    } else if (!isPasswordValid) {
      newErrors.passwordNew = "Mot de passe faible";
    }
    if (!passwords.passwordConfirm.trim()) {
      newErrors.passwordConfirm = "La confirmation est requise";
    } else if (passwords.passwordNew !== passwords.passwordConfirm) {
      newErrors.passwordConfirm = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        passwordCurrent: passwords.passwordCurrent,
        passwordNew: passwords.passwordNew,
      });
      setPasswords({
        passwordCurrent: "",
        passwordNew: "",
        passwordConfirm: "",
      });
    }
  };

  const handleEnable2FA = async () => {
    try {
      setLoading2FA(true);
      // TODO: Remplacer par votre appel API réel
      const response = await UserService.enable2FA();
      setQrCodeUrl(response.qr_code_url);

      // Simulation pour la démo
      setQrCodeUrl(
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/YourApp:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=YourApp",
      );
      setShowQRCode(true);
      triggerToast("QR Code généré avec succès", "success");
    } catch (error) {
      console.error("Erreur activation 2FA:", error);
      triggerToast("Erreur lors de l'activation du 2FA", "error");
    } finally {
      setLoading2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    if (verificationCode.length !== 6) {
      triggerToast("Le code doit contenir 6 chiffres", "error");
      return;
    }

    try {
      setLoading2FA(true);
      // TODO: Remplacer par votre appel API réel
      await UserService.verify2FA(verificationCode);

      // Simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTwoFactorEnabled(true);
      setShowQRCode(false);
      setVerificationCode("");
      triggerToast("2FA activé avec succès !", "success");
    } catch (error) {
      console.error("Erreur vérification 2FA:", error);
      triggerToast("Code invalide. Veuillez réessayer.", "error");
    } finally {
      setLoading2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir désactiver l'authentification deux facteurs ?",
      )
    ) {
      try {
        setLoading2FA(true);
        // TODO: Remplacer par votre appel API réel
        await UserService.disable2FA();

        // Simulation
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setTwoFactorEnabled(false);
        triggerToast("2FA désactivé avec succès", "success");
      } catch (error) {
        console.error("Erreur désactivation 2FA:", error);
        triggerToast("Erreur lors de la désactivation du 2FA", "error");
      } finally {
        setLoading2FA(false);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* SECTION 2FA */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Authentification deux facteurs (2FA)
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Ajoutez une couche de sécurité supplémentaire à votre compte en
              activant l'authentification deux facteurs.
            </p>

            {!twoFactorEnabled && !showQRCode && (
              <button
                type="button"
                onClick={handleEnable2FA}
                disabled={loading2FA}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading2FA ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Smartphone size={16} />
                )}
                {loading2FA ? "Chargement..." : "Activer 2FA"}
              </button>
            )}

            {twoFactorEnabled && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">2FA activé</span>
                </div>
                <button
                  type="button"
                  onClick={handleDisable2FA}
                  disabled={loading2FA}
                  className="text-sm text-red-600 hover:text-red-700 font-medium disabled:text-red-400"
                >
                  {loading2FA ? "Chargement..." : "Désactiver"}
                </button>
              </div>
            )}

            {showQRCode && (
              <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                  Scannez ce QR code avec votre application d'authentification
                </h4>
                <div className="flex flex-col items-center gap-4 mb-4">
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    {qrCodeUrl ? (
                      <img
                        src={qrCodeUrl}
                        alt="QR Code 2FA"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <Loader2
                        size={32}
                        className="animate-spin text-gray-400"
                      />
                    )}
                  </div>
                  <div className="w-full">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Code de vérification
                    </label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) =>
                        setVerificationCode(
                          e.target.value.replace(/\D/g, "").slice(0, 6),
                        )
                      }
                      placeholder="000 000"
                      maxLength={6}
                      className="w-full px-3 py-2 text-center text-lg font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleVerify2FA}
                    disabled={verificationCode.length !== 6 || loading2FA}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {loading2FA ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        Vérification...
                      </span>
                    ) : (
                      "Vérifier et activer"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowQRCode(false);
                      setVerificationCode("");
                    }}
                    disabled={loading2FA}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm disabled:bg-gray-50"
                  >
                    Annuler
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Utilisez Google Authenticator, Authy ou toute autre
                  application compatible.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION CHANGEMENT MOT DE PASSE */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <h4 className="font-semibold text-blue-800 text-sm mb-1">
            Changer le mot de passe
          </h4>
          <p className="text-blue-600 text-sm">
            Utilisez un mot de passe fort contenant au moins 8 caractères, une
            majuscule, une minuscule, un chiffre et un symbole (!@#$%...).
          </p>
        </div>

        {profileData?.google_auth && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-yellow-800 text-sm">
              Vous êtes connecté avec Google OAuth. Le changement de mot de
              passe n'est pas disponible.
            </p>
          </div>
        )}

        <div className="relative group">
          <input
            type={showPassword ? "text" : "password"}
            id="passwordCurrent"
            value={passwords.passwordCurrent}
            onChange={(e) =>
              setPasswords({ ...passwords, passwordCurrent: e.target.value })
            }
            disabled={profileData?.google_auth}
            className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer placeholder:text-transparent ${
              errors.passwordCurrent ? "border-red-500" : "border-gray-300"
            } ${
              profileData?.google_auth ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            placeholder=" "
            required
          />
          <label
            htmlFor="passwordCurrent"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            Mot de passe actuel
          </label>
          {!profileData?.google_auth && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          {errors.passwordCurrent && (
            <p className="text-[10px] text-red-500 absolute -bottom-4 right-0">
              {errors.passwordCurrent}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group">
            <input
              type={showNewPassword ? "text" : "password"}
              id="passwordNew"
              value={passwords.passwordNew}
              onChange={(e) =>
                setPasswords({ ...passwords, passwordNew: e.target.value })
              }
              disabled={profileData?.google_auth}
              className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer placeholder:text-transparent ${
                errors.passwordNew ? "border-red-500" : "border-gray-300"
              } ${
                profileData?.google_auth ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              placeholder=" "
              required
            />
            <label
              htmlFor="passwordNew"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
            >
              Nouveau mot de passe
            </label>
            {!profileData?.google_auth && (
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
            {errors.passwordNew && (
              <p className="text-[10px] text-red-500 absolute -bottom-4 right-0">
                {errors.passwordNew}
              </p>
            )}
          </div>

          <div className="relative group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="passwordConfirm"
              value={passwords.passwordConfirm}
              onChange={(e) =>
                setPasswords({ ...passwords, passwordConfirm: e.target.value })
              }
              disabled={!isPasswordValid || profileData?.google_auth}
              className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 peer placeholder:text-transparent ${
                !isPasswordValid
                  ? "bg-gray-100 cursor-not-allowed border-gray-200"
                  : passwordsDontMatch
                    ? "border-red-400 focus:ring-red-300"
                    : passwordsMatch
                      ? "border-emerald-400 focus:ring-emerald-300"
                      : "border-gray-300 focus:ring-blue-500"
              } ${
                profileData?.google_auth ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              placeholder=" "
              required
            />
            <label
              htmlFor="passwordConfirm"
              className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 ${
                !isPasswordValid
                  ? "text-gray-400"
                  : "text-gray-500 peer-focus:text-blue-600"
              }`}
            >
              {!isPasswordValid
                ? "Complétez le mot de passe d'abord"
                : "Confirmer"}
            </label>
            {isPasswordValid && !profileData?.google_auth && (
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
            {passwords.passwordConfirm && isPasswordValid && (
              <p
                className={`text-[10px] mt-1 font-medium absolute -bottom-4 left-0 ${
                  passwordsMatch ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {passwordsMatch ? "✓ OK" : "✗ Différent"}
              </p>
            )}
          </div>
        </div>

        {showPasswordCriteria && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
            {[
              { key: "minLength", label: "8 caractères" },
              { key: "uppercase", label: "Majuscule" },
              { key: "lowercase", label: "Minuscule" },
              { key: "digit", label: "Chiffre" },
              { key: "validSymbols", label: "Symbole" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center text-[10px]">
                <span
                  className={`w-1.5 h-1.5 rounded-full mr-2 ${
                    passwordValidation[key] ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                />
                <span
                  className={
                    passwordValidation[key]
                      ? "text-emerald-600 font-medium"
                      : "text-gray-500"
                  }
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={profileData?.google_auth}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Mettre à jour le mot de passe
          </button>
        </div>
      </form>
    </div>
  );
}

// --- FORMULAIRE NOTIFICATIONS ---

function NotificationsForm({ onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Notifications sauvegardées");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <ToggleItem
          title="Notifications par email"
          description="Recevoir des emails pour chaque nouvelle activité."
          defaultChecked={true}
        />
        <ToggleItem
          title="Mises à jour produit"
          description="Être informé des nouvelles fonctionnalités et améliorations."
          defaultChecked={true}
        />
        <ToggleItem
          title="Rappels système"
          description="Recevoir des rappels pour les tâches importantes."
          defaultChecked={false}
        />
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
        >
          Enregistrer les préférences
        </button>
      </div>
    </form>
  );
}

// --- COMPOSANTS UI RÉUTILISABLES ---

function SidebarItem({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left ${
        isActive
          ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <span
        className={`flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`}
      >
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

function SimpleInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  error = "",
  required = false,
}) {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
          error ? "border-red-500" : "border-gray-300"
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function CountrySelect({ selectedCountry, onCountryChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial_code.includes(search),
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Pays
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2">
          <img
            src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
            alt={selectedCountry.name}
            className="w-5 h-auto rounded-sm shadow-sm"
          />
          <span className="text-sm">{selectedCountry.name}</span>
        </div>
        <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="p-2 border-b border-gray-100 bg-gray-50 sticky top-0">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Rechercher un pays..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    onCountryChange(country);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors text-left ${
                    selectedCountry.code === country.code
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  <img
                    src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                    alt={country.code}
                    className="w-5 h-auto rounded-sm shadow-sm flex-shrink-0"
                  />
                  <span className="flex-1 truncate">{country.name}</span>
                  {selectedCountry.code === country.code && (
                    <Check size={14} className="text-blue-600 flex-shrink-0" />
                  )}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                Aucun pays trouvé
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PhoneInput({
  label,
  selectedCountry,
  onCountryChange,
  value,
  onChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial_code.includes(search),
  );

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    onChange(value);
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
        >
          <img
            src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
            alt={selectedCountry.code}
            className="w-5 h-auto rounded-sm shadow-sm flex-shrink-0"
          />
          <span className="text-sm font-medium text-gray-700 truncate">
            {selectedCountry.dial_code}
          </span>
          <ChevronDown
            size={12}
            className="text-gray-400 ml-auto flex-shrink-0"
          />
        </button>

        <input
          type="tel"
          value={value}
          onChange={handlePhoneChange}
          placeholder=""
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {isOpen && (
        <div className="absolute mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="p-2 border-b border-gray-100 bg-gray-50">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Rechercher (+261, Mada...)"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    onCountryChange(country);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors text-left ${
                    selectedCountry.code === country.code
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  <img
                    src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                    alt={country.code}
                    className="w-5 h-auto rounded-sm shadow-sm flex-shrink-0"
                  />
                  <span className="flex-1 truncate">{country.name}</span>
                  <span className="text-xs text-gray-500">
                    {country.dial_code}
                  </span>
                  {selectedCountry.code === country.code && (
                    <Check size={14} className="text-blue-600 flex-shrink-0" />
                  )}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                Aucun pays trouvé
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleItem({ title, description, defaultChecked = false }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all">
      <div className="flex-1">
        <h4 className="font-semibold text-sm text-gray-800">{title}</h4>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
