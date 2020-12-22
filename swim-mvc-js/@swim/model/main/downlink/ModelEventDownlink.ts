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
import {Value} from "@swim/structure";
import {Uri} from "@swim/uri";
import {EventDownlinkObserver, EventDownlink, WarpRef} from "@swim/client";
import {ModelDownlinkContext} from "./ModelDownlinkContext";
import {ModelDownlinkInit, ModelDownlink} from "./ModelDownlink";

export interface ModelEventDownlinkInit extends ModelDownlinkInit, EventDownlinkObserver {
  extends?: ModelEventDownlinkPrototype;

  initDownlink?(downlink: EventDownlink): EventDownlink;
}

export type ModelEventDownlinkDescriptorInit<M extends ModelDownlinkContext, I = {}> = ModelEventDownlinkInit & ThisType<ModelEventDownlink<M> & I> & I;

export type ModelEventDownlinkDescriptorExtends<M extends ModelDownlinkContext, I = {}> = {extends: ModelEventDownlinkPrototype | undefined} & ModelEventDownlinkDescriptorInit<M, I>;

export type ModelEventDownlinkDescriptor<M extends ModelDownlinkContext, I = {}> = ModelEventDownlinkDescriptorInit<M, I>;

export interface ModelEventDownlinkPrototype extends Function {
  readonly prototype: ModelEventDownlink<any>;
}

export interface ModelEventDownlinkConstructor<M extends ModelDownlinkContext, I = {}> {
  new(owner: M, downlinkName: string | undefined): ModelEventDownlink<M> & I;
  prototype: ModelEventDownlink<any> & I;
}

export declare abstract class ModelEventDownlink<M extends ModelDownlinkContext> {
  /** @hidden */
  _downlink: EventDownlink | null;

  constructor(owner: M, downlinkName: string | undefined);

  get downlink(): EventDownlink | null;

  /** @hidden */
  createDownlink(warp: WarpRef): EventDownlink;

  /** @hidden */
  scopeDownlink(downlink: EventDownlink): EventDownlink;

  /** @hidden */
  initDownlink?(downlink: EventDownlink): EventDownlink;

  static define<M extends ModelDownlinkContext, I = {}>(descriptor: ModelEventDownlinkDescriptorExtends<M, I>): ModelEventDownlinkConstructor<M, I>;
  static define<M extends ModelDownlinkContext>(descriptor: ModelEventDownlinkDescriptor<M>): ModelEventDownlinkConstructor<M>;
}

export interface ModelEventDownlink<M extends ModelDownlinkContext> extends ModelDownlink<M> {
}

export function ModelEventDownlink<M extends ModelDownlinkContext, I = {}>(descriptor: ModelEventDownlinkDescriptorExtends<M, I>): PropertyDecorator;
export function ModelEventDownlink<M extends ModelDownlinkContext>(descriptor: ModelEventDownlinkDescriptor<M>): PropertyDecorator;

export function ModelEventDownlink<M extends ModelDownlinkContext>(
    this: ModelEventDownlink<M> | typeof ModelEventDownlink,
    owner: M | ModelEventDownlinkDescriptor<M>,
    downlinkName?: string
  ): ModelEventDownlink<M> | PropertyDecorator {
  if (this instanceof ModelEventDownlink) { // constructor
    return ModelEventDownlinkConstructor.call(this, owner as M, downlinkName);
  } else { // decorator factory
    return ModelEventDownlinkDecoratorFactory(owner as ModelEventDownlinkDescriptor<M>);
  }
}
__extends(ModelEventDownlink, ModelDownlink);
ModelDownlink.Event = ModelEventDownlink;

function ModelEventDownlinkConstructor<M extends ModelDownlinkContext>(this: ModelEventDownlink<M>, owner: M, downlinkName: string | undefined): ModelEventDownlink<M> {
  const _this: ModelEventDownlink<M> = ModelDownlink.call(this, owner, downlinkName) || this;
  return _this;
}

function ModelEventDownlinkDecoratorFactory<M extends ModelDownlinkContext>(descriptor: ModelEventDownlinkDescriptor<M>): PropertyDecorator {
  return ModelDownlinkContext.decorateModelDownlink.bind(ModelDownlinkContext, ModelEventDownlink.define(descriptor));
}

ModelEventDownlink.prototype.createDownlink = function <V, VU>(this: ModelEventDownlink<ModelDownlinkContext>, warp: WarpRef): EventDownlink {
  return warp.downlink();
};

ModelEventDownlink.define = function <M extends ModelDownlinkContext, V, VU, I>(descriptor: ModelEventDownlinkDescriptor<M, I>): ModelEventDownlinkConstructor<M, I> {
  let _super: ModelEventDownlinkPrototype | null | undefined = descriptor.extends;
  const enabled = descriptor.enabled;
  let hostUri = descriptor.hostUri;
  let nodeUri = descriptor.nodeUri;
  let laneUri = descriptor.laneUri;
  let prio = descriptor.prio;
  let rate = descriptor.rate;
  let body = descriptor.body;
  delete descriptor.extends;
  delete descriptor.enabled;
  delete descriptor.hostUri;
  delete descriptor.nodeUri;
  delete descriptor.laneUri;
  delete descriptor.prio;
  delete descriptor.rate;
  delete descriptor.body;

  if (_super === void 0) {
    _super = ModelEventDownlink;
  }

  const _constructor = function ModelEventDownlinkAccessor(this: ModelDownlink<M>, owner: M, downlinkName: string | undefined): ModelEventDownlink<M> {
    const _this: ModelEventDownlink<M> = _super!.call(this, owner, downlinkName) || this;
    if (enabled === true) {
      _this._downlinkFlags |= ModelDownlink.EnabledFlag;
    }
    if (hostUri !== void 0) {
      _this._hostUri = hostUri as Uri;
    }
    if (nodeUri !== void 0) {
      _this._nodeUri = nodeUri as Uri;
    }
    if (laneUri !== void 0) {
      _this._laneUri = laneUri as Uri;
    }
    if (prio !== void 0) {
      _this._prio = prio as number;
    }
    if (rate !== void 0) {
      _this._rate = rate as number;
    }
    if (body !== void 0) {
      _this._body = body as Value;
    }
    return _this;
  } as unknown as ModelEventDownlinkConstructor<M, I>;

  const _prototype = descriptor as unknown as ModelEventDownlink<M> & I;
  Object.setPrototypeOf(_constructor, _super);
  _constructor.prototype = _prototype;
  _constructor.prototype.constructor = _constructor;
  Object.setPrototypeOf(_constructor.prototype, _super.prototype);

  if (typeof hostUri === "function") {
    _prototype.initHostUri = hostUri;
    hostUri = void 0;
  } else if (hostUri !== void 0) {
    hostUri = Uri.fromAny(hostUri);
  }
  if (typeof nodeUri === "function") {
    _prototype.initNodeUri = nodeUri;
    nodeUri = void 0;
  } else if (nodeUri !== void 0) {
    nodeUri = Uri.fromAny(nodeUri);
  }
  if (typeof laneUri === "function") {
    _prototype.initLaneUri = laneUri;
    laneUri = void 0;
  } else if (laneUri !== void 0) {
    laneUri = Uri.fromAny(laneUri);
  }
  if (typeof prio === "function") {
    _prototype.initPrio = prio;
    prio = void 0;
  }
  if (typeof rate === "function") {
    _prototype.initRate = rate;
    rate = void 0;
  }
  if (typeof body === "function") {
    _prototype.initBody = body;
    body = void 0;
  } else if (body !== void 0) {
    body = Value.fromAny(body);
  }

  return _constructor;
};
