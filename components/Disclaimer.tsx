"use client";
import {useTranslations} from "next-intl";

export function Disclaimer({className = ""}: {className?: string}) {
  const t = useTranslations();
  return (
    <div className={`rounded-md border border-amber-200 bg-amber-50 text-amber-800 text-sm px-3 py-2 ${className}`}>
      {t("legal.disclaimer.euOnly")}
    </div>
  );
}

