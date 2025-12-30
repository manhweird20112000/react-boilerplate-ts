import { CompositeComponent } from "./composite";

/**
 * Section component that can contain other components.
 * Represents a container section in the page builder.
 */
export class Section extends CompositeComponent {
  private readonly title?: string;

  constructor(id: string, title?: string, maxChildren?: number) {
    super(id, "section", maxChildren);
    this.title = title;
  }

  render() {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      children: this.children.map((child) => child.render()),
    };
  }
}
