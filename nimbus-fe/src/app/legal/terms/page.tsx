import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

      <div className="prose prose-sm max-w-none">
        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to Nimbus. These Terms of Service govern your use of our
            website and services. By accessing or using Nimbus, you agree to be
            bound by these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Definitions</h2>
          <p>
            &ldquo;Service&rdquo; refers to the Nimbus application, website, and
            services provided.
          </p>
          <p>
            &ldquo;User&rdquo; refers to individuals who access or use the
            Service.
          </p>
          <p>
            &ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
            &ldquo;our&rdquo; refers to Nimbus.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            3. Account Registration
          </h2>
          <p>
            You may be required to register an account to access certain
            features of our Service. You must provide accurate information
            during registration and maintain the security of your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            4. User Responsibilities
          </h2>
          <p>
            Users are responsible for all activities that occur under their
            account. Users agree not to use the Service for any illegal purpose
            or in violation of any laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            5. Intellectual Property
          </h2>
          <p>
            The Service and its original content, features, and functionality
            are owned by Nimbus and are protected by international copyright,
            trademark, and other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service
            immediately, without prior notice, for conduct that we believe
            violates these Terms or is harmful to other users of the Service or
            third parties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            7. Limitation of Liability
          </h2>
          <p>
            In no event shall Nimbus be liable for any indirect, incidental,
            special, consequential, or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other
            intangible losses.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time.
            It is your responsibility to review these Terms periodically for
            changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at
            support@nimbus.com.
          </p>
        </section>
      </div>

      <div className="mt-12 border-t pt-6 text-sm text-muted-foreground">
        <Link href="/" className="underline underline-offset-4">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
