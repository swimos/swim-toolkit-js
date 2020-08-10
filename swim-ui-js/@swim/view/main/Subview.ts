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

import {__extends} from "tslib";
import {FromAny} from "@swim/util";
import {ViewConstructor, View} from "./View";
import {ViewObserverType} from "./ViewObserver";
import {SubviewObserver} from "./SubviewObserver";
import {NodeView} from "./node/NodeView";

export type SubviewMemberType<V, K extends keyof V> =
  V extends {[P in K]: Subview<any, infer S, any>} ? S : unknown;

export type SubviewMemberInit<V, K extends keyof V> =
  V extends {[P in K]: Subview<any, infer T, infer U>} ? T | U : unknown;

export interface SubviewInit<S extends View, U = S> {
  extends?: SubviewPrototype;
  observe?: boolean;
  type?: unknown;

  willSetSubview?(newSubview: S | null, oldSubview: S | null): void;
  onSetSubview?(newSubview: S | null, oldSubview: S | null): void;
  didSetSubview?(newSubview: S | null, oldSubview: S | null): void;
  createSubview?(): S | U | null;
  fromAny?(value: S | U): S | null;
}

export type SubviewDescriptorInit<V extends View, S extends View, U = S, I = ViewObserverType<S>> = SubviewInit<S, U> & ThisType<Subview<V, S, U> & I> & I;

export type SubviewDescriptorExtends<V extends View, S extends View, U = S, I = ViewObserverType<S>> = {extends: SubviewPrototype} & SubviewDescriptorInit<V, S, U, I>;

export type SubviewDescriptorFromAny<V extends View, S extends View, U = S, I = ViewObserverType<S>> = ({type: FromAny<S, U>} | {fromAny(value: S | U): S | null}) & SubviewDescriptorInit<V, S, U, I>;

export type SubviewDescriptor<V extends View, S extends View, U = S, I = ViewObserverType<S>> =
  U extends S ? SubviewDescriptorInit<V, S, U, I> :
  SubviewDescriptorFromAny<V, S, U, I>;

export type SubviewPrototype = Function & {prototype: Subview<any, any>};

export type SubviewConstructor<V extends View, S extends View, U = S> = {
  new(view: V, subviewName: string | undefined): Subview<V, S, U>;
  prototype: Subview<any, any, any>;
}

export declare abstract class Subview<V extends View, S extends View, U = S> {
  /** @hidden */
  _view: V;
  /** @hidden */
  _subview: S | null;

  constructor(view: V, subviewName: string | undefined);

  /** @hidden */
  readonly type?: unknown;

  get name(): string;

  get view(): V;

  get subview(): S | null;

  getSubview(): S;

  setSubview(subview: S | U | null): void;

  /** @hidden */
  doSetSubview(newSubview: S | null): void;

  /** @hidden */
  willSetSubview(newSubview: S | null, oldSubview: S | null): void;

  /** @hidden */
  onSetSubview(newSubview: S | null, oldSubview: S | null): void;

  /** @hidden */
  didSetSubview(newSubview: S | null, oldSubview: S | null): void;

  /** @hidden */
  willSetOwnSubview(newSubview: S | null, oldSubview: S | null): void;

  /** @hidden */
  onSetOwnSubview(newSubview: S | null, oldSubview: S | null): void;

  /** @hidden */
  didSetOwnSubview(newSubview: S | null, oldSubview: S | null): void;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;

  insert(parentView?: View): void;

  remove(): void;

  createSubview(): S | U | null;

  fromAny(value: S | U): S | null;

  static define<V extends View, S extends View = View, U = S, I = ViewObserverType<S>>(descriptor: SubviewDescriptorExtends<V, S, U, I>): SubviewConstructor<V, S, U>;
  static define<V extends View, S extends View = View, U = S>(descriptor: SubviewDescriptor<V, S, U>): SubviewConstructor<V, S, U>;

  // Forward type declarations
  /** @hidden */
  static Observer: typeof SubviewObserver; // defined by SubviewObserver
}

export interface Subview<V extends View, S extends View, U = S> {
  (): S | null;
  (subview: S | U | null): V;
}

export function Subview<V extends View, S extends View = View, U = S, I = ViewObserverType<S>>(descriptor: SubviewDescriptorExtends<V, S, U, I>): PropertyDecorator;
export function Subview<V extends View, S extends View = View, U = S>(descriptor: SubviewDescriptor<V, S, U>): PropertyDecorator;

export function Subview<V extends View, S extends View, U>(
    this: Subview<V, S> | typeof Subview,
    view: V | SubviewDescriptor<V, S, U>,
    subviewName?: string,
  ): Subview<V, S> | PropertyDecorator {
  if (this instanceof Subview) { // constructor
    return SubviewConstructor.call(this, view as V, subviewName);
  } else { // decorator factory
    return SubviewDecoratorFactory(view as SubviewDescriptor<V, S, U>);
  }
}
__extends(Subview, Object);
View.Subview = Subview;

function SubviewConstructor<V extends View, S extends View, U>(this: Subview<V, S, U>, view: V, subviewName: string | undefined): Subview<V, S, U> {
  if (subviewName !== void 0) {
    Object.defineProperty(this, "name", {
      value: subviewName,
      enumerable: true,
      configurable: true,
    });
  }
  this._view = view;
  this._subview = null;
  return this;
}

