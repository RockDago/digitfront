import React, { useEffect, useMemo, useState, useContext, useCallback } from "react";
import { 
  Search, UserPlus, Eye, Trash2, Power, X, Edit3, RefreshCw, 
  ShieldAlert, User as UserIcon, Calendar, Phone, 
  MapPin, ChevronLeft, ChevronRight, AlertCircle, EyeOff,
  Users, UserCheck, UserX
} from "lucide-react";
import UserService from "../../../../services/user.service";
import { ThemeContext } from "../../../../context/ThemeContext";

// ── Configuration ─────────────────────────────────────────────────────────────
const PER_PAGE_OPTIONS = [10, 20, 30, 40, 50, 100];

const ROLES = [
  "Admin", "Requerant", "Etablissement", "SAE", "SICP", 
  "Universite", "Expert", "CNH", "gestionnaire_habilitation"
];

const ROLE_LABELS = {
  Admin: "Administrateur",
  Requerant: "Requérant",
  Etablissement: "Établissement",
  SAE: "Service SAE",
  SICP: "Service SICP",
  CNH: "Service CNH",
  Expert: "Expert Évaluateur",
  Universite: "Université",
  gestionnaire_habilitation: "Gestionnaire Habilitation",
};

const formatRole = (role) => {
  if (!role) return "";
  if (ROLE_LABELS[role]) return ROLE_LABELS[role];
  return role.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim().replace(/\b\w/g, (c) => c.toUpperCase());
};

const STATUS_CARDS = [
  { key: "total", label: "Total", Icon: Users, color: "#3b82f6", bg: "rgba(59,130,246,0.10)", border: "rgba(59,130,246,0.25)" },
  { key: "actifs", label: "Actifs", Icon: UserCheck, color: "#22c55e", bg: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.25)" },
  { key: "inactifs", label: "Inactifs", Icon: UserX, color: "#ef4444", bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.25)" },
];

const EMAIL_DOMAINS = [
  "gmail.com", "outlook.com", "hotmail.com", "yahoo.com", 
  "yahoo.fr", "icloud.com", "protonmail.com", "mail.com", 
  "aol.com", "zoho.com"
];

const PWD_CRITERIA = [
  { key: "minLength",    regex: /.{8,}/,                                          label: "8 caractères" },
  { key: "uppercase",    regex: /[A-Z]/,                                           label: "Majuscule"    },
  { key: "lowercase",    regex: /[a-z]/,                                           label: "Minuscule"    },
  { key: "digit",        regex: /\d/,                                              label: "Chiffre"      },
  { key: "validSymbols", regex: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,           label: "Symbole"      },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const safeStr = (v) => (v == null ? "" : String(v));
const initials = (n, p) => `${safeStr(n).trim().charAt(0)}${safeStr(p).trim().charAt(0)}`.toUpperCase();

const checkPwd = (pwd) => Object.fromEntries(PWD_CRITERIA.map(({ key, regex }) => [key, regex.test(pwd)]));
const isValidPwd = (pwd) => PWD_CRITERIA.every(({ regex }) => regex.test(pwd));

// ── Badges ───────────────────────────────────────────────────────────────────
const TONES = {
  gray:   "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
  blue:   "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300",
  green:  "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300",
  red:    "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300",
  orange: "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300",
};

const Pill = ({ children, tone = "gray" }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${TONES[tone]}`}>
    {children}
  </span>
);

const RoleBadge = ({ role }) => {
  const colorMap = {
    Admin: "blue",
    Requerant: "green",
    Etablissement: "orange",
    SAE: "blue",
    SICP: "blue",
    CNH: "blue",
    Expert: "purple",
    Universite: "indigo",
    gestionnaire_habilitation: "red",
  };
  const tone = colorMap[role] || "gray";
  return <Pill tone={tone}>{formatRole(role)}</Pill>;
};

const StatusBadge = ({ isActive }) => (
  <Pill tone={isActive ? "green" : "gray"}>{isActive ? "Actif" : "Inactif"}</Pill>
);

// ── Floating Label Input ──────────────────────────────────────────────────────
const FloatInput = ({ id, label, value, onChange, type = "text", error, disabled, className = "", suffix }) => (
  <div className="relative group">
    <input 
      id={id} 
      type={type} 
      value={value} 
      onChange={onChange} 
      disabled={disabled}
      placeholder=" " 
      required
      className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 dark:text-gray-100 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
      } ${disabled ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed" : ""} ${className}`}
    />
    <label 
      htmlFor={id} 
      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
    >
      {label}
    </label>
    {suffix}
    {error && <p className="text-[10px] text-red-500 absolute -bottom-4 right-0">{error}</p>}
  </div>
);

