import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms governing your use of Inicio Official.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-10">
        <h1 className="font-heading text-4xl font-bold tracking-tight">
          Terms &amp; Conditions
        </h1>
        <p className="mt-3 text-muted-foreground">
          Last updated: March 1, 2026
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using Inicio Official (&quot;the Service&quot;), you agree
            to be bound by these Terms &amp; Conditions. If you do not agree,
            please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            2. Accounts
          </h2>
          <p>
            You must provide accurate information when creating an account. You
            are responsible for maintaining the security of your credentials and
            for all activity that occurs under your account. Notify us
            immediately of any unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            3. Credits and Subscriptions
          </h2>
          <p>
            Inicio Official operates on a credit-based model. Credits are granted
            monthly based on your plan and reset at the start of each billing
            cycle. Unused credits do not roll over. Subscriptions are billed
            monthly and can be cancelled at any time; cancellation takes effect
            at the end of the current billing period.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            4. Refund Policy
          </h2>
          <p>
            Subscription fees are non-refundable except where required by
            applicable law. If you believe you have been charged in error,
            contact us within 14 days at{" "}
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
            5. Acceptable Use
          </h2>
          <p>You agree not to use the Service to:</p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>
              Generate or distribute content that is illegal, harmful,
              defamatory, or infringes the intellectual property of others.
            </li>
            <li>
              Attempt to reverse-engineer, scrape, or overload the platform.
            </li>
            <li>
              Resell or sublicense access to the Service without written
              permission.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            6. Intellectual Property
          </h2>
          <p>
            All content you generate using the Service is owned by you. Inicio Official
            retains ownership of the platform, its code, branding, and
            documentation. You may not copy or replicate the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            7. Disclaimer of Warranties
          </h2>
          <p>
            The Service is provided &quot;as is&quot; without warranty of any
            kind. We do not guarantee uninterrupted or error-free operation and
            are not liable for any losses arising from use of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            8. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, Inicio Official&apos;s total
            liability to you for any claim arising out of these terms shall not
            exceed the amount you paid us in the three months preceding the
            claim.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            9. Termination
          </h2>
          <p>
            We reserve the right to suspend or terminate your account if you
            violate these Terms. You may close your account at any time from
            your account settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            10. Governing Law
          </h2>
          <p>
            These Terms are governed by and construed in accordance with
            applicable law. Any disputes shall be resolved in the competent
            courts of the jurisdiction in which Inicio Official operates.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            11. Contact
          </h2>
          <p>
            Questions about these Terms? Email{" "}
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
