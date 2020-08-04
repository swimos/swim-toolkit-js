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

import {ComponentContextType} from "../ComponentContext";
import {ComponentFlags, Component} from "../Component";
import {GenericComponent} from "./GenericComponent";

export class GenericLeafComponent extends GenericComponent {
  get childComponentCount(): number {
    return 0;
  }

  get childComponents(): ReadonlyArray<Component> {
    return [];
  }

  forEachChildComponent<T, S = unknown>(callback: (this: S, childComponent: Component) => T | void,
                                        thisArg?: S): T | undefined {
    return void 0;
  }

  getChildComponent(key: string): Component | null {
    return null;
  }

  setChildComponent(key: string, newChildComponent: Component | null): Component | null {
    throw new Error("unsupported");
  }

  appendChildComponent(childComponent: Component, key?: string): void {
    throw new Error("unsupported");
  }

  prependChildComponent(childComponent: Component, key?: string): void {
    throw new Error("unsupported");
  }

  insertChildComponent(childComponent: Component, targetComponent: Component | null, key?: string): void {
    throw new Error("unsupported");
  }

  removeChildComponent(key: string): Component | null;
  removeChildComponent(childComponent: Component): void;
  removeChildComponent(key: string | Component): Component | null | void {
    if (typeof key === "string") {
      return null;
    }
  }

  removeAll(): void {
    // nop
  }

  /** @hidden */
  protected doMountChildComponents(): void {
    // nop
  }

  /** @hidden */
  protected doUnmountChildComponents(): void {
    // nop
  }

  /** @hidden */
  protected doPowerChildComponents(): void {
    // nop
  }

  /** @hidden */
  protected doUnpowerChildComponents(): void {
    // nop
  }

  /** @hidden */
  protected doCompileChildComponents(compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // nop
  }

  /** @hidden */
  protected doExecuteChildComponents(executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // nop
  }
}
Component.GenericLeaf = GenericLeafComponent;
