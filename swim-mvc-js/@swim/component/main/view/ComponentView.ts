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
import {ViewFactory, View, ViewObserverType} from "@swim/view";
import {NodeView} from "@swim/dom";
import {Component} from "../Component";

export type ComponentViewMemberType<C, K extends keyof C> =
  C extends {[P in K]: ComponentView<any, infer V, any>} ? V : unknown;

export type ComponentViewMemberInit<V, K extends keyof V> =
  V extends {[P in K]: ComponentView<any, infer V, infer U>} ? V | U : unknown;

export interface ComponentViewInit<V extends View, U = never> {
  extends?: ComponentViewClass;
  observe?: boolean;
  type?: ViewFactory<V, U>;

  willSetView?(newView: V | null, oldView: V | null): void;
  onSetView?(newView: V | null, oldView: V | null): void;
  didSetView?(newView: V | null, oldView: V | null): void;
  createView?(): V | U | null;
  insertView?(parentView: View, childView: V, key: string | undefined): void;
  fromAny?(value: V | U): V | null;
}

export type ComponentViewDescriptor<C extends Component, V extends View, U = never, I = ViewObserverType<V>> = ComponentViewInit<V, U> & ThisType<ComponentView<C, V, U> & I> & I;

export type ComponentViewDescriptorExtends<C extends Component, V extends View, U = never, I = ViewObserverType<V>> = {extends: ComponentViewClass | undefined} & ComponentViewDescriptor<C, V, U, I>;

export type ComponentViewDescriptorFromAny<C extends Component, V extends View, U = never, I = ViewObserverType<V>> = ({type: FromAny<V, U>} | {fromAny(value: V | U): V | null}) & ComponentViewDescriptor<C, V, U, I>;

export interface ComponentViewConstructor<C extends Component, V extends View, U = never, I = ViewObserverType<V>> {
  new(owner: C, viewName: string | undefined): ComponentView<C, V, U> & I;
  prototype: ComponentView<any, any, any> & I;
}

export interface ComponentViewClass extends Function {
  readonly prototype: ComponentView<any, any, any>;
}

export declare abstract class ComponentView<C extends Component, V extends View, U = never> {
  /** @hidden */
  _owner: C;
  /** @hidden */
  _view: V | null;
  /** @hidden */
  _auto: boolean;

  constructor(owner: C, viewName: string | undefined);

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  readonly type?: ViewFactory<V>;

  readonly tag?: string;

  get name(): string;

  get owner(): C;

  get view(): V | null;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  getView(): V;

  setView(newView: V | U | null): void;

  /** @hidden */
  willSetView(newView: V | null, oldView: V | null): void;

  /** @hidden */
  onSetView(newView: V | null, oldView: V | null): void;

  /** @hidden */
  didSetView(newView: V | null, oldView: V | null): void;

  setAutoView(view: V | U | null): void;

  /** @hidden */
  setOwnView(view: V | U | null): void;

  /** @hidden */
  willSetOwnView(newView: V | null, oldView: V | null): void;

  /** @hidden */
  onSetOwnView(newView: V | null, oldView: V | null): void;

  /** @hidden */
  didSetOwnView(newView: V | null, oldView: V | null): void;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;

  insert(parentView: View, key?: string | null): V | null;

  remove(): V | null;

  createView(): V | U | null;

  /** @hidden */
  insertView(parentView: View, childView: V, key: string | undefined): void;

  fromAny(value: V | U): V | null;

  static define<C extends Component, V extends View = View, U = never, I = ViewObserverType<V>>(descriptor: ComponentViewDescriptorExtends<C, V, U, I>): ComponentViewConstructor<C, V, U, I>;
  static define<C extends Component, V extends View = View, U = never>(descriptor: ComponentViewDescriptor<C, V, U>): ComponentViewConstructor<C, V, U>;
}

export interface ComponentView<C extends Component, V extends View, U = never> {
  (): V | null;
  (view: V | U | null): C;
}

export function ComponentView<C extends Component, V extends View = View, U = never, I = ViewObserverType<V>>(descriptor: ComponentViewDescriptorExtends<C, V, U, I>): PropertyDecorator;
export function ComponentView<C extends Component, V extends View = View, U = never>(descriptor: ComponentViewDescriptor<C, V, U>): PropertyDecorator;

