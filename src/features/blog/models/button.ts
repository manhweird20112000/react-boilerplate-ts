import { LeafComponent } from "./composite";

export class Button extends LeafComponent {
  private readonly title: string;
  private href?: string;
  constructor(id: string, title: string, href?: string) {
    super(id, "button");
    this.title = title;
    this.href = href;
  }

  setHref(href: string) {
    this.href = href;
  }

  render() {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      href: this.href,
    };
  }
}

