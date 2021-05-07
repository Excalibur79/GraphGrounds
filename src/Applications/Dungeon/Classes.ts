export interface ICell {
  blocked: Boolean;
  parent: null | Array<number>;
  rIndex: number;
  cIndex: number;
  image: String;
}
export class Cell implements ICell {
  blocked: Boolean;
  parent: null | Array<number>;
  rIndex: number;
  cIndex: number;
  image: String;

  constructor(
    blocked: Boolean = true,
    parent: null | Array<number> = null,
    rIndex: number,
    cIndex: number,
    image: String = ''
  ) {
    this.blocked = blocked;
    this.parent = parent;
    this.rIndex = rIndex;
    this.cIndex = cIndex;
    this.image = image;
  }
}

export interface IQueue {
  items: ICell[];
  enqueue: (item: ICell) => void;
  dequeue: () => ICell | void;
  isEmpty: () => boolean;
}
export class Queue implements IQueue {
  items: ICell[];
  constructor() {
    this.items = [];
  }
  enqueue(item: ICell) {
    this.items.push(item);
  }
  dequeue() {
    return this.items.shift();
  }
  isEmpty() {
    return this.items.length === 0;
  }
}
