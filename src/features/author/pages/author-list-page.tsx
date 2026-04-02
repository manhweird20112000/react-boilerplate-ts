import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import DataTable, { DataTableColumnHeader } from "@/shared/components/data-table/data-table";
import { LayoutPage } from "@/shared/layouts/page-layout";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useMemo, type ReactElement } from "react";

type AuthorRow = {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly status: "active" | "inactive";
  readonly createdAt: string;
};

const SAMPLE_AUTHORS: readonly AuthorRow[] = [
  { id: "auth_001", fullName: "Haruki Murakami", email: "haruki.murakami@example.com", status: "active", createdAt: "2026-03-12" },
  { id: "auth_002", fullName: "Banana Yoshimoto", email: "banana.yoshimoto@example.com", status: "active", createdAt: "2026-02-26" },
  { id: "auth_003", fullName: "Yoko Ogawa", email: "yoko.ogawa@example.com", status: "inactive", createdAt: "2026-01-05" },
] as const;

const AuthorListPage = (): ReactElement => {
  const columns: readonly ColumnDef<AuthorRow>[] = useMemo(
    () => [
      {
        accessorKey: "fullName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Full name" />,
        cell: ({ row }) => <div className="font-medium">{row.original.fullName}</div>,
      },
      {
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
        cell: ({ row }) => <div className="text-muted-foreground">{row.original.email}</div>,
      },
      {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => (
          <div className={row.original.status === "active" ? "text-emerald-600" : "text-muted-foreground"}>
            {row.original.status}
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
        cell: ({ row }) => <div className="whitespace-nowrap">{row.original.createdAt}</div>,
      },
      {
        id: "actions",
        meta: { headerClassName: "w-[180px]", cellClassName: "w-[180px]" },
        header: () => <div>Actions</div>,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => console.log("edit", row.original.id)}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => console.log("delete", row.original.id)}>
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <LayoutPage
      heading="Authors"
      action={<Button>Create</Button>}
      filter={<div></div>}
      paginationBarProps={{
        currentPage: 1,
        totalPages: 1,
        onPageChange: (page) => {
          console.log(page);
        },
        createPageHref: (page) => `/authors?page=${page}`,
      }}
    >
      <div className="grid gap-4">
        <Select>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <DataTable columns={columns} data={SAMPLE_AUTHORS} emptyText="No authors found." />
      </div>
    </LayoutPage>
  );
};

export default memo(AuthorListPage);
