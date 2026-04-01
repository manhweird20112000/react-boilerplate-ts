import { memo, type ReactElement } from "react";
import { Link } from "react-router-dom";

import { useHead } from "~/hooks/use-head";

function NotFoundPage(): ReactElement {
  useHead({ title: "404" });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 p-6 text-center">
      <div className="text-5xl font-bold text-gray-900">404</div>
      <div className="text-gray-600">Page not found</div>
      <div className="mt-4">
        <Link
          to="/"
          className="inline-flex rounded-md bg-[#2C687B] px-4 py-2 text-sm font-medium text-white hover:bg-[#235a6b]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default memo(NotFoundPage);

