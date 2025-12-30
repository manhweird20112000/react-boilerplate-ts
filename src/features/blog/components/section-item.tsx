import { type Section } from "../models";

import { useEffect, useState } from "react";

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

interface SectionItemColumnProps {
  item: SectionColumn;
  version: number;
  onAddLeaf?: (sectionId: string, columnId: string) => void;
  onReorder?: (columnId: string, orderedIds: string[]) => void;
}

interface ColumnItemContentProps {
  item: Section;
  version: number;
  parentId: string;
  onAddLeaf?: (sectionId: string, columnId: string) => void;
  onReorder?: (columnId: string, orderedIds: string[]) => void;
}

export default function SectionItem({
  item,
  version,
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
              version={version}
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
  version,
  onAddLeaf,
  onReorder,
}: ColumnItemContentProps) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(item.getChildren().map((child) => child.id));
  }, [version, item]);

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
      <Button
        type="primary"
        onClick={() => {
          onAddLeaf?.(parentId, item.id);
        }}
      >
        Add Leaf
      </Button>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((id) => (
            <SortableItem key={id} id={id}>
              <Card
                style={{ cursor: "move" }}
                bodyStyle={{ padding: 0 }}
                headerStyle={{ border: 0 }}
                title={id}
              ></Card>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
