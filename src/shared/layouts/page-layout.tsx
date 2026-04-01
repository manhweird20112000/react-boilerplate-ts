import { type ReactElement, type ReactNode } from "react";

import { PaginationBar } from "@/shared/components/pagination/pagination-bar";
import { cn } from "@/shared/lib/utils";

type PaginationBarProps = {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange?: (page: number) => void;
  readonly createPageHref?: (page: number) => string;
  readonly siblingCount?: number;
  readonly className?: string;
  readonly previousText?: string;
  readonly nextText?: string;
};

type LayoutPageProps = {
  readonly heading: ReactNode;
  readonly action?: ReactNode;
  readonly filter?: ReactNode;
  readonly pagination?: ReactNode;
  readonly paginationBarProps?: PaginationBarProps;
  readonly isPaginationVisible?: boolean;
  readonly children: ReactNode;
  readonly className?: string;
};

export function LayoutPage({
  heading,
  action,
  filter,
  pagination,
  paginationBarProps,
  isPaginationVisible = true,
  children,
  className,
}: LayoutPageProps): ReactElement {
  const shouldRenderPagination: boolean =
    isPaginationVisible && Boolean(pagination ?? paginationBarProps);

  return (
    <div
      className={cn(
        "flex h-full min-h-full flex-col gap-4 p-4 md:p-6",
        className,
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold leading-tight md:text-xl">
              {heading}
            </h1>
          </div>
          {action ? (
            <div className="flex shrink-0 items-center justify-start gap-2 md:justify-end">
              {action}
            </div>
          ) : null}
        </div>
        {filter ? <div className="w-full">{filter}</div> : null}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
      {shouldRenderPagination ? (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background px-4 py-3">
          {pagination ?? (paginationBarProps ? <PaginationBar {...paginationBarProps} /> : null)}
        </div>
      ) : null}
    </div>
  );
}
