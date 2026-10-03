import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Gobaadi respects your privacy. This Privacy Policy explains how we collect, use, and protect information when you use the Gobaadi mobile application and website.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

const EFFECTIVE_DATE = "October 3, 2026";

const INTRO =
  "Gobaadi respects your privacy. This Privacy Policy explains how we collect, use, and protect " +
  "information when you use the Gobaadi mobile application and website.";

const CLOSING =
  "By using Gobaadi, you acknowledge that you have read and understood this Privacy Policy.";

type Section = {
  heading: string;
  intro?: string;
  paragraphs?: string[];
  bullets?: string[];
};

const SECTIONS: Section[] = [
  {
    heading: "1. Information We Collect",
    intro: "Depending on how you use Gobaadi, we may collect:",
    bullets: [
      "Name, phone number, email address, and account information",
      "Farm and livestock information",
      "Photos, videos, or other information you provide for animal-health analysis",
      "Location information when required for app features",
      "Information related to marketplace activities, purchases, or services",
      "Messages and information you provide when contacting support",
      "Device, technical, and usage information needed to operate and improve the app",
    ],
  },
  {
    heading: "2. How We Use Your Information",
    intro: "We use information to:",
    bullets: [
      "Provide and improve Gobaadi services",
      "Analyze animal-health information using AI-assisted tools",
      "Connect users with veterinary consultants",
      "Provide marketplace and farm-management services",
      "Process transactions and provide customer support",
      "Maintain security and prevent fraud or misuse",
      "Improve app performance and user experience",
    ],
  },
  {
    heading: "3. Sharing of Information",
    paragraphs: [
      "We do not sell your personal information.",
      "We may share necessary information with trusted service providers, veterinary professionals, " +
        "marketplace partners, payment providers, or technology providers when required to provide " +
        "Gobaadi services. We may also disclose information when required by law or necessary to " +
        "protect users, our services, or our legal rights.",
    ],
  },
  {
    heading: "4. AI and Animal-Health Information",
    paragraphs: [
      "Gobaadi may use AI to assist with animal-health analysis. AI-generated information is " +
        "provided for assistance and should not be considered a substitute for professional " +
        "veterinary diagnosis or treatment.",
    ],
  },
  {
    heading: "5. Data Security",
    paragraphs: [
      "We use reasonable technical and organizational measures to protect your information from " +
        "unauthorized access, misuse, loss, or disclosure. However, no online service can " +
        "guarantee absolute security.",
    ],
  },
  {
    heading: "6. Data Retention and Deletion",
    paragraphs: [
      "We retain information only as long as reasonably necessary to provide our services, comply " +
        "with legal obligations, resolve disputes, and maintain security.",
      "You may request deletion of your account and associated personal information by contacting " +
        "us through the details below. Some information may need to be retained where required by law.",
    ],
  },
  {
    heading: "7. Children",
    paragraphs: [
      "Gobaadi is not intended for children under the age required by applicable law. We do not " +
        "knowingly collect personal information from children without appropriate consent.",
    ],
  },
  {
    heading: "8. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page " +
        "with an updated effective date.",
    ],
  },
  {
    heading: "9. Contact Us",
    paragraphs: [
      "For privacy questions, requests, or account/data deletion:",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Navbar />

      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-16">
        <Link
          href="/"
          aria-label="Back to home"
          className="group inline-flex items-center gap-3 rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Home
        </Link>

        <article>
          <h1 className="mt-8 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Privacy Policy
          </h1>

          <p className="mt-3 text-sm font-semibold text-muted-foreground">
            Effective Date: {EFFECTIVE_DATE}
          </p>

          <div className="mt-8 border-t border-border" />

          <p className="mt-8 leading-7 text-secondary">{INTRO}</p>

          {SECTIONS.map((section) => (
            <section key={section.heading} className="mt-8">
              <h2 className="font-display text-lg font-bold text-accent sm:text-xl">
                {section.heading}
              </h2>

              {section.intro && (
                <p className="mt-3 leading-7 text-secondary">{section.intro}</p>
              )}

              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-7 text-secondary">
                  {paragraph}
                </p>
              ))}

              {section.bullets && (
                <ul className="mt-3 list-disc pl-5 space-y-1.5 leading-7 text-secondary marker:text-accent">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <p className="mt-8 leading-7 text-secondary">{CLOSING}</p>
        </article>
      </section>

      <Footer />
    </main>
  );
}
