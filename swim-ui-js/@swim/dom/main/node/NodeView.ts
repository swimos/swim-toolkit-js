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

import {BoxR2, Transform} from "@swim/math";
import type {ConstrainVariable, Constraint} from "@swim/constraint";
import type {Look, Feel, MoodVector} from "@swim/theme";
import {
  ViewContextType,
  ViewContext,
  ViewFlags,
  ViewInit,
  ViewConstructor,
  View,
  ViewObserverType,
  ViewService,
  LayoutAnchor,
  ModalManager,
  ViewScope,
  ViewAnimator,
  ViewBinding,
} from "@swim/view";
import type {NodeViewObserver} from "./NodeViewObserver";
import type {NodeViewController} from "./NodeViewController";
import type {TextViewConstructor, TextView} from "../text/TextView";
import type {ViewElement, ElementView} from "../element/ElementView";
import type {HtmlView} from "../html/HtmlView";
import type {StyleView} from "../html/StyleView";
import type {SvgView} from "../svg/SvgView";

export type ViewNodeType<V extends NodeView> = V extends {readonly node: infer N} ? N : never;

export interface ViewNode extends Node {
  view?: NodeView;
}

export interface NodeViewInit extends ViewInit {
  viewController?: NodeViewController;
  text?: string;
}

export interface NodeViewConstructor<V extends NodeView = NodeView> {
  new(node: ViewNodeType<V>): V;
  readonly prototype: V;
}

export class NodeView extends View {
  /** @hidden */
  _childViewMap?: {[key: string]: View | undefined};
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

