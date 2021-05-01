export interface ICell {
  blocked: Boolean;
  parent: null | Array<number>;
  rIndex: number;
  cIndex: number;
}
export class Cell implements ICell {
  blocked: Boolean;
  parent: null | Array<number>;
  rIndex: number;
  cIndex: number;

  constructor(
    blocked: Boolean = true,
    parent: null | Array<number> = null,
    rIndex: number,
    cIndex: number
  ) {
    this.blocked = blocked;
    this.parent = parent;
    this.rIndex = rIndex;
    this.cIndex = cIndex;
  }
}

export interface IQueue {
  items: number[];
  enqueue: (item: number) => void;
  dequeue: () => number | void;
  isEmpty: () => boolean;
}
export class Queue implements IQueue {
  items: number[];
  constructor() {
    this.items = [];
  }
  enqueue(item: number) {
    this.items.push(item);
  }
  dequeue() {
    return this.items.shift();
  }
  isEmpty() {
    return this.items.length === 0;
  }
}
