// Copyright 2015-2022 Swim.inc
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

import {Class, Instance, AnyTiming, Creatable, InitType} from "@swim/util";
import type {MemberAnimatorInit} from "@swim/component";
import {AnyLength, Length, AnyTransform, Transform} from "@swim/math";
import {
  FontStyle,
  FontVariant,
  FontWeight,
  FontStretch,
  FontFamily,
  AnyFont,
  Font,
  AnyColor,
  Color,
} from "@swim/style";
import {AnyView, View} from "@swim/view";
import {AttributeAnimatorDef} from "../animator/AttributeAnimator";
import {StyleAnimatorDef} from "../animator/StyleAnimator";
import type {
  AlignmentBaseline,
  CssCursor,
  FillRule,
  StrokeLinecap,
  StrokeLinejoin,
  SvgPointerEvents,
  TextAnchor,
  TouchAction,
} from "../css/types";
import type {ViewNodeType} from "../node/NodeView";
import {
  AnyElementView,
  ElementViewInit,
  ElementViewFactory,
  ElementViewClass,
  ElementViewConstructor,
  ElementView,
} from "../element/ElementView";
import type {SvgViewObserver} from "./SvgViewObserver";

/** @public */
export interface ViewSvg extends SVGElement {
  view?: SvgView;
}

/** @public */
export type AnySvgView<V extends SvgView = SvgView> = AnyElementView<V> | keyof SvgViewTagMap;

/** @public */
export interface SvgViewInit extends ElementViewInit {
  attributes?: SvgViewAttributesInit;
  style?: SvgViewStyleInit;
}

/** @public */
export interface SvgViewAttributesInit {
  alignmentBaseline?: MemberAnimatorInit<SvgView, "alignmentBaseline">;
  clipPath?: MemberAnimatorInit<SvgView, "clipPath">;
  cursor?: MemberAnimatorInit<SvgView, "cursor">;
  cx?: MemberAnimatorInit<SvgView, "cx">;
  cy?: MemberAnimatorInit<SvgView, "cy">;
  d?: MemberAnimatorInit<SvgView, "d">;
  dx?: MemberAnimatorInit<SvgView, "dx">;
  dy?: MemberAnimatorInit<SvgView, "dy">;
  edgeMode?: MemberAnimatorInit<SvgView, "edgeMode">;
  fill?: MemberAnimatorInit<SvgView, "fill">;
  fillOpacity?: MemberAnimatorInit<SvgView, "fillOpacity">;
  fillRule?: MemberAnimatorInit<SvgView, "fillRule">;
  floodColor?: MemberAnimatorInit<SvgView, "floodColor">;
  floodOpacity?: MemberAnimatorInit<SvgView, "floodOpacity">;
  height?: MemberAnimatorInit<SvgView, "height">;
  in?: MemberAnimatorInit<SvgView, "in">;
  in2?: MemberAnimatorInit<SvgView, "in2">;
  lengthAdjust?: MemberAnimatorInit<SvgView, "lengthAdjust">;
  mode?: MemberAnimatorInit<SvgView, "mode">;
  opacity?: MemberAnimatorInit<SvgView, "opacity">;
  pointerEvents?: MemberAnimatorInit<SvgView, "pointerEvents">;
  points?: MemberAnimatorInit<SvgView, "points">;
  preserveAspectRatio?: MemberAnimatorInit<SvgView, "preserveAspectRatio">;
  r?: MemberAnimatorInit<SvgView, "r">;
  result?: MemberAnimatorInit<SvgView, "result">;
  stdDeviation?: MemberAnimatorInit<SvgView, "stdDeviation">;
  stroke?: MemberAnimatorInit<SvgView, "stroke">;
  strokeDasharray?: MemberAnimatorInit<SvgView, "strokeDasharray">;
  strokeDashoffset?: MemberAnimatorInit<SvgView, "strokeDashoffset">;
  strokeLinecap?: MemberAnimatorInit<SvgView, "strokeLinecap">;
  strokeLinejoin?: MemberAnimatorInit<SvgView, "strokeLinejoin">;
  strokeMiterlimit?: MemberAnimatorInit<SvgView, "strokeMiterlimit">;
  strokeOpacity?: MemberAnimatorInit<SvgView, "strokeOpacity">;
  strokeWidth?: MemberAnimatorInit<SvgView, "strokeWidth">;
  textAnchor?: MemberAnimatorInit<SvgView, "textAnchor">;
  textLength?: MemberAnimatorInit<SvgView, "textLength">;
  transform?: MemberAnimatorInit<SvgView, "transform">;
  type?: MemberAnimatorInit<SvgView, "type">;
  values?: MemberAnimatorInit<SvgView, "values">;
  viewBox?: MemberAnimatorInit<SvgView, "viewBox">;
  width?: MemberAnimatorInit<SvgView, "width">;
  x?: MemberAnimatorInit<SvgView, "x">;
  x1?: MemberAnimatorInit<SvgView, "x1">;
  x2?: MemberAnimatorInit<SvgView, "x2">;
  y?: MemberAnimatorInit<SvgView, "y">;
  y1?: MemberAnimatorInit<SvgView, "y1">;
  y2?: MemberAnimatorInit<SvgView, "y2">;
}

