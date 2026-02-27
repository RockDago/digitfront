import React, { useEffect, useMemo, useState, useContext } from "react";
import { Search, UserPlus, Eye, Trash2, Power, X, Edit3, RefreshCw, ChevronDown, ShieldAlert, User as UserIcon, Calendar, Phone, MapPin, ChevronLeft, ChevronRight, AlertCircle, EyeOff } from "lucide-react";
import UserService from "../../../../services/user.service";
import { ThemeContext } from "../../../../context/ThemeContext";

// ── Helpers ──────────────────────────────────────────────────────────────────
const safeStr = (v) => (v == null ? "" : String(v));
const initials = (n, p) => `${safeStr(n).trim().charAt(0)}${safeStr(p).trim().charAt(0)}`.toUpperCase();
const roleLabel = (r) => (r === "gestionnaire_habilitation" ? "Gestionnaire Habilitation" : r);

const ROLES = ["Admin","Requerant","Etablissement","SAE","SICP","Universite","Expert","CNH","gestionnaire_habilitation"];
const EMAIL_DOMAINS = ["gmail.com","outlook.com","hotmail.com","yahoo.com","yahoo.fr","icloud.com","protonmail.com","mail.com","aol.com","zoho.com"];
const PWD_CRITERIA = [
  { key: "minLength",    regex: /.{8,}/,                                          label: "8 caractères" },
  { key: "uppercase",   regex: /[A-Z]/,                                           label: "Majuscule"    },
  { key: "lowercase",   regex: /[a-z]/,                                           label: "Minuscule"    },
  { key: "digit",       regex: /\d/,                                              label: "Chiffre"      },
  { key: "validSymbols",regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,       label: "Symbole"      },
];

const checkPwd  = (pwd) => Object.fromEntries(PWD_CRITERIA.map(({ key, regex }) => [key, regex.test(pwd)]));
const isValidPwd = (pwd) => PWD_CRITERIA.every(({ regex }) => regex.test(pwd));

