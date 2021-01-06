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
import {BoxR2, Transform} from "@swim/math";
import {
  Constrain,
  ConstrainVariable,
  ConstrainBinding,
  ConstraintRelation,
  AnyConstraintStrength,
  ConstraintStrength,
  Constraint,
  ConstraintScope,
} from "@swim/constraint";
import {Tween, Transition, AnimatorContext, Animator} from "@swim/tween";
import {Look, Feel, Mood, MoodVector, ThemeMatrix} from "@swim/theme";
import {ViewContextType, ViewContext} from "./ViewContext";
import {
  ViewObserverType,
  ViewObserver,
  WillResizeObserver,
  DidResizeObserver,
  WillScrollObserver,
  DidScrollObserver,
  WillChangeObserver,
  DidChangeObserver,
  WillAnimateObserver,
  DidAnimateObserver,
  WillLayoutObserver,
  DidLayoutObserver,
} from "./ViewObserver";
import {ViewControllerType, ViewController} from "./ViewController";
import {ViewManager} from "./manager/ViewManager";
import {ViewIdiom} from "./viewport/ViewIdiom";
import {Viewport} from "./viewport/Viewport";
import {LayoutAnchorConstructor, LayoutAnchor} from "./layout/LayoutAnchor";
import {ViewServiceConstructor, ViewService} from "./service/ViewService";
import {ViewportService} from "./service/ViewportService";
import {DisplayService} from "./service/DisplayService";
import {LayoutService} from "./service/LayoutService";
import {ThemeService} from "./service/ThemeService";
import {ModalService} from "./service/ModalService";
import {ViewScopeConstructor, ViewScope} from "./scope/ViewScope";
import {ViewAnimatorConstructor, ViewAnimator} from "./animator/ViewAnimator";
import {ViewBindingConstructor, ViewBinding} from "./binding/ViewBinding";

export type ViewFlags = number;

export interface ViewInit {
  key?: string;
  viewController?: ViewController;
}

export interface ViewFactory<V extends View = View, U = V> {
  create(): V;
  fromAny?(value: V | U): V;
}

export interface ViewPrototype<V extends View = View> extends Function {
  readonly prototype: V;
}

export interface ViewConstructor<V extends View = View> {
  new(): V;
  readonly prototype: V;
}

export interface ViewClass {
  readonly mountFlags: ViewFlags;

  readonly powerFlags: ViewFlags;

  readonly uncullFlags: ViewFlags;

  readonly insertChildFlags: ViewFlags;

  readonly removeChildFlags: ViewFlags;

  /** @hidden */
  _viewServiceConstructors?: {[serviceName: string]: ViewServiceConstructor<any, unknown> | undefined};

  /** @hidden */
  _viewScopeConstructors?: {[scopeName: string]: ViewScopeConstructor<any, unknown> | undefined};

  /** @hidden */
  _viewAnimatorConstructors?: {[animatorName: string]: ViewAnimatorConstructor<any, unknown> | undefined};

  /** @hidden */
  _viewBindingConstructors?: {[bindingName: string]: ViewBindingConstructor<any, any> | undefined};
}

export abstract class View implements AnimatorContext, ConstraintScope {
  /** @hidden */
  _viewFlags: ViewFlags;
  /** @hidden */
  _viewController?: ViewControllerType<this>;
  /** @hidden */
  _viewObservers?: ReadonlyArray<ViewObserverType<this>>;
  /** @hidden */
  _willResizeObservers?: ReadonlyArray<WillResizeObserver>;
  /** @hidden */
  _didResizeObservers?: ReadonlyArray<DidResizeObserver>;
  /** @hidden */
  _willScrollObservers?: ReadonlyArray<WillScrollObserver>;
  /** @hidden */
  _didScrollObservers?: ReadonlyArray<DidScrollObserver>;
  /** @hidden */
  _willChangeObservers?: ReadonlyArray<WillChangeObserver>;
  /** @hidden */
  _didChangeObservers?: ReadonlyArray<DidChangeObserver>;
  /** @hidden */
  _willAnimateObservers?: ReadonlyArray<WillAnimateObserver>;
  /** @hidden */
  _didAnimateObservers?: ReadonlyArray<DidAnimateObserver>;
  /** @hidden */
  _willLayoutObservers?: ReadonlyArray<WillLayoutObserver>;
  /** @hidden */
  _didLayoutObservers?: ReadonlyArray<DidLayoutObserver>;

  constructor() {
    this._viewFlags = 0;
  }

  initView(init: ViewInit): void {
    if (init.viewController !== void 0) {
      this.setViewController(init.viewController as ViewControllerType<this>);
    }
  }

  get viewClass(): ViewClass {
    return this.constructor as unknown as ViewClass;
  }

  get viewFlags(): ViewFlags {
    return this._viewFlags;
  }

  setViewFlags(viewFlags: ViewFlags): void {
    this._viewFlags = viewFlags;
  }

  get viewController(): ViewController | null {
    const viewController = this._viewController;
    return viewController !== void 0 ? viewController : null;
  }

  setViewController(newViewController: ViewControllerType<this> | null): void {
    const oldViewController = this._viewController;
    if (oldViewController === void 0 ? newViewController !== null : oldViewController !== newViewController) {
      this.willSetViewController(newViewController);
      if (oldViewController !== void 0) {
        oldViewController.setView(null);
      }
      if (newViewController !== null) {
        this._viewController = newViewController;
        newViewController.setView(this);
      } else if (this._viewController !== void 0) {
        this._viewController = void 0;
      }
      this.onSetViewController(newViewController);
      this.didSetViewController(newViewController);
    }
  }

  protected willSetViewController(viewController: ViewControllerType<this> | null): void {
    // hook
  }

  protected onSetViewController(viewController: ViewControllerType<this> | null): void {
    // hook
  }

  protected didSetViewController(viewController: ViewControllerType<this> | null): void {
    // hook
  }

  get viewObservers(): ReadonlyArray<ViewObserver> {
    let viewObservers = this._viewObservers;
    if (viewObservers === void 0) {
      viewObservers = [];
    }
    return viewObservers;
  }

  addViewObserver(viewObserver: ViewObserverType<this>): void {
    const oldViewObservers = this._viewObservers;
    const newViewObservers = Arrays.inserted(viewObserver, oldViewObservers);
    if (oldViewObservers !== newViewObservers) {
      this.willAddViewObserver(viewObserver);
      this._viewObservers = newViewObservers;
      this.onAddViewObserver(viewObserver);
      this.didAddViewObserver(viewObserver);
    }
  }

  protected willAddViewObserver(viewObserver: ViewObserverType<this>): void {
    // hook
  }

