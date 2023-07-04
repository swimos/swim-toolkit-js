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
import type {AnyTiming} from "@swim/util";
import {Creatable} from "@swim/util";
import type {AnyLength} from "@swim/math";
import {Length} from "@swim/math";
import type {AnyTransform} from "@swim/math";
import {Transform} from "@swim/math";
import type {FontStyle} from "@swim/style";
import type {FontVariant} from "@swim/style";
import type {FontWeight} from "@swim/style";
import type {FontStretch} from "@swim/style";
import {FontFamily} from "@swim/style";
import type {AnyFont} from "@swim/style";
import {Font} from "@swim/style";
import type {AnyColor} from "@swim/style";
import {Color} from "@swim/style";
import type {AnyView} from "@swim/view";
import {View} from "@swim/view";
import {AttributeAnimator} from "./AttributeAnimator";
import {StyleAnimator} from "./StyleAnimator";
import type {AlignmentBaseline} from "./csstypes";
import type {CssCursor} from "./csstypes";
import type {FillRule} from "./csstypes";
import type {StrokeLinecap} from "./csstypes";
import type {StrokeLinejoin} from "./csstypes";
import type {SvgPointerEvents} from "./csstypes";
import type {TextAnchor} from "./csstypes";
import type {TouchAction} from "./csstypes";
import type {ViewNodeType} from "./NodeView";
import type {AnyElementView} from "./ElementView";
import type {ElementViewFactory} from "./ElementView";
import type {ElementViewClass} from "./ElementView";
import type {ElementViewConstructor} from "./ElementView";
import type {ElementViewObserver} from "./ElementView";
import {ElementView} from "./ElementView";

/** @public */
export interface ViewSvg extends SVGElement {
  view?: SvgView;
}

/** @public */
export type AnySvgView<V extends SvgView = SvgView> = AnyElementView<V> | keyof SvgViewTagMap;

/** @public */
export interface SvgViewTagMap {
  a: SvgView;
  animate: SvgView;
  animateMotion: SvgView;
  animateTransform: SvgView;
  audio: SvgView;
  canvas: SvgView;
  circle: SvgView;
  clipPath: SvgView;
  defs: SvgView;
  desc: SvgView;
  discard: SvgView;
  ellipse: SvgView;
  feBlend: SvgView;
  feColorMatrix: SvgView;
  feComponentTransfer: SvgView;
  feComposite: SvgView;
  feConvolveMatrix: SvgView;
  feDiffuseLighting: SvgView;
  feDisplacementMap: SvgView;
  feDistantLight: SvgView;
  feDropShadow: SvgView;
  feFlood: SvgView;
  feFuncA: SvgView;
  feFuncB: SvgView;
  feFuncG: SvgView;
  feFuncR: SvgView;
  feGaussianBlur: SvgView;
  feImage: SvgView;
  feMerge: SvgView;
  feMergeNode: SvgView;
  feMorphology: SvgView;
  feOffset: SvgView;
  fePointLight: SvgView;
  feSpecularLighting: SvgView;
  feSpotLight: SvgView;
  feTile: SvgView;
  feTurbulence: SvgView;
  filter: SvgView;
  foreignObject: SvgView;
  g: SvgView;
  iframe: SvgView;
  image: SvgView;
  line: SvgView;
  linearGradient: SvgView;
  marker: SvgView;
  mask: SvgView;
  metadata: SvgView;
  mpath: SvgView;
  path: SvgView;
  pattern: SvgView;
  polygon: SvgView;
  polyline: SvgView;
  radialGradient: SvgView;
  rect: SvgView;
  script: SvgView;
  set: SvgView;
  stop: SvgView;
  style: SvgView;
  svg: SvgView;
  switch: SvgView;
  symbol: SvgView;
  text: SvgView;
  textPath: SvgView;
  title: SvgView;
  tspan: SvgView;
  unknown: SvgView;
  use: SvgView;
  video: SvgView;
  view: SvgView;
}

/** @public */
export interface SvgViewFactory<V extends SvgView = SvgView, U = AnySvgView<V>> extends ElementViewFactory<V, U> {
}

