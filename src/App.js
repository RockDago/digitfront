// C:\Users\hp\Desktop\Digitalisation\frontend\src\App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { AuthService } from "./services";

// Theme
import { ThemeProvider } from "./context/ThemeContext";

// Components Home
import Navbar from "./pages/Home/Navbar";
import Home from "./pages/Home/Home";
import AllActu from "./pages/Home/AllActu";
import APropos from "./pages/Home/APropos";

// Components Auth
import Login from "./pages/Login/Login";
import VerifyEmail from "./pages/Login/VerifyEmail";
import ForgotPassword from "./pages/Login/ForgotPassword";

// Dashboards (Layouts)
import DashboardAdmin from "./pages/Dashboard/DashboardAdmin";
import DashboardSicp from "./pages/Dashboard/DashboardSicp";
import DashboardSae from "./pages/Dashboard/DashboardSae";
import DashboardEtab from "./pages/Dashboard/DashboardEtab";
import DashboardReq from "./pages/Dashboard/DashboardReq";
import DashboardCnh from "./pages/Dashboard/DashboardCnh";
import DashboardExpert from "./pages/Dashboard/DashboardExpert";
import DashboardUni from "./pages/Dashboard/DashboardUni";
import DashboardGestHab from "./pages/Dashboard/DashboardGestHab";

// VUES ADMIN
import DashboardAdminView from "./pages/Dashboard/View/Admin/DashboardAdminView";
import UserView from "./pages/Dashboard/View/Admin/UserView";
import ContactParam from "./pages/Dashboard/View/Admin/ContactParam";
import ActualiteParam from "./pages/Dashboard/View/Admin/ActualiteParam";
import FaqParam from "./pages/Dashboard/View/Admin/FaqParam";
import SystemStatusView from "./pages/Dashboard/View/Admin/SystemStatusView";
import MessagesView from "./pages/Dashboard/View/Admin/MessagesView";
import AProposParam from "./pages/Dashboard/View/Admin/AProposParam";
import RolesPermissionsView from "./pages/Dashboard/View/Admin/RolesPermissionsView";
import SystemLogsView from "./pages/Dashboard/View/Admin/SystemLogsView";
import DiffusionMessages from "./pages/Dashboard/View/Admin/DiffusionMessages";

// VUES SAE
import DashboardSaeView from "./pages/Dashboard/View/Sae/DashboardSaeView";
import AccreditationView from "./pages/Dashboard/View/Sae/AccreditationView";
import ArchiveAccreditationView from "./pages/Dashboard/View/Sae/ArchiveAccreditationView";
import EquivalenceView from "./pages/Dashboard/View/Sae/EquivalenceView";
import ArchiveEquivalenceView from "./pages/Dashboard/View/Sae/ArchiveEquivalenceView";

// VUES REQUERANT
import DashboardReqView from "./pages/Dashboard/View/Requerant/DashboardReqView";
import CreerDemandeView from "./pages/Dashboard/View/Requerant/CreerDemandeView";
import MesDemandesView from "./pages/Dashboard/View/Requerant/MesDemandesView";

// VUES ETABLISSEMENT
import DashboardEtabView from "./pages/Dashboard/View/Etab/DashboardEtabView";
import MesInformationsHabilitation from "./pages/Dashboard/View/Etab/Habilitation/MesInformationsHabilitation";
import CreerDemandeHabilitation from "./pages/Dashboard/View/Etab/Habilitation/CreerDemandeHabilitation";
import RenouvellementCanevas from "./pages/Dashboard/View/Etab/Habilitation/RenouvellementCanevas";
import RenouvellementForm from "./pages/Dashboard/View/Etab/Habilitation/RenouvellementForm";
// ✅ SÉPARATION : canevas (lecture) et formulaire (évaluation) en deux pages liées
import AutoEvaluationCanevas from "./pages/Dashboard/View/Etab/Accreditation/Autoevaluationcanevas";
import AutoEvaluationAccreditation from "./pages/Dashboard/View/Etab/Accreditation/AutoEvaluationAccreditation";
import CreerDemandeAccreditation from "./pages/Dashboard/View/Etab/Accreditation/CreerDemandeAccreditation";

// FORMULAIRES HABILITATION
import FormLicence from "./pages/Dashboard/View/Etab/Habilitation/FormLicence";
import FormMaster from "./pages/Dashboard/View/Etab/Habilitation/FormMaster";
import FormDoctorat from "./pages/Dashboard/View/Etab/Habilitation/FormDoctorat";

