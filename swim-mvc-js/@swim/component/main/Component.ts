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

import {View} from "@swim/view";
import {Model, Trait} from "@swim/model";
import {ComponentContextType, ComponentContext} from "./ComponentContext";
import {ComponentObserverType, ComponentObserver} from "./ComponentObserver";
import {ComponentManager} from "./manager/ComponentManager";
import {ComponentServiceConstructor, ComponentService} from "./service/ComponentService";
import {ExecuteService} from "./service/ExecuteService";
import {HistoryService} from "./service/HistoryService";
import {ComponentScopeConstructor, ComponentScope} from "./scope/ComponentScope";
import {ComponentModelConstructor, ComponentModel} from "./model/ComponentModel";
import {ComponentTraitConstructor, ComponentTrait} from "./trait/ComponentTrait";
import {ComponentViewConstructor, ComponentView} from "./view/ComponentView";
import {ComponentBindingConstructor, ComponentBinding} from "./binding/ComponentBinding";
import {GenericComponent} from "./generic/GenericComponent";
import {CompositeComponent} from "./generic/CompositeComponent";

export type ComponentFlags = number;

export interface ComponentInit {
  key?: string;
}

export interface ComponentPrototype<C extends Component = Component> extends Function {
  readonly prototype: C;
}

export interface ComponentClass {
  readonly mountFlags: ComponentFlags;

  readonly powerFlags: ComponentFlags;

  readonly insertChildFlags: ComponentFlags;

  readonly removeChildFlags: ComponentFlags;

  /** @hidden */
  _componentServiceConstructors?: {[serviceName: string]: ComponentServiceConstructor<Component, unknown> | undefined};

  /** @hidden */
  _componentScopeConstructors?: {[scopeName: string]: ComponentScopeConstructor<Component, unknown> | undefined};

  /** @hidden */
  _componentModelConstructors?: {[modelName: string]: ComponentModelConstructor<Component, Model> | undefined};

  /** @hidden */
  _componentTraitConstructors?: {[traitName: string]: ComponentTraitConstructor<Component, Trait> | undefined};

  /** @hidden */
  _componentViewConstructors?: {[viewName: string]: ComponentViewConstructor<Component, View> | undefined};

  /** @hidden */
  _componentBindingConstructors?: {[bindingName: string]: ComponentBindingConstructor<Component, Component> | undefined};
}

export abstract class Component {
  /** @hidden */
  _componentFlags: ComponentFlags;
  /** @hidden */
  _componentObservers?: ReadonlyArray<ComponentObserverType<this>>;

  constructor() {
    this._componentFlags = 0;
  }

  initComponent(init: ComponentInit): void {
    // hook
  }

  get componentClass(): ComponentClass {
    return this.constructor as unknown as ComponentClass;
  }

  get componentFlags(): ComponentFlags {
    return this._componentFlags;
  }

  setComponentFlags(componentFlags: ComponentFlags): void {
    this._componentFlags = componentFlags;
  }

  get componentObservers(): ReadonlyArray<ComponentObserver> {
    let componentObservers = this._componentObservers;
    if (componentObservers === void 0) {
      componentObservers = [];
      this._componentObservers = componentObservers;
    }
    return componentObservers;
  }

