import React from "react";

export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-xl dark:bg-gray-800">
        {children}
      </div>
    </div>
  );
}