// PROFILE (tous rôles)
import Profile from "./pages/Dashboard/Profile/Profile";

// VUES UNIVERSITE
import DashboardUniView from "./pages/Dashboard/View/University/DashboardUniView";
import ClassementView from "./pages/Dashboard/View/University/ClassementView";

// VUES SICP
import DashboardSicpView from "./pages/Dashboard/View/Sicp/DashboardSicpView";
import PlanificationDescente from "./pages/Dashboard/View/Sicp/PlanificationDescente";
import InspectionControleIES from "./pages/Dashboard/View/Sicp/InspectionControleIES";
import FormulaireSuiviIES from "./pages/Dashboard/View/Sicp/FormulaireSuiviIES";
import GeolocalisationUniversites from "./pages/Dashboard/View/Sicp/GeolocalisationUniversites";

// VUES GESTIONNAIRE HABILITATION
import DashboardGestHView from "./pages/Dashboard/View/GestionnaireHab/DashboardGestHView";
import DemandesHabilitation from "./pages/Dashboard/View/GestionnaireHab/DemandesHabilitation";
import DemandesRenouvellement from "./pages/Dashboard/View/GestionnaireHab/DemandesRenouvellement";
import UniversitesHabilitees from "./pages/Dashboard/View/GestionnaireHab/UniversitesHabilitees";
import AssignerExpert from "./pages/Dashboard/View/GestionnaireHab/AssignerExpert";

// VUES CNH
import DashboardCnhView from "./pages/Dashboard/View/Cnh/DashboardCnhView";
import ListesDemandesHabilitationsCnhView from "./pages/Dashboard/View/Cnh/ListesDemandesHabilitationsCnhView";
import ArchivesDemandesCnhView from "./pages/Dashboard/View/Cnh/ArchivesDemandesCnhView";

// VUES EXPERT
import DahsboardExpView from "./pages/Dashboard/View/Expert/DahsboardExpView";
import GestionDossiersExpView from "./pages/Dashboard/View/Expert/GestionDossiersExpView";
import TransmissionCNHExpView from "./pages/Dashboard/View/Expert/TransmissionCNHExpView";

// PAGE 404
import NotFound from "./pages/NotFound";

// Configuration Google OAuth
const GOOGLE_CLIENT_ID =
  "41731731970-7v3q4hvlnbqebo409jegijafv36cl5vd.apps.googleusercontent.com";

// Configuration Google reCAPTCHA v3
const RECAPTCHA_SITE_KEY = "6Lf3PEcsAAAAAA2Mg4pl7Nj9Bt_ETHTFGDK8nuBe";

// Contrôleur de visibilité du badge reCAPTCHA
const RecaptchaBadgeController = () => {
  const location = useLocation();

  useEffect(() => {
    const recaptchaBadge = document.querySelector(".grecaptcha-badge");
    if (recaptchaBadge) {
      const publicPages = ["/login", "/register"];
      const isPublicPage = publicPages.includes(location.pathname);
      const isDashboard = location.pathname.startsWith("/dashboard");
      const isAuthenticated = AuthService.isAuthenticated();

      if (isPublicPage && !isAuthenticated) {
        recaptchaBadge.style.visibility = "visible";
        recaptchaBadge.style.opacity = "1";
      } else if (isDashboard || isAuthenticated) {
        recaptchaBadge.style.visibility = "hidden";
        recaptchaBadge.style.opacity = "0";
      } else {
        recaptchaBadge.style.visibility = "hidden";
        recaptchaBadge.style.opacity = "0";
      }
    }
  }, [location.pathname]);

  return null;
};

// Composant Route Protégée
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const user = AuthService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    const dashboardPaths = {
      Admin: "/dashboard/admin",
      admin: "/dashboard/admin",
      Requerant: "/dashboard/requerant",
      Etablissement: "/dashboard/etablissement",
      SAE: "/dashboard/sae",
      SICP: "/dashboard/sicp",
      CNH: "/dashboard/cnh",
      Expert: "/dashboard/expert",
      Universite: "/dashboard/universite",
      gestionnaire_habilitation: "/dashboard/gestionnaire-habilitation",
    };
    const userDashboard = dashboardPaths[user?.role];
    if (userDashboard) {
      return <Navigate to={userDashboard} replace />;
    }
  }

  return children;
};