  constructor(node: Node) {
    super();
    Object.defineProperty(this, "key", {
      value: void 0,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "node", {
      value: node,
      enumerable: true,
      configurable: true,
    });
    (node as ViewNode).view = this;
    this.initNode(node as ViewNodeType<this>);
  }

  initView(init: NodeViewInit): void {
    super.initView(init);
    if (init.text !== void 0) {
      this.text(init.text);
    }
  }

  protected initNode(node: ViewNodeType<this>): void {
    // hook
  }

  declare readonly node: Node;

  declare readonly viewController: NodeViewController | null;

  declare readonly viewObservers: ReadonlyArray<NodeViewObserver>;

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
    if (viewController !== void 0) {
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

  get parentView(): View | null {
    const parentNode: ViewNode | null = this.node.parentNode;
    if (parentNode !== null) {
      const parentView = parentNode.view;
      if (parentView instanceof View) {
        return parentView;
      }
    }
    return null;
  }

  /** @hidden */
  setParentView(newParentView: View | null, oldParentView: View | null): void {
    this.willSetParentView(newParentView, oldParentView);
    this.onSetParentView(newParentView, oldParentView);
    this.didSetParentView(newParentView, oldParentView);
  }

  remove(): void {
    const node = this.node;
    const parentNode: ViewNode | null = node.parentNode;
    if (parentNode !== null) {
      const parentView = parentNode.view;
      if (parentView !== void 0) {
        if ((this.viewFlags & View.TraversingFlag) === 0) {
          parentView.removeChildView(this);
        } else {
          this.setViewFlags(this.viewFlags | View.RemovingFlag);
        }
      } else {
        parentNode.removeChild(node);
        this.setParentView(null, this);
        this.setKey(void 0);
      }
    }
  }

  get childViewCount(): number {
    let childViewCount = 0;
    const childNodes = this.node.childNodes;
    for (let i = 0, n = childNodes.length; i < n; i += 1) {
      const childView = (childNodes[i]! as ViewNode).view;
      if (childView !== void 0) {
        childViewCount += 1;
      }
    }
    return childViewCount;
  }

  get childViews(): ReadonlyArray<View> {
    const childNodes = this.node.childNodes;
    const childViews = [];
    for (let i = 0, n = childNodes.length; i < n; i += 1) {
      const childView = (childNodes[i]! as ViewNode).view;
      if (childView !== void 0) {
        childViews.push(childView);
      }
    }
    return childViews;
  }

  firstChildView(): View | null {
    const childNodes = this.node.childNodes;
    for (let i = 0, n = childNodes.length; i < n; i += 1) {
      const childView = (childNodes[i]! as ViewNode).view;
      if (childView !== void 0) {
        return childView;
      }
    }
    return null;
  }

  lastChildView(): View | null {
    const childNodes = this.node.childNodes;
    for (let i = childNodes.length - 1; i >= 0; i -= 1) {
      const childView = (childNodes[i]! as ViewNode).view;
      if (childView !== void 0) {
        return childView;
      }
    }
    return null;
  }

  nextChildView(targetView: View): View | null {
    if (targetView instanceof NodeView && targetView.parentView === this) {
      let targetNode: ViewNode | null = targetView.node;
      do {
        targetNode = targetNode!.nextSibling;
        if (targetNode !== null) {
          if (targetNode.view !== void 0) {
            return targetNode.view;
          }
          continue;
        }
        break;
      } while (true);
    }
    return null;
  }

  previousChildView(targetView: View): View | null {
    if (targetView instanceof NodeView && targetView.parentView === this) {
      let targetNode: ViewNode | null = targetView.node;
      do {
        targetNode = targetNode!.previousSibling;
        if (targetNode !== null) {
          if (targetNode.view !== void 0) {
            return targetNode.view;
          }
          continue;
        }
        break;
      } while (true);
    }
    return null;
  }

  forEachChildView<T>(callback: (childView: View) => T | void): T | undefined;
  forEachChildView<T, S>(callback: (this: S, childView: View) => T | void,
                         thisArg: S): T | undefined;
  forEachChildView<T, S>(callback: (this: S | undefined, childView: View) => T | void,
                         thisArg?: S): T | undefined {
    let result: T | undefined;
    const childNodes = this.node.childNodes;
    let i = 0;
    while (i < childNodes.length) {
      const childNode = childNodes[i]! as ViewNode;
      const childView = childNode.view;
      if (childView !== void 0) {
        result = callback.call(thisArg, childView) as T | undefined;
        if (result !== void 0) {
          break;
        }
      }
      if (childNodes[i] === childNode) {
        i += 1;
      }
    }
    return result;
  }

  getChildView(key: string): View | null {
    const childViewMap = this._childViewMap;
    if (childViewMap !== void 0) {
      const childView = childViewMap[key];
      if (childView !== void 0) {
        return childView;
      }
    }
    return null;
  }

  setChildView(key: string, newChildView: View | null): View | null {
    let targetNode: Node | null = null;
    if (newChildView !== null) {
      if (!(newChildView instanceof NodeView)) {
        throw new TypeError("" + newChildView);
      }
      if (newChildView.parentView === this) {
        targetNode = newChildView.node.nextSibling;
      }
      newChildView.remove();
    }
    let oldChildView: View | null = null;
    const childViewMap = this._childViewMap;
    if (childViewMap !== void 0) {
      const childView = childViewMap[key];
      if (childView !== void 0) {
        oldChildView = childView;
        if (!(childView instanceof NodeView)) {
          throw new TypeError("" + childView);
        }
        const childNode = childView.node;
        targetNode = childNode.nextSibling;
        this.willRemoveChildView(childView);
        this.willRemoveChildNode(childNode);
        childView.setParentView(null, this);
        this.removeChildViewMap(childView);
        this.node.removeChild(childNode);
        this.onRemoveChildNode(childNode);
        this.onRemoveChildView(childView);
        this.didRemoveChildNode(childNode);
        this.didRemoveChildView(childView);
        childView.setKey(void 0);
      }
    }
    if (newChildView !== null) {
      const newChildNode = newChildView.node;
      const targetView = targetNode !== null ? (targetNode as ViewNode).view : null;
      newChildView.setKey(key);
      this.willInsertChildView(newChildView, targetView);
      this.willInsertChildNode(newChildNode, targetNode);
      this.node.insertBefore(newChildNode, targetNode);
      this.insertChildViewMap(newChildView);
      newChildView.setParentView(this, null);
      this.onInsertChildNode(newChildNode, targetNode);
      this.onInsertChildView(newChildView, targetView);
      this.didInsertChildNode(newChildNode, targetNode);
      this.didInsertChildView(newChildView, targetView);
      newChildView.cascadeInsert();
    }
    return oldChildView;
  }

  /** @hidden */
  protected insertChildViewMap(childView: View): void {
    const key = childView.key;
    if (key !== void 0) {
      let childViewMap = this._childViewMap;
      if (childViewMap === void 0) {
        childViewMap = {};
        this._childViewMap = childViewMap;
      }
      childViewMap[key] = childView;
    }
  }

  /** @hidden */
  protected removeChildViewMap(childView: View): void {
    const childViewMap = this._childViewMap;
    if (childViewMap !== void 0) {
      const key = childView.key;
      if (key !== void 0) {
        delete childViewMap[key];
      }
    }
  }

  appendChild(child: View | Node, key?: string): void {
    if (child instanceof View) {
      this.appendChildView(child, key);
    } else if (child instanceof Node) {
      this.appendChildNode(child, key);
    } else {
      throw new TypeError("" + child);
    }
  }

  appendChildView(childView: View, key?: string): void {
    if (!(childView instanceof NodeView)) {
      throw new TypeError("" + childView);
    }
    childView.remove();
    if (key !== void 0) {
      this.removeChildView(key);
      childView.setKey(key);
    }
    const childNode = childView.node;
    this.willInsertChildView(childView, null);
    this.willInsertChildNode(childNode, null);
    this.node.appendChild(childNode);
    this.insertChildViewMap(childView);
    childView.setParentView(this, null);
    this.onInsertChildNode(childNode, null);
    this.onInsertChildView(childView, null);
    this.didInsertChildNode(childNode, null);
    this.didInsertChildView(childView, null);
    childView.cascadeInsert();
  }

  appendChildNode(childNode: Node, key?: string): void {
    const childView = (childNode as ViewNode).view;
    if (childView !== void 0) {
      childView.remove();
      if (key !== void 0) {
        this.removeChildView(key);
        childView.setKey(key);
      }
      this.willInsertChildView(childView, null);
    }
    this.willInsertChildNode(childNode, null);
    this.node.appendChild(childNode);
    if (childView !== void 0) {
      this.insertChildViewMap(childView);
      childView.setParentView(this, null);
    }
    this.onInsertChildNode(childNode, null);
    if (childView !== void 0) {
      this.onInsertChildView(childView, null);
    }
    this.didInsertChildNode(childNode, null);
    if (childView !== void 0) {
      this.didInsertChildView(childView, null);
      childView.cascadeInsert();
    }
  }

  prependChild(child: View | Node, key?: string): void {
    if (child instanceof View) {
      this.prependChildView(child, key);
    } else if (child instanceof Node) {
      this.prependChildNode(child, key);
    } else {
      throw new TypeError("" + child);
    }
  }

  prependChildView(childView: View, key?: string): void {
    if (!(childView instanceof NodeView)) {
      throw new TypeError("" + childView);
    }
    childView.remove();
    if (key !== void 0) {
      this.removeChildView(key);
      childView.setKey(key);
    }
    const childNode = childView.node;
    const targetNode = this.node.firstChild as ViewNode | null;
    const targetView = targetNode !== null ? targetNode.view : null;
    this.willInsertChildView(childView, targetView);
    this.willInsertChildNode(childNode, targetNode);
    this.node.insertBefore(childNode, targetNode);
    this.insertChildViewMap(childView);
    childView.setParentView(this, null);
    this.onInsertChildNode(childNode, targetNode);
    this.onInsertChildView(childView, targetView);
    this.didInsertChildNode(childNode, targetNode);
    this.didInsertChildView(childView, targetView);
    childView.cascadeInsert();
  }

  prependChildNode(childNode: Node, key?: string): void {
    const childView = (childNode as ViewNode).view;
    const targetNode = this.node.firstChild as ViewNode | null;
    const targetView = targetNode !== null ? targetNode.view : null;
    if (childView !== void 0) {
      childView.remove();
      if (key !== void 0) {
        this.removeChildView(key);
        childView.setKey(key);
      }
      this.willInsertChildView(childView, targetView);
    }
    this.willInsertChildNode(childNode, targetNode);
    this.node.insertBefore(childNode, targetNode);
    if (childView !== void 0) {
      this.insertChildViewMap(childView);
      childView.setParentView(this, null);
    }
    this.onInsertChildNode(childNode, targetNode);
    if (childView !== void 0) {
      this.onInsertChildView(childView, targetView);
    }
    this.didInsertChildNode(childNode, targetNode);
    if (childView !== void 0) {
      this.didInsertChildView(childView, targetView);
      childView.cascadeInsert();
    }
  }

  insertChild(child: View | Node, target: View | Node | null, key?: string): void {
    if (child instanceof NodeView) {
      if (target instanceof View) {
        this.insertChildView(child, target, key);
      } else if (target instanceof Node || target === null) {
        this.insertChildNode(child.node, target, key);
      } else {
        throw new TypeError("" + target);
      }
    } else if (child instanceof Node) {
      if (target instanceof NodeView) {
        this.insertChildNode(child, target.node, key);
      } else if (target instanceof Node || target === null) {
        this.insertChildNode(child, target, key);
      } else {
        throw new TypeError("" + target);
      }
    } else {
      throw new TypeError("" + child);
    }
  }

  insertChildView(childView: View, targetView: View | null, key?: string): void {
    if (!(childView instanceof NodeView)) {
      throw new TypeError("" + childView);
    }
    if (targetView !== null && !(targetView instanceof NodeView)) {
      throw new TypeError("" + targetView);
    }
    childView.remove();
    if (key !== void 0) {
      this.removeChildView(key);
      childView.setKey(key);
    }
    const childNode = childView.node;
    const targetNode = targetView !== null ? targetView.node : null;
    this.willInsertChildView(childView, targetView);
    this.willInsertChildNode(childNode, targetNode);
    this.node.insertBefore(childNode, targetNode);
    this.insertChildViewMap(childView);
    childView.setParentView(this, null);
    this.onInsertChildNode(childNode, targetNode);
    this.onInsertChildView(childView, targetView);
    this.didInsertChildNode(childNode, targetNode);
    this.didInsertChildView(childView, targetView);
    childView.cascadeInsert();
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    this.insertViewBinding(childView);
  }

  insertChildNode(childNode: Node, targetNode: Node | null, key?: string): void {
    const childView = (childNode as ViewNode).view;
    const targetView = targetNode !== null ? (targetNode as ViewNode).view : null;
    if (childView !== void 0) {
      childView.remove();
      if (key !== void 0) {
        this.removeChildView(key);
        childView.setKey(key);
      }
      this.willInsertChildView(childView, targetView);
    }
    this.willInsertChildNode(childNode, targetNode);
    this.node.insertBefore(childNode, targetNode);
    if (childView !== void 0) {
      this.insertChildViewMap(childView);
      childView.setParentView(this, null);
    }
    this.onInsertChildNode(childNode, targetNode);
    if (childView !== void 0) {
      this.onInsertChildView(childView, targetView);
    }
    this.didInsertChildNode(childNode, targetNode);
    if (childView !== void 0) {
      this.didInsertChildView(childView, targetView);
      childView.cascadeInsert();
    }
  }

  /** @hidden */
  injectChildView(childView: NodeView, targetView: NodeView | null, key?: string): void {
    if (key !== void 0) {
      this.removeChildView(key);
      childView.setKey(key);
    }
    const childNode = childView.node;
    const targetNode = targetView !== null ? targetView.node : null;
    this.willInsertChildView(childView, targetView);
    this.willInsertChildNode(childNode, targetNode);
    this.insertChildViewMap(childView);
    childView.setParentView(this, null);
    this.onInsertChildNode(childNode, targetNode);
    this.onInsertChildView(childView, targetView);
    this.didInsertChildNode(childNode, targetNode);
    this.didInsertChildView(childView, targetView);
    childView.cascadeInsert();
  }

  protected willInsertChildNode(childNode: Node, targetNode: Node | null): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewWillInsertChildNode !== void 0) {
      viewController.viewWillInsertChildNode(childNode, targetNode, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillInsertChildNode !== void 0) {
        viewObserver.viewWillInsertChildNode(childNode, targetNode, this);
      }
    }
  }

