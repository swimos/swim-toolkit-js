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

import {WarpRef} from "@swim/client";
import {ModelFlags} from "../Model";
import {WarpManager} from "../warp/WarpManager";
import {ModelDownlinkConstructor, ModelDownlink} from "./ModelDownlink";

export interface ModelDownlinkContext {
  hasModelDownlink(downlinkName: string): boolean;

  getModelDownlink(downlinkName: string): ModelDownlink<this> | null;

  setModelDownlink(downlinkName: string, modelDownlink: ModelDownlink<this> | null): void;

  requireUpdate(updateFlags: ModelFlags): void;

  readonly warpRef: {
    readonly state: WarpRef | undefined;
  };

  readonly warpService: {
    readonly manager: WarpManager;
  };
}

/** @hidden */
export const ModelDownlinkContext: {
  decorateModelDownlink<M extends ModelDownlinkContext>(constructor: ModelDownlinkConstructor<M>,
                                                        contextClass: unknown, downlinkName: string): void;
} = {} as any;

ModelDownlinkContext.decorateModelDownlink = function <M extends ModelDownlinkContext>(constructor: ModelDownlinkConstructor<M>,
                                                                                       contextClass: unknown, downlinkName: string): void {
  Object.defineProperty(contextClass, downlinkName, {
    get: function (this: M): ModelDownlink<M> {
      let modelDownlink = this.getModelDownlink(downlinkName) as ModelDownlink<M> | null;
      if (modelDownlink === null) {
        modelDownlink = new constructor(this, downlinkName);
        this.setModelDownlink(downlinkName, modelDownlink);
      }
      return modelDownlink;
    },
    configurable: true,
    enumerable: true,
  });
};
