"use client"

import { useMutation } from "@tanstack/react-query"
import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom" 
import { authService } from "../service/authService" 

export const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"employee" | "hr">("employee")
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => navigate("/verify-otp", { state: email }),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ email, password, role })
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="px-6 pt-6 pb-2">
            <h1 className="text-2xl font-semibold tracking-tight text-balance">Create your account</h1>
            <p className="mt-1 text-sm text-gray-600">Join as an employee or HR and continue to verification.</p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
              <p className="text-xs text-gray-500">Use at least 8 characters.</p>
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label htmlFor="role" className="block text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as "employee" | "hr")}
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              >
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
              </select>
            </div>

            {/* Error message (UI-only feedback) */}
            {mutation.error ? (
              <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                Something went wrong. Please try again.
              </div>
            ) : null}

            {/* Submit */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? "Registering..." : "Register"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">By continuing, you agree to our Terms & Privacy.</p>
      </div>
    </div>
  )
}
