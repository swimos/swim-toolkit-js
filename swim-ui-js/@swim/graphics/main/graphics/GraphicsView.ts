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
import type {ConstrainVariable, Constraint} from "@swim/constraint";
import {Look, Feel, MoodVector, MoodMatrix, ThemeMatrix} from "@swim/theme";
import {
  ViewContextType,
  ViewContext,
  ViewInit,
  ViewFlags,
  ViewConstructor,
  View,
  ViewObserverType,
  WillRenderObserver,
  DidRenderObserver,
  WillCompositeObserver,
  DidCompositeObserver,
  ViewService,
  LayoutAnchor,
  ViewScope,
  ViewAnimator,
  ViewBinding,
  ViewEvent,
  ViewMouseEvent,
  ViewPointerEvent,
  ViewEventHandler,
} from "@swim/view";
import type {GraphicsRenderer} from "./GraphicsRenderer";
import type {GraphicsViewContext} from "./GraphicsViewContext";
import type {GraphicsViewObserver} from "./GraphicsViewObserver";
import type {GraphicsViewController} from "./GraphicsViewController";
import type {LayerView} from "../layer/LayerView";
import type {RasterView} from "../raster/RasterView";
import type {CanvasView} from "../canvas/CanvasView";

export interface GraphicsViewInit extends ViewInit {
  viewController?: GraphicsViewController;
  mood?: MoodVector;
  moodModifier?: MoodMatrix;
  theme?: ThemeMatrix;
  themeModifier?: MoodMatrix;
  hidden?: boolean;
}

export interface GraphicsViewConstructor<V extends GraphicsView = GraphicsView> {
  new(): V;
  readonly prototype: V;
}

export abstract class GraphicsView extends View {
  /** @hidden */
  _viewServices?: {[serviceName: string]: ViewService<View, unknown> | undefined};
  /** @hidden */
  _viewScopes?: {[scopeName: string]: ViewScope<View, unknown> | undefined};
  /** @hidden */
  _viewAnimators?: {[animatorName: string]: ViewAnimator<View, unknown> | undefined};
  /** @hidden */
  _viewBindings?: {[bindingName: string]: ViewBinding<View, View> | undefined};
  /** @hidden */
  _layoutAnchors?: {[anchorName: string]: LayoutAnchor<View> | undefined};
  /** @hidden */
  _constraints?: Constraint[];
  /** @hidden */
  _constraintVariables?: ConstrainVariable[];
  /** @hidden */
  _viewFrame?: BoxR2;
  /** @hidden */
  _hoverSet?: {[id: string]: null | undefined};
  /** @hidden */
  _eventHandlers?: {[type: string]: ViewEventHandler[] | undefined};
  /** @hidden */
  _willRenderObservers?: ReadonlyArray<WillRenderObserver>;
  /** @hidden */
  _didRenderObservers?: ReadonlyArray<DidRenderObserver>;
  /** @hidden */
  _willCompositeObservers?: ReadonlyArray<WillCompositeObserver>;
  /** @hidden */
  _didCompositeObservers?: ReadonlyArray<DidCompositeObserver>;

