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
import {View, ViewObserverType, ViewObserver} from "@swim/view";
import {Component} from "../Component";
import {ComponentViewObserver} from "./ComponentViewObserver";

export type ComponentViewTypeConstructor = typeof View
                                         | {new (...args: any): any}
                                         | any;

export type ComponentViewDescriptorType<C extends Component, TC extends ComponentViewTypeConstructor> =
  TC extends new (...args: any) => any ? ComponentViewDescriptor<C, InstanceType<TC>> & ThisType<ComponentView<C, View>> & ViewObserverType<InstanceType<TC>> :
  ComponentViewDescriptor<C, any> & ThisType<ComponentView<C, View>> & ViewObserver;

export interface ComponentViewDescriptor<C extends Component, V extends View> {
  willSetView?(newView: V | null, oldView: V | null): void;
  onSetView?(newView: V | null, oldView: V | null): void;
  didSetView?(newView: V | null, oldView: V | null): void;

  /** @hidden */
  componentViewType?: ComponentViewConstructor<V>;
}

export interface ComponentViewConstructor<V extends View> {
  new<C extends Component>(component: C, viewName: string, descriptor?: ComponentViewDescriptor<C, V>): ComponentView<C, V>;
}

export interface ComponentViewClass {
  new<C extends Component, V extends View>(component: C, viewName: string, descriptor?: ComponentViewDescriptor<C, V>): ComponentView<C, V>;

  <C extends Component, TC extends ComponentViewTypeConstructor>(
      viewType: TC, descriptor?: ComponentViewDescriptorType<C, TC>): PropertyDecorator;

  // Forward type declarations
  /** @hidden */
  Observer: typeof ComponentViewObserver; // defined by ComponentViewObserver
}

export interface ComponentView<C extends Component, V extends View> {
  (): V | null;
  (view: V | null): C;

  /** @hidden */
  _component: C;
  /** @hidden */
  _auto: boolean;
  /** @hidden */
  _view: V | null;

  readonly component: C;

  readonly name: string;

  readonly view: V | null;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  getView(): V;

  setView(newView: V | null): void;

  /** @hidden */
  willSetView(newView: V | null, oldView: V | null): void;

  /** @hidden */
  onSetView(newView: V | null, oldView: V | null): void;

  /** @hidden */
  didSetView(newView: V | null, oldView: V | null): void;

  setAutoView(view: V | null): void;

  /** @hidden */
  setOwnView(view: V | null): void;

  mount(): void;

  unmount(): void;
}

export const ComponentView: ComponentViewClass = (function (_super: typeof Object): ComponentViewClass {
  function ComponentViewDecoratorFactory<C extends Component, TC extends ComponentViewTypeConstructor>(
      viewType: TC, descriptor?: ComponentViewDescriptorType<C, TC>): PropertyDecorator {
    if (descriptor === void 0) {
      descriptor = {} as ComponentViewDescriptorType<C, TC>;
    }
    let componentViewType = descriptor.componentViewType;
    if (componentViewType === void 0) {
      componentViewType = ComponentView.Observer;
      descriptor.componentViewType = componentViewType;
    }
    return Component.decorateComponentView.bind(void 0, viewType, descriptor);
  }

  function ComponentViewConstructor<C extends Component, V extends View>(
      this: ComponentView<C, V>, component: C, viewName: string,
      descriptor?: ComponentViewDescriptor<C, V>): ComponentView<C, V> {
    this._component = component;
    Object.defineProperty(this, "name", {
      value: viewName,
      enumerable: true,
      configurable: true,
    });
    this._auto = true;
    this._view = null;
    return this;
  }

  const ComponentView: ComponentViewClass = function <C extends Component, V extends View>(
      this: ComponentView<C, V> | ComponentViewClass,
      component?: C | ComponentViewTypeConstructor,
      viewName?: string | ComponentViewDescriptor<C, V>,
      descriptor?: ComponentViewDescriptor<C, V>): ComponentView<C, V> | PropertyDecorator | void {
    if (this instanceof ComponentView) { // constructor
      return ComponentViewConstructor.call(this, component as C, viewName as string, descriptor);
    } else { // decorator factory
      const viewType = component as ComponentViewTypeConstructor;
      descriptor = viewName as ComponentViewDescriptor<C, V> | undefined;
      return ComponentViewDecoratorFactory(viewType, descriptor);
    }
  } as ComponentViewClass;
  __extends(ComponentView, _super);

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

  ComponentView.prototype.setView = function <V extends View>(this: ComponentView<Component, V>,
                                                              view: V | null): void {
    this._auto = false;
    this.setOwnView(view);
  };

  ComponentView.prototype.willSetView = function <V extends View>(this: ComponentView<Component, V>,
                                                                  newView: V | null,
                                                                  oldView: V | null): void {
    // hook
  }

  ComponentView.prototype.onSetView = function <V extends View>(this: ComponentView<Component, V>,
                                                                newView: V | null,
                                                                oldView: V | null): void {
    // hook
  }

  ComponentView.prototype.didSetView = function <V extends View>(this: ComponentView<Component, V>,
                                                                 newView: V | null,
                                                                 oldView: V | null): void {
    this._component.componentViewDidSetView(this, newView, oldView);
  }

  ComponentView.prototype.setAutoView = function <V extends View>(this: ComponentView<Component, V>,
                                                                  view: V | null): void {
    if (this._auto === true) {
      this.setOwnView(view);
    }
  };

  ComponentView.prototype.setOwnView = function <V extends View>(this: ComponentView<Component, V>,
                                                                 newView: V | null): void {
    const oldView = this._view;
    if (oldView !== newView) {
      this.willSetView(newView, oldView);
      this._view = newView;
      this.onSetView(newView, oldView);
      this.didSetView(newView, oldView);
    }
  };

  ComponentView.prototype.mount = function (this: ComponentView<Component, View>): void {
    // hook
  };

  ComponentView.prototype.unmount = function (this: ComponentView<Component, View>): void {
    // hook
  };

  return ComponentView;
}(Object));
Component.View = ComponentView;
