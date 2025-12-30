import { useState } from "react";
import { Page } from "../models";
import { PageContext } from "./page.context";

export default function PageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [version, setVersion] = useState<number>(0);
  const [page, setPage] = useState<Page>(new Page("page-1"));

  const sync = () => {
    setVersion((v) => v + 1);
  };

  return (
    <PageContext.Provider value={{ page, version }}>
      {children}
    </PageContext.Provider>
  );
}
