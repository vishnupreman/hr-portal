import React from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";

export  function LoginForm() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const navigate = useNavigate();
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          console.log("✅ Logged in:", data);
          // navigate based on role
          if (data.user.role === "hr") {
            navigate("/hr-home");
          } else {
            navigate("/employee-home");
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loginMutation.isPending ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
