// Copyright 2015-2020 Swim inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Equivalent, Equals, Arrays} from "@swim/util"
import {Debug, Format, Output} from "@swim/codec";
import {AnyLength, Length} from "@swim/math";
import {AnyColLayout, ColLayout} from "./ColLayout";

export type AnyTableLayout = TableLayout | TableLayoutInit;

export interface TableLayoutInit {
  width?: AnyLength | null;
  left?: AnyLength | null;
  right?: AnyLength | null;
  spacing?: AnyLength | null;
  cols: AnyColLayout[];
}

export class TableLayout implements Equals, Equivalent, Debug {
  constructor(width: Length | null, left: Length | null, right: Length | null,
              spacing: AnyLength | null, cols: ReadonlyArray<ColLayout>) {
    Object.defineProperty(this, "width", {
      value: width,
      enumerable: true,
    });
    Object.defineProperty(this, "left", {
      value: left,
      enumerable: true,
    });
    Object.defineProperty(this, "right", {
      value: right,
      enumerable: true,
    });
    Object.defineProperty(this, "spacing", {
      value: spacing,
      enumerable: true,
    });
    Object.defineProperty(this, "cols", {
      value: cols,
      enumerable: true,
    });
  }

  declare readonly width: Length | null;

  declare readonly left: Length | null;

  declare readonly right: Length | null;

  declare readonly spacing: Length | null;

  declare readonly cols: ReadonlyArray<ColLayout>;

  getCol(key: string): ColLayout | null {
    const cols = this.cols;
    for (let i = 0, n = cols.length; i < n; i += 1) {
      const col = cols[i]!;
      if (key === col.key) {
        return col;
      }
    }
    return null;
  }

  resized(width: AnyLength, left?: AnyLength | null, right?: AnyLength | null,
          spacing?: AnyLength | null): TableLayout {
    width = Length.fromAny(width);
    if (left === void 0) {
      left = this.left;
    } else if (left !== null) {
      left = Length.fromAny(left);
    }
    if (right === void 0) {
      right = this.right;
    } else if (right !== null) {
      right = Length.fromAny(right);
    }
    if (spacing === void 0) {
      spacing = this.spacing;
    } else if (spacing !== null) {
      spacing = Length.fromAny(spacing);
    }
    if (Equals(this.width, width) && Equals(this.left, left) &&
        Equals(this.right, right) && Equals(this.spacing, spacing)) {
      return this;
    } else {
      const oldCols = this.cols;
      const colCount = oldCols.length;
      const newCols = new Array<ColLayout>(colCount);
      const tableWidth = width.pxValue();
      const tableLeft = left !== null ? left.pxValue(tableWidth) : 0;
      const tableRight = right !== null ? right.pxValue(tableWidth) : 0;
      const colSpacing = spacing !== null ? spacing.pxValue(tableWidth) : 0;

      let grow = 0;
      let shrink = 0;
      let optional = 0;
      let basis = tableLeft + tableRight;
      let x = tableLeft;
      for (let i = 0; i < colCount; i += 1) {
        if (i !== 0) {
          basis += colSpacing;
          x += colSpacing;
        }
        const col = oldCols[i]!;
        const colWidth = col.basis.pxValue(tableWidth);
        newCols[i] = col.resized(colWidth, x, tableWidth - colWidth - x, false);
        grow += col.grow;
        shrink += col.shrink;
        if (col.optional) {
          optional += 1;
        }
        basis += colWidth;
        x += colWidth;
      }

      if (basis > tableWidth && optional > 0) {
        // Hide optional cols as needed to fit.
        let i = colCount - 1;
        while (i >= 0 && optional > 0) {
          const col = newCols[i]!;
          const colWidth = col.width!.pxValue();
          if (col.optional) {
            newCols[i] = col.resized(0, x, tableWidth - x, true);
            grow -= col.grow;
            shrink -= col.shrink;
            optional -= 1;
            basis -= colWidth;
          }
          x -= colWidth;
          if (i !== 0) {
            basis -= colSpacing;
            x -= colSpacing;
          }

          if (basis <= tableWidth) {
            // Remaining cols now fit.
            break;
          }
          i -= 1;
        }

        // Resize trailing non-optional cols.
        i += 1;
        while (i < colCount) {
          const col = newCols[i]!;
          if (!col.optional) {
            basis += colSpacing;
            x += colSpacing;
            const colWidth = col.basis.pxValue(tableWidth);
            newCols[i] = col.resized(colWidth, x, tableWidth - colWidth - x);
            x += colWidth;
          }
          i += 1;
        }
      }

      if (basis < tableWidth && grow > 0) {
        const delta = tableWidth - basis;
        let x = tableLeft;
        let j = 0;
        for (let i = 0; i < colCount; i += 1) {
          const col = newCols[i]!;
          if (!col.hidden) {
            if (j !== 0) {
              basis += colSpacing;
              x += colSpacing;
            }
            const colBasis = col.basis.pxValue(tableWidth);
            const colWidth = colBasis + delta * (col.grow / grow);
            newCols[i] = col.resized(colWidth, x, tableWidth - colWidth - x);
            x += colWidth;
            j += 1;
          } else {
            newCols[i] = col.resized(0, x + colSpacing, tableWidth - x - colSpacing);
          }
        }
      } else if (basis > tableWidth && shrink > 0) {
        const delta = basis - tableWidth;
        let x = tableLeft;
        let j = 0;
        for (let i = 0; i < colCount; i += 1) {
          const col = newCols[i]!;
          if (!col.hidden) {
            if (j !== 0) {
              basis += colSpacing;
              x += colSpacing;
            }
            const colBasis = col.basis.pxValue(tableWidth);
            const colWidth = colBasis - delta * (col.shrink / shrink);
            newCols[i] = col.resized(colWidth, x, tableWidth - colWidth - x);
            x += colWidth;
            j += 1;
          } else {
            newCols[i] = col.resized(0, x + colSpacing, tableWidth - x - colSpacing);
          }
        }
      }

      return new TableLayout(width, left, right, spacing, newCols);
    }
  }

