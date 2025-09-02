"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { useVerifyOtp} from "../hooks/useAuth"  // hooks we'll define

export default function OTPForm() {
  const [email, setEmail] = React.useState("")
  const [otp, setOtp] = React.useState("")
  const [error, setError] = React.useState("")
  const navigate = useNavigate()

  const verifyMutation = useVerifyOtp()
  const resendMutation = useResendOtp()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError("OTP must be exactly 6 digits")
      return
    }

    try {
      await verifyMutation.mutateAsync({ email, otp })
      navigate("/login") // or /dashboard
    } catch (err) {
      setError("Invalid or expired OTP. Please try again.")
    }
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setOtp(value)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">Verify OTP</h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 px-3 py-2 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              6-Digit OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={handleOtpChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={verifyMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                       disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {verifyMutation.isPending ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Didn’t receive the OTP?{" "}
          <button
            type="button"
            onClick={() => resendMutation.mutate({ email })}
            disabled={resendMutation.isPending}
            className="text-blue-600 hover:underline"
          >
            {resendMutation.isPending ? "Resending..." : "Resend OTP"}
          </button>
        </p>
      </div>
    </div>
  )
}