export function ComponentView<C extends Component, V extends View = View, U = never>(
    this: ComponentView<C, V, U> | typeof ComponentView,
    owner: C | ComponentViewDescriptor<C, V, U>,
    viewName?: string,
  ): ComponentView<C, V, U> | PropertyDecorator {
  if (this instanceof ComponentView) { // constructor
    return ComponentViewConstructor.call(this as unknown as ComponentView<Component, View, unknown>, owner as C, viewName);
  } else { // decorator factory
    return ComponentViewDecoratorFactory(owner as ComponentViewDescriptor<C, V, U>);
  }
}
__extends(ComponentView, Object);
Component.View = ComponentView;

function ComponentViewConstructor<C extends Component, V extends View, U>(this: ComponentView<C, V, U>, owner: C, viewName: string | undefined): ComponentView<C, V, U> {
  if (viewName !== void 0) {
    Object.defineProperty(this, "name", {
      value: viewName,
      enumerable: true,
      configurable: true,
    });
  }
  this._owner = owner;
  this._view = null;
  this._auto = true;
  return this;
}

function ComponentViewDecoratorFactory<C extends Component, V extends View, U>(descriptor: ComponentViewDescriptor<C, V, U>): PropertyDecorator {
  return Component.decorateComponentView.bind(Component, ComponentView.define(descriptor as ComponentViewDescriptor<Component, View>));
}

