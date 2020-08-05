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
import {Model, ModelObserver} from "@swim/model";
import {Component} from "../Component";
import {ComponentModelDescriptor, ComponentModel} from "./ComponentModel";

/** @hidden */
export interface ComponentModelObserverClass {
  new<C extends Component, M extends Model>(component: C, modelName: string, descriptor?: ComponentModelDescriptor<C, M>): ComponentModelObserver<C, M>;
}

/** @hidden */
export interface ComponentModelObserver<C extends Component, M extends Model> extends ComponentModel<C, M>, ModelObserver<M> {
}

/** @hidden */
export const ComponentModelObserver: ComponentModelObserverClass = (function (_super: typeof ComponentModel): ComponentModelObserverClass {
  const ComponentModelObserver: ComponentModelObserverClass = function <C extends Component, M extends Model>(
      this: ComponentModelObserver<C, M>, component: C, modelName: string,
      descriptor?: ComponentModelDescriptor<C, M>): ComponentModelObserver<C, M> {
    let _this: ComponentModelObserver<C, M> = function accessor(model?: M | null): M | null | C {
      if (model === void 0) {
        return _this.model;
      } else {
        _this.setModel(model);
        return _this._component;
      }
    } as ComponentModelObserver<C, M>;
    (_this as any).__proto__ = this;
    if (descriptor !== void 0) {
      if ((descriptor as any).__proto__ === Object.prototype) {
        (descriptor as any).__proto__ = (this as any).__proto__;
      } else if ((descriptor as any).__proto__ !== (this as any).__proto__) {
        throw new TypeError("unexpected " + modelName + " prototype");
      }
      (this as any).__proto__ = descriptor;
    }
    _this = _super.call(_this, component, modelName, descriptor) || _this;
    return _this;
  } as unknown as ComponentModelObserverClass;
  __extends(ComponentModelObserver, _super);

  ComponentModelObserver.prototype.onSetModel = function (this: ComponentModelObserver<Component, Model>,
                                                          newModel: Model | null,
                                                          oldModel: Model | null): void {
    if (this._component.isMounted()) {
      if (oldModel !== null) {
        oldModel.removeModelObserver(this);
      }
      if (newModel !== null) {
        newModel.addModelObserver(this);
      }
    }
  }

  ComponentModelObserver.prototype.mount = function (this: ComponentModelObserver<Component, Model>): void {
    const model = this._model;
    if (model !== null) {
      model.addModelObserver(this);
    }
  };

  ComponentModelObserver.prototype.unmount = function (this: ComponentModelObserver<Component, Model>): void {
    const model = this._model;
    if (model !== null) {
      model.removeModelObserver(this);
    }
  };

  return ComponentModelObserver;
}(ComponentModel));
ComponentModel.Observer = ComponentModelObserver;
