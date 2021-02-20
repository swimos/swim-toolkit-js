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

import {Arrays} from "@swim/util";
import type {View} from "@swim/view";
import type {Model, Trait} from "@swim/model";
import type {ComponentContextType, ComponentContext} from "./ComponentContext";
import type {ComponentObserverType, ComponentObserver} from "./ComponentObserver";
import type {ComponentServiceConstructor, ComponentService} from "./service/ComponentService";
import type {ExecuteService} from "./service/ExecuteService";
import type {HistoryService} from "./service/HistoryService";
import type {StorageService} from "./service/StorageService";
import type {ComponentPropertyConstructor, ComponentProperty} from "./property/ComponentProperty";
import type {ComponentModelConstructor, ComponentModel} from "./fastener/ComponentModel";
import type {ComponentTraitConstructor, ComponentTrait} from "./fastener/ComponentTrait";
import type {ComponentViewConstructor, ComponentView} from "./fastener/ComponentView";
import type {ComponentFastenerConstructor, ComponentFastener} from "./fastener/ComponentFastener";

export type ComponentFlags = number;

export interface ComponentInit {
  key?: string;
}

export interface ComponentPrototype {
  /** @hidden */
  componentServiceConstructors?: {[serviceName: string]: ComponentServiceConstructor<Component, unknown> | undefined};

  /** @hidden */
  componentPropertyConstructors?: {[propertyName: string]: ComponentPropertyConstructor<Component, unknown> | undefined};

  /** @hidden */
  componentModelConstructors?: {[modelName: string]: ComponentModelConstructor<Component, Model> | undefined};

  /** @hidden */
  componentTraitConstructors?: {[traitName: string]: ComponentTraitConstructor<Component, Trait> | undefined};

  /** @hidden */
  componentViewConstructors?: {[viewName: string]: ComponentViewConstructor<Component, View> | undefined};

  /** @hidden */
  componentFastenerConstructors?: {[fastenerName: string]: ComponentFastenerConstructor<Component, Component> | undefined};
}

export interface ComponentConstructor<C extends Component = Component> {
  new(): C;
  readonly prototype: C;
}

export interface ComponentClass<C extends Component = Component> extends Function {
  readonly prototype: C;

  readonly mountFlags: ComponentFlags;

  readonly powerFlags: ComponentFlags;

  readonly insertChildFlags: ComponentFlags;

  readonly removeChildFlags: ComponentFlags;
}

