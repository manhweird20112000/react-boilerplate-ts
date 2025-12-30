import { CompositeComponent } from "./composite";

export class Page extends CompositeComponent {
  constructor(id: string) {
    super(id, "page");
  }

  render() {
    return {
      id: this.id,
      type: this.type,
      children: this.children.map((child) => child.render()),
    };
  }
}