  constructor() {
    super();
    Object.defineProperty(this, "key", {
      value: void 0,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "parentView", {
      value: null,
      enumerable: true,
      configurable: true,
    });
  }

  initView(init: GraphicsViewInit): void {
    super.initView(init);
    if (init.mood !== void 0) {
      this.mood(init.mood);
    }
    if (init.moodModifier !== void 0) {
      this.moodModifier(init.moodModifier);
    }
    if (init.theme !== void 0) {
      this.theme(init.theme);
    }
    if (init.themeModifier !== void 0) {
      this.themeModifier(init.themeModifier);
    }
    if (init.hidden !== void 0) {
      this.setHidden(init.hidden);
    }
  }

  declare readonly viewController: GraphicsViewController | null;

  declare readonly viewObservers: ReadonlyArray<GraphicsViewObserver>;

  protected onAddViewObserver(viewObserver: ViewObserverType<this>): void {
    super.onAddViewObserver(viewObserver);
    if (viewObserver.viewWillRender !== void 0) {
      this._willRenderObservers = Arrays.inserted(viewObserver as WillRenderObserver, this._willRenderObservers);
    }
    if (viewObserver.viewDidRender !== void 0) {
      this._didRenderObservers = Arrays.inserted(viewObserver as DidRenderObserver, this._didRenderObservers);
    }
    if (viewObserver.viewWillComposite !== void 0) {
      this._willCompositeObservers = Arrays.inserted(viewObserver as WillCompositeObserver, this._willCompositeObservers);
    }
    if (viewObserver.viewDidComposite !== void 0) {
      this._didCompositeObservers = Arrays.inserted(viewObserver as DidCompositeObserver, this._didCompositeObservers);
    }
  }

  protected onRemoveViewObserver(viewObserver: ViewObserverType<this>): void {
    super.onRemoveViewObserver(viewObserver);
    if (viewObserver.viewWillRender !== void 0) {
      this._willRenderObservers = Arrays.removed(viewObserver as WillRenderObserver, this._willRenderObservers);
    }
    if (viewObserver.viewDidRender !== void 0) {
      this._didRenderObservers = Arrays.removed(viewObserver as DidRenderObserver, this._didRenderObservers);
    }
    if (viewObserver.viewWillComposite !== void 0) {
      this._willCompositeObservers = Arrays.removed(viewObserver as WillCompositeObserver, this._willCompositeObservers);
    }
    if (viewObserver.viewDidComposite !== void 0) {
      this._didCompositeObservers = Arrays.removed(viewObserver as DidCompositeObserver, this._didCompositeObservers);
    }
  }

  protected willObserve<T>(callback: (this: this, viewObserver: ViewObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const viewController = this.viewController;
    if (viewController !== null) {
      result = callback.call(this, viewController as ViewObserverType<this>) as T | undefined;
      if (result !== void 0) {
        return result;
      }
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      result = callback.call(this, viewObserver as ViewObserverType<this>) as T | undefined;
      if (result !== void 0) {
        return result;
      }
    }
    return result;
  }

  protected didObserve<T>(callback: (this: this, viewObserver: ViewObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      result = callback.call(this, viewObserver as ViewObserverType<this>) as T | undefined;
      if (result !== void 0) {
        return result;
      }
    }
    const viewController = this.viewController;
    if (viewController !== null) {
      result = callback.call(this, viewController as ViewObserverType<this>) as T | undefined;
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

  declare readonly parentView: View | null;

  /** @hidden */
  setParentView(newParentView: View | null, oldParentView: View | null): void {
    this.willSetParentView(newParentView, oldParentView);
    Object.defineProperty(this, "parentView", {
      value: newParentView,
      enumerable: true,
      configurable: true,
    });
    this.onSetParentView(newParentView, oldParentView);
    this.didSetParentView(newParentView, oldParentView);
  }

  remove(): void {
    const parentView = this.parentView;
    if (parentView !== null) {
      if ((this.viewFlags & View.TraversingFlag) === 0) {
        parentView.removeChildView(this);
      } else {
        this.setViewFlags(this.viewFlags | View.RemovingFlag);
      }
    }
  }

  abstract get childViewCount(): number;

  abstract readonly childViews: ReadonlyArray<View>;

  abstract firstChildView(): View | null;

  abstract lastChildView(): View | null;

  abstract nextChildView(targetView: View): View | null;

  abstract previousChildView(targetView: View): View | null;

  abstract forEachChildView<T>(callback: (childView: View) => T | void): T | undefined;
  abstract forEachChildView<T, S>(callback: (this: S, childView: View) => T | void,
                                  thisArg: S): T | undefined;

  abstract getChildView(key: string): View | null;

  abstract setChildView(key: string, newChildView: View | null): View | null;

  append<V extends View>(childView: V, key?: string): V;
  append<V extends GraphicsView>(viewConstructor: GraphicsViewConstructor<V>, key?: string): V
  append<V extends View>(viewConstructor: ViewConstructor<V>, key?: string): V;
  append(child: View | ViewConstructor, key?: string): View {
    if (typeof child === "function") {
      child = GraphicsView.fromConstructor(child);
    }
    this.appendChildView(child, key);
    return child;
  }

  abstract appendChildView(childView: View, key?: string): void;

  prepend<V extends View>(childView: V, key?: string): V;
  prepend<V extends GraphicsView>(viewConstructor: GraphicsViewConstructor<V>, key?: string): V
  prepend<V extends View>(viewConstructor: ViewConstructor<V>, key?: string): V;
  prepend(child: View | ViewConstructor, key?: string): View {
    if (typeof child === "function") {
      child = GraphicsView.fromConstructor(child);
    }
    this.prependChildView(child, key);
    return child;
  }

  abstract prependChildView(childView: View, key?: string): void;

  insert<V extends View>(childView: V, target: View | null, key?: string): V;
  insert<V extends GraphicsView>(viewConstructor: GraphicsViewConstructor<V>, target: View | null, key?: string): V
  insert<V extends View>(viewConstructor: ViewConstructor<V>, target: View | null, key?: string): V;
  insert(child: View | ViewConstructor, target: View | null, key?: string): View {
    if (typeof child === "function") {
      child = GraphicsView.fromConstructor(child);
    }
    this.insertChildView(child, target, key);
    return child;
  }

  abstract insertChildView(childView: View, targetView: View | null, key?: string): void;

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    this.insertViewBinding(childView);
  }

  cascadeInsert(updateFlags?: ViewFlags, viewContext?: ViewContext): void {
    if ((this.viewFlags & (View.MountedFlag | View.PoweredFlag)) === (View.MountedFlag | View.PoweredFlag)) {
      if (updateFlags === void 0) {
        updateFlags = 0;
      }
      updateFlags |= this.viewFlags & View.UpdateMask;
      if ((updateFlags & View.ProcessMask) !== 0) {
        if (viewContext === void 0) {
          viewContext = this.superViewContext;
        }
        this.cascadeProcess(updateFlags, viewContext);
      }
    }
  }

  abstract removeChildView(key: string): View | null;
  abstract removeChildView(childView: View): void;

  protected onRemoveChildView(childView: View): void {
    super.onRemoveChildView(childView);
    this.removeViewBinding(childView);
  }

  abstract removeAll(): void;

  cascadeMount(): void {
    if ((this.viewFlags & View.MountedFlag) === 0) {
      this.setViewFlags(this.viewFlags | (View.MountedFlag | View.TraversingFlag));
      try {
        this.willMount();
        this.onMount();
        this.doMountChildViews();
        this.didMount();
      } finally {
        this.setViewFlags(this.viewFlags & ~View.TraversingFlag);
      }
    } else {
      throw new Error("already mounted");
    }
  }

  protected onMount(): void {
    super.onMount();
    this.mountServices();
    this.mountScopes();
    this.mountAnimators();
    this.mountBindings();
    this.mountTheme();
  }

  protected didMount(): void {
    this.activateLayout();
    super.didMount();
  }

  /** @hidden */
  protected doMountChildViews(): void {
    type self = this;
    function doMountChildView(this: self, childView: View): void {
      childView.cascadeMount();
      if ((childView.viewFlags & View.RemovingFlag) !== 0) {
        childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
        this.removeChildView(childView);
      }
    }
    this.forEachChildView(doMountChildView, this);
  }

  cascadeUnmount(): void {
    if ((this.viewFlags & View.MountedFlag) !== 0) {
      this.setViewFlags(this.viewFlags & ~View.MountedFlag | View.TraversingFlag);
      try {
        this.willUnmount();
        this.doUnmountChildViews();
        this.onUnmount();
        this.didUnmount();
      } finally {
        this.setViewFlags(this.viewFlags & ~View.TraversingFlag);
      }
    } else {
      throw new Error("already unmounted");
    }
  }

  protected willUnmount(): void {
    super.willUnmount();
    this.deactivateLayout();
  }

  protected onUnmount(): void {
    this.unmountBindings();
    this.unmountAnimators();
    this.unmountScopes();
    this.unmountServices();
    this.setViewFlags(this.viewFlags & (~View.ViewFlagMask | View.RemovingFlag));
  }

  /** @hidden */
  protected doUnmountChildViews(): void {
    type self = this;
    function doUnmountChildView(this: self, childView: View): void {
      childView.cascadeUnmount();
      if ((childView.viewFlags & View.RemovingFlag) !== 0) {
        childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
        this.removeChildView(childView);
      }
    }
    this.forEachChildView(doUnmountChildView, this);
  }

  cascadePower(): void {
    if ((this.viewFlags & View.PoweredFlag) === 0) {
      this.setViewFlags(this.viewFlags | (View.PoweredFlag | View.TraversingFlag));
      try {
        this.willPower();
        this.onPower();
        this.doPowerChildViews();
        this.didPower();
      } finally {
        this.setViewFlags(this.viewFlags & ~View.TraversingFlag);
      }
    } else {
      throw new Error("already powered");
    }
  }

  /** @hidden */
  protected doPowerChildViews(): void {
    type self = this;
    function doPowerChildView(this: self, childView: View): void {
      childView.cascadePower();
      if ((childView.viewFlags & View.RemovingFlag) !== 0) {
        childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
        this.removeChildView(childView);
      }
    }
    this.forEachChildView(doPowerChildView, this);
  }

  cascadeUnpower(): void {
    if ((this.viewFlags & View.PoweredFlag) !== 0) {
      this.setViewFlags(this.viewFlags & ~View.PoweredFlag | View.TraversingFlag);
      try {
        this.willUnpower();
        this.doUnpowerChildViews();
        this.onUnpower();
        this.didUnpower();
      } finally {
        this.setViewFlags(this.viewFlags & ~View.TraversingFlag);
      }
    } else {
      throw new Error("already unpowered");
    }
  }

  /** @hidden */
  protected doUnpowerChildViews(): void {
    type self = this;
    function doUnpowerChildView(this: self, childView: View): void {
      childView.cascadeUnpower();
      if ((childView.viewFlags & View.RemovingFlag) !== 0) {
        childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
        this.removeChildView(childView);
      }
    }
    this.forEachChildView(doUnpowerChildView, this);
  }

  setCulled(culled: boolean): void {
    const viewFlags = this.viewFlags;
    if (culled && (viewFlags & View.CulledFlag) === 0) {
      this.setViewFlags(viewFlags | View.CulledFlag);
      if ((viewFlags & View.CullFlag) === 0) {
        this.doCull();
      }
    } else if (!culled && (viewFlags & View.CulledFlag) !== 0) {
      this.setViewFlags(viewFlags & ~View.CulledFlag);
      if ((viewFlags & View.CullFlag) === 0) {
        this.doUncull();
      }
    }
  }

  cascadeCull(): void {
    if ((this.viewFlags & View.CullFlag) === 0) {
      this.setViewFlags(this.viewFlags | View.CullFlag);
      if ((this.viewFlags & View.CulledFlag) === 0) {
        this.doCull();
      }
    } else {
      throw new Error("already culled");
    }
  }

  /** @hidden */
  protected doCull(): void {
    this.setViewFlags(this.viewFlags | View.TraversingFlag);
    try {
      this.willCull();
      this.onCull();
      this.doCullChildViews();
      this.didCull();
    } finally {
      this.setViewFlags(this.viewFlags & ~View.TraversingFlag);
    }
  }

  /** @hidden */
  protected doCullChildViews(): void {
    type self = this;
    function doCullChildView(this: self, childView: View): void {
      childView.cascadeCull();
      if ((childView.viewFlags & View.RemovingFlag) !== 0) {
        childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
        this.removeChildView(childView);
      }
    }
    this.forEachChildView(doCullChildView, this);
  }

  cascadeUncull(): void {
    if ((this.viewFlags & View.CullFlag) !== 0) {
      this.setViewFlags(this.viewFlags & ~View.CullFlag);
      if ((this.viewFlags & View.CulledFlag) === 0) {
        this.doUncull();
      }
    } else {
      throw new Error("already unculled");
    }
  }

  /** @hidden */
  protected doUncull(): void {
    this.setViewFlags(this.viewFlags | View.TraversingFlag);
    try {
      this.willUncull();
      this.doUncullChildViews();
      this.onUncull();
      this.didUncull();
    } finally {
      this.setViewFlags(this.viewFlags & ~View.TraversingFlag);
    }
  }

  /** @hidden */
  protected doUncullChildViews(): void {
    type self = this;
    function doUncullChildView(this: self, childView: View): void {
      childView.cascadeUncull();
      if ((childView.viewFlags & View.RemovingFlag) !== 0) {
        childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
        this.removeChildView(childView);
      }
    }
    this.forEachChildView(doUncullChildView, this);
  }

  protected onUncull(): void {
    super.onUncull();
    if (this.mood.isInherited()) {
      this.mood.change();
    }
    if (this.theme.isInherited()) {
      this.theme.change();
    }
  }

  cullViewFrame(viewFrame: BoxR2 = this.viewFrame): void {
    this.setCulled(!viewFrame.intersects(this.viewBounds));
  }

  get renderer(): GraphicsRenderer | null {
    const parentView = this.parentView;
    if (parentView instanceof GraphicsView || parentView instanceof GraphicsView.Canvas) {
      return parentView.renderer;
    } else {
      return null;
    }
  }

  needsProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): ViewFlags {
    if ((this.viewFlags & View.NeedsAnimate) === 0) {
      processFlags &= ~View.NeedsAnimate;
    }
    return processFlags;
  }

  cascadeProcess(processFlags: ViewFlags, viewContext: ViewContext): void {
    const extendedViewContext = this.extendViewContext(viewContext);
    processFlags &= ~View.NeedsProcess;
    processFlags |= this.viewFlags & View.UpdateMask;
    processFlags = this.needsProcess(processFlags, extendedViewContext);
    if ((processFlags & View.ProcessMask) !== 0) {
      this.doProcess(processFlags, extendedViewContext);
    }
  }

  /** @hidden */
  protected doProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    let cascadeFlags = processFlags;
    this.setViewFlags(this.viewFlags & ~(View.NeedsProcess | View.NeedsProject)
                                     |  (View.TraversingFlag | View.ProcessingFlag));
    try {
      this.willProcess(cascadeFlags, viewContext);
      if (((this.viewFlags | processFlags) & View.NeedsResize) !== 0) {
        this.willResize(viewContext);
        cascadeFlags |= View.NeedsResize;
        this.setViewFlags(this.viewFlags & ~View.NeedsResize);
      }
      if (((this.viewFlags | processFlags) & View.NeedsScroll) !== 0) {
        this.willScroll(viewContext);
        cascadeFlags |= View.NeedsScroll;
        this.setViewFlags(this.viewFlags & ~View.NeedsScroll);
      }
      if (((this.viewFlags | processFlags) & View.NeedsChange) !== 0) {
        this.willChange(viewContext);
        cascadeFlags |= View.NeedsChange;
        this.setViewFlags(this.viewFlags & ~View.NeedsChange);
      }
      if (((this.viewFlags | processFlags) & View.NeedsAnimate) !== 0) {
        this.willAnimate(viewContext);
        cascadeFlags |= View.NeedsAnimate;
        this.setViewFlags(this.viewFlags & ~View.NeedsAnimate);
      }

      this.onProcess(cascadeFlags, viewContext);
      if ((cascadeFlags & View.NeedsResize) !== 0) {
        this.onResize(viewContext);
      }
      if ((cascadeFlags & View.NeedsScroll) !== 0) {
        this.onScroll(viewContext);
      }
      if ((cascadeFlags & View.NeedsChange) !== 0) {
        this.onChange(viewContext);
      }
      if ((cascadeFlags & View.NeedsAnimate) !== 0) {
        this.onAnimate(viewContext);
      }

      this.doProcessChildViews(cascadeFlags, viewContext);

      if ((cascadeFlags & View.NeedsAnimate) !== 0) {
        this.didAnimate(viewContext);
      }
      if ((cascadeFlags & View.NeedsChange) !== 0) {
        this.didChange(viewContext);
      }
      if ((cascadeFlags & View.NeedsScroll) !== 0) {
        this.didScroll(viewContext);
      }
      if ((cascadeFlags & View.NeedsResize) !== 0) {
        this.didResize(viewContext);
      }
      this.didProcess(cascadeFlags, viewContext);
    } finally {
      this.setViewFlags(this.viewFlags & ~(View.TraversingFlag | View.ProcessingFlag));
    }
  }

  protected onChange(viewContext: ViewContextType<this>): void {
    super.onChange(viewContext);
    this.changeScopes();
    this.updateTheme();
  }

  protected onAnimate(viewContext: ViewContextType<this>): void {
    super.onAnimate(viewContext);
    this.updateAnimators(viewContext.updateTime);
  }

  protected willLayout(viewContext: ViewContextType<this>): void {
    super.willLayout(viewContext);
    this.updateConstraints();
  }

  protected didLayout(viewContext: ViewContextType<this>): void {
    this.updateConstraintVariables();
    super.didLayout(viewContext);
  }

  /** @hidden */
  protected doProcessChildViews(processFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    if ((processFlags & View.ProcessMask) !== 0 && this.childViewCount !== 0) {
      this.willProcessChildViews(processFlags, viewContext);
      this.onProcessChildViews(processFlags, viewContext);
      this.didProcessChildViews(processFlags, viewContext);
    }
  }

  cascadeDisplay(displayFlags: ViewFlags, viewContext: ViewContext): void {
    const extendedViewContext = this.extendViewContext(viewContext);
    displayFlags &= ~View.NeedsDisplay;
    displayFlags |= this.viewFlags & View.UpdateMask;
    displayFlags = this.needsDisplay(displayFlags, extendedViewContext);
    if ((displayFlags & View.DisplayMask) !== 0) {
      this.doDisplay(displayFlags, extendedViewContext);
    }
  }

  /** @hidden */
  protected doDisplay(displayFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    let cascadeFlags = displayFlags;
    this.setViewFlags(this.viewFlags & ~View.NeedsDisplay | (View.TraversingFlag | View.DisplayingFlag));
    try {
      this.willDisplay(cascadeFlags, viewContext);
      if (((this.viewFlags | displayFlags) & View.NeedsLayout) !== 0) {
        this.willLayout(viewContext);
        cascadeFlags |= View.NeedsLayout;
        this.setViewFlags(this.viewFlags & ~View.NeedsLayout);
      }
      if (((this.viewFlags | displayFlags) & View.NeedsRender) !== 0) {
        this.willRender(viewContext);
        cascadeFlags |= View.NeedsRender;
        this.setViewFlags(this.viewFlags & ~View.NeedsRender);
      }
      if (((this.viewFlags | displayFlags) & View.NeedsComposite) !== 0) {
        this.willComposite(viewContext);
        cascadeFlags |= View.NeedsComposite;
        this.setViewFlags(this.viewFlags & ~View.NeedsComposite);
      }

      this.onDisplay(cascadeFlags, viewContext);
      if ((cascadeFlags & View.NeedsLayout) !== 0) {
        this.onLayout(viewContext);
      }
      if ((cascadeFlags & View.NeedsRender) !== 0) {
        this.onRender(viewContext);
      }
      if ((cascadeFlags & View.NeedsComposite) !== 0) {
        this.onComposite(viewContext);
      }

      this.doDisplayChildViews(cascadeFlags, viewContext);

      if ((cascadeFlags & View.NeedsComposite) !== 0) {
        this.didComposite(viewContext);
      }
      if ((cascadeFlags & View.NeedsRender) !== 0) {
        this.didRender(viewContext);
      }
      if ((cascadeFlags & View.NeedsLayout) !== 0) {
        this.didLayout(viewContext);
      }
      this.didDisplay(cascadeFlags, viewContext);
    } finally {
      this.setViewFlags(this.viewFlags & ~(View.TraversingFlag | View.DisplayingFlag));
    }
  }

  protected willRender(viewContext: ViewContextType<this>): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewWillRender !== void 0) {
      viewController.viewWillRender(viewContext, this);
    }
    const viewObservers = this._willRenderObservers;
    if (viewObservers !== void 0) {
      for (let i = 0; i < viewObservers.length; i += 1) {
        const viewObserver = viewObservers[i]!;
        viewObserver.viewWillRender(viewContext, this);
      }
    }
  }

  protected onRender(viewContext: ViewContextType<this>): void {
    // hook
  }

  protected didRender(viewContext: ViewContextType<this>): void {
    const viewObservers = this._didRenderObservers;
    if (viewObservers !== void 0) {
      for (let i = 0; i < viewObservers.length; i += 1) {
        const viewObserver = viewObservers[i]!;
        viewObserver.viewDidRender(viewContext, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewDidRender !== void 0) {
      viewController.viewDidRender(viewContext, this);
    }
  }

  protected willComposite(viewContext: ViewContextType<this>): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewWillComposite !== void 0) {
      viewController.viewWillComposite(viewContext, this);
    }
    const viewObservers = this._willCompositeObservers;
    if (viewObservers !== void 0) {
      for (let i = 0; i < viewObservers.length; i += 1) {
        const viewObserver = viewObservers[i]!;
        viewObserver.viewWillComposite(viewContext, this);
      }
    }
  }

  protected onComposite(viewContext: ViewContextType<this>): void {
    // hook
  }

  protected didComposite(viewContext: ViewContextType<this>): void {
    const viewObservers = this._didCompositeObservers;
    if (viewObservers !== void 0) {
      for (let i = 0; i < viewObservers.length; i += 1) {
        const viewObserver = viewObservers[i]!;
        viewObserver.viewDidComposite(viewContext, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewDidComposite !== void 0) {
      viewController.viewDidComposite(viewContext, this);
    }
  }

  /** @hidden */
  protected doDisplayChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    if ((displayFlags & View.DisplayMask) !== 0 && this.childViewCount !== 0
        && !this.isHidden() && !this.isCulled()) {
      this.willDisplayChildViews(displayFlags, viewContext);
      this.onDisplayChildViews(displayFlags, viewContext);
      this.didDisplayChildViews(displayFlags, viewContext);
    }
  }

  @ViewScope({type: MoodMatrix})
  declare moodModifier: ViewScope<this, MoodMatrix | undefined>;

  @ViewScope({type: MoodMatrix})
  declare themeModifier: ViewScope<this, MoodMatrix | undefined>;

  getLook<T>(look: Look<T, unknown>, mood?: MoodVector<Feel>): T | undefined {
    const theme = this.theme.state;
    let value: T | undefined;
    if (theme !== void 0) {
      if (mood === void 0) {
        mood = this.mood.state;
      }
      if (mood !== void 0) {
        value = theme.inner(mood, look);
      }
    }
    return value;
  }

  getLookOr<T, V>(look: Look<T, unknown>, elseValue: V, mood?: MoodVector<Feel>): T | V {
    const theme = this.theme.state;
    let value: T | V | undefined;
    if (theme !== void 0) {
      if (mood === void 0) {
        mood = this.mood.state;
      }
      if (mood !== void 0) {
        value = theme.inner(mood, look);
      }
    }
    if (value === void 0) {
      value = elseValue;
    }
    return value;
  }

  modifyMood(feel: Feel, ...entries: [Feel, number | undefined][]): void {
    const oldMoodModifier = this.moodModifier.getStateOr(MoodMatrix.empty());
    const newMoodModifier = oldMoodModifier.updatedCol(feel, true, ...entries);
    if (!newMoodModifier.equals(oldMoodModifier)) {
      this.moodModifier.setState(newMoodModifier);
      this.changeMood();
      this.requireUpdate(View.NeedsChange);
    }
  }

  modifyTheme(feel: Feel, ...entries: [Feel, number | undefined][]): void {
    const oldThemeModifier = this.themeModifier.getStateOr(MoodMatrix.empty());
    const newThemeModifier = oldThemeModifier.updatedCol(feel, true, ...entries);
    if (!newThemeModifier.equals(oldThemeModifier)) {
      this.themeModifier.setState(newThemeModifier);
      this.changeTheme();
      this.requireUpdate(View.NeedsChange);
    }
  }

  protected changeMood(): void {
    const moodModifierScope = this.getViewScope("moodModifier") as ViewScope<this, MoodMatrix | undefined> | null;
    if (moodModifierScope !== null && this.mood.isAuto()) {
      const moodModifier = moodModifierScope.state;
      if (moodModifier !== void 0) {
        let superMood = this.mood.superState;
        if (superMood === void 0) {
          const themeManager = this.themeService.manager;
          if (themeManager !== void 0) {
            superMood = themeManager.mood;
          }
        }
        if (superMood !== void 0) {
          const mood = moodModifier.transform(superMood, true);
          this.mood.setAutoState(mood);
        }
      } else {
        this.mood.setInherited(true);
      }
    }
  }

  protected changeTheme(): void {
    const themeModifierScope = this.getViewScope("themeModifier") as ViewScope<this, MoodMatrix | undefined> | null;
    if (themeModifierScope !== null && this.theme.isAuto()) {
      const themeModifier = themeModifierScope.state;
      if (themeModifier !== void 0) {
        let superTheme = this.theme.superState;
        if (superTheme === void 0) {
          const themeManager = this.themeService.manager;
          if (themeManager !== void 0) {
            superTheme = themeManager.theme;
          }
        }
        if (superTheme !== void 0) {
          const theme = superTheme.transform(themeModifier, true);
          this.theme.setAutoState(theme);
        }
      } else {
        this.theme.setInherited(true);
      }
    }
  }

  protected updateTheme(): void {
    if (this.theme.isChanging() || this.mood.isChanging()) {
      this.changeMood();
      this.changeTheme();

      const theme = this.theme.state;
      const mood = this.mood.state;
      if (theme !== void 0 && mood !== void 0) {
        this.applyTheme(theme, mood);
      }
    }
  }

  /** @hidden */
  protected mountTheme(): void {
    // hook
  }

  /**
   * Returns `true` if this view is ineligible for rendering and hit testing,
   * and should be excluded from its parent's layout and hit bounds.
   */
  isHidden(): boolean {
    return (this.viewFlags & View.HiddenMask) !== 0;
  }

  /**
   * Makes this view ineligible for rendering and hit testing, and excludes
   * this view from its parent's layout and hit bounds, when `hidden` is `true`.
   * Makes this view eligible for rendering and hit testing, and includes this
   * view in its parent's layout and hit bounds, when `hidden` is `false`.
   */
  setHidden(hidden: boolean): void {
    const viewFlags = this.viewFlags;
    if (hidden && (viewFlags & View.HiddenFlag) === 0) {
      this.setViewFlags(viewFlags | View.HiddenFlag);
      if ((viewFlags & View.HideFlag) === 0) {
        this.doHide();
      }
    } else if (!hidden && (viewFlags & View.HiddenFlag) !== 0) {
      this.setViewFlags(viewFlags & ~View.HiddenFlag);
      if ((viewFlags & View.HideFlag) === 0) {
        this.doUnhide();
      }
    }
  }

  cascadeHide(): void {
    if ((this.viewFlags & View.HideFlag) === 0) {
      this.setViewFlags(this.viewFlags | View.HideFlag);
      if ((this.viewFlags & View.HiddenFlag) === 0) {
        this.doHide();
      }
    } else {
      throw new Error("already hidden");
    }
  }

  /** @hidden */
  protected doHide(): void {
    this.setViewFlags(this.viewFlags | View.TraversingFlag);
    try {
      this.willSetHidden(true);
      this.onSetHidden(true);
      this.doHideChildViews();
      this.didSetHidden(true);
    } finally {
      this.setViewFlags(this.viewFlags & ~View.TraversingFlag);
    }
  }

  /** @hidden */
  protected doHideChildViews(): void {
    type self = this;
    function doHideChildView(this: self, childView: View): void {
      if (childView instanceof GraphicsView) {
        childView.cascadeHide();
        if ((childView.viewFlags & View.RemovingFlag) !== 0) {
          childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
          this.removeChildView(childView);
        }
      }
    }
    this.forEachChildView(doHideChildView, this);
  }

  cascadeUnhide(): void {
    if ((this.viewFlags & View.HideFlag) !== 0) {
      this.setViewFlags(this.viewFlags & ~View.HideFlag);
      if ((this.viewFlags & View.HiddenFlag) === 0) {
        this.doUnhide();
      }
    } else {
      throw new Error("already unhidden");
    }
  }

  /** @hidden */
  protected doUnhide(): void {
    this.setViewFlags(this.viewFlags | View.TraversingFlag);
    try {
      this.willSetHidden(false);
      this.doUnhideChildViews();
      this.onSetHidden(false);
      this.didSetHidden(false);
    } finally {
      this.setViewFlags(this.viewFlags & ~View.TraversingFlag);
    }
  }

  /** @hidden */
  protected doUnhideChildViews(): void {
    type self = this;
    function doUnhideChildView(this: self, childView: View): void {
      if (childView instanceof GraphicsView) {
        childView.cascadeUnhide();
        if ((childView.viewFlags & View.RemovingFlag) !== 0) {
          childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
          this.removeChildView(childView);
        }
      }
    }
    this.forEachChildView(doUnhideChildView, this);
  }

  protected willSetHidden(hidden: boolean): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewWillSetHidden !== void 0) {
      viewController.viewWillSetHidden(hidden, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillSetHidden !== void 0) {
        viewObserver.viewWillSetHidden(hidden, this);
      }
    }
  }

  protected onSetHidden(hidden: boolean): void {
    if (!hidden) {
      this.requireUpdate(View.NeedsRender);
    }
  }

  protected didSetHidden(hidden: boolean): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidSetHidden !== void 0) {
        viewObserver.viewDidSetHidden(hidden, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewDidSetHidden !== void 0) {
      viewController.viewDidSetHidden(hidden, this);
    }
  }

  hasViewService(serviceName: string): boolean {
    const viewServices = this._viewServices;
    return viewServices !== void 0 && viewServices[serviceName] !== void 0;
  }

  getViewService(serviceName: string): ViewService<this, unknown> | null {
    const viewServices = this._viewServices;
    if (viewServices !== void 0) {
      const viewService = viewServices[serviceName];
      if (viewService !== void 0) {
        return viewService as ViewService<this, unknown>;
      }
    }
    return null;
  }

  setViewService(serviceName: string, newViewService: ViewService<this, unknown> | null): void {
    let viewServices = this._viewServices;
    if (viewServices === void 0) {
      viewServices = {};
      this._viewServices = viewServices;
    }
    const oldViewService = viewServices[serviceName];
    if (oldViewService !== void 0 && this.isMounted()) {
      oldViewService.unmount();
    }
    if (newViewService !== null) {
      viewServices[serviceName] = newViewService;
      if (this.isMounted()) {
        newViewService.mount();
      }
    } else {
      delete viewServices[serviceName];
    }
  }

  /** @hidden */
  protected mountServices(): void {
    const viewServices = this._viewServices;
    if (viewServices !== void 0) {
      for (const serviceName in viewServices) {
        const viewService = viewServices[serviceName]!;
        viewService.mount();
      }
    }
  }

  /** @hidden */
  protected unmountServices(): void {
    const viewServices = this._viewServices;
    if (viewServices !== void 0) {
      for (const serviceName in viewServices) {
        const viewService = viewServices[serviceName]!;
        viewService.unmount();
      }
    }
  }

  hasViewScope(scopeName: string): boolean {
    const viewScopes = this._viewScopes;
    return viewScopes !== void 0 && viewScopes[scopeName] !== void 0;
  }

  getViewScope(scopeName: string): ViewScope<this, unknown> | null {
    const viewScopes = this._viewScopes;
    if (viewScopes !== void 0) {
      const viewScope = viewScopes[scopeName];
      if (viewScope !== void 0) {
        return viewScope as ViewScope<this, unknown>;
      }
    }
    return null;
  }

  setViewScope(scopeName: string, newViewScope: ViewScope<this, unknown> | null): void {
    let viewScopes = this._viewScopes;
    if (viewScopes === void 0) {
      viewScopes = {};
      this._viewScopes = viewScopes;
    }
    const oldViewScope = viewScopes[scopeName];
    if (oldViewScope !== void 0 && this.isMounted()) {
      oldViewScope.unmount();
    }
    if (newViewScope !== null) {
      viewScopes[scopeName] = newViewScope;
      if (this.isMounted()) {
        newViewScope.mount();
      }
    } else {
      delete viewScopes[scopeName];
    }
  }

  /** @hidden */
  changeScopes(): void {
    const viewScopes = this._viewScopes;
    if (viewScopes !== void 0) {
      for (const scopeName in viewScopes) {
        const viewScope = viewScopes[scopeName]!;
        viewScope.onChange();
      }
    }
  }

  /** @hidden */
  protected mountScopes(): void {
    const viewScopes = this._viewScopes;
    if (viewScopes !== void 0) {
      for (const scopeName in viewScopes) {
        const viewScope = viewScopes[scopeName]!;
        viewScope.mount();
      }
    }
  }

  /** @hidden */
  protected unmountScopes(): void {
    const viewScopes = this._viewScopes;
    if (viewScopes !== void 0) {
      for (const scopeName in viewScopes) {
        const viewScope = viewScopes[scopeName]!;
        viewScope.unmount();
      }
    }
  }

  hasViewAnimator(animatorName: string): boolean {
    const viewAnimators = this._viewAnimators;
    return viewAnimators !== void 0 && viewAnimators[animatorName] !== void 0;
  }

  getViewAnimator(animatorName: string): ViewAnimator<this, unknown> | null {
    const viewAnimators = this._viewAnimators;
    if (viewAnimators !== void 0) {
      const viewAnimator = viewAnimators[animatorName];
      if (viewAnimator !== void 0) {
        return viewAnimator as ViewAnimator<this, unknown>;
      }
    }
    return null;
  }

  setViewAnimator(animatorName: string, newViewAnimator: ViewAnimator<this, unknown> | null): void {
    let viewAnimators = this._viewAnimators;
    if (viewAnimators === void 0) {
      viewAnimators = {};
      this._viewAnimators = viewAnimators;
    }
    const oldViewAnimator = viewAnimators[animatorName];
    if (oldViewAnimator !== void 0 && this.isMounted()) {
      oldViewAnimator.unmount();
    }
    if (newViewAnimator !== null) {
      viewAnimators[animatorName] = newViewAnimator;
      if (this.isMounted()) {
        newViewAnimator.mount();
      }
    } else {
      delete viewAnimators[animatorName];
    }
  }

  /** @hidden */
  updateAnimators(t: number): void {
    this.updateViewAnimators(t);
  }

  /** @hidden */
  updateViewAnimators(t: number): void {
    const viewAnimators = this._viewAnimators;
    if (viewAnimators !== void 0) {
      for (const animatorName in viewAnimators) {
        const viewAnimator = viewAnimators[animatorName]!;
        viewAnimator.onAnimate(t);
      }
    }
  }

  /** @hidden */
  protected mountAnimators(): void {
    this.mountViewAnimators();
  }

  /** @hidden */
  protected mountViewAnimators(): void {
    const viewAnimators = this._viewAnimators;
    if (viewAnimators !== void 0) {
      for (const animatorName in viewAnimators) {
        const viewAnimator = viewAnimators[animatorName]!;
        viewAnimator.mount();
      }
    }
  }

  /** @hidden */
  protected unmountAnimators(): void {
    this.unmountViewAnimators();
  }

  /** @hidden */
  protected unmountViewAnimators(): void {
    const viewAnimators = this._viewAnimators;
    if (viewAnimators !== void 0) {
      for (const animatorName in viewAnimators) {
        const viewAnimator = viewAnimators[animatorName]!;
        viewAnimator.unmount();
      }
    }
  }

  hasViewBinding(bindingName: string): boolean {
    const viewBindings = this._viewBindings;
    return viewBindings !== void 0 && viewBindings[bindingName] !== void 0;
  }

  getViewBinding(bindingName: string): ViewBinding<this, View> | null {
    const viewBindings = this._viewBindings;
    if (viewBindings !== void 0) {
      const viewBinding = viewBindings[bindingName];
      if (viewBinding !== void 0) {
        return viewBinding as ViewBinding<this, View>;
      }
    }
    return null;
  }

  setViewBinding(bindingName: string, newViewBinding: ViewBinding<this, any> | null): void {
    let viewBindings = this._viewBindings;
    if (viewBindings === void 0) {
      viewBindings = {};
      this._viewBindings = viewBindings;
    }
    const oldViewBinding = viewBindings[bindingName];
    if (oldViewBinding !== void 0 && this.isMounted()) {
      oldViewBinding.unmount();
    }
    if (newViewBinding !== null) {
      viewBindings[bindingName] = newViewBinding;
      if (this.isMounted()) {
        newViewBinding.mount();
      }
    } else {
      delete viewBindings[bindingName];
    }
  }

  /** @hidden */
  protected mountBindings(): void {
    const viewBindings = this._viewBindings;
    if (viewBindings !== void 0) {
      for (const bindingName in viewBindings) {
        const viewBinding = viewBindings[bindingName]!;
        viewBinding.mount();
      }
    }
  }

  /** @hidden */
  protected unmountBindings(): void {
    const viewBindings = this._viewBindings;
    if (viewBindings !== void 0) {
      for (const bindingName in viewBindings) {
        const viewBinding = viewBindings[bindingName]!;
        viewBinding.unmount();
      }
    }
  }

  /** @hidden */
  protected insertViewBinding(childView: View): void {
    const bindingName = childView.key;
    if (bindingName !== void 0) {
      const viewBinding = this.getLazyViewBinding(bindingName);
      if (viewBinding !== null && viewBinding.child === true) {
        viewBinding.doSetView(childView);
      }
    }
  }

  /** @hidden */
  protected removeViewBinding(childView: View): void {
    const bindingName = childView.key;
    if (bindingName !== void 0) {
      const viewBinding = this.getViewBinding(bindingName);
      if (viewBinding !== null && viewBinding.child === true) {
        viewBinding.doSetView(null);
      }
    }
  }

  hasLayoutAnchor(anchorName: string): boolean {
    const layoutAnchors = this._layoutAnchors;
    return layoutAnchors !== void 0 && layoutAnchors[anchorName] !== void 0;
  }

  getLayoutAnchor(anchorName: string): LayoutAnchor<this> | null {
    const layoutAnchors = this._layoutAnchors;
    if (layoutAnchors !== void 0) {
      const layoutAnchor = layoutAnchors[anchorName];
      if (layoutAnchor !== void 0) {
        return layoutAnchor as LayoutAnchor<this>;
      }
    }
    return null;
  }

  setLayoutAnchor(anchorName: string, layoutAnchor: LayoutAnchor<this> | null): void {
    let layoutAnchors = this._layoutAnchors;
    if (layoutAnchors === void 0) {
      layoutAnchors = {};
      this._layoutAnchors = layoutAnchors;
    }
    if (layoutAnchor !== null) {
      layoutAnchors[anchorName] = layoutAnchor;
    } else {
      delete layoutAnchors[anchorName];
    }
  }

  get constraints(): ReadonlyArray<Constraint> {
    let constraints = this._constraints;
    if (constraints === void 0) {
      constraints = [];
      this._constraints = constraints;
    }
    return constraints;
  }

  hasConstraint(constraint: Constraint): boolean {
    const constraints = this._constraints;
    return constraints !== void 0 && constraints.indexOf(constraint) >= 0;
  }

  addConstraint(constraint: Constraint): void {
    let constraints = this._constraints;
    if (constraints === void 0) {
      constraints = [];
      this._constraints = constraints;
    }
    if (constraints.indexOf(constraint) < 0) {
      constraints.push(constraint);
      this.activateConstraint(constraint);
    }
  }

  removeConstraint(constraint: Constraint): void {
    const constraints = this._constraints;
    if (constraints !== void 0) {
      const index = constraints.indexOf(constraint);
      if (index >= 0) {
        constraints.splice(index, 1);
        this.deactivateConstraint(constraint);
      }
    }
  }

  get constraintVariables(): ReadonlyArray<ConstrainVariable> {
    let constraintVariables = this._constraintVariables;
    if (constraintVariables === void 0) {
      constraintVariables = [];
      this._constraintVariables = constraintVariables;
    }
    return constraintVariables;
  }

  hasConstraintVariable(constraintVariable: ConstrainVariable): boolean {
    const constraintVariables = this._constraintVariables;
    return constraintVariables !== void 0 && constraintVariables.indexOf(constraintVariable) >= 0;
  }

  addConstraintVariable(constraintVariable: ConstrainVariable): void {
    let constraintVariables = this._constraintVariables;
    if (constraintVariables === void 0) {
      constraintVariables = [];
      this._constraintVariables = constraintVariables;
    }
    if (constraintVariables.indexOf(constraintVariable) < 0) {
      constraintVariables.push(constraintVariable);
      this.activateConstraintVariable(constraintVariable);
    }
  }

  removeConstraintVariable(constraintVariable: ConstrainVariable): void {
    const constraintVariables = this._constraintVariables;
    if (constraintVariables !== void 0) {
      const index = constraintVariables.indexOf(constraintVariable);
      if (index >= 0) {
        this.deactivateConstraintVariable(constraintVariable);
        constraintVariables.splice(index, 1);
      }
    }
  }

  protected updateConstraints(): void {
    this.updateLayoutAnchors();
  }

  /** @hidden */
  updateLayoutAnchors(): void {
    const layoutAnchors = this._layoutAnchors;
    if (layoutAnchors !== void 0) {
      for (const anchorName in layoutAnchors) {
        const layoutAnchor = layoutAnchors[anchorName]!;
        layoutAnchor.updateState();
      }
    }
  }

  /** @hidden */
  activateLayout(): void {
    const constraints = this._constraints;
    const constraintVariables = this._constraintVariables;
    if (constraints !== void 0 || constraintVariables !== void 0) {
      const layoutManager = this.layoutService.manager;
      if (layoutManager !== void 0) {
        if (constraintVariables !== void 0) {
          for (let i = 0, n = constraintVariables.length; i < n; i += 1) {
            const constraintVariable = constraintVariables[i];
            if (constraintVariable instanceof LayoutAnchor) {
              layoutManager.activateConstraintVariable(constraintVariable);
              this.requireUpdate(View.NeedsLayout);
            }
          }
        }
        if (constraints !== void 0) {
          for (let i = 0, n = constraints.length; i < n; i += 1) {
            layoutManager.activateConstraint(constraints[i]!);
            this.requireUpdate(View.NeedsLayout);
          }
        }
      }
    }
  }

  /** @hidden */
  deactivateLayout(): void {
    const constraints = this._constraints;
    const constraintVariables = this._constraintVariables;
    if (constraints !== void 0 || constraintVariables !== void 0) {
      const layoutManager = this.layoutService.manager;
      if (layoutManager !== void 0) {
        if (constraints !== void 0) {
          for (let i = 0, n = constraints.length; i < n; i += 1) {
            layoutManager.deactivateConstraint(constraints[i]!);
            this.requireUpdate(View.NeedsLayout);
          }
        }
        if (constraintVariables !== void 0) {
          for (let i = 0, n = constraintVariables.length; i < n; i += 1) {
            layoutManager.deactivateConstraintVariable(constraintVariables[i]!);
            this.requireUpdate(View.NeedsLayout);
          }
        }
      }
    }
  }

  // @ts-ignore
  declare readonly viewContext: GraphicsViewContext;

  /**
   * The parent-specified view-coordinate bounding box in which this view
   * should layout and render graphics.
   */
  get viewFrame(): BoxR2 {
    let viewFrame = this._viewFrame;
    if (viewFrame === void 0) {
      const parentView = this.parentView;
      if (parentView instanceof GraphicsView || parentView instanceof GraphicsView.Canvas) {
        viewFrame = parentView.viewFrame;
      } else {
        viewFrame = BoxR2.undefined();
      }
    }
    return viewFrame;
  }

  /**
   * Sets the view-coordinate bounding box in which this view should layout
   * and render graphics.  Should only be invoked by the view's parent view.
   */
  setViewFrame(viewFrame: BoxR2 | null): void {
    if (viewFrame !== null) {
      this._viewFrame = viewFrame;
    } else if (this._viewFrame !== void 0) {
      this._viewFrame = void 0;
    }
  }

  /**
   * The self-defined view-coordinate bounding box surrounding all graphics
   * this view could possibly render.  Views with view bounds that don't
   * overlap their view frames may be culled from rendering and hit testing.
   */
  get viewBounds(): BoxR2 {
    return this.viewFrame;
  }

  get ownViewBounds(): BoxR2 | null {
    return null;
  }

  deriveViewBounds(): BoxR2 {
    let viewBounds: BoxR2 | null = this.ownViewBounds;
    type self = this;
    function accumulateViewBounds(this: self, childView: View): void {
      if (childView instanceof GraphicsView && !childView.isHidden()) {
        const childViewBounds = childView.viewBounds;
        if (childViewBounds.isDefined()) {
          if (viewBounds !== null) {
            viewBounds = viewBounds.union(childViewBounds);
          } else {
            viewBounds = childViewBounds;
          }
        }
      }
    }
    this.forEachChildView(accumulateViewBounds, this);
    if (viewBounds === null) {
      viewBounds = this.viewFrame;
    }
    return viewBounds;
  }

  /**
   * The self-defined view-coordinate bounding box surrounding all hit regions
   * in this view.
   */
  get hitBounds(): BoxR2 {
    return this.viewBounds;
  }

  deriveHitBounds(): BoxR2 {
    let hitBounds: BoxR2 | undefined;
    type self = this;
    function accumulateHitBounds(this: self, childView: View): void {
      if (childView instanceof GraphicsView && !childView.isHidden()) {
        const childHitBounds = childView.hitBounds;
        if (hitBounds === void 0) {
          hitBounds = childHitBounds;
        } else {
          hitBounds = hitBounds.union(childHitBounds);
        }
      }
    }
    this.forEachChildView(accumulateHitBounds, this);
    if (hitBounds === void 0) {
      hitBounds = this.viewBounds;
    }
    return hitBounds;
  }

  hitTest(x: number, y: number, viewContext: ViewContext): GraphicsView | null {
    const extendedViewContext = this.extendViewContext(viewContext);
    return this.doHitTest(x, y, extendedViewContext);
  }

  protected doHitTest(x: number, y: number, viewContext: ViewContextType<this>): GraphicsView | null {
    type self = this;
    function hitTestChildView(this: self, childView: View): GraphicsView | void {
      if (childView instanceof GraphicsView && !childView.isHidden() && !childView.isCulled()) {
        const hitBounds = childView.hitBounds;
        if (hitBounds.contains(x, y)) {
          const hit = childView.hitTest(x, y, viewContext);
          if (hit !== null) {
            return hit;
          }
        }
      }
    }
    return this.forEachChildView(hitTestChildView, this) || null;
  }

  get parentTransform(): Transform {
    return Transform.identity();
  }

  get clientBounds(): BoxR2 {
    const inverseClientTransform = this.clientTransform.inverse();
    return this.viewBounds.transform(inverseClientTransform);
  }

  get popoverFrame(): BoxR2 {
    const inversePageTransform = this.pageTransform.inverse();
    return this.viewBounds.transform(inversePageTransform);
  }

  on(type: string, listener: EventListenerOrEventListenerObject,
     options?: AddEventListenerOptions | boolean): this {
    let eventHandlers = this._eventHandlers;
    if (eventHandlers === void 0) {
      eventHandlers = {};
      this._eventHandlers = eventHandlers;
    }
    let handlers = eventHandlers[type];
    const capture = typeof options === "boolean" ? options
                  : typeof options === "object" && options !== null && options.capture || false;
    const passive = options && typeof options === "object" && options.passive || false;
    const once = options && typeof options === "object" && options.once || false;
    let handler: ViewEventHandler | undefined;
    if (handlers === void 0) {
      handler = {listener, capture, passive, once};
      handlers = [handler];
      eventHandlers[type] = handlers;
    } else {
      const n = handlers.length;
      let i = 0;
      while (i < n) {
        handler = handlers[i]!;
        if (handler.listener === listener && handler.capture === capture) {
          break;
        }
        i += 1;
      }
      if (i < n) {
        handler!.passive = passive;
        handler!.once = once;
      } else {
        handler = {listener, capture, passive, once};
        handlers.push(handler);
      }
    }
    return this;
  }

  off(type: string, listener: EventListenerOrEventListenerObject,
      options?: EventListenerOptions | boolean): this {
    const eventHandlers = this._eventHandlers;
    if (eventHandlers !== void 0) {
      const handlers = eventHandlers[type];
      if (handlers !== void 0) {
        const capture = typeof options === "boolean" ? options
                      : typeof options === "object" && options !== null && options.capture || false;
        const n = handlers.length;
        let i = 0;
        while (i < n) {
          const handler = handlers[i]!;
          if (handler.listener === listener && handler.capture === capture) {
            handlers.splice(i, 1);
            if (handlers.length === 0) {
              delete eventHandlers[type];
            }
            break;
          }
          i += 1;
        }
      }
    }
    return this;
  }

  /** @hidden */
  handleEvent(event: ViewEvent): void {
    const type = event.type;
    const eventHandlers = this._eventHandlers;
    if (eventHandlers !== void 0) {
      const handlers = eventHandlers[type];
      if (handlers !== void 0) {
        let i = 0;
        while (i < handlers.length) {
          const handler = handlers[i]!;
          if (!handler.capture) {
            const listener = handler.listener;
            if (typeof listener === "function") {
              listener(event);
            } else if (typeof listener === "object" && listener !== null) {
              listener.handleEvent(event);
            }
            if (handler.once) {
              handlers.splice(i, 1);
              continue;
            }
          }
          i += 1;
        }
        if (handlers.length === 0) {
          delete eventHandlers[type];
        }
      }
    }
    if (type === "mouseover") {
      this.onMouseOver(event as ViewMouseEvent);
    } else if (type === "mouseout") {
      this.onMouseOut(event as ViewMouseEvent);
    } else if (type === "pointerover") {
      this.onPointerOver(event as ViewPointerEvent);
    } else if (type === "pointerout") {
      this.onPointerOut(event as ViewPointerEvent);
    }
  }

  /**
   * Invokes event handlers registered with this `View` before propagating the
   * `event` up the view hierarchy.  Returns a `View`, without invoking any
   * registered event handlers, on which `dispatchEvent` should be called to
   * continue event propagation.
   * @hidden
   */
  bubbleEvent(event: ViewEvent): View | null {
    this.handleEvent(event);
    let next: View | null;
    if (event.bubbles && !event.cancelBubble) {
      const parentView = this.parentView;
      if (parentView instanceof GraphicsView || parentView instanceof GraphicsView.Canvas) {
        next = parentView.bubbleEvent(event);
      } else {
        next = parentView;
      }
    } else {
      next = null;
    }
    return next;
  }

  dispatchEvent(event: ViewEvent): boolean {
    event.targetView = this;
    const next = this.bubbleEvent(event);
    if (next !== null) {
      return next.dispatchEvent(event);
    } else {
      return !event.cancelBubble;
    }
  }

  isHovering(): boolean {
    const hoverSet = this._hoverSet;
    return hoverSet !== void 0 && Object.keys(hoverSet).length !== 0;
  }

  /** @hidden */
  protected onMouseOver(event: ViewMouseEvent): void {
    let hoverSet = this._hoverSet;
    if (hoverSet === void 0) {
      hoverSet = {};
      this._hoverSet = hoverSet;
    }
    if (hoverSet.mouse === void 0) {
      hoverSet.mouse = null;
      const eventHandlers = this._eventHandlers;
      if (eventHandlers !== void 0 && eventHandlers.mouseenter !== void 0) {
        const enterEvent = new MouseEvent("mouseenter", {
          bubbles: false,
          button: event.button,
          buttons: event.buttons,
          altKey: event.altKey,
          ctrlKey: event.ctrlKey,
          metaKey: event.metaKey,
          shiftKey: event.shiftKey,
          clientX: event.clientX,
          clientY: event.clientY,
          screenX: event.screenX,
          screenY: event.screenY,
          movementX: event.movementX,
          movementY: event.movementY,
          view: event.view,
          detail: event.detail,
          relatedTarget: event.relatedTarget,
        }) as ViewMouseEvent;
        enterEvent.targetView = this;
        enterEvent.relatedTargetView = event.relatedTargetView;
        this.handleEvent(enterEvent);
      }
    }
  }

  /** @hidden */
  protected onMouseOut(event: ViewMouseEvent): void {
    const hoverSet = this._hoverSet;
    if (hoverSet !== void 0 && hoverSet.mouse !== void 0) {
      delete hoverSet.mouse;
      const eventHandlers = this._eventHandlers;
      if (eventHandlers !== void 0 && eventHandlers.mouseleave !== void 0) {
        const leaveEvent = new MouseEvent("mouseleave", {
          bubbles: false,
          button: event.button,
          buttons: event.buttons,
          altKey: event.altKey,
          ctrlKey: event.ctrlKey,
          metaKey: event.metaKey,
          shiftKey: event.shiftKey,
          clientX: event.clientX,
          clientY: event.clientY,
          screenX: event.screenX,
          screenY: event.screenY,
          movementX: event.movementX,
          movementY: event.movementY,
          view: event.view,
          detail: event.detail,
          relatedTarget: event.relatedTarget,
        }) as ViewMouseEvent;
        leaveEvent.targetView = this;
        leaveEvent.relatedTargetView = event.relatedTargetView;
        this.handleEvent(leaveEvent);
      }
    }
  }

  /** @hidden */
  protected onPointerOver(event: ViewPointerEvent): void {
    let hoverSet = this._hoverSet;
    if (hoverSet === void 0) {
      hoverSet = {};
      this._hoverSet = hoverSet;
    }
    const id = "" + event.pointerId;
    if (hoverSet[id] === void 0) {
      hoverSet[id] = null;
      const eventHandlers = this._eventHandlers;
      if (eventHandlers !== void 0 && eventHandlers.pointerenter !== void 0) {
        const enterEvent = new PointerEvent("pointerenter", {
          bubbles: false,
          pointerId: event.pointerId,
          pointerType: event.pointerType,
          isPrimary: event.isPrimary,
          button: event.button,
          buttons: event.buttons,
          altKey: event.altKey,
          ctrlKey: event.ctrlKey,
          metaKey: event.metaKey,
          shiftKey: event.shiftKey,
          clientX: event.clientX,
          clientY: event.clientY,
          screenX: event.screenX,
          screenY: event.screenY,
          movementX: event.movementX,
          movementY: event.movementY,
          tiltX: event.tiltX,
          tiltY: event.tiltY,
          twist: event.twist,
          width: event.width,
          height: event.height,
          pressure: event.pressure,
          tangentialPressure: event.tangentialPressure,
          view: event.view,
          detail: event.detail,
          relatedTarget: event.relatedTarget,
        }) as ViewPointerEvent;
        enterEvent.targetView = this;
        enterEvent.relatedTargetView = event.relatedTargetView;
        this.handleEvent(enterEvent);
      }
    }
  }

  /** @hidden */
  protected onPointerOut(event: ViewPointerEvent): void {
    const hoverSet = this._hoverSet;
    if (hoverSet !== void 0) {
      const id = "" + event.pointerId;
      if (hoverSet[id] !== void 0) {
        delete hoverSet[id];
        const eventHandlers = this._eventHandlers;
        if (eventHandlers !== void 0 && eventHandlers.pointerleave !== void 0) {
          const leaveEvent = new PointerEvent("pointerleave", {
            bubbles: false,
            pointerId: event.pointerId,
            pointerType: event.pointerType,
            isPrimary: event.isPrimary,
            button: event.button,
            buttons: event.buttons,
            altKey: event.altKey,
            ctrlKey: event.ctrlKey,
            metaKey: event.metaKey,
            shiftKey: event.shiftKey,
            clientX: event.clientX,
            clientY: event.clientY,
            screenX: event.screenX,
            screenY: event.screenY,
            movementX: event.movementX,
            movementY: event.movementY,
            tiltX: event.tiltX,
            tiltY: event.tiltY,
            twist: event.twist,
            width: event.width,
            height: event.height,
            pressure: event.pressure,
            tangentialPressure: event.tangentialPressure,
            view: event.view,
            detail: event.detail,
            relatedTarget: event.relatedTarget,
          }) as ViewPointerEvent;
          leaveEvent.targetView = this;
          leaveEvent.relatedTargetView = event.relatedTargetView;
          this.handleEvent(leaveEvent);
        }
      }
    }
  }

  static fromConstructor(viewConstructor: ViewConstructor): View {
    if (viewConstructor.prototype instanceof View) {
      return new viewConstructor();
    } else {
      throw new TypeError("" + viewConstructor);
    }
  }

  static readonly uncullFlags: ViewFlags = View.uncullFlags | View.NeedsRender;
  static readonly insertChildFlags: ViewFlags = View.insertChildFlags | View.NeedsRender;
  static readonly removeChildFlags: ViewFlags = View.removeChildFlags | View.NeedsRender;

  // Forward type declarations
  /** @hidden */
  static Layer: typeof LayerView; // defined by LayerView
  /** @hidden */
  static Raster: typeof RasterView; // defined by RasterView
  /** @hidden */
  static Canvas: typeof CanvasView; // defined by CanvasView
}