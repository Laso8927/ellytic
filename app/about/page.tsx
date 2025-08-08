import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations();
  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">{t("about.title")}</h1>
        <p className="mt-3 text-gray-600">{t("about.subtitle")}</p>

        <section className="mt-10 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold">{t("about.mission.title")}</h2>
            <p className="mt-2 leading-relaxed">{t("about.mission.body")}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">{t("about.about.title")}</h2>
            <p className="mt-2 leading-relaxed">{t("about.about.body")}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">{t("about.vision.title")}</h2>
            <p className="mt-2 leading-relaxed">{t("about.vision.body")}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">{t("about.solutions.title")}</h2>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>{t("about.solutions.items.0")}</li>
              <li>{t("about.solutions.items.1")}</li>
              <li>{t("about.solutions.items.2")}</li>
              <li>{t("about.solutions.items.3")}</li>
              <li>{t("about.solutions.items.4")}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">{t("about.goal.title")}</h2>
            <p className="mt-2 leading-relaxed">{t("about.goal.body")}</p>
          </div>
        </section>
      </div>
    </main>
  );
}

