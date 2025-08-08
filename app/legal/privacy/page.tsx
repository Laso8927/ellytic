import { useTranslations } from "next-intl";

export default function PrivacyPage() {
  const t = useTranslations();
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto prose prose-gray">
        <h1>{t("privacy.title")}</h1>
        <p>{t("privacy.intro")}</p>
        <h2>{t("privacy.principles.title")}</h2>
        <ul>
          <li>{t("privacy.principles.items.0")}</li>
          <li>{t("privacy.principles.items.1")}</li>
          <li>{t("privacy.principles.items.2")}</li>
          <li>{t("privacy.principles.items.3")}</li>
          <li>{t("privacy.principles.items.4")}</li>
        </ul>
        <h2>{t("privacy.contact.title")}</h2>
        <p>{t("privacy.contact.body")}</p>
      </div>
    </main>
  );
}