/** @public */
export interface SvgViewStyleInit {
  cssTransform?: MemberAnimatorInit<SvgView, "cssTransform">;
  filter?: MemberAnimatorInit<SvgView, "filter">;
  fontFamily?: MemberAnimatorInit<SvgView, "fontFamily">;
  fontSize?: MemberAnimatorInit<SvgView, "fontSize">;
  fontStretch?: MemberAnimatorInit<SvgView, "fontStretch">;
  fontStyle?: MemberAnimatorInit<SvgView, "fontStyle">;
  fontVariant?: MemberAnimatorInit<SvgView, "fontVariant">;
  fontWeight?: MemberAnimatorInit<SvgView, "fontWeight">;
  lineHeight?: MemberAnimatorInit<SvgView, "lineHeight">;
  touchAction?: MemberAnimatorInit<SvgView, "touchAction">;
}

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
export class SvgView extends ElementView {
  constructor(node: SVGElement) {
    super(node);
  }

  override readonly observerType?: Class<SvgViewObserver>;

  override readonly node!: SVGElement;

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

  @AttributeAnimatorDef({attributeName: "alignment-baseline", valueType: String})
  readonly alignmentBaseline!: AttributeAnimatorDef<this, {value: AlignmentBaseline}>;

  @AttributeAnimatorDef({attributeName: "clip-path", valueType: String})
  readonly clipPath!: AttributeAnimatorDef<this, {value: string | undefined}>;

  @AttributeAnimatorDef({attributeName: "cursor", valueType: String})
  readonly cursor!: AttributeAnimatorDef<this, {value: CssCursor | undefined}>;

  @AttributeAnimatorDef({attributeName: "cx", valueType: Number})
  readonly cx!: AttributeAnimatorDef<this, {value: number | undefined}>;

  @AttributeAnimatorDef({attributeName: "cy", valueType: Number})
  readonly cy!: AttributeAnimatorDef<this, {value: number | undefined}>;

  @AttributeAnimatorDef({attributeName: "d", valueType: String})
  readonly d!: AttributeAnimatorDef<this, {value: string | undefined}>;

  @AttributeAnimatorDef({attributeName: "dx", valueType: Length, value: null})
  readonly dx!: AttributeAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @AttributeAnimatorDef({attributeName: "dy", valueType: Length, value: null})
  readonly dy!: AttributeAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @AttributeAnimatorDef({attributeName: "edgeMode", valueType: String})
  readonly edgeMode!: AttributeAnimatorDef<this, {value: string | undefined}>;

  @AttributeAnimatorDef({attributeName: "fill", valueType: Color, value: null})
  readonly fill!: AttributeAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  @AttributeAnimatorDef({attributeName: "fill-opacity", valueType: Number})
  readonly fillOpacity!: AttributeAnimatorDef<this, {value: number | undefined}>;

  @AttributeAnimatorDef({attributeName: "fill-rule", valueType: String})
  readonly fillRule!: AttributeAnimatorDef<this, {value: FillRule | undefined}>;

