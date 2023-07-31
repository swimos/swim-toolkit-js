// Copyright 2015-2023 Swim.inc
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

import type {Class} from "@swim/util";
import type {Instance} from "@swim/util";
import {Arrays} from "@swim/util";
import {Creatable} from "@swim/util";
import type {Observes} from "@swim/util";
import {Affinity} from "@swim/component";
import {Provider} from "@swim/component";
import {R2Box} from "@swim/math";
import {ThemeMatrix} from "@swim/theme";
import {Theme} from "@swim/theme";
import {ToAttributeString} from "@swim/style";
import {ToStyleString} from "@swim/style";
import {ToCssValue} from "@swim/style";
import type {ViewObserverCache} from "@swim/view";
import {View} from "@swim/view";
import type {ViewportColorScheme} from "@swim/view";
import type {ViewportService} from "@swim/view";
import type {StylerService} from "@swim/view";
import type {StyleContext} from "./StyleContext";
import type {ViewNodeType} from "./NodeView";
import type {AnyNodeView} from "./NodeView";
import type {NodeViewInit} from "./NodeView";
import type {NodeViewFactory} from "./NodeView";
import type {NodeViewClass} from "./NodeView";
import type {NodeViewConstructor} from "./NodeView";
import type {NodeViewObserver} from "./NodeView";
import {NodeView} from "./NodeView";
import {HtmlView} from "./"; // forward import
import {SvgView} from "./"; // forward import
import {DomService} from "./"; // forward import
import type {ModalOptions} from "./"; // forward import
import {ModalView} from "./"; // forward import
import {ModalService} from "./"; // forward import

/** @public */
export interface ViewElement extends Element, ElementCSSInlineStyle {
  view?: ElementView;
}

/** @public */
export type AnyElementView<V extends ElementView = ElementView> = AnyNodeView<V>;

/** @public */
export interface ElementViewInit extends NodeViewInit {
  id?: string;
  classList?: string[];
}

/** @public */
export interface ElementViewFactory<V extends ElementView = ElementView, U = AnyElementView<V>> extends NodeViewFactory<V, U> {
  fromTag(tag: string): V;
}

/** @public */
export interface ElementViewClass<V extends ElementView = ElementView, U = AnyElementView<V>> extends NodeViewClass<V, U>, ElementViewFactory<V, U> {
  readonly tag?: string;
  readonly namespace?: string;
}

/** @public */
export interface ElementViewConstructor<V extends ElementView = ElementView, U = AnyElementView<V>> extends NodeViewConstructor<V, U>, ElementViewClass<V, U> {
}

/** @public */
export interface ElementViewObserver<V extends ElementView = ElementView> extends NodeViewObserver<V> {
  viewWillSetAttribute?(name: string, value: unknown, view: V): void;

  viewDidSetAttribute?(name: string, value: unknown, view: V): void;

  viewWillSetStyle?(name: string, value: unknown, priority: string | undefined, view: V): void;

  viewDidSetStyle?(name: string, value: unknown, priority: string | undefined, view: V): void;
}

/** @internal */
export interface ElementViewObserverCache<V extends ElementView> extends ViewObserverCache<V> {
  viewWillSetAttributeObservers?: ReadonlyArray<ViewWillSetAttribute<V>>;
  viewDidSetAttributeObservers?: ReadonlyArray<ViewDidSetAttribute<V>>;
  viewWillSetStyleObservers?: ReadonlyArray<ViewWillSetStyle<V>>;
  viewDidSetStyleObservers?: ReadonlyArray<ViewDidSetStyle<V>>;
}

/** @internal */
export interface ViewWillSetAttribute<V extends ElementView = ElementView> {
  viewWillSetAttribute(name: string, value: unknown, view: V): void;
}

/** @internal */
export interface ViewDidSetAttribute<V extends ElementView = ElementView> {
  viewDidSetAttribute(name: string, value: unknown, view: V): void;
}

/** @internal */
export interface ViewWillSetStyle<V extends ElementView = ElementView> {
  viewWillSetStyle(name: string, value: unknown, priority: string | undefined, view: V): void;
}

/** @internal */
export interface ViewDidSetStyle<V extends ElementView = ElementView> {
  viewDidSetStyle(name: string, value: unknown, priority: string | undefined, view: V): void;
}

/** @public */
export class ElementView extends NodeView implements StyleContext {
  constructor(node: Element) {
    super(node);
  }

  declare readonly observerType?: Class<ElementViewObserver>;

  declare readonly node: Element & ElementCSSInlineStyle;

  @Provider({
    extends: true,
    observes: true,
    serviceDidSetViewportColorScheme(colorScheme: ViewportColorScheme): void {
      this.owner.detectTheme();
    },
  })
  override readonly viewport!: Provider<this, ViewportService> & NodeView["viewport"] & Observes<ViewportService>;

  @Provider({
    extends: true,
  })
  override readonly styler!: Provider<this, StylerService> & NodeView["styler"];

