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
    throw new Error("Method not implemented.");
  }

  findById(componentId: string): Component | undefined {
    return this.children.find((child) => child.id === componentId);
  }
}