  @AttributeAnimatorDef({attributeName: "flood-color", valueType: Color, value: null})
  readonly floodColor!: AttributeAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  @AttributeAnimatorDef({attributeName: "flood-opacity", valueType: Number})
  readonly floodOpacity!: AttributeAnimatorDef<this, {value: number | undefined}>;

  @AttributeAnimatorDef({attributeName: "height", valueType: Length, value: null})
  readonly height!: AttributeAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @AttributeAnimatorDef({attributeName: "in", valueType: String})
  readonly in!: AttributeAnimatorDef<this, {value: string | undefined}>;

  @AttributeAnimatorDef({attributeName: "in2", valueType: String})
  readonly in2!: AttributeAnimatorDef<this, {value: string | undefined}>;

  @AttributeAnimatorDef({attributeName: "lengthAdjust", valueType: String})
  readonly lengthAdjust!: AttributeAnimatorDef<this, {value: "spacing" | "spacingAndGlyphs" | undefined}>;

  @AttributeAnimatorDef({attributeName: "mode", valueType: String})
  readonly mode!: AttributeAnimatorDef<this, {value: string | undefined}>;

  @AttributeAnimatorDef({attributeName: "opacity", valueType: Number})
  readonly opacity!: AttributeAnimatorDef<this, {value: number | undefined}>;

  @AttributeAnimatorDef({attributeName: "pointer-events", valueType: String})
  readonly pointerEvents!: AttributeAnimatorDef<this, {value: SvgPointerEvents | undefined}>;

  @AttributeAnimatorDef({attributeName: "points", valueType: String})
  readonly points!: AttributeAnimatorDef<this, {value: string | undefined}>;

  @AttributeAnimatorDef({attributeName: "preserveAspectRatio", valueType: Boolean})
  readonly preserveAspectRatio!: AttributeAnimatorDef<this, {value: boolean | undefined}>;

  @AttributeAnimatorDef({attributeName: "r", valueType: Number})
  readonly r!: AttributeAnimatorDef<this, {value: number | undefined}>;

  @AttributeAnimatorDef({attributeName: "result", valueType: String})
  readonly result!: AttributeAnimatorDef<this, {value: string | undefined}>;

  @AttributeAnimatorDef({attributeName: "stdDeviation", valueType: Number})
  readonly stdDeviation!: AttributeAnimatorDef<this, {value: number | undefined}>;

  @AttributeAnimatorDef({attributeName: "stroke", valueType: Color, value: null})
  readonly stroke!: AttributeAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  @AttributeAnimatorDef({attributeName: "stroke-dasharray", valueType: String})
  readonly strokeDasharray!: AttributeAnimatorDef<this, {value: string | undefined}>;

  @AttributeAnimatorDef({attributeName: "stroke-dashoffset", valueType: Number})
  readonly strokeDashoffset!: AttributeAnimatorDef<this, {value: number | undefined}>;

  @AttributeAnimatorDef({attributeName: "stroke-linecap", valueType: String})
  readonly strokeLinecap!: AttributeAnimatorDef<this, {value: StrokeLinecap | undefined}>;

  @AttributeAnimatorDef({attributeName: "stroke-linejoin", valueType: String})
  readonly strokeLinejoin!: AttributeAnimatorDef<this, {value: StrokeLinejoin | undefined}>;

  @AttributeAnimatorDef({attributeName: "stroke-miterlimit", valueType: Number})
  readonly strokeMiterlimit!: AttributeAnimatorDef<this, {value: number | undefined}>;

  @AttributeAnimatorDef({attributeName: "stroke-opacity", valueType: Number})
  readonly strokeOpacity!: AttributeAnimatorDef<this, {value: number | undefined}>;

  @AttributeAnimatorDef({attributeName: "stroke-width", valueType: Number})
  readonly strokeWidth!: AttributeAnimatorDef<this, {value: number | undefined}>;

  @AttributeAnimatorDef({attributeName: "text-anchor", valueType: String})
  readonly textAnchor!: AttributeAnimatorDef<this, {value: TextAnchor | undefined}>;

