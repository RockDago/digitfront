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

// Components Home (maintenant dans pages/)
import Navbar from "./pages/Home/Navbar";
import Home from "./pages/Home/Home";
import AllActu from "./pages/Home/AllActu";
import APropos from "./pages/Home/APropos";

// Components Auth (maintenant dans pages/)
import Login from "./pages/Login/Login";
import VerifyEmail from "./pages/Login/VerifyEmail";
import ForgotPassword from "./pages/Login/ForgotPassword";

// ✅ Dashboards (Layouts principaux) - maintenant dans pages/
import DashboardAdmin from "./pages/Dashboard/DashboardAdmin";
import DashboardSicp from "./pages/Dashboard/DashboardSicp";
import DashboardSae from "./pages/Dashboard/DashboardSae";
import DashboardEtab from "./pages/Dashboard/DashboardEtab";
import DashboardReq from "./pages/Dashboard/DashboardReq";
import DashboardCnh from "./pages/Dashboard/DashboardCnh";
import DashboardExpert from "./pages/Dashboard/DashboardExpert";
import DashboardUni from "./pages/Dashboard/DashboardUni";

// ✅ VUES ADMIN - maintenant dans pages/
import DashboardAdminView from "./pages/Dashboard/View/Admin/DashboardAdminView";
import UserView from "./pages/Dashboard/View/Admin/UserView";
import HomeParam from "./pages/Dashboard/View/Admin/HomeParam";
import ServicesParam from "./pages/Dashboard/View/Admin/ServicesParam";
import ContactParam from "./pages/Dashboard/View/Admin/ContactParam";
import ActualiteParam from "./pages/Dashboard/View/Admin/ActualiteParam";
import FaqParam from "./pages/Dashboard/View/Admin/FaqParam";
import SystemStatusView from "./pages/Dashboard/View/Admin/SystemStatusView";
import MessagesView from "./pages/Dashboard/View/Admin/MessagesView";

// ✅ VUES REQUERANT - maintenant dans pages/
import DashboardReqView from "./pages/Dashboard/View/Requerant/DashboardReqView";
import CreerDemandeView from "./pages/Dashboard/View/Requerant/CreerDemandeView";

// ✅ VUE SAE - maintenant dans pages/
import DashboardSaeView from "./pages/Dashboard/View/Sae/DashboardSaeView";
import AccreditationView from "./pages/Dashboard/View/Sae/AccreditationView";
import ArchiveAccreditationView from "./pages/Dashboard/View/Sae/ArchiveAccreditationView";
import EquivalenceView from "./pages/Dashboard/View/Sae/EquivalenceView";
import ArchiveEquivalenceView from "./pages/Dashboard/View/Sae/ArchiveEquivalenceView";

// ✅ VUE ETABLISSEMENT - maintenant dans pages/
import DashboardEtabView from "./pages/Dashboard/View/Etab/DashboardEtabView";
import MesInformationsHabilitation from "./pages/Dashboard/View/Etab/Habilitation/MesInformationsHabilitation";
import CreerDemandeHabilitation from "./pages/Dashboard/View/Etab/Habilitation/CreerDemandeHabilitation";
import RenouvellementCanevas from "./pages/Dashboard/View/Etab/Habilitation/RenouvellementCanevas";
import RenouvellementForm from "./pages/Dashboard/View/Etab/Habilitation/RenouvellementForm";
import AutoEvaluationAccreditation from "./pages/Dashboard/View/Etab/Accreditation/AutoEvaluationAccreditation";
import CreerDemandeAccreditation from "./pages/Dashboard/View/Etab/Accreditation/CreerDemandeAccreditation";

// ✅ NOUVEAUX FORMULAIRES HABILITATION - maintenant dans pages/
import FormLicence from "./pages/Dashboard/View/Etab/Habilitation/FormLicence";
import FormMaster from "./pages/Dashboard/View/Etab/Habilitation/FormMaster";
import FormDoctorat from "./pages/Dashboard/View/Etab/Habilitation/FormDoctorat";

// ✅ COMPOSANT PROFILE (ACCESSIBLE À TOUS LES RÔLES) - maintenant dans pages/
import Profile from "./pages/Dashboard/Profile/Profile";

// ✅ Configuration Google OAuth
const GOOGLE_CLIENT_ID =
  "41731731970-7v3q4hvlnbqebo409jegijafv36cl5vd.apps.googleusercontent.com";

// ✅ Configuration Google reCAPTCHA v3
const RECAPTCHA_SITE_KEY = "6Lf3PEcsAAAAAA2Mg4pl7Nj9Bt_ETHTFGDK8nuBe";

// ✅ Contrôleur de visibilité du badge reCAPTCHA
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

// ✅ Composant Route Protégée SIMPLIFIÉ (Sans blocage strict pour Profile)
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const user = AuthService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ SUPPRESSION DE LA VÉRIFICATION STRICTE
  // On laisse passer tous les utilisateurs authentifiés
  // La vérification se fera au niveau du backend
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Au lieu de bloquer, on redirige vers leur dashboard
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
    };

    const userDashboard = dashboardPaths[user?.role];
    if (userDashboard) {
      return <Navigate to={userDashboard} replace />;
    }
  }

  return children;
};

// ✅ Composant Redirect après login
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
    };

    const path = dashboardPaths[user.role] || "/";
    return <Navigate to={path} replace />;
  }

  return children;
};

// ✅ Redirection intelligente vers le bon dashboard
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
  };

  const path = dashboardPaths[user?.role] || "/";
  return <Navigate to={path} replace />;
};

// ✅ Page 404
const NotFound = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
    <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
      <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        Page introuvable
      </h1>
      <p className="text-gray-600 mb-6">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <a
        href="/"
        className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium transition-all shadow-lg"
      >
        Retour à l'accueil
      </a>
    </div>
  </div>
);

function App() {
  return (
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

            {/* ✅ ROUTES ACTUALITÉS - Liste et Article avec slug */}
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
            {/* Compatibilité : redirection courte vers le formulaire de renouvellement */}
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
              <Route path="gerer-utilisateurs" element={<UserView />} />
              <Route path="gerer-parametres" element={<HomeParam />} />
              <Route path="parametre2" element={<ServicesParam />} />
              <Route path="parametre3" element={<ContactParam />} />
              <Route path="parametre-actualite" element={<ActualiteParam />} />
              <Route path="parametre-faq" element={<FaqParam />} />
              <Route path="etat-systeme" element={<SystemStatusView />} />
              <Route path="profile" element={<Profile />} />
              <Route path="messages-contact" element={<MessagesView />} />
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

              {/* ✅ NOUVELLES ROUTES POUR LES FORMULAIRES SPÉCIFIQUES */}
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
              <Route
                path="accreditation/auto-evaluation"
                element={<AutoEvaluationAccreditation />}
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
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="" replace />} />
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
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="" replace />} />
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
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="" replace />} />
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
  );
}

export default App;