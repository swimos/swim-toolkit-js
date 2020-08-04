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
import {Objects, FromAny} from "@swim/util";
import {ModelFlags, Model} from "../Model";
import {AnyModelScope} from "./AnyModelScope";
import {ObjectModelScope} from "./ObjectModelScope";
import {StringModelScope} from "./StringModelScope";
import {BooleanModelScope} from "./BooleanModelScope";
import {NumberModelScope} from "./NumberModelScope";

export type ModelScopeType<M, K extends keyof M> =
  M extends {[P in K]: ModelScope<any, infer T, any>} ? T : unknown;

export type ModelScopeInitType<M, K extends keyof M> =
  M extends {[P in K]: ModelScope<any, any, infer U>} ? U : unknown;

export type ModelScopeInit<M extends Model, T, U = T> =
  (this: ModelScope<M, T, U>) => T | U | undefined;

export type ModelScopeFromAny<M extends Model, T, U = T> =
  (this: ModelScope<M, T, U>, value: T | U) => T | undefined;

export type ModelScopeTypeConstructor = FromAny<any>
                                      | typeof Object
                                      | typeof String
                                      | typeof Boolean
                                      | typeof Number
                                      | {new (...args: any): any}
                                      | any;

export type ModelScopeDescriptorType<M extends Model, TC extends ModelScopeTypeConstructor> =
  TC extends typeof Number ? ModelScopeDescriptor<M, number | null, number | string | null> :
  TC extends typeof Boolean ? ModelScopeDescriptor<M, boolean | null, boolean | string | null> :
  TC extends typeof String ? ModelScopeDescriptor<M, string | null> :
  TC extends typeof Object ? ModelScopeDescriptor<M, Object> :
  TC extends FromAny<any> ? ModelScopeDescriptor<M, any> :
  TC extends new (...args: any) => any ? ModelScopeDescriptor<M, InstanceType<TC>, any> :
  ModelScopeDescriptor<M, any>;

export interface ModelScopeDescriptor<M extends Model, T, U = T> {
  init?: ModelScopeInit<M, T, U>;
  value?: T | U;
  inherit?: string | boolean;
  updateFlags?: ModelFlags;
  fromAny?: ModelScopeFromAny<M, T, U>;
  /** @hidden */
  scopeType?: ModelScopeConstructor<T, U>;
}

export interface ModelScopeConstructor<T, U = T> {
  new<M extends Model>(model: M, scopeName: string, descriptor?: ModelScopeDescriptor<M, T, U>): ModelScope<M, T, U>;
}

export interface ModelScopeClass {
  new<M extends Model, T, U>(model: M, scopeName: string, value?: T | U, inherit?: string): ModelScope<M, T, U>;

  <M extends Model, TC extends ModelScopeTypeConstructor>(
      valueType: TC, descriptor?: ModelScopeDescriptorType<M, TC>): PropertyDecorator;

  // Forward type declarations
  /** @hidden */
  Any: typeof AnyModelScope; // defined by AnyModelScope
  /** @hidden */
  Object: typeof ObjectModelScope; // defined by ObjectModelScope
  /** @hidden */
  String: typeof StringModelScope; // defined by StringModelScope
  /** @hidden */
  Boolean: typeof BooleanModelScope; // defined by BooleanModelScope
  /** @hidden */
  Number: typeof NumberModelScope; // defined by NumberModelScope
}

export interface ModelScope<M extends Model, T, U = T> {
  (): T | undefined;
  (state: T | U | undefined): M;

  /** @hidden */
  _model: M;
  /** @hidden */
  _inherit?: string;
  /** @hidden */
  _superScope?: ModelScope<Model, T, U>;
  /** @hidden */
  _subScopes?: ModelScope<Model, T, U>[];
  /** @hidden */
  _auto: boolean;
  /** @hidden */
  _state: T | undefined;

  updateFlags?: ModelFlags;

  readonly model: M;

  readonly name: string;

  readonly inherit: string | undefined;

  setInherit(inherit: string | undefined): void;

  readonly superScope: ModelScope<Model, T, U> | null;

  /** @hidden */
  bindSuperScope(): void;

  /** @hidden */
  unbindSuperScope(): void;

  /** @hidden */
  addSubScope(subScope: ModelScope<Model, T, U>): void;

  /** @hidden */
  removeSubScope(subScope: ModelScope<Model, T, U>): void;

