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
import {BoxR2} from "@swim/math";
import type {Animator} from "@swim/animation";
import {Look, Feel, MoodVector, MoodMatrix, ThemeMatrix} from "@swim/theme";
import {ToAttributeString, ToStyleString, ToCssValue} from "@swim/style";
import {ViewContextType, ViewConstructor, View, ViewObserverType, ViewScope} from "@swim/view";
import type {StyleContext} from "../css/StyleContext";
import {StyleAnimator} from "../style/StyleAnimator";
import {NodeViewInit, NodeViewConstructor, NodeView} from "../node/NodeView";
import {AttributeAnimatorConstructor, AttributeAnimator} from "../attribute/AttributeAnimator";
import type {
  ElementViewObserver,
  WillSetAttributeObserver,
  DidSetAttributeObserver,
  WillSetStyleObserver,
  DidSetStyleObserver,
} from "./ElementViewObserver";
import type {ElementViewController} from "./ElementViewController";

export interface ViewElement extends Element, ElementCSSInlineStyle {
  view?: ElementView;
}

export interface ElementViewInit extends NodeViewInit {
  viewController?: ElementViewController;
  id?: string;
  classList?: string[];
  mood?: MoodVector;
  moodModifier?: MoodMatrix;
  theme?: ThemeMatrix;
  themeModifier?: MoodMatrix;
}

export interface ElementViewConstructor<V extends ElementView = ElementView> extends NodeViewConstructor<V> {
  readonly tag: string;
  readonly namespace?: string;
}

export class ElementView extends NodeView implements StyleContext {
  /** @hidden */
  _attributeAnimators?: {[animatorName: string]: AttributeAnimator<ElementView, unknown> | undefined};
  /** @hidden */
  _styleAnimators?: {[animatorName: string]: StyleAnimator<ElementView, unknown> | undefined};
  /** @hidden */
  _willSetAttributeObservers?: ReadonlyArray<WillSetAttributeObserver>;
  /** @hidden */
  _didSetAttributeObservers?: ReadonlyArray<DidSetAttributeObserver>;
  /** @hidden */
  _willSetStyleObservers?: ReadonlyArray<WillSetStyleObserver>;
  /** @hidden */
  _didSetStyleObservers?: ReadonlyArray<DidSetStyleObserver>;

  constructor(node: Element) {
    super(node);
  }

  declare readonly node: Element & ElementCSSInlineStyle;

  declare readonly viewController: ElementViewController | null;

  declare readonly viewObservers: ReadonlyArray<ElementViewObserver>;

  initView(init: ElementViewInit): void {
    super.initView(init);
    if (init.id !== void 0) {
      this.id(init.id);
    }
    if (init.classList !== void 0) {
      this.addClass(...init.classList);
    }
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
  }

  protected onAddViewObserver(viewObserver: ViewObserverType<this>): void {
    super.onAddViewObserver(viewObserver);
    if (viewObserver.viewWillSetAttribute !== void 0) {
      this._willSetAttributeObservers = Arrays.inserted(viewObserver as WillSetAttributeObserver, this._willSetAttributeObservers);
    }
    if (viewObserver.viewDidSetAttribute !== void 0) {
      this._didSetAttributeObservers = Arrays.inserted(viewObserver as DidSetAttributeObserver, this._didSetAttributeObservers);
    }
    if (viewObserver.viewWillSetStyle !== void 0) {
      this._willSetStyleObservers = Arrays.inserted(viewObserver as WillSetStyleObserver, this._willSetStyleObservers);
    }
    if (viewObserver.viewDidSetStyle !== void 0) {
      this._didSetStyleObservers = Arrays.inserted(viewObserver as DidSetStyleObserver, this._didSetStyleObservers);
    }
  }

  protected onRemoveViewObserver(viewObserver: ViewObserverType<this>): void {
    super.onRemoveViewObserver(viewObserver);
    if (viewObserver.viewWillSetAttribute !== void 0) {
      this._willSetAttributeObservers = Arrays.removed(viewObserver as WillSetAttributeObserver, this._willSetAttributeObservers);
    }
    if (viewObserver.viewDidSetAttribute !== void 0) {
      this._didSetAttributeObservers = Arrays.removed(viewObserver as DidSetAttributeObserver, this._didSetAttributeObservers);
    }
    if (viewObserver.viewWillSetStyle !== void 0) {
      this._willSetStyleObservers = Arrays.removed(viewObserver as WillSetStyleObserver, this._willSetStyleObservers);
    }
    if (viewObserver.viewDidSetStyle !== void 0) {
      this._didSetStyleObservers = Arrays.removed(viewObserver as DidSetStyleObserver, this._didSetStyleObservers);
    }
  }

