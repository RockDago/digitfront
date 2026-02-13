import React, { useState, useEffect } from "react";
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
      toast.error("Erreur lors du chargement des informations", {
        position: "top-right",
        autoClose: 3000,
      });
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
    if (!value.startsWith("+261 ")) {
      return;
    }

    const digits = value.replace(/\D/g, "").substring(3);

    if (digits.length > 9) {
      return;
    }

    let formatted = "+261 ";
    if (digits.length > 0) {
      formatted += digits.substring(0, 2);
    }
    if (digits.length > 2) {
      formatted += " " + digits.substring(2, 4);
    }
    if (digits.length > 4) {
      formatted += " " + digits.substring(4, 7);
    }
    if (digits.length > 7) {
      formatted += " " + digits.substring(7, 9);
    }

    const newPhones = [...formData.phones];
    newPhones[index] = formatted;
    setFormData((prev) => ({
      ...prev,
      phones: newPhones,
    }));

    if (validationErrors.phones) {
      setValidationErrors((prev) => ({
        ...prev,
        phones: "",
      }));
    }
  };

  const addPhoneField = () => {
    if (formData.phones.length < 3) {
      setFormData((prev) => ({
        ...prev,
        phones: [...prev.phones, "+261 "],
      }));
      toast.info("Nouveau champ de telephone ajoute", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      toast.warning("Maximum 3 numeros de telephone autorises", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const removePhoneField = (index) => {
    if (formData.phones.length > 1) {
      const newPhones = formData.phones.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        phones: newPhones,
      }));
      toast.info("Numero de telephone supprime", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      toast.warning("Au moins un numero de telephone est requis", {
        position: "top-right",
        autoClose: 3000,
      });
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
        "Au moins un numero de telephone valide est requis (9 chiffres)",
        {
          position: "top-right",
          autoClose: 4000,
        },
      );
      setValidationErrors({
        phones: "Au moins un numero de telephone valide est requis",
      });
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
      toast.error("Veuillez corriger les erreurs avant de continuer", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    setSaving(true);
    setValidationErrors({});

    try {
      const dataToSend = formatContactParamData(dataToValidate);
      const result = await updateContactInfo(dataToSend);

      if (result.success) {
        toast.success("Informations mises a jour avec succes", {
          position: "top-right",
          autoClose: 3000,
        });
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
          toast.error(errors.general, {
            position: "top-right",
            autoClose: 4000,
          });
        } else if (Object.keys(errors).length > 0) {
          setValidationErrors(errors);
          toast.error("Erreurs de validation. Veuillez verifier les champs.", {
            position: "top-right",
            autoClose: 4000,
          });
        } else {
          toast.error("Erreur de validation des donnees", {
            position: "top-right",
            autoClose: 4000,
          });
        }
      } else {
        toast.error("Erreur lors de la mise a jour des informations", {
          position: "top-right",
          autoClose: 4000,
        });
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
          <p className="text-gray-600">Chargement...</p>
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
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Coordonnees de Contact
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Gerez les informations de contact affichees publiquement sur le site
          </p>
        </div>

        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm text-blue-900 font-medium">
                Information importante
              </p>
              <p className="text-xs sm:text-sm text-blue-700 mt-1">
                Ces coordonnees seront visibles par tous les visiteurs du site.
                Assurez-vous qu'elles sont a jour.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              Coordonnees principales
            </h2>

            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Adresse email
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@exemple.com"
                required
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.email
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.email && (
                <p className="text-red-600 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Numeros de telephone
                <span className="text-red-500 ml-1">*</span>
              </label>
              <p className="text-xs sm:text-sm text-gray-500 mb-3">
                Format: +261 XX XX XXX XX (9 chiffres). Maximum 3 numeros
              </p>

              {validationErrors.phones && (
                <p className="text-red-600 text-xs sm:text-sm mb-3 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {validationErrors.phones}
                </p>
              )}

              <div className="space-y-2 sm:space-y-3">
                {formData.phones.map((phone, index) => {
                  const digits = phone.replace(/\D/g, "").substring(3);
                  const isComplete = digits.length === 9;

                  return (
                    <div key={index} className="flex gap-2">
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) =>
                            handlePhoneChange(index, e.target.value)
                          }
                          placeholder="+261 34 12 345 67"
                          className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 transition-colors font-mono ${
                            isComplete
                              ? "focus:ring-green-500 border-green-300 bg-green-50"
                              : "focus:ring-blue-500 border-gray-300"
                          }`}
                        />
                        {isComplete && (
                          <div className="absolute right-3 top-2.5 sm:top-3">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
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
                          className="p-2 sm:p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200 flex-shrink-0"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}
                    </div>
                  );
                })}

                {formData.phones.length < 3 && (
                  <button
                    type="button"
                    onClick={addPhoneField}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium border border-blue-200 w-full sm:w-auto"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    Ajouter un numero
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              Localisation et horaires
            </h2>

            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Adresse physique
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Lot XX, Quartier XXX, Ville"
                required
                rows={3}
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                  validationErrors.address
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.address && (
                <p className="text-red-600 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {validationErrors.address}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Horaires d'ouverture
                <span className="text-gray-400 text-xs ml-2 font-normal">
                  (optionnel)
                </span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                <textarea
                  name="horaires"
                  value={formData.horaires}
                  onChange={handleChange}
                  placeholder="Lundi - Vendredi : 8h00 - 17h00"
                  rows={3}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2 sm:pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold shadow-sm text-sm sm:text-base"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    Enregistrer les modifications
                  </span>
                  <span className="sm:hidden">Enregistrer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
