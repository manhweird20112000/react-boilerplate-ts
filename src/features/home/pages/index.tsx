import { Empty } from "@arco-design/web-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

function HomePage() {
  const { t } = useTranslation();
  return (
    <div>
      {t("welcome", { name: "weird" })}
      <Empty />
    </div>
  );
}

export default memo(HomePage);