/** @public */
export interface SvgViewClass<V extends SvgView = SvgView, U = AnySvgView<V>> extends ElementViewClass<V, U>, SvgViewFactory<V, U> {
  readonly tag: string;
  readonly namespace: string;
}

/** @public */
export interface SvgViewConstructor<V extends SvgView = SvgView, U = AnySvgView<V>> extends ElementViewConstructor<V, U>, SvgViewClass<V, U> {
  readonly tag: string;
  readonly namespace: string;
}

/** @public */
export interface SvgViewObserver<V extends SvgView = SvgView> extends ElementViewObserver<V> {
}

/** @public */
export class SvgView extends ElementView {
  constructor(node: SVGElement) {
    super(node);
  }

  declare readonly observerType?: Class<SvgViewObserver>;

  declare readonly node: SVGElement;

  override setChild<V extends View>(key: string, newChild: V): View | null;
  override setChild<F extends Class<Instance<F, View>> & Creatable<Instance<F, View>>>(key: string, factory: F): View | null;
  override setChild(key: string, newChild: AnyView | Node | keyof SvgViewTagMap | null): View | null;
  override setChild(key: string, newChild: AnyView | Node | keyof SvgViewTagMap | null): View | null {
    if (typeof newChild === "string") {
      newChild = SvgView.fromTag(newChild);
    }
    return super.setChild(key, newChild);
  }

  override appendChild<V extends View>(child: V, key?: string): V;
  override appendChild<F extends Class<Instance<F, View>> & Creatable<Instance<F, View>>>(factory: F, key?: string): InstanceType<F>;
  override appendChild<K extends keyof SvgViewTagMap>(tag: K, key?: string): SvgViewTagMap[K];
  override appendChild(child: AnyView | Node | keyof SvgViewTagMap, key?: string): View;
  override appendChild(child: AnyView | Node | keyof SvgViewTagMap, key?: string): View {
    if (typeof child === "string") {
      child = SvgView.fromTag(child);
    }
    return super.appendChild(child, key);
  }

  override prependChild<V extends View>(child: V, key?: string): V;
  override prependChild<F extends Class<Instance<F, View>> & Creatable<Instance<F, View>>>(factory: F, key?: string): InstanceType<F>;
  override prependChild<K extends keyof SvgViewTagMap>(tag: K, key?: string): SvgViewTagMap[K];
  override prependChild(child: AnyView | Node | keyof SvgViewTagMap, key?: string): View;
  override prependChild(child: AnyView | Node | keyof SvgViewTagMap, key?: string): View {
    if (typeof child === "string") {
      child = SvgView.fromTag(child);
    }
    return super.prependChild(child, key);
  }

  override insertChild<V extends View>(child: V, target: View | Node | null, key?: string): V;
  override insertChild<F extends Class<Instance<F, View>> & Creatable<Instance<F, View>>>(factory: F, target: View | Node | null, key?: string): InstanceType<F>;
  override insertChild<K extends keyof SvgViewTagMap>(tag: K, target: View | Node | null, key?: string): SvgViewTagMap[K];
  override insertChild(child: AnyView | Node | keyof SvgViewTagMap, target: View | Node | null, key?: string): View;
  override insertChild(child: AnyView | Node | keyof SvgViewTagMap, target: View | Node | null, key?: string): View {
    if (typeof child === "string") {
      child = SvgView.fromTag(child);
    }
    return super.insertChild(child, target, key);
  }

  override replaceChild<V extends View>(newChild: View, oldChild: V): V;
  override replaceChild<V extends View>(newChild: AnyView | Node | keyof SvgViewTagMap, oldChild: V): V;
  override replaceChild(newChild: AnyView | Node | keyof SvgViewTagMap, oldChild: View): View {
    if (typeof newChild === "string") {
      newChild = SvgView.fromTag(newChild);
    }
    return super.replaceChild(newChild, oldChild);
  }

