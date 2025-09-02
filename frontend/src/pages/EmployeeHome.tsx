import React from "react";
import { useAuthStore } from "../store/authStore";

function EmployeeHome() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-100">
      <h1 className="text-3xl font-bold">
        👨‍💻 Welcome Employee {user?.email}
      </h1>
    </div>
  );
}

export default EmployeeHome;