  @AttributeAnimatorDef({attributeName: "textLength", valueType: Length, value: null})
  readonly textLength!: AttributeAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @AttributeAnimatorDef({attributeName: "transform", valueType: Transform, value: null})
  readonly transform!: AttributeAnimatorDef<this, {value: Transform | null, valueInit: AnyTransform | null}>;

  @AttributeAnimatorDef({attributeName: "type", valueType: String})
  readonly type!: AttributeAnimatorDef<this, {value: string | undefined}>;

  @AttributeAnimatorDef({attributeName: "values", valueType: String})
  readonly values!: AttributeAnimatorDef<this, {value: string | undefined}>;

  @AttributeAnimatorDef({attributeName: "viewBox", valueType: String})
  readonly viewBox!: AttributeAnimatorDef<this, {value: string | undefined}>;

  @AttributeAnimatorDef({attributeName: "width", valueType: Length, value: null})
  readonly width!: AttributeAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @AttributeAnimatorDef({attributeName: "x", valueType: Number})
  readonly x!: AttributeAnimatorDef<this, {value: number | undefined}>;

  @AttributeAnimatorDef({attributeName: "x1", valueType: Number})
  readonly x1!: AttributeAnimatorDef<this, {value: number | undefined}>;

  @AttributeAnimatorDef({attributeName: "x2", valueType: Number})
  readonly x2!: AttributeAnimatorDef<this, {value: number | undefined}>;

  @AttributeAnimatorDef({attributeName: "y", valueType: Number})
  readonly y!: AttributeAnimatorDef<this, {value: number | undefined}>;

  @AttributeAnimatorDef({attributeName: "y1", valueType: Number})
  readonly y1!: AttributeAnimatorDef<this, {value: number | undefined}>;

  @AttributeAnimatorDef({attributeName: "y2", valueType: Number})
  readonly y2!: AttributeAnimatorDef<this, {value: number | undefined}>;

  @StyleAnimatorDef({propertyNames: "transform", valueType: Transform, value: null})
  readonly cssTransform!: StyleAnimatorDef<this, {value: Transform | null, valueInit: AnyTransform | null}>;