  protected onAddViewObserver(viewObserver: ViewObserverType<this>): void {
    if (viewObserver.viewWillResize !== void 0) {
      this._willResizeObservers = Arrays.inserted(viewObserver as WillResizeObserver, this._willResizeObservers);
    }
    if (viewObserver.viewDidResize !== void 0) {
      this._didResizeObservers = Arrays.inserted(viewObserver as DidResizeObserver, this._didResizeObservers);
    }
    if (viewObserver.viewWillScroll !== void 0) {
      this._willScrollObservers = Arrays.inserted(viewObserver as WillScrollObserver, this._willScrollObservers);
    }
    if (viewObserver.viewDidScroll !== void 0) {
      this._didScrollObservers = Arrays.inserted(viewObserver as DidScrollObserver, this._didScrollObservers);
    }
    if (viewObserver.viewWillChange !== void 0) {
      this._willChangeObservers = Arrays.inserted(viewObserver as WillChangeObserver, this._willChangeObservers);
    }
    if (viewObserver.viewDidChange !== void 0) {
      this._didChangeObservers = Arrays.inserted(viewObserver as DidChangeObserver, this._didChangeObservers);
    }
    if (viewObserver.viewWillAnimate !== void 0) {
      this._willAnimateObservers = Arrays.inserted(viewObserver as WillAnimateObserver, this._willAnimateObservers);
    }
    if (viewObserver.viewDidAnimate !== void 0) {
      this._didAnimateObservers = Arrays.inserted(viewObserver as DidAnimateObserver, this._didAnimateObservers);
    }
    if (viewObserver.viewWillLayout !== void 0) {
      this._willLayoutObservers = Arrays.inserted(viewObserver as WillLayoutObserver, this._willLayoutObservers);
    }
    if (viewObserver.viewDidLayout !== void 0) {
      this._didLayoutObservers = Arrays.inserted(viewObserver as DidLayoutObserver, this._didLayoutObservers);
    }
  }

  protected didAddViewObserver(viewObserver: ViewObserverType<this>): void {
    // hook
  }

  removeViewObserver(viewObserver: ViewObserverType<this>): void {
    const oldViewObservers = this._viewObservers;
    const newViewObservers = Arrays.removed(viewObserver, oldViewObservers);
    if (oldViewObservers !== newViewObservers) {
      this.willRemoveViewObserver(viewObserver);
      this._viewObservers = newViewObservers;
      this.onRemoveViewObserver(viewObserver);
      this.didRemoveViewObserver(viewObserver);
    }
  }

  protected willRemoveViewObserver(viewObserver: ViewObserverType<this>): void {
    // hook
  }

  protected onRemoveViewObserver(viewObserver: ViewObserverType<this>): void {
    if (viewObserver.viewWillResize !== void 0) {
      this._willResizeObservers = Arrays.removed(viewObserver as WillResizeObserver, this._willResizeObservers);
    }
    if (viewObserver.viewDidResize !== void 0) {
      this._didResizeObservers = Arrays.removed(viewObserver as DidResizeObserver, this._didResizeObservers);
    }
    if (viewObserver.viewWillScroll !== void 0) {
      this._willScrollObservers = Arrays.removed(viewObserver as WillScrollObserver, this._willScrollObservers);
    }
    if (viewObserver.viewDidScroll !== void 0) {
      this._didScrollObservers = Arrays.removed(viewObserver as DidScrollObserver, this._didScrollObservers);
    }
    if (viewObserver.viewWillChange !== void 0) {
      this._willChangeObservers = Arrays.removed(viewObserver as WillChangeObserver, this._willChangeObservers);
    }
    if (viewObserver.viewDidChange !== void 0) {
      this._didChangeObservers = Arrays.removed(viewObserver as DidChangeObserver, this._didChangeObservers);
    }
    if (viewObserver.viewWillAnimate !== void 0) {
      this._willAnimateObservers = Arrays.removed(viewObserver as WillAnimateObserver, this._willAnimateObservers);
    }
    if (viewObserver.viewDidAnimate !== void 0) {
      this._didAnimateObservers = Arrays.removed(viewObserver as DidAnimateObserver, this._didAnimateObservers);
    }
    if (viewObserver.viewWillLayout !== void 0) {
      this._willLayoutObservers = Arrays.removed(viewObserver as WillLayoutObserver, this._willLayoutObservers);
    }
    if (viewObserver.viewDidLayout !== void 0) {
      this._didLayoutObservers = Arrays.removed(viewObserver as DidLayoutObserver, this._didLayoutObservers);
    }
  }

  protected didRemoveViewObserver(viewObserver: ViewObserverType<this>): void {
    // hook
  }

  abstract get key(): string | undefined;

  /** @hidden */
  abstract setKey(key: string | undefined): void;

  abstract get parentView(): View | null;

  /** @hidden */
  abstract setParentView(newParentView: View | null, oldParentView: View | null): void;