// ── Floating Label Select ─────────────────────────────────────────────────────
const FloatSelect = ({ id, label, value, onChange, options }) => (
  <div className="relative group">
    <select 
      id={id} 
      value={value} 
      onChange={onChange}
      className="block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
    >
      {options.map((r) => <option key={r} value={r}>{formatRole(r)}</option>)}
    </select>
    <label 
      htmlFor={id} 
      className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-blue-600 left-1"
    >
      {label}
    </label>
  </div>
);

// ── Email Input with Suggestions ─────────────────────────────────────────────
const EmailInput = ({ id, value, onChange, error }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(false);

  const handleChange = (e) => {
    const v = e.target.value;
    onChange(v);
    if (v.includes("@")) {
      const [user, dom = ""] = v.split("@");
      if (user) {
        const filtered = dom.length === 0
          ? EMAIL_DOMAINS.map((d) => `${user}@${d}`)
          : EMAIL_DOMAINS.filter((d) => d.toLowerCase().startsWith(dom.toLowerCase())).map((d) => `${user}@${d}`);
        setSuggestions(filtered);
        setShow(filtered.length > 0);
      } else setShow(false);
    } else setShow(false);
  };

  return (
    <div className="relative group">
      <FloatInput 
        id={id} 
        label="Adresse email *" 
        value={value} 
        type="text" 
        error={error}
        onChange={(e) => handleChange(e)}
        onBlur={() => setTimeout(() => setShow(false), 200)}
        onFocus={() => { if (value.includes("@") && suggestions.length > 0) setShow(true); }}
      />
      {show && (
        <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((s, i) => (
            <button 
              key={i} 
              type="button" 
              onClick={() => { onChange(s); setShow(false); }}
              className="w-full px-4 py-2 text-left text-xs hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Password Criteria ─────────────────────────────────────────────────────────
const PwdCriteria = ({ pwd }) => {
  const v = checkPwd(pwd);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-600">
      {PWD_CRITERIA.map(({ key, label }) => (
        <div key={key} className="flex items-center text-[10px]">
          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${v[key] ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-500"}`} />
          <span className={v[key] ? "text-emerald-600 font-medium" : "text-gray-500 dark:text-gray-400"}>{label}</span>
        </div>
      ))}
    </div>
  );
};

// ── Password Field with show/hide ─────────────────────────────────────────────
const PwdField = ({ id, label, value, onChange, error, disabled, matchStatus }) => {
  const [show, setShow] = useState(false);
  return (
    <FloatInput 
      id={id} 
      label={label} 
      value={value} 
      type={show ? "text" : "password"}
      onChange={onChange} 
      error={error} 
      disabled={disabled}
      className={matchStatus === "ok" ? "border-emerald-400" : matchStatus === "err" ? "border-red-400" : ""}
      suffix={
        !disabled && (
          <button 
            type="button" 
            tabIndex={-1} 
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 focus:outline-none"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )
      }
    />
  );
};

// ── ModalShell ────────────────────────────────────────────────────────────────
const ModalShell = ({ title, icon: Icon, onClose, children, footer }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Icon size={16} />
            </div>
          )}
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
        <button 
          onClick={onClose} 
          className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-5 max-h-[70vh] overflow-y-auto text-gray-900 dark:text-gray-100">{children}</div>
      {footer && (
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70 flex justify-end gap-2">
          {footer}
        </div>
      )}
    </div>
  </div>
);

const BtnCancel = ({ onClick }) => (
  <button 
    type="button" 
    onClick={onClick} 
    className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-semibold"
  >
    Annuler
  </button>
);

const BtnPrimary = ({ onClick, children, gradient = "from-blue-600 to-indigo-600" }) => (
  <button 
    type="button" 
    onClick={onClick} 
    className={`px-4 py-2 rounded-xl bg-gradient-to-r ${gradient} text-white text-xs font-semibold shadow-md hover:brightness-110`}
  >
    {children}
  </button>
);

// ── ConfirmModal ──────────────────────────────────────────────────────────────
const CONFIRM_COLORS = { 
  blue: "bg-blue-600 hover:bg-blue-700", 
  red: "bg-red-600 hover:bg-red-700", 
  orange: "bg-orange-600 hover:bg-orange-700", 
  green: "bg-green-600 hover:bg-green-700" 
};

const ConfirmModal = ({ title, message, icon: Icon, onConfirm, onClose, confirmText = "Confirmer", confirmColor = "blue" }) => (
  <ModalShell 
    title={title} 
    icon={Icon || AlertCircle} 
    onClose={onClose}
    footer={
      <>
        <BtnCancel onClick={onClose} />
        <button 
          onClick={onConfirm} 
          className={`px-4 py-2 rounded-xl text-white text-xs font-semibold ${CONFIRM_COLORS[confirmColor]}`}
        >
          {confirmText}
        </button>
      </>
    }
  >
    <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
  </ModalShell>
);

// ── UserDetailModal ───────────────────────────────────────────────────────────
const DetailField = ({ icon: Icon, label, value }) => (
  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
    <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
      <Icon size={12} /> {label}
    </div>
    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{value || "-"}</div>
  </div>
);

const UserDetailModal = ({ user, onClose }) => !user ? null : (
  <ModalShell title="Détail Utilisateur" icon={Eye} onClose={onClose}>
    <div className="flex items-center gap-4 mb-6">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
        {initials(user.nom, user.prenom)}
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{safeStr(user.nom)} {safeStr(user.prenom)}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{safeStr(user.email)}</p>
        <div className="flex gap-2 mt-2">
          <RoleBadge role={user.role} />
          <StatusBadge isActive={user.isactive} />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <DetailField icon={UserIcon} label="Username"    value={user.username} />
      <DetailField icon={Phone}    label="Téléphone"   value={user.telephone || user.contact} />
      <DetailField icon={MapPin}   label="Code Postal" value={user.codepostal} />
      <DetailField icon={Calendar} label="Créé le"     value={user.created_at ? new Date(user.created_at).toLocaleDateString() : null} />
    </div>
  </ModalShell>
);

// ── Shared Password Block ─────────────────────────────────────────────────────
const PasswordBlock = ({ pwd, setPwd, confirm, setConfirm }) => {
  const valid   = isValidPwd(pwd);
  const match   = pwd === confirm && confirm !== "";
  const noMatch = pwd !== confirm && confirm !== "";
  return (
    <div className="space-y-4">
      <PwdField id="f-pwd" label="Mot de passe *" value={pwd} onChange={(e) => setPwd(e.target.value)} />
      {pwd.length > 0 && !valid && <PwdCriteria pwd={pwd} />}
      <div>
        <PwdField 
          id="f-confirm" 
          label={`Confirmer${!valid ? " (Complétez le mot de passe d'abord)" : ""}`}
          value={confirm} 
          onChange={(e) => setConfirm(e.target.value)}
          disabled={!valid} 
          matchStatus={match ? "ok" : noMatch ? "err" : null}
        />
        {confirm && valid && (
          <p className={`text-[10px] mt-1 font-medium ${match ? "text-emerald-600" : "text-red-500"}`}>
            {match ? "✓ OK" : "✗ Différent"}
          </p>
        )}
      </div>
    </div>
  );
};

// ── AddUserModal ──────────────────────────────────────────────────────────────
const AddUserModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({ 
    nom: "", prenom: "", username: "", email: "", 
    password: "", confirmation: "", role: "Requerant" 
  });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: typeof e === "string" ? e : e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.nom.trim())          e.nom          = "Requis";
    if (!form.prenom.trim())       e.prenom       = "Requis";
    if (!form.email.trim())        e.email        = "Requis";
    if (!form.username.trim())     e.username     = "Requis";
    if (!isValidPwd(form.password)) e.password    = "Mot de passe faible";
    if (form.password !== form.confirmation) e.confirmation = "Différent";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = () => { if (validate()) onCreate({ ...form, isactive: true }); };

  return (
    <ModalShell 
      title="Nouvel utilisateur" 
      icon={UserPlus} 
      onClose={onClose}
      footer={
        <>
          <BtnCancel onClick={onClose} />
          <BtnPrimary onClick={handleSubmit}>Créer le compte</BtnPrimary>
        </>
      }
    >
      {errors.general && (
        <div className="mb-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2">
          <AlertCircle size={14} />{errors.general}
        </div>
      )}
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FloatInput id="nom"    label="Nom *"    value={form.nom}    onChange={set("nom")}    error={errors.nom} />
          <FloatInput id="prenom" label="Prénom *" value={form.prenom} onChange={set("prenom")} error={errors.prenom} />
        </div>
        <EmailInput id="email" value={form.email} onChange={set("email")} error={errors.email} />
        <FloatInput id="username" label="Nom d'utilisateur *" value={form.username} onChange={set("username")} error={errors.username} />
        <FloatSelect id="role" label="Rôle" value={form.role} onChange={set("role")} options={ROLES} />
        <PasswordBlock pwd={form.password} setPwd={set("password")} confirm={form.confirmation} setConfirm={set("confirmation")} />
      </form>
    </ModalShell>
  );
};

// ── EditUserModal ─────────────────────────────────────────────────────────────
const EditUserModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({ 
    nom: user.nom, prenom: user.prenom, username: user.username, 
    email: user.email, role: user.role, isactive: user.isactive 
  });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: typeof e === "string" ? e : e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.nom.trim())      e.nom      = "Requis";
    if (!form.prenom.trim())   e.prenom   = "Requis";
    if (!form.email.trim())    e.email    = "Requis";
    if (!form.username.trim()) e.username = "Requis";
    setErrors(e);
    return !Object.keys(e).length;
  };

  return (
    <ModalShell 
      title="Modifier utilisateur" 
      icon={Edit3} 
      onClose={onClose}
      footer={
        <>
          <BtnCancel onClick={onClose} />
          <BtnPrimary onClick={() => { if (validate()) onSave(form); }}>Enregistrer</BtnPrimary>
        </>
      }
    >
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FloatInput id="e-nom"    label="Nom *"    value={form.nom}    onChange={set("nom")}    error={errors.nom} />
          <FloatInput id="e-prenom" label="Prénom *" value={form.prenom} onChange={set("prenom")} error={errors.prenom} />
        </div>
        <EmailInput id="e-email" value={form.email} onChange={set("email")} error={errors.email} />
        <FloatInput id="e-username" label="Nom d'utilisateur *" value={form.username} onChange={set("username")} error={errors.username} />
        <FloatSelect id="e-role" label="Rôle" value={form.role} onChange={set("role")} options={ROLES} />
      </form>
    </ModalShell>
  );
};

