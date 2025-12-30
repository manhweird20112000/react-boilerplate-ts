import { LeafComponent } from "./composite";

export class Button extends LeafComponent {
  private title: string;
  private href?: string;
  constructor(id: string, title: string, href?: string) {
    super(id, "button");
    this.title = title;
    this.href = href;
  }

  setHref(href: string) {
    this.href = href;
  }

  setTitle(title: string) {
    this.title = title;
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

