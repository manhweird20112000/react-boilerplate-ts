import PageProvider from "../components/page.provider";
import { PageBuilder } from "../components/page-builder";

export default function BlogPage() {



  // const handleReorder = (columnId: string, orderedIds: string[]) => {
  //   const sections = page.current?.getChildren() || [];
  //   for (const section of sections) {
  //     if (section instanceof CompositeComponent) {
  //       const column = section.findById(columnId);
  //       if (column instanceof CompositeComponent) {
  //         column.reorderChildren(orderedIds);
  //         sync();
  //         break;
  //       }
  //     }
  //   }
  // };

  // const handleSetDataComponent = (sectionId: string, columnId: string) => {};

  return (
    <div>
      <PageProvider>
        <PageBuilder />
      </PageProvider>
    </div>
  );
}
