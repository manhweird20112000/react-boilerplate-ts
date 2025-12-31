import { useContext, useEffect, useMemo } from "react";
import SectionItem from "./section-item";
import { Button } from "@arco-design/web-react";
import { v4 as uuidv4 } from "uuid";
import { SectionColumn, Section, Button as ButtonBlock, Page } from "../models";
import { PageContext, PageDispatchContext } from "./page.provider";

export function PageBuilder() {
  const { page, version } = useContext(PageContext);
  const dispatch = useContext(PageDispatchContext);

  const sections = useMemo(() => {
    return page.getChildren();
  }, [page, version]);

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
    page.add(block);
    dispatch({ type: "UPDATE_VERSION" });
  };

  const handleAddFullPageSection = () => {
    handleAddColumnSection(1, true);
  };

  const handleSave = () => {
    localStorage.setItem("page", JSON.stringify(page.render()));
  };

  const handleLoad = () => {
    const savedData = localStorage.getItem("page");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      dispatch({ type: "LOAD_PAGE", payload: Page.load(parsedData) });
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
        <SectionItem key={section.id} item={section as any} />
      ))}
    </div>
  );
}
