import { type Section } from "../models";
import classNames from "classnames";
import { Button } from "@arco-design/web-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { SortableItem } from "./sortable-item";

export default function SectionItem({
  item,
  onAddLeaf,
}: {
  item: Section;
  onAddLeaf: (id: string) => void;
}) {
  const [items, setItems] = useState(
    item.getChildren().map((child) => child.id)
  );

  useEffect(() => {
    console.log("CHANGED");
  }, [item]);
  return (
    <div>
      {JSON.stringify(item)}
      <div
        className={classNames("grid grid-cols-1", {
          "md:grid-cols-2": item.maxChildren === 2,
          "md:grid-cols-3": item.maxChildren === 3,
        })}
      >
        {item.getChildren().map((child) => (
          <div key={child.id} className="bg-gray-100 p-4">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                console.log(event);
              }}
            >
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                {items.map((id) => (
                  <SortableItem key={id} id={id}>
                    {child.render().title}
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        ))}
      </div>
      <Button type="primary" onClick={() => onAddLeaf(item.id)}>
        Add Leaf
      </Button>
    </div>
  );
}
