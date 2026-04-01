import { useEffect } from "react";

interface Options {
  title: string;
}

const SUFFIX_TITLE = import.meta.env.VITE_APP_NAME || "";

export const useHead = (options: Options) => {
  const { title } = options;

  useEffect(() => {
    document.title = `${title} | ${SUFFIX_TITLE}`;
  }, [title]);
};