  addComponentObserver(newComponentObserver: ComponentObserverType<this>): void {
    const oldComponentObservers = this._componentObservers;
    const n = oldComponentObservers !== void 0 ? oldComponentObservers.length : 0;
    const newComponentObservers = new Array<ComponentObserverType<this>>(n + 1);
    for (let i = 0; i < n; i += 1) {
      const componentObserver = oldComponentObservers![i];
      if (componentObserver !== newComponentObserver) {
        newComponentObservers[i] = componentObserver;
      } else {
        return;
      }
    }
    newComponentObservers[n] = newComponentObserver;
    this.willAddComponentObserver(newComponentObserver);
    this._componentObservers = newComponentObservers;
    this.onAddComponentObserver(newComponentObserver);
    this.didAddComponentObserver(newComponentObserver);
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

  removeComponentObserver(oldComponentObserver: ComponentObserverType<this>): void {
    const oldComponentObservers = this._componentObservers;
    const n = oldComponentObservers !== void 0 ? oldComponentObservers.length : 0;
    if (n !== 0) {
      const newComponentObservers = new Array<ComponentObserverType<this>>(n - 1);
      let i = 0;
      while (i < n) {
        const componentObserver = oldComponentObservers![i];
        if (componentObserver !== oldComponentObserver) {
          newComponentObservers[i] = componentObserver;
          i += 1;
        } else {
          i += 1;
          while (i < n) {
            newComponentObservers[i - 1] = oldComponentObservers![i];
            i += 1
          }
          this.willRemoveComponentObserver(oldComponentObserver);
          this._componentObservers = newComponentObservers;
          this.onRemoveComponentObserver(oldComponentObserver);
          this.didRemoveComponentObserver(oldComponentObserver);
          return;
        }
      }
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

  abstract get key(): string | undefined;

  /** @hidden */
  abstract setKey(key: string | undefined): void;

  abstract get parentComponent(): Component | null;

  /** @hidden */
  abstract setParentComponent(newParentComponent: Component | null, oldParentComponent: Component | null): void;

  protected willSetParentComponent(newParentComponent: Component | null, oldParentComponent: Component | null): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
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
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentDidSetParentComponent !== void 0) {
        componentObserver.componentDidSetParentComponent(newParentComponent, oldParentComponent, this);
      }
    }
  }

  abstract remove(): void;

  abstract get childComponentCount(): number;

  abstract get childComponents(): ReadonlyArray<Component>;

  abstract firstChildComponent(): Component | null;

  abstract lastChildComponent(): Component | null;

  abstract nextChildComponent(targetComponent: Component): Component | null;

  abstract previousChildComponent(targetComponent: Component): Component | null;

  abstract forEachChildComponent<T, S = unknown>(callback: (this: S, childComponent: Component) => T | void,
                                                 thisArg?: S): T | undefined;

  abstract getChildComponent(key: string): Component | null;

  abstract setChildComponent(key: string, newChildComponent: Component | null): Component | null;

  abstract appendChildComponent(childComponent: Component, key?: string): void;

  abstract prependChildComponent(childComponent: Component, key?: string): void;

  abstract insertChildComponent(childComponent: Component, targetComponent: Component | null, key?: string): void;

  get insertChildFlags(): ComponentFlags {
    return this.componentClass.insertChildFlags;
  }

