"use client"

import { useMutation } from "@tanstack/react-query"
import { authService } from "../service/authService" 
import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export const ResetPassword = () => {
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { state } = useLocation()
  const email = state?.email || ""
  const navigate = useNavigate()

  const [touched, setTouched] = useState<{
    email?: boolean
    otp?: boolean
    newPassword?: boolean
    confirmPassword?: boolean
  }>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const otpLength = 6
  const otpDigits = useMemo(() => {
    const arr = Array.from({ length: otpLength }, (_, i) => otp[i] || "")
    return arr
  }, [otp])
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  const focusNext = (index: number) => {
    const next = inputsRef.current[index + 1]
    if (next) next.focus()
  }
  const focusPrev = (index: number) => {
    const prev = inputsRef.current[index - 1]
    if (prev) prev.focus()
  }

  const handleOtpChange = (index: number, value: string) => {
    const v = value.replace(/\D/g, "").slice(0, 1)
    const next = [...otpDigits]
    next[index] = v
    const joined = next.join("")
    setOtp(joined)
    if (v && index < otpLength - 1) focusNext(index)
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      e.preventDefault()
      handleOtpChange(index - 1, "")
      focusPrev(index)
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault()
      focusPrev(index)
    }
    if (e.key === "ArrowRight" && index < otpLength - 1) {
      e.preventDefault()
      focusNext(index)
    }
  }

  const handleOtpPaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    const data = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, otpLength)
    if (!data) return
    e.preventDefault()
    const next = [...otpDigits]
    for (let i = 0; i < Math.min(otpLength - index, data.length); i++) {
      next[index + i] = data[i]
    }
    const joined = next.join("")
    setOtp(joined)
    const targetIndex = Math.min(index + data.length, otpLength - 1)
    inputsRef.current[targetIndex]?.focus()
  }

  const mutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => navigate("/login"),
    onError: (error: any) => alert(error.response?.data?.message || "Failed to reset password"),
  })

  const emailValid = useMemo(() => {
    if (!email) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }, [email])

  const otpValid = useMemo(() => /^\d{6}$/.test(otp), [otp])

  const newPasswordValid = useMemo(() => {
    if (newPassword.length <= 8) return false
    const hasLetter = /[A-Za-z]/.test(newPassword)
    const hasNumber = /\d/.test(newPassword)
    return hasLetter && hasNumber
  }, [newPassword])

  const confirmValid = useMemo(
    () => confirmPassword === newPassword && confirmPassword.length > 0,
    [confirmPassword, newPassword],
  )

  const formValid = emailValid && otpValid && newPasswordValid && confirmValid

  const markTouched = (name: keyof typeof touched) => setTouched((t) => ({ ...t, [name]: true }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)
    if (!formValid) return

    mutation.mutate({ email, otp, newPassword: confirmPassword })
  }

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <section className="w-full max-w-md rounded-lg border bg-white shadow-sm">
        <header className="px-6 pt-6">
          <h1 className="text-xl font-semibold text-gray-900 text-balance">Reset your password</h1>
          <p className="mt-1 text-sm text-gray-600">
            Enter the 6-digit code sent to your email and choose a new password.
          </p>
        </header>

        {mutation.isError ? (
          <div className="mx-6 mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Something went wrong. Please try again.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-800">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => navigate("/reset-password", { state: { email: e.target.value } })}
              onBlur={() => markTouched("email")}
              className={`w-full rounded-md border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                submitAttempted || touched.email
                  ? emailValid
                    ? "border-gray-300"
                    : "border-red-400"
                  : "border-gray-300"
              }`}
              placeholder="you@example.com"
              aria-invalid={submitAttempted || touched.email ? !emailValid : false}
              aria-describedby="email-error"
            />
            {(submitAttempted || touched.email) && !emailValid && (
              <p id="email-error" className="text-xs text-red-600">
                Enter a valid email address.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-800">6-digit OTP</label>
            <div className="flex items-center justify-between gap-2">
              {Array.from({ length: otpLength }).map((_, i) => (
                <input
                  key={i}
                  ref={(el) => void(inputsRef.current[i] = el)}
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={otpDigits[i]}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  onPaste={(e) => handleOtpPaste(i, e)}
                  onBlur={() => markTouched("otp")}
                  aria-label={`OTP digit ${i + 1}`}
                  className={`h-12 w-10 text-center rounded-md border text-lg font-medium tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    submitAttempted || touched.otp
                      ? otpValid
                        ? "border-gray-300"
                        : "border-red-400"
                      : "border-gray-300"
                  }`}
                />
              ))}
            </div>
            {(submitAttempted || touched.otp) && !otpValid && (
              <p className="text-xs text-red-600">Enter the 6-digit code sent to your email.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-800">
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onBlur={() => markTouched("newPassword")}
              className={`w-full rounded-md border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                submitAttempted || touched.newPassword
                  ? newPasswordValid
                    ? "border-gray-300"
                    : "border-red-400"
                  : "border-gray-300"
              }`}
              placeholder="At least 8 characters"
              aria-invalid={submitAttempted || touched.newPassword ? !newPasswordValid : false}
              aria-describedby="new-password-error"
            />
            {(submitAttempted || touched.newPassword) && !newPasswordValid && (
              <p id="new-password-error" className="text-xs text-red-600">
                Use at least 8 characters, including letters and numbers.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => markTouched("confirmPassword")}
              className={`w-full rounded-md border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                submitAttempted || touched.confirmPassword
                  ? confirmValid
                    ? "border-gray-300"
                    : "border-red-400"
                  : "border-gray-300"
              }`}
              placeholder="Re-enter new password"
              aria-invalid={submitAttempted || touched.confirmPassword ? !confirmValid : false}
              aria-describedby="confirm-password-error"
            />
            {(submitAttempted || touched.confirmPassword) && !confirmValid && (
              <p id="confirm-password-error" className="text-xs text-red-600">
                Passwords do not match.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!formValid || mutation.isPending}
            aria-busy={mutation.isPending}
            className={`w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${
              !formValid || mutation.isPending ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {mutation.isPending ? "Resetting…" : "Reset password"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By continuing, you agree to our Terms and acknowledge our Privacy Policy.
          </p>
        </form>
      </section>
    </main>
  )
}
