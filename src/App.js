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

// Components Home
import Navbar from "./components/Home/Navbar";
import Home from "./components/Home/Home";
import AllActu from "./components/Home/AllActu";

import APropos from "./components/Home/APropos";

// Components Auth
import Login from "./components/Login/Login";
import VerifyEmail from "./components/Login/VerifyEmail";
import ForgotPassword from "./components/Login/ForgotPassword";

// ✅ Dashboards (Layouts principaux)
import DashboardAdmin from "./components/Dashboard/DashboardAdmin";
import DashboardSicp from "./components/Dashboard/DashboardSicp";
import DashboardSae from "./components/Dashboard/DashboardSae";
import DashboardEtab from "./components/Dashboard/DashboardEtab";
import DashboardReq from "./components/Dashboard/DashboardReq";
import DashboardCnh from "./components/Dashboard/DashboardCnh";
import DashboardExpert from "./components/Dashboard/DashboardExpert";
import DashboardUni from "./components/Dashboard/DashboardUni";

// ✅ VUES ADMIN
import DashboardAdminView from "./components/Dashboard/View/Admin/DashboardAdminView";
import UserView from "./components/Dashboard/View/Admin/UserView";
import HomeParam from "./components/Dashboard/View/Admin/HomeParam";
import ServicesParam from "./components/Dashboard/View/Admin/ServicesParam";
import ContactParam from "./components/Dashboard/View/Admin/ContactParam";
import ActualiteParam from "./components/Dashboard/View/Admin/ActualiteParam";
import FaqParam from "./components/Dashboard/View/Admin/FaqParam";
import SystemStatusView from "./components/Dashboard/View/Admin/SystemStatusView";
import MessagesView from "./components/Dashboard/View/Admin/MessagesView";

// ✅ VUES REQUERANT
import DashboardReqView from "./components/Dashboard/View/Requerant/DashboardReqView";
import CreerDemandeView from "./components/Dashboard/View/Requerant/CreerDemandeView";

// ✅ VUE ETABLISSEMENT
import DashboardEtabView from "./components/Dashboard/View/Etab/DashboardEtabView";
import MesInformationsHabilitation from "./components/Dashboard/View/Etab/Habilitation/MesInformationsHabilitation";
import CreerDemandeHabilitation from "./components/Dashboard/View/Etab/Habilitation/CreerDemandeHabilitation";
import RenouvellementHabilitation from "./components/Dashboard/View/Etab/Habilitation/RenouvellementHabilitation";
import AutoEvaluationAccreditation from "./components/Dashboard/View/Etab/Accreditation/AutoEvaluationAccreditation";
import CreerDemandeAccreditation from "./components/Dashboard/View/Etab/Accreditation/CreerDemandeAccreditation";

// ✅ COMPOSANT PROFILE (ACCESSIBLE À TOUS LES RÔLES)
import Profile from "./components/Dashboard/Profile/Profile";

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
              <Route
                path="habilitation/renouvellement"
                element={<RenouvellementHabilitation />}
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
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="" replace />} />
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
