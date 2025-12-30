import { useEffect, useMemo, useRef, useState } from "react";
import { Button as ButtonBlock, Page } from "../models";
import { CompositeComponent, type Component } from "../models/composite";
import { SectionColumn } from "../models/section-column";
import { Section } from "../models/section";
import { Button } from "@arco-design/web-react";
import SectionItem from "../components/section-item";
import { v4 as uuidv4 } from "uuid";

interface SerializedComponent {
  id: string;
  type: string;
  title?: string;
  href?: string;
  children?: SerializedComponent[];
}

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
      const sectionColumn = new Section(uuidv4(), "Section Column" + i);
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

  const deserializeComponent = (data: SerializedComponent): Component => {
    if (data.type === "button") {
      return new ButtonBlock(data.id, data.title || "", data.href);
    }
    if (data.type === "section-column") {
      const component = new SectionColumn(
        data.id,
        data.title,
        data.children?.length
      );
      if (data.children) {
        for (const child of data.children) {
          const childComponent = deserializeComponent(child);
          component.add(childComponent);
        }
      }
      return component;
    }
    if (data.type === "section") {
      const component = new Section(data.id, data.title);
      if (data.children) {
        for (const child of data.children) {
          const childComponent = deserializeComponent(child);
          component.add(childComponent);
        }
      }
      return component;
    }
    if (data.type === "page") {
      const component = new Page(data.id);
      if (data.children) {
        for (const child of data.children) {
          const childComponent = deserializeComponent(child);
          if (childComponent instanceof CompositeComponent) {
            component.add(childComponent);
          }
        }
      }
      return component;
    }
    throw new Error(`Unknown component type: ${data.type}`);
  };

  const handleSave = () => {
    localStorage.setItem("page", JSON.stringify(page.current?.render()));
  };

  const handleLoad = () => {
    const savedData = localStorage.getItem("page");
    if (savedData) {
      console.log(savedData)
      try {
        const parsedData: SerializedComponent = JSON.parse(savedData);
        if (parsedData.type === "page") {
          const loadedPage = deserializeComponent(parsedData) as Page;
          page.current = loadedPage;
          console.log(page.current)
          sync();
        }
      } catch (error) {
        console.error("Failed to load page from localStorage:", error);
      }
    }
  };

  useEffect(() => {
    handleLoad();
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
