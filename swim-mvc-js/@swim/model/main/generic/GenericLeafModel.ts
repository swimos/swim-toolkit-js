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

import {ModelContextType} from "../ModelContext";
import {ModelFlags, Model} from "../Model";
import {GenericModel} from "./GenericModel";

export class GenericLeafModel extends GenericModel {
  get childModelCount(): number {
    return 0;
  }

  get childModels(): ReadonlyArray<Model> {
    return [];
  }

  forEachChildModel<T, S = unknown>(callback: (this: S, childModel: Model) => T | void,
                                    thisArg?: S): T | undefined {
    return void 0;
  }

  getChildModel(key: string): Model | null {
    return null;
  }

  setChildModel(key: string, newChildModel: Model | null): Model | null {
    throw new Error("unsupported");
  }

  appendChildModel(childModel: Model, key?: string): void {
    throw new Error("unsupported");
  }

  prependChildModel(childModel: Model, key?: string): void {
    throw new Error("unsupported");
  }

  insertChildModel(childModel: Model, targetModel: Model | null, key?: string): void {
    throw new Error("unsupported");
  }

  removeChildModel(key: string): Model | null;
  removeChildModel(childModel: Model): void;
  removeChildModel(key: string | Model): Model | null | void {
    if (typeof key === "string") {
      return null;
    }
  }

  removeAll(): void {
    // nop
  }

  /** @hidden */
  protected doMountChildModels(): void {
    // nop
  }

  /** @hidden */
  protected doUnmountChildModels(): void {
    // nop
  }

  /** @hidden */
  protected doPowerChildModels(): void {
    // nop
  }

  /** @hidden */
  protected doUnpowerChildModels(): void {
    // nop
  }

  /** @hidden */
  protected doAnalyzeChildModels(processFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    // nop
  }

  /** @hidden */
  protected doRefreshChildModels(displayFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    // nop
  }
}
Model.GenericLeaf = GenericLeafModel;
