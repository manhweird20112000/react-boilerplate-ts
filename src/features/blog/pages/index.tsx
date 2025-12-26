import { useEffect, useMemo, useRef, useState } from "react";
import SectionItem from "../components/section-item";
import { Button, PageBuilder, Section } from "../models";
import { v4 as uuidv4 } from "uuid";

export default function BlogPage() {
  const mainSection = useRef<Section>(new Section(uuidv4(), "Main Section"));
  const page = useRef<PageBuilder>(null);

  const [, forceRender] = useState<number>(0);

  const sections = useMemo(() => {
    console.log(mainSection.current.getChildren());
    return mainSection.current.getChildren();
  }, [mainSection.current]);

  const sync = () => {
    forceRender((v) => v + 1);
  };

  const handleAddSection = () => {
    const columns = Math.floor(Math.random() * 3) + 1;
    const section = new Section(uuidv4(), "Section 2", columns);
    console.log(columns);
    for (let i = 0; i < columns; i++) {
      section.add(new Section(uuidv4(), `Column Section ${i + 1}`, columns));
    }
    mainSection.current.add(section);
    console.log(mainSection);
    sync();
  };

  const handleAddLeaf = (id: string) => {
    const section = mainSection.current.findById(id);
    if (section) {
      (section as Section).add(new Button(uuidv4(), "Button 1"));
      sync();
    }
  };

  useEffect(() => {
    page.current = new PageBuilder("page-1", mainSection.current);
  }, [mainSection.current]);

  return (
    <div>
      <button onClick={handleAddSection}>Add Section</button>
      {sections.map((section) => (
        <SectionItem
          key={section.id}
          item={section as Section}
          onAddLeaf={handleAddLeaf}
        />
      ))}
    </div>
  );
}