  @Provider({
    get serviceType(): typeof DomService { // avoid static forward reference
      return DomService;
    },
    mountRootService(service: DomService,): void {
      super.mountRootService(service);
      service.roots.addView(this.owner);
    },
    unmountRootService(service: DomService): void {
      super.unmountService(service);
      service.roots.removeView(this.owner);
    },
  })
  readonly dom!: Provider<this, DomService>;

  @Provider({
    get serviceType(): typeof ModalService { // avoid static forward reference
      return ModalService;
    },
    present(modalView?: ModalView, options?: ModalOptions): void {
      if (modalView === void 0 && ModalView.is(this.owner)) {
        modalView = this.owner;
      }
      if (modalView !== void 0) {
        this.getService().presentModal(modalView, options);
      }
    },
    dismiss(modalView?: ModalView): void {
      if (modalView === void 0 && ModalView.is(this.owner)) {
        modalView = this.owner;
      }
      if (modalView !== void 0) {
        this.getService().dismissModal(modalView);
      }
    },
    toggle(modalView?: ModalView, options?: ModalOptions): void {
      if (modalView === void 0 && ModalView.is(this.owner)) {
        modalView = this.owner;
      }
      if (modalView !== void 0) {
        this.getService().toggleModal(modalView, options);
      }
    },
  })
  readonly modal!: Provider<this, ModalService> & {
    present(modalView?: ModalView, options?: ModalOptions): void,
    dismiss(modalView?: ModalView): void,
    toggle(modalView?: ModalView): void,
  };