// ── ResetPasswordModal ────────────────────────────────────────────────────────
const ResetPasswordModal = ({ user, onClose, onConfirm }) => {
  const [pwd, setPwd]         = useState("");
  const [confirm, setConfirm] = useState("");


  const handleConfirm = () => {
    const e = {};
    if (!isValidPwd(pwd))      return; // Simple return if invalid, PasswordBlock shows feedback
    if (pwd !== confirm)       return;
    onConfirm(pwd);
  };

  return (
    <ModalShell 
      title="Réinitialiser le mot de passe" 
      icon={RefreshCw} 
      onClose={onClose}
      footer={
        <>
          <BtnCancel onClick={onClose} />
          <BtnPrimary onClick={handleConfirm} gradient="from-orange-600 to-red-600">Confirmer</BtnPrimary>
        </>
      }
    >
      <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 p-3 rounded-lg mb-4 flex gap-2">
        <ShieldAlert size={16} className="text-orange-600 dark:text-orange-400 mt-0.5" />
        <p className="text-xs text-orange-800 dark:text-orange-300">
          Ceci écrasera le mot de passe actuel de <strong>{user.email}</strong>.
        </p>
      </div>
      <PasswordBlock pwd={pwd} setPwd={setPwd} confirm={confirm} setConfirm={setConfirm} />
    </ModalShell>
  );
};

