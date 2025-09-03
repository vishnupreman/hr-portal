"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { useMutation } from "@tanstack/react-query"
import { authService } from "../service/authService" 

export const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [touched, setTouched] = useState({ email: false, password: false })

  const navigate = useNavigate()
  const { login } = useAuthStore()

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (res) => {
      login(res.data.accessToken, res.data.role)
      navigate(res.data.role === "hr" ? "/hr/home" : "/employee/home")
    },
  })

  // Basic validation (no new dependencies)
  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required"
    // Simple email regex; keeps UX friendly without adding deps
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    return isValid ? null : "Enter a valid email address"
  }

  const validatePassword = (value: string) => {
    if (!value) return "Password is required"
    if (value.length < 6) return "Password must be at least 6 characters"
    return null
  }

  const runFieldValidation = (field: "email" | "password", value: string) => {
    if (field === "email") {
      setEmailError(validateEmail(value))
    } else {
      setPasswordError(validatePassword(value))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validate all fields on submit
    const eErr = validateEmail(email)
    const pErr = validatePassword(password)
    setEmailError(eErr)
    setPasswordError(pErr)

    if (eErr || pErr) return
    mutation.mutate({ email, password })
  }

  const isFormValid = !validateEmail(email) && !validatePassword(password) && !!email && !!password

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-neutral-950">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="p-6">
          <header className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white text-balance">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Sign in to your account</p>
          </header>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (touched.email) runFieldValidation("email", e.target.value)
                }}
                onBlur={() => {
                  setTouched((t) => ({ ...t, email: true }))
                  runFieldValidation("email", email)
                }}
                aria-invalid={emailError ? "true" : "false"}
                aria-describedby={emailError ? "email-error" : undefined}
                className={[
                  "h-10 rounded-md border px-3 text-gray-900 dark:text-white",
                  "bg-white dark:bg-neutral-900",
                  "border-gray-300 dark:border-neutral-700",
                  "placeholder:text-gray-400 dark:placeholder:text-neutral-500",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                  emailError ? "border-red-500 focus-visible:ring-red-600" : "",
                ].join(" ")}
                placeholder="you@example.com"
              />
              {emailError ? (
                <p id="email-error" className="text-sm text-red-600">
                  {emailError}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (touched.password) runFieldValidation("password", e.target.value)
                }}
                onBlur={() => {
                  setTouched((t) => ({ ...t, password: true }))
                  runFieldValidation("password", password)
                }}
                aria-invalid={passwordError ? "true" : "false"}
                aria-describedby={passwordError ? "password-error" : undefined}
                className={[
                  "h-10 rounded-md border px-3 text-gray-900 dark:text-white",
                  "bg-white dark:bg-neutral-900",
                  "border-gray-300 dark:border-neutral-700",
                  "placeholder:text-gray-400 dark:placeholder:text-neutral-500",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                  passwordError ? "border-red-500 focus-visible:ring-red-600" : "",
                ].join(" ")}
                placeholder="••••••"
              />
              {passwordError ? (
                <p id="password-error" className="text-sm text-red-600">
                  {passwordError}
                </p>
              ) : null}
            </div>

            {mutation.isError ? (
              <div
                role="alert"
                className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
              >
                {(mutation.error as any)?.message || "Login failed. Please check your credentials and try again."}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!isFormValid || mutation.isPending}
              className={[
                "h-10 rounded-md bg-blue-600 px-4 font-medium text-white",
                "hover:bg-blue-700",
                "disabled:cursor-not-allowed disabled:opacity-60",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                "dark:focus-visible:ring-offset-neutral-900",
              ].join(" ")}
            >
              {mutation.isPending ? "Signing in..." : "Login"}
            </button>

            <div className="mt-1 flex items-center justify-between text-sm">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                aria-label="Forgot your password? Reset it"
              >
                Forgot password?
              </Link>

              <div className="text-gray-600 dark:text-gray-300">
                {"Don't have an account? "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                  aria-label="Create a new account"
                >
                  Register
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Login
