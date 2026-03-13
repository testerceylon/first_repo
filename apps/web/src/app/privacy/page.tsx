import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Inicio Official collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-10">
        <h1 className="font-heading text-4xl font-bold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-3 text-muted-foreground">
          Last updated: March 1, 2026
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            1. Information We Collect
          </h2>
          <p>
            When you create an account, we collect your email address and a
            hashed password. If you sign in with Google, we receive your name,
            email, and profile picture from Google. We do not collect payment
            card details directly — payments are processed by PayPal.
          </p>
          <p className="mt-3">
            We automatically collect limited usage data such as pages visited
            and features used to improve the product. This data is never sold.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To create and manage your account.</li>
            <li>To process subscription payments and track credit usage.</li>
            <li>
              To send transactional emails (password reset, billing
              receipts). We do not send marketing emails without your consent.
            </li>
            <li>To improve the reliability and performance of our tools.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            3. User-Generated Content
          </h2>
          <p>
            Files you upload or content you generate (QR codes, cropped images,
            signatures) are processed in memory and are not permanently stored
            on our servers. Generated outputs are delivered to your browser
            immediately and deleted thereafter.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            4. Cookies
          </h2>
          <p>
            We use a single session cookie to keep you logged in. We do not use
            third-party tracking cookies or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            5. Third-Party Services
          </h2>
          <p>
            We use the following third-party services, each with their own
            privacy policies:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>
              <strong className="text-foreground">PayPal</strong> — payment
              processing.
            </li>
            <li>
              <strong className="text-foreground">Google OAuth</strong> —
              optional sign-in.
            </li>
            <li>
              <strong className="text-foreground">Vercel</strong> — hosting and
              infrastructure.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            6. Data Retention
          </h2>
          <p>
            We retain your account data for as long as your account is active.
            You may request deletion of your account and all associated data at
            any time by emailing us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            7. Your Rights
          </h2>
          <p>
            Depending on your location you may have rights to access, correct,
            or delete your personal data. To exercise these rights, contact us
            at{" "}
            <a
              href="mailto:support@inicioofficial.com"
              className="text-violet-600 hover:underline"
            >
              support@inicioofficial.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            8. Changes to This Policy
          </h2>
          <p>
            We may update this policy from time to time. Material changes will
            be communicated via email or a notice on the site. Continued use of
            Inicio Official after such notice constitutes acceptance of the updated
            policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            9. Contact
          </h2>
          <p>
            Questions? Email us at{" "}
            <a
              href="mailto:support@inicioofficial.com"
              className="text-violet-600 hover:underline"
            >
              support@inicioofficial.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
