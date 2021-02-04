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

import type {View} from "@swim/view";
import type {Model, Trait} from "@swim/model";
import type {ComponentContextType, ComponentContext} from "../ComponentContext";
import {ComponentFlags, Component} from "../Component";
import type {ComponentObserverType} from "../ComponentObserver";
import type {ComponentService} from "../service/ComponentService";
import type {ComponentScope} from "../scope/ComponentScope";
import type {ComponentModel} from "../relation/ComponentModel";
import type {ComponentTrait} from "../relation/ComponentTrait";
import type {ComponentView} from "../relation/ComponentView";
import type {ComponentRelation} from "../relation/ComponentRelation";

export abstract class GenericComponent extends Component {
  constructor() {
    super();
    Object.defineProperty(this, "key", {
      value: void 0,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "parentComponent", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "componentServices", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "componentScopes", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "componentModels", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "componentTraits", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "componentViews", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "componentRelations", {
      value: null,
      enumerable: true,
      configurable: true,
    });
  }

  protected willObserve<T>(callback: (this: this, componentObserver: ComponentObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      result = callback.call(this, componentObserver as ComponentObserverType<this>) as T | undefined;
      if (result !== void 0) {
        return result;
      }
    }
    return result;
  }

  protected didObserve<T>(callback: (this: this, componentObserver: ComponentObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      const componentObserver = componentObservers[i]!;
      result = callback.call(this, componentObserver as ComponentObserverType<this>) as T | undefined;
      if (result !== void 0) {
        return result;
      }
    }
    return result;
  }

  declare readonly key: string | undefined;

  /** @hidden */
  setKey(key: string | undefined): void {
    Object.defineProperty(this, "key", {
      value: key,
      enumerable: true,
      configurable: true,
    });
  }

  declare readonly parentComponent: Component | null;

  /** @hidden */
  setParentComponent(newParentComponent: Component | null, oldParentComponent: Component | null): void {
    this.willSetParentComponent(newParentComponent, oldParentComponent);
    Object.defineProperty(this, "parentComponent", {
      value: newParentComponent,
      enumerable: true,
      configurable: true,
    });
    this.onSetParentComponent(newParentComponent, oldParentComponent);
    this.didSetParentComponent(newParentComponent, oldParentComponent);
  }

  remove(): void {
    const parentComponent = this.parentComponent;
    if (parentComponent !== null) {
      if ((this.componentFlags & Component.TraversingFlag) === 0) {
        parentComponent.removeChildComponent(this);
      } else {
        this.setComponentFlags(this.componentFlags | Component.RemovingFlag);
      }
    }
  }

  abstract get childComponentCount(): number;

  abstract readonly childComponents: ReadonlyArray<Component>;

  abstract forEachChildComponent<T>(callback: (childComponent: Component) => T | void): T | undefined;
  abstract forEachChildComponent<T, S>(callback: (this: S, childComponent: Component) => T | void,
                                       thisArg: S): T | undefined;

  abstract getChildComponent(key: string): Component | null;

  abstract setChildComponent(key: string, newChildComponent: Component | null): Component | null;

  abstract appendChildComponent(childComponent: Component, key?: string): void;

  abstract prependChildComponent(childComponent: Component, key?: string): void;

  abstract insertChildComponent(childComponent: Component, targetComponent: Component | null, key?: string): void;

  protected onInsertChildComponent(childComponent: Component, targetComponent: Component | null | undefined): void {
    super.onInsertChildComponent(childComponent, targetComponent);
    this.insertComponentRelation(childComponent);
  }

  cascadeInsert(updateFlags?: ComponentFlags, componentContext?: ComponentContext): void {
    // nop
  }

  abstract removeChildComponent(key: string): Component | null;
  abstract removeChildComponent(childComponent: Component): void;

  protected onRemoveChildComponent(childComponent: Component): void {
    super.onRemoveChildComponent(childComponent);
    this.removeComponentRelation(childComponent);
  }

  abstract removeAll(): void;

  cascadeMount(): void {
    if ((this.componentFlags & Component.MountedFlag) === 0) {
      this.setComponentFlags(this.componentFlags | (Component.MountedFlag | Component.TraversingFlag));
      try {
        this.willMount();
        this.onMount();
        this.doMountChildComponents();
        this.didMount();
      } finally {
        this.setComponentFlags(this.componentFlags & ~Component.TraversingFlag);
      }
    } else {
      throw new Error("already mounted");
    }
  }

  protected onMount(): void {
    super.onMount();
    this.mountServices();
    this.mountScopes();
    this.mountModels();
    this.mountTraits();
    this.mountViews();
    this.mountRelations();
  }

  /** @hidden */
  protected doMountChildComponents(): void {
    type self = this;
    function doMountChildComponent(this: self, childComponent: Component): void {
      childComponent.cascadeMount();
      if ((childComponent.componentFlags & Component.RemovingFlag) !== 0) {
        childComponent.setComponentFlags(childComponent.componentFlags & ~Component.RemovingFlag);
        this.removeChildComponent(childComponent);
      }
    }
    this.forEachChildComponent(doMountChildComponent, this);
  }

  cascadeUnmount(): void {
    if ((this.componentFlags & Component.MountedFlag) !== 0) {
      this.setComponentFlags(this.componentFlags & ~Component.MountedFlag | Component.TraversingFlag);
      try {
        this.willUnmount();
        this.doUnmountChildComponents();
        this.onUnmount();
        this.didUnmount();
      } finally {
        this.setComponentFlags(this.componentFlags & ~Component.TraversingFlag);
      }
    } else {
      throw new Error("already unmounted");
    }
  }

  protected onUnmount(): void {
    this.unmountRelations();
    this.unmountViews();
    this.unmountTraits();
    this.unmountModels();
    this.unmountScopes();
    this.unmountServices();
    this.setComponentFlags(this.componentFlags & (~Component.ComponentFlagMask | Component.RemovingFlag));
  }

  /** @hidden */
  protected doUnmountChildComponents(): void {
    type self = this;
    function doUnmountChildComponent(this: self, childComponent: Component): void {
      childComponent.cascadeUnmount();
      if ((childComponent.componentFlags & Component.RemovingFlag) !== 0) {
        childComponent.setComponentFlags(childComponent.componentFlags & ~Component.RemovingFlag);
        this.removeChildComponent(childComponent);
      }
    }
    this.forEachChildComponent(doUnmountChildComponent, this);
  }

  cascadePower(): void {
    if ((this.componentFlags & Component.PoweredFlag) === 0) {
      this.setComponentFlags(this.componentFlags | (Component.PoweredFlag | Component.TraversingFlag));
      try {
        this.willPower();
        this.onPower();
        this.doPowerChildComponents();
        this.didPower();
      } finally {
        this.setComponentFlags(this.componentFlags & ~Component.TraversingFlag);
      }
    } else {
      throw new Error("already powered");
    }
  }

  /** @hidden */
  protected doPowerChildComponents(): void {
    type self = this;
    function doPowerChildComponent(this: self, childComponent: Component): void {
      childComponent.cascadePower();
      if ((childComponent.componentFlags & Component.RemovingFlag) !== 0) {
        childComponent.setComponentFlags(childComponent.componentFlags & ~Component.RemovingFlag);
        this.removeChildComponent(childComponent);
      }
    }
    this.forEachChildComponent(doPowerChildComponent, this);
  }

  cascadeUnpower(): void {
    if ((this.componentFlags & Component.PoweredFlag) !== 0) {
      this.setComponentFlags(this.componentFlags & ~Component.PoweredFlag | Component.TraversingFlag);
      try {
        this.willUnpower();
        this.doUnpowerChildComponents();
        this.onUnpower();
        this.didUnpower();
      } finally {
        this.setComponentFlags(this.componentFlags & ~Component.TraversingFlag);
      }
    } else {
      throw new Error("already unpowered");
    }
  }

  /** @hidden */
  protected doUnpowerChildComponents(): void {
    type self = this;
    function doUnpowerChildComponent(this: self, childComponent: Component): void {
      childComponent.cascadeUnpower();
      if ((childComponent.componentFlags & Component.RemovingFlag) !== 0) {
        childComponent.setComponentFlags(childComponent.componentFlags & ~Component.RemovingFlag);
        this.removeChildComponent(childComponent);
      }
    }
    this.forEachChildComponent(doUnpowerChildComponent, this);
  }

  cascadeCompile(compileFlags: ComponentFlags, componentContext: ComponentContext): void {
    const extendedComponentContext = this.extendComponentContext(componentContext);
    compileFlags &= ~Component.NeedsCompile;
    compileFlags |= this.componentFlags & Component.UpdateMask;
    compileFlags = this.needsCompile(compileFlags, extendedComponentContext);
    if ((compileFlags & Component.CompileMask) !== 0) {
      this.doCompile(compileFlags, extendedComponentContext);
    }
  }

  /** @hidden */
  protected doCompile(compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    let cascadeFlags = compileFlags;
    this.setComponentFlags(this.componentFlags & ~Component.NeedsCompile
                                               | (Component.TraversingFlag | Component.CompilingFlag));
    try {
      this.willCompile(cascadeFlags, componentContext);
      if (((this.componentFlags | compileFlags) & Component.NeedsResolve) !== 0) {
        this.willResolve(componentContext);
        cascadeFlags |= Component.NeedsResolve;
        this.setComponentFlags(this.componentFlags & ~Component.NeedsResolve);
      }
      if (((this.componentFlags | compileFlags) & Component.NeedsGenerate) !== 0) {
        this.willGenerate(componentContext);
        cascadeFlags |= Component.NeedsGenerate;
        this.setComponentFlags(this.componentFlags & ~Component.NeedsGenerate);
      }
      if (((this.componentFlags | compileFlags) & Component.NeedsAssemble) !== 0) {
        this.willAssemble(componentContext);
        cascadeFlags |= Component.NeedsAssemble;
        this.setComponentFlags(this.componentFlags & ~Component.NeedsAssemble);
      }

      this.onCompile(cascadeFlags, componentContext);
      if ((cascadeFlags & Component.NeedsResolve) !== 0) {
        this.onResolve(componentContext);
      }
      if ((cascadeFlags & Component.NeedsGenerate) !== 0) {
        this.onGenerate(componentContext);
      }
      if ((cascadeFlags & Component.NeedsAssemble) !== 0) {
        this.onAssemble(componentContext);
      }

      this.doCompileChildComponents(cascadeFlags, componentContext);

      if ((cascadeFlags & Component.NeedsAssemble) !== 0) {
        this.didAssemble(componentContext);
      }
      if ((cascadeFlags & Component.NeedsGenerate) !== 0) {
        this.didGenerate(componentContext);
      }
      if ((cascadeFlags & Component.NeedsResolve) !== 0) {
        this.didResolve(componentContext);
      }
      this.didCompile(cascadeFlags, componentContext);
    } finally {
      this.setComponentFlags(this.componentFlags & ~(Component.TraversingFlag | Component.CompilingFlag));
    }
  }

  cascadeExecute(executeFlags: ComponentFlags, componentContext: ComponentContext): void {
    const extendedComponentContext = this.extendComponentContext(componentContext);
    executeFlags &= ~Component.NeedsExecute;
    executeFlags |= this.componentFlags & Component.UpdateMask;
    executeFlags = this.needsExecute(executeFlags, extendedComponentContext);
    if ((executeFlags & Component.ExecuteMask) !== 0) {
      this.doExecute(executeFlags, extendedComponentContext);
    }
  }

  /** @hidden */
  protected doExecute(executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    let cascadeFlags = executeFlags;
    this.setComponentFlags(this.componentFlags & ~Component.NeedsExecute
                                               | (Component.TraversingFlag | Component.ExecutingFlag));
    try {
      this.willExecute(cascadeFlags, componentContext);
      if (((this.componentFlags | executeFlags) & Component.NeedsRevise) !== 0) {
        this.willRevise(componentContext);
        cascadeFlags |= Component.NeedsRevise;
        this.setComponentFlags(this.componentFlags & ~Component.NeedsRevise);
      }
      if (((this.componentFlags | executeFlags) & Component.NeedsCompute) !== 0) {
        this.willCompute(componentContext);
        cascadeFlags |= Component.NeedsCompute;
        this.setComponentFlags(this.componentFlags & ~Component.NeedsCompute);
      }

      this.onExecute(cascadeFlags, componentContext);
      if ((cascadeFlags & Component.NeedsRevise) !== 0) {
        this.onRevise(componentContext);
      }
      if ((cascadeFlags & Component.NeedsCompute) !== 0) {
        this.onCompute(componentContext);
      }

      this.doExecuteChildComponents(cascadeFlags, componentContext);

      if ((cascadeFlags & Component.NeedsCompute) !== 0) {
        this.didCompute(componentContext);
      }
      if ((cascadeFlags & Component.NeedsRevise) !== 0) {
        this.didRevise(componentContext);
      }
      this.didExecute(cascadeFlags, componentContext);
    } finally {
      this.setComponentFlags(this.componentFlags & ~(Component.TraversingFlag | Component.ExecutingFlag));
    }
  }

  protected onRevise(componentContext: ComponentContextType<this>): void {
    super.onRevise(componentContext);
    this.reviseScopes();
  }

  /** @hidden */
  declare readonly componentServices: {[serviceName: string]: ComponentService<Component, unknown> | undefined} | null;

  hasComponentService(serviceName: string): boolean {
    const componentServices = this.componentServices;
    return componentServices !== null && componentServices[serviceName] !== void 0;
  }

  getComponentService(serviceName: string): ComponentService<this, unknown> | null {
    const componentServices = this.componentServices;
    if (componentServices !== null) {
      const componentService = componentServices[serviceName];
      if (componentService !== void 0) {
        return componentService as ComponentService<this, unknown>;
      }
    }
    return null;
  }

  setComponentService(serviceName: string, newComponentService: ComponentService<this, unknown> | null): void {
    let componentServices = this.componentServices;
    if (componentServices === null) {
      componentServices = {};
      Object.defineProperty(this, "componentServices", {
        value: componentServices,
        enumerable: true,
        configurable: true,
      });
    }
    const oldComponentService = componentServices[serviceName];
    if (oldComponentService !== void 0 && this.isMounted()) {
      oldComponentService.unmount();
    }
    if (newComponentService !== null) {
      componentServices[serviceName] = newComponentService;
      if (this.isMounted()) {
        newComponentService.mount();
      }
    } else {
      delete componentServices[serviceName];
    }
  }

  /** @hidden */
  protected mountServices(): void {
    const componentServices = this.componentServices;
    for (const serviceName in componentServices) {
      const componentService = componentServices[serviceName]!;
      componentService.mount();
    }
  }

  /** @hidden */
  protected unmountServices(): void {
    const componentServices = this.componentServices;
    for (const serviceName in componentServices) {
      const componentService = componentServices[serviceName]!;
      componentService.unmount();
    }
  }

  /** @hidden */
  declare readonly componentScopes: {[scopeName: string]: ComponentScope<Component, unknown> | undefined} | null;

  hasComponentScope(scopeName: string): boolean {
    const componentScopes = this.componentScopes;
    return componentScopes !== null && componentScopes[scopeName] !== void 0;
  }

  getComponentScope(scopeName: string): ComponentScope<this, unknown> | null {
    const componentScopes = this.componentScopes;
    if (componentScopes !== null) {
      const componentScope = componentScopes[scopeName];
      if (componentScope !== void 0) {
        return componentScope as ComponentScope<this, unknown>;
      }
    }
    return null;
  }

  setComponentScope(scopeName: string, newComponentScope: ComponentScope<this, unknown> | null): void {
    let componentScopes = this.componentScopes;
    if (componentScopes === null) {
      componentScopes = {};
      Object.defineProperty(this, "componentScopes", {
        value: componentScopes,
        enumerable: true,
        configurable: true,
      });
    }
    const oldComponentScope = componentScopes[scopeName];
    if (oldComponentScope !== void 0 && this.isMounted()) {
      oldComponentScope.unmount();
    }
    if (newComponentScope !== null) {
      componentScopes[scopeName] = newComponentScope;
      if (this.isMounted()) {
        newComponentScope.mount();
      }
    } else {
      delete componentScopes[scopeName];
    }
  }

  /** @hidden */
  reviseScopes(): void {
    const componentScopes = this.componentScopes;
    for (const scopeName in componentScopes) {
      const componentScope = componentScopes[scopeName]!;
      componentScope.onRevise();
    }
  }

  /** @hidden */
  protected mountScopes(): void {
    const componentScopes = this.componentScopes;
    for (const scopeName in componentScopes) {
      const componentScope = componentScopes[scopeName]!;
      componentScope.mount();
    }
  }

  /** @hidden */
  protected unmountScopes(): void {
    const componentScopes = this.componentScopes;
    for (const scopeName in componentScopes) {
      const componentScope = componentScopes[scopeName]!;
      componentScope.unmount();
    }
  }

  /** @hidden */
  declare readonly componentModels: {[modelName: string]: ComponentModel<Component, Model> | undefined} | null;

  hasComponentModel(modelName: string): boolean {
    const componentModels = this.componentModels;
    return componentModels !== null && componentModels[modelName] !== void 0;
  }

  getComponentModel(modelName: string): ComponentModel<this, Model> | null {
    const componentModels = this.componentModels;
    if (componentModels !== null) {
      const componentModel = componentModels[modelName];
      if (componentModel !== void 0) {
        return componentModel as ComponentModel<this, Model>;
      }
    }
    return null;
  }

  setComponentModel(modelName: string, newComponentModel: ComponentModel<this, any> | null): void {
    let componentModels = this.componentModels;
    if (componentModels === null) {
      componentModels = {};
      Object.defineProperty(this, "componentModels", {
        value: componentModels,
        enumerable: true,
        configurable: true,
      });
    }
    const oldComponentModel = componentModels[modelName];
    if (oldComponentModel !== void 0 && this.isMounted()) {
      oldComponentModel.unmount();
    }
    if (newComponentModel !== null) {
      componentModels[modelName] = newComponentModel;
      if (this.isMounted()) {
        newComponentModel.mount();
      }
    } else {
      delete componentModels[modelName];
    }
  }

  /** @hidden */
  protected mountModels(): void {
    const componentModels = this.componentModels;
    for (const modelName in componentModels) {
      const componentModel = componentModels[modelName]!;
      componentModel.mount();
    }
  }

  /** @hidden */
  protected unmountModels(): void {
    const componentModels = this.componentModels;
    for (const modelName in componentModels) {
      const componentModel = componentModels[modelName]!;
      componentModel.unmount();
    }
  }

  /** @hidden */
  declare readonly componentTraits: {[traitName: string]: ComponentTrait<Component, Trait> | undefined} | null;

  hasComponentTrait(traitName: string): boolean {
    const componentTraits = this.componentTraits;
    return componentTraits !== null && componentTraits[traitName] !== void 0;
  }

  getComponentTrait(traitName: string): ComponentTrait<this, Trait> | null {
    const componentTraits = this.componentTraits;
    if (componentTraits !== null) {
      const componentTrait = componentTraits[traitName];
      if (componentTrait !== void 0) {
        return componentTrait as ComponentTrait<this, Trait>;
      }
    }
    return null;
  }

  setComponentTrait(traitName: string, newComponentTrait: ComponentTrait<this, any> | null): void {
    let componentTraits = this.componentTraits;
    if (componentTraits === null) {
      componentTraits = {};
      Object.defineProperty(this, "componentTraits", {
        value: componentTraits,
        enumerable: true,
        configurable: true,
      });
    }
    const oldComponentTrait = componentTraits[traitName];
    if (oldComponentTrait !== void 0 && this.isMounted()) {
      oldComponentTrait.unmount();
    }
    if (newComponentTrait !== null) {
      componentTraits[traitName] = newComponentTrait;
      if (this.isMounted()) {
        newComponentTrait.mount();
      }
    } else {
      delete componentTraits[traitName];
    }
  }

  /** @hidden */
  protected mountTraits(): void {
    const componentTraits = this.componentTraits;
    for (const traitName in componentTraits) {
      const componentTrait = componentTraits[traitName]!;
      componentTrait.mount();
    }
  }

  /** @hidden */
  protected unmountTraits(): void {
    const componentTraits = this.componentTraits;
    for (const traitName in componentTraits) {
      const componentTrait = componentTraits[traitName]!;
      componentTrait.unmount();
    }
  }

  /** @hidden */
  declare readonly componentViews: {[viewName: string]: ComponentView<Component, View> | undefined} | null;

  hasComponentView(viewName: string): boolean {
    const componentViews = this.componentViews;
    return componentViews !== null && componentViews[viewName] !== void 0;
  }

  getComponentView(viewName: string): ComponentView<this, View> | null {
    const componentViews = this.componentViews;
    if (componentViews !== null) {
      const componentView = componentViews[viewName];
      if (componentView !== void 0) {
        return componentView as ComponentView<this, View>;
      }
    }
    return null;
  }

  setComponentView(viewName: string, newComponentView: ComponentView<this, any> | null): void {
    let componentViews = this.componentViews;
    if (componentViews === null) {
      componentViews = {};
      Object.defineProperty(this, "componentViews", {
        value: componentViews,
        enumerable: true,
        configurable: true,
      });
    }
    const oldComponentView = componentViews[viewName];
    if (oldComponentView !== void 0 && this.isMounted()) {
      oldComponentView.unmount();
    }
    if (newComponentView !== null) {
      componentViews[viewName] = newComponentView;
      if (this.isMounted()) {
        newComponentView.mount();
      }
    } else {
      delete componentViews[viewName];
    }
  }

  /** @hidden */
  protected mountViews(): void {
    const componentViews = this.componentViews;
    for (const viewName in componentViews) {
      const componentView = componentViews[viewName]!;
      componentView.mount();
    }
  }

  /** @hidden */
  protected unmountViews(): void {
    const componentViews = this.componentViews;
    for (const viewName in componentViews) {
      const componentView = componentViews[viewName]!;
      componentView.unmount();
    }
  }

  /** @hidden */
  declare readonly componentRelations: {[relationName: string]: ComponentRelation<Component, Component> | undefined} | null;

  hasComponentRelation(relationName: string): boolean {
    const componentRelations = this.componentRelations;
    return componentRelations !== null && componentRelations[relationName] !== void 0;
  }

  getComponentRelation(relationName: string): ComponentRelation<this, Component> | null {
    const componentRelations = this.componentRelations;
    if (componentRelations !== null) {
      const componentRelation = componentRelations[relationName];
      if (componentRelation !== void 0) {
        return componentRelation as ComponentRelation<this, Component>;
      }
    }
    return null;
  }

  setComponentRelation(relationName: string, newComponentRelation: ComponentRelation<this, any> | null): void {
    let componentRelations = this.componentRelations;
    if (componentRelations === null) {
      componentRelations = {};
      Object.defineProperty(this, "componentRelations", {
        value: componentRelations,
        enumerable: true,
        configurable: true,
      });
    }
    const oldComponentRelation = componentRelations[relationName];
    if (oldComponentRelation !== void 0 && this.isMounted()) {
      oldComponentRelation.unmount();
    }
    if (newComponentRelation !== null) {
      componentRelations[relationName] = newComponentRelation;
      if (this.isMounted()) {
        newComponentRelation.mount();
      }
    } else {
      delete componentRelations[relationName];
    }
  }

  /** @hidden */
  protected mountRelations(): void {
    const componentRelations = this.componentRelations;
    for (const relationName in componentRelations) {
      const componentRelation = componentRelations[relationName]!;
      componentRelation.mount();
    }
  }

  /** @hidden */
  protected unmountRelations(): void {
    const componentRelations = this.componentRelations;
    for (const relationName in componentRelations) {
      const componentRelation = componentRelations[relationName]!;
      componentRelation.unmount();
    }
  }

  /** @hidden */
  protected insertComponentRelation(childComponent: Component): void {
    const relationName = childComponent.key;
    if (relationName !== void 0) {
      const componentRelation = this.getLazyComponentRelation(relationName);
      if (componentRelation !== null && componentRelation.child === true) {
        componentRelation.doSetComponent(childComponent);
      }
    }
  }

  /** @hidden */
  protected removeComponentRelation(childComponent: Component): void {
    const relationName = childComponent.key;
    if (relationName !== void 0) {
      const componentRelation = this.getComponentRelation(relationName);
      if (componentRelation !== null && componentRelation.child === true) {
        componentRelation.doSetComponent(null);
      }
    }
  }
}