function SubviewDecoratorFactory<V extends View, S extends View, U>(descriptor: SubviewDescriptor<V, S, U>): PropertyDecorator {
  return View.decorateSubview.bind(View, Subview.define(descriptor));
}

Object.defineProperty(Subview.prototype, "view", {
  get: function <V extends View>(this: Subview<V, View>): V {
    return this._view;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(Subview.prototype, "subview", {
  get: function <S extends View>(this: Subview<View, S>): S | null {
    return this._subview;
  },
  enumerable: true,
  configurable: true,
});

Subview.prototype.getSubview = function <S extends View>(this: Subview<View, S>): S {
  const subview = this.subview;
  if (subview === null) {
    throw new TypeError("null " + this.name + " subview");
  }
  return subview;
};

Subview.prototype.setSubview = function <S extends View, U>(this: Subview<View, S, U>,
                                                            subview: S | U | null): void {
  if (subview !== null) {
    subview = this.fromAny(subview);
  }
  this._view.setChildView(this.name, subview as S | null);
};

Subview.prototype.doSetSubview = function <S extends View>(this: Subview<View, S>,
                                                           newSubview: S | null): void {
  const oldSubview = this._subview;
  if (oldSubview !== newSubview) {
    this.willSetOwnSubview(newSubview, oldSubview);
    this.willSetSubview(newSubview, oldSubview);
    this._subview = newSubview;
    this.onSetOwnSubview(newSubview, oldSubview);
    this.onSetSubview(newSubview, oldSubview);
    this.didSetSubview(newSubview, oldSubview);
    this.didSetOwnSubview(newSubview, oldSubview);
  }
};

Subview.prototype.willSetSubview = function <S extends View>(this: Subview<View, S>,
                                                             newSubview: S | null,
                                                             oldSubview: S | null): void {
  // hook
};

Subview.prototype.onSetSubview = function <S extends View>(this: Subview<View, S>,
                                                           newSubview: S | null,
                                                           oldSubview: S | null): void {
  // hook
};

Subview.prototype.didSetSubview = function <S extends View>(this: Subview<View, S>,
                                                            newSubview: S | null,
                                                            oldSubview: S | null): void {
  // hook
};

Subview.prototype.willSetOwnSubview = function <S extends View>(this: Subview<View, S>,
                                                                newSubview: S | null,
                                                                oldSubview: S | null): void {
  // hook
};

Subview.prototype.onSetOwnSubview = function <S extends View>(this: Subview<View, S>,
                                                              newSubview: S | null,
                                                              oldSubview: S | null): void {
  // hook
};

Subview.prototype.didSetOwnSubview = function <S extends View>(this: Subview<View, S>,
                                                               newSubview: S | null,
                                                               oldSubview: S | null): void {
  // hook
};

Subview.prototype.mount = function (this: Subview<View, View>): void {
  // hook
};

Subview.prototype.unmount = function (this: Subview<View, View>): void {
  // hook
};

Subview.prototype.insert = function (this: Subview<View, View>, parentView?: View): void {
  let subview = this._subview;
  if (subview === null) {
    subview = this.createSubview();
  }
  if (subview !== null) {
    if (parentView === void 0) {
      parentView = this._view;
    }
    if (subview.parentView !== parentView) {
      parentView.setChildView(this.name, subview);
    }
    if (this._subview === null) {
      this.doSetSubview(subview);
    }
  }
};

Subview.prototype.remove = function (this: Subview<View, View>): void {
  const subview = this._subview;
  if (subview !== null) {
    subview.remove();
  }
};

Subview.prototype.createSubview = function <S extends View, U>(this: Subview<View, S, U>): S | U | null {
  const type = this.type;
  if (typeof type === "function" && type.prototype instanceof View) {
    return View.create(type as ViewConstructor) as S;
  }
  return null;
};

Subview.prototype.fromAny = function <S extends View, U>(this: Subview<View, S, U>, value: S | U): S | null {
  if (value instanceof Node) {
    const type = this.type;
    if (typeof type === "function" && type.prototype instanceof NodeView) {
      return new (type as {new(node: Node): S})(value);
    } else {
      return View.fromNode(value) as unknown as S | null;
    }
  }
  return value as S | null;
};

Subview.define = function <V extends View, S extends View, U>(descriptor: SubviewDescriptor<V, S, U>): SubviewConstructor<V, S, U> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    if (descriptor.observe !== false) {
      _super = Subview.Observer;
    } else {
      _super = Subview;
    }
  }

  const _constructor = function SubviewAccessor(this: Subview<V, S>, view: V, subviewName: string | undefined): Subview<V, S, U> {
    let _this: Subview<V, S, U> = function accessor(subview?: S | U | null): S | null | V {
      if (subview === void 0) {
        return _this._subview;
      } else {
        _this.setSubview(subview);
        return _this._view;
      }
    } as Subview<V, S, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, view, subviewName) || _this;
    return _this;
  } as unknown as SubviewConstructor<V, S, U>;

  const _prototype = descriptor as unknown as Subview<V, S, U>;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  return _constructor;
};