// ── MAIN VIEW ─────────────────────────────────────────────────────────────────
export default function UserView() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  // États
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [toast, setToast] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [resetUser, setResetUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [confirmToggle, setConfirmToggle] = useState(null);

  // Couleurs dynamiques selon le thème
  const borderC = isDark ? "#334155" : "#e2e8f0";
  const headerBg = isDark ? "#0f172a" : "#f8fafc";
  const headerC = isDark ? "#64748b" : "#94a3b8";
  const textC = isDark ? "#e2e8f0" : "#334155";
  const subC = isDark ? "#475569" : "#94a3b8";
  const bgCard = isDark ? "#1e293b" : "#ffffff";
  const rowHover = isDark ? "rgba(59,130,246,0.06)" : "#f8faff";

  const triggerToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Statistiques
  const stats = useMemo(() => ({
    total: users.length,
    actifs: users.filter((u) => u.isactive).length,
    inactifs: users.filter((u) => !u.isactive).length,
  }), [users]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await UserService.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      triggerToast("Erreur chargement", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  // Filtrage
  const filteredUsers = useMemo(() => {
    let list = [...users];
    if (roleFilter !== "Tous") list = list.filter((u) => u.role === roleFilter);
    if (statusFilter === "Actif") list = list.filter((u) => u.isactive);
    if (statusFilter === "Inactif") list = list.filter((u) => !u.isactive);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter((u) =>
        [u.nom, u.prenom, u.email, u.username].some((v) => safeStr(v).toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) =>
      `${safeStr(a.nom)} ${safeStr(a.prenom)}`.toLowerCase()
        .localeCompare(`${safeStr(b.nom)} ${safeStr(b.prenom)}`.toLowerCase())
    );
  }, [users, roleFilter, statusFilter, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginatedUsers = useMemo(() => 
    filteredUsers.slice((currentPage - 1) * perPage, currentPage * perPage), 
    [filteredUsers, currentPage, perPage]
  );

  useEffect(() => { setCurrentPage(1); }, [roleFilter, statusFilter, searchTerm, perPage]);

  const startItem = filteredUsers.length === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, filteredUsers.length);

  // Pagination numbers
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }, [totalPages, currentPage]);

  // API calls
  const apiCall = async (fn, successMsg, closeCallback) => {
    try {
      await fn();
      closeCallback();
      triggerToast(successMsg, "success");
      loadUsers();
    } catch (e) {
      triggerToast(e.response?.data?.detail || "Erreur", "error");
    }
  };

  const handleCreate = (data) => apiCall(() => UserService.create(data), "Utilisateur créé", () => setShowCreate(false));
  const handleEdit = (data) => apiCall(() => UserService.update(editUser.id, data), "Utilisateur modifié", () => setEditUser(null));
  const handleReset = (pwd) => apiCall(() => UserService.resetPassword(resetUser.id, pwd), "Mot de passe réinitialisé", () => setResetUser(null));
  const handleDelete = () => apiCall(() => UserService.delete(deleteUser.id), "Utilisateur supprimé", () => setDeleteUser(null));
  const toggleStatus = () => apiCall(
    () => UserService.update(confirmToggle.id, { isactive: !confirmToggle.isactive }),
    `Compte ${confirmToggle.isactive ? "désactivé" : "activé"}`,
    () => setConfirmToggle(null)
  );


  const hasFilter = searchTerm || roleFilter !== "Tous" || statusFilter !== "Tous";

  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("Tous");
    setStatusFilter("Tous");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", borderBottom: "2px solid #3b82f6", animation: "spin 0.8s linear infinite" }} />
          <span style={{ fontSize: 13, color: subC }}>Chargement des utilisateurs...</span>
        </div>
      </div>
    );
  }

  const toastBorder = toast?.type === "success" ? "border-emerald-500" : toast?.type === "error" ? "border-red-500" : "border-blue-500";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 p-4 sm:p-6 lg:p-8">
      
      {/* Toast */}
      <div className={`fixed top-4 right-4 z-[100] transition-all duration-300 ${toast ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}>
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 w-72 flex items-start border-l-4 ${toastBorder}`}>
          <div className="flex-1 ml-2">
            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
              {toast?.type === "success" ? "Succès" : toast?.type === "error" ? "Erreur" : "Info"}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">{toast?.message}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">

        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight" style={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
              Gestion des utilisateurs
            </h1>
            <p className="text-xs mt-0.5" style={{ color: subC }}>{stats.total} utilisateurs au total</p>
          </div>
          <button 
            onClick={() => setShowCreate(true)} 
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 12,
              border: `1px solid ${borderC}`,
              background: bgCard,
              color: textC,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            <UserPlus size={16} /> Ajouter un utilisateur
          </button>
        </div>

        {/* ── Cartes de statistiques ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {STATUS_CARDS.map(({ key, label, Icon, color, bg, border }) => (
            <div 
              key={key}
              onClick={() => {
                if (key === "actifs") setStatusFilter(statusFilter === "Actif" ? "Tous" : "Actif");
                if (key === "inactifs") setStatusFilter(statusFilter === "Inactif" ? "Tous" : "Inactif");
                if (key === "total") resetFilters();
                setCurrentPage(1);
              }}
              style={{
                background: bgCard,
                border: (key === "actifs" && statusFilter === "Actif") || (key === "inactifs" && statusFilter === "Inactif")
                  ? `1.5px solid ${color}`
                  : `1px solid ${borderC}`,
                borderRadius: 14,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                boxShadow: isDark ? "0 1px 4px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.05)",
                cursor: "pointer",
                transition: "all 0.15s",
                outline: (key === "actifs" && statusFilter === "Actif") || (key === "inactifs" && statusFilter === "Inactif")
                  ? `3px solid ${color}22`
                  : "none"
              }}
            >
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: bg,
                border: `1px solid ${border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <Icon style={{ color, fontSize: 16 }} size={16} />
              </div>
              <div>
                <p style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: subC,
                  marginBottom: 2
                }}>
                  {label}
                </p>
                <p style={{
                  fontSize: 24,
                  fontWeight: 900,
                  color,
                  lineHeight: 1
                }}>
                  {stats[key]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tableau principal ── */}
        <div style={{
          background: bgCard,
          border: `1px solid ${borderC}`,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: isDark ? "0 1px 6px rgba(0,0,0,0.4)" : "0 1px 6px rgba(0,0,0,0.06)"
        }}>

          {/* Barre de filtres */}
          <div style={{
            padding: "14px 20px",
            borderBottom: `1px solid ${borderC}`,
            background: isDark ? "#0f172a" : "#f8fafc",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "flex-end"
          }}>

            {/* Recherche */}
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <Search style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
                fontSize: 14,
                size: 14
              }} />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                style={{
                  width: "100%",
                  paddingLeft: 36,
                  paddingRight: searchTerm ? 30 : 12,
                  paddingTop: 8,
                  paddingBottom: 8,
                  borderRadius: 10,
                  border: `1px solid ${borderC}`,
                  background: isDark ? "#1e293b" : "#ffffff",
                  color: textC,
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8"
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filtre Rôle */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: subC, letterSpacing: "0.06em" }}>
                Rôle
              </label>
              <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: `1px solid ${borderC}`,
                  background: isDark ? "#1e293b" : "#ffffff",
                  color: textC,
                  fontSize: 13,
                  outline: "none",
                  minWidth: 160,
                  cursor: "pointer"
                }}
              >
                <option value="Tous">Tous les rôles</option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>{formatRole(role)}</option>
                ))}
              </select>
            </div>

            {/* Filtre Statut */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <label style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: subC, letterSpacing: "0.06em" }}>
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: `1px solid ${borderC}`,
                  background: isDark ? "#1e293b" : "#ffffff",
                  color: textC,
                  fontSize: 13,
                  outline: "none",
                  minWidth: 140,
                  cursor: "pointer"
                }}
              >
                <option value="Tous">Tous les statuts</option>
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
            </div>

            {/* Reset filters */}
            {hasFilter && (
              <button
                onClick={resetFilters}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: `1px solid ${borderC}`,
                  background: isDark ? "#1e293b" : "#ffffff",
                  color: textC,
                  fontSize: 13,
                  cursor: "pointer"
                }}
              >
                <X size={10} /> Réinitialiser
              </button>
            )}
          </div>

          {/* Sélecteur lignes par page */}
          <div style={{
            padding: "10px 20px",
            borderBottom: `1px solid ${borderC}`,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            <span style={{ fontSize: 12, color: subC }}>Afficher</span>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
              style={{
                padding: "3px 8px",
                borderRadius: 7,
                border: `1px solid ${borderC}`,
                background: isDark ? "#0f172a" : "#f8fafc",
                color: textC,
                fontSize: 12,
                outline: "none",
                cursor: "pointer"
              }}
            >
              {PER_PAGE_OPTIONS.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            <span style={{ fontSize: 12, color: subC }}>entrées</span>
          </div>

          {/* Tableau */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
              <thead>
                <tr style={{ background: headerBg, borderBottom: `2px solid ${borderC}` }}>
                  {["Utilisateur", "Rôle", "Statut", "Actions"].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: i === 0 ? "left" : "center",
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        color: headerC,
                        whiteSpace: "nowrap",
                        borderRight: i < 3 ? `1px solid ${borderC}` : "none"
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "60px 20px", textAlign: "center", color: subC }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.5 }}>
                        <Search size={22} />
                        <span style={{ fontSize: 13 }}>Aucun utilisateur trouvé.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: `1px solid ${borderC}`,
                        transition: "background 0.12s",
                        cursor: "default"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = rowHover}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "12px 16px", borderRight: `1px solid ${borderC}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: 12
                          }}>
                            {initials(user.nom, user.prenom)}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: textC }}>
                              {safeStr(user.nom)} {safeStr(user.prenom)}
                            </div>
                            <div style={{ fontSize: 11, color: subC }}>{safeStr(user.email)}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", borderRight: `1px solid ${borderC}`, textAlign: "center" }}>
                        <RoleBadge role={user.role} />
                      </td>
                      <td style={{ padding: "12px 16px", borderRight: `1px solid ${borderC}`, textAlign: "center" }}>
                        <StatusBadge isActive={user.isactive} />
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                          <button
                            onClick={() => setDetailUser(user)}
                            title="Voir"
                            style={{
                              padding: 6,
                              borderRadius: 6,
                              border: "none",
                              background: "transparent",
                              color: "#64748b",
                              cursor: "pointer",
                              transition: "all 0.15s"
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#3b82f610"; e.currentTarget.style.color = "#3b82f6"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => setEditUser(user)}
                            title="Modifier"
                            style={{
                              padding: 6,
                              borderRadius: 6,
                              border: "none",
                              background: "transparent",
                              color: "#64748b",
                              cursor: "pointer",
                              transition: "all 0.15s"
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#6366f110"; e.currentTarget.style.color = "#6366f1"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => setResetUser(user)}
                            title="Réinitialiser mot de passe"
                            style={{
                              padding: 6,
                              borderRadius: 6,
                              border: "none",
                              background: "transparent",
                              color: "#64748b",
                              cursor: "pointer",
                              transition: "all 0.15s"
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#f9731610"; e.currentTarget.style.color = "#f97316"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
                          >
                            <RefreshCw size={16} />
                          </button>
                          <button
                            onClick={() => setConfirmToggle(user)}
                            title={user.isactive ? "Désactiver" : "Activer"}
                            style={{
                              padding: 6,
                              borderRadius: 6,
                              border: "none",
                              background: "transparent",
                              color: user.isactive ? "#f97316" : "#22c55e",
                              cursor: "pointer",
                              transition: "all 0.15s"
                            }}
                          >
                            <Power size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteUser(user)}
                            title="Supprimer"
                            style={{
                              padding: 6,
                              borderRadius: 6,
                              border: "none",
                              background: "transparent",
                              color: "#64748b",
                              cursor: "pointer",
                              transition: "all 0.15s"
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#ef444410"; e.currentTarget.style.color = "#ef4444"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
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

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div style={{
              padding: "14px 20px",
              borderTop: `1px solid ${borderC}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12
            }}>
              <span style={{ fontSize: 12, color: subC }}>
                {filteredUsers.length > 0
                  ? `Affichage de ${startItem} à ${endItem} sur ${filteredUsers.length} utilisateurs`
                  : "Aucun utilisateur"}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: `1px solid ${borderC}`,
                    background: bgCard,
                    color: isDark ? "#94a3b8" : "#64748b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    opacity: currentPage === 1 ? 0.3 : 1
                  }}
                >
                  <ChevronLeft size={16} />
                </button>

                {pageNumbers.map((p, i) =>
                  p === "..." ? (
                    <span key={`e-${i}`} style={{ fontSize: 13, color: subC, padding: "0 4px" }}>…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: `1px solid ${currentPage === p ? "#3b82f6" : borderC}`,
                        background: currentPage === p ? "#3b82f6" : bgCard,
                        color: currentPage === p ? "#fff" : isDark ? "#94a3b8" : "#64748b",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: `1px solid ${borderC}`,
                    background: bgCard,
                    color: isDark ? "#94a3b8" : "#64748b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    opacity: currentPage === totalPages ? 0.3 : 1
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreate && <AddUserModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
      {detailUser && <UserDetailModal user={detailUser} onClose={() => setDetailUser(null)} />}
      {editUser && <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSave={handleEdit} />}
      {resetUser && <ResetPasswordModal user={resetUser} onClose={() => setResetUser(null)} onConfirm={handleReset} />}
      {confirmToggle && (
        <ConfirmModal
          title={confirmToggle.isactive ? "Désactiver le compte" : "Activer le compte"}
          message={`Voulez-vous vraiment ${confirmToggle.isactive ? "désactiver" : "activer"} le compte de ${confirmToggle.nom} ${confirmToggle.prenom} (${confirmToggle.email}) ?`}
          icon={Power}
          confirmText={confirmToggle.isactive ? "Désactiver" : "Activer"}
          confirmColor={confirmToggle.isactive ? "orange" : "green"}
          onConfirm={toggleStatus}
          onClose={() => setConfirmToggle(null)}
        />
      )}
      {deleteUser && (
        <ConfirmModal
          title="Confirmer suppression"
          message={`Voulez-vous vraiment supprimer ${deleteUser.nom} ${deleteUser.prenom} (${deleteUser.email}) ? Cette action est irréversible.`}
          icon={Trash2}
          confirmText="Supprimer"
          confirmColor="red"
          onConfirm={handleDelete}
          onClose={() => setDeleteUser(null)}
        />
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
}