"use client";

import { useState } from "react";
import { signIn } from "@/lib/services/authService";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiLock, FiMail, FiPackage } from "react-icons/fi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    try {
      setSigningIn(true);
      await signIn(email, password);
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error?.message || "Error signing in.");
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b17] px-4 text-white">
      {/* Background glow orbs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-[280px] w-[280px] rounded-full bg-violet-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-[200px] w-[200px] rounded-full bg-sky-600/10 blur-[80px]" />

      <div className="relative w-full max-w-md">
        {/* Logo mark */}
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/20 shadow-[0_0_24px_rgba(99,102,241,0.25)]">
            <FiPackage size={26} className="text-indigo-300" />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.28em] text-indigo-400">
              PALENGKEPRO
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_0_60px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <div className="mb-7 text-center">
            <h1 className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Sign in to access your inventory dashboard.
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label
                className="mb-2 block text-sm font-medium text-white/70"
                htmlFor="email"
              >
                Email
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition focus-within:border-indigo-500/70 focus-within:bg-indigo-500/5 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]">
                <FiMail className="shrink-0 text-white/40" size={17} />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                />
              </div>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-white/70"
                htmlFor="password"
              >
                Password
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition focus-within:border-indigo-500/70 focus-within:bg-indigo-500/5 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.1)]">
                <FiLock className="shrink-0 text-white/40" size={17} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="shrink-0 text-white/40 transition hover:text-white/80"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <span className="mt-px shrink-0 text-base leading-none">⚠</span>
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={signingIn}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition hover:bg-indigo-400 hover:shadow-[0_0_28px_rgba(99,102,241,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {signingIn ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    />
                  </svg>
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-white/25">
          PalengkePro Inventory System
        </p>
      </div>
    </div>
  );
}