"use client"

import * as React from "react"

import { useNavigate } from "react-router-dom"
import { useRegister } from "../hooks/useAuth" 

export default function RegisterForm() {
  const [role, setRole] = React.useState<'hr'|"employee"|"">("")
  const [error, setError] = React.useState<string>("")
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const navigate = useNavigate()
  const registerMutation = useRegister()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    const form = e.currentTarget
    const formData = new FormData(form)
    const email = String(formData.get("email") || "").trim()
    const password = String(formData.get("password") || "")

    if (!email) {
      setError("Email is required.")
      return
    }
    if (!password || password.length <= 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (!role) {
      setError("Please select a role.")
      return
    }

    try {
        setIsSubmitting(true)
        await registerMutation.mutateAsync({email,password,role})
        form.reset()
        setRole("")
        navigate(`/verify-otp`)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border p-6">
        <h2 className="text-pretty text-lg font-semibold">Register</h2>
        <p className="text-pretty text-sm text-muted-foreground">Use a valid email and a strong password.</p>
      </div>

      <div className="p-6">
        {error ? (
          <div
            role="alert"
            aria-live="polite"
            className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="role" value={role} />

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              minLength={8}
              required
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
            <p className="text-xs text-muted-foreground">Must be at least 8 characters.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <select
              id="role"
              aria-label="Select role"
              value={role}
               onChange={(e) => setRole(e.target.value as "hr" | "employee" | "")}
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <option value="" disabled>
                Select a role
              </option>
              <option value="hr">HR</option>
              <option value="employee">Employee</option>
            </select>
            <p className="sr-only" aria-live="polite">
              {role ? `Selected role ${role}` : "No role selected"}
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  )
}
