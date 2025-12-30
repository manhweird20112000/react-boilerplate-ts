import { useEffect, useMemo, useRef, useState } from "react";
import { Button as ButtonBlock, Page } from "../models";
import { CompositeComponent } from "../models/composite";
import { SectionColumn } from "../models/section-column";
import { Button } from "@arco-design/web-react";
import SectionItem from "../components/section-item";
import { v4 as uuidv4 } from "uuid";

export default function BlogPage() {
  const page = useRef<Page>(new Page("page-1"));

  const [version, forceRender] = useState<number>(0);

  const sections = useMemo(() => {
    return page.current?.getChildren() || [];
  }, [version]);

  const sync = () => {
    forceRender((v) => v + 1);
  };

  const handleAddColumnSection = (
    numberOfColumns: number,
    isFullPage: boolean = false
  ) => {
    const block = new SectionColumn(
      uuidv4(),
      isFullPage ? "フルページ" : `${numberOfColumns}カラム`,
      isFullPage ? 1 : numberOfColumns
    );
    for (let i = 0; i < numberOfColumns; i++) {
      const sectionColumn = new SectionColumn(uuidv4(), "Section Column" + i);
      sectionColumn.add(new ButtonBlock(uuidv4(), "ボタン1"));
      block.add(sectionColumn);
    }
    page.current?.add(block);
    sync();
  };

  const handleAddFullPageSection = () => {
    handleAddColumnSection(1, true);
  };

  const handleAddLeaf = (sectionId: string, columnId: string) => {
    const section = page.current?.findById(sectionId);
    if (section instanceof CompositeComponent) {
      const column = section.findById(columnId);
      if (column instanceof CompositeComponent) {
        column.add(new ButtonBlock(uuidv4(), "ボタン1"));
        sync();
      }
    }
  };

  const handleReorder = (columnId: string, orderedIds: string[]) => {
    const sections = page.current?.getChildren() || [];
    for (const section of sections) {
      if (section instanceof CompositeComponent) {
        const column = section.findById(columnId);
        if (column instanceof CompositeComponent) {
          column.reorderChildren(orderedIds);
          sync();
          break;
        }
      }
    }
  };

  const handleSave = () => {
    localStorage.setItem("page", JSON.stringify(page.current?.render()));
  };

  useEffect(() => {
    const page = JSON.parse(localStorage.getItem("page") || "{}");
  }, []);

  return (
    <div>
      <Button.Group>
        <Button type="primary" onClick={() => handleAddFullPageSection()}>
          フルページ
        </Button>
        <Button type="primary" onClick={() => handleAddColumnSection(1)}>
          1カラム
        </Button>
        <Button type="primary" onClick={() => handleAddColumnSection(2)}>
          2カラム
        </Button>
        <Button type="primary">求人検索フォーム</Button>
        <Button type="primary">求人一覧</Button>
        <Button type="primary" onClick={() => handleSave()}>
          Save
        </Button>
      </Button.Group>
      {sections.map((section) => (
        <SectionItem
          version={version}
          key={section.id}
          item={section as any}
          onAddLeaf={handleAddLeaf}
          onReorder={handleReorder}
        />
      ))}
    </div>
  );
}