  @AttributeAnimator({attributeName: "alignment-baseline", valueType: String})
  get alignmentBaseline(): AttributeAnimator<this, AlignmentBaseline | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "clip-path", valueType: String})
  get clipPath(): AttributeAnimator<this, string | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "cursor", valueType: String})
  get cursor(): AttributeAnimator<this, CssCursor | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "cx", valueType: Number})
  get cx(): AttributeAnimator<this, number | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "cy", valueType: Number})
  get cy(): AttributeAnimator<this, number | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "d", valueType: String})
  get d(): AttributeAnimator<this, string | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "dx", valueType: Length, value: null})
  get dx(): AttributeAnimator<this, Length | null, AnyLength | null> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "dy", valueType: Length, value: null})
  get dy(): AttributeAnimator<this, Length | null, AnyLength | null> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "edgeMode", valueType: String})
  get edgeMode(): AttributeAnimator<this, string | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "fill", valueType: Color, value: null})
  get fill(): AttributeAnimator<this, Color | null, AnyColor | null> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "fill-opacity", valueType: Number})
  get fillOpacity(): AttributeAnimator<this, number | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "fill-rule", valueType: String})
  get fillRule(): AttributeAnimator<this, FillRule | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "flood-color", valueType: Color, value: null})
  get floodColor(): AttributeAnimator<this, Color | null, AnyColor | null> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "flood-opacity", valueType: Number})
  get floodOpacity(): AttributeAnimator<this, number | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "height", valueType: Length, value: null})
  get height(): AttributeAnimator<this, Length | null, AnyLength | null> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "in", valueType: String})
  get in(): AttributeAnimator<this, string | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "in2", valueType: String})
  get in2(): AttributeAnimator<this, string | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "lengthAdjust", valueType: String})
  get lengthAdjust(): AttributeAnimator<this, "spacing" | "spacingAndGlyphs" | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "mode", valueType: String})
  get mode(): AttributeAnimator<this, string | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "opacity", valueType: Number})
  get opacity(): AttributeAnimator<this, number | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "pointer-events", valueType: String})
  get pointerEvents(): AttributeAnimator<this, SvgPointerEvents | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "points", valueType: String})
  get points(): AttributeAnimator<this, string | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "preserveAspectRatio", valueType: Boolean})
  get preserveAspectRatio(): AttributeAnimator<this, boolean | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "r", valueType: Number})
  get r(): AttributeAnimator<this, number | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "result", valueType: String})
  get result(): AttributeAnimator<this, string | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "stdDeviation", valueType: Number})
  get stdDeviation(): AttributeAnimator<this, number | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "stroke", valueType: Color, value: null})
  get stroke(): AttributeAnimator<this, Color | null, AnyColor | null> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "stroke-dasharray", valueType: String})
  get strokeDasharray(): AttributeAnimator<this, string | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "stroke-dashoffset", valueType: Number})
  get strokeDashoffset(): AttributeAnimator<this, number | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "stroke-linecap", valueType: String})
  get strokeLinecap(): AttributeAnimator<this, StrokeLinecap | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "stroke-linejoin", valueType: String})
  get strokeLinejoin(): AttributeAnimator<this, StrokeLinejoin | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "stroke-miterlimit", valueType: Number})
  get strokeMiterlimit(): AttributeAnimator<this, number | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "stroke-opacity", valueType: Number})
  get strokeOpacity(): AttributeAnimator<this, number | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "stroke-width", valueType: Number})
  get strokeWidth(): AttributeAnimator<this, number | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "text-anchor", valueType: String})
  get textAnchor(): AttributeAnimator<this, TextAnchor | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "textLength", valueType: Length, value: null})
  get textLength(): AttributeAnimator<this, Length | null, AnyLength | null> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "transform", valueType: Transform, value: null})
  get transform(): AttributeAnimator<this, Transform | null, AnyTransform | null> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "type", valueType: String})
  get type(): AttributeAnimator<this, string | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "values", valueType: String})
  get values(): AttributeAnimator<this, string | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "viewBox", valueType: String})
  get viewBox(): AttributeAnimator<this, string | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "width", valueType: Length, value: null})
  get width(): AttributeAnimator<this, Length | null, AnyLength | null> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "x", valueType: Number})
  get x(): AttributeAnimator<this, number | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "x1", valueType: Number})
  get x1(): AttributeAnimator<this, number | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "x2", valueType: Number})
  get x2(): AttributeAnimator<this, number | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "y", valueType: Number})
  get y(): AttributeAnimator<this, number | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "y1", valueType: Number})
  get y1(): AttributeAnimator<this, number | undefined> {
    return AttributeAnimator.dummy();
  }

  @AttributeAnimator({attributeName: "y2", valueType: Number})
  get y2(): AttributeAnimator<this, number | undefined> {
    return AttributeAnimator.dummy();
  }

  @StyleAnimator({propertyNames: "transform", valueType: Transform, value: null})
  get cssTransform(): StyleAnimator<this, Transform | null, AnyTransform | null> {
    return StyleAnimator.dummy();
  }

  @StyleAnimator({propertyNames: "filter", valueType: String})
  get filter(): StyleAnimator<this, string | undefined> {
    return StyleAnimator.dummy();
  }

  font(): Font | null;
  font(value: AnyFont | null, timing?: AnyTiming | boolean): this;
  font(value?: AnyFont | null, timing?: AnyTiming | boolean): Font | null | this {
    if (value === void 0) {
      const style = this.fontStyle.value;
      const variant = this.fontVariant.value;
      const weight = this.fontWeight.value;
      const stretch = this.fontStretch.value;
      const size = this.fontSize.value;
      const height = this.lineHeight.value;
      const family = this.fontFamily.value;
      if (family === void 0) {
        return null;
      }
      return Font.create(style, variant, weight, stretch, size, height, family);
    } if (value !== null) {
      value = Font.fromAny(value);
      if (value.style !== void 0) {
        this.fontStyle.setState(value.style, timing);
      }
      if (value.variant !== void 0) {
        this.fontVariant.setState(value.variant, timing);
      }
      if (value.weight !== void 0) {
        this.fontWeight.setState(value.weight, timing);
      }
      if (value.stretch !== void 0) {
        this.fontStretch.setState(value.stretch, timing);
      }
      if (value.size !== void 0) {
        this.fontSize.setState(value.size, timing);
      }
      if (value.height !== void 0) {
        this.lineHeight.setState(value.height, timing);
      }
      this.fontFamily.setState(value.family, timing);
    } else {
      this.fontStyle.setState(void 0, timing);
      this.fontVariant.setState(void 0, timing);
      this.fontWeight.setState(void 0, timing);
      this.fontStretch.setState(void 0, timing);
      this.fontSize.setState(null, timing);
      this.lineHeight.setState(null, timing);
      this.fontFamily.setState(void 0, timing);
    }
    return this;
  }

  @StyleAnimator({propertyNames: "font-family", valueType: FontFamily})
  get fontFamily(): StyleAnimator<this, FontFamily | FontFamily[] | undefined, FontFamily | ReadonlyArray<FontFamily> | undefined> {
    return StyleAnimator.dummy();
  }

  @StyleAnimator({propertyNames: "font-size", valueType: Length, value: null})
  get fontSize(): StyleAnimator<this, Length | null, AnyLength | null> {
    return StyleAnimator.dummy();
  }

  @StyleAnimator({propertyNames: "font-stretch", valueType: String})
  get fontStretch(): StyleAnimator<this, FontStretch | undefined> {
    return StyleAnimator.dummy();
  }

  @StyleAnimator({propertyNames: "font-style", valueType: String})
  get fontStyle(): StyleAnimator<this, FontStyle | undefined> {
    return StyleAnimator.dummy();
  }

  @StyleAnimator({propertyNames: "font-variant", valueType: String})
  get fontVariant(): StyleAnimator<this, FontVariant | undefined> {
    return StyleAnimator.dummy();
  }

  @StyleAnimator({propertyNames: "font-weight", valueType: String})
  get fontWeight(): StyleAnimator<this, FontWeight | undefined> {
    return StyleAnimator.dummy();
  }

  @StyleAnimator({propertyNames: "line-height", valueType: Length, value: null})
  get lineHeight(): StyleAnimator<this, Length | null, AnyLength | null> {
    return StyleAnimator.dummy();
  }

  @StyleAnimator({propertyNames: "touch-action", valueType: String})
  get touchAction(): StyleAnimator<this, TouchAction | undefined> {
    return StyleAnimator.dummy();
  }

  override get parentTransform(): Transform {
    const transform = this.transform.value;
    return transform !== null ? transform : Transform.identity();
  }

  override addEventListener<K extends keyof SVGElementEventMap>(type: K, listener: (this: SVGElement, event: SVGElementEventMap[K]) => unknown, options?: AddEventListenerOptions | boolean): void;
  override addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): void;
  override addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): void {
    this.node.addEventListener(type, listener, options);
  }

  override removeEventListener<K extends keyof SVGElementEventMap>(type: K, listener: (this: SVGElement, event: SVGElementEventMap[K]) => unknown, options?: EventListenerOptions | boolean): void;
  override removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): void;
  override removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): void {
    this.node.removeEventListener(type, listener, options);
  }

  static override readonly tag: string = "svg";

  static override readonly namespace: string = "http://www.w3.org/2000/svg";

  static override create<S extends Class<Instance<S, SvgView>>>(this: S): InstanceType<S>;
  static override create(): SvgView;
  static override create(): SvgView {
    return this.fromTag(this.tag);
  }

  static override fromAny<S extends Class<Instance<S, SvgView>>>(this: S, value: AnySvgView<InstanceType<S>>): InstanceType<S>;
  static override fromAny(value: AnySvgView | string): SvgView;
  static override fromAny(value: AnySvgView | string): SvgView {
    if (value === void 0 || value === null) {
      return value;
    } else if (value instanceof View) {
      if (!(value instanceof this)) {
        throw new TypeError(value + " not an instance of " + this);
      }
      return value;
    } else if (value instanceof Node) {
      return this.fromNode(value);
    } else if (typeof value === "string") {
      return this.fromTag(value);
    } else if (Creatable[Symbol.hasInstance](value)) {
      return this.create();
    }
    throw new TypeError("" + value);
  }

  static override fromNode<S extends new (node: SVGElement) => Instance<S, SvgView>>(this: S, node: ViewNodeType<InstanceType<S>>): InstanceType<S>;
  static override fromNode(node: SVGElement): SvgView;
  static override fromNode(node: SVGElement): SvgView {
    let view = (node as ViewSvg).view;
    if (view === void 0) {
      view = new this(node);
      this.mount(view);
    } else if (!(view instanceof this)) {
      throw new TypeError(view + " not an instance of " + this);
    }
    return view;
  }

  static override fromTag<S extends Class<Instance<S, SvgView>>>(this: S, tag: string): InstanceType<S>;
  static override fromTag(tag: string): SvgView;
  static override fromTag(tag: string): SvgView {
    const node = document.createElementNS(this.namespace, tag) as SVGElement;
    return this.fromNode(node);
  }

  static forTag<S extends Class<Instance<S, SvgView>>>(this: S, tag: string): SvgViewFactory<InstanceType<S>>;
  static forTag(tag: string): SvgViewFactory;
  static forTag(tag: string): SvgViewFactory {
    if (tag === this.tag) {
      return this;
    }
    return new SvgViewTagFactory(this, tag);
  }
}

/** @internal */
export class SvgViewTagFactory<V extends SvgView> implements SvgViewFactory<V> {
  constructor(factory: SvgViewFactory<V>, tag: string) {
    this.factory = factory;
    this.tag = tag;
  }

  /** @internal */
  readonly factory: SvgViewFactory<V>;

  readonly tag: string;

  get namespace(): string {
    return SvgView.namespace;
  }

  create(): V {
    return this.fromTag(this.tag);
  }

  fromAny(value: AnySvgView<V>): V {
    return this.factory.fromAny(value);
  }

  fromNode(node: ViewNodeType<V>): V {
    return this.factory.fromNode(node);
  }

  fromTag(tag: string): V {
    const node = document.createElementNS(this.namespace, tag) as SVGElement;
    return this.fromNode(node as ViewNodeType<V>);
  }
}
