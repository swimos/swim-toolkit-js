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
import {AnyTiming, Timing} from "@swim/mapping";
import {BoxR2} from "@swim/math";
import {Look, Feel, MoodVector, MoodMatrix, ThemeMatrix} from "@swim/theme";
import {ToAttributeString, ToStyleString, ToCssValue} from "@swim/style";
import {ViewContextType, ViewConstructor, View, ViewObserverType, ViewProperty} from "@swim/view";
import type {StyleContext} from "../style/StyleContext";
import type {StyleAnimator} from "../style/StyleAnimator";
import {NodeViewInit, NodeViewConstructor, NodeView} from "../node/NodeView";
import type {AttributeAnimatorConstructor, AttributeAnimator} from "../attribute/AttributeAnimator";
import type {
  ElementViewObserver,
  ElementViewObserverCache,
  ViewWillSetAttribute,
  ViewDidSetAttribute,
  ViewWillSetStyle,
  ViewDidSetStyle,
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
  constructor(node: Element) {
    super(node);
    Object.defineProperty(this, "attributeAnimators", {
      value: null,
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, "styleAnimators", {
      value: null,
      enumerable: true,
      configurable: true,
    });
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

  /** @hidden */
  declare readonly viewObserverCache: ElementViewObserverCache<this>;

  protected onAddViewObserver(viewObserver: ViewObserverType<this>): void {
    super.onAddViewObserver(viewObserver);
    if (viewObserver.viewWillSetAttribute !== void 0) {
      this.viewObserverCache.viewWillSetAttributeObservers = Arrays.inserted(viewObserver as ViewWillSetAttribute, this.viewObserverCache.viewWillSetAttributeObservers);
    }
    if (viewObserver.viewDidSetAttribute !== void 0) {
      this.viewObserverCache.viewDidSetAttributeObservers = Arrays.inserted(viewObserver as ViewDidSetAttribute, this.viewObserverCache.viewDidSetAttributeObservers);
    }
    if (viewObserver.viewWillSetStyle !== void 0) {
      this.viewObserverCache.viewWillSetStyleObservers = Arrays.inserted(viewObserver as ViewWillSetStyle, this.viewObserverCache.viewWillSetStyleObservers);
    }
    if (viewObserver.viewDidSetStyle !== void 0) {
      this.viewObserverCache.viewDidSetStyleObservers = Arrays.inserted(viewObserver as ViewDidSetStyle, this.viewObserverCache.viewDidSetStyleObservers);
    }
  }

  protected onRemoveViewObserver(viewObserver: ViewObserverType<this>): void {
    super.onRemoveViewObserver(viewObserver);
    if (viewObserver.viewWillSetAttribute !== void 0) {
      this.viewObserverCache.viewWillSetAttributeObservers = Arrays.removed(viewObserver as ViewWillSetAttribute, this.viewObserverCache.viewWillSetAttributeObservers);
    }
    if (viewObserver.viewDidSetAttribute !== void 0) {
      this.viewObserverCache.viewDidSetAttributeObservers = Arrays.removed(viewObserver as ViewDidSetAttribute, this.viewObserverCache.viewDidSetAttributeObservers);
    }
    if (viewObserver.viewWillSetStyle !== void 0) {
      this.viewObserverCache.viewWillSetStyleObservers = Arrays.removed(viewObserver as ViewWillSetStyle, this.viewObserverCache.viewWillSetStyleObservers);
    }
    if (viewObserver.viewDidSetStyle !== void 0) {
      this.viewObserverCache.viewDidSetStyleObservers = Arrays.removed(viewObserver as ViewDidSetStyle, this.viewObserverCache.viewDidSetStyleObservers);
    }
  }

  protected onMount(): void {
    super.onMount();
    this.mountTheme();
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

  @ViewProperty({type: MoodMatrix, state: null})
  declare moodModifier: ViewProperty<this, MoodMatrix | null>;

  @ViewProperty({type: MoodMatrix, state: null})
  declare themeModifier: ViewProperty<this, MoodMatrix | null>;

  getLook<T>(look: Look<T, unknown>, mood?: MoodVector<Feel> | null): T | undefined {
    const theme = this.theme.state;
    let value: T | undefined;
    if (theme !== null) {
      if (mood === void 0 || mood === null) {
        mood = this.mood.state;
      }
      if (mood !== null) {
        value = theme.get(look, mood);
      }
    }
    return value;
  }

  getLookOr<T, E>(look: Look<T, unknown>, elseValue: E): T | E;
  getLookOr<T, E>(look: Look<T, unknown>, mood: MoodVector<Feel> | null, elseValue: E): T | E;
  getLookOr<T, E>(look: Look<T, unknown>, mood: MoodVector<Feel> | null | E, elseValue?: E): T | E {
    if (arguments.length === 2) {
      elseValue = mood as E;
      mood = null;
    }
    const theme = this.theme.state;
    let value: T | E;
    if (theme !== null) {
      if (mood === void 0 || mood === null) {
        mood = this.mood.state;
      }
      if (mood !== null) {
        value = theme.getOr(look, mood as MoodVector<Feel>, elseValue as E);
      } else {
        value = elseValue as E;
      }
    } else {
      value = elseValue as E;
    }
    return value;
  }

  modifyMood(feel: Feel, ...entires: [Feel, number | undefined][]): void;
  modifyMood(feel: Feel, ...args: [...entires: [Feel, number | undefined][], timing: AnyTiming | boolean]): void;
  modifyMood(feel: Feel, ...args: [Feel, number | undefined][] | [...entires: [Feel, number | undefined][], timing: AnyTiming | boolean]): void {
    let timing = args.length !== 0 && !Array.isArray(args[args.length - 1]) ? args.pop() as AnyTiming | boolean : void 0;
    const entries = args as [Feel, number | undefined][];
    const oldMoodModifier = this.moodModifier.getStateOr(MoodMatrix.empty());
    const newMoodModifier = oldMoodModifier.updatedCol(feel, true, ...entries);
    if (!newMoodModifier.equals(oldMoodModifier)) {
      this.moodModifier.setState(newMoodModifier);
      this.changeMood();
      if (timing !== void 0) {
        const theme = this.theme.state;
        const mood = this.mood.state;
        if (theme !== null && mood !== null) {
          if (timing === true) {
            timing = theme.getOr(Look.timing, mood, false);
          } else {
            timing = Timing.fromAny(timing);
          }
          this.applyTheme(theme, mood, timing);
        }
      } else {
        this.requireUpdate(View.NeedsChange);
      }
    }
  }

  modifyTheme(feel: Feel, ...enties: [Feel, number | undefined][]): void;
  modifyTheme(feel: Feel, ...args: [...enties: [Feel, number | undefined][], timing: AnyTiming | boolean]): void;
  modifyTheme(feel: Feel, ...args: [Feel, number | undefined][] | [...enties: [Feel, number | undefined][], timing: AnyTiming | boolean]): void {
    let timing = args.length !== 0 && !Array.isArray(args[args.length - 1]) ? args.pop() as AnyTiming | boolean : void 0;
    const entries = args as [Feel, number | undefined][];
    const oldThemeModifier = this.themeModifier.getStateOr(MoodMatrix.empty());
    const newThemeModifier = oldThemeModifier.updatedCol(feel, true, ...entries);
    if (!newThemeModifier.equals(oldThemeModifier)) {
      this.themeModifier.setState(newThemeModifier);
      this.changeTheme();
      if (timing !== void 0) {
        const theme = this.theme.state;
        const mood = this.mood.state;
        if (theme !== null && mood !== null) {
          if (timing === true) {
            timing = theme.getOr(Look.timing, mood, false);
          } else {
            timing = Timing.fromAny(timing);
          }
          this.applyTheme(theme, mood, timing);
        }
      } else {
        this.requireUpdate(View.NeedsChange);
      }
    }
  }

  protected changeMood(): void {
    const moodModifierProperty = this.getViewProperty("moodModifier") as ViewProperty<this, MoodMatrix | null> | null;
    if (moodModifierProperty !== null && this.mood.isAuto()) {
      const moodModifier = moodModifierProperty.state;
      if (moodModifier !== null) {
        let superMood = this.mood.superState;
        if (superMood === void 0 || superMood === null) {
          const themeManager = this.themeService.manager;
          if (themeManager !== void 0) {
            superMood = themeManager.mood;
          }
        }
        if (superMood !== void 0 && superMood !== null) {
          const mood = moodModifier.timesCol(superMood, true);
          this.mood.setAutoState(mood);
        }
      } else {
        this.mood.setInherited(true);
      }
    }
  }

  protected changeTheme(): void {
    const themeModifierProperty = this.getViewProperty("themeModifier") as ViewProperty<this, MoodMatrix | null> | null;
    if (themeModifierProperty !== null && this.theme.isAuto()) {
      const themeModifier = themeModifierProperty.state;
      if (themeModifier !== null) {
        let superTheme = this.theme.superState;
        if (superTheme === void 0 || superTheme === null) {
          const themeManager = this.themeService.manager;
          if (themeManager !== void 0) {
            superTheme = themeManager.theme;
          }
        }
        if (superTheme !== void 0 && superTheme !== null) {
          const theme = superTheme.transform(themeModifier, true);
          this.theme.setAutoState(theme);
        }
      } else {
        this.theme.setInherited(true);
      }
    }
  }

  protected updateTheme(): void {
    this.changeMood();
    this.changeTheme();
    const theme = this.theme.state;
    const mood = this.mood.state;
    if (theme !== null && mood !== null) {
      this.applyTheme(theme, mood);
    }
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);
    this.themeViewAnimators(theme, mood, timing);
  }

  /** @hidden */
  protected mountTheme(): void {
    if (NodeView.isRootView(this.node)) {
      const themeManager = this.themeService.manager;
      if (themeManager !== void 0) {
        if (this.mood.isAuto() && this.mood.state === null) {
          this.mood.setAutoState(themeManager.mood);
        }
        if (this.theme.isAuto() && this.theme.state === null) {
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
    if (value !== void 0 && value !== null) {
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
    const viewObservers = this.viewObserverCache.viewWillSetAttributeObservers;
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
    const viewObservers = this.viewObserverCache.viewDidSetAttributeObservers;
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

  /** @hidden */
  declare readonly attributeAnimators: {[animatorName: string]: AttributeAnimator<ElementView, unknown> | undefined} | null;

  hasAttributeAnimator(animatorName: string): boolean {
    const attributeAnimators = this.attributeAnimators;
    return attributeAnimators !== null && attributeAnimators[animatorName] !== void 0;
  }

  getAttributeAnimator(animatorName: string): AttributeAnimator<this, unknown> | null {
    const attributeAnimators = this.attributeAnimators;
    if (attributeAnimators !== null) {
      const attributeAnimator = attributeAnimators[animatorName];
      if (attributeAnimator !== void 0) {
        return attributeAnimator as AttributeAnimator<this, unknown>;
      }
    }
    return null;
  }

  setAttributeAnimator(animatorName: string, newAttributeAnimator: AttributeAnimator<this, unknown> | null): void {
    let attributeAnimators = this.attributeAnimators;
    if (attributeAnimators === null) {
      attributeAnimators = {};
      Object.defineProperty(this, "attributeAnimators", {
        value: attributeAnimators,
        enumerable: true,
        configurable: true,
      });
    }
    const oldAttributedAnimator = attributeAnimators[animatorName];
    if (oldAttributedAnimator !== void 0 && this.isMounted()) {
      oldAttributedAnimator.unmount();
    }
    if (newAttributeAnimator !== null) {
      attributeAnimators[animatorName] = newAttributeAnimator;
      if (this.isMounted()) {
        newAttributeAnimator.mount();
      }
    } else {
      delete attributeAnimators[animatorName];
    }
  }

  getStyle(propertyNames: string | ReadonlyArray<string>): CSSStyleValue | string | undefined {
    if (typeof CSSStyleValue !== "undefined") { // CSS Typed OM support
      const style = this.node.attributeStyleMap;
      if (typeof propertyNames === "string") {
        try {
          return style.get(propertyNames);
        } catch (e) {
          return void 0;
        }
      } else {
        for (let i = 0, n = propertyNames.length; i < n; i += 1) {
          const value = style.get(propertyNames[i]!);
          if (value !== "") {
            return value;
          }
        }
        return "";
      }
    } else {
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
  }

  setStyle(propertyName: string, value: unknown, priority?: string): this {
    this.willSetStyle(propertyName, value, priority);
    if (typeof CSSStyleValue !== "undefined") { // CSS Typed OM support
      if (value !== void 0 && value !== null) {
        const cssValue = ToCssValue(value);
        if (cssValue !== null) {
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
    } else {
      if (value !== void 0 && value !== null) {
        this.node.style.setProperty(propertyName, ToStyleString(value), priority);
      } else {
        this.node.style.removeProperty(propertyName);
      }
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
    const viewObservers = this.viewObserverCache.viewWillSetStyleObservers;
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
    const viewObservers = this.viewObserverCache.viewDidSetStyleObservers;
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

  /** @hidden */
  declare readonly styleAnimators: {[animatorName: string]: StyleAnimator<ElementView, unknown> | undefined} | null;

  hasStyleAnimator(animatorName: string): boolean {
    const styleAnimators = this.styleAnimators;
    return styleAnimators !== null && styleAnimators[animatorName] !== void 0;
  }

  getStyleAnimator(animatorName: string): StyleAnimator<this, unknown> | null {
    const styleAnimators = this.styleAnimators;
    if (styleAnimators !== null) {
      const styleAnimator = styleAnimators[animatorName];
      if (styleAnimator !== void 0) {
        return styleAnimator as StyleAnimator<this, unknown>;
      }
    }
    return null;
  }

  setStyleAnimator(animatorName: string, newStyleAnimator: StyleAnimator<this, unknown> | null): void {
    let styleAnimators = this.styleAnimators;
    if (styleAnimators === null) {
      styleAnimators = {};
      Object.defineProperty(this, "styleAnimators", {
        value: styleAnimators,
        enumerable: true,
        configurable: true,
      });
    }
    const oldStyleAnimator = styleAnimators[animatorName];
    if (oldStyleAnimator !== void 0 && this.isMounted()) {
      oldStyleAnimator.unmount();
    }
    if (newStyleAnimator !== null) {
      styleAnimators[animatorName] = newStyleAnimator;
      if (this.isMounted()) {
        newStyleAnimator.mount();
      }
    } else {
      delete styleAnimators[animatorName];
    }
  }

  /** @hidden */
  protected themeViewAnimators(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void {
    const viewAnimators = this.viewAnimators;
    for (const animatorName in viewAnimators) {
      const viewAnimator = viewAnimators[animatorName]!;
      viewAnimator.applyTheme(theme, mood, timing);
    }
    const attributeAnimators = this.attributeAnimators;
    for (const animatorName in attributeAnimators) {
      const attributeAnimator = attributeAnimators[animatorName]!;
      attributeAnimator.applyTheme(theme, mood, timing);
    }
    const styleAnimators = this.styleAnimators;
    for (const animatorName in styleAnimators) {
      const styleAnimator = styleAnimators[animatorName]!;
      styleAnimator.applyTheme(theme, mood, timing);
    }
  }

  /** @hidden */
  protected mountViewAnimators(): void {
    super.mountViewAnimators();
    const attributeAnimators = this.attributeAnimators;
    for (const animatorName in attributeAnimators) {
      const attributeAnimator = attributeAnimators[animatorName]!;
      attributeAnimator.mount();
    }
    const styleAnimators = this.styleAnimators;
    for (const animatorName in styleAnimators) {
      const styleAnimator = styleAnimators[animatorName]!;
      styleAnimator.mount();
    }
  }

  /** @hidden */
  protected unmountViewAnimators(): void {
    const styleAnimators = this.styleAnimators;
    for (const animatorName in styleAnimators) {
      const styleAnimator = styleAnimators[animatorName]!;
      styleAnimator.unmount();
    }
    const attributeAnimators = this.attributeAnimators;
    for (const animatorName in attributeAnimators) {
      const attributeAnimator = attributeAnimators[animatorName]!;
      attributeAnimator.unmount();
    }
    super.unmountViewAnimators();
  }

  id(): string | undefined;
  id(value: string | undefined): this;
  id(value?: string | undefined): string | undefined | this {
    if (arguments.length == 0) {
      const id = this.getAttribute("id");
      return id !== null ? id : void 0;
    } else {
      this.setAttribute("id", value);
      return this;
    }
  }

  className(): string | undefined;
  className(value: string | undefined): this;
  className(value?: string | undefined): string | undefined | this {
    if (arguments.length === 0) {
      const className = this.getAttribute("class");
      return className !== null ? className : void 0;
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
    if (Object.prototype.hasOwnProperty.call(this, "tags")) {
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
      if (Object.prototype.hasOwnProperty.call(this, "tags")) {
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
        let attributeAnimator = this.getAttributeAnimator(propertyKey.toString());
        if (attributeAnimator === null) {
          attributeAnimator = new constructor(this, propertyKey.toString());
          this.setAttributeAnimator(propertyKey.toString(), attributeAnimator);
        }
        return attributeAnimator;
      },
      configurable: true,
      enumerable: true,
    });
  }
}
