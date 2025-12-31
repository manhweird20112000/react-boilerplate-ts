import { Button } from "./button";
import { CompositeComponent } from "./composite";
import { Section } from "./section";
import { SectionColumn } from "./section-column";

export interface SerializedComponent {
  id: string;
  type: string;
  title?: string;
  [key: string]: any;
  children?: SerializedComponent[];
}

export class Page extends CompositeComponent {
  constructor(id: string) {
    super(id, "page");
  }

  static load(data: SerializedComponent) {
    if (data.type === "button") {
      return new Button(data.id, data.title || "", data.href);
    }
    if (data.type === "section-column") {
      const component = new SectionColumn(
        data.id,
        data.title,
        data.children?.length
      );
      if (data.children) {
        for (const child of data.children) {
          const childComponent = this.load(child);
          component.add(childComponent);
        }
      }
      return component;
    }
    if (data.type === "section") {
      const component = new Section(data.id, data.title);
      if (data.children) {
        for (const child of data.children) {
          const childComponent = this.load(child);
          component.add(childComponent);
        }
      }
      return component;
    }
    if (data.type === "page") {
      const component = new Page(data.id);
      if (data.children) {
        for (const child of data.children) {
          const childComponent = this.load(child);
          if (childComponent instanceof CompositeComponent) {
            component.add(childComponent);
          }
        }
      }
      return component;
    }
    throw new Error(`Unknown component type: ${data.type}`);
  }

  render() {
    return {
      id: this.id,
      type: this.type,
      children: this.children.map((child) => child.render()),
    };
  }
}
