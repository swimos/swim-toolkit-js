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

import {AnyLength, Length} from "@swim/length";
import {AnyColor, Color} from "@swim/color";
import {
  FontStyle,
  FontVariant,
  FontWeight,
  FontStretch,
  AnyFontSize,
  FontSize,
  AnyLineHeight,
  LineHeight,
  FontFamily,
  AnyFont,
  Font,
} from "@swim/font";
import {AnyTransform, Transform} from "@swim/transform";
import {Tween} from "@swim/transition";
import {
  AlignmentBaseline,
  CssCursor,
  FillRule,
  Paint,
  StrokeLinecap,
  TextAnchor,
  TouchAction,
} from "@swim/style";
import {View} from "../View";
import {ViewNode, NodeView} from "../node/NodeView";
import {TextView} from "../text/TextView";
import {AttributeAnimatorInitType, AttributeAnimator} from "../attribute/AttributeAnimator";
import {StyleAnimatorInitType, StyleAnimator} from "../style/StyleAnimator";
import {ElementViewConstructor, ElementViewInit, ElementView} from "../element/ElementView";
import {SvgViewController} from "./SvgViewController";
import {HtmlView} from "../html/HtmlView";
import {CanvasView} from "../canvas/CanvasView";

export interface ViewSvg extends SVGElement {
  view?: SvgView;
}

export interface SvgViewTagMap {
  "svg": SvgView;
}

export interface SvgChildViewTagMap {
}

export interface SvgViewAttributesInit {
  alignmentBaseline?: AttributeAnimatorInitType<SvgView, "alignmentBaseline">;
  clipPath?: AttributeAnimatorInitType<SvgView, "clipPath">;
  cursor?: AttributeAnimatorInitType<SvgView, "cursor">;
  cx?: AttributeAnimatorInitType<SvgView, "cx">;
  cy?: AttributeAnimatorInitType<SvgView, "cy">;
  d?: AttributeAnimatorInitType<SvgView, "d">;
  dx?: AttributeAnimatorInitType<SvgView, "dx">;
  dy?: AttributeAnimatorInitType<SvgView, "dy">;
  edgeMode?: AttributeAnimatorInitType<SvgView, "edgeMode">;
  fill?: AttributeAnimatorInitType<SvgView, "fill">;
  fillRule?: AttributeAnimatorInitType<SvgView, "fillRule">;
  height?: AttributeAnimatorInitType<SvgView, "height">;
  in?: AttributeAnimatorInitType<SvgView, "in">;
  in2?: AttributeAnimatorInitType<SvgView, "in2">;
  mode?: AttributeAnimatorInitType<SvgView, "mode">;
  opacity?: AttributeAnimatorInitType<SvgView, "opacity">;
  points?: AttributeAnimatorInitType<SvgView, "points">;
  preserveAspectRatio?: AttributeAnimatorInitType<SvgView, "preserveAspectRatio">;
  r?: AttributeAnimatorInitType<SvgView, "r">;
  result?: AttributeAnimatorInitType<SvgView, "result">;
  stdDeviation?: AttributeAnimatorInitType<SvgView, "stdDeviation">;
  stroke?: AttributeAnimatorInitType<SvgView, "stroke">;
  strokeDasharray?: AttributeAnimatorInitType<SvgView, "strokeDasharray">;
  strokeLinecap?: AttributeAnimatorInitType<SvgView, "strokeLinecap">;
  strokeWidth?: AttributeAnimatorInitType<SvgView, "strokeWidth">;
  textAnchor?: AttributeAnimatorInitType<SvgView, "textAnchor">;
  transform?: AttributeAnimatorInitType<SvgView, "transform">;
  type?: AttributeAnimatorInitType<SvgView, "type">;
  values?: AttributeAnimatorInitType<SvgView, "values">;
  viewBox?: AttributeAnimatorInitType<SvgView, "viewBox">;
  width?: AttributeAnimatorInitType<SvgView, "width">;
  x?: AttributeAnimatorInitType<SvgView, "x">;
  x1?: AttributeAnimatorInitType<SvgView, "x1">;
  x2?: AttributeAnimatorInitType<SvgView, "x2">;
  y?: AttributeAnimatorInitType<SvgView, "y">;
  y1?: AttributeAnimatorInitType<SvgView, "y1">;
  y2?: AttributeAnimatorInitType<SvgView, "y2">;
}

