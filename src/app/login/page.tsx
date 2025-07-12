"use client";

import { useState } from "react";
import EmailForm from "@/app/components/auth/EmailForm";
import OtpForm from "@/app/components/auth/OtpForm";
import AuthCard from "@/app/components/auth/AuthCard";

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "otp" | "done">("email");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function handleEmailSuccess(enteredEmail: string) {
    setEmail(enteredEmail);
    setStep("otp");
    setMessage("OTP sent! Check your email.");
  }

  function handleOtpSuccess() {
    setStep("done");
    setMessage("Logged in! Redirecting...");
    window.location.href = "/";
  }

  return (
    <AuthCard>
      <h1 className="text-2xl font-bold mb-4 text-center">
        {step === "email"
          ? "Sign In"
          : step === "otp"
            ? "Enter OTP"
            : "Success"}
      </h1>
      {message && (
        <div className="mb-4 text-center text-sm text-green-700">{message}</div>
      )}
      {step === "email" && <EmailForm onSuccess={handleEmailSuccess} />}
      {step === "otp" && <OtpForm email={email} onSuccess={handleOtpSuccess} />}
      {step === "done" && <div className="text-center text-lg">Logged in!</div>}
    </AuthCard>
  );
}
