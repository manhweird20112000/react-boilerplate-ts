import type { Component } from "./composite";

/**
 * PageBuilder class for building and managing page component trees.
 * Provides methods to manipulate and serialize the page structure.
 */
export class PageBuilder {
  private readonly id: string;
  private root: Component;

  constructor(id: string, root: Component) {
    this.id = id;
    this.root = root;
  }

  /**
   * Gets the page ID.
   */
  getId(): string {
    return this.id;
  }

  /**
   * Gets the root component of the page.
   */
  getRoot(): Component {
    return this.root;
  }

  /**
   * Sets a new root component for the page.
   */
  setRoot(root: Component): void {
    this.root = root;
  }

  /**
   * Renders the entire page structure as a JSON object.
   */
  toJSON() {
    return {
      id: this.id,
      root: this.root.render(),
    };
  }

  /**
   * @deprecated Use toJSON() instead
   */
  getJSON() {
    return this.root.render();
  }
}
