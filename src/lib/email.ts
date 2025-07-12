import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(to: string, otp: string) {
  const { error } = await resend.emails.send({
    from: "AI Tutor<no-reply@spidermines.com>",
    to,
    subject: "Your AI Tutor OTP Code",
    html: `<p>Your OTP code is <b>${otp}</b>.</p>`,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error("Failed to send OTP email");
  }
}