// Redirect après login
const AuthRedirect = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const user = AuthService.getCurrentUser();

  if (isAuthenticated && user?.role) {
    const dashboardPaths = {
      Admin: "/dashboard/admin",
      admin: "/dashboard/admin",
      Requerant: "/dashboard/requerant",
      Etablissement: "/dashboard/etablissement",
      SAE: "/dashboard/sae",
      SICP: "/dashboard/sicp",
      CNH: "/dashboard/cnh",
      Expert: "/dashboard/expert",
      Universite: "/dashboard/universite",
      gestionnaire_habilitation: "/dashboard/gestionnaire-habilitation",
    };
    const path = dashboardPaths[user.role] || "/";
    return <Navigate to={path} replace />;
  }

  return children;
};

// Redirection intelligente vers le bon dashboard
const DashboardRedirect = () => {
  const user = AuthService.getCurrentUser();
  const dashboardPaths = {
    Admin: "/dashboard/admin",
    admin: "/dashboard/admin",
    Requerant: "/dashboard/requerant",
    Etablissement: "/dashboard/etablissement",
    SAE: "/dashboard/sae",
    SICP: "/dashboard/sicp",
    CNH: "/dashboard/cnh",
    Expert: "/dashboard/expert",
    Universite: "/dashboard/universite",
    gestionnaire_habilitation: "/dashboard/gestionnaire-habilitation",
  };
  const path = dashboardPaths[user?.role] || "/";
  return <Navigate to={path} replace />;
};

