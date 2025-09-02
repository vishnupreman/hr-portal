import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { register,forgotPassword,login,resetPassword,verifyOtp } from "../api/auth"; 

// ---------------- REGISTER ----------------
export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};

// ---------------- VERIFY OTP ----------------
export const useVerifyOtp = () => {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
    },
  });
};

// ---------------- LOGIN ----------------
export const useLogin = () => {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
    },
  });
};

// ---------------- FORGOT PASSWORD ----------------
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

// ---------------- RESET PASSWORD ----------------
export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};
