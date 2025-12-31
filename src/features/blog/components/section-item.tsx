import { CompositeComponent, type Section } from "../models";

import { useContext, useEffect, useState } from "react";

import classNames from "classnames";
import { Button, Card } from "@arco-design/web-react";
import type { SectionColumn } from "../models/section-column";
import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { SortableItem } from "./sortable-item";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { PageContext, PageDispatchContext } from "./page.provider";
import { Button as ButtonBlock } from "../models";
import { v4 as uuidv4 } from "uuid";

interface SectionItemColumnProps {
  item: SectionColumn;
  onAddLeaf?: (sectionId: string, columnId: string) => void;
  onReorder?: (columnId: string, orderedIds: string[]) => void;
}

interface ColumnItemContentProps {
  item: Section;
  parentId: string;
  onAddLeaf?: (sectionId: string, columnId: string) => void;
  onReorder?: (columnId: string, orderedIds: string[]) => void;
}

export default function SectionItem({
  item,
  onAddLeaf,
  onReorder,
}: SectionItemColumnProps) {
  return (
    <Card title={item.getTitle()}>
      <div
        className={classNames("grid grid-cols-1", {
          "md:grid-cols-2": item.maxChildren === 2,
          "md:grid-cols-3": item.maxChildren === 3,
        })}
      >
        {item.getChildren().map((child: any, key: number) => (
          <div key={key}>
            <SectionItemContentColumn
              item={child}
              parentId={item.id}
              onAddLeaf={onAddLeaf}
              onReorder={onReorder}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function SectionItemContentColumn({
  item,
  parentId,
  onReorder,
}: ColumnItemContentProps) {
  const { page, version } = useContext(PageContext);
  const dispatch = useContext(PageDispatchContext);

  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    console.log(version);
    console.log(page);
    setItems(item.getChildren().map((child) => child.id));
  }, [page, version, item.id]);

  const addLeaf = () => {
    const section = page?.findById(parentId);
    if (section instanceof CompositeComponent) {
      const column = section.findById(item.id);
      if (column instanceof CompositeComponent) {
        column.add(new ButtonBlock(uuidv4(), "ボタン1"));
        dispatch({ type: "UPDATE_VERSION" });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);
      onReorder?.(item.id, newItems);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={addLeaf}>
        Add Leaf
      </Button>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((id) => {
            return (
              <SortableItem key={id} id={id}>
                {({
                  attributes,
                  listeners,
                }: {
                  attributes: any;
                  listeners: any;
                }) => (
                  <div>
                    <div {...attributes} {...listeners}>
                      <Card
                        style={{ cursor: "move" }}
                        bodyStyle={{ padding: 0 }}
                        headerStyle={{ border: 0 }}
                        title={item.findById(id)?.render().title || ""}
                      ></Card>
                    </div>
                    <Button onClick={() => console.log(id)}>set title</Button>
                  </div>
                )}
              </SortableItem>
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}
