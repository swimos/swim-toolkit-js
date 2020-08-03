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

import {Model} from "../Model";
import {ModelManager} from "./ModelManager";

export interface ModelManagerObserver<M extends Model = Model, MM extends ModelManager<M> = ModelManager<M>> {
  managerWillAttach?(modelManager: MM): void;

  managerDidAttach?(modelManager: MM): void;

  managerWillDetach?(modelManager: MM): void;

  managerDidDetach?(modelManager: MM): void;

  managerWillAddRootModel?(rootModel: M, modelManager: MM): void;

  managerDidAddRootModel?(rootModel: M, modelManager: MM): void;

  managerWillRemoveRootModel?(rootModel: M, modelManager: MM): void;

  managerDidRemoveRootModel?(rootModel: M, modelManager: MM): void;
}