  protected onInsertChildNode(childNode: Node, targetNode: Node | null): void {
    this.requireUpdate(View.NeedsLayout);
  }

  protected didInsertChildNode(childNode: Node, targetNode: Node | null): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidInsertChildNode !== void 0) {
        viewObserver.viewDidInsertChildNode(childNode, targetNode, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewDidInsertChildNode !== void 0) {
      viewController.viewDidInsertChildNode(childNode, targetNode, this);
    }
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
      updateFlags |= this.viewFlags & View.UpdateMask;
      if ((updateFlags & View.DisplayMask) !== 0) {
        if (viewContext === void 0) {
          viewContext = this.superViewContext;
        }
        this.cascadeDisplay(updateFlags, viewContext);
      }
    }
  }

  removeChild(child: View | Node): void {
    if (child instanceof View) {
      this.removeChildView(child);
    } else if (child instanceof Node) {
      this.removeChildNode(child);
    } else {
      throw new TypeError("" + child);
    }
  }

  removeChildView(key: string): View | null;
  removeChildView(childView: View): void;
  removeChildView(key: string | View): View | null | void {
    let childView: View | null;
    if (typeof key === "string") {
      childView = this.getChildView(key);
      if (childView === null) {
        return null;
      }
    } else {
      childView = key;
    }
    if (!(childView instanceof NodeView)) {
      throw new TypeError("" + childView);
    }
    const childNode = childView.node;
    if (childNode.parentNode !== this.node) {
      throw new Error("not a child view");
    }
    this.willRemoveChildView(childView);
    this.willRemoveChildNode(childNode);
    childView.setParentView(null, this);
    this.removeChildViewMap(childView);
    this.node.removeChild(childNode);
    this.onRemoveChildNode(childNode);
    this.onRemoveChildView(childView);
    this.didRemoveChildNode(childNode);
    this.didRemoveChildView(childView);
    childView.setKey(void 0);
    if (typeof key === "string") {
      return childView;
    }
  }

  protected onRemoveChildView(childView: View): void {
    super.onRemoveChildView(childView);
    this.removeViewBinding(childView);
  }

  removeChildNode(childNode: Node): void {
    if (childNode.parentNode !== this.node) {
      throw new Error("not a child node")
    }
    const childView = (childNode as ViewNode).view;
    if (childView !== void 0) {
      this.willRemoveChildView(childView);
    }
    this.willRemoveChildNode(childNode);
    this.node.removeChild(childNode);
    if (childView !== void 0) {
      childView.setParentView(null, this);
      this.removeChildViewMap(childView);
    }
    this.onRemoveChildNode(childNode);
    if (childView !== void 0) {
      this.onRemoveChildView(childView);
    }
    this.didRemoveChildNode(childNode);
    if (childView !== void 0) {
      this.didRemoveChildView(childView);
      childView.setKey(void 0);
    }
  }

  removeAll(): void {
    do {
      const childNode = this.node.lastChild as ViewNode | null;
      if (childNode !== null) {
        const childView = childNode.view;
        if (childView !== void 0) {
          this.willRemoveChildView(childView);
        }
        this.willRemoveChildNode(childNode);
        this.node.removeChild(childNode);
        if (childView !== void 0) {
          childView.setParentView(null, this);
          this.removeChildViewMap(childView);
        }
        this.onRemoveChildNode(childNode);
        if (childView !== void 0) {
          this.onRemoveChildView(childView);
        }
        this.didRemoveChildNode(childNode);
        if (childView !== void 0) {
          this.didRemoveChildView(childView);
          childView.setKey(void 0);
        }
        continue;
      }
      break;
    } while (true);
  }

  protected willRemoveChildNode(childNode: Node): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewWillRemoveChildNode !== void 0) {
      viewController.viewWillRemoveChildNode(childNode, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillRemoveChildNode !== void 0) {
        viewObserver.viewWillRemoveChildNode(childNode, this);
      }
    }
  }

  protected onRemoveChildNode(childNode: Node): void {
    this.requireUpdate(View.NeedsLayout);
  }

  protected didRemoveChildNode(childNode: Node): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewDidRemoveChildNode !== void 0) {
        viewObserver.viewDidRemoveChildNode(childNode, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewDidRemoveChildNode !== void 0) {
      viewController.viewDidRemoveChildNode(childNode, this);
    }
  }

  text(): string | null;
  text(value: string | null): this;
  text(value?: string | null): string | null | this {
    if (value === void 0) {
      return this.node.textContent;
    } else {
      this.node.textContent = value;
      return this;
    }
  }

  /** @hidden */
  static isRootView(node: Node): boolean {
    do {
      const parentNode: ViewNode | null = node.parentNode;
      if (parentNode !== null) {
        const parentView = parentNode.view;
        if (parentView instanceof View) {
          return false;
        }
        node = parentNode;
        continue;
      }
      break;
    } while (true);
    return true;
  }

  /** @hidden */
  static isNodeMounted(node: Node): boolean {
    let isConnected: boolean | undefined = node.isConnected;
    if (typeof isConnected !== "boolean") {
      const ownerDocument = node.ownerDocument;
      if (ownerDocument !== null) {
        const position = ownerDocument.compareDocumentPosition(node);
        isConnected = (position & node.DOCUMENT_POSITION_DISCONNECTED) === 0;
      } else {
        isConnected = false;
      }
    }
    return isConnected;
  }

  mount(): void {
    if (!this.isMounted() && NodeView.isNodeMounted(this.node) && NodeView.isRootView(this.node)) {
      this.cascadeMount();
      if (!this.isPowered() && document.visibilityState === "visible") {
        this.cascadePower();
      }
      this.cascadeInsert();
    }
  }

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
    const childNodes = this.node.childNodes;
    let i = 0;
    while (i < childNodes.length) {
      const childView = (childNodes[i]! as ViewNode).view;
      if (childView !== void 0) {
        childView.cascadeMount();
        if ((childView.viewFlags & View.RemovingFlag) !== 0) {
          childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
          this.removeChildView(childView);
          continue;
        }
      }
      i += 1;
    }
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
    const childNodes = this.node.childNodes;
    let i = 0;
    while (i < childNodes.length) {
      const childView = (childNodes[i]! as ViewNode).view;
      if (childView !== void 0) {
        childView.cascadeUnmount();
        if ((childView.viewFlags & View.RemovingFlag) !== 0) {
          childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
          this.removeChildView(childView);
          continue;
        }
      }
      i += 1;
    }
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
    const childNodes = this.node.childNodes;
    let i = 0;
    while (i < childNodes.length) {
      const childView = (childNodes[i]! as ViewNode).view;
      if (childView !== void 0) {
        childView.cascadePower();
        if ((childView.viewFlags & View.RemovingFlag) !== 0) {
          childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
          this.removeChildView(childView);
          continue;
        }
      }
      i += 1;
    }
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
    const childNodes = this.node.childNodes;
    let i = 0;
    while (i < childNodes.length) {
      const childView = (childNodes[i]! as ViewNode).view;
      if (childView !== void 0) {
        childView.cascadeUnpower();
        if ((childView.viewFlags & View.RemovingFlag) !== 0) {
          childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
          this.removeChildView(childView);
          continue;
        }
      }
      i += 1;
    }
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
    const childNodes = this.node.childNodes;
    let i = 0;
    while (i < childNodes.length) {
      const childView = (childNodes[i]! as ViewNode).view;
      if (childView !== void 0) {
        childView.cascadeCull();
        if ((childView.viewFlags & View.RemovingFlag) !== 0) {
          childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
          this.removeChildView(childView);
          continue;
        }
      }
      i += 1;
    }
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
    const childNodes = this.node.childNodes;
    let i = 0;
    while (i < childNodes.length) {
      const childView = (childNodes[i]! as ViewNode).view;
      if (childView !== void 0) {
        childView.cascadeUncull();
        if ((childView.viewFlags & View.RemovingFlag) !== 0) {
          childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
          this.removeChildView(childView);
          continue;
        }
      }
      i += 1;
    }
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
    if ((processFlags & View.ProcessMask) !== 0 && this.node.childNodes.length !== 0) {
      this.willProcessChildViews(processFlags, viewContext);
      this.onProcessChildViews(processFlags, viewContext);
      this.didProcessChildViews(processFlags, viewContext);
    }
  }

  protected processChildViews(processFlags: ViewFlags, viewContext: ViewContextType<this>,
                              processChildView: (this: this, childView: View, processFlags: ViewFlags,
                                                 viewContext: ViewContextType<this>) => void): void {
    const childNodes = this.node.childNodes;
    let i = 0;
    while (i < childNodes.length) {
      const childView = (childNodes[i]! as ViewNode).view;
      if (childView !== void 0) {
        processChildView.call(this, childView, processFlags, viewContext);
        if ((childView.viewFlags & View.RemovingFlag) !== 0) {
          childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
          this.removeChildView(childView);
          continue;
        }
      }
      i += 1;
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
    this.setViewFlags(this.viewFlags & ~(View.NeedsDisplay | View.NeedsRender | View.NeedsComposite)
                                     |  (View.TraversingFlag | View.DisplayingFlag));
    try {
      this.willDisplay(cascadeFlags, viewContext);
      if (((this.viewFlags | displayFlags) & View.NeedsLayout) !== 0) {
        this.willLayout(viewContext);
        cascadeFlags |= View.NeedsLayout;
        this.setViewFlags(this.viewFlags & ~View.NeedsLayout);
      }

      this.onDisplay(cascadeFlags, viewContext);
      if ((cascadeFlags & View.NeedsLayout) !== 0) {
        this.onLayout(viewContext);
      }

      this.doDisplayChildViews(cascadeFlags, viewContext);

      if ((cascadeFlags & View.NeedsLayout) !== 0) {
        this.didLayout(viewContext);
      }
      this.didDisplay(cascadeFlags, viewContext);
    } finally {
      this.setViewFlags(this.viewFlags & ~(View.TraversingFlag | View.DisplayingFlag));
    }
  }

  /** @hidden */
  protected doDisplayChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    if ((displayFlags & View.DisplayMask) !== 0 && this.node.childNodes.length !== 0
        && !this.isCulled()) {
      this.willDisplayChildViews(displayFlags, viewContext);
      this.onDisplayChildViews(displayFlags, viewContext);
      this.didDisplayChildViews(displayFlags, viewContext);
    }
  }

  protected displayChildViews(displayFlags: ViewFlags, viewContext: ViewContextType<this>,
                              displayChildView: (this: this, childView: View, displayFlags: ViewFlags,
                                                 viewContext: ViewContextType<this>) => void): void {
    const childNodes = this.node.childNodes;
    let i = 0;
    while (i < childNodes.length) {
      const childView = (childNodes[i]! as ViewNode).view;
      if (childView !== void 0) {
        displayChildView.call(this, childView, displayFlags, viewContext);
        if ((childView.viewFlags & View.RemovingFlag) !== 0) {
          childView.setViewFlags(childView.viewFlags & ~View.RemovingFlag);
          this.removeChildView(childView);
          continue;
        }
      }
      i += 1;
    }
  }

  getLook<T>(look: Look<T, unknown>, mood?: MoodVector<Feel>): T | undefined {
    return void 0;
  }

  getLookOr<T, V>(look: Look<T, unknown>, elseValue: V, mood?: MoodVector<Feel>): T | V {
    return elseValue;
  }

  modifyMood(feel: Feel, ...entries: [Feel, number | undefined][]): void {
    // nop
  }

  modifyTheme(feel: Feel, ...entries: [Feel, number | undefined][]): void {
    // nop
  }

  /** @hidden */
  protected mountTheme(): void {
    // hook
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

  get parentTransform(): Transform {
    return Transform.identity();
  }

  get clientBounds(): BoxR2 {
    const range = document.createRange();
    range.selectNode(this.node);
    const bounds = range.getBoundingClientRect();
    range.detach();
    return new BoxR2(bounds.left, bounds.top, bounds.right, bounds.bottom);
  }

  get pageBounds(): BoxR2 {
    const range = document.createRange();
    range.selectNode(this.node);
    const bounds = range.getBoundingClientRect();
    range.detach();
    const scrollX = window.pageXOffset;
    const scrollY = window.pageYOffset;
    return new BoxR2(bounds.left + scrollX, bounds.top + scrollY,
                     bounds.right + scrollX, bounds.bottom + scrollY);
  }

  dispatchEvent(event: Event): boolean {
    return this.node.dispatchEvent(event);
  }

  on(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): this {
    this.node.addEventListener(type, listener, options);
    return this;
  }

  off(type: string, listener: EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): this {
    this.node.removeEventListener(type, listener, options);
    return this;
  }

  /** @hidden */
  static mount(view: NodeView): void {
    const parentView = view.parentView;
    if (parentView !== null) {
      view.setParentView(parentView, null);
      view.cascadeInsert();
    } else {
      view.mount();
    }
  }

  static fromNode(node: ViewNode): NodeView {
    if (node.view instanceof this) {
      return node.view;
    } else if (node instanceof Element) {
      return NodeView.Element.fromNode(node as ViewElement);
    } else if (node instanceof Text) {
      return NodeView.Text.fromNode(node);
    } else {
      const view = new NodeView(node);
      this.mount(view);
      return view;
    }
  }

  static fromConstructor<V extends NodeView>(viewConstructor: NodeViewConstructor<V>): V;
  static fromConstructor<V extends View>(viewConstructor: ViewConstructor): V;
  static fromConstructor(viewConstructor: NodeViewConstructor | ViewConstructor): View;
  static fromConstructor(viewConstructor: NodeViewConstructor | ViewConstructor): View {
    if (viewConstructor.prototype instanceof NodeView.Element) {
      return NodeView.Element.fromConstructor(viewConstructor as NodeViewConstructor);
    } else if (viewConstructor.prototype instanceof NodeView.Text) {
      return NodeView.Text.fromConstructor(viewConstructor as unknown as TextViewConstructor);
    } else if (viewConstructor.prototype instanceof View) {
      return new (viewConstructor as ViewConstructor)();
    } else {
      throw new TypeError("" + viewConstructor);
    }
  }

  static fromAny(value: NodeView | Node): NodeView {
    if (value instanceof NodeView) {
      return value;
    } else if (value instanceof Node) {
      return this.fromNode(value);
    }
    throw new TypeError("" + value);
  }

  // Forward type declarations
  /** @hidden */
  static Text: typeof TextView; // defined by TextView
  /** @hidden */
  static Element: typeof ElementView; // defined by ElementView
  /** @hidden */
  static Html: typeof HtmlView; // defined by HtmlView
  /** @hidden */
  static Style: typeof StyleView; // defined by StyleView
  /** @hidden */
  static Svg: typeof SvgView; // defined by SvgView
}

ModalManager.insertModalView = function (modalView: View): void {
  const matteNode = document.body as ViewNode;
  const matteView = matteNode.view;
  if (matteView !== void 0) {
    matteView.appendChildView(modalView);
  } else if (modalView instanceof NodeView) {
    matteNode.appendChild(modalView.node);
    modalView.mount();
  } else {
    throw new TypeError("" + modalView);
  }
};