  protected onChange(viewContext: ViewContextType<this>): void {
    super.onChange(viewContext);
    this.updateTheme();
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
    if (NodeView.isRootView(this.node)) {
      const themeManager = this.themeService.manager;
      if (themeManager !== void 0) {
        if (this.mood.isAuto() && this.mood.state === void 0) {
          this.mood.setAutoState(themeManager.mood);
        }
        if (this.theme.isAuto() && this.theme.state === void 0) {
          this.theme.setAutoState(themeManager.theme);
        }
      }
    }
  }

  getAttribute(attributeName: string): string | null {
    return this.node.getAttribute(attributeName);
  }

  setAttribute(attributeName: string, value: unknown): this {
    this.willSetAttribute(attributeName, value);
    if (value !== void 0) {
      this.node.setAttribute(attributeName, ToAttributeString(value));
    } else {
      this.node.removeAttribute(attributeName);
    }
    this.onSetAttribute(attributeName, value);
    this.didSetAttribute(attributeName, value);
    return this;
  }

  protected willSetAttribute(attributeName: string, value: unknown): void {
    const viewController = this.viewController;
    if (viewController !== null) {
      viewController.viewWillSetAttribute(attributeName, value, this);
    }
    const viewObservers = this._willSetAttributeObservers;
    if (viewObservers !== void 0) {
      for (let i = 0, n = viewObservers.length; i < n; i += 1) {
        const viewObserver = viewObservers[i]!;
        viewObserver.viewWillSetAttribute(attributeName, value, this);
      }
    }
  }

  protected onSetAttribute(attributeName: string, value: unknown): void {
    // hook
  }