  protected willSetParentView(newParentView: View | null, oldParentView: View | null): void {
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewWillSetParentView !== void 0) {
      viewController.viewWillSetParentView(newParentView, oldParentView, this);
    }
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewWillSetParentView !== void 0) {
        viewObserver.viewWillSetParentView(newParentView, oldParentView, this);
      }
    }
  }

  protected onSetParentView(newParentView: View | null, oldParentView: View | null): void {
    if (newParentView !== null) {
      if (newParentView.isMounted()) {
        this.cascadeMount();
        if (newParentView.isPowered()) {
          this.cascadePower();
        }
        if (newParentView.isCulled()) {
          this.cascadeCull();
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

  protected didSetParentView(newParentView: View | null, oldParentView: View | null): void {
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewDidSetParentView !== void 0) {
        viewObserver.viewDidSetParentView(newParentView, oldParentView, this);
      }
    }
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewDidSetParentView !== void 0) {
      viewController.viewDidSetParentView(newParentView, oldParentView, this);
    }
  }

  abstract remove(): void;

  abstract get childViewCount(): number;

  abstract get childViews(): ReadonlyArray<View>;

  abstract firstChildView(): View | null;

  abstract lastChildView(): View | null;

  abstract nextChildView(targetView: View): View | null;

  abstract previousChildView(targetView: View): View | null;

  abstract forEachChildView<T, S = unknown>(callback: (this: S, childView: View) => T | void,
                                            thisArg?: S): T | undefined;

  abstract getChildView(key: string): View | null;

  abstract setChildView(key: string, newChildView: View | null): View | null;

  abstract appendChildView(childView: View, key?: string): void;

  abstract prependChildView(childView: View, key?: string): void;

  abstract insertChildView(childView: View, targetView: View | null, key?: string): void;

  get insertChildFlags(): ViewFlags {
    return this.viewClass.insertChildFlags;
  }

  protected willInsertChildView(childView: View, targetView: View | null | undefined): void {
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewWillInsertChildView !== void 0) {
      viewController.viewWillInsertChildView(childView, targetView, this);
    }
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewWillInsertChildView !== void 0) {
        viewObserver.viewWillInsertChildView(childView, targetView, this);
      }
    }
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    this.requireUpdate(this.insertChildFlags);
  }

  protected didInsertChildView(childView: View, targetView: View | null | undefined): void {
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewDidInsertChildView !== void 0) {
        viewObserver.viewDidInsertChildView(childView, targetView, this);
      }
    }
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewDidInsertChildView !== void 0) {
      viewController.viewDidInsertChildView(childView, targetView, this);
    }
  }

  abstract cascadeInsert(updateFlags?: ViewFlags, viewContext?: ViewContext): void;

  abstract removeChildView(key: string): View | null;
  abstract removeChildView(childView: View): void;

  abstract removeAll(): void;

  get removeChildFlags(): ViewFlags {
    return this.viewClass.removeChildFlags;
  }

  protected willRemoveChildView(childView: View): void {
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewWillRemoveChildView !== void 0) {
      viewController.viewWillRemoveChildView(childView, this);
    }
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewWillRemoveChildView !== void 0) {
        viewObserver.viewWillRemoveChildView(childView, this);
      }
    }
  }

  protected onRemoveChildView(childView: View): void {
    this.requireUpdate(this.removeChildFlags);
  }

  protected didRemoveChildView(childView: View): void {
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewDidRemoveChildView !== void 0) {
        viewObserver.viewDidRemoveChildView(childView, this);
      }
    }
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewDidRemoveChildView !== void 0) {
      viewController.viewDidRemoveChildView(childView, this);
    }
  }

  getSuperView<V extends View>(viewPrototype: ViewPrototype<V>): V | null {
    const parentView = this.parentView;
    if (parentView === null) {
      return null;
    } else if (parentView instanceof viewPrototype) {
      return parentView;
    } else {
      return parentView.getSuperView(viewPrototype);
    }
  }

  getBaseView<V extends View>(viewPrototype: ViewPrototype<V>): V | null {
    const parentView = this.parentView;
    if (parentView === null) {
      return null;
    } else {
      const baseView = parentView.getBaseView(viewPrototype);
      if (baseView !== null) {
        return baseView;
      } else {
        return parentView instanceof viewPrototype ? parentView : null;
      }
    }
  }

  declare readonly viewportService: ViewportService<this>; // defined by ViewportService

  declare readonly displayService: DisplayService<this>; // defined by DisplayService

  declare readonly layoutService: LayoutService<this>; // defined by LayoutService

  declare readonly themeService: ThemeService<this>; // defined by ThemeService

  declare readonly modalService: ModalService<this>; // defined by ModalService

  isMounted(): boolean {
    return (this._viewFlags & View.MountedFlag) !== 0;
  }

  get mountFlags(): ViewFlags {
    return this.viewClass.mountFlags;
  }

  abstract cascadeMount(): void;

  protected willMount(): void {
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewWillMount !== void 0) {
      viewController.viewWillMount(this);
    }
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewWillMount !== void 0) {
        viewObserver.viewWillMount(this);
      }
    }
  }

  protected onMount(): void {
    this.requestUpdate(this, this._viewFlags & ~View.StatusMask, false);
    this.requireUpdate(this.mountFlags);
  }

  protected didMount(): void {
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewDidMount !== void 0) {
        viewObserver.viewDidMount(this);
      }
    }
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewDidMount !== void 0) {
      viewController.viewDidMount(this);
    }
  }

  abstract cascadeUnmount(): void;

  protected willUnmount(): void {
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewWillUnmount !== void 0) {
      viewController.viewWillUnmount(this);
    }
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewWillUnmount !== void 0) {
        viewObserver.viewWillUnmount(this);
      }
    }
  }

  protected onUnmount(): void {
    // hook
  }

  protected didUnmount(): void {
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewDidUnmount !== void 0) {
        viewObserver.viewDidUnmount(this);
      }
    }
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewDidUnmount !== void 0) {
      viewController.viewDidUnmount(this);
    }
  }

  isPowered(): boolean {
    return (this._viewFlags & View.PoweredFlag) !== 0;
  }

  get powerFlags(): ViewFlags {
    return this.viewClass.powerFlags;
  }

  abstract cascadePower(): void;

  protected willPower(): void {
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewWillPower !== void 0) {
      viewController.viewWillPower(this);
    }
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewWillPower !== void 0) {
        viewObserver.viewWillPower(this);
      }
    }
  }

  protected onPower(): void {
    this.requestUpdate(this, this._viewFlags & ~View.StatusMask, false);
    this.requireUpdate(this.powerFlags);
  }

  protected didPower(): void {
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewDidPower !== void 0) {
        viewObserver.viewDidPower(this);
      }
    }
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewDidPower !== void 0) {
      viewController.viewDidPower(this);
    }
  }

  abstract cascadeUnpower(): void;

  protected willUnpower(): void {
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewWillUnpower !== void 0) {
      viewController.viewWillUnpower(this);
    }
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewWillUnpower !== void 0) {
        viewObserver.viewWillUnpower(this);
      }
    }
  }

  protected onUnpower(): void {
    // hook
  }

  protected didUnpower(): void {
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewDidUnpower !== void 0) {
        viewObserver.viewDidUnpower(this);
      }
    }
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewDidUnpower !== void 0) {
      viewController.viewDidUnpower(this);
    }
  }

  isCulled(): boolean {
    return (this._viewFlags & View.CulledMask) !== 0;
  }

  abstract setCulled(culled: boolean): void;

  abstract cascadeCull(): void;

  protected willCull(): void {
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewWillCull !== void 0) {
      viewController.viewWillCull(this);
    }
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewWillCull !== void 0) {
        viewObserver.viewWillCull(this);
      }
    }
  }

  protected onCull(): void {
    // hook
  }

  protected didCull(): void {
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewDidCull !== void 0) {
        viewObserver.viewDidCull(this);
      }
    }
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewDidCull !== void 0) {
      viewController.viewDidCull(this);
    }
  }

  abstract cascadeUncull(): void;

  get uncullFlags(): ViewFlags {
    return this.viewClass.uncullFlags;
  }

  protected willUncull(): void {
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewWillUncull !== void 0) {
      viewController.viewWillUncull(this);
    }
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewWillUncull !== void 0) {
        viewObserver.viewWillUncull(this);
      }
    }
  }

  protected onUncull(): void {
    this.requestUpdate(this, this._viewFlags & ~View.StatusMask, false);
    this.requireUpdate(this.uncullFlags);
  }

  protected didUncull(): void {
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewDidUncull !== void 0) {
        viewObserver.viewDidUncull(this);
      }
    }
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewDidUncull !== void 0) {
      viewController.viewDidUncull(this);
    }
  }

  requireUpdate(updateFlags: ViewFlags, immediate: boolean = false): void {
    updateFlags &= ~View.StatusMask;
    if (updateFlags !== 0) {
      this.willRequireUpdate(updateFlags, immediate);
      const oldUpdateFlags = this._viewFlags;
      const newUpdateFlags = oldUpdateFlags | updateFlags;
      const deltaUpdateFlags = newUpdateFlags & ~oldUpdateFlags & ~View.StatusMask;
      if (deltaUpdateFlags !== 0) {
        this._viewFlags = newUpdateFlags;
        this.onRequireUpdate(updateFlags, immediate);
        this.requestUpdate(this, deltaUpdateFlags, immediate);
      }
      this.didRequireUpdate(updateFlags, immediate);
    }
  }

  protected willRequireUpdate(updateFlags: ViewFlags, immediate: boolean): void {
    // hook
  }

  protected onRequireUpdate(updateFlags: ViewFlags, immediate: boolean): void {
    // hook
  }

  protected didRequireUpdate(updateFlags: ViewFlags, immediate: boolean): void {
    // hook
  }

  requestUpdate(targetView: View, updateFlags: ViewFlags, immediate: boolean): void {
    if ((this._viewFlags & View.CulledMask) !== View.CulledFlag) { // if not culled root
      this.willRequestUpdate(targetView, updateFlags, immediate);
      let propagateFlags = updateFlags & (View.NeedsProcess | View.NeedsDisplay);
      if ((updateFlags & View.ProcessMask) !== 0 && (this._viewFlags & View.NeedsProcess) === 0) {
        this._viewFlags |= View.NeedsProcess;
        propagateFlags |= View.NeedsProcess;
      }
      if ((updateFlags & View.DisplayMask) !== 0 && (this._viewFlags & View.NeedsDisplay) === 0) {
        this._viewFlags |= View.NeedsDisplay;
        propagateFlags |= View.NeedsDisplay;
      }
      if ((propagateFlags & (View.NeedsProcess | View.NeedsDisplay)) !== 0 || immediate) {
        this.onRequestUpdate(targetView, updateFlags, immediate);
        const parentView = this.parentView;
        if (parentView !== null) {
          parentView.requestUpdate(targetView, updateFlags, immediate);
        } else if (this.isMounted()) {
          const displayManager = this.displayService.manager;
          if (displayManager !== void 0) {
            displayManager.requestUpdate(targetView, updateFlags, immediate);
          }
        }
      }
      this.didRequestUpdate(targetView, updateFlags, immediate);
    }
  }

  protected willRequestUpdate(targetView: View, updateFlags: ViewFlags, immediate: boolean): void {
    // hook
  }

  protected onRequestUpdate(targetView: View, updateFlags: ViewFlags, immediate: boolean): void {
    // hook
  }

  protected didRequestUpdate(targetView: View, updateFlags: ViewFlags, immediate: boolean): void {
    // hook
  }

  isTraversing(): boolean {
    return (this._viewFlags & View.TraversingFlag) !== 0;
  }

  isUpdating(): boolean {
    return (this._viewFlags & View.UpdatingMask) !== 0;
  }

  isProcessing(): boolean {
    return (this._viewFlags & View.ProcessingFlag) !== 0;
  }

  needsProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    return processFlags;
  }

  abstract cascadeProcess(processFlags: ViewFlags, viewContext: ViewContext): void;

  protected willProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    // hook
  }

  protected onProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    // hook
  }

  protected didProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    // hook
  }

  protected willResize(viewContext: ViewContextType<this>): void {
    const viewController = this._viewController;
    if (viewController !== void 0) {
      viewController.viewWillResize(viewContext, this);
    }
    const viewObservers = this._willResizeObservers;
    if (viewObservers !== void 0) {
      for (let i = 0, n = viewObservers.length; i < n; i += 1) {
        const viewObserver = viewObservers[i];
        viewObserver.viewWillResize(viewContext, this);
      }
    }
  }

  protected onResize(viewContext: ViewContextType<this>): void {
    // hook
  }

  protected didResize(viewContext: ViewContextType<this>): void {
    const viewObservers = this._didResizeObservers;
    if (viewObservers !== void 0) {
      for (let i = 0, n = viewObservers.length; i < n; i += 1) {
        const viewObserver = viewObservers[i];
        viewObserver.viewDidResize(viewContext, this);
      }
    }
    const viewController = this._viewController;
    if (viewController !== void 0) {
      viewController.viewDidResize(viewContext, this);
    }
  }

  protected willScroll(viewContext: ViewContextType<this>): void {
    const viewController = this._viewController;
    if (viewController !== void 0) {
      viewController.viewWillScroll(viewContext, this);
    }
    const viewObservers = this._willScrollObservers;
    if (viewObservers !== void 0) {
      for (let i = 0, n = viewObservers.length; i < n; i += 1) {
        const viewObserver = viewObservers[i];
        viewObserver.viewWillScroll(viewContext, this);
      }
    }
  }

  protected onScroll(viewContext: ViewContextType<this>): void {
    // hook
  }

  protected didScroll(viewContext: ViewContextType<this>): void {
    const viewObservers = this._didScrollObservers;
    if (viewObservers !== void 0) {
      for (let i = 0, n = viewObservers.length; i < n; i += 1) {
        const viewObserver = viewObservers[i];
        viewObserver.viewDidScroll(viewContext, this);
      }
    }
    const viewController = this._viewController;
    if (viewController !== void 0) {
      viewController.viewDidScroll(viewContext, this);
    }
  }

  protected willChange(viewContext: ViewContextType<this>): void {
    const viewController = this._viewController;
    if (viewController !== void 0) {
      viewController.viewWillChange(viewContext, this);
    }
    const viewObservers = this._willChangeObservers;
    if (viewObservers !== void 0) {
      for (let i = 0, n = viewObservers.length; i < n; i += 1) {
        const viewObserver = viewObservers[i];
        viewObserver.viewWillChange(viewContext, this);
      }
    }
  }

  protected onChange(viewContext: ViewContextType<this>): void {
    // hook
  }

  protected didChange(viewContext: ViewContextType<this>): void {
    const viewObservers = this._didChangeObservers;
    if (viewObservers !== void 0) {
      for (let i = 0, n = viewObservers.length; i < n; i += 1) {
        const viewObserver = viewObservers[i];
        viewObserver.viewDidChange(viewContext, this);
      }
    }
    const viewController = this._viewController;
    if (viewController !== void 0) {
      viewController.viewDidChange(viewContext, this);
    }
  }

  protected willAnimate(viewContext: ViewContextType<this>): void {
    const viewController = this._viewController;
    if (viewController !== void 0) {
      viewController.viewWillAnimate(viewContext, this);
    }
    const viewObservers = this._willAnimateObservers;
    if (viewObservers !== void 0) {
      for (let i = 0, n = viewObservers.length; i < n; i += 1) {
        const viewObserver = viewObservers[i];
        viewObserver.viewWillAnimate(viewContext, this);
      }
    }
  }

  protected onAnimate(viewContext: ViewContextType<this>): void {
    // hook
  }

  protected didAnimate(viewContext: ViewContextType<this>): void {
    const viewObservers = this._didAnimateObservers;
    if (viewObservers !== void 0) {
      for (let i = 0, n = viewObservers.length; i < n; i += 1) {
        const viewObserver = viewObservers[i];
        viewObserver.viewDidAnimate(viewContext, this);
      }
    }
    const viewController = this._viewController;
    if (viewController !== void 0) {
      viewController.viewDidAnimate(viewContext, this);
    }
  }

  protected willProcessChildViews(processFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    // hook
  }

  protected onProcessChildViews(processFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    this.processChildViews(processFlags, viewContext, this.processChildView);
  }

  protected didProcessChildViews(processFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    // hook
  }

  protected processChildViews(processFlags: ViewFlags, viewContext: ViewContextType<this>,
                              processChildView: (this: this, childView: View, processFlags: ViewFlags,
                                                 viewContext: ViewContextType<this>) => void): void {
    function doProcessChildView(this: View, childView: View): void {
      processChildView.call(this, childView, processFlags, viewContext);
      if ((childView.viewFlags & View.RemovingFlag) !== 0) {
        childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
        this.removeChildView(childView);
      }
    }
    this.forEachChildView(doProcessChildView, this);
  }

  /** @hidden */
  protected processChildView(childView: View, processFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    this.willProcessChildView(childView, processFlags, viewContext);
    this.onProcessChildView(childView, processFlags, viewContext);
    this.didProcessChildView(childView, processFlags, viewContext);
  }

  protected willProcessChildView(childView: View, processFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    // hook
  }

  protected onProcessChildView(childView: View, processFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    childView.cascadeProcess(processFlags, viewContext);
  }

  protected didProcessChildView(childView: View, processFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    // hook
  }

  isDisplaying(): boolean {
    return (this._viewFlags & View.DisplayingFlag) !== 0;
  }

  needsDisplay(displayFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    return displayFlags;
  }

  abstract cascadeDisplay(displayFlags: ViewFlags, viewContext: ViewContext): void;

  protected willDisplay(displayFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    // hook
  }

  protected onDisplay(displayFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    // hook
  }

  protected didDisplay(displayFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    // hook
  }

  protected willLayout(viewContext: ViewContextType<this>): void {
    const viewController = this._viewController;
    if (viewController !== void 0) {
      viewController.viewWillLayout(viewContext, this);
    }
    const viewObservers = this._willLayoutObservers;
    if (viewObservers !== void 0) {
      for (let i = 0, n = viewObservers.length; i < n; i += 1) {
        const viewObserver = viewObservers[i];
        viewObserver.viewWillLayout(viewContext, this);
      }
    }
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    // hook
  }

  protected didLayout(viewContext: ViewContextType<this>): void {
    const viewObservers = this._didLayoutObservers;
    if (viewObservers !== void 0) {
      for (let i = 0, n = viewObservers.length; i < n; i += 1) {
        const viewObserver = viewObservers[i];
        viewObserver.viewDidLayout(viewContext, this);
      }
    }
    const viewController = this._viewController;
    if (viewController !== void 0) {
      viewController.viewDidLayout(viewContext, this);
    }
  }

  protected willDisplayChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    // hook
  }

  protected onDisplayChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    this.displayChildViews(displayFlags, viewContext, this.displayChildView);
  }

  protected didDisplayChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    // hook
  }

  protected displayChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                              displayChildView: (this: this, childView: View, displayFlags: ViewFlags,
                                                 viewContext: ViewContextType<this>) => void): void {
    function doDisplayChildView(this: View, childView: View): void {
      displayChildView.call(this, childView, displayFlags, viewContext);
      if ((childView.viewFlags & View.RemovingFlag) !== 0) {
        childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
        this.removeChildView(childView);
      }
    }
    this.forEachChildView(doDisplayChildView, this);
  }

  /** @hidden */
  protected displayChildView(childView: View, displayFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    this.willDisplayChildView(childView, displayFlags, viewContext);
    this.onDisplayChildView(childView, displayFlags, viewContext);
    this.didDisplayChildView(childView, displayFlags, viewContext);
  }

  protected willDisplayChildView(childView: View, displayFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    // hook
  }

  protected onDisplayChildView(childView: View, displayFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    childView.cascadeDisplay(displayFlags, viewContext);
  }

  protected didDisplayChildView(childView: View, displayFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    // hook
  }

  declare readonly mood: ViewScope<this, MoodVector | undefined>; // defined by ViewScope

  declare readonly theme: ViewScope<this, ThemeMatrix | undefined>; // defined by ViewScope

  abstract getLook<T>(look: Look<T, unknown>, mood?: MoodVector<Feel>): T | undefined;

  abstract getLookOr<T, V>(look: Look<T, unknown>, elseValue: V, mood?: MoodVector<Feel>): T | V;

  abstract modifyMood(feel: Feel, ...entries: [Feel, number | undefined][]): void;

  abstract modifyTheme(feel: Feel, ...entries: [Feel, number | undefined][]): void;

  applyTheme(theme: ThemeMatrix, mood: MoodVector, tween?: Tween<any>): void {
    if (tween === void 0 || tween === true) {
      tween = theme.inner(Mood.ambient, Look.transition);
      if (tween === void 0) {
        tween = null;
      }
    } else {
      tween = Transition.forTween(tween);
    }
    this.willApplyTheme(theme, mood, tween);
    this.onApplyTheme(theme, mood, tween);
    this.didApplyTheme(theme, mood, tween);
  }

  protected willApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                           transition: Transition<any> | null): void {
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewWillApplyTheme !== void 0) {
      viewController.viewWillApplyTheme(theme, mood, transition, this);
    }
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewWillApplyTheme !== void 0) {
        viewObserver.viewWillApplyTheme(theme, mood, transition, this);
      }
    }
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         transition: Transition<any> | null): void {
    // hook
  }

  protected didApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                          transition: Transition<any> | null): void {
    const viewObservers = this._viewObservers;
    for (let i = 0, n = viewObservers !== void 0 ? viewObservers.length : 0; i < n; i += 1) {
      const viewObserver = viewObservers![i];
      if (viewObserver.viewDidApplyTheme !== void 0) {
        viewObserver.viewDidApplyTheme(theme, mood, transition, this);
      }
    }
    const viewController = this._viewController;
    if (viewController !== void 0 && viewController.viewDidApplyTheme !== void 0) {
      viewController.viewDidApplyTheme(theme, mood, transition, this);
    }
  }

  abstract hasViewService(serviceName: string): boolean;

  abstract getViewService(serviceName: string): ViewService<this, unknown> | null;

  abstract setViewService(serviceName: string, viewService: ViewService<this, unknown> | null): void;

  /** @hidden */
  getLazyViewService(serviceName: string): ViewService<this, unknown> | null {
    let viewService = this.getViewService(serviceName);
    if (viewService === null) {
      const viewClass = (this as any).__proto__ as ViewClass;
      const constructor = View.getViewServiceConstructor(serviceName, viewClass);
      if (constructor !== null) {
        viewService = new constructor(this, serviceName);
        this.setViewService(serviceName, viewService);
      }
    }
    return viewService;
  }

  abstract hasViewScope(scopeName: string): boolean;

  abstract getViewScope(scopeName: string): ViewScope<this, unknown> | null;

  abstract setViewScope(scopeName: string, viewScope: ViewScope<this, unknown> | null): void;

  /** @hidden */
  getLazyViewScope(scopeName: string): ViewScope<this, unknown> | null {
    let viewScope = this.getViewScope(scopeName);
    if (viewScope === null) {
      const viewClass = (this as any).__proto__ as ViewClass;
      const constructor = View.getViewScopeConstructor(scopeName, viewClass);
      if (constructor !== null) {
        viewScope = new constructor(this, scopeName);
        this.setViewScope(scopeName, viewScope);
      }
    }
    return viewScope;
  }

  abstract hasViewAnimator(animatorName: string): boolean;

  abstract getViewAnimator(animatorName: string): ViewAnimator<this, unknown> | null;

  abstract setViewAnimator(animatorName: string, viewAnimator: ViewAnimator<this, unknown> | null): void;

  /** @hidden */
  getLazyViewAnimator(animatorName: string): ViewAnimator<this, unknown> | null {
    let viewAnimator = this.getViewAnimator(animatorName);
    if (viewAnimator === null) {
      const viewClass = (this as any).__proto__ as ViewClass;
      const constructor = View.getViewAnimatorConstructor(animatorName, viewClass);
      if (constructor !== null) {
        viewAnimator = new constructor(this, animatorName);
        this.setViewAnimator(animatorName, viewAnimator);
      }
    }
    return viewAnimator;
  }

  /** @hidden */
  animate(animator: Animator): void {
    this.requireUpdate(View.NeedsAnimate);
  }

  abstract hasViewBinding(bindingName: string): boolean;

  abstract getViewBinding(bindingName: string): ViewBinding<this, View> | null;

  abstract setViewBinding(bindingName: string, viewBinding: ViewBinding<this, View, unknown> | null): void;

  /** @hidden */
  getLazyViewBinding(bindingName: string): ViewBinding<this, View> | null {
    let viewBinding = this.getViewBinding(bindingName);
    if (viewBinding === null) {
      const viewClass = (this as any).__proto__ as ViewClass;
      const constructor = View.getViewBindingConstructor(bindingName, viewClass);
      if (constructor !== null) {
        viewBinding = new constructor(this, bindingName);
        this.setViewBinding(bindingName, viewBinding);
      }
    }
    return viewBinding;
  }

  abstract hasLayoutAnchor(anchorName: string): boolean;

  abstract getLayoutAnchor(anchorName: string): LayoutAnchor<this> | null;

  abstract setLayoutAnchor(anchorName: string, layoutAnchor: LayoutAnchor<this> | null): void;

  constraint(lhs: Constrain | number, relation: ConstraintRelation,
             rhs?: Constrain | number, strength?: AnyConstraintStrength): Constraint {
    if (typeof lhs === "number") {
      lhs = Constrain.constant(lhs);
    }
    if (typeof rhs === "number") {
      rhs = Constrain.constant(rhs);
    }
    const constrain = rhs !== void 0 ? lhs.minus(rhs) : lhs;
    if (strength === void 0) {
      strength = ConstraintStrength.Required;
    } else {
      strength = ConstraintStrength.fromAny(strength);
    }
    return new Constraint(this, constrain, relation, strength);
  }

  abstract get constraints(): ReadonlyArray<Constraint>;

  abstract hasConstraint(constraint: Constraint): boolean;

  abstract addConstraint(constraint: Constraint): void;

  abstract removeConstraint(constraint: Constraint): void;

  /** @hidden */
  activateConstraint(constraint: Constraint): void {
    const layoutManager = this.layoutService.manager;
    if (layoutManager !== void 0) {
      layoutManager.activateConstraint(constraint);
      this.requireUpdate(View.NeedsLayout);
    }
  }

  /** @hidden */
  deactivateConstraint(constraint: Constraint): void {
    const layoutManager = this.layoutService.manager;
    if (layoutManager !== void 0) {
      layoutManager.deactivateConstraint(constraint);
      this.requireUpdate(View.NeedsLayout);
    }
  }

  constraintVariable(name: string, value?: number, strength?: AnyConstraintStrength): ConstrainVariable {
    if (value === void 0) {
      value = 0;
    }
    if (strength === void 0) {
      strength = ConstraintStrength.Strong;
    } else {
      strength = ConstraintStrength.fromAny(strength);
    }
    return new ConstrainBinding(this, name, value, strength);
  }

  abstract get constraintVariables(): ReadonlyArray<ConstrainVariable>;

  abstract hasConstraintVariable(constraintVariable: ConstrainVariable): boolean;

  abstract addConstraintVariable(constraintVariable: ConstrainVariable): void;

  abstract removeConstraintVariable(constraintVariable: ConstrainVariable): void;

  /** @hidden */
  activateConstraintVariable(constraintVariable: ConstrainVariable): void {
    const layoutManager = this.layoutService.manager;
    if (layoutManager !== void 0) {
      layoutManager.activateConstraintVariable(constraintVariable);
      this.requireUpdate(View.NeedsLayout);
    }
  }

  /** @hidden */
  deactivateConstraintVariable(constraintVariable: ConstrainVariable): void {
    const layoutManager = this.layoutService.manager;
    if (layoutManager !== void 0) {
      layoutManager.deactivateConstraintVariable(constraintVariable);
      this.requireUpdate(View.NeedsLayout);
    }
  }

  /** @hidden */
  setConstraintVariable(constraintVariable: ConstrainVariable, state: number): void {
    const layoutManager = this.layoutService.manager;
    if (layoutManager !== void 0) {
      layoutManager.setConstraintVariable(constraintVariable, state);
    }
  }

  /** @hidden */
  updateConstraintVariables(): void {
    const layoutManager = this.layoutService.manager;
    if (layoutManager !== void 0) {
      layoutManager.updateConstraintVariables();
    }
  }

  extendViewContext(viewContext: ViewContext): ViewContextType<this> {
    return viewContext as ViewContextType<this>;
  }

  get superViewContext(): ViewContext {
    let superViewContext: ViewContext;
    const parentView = this.parentView;
    if (parentView !== null) {
      superViewContext = parentView.viewContext;
    } else if (this.isMounted()) {
      const viewportManager = this.viewportService.manager;
      if (viewportManager !== void 0) {
        superViewContext = viewportManager.viewContext;
      } else {
        superViewContext = ViewContext.default();
      }
    } else {
      superViewContext = ViewContext.default();
    }
    return superViewContext;
  }

  get viewContext(): ViewContext {
    return this.extendViewContext(this.superViewContext);
  }

  get viewIdiom(): ViewIdiom {
    return this.viewContext.viewIdiom;
  }

  get viewport(): Viewport {
    return this.viewContext.viewport;
  }

  /**
   * Returns the transformation from the parent view coordinates to view
   * coordinates.
   */
  abstract get parentTransform(): Transform;

  /**
   * Returns the transformation from page coordinates to view coordinates.
   */
  get pageTransform(): Transform {
    const parentView = this.parentView;
    if (parentView !== null) {
      return parentView.pageTransform.transform(this.parentTransform);
    } else {
      return Transform.identity();
    }
  }

  get pageBounds(): BoxR2 {
    const clientBounds = this.clientBounds;
    const clientTransform = this.clientTransform;
    return clientBounds.transform(clientTransform);
  }

  /**
   * Returns the bounding box, in page coordinates, the edges to which attached
   * popovers should point.
   */
  get popoverFrame(): BoxR2 {
    return this.pageBounds;
  }

  /**
   * Returns the transformation from viewport coordinates to view coordinates.
   */
  get clientTransform(): Transform {
    let clientTransform: Transform;
    const scrollX = window.pageXOffset;
    const scrollY = window.pageYOffset;
    if (scrollX !== 0 || scrollY !== 0) {
      clientTransform = Transform.translate(scrollX, scrollY);
    } else {
      clientTransform = Transform.identity();
    }
    const pageTransform = this.pageTransform;
    return clientTransform.transform(pageTransform);
  }

  abstract get clientBounds(): BoxR2;

  intersectsViewport(): boolean {
    const bounds = this.clientBounds;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    return (bounds.top <= 0 && 0 < bounds.bottom || 0 <= bounds.top && bounds.top < viewportHeight)
        && (bounds.left <= 0 && 0 < bounds.right || 0 <= bounds.left && bounds.left < viewportWidth);
  }

  abstract dispatchEvent(event: Event): boolean;

  abstract on(type: string, listener: EventListenerOrEventListenerObject,
              options?: AddEventListenerOptions | boolean): this;

  abstract off(type: string, listener: EventListenerOrEventListenerObject,
               options?: EventListenerOptions | boolean): this;

  /** @hidden */
  static getViewBindingConstructor(bindingName: string, viewClass: ViewClass | null = null): ViewBindingConstructor<any, any> | null {
    if (viewClass === null) {
      viewClass = this.prototype as unknown as ViewClass;
    }
    do {
      if (viewClass.hasOwnProperty("_viewBindingConstructors")) {
        const constructor = viewClass._viewBindingConstructors![bindingName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      viewClass = (viewClass as any).__proto__ as ViewClass | null;
    } while (viewClass !== null);
    return null;
  }

  /** @hidden */
  static decorateViewBinding<V extends View, S extends View, U>(constructor: ViewBindingConstructor<V, S, U>,
                                                                viewClass: ViewClass, bindingName: string): void {
    if (!viewClass.hasOwnProperty("_viewBindingConstructors")) {
      viewClass._viewBindingConstructors = {};
    }
    viewClass._viewBindingConstructors![bindingName] = constructor;
    Object.defineProperty(viewClass, bindingName, {
      get: function (this: V): ViewBinding<V, S, U> {
        let viewBinding = this.getViewBinding(bindingName) as ViewBinding<V, S, U> | null;
        if (viewBinding === null) {
          viewBinding = new constructor(this, bindingName);
          this.setViewBinding(bindingName, viewBinding);
        }
        return viewBinding;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getViewServiceConstructor(serviceName: string, viewClass: ViewClass | null = null): ViewServiceConstructor<any, unknown> | null {
    if (viewClass === null) {
      viewClass = this.prototype as unknown as ViewClass;
    }
    do {
      if (viewClass.hasOwnProperty("_viewServiceConstructors")) {
        const constructor = viewClass._viewServiceConstructors![serviceName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      viewClass = (viewClass as any).__proto__ as ViewClass | null;
    } while (viewClass !== null);
    return null;
  }

  /** @hidden */
  static decorateViewService<V extends View, T>(constructor: ViewServiceConstructor<V, T>,
                                                viewClass: ViewClass, serviceName: string): void {
    if (!viewClass.hasOwnProperty("_viewServiceConstructors")) {
      viewClass._viewServiceConstructors = {};
    }
    viewClass._viewServiceConstructors![serviceName] = constructor;
    Object.defineProperty(viewClass, serviceName, {
      get: function (this: V): ViewService<V, T> {
        let viewService = this.getViewService(serviceName) as ViewService<V, T> | null;
        if (viewService === null) {
          viewService = new constructor(this, serviceName);
          this.setViewService(serviceName, viewService);
        }
        return viewService;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getViewScopeConstructor(scopeName: string, viewClass: ViewClass | null = null): ViewScopeConstructor<any, unknown> | null {
    if (viewClass === null) {
      viewClass = this.prototype as unknown as ViewClass;
    }
    do {
      if (viewClass.hasOwnProperty("_viewScopeConstructors")) {
        const constructor = viewClass._viewScopeConstructors![scopeName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      viewClass = (viewClass as any).__proto__ as ViewClass | null;
    } while (viewClass !== null);
    return null;
  }

  /** @hidden */
  static decorateViewScope<V extends View, T, U>(constructor: ViewScopeConstructor<V, T, U>,
                                                 viewClass: ViewClass, scopeName: string): void {
    if (!viewClass.hasOwnProperty("_viewScopeConstructors")) {
      viewClass._viewScopeConstructors = {};
    }
    viewClass._viewScopeConstructors![scopeName] = constructor;
    Object.defineProperty(viewClass, scopeName, {
      get: function (this: V): ViewScope<V, T, U> {
        let viewScope = this.getViewScope(scopeName) as ViewScope<V, T, U> | null;
        if (viewScope === null) {
          viewScope = new constructor(this, scopeName);
          this.setViewScope(scopeName, viewScope);
        }
        return viewScope;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getViewAnimatorConstructor(animatorName: string, viewClass: ViewClass | null): ViewAnimatorConstructor<any, unknown> | null {
    if (viewClass === null) {
      viewClass = this.prototype as unknown as ViewClass;
    }
    while (viewClass !== null) {
      if (viewClass.hasOwnProperty("_viewAnimatorConstructors")) {
        const constructor = viewClass._viewAnimatorConstructors![animatorName];
        if (constructor !== void 0) {
          return constructor;
        }
      }
      viewClass = (viewClass as any).__proto__ as ViewClass | null;
    }
    return null;
  }

  /** @hidden */
  static decorateViewAnimator<V extends View, T, U>(constructor: ViewAnimatorConstructor<V, T, U>,
                                                    viewClass: ViewClass, animatorName: string): void {
    if (!viewClass.hasOwnProperty("_viewAnimatorConstructors")) {
      viewClass._viewAnimatorConstructors = {};
    }
    viewClass._viewAnimatorConstructors![animatorName] = constructor;
    Object.defineProperty(viewClass, animatorName, {
      get: function (this: V): ViewAnimator<V, T, U> {
        let viewAnimator = this.getViewAnimator(animatorName) as ViewAnimator<V, T, U> | null;
        if (viewAnimator === null) {
          viewAnimator = new constructor(this, animatorName);
          this.setViewAnimator(animatorName, viewAnimator);
        }
        return viewAnimator;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static decorateLayoutAnchor<V extends View>(constructor: LayoutAnchorConstructor<V>,
                                              viewClass: unknown, anchorName: string): void {
    Object.defineProperty(viewClass, anchorName, {
      get: function (this: V): LayoutAnchor<V> {
        let layoutAnchor = this.getLayoutAnchor(anchorName) as LayoutAnchor<V> | null;
        if (layoutAnchor === null) {
          layoutAnchor = new constructor(this, anchorName);
          this.setLayoutAnchor(anchorName, layoutAnchor);
        }
        return layoutAnchor;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static readonly MountedFlag: ViewFlags = 1 << 0;
  /** @hidden */
  static readonly PoweredFlag: ViewFlags = 1 << 1;
  /** @hidden */
  static readonly CullFlag: ViewFlags = 1 << 2;
  /** @hidden */
  static readonly CulledFlag: ViewFlags = 1 << 3;
  /** @hidden */
  static readonly HideFlag: ViewFlags = 1 << 4;
  /** @hidden */
  static readonly HiddenFlag: ViewFlags = 1 << 5;
  /** @hidden */
  static readonly AnimatingFlag: ViewFlags = 1 << 6;
  /** @hidden */
  static readonly TraversingFlag: ViewFlags = 1 << 7;
  /** @hidden */
  static readonly ProcessingFlag: ViewFlags = 1 << 8;
  /** @hidden */
  static readonly DisplayingFlag: ViewFlags = 1 << 9;
  /** @hidden */
  static readonly RemovingFlag: ViewFlags = 1 << 10;
  /** @hidden */
  static readonly ImmediateFlag: ViewFlags = 1 << 11;
  /** @hidden */
  static readonly CulledMask: ViewFlags = View.CullFlag
                                        | View.CulledFlag;
  /** @hidden */
  static readonly HiddenMask: ViewFlags = View.HideFlag
                                        | View.HiddenFlag;
  /** @hidden */
  static readonly UpdatingMask: ViewFlags = View.ProcessingFlag
                                          | View.DisplayingFlag;
  /** @hidden */
  static readonly StatusMask: ViewFlags = View.MountedFlag
                                        | View.PoweredFlag
                                        | View.CullFlag
                                        | View.CulledFlag
                                        | View.HiddenFlag
                                        | View.AnimatingFlag
                                        | View.TraversingFlag
                                        | View.ProcessingFlag
                                        | View.DisplayingFlag
                                        | View.RemovingFlag
                                        | View.ImmediateFlag;

  static readonly NeedsProcess: ViewFlags = 1 << 12;
  static readonly NeedsResize: ViewFlags = 1 << 13;
  static readonly NeedsScroll: ViewFlags = 1 << 14;
  static readonly NeedsChange: ViewFlags = 1 << 15;
  static readonly NeedsAnimate: ViewFlags = 1 << 16;
  static readonly NeedsProject: ViewFlags = 1 << 17;
  /** @hidden */
  static readonly ProcessMask: ViewFlags = View.NeedsProcess
                                         | View.NeedsResize
                                         | View.NeedsScroll
                                         | View.NeedsChange
                                         | View.NeedsAnimate
                                         | View.NeedsProject;

  static readonly NeedsDisplay: ViewFlags = 1 << 18;
  static readonly NeedsLayout: ViewFlags = 1 << 19;
  static readonly NeedsRender: ViewFlags = 1 << 20;
  static readonly NeedsComposite: ViewFlags = 1 << 21;
  /** @hidden */
  static readonly DisplayMask: ViewFlags = View.NeedsDisplay
                                         | View.NeedsLayout
                                         | View.NeedsRender
                                         | View.NeedsComposite;

  /** @hidden */
  static readonly UpdateMask: ViewFlags = View.ProcessMask
                                        | View.DisplayMask;

  /** @hidden */
  static readonly ViewFlagShift: ViewFlags = 24;
  /** @hidden */
  static readonly ViewFlagMask: ViewFlags = (1 << View.ViewFlagShift) - 1;

  static readonly mountFlags: ViewFlags = View.NeedsResize | View.NeedsChange | View.NeedsLayout;
  static readonly powerFlags: ViewFlags = View.NeedsResize | View.NeedsChange | View.NeedsLayout;
  static readonly uncullFlags: ViewFlags = 0;
  static readonly insertChildFlags: ViewFlags = View.NeedsLayout;
  static readonly removeChildFlags: ViewFlags = View.NeedsLayout;

  // Forward type declarations
  /** @hidden */
  static Manager: typeof ViewManager; // defined by ViewManager
  /** @hidden */
  static Service: typeof ViewService; // defined by ViewService
  /** @hidden */
  static Scope: typeof ViewScope; // defined by ViewScope
  /** @hidden */
  static Animator: typeof ViewAnimator; // defined by ViewAnimator
  /** @hidden */
  static Binding: typeof ViewBinding; // defined by ViewBinding
}
