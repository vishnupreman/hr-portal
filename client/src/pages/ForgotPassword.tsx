"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useNavigate, Link } from "react-router-dom"
import { authService } from "../service/authService" 


export function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [touched, setTouched] = useState(false)
  const navigate = useNavigate()

  const emailError = useMemo(() => {
    if (!touched) return ""
    if (!email.trim()) return "Email is required"
    // simple RFC2822-ish check
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    return isValid ? "" : "Enter a valid email address"
  }, [email, touched])

  const isFormValid = emailError === "" && email.trim() !== ""

  const mutation = useMutation({
    mutationFn: authService.forgetPassword,
    onSuccess: () => navigate("/reset-password", { state: email }),
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!isFormValid) return
    mutation.mutate({ email: email.trim() })
  }

  return (
    <main className="min-h-[calc(100dvh)] flex items-center justify-center bg-background px-4">
      <section
        aria-label="Forgot password"
        className="w-full max-w-md rounded-lg border bg-card text-card-foreground shadow-sm"
      >
        <header className="px-6 pt-6">
          <h1 className="text-xl font-semibold text-balance">Forgot your password?</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your email and we’ll send you a 6-digit OTP to reset your password.
          </p>
        </header>

        <form onSubmit={onSubmit} noValidate className="px-6 pb-6 pt-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
              placeholder="you@example.com"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            {emailError ? (
              <p id="email-error" className="text-sm text-red-600">
                {emailError}
              </p>
            ) : null}
          </div>

          {mutation.isError ? (
            <div
              role="alert"
              className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {(() => {
                const anyErr = mutation.error as unknown as { message?: string }
                return anyErr?.message || "Something went wrong. Please try again."
              })()}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!isFormValid || mutation.isPending}
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            {mutation.isPending ? "Sending..." : "Send OTP"}
          </button>

          <div className="mt-4 flex items-center justify-between text-sm">
            <Link to="/login" className="text-blue-600 hover:underline">
              Back to login
            </Link>
            <Link to="/register" className="text-blue-600 hover:underline">
              Create account
            </Link>
          </div>
        </form>
      </section>
    </main>
  )
}


