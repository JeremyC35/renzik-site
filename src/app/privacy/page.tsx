import type { Metadata } from "next";
import { real, site } from "@/config/site";
import { LegalContact, LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy | Renzik",
  description: "How Renzik handles the information you send through this website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const legalName = real(site.legalEntityName);
  const who = legalName ? `${legalName} (doing business as ${site.tradeName})` : site.tradeName;
  return (
    <LegalPage title="Privacy policy">
      <p>
        This policy explains what {who} (&ldquo;Renzik,&rdquo; &ldquo;we&rdquo;) collects through this website and
        what we do with it.
      </p>

      <h2>What we collect</h2>
      <p>The only personal information this site collects is what you type into the &ldquo;Book a call&rdquo; form:</p>
      <ul>
        <li>your name, business name and phone number</li>
        <li>your email address and a message, if you choose to add them</li>
        <li>your trade, and whether you checked the box agreeing to calls and texts</li>
      </ul>

      <h2>Where it goes</h2>
      <p>
        When you send the form, your details are emailed to Renzik through our email provider. The website does not
        save them in a database. To stop abuse of the form, your IP address is held briefly (about 10 minutes) by
        our rate-limiting provider, and our hosting provider keeps standard technical logs. Those logs do not
        include what you typed into the form.
      </p>

      <h2>Cookies and tracking</h2>
      <p>This site doesn&apos;t use cookies, analytics, advertising pixels or any other tracking.</p>

      <h2>How we use it</h2>
      <p>
        We use your information to answer your request and talk with you about our services. We&apos;ll only call or
        text you using automated technology if you gave consent on the form, and consent is never a condition of
        buying anything from us.
      </p>

      <h2>Opting out</h2>
      <p>
        Reply STOP to any text from us to stop texts. To stop calls or emails, or to ask us to delete your
        information, contact us at <LegalContact />.
      </p>

      <h2>We don&apos;t sell your data</h2>
      <p>We don&apos;t sell, rent or share your personal information with anyone for their marketing.</p>

      <h2>Security</h2>
      <p>
        The site is served only over encrypted connections (HTTPS), the form is protected against spam and abuse, and
        access to the inbox that receives your details is limited to Renzik.
      </p>

      <h2>Governing law</h2>
      <p>This policy is governed by the laws of the State of New York.</p>

      <h2>Contact</h2>
      <p>
        Questions about this policy: <LegalContact />.
      </p>
    </LegalPage>
  );
}
