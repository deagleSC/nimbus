import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-sm max-w-none">
        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to Nimbus. We respect your privacy and are committed to
            protecting your personal data. This Privacy Policy will inform you
            about how we look after your personal data when you visit our
            website and tell you about your privacy rights and how the law
            protects you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            2. Information We Collect
          </h2>
          <p>
            We may collect, use, store, and transfer different kinds of personal
            data about you, including:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Identity Data: includes first name, last name, username.</li>
            <li>Contact Data: includes email address and telephone numbers.</li>
            <li>
              Technical Data: includes internet protocol (IP) address, browser
              type and version, time zone setting, browser plug-in types and
              versions, operating system and platform.
            </li>
            <li>
              Usage Data: includes information about how you use our website and
              services.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            3. How We Use Your Information
          </h2>
          <p>
            We will only use your personal data when the law allows us to. Most
            commonly, we will use your personal data in the following
            circumstances:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>To register you as a new customer.</li>
            <li>To provide and improve our services.</li>
            <li>To manage our relationship with you.</li>
            <li>To administer and protect our business and website.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your
            personal data from being accidentally lost, used, or accessed in an
            unauthorized way, altered, or disclosed.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Data Retention</h2>
          <p>
            We will only retain your personal data for as long as necessary to
            fulfill the purposes we collected it for, including for the purposes
            of satisfying any legal, accounting, or reporting requirements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Your Legal Rights</h2>
          <p>
            Under certain circumstances, you have rights under data protection
            laws in relation to your personal data, including the right to:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Request access to your personal data.</li>
            <li>Request correction of your personal data.</li>
            <li>Request erasure of your personal data.</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
            <li>Request transfer of your personal data.</li>
            <li>Right to withdraw consent.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Third-Party Links</h2>
          <p>
            This website may include links to third-party websites, plug-ins,
            and applications. Clicking on those links or enabling those
            connections may allow third parties to collect or share data about
            you. We do not control these third-party websites and are not
            responsible for their privacy statements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Cookies</h2>
          <p>
            Cookies are small text files that are placed on your computer by
            websites that you visit. We use cookies to improve your experience
            on our site and to show you relevant advertising.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            9. Changes to This Privacy Policy
          </h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at privacy@nimbus.com.
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