  protected didSetAttribute(attributeName: string, value: unknown): void {
    const viewObservers = this._didSetAttributeObservers;
    if (viewObservers !== void 0) {
      for (let i = 0, n = viewObservers.length; i < n; i += 1) {
        const viewObserver = viewObservers[i]!;
        viewObserver.viewDidSetAttribute(attributeName, value, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null) {
      viewController.viewDidSetAttribute(attributeName, value, this);
    }
  }

  hasAttributeAnimator(animatorName: string): boolean {
    const attributeAnimators = this._attributeAnimators;
    return attributeAnimators !== void 0 && attributeAnimators[animatorName] !== void 0;
  }

  getAttributeAnimator(animatorName: string): AttributeAnimator<this, unknown> | null {
    const attributeAnimators = this._attributeAnimators;
    if (attributeAnimators !== void 0) {
      const attributeAnimator = attributeAnimators[animatorName];
      if (attributeAnimator !== void 0) {
        return attributeAnimator as AttributeAnimator<this, unknown>;
      }
    }
    return null;
  }

  setAttributeAnimator(animatorName: string, attributeAnimator: AttributeAnimator<this, unknown> | null): void {
    let attributeAnimators = this._attributeAnimators;
    if (attributeAnimators === void 0) {
      attributeAnimators = {};
      this._attributeAnimators = attributeAnimators;
    }
    if (attributeAnimator !== null) {
      attributeAnimators[animatorName] = attributeAnimator;
    } else {
      delete attributeAnimators[animatorName];
    }
  }

  getStyle(propertyNames: string | ReadonlyArray<string>): CSSStyleValue | string | undefined {
    // Conditionally overridden when CSS Typed OM is available.
    const style = this.node.style;
    if (typeof propertyNames === "string") {
      return style.getPropertyValue(propertyNames);
    } else {
      for (let i = 0, n = propertyNames.length; i < n; i += 1) {
        const value = style.getPropertyValue(propertyNames[i]!);
        if (value !== "") {
          return value;
        }
      }
      return "";
    }
  }

  setStyle(propertyName: string, value: unknown, priority?: string): this {
    // Conditionally overridden when CSS Typed OM is available.
    this.willSetStyle(propertyName, value, priority);
    if (value !== void 0) {
      this.node.style.setProperty(propertyName, ToStyleString(value), priority);
    } else {
      this.node.style.removeProperty(propertyName);
    }
    this.onSetStyle(propertyName, value, priority);
    this.didSetStyle(propertyName, value, priority);
    return this;
  }

  protected willSetStyle(propertyName: string, value: unknown, priority: string | undefined): void {
    const viewController = this.viewController;
    if (viewController !== null) {
      viewController.viewWillSetStyle(propertyName, value, priority, this);
    }
    const viewObservers = this._willSetStyleObservers;
    if (viewObservers !== void 0) {
      for (let i = 0, n = viewObservers.length; i < n; i += 1) {
        const viewObserver = viewObservers[i]!;
        viewObserver.viewWillSetStyle(propertyName, value, priority, this);
      }
    }
  }

  protected onSetStyle(propertyName: string, value: unknown, priority: string | undefined): void {
    // hook
  }

  protected didSetStyle(propertyName: string, value: unknown, priority: string | undefined): void {
    const viewObservers = this._didSetStyleObservers;
    if (viewObservers !== void 0) {
      for (let i = 0, n = viewObservers.length; i < n; i += 1) {
        const viewObserver = viewObservers[i]!;
        viewObserver.viewDidSetStyle(propertyName, value, priority, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null) {
      viewController.viewDidSetStyle(propertyName, value, priority, this);
    }
  }

  hasStyleAnimator(animatorName: string): boolean {
    const styleAnimators = this._styleAnimators;
    return styleAnimators !== void 0 && styleAnimators[animatorName] !== void 0;
  }

  getStyleAnimator(animatorName: string): StyleAnimator<this, unknown> | null {
    const styleAnimators = this._styleAnimators;
    if (styleAnimators !== void 0) {
      const styleAnimator = styleAnimators[animatorName];
      if (styleAnimator !== void 0) {
        return styleAnimator as StyleAnimator<this, unknown>;
      }
    }
    return null;
  }

  setStyleAnimator(animatorName: string, animator: StyleAnimator<this, unknown> | null): void {
    let styleAnimators = this._styleAnimators;
    if (styleAnimators === void 0) {
      styleAnimators = {};
      this._styleAnimators = styleAnimators;
    }
    if (animator !== null) {
      styleAnimators[animatorName] = animator;
    } else {
      delete styleAnimators[animatorName];
    }
  }

  /** @hidden */
  animate(animator: Animator): void {
    super.animate(animator);
    if (animator instanceof AttributeAnimator || animator instanceof StyleAnimator) {
      this.setViewFlags(this.viewFlags | View.AnimatingFlag);
    }
  }

  /** @hidden */
  updateAnimators(t: number): void {
    this.updateViewAnimators(t);
    if ((this.viewFlags & View.AnimatingFlag) !== 0) {
      this.setViewFlags(this.viewFlags & ~View.AnimatingFlag);
      this.updateAttributeAnimators(t);
      this.updateStyleAnimators(t);
    }
  }

  /** @hidden */
  updateAttributeAnimators(t: number): void {
    const attributeAnimators = this._attributeAnimators;
    if (attributeAnimators !== void 0) {
      for (const animatorName in attributeAnimators) {
        const attributeAnimator = attributeAnimators[animatorName]!;
        attributeAnimator.onAnimate(t);
      }
    }
  }

  /** @hidden */
  updateStyleAnimators(t: number): void {
    const styleAnimators = this._styleAnimators;
    if (styleAnimators !== void 0) {
      for (const animatorName in styleAnimators) {
        const styleAnimator = styleAnimators[animatorName]!;
        styleAnimator.onAnimate(t);
      }
    }
  }

  id(): string | null;
  id(value: string | null): this;
  id(value?: string | null): string | null | this {
    if (value === void 0) {
      return this.getAttribute("id");
    } else {
      this.setAttribute("id", value);
      return this;
    }
  }

  className(): string | null;
  className(value: string | null): this;
  className(value?: string | null): string | null | this {
    if (value === void 0) {
      return this.getAttribute("class");
    } else {
      this.setAttribute("class", value);
      return this;
    }
  }

  get classList(): DOMTokenList {
    return this.node.classList;
  }

  hasClass(className: string): boolean {
    return this.node.classList.contains(className);
  }

  addClass(...classNames: string[]): this {
    const classList = this.node.classList;
    for (let i = 0, n = classNames.length; i < n; i += 1) {
      classList.add(classNames[i]!);
    }
    return this;
  }

  removeClass(...classNames: string[]): this {
    const classList = this.node.classList;
    for (let i = 0, n = classNames.length; i < n; i += 1) {
      classList.remove(classNames[i]!);
    }
    return this;
  }

  toggleClass(className: string, state?: boolean): this {
    const classList = this.node.classList;
    if (state === void 0) {
      classList.toggle(className);
    } else if (state === true) {
      classList.add(className);
    } else if (state === false) {
      classList.remove(className);
    }
    return this;
  }

  get clientBounds(): BoxR2 {
    const bounds = this.node.getBoundingClientRect();
    return new BoxR2(bounds.left, bounds.top, bounds.right, bounds.bottom);
  }

  get pageBounds(): BoxR2 {
    const bounds = this.node.getBoundingClientRect();
    const scrollX = window.pageXOffset;
    const scrollY = window.pageYOffset;
    return new BoxR2(bounds.left + scrollX, bounds.top + scrollY,
                     bounds.right + scrollX, bounds.bottom + scrollY);
  }

  on<T extends keyof ElementEventMap>(type: T, listener: (this: Element, event: ElementEventMap[T]) => unknown,
                                      options?: AddEventListenerOptions | boolean): this;
  on(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): this;
  on(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): this {
    this.node.addEventListener(type, listener, options);
    return this;
  }

  off<T extends keyof ElementEventMap>(type: T, listener: (this: Element, event: ElementEventMap[T]) => unknown,
                                       options?: EventListenerOptions | boolean): this;
  off(type: string, listener: EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): this;
  off(type: string, listener: EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): this {
    this.node.removeEventListener(type, listener, options);
    return this;
  }

  /** @hidden */
  static readonly tags: {[tag: string]: ElementViewConstructor<any> | undefined} = {};

  /** @hidden */
  static readonly tag?: string;

  /** @hidden */
  static readonly namespace?: string;

  static fromTag(tag: string): ElementView {
    let viewConstructor: ElementViewConstructor | undefined;
    if (this.hasOwnProperty("tags")) {
      viewConstructor = this.tags[tag];
    }
    if (viewConstructor === void 0) {
      viewConstructor = this as ElementViewConstructor;
    }
    let node: Element;
    const namespace = viewConstructor.namespace;
    if (namespace !== void 0) {
      node = document.createElementNS(namespace, tag);
    } else {
      node = document.createElement(tag);
    }
    return new viewConstructor(node as Element & ElementCSSInlineStyle);
  }

  static fromNode(node: ViewElement): ElementView {
    if (node.view instanceof this) {
      return node.view;
    } else {
      let viewConstructor: ElementViewConstructor | undefined;
      if (this.hasOwnProperty("tags")) {
        viewConstructor = this.tags[node.tagName];
      }
      if (viewConstructor === void 0) {
        viewConstructor = this as ElementViewConstructor;
      }
      const view = new viewConstructor(node);
      this.mount(view);
      return view;
    }
  }

  static fromConstructor<V extends NodeView>(viewConstructor: NodeViewConstructor<V>): V;
  static fromConstructor<V extends View>(viewConstructor: ViewConstructor<V>): V;
  static fromConstructor(viewConstructor: NodeViewConstructor | ViewConstructor): View;
  static fromConstructor(viewConstructor: NodeViewConstructor | ViewConstructor): View {
    if (viewConstructor.prototype instanceof ElementView) {
      let node: Element;
      const tag = (viewConstructor as unknown as ElementViewConstructor).tag;
      if (typeof tag === "string") {
        const namespace = (viewConstructor as unknown as ElementViewConstructor).namespace;
        if (namespace !== void 0) {
          node = document.createElementNS(namespace, tag);
        } else {
          node = document.createElement(tag);
        }
        return new viewConstructor(node);
      } else {
        throw new TypeError("" + viewConstructor);
      }
    } else {
      return super.fromConstructor(viewConstructor);
    }
  }

  static fromAny(value: ElementView | Element): ElementView {
    if (value instanceof ElementView) {
      return value;
    } else if (value instanceof Element) {
      return this.fromNode(value as ViewElement);
    }
    throw new TypeError("" + value);
  }

  /** @hidden */
  static decorateAttributeAnimator(constructor: AttributeAnimatorConstructor<ElementView, unknown>,
                                   target: Object, propertyKey: string | symbol): void {
    Object.defineProperty(target, propertyKey, {
      get: function (this: ElementView): AttributeAnimator<ElementView, unknown> {
        let animator = this.getAttributeAnimator(propertyKey.toString());
        if (animator === null) {
          animator = new constructor(this, propertyKey.toString());
          this.setAttributeAnimator(propertyKey.toString(), animator);
        }
        return animator;
      },
      configurable: true,
      enumerable: true,
    });
  }
}
if (typeof CSSStyleValue !== "undefined") { // CSS Typed OM support
  ElementView.prototype.getStyle = function (this: ElementView, propertyNames: string | ReadonlyArray<string>): CSSStyleValue | string | undefined {
    const style = this.node.attributeStyleMap;
    if (typeof propertyNames === "string") {
      return style.get(propertyNames);
    } else {
      for (let i = 0, n = propertyNames.length; i < n; i += 1) {
        const value = style.get(propertyNames[i]!);
        if (value !== "") {
          return value;
        }
      }
      return "";
    }
  };
  ElementView.prototype.setStyle = function (this: ElementView, propertyName: string,
                                             value: unknown, priority?: string): ElementView {
    this.willSetStyle(propertyName, value, priority);
    if (value !== void 0) {
      const cssValue = ToCssValue(value);
      if (cssValue !== void 0) {
        try {
          this.node.attributeStyleMap.set(propertyName, cssValue);
        } catch (e) {
          // swallow
        }
      } else {
        this.node.style.setProperty(propertyName, ToStyleString(value), priority);
      }
    } else {
      this.node.attributeStyleMap.delete(propertyName);
    }
    this.onSetStyle(propertyName, value, priority);
    this.didSetStyle(propertyName, value, priority);
    return this;
  };
}
NodeView.Element = ElementView;