Object.defineProperty(ComponentView.prototype, "owner", {
  get: function <C extends Component>(this: ComponentView<C, View>): C {
    return this._owner;
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(ComponentView.prototype, "view", {
  get: function <V extends View>(this: ComponentView<Component, V>): V | null {
    return this._view;
  },
  enumerable: true,
  configurable: true,
});

ComponentView.prototype.isAuto = function (this: ComponentView<Component, View>): boolean {
  return this._auto;
};

ComponentView.prototype.setAuto = function (this: ComponentView<Component, View>,
                                            auto: boolean): void {
  this._auto = auto;
};

ComponentView.prototype.getView = function <V extends View>(this: ComponentView<Component, V>): V {
  const view = this.view;
  if (view === null) {
    throw new TypeError("null " + this.name + " view");
  }
  return view;
};

ComponentView.prototype.setView = function <V extends View, U>(this: ComponentView<Component, V, U>,
                                                               view: V | U | null): void {
  this._auto = false;
  this.setOwnView(view);
};

ComponentView.prototype.willSetView = function <V extends View>(this: ComponentView<Component, V>,
                                                                newView: V | null,
                                                                oldView: V | null): void {
  // hook
};

ComponentView.prototype.onSetView = function <V extends View>(this: ComponentView<Component, V>,
                                                              newView: V | null,
                                                              oldView: V | null): void {
  // hook
};

ComponentView.prototype.didSetView = function <V extends View>(this: ComponentView<Component, V>,
                                                               newView: V | null,
                                                               oldView: V | null): void {
  // hook
};

ComponentView.prototype.setAutoView = function <V extends View, U>(this: ComponentView<Component, V, U>,
                                                                   view: V | U | null): void {
  if (this._auto === true) {
    this.setOwnView(view);
  }
};

ComponentView.prototype.setOwnView = function <V extends View, U>(this: ComponentView<Component, V, U>,
                                                                  newView: V | U | null): void {
  if (newView instanceof NodeView && newView.isMounted() ||
      newView instanceof Node && NodeView.isNodeMounted(newView) && NodeView.isRootView(newView)) {
    this._owner.mount();
  }
  const oldView = this._view;
  if (newView !== null) {
    newView = this.fromAny(newView);
  }
  if (oldView !== newView) {
    this.willSetOwnView(newView as V | null, oldView);
    this.willSetView(newView as V | null, oldView);
    this._view = newView as V | null;
    this.onSetOwnView(newView as V | null, oldView);
    this.onSetView(newView as V | null, oldView);
    this.didSetView(newView as V | null, oldView);
    this.didSetOwnView(newView as V | null, oldView);
  }
};

ComponentView.prototype.willSetOwnView = function <V extends View>(this: ComponentView<Component, V>,
                                                                   newView: V | null,
                                                                   oldView: V | null): void {
  this._owner.willSetComponentView(this, newView, oldView);
};

ComponentView.prototype.onSetOwnView = function <V extends View>(this: ComponentView<Component, V>,
                                                                 newView: V | null,
                                                                 oldView: V | null): void {
  this._owner.onSetComponentView(this, newView, oldView);
  if (this.observe === true && this._owner.isMounted()) {
    if (oldView !== null) {
      oldView.removeViewObserver(this as ViewObserverType<V>);
    }
    if (newView !== null) {
      newView.addViewObserver(this as ViewObserverType<V>);
    }
  }
};

ComponentView.prototype.didSetOwnView = function <V extends View>(this: ComponentView<Component, V>,
                                                                  newView: V | null,
                                                                  oldView: V | null): void {
  this._owner.didSetComponentView(this, newView, oldView);
};

ComponentView.prototype.mount = function <V extends View>(this: ComponentView<Component, V>): void {
  const view = this._view;
  if (view !== null && this.observe === true) {
    view.addViewObserver(this as ViewObserverType<V>);
  }
};

ComponentView.prototype.unmount = function <V extends View>(this: ComponentView<Component, V>): void {
  const view = this._view;
  if (view !== null && this.observe === true) {
    view.removeViewObserver(this as ViewObserverType<V>);
  }
};

ComponentView.prototype.insert = function <V extends View>(this: ComponentView<Component, V>,
                                                           parentView: View,
                                                           key?: string | null): V | null {
  let view = this._view;
  if (view === null) {
    view = this.createView();
  }
  if (view !== null) {
    if (key === void 0) {
      key = this.name;
    } else if (key === null) {
      key = void 0;
    }
    if (view.parentView !== parentView || view.key !== key) {
      this.insertView(parentView, view, key);
    }
    if (this._view === null) {
      this.setView(view);
    }
  }
  return view;
};

ComponentView.prototype.remove = function <V extends View>(this: ComponentView<Component, V>): V | null {
  const view = this._view;
  if (view !== null) {
    view.remove();
  }
  return view;
};

ComponentView.prototype.createView = function <V extends View, U>(this: ComponentView<Component, V, U>): V | U | null {
  const type = this.type;
  if (type !== void 0) {
    return type.create();
  }
  return null;
};

ComponentView.prototype.insertView = function <V extends View>(this: ComponentView<Component, V>,
                                                               parentView: View, childView: V,
                                                               key: string | undefined): void {
  if (key !== void 0) {
    parentView.setChildView(key, childView);
  } else {
    parentView.appendChildView(childView);
  }
}

ComponentView.prototype.fromAny = function <V extends View, U>(this: ComponentView<Component, V, U>,
                                                               value: V | U): V | null {
  const type = this.type;
  if (FromAny.is<V, U>(type)) {
    return type.fromAny(value);
  } else if (value instanceof View) {
    return value;
  }
  return null;
};

ComponentView.define = function <C extends Component, V extends View, U, I>(descriptor: ComponentViewDescriptor<C, V, U, I>): ComponentViewConstructor<C, V, U, I> {
  let _super = descriptor.extends;
  delete descriptor.extends;

  if (_super === void 0) {
    _super = ComponentView;
  }

  const _constructor = function ComponentViewAccessor(this: ComponentView<C, V, U>, owner: C, viewName: string | undefined): ComponentView<C, V, U> {
    let _this: ComponentView<C, V, U> = function accessor(view?: V | null): V | null | C {
      if (view === void 0) {
        return _this._view;
      } else {
        _this.setView(view);
        return _this._owner;
      }
    } as ComponentView<C, V, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, viewName) || _this;
    return _this;
  } as unknown as ComponentViewConstructor<C, V, U, I>;

  const _prototype = descriptor as unknown as ComponentView<C, V, U> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  if (_prototype.observe === void 0) {
    _prototype.observe = true;
  }

  return _constructor;
};
