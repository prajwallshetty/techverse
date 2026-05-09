"use client";

import { useTranslation } from "@/lib/i18n/context";

export function TranslatedHeader({ roleLabel }: { roleLabel: string }) {
  const { t } = useTranslation();
  
  return (
    <div>
      <p className="text-sm font-medium text-muted">
        {t("common.dashboard.role_dashboard", { role: roleLabel })}
      </p>
      <h2 className="text-lg font-bold lg:text-xl">{t("common.dashboard.title")}</h2>
    </div>
  );
}