  equivalentTo(that: unknown, epsilon?: number): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof TableLayout) {
      const theseCols = this.cols;
      const thoseCols = that.cols;
      const n = theseCols.length;
      if (n === thoseCols.length) {
        for (let i = 0; i < n; i += 1) {
          if (!theseCols[i]!.equivalentTo(thoseCols[i]!, epsilon)) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }

  equals(that: unknown): boolean {
    if (this === that) {
      return true;
    } else if (that instanceof TableLayout) {
      return Equals(this.width, that.width) && Equals(this.left, that.left)
          && Equals(this.right, that.right) && Equals(this.spacing, that.spacing)
          && Arrays.equal(this.cols, that.cols);
    }
    return false;
  }

  debug(output: Output): void {
    output = output.write("TableLayout").write(46/*'.'*/).write("of").write(40/*'('*/)
    for (let i = 0, n = this.cols.length; i < n; i += 1) {
      if (i !== 0) {
        output = output.write(", ");
      }
      output = output.debug(this.cols[i]!);
    }
    output = output.write(41/*')'*/);
    if (this.width !== null || this.left !== null || this.right !== null || this.spacing !== null) {
      output = output.write(46/*'.'*/).write("resized").write(40/*'('*/)
          .debug(this.width).write(", ").debug(this.left).write(", ")
          .debug(this.right).write(", ").debug(this.spacing).write(41/*')'*/);
    }
  }

  toString(): string {
    return Format.debug(this);
  }

  static of(...tableCols: AnyColLayout[]): TableLayout {
    const n = tableCols.length;
    const cols = new Array<ColLayout>(n);
    for (let i = 0; i < n; i += 1) {
      cols[i] = ColLayout.fromAny(tableCols[i]!);
    }
    return new TableLayout(null, null, null, null, cols);
  }

  static create(cols: ReadonlyArray<ColLayout>): TableLayout {
    return new TableLayout(null, null, null, null, cols);
  }

  static fromAny(value: AnyTableLayout): TableLayout {
    if (value instanceof TableLayout) {
      return value;
    } else if (typeof value === "object" && value !== null) {
      return TableLayout.fromInit(value);
    }
    throw new TypeError("" + value);
  }

  static fromInit(init: TableLayoutInit): TableLayout {
    let width = init.width;
    if (width !== void 0 && width !== null) {
      width = Length.fromAny(width);
    } else {
      width = null;
    }
    let left = init.left;
    if (left !== void 0 && left !== null) {
      left = Length.fromAny(left);
    } else {
      left = null;
    }
    let right = init.right;
    if (right !== void 0 && right !== null) {
      right = Length.fromAny(right);
    } else {
      right = null;
    }
    let spacing = init.spacing;
    if (spacing !== void 0 && spacing !== null) {
      spacing = Length.fromAny(spacing);
    } else {
      spacing = null;
    }
    const colCount = init.cols.length;
    const cols = new Array<ColLayout>(colCount);
    for (let i = 0; i < colCount; i += 1) {
      cols[i] = ColLayout.fromAny(init.cols[i]!);
    }
    return new TableLayout(width, left, right, spacing, cols);
  }
}