  @StyleAnimatorDef({propertyNames: "filter", valueType: String})
  readonly filter!: StyleAnimatorDef<this, {value: string | undefined}>;

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
      if (family !== void 0) {
        return Font.create(style, variant, weight, stretch, size, height, family);
      } else {
        return null;
      }
    } else {
      if (value !== null) {
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
  }

  @StyleAnimatorDef({propertyNames: "font-family", valueType: FontFamily})
  readonly fontFamily!: StyleAnimatorDef<this, {
    value: FontFamily | FontFamily[] | undefined,
    valueInit: FontFamily | ReadonlyArray<FontFamily> | undefined,
  }>;

  @StyleAnimatorDef({propertyNames: "font-size", valueType: Length, value: null})
  readonly fontSize!: StyleAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @StyleAnimatorDef({propertyNames: "font-stretch", valueType: String})
  readonly fontStretch!: StyleAnimatorDef<this, {value: FontStretch | undefined}>;

  @StyleAnimatorDef({propertyNames: "font-style", valueType: String})
  readonly fontStyle!: StyleAnimatorDef<this, {value: FontStyle | undefined}>;

  @StyleAnimatorDef({propertyNames: "font-variant", valueType: String})
  readonly fontVariant!: StyleAnimatorDef<this, {value: FontVariant | undefined}>;

  @StyleAnimatorDef<SvgView["fontWeight"]>({propertyNames: "font-weight", valueType: String})
  readonly fontWeight!: StyleAnimatorDef<this, {value: FontWeight | undefined}>;

  @StyleAnimatorDef<SvgView["lineHeight"]>({propertyNames: "line-height", valueType: Length, value: null})
  readonly lineHeight!: StyleAnimatorDef<this, {value: Length | null, valueInit: AnyLength | null}>;

  @StyleAnimatorDef<SvgView["touchAction"]>({propertyNames: "touch-action", valueType: String})
  readonly touchAction!: StyleAnimatorDef<this, {value: TouchAction | undefined}>;

  override get parentTransform(): Transform {
    const transform = this.transform.value;
    return transform !== null ? transform : Transform.identity();
  }

  override on<K extends keyof SVGElementEventMap>(type: K, listener: (this: SVGElement, event: SVGElementEventMap[K]) => unknown,
                                                  options?: AddEventListenerOptions | boolean): this;
  override on(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): this;
  override on(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): this {
    this.node.addEventListener(type, listener, options);
    return this;
  }

  override off<K extends keyof SVGElementEventMap>(type: K, listener: (this: SVGElement, event: SVGElementEventMap[K]) => unknown,
                                                   options?: EventListenerOptions | boolean): this;
  override off(type: string, listener: EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): this;
  override off(type: string, listener: EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): this {
    this.node.removeEventListener(type, listener, options);
    return this;
  }

  /** @internal */
  protected initAttributes(init: SvgViewAttributesInit): void {
    if (init.alignmentBaseline !== void 0) {
      this.alignmentBaseline(init.alignmentBaseline);
    }
    if (init.clipPath !== void 0) {
      this.clipPath(init.clipPath);
    }
    if (init.cursor !== void 0) {
      this.cursor(init.cursor);
    }
    if (init.cx !== void 0) {
      this.cx(init.cx);
    }
    if (init.cy !== void 0) {
      this.cy(init.cy);
    }
    if (init.cy !== void 0) {
      this.cy(init.cy);
    }
    if (init.d !== void 0) {
      this.d(init.d);
    }
    if (init.dx !== void 0) {
      this.dx(init.dx);
    }
    if (init.dy !== void 0) {
      this.dy(init.dy);
    }
    if (init.edgeMode !== void 0) {
      this.edgeMode(init.edgeMode);
    }
    if (init.fill !== void 0) {
      this.fill(init.fill);
    }
    if (init.fillOpacity !== void 0) {
      this.fillOpacity(init.fillOpacity);
    }
    if (init.fillRule !== void 0) {
      this.fillRule(init.fillRule);
    }
    if (init.floodColor !== void 0) {
      this.floodColor(init.floodColor);
    }
    if (init.floodOpacity !== void 0) {
      this.floodOpacity(init.floodOpacity);
    }
    if (init.height !== void 0) {
      this.height(init.height);
    }
    if (init.in !== void 0) {
      this.in(init.in);
    }
    if (init.in2 !== void 0) {
      this.in2(init.in2);
    }
    if (init.lengthAdjust !== void 0) {
      this.lengthAdjust(init.lengthAdjust);
    }
    if (init.mode !== void 0) {
      this.mode(init.mode);
    }
    if (init.opacity !== void 0) {
      this.opacity(init.opacity);
    }
    if (init.pointerEvents !== void 0) {
      this.pointerEvents(init.pointerEvents);
    }
    if (init.points !== void 0) {
      this.points(init.points);
    }
    if (init.preserveAspectRatio !== void 0) {
      this.preserveAspectRatio(init.preserveAspectRatio);
    }
    if (init.r !== void 0) {
      this.r(init.r);
    }
    if (init.result !== void 0) {
      this.result(init.result);
    }
    if (init.stdDeviation !== void 0) {
      this.stdDeviation(init.stdDeviation);
    }
    if (init.stroke !== void 0) {
      this.stroke(init.stroke);
    }
    if (init.strokeDasharray !== void 0) {
      this.strokeDasharray(init.strokeDasharray);
    }
    if (init.strokeDashoffset !== void 0) {
      this.strokeDashoffset(init.strokeDashoffset);
    }
    if (init.strokeLinecap !== void 0) {
      this.strokeLinecap(init.strokeLinecap);
    }
    if (init.strokeLinejoin !== void 0) {
      this.strokeLinejoin(init.strokeLinejoin);
    }
    if (init.strokeMiterlimit !== void 0) {
      this.strokeMiterlimit(init.strokeMiterlimit);
    }
    if (init.strokeWidth !== void 0) {
      this.strokeWidth(init.strokeWidth);
    }
    if (init.textAnchor !== void 0) {
      this.textAnchor(init.textAnchor);
    }
    if (init.textLength !== void 0) {
      this.textLength(init.textLength);
    }
    if (init.transform !== void 0) {
      this.transform(init.transform);
    }
    if (init.type !== void 0) {
      this.type(init.type);
    }
    if (init.values !== void 0) {
      this.values(init.values);
    }
    if (init.viewBox !== void 0) {
      this.viewBox(init.viewBox);
    }
    if (init.width !== void 0) {
      this.width(init.width);
    }
    if (init.x !== void 0) {
      this.x(init.x);
    }
    if (init.x1 !== void 0) {
      this.x1(init.x1);
    }
    if (init.x2 !== void 0) {
      this.x2(init.x2);
    }
    if (init.y !== void 0) {
      this.y(init.y);
    }
    if (init.y1 !== void 0) {
      this.y1(init.y1);
    }
    if (init.y2 !== void 0) {
      this.y2(init.y2);
    }
  }

  /** @internal */
  protected initStyle(init: SvgViewStyleInit): void {
    if (init.cssTransform !== void 0) {
      this.cssTransform(init.cssTransform);
    }
    if (init.filter !== void 0) {
      this.filter(init.filter);
    }
    if (init.fontFamily !== void 0) {
      this.fontFamily(init.fontFamily);
    }
    if (init.fontSize !== void 0) {
      this.fontSize(init.fontSize);
    }
    if (init.fontStretch !== void 0) {
      this.fontStretch(init.fontStretch);
    }
    if (init.fontStyle !== void 0) {
      this.fontStyle(init.fontStyle);
    }
    if (init.fontVariant !== void 0) {
      this.fontVariant(init.fontVariant);
    }
    if (init.fontWeight !== void 0) {
      this.fontWeight(init.fontWeight);
    }
    if (init.lineHeight !== void 0) {
      this.lineHeight(init.lineHeight);
    }
    if (init.touchAction !== void 0) {
      this.touchAction(init.touchAction);
    }
  }

  override init(init: SvgViewInit): void {
    super.init(init);
    if (init.attributes !== void 0) {
      this.initAttributes(init.attributes);
    }
    if (init.style !== void 0) {
      this.initStyle(init.style);
    }
  }

  static override readonly tag: string = "svg";

  static override readonly namespace: string = "http://www.w3.org/2000/svg";

  static override create<S extends Class<Instance<S, SvgView>>>(this: S): InstanceType<S>;
  static override create(): SvgView;
  static override create(): SvgView {
    return this.fromTag(this.tag);
  }

  static override fromTag<S extends Class<Instance<S, SvgView>>>(this: S, tag: string): InstanceType<S>;
  static override fromTag(tag: string): SvgView;
  static override fromTag(tag: string): SvgView {
    const node = document.createElementNS(this.namespace, tag) as SVGElement;
    return this.fromNode(node);
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

  static override fromAny<S extends Class<Instance<S, SvgView>>>(this: S, value: AnySvgView<InstanceType<S>>): InstanceType<S>;
  static override fromAny(value: AnySvgView | string): SvgView;
  static override fromAny(value: AnySvgView | string): SvgView {
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

  static forTag<S extends Class<Instance<S, SvgView>>>(this: S, tag: string): SvgViewFactory<InstanceType<S>>;
  static forTag(tag: string): SvgViewFactory;
  static forTag(tag: string): SvgViewFactory {
    if (tag === this.tag) {
      return this;
    } else {
      return new SvgViewTagFactory(this, tag);
    }
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

  fromTag(tag: string): V {
    const node = document.createElementNS(this.namespace, tag) as SVGElement;
    return this.fromNode(node as ViewNodeType<V>);
  }

  fromNode(node: ViewNodeType<V>): V {
    return this.factory.fromNode(node);
  }

  fromInit(init: InitType<V>): V {
    let type = init.type;
    if (type === void 0) {
      type = this;
    }
    const view = type.create() as V;
    view.init(init);
    return view;
  }

  fromAny(value: AnySvgView<V>): V {
    return this.factory.fromAny(value);
  }
}
