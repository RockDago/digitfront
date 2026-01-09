import React, { useState, useEffect, useRef } from "react";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const [code, setCode] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  // Simulation de l'email depuis l'état de navigation
  const email = "exemple@email.com";

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newCode = [...code];
    newCode[index] = element.value;
    setCode(newCode);

    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Vérification automatique quand les 6 chiffres sont saisis
    if (element.value !== "" && index === 5) {
      const fullCode = [...newCode];
      fullCode[index] = element.value;
      if (fullCode.every(digit => digit !== "")) {
        setTimeout(() => handleVerify(), 300);
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const verificationCode = code.join("");
    if (verificationCode.length < 6) {
      triggerToast("Veuillez entrer le code complet à 6 chiffres.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setVerified(true);
      triggerToast("Code validé ! Bienvenue sur DAAQ.");
      setLoading(false);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    }, 2000);
  };

  const handleResendEmail = () => {
    if (!canResend) return;
    setResending(true);
    setTimeout(() => {
      triggerToast("Un nouveau code a été envoyé.");
      setResending(false);
      setCanResend(false);
      setTimer(60);
    }, 1500);
  };

  const handleBackToLogin = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    let interval;
    if (!canResend && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [canResend, timer]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      {/* Toast Notification */}
      <div
        className={`fixed top-5 right-5 z-50 transition-all duration-300 ${
          showToast ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="bg-white rounded-lg shadow-lg p-3 w-72 flex items-start border-l-4 border-blue-500">
          <div className="flex-shrink-0">
            <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-2 flex-1">
            <p className="text-xs font-semibold text-gray-900">Succès</p>
            <p className="mt-0.5 text-xs text-gray-600">{toastMessage}</p>
          </div>
          <button onClick={() => setShowToast(false)} className="ml-3 text-gray-400 hover:text-gray-600">
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mb-4 shadow-lg shadow-blue-500/30">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {verified ? "Email vérifié !" : "Vérifiez votre email"}
          </h1>
          <p className="text-sm text-gray-500">
            {verified
              ? "Votre compte a été activé avec succès"
              : `Entrez le code à 6 chiffres envoyé à ${email}`}
          </p>
        </div>

        {!verified ? (
          <div className="space-y-5">
            {/* Code Input */}
            <div className="flex justify-center gap-2">
              {code.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-14 text-center text-2xl font-bold text-blue-600 bg-slate-50 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Vérification...</span>
                </div>
              ) : (
                "Vérifier le code"
              )}
            </button>

            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">Vous n'avez pas reçu de code ?</p>
              <button
                onClick={handleResendEmail}
                disabled={resending || !canResend}
                className={`text-sm font-medium transition-colors ${
                  canResend
                    ? "text-blue-600 hover:text-blue-700"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                {resending
                  ? "Envoi en cours..."
                  : canResend
                  ? "Renvoyer le code"
                  : `Renvoyer dans ${timer}s`}
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200 text-center">
              <button
                onClick={handleBackToLogin}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour à la connexion
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-center py-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-4">Redirection en cours...</p>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;