"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cleanCode, formatCode } from "@/lib/inviteCodes";

export default function EarlyAccessPage() {
  const router = useRouter();
  const [step, setStep] = useState<"code" | "register">("code");
  const [code, setCode] = useState("");
  const [validCode, setValidCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Registration form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registering, setRegistering] = useState(false);

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cleanedCode = cleanCode(code);
    const supabase = createClient();

    // Check if code exists and is valid
    const { data: codeData, error: codeError } = await supabase
      .from("invite_codes")
      .select("*")
      .eq("code", cleanedCode)
      .eq("is_active", true)
      .single();

    if (codeError || !codeData) {
      setError("Código inválido o expirado");
      setLoading(false);
      return;
    }

    // Check if code has uses remaining
    if (codeData.uses_count >= codeData.max_uses) {
      setError("Este código ha alcanzado el límite de usos");
      setLoading(false);
      return;
    }

    // Check if code is expired
    if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
      setError("Este código ha expirado");
      setLoading(false);
      return;
    }

    // Code is valid!
    setValidCode(cleanedCode);
    setStep("register");
    setLoading(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegistering(true);
    setError(null);

    const supabase = createClient();

    // TODO: Re-enable email check once RLS policies are fixed
    // Check if this email already used a code
    // const { data: existingRedemption } = await supabase
    //   .from("code_redemptions")
    //   .select("code")
    //   .eq("email", email)
    //   .single();

    // if (existingRedemption) {
    //   setError("Este email ya usó un código de acceso");
    //   setRegistering(false);
    //   return;
    // }

    // Double-check code is still available (in case someone else just used it)
    const { data: codeCheck } = await supabase
      .from("invite_codes")
      .select("uses_count, max_uses")
      .eq("code", validCode)
      .single();

    if (codeCheck && codeCheck.uses_count >= codeCheck.max_uses) {
      setError("Este código ya fue utilizado por otra persona");
      setRegistering(false);
      return;
    }

    // Create account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setRegistering(false);
      return;
    }

    if (!authData.user) {
      setError("Error al crear cuenta");
      setRegistering(false);
      return;
    }

    // Get code ID for redemption
    const { data: codeData } = await supabase
      .from("invite_codes")
      .select("id")
      .eq("code", validCode)
      .single();

    // Record code redemption
    const { error: redemptionError } = await supabase
      .from("code_redemptions")
      .insert({
        invite_code_id: codeData?.id || null,
        code: validCode,
        user_id: authData.user.id,
        email: email,
      });

    if (redemptionError) {
      console.error("Error recording redemption:", redemptionError);
      // Don't fail the registration, the trigger will handle it
    }

    // Success! Redirect to publicar page
    router.push("/publicar");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>

      <div className="relative max-w-md w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {step === "code" ? (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Acceso Anticipado
                </h1>
                <p className="text-gray-600">
                  Ingresa tu código de acceso para registrarte
                </p>
              </div>

              <form onSubmit={verifyCode} className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                    Código de Acceso
                  </label>
                  <input
                    type="text"
                    id="code"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="XK9-P2M-7H4-R"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-lg font-mono tracking-wider"
                    maxLength={13}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Ingresa el código de 10 caracteres
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  {loading ? "Verificando..." : "Verificar Código"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  ¿No tienes un código?{" "}
                  <Link href="/" className="text-purple-600 hover:text-purple-700 font-medium">
                    Solicitar acceso
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  ¡Código Válido!
                </h1>
                <p className="text-gray-600">
                  Código: <span className="font-mono font-bold text-purple-600">{validCode && formatCode(validCode)}</span>
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <span className="font-semibold">🎉 Acceso anticipado activado</span>
                    <br />
                    Podrás publicar anuncios antes del lanzamiento oficial.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={registering}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  {registering ? "Creando cuenta..." : "Crear Cuenta y Continuar"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