export interface SvgViewStyleInit {
  fontFamily?: StyleAnimatorInitType<SvgView, "fontFamily">;
  fontSize?: StyleAnimatorInitType<SvgView, "fontSize">;
  fontStretch?: StyleAnimatorInitType<SvgView, "fontStretch">;
  fontStyle?: StyleAnimatorInitType<SvgView, "fontStyle">;
  fontVariant?: StyleAnimatorInitType<SvgView, "fontVariant">;
  fontWeight?: StyleAnimatorInitType<SvgView, "fontWeight">;
  lineHeight?: StyleAnimatorInitType<SvgView, "lineHeight">;
  touchAction?: StyleAnimatorInitType<SvgView, "touchAction">;
}

export interface SvgViewInit extends ElementViewInit {
  viewController?: SvgViewController;
  attributes?: SvgViewAttributesInit;
  style?: SvgViewStyleInit;
}

export class SvgView extends ElementView {
  constructor(node: SVGElement) {
    super(node);
  }

  get node(): ViewSvg {
    return this._node;
  }

  get viewController(): SvgViewController | null {
    return this._viewController;
  }

  initView(init: SvgViewInit): void {
    super.initView(init);
    if (init.attributes !== void 0) {
      this.initAttributes(init.attributes);
    }
    if (init.style !== void 0) {
      this.initStyle(init.style);
    }
  }

