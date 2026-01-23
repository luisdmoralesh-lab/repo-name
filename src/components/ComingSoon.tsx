"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const LAUNCH_DATE = new Date("2026-02-14T00:00:00-04:00"); // Bolivia timezone (GMT-4)

export default function ComingSoon() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = LAUNCH_DATE.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  async function handleRequestAccess(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { error: insertError } = await supabase
      .from("access_requests")
      .insert({
        business_name: formData.businessName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });

    if (insertError) {
      setError("Error al enviar solicitud. Por favor intenta de nuevo.");
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Logo/Title */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-4">
            Masajes Bolivia
          </h1>
          <p className="text-xl sm:text-2xl text-purple-100 mb-2">
            Encuentra masajistas profesionales cerca de ti
          </p>
        </div>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium mb-12">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          Próximamente
        </div>

        {/* Countdown */}
        <div className="grid grid-cols-4 gap-4 sm:gap-8 mb-12 max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
              {timeLeft.days}
            </div>
            <div className="text-purple-200 text-sm sm:text-base">Días</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
              {timeLeft.hours}
            </div>
            <div className="text-purple-200 text-sm sm:text-base">Horas</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
              {timeLeft.minutes}
            </div>
            <div className="text-purple-200 text-sm sm:text-base">Minutos</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
              {timeLeft.seconds}
            </div>
            <div className="text-purple-200 text-sm sm:text-base">Segundos</div>
          </div>
        </div>

        {/* Launch Date */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-12">
          <p className="text-purple-200 text-lg mb-2">Fecha de lanzamiento</p>
          <p className="text-3xl sm:text-4xl font-bold text-white">
            14 de Febrero, 2026
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12 text-white">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Busca fácilmente</h3>
            <p className="text-sm text-purple-200">Encuentra masajistas cerca de ti</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Publica gratis</h3>
            <p className="text-sm text-purple-200">Comparte tus servicios sin costo</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">100% Seguro</h3>
            <p className="text-sm text-purple-200">Plataforma confiable y verificada</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
          <h3 className="text-2xl font-bold text-white mb-3">
            ¡No te quedes fuera!
          </h3>
          <p className="text-purple-200 mb-6">
            Solicita acceso anticipado o si ya tienes un código, regístrate ahora.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowRequestForm(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Solicitar Acceso
            </button>
            <Link
              href="/acceso-temprano"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Tengo un Código
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-purple-200 text-sm">
          <p>© 2026 Masajes Bolivia. Todos los derechos reservados.</p>
        </div>
      </div>

      {/* Request Access Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => {
                setShowRequestForm(false);
                setSubmitted(false);
                setError(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {!submitted ? (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Solicitar Acceso Anticipado
                </h3>
                <p className="text-gray-600 mb-6">
                  Completa el formulario y te enviaremos un código de acceso.
                </p>

                <form onSubmit={handleRequestAccess} className="space-y-4">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del negocio *
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      required
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="Ej: Spa Relajante"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu@email.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono (opcional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+591 70012345"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      ¿Por qué quieres acceso? (opcional)
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Cuéntanos sobre tu negocio..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    {loading ? "Enviando..." : "Solicitar Acceso"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  ¡Solicitud Enviada!
                </h3>
                <p className="text-gray-600 mb-6">
                  Te contactaremos pronto con tu código de acceso. Revisa tu email.
                </p>
                <button
                  onClick={() => {
                    setShowRequestForm(false);
                    setSubmitted(false);
                    setFormData({ businessName: "", email: "", phone: "", message: "" });
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
