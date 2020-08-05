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
import {View, ViewObserver} from "@swim/view";
import {Component} from "../Component";
import {ComponentViewDescriptor, ComponentView} from "./ComponentView";

/** @hidden */
export interface ComponentViewObserverClass {
  new<C extends Component, V extends View>(component: C, viewName: string, descriptor?: ComponentViewDescriptor<C, V>): ComponentViewObserver<C, V>;
}

/** @hidden */
export interface ComponentViewObserver<C extends Component, V extends View> extends ComponentView<C, V>, ViewObserver<V> {
}

/** @hidden */
export const ComponentViewObserver: ComponentViewObserverClass = (function (_super: typeof ComponentView): ComponentViewObserverClass {
  const ComponentViewObserver: ComponentViewObserverClass = function <C extends Component, V extends View>(
      this: ComponentViewObserver<C, V>, component: C, viewName: string,
      descriptor?: ComponentViewDescriptor<C, V>): ComponentViewObserver<C, V> {
    let _this: ComponentViewObserver<C, V> = function accessor(view?: V | null): V | null | C {
      if (view === void 0) {
        return _this.view;
      } else {
        _this.setView(view);
        return _this._component;
      }
    } as ComponentViewObserver<C, V>;
    (_this as any).__proto__ = this;
    if (descriptor !== void 0) {
      if ((descriptor as any).__proto__ === Object.prototype) {
        (descriptor as any).__proto__ = (this as any).__proto__;
      } else if ((descriptor as any).__proto__ !== (this as any).__proto__) {
        throw new TypeError("unexpected " + viewName + " prototype");
      }
      (this as any).__proto__ = descriptor;
    }
    _this = _super.call(_this, component, viewName, descriptor) || _this;
    return _this;
  } as unknown as ComponentViewObserverClass;
  __extends(ComponentViewObserver, _super);

  ComponentViewObserver.prototype.onSetView = function (this: ComponentViewObserver<Component, View>,
                                                        newView: View | null,
                                                        oldView: View | null): void {
    if (this._component.isMounted()) {
      if (oldView !== null) {
        oldView.removeViewObserver(this);
      }
      if (newView !== null) {
        newView.addViewObserver(this);
      }
    }
  }

  ComponentViewObserver.prototype.mount = function (this: ComponentViewObserver<Component, View>): void {
    const view = this._view;
    if (view !== null) {
      view.addViewObserver(this);
    }
  };

  ComponentViewObserver.prototype.unmount = function (this: ComponentViewObserver<Component, View>): void {
    const view = this._view;
    if (view !== null) {
      view.removeViewObserver(this);
    }
  };

  return ComponentViewObserver;
}(ComponentView));
ComponentView.Observer = ComponentViewObserver;
