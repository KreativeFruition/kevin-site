import type { Metadata } from "next";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact | Kevin Frey",
  description: "Call, text, email, or follow Kevin Frey via this mobile-first contact hub.",
};

const links = [
  { label: "CALL", href: "tel:+19095886577" },
  { label: "TEXT", href: "sms:+19095886577" },
  { label: "EMAIL", href: "mailto:kf_inquiry@icloud.com" },
  { label: "WEBSITE", href: "https://www.kevinfrey.info", external: true },
  { label: "INSTAGRAM", href: "https://instagram.com/kevin.fr3y", external: true },
] as const;

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className={styles.poster}>
        <div className={styles.posterTop}>
          <p className={styles.tagline}>WHERE VISION MEETS CREATIVITY</p>
          <img className={styles.logo} src="/branding/kf-logo.svg" alt="Kevin Frey logo" />
        </div>
        <main className={styles.links} aria-label="Contact options">
          {links.map((link) => (
            <a
              key={link.label}
              className={styles.link}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </main>
        <footer className={styles.posterBottom}>
          <p className={styles.name}>KEVIN FREY</p>
          <p className={styles.roles}>
            DIRECTOR. CREATIVE. PRODUCER. EDUCATOR. CHOREOGRAPHER. DANCER.
          </p>
        </footer>
      </div>
    </div>
  );
}