function App() {

  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <GoogleReCaptchaProvider
          reCaptchaKey={RECAPTCHA_SITE_KEY}
          language="fr"
          useRecaptchaNet={false}
          scriptProps={{ async: true, defer: true, appendTo: "head" }}
        >
          <Router>
            <RecaptchaBadgeController />
            <Routes>
              {/* ========== ROUTES PUBLIQUES ========== */}
              <Route
                path="/"
                element={
                  <Navbar>
                    <Home />
                  </Navbar>
                }
              />
              <Route
                path="/actualites"
                element={
                  <Navbar>
                    <AllActu />
                  </Navbar>
                }
              />
              <Route
                path="/actualites/:slug"
                element={
                  <Navbar>
                    <AllActu />
                  </Navbar>
                }
              />
              <Route
                path="/apropos"
                element={
                  <Navbar>
                    <APropos />
                  </Navbar>
                }
              />
              <Route
                path="/renouvellement-form"
                element={
                  <Navigate
                    to="/dashboard/etablissement/habilitation/renouvellement/form"
                    replace
                  />
                }
              />
              <Route
                path="/login"
                element={
                  <AuthRedirect>
                    <Login />
                  </AuthRedirect>
                }
              />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* ========== DASHBOARD ADMIN ========== */}
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute allowedRoles={["Admin", "admin"]}>
                    <DashboardAdmin />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardAdminView />} />
                <Route path="messages-contact" element={<MessagesView />} />
                <Route path="diffusion" element={<DiffusionMessages />} />

                {/* --- MODULE CNH (Accès Admin) --- */}
                <Route path="cnh" element={<DashboardCnhView />} />
                <Route
                  path="cnh/demandes-habilitations"
                  element={<ListesDemandesHabilitationsCnhView />}
                />
                <Route
                  path="cnh/archives"
                  element={<ArchivesDemandesCnhView />}
                />

                {/* --- MODULE EXPERT (Accès Admin) --- */}
                <Route path="expert" element={<DahsboardExpView />} />
                <Route
                  path="expert/gestion-dossiers"
                  element={<GestionDossiersExpView />}
                />
                <Route
                  path="expert/transmission"
                  element={<TransmissionCNHExpView />}
                />

                {/* --- MODULE SAE --- */}
                <Route path="sae" element={<DashboardSaeView />} />
                <Route
                  path="sae/accreditation"
                  element={<AccreditationView />}
                />
                <Route
                  path="sae/archive-accreditation"
                  element={<ArchiveAccreditationView />}
                />
                <Route path="sae/equivalence" element={<EquivalenceView />} />
                <Route
                  path="sae/archive-equivalence"
                  element={<ArchiveEquivalenceView />}
                />

                {/* --- MODULE SICP --- */}
                <Route path="sicp" element={<DashboardSicpView />} />
                <Route
                  path="sicp/planification"
                  element={<PlanificationDescente />}
                />
                <Route
                  path="sicp/geolocalisation"
                  element={<GeolocalisationUniversites />}
                />
                <Route
                  path="sicp/inspection-performance"
                  element={<InspectionControleIES />}
                />
                <Route
                  path="sicp/suivi-qualite"
                  element={<FormulaireSuiviIES />}
                />
                <Route path="sicp/classement" element={<ClassementView />} />

                {/* --- MODULE GESTION HABILITATION --- */}
                <Route
                  path="gestion-habilitation"
                  element={<DashboardGestHView />}
                />
                <Route
                  path="gestion-habilitation/demandes"
                  element={<DemandesHabilitation />}
                />
                <Route
                  path="gestion-habilitation/renouvellements"
                  element={<DemandesRenouvellement />}
                />
                <Route
                  path="gestion-habilitation/universites"
                  element={<UniversitesHabilitees />}
                />
                <Route
                  path="gestion-habilitation/dossiers-expert"
                  element={<AssignerExpert />}
                />

                {/* --- MODULE UNIVERSITÉ --- */}
                <Route path="universite" element={<DashboardUniView />} />
                <Route
                  path="universite/classement"
                  element={<ClassementView />}
                />

                {/* --- ADMINISTRATION ET SYSTÈME --- */}
                <Route path="gerer-utilisateurs" element={<UserView />} />
                <Route
                  path="habilitation/roles"
                  element={<RolesPermissionsView />}
                />
                <Route path="parametre3" element={<ContactParam />} />
                <Route
                  path="parametre-actualite"
                  element={<ActualiteParam />}
                />
                <Route path="parametre-faq" element={<FaqParam />} />
                <Route path="parametre-apropos" element={<AProposParam />} />
                <Route path="etat-systeme" element={<SystemStatusView />} />
                <Route path="log-systeme" element={<SystemLogsView />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="" replace />} />
              </Route>

              {/* ========== DASHBOARD REQUERANT ========== */}
              <Route
                path="/dashboard/requerant"
                element={
                  <ProtectedRoute allowedRoles={["Requerant"]}>
                    <DashboardReq />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardReqView />} />
                <Route path="creer-demande" element={<CreerDemandeView />} />
                <Route path="mes-demandes" element={<MesDemandesView />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="" replace />} />
              </Route>

              {/* ========== DASHBOARD ETABLISSEMENT ========== */}
              <Route
                path="/dashboard/etablissement"
                element={
                  <ProtectedRoute allowedRoles={["Etablissement"]}>
                    <DashboardEtab />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardEtabView />} />
                <Route
                  path="habilitation/mes-informations"
                  element={<MesInformationsHabilitation />}
                />
                <Route
                  path="habilitation/creer-demande"
                  element={<CreerDemandeHabilitation />}
                />
                <Route
                  path="habilitation/formulaire/licence"
                  element={<FormLicence />}
                />
                <Route
                  path="habilitation/formulaire/master"
                  element={<FormMaster />}
                />
                <Route
                  path="habilitation/formulaire/doctorat"
                  element={<FormDoctorat />}
                />
                <Route
                  path="habilitation/renouvellement"
                  element={<RenouvellementCanevas />}
                />
                <Route
                  path="habilitation/renouvellement/form"
                  element={<RenouvellementForm />}
                />

                {/* ✅ AUTO-ÉVALUATION : formulaire affiché en premier, puis canevas */}
                <Route
                  path="accreditation/auto-evaluation"
                  element={<AutoEvaluationAccreditation />}
                />
                <Route
                  path="accreditation/auto-evaluation/canevas"
                  element={<AutoEvaluationCanevas />}
                />

                <Route
                  path="accreditation/creer-demande"
                  element={<CreerDemandeAccreditation />}
                />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="" replace />} />
              </Route>

              {/* ========== DASHBOARD SAE ========== */}
              <Route
                path="/dashboard/sae"
                element={
                  <ProtectedRoute allowedRoles={["SAE"]}>
                    <DashboardSae />
                  </ProtectedRoute>
                }
              >
                <Route path="tableau-de-bord" element={<DashboardSaeView />} />
                <Route path="accreditation" element={<AccreditationView />} />
                <Route
                  path="archive-accreditation"
                  element={<ArchiveAccreditationView />}
                />
                <Route path="equivalence" element={<EquivalenceView />} />
                <Route
                  path="archive-equivalence"
                  element={<ArchiveEquivalenceView />}
                />
                <Route path="profile" element={<Profile />} />
                <Route
                  index
                  element={<Navigate to="tableau-de-bord" replace />}
                />
                <Route
                  path="*"
                  element={<Navigate to="tableau-de-bord" replace />}
                />
              </Route>

              {/* ========== DASHBOARD SICP ========== */}
              <Route
                path="/dashboard/sicp"
                element={
                  <ProtectedRoute allowedRoles={["SICP"]}>
                    <DashboardSicp />
                  </ProtectedRoute>
                }
              >
                <Route path="tableau-de-bord" element={<DashboardSicpView />} />
                <Route
                  path="planification-descente"
                  element={<PlanificationDescente />}
                />
                <Route
                  path="inspection-controle"
                  element={<InspectionControleIES />}
                />
                <Route
                  path="formulaire-suivi"
                  element={<FormulaireSuiviIES />}
                />
                <Route
                  path="geolocalisation"
                  element={<GeolocalisationUniversites />}
                />
                <Route path="classement" element={<ClassementView />} />
                <Route path="profile" element={<Profile />} />
                <Route
                  index
                  element={<Navigate to="tableau-de-bord" replace />}
                />
                <Route
                  path="*"
                  element={<Navigate to="tableau-de-bord" replace />}
                />
              </Route>

              {/* ========== DASHBOARD CNH ========== */}
              <Route
                path="/dashboard/cnh"
                element={
                  <ProtectedRoute allowedRoles={["CNH"]}>
                    <DashboardCnh />
                  </ProtectedRoute>
                }
              >
                <Route path="tableau-de-bord" element={<DashboardCnhView />} />
                <Route
                  path="listes-demandes-habilitations"
                  element={<ListesDemandesHabilitationsCnhView />}
                />
                <Route
                  path="archives-demandes"
                  element={<ArchivesDemandesCnhView />}
                />
                <Route path="profile" element={<Profile />} />
                <Route
                  index
                  element={<Navigate to="tableau-de-bord" replace />}
                />
                <Route
                  path="*"
                  element={<Navigate to="tableau-de-bord" replace />}
                />
              </Route>

              {/* ========== DASHBOARD EXPERT ========== */}
              <Route
                path="/dashboard/expert"
                element={
                  <ProtectedRoute allowedRoles={["Expert"]}>
                    <DashboardExpert />
                  </ProtectedRoute>
                }
              >
                <Route path="tableau-de-bord" element={<DahsboardExpView />} />
                <Route
                  path="gestion-dossiers"
                  element={<GestionDossiersExpView />}
                />
                <Route
                  path="transmission-cnh"
                  element={<TransmissionCNHExpView />}
                />
                <Route path="profile" element={<Profile />} />
                <Route
                  index
                  element={<Navigate to="tableau-de-bord" replace />}
                />
                <Route
                  path="*"
                  element={<Navigate to="tableau-de-bord" replace />}
                />
              </Route>

              {/* ========== DASHBOARD UNIVERSITE ========== */}
              <Route
                path="/dashboard/universite"
                element={
                  <ProtectedRoute allowedRoles={["Universite"]}>
                    <DashboardUni />
                  </ProtectedRoute>
                }
              >
                <Route path="tableau-de-bord" element={<DashboardUniView />} />
                <Route path="classement" element={<ClassementView />} />
                <Route path="profile" element={<Profile />} />
                <Route
                  index
                  element={<Navigate to="tableau-de-bord" replace />}
                />
                <Route
                  path="*"
                  element={<Navigate to="tableau-de-bord" replace />}
                />
              </Route>

              {/* ========== DASHBOARD GESTIONNAIRE HABILITATION ========== */}
              <Route
                path="/dashboard/gestionnaire-habilitation"
                element={
                  <ProtectedRoute allowedRoles={["gestionnaire_habilitation"]}>
                    <DashboardGestHab />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardGestHView />} />
                <Route
                  path="demandes-habilitation"
                  element={<DemandesHabilitation />}
                />
                <Route
                  path="demandes-renouvellement"
                  element={<DemandesRenouvellement />}
                />
                <Route
                  path="universites-habilitees"
                  element={<UniversitesHabilitees />}
                />
                <Route path="assigner-expert" element={<AssignerExpert />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="" replace />} />
              </Route>

              {/* ========== REDIRECTION DASHBOARD PAR DÉFAUT ========== */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardRedirect />
                  </ProtectedRoute>
                }
              />

              {/* ========== PAGE 404 ========== */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </GoogleReCaptchaProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;
