"use client"

import type React from "react"

import { useMutation } from "@tanstack/react-query"
import { authService } from "../service/authService" 
import { useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export const VerifyOtp = () => {
  const { state } = useLocation()
  const [email, setEmail] = useState(state?.email || "")
  const [otp, setOtp] = useState("")
  const navigate = useNavigate()
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const mutation = useMutation({
    mutationFn: authService.verifyOtp,
    onSuccess: () => navigate("/login"),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      alert("Email is required")
      return
    }
    mutation.mutate({ email, otp })
  }

  const otpDigits = Array.from({ length: 6 }, (_, i) => otp[i] || "")

  const focusInput = (index: number) => {
    const el = inputsRef.current[index]
    if (el) el.focus()
  }

  const setOtpAtIndex = (index: number, value: string) => {
    const sanitized = value.replace(/\D/g, "")
    if (!sanitized) {
      const arr = [...otpDigits]
      arr[index] = ""
      setOtp(arr.join(""))
      return
    }
    const arr = [...otpDigits]
    arr[index] = sanitized[0]
    let nextIndex = index + 1
    for (let i = 1; i < sanitized.length && nextIndex < 6; i++, nextIndex++) {
      arr[nextIndex] = sanitized[i]
    }
    setOtp(arr.join(""))
    if (index < 5) focusInput(index + Math.min(sanitized.length, 1))
  }

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    setOtpAtIndex(index, e.target.value)
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key
    if (key === "Backspace") {
      if (otpDigits[index]) {
        setOtpAtIndex(index, "")
      } else if (index > 0) {
        e.preventDefault()
        focusInput(index - 1)
        setOtpAtIndex(index - 1, "")
      }
    } else if (key === "ArrowLeft" && index > 0) {
      e.preventDefault()
      focusInput(index - 1)
    } else if (key === "ArrowRight" && index < 5) {
      e.preventDefault()
      focusInput(index + 1)
    } else if (key === "Delete") {
      e.preventDefault()
      setOtpAtIndex(index, "")
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text")
    const digits = text.replace(/\D/g, "")
    if (!digits) return
    e.preventDefault()
    const arr = Array.from({ length: 6 }, (_, i) => digits[i] || "")
    setOtp(arr.join(""))
    const lastFilled = Math.min(digits.length, 6) - 1
    focusInput(lastFilled >= 0 ? lastFilled : 0)
  }

  const isEmailLocked = Boolean(state?.email)
  const canSubmit = !!email && otp.length === 6 && !mutation.isPending

  return (
    <main className="min-h-screen w-full bg-background text-foreground flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg border border-border bg-card text-card-foreground shadow-sm p-6 md:p-8"
        aria-labelledby="otp-title"
      >
        <header className="mb-6">
          <h1 id="otp-title" className="text-2xl font-semibold text-balance">
            Verify One-Time Passcode
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter the 6-digit code sent to your email to continue.</p>
        </header>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            readOnly={isEmailLocked}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
              isEmailLocked ? "opacity-80 cursor-not-allowed" : ""
            }`}
            placeholder="you@example.com"
            aria-describedby="email-help"
          />
          <p id="email-help" className="mt-1 text-xs text-muted-foreground">
            {isEmailLocked
              ? "We pre-filled your email from the previous step."
              : "Please enter the email that received the code."}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">6-digit code</label>
          <div className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={handlePaste}>
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => void(inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                aria-label={`Digit ${i + 1}`}
                className="h-12 sm:h-14 w-full text-center text-lg sm:text-2xl rounded-md border border-input bg-background outline-none ring-offset-background focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            You can paste the full code directly; it will fill the boxes.
          </p>
        </div>

        {mutation.isError ? (
          <div
            role="alert"
            className="mb-4 rounded-md border border-red-600/30 bg-red-50 text-red-700 px-3 py-2 text-sm"
          >
            Something went wrong. Please check the code and try again.
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Verifying…" : "Verify"}
        </button>
      </form>
    </main>
  )
}