  readonly superState: T | undefined;

  readonly ownState: T | undefined;

  readonly state: T | undefined;

  isAuto(): boolean;

  setAuto(auto: boolean): void;

  getState(): T;

  getStateOr<M>(elseState: M): T | M;

  setState(newState: T | U | undefined): void;

  /** @hidden */
  willSetState(newState: T | undefined, oldState: T | undefined): void;

  /** @hidden */
  didSetState(newState: T | undefined, oldState: T | undefined): void;

  setAutoState(state: T | U | undefined): void;

  setOwnState(state: T | U | undefined): void;

  setBaseState(state: T | U | undefined): void;

  update(newState: T | undefined, oldState: T | undefined): void;

  willUpdate(newState: T | undefined, oldState: T | undefined): void;

  onUpdate(newState: T | undefined, oldState: T | undefined): void;

  didUpdate(newState: T | undefined, oldState: T | undefined): void;

  /** @hidden */
  cascadeUpdate(newState: T | undefined, oldState: T | undefined): void;

  mount(): void;

  unmount(): void;

  fromAny(value: T | U): T | undefined;
}

export const ModelScope: ModelScopeClass = (function (_super: typeof Object): ModelScopeClass {
  function ModelScopeDecoratorFactory<M extends Model, TC extends ModelScopeTypeConstructor>(
      valueType: TC, descriptor?: ModelScopeDescriptorType<M, TC>): PropertyDecorator {
    if (descriptor === void 0) {
      descriptor = {} as ModelScopeDescriptorType<M, TC>;
    }
    let scopeType = descriptor.scopeType;
    if (scopeType === void 0) {
      if (valueType === String) {
        scopeType = ModelScope.String;
      } else if (valueType === Boolean) {
        scopeType = ModelScope.Boolean;
      } else if (valueType === Number) {
        scopeType = ModelScope.Number;
      } else if (FromAny.is(valueType)) {
        scopeType = ModelScope.Any.bind(void 0, valueType);
      } else {
        scopeType = ModelScope.Object;
      }
      descriptor.scopeType = scopeType;
    }
    return Model.decorateModelScope.bind(void 0, scopeType, descriptor);
  }

  function ModelScopeConstructor<M extends Model, T, U = T>(
      this: ModelScope<M, T, U>, model: M, scopeName: string,
      descriptor?: ModelScopeDescriptor<M, T, U>): ModelScope<M, T, U> {
    this._model = model;
    Object.defineProperty(this, "name", {
      value: scopeName,
      enumerable: true,
      configurable: true,
    });
    if (descriptor !== void 0) {
      if (typeof descriptor.inherit === "string") {
        this._inherit = descriptor.inherit;
      } else if (descriptor.inherit === true) {
        this._inherit = scopeName;
      }
      if (descriptor.fromAny !== void 0) {
        this.fromAny = descriptor.fromAny;
      }
      if (descriptor.updateFlags !== void 0) {
        this.updateFlags = descriptor.updateFlags;
      }
    }
    this._auto = true;
    let value: T | U | undefined;
    if (descriptor !== void 0) {
      if (descriptor.init !== void 0) {
        value = descriptor.init.call(this);
      } else {
        value = descriptor.value;
      }
    }
    if (value !== void 0) {
      value = this.fromAny(value);
    }
    this._state = value as T | undefined;
    return this;
  }

  const ModelScope: ModelScopeClass = function <M extends Model, T, U>(
      this: ModelScope<M, T, U> | ModelScopeClass,
      model?: M | ModelScopeTypeConstructor,
      scopeName?: string | ModelScopeDescriptor<M, T, U>,
      descriptor?: ModelScopeDescriptor<M, T, U>): ModelScope<M, T> | PropertyDecorator | void {
    if (this instanceof ModelScope) { // constructor
      return ModelScopeConstructor.call(this, model as M, scopeName as string, descriptor);
    } else { // decorator factory
      const valueType = model as ModelScopeTypeConstructor;
      descriptor = scopeName as ModelScopeDescriptor<M, T, U> | undefined;
      return ModelScopeDecoratorFactory(valueType, descriptor);
    }
  } as ModelScopeClass;
  __extends(ModelScope, _super);

  Object.defineProperty(ModelScope.prototype, "model", {
    get: function <M extends Model>(this: ModelScope<M, unknown>): M {
      return this._model;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(ModelScope.prototype, "inherit", {
    get: function (this: ModelScope<Model, unknown>): string | undefined {
      return this._inherit;
    },
    enumerable: true,
    configurable: true,
  });

  ModelScope.prototype.setInherit = function (this: ModelScope<Model, unknown>,
                                              inherit: string | undefined): void {
    this.unbindSuperScope();
    if (inherit !== void 0) {
      this._inherit = inherit;
      this.bindSuperScope();
    } else if (this._inherit !== void 0) {
      this._inherit = void 0;
    }
  };

  Object.defineProperty(ModelScope.prototype, "superScope", {
    get: function <T, U>(this: ModelScope<Model, T, U>): ModelScope<Model, T, U> | null {
      let superScope: ModelScope<Model, T, U> | null | undefined = this._superScope;
      if (superScope === void 0) {
        superScope = null;
        let model = this._model;
        if (!model.isMounted()) {
          const inherit = this._inherit;
          if (inherit !== void 0) {
            do {
              const parentModel = model.parentModel;
              if (parentModel !== null) {
                model = parentModel;
                const scope = model.getLazyModelScope(inherit);
                if (scope === null) {
                  continue;
                } else {
                  superScope = scope as ModelScope<Model, T, U>;
                }
              }
              break;
            } while (true);
          }
        }
      }
      return superScope;
    },
    enumerable: true,
    configurable: true,
  });

  ModelScope.prototype.bindSuperScope = function (this: ModelScope<Model, unknown>): void {
    let model = this._model;
    if (model.isMounted()) {
      const inherit = this._inherit;
      if (inherit !== void 0) {
        do {
          const parentModel = model.parentModel;
          if (parentModel !== null) {
            model = parentModel;
            const scope = model.getLazyModelScope(inherit);
            if (scope === null) {
              continue;
            } else {
              this._superScope = scope;
              scope.addSubScope(this);
            }
          }
          break;
        } while (true);
      }
    }
  };

  ModelScope.prototype.unbindSuperScope = function (this: ModelScope<Model, unknown>): void {
    const superScope = this._superScope;
    if (superScope !== void 0) {
      superScope.removeSubScope(this);
      this._superScope = void 0;
    }
  };

  ModelScope.prototype.addSubScope = function <T, U>(this: ModelScope<Model, T, U>,
                                                     subScope: ModelScope<Model, T, U>): void {
    let subScopes = this._subScopes;
    if (subScopes === void 0) {
      subScopes = [];
      this._subScopes = subScopes;
    }
    subScopes.push(subScope);
  }

  ModelScope.prototype.removeSubScope = function <T, U>(this: ModelScope<Model, T, U>,
                                                        subScope: ModelScope<Model, T, U>): void {
    const subScopes = this._subScopes;
    if (subScopes !== void 0) {
      const index = subScopes.indexOf(subScope);
      if (index >= 0) {
        subScopes.splice(index, 1);
      }
    }
  };

  Object.defineProperty(ModelScope.prototype, "superState", {
    get: function <T>(this: ModelScope<Model, T>): T | undefined {
      const superScope = this.superScope;
      return superScope !== null ? superScope.state : void 0;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(ModelScope.prototype, "ownState", {
    get: function <T>(this: ModelScope<Model, T>): T | undefined {
      return this._state;
    },
    enumerable: true,
    configurable: true,
  });

  Object.defineProperty(ModelScope.prototype, "state", {
    get: function <T>(this: ModelScope<Model, T>): T | undefined {
      const state = this._state;
      return state !== void 0 ? state : this.superState;
    },
    enumerable: true,
    configurable: true,
  });

  ModelScope.prototype.isAuto = function (this: ModelScope<Model, unknown>): boolean {
    return this._auto;
  };

  ModelScope.prototype.setAuto = function (this: ModelScope<Model, unknown>,
                                           auto: boolean): void {
    if (this._auto !== auto) {
      this._auto = auto;
      this._model.modelScopeDidSetAuto(this, auto);
    }
  };

  ModelScope.prototype.getState = function <T, U>(this: ModelScope<Model, T, U>): T {
    const state = this.state;
    if (state === void 0) {
      throw new TypeError("undefined " + this.name + " state");
    }
    return state;
  };

  ModelScope.prototype.getStateOr = function <T, U, M>(this: ModelScope<Model, T, U>,
                                                       elseState: M): T | M {
    let state: T | M | undefined = this.state;
    if (state === void 0) {
      state = elseState;
    }
    return state;
  };

  ModelScope.prototype.setState = function <T, U>(this: ModelScope<Model, T, U>,
                                                 state: T | U | undefined): void {
    this._auto = false;
    this.setOwnState(state);
  };

  ModelScope.prototype.willSetState = function <T, U>(this: ModelScope<Model, T, U>,
                                                      newState: T | undefined,
                                                      oldState: T | undefined): void {
    // hook
  }

  ModelScope.prototype.didSetState = function <T, U>(this: ModelScope<Model, T, U>,
                                                     newState: T | undefined,
                                                     oldState: T | undefined): void {
    // hook
  }

  ModelScope.prototype.setAutoState = function <T, U>(this: ModelScope<Model, T, U>,
                                                     state: T | U | undefined): void {
    if (this._auto === true) {
      this.setOwnState(state);
    }
  };

  ModelScope.prototype.setOwnState = function <T, U>(this: ModelScope<Model, T, U>,
                                                     newState: T | U | undefined): void {
    const oldState = this._state;
    if (newState !== void 0) {
      newState = this.fromAny(newState);
    }
    if (!Objects.equal(oldState, newState)) {
      this.willSetState(newState as T | undefined, oldState);
      this.willUpdate(newState as T | undefined, oldState);
      this._state = newState as T | undefined;
      this.onUpdate(newState as T | undefined, oldState);
      this.cascadeUpdate(newState as T | undefined, oldState);
      this.didUpdate(newState as T | undefined, oldState);
      this.didSetState(newState as T | undefined, oldState);
    }
  };

  ModelScope.prototype.setBaseState = function <T, U>(this: ModelScope<Model, T, U>,
                                                      state: T | U | undefined): void {
    let superScope: ModelScope<Model, T, U> | null | undefined;
    if (this._state === void 0 && (superScope = this.superScope, superScope !== null)) {
      superScope.setBaseState(state);
    } else {
      this.setState(state);
    }
  };

  ModelScope.prototype.update = function <T, U>(this: ModelScope<Model, T, U>,
                                                newState: T | undefined,
                                                oldState: T | undefined): void {
    this.willUpdate(newState, oldState);
    this._state = newState;
    this.onUpdate(newState, oldState);
    this.cascadeUpdate(newState, oldState);
    this.didUpdate(newState, oldState);
  };

  ModelScope.prototype.willUpdate = function <T, U>(this: ModelScope<Model, T, U>,
                                                    newState: T | undefined,
                                                    oldState: T | undefined): void {
    // hook
  };

  ModelScope.prototype.onUpdate = function <T, U>(this: ModelScope<Model, T, U>,
                                                  newState: T | undefined,
                                                  oldState: T | undefined): void {
    const updateFlags = this.updateFlags;
    if (updateFlags !== void 0) {
      this._model.requireUpdate(updateFlags);
    }
  };

  ModelScope.prototype.didUpdate = function <T, U>(this: ModelScope<Model, T, U>,
                                                   newState: T | undefined,
                                                   oldState: T | undefined): void {
    this._model.modelScopeDidSetState(this, newState, oldState);
  };

  ModelScope.prototype.cascadeUpdate = function <T, U>(this: ModelScope<Model, T, U>,
                                                       newState: T | undefined,
                                                       oldState: T | undefined): void {
    const subScopes = this._subScopes;
    if (subScopes !== void 0) {
      for (let i = 0, n = subScopes.length; i < n; i += 1) {
        const subScope = subScopes[i];
        if (subScope._state === void 0) {
          subScope.willUpdate(newState, oldState);
          subScope.onUpdate(newState, oldState);
          subScope.cascadeUpdate(newState, oldState);
          subScope.didUpdate(newState, oldState);
        }
      }
    }
  };

  ModelScope.prototype.mount = function (this: ModelScope<Model, unknown>): void {
    this.bindSuperScope();
  };

  ModelScope.prototype.unmount = function (this: ModelScope<Model, unknown>): void {
    this.unbindSuperScope();
  };

  ModelScope.prototype.fromAny = function <T, U>(this: ModelScope<Model, T, U>,
                                                 value: T | U): T | undefined {
    throw new Error(); // abstract
  };

  return ModelScope;
}(Object));
Model.Scope = ModelScope;