// ── Pill ─────────────────────────────────────────────────────────────────────
const TONES = {
  gray:   "bg-gray-100   dark:bg-gray-700       text-gray-600   dark:text-gray-300",
  blue:   "bg-blue-50    dark:bg-blue-950/30    text-blue-700   dark:text-blue-300",
  green:  "bg-green-50   dark:bg-green-950/30   text-green-700  dark:text-green-300",
  red:    "bg-red-50     dark:bg-red-950/30     text-red-700    dark:text-red-300",
  orange: "bg-orange-50  dark:bg-orange-950/30  text-orange-700 dark:text-orange-300",
};
const Pill = ({ children, tone = "gray" }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${TONES[tone]}`}>
    {children}
  </span>
);

// ── Floating Label Input ──────────────────────────────────────────────────────
const FloatInput = ({ id, label, value, onChange, type = "text", error, disabled, className = "", suffix }) => (
  <div className="relative group">
    <input id={id} type={type} value={value} onChange={onChange} disabled={disabled}
      placeholder=" " required
      className={`block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 dark:text-gray-100 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"} ${disabled ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed" : ""} ${className}`}
    />
    <label htmlFor={id} className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
      {label}
    </label>
    {suffix}
    {error && <p className="text-[10px] text-red-500 absolute -bottom-4 right-0">{error}</p>}
  </div>
);

// ── Floating Label Select ─────────────────────────────────────────────────────
const FloatSelect = ({ id, label, value, onChange, options }) => (
  <div className="relative group">
    <select id={id} value={value} onChange={onChange}
      className="block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer">
      {options.map((r) => <option key={r} value={r}>{roleLabel(r)}</option>)}
    </select>
    <label htmlFor={id} className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-blue-600 left-1">
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
      <FloatInput id={id} label="Adresse email *" value={value} type="text" error={error}
        onChange={(e) => handleChange(e)}
        onBlur={() => setTimeout(() => setShow(false), 200)}
        onFocus={() => { if (value.includes("@") && suggestions.length > 0) setShow(true); }}
      />
      {show && (
        <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((s, i) => (
            <button key={i} type="button" onClick={() => { onChange(s); setShow(false); }}
              className="w-full px-4 py-2 text-left text-xs hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300">
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
    <FloatInput id={id} label={label} value={value} type={show ? "text" : "password"}
      onChange={onChange} error={error} disabled={disabled}
      className={matchStatus === "ok" ? "border-emerald-400" : matchStatus === "err" ? "border-red-400" : ""}
      suffix={
        !disabled && (
          <button type="button" tabIndex={-1} onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 focus:outline-none">
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
          {Icon && <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center"><Icon size={16} /></div>}
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition">
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
  <button type="button" onClick={onClick} className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-semibold">Annuler</button>
);
const BtnPrimary = ({ onClick, children, gradient = "from-blue-600 to-indigo-600" }) => (
  <button type="button" onClick={onClick} className={`px-4 py-2 rounded-xl bg-gradient-to-r ${gradient} text-white text-xs font-semibold shadow-md hover:brightness-110`}>{children}</button>
);

// ── ConfirmModal ──────────────────────────────────────────────────────────────
const CONFIRM_COLORS = { blue: "bg-blue-600 hover:bg-blue-700", red: "bg-red-600 hover:bg-red-700", orange: "bg-orange-600 hover:bg-orange-700", green: "bg-green-600 hover:bg-green-700" };
const ConfirmModal = ({ title, message, icon: Icon, onConfirm, onClose, confirmText = "Confirmer", confirmColor = "blue" }) => (
  <ModalShell title={title} icon={Icon || AlertCircle} onClose={onClose}
    footer={<><BtnCancel onClick={onClose} /><button onClick={onConfirm} className={`px-4 py-2 rounded-xl text-white text-xs font-semibold ${CONFIRM_COLORS[confirmColor]}`}>{confirmText}</button></>}>
    <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
  </ModalShell>
);

// ── UserDetailModal ───────────────────────────────────────────────────────────
const DetailField = ({ icon: Icon, label, value }) => (
  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
    <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1"><Icon size={12} /> {label}</div>
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
          <Pill tone="blue">{roleLabel(safeStr(user.role))}</Pill>
          <Pill tone={user.isactive ? "green" : "red"}>{user.isactive ? "Actif" : "Inactif"}</Pill>
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
        <PwdField id="f-confirm" label={`Confirmer${!valid ? " (Complétez le mot de passe d'abord)" : ""}`}
          value={confirm} onChange={(e) => setConfirm(e.target.value)}
          disabled={!valid} matchStatus={match ? "ok" : noMatch ? "err" : null}
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
  const [form, setForm] = useState({ nom: "", prenom: "", username: "", email: "", password: "", confirmation: "", role: "Requerant" });
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
    <ModalShell title="Nouvel utilisateur" icon={UserPlus} onClose={onClose}
      footer={<><BtnCancel onClick={onClose} /><BtnPrimary onClick={handleSubmit}>Créer le compte</BtnPrimary></>}>
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
  const [form, setForm] = useState({ nom: user.nom, prenom: user.prenom, username: user.username, email: user.email, role: user.role, isactive: user.isactive });
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
    <ModalShell title="Modifier utilisateur" icon={Edit3} onClose={onClose}
      footer={<><BtnCancel onClick={onClose} /><BtnPrimary onClick={() => { if (validate()) onSave(form); }}>Enregistrer</BtnPrimary></>}>
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
  const [errors, setErrors]   = useState({});

  const handleConfirm = () => {
    const e = {};
    if (!isValidPwd(pwd))      e.pwd     = "Mot de passe faible";
    if (pwd !== confirm)       e.confirm = "Différent";
    setErrors(e);
    if (!Object.keys(e).length) onConfirm(pwd);
  };

  return (
    <ModalShell title="Réinitialiser le mot de passe" icon={RefreshCw} onClose={onClose}
      footer={<><BtnCancel onClick={onClose} /><BtnPrimary onClick={handleConfirm} gradient="from-orange-600 to-red-600">Confirmer</BtnPrimary></>}>
      <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/40 p-3 rounded-lg mb-4 flex gap-2">
        <ShieldAlert size={16} className="text-orange-600 dark:text-orange-400 mt-0.5" />
        <p className="text-xs text-orange-800 dark:text-orange-300">Ceci écrasera le mot de passe actuel de <strong>{user.email}</strong>.</p>
      </div>
      <PasswordBlock pwd={pwd} setPwd={setPwd} confirm={confirm} setConfirm={setConfirm} />
    </ModalShell>
  );
};

// ── MAIN VIEW ─────────────────────────────────────────────────────────────────
export default function UserView() {
  const { theme } = useContext(ThemeContext);
  const [users,         setUsers]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [searchTerm,    setSearchTerm]    = useState("");
  const [roleFilter,    setRoleFilter]    = useState("Tous");
  const [statusFilter,  setStatusFilter]  = useState("Tous");
  const [currentPage,   setCurrentPage]   = useState(1);
  const [itemsPerPage,  setItemsPerPage]  = useState(10);
  const [toast,         setToast]         = useState(null);
  const [showCreate,    setShowCreate]    = useState(false);
  const [detailUser,    setDetailUser]    = useState(null);
  const [editUser,      setEditUser]      = useState(null);
  const [resetUser,     setResetUser]     = useState(null);
  const [deleteUser,    setDeleteUser]    = useState(null);
  const [confirmToggle, setConfirmToggle] = useState(null);

  const triggerToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const recap = useMemo(() => ({
    total:    users.length,
    actifs:   users.filter((u) =>  u.isactive).length,
    inactifs: users.filter((u) => !u.isactive).length,
  }), [users]);

  const loadUsers = async () => {
    setLoading(true);
    try   { setUsers(Array.isArray(await UserService.getAll()) ? await UserService.getAll() : []); }
    catch (e) { console.error(e); triggerToast("Erreur chargement", "error"); }
    finally   { setLoading(false); }
  };
  useEffect(() => { loadUsers(); }, []);

  const filteredUsers = useMemo(() => {
    let list = [...users];
    if (roleFilter !== "Tous")    list = list.filter((u) => u.role === roleFilter);
    if (statusFilter === "Actif") list = list.filter((u) =>  u.isactive);
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

  const totalPages     = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredUsers, currentPage, itemsPerPage]);
  useEffect(() => { setCurrentPage(1); }, [roleFilter, statusFilter, searchTerm, itemsPerPage]);

  const startItem = filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem   = Math.min(currentPage * itemsPerPage, filteredUsers.length);

  const apiCall = async (fn, successMsg, closeCallback) => {
    try   { await fn(); closeCallback(); triggerToast(successMsg, "success"); loadUsers(); }
    catch (e) { triggerToast(e.response?.data?.detail || "Erreur", "error"); }
  };

  const handleCreate = (data) => apiCall(() => UserService.create(data),                            "Utilisateur créé",            () => setShowCreate(false));
  const handleEdit   = (data) => apiCall(() => UserService.update(editUser.id, data),               "Utilisateur modifié",         () => setEditUser(null));
  const handleReset  = (pwd)  => apiCall(() => UserService.resetPassword(resetUser.id, pwd),        "Mot de passe réinitialisé",   () => setResetUser(null));
  const handleDelete = ()     => apiCall(() => UserService.delete(deleteUser.id),                   "Utilisateur supprimé",        () => setDeleteUser(null));
  const toggleStatus = ()     => apiCall(() => UserService.update(confirmToggle.id, { isactive: !confirmToggle.isactive }),
    `Compte ${confirmToggle.isactive ? "désactivé" : "activé"}`, () => setConfirmToggle(null));

  if (loading) return <div className="p-10 text-center text-gray-500 dark:text-gray-400">Chargement...</div>;

  const toastBorder = toast?.type === "success" ? "border-emerald-500" : toast?.type === "error" ? "border-red-500" : "border-blue-500";
  const ALL_ROLES_TABS = ["Tous", ...ROLES];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 p-4 sm:p-6 lg:p-8">

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

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Gérer les utilisateurs</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Créez, modifiez et gérez les comptes de la plateforme</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition">
            <UserPlus size={16} /> Ajouter
          </button>
        </div>

        {/* Recap Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total",    value: recap.total,    color: "text-gray-900 dark:text-gray-100",   header: "text-gray-400 dark:text-gray-500" },
            { label: "Actifs",   value: recap.actifs,   color: "text-green-700 dark:text-green-400",  header: "text-green-600 dark:text-green-400" },
            { label: "Inactifs", value: recap.inactifs, color: "text-orange-600 dark:text-orange-400", header: "text-orange-500 dark:text-orange-400" },
          ].map(({ label, value, color, header }) => (
            <div key={label} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <span className={`text-xs font-bold uppercase tracking-wider ${header}`}>{label}</span>
              <span className={`text-2xl font-bold mt-1 block ${color}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Role Tabs */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-1.5 flex w-full overflow-x-auto gap-1">
          {ALL_ROLES_TABS.map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                roleFilter === r
                  ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}>
              {roleLabel(r)}
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un utilisateur..."
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" />
          </div>
          {[
            { value: statusFilter, onChange: setStatusFilter, options: [["Tous","Tous les statuts"],["Actif","Actif"],["Inactif","Inactif"]] },
            { value: itemsPerPage, onChange: (v) => setItemsPerPage(Number(v)), options: [[10,"10 par page"],[20,"20 par page"],[30,"30 par page"],[100,"100 par page"]] },
          ].map((sel, i) => (
            <div key={i} className="relative w-full sm:w-auto">
              <select value={sel.value} onChange={(e) => sel.onChange(e.target.value)}
                className="appearance-none w-full sm:w-auto pl-4 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-100 outline-none transition cursor-pointer">
                {sel.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {["Utilisateur","Rôle","Statut","Actions"].map((h, i) => (
                    <th key={h} className={`px-6 py-4 ${i > 0 ? "text-center" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {paginatedUsers.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 text-sm">Aucun utilisateur trouvé.</td></tr>
                ) : paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center font-bold text-xs">
                          {initials(user.nom, user.prenom)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{safeStr(user.nom)} {safeStr(user.prenom)}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{safeStr(user.email)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center"><div className="flex justify-center"><Pill tone="blue">{roleLabel(safeStr(user.role))}</Pill></div></td>
                    <td className="px-6 py-3 text-center"><div className="flex justify-center"><Pill tone={user.isactive ? "green" : "gray"}>{user.isactive ? "Actif" : "Inactif"}</Pill></div></td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {[
                          { icon: Eye,       cb: () => setDetailUser(user),    color: "hover:text-blue-600   dark:hover:text-blue-400   hover:bg-blue-50   dark:hover:bg-blue-950/30",   title: "Voir" },
                          { icon: Edit3,     cb: () => setEditUser(user),      color: "hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30", title: "Modifier" },
                          { icon: RefreshCw, cb: () => setResetUser(user),     color: "hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30", title: "Reset mdp" },
                          { icon: Trash2,    cb: () => setDeleteUser(user),    color: "hover:text-red-600    dark:hover:text-red-400    hover:bg-red-50    dark:hover:bg-red-950/30",     title: "Supprimer" },
                        ].map(({ icon: Ic, cb, color, title }) => (
                          <button key={title} onClick={cb} title={title}
                            className={`p-2 rounded-lg text-gray-400 dark:text-gray-500 transition ${color}`}>
                            <Ic size={16} />
                          </button>
                        ))}
                        <button onClick={() => setConfirmToggle(user)} title={user.isactive ? "Désactiver" : "Activer"}
                          className={`p-2 rounded-lg transition ${user.isactive ? "text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30" : "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30"}`}>
                          <Power size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Affichage {startItem}–{endItem} sur {filteredUsers.length} résultat{filteredUsers.length > 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                  <ChevronLeft size={16} />
                </button>
                {[...Array(totalPages)].map((_, idx) => {
                  const n = idx + 1;
                  if (n === 1 || n === totalPages || (n >= currentPage - 1 && n <= currentPage + 1))
                    return <button key={n} onClick={() => setCurrentPage(n)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition ${currentPage === n ? "bg-blue-600 text-white" : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>{n}</button>;
                  if (n === currentPage - 2 || n === currentPage + 2)
                    return <span key={n} className="px-2 text-gray-500 dark:text-gray-400">...</span>;
                  return null;
                })}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreate    && <AddUserModal   onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
      {detailUser    && <UserDetailModal user={detailUser} onClose={() => setDetailUser(null)} />}
      {editUser      && <EditUserModal  user={editUser}   onClose={() => setEditUser(null)}   onSave={handleEdit} />}
      {resetUser     && <ResetPasswordModal user={resetUser} onClose={() => setResetUser(null)} onConfirm={handleReset} />}
      {confirmToggle && (
        <ConfirmModal
          title={confirmToggle.isactive ? "Désactiver le compte" : "Activer le compte"}
          message={`Voulez-vous vraiment ${confirmToggle.isactive ? "désactiver" : "activer"} le compte de ${confirmToggle.nom} ${confirmToggle.prenom} (${confirmToggle.email}) ?`}
          icon={Power} confirmText={confirmToggle.isactive ? "Désactiver" : "Activer"}
          confirmColor={confirmToggle.isactive ? "orange" : "green"}
          onConfirm={toggleStatus} onClose={() => setConfirmToggle(null)} />
      )}
      {deleteUser && (
        <ConfirmModal
          title="Confirmer suppression"
          message={`Voulez-vous vraiment supprimer ${deleteUser.nom} ${deleteUser.prenom} (${deleteUser.email}) ? Cette action est irréversible.`}
          icon={Trash2} confirmText="Supprimer" confirmColor="red"
          onConfirm={handleDelete} onClose={() => setDeleteUser(null)} />
      )}
    </div>
  );
}
