import { useTranslations } from "next-intl";
import Link from "next/link";

export default function AboutPage() {
  const t = useTranslations();
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="px-6 pt-12 pb-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t("about.title")}</h1>
          <p className="mt-3 text-lg text-gray-700 max-w-3xl">{t("about.subtitle")}</p>
        </div>
      </section>

      {/* Split Intro */}
      <section className="px-6 pb-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-semibold">{t("about.about.title")}</h2>
            <p className="mt-2 leading-relaxed text-gray-700">{t("about.about.body")}</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-semibold">{t("about.values.title")}</h2>
            <ul className="mt-3 grid sm:grid-cols-1 gap-2 text-gray-700">
              <li>• {t("about.values.items.0")}</li>
              <li>• {t("about.values.items.1")}</li>
              <li>• {t("about.values.items.2")}</li>
              <li>• {t("about.values.items.3")}</li>
              <li>• {t("about.values.items.4")}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 pb-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-semibold">{t("about.mission.title")}</h2>
            <p className="mt-2 leading-relaxed text-gray-700">{t("about.mission.body")}</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-semibold">{t("about.vision.title")}</h2>
            <p className="mt-2 leading-relaxed text-gray-700">{t("about.vision.body")}</p>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="px-6 pb-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-semibold">{t("about.solutions.title")}</h2>
            <ul className="mt-3 grid md:grid-cols-2 gap-2 text-gray-700">
              <li>✓ {t("about.solutions.items.0")}</li>
              <li>✓ {t("about.solutions.items.1")}</li>
              <li>✓ {t("about.solutions.items.2")}</li>
              <li>✓ {t("about.solutions.items.3")}</li>
              <li>✓ {t("about.solutions.items.4")}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="px-6 pb-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-semibold">{t("about.gdpr.title")}</h2>
            <p className="mt-2 leading-relaxed text-gray-700">{t("about.gdpr.body")}</p>
          </div>
        </div>
      </section>

      {/* Goal & CTA */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-semibold">{t("about.goal.title")}</h2>
            <p className="mt-2 leading-relaxed text-gray-700">{t("about.goal.body")}</p>
          </div>
          <div className="rounded-2xl p-6 bg-blue-600 text-white">
            <h3 className="text-2xl font-semibold">{t("about.cta.title")}</h3>
            <p className="mt-2 text-blue-50/90">{t("about.cta.body")}</p>
            <div className="mt-4">
              <Link href="/#contact" className="inline-block rounded-md bg-white text-blue-700 px-4 py-2 font-medium hover:bg-blue-50">
                {t("about.cta.button")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

