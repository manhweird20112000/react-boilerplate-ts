import { createContext } from "react";
import { Page } from "../models";

interface PageContextType {
  page: Page;
  version: number;
}

export const PageContext = createContext<PageContextType>({
  page: new Page("page-1"),
  version: 0,
});
