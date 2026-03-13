import { Resend } from "resend";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

/**
 * Send an email using Resend.
 * 
 * Errors are logged but not thrown, so a failed email never crashes the auth flow.
 * 
 * @param options - Email options
 * @returns Promise<boolean> - true if sent successfully, false if failed
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = process.env.EMAIL_FROM_NOREPLY || "noreply@inicioofficial.com",
  replyTo = process.env.EMAIL_REPLY_TO || "support@inicioofficial.com",
}: SendEmailOptions): Promise<boolean> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo,
    });

    if (result.error) {
      console.error("[sendEmail] Resend error:", result.error);
      return false;
    }

    console.log(`[sendEmail] Email sent successfully to ${to} (ID: ${result.data?.id})`);
    return true;
  } catch (error) {
    console.error("[sendEmail] Failed to send email:", error);
    return false;
  }
}
