import  api  from '../api/axios'

// Register (user provides: name, email, password, role)
export const register = (data: {
  email: string;
  password: string;
  role: "hr" | "employee";
}) => api.post("/auth/register", data).then((res) => res.data);

// Verify OTP (after register)
export const verifyOtp = (data: { email: string; otp: string }) =>
  api.post("/auth/verify-otp", data).then((res) => res.data);

// Login (email + password)
export const login = (data: { email: string; password: string }) =>
  api.post("/auth/login", data).then((res) => res.data);

// Forgot Password (send OTP to email)
export const forgotPassword = (data: { email: string }) =>
  api.post("/auth/forgot-password", data).then((res) => res.data);

// Reset Password (verify OTP + set new password)
export const resetPassword = (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => api.post("/auth/reset-password", data).then((res) => res.data);
