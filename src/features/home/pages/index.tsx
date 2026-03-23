import { Button } from "antd";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useHead } from "~/hooks/use-head";

function HomePage() {
  useHead({ title: "Home" });
  const { t } = useTranslation();
  return (
    <div>
      {t("welcome", { name: "weird" })} <Button type="primary">Click me</Button>
    </div>
  );
}

export default memo(HomePage);