  protected detectTheme(): void {
    let themeName = this.node.getAttribute("swim-theme");
    if (themeName === "") {
      themeName = "auto";
    }
    if (themeName !== null) {
      let theme: ThemeMatrix | undefined;
      if (themeName === "auto") {
        const viewportService = this.viewport.getService();
        const colorScheme = viewportService.colorScheme.value;
        if (colorScheme === "dark") {
          theme = Theme.dark;
        } else {
          theme = Theme.light;
        }
      } else if (themeName.indexOf('.') < 0) {
        theme = (Theme as any)[themeName];
      } else {
        theme = DomService.eval(themeName) as ThemeMatrix | undefined;
      }
      if (theme instanceof ThemeMatrix) {
        this.theme.setValue(theme, Affinity.Extrinsic);
      } else {
        throw new TypeError("unknown swim-theme: " + themeName);
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
    const observers = this.observerCache.viewWillSetAttributeObservers;
    if (observers !== void 0) {
      for (let i = 0, n = observers.length; i < n; i += 1) {
        const observer = observers[i]!;
        observer.viewWillSetAttribute(attributeName, value, this);
      }
    }
  }

  protected onSetAttribute(attributeName: string, value: unknown): void {
    // hook
  }

  protected didSetAttribute(attributeName: string, value: unknown): void {
    const observers = this.observerCache.viewDidSetAttributeObservers;
    if (observers !== void 0) {
      for (let i = 0, n = observers.length; i < n; i += 1) {
        const observer = observers[i]!;
        observer.viewDidSetAttribute(attributeName, value, this);
      }
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
          if (value !== void 0) {
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
          if (value.length !== 0) {
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
        try {
          this.node.attributeStyleMap.delete(propertyName);
        } catch (e) {
          // swallow
        }
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
    const observers = this.observerCache.viewWillSetStyleObservers;
    if (observers !== void 0) {
      for (let i = 0, n = observers.length; i < n; i += 1) {
        const observer = observers[i]!;
        observer.viewWillSetStyle(propertyName, value, priority, this);
      }
    }
  }

  protected onSetStyle(propertyName: string, value: unknown, priority: string | undefined): void {
    // hook
  }

  protected didSetStyle(propertyName: string, value: unknown, priority: string | undefined): void {
    const observers = this.observerCache.viewDidSetStyleObservers;
    if (observers !== void 0) {
      for (let i = 0, n = observers.length; i < n; i += 1) {
        const observer = observers[i]!;
        observer.viewDidSetStyle(propertyName, value, priority, this);
      }
    }
  }

  id(): string | undefined;
  id(value: string | undefined): this;
  id(value?: string | undefined): string | undefined | this {
    if (arguments.length === 0) {
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

  override get clientBounds(): R2Box {
    const bounds = this.node.getBoundingClientRect();
    return new R2Box(bounds.left, bounds.top, bounds.right, bounds.bottom);
  }

  override get pageBounds(): R2Box {
    const bounds = this.node.getBoundingClientRect();
    const scrollX = window.pageXOffset;
    const scrollY = window.pageYOffset;
    return new R2Box(bounds.left + scrollX, bounds.top + scrollY,
                     bounds.right + scrollX, bounds.bottom + scrollY);
  }

  override addEventListener<K extends keyof ElementEventMap>(type: K, listener: (this: Element, event: ElementEventMap[K]) => unknown, options?: AddEventListenerOptions | boolean): void;
  override addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): void;
  override addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): void {
    this.node.addEventListener(type, listener, options);
  }

  override removeEventListener<K extends keyof ElementEventMap>(type: K, listener: (this: Element, event: ElementEventMap[K]) => unknown, options?: EventListenerOptions | boolean): void;
  override removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): void;
  override removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): void {
    this.node.removeEventListener(type, listener, options);
  }

  /** @internal */
  override readonly observerCache!: ElementViewObserverCache<this>;

  protected override onObserve(observer: Observes<this>): void {
    super.onObserve(observer);
    if (observer.viewWillSetAttribute !== void 0) {
      this.observerCache.viewWillSetAttributeObservers = Arrays.inserted(observer as ViewWillSetAttribute, this.observerCache.viewWillSetAttributeObservers);
    }
    if (observer.viewDidSetAttribute !== void 0) {
      this.observerCache.viewDidSetAttributeObservers = Arrays.inserted(observer as ViewDidSetAttribute, this.observerCache.viewDidSetAttributeObservers);
    }
    if (observer.viewWillSetStyle !== void 0) {
      this.observerCache.viewWillSetStyleObservers = Arrays.inserted(observer as ViewWillSetStyle, this.observerCache.viewWillSetStyleObservers);
    }
    if (observer.viewDidSetStyle !== void 0) {
      this.observerCache.viewDidSetStyleObservers = Arrays.inserted(observer as ViewDidSetStyle, this.observerCache.viewDidSetStyleObservers);
    }
  }

  protected override onUnobserve(observer: Observes<this>): void {
    super.onUnobserve(observer);
    if (observer.viewWillSetAttribute !== void 0) {
      this.observerCache.viewWillSetAttributeObservers = Arrays.removed(observer as ViewWillSetAttribute, this.observerCache.viewWillSetAttributeObservers);
    }
    if (observer.viewDidSetAttribute !== void 0) {
      this.observerCache.viewDidSetAttributeObservers = Arrays.removed(observer as ViewDidSetAttribute, this.observerCache.viewDidSetAttributeObservers);
    }
    if (observer.viewWillSetStyle !== void 0) {
      this.observerCache.viewWillSetStyleObservers = Arrays.removed(observer as ViewWillSetStyle, this.observerCache.viewWillSetStyleObservers);
    }
    if (observer.viewDidSetStyle !== void 0) {
      this.observerCache.viewDidSetStyleObservers = Arrays.removed(observer as ViewDidSetStyle, this.observerCache.viewDidSetStyleObservers);
    }
  }

  protected override onMount(): void {
    super.onMount();
    if (this.node.hasAttribute("swim-theme")) {
      this.detectTheme();
      this.viewport.getService().observe(this.viewport);
    }
  }

  protected override onUnmount(): void {
    super.onUnmount();
    if (this.node.hasAttribute("swim-theme")) {
      this.viewport.getService().unobserve(this.viewport);
    }
  }

  override init(init: ElementViewInit): void {
    super.init(init);
    if (init.id !== void 0) {
      this.id(init.id);
    }
    if (init.classList !== void 0) {
      this.addClass(...init.classList);
    }
  }

  /** @internal */
  static readonly tag?: string;

  /** @internal */
  static readonly namespace?: string;

  static override create<S extends Class<Instance<S, ElementView>>>(this: S): InstanceType<S>;
  static override create(): ElementView;
  static override create(): ElementView {
    let tag = this.tag;
    if (tag === void 0) {
      tag = "div";
    }
    return this.fromTag(tag);
  }

  static fromTag<S extends Class<Instance<S, ElementView>>>(this: S, tag: string, namespace?: string): InstanceType<S>;
  static fromTag(tag: string, namespace?: string): ElementView;
  static fromTag(tag: string, namespace?: string): ElementView {
    if (namespace === void 0) {
      if (tag === "svg") {
        namespace = SvgView.namespace;
      }
    }
    let node: Element;
    if (namespace !== void 0) {
      node = document.createElementNS(namespace, tag);
    } else {
      node = document.createElement(tag);
    }
    return this.fromNode(node);
  }

  static override fromNode<S extends new (node: Element) => Instance<S, ElementView>>(this: S, node: ViewNodeType<InstanceType<S>>): InstanceType<S>;
  static override fromNode(node: Element): ElementView;
  static override fromNode(node: Element): ElementView {
    let view = (node as ViewElement).view;
    if (view === void 0) {
      if (node instanceof HTMLElement) {
        view = HtmlView.fromNode(node);
      } else if (node instanceof SVGElement) {
        view = SvgView.fromNode(node);
      } else {
        view = new this(node);
        this.mount(view);
      }
    } else if (!(view instanceof this)) {
      throw new TypeError(view + " not an instance of " + this);
    }
    return view;
  }

  static override fromAny<S extends Class<Instance<S, ElementView>>>(this: S, value: AnyElementView<InstanceType<S>>): InstanceType<S>;
  static override fromAny(value: AnyElementView | string): ElementView;
  static override fromAny(value: AnyElementView | string): ElementView {
    if (value === void 0 || value === null) {
      return value;
    } else if (value instanceof View) {
      if (value instanceof this) {
        return value;
      } else {
        throw new TypeError(value + " not an instance of " + this);
      }
    } else if (value instanceof Node) {
      return this.fromNode(value);
    } else if (typeof value === "string") {
      return this.fromTag(value);
    } else if (Creatable.is(value)) {
      return value.create();
    } else {
      return this.fromInit(value);
    }
  }
}
