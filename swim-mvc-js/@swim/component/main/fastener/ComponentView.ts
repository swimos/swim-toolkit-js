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

  willSetView?(newView: V | null, oldView: V | null, targetView: View | null): void;
  onSetView?(newView: V | null, oldView: V | null, targetView: View | null): void;
  didSetView?(newView: V | null, oldView: V | null, targetView: View | null): void;
  createView?(): V | U | null;
  insertView?(parentView: View, childView: V, targetView: View | null, key: string | undefined): void;
  fromAny?(value: V | U): V | null;
}

export type ComponentViewDescriptor<C extends Component, V extends View, U = never, I = ViewObserverType<V>> = ComponentViewInit<V, U> & ThisType<ComponentView<C, V, U> & I> & I;

export type ComponentViewDescriptorExtends<C extends Component, V extends View, U = never, I = ViewObserverType<V>> = {extends: ComponentViewClass | undefined} & ComponentViewDescriptor<C, V, U, I>;

export type ComponentViewDescriptorFromAny<C extends Component, V extends View, U = never, I = ViewObserverType<V>> = ({type: FromAny<V, U>} | {fromAny(value: V | U): V | null}) & ComponentViewDescriptor<C, V, U, I>;

export interface ComponentViewConstructor<C extends Component, V extends View, U = never, I = ViewObserverType<V>> {
  new(owner: C, viewName: string | undefined): ComponentView<C, V, U> & I;
  prototype: ComponentView<any, any> & I;
}

export interface ComponentViewClass extends Function {
  readonly prototype: ComponentView<any, any>;
}

export interface ComponentView<C extends Component, V extends View, U = never> {
  (): V | null;
  (view: V | U | null, targetView?: View | null): C;

  readonly name: string;

  readonly owner: C;

  readonly view: V | null;

  getView(): V;

  setView(newView: V | U | null, targetView?: View | null): V | null;

  /** @hidden */
  willSetView(newView: V | null, oldView: V | null, targetView: View | null): void;

  /** @hidden */
  onSetView(newView: V | null, oldView: V | null, targetView: View | null): void;

  /** @hidden */
  didSetView(newView: V | null, oldView: V | null, targetView: View | null): void;

  /** @hidden */
  willSetOwnView(newView: V | null, oldView: V | null, targetView: View | null): void;

  /** @hidden */
  onSetOwnView(newView: V | null, oldView: V | null, targetView: View | null): void;

  /** @hidden */
  didSetOwnView(newView: V | null, oldView: V | null, targetView: View | null): void;

  /** @hidden */
  mount(): void;

  /** @hidden */
  unmount(): void;

  insert(parentView: View, childView?: V | U | null, targetView?: View | null, key?: string | null): V | null;

  remove(): V | null;

  createView(): V | U | null;

  /** @hidden */
  insertView(parentView: View, childView: V, targetView: View | null, key: string | undefined): void;

  /** @hidden */
  observe?: boolean;

  /** @hidden */
  readonly type?: ViewFactory<V>;

  /** @hidden */
  readonly tag?: string;

  fromAny(value: V | U): V | null;
}

export const ComponentView = function <C extends Component, V extends View = View, U = never>(
    this: ComponentView<C, V, U> | typeof ComponentView,
    owner: C | ComponentViewDescriptor<C, V, U>,
    viewName?: string,
  ): ComponentView<C, V, U> | PropertyDecorator {
  if (this instanceof ComponentView) { // constructor
    return ComponentViewConstructor.call(this as unknown as ComponentView<Component, View, unknown>, owner as C, viewName);
  } else { // decorator factory
    return ComponentViewDecoratorFactory(owner as ComponentViewDescriptor<C, V, U>);
  }
} as {
  /** @hidden */
  new<C extends Component, V extends View, U = never>(owner: C, viewName: string | undefined): ComponentView<C, V, U>;

  <C extends Component, V extends View = View, U = never, I = ViewObserverType<V>>(descriptor: ComponentViewDescriptorExtends<C, V, U, I>): PropertyDecorator;
  <C extends Component, V extends View = View, U = never>(descriptor: ComponentViewDescriptor<C, V, U>): PropertyDecorator;

  /** @hidden */
  prototype: ComponentView<any, any>;

  define<C extends Component, V extends View = View, U = never, I = ViewObserverType<V>>(descriptor: ComponentViewDescriptorExtends<C, V, U, I>): ComponentViewConstructor<C, V, U, I>;
  define<C extends Component, V extends View = View, U = never>(descriptor: ComponentViewDescriptor<C, V, U>): ComponentViewConstructor<C, V, U>;
};
__extends(ComponentView, Object);

function ComponentViewConstructor<C extends Component, V extends View, U>(this: ComponentView<C, V, U>, owner: C, viewName: string | undefined): ComponentView<C, V, U> {
  if (viewName !== void 0) {
    Object.defineProperty(this, "name", {
      value: viewName,
      enumerable: true,
      configurable: true,
    });
  }
  Object.defineProperty(this, "owner", {
    value: owner,
    enumerable: true,
  });
  Object.defineProperty(this, "view", {
    value: null,
    enumerable: true,
    configurable: true,
  });
  return this;
}

function ComponentViewDecoratorFactory<C extends Component, V extends View, U>(descriptor: ComponentViewDescriptor<C, V, U>): PropertyDecorator {
  return Component.decorateComponentView.bind(Component, ComponentView.define(descriptor as ComponentViewDescriptor<Component, View>));
}

