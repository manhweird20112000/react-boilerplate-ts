import { Button } from "@/shared/components/ui/button";
import { LayoutPage } from "@/shared/layouts/page-layout";
import { memo } from "react";

const AuthorListPage = () => {
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
      <div></div>
    </LayoutPage>
  );
};

export default memo(AuthorListPage);
