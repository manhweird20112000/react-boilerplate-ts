import { Empty } from "@arco-design/web-react";
import { useTranslation } from "react-i18next";

export function HomePage() {
  const { t } = useTranslation();
  return (
    <div>
      {t("welcome", { name: "weird" })}
      <Empty />
    </div>
  );
}
