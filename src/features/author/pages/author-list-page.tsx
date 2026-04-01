import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
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
      <div>
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
      </div>
    </LayoutPage>
  );
};

export default memo(AuthorListPage);
