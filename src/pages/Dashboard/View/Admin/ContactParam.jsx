import React, { useState, useEffect, useContext } from "react";
import {
  getContactInfo,
  updateContactInfo,
  validateContactParamForm,
  formatContactParamData,
  parseValidationErrors,
} from "../../../../services/contact.services";
import { toast, ToastContainer } from "react-toastify";
import {
  Plus,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Clock,
  AlertCircle,
  Save,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../../../../context/ThemeContext";

export default function ContactParam() {
  const [formData, setFormData] = useState({
    email: "",
    phones: ["+261 "],
    address: "",
    horaires: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const result = await getContactInfo();

      if (result.success && result.data) {
        const phonesArray =
          result.data.phones && result.data.phones.length > 0
            ? result.data.phones.map((phone) => formatPhoneForDisplay(phone))
            : ["+261 "];

        setFormData({
          email: result.data.email || "",
          phones: phonesArray,
          address: result.data.address || "",
          horaires: result.data.horaires || "",
        });
        setValidationErrors({});
      } else {
        setFormData({
          email: "",
          phones: ["+261 "],
          address: "",
          horaires: "",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération:", error);
      toast.error("Erreur lors du chargement des informations");
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneForDisplay = (phone) => {
    if (!phone) return "+261 ";

    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("261")) {
      const localNumber = cleaned.substring(3);
      if (localNumber.length === 0) return "+261 ";
      if (localNumber.length <= 2) return `+261 ${localNumber}`;
      if (localNumber.length <= 4)
        return `+261 ${localNumber.substring(0, 2)} ${localNumber.substring(2)}`;
      if (localNumber.length <= 7)
        return `+261 ${localNumber.substring(0, 2)} ${localNumber.substring(2, 4)} ${localNumber.substring(4)}`;
      return `+261 ${localNumber.substring(0, 2)} ${localNumber.substring(2, 4)} ${localNumber.substring(4, 7)} ${localNumber.substring(7, 9)}`;
    }

    return "+261 ";
  };

  const formatPhoneForSubmit = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("261") && cleaned.length === 12) {
      return `+${cleaned}`;
    }
    return phone;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePhoneChange = (index, value) => {
    if (!value.startsWith("+261 ")) return;

    const digits = value.replace(/\D/g, "").substring(3);

    if (digits.length > 9) return;

    let formatted = "+261 ";
    if (digits.length > 0) formatted += digits.substring(0, 2);
    if (digits.length > 2) formatted += " " + digits.substring(2, 4);
    if (digits.length > 4) formatted += " " + digits.substring(4, 7);
    if (digits.length > 7) formatted += " " + digits.substring(7, 9);

    const newPhones = [...formData.phones];
    newPhones[index] = formatted;
    setFormData((prev) => ({ ...prev, phones: newPhones }));

    if (validationErrors.phones) {
      setValidationErrors((prev) => ({ ...prev, phones: "" }));
    }
  };

  const addPhoneField = () => {
    if (formData.phones.length < 3) {
      setFormData((prev) => ({
        ...prev,
        phones: [...prev.phones, "+261 "],
      }));
      toast.info("Nouveau champ téléphone ajouté");
    } else {
      toast.warning("Maximum 3 numéros de téléphone autorisés");
    }
  };

  const removePhoneField = (index) => {
    if (formData.phones.length > 1) {
      const newPhones = formData.phones.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, phones: newPhones }));
      toast.info("Numéro de téléphone supprimé");
    } else {
      toast.warning("Au moins un numéro de téléphone est requis");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedPhones = formData.phones
      .map((phone) => formatPhoneForSubmit(phone))
      .filter((phone) => {
        const digits = phone.replace(/\D/g, "");
        return digits.length === 12 && digits.startsWith("261");
      });

    if (cleanedPhones.length === 0) {
      toast.error(
        "Au moins un numéro de téléphone valide est requis (9 chiffres)",
      );
      setValidationErrors({ phones: "Au moins un numéro valide requis" });
      return;
    }

    const dataToValidate = {
      email: formData.email,
      phones: cleanedPhones,
      address: formData.address,
      horaires: formData.horaires,
    };

    const validation = validateContactParamForm(dataToValidate);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      toast.error("Veuillez corriger les erreurs avant de continuer");
      return;
    }

    setSaving(true);
    setValidationErrors({});

    try {
      const dataToSend = formatContactParamData(dataToValidate);
      const result = await updateContactInfo(dataToSend);

      if (result.success) {
        toast.success("Informations mises à jour avec succès");
        await fetchContactInfo();
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error("Erreur détaillée:", error);

      if (error?.status === 422 || error?.response?.status === 422) {
        const errorData = error.response?.data || error;
        const errors = parseValidationErrors(errorData);

        if (errors.general) {
          toast.error(errors.general);
        } else if (Object.keys(errors).length > 0) {
          setValidationErrors(errors);
          toast.error("Erreurs de validation. Vérifiez les champs.");
        } else {
          toast.error("Erreur de validation des données");
        }
      } else {
        toast.error("Erreur lors de la mise à jour des informations");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === "dark" ? "dark" : "light"}
      />

      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Coordonnées de Contact
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Gérez les informations de contact affichées publiquement sur le site
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Bloc Coordonnées principales */}
          <div
            className="
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            rounded-2xl shadow-sm p-6 sm:p-7
          "
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Coordonnées principales
            </h2>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adresse email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@exemple.com"
                required
                className={`
                  w-full px-4 py-3 text-base
                  border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
                  bg-white dark:bg-gray-800
                  border-gray-300 dark:border-gray-600
                  text-gray-900 dark:text-gray-100
                  placeholder-gray-400 dark:placeholder-gray-500
                  ${validationErrors.email ? "border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-950/30" : ""}
                `}
              />
              {validationErrors.email && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Téléphones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Numéros de téléphone <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Format : +261 XX XX XXX XX (9 chiffres). Maximum 3 numéros
              </p>

              {validationErrors.phones && (
                <p className="text-red-600 dark:text-red-400 text-sm mb-4 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  {validationErrors.phones}
                </p>
              )}

              <div className="space-y-3">
                {formData.phones.map((phone, index) => {
                  const digits = phone.replace(/\D/g, "").substring(3);
                  const isComplete = digits.length === 9;

                  return (
                    <div key={index} className="flex gap-3">
                      <div className="relative flex-1">
                        <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) =>
                            handlePhoneChange(index, e.target.value)
                          }
                          placeholder="+261 34 12 345 67"
                          className={`
                            w-full pl-12 pr-14 py-3 text-base font-mono
                            border rounded-xl focus:outline-none focus:ring-2 transition
                            bg-white dark:bg-gray-800
                            border-gray-300 dark:border-gray-600
                            text-gray-900 dark:text-gray-100
                            ${
                              isComplete
                                ? "border-green-400 dark:border-green-600 focus:ring-green-500 bg-green-50 dark:bg-green-950/20"
                                : "focus:ring-blue-500"
                            }
                          `}
                        />
                        {isComplete && (
                          <div className="absolute right-4 top-3.5">
                            <div className="w-5 h-5 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3.5 h-3.5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>

                      {formData.phones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePhoneField(index)}
                          className="
                            p-3 rounded-xl
                            text-red-600 dark:text-red-400
                            hover:bg-red-50 dark:hover:bg-red-900/30
                            border border-gray-200 dark:border-gray-700
                            transition-colors flex-shrink-0
                          "
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  );
                })}

                {formData.phones.length < 3 && (
                  <button
                    type="button"
                    onClick={addPhoneField}
                    className="
                      flex items-center gap-2 px-4 py-3 text-sm
                      text-blue-600 dark:text-blue-400
                      hover:bg-blue-50 dark:hover:bg-blue-900/30
                      border border-blue-200 dark:border-blue-800
                      rounded-xl transition-colors font-medium w-full sm:w-auto
                    "
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un numéro
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bloc Localisation & Horaires */}
          <div
            className="
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            rounded-2xl shadow-sm p-6 sm:p-7
          "
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-5 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              Localisation et horaires
            </h2>

            {/* Adresse */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adresse physique <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Lot XX, Quartier XXX, Ville"
                required
                rows={3}
                className={`
                  w-full px-4 py-3 text-base resize-none
                  border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
                  bg-white dark:bg-gray-800
                  border-gray-300 dark:border-gray-600
                  text-gray-900 dark:text-gray-100
                  placeholder-gray-400 dark:placeholder-gray-500
                  ${validationErrors.address ? "border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-950/30" : ""}
                `}
              />
              {validationErrors.address && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  {validationErrors.address}
                </p>
              )}
            </div>

            {/* Horaires */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Horaires d'ouverture
                <span className="text-gray-400 dark:text-gray-500 text-xs ml-2 font-normal">
                  (optionnel)
                </span>
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                <textarea
                  name="horaires"
                  value={formData.horaires}
                  onChange={handleChange}
                  placeholder="Lundi - Vendredi : 8h00 - 17h00"
                  rows={3}
                  className="
                    w-full pl-12 pr-4 py-3 text-base resize-none
                    border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
                    bg-white dark:bg-gray-800
                    border-gray-300 dark:border-gray-600
                    text-gray-900 dark:text-gray-100
                    placeholder-gray-400 dark:placeholder-gray-500
                  "
                />
              </div>
            </div>
          </div>

          {/* Bouton Enregistrer */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="
                w-full sm:w-auto px-8 py-3.5 text-base
                bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600
                text-white rounded-xl shadow-sm hover:shadow-md
                transition disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2.5 font-semibold
              "
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Enregistrer les modifications</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