ComponentView.prototype.getView = function <V extends View>(this: ComponentView<Component, V>): V {
  const view = this.view;
  if (view === null) {
    throw new TypeError("null " + this.name + " view");
  }
  return view;
};

ComponentView.prototype.setView = function <V extends View>(this: ComponentView<Component, V>, newView: V | null, targetView?: View | null): V | null {
  if (newView instanceof NodeView && newView.isMounted() ||
      newView instanceof Node && NodeView.isNodeMounted(newView) && NodeView.isRootView(newView)) {
    this.owner.mount();
  }
  const oldView = this.view;
  if (newView !== null) {
    newView = this.fromAny(newView);
  }
  if (oldView !== newView) {
    if (targetView === void 0) {
      targetView = null;
    }
    this.willSetOwnView(newView, oldView, targetView);
    this.willSetView(newView, oldView, targetView);
    Object.defineProperty(this, "view", {
      value: newView,
      enumerable: true,
      configurable: true,
    });
    this.onSetOwnView(newView, oldView, targetView);
    this.onSetView(newView, oldView, targetView);
    this.didSetView(newView, oldView, targetView);
    this.didSetOwnView(newView, oldView, targetView);
  }
  return oldView;
};

ComponentView.prototype.willSetView = function <V extends View>(this: ComponentView<Component, V>, newView: V | null, oldView: V | null, targetView: View | null): void {
  // hook
};

ComponentView.prototype.onSetView = function <V extends View>(this: ComponentView<Component, V>, newView: V | null, oldView: V | null, targetView: View | null): void {
  // hook
};

ComponentView.prototype.didSetView = function <V extends View>(this: ComponentView<Component, V>, newView: V | null, oldView: V | null, targetView: View | null): void {
  // hook
};

ComponentView.prototype.willSetOwnView = function <V extends View>(this: ComponentView<Component, V>, newView: V | null, oldView: V | null, targetView: View | null): void {
  this.owner.willSetComponentView(this, newView, oldView, targetView);
};

ComponentView.prototype.onSetOwnView = function <V extends View>(this: ComponentView<Component, V>, newView: V | null, oldView: V | null, targetView: View | null): void {
  this.owner.onSetComponentView(this, newView, oldView, targetView);
  if (this.observe === true && this.owner.isMounted()) {
    if (oldView !== null) {
      oldView.removeViewObserver(this as ViewObserverType<V>);
    }
    if (newView !== null) {
      newView.addViewObserver(this as ViewObserverType<V>);
    }
  }
};

ComponentView.prototype.didSetOwnView = function <V extends View>(this: ComponentView<Component, V>, newView: V | null, oldView: V | null, targetView: View | null): void {
  this.owner.didSetComponentView(this, newView, oldView, targetView);
};

ComponentView.prototype.mount = function <V extends View>(this: ComponentView<Component, V>): void {
  const view = this.view;
  if (view !== null && this.observe === true) {
    view.addViewObserver(this as ViewObserverType<V>);
  }
};

ComponentView.prototype.unmount = function <V extends View>(this: ComponentView<Component, V>): void {
  const view = this.view;
  if (view !== null && this.observe === true) {
    view.removeViewObserver(this as ViewObserverType<V>);
  }
};

ComponentView.prototype.insert = function <V extends View>(this: ComponentView<Component, V>, parentView: View, childView?: V | null, targetView?: View | null, key?: string | null): V | null {
  if (targetView === void 0) {
    targetView = null;
  }
  if (childView === void 0 || childView === null) {
    childView = this.view;
    if (childView === null) {
      childView = this.createView();
    }
  } else {
    childView = this.fromAny(childView);
    if (childView !== null) {
      this.setView(childView, targetView);
    }
  }
  if (childView !== null) {
    if (key === void 0) {
      key = this.name;
    } else if (key === null) {
      key = void 0;
    }
    if (childView.parentView !== parentView || childView.key !== key) {
      this.insertView(parentView, childView, targetView, key);
    }
    if (this.view === null) {
      this.setView(childView, targetView);
    }
  }
  return childView;
};

ComponentView.prototype.remove = function <V extends View>(this: ComponentView<Component, V>): V | null {
  const childView = this.view;
  if (childView !== null) {
    childView.remove();
  }
  return childView;
};

ComponentView.prototype.createView = function <V extends View, U>(this: ComponentView<Component, V, U>): V | U | null {
  const type = this.type;
  if (type !== void 0) {
    return type.create();
  }
  return null;
};

ComponentView.prototype.insertView = function <V extends View>(this: ComponentView<Component, V>, parentView: View, childView: V, targetView: View | null, key: string | undefined): void {
  parentView.insertChildView(childView, targetView, key);
}

ComponentView.prototype.fromAny = function <V extends View, U>(this: ComponentView<Component, V, U>, value: V | U): V | null {
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

  const _constructor = function DecoratedComponentView(this: ComponentView<C, V, U>, owner: C, viewName: string | undefined): ComponentView<C, V, U> {
    let _this: ComponentView<C, V, U> = function ComponentViewAccessor(view?: V | U | null, targetView?: View | null): V | null | C {
      if (view === void 0) {
        return _this.view;
      } else {
        _this.setView(view, targetView);
        return _this.owner;
      }
    } as ComponentView<C, V, U>;
    Object.setPrototypeOf(_this, this);
    _this = _super!.call(_this, owner, viewName) || _this;
    return _this;
  } as unknown as ComponentViewConstructor<C, V, U, I>;

  const _prototype = descriptor as unknown as ComponentView<any, any> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  if (_prototype.observe === void 0) {
    _prototype.observe = true;
  }

  return _constructor;
};