export abstract class Component {
  constructor() {
    Object.defineProperty(this, "componentFlags", {
      value: 0,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "componentObservers", {
      value: Arrays.empty,
      enumerable: true,
      configurable: true,
    });
  }

  initComponent(init: ComponentInit): void {
    // hook
  }

  declare readonly componentFlags: ComponentFlags;

  setComponentFlags(componentFlags: ComponentFlags): void {
    Object.defineProperty(this, "componentFlags", {
      value: componentFlags,
      enumerable: true,
      configurable: true,
    });
  }

  declare readonly componentObservers: ReadonlyArray<ComponentObserver>;

  addComponentObserver(componentObserver: ComponentObserverType<this>): void {
    const oldComponentObservers = this.componentObservers;
    const newComponentObservers = Arrays.inserted(componentObserver, oldComponentObservers);
    if (oldComponentObservers !== newComponentObservers) {
      this.willAddComponentObserver(componentObserver);
      Object.defineProperty(this, "componentObservers", {
        value: newComponentObservers,
        enumerable: true,
        configurable: true,
      });
      this.onAddComponentObserver(componentObserver);
      this.didAddComponentObserver(componentObserver);
    }
  }

  protected willAddComponentObserver(componentObserver: ComponentObserverType<this>): void {
    // hook
  }

  protected onAddComponentObserver(componentObserver: ComponentObserverType<this>): void {
    // hook
  }

  protected didAddComponentObserver(componentObserver: ComponentObserverType<this>): void {
    // hook
  }

  removeComponentObserver(componentObserver: ComponentObserverType<this>): void {
    const oldComponentObservers = this.componentObservers;
    const newComponentObservers = Arrays.removed(componentObserver, oldComponentObservers);
    if (oldComponentObservers !== newComponentObservers) {
      this.willRemoveComponentObserver(componentObserver);
      Object.defineProperty(this, "componentObservers", {
        value: newComponentObservers,
        enumerable: true,
        configurable: true,
      });
      this.onRemoveComponentObserver(componentObserver);
      this.didRemoveComponentObserver(componentObserver);
    }
  }

  protected willRemoveComponentObserver(componentObserver: ComponentObserverType<this>): void {
    // hook
  }

  protected onRemoveComponentObserver(componentObserver: ComponentObserverType<this>): void {
    // hook
  }

  protected didRemoveComponentObserver(componentObserver: ComponentObserverType<this>): void {
    // hook
  }

  abstract readonly key: string | undefined;

  /** @hidden */
  abstract setKey(key: string | undefined): void;

  abstract readonly parentComponent: Component | null;

  /** @hidden */
  abstract setParentComponent(newParentComponent: Component | null, oldParentComponent: Component | null): void;

  protected willSetParentComponent(newParentComponent: Component | null, oldParentComponent: Component | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillSetParentComponent !== void 0) {
        componentObserver.componentWillSetParentComponent(newParentComponent, oldParentComponent, this);
      }
    }
  }

  protected onSetParentComponent(newParentComponent: Component | null, oldParentComponent: Component | null): void {
    if (newParentComponent !== null) {
      if (newParentComponent.isMounted()) {
        this.cascadeMount();
        if (newParentComponent.isPowered()) {
          this.cascadePower();
        }
      }
    } else if (this.isMounted()) {
      try {
        if (this.isPowered()) {
          this.cascadeUnpower();
        }
      } finally {
        this.cascadeUnmount();
      }
    }
  }

  protected didSetParentComponent(newParentComponent: Component | null, oldParentComponent: Component | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidSetParentComponent !== void 0) {
        componentObserver.componentDidSetParentComponent(newParentComponent, oldParentComponent, this);
      }
    }
  }

  abstract remove(): void;

  abstract readonly childComponentCount: number;

  abstract readonly childComponents: ReadonlyArray<Component>;

  abstract firstChildComponent(): Component | null;

  abstract lastChildComponent(): Component | null;

  abstract nextChildComponent(targetComponent: Component): Component | null;

  abstract previousChildComponent(targetComponent: Component): Component | null;

  abstract forEachChildComponent<T>(callback: (childComponent: Component) => T | void): T | undefined;
  abstract forEachChildComponent<T, S>(callback: (this: S, childComponent: Component) => T | void,
                                       thisArg: S): T | undefined;

  abstract getChildComponent(key: string): Component | null;

  abstract setChildComponent(key: string, newChildComponent: Component | null): Component | null;

  abstract appendChildComponent(childComponent: Component, key?: string): void;

  abstract prependChildComponent(childComponent: Component, key?: string): void;

  abstract insertChildComponent(childComponent: Component, targetComponent: Component | null, key?: string): void;

  get insertChildFlags(): ComponentFlags {
    return (this.constructor as ComponentClass).insertChildFlags;
  }

  protected willInsertChildComponent(childComponent: Component, targetComponent: Component | null | undefined): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillInsertChildComponent !== void 0) {
        componentObserver.componentWillInsertChildComponent(childComponent, targetComponent, this);
      }
    }
  }

  protected onInsertChildComponent(childComponent: Component, targetComponent: Component | null | undefined): void {
    this.requireUpdate(this.insertChildFlags);
  }

  protected didInsertChildComponent(childComponent: Component, targetComponent: Component | null | undefined): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidInsertChildComponent !== void 0) {
        componentObserver.componentDidInsertChildComponent(childComponent, targetComponent, this);
      }
    }
  }

  abstract cascadeInsert(updateFlags?: ComponentFlags, componentContext?: ComponentContext): void;

  abstract removeChildComponent(key: string): Component | null;
  abstract removeChildComponent(childComponent: Component): void;

  abstract removeAll(): void;

  get removeChildFlags(): ComponentFlags {
    return (this.constructor as ComponentClass).removeChildFlags;
  }

  protected willRemoveChildComponent(childComponent: Component): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillRemoveChildComponent !== void 0) {
        componentObserver.componentWillRemoveChildComponent(childComponent, this);
      }
    }
    this.requireUpdate(this.removeChildFlags);
  }

  protected onRemoveChildComponent(childComponent: Component): void {
    // hook
  }

  protected didRemoveChildComponent(childComponent: Component): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidRemoveChildComponent !== void 0) {
        componentObserver.componentDidRemoveChildComponent(childComponent, this);
      }
    }
  }

  getSuperComponent<C extends Component>(componentClass: ComponentClass<C>): C | null {
    const parentComponent = this.parentComponent;
    if (parentComponent === null) {
      return null;
    } else if (parentComponent instanceof componentClass) {
      return parentComponent;
    } else {
      return parentComponent.getSuperComponent(componentClass);
    }
  }

  getBaseComponent<C extends Component>(componentClass: ComponentClass<C>): C | null {
    const parentComponent = this.parentComponent;
    if (parentComponent === null) {
      return null;
    } else {
      const baseComponent = parentComponent.getBaseComponent(componentClass);
      if (baseComponent !== null) {
        return baseComponent;
      } else {
        return parentComponent instanceof componentClass ? parentComponent : null;
      }
    }
  }

  declare readonly executeService: ExecuteService<this>; // defined by ExecuteService

  declare readonly historyService: HistoryService<this>; // defined by HistoryService

  declare readonly storageService: StorageService<this>; // defined by StorageService

  isMounted(): boolean {
    return (this.componentFlags & Component.MountedFlag) !== 0;
  }

  get mountFlags(): ComponentFlags {
    return (this.constructor as ComponentClass).mountFlags;
  }

  mount(): void {
    if (!this.isMounted() && this.parentComponent === null) {
      this.cascadeMount();
      if (!this.isPowered() && document.visibilityState === "visible") {
        this.cascadePower();
      }
      this.cascadeInsert();
    }
  }

  abstract cascadeMount(): void;

  protected willMount(): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillMount !== void 0) {
        componentObserver.componentWillMount(this);
      }
    }
  }

  protected onMount(): void {
    this.requestUpdate(this, this.componentFlags & ~Component.StatusMask, false);
    this.requireUpdate(this.mountFlags);
  }

  protected didMount(): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidMount !== void 0) {
        componentObserver.componentDidMount(this);
      }
    }
  }

  abstract cascadeUnmount(): void;

  protected willUnmount(): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillUnmount !== void 0) {
        componentObserver.componentWillUnmount(this);
      }
    }
  }

  protected onUnmount(): void {
    // hook
  }

  protected didUnmount(): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidUnmount !== void 0) {
        componentObserver.componentDidUnmount(this);
      }
    }
  }

  isPowered(): boolean {
    return (this.componentFlags & Component.PoweredFlag) !== 0;
  }

  get powerFlags(): ComponentFlags {
    return (this.constructor as ComponentClass).powerFlags;
  }

  abstract cascadePower(): void;

  protected willPower(): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillPower !== void 0) {
        componentObserver.componentWillPower(this);
      }
    }
  }

  protected onPower(): void {
    this.requestUpdate(this, this.componentFlags & ~Component.StatusMask, false);
    this.requireUpdate(this.powerFlags);
  }

  protected didPower(): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidPower !== void 0) {
        componentObserver.componentDidPower(this);
      }
    }
  }

  abstract cascadeUnpower(): void;

  protected willUnpower(): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillUnpower !== void 0) {
        componentObserver.componentWillUnpower(this);
      }
    }
  }

  protected onUnpower(): void {
    // hook
  }

  protected didUnpower(): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidUnpower !== void 0) {
        componentObserver.componentDidUnpower(this);
      }
    }
  }

  requireUpdate(updateFlags: ComponentFlags, immediate: boolean = false): void {
    updateFlags &= ~Component.StatusMask;
    if (updateFlags !== 0) {
      this.willRequireUpdate(updateFlags, immediate);
      const oldUpdateFlags = this.componentFlags;
      const newUpdateFlags = oldUpdateFlags | updateFlags;
      const deltaUpdateFlags = newUpdateFlags & ~oldUpdateFlags & ~Component.StatusMask;
      if (deltaUpdateFlags !== 0) {
        this.setComponentFlags(newUpdateFlags);
        this.onRequireUpdate(updateFlags, immediate);
        this.requestUpdate(this, deltaUpdateFlags, immediate);
      }
      this.didRequireUpdate(updateFlags, immediate);
    }
  }

  protected willRequireUpdate(updateFlags: ComponentFlags, immediate: boolean): void {
    // hook
  }

  protected onRequireUpdate(updateFlags: ComponentFlags, immediate: boolean): void {
    // hook
  }

  protected didRequireUpdate(updateFlags: ComponentFlags, immediate: boolean): void {
    // hook
  }

  requestUpdate(targetComponent: Component, updateFlags: ComponentFlags, immediate: boolean): void {
    this.willRequestUpdate(targetComponent, updateFlags, immediate);
    let propagateFlags = updateFlags & (Component.NeedsCompile | Component.NeedsExecute);
    if ((updateFlags & Component.CompileMask) !== 0 && (this.componentFlags & Component.NeedsCompile) === 0) {
      this.setComponentFlags(this.componentFlags | Component.NeedsCompile);
      propagateFlags |= Component.NeedsCompile;
    }
    if ((updateFlags & Component.ExecuteMask) !== 0 && (this.componentFlags & Component.NeedsExecute) === 0) {
      this.setComponentFlags(this.componentFlags | Component.NeedsExecute);
      propagateFlags |= Component.NeedsExecute;
    }
    if ((propagateFlags & (Component.NeedsCompile | Component.NeedsExecute)) !== 0 || immediate) {
      this.onRequestUpdate(targetComponent, updateFlags, immediate);
      const parentComponent = this.parentComponent;
      if (parentComponent !== null) {
        parentComponent.requestUpdate(targetComponent, updateFlags, immediate);
      } else if (this.isMounted()) {
        const executeManager = this.executeService.manager;
        if (executeManager !== void 0) {
          executeManager.requestUpdate(targetComponent, updateFlags, immediate);
        }
      }
    }
    this.didRequestUpdate(targetComponent, updateFlags, immediate);
  }

  protected willRequestUpdate(targetComponent: Component, updateFlags: ComponentFlags, immediate: boolean): void {
    // hook
  }

  protected onRequestUpdate(targetComponent: Component, updateFlags: ComponentFlags, immediate: boolean): void {
    // hook
  }

  protected didRequestUpdate(targetComponent: Component, updateFlags: ComponentFlags, immediate: boolean): void {
    // hook
  }

  isTraversing(): boolean {
    return (this.componentFlags & Component.TraversingFlag) !== 0;
  }

  isUpdating(): boolean {
    return (this.componentFlags & Component.UpdatingMask) !== 0;
  }

  isCompiling(): boolean {
    return (this.componentFlags & Component.CompilingFlag) !== 0;
  }

  needsCompile(compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): ComponentFlags {
    return compileFlags;
  }

  abstract cascadeCompile(compileFlags: ComponentFlags, componentContext: ComponentContext): void;

  protected willCompile(compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected onCompile(compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected didCompile(compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected willResolve(componentContext: ComponentContextType<this>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillResolve !== void 0) {
        componentObserver.componentWillResolve(componentContext, this);
      }
    }
  }

  protected onResolve(componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected didResolve(componentContext: ComponentContextType<this>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidResolve !== void 0) {
        componentObserver.componentDidResolve(componentContext, this);
      }
    }
  }

  protected willGenerate(componentContext: ComponentContextType<this>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillGenerate !== void 0) {
        componentObserver.componentWillGenerate(componentContext, this);
      }
    }
  }

  protected onGenerate(componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected didGenerate(componentContext: ComponentContextType<this>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidGenerate !== void 0) {
        componentObserver.componentDidGenerate(componentContext, this);
      }
    }
  }

  protected willAssemble(componentContext: ComponentContextType<this>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillAssemble !== void 0) {
        componentObserver.componentWillAssemble(componentContext, this);
      }
    }
  }

  protected onAssemble(componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected didAssemble(componentContext: ComponentContextType<this>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidAssemble !== void 0) {
        componentObserver.componentDidAssemble(componentContext, this);
      }
    }
  }

  /** @hidden */
  protected doCompileChildComponents(compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    if ((compileFlags & Component.CompileMask) !== 0) {
      this.willCompileChildComponents(compileFlags, componentContext);
      this.onCompileChildComponents(compileFlags, componentContext);
      this.didCompileChildComponents(compileFlags, componentContext);
    }
  }

  protected willCompileChildComponents(compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected onCompileChildComponents(compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    this.compileChildComponents(compileFlags, componentContext, this.compileChildComponent);
  }

  protected didCompileChildComponents(compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected compileChildComponents(compileFlags: ComponentFlags, componentContext: ComponentContextType<this>,
                                   compileChildComponent: (this: this, childComponent: Component, compileFlags: ComponentFlags,
                                                           componentContext: ComponentContextType<this>) => void): void {
    type self = this;
    function doCompileChildComponent(this: self, childComponent: Component): void {
      compileChildComponent.call(this, childComponent, compileFlags, componentContext);
      if ((childComponent.componentFlags & Component.RemovingFlag) !== 0) {
        childComponent.setComponentFlags(childComponent.componentFlags & ~Component.RemovingFlag);
        this.removeChildComponent(childComponent);
      }
    }
    this.forEachChildComponent(doCompileChildComponent, this);
  }

  /** @hidden */
  protected compileChildComponent(childComponent: Component, compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    this.willCompileChildComponent(childComponent, compileFlags, componentContext);
    this.onCompileChildComponent(childComponent, compileFlags, componentContext);
    this.didCompileChildComponent(childComponent, compileFlags, componentContext);
  }

  protected willCompileChildComponent(childComponent: Component, compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected onCompileChildComponent(childComponent: Component, compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    childComponent.cascadeCompile(compileFlags, componentContext);
  }

  protected didCompileChildComponent(childComponent: Component, compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // hook
  }

  isExecuting(): boolean {
    return (this.componentFlags & Component.ExecutingFlag) !== 0;
  }

  needsExecute(executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): ComponentFlags {
    return executeFlags;
  }

  abstract cascadeExecute(executeFlags: ComponentFlags, componentContext: ComponentContext): void;

  protected willExecute(executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected onExecute(executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected didExecute(executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected willRevise(componentContext: ComponentContextType<this>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillRevise !== void 0) {
        componentObserver.componentWillRevise(componentContext, this);
      }
    }
  }

  protected onRevise(componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected didRevise(componentContext: ComponentContextType<this>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidRevise !== void 0) {
        componentObserver.componentDidRevise(componentContext, this);
      }
    }
  }

  protected willCompute(componentContext: ComponentContextType<this>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillCompute !== void 0) {
        componentObserver.componentWillCompute(componentContext, this);
      }
    }
  }

  protected onCompute(componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected didCompute(componentContext: ComponentContextType<this>): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidCompute !== void 0) {
        componentObserver.componentDidCompute(componentContext, this);
      }
    }
  }

  /** @hidden */
  protected doExecuteChildComponents(executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    if ((executeFlags & Component.ExecuteMask) !== 0) {
      this.willExecuteChildComponents(executeFlags, componentContext);
      this.onExecuteChildComponents(executeFlags, componentContext);
      this.didExecuteChildComponents(executeFlags, componentContext);
    }
  }

  protected willExecuteChildComponents(executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected onExecuteChildComponents(executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    this.executeChildComponents(executeFlags, componentContext, this.executeChildComponent);
  }

  protected didExecuteChildComponents(executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected executeChildComponents(executeFlags: ComponentFlags, componentContext: ComponentContextType<this>,
                                   executeChildComponent: (this: this, childComponent: Component, executeFlags: ComponentFlags,
                                                           componentContext: ComponentContextType<this>) => void): void {
    type self = this;
    function doExecuteChildComponent(this: self, childComponent: Component): void {
      executeChildComponent.call(this, childComponent, executeFlags, componentContext);
      if ((childComponent.componentFlags & Component.RemovingFlag) !== 0) {
        childComponent.setComponentFlags(childComponent.componentFlags & ~Component.RemovingFlag);
        this.removeChildComponent(childComponent);
      }
    }
    this.forEachChildComponent(doExecuteChildComponent, this);
  }

  /** @hidden */
  protected executeChildComponent(childComponent: Component, executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    this.willExecuteChildComponent(childComponent, executeFlags, componentContext);
    this.onExecuteChildComponent(childComponent, executeFlags, componentContext);
    this.didExecuteChildComponent(childComponent, executeFlags, componentContext);
  }

  protected willExecuteChildComponent(childComponent: Component, executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected onExecuteChildComponent(childComponent: Component, executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    childComponent.cascadeExecute(executeFlags, componentContext);
  }

  protected didExecuteChildComponent(childComponent: Component, executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // hook
  }

  abstract hasComponentService(serviceName: string): boolean;

  abstract getComponentService(serviceName: string): ComponentService<this, unknown> | null;

  abstract setComponentService(serviceName: string, componentService: ComponentService<this, unknown> | null): void;

  /** @hidden */
  getLazyComponentService(serviceName: string): ComponentService<this, unknown> | null {
    let componentService = this.getComponentService(serviceName);
    if (componentService === null) {
      const constructor = Component.getComponentServiceConstructor(serviceName, Object.getPrototypeOf(this));
      if (constructor !== null) {
        componentService = new constructor(this, serviceName) as ComponentService<this, unknown>;
        this.setComponentService(serviceName, componentService);
      }
    }
    return componentService;
  }

  abstract hasComponentProperty(propertyName: string): boolean;

  abstract getComponentProperty(propertyName: string): ComponentProperty<this, unknown> | null;

  abstract setComponentProperty(propertyName: string, componentProperty: ComponentProperty<this, unknown> | null): void;

  /** @hidden */
  getLazyComponentProperty(propertyName: string): ComponentProperty<this, unknown> | null {
    let componentProperty = this.getComponentProperty(propertyName);
    if (componentProperty === null) {
      const constructor = Component.getComponentPropertyConstructor(propertyName, Object.getPrototypeOf(this));
      if (constructor !== null) {
        componentProperty = new constructor(this, propertyName) as ComponentProperty<this, unknown>;
        this.setComponentProperty(propertyName, componentProperty);
      }
    }
    return componentProperty
  }

  abstract hasComponentModel(modelName: string): boolean;

  abstract getComponentModel(modelName: string): ComponentModel<this, Model> | null;

  abstract setComponentModel(modelName: string, componentModel: ComponentModel<this, any> | null): void;

  /** @hidden */
  getLazyComponentModel(modelName: string): ComponentModel<this, Model> | null {
    let componentModel = this.getComponentModel(modelName);
    if (componentModel === null) {
      const constructor = Component.getComponentModelConstructor(modelName, Object.getPrototypeOf(this));
      if (constructor !== null) {
        componentModel = new constructor(this, modelName) as ComponentModel<this, Model>;
        this.setComponentModel(modelName, componentModel);
      }
    }
    return componentModel;
  }

  /** @hidden */
  willSetComponentModel<M extends Model>(componentModel: ComponentModel<this, M>, newModel: M | null, oldModel: M | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillSetModel !== void 0) {
        componentObserver.componentWillSetModel(componentModel, newModel, oldModel, this);
      }
    }
  }

  /** @hidden */
  onSetComponentModel<M extends Model>(componentModel: ComponentModel<this, M>, newModel: M | null, oldModel: M | null): void {
    // hook
  }

  /** @hidden */
  didSetComponentModel<M extends Model>(componentModel: ComponentModel<this, M>, newModel: M | null, oldModel: M | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidSetModel !== void 0) {
        componentObserver.componentDidSetModel(componentModel, newModel, oldModel, this);
      }
    }
  }

  abstract hasComponentTrait(traitName: string): boolean;

  abstract getComponentTrait(traitName: string): ComponentTrait<this, Trait> | null;

  abstract setComponentTrait(traitName: string, componentTrait: ComponentTrait<this, any> | null): void;

  /** @hidden */
  getLazyComponentTrait(traitName: string): ComponentTrait<this, Trait> | null {
    let componentTrait = this.getComponentTrait(traitName);
    if (componentTrait === null) {
      const constructor = Component.getComponentTraitConstructor(traitName, Object.getPrototypeOf(this));
      if (constructor !== null) {
        componentTrait = new constructor(this, traitName) as ComponentTrait<this, Trait>;
        this.setComponentTrait(traitName, componentTrait);
      }
    }
    return componentTrait;
  }

  /** @hidden */
  willSetComponentTrait<R extends Trait>(componentTrait: ComponentTrait<this, R>, newTrait: R | null, oldTrait: R | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillSetTrait !== void 0) {
        componentObserver.componentWillSetTrait(componentTrait, newTrait, oldTrait, this);
      }
    }
  }

  /** @hidden */
  onSetComponentTrait<R extends Trait>(componentTrait: ComponentTrait<this, R>, newTrait: R | null, oldTrait: R | null): void {
    // hook
  }

  /** @hidden */
  didSetComponentTrait<R extends Trait>(componentTrait: ComponentTrait<this, R>, newTrait: R | null, oldTrait: R | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidSetTrait !== void 0) {
        componentObserver.componentDidSetTrait(componentTrait, newTrait, oldTrait, this);
      }
    }
  }

  abstract hasComponentView(viewName: string): boolean;

  abstract getComponentView(viewName: string): ComponentView<this, View> | null;

  abstract setComponentView(viewName: string, componentView: ComponentView<this, any> | null): void;

  /** @hidden */
  getLazyComponentView(viewName: string): ComponentView<this, View> | null {
    let componentView = this.getComponentView(viewName);
    if (componentView === null) {
      const constructor = Component.getComponentViewConstructor(viewName, Object.getPrototypeOf(this));
      if (constructor !== null) {
        componentView = new constructor(this, viewName) as ComponentView<this, View>;
        this.setComponentView(viewName, componentView);
      }
    }
    return componentView;
  }

  /** @hidden */
  willSetComponentView<V extends View>(componentView: ComponentView<this, V>, newView: V | null, oldView: V | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentWillSetView !== void 0) {
        componentObserver.componentWillSetView(componentView, newView, oldView, this);
      }
    }
  }

  /** @hidden */
  onSetComponentView<V extends View>(componentView: ComponentView<this, V>, newView: V | null, oldView: V | null): void {
    // hook
  }

  /** @hidden */
  didSetComponentView<V extends View>(componentView: ComponentView<this, V>, newView: V | null, oldView: V | null): void {
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      if (componentObserver.componentDidSetView !== void 0) {
        componentObserver.componentDidSetView(componentView, newView, oldView, this);
      }
    }
  }

  abstract hasComponentFastener(fastenerName: string): boolean;

  abstract getComponentFastener(fastenerName: string): ComponentFastener<this, Component> | null;

  abstract setComponentFastener(fastenerName: string, componentFastener: ComponentFastener<this, any> | null): void;

  /** @hidden */
  getLazyComponentFastener(fastenerName: string): ComponentFastener<this, Component> | null {
    let componentFastener = this.getComponentFastener(fastenerName);
    if (componentFastener === null) {
      const constructor = Component.getComponentFastenerConstructor(fastenerName, Object.getPrototypeOf(this));
      if (constructor !== null) {
        componentFastener = new constructor(this, fastenerName) as ComponentFastener<this, Component>;
        this.setComponentFastener(fastenerName, componentFastener);
      }
    }
    return componentFastener;
  }

  /** @hidden */
  extendComponentContext(componentContext: ComponentContext): ComponentContextType<this> {
    return componentContext as ComponentContextType<this>;
  }

  get superComponentContext(): ComponentContext {
    const parentComponent = this.parentComponent;
    if (parentComponent !== null) {
      return parentComponent.componentContext;
    } else {
      return this.executeService.updatedComponentContext();
    }
  }

  get componentContext(): ComponentContext {
    return this.extendComponentContext(this.superComponentContext);
  }

  /** @hidden */
  static getComponentServiceConstructor(serviceName: string, componentPrototype: ComponentPrototype | null = null): ComponentServiceConstructor<Component, unknown> | null {
    if (componentPrototype === null) {
      componentPrototype = this.prototype as ComponentPrototype;
    }
    do {
      if (Object.prototype.hasOwnProperty.call(componentPrototype, "componentServiceConstructors")) {
        const constructor = componentPrototype.componentServiceConstructors![serviceName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      componentPrototype = Object.getPrototypeOf(componentPrototype);
    } while (componentPrototype !== null);
    return null;
  }

  /** @hidden */
  static decorateComponentService(constructor: ComponentServiceConstructor<Component, unknown>,
                                  target: Object, propertyKey: string | symbol): void {
    const componentPrototype = target as ComponentPrototype;
    if (!Object.prototype.hasOwnProperty.call(componentPrototype, "componentServiceConstructors")) {
      componentPrototype.componentServiceConstructors = {};
    }
    componentPrototype.componentServiceConstructors![propertyKey.toString()] = constructor;
    Object.defineProperty(target, propertyKey, {
      get: function (this: Component): ComponentService<Component, unknown> {
        let componentService = this.getComponentService(propertyKey.toString());
        if (componentService === null) {
          componentService = new constructor(this, propertyKey.toString());
          this.setComponentService(propertyKey.toString(), componentService);
        }
        return componentService;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getComponentPropertyConstructor(propertyName: string, componentPrototype: ComponentPrototype | null = null): ComponentPropertyConstructor<Component, unknown> | null {
    if (componentPrototype === null) {
      componentPrototype = this.prototype as ComponentPrototype;
    }
    do {
      if (Object.prototype.hasOwnProperty.call(componentPrototype, "componentPropertyConstructors")) {
        const constructor = componentPrototype.componentPropertyConstructors![propertyName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      componentPrototype = Object.getPrototypeOf(componentPrototype);
    } while (componentPrototype !== null);
    return null;
  }

  /** @hidden */
  static decorateComponentProperty(constructor: ComponentPropertyConstructor<Component, unknown>,
                                   target: Object, propertyKey: string | symbol): void {
    const componentPrototype = target as ComponentPrototype;
    if (!Object.prototype.hasOwnProperty.call(componentPrototype, "componentPropertyConstructors")) {
      componentPrototype.componentPropertyConstructors = {};
    }
    componentPrototype.componentPropertyConstructors![propertyKey.toString()] = constructor;
    Object.defineProperty(target, propertyKey, {
      get: function (this: Component): ComponentProperty<Component, unknown> {
        let componentProperty = this.getComponentProperty(propertyKey.toString());
        if (componentProperty === null) {
          componentProperty = new constructor(this, propertyKey.toString());
          this.setComponentProperty(propertyKey.toString(), componentProperty);
        }
        return componentProperty;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getComponentModelConstructor(modelName: string, componentPrototype: ComponentPrototype | null = null): ComponentModelConstructor<Component, Model> | null {
    if (componentPrototype === null) {
      componentPrototype = this.prototype as ComponentPrototype;
    }
    do {
      if (Object.prototype.hasOwnProperty.call(componentPrototype, "componentModelConstructors")) {
        const constructor = componentPrototype.componentModelConstructors![modelName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      componentPrototype = Object.getPrototypeOf(componentPrototype);
    } while (componentPrototype !== null);
    return null;
  }

  /** @hidden */
  static decorateComponentModel(constructor: ComponentModelConstructor<Component, Model>,
                                target: Object, propertyKey: string | symbol): void {
    const componentPrototype = target as ComponentPrototype;
    if (!Object.prototype.hasOwnProperty.call(componentPrototype, "componentModelConstructors")) {
      componentPrototype.componentModelConstructors = {};
    }
    componentPrototype.componentModelConstructors![propertyKey.toString()] = constructor;
    Object.defineProperty(target, propertyKey, {
      get: function (this: Component): ComponentModel<Component, Model> {
        let componentModel = this.getComponentModel(propertyKey.toString());
        if (componentModel === null) {
          componentModel = new constructor(this, propertyKey.toString());
          this.setComponentModel(propertyKey.toString(), componentModel);
        }
        return componentModel;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getComponentTraitConstructor(traitName: string, componentPrototype: ComponentPrototype | null = null): ComponentTraitConstructor<Component, Trait> | null {
    if (componentPrototype === null) {
      componentPrototype = this.prototype as ComponentPrototype;
    }
    do {
      if (Object.prototype.hasOwnProperty.call(componentPrototype, "componentTraitConstructors")) {
        const constructor = componentPrototype.componentTraitConstructors![traitName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      componentPrototype = Object.getPrototypeOf(componentPrototype);
    } while (componentPrototype !== null);
    return null;
  }

  /** @hidden */
  static decorateComponentTrait(constructor: ComponentTraitConstructor<Component, Trait>,
                                target: Object, propertyKey: string | symbol): void {
    const componentPrototype = target as ComponentPrototype;
    if (!Object.prototype.hasOwnProperty.call(componentPrototype, "componentTraitConstructors")) {
      componentPrototype.componentTraitConstructors = {};
    }
    componentPrototype.componentTraitConstructors![propertyKey.toString()] = constructor;
    Object.defineProperty(target, propertyKey, {
      get: function (this: Component): ComponentTrait<Component, Trait> {
        let componentTrait = this.getComponentTrait(propertyKey.toString());
        if (componentTrait === null) {
          componentTrait = new constructor(this, propertyKey.toString());
          this.setComponentTrait(propertyKey.toString(), componentTrait);
        }
        return componentTrait;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getComponentViewConstructor(viewName: string, componentPrototype: ComponentPrototype | null = null): ComponentViewConstructor<Component, View> | null {
    if (componentPrototype === null) {
      componentPrototype = this.prototype as ComponentPrototype;
    }
    do {
      if (Object.prototype.hasOwnProperty.call(componentPrototype, "componentViewConstructors")) {
        const constructor = componentPrototype.componentViewConstructors![viewName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      componentPrototype = Object.getPrototypeOf(componentPrototype);
    } while (componentPrototype !== null);
    return null;
  }

  /** @hidden */
  static decorateComponentView(constructor: ComponentViewConstructor<Component, View>,
                               target: Object, propertyKey: string | symbol): void {
    const componentPrototype = target as ComponentPrototype;
    if (!Object.prototype.hasOwnProperty.call(componentPrototype, "componentViewConstructors")) {
      componentPrototype.componentViewConstructors = {};
    }
    componentPrototype.componentViewConstructors![propertyKey.toString()] = constructor;
    Object.defineProperty(target, propertyKey, {
      get: function (this: Component): ComponentView<Component, View> {
        let componentView = this.getComponentView(propertyKey.toString());
        if (componentView === null) {
          componentView = new constructor(this, propertyKey.toString());
          this.setComponentView(propertyKey.toString(), componentView);
        }
        return componentView;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getComponentFastenerConstructor(fastenerName: string, componentPrototype: ComponentPrototype | null = null): ComponentFastenerConstructor<Component, Component> | null {
    if (componentPrototype === null) {
      componentPrototype = this.prototype as ComponentPrototype;
    }
    do {
      if (Object.prototype.hasOwnProperty.call(componentPrototype, "componentFastenerConstructors")) {
        const constructor = componentPrototype.componentFastenerConstructors![fastenerName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      componentPrototype = Object.getPrototypeOf(componentPrototype);
    } while (componentPrototype !== null);
    return null;
  }

  /** @hidden */
  static decorateComponentFastener(constructor: ComponentFastenerConstructor<Component, Component>,
                                   target: Object, propertyKey: string | symbol): void {
    const componentPrototype = target as ComponentPrototype;
    if (!Object.prototype.hasOwnProperty.call(componentPrototype, "componentFastenerConstructors")) {
      componentPrototype.componentFastenerConstructors = {};
    }
    componentPrototype.componentFastenerConstructors![propertyKey.toString()] = constructor;
    Object.defineProperty(target, propertyKey, {
      get: function (this: Component): ComponentFastener<Component, Component> {
        let componentFastener = this.getComponentFastener(propertyKey.toString());
        if (componentFastener === null) {
          componentFastener = new constructor(this, propertyKey.toString());
          this.setComponentFastener(propertyKey.toString(), componentFastener);
        }
        return componentFastener;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static readonly MountedFlag: ComponentFlags = 1 << 0;
  /** @hidden */
  static readonly PoweredFlag: ComponentFlags = 1 << 1;
  /** @hidden */
  static readonly TraversingFlag: ComponentFlags = 1 << 2;
  /** @hidden */
  static readonly CompilingFlag: ComponentFlags = 1 << 3;
  /** @hidden */
  static readonly ExecutingFlag: ComponentFlags = 1 << 4;
  /** @hidden */
  static readonly RemovingFlag: ComponentFlags = 1 << 5;
  /** @hidden */
  static readonly ImmediateFlag: ComponentFlags = 1 << 6;
  /** @hidden */
  static readonly UpdatingMask: ComponentFlags = Component.CompilingFlag
                                               | Component.ExecutingFlag;
  /** @hidden */
  static readonly StatusMask: ComponentFlags = Component.MountedFlag
                                             | Component.PoweredFlag
                                             | Component.TraversingFlag
                                             | Component.CompilingFlag
                                             | Component.ExecutingFlag
                                             | Component.RemovingFlag
                                             | Component.ImmediateFlag;

  static readonly NeedsCompile: ComponentFlags = 1 << 7;
  static readonly NeedsResolve: ComponentFlags = 1 << 8;
  static readonly NeedsGenerate: ComponentFlags = 1 << 9;
  static readonly NeedsAssemble: ComponentFlags = 1 << 10;
  /** @hidden */
  static readonly CompileMask: ComponentFlags = Component.NeedsCompile
                                              | Component.NeedsResolve
                                              | Component.NeedsGenerate
                                              | Component.NeedsAssemble;

  static readonly NeedsExecute: ComponentFlags = 1 << 11;
  static readonly NeedsRevise: ComponentFlags = 1 << 12;
  static readonly NeedsCompute: ComponentFlags = 1 << 13;
  /** @hidden */
  static readonly ExecuteMask: ComponentFlags = Component.NeedsExecute
                                              | Component.NeedsRevise
                                              | Component.NeedsCompute;

  /** @hidden */
  static readonly UpdateMask: ComponentFlags = Component.CompileMask
                                             | Component.ExecuteMask;

  /** @hidden */
  static readonly ComponentFlagShift: ComponentFlags = 24;
  /** @hidden */
  static readonly ComponentFlagMask: ComponentFlags = (1 << Component.ComponentFlagShift) - 1;

  static readonly mountFlags: ComponentFlags = 0;
  static readonly powerFlags: ComponentFlags = 0;
  static readonly insertChildFlags: ComponentFlags = 0;
  static readonly removeChildFlags: ComponentFlags = 0;
}
