// Copyright 2015-2019 SWIM.AI inc.
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

import {Entity} from "./Entity";

export abstract class AspectRegistry {
  /** @hidden */
  static readonly _aspects: Aspect[] = [];

  static get aspects(): ReadonlyArray<Aspect> {
    return this._aspects;
  }

  static registerAspect(aspect: Aspect): void {
    if (this._aspects.indexOf(aspect) < 0) {
      this._aspects.push(aspect);
    }
  }

  /** @hidden */
  static injectEntity(entity: Entity): void {
    for (let i = 0, n = this._aspects.length; i < n; i += 1) {
      this._aspects[i].injectEntity(entity);
    }
  }
}

export interface Aspect {
  injectEntity(entity: Entity): void;
}

export const Aspect: typeof AspectRegistry = AspectRegistry;
