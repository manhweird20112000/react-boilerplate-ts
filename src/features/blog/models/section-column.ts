import { CompositeComponent, type Component } from "./composite";

export class SectionColumn extends CompositeComponent {
  private readonly title?: string;

  constructor(id: string, title?: string, maxChildren?: number) {
    super(id, "section-column", maxChildren);
    this.title = title;
  }

  getTitle(): string | undefined {
    return this.title;
  }

  render() {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      children: this.children.map((child) => child.render()),
    };
  }

  findById(componentId: string): Component | undefined {
    return this.children.find((child) => child.id === componentId);
  }
}
