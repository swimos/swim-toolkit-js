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
import {View, ViewObserverType, ViewNodeType, NodeView} from "@swim/view";
import {Component} from "../Component";
import {ComponentViewObserver} from "./ComponentViewObserver";

export type ComponentViewType<C, K extends keyof C> =
  C extends {[P in K]: ComponentView<any, infer V, any>} ? V : unknown;

export type ComponentViewInitType<V, K extends keyof V> =
  V extends {[P in K]: ComponentView<any, infer V, infer U>} ? V | U : unknown;

export interface ComponentViewInit<C extends Component, V extends View, U = V> {
  observer?: boolean;

  willSetView?(newView: V | null, oldView: V | null): void;
  onSetView?(newView: V | null, oldView: V | null): void;
  didSetView?(newView: V | null, oldView: V | null): void;

  fromAny?(value: V | U): V | null;

  extends?: ComponentViewPrototype<V, U>;
}

export type ComponentViewDescriptor<C extends Component, V extends View, U = V, I = ViewObserverType<V>> = ComponentViewInit<C, V, U> & ThisType<ComponentView<C, V, U> & I> & I;

export type ComponentViewPrototype<V extends View, U = V> = Function & { prototype: ComponentView<Component, V, U> };

export type ComponentViewConstructor<V extends View, U = V> = new <C extends Component>(component: C, viewName: string | undefined) => ComponentView<C, V, U>;

export declare abstract class ComponentView<C extends Component, V extends View, U = V extends NodeView ? ViewNodeType<V> : V> {
  /** @hidden */
  _component: C;
  /** @hidden */
  _auto: boolean;
  /** @hidden */
  _view: V | null;

  constructor(component: C, viewName: string | undefined);

  get name(): string;

  get component(): C;

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

  mount(): void;

  unmount(): void;

  fromAny(value: V | U): V | null;

  // Forward type declarations
  /** @hidden */
  static Observer: typeof ComponentViewObserver; // defined by ComponentViewObserver
}

export interface ComponentView<C extends Component, V extends View, U = V extends NodeView ? ViewNodeType<V> : V> {
  (): V | null;
  (view: V | U | null): C;
}

export function ComponentView<C extends Component, V extends View = View, U = V extends NodeView ? ViewNodeType<V> : V, I = ViewObserverType<V>>(descriptor: ComponentViewDescriptor<C, V, U, I>): PropertyDecorator;

export function ComponentView<C extends Component, V extends View = View, U = V>(
    this: ComponentView<C, V, U> | typeof ComponentView,
    component: C | ComponentViewInit<C, V, U>,
    viewName?: string,
  ): ComponentView<C, V, U> | PropertyDecorator {
  if (this instanceof ComponentView) { // constructor
    return ComponentViewConstructor.call(this, component as C, viewName);
  } else { // decorator factory
    return ComponentViewDecoratorFactory(component as ComponentViewInit<C, V, U>);
  }
}
__extends(ComponentView, Object);
Component.View = ComponentView;

function ComponentViewConstructor<C extends Component, V extends View, U = V>(this: ComponentView<C, V, U>, component: C, viewName: string | undefined): ComponentView<C, V, U> {
  if (viewName !== void 0) {
    Object.defineProperty(this, "name", {
      value: viewName,
      enumerable: true,
      configurable: true,
    });
  }
  this._component = component;
  this._auto = true;
  this._view = null;
  return this;
}

function ComponentViewDecoratorFactory<C extends Component, V extends View, U = V>(descriptor: ComponentViewInit<C, V, U>): PropertyDecorator {
  const observer = descriptor.observer;
  delete descriptor.observer;

  let BaseComponentView = descriptor.extends;
  delete descriptor.extends;
  if (BaseComponentView === void 0) {
    if (observer !== false) {
      BaseComponentView = ComponentView.Observer;
    } else {
      BaseComponentView = ComponentView;
    }
  }

  function DecoratedComponentView(this: ComponentView<C, V, U>, component: C, viewName: string | undefined): ComponentView<C, V, U> {
    let _this: ComponentView<C, V, U> = function accessor(view?: V | null): V | null | C {
      if (view === void 0) {
        return _this._view;
      } else {
        _this.setView(view);
        return _this._component;
      }
    } as ComponentView<C, V, U>;
    Object.setPrototypeOf(_this, this);
    _this = BaseComponentView!.call(_this, component, viewName) || _this;
    return _this;
  }

  if (descriptor !== void 0) {
    Object.setPrototypeOf(DecoratedComponentView, BaseComponentView);
    DecoratedComponentView.prototype = descriptor as ComponentView<C, V, U>;
    DecoratedComponentView.prototype.constructor = DecoratedComponentView;
    Object.setPrototypeOf(DecoratedComponentView.prototype, BaseComponentView.prototype);
  } else {
    __extends(DecoratedComponentView, BaseComponentView);
  }

  return Component.decorateComponentView.bind(void 0, DecoratedComponentView);
}

Object.defineProperty(ComponentView.prototype, "component", {
  get: function <C extends Component>(this: ComponentView<C, View>): C {
    return this._component;
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
  if (this._auto !== auto) {
    this._auto = auto;
    this._component.componentViewDidSetAuto(this, auto);
  }
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
  // hook
};

ComponentView.prototype.onSetOwnView = function <V extends View>(this: ComponentView<Component, V>,
                                                                 newView: V | null,
                                                                 oldView: V | null): void {
  // hook
};

ComponentView.prototype.didSetOwnView = function <V extends View>(this: ComponentView<Component, V>,
                                                                  newView: V | null,
                                                                  oldView: V | null): void {
  this._component.componentViewDidSetView(this, newView, oldView);
};

ComponentView.prototype.mount = function (this: ComponentView<Component, View>): void {
  // hook
};

ComponentView.prototype.unmount = function (this: ComponentView<Component, View>): void {
  // hook
};

ComponentView.prototype.fromAny = function <V extends View, U>(this: ComponentView<Component, V, U>,
                                                               value: V | U): V | null {
  if (value instanceof Node) {
    return View.fromNode(value) as unknown as V | null;
  }
  return value as V | null;
};
