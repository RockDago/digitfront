import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { AuthService } from "../../services";

const MAX_BCRYPT_LENGTH = 72;

function roleToPath(role) {
  const normalizedRole = String(role).trim().toLowerCase();

  switch (normalizedRole) {
    case "etablissement":
    case "établissement":
      return "/dashboard/institut";
    case "requerant":
    case "requérant":
      return "/dashboard/requerant";
    case "sae":
      return "/dashboard/sae";
    case "sicp":
      return "/dashboard/sicp";
    case "admin":
    case "administrateur":
      return "/dashboard/admin";
    case "cnh":
      return "/dashboard/cnh";
    case "expert":
      return "/dashboard/expert";
    case "universite":
    case "université":
      return "/dashboard/universite";
    default:
      return "/";
  }
}

const Login = ({ isModal = false, onClose = null }) => {
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showGoogleRoleModal, setShowGoogleRoleModal] = useState(false);
  const [pendingGoogleCredential, setPendingGoogleCredential] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");

  const [showEmailSuggestionsLogin, setShowEmailSuggestionsLogin] =
    useState(false);
  const [emailSuggestionsLogin, setEmailSuggestionsLogin] = useState([]);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    username: "",
    password: "",
    confirmation: "",
    role: "",
  });

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [activeRoles, setActiveRoles] = useState([]);
  const [errors, setErrors] = useState({});

  const emailDomains = [
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com",
    "yahoo.fr",
    "icloud.com",
    "protonmail.com",
    "mail.com",
    "aol.com",
    "zoho.com",
  ];

  const roleOptions = [
    {
      value: "Requerant",
      label: "Requérant",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      description: "Particulier ou demandeur",
    },
    {
      value: "Etablissement",
      label: "Établissement",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      description: "Organisation ou entreprise",
    },
  ];

  useEffect(() => {
    setActiveRoles(roleOptions);
  }, []);

  const triggerToast = (message, type = "info") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const triggerForgotPasswordToast = () => {
    if (isModal && onClose) onClose();
    navigate("/forgot-password");
  };

  // ✅ Fonction pour obtenir le token reCAPTCHA
  const getRecaptchaToken = useCallback(
    async (action) => {
      if (!executeRecaptcha) {
        console.log("reCAPTCHA not loaded yet");
        return null;
      }

      try {
        const token = await executeRecaptcha(action);
        return token;
      } catch (error) {
        console.error("Erreur reCAPTCHA:", error);
        triggerToast("Erreur de vérification reCAPTCHA", "error");
        return null;
      }
    },
    [executeRecaptcha]
  );

  // ✅ Authentification Google OAuth avec reCAPTCHA
  const performGoogleAuth = async (credentialToken, role = null) => {
    setLoading(true);

    try {
      const recaptchaToken = await getRecaptchaToken("google_auth");

      if (!recaptchaToken) {
        throw new Error("Vérification reCAPTCHA échouée");
      }

      const result = await AuthService.googleAuth({
        token: credentialToken,
        role: role,
        recaptchaToken: recaptchaToken,
      });

      const user = result.user || result;

      if (!user || !user.email) {
        throw new Error("Données utilisateur manquantes");
      }

      const message = role
        ? `Compte Google créé en tant que ${role} !`
        : "Connexion Google réussie !";
      triggerToast(message, "success");

      const targetPath = roleToPath(user.role);
      setTimeout(() => {
        if (isModal && onClose) onClose();
        navigate(targetPath, { replace: true });
      }, 1000);
    } catch (err) {
      console.error("Erreur Google Auth:", err);
      let errorMsg = "Erreur lors de la connexion Google";

      if (err.response?.data) {
        const data = err.response.data;
        errorMsg = data.detail || data.message || errorMsg;
      } else if (err.message) {
        errorMsg = err.message;
      }

      triggerToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log("Google credential reçu:", credentialResponse);

    if (!isLogin && !form.role) {
      setPendingGoogleCredential(credentialResponse.credential);
      setShowGoogleRoleModal(true);
      return;
    }

    performGoogleAuth(
      credentialResponse.credential,
      isLogin ? null : form.role
    );
  };

  const handleGoogleError = (error) => {
    console.error("Erreur Google:", error);
    triggerToast("Erreur lors de la connexion Google", "error");
  };

  // ✅ CORRECTION : Fonction confirmGoogleRole simplifiée
  const confirmGoogleRole = (role) => {
    setShowGoogleRoleModal(false);

    if (pendingGoogleCredential) {
      // Cas 1: Un credential Google est déjà reçu
      performGoogleAuth(pendingGoogleCredential, role);
      setPendingGoogleCredential(null);
    } else {
      // Cas 2: Pas encore de credential, sauvegarder le rôle et déclencher Google
      setForm((prev) => ({ ...prev, role: role }));

      // ✅ Délai pour laisser le state se mettre à jour
      setTimeout(() => {
        const googleButton = document.querySelector(
          '[role="button"][aria-labelledby]'
        );
        if (googleButton) {
          googleButton.click();
        }
      }, 300);
    }
  };

  // ✅ CORRECTION : Fonction handleGoogleButtonClick optimisée
  const handleGoogleButtonClick = () => {
    if (!isLogin && !form.role) {
      setShowGoogleRoleModal(true);
      return; // ✅ Arrêter ici, ne pas déclencher le bouton Google
    }

    const googleButton = document.querySelector(
      '[role="button"][aria-labelledby]'
    );
    if (googleButton) {
      googleButton.click();
    }
  };

  const passwordCriteria = {
    minLength: { regex: /.{8,}/, label: "8+ caractères" },
    uppercase: { regex: /[A-Z]/, label: "Majuscule" },
    lowercase: { regex: /[a-z]/, label: "Minuscule" },
    digit: { regex: /\d/, label: "Chiffre" },
    validSymbols: {
      regex: /[~!?@#$%^&*_\-+()\[\]{}<>\/\\|"'.,:;]/,
      label: "Symbole",
      required: true,
    },
  };

  const validatePasswordCriteria = (password) => ({
    minLength: passwordCriteria.minLength.regex.test(password),
    uppercase: passwordCriteria.uppercase.regex.test(password),
    lowercase: passwordCriteria.lowercase.regex.test(password),
    digit: passwordCriteria.digit.regex.test(password),
    validSymbols: passwordCriteria.validSymbols.regex.test(password),
  });

  const allPasswordCriteriaMet = (password) => {
    const criteria = validatePasswordCriteria(password);
    return Object.values(criteria).every((val) => val === true);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    const valueWithoutSpaces = value.replace(/\s/g, "");
    setForm((prev) => ({ ...prev, [name]: valueWithoutSpaces }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']*$/;
    if (nameRegex.test(value)) {
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, email: value }));
    setErrors((prev) => ({ ...prev, email: "", general: "" }));

    if (value.includes("@")) {
      const parts = value.split("@");
      const username = parts[0];
      const domain = parts[1] || "";
      if (username && domain.length >= 0) {
        const filtered = emailDomains
          .filter((d) => d.toLowerCase().startsWith(domain.toLowerCase()))
          .slice(0, 10)
          .map((d) => `${username}@${d}`);
        setEmailSuggestions(filtered);
        setShowEmailSuggestions(filtered.length > 0);
      } else {
        setShowEmailSuggestions(false);
      }
    } else {
      setShowEmailSuggestions(false);
    }
  };

  const selectEmailSuggestion = (suggestion) => {
    setForm((prev) => ({ ...prev, email: suggestion }));
    setShowEmailSuggestions(false);
  };

  const handleLoginIdentifierChange = (e) => {
    const value = e.target.value;
    setLoginIdentifier(value);
    setErrors((prev) => ({ ...prev, general: "" }));

    if (value.includes("@")) {
      const parts = value.split("@");
      const username = parts[0];
      const domain = parts[1] || "";
      if (username && domain.length >= 0) {
        const filtered = emailDomains
          .filter((d) => d.toLowerCase().startsWith(domain.toLowerCase()))
          .slice(0, 10)
          .map((d) => `${username}@${d}`);
        setEmailSuggestionsLogin(filtered);
        setShowEmailSuggestionsLogin(filtered.length > 0);
      } else {
        setShowEmailSuggestionsLogin(false);
      }
    } else {
      setShowEmailSuggestionsLogin(false);
    }
  };

  const selectEmailSuggestionLogin = (suggestion) => {
    setLoginIdentifier(suggestion);
    setShowEmailSuggestionsLogin(false);
  };

  const handleRoleSelect = (value) => {
    setForm((prev) => ({ ...prev, role: value }));
    setErrors((prev) => ({ ...prev, role: "" }));
    setShowRoleDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password" || name === "confirmation") handlePasswordChange(e);
    else if (name === "nom" || name === "prenom") handleNameChange(e);
    else if (name === "email") handleEmailChange(e);
    else {
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    }
  };

  const canHaveUsername = () =>
    form.role === "Requerant" || form.role === "Etablissement";

  const validateForm = () => {
    const newErrors = {};
    if (!form.nom.trim()) newErrors.nom = "Requis";
    else if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(form.nom.trim()))
      newErrors.nom = "Lettres uniq.";
    if (!form.prenom.trim()) newErrors.prenom = "Requis";
    else if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(form.prenom.trim()))
      newErrors.prenom = "Lettres uniq.";
    if (!form.email.trim()) newErrors.email = "Requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalide";

    if (!form.role) newErrors.role = "Veuillez sélectionner un rôle";
    if (canHaveUsername() && !form.username.trim())
      newErrors.username = "Requis";
    if (!form.password.trim()) newErrors.password = "Requis";
    else if (!allPasswordCriteriaMet(form.password))
      newErrors.password = "Faible";
    if (!form.confirmation.trim()) newErrors.confirmation = "Requis";
    else if (form.password !== form.confirmation)
      newErrors.confirmation = "Différent";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    setErrors({});

    if (!loginIdentifier.trim() || !form.password.trim()) {
      const msg = "Veuillez remplir tous les champs";
      setErrors({ general: msg });
      triggerToast(msg, "error");
      setLoading(false);
      return;
    }

    const recaptchaToken = await getRecaptchaToken("login");

    if (!recaptchaToken) {
      setErrors({ general: "Vérification reCAPTCHA échouée" });
      setLoading(false);
      return;
    }

    const passwordToSend = form.password.slice(0, MAX_BCRYPT_LENGTH);

    try {
      const result = await AuthService.login({
        email: loginIdentifier,
        password: passwordToSend,
        recaptchaToken: recaptchaToken,
      });

      if (!result || result.error || result.detail) {
        throw new Error(result?.error || result?.detail || "Erreur inconnue");
      }

      const user = result.user || result;

      if (!user || !user.email) {
        throw new Error("Données utilisateur manquantes");
      }

      localStorage.setItem("user", JSON.stringify(user));

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("userEmail", loginIdentifier);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("userEmail");
      }

      triggerToast("Connexion réussie ! Redirection...", "success");

      const targetPath = roleToPath(user.role);

      setTimeout(() => {
        if (isModal && onClose) onClose();
        navigate(targetPath, { replace: true });
      }, 1000);
    } catch (err) {
      console.error("Erreur complète:", err);

      let errorMsg = "Une erreur est survenue";

      if (err.response?.data) {
        const data = err.response.data;
        const status = err.response.status;

        if (typeof data.detail === "string") {
          errorMsg = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMsg = data.detail
            .map((e) => `${e.loc?.join(".")}: ${e.msg}`)
            .join(", ");
        } else if (data.message) {
          errorMsg = data.message;
        } else if (status === 401 || status === 400) {
          errorMsg = "Email ou mot de passe incorrect";
        } else if (status === 404) {
          errorMsg = "Utilisateur introuvable";
        } else if (status >= 500) {
          errorMsg = "Erreur serveur, veuillez réessayer";
        }
      } else if (err.request) {
        errorMsg =
          "Impossible de contacter le serveur. Vérifiez que votre backend tourne.";
      } else if (err.message) {
        errorMsg = err.message;
      }

      const finalErrorMsg = String(errorMsg);
      setErrors({ general: finalErrorMsg });
      triggerToast(finalErrorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    setErrors({});

    if (!validateForm()) {
      triggerToast("Veuillez corriger les erreurs du formulaire", "error");
      setLoading(false);
      return;
    }

    const recaptchaToken = await getRecaptchaToken("register");

    if (!recaptchaToken) {
      setErrors({ general: "Vérification reCAPTCHA échouée" });
      setLoading(false);
      return;
    }

    const passwordToSend = form.password.slice(0, MAX_BCRYPT_LENGTH);

    try {
      const result = await AuthService.register({
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        password: passwordToSend,
        role: form.role,
        recaptchaToken: recaptchaToken,
        ...(canHaveUsername() && { username: form.username }),
      });

      const user = result.user || result;

      if (!user || !user.email) {
        throw new Error("Données utilisateur manquantes");
      }

      localStorage.setItem("user", JSON.stringify(user));

      triggerToast("Compte créé avec succès ! Redirection...", "success");

      const targetPath = roleToPath(user.role);

      setTimeout(() => {
        if (isModal && onClose) onClose();
        navigate(targetPath, { replace: true });
      }, 1000);
    } catch (err) {
      console.error("Erreur complète:", err);

      let errorMsg = "Une erreur est survenue lors de l'inscription";
      const newErrors = {};

      if (err.response?.data) {
        const data = err.response.data;
        const status = err.response.status;

        if (status === 400) {
          errorMsg = "Cet email est déjà utilisé";
        } else if (status === 422 && Array.isArray(data.detail)) {
          data.detail.forEach((error) => {
            const field = error.loc?.[1];
            const message = error.msg;

            if (field) {
              newErrors[field] = message;
            }
          });
          errorMsg = "Veuillez corriger les champs invalides";
        } else if (typeof data.detail === "string") {
          errorMsg = data.detail;
        } else if (data.message) {
          errorMsg = data.message;
        } else if (status >= 500) {
          errorMsg = "Erreur serveur, veuillez réessayer";
        }
      } else if (err.request) {
        errorMsg = "Impossible de contacter le serveur";
      } else if (err.message) {
        errorMsg = err.message;
      }

      const finalErrorMsg = String(errorMsg);
      setErrors({ ...newErrors, general: finalErrorMsg });
      triggerToast(finalErrorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLogin) {
      handleLoginSubmit(e);
    } else {
      handleRegisterSubmit(e);
    }
  };

  const passwordValidation = validatePasswordCriteria(form.password);
  const isPasswordValid = allPasswordCriteriaMet(form.password);
  const passwordsMatch =
    form.password === form.confirmation && form.confirmation !== "";
  const passwordsDontMatch =
    form.password !== form.confirmation && form.confirmation !== "";
  const showPasswordCriteria =
    form.password.length > 0 && !isLogin && !isPasswordValid;

  const selectedRole = roleOptions.find((opt) => opt.value === form.role);

  return (
    <div
      className={
        isModal
          ? "relative flex items-center justify-center bg-transparent"
          : "min-h-screen flex items-center justify-center bg-white sm:bg-gradient-to-br sm:from-blue-50 sm:to-indigo-100 sm:p-4"
      }
    >
      {/* ✅ MODALE SELECTION ROLE GOOGLE - CORRIGÉE */}
      {showGoogleRoleModal && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-white/95 backdrop-blur-sm p-4 rounded-2xl animate-fade-in-up">
          <div className="w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 text-center mb-6">
              Choisissez votre rôle
            </h3>
            <div className="space-y-3">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => confirmGoogleRole(option.value)}
                  className="w-full flex items-center p-3 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group bg-white"
                >
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 mr-3">
                    <svg
                      className="w-5 h-5 text-gray-600 group-hover:text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={option.icon}
                      />
                    </svg>
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-bold text-sm text-gray-900">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {option.description}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600" />
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setShowGoogleRoleModal(false);
                setPendingGoogleCredential(null);
              }}
              className="mt-6 w-full text-center text-sm text-gray-500 hover:text-gray-800"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
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
                ? "✓ Succès"
                : toastType === "error"
                ? "✗ Erreur"
                : "ℹ Info"}
            </p>
            <p className="text-xs text-gray-600 leading-tight">
              {toastMessage}
            </p>
          </div>
        </div>
      </div>

      {/* CONTENEUR PRINCIPAL */}
      <div
        className={
          isModal
            ? `relative bg-white w-full ${
                !isLogin ? "max-w-2xl" : "max-w-md"
              } rounded-2xl shadow-xl flex flex-col overflow-hidden animate-fade-in-up transition-all duration-300`
            : `relative bg-white w-full ${
                !isLogin ? "max-w-2xl" : "max-w-md"
              } rounded-2xl shadow-xl animate-fade-in-up mx-auto flex flex-col my-4 transition-all duration-300`
        }
      >
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Fermer"
          >
            <X size={20} />
          </button>
        )}

        {/* Header */}
        <div
          className={`px-8 pt-8 pb-4 text-center ${!isLogin ? "mb-0" : "mb-2"}`}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4 shadow-md shadow-blue-500/30">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isLogin ? "Connexion" : "Créer un compte"}
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">
            {isLogin ? "Bon retour parmi nous" : "Commencez votre aventure"}
          </p>
        </div>

        {/* Formulaire */}
        <div className="flex-1 px-8 pb-8">
          {errors.general && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs font-medium text-center animate-shake flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom/Prénom - INSCRIPTION uniquement */}
            {!isLogin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    className="block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="nom"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                  >
                    Nom
                  </label>
                  {errors.nom && (
                    <p className="text-[10px] text-red-500 absolute -bottom-4 right-0">
                      {errors.nom}
                    </p>
                  )}
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={form.prenom}
                    onChange={handleChange}
                    className="block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="prenom"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                  >
                    Prénom
                  </label>
                  {errors.prenom && (
                    <p className="text-[10px] text-red-500 absolute -bottom-4 right-0">
                      {errors.prenom}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* EMAIL avec suggestions (LOGIN et REGISTER) */}
            <div
              className={`grid ${
                !isLogin && canHaveUsername()
                  ? "grid-cols-1 sm:grid-cols-2 gap-4"
                  : "grid-cols-1"
              }`}
            >
              <div className="relative group">
                <input
                  type="text"
                  id="email_login"
                  name={isLogin ? "loginIdentifier" : "email"}
                  value={isLogin ? loginIdentifier : form.email}
                  onChange={
                    isLogin ? handleLoginIdentifierChange : handleChange
                  }
                  onBlur={() => {
                    setTimeout(() => {
                      setShowEmailSuggestions(false);
                      setShowEmailSuggestionsLogin(false);
                    }, 200);
                  }}
                  onFocus={() => {
                    if (
                      isLogin &&
                      loginIdentifier.includes("@") &&
                      emailSuggestionsLogin.length > 0
                    ) {
                      setShowEmailSuggestionsLogin(true);
                    } else if (
                      !isLogin &&
                      form.email.includes("@") &&
                      emailSuggestions.length > 0
                    ) {
                      setShowEmailSuggestions(true);
                    }
                  }}
                  className="block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="email_login"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  {isLogin ? "Email ou Nom d'utilisateur" : "Adresse email"}
                </label>
                {!isLogin && errors.email && (
                  <p className="text-[10px] text-red-500 absolute -bottom-4 right-0">
                    {errors.email}
                  </p>
                )}

                {/* Suggestions LOGIN */}
                {isLogin &&
                  showEmailSuggestionsLogin &&
                  emailSuggestionsLogin.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {emailSuggestionsLogin.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectEmailSuggestionLogin(suggestion)}
                          className="w-full px-4 py-2 text-left text-xs hover:bg-blue-50 transition-colors block text-gray-700"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                {/* Suggestions REGISTER */}
                {!isLogin &&
                  showEmailSuggestions &&
                  emailSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {emailSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectEmailSuggestion(suggestion)}
                          className="w-full px-4 py-2 text-left text-xs hover:bg-blue-50 transition-colors block text-gray-700"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
              </div>

              {!isLogin && canHaveUsername() && (
                <div className="relative group">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="username"
                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                  >
                    Nom d'utilisateur
                  </label>
                  {errors.username && (
                    <p className="text-[10px] text-red-500 absolute -bottom-4 right-0">
                      {errors.username}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Mot de passe + Confirmation */}
            <div
              className={`grid ${
                !isLogin ? "grid-cols-1 sm:grid-cols-2 gap-4" : "grid-cols-1"
              }`}
            >
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="password"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {!isLogin && (
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmation"
                    name="confirmation"
                    value={form.confirmation}
                    onChange={handleChange}
                    disabled={!isPasswordValid}
                    className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 peer ${
                      !isPasswordValid
                        ? "bg-gray-100 cursor-not-allowed border-gray-200"
                        : passwordsDontMatch
                        ? "border-red-400 focus:ring-red-300"
                        : passwordsMatch
                        ? "border-emerald-400 focus:ring-emerald-300"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="confirmation"
                    className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 ${
                      !isPasswordValid
                        ? "text-gray-400"
                        : "text-gray-500 peer-focus:text-blue-600"
                    }`}
                  >
                    Confirmer{" "}
                    {!isPasswordValid && "(Complétez le mot de passe d'abord)"}
                  </label>
                  {isPasswordValid && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                      tabIndex="-1"
                    >
                      {showConfirmPassword ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                  {form.confirmation && isPasswordValid && (
                    <p
                      className={`text-[10px] mt-1 font-medium absolute -bottom-4 left-0 ${
                        passwordsMatch ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {passwordsMatch ? "✓ OK" : "✗ Différent"}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Critères de mot de passe */}
            {showPasswordCriteria && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                {[
                  { key: "minLength", label: "8+ caractères" },
                  { key: "uppercase", label: "Majuscule" },
                  { key: "lowercase", label: "Minuscule" },
                  { key: "digit", label: "Chiffre" },
                  { key: "validSymbols", label: "Symbole" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center text-[10px]">
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        passwordValidation[key]
                          ? "bg-emerald-500"
                          : "bg-gray-300"
                      }`}
                    ></span>
                    <span
                      className={`${
                        passwordValidation[key]
                          ? "text-emerald-600 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Sélection du rôle (inscription uniquement) */}
            {!isLogin && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                  Rôle
                </label>
                <button
                  type="button"
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.role
                      ? "border-red-500 bg-red-50 text-red-900"
                      : "border-gray-300 bg-white text-gray-900 hover:border-blue-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {selectedRole ? (
                      <>
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={selectedRole.icon}
                          />
                        </svg>
                        <div className="text-left">
                          <p className="font-semibold">{selectedRole.label}</p>
                          <p className="text-xs text-gray-500">
                            {selectedRole.description}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <div className="text-left">
                          <p className="font-medium text-gray-400">
                            Sélectionnez votre rôle
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                      showRoleDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {errors.role && (
                  <p className="text-[10px] text-red-500 absolute -bottom-4 right-0">
                    {errors.role}
                  </p>
                )}

                {showRoleDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowRoleDropdown(false)}
                    ></div>
                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl animate-dropdown">
                      {(activeRoles.length > 0 ? activeRoles : roleOptions).map(
                        (option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleRoleSelect(option.value)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                              form.role === option.value
                                ? "bg-blue-50 border-l-4 border-blue-600"
                                : "hover:bg-gray-50 border-l-4 border-transparent"
                            }`}
                          >
                            <svg
                              className={`w-5 h-5 ${
                                form.role === option.value
                                  ? "text-blue-600"
                                  : "text-gray-400"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={option.icon}
                              />
                            </svg>
                            <div className="flex-1">
                              <p
                                className={`text-sm font-semibold ${
                                  form.role === option.value
                                    ? "text-blue-900"
                                    : "text-gray-900"
                                }`}
                              >
                                {option.label}
                              </p>
                              <p className="text-xs text-gray-500">
                                {option.description}
                              </p>
                            </div>
                            {form.role === option.value && (
                              <svg
                                className="w-4 h-4 text-blue-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </button>
                        )
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Remember me / Forgot password */}
            {isLogin && (
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
                    Rester connecté
                  </span>
                </label>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  onClick={triggerForgotPasswordToast}
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition duration-200 font-bold shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] text-sm flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Chargement...</span>
                </>
              ) : (
                <span>{isLogin ? "Se connecter" : "S'inscrire"}</span>
              )}
            </button>
          </form>

          {/* SÉPARATEUR */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px w-full bg-gray-200"></div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">
              Ou avec
            </span>
            <div className="h-px w-full bg-gray-200"></div>
          </div>

          {/* ✅ GOOGLE OAuth - Bouton personnalisé en français */}
          <div className="w-full">
            <button
              type="button"
              onClick={handleGoogleButtonClick}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold py-3 rounded-xl transition-all duration-200 shadow-sm active:scale-[0.99] disabled:opacity-50"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-sm font-medium">
                {isLogin
                  ? "Se connecter avec Google"
                  : "S'inscrire avec Google"}
              </span>
            </button>

            {/* Bouton Google caché */}
            <div className="hidden">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap={false}
              />
            </div>
          </div>

          {/* FOOTER SWITCH */}
          <div className="mt-4 pt-2 text-center">
            <p className="text-xs text-gray-500">
              {isLogin ? "Pas de compte ?" : "Déjà inscrit ?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  if (!isLogin) setForm((prev) => ({ ...prev, username: "" }));
                  setErrors({});
                }}
                className="text-blue-600 hover:text-blue-700 font-bold transition-colors ml-1"
              >
                {isLogin ? "Créer un compte" : "Se connecter"}
              </button>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-3px);
          }
          40%,
          80% {
            transform: translateX(3px);
          }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Login;
