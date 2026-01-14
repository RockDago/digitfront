import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  Eye,
  Trash2,
  Power,
  X,
  Edit3,
  RefreshCw,
  ChevronDown,
  ShieldAlert,
  User as UserIcon,
  Calendar,
  Phone,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  EyeOff,
} from "lucide-react";

import UserService from "../../../../services/user.service";

// ---------------- Helpers ----------------
const safeStr = (v) => (v === null || v === undefined ? "" : String(v));
const initials = (nom, prenom) =>
  `${safeStr(nom).trim().charAt(0)}${safeStr(prenom)
    .trim()
    .charAt(0)}`.toUpperCase();

const Pill = ({ children, tone = "gray" }) => {
  const tones = {
    gray: "bg-gray-100 text-gray-600",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    orange: "bg-orange-50 text-orange-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

// ---------------- Modal Components ----------------
const ModalShell = ({ title, icon: Icon, onClose, children, footer }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    />
    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Icon size={16} />
            </div>
          )}
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-5 max-h-[70vh] overflow-y-auto">{children}</div>
      {footer && (
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
          {footer}
        </div>
      )}
    </div>
  </div>
);

// --- Modal: Confirmation ---
const ConfirmModal = ({
  title,
  message,
  icon: Icon,
  onConfirm,
  onClose,
  confirmText = "Confirmer",
  confirmColor = "blue",
}) => {
  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700",
    red: "bg-red-600 hover:bg-red-700",
    orange: "bg-orange-600 hover:bg-orange-700",
    green: "bg-green-600 hover:bg-green-700",
  };

  return (
    <ModalShell
      title={title}
      icon={Icon || AlertCircle}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-white text-xs font-semibold ${colorClasses[confirmColor]}`}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p className="text-sm text-gray-600">{message}</p>
    </ModalShell>
  );
};

// --- Modal: Détail Utilisateur ---
const UserDetailModal = ({ user, onClose }) => {
  if (!user) return null;
  return (
    <ModalShell title="Détail Utilisateur" icon={Eye} onClose={onClose}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
          {initials(user.nom, user.prenom)}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {safeStr(user.nom)} {safeStr(user.prenom)}
          </h2>
          <p className="text-sm text-gray-500">{safeStr(user.email)}</p>
          <div className="flex gap-2 mt-2">
            <Pill tone="blue">{safeStr(user.role)}</Pill>
            <Pill tone={user.isactive ? "green" : "red"}>
              {user.isactive ? "Actif" : "Inactif"}
            </Pill>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-500 uppercase mb-1">
            <UserIcon size={12} /> Username
          </div>
          <div className="text-sm font-medium text-gray-900">
            {user.username || "-"}
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-500 uppercase mb-1">
            <Phone size={12} /> Téléphone
          </div>
          <div className="text-sm font-medium text-gray-900">
            {user.telephone || user.contact || "-"}
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-500 uppercase mb-1">
            <MapPin size={12} /> Code Postal
          </div>
          <div className="text-sm font-medium text-gray-900">
            {user.codepostal || "-"}
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-500 uppercase mb-1">
            <Calendar size={12} /> Créé le
          </div>
          <div className="text-sm font-medium text-gray-900">
            {user.created_at
              ? new Date(user.created_at).toLocaleDateString()
              : "-"}
          </div>
        </div>
      </div>
    </ModalShell>
  );
};

// ✅ Modal: Création (SUGGESTIONS AFFICHENT TOUT APRÈS @)
const AddUserModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    username: "",
    email: "",
    password: "",
    confirmation: "",
    role: "Requerant",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState([]);

  const roles = [
    "Admin",
    "Requerant",
    "Etablissement",
    "SAE",
    "SICP",
    "Universite",
    "Expert",
    "CNH",
  ];

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

  const passwordCriteria = {
    minLength: { regex: /.{8,}/, label: "8 caractères" },
    uppercase: { regex: /[A-Z]/, label: "Majuscule" },
    lowercase: { regex: /[a-z]/, label: "Minuscule" },
    digit: { regex: /\d/, label: "Chiffre" },
    validSymbols: {
      regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
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

  const passwordValidation = validatePasswordCriteria(form.password);
  const isPasswordValid = allPasswordCriteriaMet(form.password);
  const passwordsMatch =
    form.password === form.confirmation && form.confirmation !== "";
  const passwordsDontMatch =
    form.password !== form.confirmation && form.confirmation !== "";
  const showPasswordCriteria = form.password.length > 0 && !isPasswordValid;

  // ✅ CORRIGÉ : Affiche TOUTES les suggestions après @
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, email: value }));
    setErrors((prev) => ({ ...prev, email: "" }));

    if (value.includes("@")) {
      const parts = value.split("@");
      const username = parts[0];
      const domain = parts[1] || ""; // Vide si juste @ tapé

      if (username) {
        let filtered;

        if (domain.length === 0) {
          // ✅ Si juste @, afficher TOUS les domaines
          filtered = emailDomains.map((d) => `${username}@${d}`);
        } else {
          // ✅ Si @xxx, filtrer par ce qui commence par xxx
          filtered = emailDomains
            .filter((d) => d.toLowerCase().startsWith(domain.toLowerCase()))
            .map((d) => `${username}@${d}`);
        }

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

  const validateForm = () => {
    const newErrors = {};
    if (!form.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!form.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!form.email.trim()) newErrors.email = "L'email est requis";
    if (!form.username.trim()) newErrors.username = "Le username est requis";
    if (!form.password.trim())
      newErrors.password = "Le mot de passe est requis";
    else if (!isPasswordValid) newErrors.password = "Mot de passe faible";
    if (!form.confirmation.trim())
      newErrors.confirmation = "La confirmation est requise";
    else if (form.password !== form.confirmation)
      newErrors.confirmation = "Les mots de passe ne correspondent pas";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onCreate({
        ...form,
        isactive: true,
      });
    }
  };

  return (
    <ModalShell
      title="Nouvel utilisateur"
      icon={UserPlus}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 text-xs font-semibold shadow-md"
          >
            Créer le compte
          </button>
        </>
      }
    >
      {errors.general && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
          <AlertCircle size={14} />
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom & Prénom */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative group">
            <input
              type="text"
              id="nom"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer placeholder ${
                errors.nom ? "border-red-500" : "border-gray-300"
              }`}
              placeholder=" "
              required
            />
            <label
              htmlFor="nom"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
            >
              Nom *
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
              value={form.prenom}
              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
              className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer placeholder ${
                errors.prenom ? "border-red-500" : "border-gray-300"
              }`}
              placeholder=" "
              required
            />
            <label
              htmlFor="prenom"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
            >
              Prénom *
            </label>
            {errors.prenom && (
              <p className="text-[10px] text-red-500 absolute -bottom-4 right-0">
                {errors.prenom}
              </p>
            )}
          </div>
        </div>

        {/* ✅ Email avec suggestions (AFFICHE TOUT APRÈS @) */}
        <div className="relative group">
          <input
            type="text"
            id="email"
            value={form.email}
            onChange={handleEmailChange}
            onBlur={() => {
              setTimeout(() => setShowEmailSuggestions(false), 200);
            }}
            onFocus={() => {
              if (form.email.includes("@") && emailSuggestions.length > 0) {
                setShowEmailSuggestions(true);
              }
            }}
            className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer placeholder ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder=" "
            required
          />
          <label
            htmlFor="email"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            Adresse email *
          </label>
          {errors.email && (
            <p className="text-[10px] text-red-500 absolute -bottom-4 right-0">
              {errors.email}
            </p>
          )}

          {/* ✅ Suggestions email */}
          {showEmailSuggestions && emailSuggestions.length > 0 && (
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

        {/* Username */}
        <div className="relative group">
          <input
            type="text"
            id="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer placeholder ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
            placeholder=" "
            required
          />
          <label
            htmlFor="username"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            Nom d'utilisateur *
          </label>
          {errors.username && (
            <p className="text-[10px] text-red-500 absolute -bottom-4 right-0">
              {errors.username}
            </p>
          )}
        </div>

        {/* Rôle */}
        <div className="relative group">
          <select
            id="role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <label
            htmlFor="role"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 left-1"
          >
            Rôle
          </label>
        </div>

        {/* Mot de passe & Confirmation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer placeholder ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder=" "
              required
            />
            <label
              htmlFor="password"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
            >
              Mot de passe *
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            {errors.password && (
              <p className="text-[10px] text-red-500 absolute -bottom-4 right-0">
                {errors.password}
              </p>
            )}
          </div>

          <div className="relative group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmation"
              value={form.confirmation}
              onChange={(e) =>
                setForm({ ...form, confirmation: e.target.value })
              }
              disabled={!isPasswordValid}
              className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 peer placeholder ${
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
        </div>

        {/* Critères */}
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
                ></span>
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
      </form>
    </ModalShell>
  );
};

// ✅ Modal: Modification (SANS checkbox "Compte actif")
const EditUserModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    nom: user.nom,
    prenom: user.prenom,
    username: user.username,
    email: user.email,
    role: user.role,
    isactive: user.isactive,
  });
  const [errors, setErrors] = useState({});
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState([]);

  const roles = [
    "Admin",
    "Requerant",
    "Etablissement",
    "SAE",
    "SICP",
    "Universite",
    "Expert",
    "CNH",
  ];

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

  // ✅ Suggestions email (AFFICHE TOUT après @)
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, email: value }));
    setErrors((prev) => ({ ...prev, email: "" }));

    if (value.includes("@")) {
      const parts = value.split("@");
      const username = parts[0];
      const domain = parts[1] || ""; // ✅ Vide si juste @ tapé

      if (username) {
        let filtered;

        if (domain.length === 0) {
          // ✅ Si juste @, afficher TOUS les domaines
          filtered = emailDomains.map((d) => `${username}@${d}`);
        } else {
          // ✅ Si @xxx, filtrer par ce qui commence par xxx
          filtered = emailDomains
            .filter((d) => d.toLowerCase().startsWith(domain.toLowerCase()))
            .map((d) => `${username}@${d}`);
        }

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

  const validateForm = () => {
    const newErrors = {};
    if (!form.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!form.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!form.email.trim()) newErrors.email = "L'email est requis";
    if (!form.username.trim()) newErrors.username = "Le username est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(form);
    }
  };

  return (
    <ModalShell
      title="Modifier utilisateur"
      icon={Edit3}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 text-xs font-semibold shadow-md"
          >
            Enregistrer
          </button>
        </>
      }
    >
      <form className="space-y-4">
        {/* Nom & Prénom */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative group">
            <input
              type="text"
              id="edit-nom"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer placeholder ${
                errors.nom ? "border-red-500" : "border-gray-300"
              }`}
              placeholder=" "
              required
            />
            <label
              htmlFor="edit-nom"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
            >
              Nom *
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
              id="edit-prenom"
              value={form.prenom}
              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
              className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer placeholder ${
                errors.prenom ? "border-red-500" : "border-gray-300"
              }`}
              placeholder=" "
              required
            />
            <label
              htmlFor="edit-prenom"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
            >
              Prénom *
            </label>
            {errors.prenom && (
              <p className="text-[10px] text-red-500 absolute -bottom-4 right-0">
                {errors.prenom}
              </p>
            )}
          </div>
        </div>

        {/* Email SANS suggestions */}
        <div className="relative group">
          <input
            type="email"
            id="edit-email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer placeholder ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder=" "
            required
          />
          <label
            htmlFor="edit-email"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            Adresse email *
          </label>
          {errors.email && (
            <p className="text-[10px] text-red-500 absolute -bottom-4 right-0">
              {errors.email}
            </p>
          )}
        </div>

        {/* Username */}
        <div className="relative group">
          <input
            type="text"
            id="edit-username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer placeholder ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
            placeholder=" "
            required
          />
          <label
            htmlFor="edit-username"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            Nom d'utilisateur *
          </label>
          {errors.username && (
            <p className="text-[10px] text-red-500 absolute -bottom-4 right-0">
              {errors.username}
            </p>
          )}
        </div>

        {/* Rôle */}
        <div className="relative group">
          <select
            id="edit-role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <label
            htmlFor="edit-role"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 left-1"
          >
            Rôle
          </label>
        </div>

        {/* ✅ SUPPRIMÉ : Checkbox "Compte actif" */}
      </form>
    </ModalShell>
  );
};

// ✅ Modal: Reset Password (STYLE LOGIN CONFORME AVEC VALIDATION)
const ResetPasswordModal = ({ user, onClose, onConfirm }) => {
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ Critères de mot de passe
  const passwordCriteria = {
    minLength: { regex: /.{8,}/, label: "8 caractères" },
    uppercase: { regex: /[A-Z]/, label: "Majuscule" },
    lowercase: { regex: /[a-z]/, label: "Minuscule" },
    digit: { regex: /\d/, label: "Chiffre" },
    validSymbols: {
      regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
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

  const passwordValidation = validatePasswordCriteria(pass);
  const isPasswordValid = allPasswordCriteriaMet(pass);
  const passwordsMatch = pass === confirmPass && confirmPass !== "";
  const passwordsDontMatch = pass !== confirmPass && confirmPass !== "";
  const showPasswordCriteria = pass.length > 0 && !isPasswordValid;

  const handleConfirm = () => {
    const newErrors = {};

    if (!pass) {
      newErrors.pass = "Le mot de passe est requis";
    } else if (!isPasswordValid) {
      newErrors.pass = "Mot de passe faible";
    }

    if (!confirmPass) {
      newErrors.confirmPass = "Veuillez confirmer le mot de passe";
    } else if (pass !== confirmPass) {
      newErrors.confirmPass = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onConfirm(pass);
    }
  };

  return (
    <ModalShell
      title="Réinitialiser le mot de passe"
      icon={RefreshCw}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-xs font-semibold"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 text-xs font-semibold shadow-md"
          >
            Confirmer
          </button>
        </>
      }
    >
      <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg mb-4 flex gap-2">
        <ShieldAlert size={16} className="text-orange-600 mt-0.5" />
        <p className="text-xs text-orange-800">
          Ceci écrasera le mot de passe actuel de <strong>{user.email}</strong>.
        </p>
      </div>

      <div className="space-y-4">
        {/* Nouveau mot de passe */}
        <div className="relative group">
          <input
            type={showPassword ? "text" : "password"}
            id="reset-password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer placeholder ${
              errors.pass ? "border-red-500" : "border-gray-300"
            }`}
            placeholder=" "
          />
          <label
            htmlFor="reset-password"
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
          >
            Nouveau mot de passe *
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          {errors.pass && (
            <p className="text-[10px] text-red-500 absolute -bottom-4 right-0">
              {errors.pass}
            </p>
          )}
        </div>

        {/* Confirmation */}
        <div className="relative group">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="reset-confirm"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            disabled={!isPasswordValid}
            className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 peer placeholder ${
              !isPasswordValid
                ? "bg-gray-100 cursor-not-allowed border-gray-200"
                : passwordsDontMatch
                ? "border-red-400 focus:ring-red-300"
                : passwordsMatch
                ? "border-emerald-400 focus:ring-emerald-300"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            placeholder=" "
          />
          <label
            htmlFor="reset-confirm"
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
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          {confirmPass && isPasswordValid && (
            <p
              className={`text-[10px] mt-1 font-medium absolute -bottom-4 left-0 ${
                passwordsMatch ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {passwordsMatch ? "✓ OK" : "✗ Différent"}
            </p>
          )}
        </div>

        {/* Critères */}
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
                ></span>
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
      </div>
    </ModalShell>
  );
};

// ================== MAIN VIEW (reste inchangé) ==================
export default function UserView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info");
  const [showCreate, setShowCreate] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [resetUser, setResetUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [confirmToggle, setConfirmToggle] = useState(null);

  const roles = [
    "Tous",
    "Admin",
    "Requerant",
    "Etablissement",
    "SAE",
    "SICP",
    "Universite",
    "Expert",
    "CNH",
  ];

  const triggerToast = (message, type = "info") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const recap = useMemo(
    () => ({
      total: users.length,
      actifs: users.filter((u) => u.isactive).length,
      inactifs: users.filter((u) => !u.isactive).length,
    }),
    [users]
  );

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await UserService.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      triggerToast("Erreur lors du chargement des utilisateurs", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    let list = [...users];
    if (roleFilter !== "Tous") list = list.filter((u) => u.role === roleFilter);
    if (statusFilter === "Actif") list = list.filter((u) => u.isactive);
    if (statusFilter === "Inactif") list = list.filter((u) => !u.isactive);
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(
        (u) =>
          safeStr(u.nom).toLowerCase().includes(lower) ||
          safeStr(u.prenom).toLowerCase().includes(lower) ||
          safeStr(u.email).toLowerCase().includes(lower) ||
          safeStr(u.username).toLowerCase().includes(lower)
      );
    }
    list.sort((a, b) => {
      const nameA = `${safeStr(a.nom)} ${safeStr(a.prenom)}`.toLowerCase();
      const nameB = `${safeStr(b.nom)} ${safeStr(b.prenom)}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
    return list;
  }, [users, roleFilter, statusFilter, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, statusFilter, searchTerm, itemsPerPage]);

  const startItem =
    filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredUsers.length);

  const handleCreate = async (data) => {
    try {
      await UserService.create(data);
      setShowCreate(false);
      triggerToast("Utilisateur créé avec succès", "success");
      loadUsers();
    } catch (e) {
      console.error(e);
      let errorMsg = "Erreur lors de la création";
      if (e.response?.data) {
        const data = e.response.data;
        if (typeof data.detail === "string") {
          errorMsg = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMsg = data.detail
            .map((err) => err.msg || err.message)
            .join(", ");
        }
      }
      triggerToast(errorMsg, "error");
    }
  };

  const handleEdit = async (data) => {
    try {
      await UserService.update(editUser.id, data);
      setEditUser(null);
      triggerToast("Utilisateur modifié avec succès", "success");
      loadUsers();
    } catch (e) {
      console.error(e);
      triggerToast(
        e.response?.data?.detail || "Erreur lors de la modification",
        "error"
      );
    }
  };

  const handleReset = async (newPassword) => {
    try {
      await UserService.resetPassword(resetUser.id, newPassword);
      setResetUser(null);
      triggerToast("Mot de passe réinitialisé avec succès", "success");
    } catch (e) {
      console.error(e);
      triggerToast(
        e.response?.data?.detail || "Erreur lors de la réinitialisation",
        "error"
      );
    }
  };

  const handleDelete = async () => {
    try {
      await UserService.delete(deleteUser.id);
      setDeleteUser(null);
      triggerToast("Utilisateur supprimé avec succès", "success");
      loadUsers();
    } catch (e) {
      console.error(e);
      triggerToast(
        e.response?.data?.detail || "Erreur lors de la suppression",
        "error"
      );
    }
  };

  const toggleActiveStatus = async () => {
    try {
      await UserService.update(confirmToggle.id, {
        isactive: !confirmToggle.isactive,
      });
      const action = confirmToggle.isactive ? "désactivé" : "activé";
      triggerToast(`Compte ${action} avec succès`, "success");
      setConfirmToggle(null);
      loadUsers();
    } catch (e) {
      console.error(e);
      triggerToast(
        e.response?.data?.detail || "Erreur lors du changement de statut",
        "error"
      );
    }
  };

  if (loading)
    return <div className="p-10 text-center text-gray-500">Chargement...</div>;

  return (
    <div className="space-y-6">
      {/* Toast */}
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

      {/* EN-TÊTE */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <Users className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Gérer les utilisateurs
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Créez, modifiez et gérez les comptes de la plateforme
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition"
        >
          <UserPlus size={16} />
          Ajouter
        </button>
      </div>

      {/* CARTES RECAP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Total
          </span>
          <span className="text-2xl font-bold text-gray-900 mt-1">
            {recap.total}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <span className="text-xs font-bold text-green-600 uppercase tracking-wider">
            Actifs
          </span>
          <span className="text-2xl font-bold text-green-700 mt-1">
            {recap.actifs}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
            Inactifs
          </span>
          <span className="text-2xl font-bold text-orange-600 mt-1">
            {recap.inactifs}
          </span>
        </div>
      </div>

      {/* ONGLETS RÔLE */}
      <div className="bg-white border border-gray-100 rounded-2xl p-1.5 flex w-full overflow-x-auto">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              roleFilter === role
                ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* BARRE RECHERCHE + FILTRES */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un utilisateur..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition"
          />
        </div>

        <div className="relative w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none w-full sm:w-auto pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none transition cursor-pointer"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="Actif">Actif</option>
            <option value="Inactif">Inactif</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        <div className="relative w-full sm:w-auto">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="appearance-none w-full sm:w-auto pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none transition cursor-pointer"
          >
            <option value={10}>10 par page</option>
            <option value={20}>20 par page</option>
            <option value={30}>30 par page</option>
            <option value={100}>100 par page</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* LISTE UTILISATEURS */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Utilisateur</th>
                <th className="px-6 py-4 text-center">Rôle</th>
                <th className="px-6 py-4 text-center">Statut</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-gray-500 text-sm"
                  >
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs">
                          {initials(user.nom, user.prenom)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {safeStr(user.nom)} {safeStr(user.prenom)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {safeStr(user.email)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex justify-center">
                        <Pill tone="blue">{safeStr(user.role)}</Pill>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex justify-center">
                        <Pill tone={user.isactive ? "green" : "gray"}>
                          {user.isactive ? "Actif" : "Inactif"}
                        </Pill>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setDetailUser(user)}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Voir détails"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setEditUser(user)}
                          className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="Modifier"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setResetUser(user)}
                          className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition"
                          title="Réinitialiser mot de passe"
                        >
                          <RefreshCw size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmToggle(user)}
                          className={`p-2 rounded-lg transition ${
                            user.isactive
                              ? "text-orange-600 hover:bg-orange-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                          title={user.isactive ? "Désactiver" : "Activer"}
                        >
                          <Power size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteUser(user)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Affichage {startItem}-{endItem} sur {filteredUsers.length}{" "}
              résultat{filteredUsers.length > 1 ? "s" : ""}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={16} />
              </button>

              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return (
                    <span key={pageNum} className="px-2">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {showCreate && (
        <AddUserModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
      {detailUser && (
        <UserDetailModal
          user={detailUser}
          onClose={() => setDetailUser(null)}
        />
      )}
      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSave={handleEdit}
        />
      )}
      {resetUser && (
        <ResetPasswordModal
          user={resetUser}
          onClose={() => setResetUser(null)}
          onConfirm={handleReset}
        />
      )}

      {confirmToggle && (
        <ConfirmModal
          title={
            confirmToggle.isactive
              ? "Désactiver le compte"
              : "Activer le compte"
          }
          message={`Voulez-vous vraiment ${
            confirmToggle.isactive ? "désactiver" : "activer"
          } le compte de ${confirmToggle.nom} ${confirmToggle.prenom} (${
            confirmToggle.email
          }) ?`}
          icon={Power}
          confirmText={confirmToggle.isactive ? "Désactiver" : "Activer"}
          confirmColor={confirmToggle.isactive ? "orange" : "green"}
          onConfirm={toggleActiveStatus}
          onClose={() => setConfirmToggle(null)}
        />
      )}

      {deleteUser && (
        <ConfirmModal
          title="Confirmer suppression"
          message={`Voulez-vous vraiment supprimer l'utilisateur ${deleteUser.nom} ${deleteUser.prenom} (${deleteUser.email}) ? Cette action est irréversible.`}
          icon={Trash2}
          confirmText="Supprimer"
          confirmColor="red"
          onConfirm={handleDelete}
          onClose={() => setDeleteUser(null)}
        />
      )}
    </div>
  );
}
