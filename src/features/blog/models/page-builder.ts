import { CompositeComponent } from "./composite";

export class Page extends CompositeComponent {
  constructor(id: string) {
    super(id, "page");
  }

  render() {
    throw new Error("Method not implemented.");
  }
}