  initAttributes(init: SvgViewAttributesInit): void {
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
    if (init.fillRule !== void 0) {
      this.fillRule(init.fillRule);
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
    if (init.mode !== void 0) {
      this.mode(init.mode);
    }
    if (init.opacity !== void 0) {
      this.opacity(init.opacity);
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
    if (init.strokeLinecap !== void 0) {
      this.strokeLinecap(init.strokeLinecap);
    }
    if (init.strokeWidth !== void 0) {
      this.strokeWidth(init.strokeWidth);
    }
    if (init.textAnchor !== void 0) {
      this.textAnchor(init.textAnchor);
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

  initStyle(init: SvgViewStyleInit): void {
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

  append<T extends keyof SvgChildViewTagMap>(tag: T, key?: string): SvgChildViewTagMap[T];
  append(tag: string, key?: string): SvgView;
  append(childNode: SVGElement, key?: string): SvgView;
  append(childNode: Element, key?: string): ElementView;
  append(childNode: Text, key?: string): TextView;
  append(childNode: Node, key?: string): NodeView;
  append<V extends NodeView>(childView: V, key?: string): V;
  append<C extends ElementViewConstructor>(viewConstructor: C, key?: string): InstanceType<C>;
  append(child: string | Node | NodeView | ElementViewConstructor, key?: string): NodeView {
    if (typeof child === "string") {
      child = SvgView.fromTag(child);
    } else if (child instanceof Node) {
      child = SvgView.fromNode(child);
    } else if (typeof child === "function") {
      child = SvgView.fromConstructor(child);
    }
    this.appendChildView(child, key);
    return child;
  }

  prepend<T extends keyof SvgChildViewTagMap>(tag: T, key?: string): SvgChildViewTagMap[T];
  prepend(tag: string, key?: string): SvgView;
  prepend(childNode: SVGElement, key?: string): SvgView;
  prepend(childNode: Element, key?: string): ElementView;
  prepend(childNode: Text, key?: string): TextView;
  prepend(childNode: Node, key?: string): NodeView;
  prepend<V extends NodeView>(childView: V, key?: string): V;
  prepend<C extends ElementViewConstructor>(viewConstructor: C, key?: string): InstanceType<C>;
  prepend(child: string | Node | NodeView | ElementViewConstructor, key?: string): NodeView {
    if (typeof child === "string") {
      child = SvgView.fromTag(child);
    } else if (child instanceof Node) {
      child = SvgView.fromNode(child);
    } else if (typeof child === "function") {
      child = SvgView.fromConstructor(child);
    }
    this.prependChildView(child, key);
    return child;
  }

  insert<T extends keyof SvgChildViewTagMap>(tag: T, target: View | Node | null, key?: string): SvgChildViewTagMap[T];
  insert(tag: string, target: View | Node | null, key?: string): SvgView;
  insert(childNode: SVGElement, target: View | Node | null, key?: string): SvgView;
  insert(childNode: Element, target: View | Node | null, key?: string): ElementView;
  insert(childNode: Text, target: View | Node | null, key?: string): TextView;
  insert(childNode: Node, target: View | Node | null, key?: string): NodeView;
  insert<V extends NodeView>(childView: V, target: View | Node | null, key?: string): V;
  insert<C extends ElementViewConstructor>(viewConstructor: C, target: View | Node | null, key?: string): InstanceType<C>;
  insert(child: string | Node | NodeView | ElementViewConstructor, target: View | Node | null, key?: string): NodeView {
    if (typeof child === "string") {
      child = SvgView.fromTag(child);
    } else if (child instanceof Node) {
      child = SvgView.fromNode(child);
    } else if (typeof child === "function") {
      child = SvgView.fromConstructor(child);
    }
    this.insertChild(child, target, key);
    return child;
  }

  get parentTransform(): Transform {
    const transform = this.transform.value;
    return transform !== void 0 ? transform : Transform.identity();
  }

  on<T extends keyof SVGElementEventMap>(type: T, listener: (this: SVGElement, event: SVGElementEventMap[T]) => unknown,
                                         options?: AddEventListenerOptions | boolean): this;
  on(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): this;
  on(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): this {
    this._node.addEventListener(type, listener, options);
    return this;
  }

  off<T extends keyof SVGElementEventMap>(type: T, listener: (this: SVGElement, event: SVGElementEventMap[T]) => unknown,
                                          options?: EventListenerOptions | boolean): this;
  off(type: string, listener: EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): this;
  off(type: string, listener: EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): this {
    this._node.removeEventListener(type, listener, options);
    return this;
  }

  @AttributeAnimator("alignment-baseline", String)
  alignmentBaseline: AttributeAnimator<this, AlignmentBaseline>;

  @AttributeAnimator("clip-path", String)
  clipPath: AttributeAnimator<this, string>;

  @AttributeAnimator("cursor", String)
  cursor: AttributeAnimator<this, CssCursor>;

  @AttributeAnimator("cx", Number)
  cx: AttributeAnimator<this, number, number | string>;

  @AttributeAnimator("cy", Number)
  cy: AttributeAnimator<this, number, number | string>;

  @AttributeAnimator("d", String)
  d: AttributeAnimator<this, string>;

  @AttributeAnimator("dx", [Number, String]) // list-of-lengths
  dx: AttributeAnimator<this, number, number | string>;

  @AttributeAnimator("dy", [Number, String]) // list-of-lengths
  dy: AttributeAnimator<this, number, number | string>;

  @AttributeAnimator("edgeMode", String)
  edgeMode: AttributeAnimator<this, string>;

  @AttributeAnimator("fill", [Color, String])
  fill: AttributeAnimator<this, Paint, AnyColor | Paint>;

  @AttributeAnimator("fill-rule", String)
  fillRule: AttributeAnimator<this, FillRule>;

  @AttributeAnimator("height", Length)
  height: AttributeAnimator<this, Length, AnyLength>;

  @AttributeAnimator("in", String)
  in: AttributeAnimator<this, string>;

  @AttributeAnimator("in2", String)
  in2: AttributeAnimator<this, string>;

  @AttributeAnimator("mode", String)
  mode: AttributeAnimator<this, string>;

  @AttributeAnimator("opacity", Number)
  opacity: AttributeAnimator<this, number>;

  @AttributeAnimator("points", String)
  points: AttributeAnimator<this, string>;

  @AttributeAnimator("preserveAspectRatio", Boolean)
  preserveAspectRatio: AttributeAnimator<this, boolean, boolean | string>;

  @AttributeAnimator("r", Number)
  r: AttributeAnimator<this, number, number | string>;

  @AttributeAnimator("result", String)
  result: AttributeAnimator<this, string>;

  @AttributeAnimator("stdDeviation", String)
  stdDeviation: AttributeAnimator<this, string>;

  @AttributeAnimator("stroke", [Color, String])
  stroke: AttributeAnimator<this, Paint, AnyColor | Paint>;

  @AttributeAnimator("stroke-dasharray", String)
  strokeDasharray: AttributeAnimator<this, string>;

  @AttributeAnimator("stroke-linecap", String)
  strokeLinecap: AttributeAnimator<this, StrokeLinecap>;

  @AttributeAnimator("stroke-width", Number)
  strokeWidth: AttributeAnimator<this, number, number | string>;

  @AttributeAnimator("text-anchor", String)
  textAnchor: AttributeAnimator<this, TextAnchor>;

  @AttributeAnimator("transform", Transform)
  transform: AttributeAnimator<this, Transform, AnyTransform>;

  @AttributeAnimator("type", String)
  type: AttributeAnimator<this, string>;

  @AttributeAnimator("values", String)
  values: AttributeAnimator<this, string>;

  @AttributeAnimator("viewBox", String)
  viewBox: AttributeAnimator<this, string>;

  @AttributeAnimator("width", Length)
  width: AttributeAnimator<this, Length, AnyLength>;

  @AttributeAnimator("x", Number)
  x: AttributeAnimator<this, number, number | string>;

  @AttributeAnimator("x1", Number)
  x1: AttributeAnimator<this, number, number | string>;

  @AttributeAnimator("x2", Number)
  x2: AttributeAnimator<this, number, number | string>;

  @AttributeAnimator("y", Number)
  y: AttributeAnimator<this, number, number | string>;

  @AttributeAnimator("y1", Number)
  y1: AttributeAnimator<this, number, number | string>;

  @AttributeAnimator("y2", Number)
  y2: AttributeAnimator<this, number, number | string>;

  font(): Font | undefined;
  font(value: AnyFont | undefined, tween?: Tween<any>, priority?: string): this;
  font(value?: AnyFont | undefined, tween?: Tween<any>, priority?: string): Font | undefined | this {
    if (value === void 0) {
      const style = this.fontStyle();
      const variant = this.fontVariant();
      const weight = this.fontWeight();
      const stretch = this.fontStretch();
      const size = this.fontSize();
      const height = this.lineHeight();
      const family = this.fontFamily();
      if (family !== void 0) {
        return Font.from(style, variant, weight, stretch, size, height, family);
      } else {
        return void 0;
      }
    } else {
      if (value !== void 0) {
        value = Font.fromAny(value);
      }
      if (value === void 0 || value.style() !== null) {
        this.fontStyle(value !== void 0 ? value.style() || void 0 : void 0, tween, priority);
      }
      if (value === void 0 || value.variant() !== null) {
        this.fontVariant(value !== void 0 ? value.variant() || void 0 : void 0, tween, priority);
      }
      if (value === void 0 || value.weight() !== null) {
        this.fontWeight(value !== void 0 ? value.weight() || void 0 : void 0, tween, priority);
      }
      if (value === void 0 || value.stretch() !== null) {
        this.fontStretch(value !== void 0 ? value.stretch() || void 0 : void 0, tween, priority);
      }
      if (value === void 0 || value.size() !== null) {
        this.fontSize(value !== void 0 ? value.size() || void 0 : void 0, tween, priority);
      }
      if (value === void 0 || value.height() !== null) {
        this.lineHeight(value !== void 0 ? value.height() || void 0 : void 0, tween, priority);
      }
      this.fontFamily(value !== void 0 ? value.family() : void 0, tween, priority);
      return this;
    }
  }

  @StyleAnimator("font-family", FontFamily)
  fontFamily: StyleAnimator<this, FontFamily | FontFamily[], FontFamily | ReadonlyArray<FontFamily>>;

  @StyleAnimator("font-size", [Length, String])
  fontSize: StyleAnimator<this, FontSize, AnyFontSize>;

  @StyleAnimator("font-stretch", String)
  fontStretch: StyleAnimator<this, FontStretch>;

  @StyleAnimator("font-style", String)
  fontStyle: StyleAnimator<this, FontStyle>;

  @StyleAnimator("font-variant", String)
  fontVariant: StyleAnimator<this, FontVariant>;

  @StyleAnimator("font-weight", String)
  fontWeight: StyleAnimator<this, FontWeight>;

  @StyleAnimator("line-height", LineHeight)
  lineHeight: StyleAnimator<this, LineHeight, AnyLineHeight>;

  @StyleAnimator("touch-action", String)
  touchAction: StyleAnimator<this, TouchAction>;

  static fromTag<T extends keyof SvgViewTagMap>(tag: T): SvgViewTagMap[T];
  static fromTag(tag: string): SvgView;
  static fromTag(tag: string): SvgView {
    return new SvgView(document.createElementNS(SvgView.namespace, tag) as SVGElement);
  }

  static fromNode(node: HTMLCanvasElement): CanvasView;
  static fromNode(node: HTMLElement): HtmlView;
  static fromNode(node: SVGElement): SvgView;
  static fromNode(node: Element): ElementView;
  static fromNode(node: Text): TextView;
  static fromNode(node: Node): NodeView;
  static fromNode(node: ViewNode): NodeView {
    if (node.view instanceof View) {
      return node.view;
    } else if (node instanceof SVGElement) {
      return new SvgView(node);
    }
    throw new TypeError("" + node);
  }

  static create<T extends keyof SvgViewTagMap>(tag: T): SvgViewTagMap[T];
  static create(tag: string): SvgView;
  static create(node: SVGElement): SvgView;
  static create<C extends ElementViewConstructor<SVGElement, SvgView>>(viewConstructor: C): InstanceType<C>;
  static create(source: string | SVGElement | ElementViewConstructor<SVGElement, SvgView>): SvgView {
    if (typeof source === "string") {
      return SvgView.fromTag(source);
    } else if (source instanceof SVGElement) {
      return SvgView.fromNode(source);
    } else if (typeof source === "function") {
      return SvgView.fromConstructor(source);
    }
    throw new TypeError("" + source);
  }

  /** @hidden */
  static readonly tag: string = "svg";

  /** @hidden */
  static readonly namespace: string = "http://www.w3.org/2000/svg";
}
View.Svg = SvgView;
