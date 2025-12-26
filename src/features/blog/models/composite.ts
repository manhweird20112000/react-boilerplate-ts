/**
 * Base interface for all page builder components.
 * Both composite and leaf components must implement this interface.
 */
export interface Component {
  readonly id: string;
  readonly type: string;
  render(): any;
}

/**
 * Abstract class for composite components that can contain children.
 * Implements the Composite pattern to build hierarchical structures.
 */
export abstract class CompositeComponent implements Component {
  readonly id: string;
  readonly type: string;
  readonly maxChildren?: number;
  protected children: Component[] = [];

  constructor(id: string, type: string, maxChildren?: number) {
    this.id = id;
    this.type = type;
    this.maxChildren = maxChildren;
  }

  /**
   * Adds a child component to this composite.
   * @throws Error if maximum number of children is reached
   */
  add(component: Component): void {
    if (this.maxChildren && this.children.length >= this.maxChildren) {
      throw new Error(
        `Maximum number of children (${this.maxChildren}) reached for component ${this.id}`
      );
    }
    this.children.push(component);
  }

  /**
   * Removes a child component from this composite.
   */
  remove(component: Component): void {
    this.children = this.children.filter((child) => child.id !== component.id);
  }

  /**
   * Removes a child component by its ID.
   */
  removeById(componentId: string): void {
    this.children = this.children.filter((child) => child.id !== componentId);
  }

  /**
   * Returns all children components.
   */
  getChildren(): readonly Component[] {
    return this.children;
  }

  /**
   * Finds a child component by its ID.
   */
  findById(componentId: string): Component | undefined {
    return this.children.find((child) => child.id === componentId);
  }

  /**
   * Checks if this composite has any children.
   */
  isEmpty(): boolean {
    return this.children.length === 0;
  }

  /**
   * Gets the current number of children.
   */
  getChildrenCount(): number {
    return this.children.length;
  }

  abstract render(): any;
}

/**
 * Abstract class for leaf components that cannot contain children.
 * Represents the terminal nodes in the component tree.
 */
export abstract class LeafComponent implements Component {
  readonly id: string;
  readonly type: string;

  constructor(id: string, type: string) {
    this.id = id;
    this.type = type;
  }

  abstract render(): any;
}