  protected willInsertChildComponent(childComponent: Component, targetComponent: Component | null | undefined): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentWillInsertChildComponent !== void 0) {
        componentObserver.componentWillInsertChildComponent(childComponent, targetComponent, this);
      }
    }
  }

  protected onInsertChildComponent(childComponent: Component, targetComponent: Component | null | undefined): void {
    this.requireUpdate(this.insertChildFlags);
  }

  protected didInsertChildComponent(childComponent: Component, targetComponent: Component | null | undefined): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
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
    return this.componentClass.removeChildFlags;
  }

  protected willRemoveChildComponent(childComponent: Component): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentWillRemoveChildComponent !== void 0) {
        componentObserver.componentWillRemoveChildComponent(childComponent, this);
      }
    }
  }

  protected onRemoveChildComponent(childComponent: Component): void {
    this.requireUpdate(this.removeChildFlags);
  }

  protected didRemoveChildComponent(childComponent: Component): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentDidRemoveChildComponent !== void 0) {
        componentObserver.componentDidRemoveChildComponent(childComponent, this);
      }
    }
  }

  getSuperComponent<C extends Component>(componentPrototype: ComponentPrototype<C>): C | null {
    const parentComponent = this.parentComponent;
    if (parentComponent === null) {
      return null;
    } else if (parentComponent instanceof componentPrototype) {
      return parentComponent;
    } else {
      return parentComponent.getSuperComponent(componentPrototype);
    }
  }

  getBaseComponent<C extends Component>(componentPrototype: ComponentPrototype<C>): C | null {
    const parentComponent = this.parentComponent;
    if (parentComponent === null) {
      return null;
    } else {
      const baseComponent = parentComponent.getBaseComponent(componentPrototype);
      if (baseComponent !== null) {
        return baseComponent;
      } else {
        return parentComponent instanceof componentPrototype ? parentComponent : null;
      }
    }
  }

  readonly executeService: ExecuteService<this>; // defined by ExecuteService

  readonly historyService: HistoryService<this>; // defined by HistoryService

  isMounted(): boolean {
    return (this.componentFlags & Component.MountedFlag) !== 0;
  }

  get mountFlags(): ComponentFlags {
    return this.componentClass.mountFlags;
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
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentWillMount !== void 0) {
        componentObserver.componentWillMount(this);
      }
    }
  }

  protected onMount(): void {
    this.requireUpdate(this.mountFlags);
  }

  protected didMount(): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentDidMount !== void 0) {
        componentObserver.componentDidMount(this);
      }
    }
  }

  abstract cascadeUnmount(): void;

  protected willUnmount(): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentWillUnmount !== void 0) {
        componentObserver.componentWillUnmount(this);
      }
    }
  }

  protected onUnmount(): void {
    // hook
  }

  protected didUnmount(): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentDidUnmount !== void 0) {
        componentObserver.componentDidUnmount(this);
      }
    }
  }

  isPowered(): boolean {
    return (this.componentFlags & Component.PoweredFlag) !== 0;
  }

  get powerFlags(): ComponentFlags {
    return this.componentClass.powerFlags;
  }

  abstract cascadePower(): void;

  protected willPower(): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
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
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentDidPower !== void 0) {
        componentObserver.componentDidPower(this);
      }
    }
  }

  abstract cascadeUnpower(): void;

  protected willUnpower(): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentWillUnpower !== void 0) {
        componentObserver.componentWillUnpower(this);
      }
    }
  }

  protected onUnpower(): void {
    // hook
  }

  protected didUnpower(): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
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
      const deltaUpdateFlags = newUpdateFlags & ~oldUpdateFlags;
      if (deltaUpdateFlags !== 0) {
        this.setComponentFlags(newUpdateFlags);
        this.requestUpdate(this, deltaUpdateFlags, immediate);
      }
      this.didRequireUpdate(updateFlags, immediate);
    }
  }

  protected willRequireUpdate(updateFlags: ComponentFlags, immediate: boolean): void {
    // hook
  }

  protected didRequireUpdate(updateFlags: ComponentFlags, immediate: boolean): void {
    // hook
  }

  requestUpdate(targetComponent: Component, updateFlags: ComponentFlags, immediate: boolean): void {
    updateFlags = this.willRequestUpdate(targetComponent, updateFlags, immediate);
    this._componentFlags |= updateFlags & (Component.NeedsCompile | Component.NeedsExecute);
    const parentComponent = this.parentComponent;
    if (parentComponent !== null) {
      parentComponent.requestUpdate(targetComponent, updateFlags, immediate);
    } else if (this.isMounted()) {
      const executeManager = this.executeService.manager;
      if (executeManager !== void 0) {
        executeManager.requestUpdate(targetComponent, updateFlags, immediate);
      }
    }
    this.didRequestUpdate(targetComponent, updateFlags, immediate);
  }

  protected willRequestUpdate(targetComponent: Component, updateFlags: ComponentFlags, immediate: boolean): ComponentFlags {
    let additionalFlags = this.modifyUpdate(targetComponent, updateFlags);
    additionalFlags &= ~Component.StatusMask;
    if (additionalFlags !== 0) {
      updateFlags |= additionalFlags;
      this.setComponentFlags(this.componentFlags | additionalFlags);
    }
    return updateFlags;
  }

  protected didRequestUpdate(targetComponent: Component, updateFlags: ComponentFlags, immediate: boolean): void {
    // hook
  }

  protected modifyUpdate(targetComponent: Component, updateFlags: ComponentFlags): ComponentFlags {
    let additionalFlags = 0;
    if ((updateFlags & Component.CompileMask) !== 0) {
      additionalFlags |= Component.NeedsCompile;
    }
    if ((updateFlags & Component.ExecuteMask) !== 0) {
      additionalFlags |= Component.ExecuteMask;
    }
    return additionalFlags;
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
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentWillResolve !== void 0) {
        componentObserver.componentWillResolve(componentContext, this);
      }
    }
  }

  protected onResolve(componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected didResolve(componentContext: ComponentContextType<this>): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentDidResolve !== void 0) {
        componentObserver.componentDidResolve(componentContext, this);
      }
    }
  }

  protected willGenerate(componentContext: ComponentContextType<this>): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentWillGenerate !== void 0) {
        componentObserver.componentWillGenerate(componentContext, this);
      }
    }
  }

  protected onGenerate(componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected didGenerate(componentContext: ComponentContextType<this>): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentDidGenerate !== void 0) {
        componentObserver.componentDidGenerate(componentContext, this);
      }
    }
  }

  protected willAssemble(componentContext: ComponentContextType<this>): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentWillAssemble !== void 0) {
        componentObserver.componentWillAssemble(componentContext, this);
      }
    }
  }

  protected onAssemble(componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected didAssemble(componentContext: ComponentContextType<this>): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentDidAssemble !== void 0) {
        componentObserver.componentDidAssemble(componentContext, this);
      }
    }
  }

  /** @hidden */
  protected doCompileChildComponents(compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    if ((compileFlags & Component.CompileMask) !== 0 && this.childComponentCount !== 0) {
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
    function doCompileChildComponent(this: Component, childComponent: Component): void {
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
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentWillRevise !== void 0) {
        componentObserver.componentWillRevise(componentContext, this);
      }
    }
  }

  protected onRevise(componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected didRevise(componentContext: ComponentContextType<this>): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentDidRevise !== void 0) {
        componentObserver.componentDidRevise(componentContext, this);
      }
    }
  }

  protected willCompute(componentContext: ComponentContextType<this>): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentWillCompute !== void 0) {
        componentObserver.componentWillCompute(componentContext, this);
      }
    }
  }

  protected onCompute(componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected didCompute(componentContext: ComponentContextType<this>): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentDidCompute !== void 0) {
        componentObserver.componentDidCompute(componentContext, this);
      }
    }
  }

  /** @hidden */
  protected doExecuteChildComponents(executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    if ((executeFlags & Component.ExecuteMask) !== 0 && this.childComponentCount !== 0) {
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
    function doExecuteChildComponent(this: Component, childComponent: Component): void {
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
      const componentClass = (this as any).__proto__ as ComponentClass;
      const constructor = Component.getComponentServiceConstructor(serviceName, componentClass);
      if (constructor !== null) {
        componentService = new constructor(this, serviceName) as ComponentService<this, unknown>;
        this.setComponentService(serviceName, componentService);
      }
    }
    return componentService;
  }

  abstract hasComponentScope(scopeName: string): boolean;

  abstract getComponentScope(scopeName: string): ComponentScope<this, unknown> | null;

  abstract setComponentScope(scopeName: string, componentScope: ComponentScope<this, unknown> | null): void;

  /** @hidden */
  getLazyComponentScope(scopeName: string): ComponentScope<this, unknown> | null {
    let componentScope = this.getComponentScope(scopeName);
    if (componentScope === null) {
      const componentClass = (this as any).__proto__ as ComponentClass;
      const constructor = Component.getComponentScopeConstructor(scopeName, componentClass);
      if (constructor !== null) {
        componentScope = new constructor(this, scopeName) as ComponentScope<this, unknown>;
        this.setComponentScope(scopeName, componentScope);
      }
    }
    return componentScope;
  }

  abstract hasComponentModel(modelName: string): boolean;

  abstract getComponentModel(modelName: string): ComponentModel<this, Model> | null;

  abstract setComponentModel(modelName: string, componentModel: ComponentModel<this, Model> | null): void;

  /** @hidden */
  getLazyComponentModel(modelName: string): ComponentModel<this, Model> | null {
    let componentModel = this.getComponentModel(modelName);
    if (componentModel === null) {
      const componentClass = (this as any).__proto__ as ComponentClass;
      const constructor = Component.getComponentModelConstructor(modelName, componentClass);
      if (constructor !== null) {
        componentModel = new constructor(this, modelName) as ComponentModel<this, Model>;
        this.setComponentModel(modelName, componentModel);
      }
    }
    return componentModel;
  }

  /** @hidden */
  willSetComponentModel<M extends Model>(componentModel: ComponentModel<this, M>, newModel: M | null, oldModel: M | null): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
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
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentDidSetModel !== void 0) {
        componentObserver.componentDidSetModel(componentModel, newModel, oldModel, this);
      }
    }
  }

  abstract hasComponentTrait(traitName: string): boolean;

  abstract getComponentTrait(traitName: string): ComponentTrait<this, Trait> | null;

  abstract setComponentTrait(traitName: string, componentTrait: ComponentTrait<this, Trait> | null): void;

  /** @hidden */
  getLazyComponentTrait(traitName: string): ComponentTrait<this, Trait> | null {
    let componentTrait = this.getComponentTrait(traitName);
    if (componentTrait === null) {
      const componentClass = (this as any).__proto__ as ComponentClass;
      const constructor = Component.getComponentTraitConstructor(traitName, componentClass);
      if (constructor !== null) {
        componentTrait = new constructor(this, traitName) as ComponentTrait<this, Trait>;
        this.setComponentTrait(traitName, componentTrait);
      }
    }
    return componentTrait;
  }

  /** @hidden */
  willSetComponentTrait<R extends Trait>(componentTrait: ComponentTrait<this, R>, newTrait: R | null, oldTrait: R | null): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
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
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentDidSetTrait !== void 0) {
        componentObserver.componentDidSetTrait(componentTrait, newTrait, oldTrait, this);
      }
    }
  }

  abstract hasComponentView(viewName: string): boolean;

  abstract getComponentView(viewName: string): ComponentView<this, View> | null;

  abstract setComponentView(viewName: string, componentView: ComponentView<this, View> | null): void;

  /** @hidden */
  getLazyComponentView(viewName: string): ComponentView<this, View> | null {
    let componentView = this.getComponentView(viewName);
    if (componentView === null) {
      const componentClass = (this as any).__proto__ as ComponentClass;
      const constructor = Component.getComponentViewConstructor(viewName, componentClass);
      if (constructor !== null) {
        componentView = new constructor(this, viewName) as ComponentView<this, View>;
        this.setComponentView(viewName, componentView);
      }
    }
    return componentView;
  }

  /** @hidden */
  willSetComponentView<V extends View>(componentView: ComponentView<this, V>, newView: V | null, oldView: V | null): void {
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
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
    const componentObservers = this._componentObservers;
    for (let i = 0, n = componentObservers !== void 0 ? componentObservers.length : 0; i < n; i += 1) {
      const componentObserver = componentObservers![i];
      if (componentObserver.componentDidSetView !== void 0) {
        componentObserver.componentDidSetView(componentView, newView, oldView, this);
      }
    }
  }

  abstract hasComponentBinding(bindingName: string): boolean;

  abstract getComponentBinding(bindingName: string): ComponentBinding<this, Component> | null;

  abstract setComponentBinding(bindingName: string, componentBinding: ComponentBinding<this, Component> | null): void;

  /** @hidden */
  getLazyComponentBinding(bindingName: string): ComponentBinding<this, Component> | null {
    let componentBinding = this.getComponentBinding(bindingName);
    if (componentBinding === null) {
      const componentClass = (this as any).__proto__ as ComponentClass;
      const constructor = Component.getComponentBindingConstructor(bindingName, componentClass);
      if (constructor !== null) {
        componentBinding = new constructor(this, bindingName) as ComponentBinding<this, Component>;
        this.setComponentBinding(bindingName, componentBinding);
      }
    }
    return componentBinding;
  }

  /** @hidden */
  extendComponentContext(componentContext: ComponentContext): ComponentContextType<this> {
    return componentContext as ComponentContextType<this>;
  }

  get superComponentContext(): ComponentContext {
    let superComponentContext: ComponentContext;
    const parentComponent = this.parentComponent;
    if (parentComponent !== null) {
      superComponentContext = parentComponent.componentContext;
    } else if (this.isMounted()) {
      const executeManager = this.executeService.manager;
      if (executeManager !== void 0) {
        superComponentContext = executeManager.componentContext;
      } else {
        superComponentContext = ComponentContext.default();
      }
    } else {
      superComponentContext = ComponentContext.default();
    }
    return superComponentContext;
  }

  get componentContext(): ComponentContext {
    return this.extendComponentContext(this.superComponentContext);
  }

  /** @hidden */
  static getComponentServiceConstructor(serviceName: string, componentClass: ComponentClass | null = null): ComponentServiceConstructor<Component, unknown> | null {
    if (componentClass === null) {
      componentClass = this.prototype as unknown as ComponentClass;
    }
    do {
      if (componentClass.hasOwnProperty("_componentServiceConstructors")) {
        const constructor = componentClass._componentServiceConstructors![serviceName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      componentClass = (componentClass as any).__proto__ as ComponentClass | null;
    } while (componentClass !== null);
    return null;
  }

  /** @hidden */
  static decorateComponentService(constructor: ComponentServiceConstructor<Component, unknown>,
                                  componentClass: ComponentClass, serviceName: string): void {
    if (!componentClass.hasOwnProperty("_componentServiceConstructors")) {
      componentClass._componentServiceConstructors = {};
    }
    componentClass._componentServiceConstructors![serviceName] = constructor;
    Object.defineProperty(componentClass, serviceName, {
      get: function (this: Component): ComponentService<Component, unknown> {
        let componentService = this.getComponentService(serviceName);
        if (componentService === null) {
          componentService = new constructor(this, serviceName);
          this.setComponentService(serviceName, componentService);
        }
        return componentService;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getComponentScopeConstructor(scopeName: string, componentClass: ComponentClass | null = null): ComponentScopeConstructor<Component, unknown> | null {
    if (componentClass === null) {
      componentClass = this.prototype as unknown as ComponentClass;
    }
    do {
      if (componentClass.hasOwnProperty("_componentScopeConstructors")) {
        const constructor = componentClass._componentScopeConstructors![scopeName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      componentClass = (componentClass as any).__proto__ as ComponentClass | null;
    } while (componentClass !== null);
    return null;
  }

  /** @hidden */
  static decorateComponentScope(constructor: ComponentScopeConstructor<Component, unknown>,
                                componentClass: ComponentClass, scopeName: string): void {
    if (!componentClass.hasOwnProperty("_componentScopeConstructors")) {
      componentClass._componentScopeConstructors = {};
    }
    componentClass._componentScopeConstructors![scopeName] = constructor;
    Object.defineProperty(componentClass, scopeName, {
      get: function (this: Component): ComponentScope<Component, unknown> {
        let componentScope = this.getComponentScope(scopeName);
        if (componentScope === null) {
          componentScope = new constructor(this, scopeName);
          this.setComponentScope(scopeName, componentScope);
        }
        return componentScope;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getComponentModelConstructor(modelName: string, componentClass: ComponentClass | null = null): ComponentModelConstructor<Component, Model> | null {
    if (componentClass === null) {
      componentClass = this.prototype as unknown as ComponentClass;
    }
    do {
      if (componentClass.hasOwnProperty("_componentModelConstructors")) {
        const constructor = componentClass._componentModelConstructors![modelName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      componentClass = (componentClass as any).__proto__ as ComponentClass | null;
    } while (componentClass !== null);
    return null;
  }

  /** @hidden */
  static decorateComponentModel(constructor: ComponentModelConstructor<Component, Model>,
                                componentClass: ComponentClass, modelName: string): void {
    if (!componentClass.hasOwnProperty("_componentModelConstructors")) {
      componentClass._componentModelConstructors = {};
    }
    componentClass._componentModelConstructors![modelName] = constructor;
    Object.defineProperty(componentClass, modelName, {
      get: function (this: Component): ComponentModel<Component, Model> {
        let componentModel = this.getComponentModel(modelName);
        if (componentModel === null) {
          componentModel = new constructor(this, modelName);
          this.setComponentModel(modelName, componentModel);
        }
        return componentModel;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getComponentTraitConstructor(traitName: string, componentClass: ComponentClass | null = null): ComponentTraitConstructor<Component, Trait> | null {
    if (componentClass === null) {
      componentClass = this.prototype as unknown as ComponentClass;
    }
    do {
      if (componentClass.hasOwnProperty("_componentTraitConstructors")) {
        const constructor = componentClass._componentTraitConstructors![traitName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      componentClass = (componentClass as any).__proto__ as ComponentClass | null;
    } while (componentClass !== null);
    return null;
  }

  /** @hidden */
  static decorateComponentTrait(constructor: ComponentTraitConstructor<Component, Trait>,
                                componentClass: ComponentClass, traitName: string): void {
    if (!componentClass.hasOwnProperty("_componentTraitConstructors")) {
      componentClass._componentTraitConstructors = {};
    }
    componentClass._componentTraitConstructors![traitName] = constructor;
    Object.defineProperty(componentClass, traitName, {
      get: function (this: Component): ComponentTrait<Component, Trait> {
        let componentTrait = this.getComponentTrait(traitName);
        if (componentTrait === null) {
          componentTrait = new constructor(this, traitName);
          this.setComponentTrait(traitName, componentTrait);
        }
        return componentTrait;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getComponentViewConstructor(viewName: string, componentClass: ComponentClass | null = null): ComponentViewConstructor<Component, View> | null {
    if (componentClass === null) {
      componentClass = this.prototype as unknown as ComponentClass;
    }
    do {
      if (componentClass.hasOwnProperty("_componentViewConstructors")) {
        const constructor = componentClass._componentViewConstructors![viewName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      componentClass = (componentClass as any).__proto__ as ComponentClass | null;
    } while (componentClass !== null);
    return null;
  }

  /** @hidden */
  static decorateComponentView(constructor: ComponentViewConstructor<Component, View>,
                               componentClass: ComponentClass, viewName: string): void {
    if (!componentClass.hasOwnProperty("_componentViewConstructors")) {
      componentClass._componentViewConstructors = {};
    }
    componentClass._componentViewConstructors![viewName] = constructor;
    Object.defineProperty(componentClass, viewName, {
      get: function (this: Component): ComponentView<Component, View> {
        let componentView = this.getComponentView(viewName);
        if (componentView === null) {
          componentView = new constructor(this, viewName);
          this.setComponentView(viewName, componentView);
        }
        return componentView;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getComponentBindingConstructor(bindingName: string, componentClass: ComponentClass | null = null): ComponentBindingConstructor<Component, Component> | null {
    if (componentClass === null) {
      componentClass = this.prototype as unknown as ComponentClass;
    }
    do {
      if (componentClass.hasOwnProperty("_componentBindingConstructors")) {
        const constructor = componentClass._componentBindingConstructors![bindingName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      componentClass = (componentClass as any).__proto__ as ComponentClass | null;
    } while (componentClass !== null);
    return null;
  }

  /** @hidden */
  static decorateComponentBinding(constructor: ComponentBindingConstructor<Component, Component>,
                                  componentClass: ComponentClass, bindingName: string): void {
    if (!componentClass.hasOwnProperty("_componentBindingConstructors")) {
      componentClass._componentBindingConstructors = {};
    }
    componentClass._componentBindingConstructors![bindingName] = constructor;
    Object.defineProperty(componentClass, bindingName, {
      get: function (this: Component): ComponentBinding<Component, Component> {
        let componentBinding = this.getComponentBinding(bindingName);
        if (componentBinding === null) {
          componentBinding = new constructor(this, bindingName);
          this.setComponentBinding(bindingName, componentBinding);
        }
        return componentBinding;
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

  // Forward type declarations
  /** @hidden */
  static Manager: typeof ComponentManager; // defined by ComponentManager
  /** @hidden */
  static Service: typeof ComponentService; // defined by ComponentService
  /** @hidden */
  static Scope: typeof ComponentScope; // defined by ComponentScope
  /** @hidden */
  static Model: typeof ComponentModel; // defined by ComponentModel
  /** @hidden */
  static Trait: typeof ComponentTrait; // defined by ComponentTrait
  /** @hidden */
  static View: typeof ComponentView; // defined by ComponentView
  /** @hidden */
  static Binding: typeof ComponentBinding; // defined by ComponentBinding
  /** @hidden */
  static Generic: typeof GenericComponent; // defined by GenericComponent
  /** @hidden */
  static Composite: typeof CompositeComponent; // defined by CompositeComponent
}
