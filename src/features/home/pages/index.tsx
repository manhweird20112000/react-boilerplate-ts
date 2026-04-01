import { Button } from "@/shared/components/ui/button";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useHead } from "~/shared/hooks/use-head";

function HomePage() {
  useHead({ title: "Home" });
  const { t } = useTranslation();
  return (
    <div>
      {t("welcome", { name: "weird" })} <Button>Click me</Button>{" "}
    </div>
  );
}

export default memo(HomePage);
