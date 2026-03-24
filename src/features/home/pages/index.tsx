import { Button } from "antd";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useHead } from "~/hooks/use-head";

function HomePage() {
  useHead({ title: "Home" });
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div>
      {t("welcome", { name: "weird" })}{" "}
      <Button type="primary" onClick={() => navigate("/login")}>
        Click me
      </Button>
    </div>
  );
}

export default memo(HomePage);
