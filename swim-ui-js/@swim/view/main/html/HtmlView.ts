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

import {Objects} from "@swim/util";
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
import {AnyBoxShadow, BoxShadow} from "@swim/shadow";
import {AnyLinearGradient, LinearGradient} from "@swim/gradient";
import {AnyTransform, Transform} from "@swim/transform";
import {Tween} from "@swim/transition";
import {
  AlignContent,
  AlignItems,
  AlignSelf,
  Appearance,
  BackgroundClip,
  BorderCollapse,
  BorderStyle,
  BorderWidth,
  BoxSizing,
  CssCursor,
  CssDisplay,
  FlexBasis,
  FlexDirection,
  FlexWrap,
  Height,
  JustifyContent,
  MaxHeight,
  MaxWidth,
  MinHeight,
  MinWidth,
  Overflow,
  OverscrollBehavior,
  PointerEvents,
  Position,
  TextAlign,
  TextDecorationStyle,
  TextTransform,
  TouchAction,
  UserSelect,
  VerticalAlign,
  Visibility,
  WhiteSpace,
  Width,
} from "@swim/style";
import {View} from "../View";
import {LayoutAnchor} from "../layout/LayoutAnchor";
import {NodeView} from "../node/NodeView";
import {TextView} from "../text/TextView";
import {AttributeAnimatorMemberInit, AttributeAnimator} from "../attribute/AttributeAnimator";
import {StyleAnimatorMemberInit, StyleAnimator} from "../style/StyleAnimator";
import {ElementViewConstructor, ElementViewInit, ElementView} from "../element/ElementView";
import {SvgView} from "../svg/SvgView";
import {HtmlViewObserver} from "./HtmlViewObserver";
import {HtmlViewController} from "./HtmlViewController";
import {CanvasView} from "../canvas/CanvasView";

export interface ViewHtml extends HTMLElement {
  view?: HtmlView;
}

export interface HtmlViewTagMap {
  "canvas": CanvasView;
}

export interface HtmlChildViewTagMap extends HtmlViewTagMap {
  "svg": SvgView;
}

export interface HtmlViewAttributesInit {
  autocomplete?: AttributeAnimatorMemberInit<HtmlView, "autocomplete">;
  checked?: AttributeAnimatorMemberInit<HtmlView, "checked">;
  colspan?: AttributeAnimatorMemberInit<HtmlView, "colspan">;
  disabled?: AttributeAnimatorMemberInit<HtmlView, "disabled">;
  placeholder?: AttributeAnimatorMemberInit<HtmlView, "placeholder">;
  rowspan?: AttributeAnimatorMemberInit<HtmlView, "rowspan">;
  selected?: AttributeAnimatorMemberInit<HtmlView, "selected">;
  title?: AttributeAnimatorMemberInit<HtmlView, "title">;
  type?: AttributeAnimatorMemberInit<HtmlView, "type">;
  value?: AttributeAnimatorMemberInit<HtmlView, "value">;
}

export interface HtmlViewStyleInit {
  alignContent?: StyleAnimatorMemberInit<HtmlView, "alignContent">;
  alignItems?: StyleAnimatorMemberInit<HtmlView, "alignItems">;
  alignSelf?: StyleAnimatorMemberInit<HtmlView, "alignSelf">;
  appearance?: StyleAnimatorMemberInit<HtmlView, "appearance">;
  backdropFilter?: StyleAnimatorMemberInit<HtmlView, "backdropFilter">;
  backgroundClip?: StyleAnimatorMemberInit<HtmlView, "backgroundClip">;
  backgroundColor?: StyleAnimatorMemberInit<HtmlView, "backgroundColor">;
  backgroundImage?: StyleAnimatorMemberInit<HtmlView, "backgroundImage">;
  borderCollapse?: StyleAnimatorMemberInit<HtmlView, "borderCollapse">;
  borderColor?: [AnyColor | "currentColor" | undefined,
                 AnyColor | "currentColor" | undefined,
                 AnyColor | "currentColor" | undefined,
                 AnyColor | "currentColor" | undefined] |
                AnyColor | "currentColor";
  borderTopColor?: StyleAnimatorMemberInit<HtmlView, "borderTopColor">;
  borderRightColor?: StyleAnimatorMemberInit<HtmlView, "borderRightColor">;
  borderBottomColor?: StyleAnimatorMemberInit<HtmlView, "borderBottomColor">;
  borderLeftColor?: StyleAnimatorMemberInit<HtmlView, "borderLeftColor">;
  borderRadius?: [AnyLength | undefined,
                  AnyLength | undefined,
                  AnyLength | undefined,
                  AnyLength | undefined] |
                 AnyLength;
  borderTopLeftRadius?: StyleAnimatorMemberInit<HtmlView, "borderTopLeftRadius">;
  borderTopRightRadius?: StyleAnimatorMemberInit<HtmlView, "borderTopRightRadius">;
  borderBottomRightRadius?: StyleAnimatorMemberInit<HtmlView, "borderBottomRightRadius">;
  borderBottomLeftRadius?: StyleAnimatorMemberInit<HtmlView, "borderBottomLeftRadius">;
  borderSpacing?: StyleAnimatorMemberInit<HtmlView, "borderSpacing">;
  borderStyle?: [BorderStyle | undefined,
                 BorderStyle | undefined,
                 BorderStyle | undefined,
                 BorderStyle | undefined] |
                BorderStyle;
  borderTopStyle?: StyleAnimatorMemberInit<HtmlView, "borderTopStyle">;
  borderRightStyle?: StyleAnimatorMemberInit<HtmlView, "borderRightStyle">;
  borderBottomStyle?: StyleAnimatorMemberInit<HtmlView, "borderBottomStyle">;
  borderLeftStyle?: StyleAnimatorMemberInit<HtmlView, "borderLeftStyle">;
  borderWidth?: [BorderWidth | AnyLength | undefined,
                 BorderWidth | AnyLength | undefined,
                 BorderWidth | AnyLength | undefined,
                 BorderWidth | AnyLength | undefined] |
                BorderWidth | AnyLength;
  borderTopWidth?: StyleAnimatorMemberInit<HtmlView, "borderTopWidth">;
  borderRightWidth?: StyleAnimatorMemberInit<HtmlView, "borderRightWidth">;
  borderBottomWidth?: StyleAnimatorMemberInit<HtmlView, "borderBottomWidth">;
  borderLeftWidth?: StyleAnimatorMemberInit<HtmlView, "borderLeftWidth">;
  bottom?: StyleAnimatorMemberInit<HtmlView, "bottom">;
  boxShadow?: StyleAnimatorMemberInit<HtmlView, "boxShadow">;
  boxSizing?: StyleAnimatorMemberInit<HtmlView, "boxSizing">;
  color?: StyleAnimatorMemberInit<HtmlView, "color">;
  cursor?: StyleAnimatorMemberInit<HtmlView, "cursor">;
  display?: StyleAnimatorMemberInit<HtmlView, "display">;
  filter?: StyleAnimatorMemberInit<HtmlView, "filter">;
  flexBasis?: StyleAnimatorMemberInit<HtmlView, "flexBasis">;
  flexDirection?: StyleAnimatorMemberInit<HtmlView, "flexDirection">;
  flexGrow?: StyleAnimatorMemberInit<HtmlView, "flexGrow">;
  flexShrink?: StyleAnimatorMemberInit<HtmlView, "flexShrink">;
  flexWrap?: StyleAnimatorMemberInit<HtmlView, "flexWrap">;
  font?: AnyFont;
  fontFamily?: StyleAnimatorMemberInit<HtmlView, "fontFamily">;
  fontSize?: StyleAnimatorMemberInit<HtmlView, "fontSize">;
  fontStretch?: StyleAnimatorMemberInit<HtmlView, "fontStretch">;
  fontStyle?: StyleAnimatorMemberInit<HtmlView, "fontStyle">;
  fontVariant?: StyleAnimatorMemberInit<HtmlView, "fontVariant">;
  fontWeight?: StyleAnimatorMemberInit<HtmlView, "fontWeight">;
  height?: StyleAnimatorMemberInit<HtmlView, "height">;
  justifyContent?: StyleAnimatorMemberInit<HtmlView, "justifyContent">;
  left?: StyleAnimatorMemberInit<HtmlView, "left">;
  lineHeight?: StyleAnimatorMemberInit<HtmlView, "lineHeight">;
  margin?: [AnyLength | "auto" | undefined,
            AnyLength | "auto" | undefined,
            AnyLength | "auto" | undefined,
            AnyLength | "auto" | undefined] |
           AnyLength | "auto";
  marginTop?: StyleAnimatorMemberInit<HtmlView, "marginTop">;
  marginRight?: StyleAnimatorMemberInit<HtmlView, "marginRight">;
  marginBottom?: StyleAnimatorMemberInit<HtmlView, "marginBottom">;
  marginLeft?: StyleAnimatorMemberInit<HtmlView, "marginLeft">;
  maxHeight?: StyleAnimatorMemberInit<HtmlView, "maxHeight">;
  maxWidth?: StyleAnimatorMemberInit<HtmlView, "maxWidth">;
  minHeight?: StyleAnimatorMemberInit<HtmlView, "minHeight">;
  minWidth?: StyleAnimatorMemberInit<HtmlView, "minWidth">;
  opacity?: StyleAnimatorMemberInit<HtmlView, "opacity">;
  order?: StyleAnimatorMemberInit<HtmlView, "order">;
  outlineColor?: StyleAnimatorMemberInit<HtmlView, "outlineColor">;
  outlineStyle?: StyleAnimatorMemberInit<HtmlView, "outlineStyle">;
  outlineWidth?: StyleAnimatorMemberInit<HtmlView, "outlineWidth">;
  overflow?: [Overflow | undefined,
              Overflow | undefined] |
             Overflow;
  overflowX?: StyleAnimatorMemberInit<HtmlView, "overflowX">;
  overflowY?: StyleAnimatorMemberInit<HtmlView, "overflowY">;
  overflowScrolling?: StyleAnimatorMemberInit<HtmlView, "overflowScrolling">;
  overscrollBehavior?: [OverscrollBehavior | undefined,
                        OverscrollBehavior | undefined] |
                       OverscrollBehavior;
  overscrollBehaviorX?: StyleAnimatorMemberInit<HtmlView, "overscrollBehaviorX">;
  overscrollBehaviorY?: StyleAnimatorMemberInit<HtmlView, "overscrollBehaviorY">;
  padding?: [AnyLength | undefined,
             AnyLength | undefined,
             AnyLength | undefined,
             AnyLength | undefined] |
            AnyLength;
  paddingTop?: StyleAnimatorMemberInit<HtmlView, "paddingTop">;
  paddingRight?: StyleAnimatorMemberInit<HtmlView, "paddingRight">;
  paddingBottom?: StyleAnimatorMemberInit<HtmlView, "paddingBottom">;
  paddingLeft?: StyleAnimatorMemberInit<HtmlView, "paddingLeft">;
  pointerEvents?: StyleAnimatorMemberInit<HtmlView, "pointerEvents">;
  position?: StyleAnimatorMemberInit<HtmlView, "position">;
  right?: StyleAnimatorMemberInit<HtmlView, "right">;
  textAlign?: StyleAnimatorMemberInit<HtmlView, "textAlign">;
  textDecorationColor?: StyleAnimatorMemberInit<HtmlView, "textDecorationColor">;
  textDecorationLine?: StyleAnimatorMemberInit<HtmlView, "textDecorationLine">;
  textDecorationStyle?: StyleAnimatorMemberInit<HtmlView, "textDecorationStyle">;
  textOverflow?: StyleAnimatorMemberInit<HtmlView, "textOverflow">;
  textTransform?: StyleAnimatorMemberInit<HtmlView, "textTransform">;
  top?: StyleAnimatorMemberInit<HtmlView, "top">;
  touchAction?: StyleAnimatorMemberInit<HtmlView, "touchAction">;
  transform?: StyleAnimatorMemberInit<HtmlView, "transform">;
  userSelect?: StyleAnimatorMemberInit<HtmlView, "userSelect">;
  verticalAlign?: StyleAnimatorMemberInit<HtmlView, "verticalAlign">;
  visibility?: StyleAnimatorMemberInit<HtmlView, "visibility">;
  whiteSpace?: StyleAnimatorMemberInit<HtmlView, "whiteSpace">;
  width?: StyleAnimatorMemberInit<HtmlView, "width">;
  zIndex?: StyleAnimatorMemberInit<HtmlView, "zIndex">;
}

export interface HtmlViewInit extends ElementViewInit {
  viewController?: HtmlViewController;
  attributes?: HtmlViewAttributesInit;
  style?: HtmlViewStyleInit;
}

export class HtmlView extends ElementView {
  constructor(node: HTMLElement) {
    super(node);
  }

  get node(): ViewHtml {
    return this._node;
  }

  readonly viewController: HtmlViewController | null;

  readonly viewObservers: ReadonlyArray<HtmlViewObserver>;

  initView(init: HtmlViewInit): void {
    super.initView(init);
    if (init.attributes !== void 0) {
      this.initAttributes(init.attributes);
    }
    if (init.style !== void 0) {
      this.initStyle(init.style);
    }
  }

  initAttributes(init: HtmlViewAttributesInit): void {
    if (init.autocomplete !== void 0) {
      this.autocomplete(init.autocomplete);
    }
    if (init.checked !== void 0) {
      this.checked(init.checked);
    }
    if (init.colspan !== void 0) {
      this.colspan(init.colspan);
    }
    if (init.disabled !== void 0) {
      this.disabled(init.disabled);
    }
    if (init.placeholder !== void 0) {
      this.placeholder(init.placeholder);
    }
    if (init.rowspan !== void 0) {
      this.rowspan(init.rowspan);
    }
    if (init.selected !== void 0) {
      this.selected(init.selected);
    }
    if (init.title !== void 0) {
      this.title(init.title);
    }
    if (init.type !== void 0) {
      this.type(init.type);
    }
    if (init.value !== void 0) {
      this.value(init.value);
    }
  }

  initStyle(init: HtmlViewStyleInit): void {
    if (init.alignContent !== void 0) {
      this.alignContent(init.alignContent);
    }
    if (init.alignItems !== void 0) {
      this.alignItems(init.alignItems);
    }
    if (init.alignSelf !== void 0) {
      this.alignSelf(init.alignSelf);
    }
    if (init.appearance !== void 0) {
      this.appearance(init.appearance);
    }
    if (init.backdropFilter !== void 0) {
      this.backdropFilter(init.backdropFilter);
    }
    if (init.backgroundClip !== void 0) {
      this.backgroundClip(init.backgroundClip);
    }
    if (init.backgroundColor !== void 0) {
      this.backgroundColor(init.backgroundColor);
    }
    if (init.backgroundImage !== void 0) {
      this.backgroundImage(init.backgroundImage);
    }
    if (init.borderCollapse !== void 0) {
      this.borderCollapse(init.borderCollapse);
    }
    if (init.borderColor !== void 0) {
      this.borderColor(init.borderColor);
    }
    if (init.borderTopColor !== void 0) {
      this.borderTopColor(init.borderTopColor);
    }
    if (init.borderRightColor !== void 0) {
      this.borderRightColor(init.borderRightColor);
    }
    if (init.borderBottomColor !== void 0) {
      this.borderBottomColor(init.borderBottomColor);
    }
    if (init.borderLeftColor !== void 0) {
      this.borderLeftColor(init.borderLeftColor);
    }
    if (init.borderRadius !== void 0) {
      this.borderRadius(init.borderRadius);
    }
    if (init.borderTopLeftRadius !== void 0) {
      this.borderTopLeftRadius(init.borderTopLeftRadius);
    }
    if (init.borderTopRightRadius !== void 0) {
      this.borderTopRightRadius(init.borderTopRightRadius);
    }
    if (init.borderBottomRightRadius !== void 0) {
      this.borderBottomRightRadius(init.borderBottomRightRadius);
    }
    if (init.borderBottomLeftRadius !== void 0) {
      this.borderBottomLeftRadius(init.borderBottomLeftRadius);
    }
    if (init.borderSpacing !== void 0) {
      this.borderSpacing(init.borderSpacing);
    }
    if (init.borderStyle !== void 0) {
      this.borderStyle(init.borderStyle);
    }
    if (init.borderTopStyle !== void 0) {
      this.borderTopStyle(init.borderTopStyle);
    }
    if (init.borderRightStyle !== void 0) {
      this.borderRightStyle(init.borderRightStyle);
    }
    if (init.borderBottomStyle !== void 0) {
      this.borderBottomStyle(init.borderBottomStyle);
    }
    if (init.borderLeftStyle !== void 0) {
      this.borderLeftStyle(init.borderLeftStyle);
    }
    if (init.borderWidth !== void 0) {
      this.borderWidth(init.borderWidth);
    }
    if (init.borderTopWidth !== void 0) {
      this.borderTopWidth(init.borderTopWidth);
    }
    if (init.borderRightWidth !== void 0) {
      this.borderRightWidth(init.borderRightWidth);
    }
    if (init.borderBottomWidth !== void 0) {
      this.borderBottomWidth(init.borderBottomWidth);
    }
    if (init.borderLeftWidth !== void 0) {
      this.borderLeftWidth(init.borderLeftWidth);
    }
    if (init.bottom !== void 0) {
      this.bottom(init.bottom);
    }
    if (init.boxShadow !== void 0) {
      this.boxShadow(init.boxShadow);
    }
    if (init.boxSizing !== void 0) {
      this.boxSizing(init.boxSizing);
    }
    if (init.color !== void 0) {
      this.color(init.color);
    }
    if (init.cursor !== void 0) {
      this.cursor(init.cursor);
    }
    if (init.display !== void 0) {
      this.display(init.display);
    }
    if (init.filter !== void 0) {
      this.filter(init.filter);
    }
    if (init.flexBasis !== void 0) {
      this.flexBasis(init.flexBasis);
    }
    if (init.flexDirection !== void 0) {
      this.flexDirection(init.flexDirection);
    }
    if (init.flexGrow !== void 0) {
      this.flexGrow(init.flexGrow);
    }
    if (init.flexShrink !== void 0) {
      this.flexShrink(init.flexShrink);
    }
    if (init.flexWrap !== void 0) {
      this.flexWrap(init.flexWrap);
    }
    if (init.font !== void 0) {
      this.font(init.font);
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
    if (init.height !== void 0) {
      this.height(init.height);
    }
    if (init.justifyContent !== void 0) {
      this.justifyContent(init.justifyContent);
    }
    if (init.left !== void 0) {
      this.left(init.left);
    }
    if (init.lineHeight !== void 0) {
      this.lineHeight(init.lineHeight);
    }
    if (init.margin !== void 0) {
      this.margin(init.margin);
    }
    if (init.marginTop !== void 0) {
      this.marginTop(init.marginTop);
    }
    if (init.marginRight !== void 0) {
      this.marginRight(init.marginRight);
    }
    if (init.marginBottom !== void 0) {
      this.marginBottom(init.marginBottom);
    }
    if (init.marginLeft !== void 0) {
      this.marginLeft(init.marginLeft);
    }
    if (init.maxHeight !== void 0) {
      this.maxHeight(init.maxHeight);
    }
    if (init.maxWidth !== void 0) {
      this.maxWidth(init.maxWidth);
    }
    if (init.minHeight !== void 0) {
      this.minHeight(init.minHeight);
    }
    if (init.minWidth !== void 0) {
      this.minWidth(init.minWidth);
    }
    if (init.opacity !== void 0) {
      this.opacity(init.opacity);
    }
    if (init.order !== void 0) {
      this.order(init.order);
    }
    if (init.outlineColor !== void 0) {
      this.outlineColor(init.outlineColor);
    }
    if (init.outlineStyle !== void 0) {
      this.outlineStyle(init.outlineStyle);
    }
    if (init.outlineWidth !== void 0) {
      this.outlineWidth(init.outlineWidth);
    }
    if (init.overflow !== void 0) {
      this.overflow(init.overflow);
    }
    if (init.overflowX !== void 0) {
      this.overflowX(init.overflowX);
    }
    if (init.overflowY !== void 0) {
      this.overflowY(init.overflowY);
    }
    if (init.overflowScrolling !== void 0) {
      this.overflowScrolling(init.overflowScrolling);
    }
    if (init.overscrollBehavior !== void 0) {
      this.overscrollBehavior(init.overscrollBehavior);
    }
    if (init.overscrollBehaviorX !== void 0) {
      this.overscrollBehaviorX(init.overscrollBehaviorX);
    }
    if (init.overscrollBehaviorY !== void 0) {
      this.overscrollBehaviorY(init.overscrollBehaviorY);
    }
    if (init.padding !== void 0) {
      this.padding(init.padding);
    }
    if (init.paddingTop !== void 0) {
      this.paddingTop(init.paddingTop);
    }
    if (init.paddingRight !== void 0) {
      this.paddingRight(init.paddingRight);
    }
    if (init.paddingBottom !== void 0) {
      this.paddingBottom(init.paddingBottom);
    }
    if (init.paddingLeft !== void 0) {
      this.paddingLeft(init.paddingLeft);
    }
    if (init.pointerEvents !== void 0) {
      this.pointerEvents(init.pointerEvents);
    }
    if (init.position !== void 0) {
      this.position(init.position);
    }
    if (init.right !== void 0) {
      this.right(init.right);
    }
    if (init.textAlign !== void 0) {
      this.textAlign(init.textAlign);
    }
    if (init.textDecorationColor !== void 0) {
      this.textDecorationColor(init.textDecorationColor);
    }
    if (init.textDecorationLine !== void 0) {
      this.textDecorationLine(init.textDecorationLine);
    }
    if (init.textDecorationStyle !== void 0) {
      this.textDecorationStyle(init.textDecorationStyle);
    }
    if (init.textOverflow !== void 0) {
      this.textOverflow(init.textOverflow);
    }
    if (init.textTransform !== void 0) {
      this.textTransform(init.textTransform);
    }
    if (init.top !== void 0) {
      this.top(init.top);
    }
    if (init.touchAction !== void 0) {
      this.touchAction(init.touchAction);
    }
    if (init.transform !== void 0) {
      this.transform(init.transform);
    }
    if (init.userSelect !== void 0) {
      this.userSelect(init.userSelect);
    }
    if (init.verticalAlign !== void 0) {
      this.verticalAlign(init.verticalAlign);
    }
    if (init.visibility !== void 0) {
      this.visibility(init.visibility);
    }
    if (init.whiteSpace !== void 0) {
      this.whiteSpace(init.whiteSpace);
    }
    if (init.width !== void 0) {
      this.width(init.width);
    }
    if (init.zIndex !== void 0) {
      this.zIndex(init.zIndex);
    }
  }

  append<T extends keyof HtmlChildViewTagMap>(tag: T, key?: string): HtmlChildViewTagMap[T];
  append(tag: string, key?: string): HtmlView;
  append(childNode: HTMLElement, key?: string): HtmlView;
  append(childNode: SVGElement, key?: string): SvgView;
  append(childNode: Element, key?: string): ElementView;
  append(childNode: Text, key?: string): TextView;
  append(childNode: Node, key?: string): NodeView;
  append<V extends NodeView>(childView: V, key?: string): V;
  append<VC extends ElementViewConstructor>(viewConstructor: VC, key?: string): InstanceType<VC>;
  append(child: string | Node | NodeView | ElementViewConstructor, key?: string): NodeView {
    if (typeof child === "string") {
      child = View.fromTag(child);
    } else if (child instanceof Node) {
      child = View.fromNode(child);
    } else if (typeof child === "function") {
      child = View.fromConstructor(child);
    }
    this.appendChildView(child, key);
    return child;
  }

  prepend<T extends keyof HtmlChildViewTagMap>(tag: T, key?: string): HtmlChildViewTagMap[T];
  prepend(tag: string, key?: string): HtmlView;
  prepend(childNode: HTMLElement, key?: string): HtmlView;
  prepend(childNode: SVGElement, key?: string): SvgView;
  prepend(childNode: Element, key?: string): ElementView;
  prepend(childNode: Text, key?: string): TextView;
  prepend(childNode: Node, key?: string): NodeView;
  prepend<V extends NodeView>(childView: V, key?: string): V;
  prepend<VC extends ElementViewConstructor>(viewConstructor: VC, key?: string): InstanceType<VC>;
  prepend(child: string | Node | NodeView | ElementViewConstructor, key?: string): NodeView {
    if (typeof child === "string") {
      child = View.fromTag(child);
    } else if (child instanceof Node) {
      child = View.fromNode(child);
    } else if (typeof child === "function") {
      child = View.fromConstructor(child);
    }
    this.prependChildView(child, key);
    return child;
  }

  insert<T extends keyof HtmlChildViewTagMap>(tag: T, target: View | Node | null, key?: string): HtmlChildViewTagMap[T];
  insert(tag: string, target: View | Node | null, key?: string): HtmlView;
  insert(childNode: HTMLElement, target: View | Node | null, key?: string): HtmlView;
  insert(childNode: SVGElement, target: View | Node | null, key?: string): SvgView;
  insert(childNode: Element, target: View | Node | null, key?: string): ElementView;
  insert(childNode: Text, target: View | Node | null, key?: string): TextView;
  insert(childNode: Node, target: View | Node | null, key?: string): NodeView;
  insert<V extends NodeView>(childView: V, target: View | Node | null, key?: string): V;
  insert<VC extends ElementViewConstructor>(viewConstructor: VC, target: View | Node | null, key?: string): InstanceType<VC>;
  insert(child: string | Node | NodeView | ElementViewConstructor, target: View | Node | null, key?: string): NodeView {
    if (typeof child === "string") {
      child = View.fromTag(child);
    } else if (child instanceof Node) {
      child = View.fromNode(child);
    } else if (typeof child === "function") {
      child = View.fromConstructor(child);
    }
    this.insertChild(child, target, key);
    return child;
  }

  isPositioned(): boolean {
    const style = window.getComputedStyle(this._node);
    return style.position === "relative" || style.position === "absolute";
  }

  get parentTransform(): Transform {
    const transform = this.transform.value;
    if (transform !== void 0) {
      return transform;
    } else if (this.isPositioned()) {
      const dx = this._node.offsetLeft;
      const dy = this._node.offsetTop;
      if (dx !== 0 || dy !== 0) {
        return Transform.translate(-dx, -dy);
      }
    }
    return Transform.identity();
  }

  on<T extends keyof HTMLElementEventMap>(type: T, listener: (this: HTMLElement, event: HTMLElementEventMap[T]) => unknown,
                                          options?: AddEventListenerOptions | boolean): this;
  on(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): this;
  on(type: string, listener: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): this {
    this._node.addEventListener(type, listener, options);
    return this;
  }

  off<T extends keyof HTMLElementEventMap>(type: T, listener: (this: HTMLElement, event: HTMLElementEventMap[T]) => unknown,
                                           options?: EventListenerOptions | boolean): this;
  off(type: string, listener: EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): this;
  off(type: string, listener: EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): this {
    this._node.removeEventListener(type, listener, options);
    return this;
  }

  @LayoutAnchor<HtmlView>({
    strength: "strong",
    getState(oldState: number): number {
      const offsetParent = this.view.node.offsetParent;
      const offsetBounds = offsetParent !== null
                         ? offsetParent.getBoundingClientRect()
                         : this.view.node === document.body
                         ? this.view.node.getBoundingClientRect()
                         : null;
      if (offsetBounds !== null) {
        const bounds = this.view.node.getBoundingClientRect();
        const newState = bounds.top - offsetBounds.top;
        if (oldState !== newState) {
          this.view.requireUpdate(View.NeedsResize | View.NeedsLayout);
        }
        return newState;
      } else {
        return NaN;
      }
    },
    setValue(newValue: number): void {
      this.view.top.setState(newValue);
      this.view.requireUpdate(View.NeedsResize | View.NeedsLayout);
    },
  })
  topAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    strength: "strong",
    getState(oldState: number): number {
      const offsetParent = this.view.node.offsetParent;
      const offsetBounds = offsetParent !== null
                         ? offsetParent.getBoundingClientRect()
                         : this.view.node === document.body
                         ? this.view.node.getBoundingClientRect()
                         : null;
      if (offsetBounds !== null) {
        const bounds = this.view.node.getBoundingClientRect();
        const newState = offsetBounds.right + bounds.right;
        if (oldState !== newState) {
          this.view.requireUpdate(View.NeedsResize | View.NeedsLayout);
        }
        return newState;
      } else {
        return NaN;
      }
    },
    setValue(newValue: number): void {
      this.view.right.setState(newValue);
      this.view.requireUpdate(View.NeedsResize | View.NeedsLayout);
    },
  })
  rightAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    strength: "strong",
    getState(oldState: number): number {
      const offsetParent = this.view.node.offsetParent;
      const offsetBounds = offsetParent !== null
                         ? offsetParent.getBoundingClientRect()
                         : this.view.node === document.body
                         ? this.view.node.getBoundingClientRect()
                         : null;
      if (offsetBounds !== null) {
        const bounds = this.view.node.getBoundingClientRect();
        const newState = offsetBounds.bottom + bounds.bottom;
        if (oldState !== newState) {
          this.view.requireUpdate(View.NeedsResize | View.NeedsLayout);
        }
        return newState;
      } else {
        return NaN;
      }
    },
    setValue(newValue: number): void {
      this.view.bottom.setState(newValue);
      this.view.requireUpdate(View.NeedsResize | View.NeedsLayout);
    },
  })
  bottomAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    strength: "strong",
    getState(oldState: number): number {
      const offsetParent = this.view.node.offsetParent;
      const offsetBounds = offsetParent !== null
                         ? offsetParent.getBoundingClientRect()
                         : this.view.node === document.body
                         ? this.view.node.getBoundingClientRect()
                         : null;
      if (offsetBounds !== null) {
        const bounds = this.view.node.getBoundingClientRect();
        const newState = bounds.left - offsetBounds.left;
        if (oldState !== newState) {
          this.view.requireUpdate(View.NeedsResize | View.NeedsLayout);
        }
        return newState;
      } else {
        return NaN;
      }
    },
    setValue(newValue: number): void {
      this.view.left.setState(newValue);
      this.view.requireUpdate(View.NeedsResize | View.NeedsLayout);
    },
  })
  leftAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    strength: "strong",
    getState(oldState: number): number {
      const bounds = this.view.node.getBoundingClientRect();
      const newState = bounds.width;
      if (oldState !== newState) {
        this.view.requireUpdate(View.NeedsResize | View.NeedsLayout);
      }
      return newState;
    },
    setValue(newValue: number): void {
      this.view.width.setState(newValue);
      this.view.requireUpdate(View.NeedsResize | View.NeedsLayout);
    },
  })
  widthAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    strength: "strong",
    getState(oldState: number): number {
      const bounds = this.view.node.getBoundingClientRect();
      const newState = bounds.height;
      if (oldState !== newState) {
        this.view.requireUpdate(View.NeedsResize | View.NeedsLayout);
      }
      return newState;
    },
    setValue(newValue: number): void {
      this.view.height.setState(newValue);
      this.view.requireUpdate(View.NeedsResize | View.NeedsLayout);
    },
  })
  heightAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    strength: "strong",
    getState(oldState: number): number {
      const offsetParent = this.view.node.offsetParent;
      const offsetBounds = offsetParent !== null
                         ? offsetParent.getBoundingClientRect()
                         : this.view.node === document.body
                         ? this.view.node.getBoundingClientRect()
                         : null;
      if (offsetBounds !== null) {
        const bounds = this.view.node.getBoundingClientRect();
        const newState = bounds.left + 0.5 * bounds.width - offsetBounds.left;
        if (oldState !== newState) {
          this.view.requireUpdate(View.NeedsResize | View.NeedsLayout);
        }
        return newState;
      } else {
        return NaN;
      }
    },
    setValue(newValue: number): void {
      const offsetParent = this.view.node.offsetParent;
      const offsetBounds = offsetParent !== null
                         ? offsetParent.getBoundingClientRect()
                         : this.view.node === document.body
                         ? this.view.node.getBoundingClientRect()
                         : null;
      if (offsetBounds !== null) {
        const bounds = this.view.node.getBoundingClientRect();
        const leftAnchor = this.view.getLayoutAnchor("leftAnchor");
        if (leftAnchor !== null && leftAnchor.constrained()) {
          const newState = offsetBounds.left + newValue - 0.5 * bounds.width;
          this.view.left.setState(newState);
          this.view.requireUpdate(View.NeedsResize | View.NeedsLayout);
          return;
        }
        const rightAnchor = this.view.getLayoutAnchor("rightAnchor");
        if (rightAnchor !== null && rightAnchor.constrained()) {
          const newState = offsetBounds.right - newValue - 0.5 * bounds.width;
          this.view.right.setState(newState);
          this.view.requireUpdate(View.NeedsResize | View.NeedsLayout);
          return;
        }
      }
    },
  })
  centerXAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    strength: "strong",
    getState(oldState: number): number {
      const offsetParent = this.view.node.offsetParent;
      const offsetBounds = offsetParent !== null
                         ? offsetParent.getBoundingClientRect()
                         : this.view.node === document.body
                         ? this.view.node.getBoundingClientRect()
                         : null;
      if (offsetBounds !== null) {
        const bounds = this.view.node.getBoundingClientRect();
        const newState = bounds.top + 0.5 * bounds.height - offsetBounds.top;
        if (oldState !== newState) {
          this.view.requireUpdate(View.NeedsResize | View.NeedsLayout);
        }
        return newState;
      } else {
        return NaN;
      }
    },
    setValue(newValue: number): void {
      const offsetParent = this.view.node.offsetParent;
      const offsetBounds = offsetParent !== null
                         ? offsetParent.getBoundingClientRect()
                         : this.view.node === document.body
                         ? this.view.node.getBoundingClientRect()
                         : null;
      if (offsetBounds !== null) {
        const bounds = this.view.node.getBoundingClientRect();
        const topAnchor = this.view.getLayoutAnchor("topAnchor");
        if (topAnchor !== null && topAnchor.constrained()) {
          const newState = offsetBounds.top + newValue - 0.5 * bounds.height;
          this.view.top.setState(newState);
          this.view.requireUpdate(View.NeedsResize | View.NeedsLayout);
          return;
        }
        const bottomAnchor = this.view.getLayoutAnchor("bottomAnchor");
        if (bottomAnchor !== null && bottomAnchor.constrained()) {
          const newState = offsetBounds.bottom - newValue - 0.5 * bounds.height;
          this.view.bottom.setState(newState);
          this.view.requireUpdate(View.NeedsResize | View.NeedsLayout);
          return;
        }
      }
    },
  })
  centerYAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    strength: "strong",
    getState(oldState: number): number {
      const marginTop = this.view.marginTop.value;
      return marginTop instanceof Length ? marginTop.pxValue() : NaN;
    },
    setValue(newValue: number): void {
      this.view.marginTop.setState(newValue);
    },
  })
  marginTopAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    strength: "strong",
    getState(oldState: number): number {
      const marginRight = this.view.marginRight.value;
      return marginRight instanceof Length ? marginRight.pxValue() : NaN;
    },
    setValue(newValue: number): void {
      this.view.marginRight.setState(newValue);
    },
  })
  marginRightAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    strength: "strong",
    getState(oldState: number): number {
      const marginBottom = this.view.marginBottom.value;
      return marginBottom instanceof Length ? marginBottom.pxValue() : NaN;
    },
    setValue(newValue: number): void {
      this.view.marginBottom.setState(newValue);
    },
  })
  marginBottomAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    strength: "strong",
    getState(oldState: number): number {
      const marginLeft = this.view.marginLeft.value;
      return marginLeft instanceof Length ? marginLeft.pxValue() : NaN;
    },
    setValue(newValue: number): void {
      this.view.marginLeft.setState(newValue);
    },
  })
  marginLeftAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    strength: "strong",
    getState(oldState: number): number {
      const paddingTop = this.view.paddingTop.value;
      return paddingTop instanceof Length ? paddingTop.pxValue() : NaN;
    },
    setValue(newValue: number): void {
      this.view.paddingTop.setState(newValue);
    },
  })
  paddingTopAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    strength: "strong",
    getState(oldState: number): number {
      const paddingRight = this.view.paddingRight.value;
      return paddingRight instanceof Length ? paddingRight.pxValue() : NaN;
    },
    setValue(newValue: number): void {
      this.view.paddingRight.setState(newValue);
    },
  })
  paddingRightAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    strength: "strong",
    getState(oldState: number): number {
      const paddingBottom = this.view.paddingBottom.value;
      return paddingBottom instanceof Length ? paddingBottom.pxValue() : NaN;
    },
    setValue(newValue: number): void {
      this.view.paddingBottom.setState(newValue);
    },
  })
  paddingBottomAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    strength: "strong",
    getState(oldState: number): number {
      const paddingLeft = this.view.paddingLeft.value;
      return paddingLeft instanceof Length ? paddingLeft.pxValue() : NaN;
    },
    setValue(newValue: number): void {
      this.view.paddingLeft.setState(newValue);
    },
  })
  paddingLeftAnchor: LayoutAnchor<this>;

  @AttributeAnimator({attributeName: "autocomplete", type: String})
  autocomplete: AttributeAnimator<this, string>;

  @AttributeAnimator({attributeName: "checked", type: Boolean})
  checked: AttributeAnimator<this, boolean, boolean | string>;

  @AttributeAnimator({attributeName: "colspan", type: Number})
  colspan: AttributeAnimator<this, number, number | string>;

  @AttributeAnimator({attributeName: "disabled", type: Boolean})
  disabled: AttributeAnimator<this, boolean, boolean | string>;

  @AttributeAnimator({attributeName: "placeholder", type: String})
  placeholder: AttributeAnimator<this, string>;

  @AttributeAnimator({attributeName: "rowspan", type: Number})
  rowspan: AttributeAnimator<this, number, number | string>;

  @AttributeAnimator({attributeName: "selected", type: Boolean})
  selected: AttributeAnimator<this, boolean, boolean | string>;

  @AttributeAnimator({attributeName: "title", type: String})
  title: AttributeAnimator<this, string>;

  @AttributeAnimator({attributeName: "type", type: String})
  type: AttributeAnimator<this, string>;

  @AttributeAnimator({attributeName: "value", type: String})
  value: AttributeAnimator<this, string>;

  @StyleAnimator({propertyNames: "align-content", type: String})
  alignContent: StyleAnimator<this, AlignContent>;

  @StyleAnimator({propertyNames: "align-items", type: String})
  alignItems: StyleAnimator<this, AlignItems>;

  @StyleAnimator({propertyNames: "align-self", type: String})
  alignSelf: StyleAnimator<this, AlignSelf>;

  @StyleAnimator({propertyNames: ["appearance", "-webkit-appearance"], type: String})
  appearance: StyleAnimator<this, Appearance>;

  @StyleAnimator({propertyNames: ["backdrop-filter", "-webkit-backdrop-filter"], type: String})
  backdropFilter: StyleAnimator<this, string>;

  @StyleAnimator({propertyNames: ["background-clip", "-webkit-background-clip"], type: String})
  backgroundClip: StyleAnimator<this, BackgroundClip>;

  @StyleAnimator({propertyNames: "background-color", type: Color})
  backgroundColor: StyleAnimator<this, Color, AnyColor>;

  @StyleAnimator({
    propertyNames: "background-image",
    type: Color,
    parse(value: string): LinearGradient | string | undefined {
      try {
        return LinearGradient.parse(value);
      } catch (swallow) {
        return value;
      }
    },
    fromAny(value: AnyLinearGradient | string): LinearGradient | string | undefined {
      if (typeof value === "string") {
        try {
          return LinearGradient.parse(value);
        } catch (swallow) {
          return value;
        }
      } else {
        return LinearGradient.fromAny(value);
      }
    },
  })
  backgroundImage: StyleAnimator<this, LinearGradient | string, AnyLinearGradient | string>;

  @StyleAnimator({propertyNames: "border-collapse", type: String})
  borderCollapse: StyleAnimator<this, BorderCollapse>;

  borderColor(): [Color | "currentColor" | undefined,
                  Color | "currentColor" | undefined,
                  Color | "currentColor" | undefined,
                  Color | "currentColor" | undefined] |
                 Color | "currentColor" | undefined;
  borderColor(value: [AnyColor | "currentColor" | undefined,
                      AnyColor | "currentColor" | undefined,
                      AnyColor | "currentColor" | undefined,
                      AnyColor | "currentColor" | undefined] |
                     AnyColor | "currentColor" | undefined,
              tween?: Tween<Color | "currentColor">,
              priority?: string): this;
  borderColor(value?: [AnyColor | "currentColor" | undefined,
                       AnyColor | "currentColor" | undefined,
                       AnyColor | "currentColor" | undefined,
                       AnyColor | "currentColor" | undefined] |
                      AnyColor | "currentColor" | undefined,
              tween?: Tween<Color | "currentColor">,
              priority?: string): [Color | "currentColor" | undefined,
                                   Color | "currentColor" | undefined,
                                   Color | "currentColor" | undefined,
                                   Color | "currentColor" | undefined] |
                                  Color | "currentColor" | undefined | this {
    if (value === void 0) {
      const borderTopColor = this.borderTopColor();
      const borderRightColor = this.borderRightColor();
      const borderBottomColor = this.borderBottomColor();
      const borderLeftColor = this.borderLeftColor();
      if (Objects.equal(borderTopColor, borderRightColor)
          && Objects.equal(borderRightColor, borderBottomColor)
          && Objects.equal(borderBottomColor, borderLeftColor)) {
        return borderTopColor;
      } else {
        return [borderTopColor, borderRightColor, borderBottomColor, borderLeftColor];
      }
    } else {
      if (Array.isArray(value)) {
        if (value.length >= 1) {
          this.borderTopColor(value[0], tween, priority);
        }
        if (value.length >= 2) {
          this.borderRightColor(value[1], tween, priority);
        }
        if (value.length >= 3) {
          this.borderBottomColor(value[2], tween, priority);
        }
        if (value.length >= 4) {
          this.borderLeftColor(value[3], tween, priority);
        }
      } else {
        this.borderTopColor(value, tween, priority);
        this.borderRightColor(value, tween, priority);
        this.borderBottomColor(value, tween, priority);
        this.borderLeftColor(value, tween, priority);
      }
      return this;
    }
  }

  @StyleAnimator({propertyNames: "border-top-color", type: [Color, String]})
  borderTopColor: StyleAnimator<this, Color | "currentColor", AnyColor | "currentColor">;

  @StyleAnimator({propertyNames: "border-right-color", type: [Color, String]})
  borderRightColor: StyleAnimator<this, Color | "currentColor", AnyColor | "currentColor">;

  @StyleAnimator({propertyNames: "border-bottom-color", type: [Color, String]})
  borderBottomColor: StyleAnimator<this, Color | "currentColor", AnyColor | "currentColor">;

  @StyleAnimator({propertyNames: "border-left-color", type: [Color, String]})
  borderLeftColor: StyleAnimator<this, Color | "currentColor", AnyColor | "currentColor">;

  borderRadius(): [Length | undefined,
                   Length | undefined,
                   Length | undefined,
                   Length | undefined] |
                  Length | undefined;
  borderRadius(value: [AnyLength | undefined,
                       AnyLength | undefined,
                       AnyLength | undefined,
                       AnyLength | undefined] |
                      AnyLength | undefined,
               tween?: Tween<Length>,
               priority?: string): this;
  borderRadius(value?: [AnyLength | undefined,
                        AnyLength | undefined,
                        AnyLength | undefined,
                        AnyLength | undefined] |
                       AnyLength | undefined,
               tween?: Tween<Length>,
               priority?: string): [Length | undefined,
                                    Length | undefined,
                                    Length | undefined,
                                    Length | undefined] |
                                   Length | undefined | this {
    if (value === void 0) {
      const borderTopLeftRadius = this.borderTopLeftRadius();
      const borderTopRightRadius = this.borderTopRightRadius();
      const borderBottomRightRadius = this.borderBottomRightRadius();
      const borderBottomLeftRadius = this.borderBottomLeftRadius();
      if (Objects.equal(borderTopLeftRadius, borderTopRightRadius)
          && Objects.equal(borderTopRightRadius, borderBottomRightRadius)
          && Objects.equal(borderBottomRightRadius, borderBottomLeftRadius)) {
        return borderTopLeftRadius;
      } else {
        return [borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius];
      }
    } else {
      if (Array.isArray(value)) {
        if (value.length >= 1) {
          this.borderTopLeftRadius(value[0], tween, priority);
        }
        if (value.length >= 2) {
          this.borderTopRightRadius(value[1], tween, priority);
        }
        if (value.length >= 3) {
          this.borderBottomRightRadius(value[2], tween, priority);
        }
        if (value.length >= 4) {
          this.borderBottomLeftRadius(value[3], tween, priority);
        }
      } else {
        this.borderTopLeftRadius(value, tween, priority);
        this.borderTopRightRadius(value, tween, priority);
        this.borderBottomRightRadius(value, tween, priority);
        this.borderBottomLeftRadius(value, tween, priority);
      }
      return this;
    }
  }

  @StyleAnimator({propertyNames: "border-top-left-radius", type: Length})
  borderTopLeftRadius: StyleAnimator<this, Length, AnyLength>;

  @StyleAnimator({propertyNames: "border-top-right-radius", type: Length})
  borderTopRightRadius: StyleAnimator<this, Length, AnyLength>;

  @StyleAnimator({propertyNames: "border-bottom-right-radius", type: Length})
  borderBottomRightRadius: StyleAnimator<this, Length, AnyLength>;

  @StyleAnimator({propertyNames: "border-bottom-left-radius", type: Length})
  borderBottomLeftRadius: StyleAnimator<this, Length, AnyLength>;

  @StyleAnimator({propertyNames: "border-spacing", type: String})
  borderSpacing: StyleAnimator<this, string>;

  borderStyle(): [BorderStyle | undefined,
                  BorderStyle | undefined,
                  BorderStyle | undefined,
                  BorderStyle | undefined] |
                 BorderStyle | undefined;
  borderStyle(value: [BorderStyle | undefined,
                      BorderStyle | undefined,
                      BorderStyle | undefined,
                      BorderStyle | undefined] |
                     BorderStyle | undefined,
              tween?: Tween<BorderStyle>,
              priority?: string ): this;
  borderStyle(value?: [BorderStyle | undefined,
                       BorderStyle | undefined,
                       BorderStyle | undefined,
                       BorderStyle | undefined] |
                      BorderStyle | undefined,
              tween?: Tween<BorderStyle>,
              priority?: string): [BorderStyle | undefined,
                                   BorderStyle | undefined,
                                   BorderStyle | undefined,
                                   BorderStyle | undefined] |
                                  BorderStyle | undefined | this {
    if (value === void 0) {
      const borderTopStyle = this.borderTopStyle();
      const borderRightStyle = this.borderRightStyle();
      const borderBottomStyle = this.borderBottomStyle();
      const borderLeftStyle = this.borderLeftStyle();
      if (Objects.equal(borderTopStyle, borderRightStyle)
          && Objects.equal(borderRightStyle, borderBottomStyle)
          && Objects.equal(borderBottomStyle, borderLeftStyle)) {
        return borderTopStyle;
      } else {
        return [borderTopStyle, borderRightStyle, borderBottomStyle, borderLeftStyle];
      }
    } else {
      if (Array.isArray(value)) {
        if (value.length >= 1) {
          this.borderTopStyle(value[0], tween, priority);
        }
        if (value.length >= 2) {
          this.borderRightStyle(value[1], tween, priority);
        }
        if (value.length >= 3) {
          this.borderBottomStyle(value[2], tween, priority);
        }
        if (value.length >= 4) {
          this.borderLeftStyle(value[3], tween, priority);
        }
      } else {
        this.borderTopStyle(value, tween, priority);
        this.borderRightStyle(value, tween, priority);
        this.borderBottomStyle(value, tween, priority);
        this.borderLeftStyle(value, tween, priority);
      }
      return this;
    }
  }

  @StyleAnimator({propertyNames: "border-top-style", type: String})
  borderTopStyle: StyleAnimator<this, BorderStyle>;

  @StyleAnimator({propertyNames: "border-right-style", type: String})
  borderRightStyle: StyleAnimator<this, BorderStyle>;

  @StyleAnimator({propertyNames: "border-bottom-style", type: String})
  borderBottomStyle: StyleAnimator<this, BorderStyle>;

  @StyleAnimator({propertyNames: "border-left-style", type: String})
  borderLeftStyle: StyleAnimator<this, BorderStyle>;

  borderWidth(): [BorderWidth | undefined,
                  BorderWidth | undefined,
                  BorderWidth | undefined,
                  BorderWidth | undefined] |
                 BorderWidth | undefined;
  borderWidth(value: [BorderWidth | AnyLength | undefined,
                      BorderWidth | AnyLength | undefined,
                      BorderWidth | AnyLength | undefined,
                      BorderWidth | AnyLength | undefined] |
                     BorderWidth | AnyLength | undefined,
              tween?: Tween<BorderWidth>,
              priority?: string): this;
  borderWidth(value?: [BorderWidth | AnyLength | undefined,
                       BorderWidth | AnyLength | undefined,
                       BorderWidth | AnyLength | undefined,
                       BorderWidth | AnyLength | undefined] |
                      BorderWidth | AnyLength | undefined,
              tween?: Tween<BorderWidth>,
              priority?: string): [BorderWidth | undefined,
                                   BorderWidth | undefined,
                                   BorderWidth | undefined,
                                   BorderWidth | undefined] |
                                  BorderWidth | undefined | this {
    if (value === void 0) {
      const borderTopWidth = this.borderTopWidth();
      const borderRightWidth = this.borderRightWidth();
      const borderBottomWidth = this.borderBottomWidth();
      const borderLeftWidth = this.borderLeftWidth();
      if (Objects.equal(borderTopWidth, borderRightWidth)
          && Objects.equal(borderRightWidth, borderBottomWidth)
          && Objects.equal(borderBottomWidth, borderLeftWidth)) {
        return borderTopWidth;
      } else {
        return [borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth];
      }
    } else {
      if (Array.isArray(value)) {
        if (value.length >= 1) {
          this.borderTopWidth(value[0], tween, priority);
        }
        if (value.length >= 2) {
          this.borderRightWidth(value[1], tween, priority);
        }
        if (value.length >= 3) {
          this.borderBottomWidth(value[2], tween, priority);
        }
        if (value.length >= 4) {
          this.borderLeftWidth(value[3], tween, priority);
        }
      } else {
        this.borderTopWidth(value, tween, priority);
        this.borderRightWidth(value, tween, priority);
        this.borderBottomWidth(value, tween, priority);
        this.borderLeftWidth(value, tween, priority);
      }
      return this;
    }
  }

  @StyleAnimator({propertyNames: "border-top-width", type: [Length, String]})
  borderTopWidth: StyleAnimator<this, Length | BorderWidth, AnyLength | BorderWidth>;

  @StyleAnimator({propertyNames: "border-right-width", type: [Length, String]})
  borderRightWidth: StyleAnimator<this, Length | BorderWidth, AnyLength | BorderWidth>;

  @StyleAnimator({propertyNames: "border-bottom-width", type: [Length, String]})
  borderBottomWidth: StyleAnimator<this, Length | BorderWidth, AnyLength | BorderWidth>;

  @StyleAnimator({propertyNames: "border-left-width", type: [Length, String]})
  borderLeftWidth: StyleAnimator<this, Length | BorderWidth, AnyLength | BorderWidth>;

  @StyleAnimator({propertyNames: "bottom", type: [Length, String]})
  bottom: StyleAnimator<this, Length | "auto", AnyLength | "auto">;

  @StyleAnimator({propertyNames: "box-shadow", type: BoxShadow})
  boxShadow: StyleAnimator<this, BoxShadow, AnyBoxShadow>;

  @StyleAnimator({propertyNames: "box-sizing", type: String})
  boxSizing: StyleAnimator<this, BoxSizing>;

  @StyleAnimator({propertyNames: "color", type: [Color, String]})
  color: StyleAnimator<this, Color | "currentColor", AnyColor | "currentColor">;

  @StyleAnimator({propertyNames: "cursor", type: String})
  cursor: StyleAnimator<this, CssCursor>;

  @StyleAnimator({propertyNames: "display", type: String})
  display: StyleAnimator<this, CssDisplay>;

  @StyleAnimator({propertyNames: "filter", type: String})
  filter: StyleAnimator<this, string>;

  @StyleAnimator({propertyNames: "flex-basis", type: [Length, String]})
  flexBasis: StyleAnimator<this, Length | FlexBasis, AnyLength | FlexBasis>;

  @StyleAnimator({propertyNames: "flex-direction", type: String})
  flexDirection: StyleAnimator<this, FlexDirection>;

  @StyleAnimator({propertyNames: "flex-grow", type: Number})
  flexGrow: StyleAnimator<this, number, number | string>;

  @StyleAnimator({propertyNames: "flex-shrink", type: Number})
  flexShrink: StyleAnimator<this, number, number | string>;

  @StyleAnimator({propertyNames: "flex-wrap", type: String})
  flexWrap: StyleAnimator<this, FlexWrap>;

  font(): Font | undefined;
  font(value: AnyFont | undefined, tween?: Tween<any>, priority?: string): this;
  font(value?: AnyFont, tween?: Tween<any>, priority?: string): Font | undefined | this {
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
      value = Font.fromAny(value);
      if (value._style !== void 0) {
        this.fontStyle(value._style, tween, priority);
      }
      if (value._variant !== void 0) {
        this.fontVariant(value._variant, tween, priority);
      }
      if (value._weight !== void 0) {
        this.fontWeight(value._weight, tween, priority);
      }
      if (value._stretch !== void 0) {
        this.fontStretch(value._stretch, tween, priority);
      }
      if (value._size !== void 0) {
        this.fontSize(value._size, tween, priority);
      }
      if (value._height !== void 0) {
        this.lineHeight(value._height, tween, priority);
      }
      this.fontFamily(value._family, tween, priority);
      return this;
    }
  }

  @StyleAnimator({propertyNames: "font-family", type: FontFamily})
  fontFamily: StyleAnimator<this, FontFamily | FontFamily[], FontFamily | ReadonlyArray<FontFamily>>;

  @StyleAnimator({propertyNames: "font-size", type: [Length, String]})
  fontSize: StyleAnimator<this, FontSize, AnyFontSize>;

  @StyleAnimator({propertyNames: "font-stretch", type: String})
  fontStretch: StyleAnimator<this, FontStretch>;

  @StyleAnimator({propertyNames: "font-style", type: String})
  fontStyle: StyleAnimator<this, FontStyle>;

  @StyleAnimator({propertyNames: "font-variant", type: String})
  fontVariant: StyleAnimator<this, FontVariant>;

  @StyleAnimator({propertyNames: "font-weight", type: String})
  fontWeight: StyleAnimator<this, FontWeight>;

  @StyleAnimator({propertyNames: "height", type: [Length, String]})
  height: StyleAnimator<this, Height, AnyLength | Height>;

  @StyleAnimator({propertyNames: "justify-content", type: String})
  justifyContent: StyleAnimator<this, JustifyContent>;

  @StyleAnimator({propertyNames: "left", type: [Length, String]})
  left: StyleAnimator<this, Length | "auto", AnyLength | "auto">;

  @StyleAnimator({propertyNames: "line-height", type: LineHeight})
  lineHeight: StyleAnimator<this, LineHeight, AnyLineHeight>;

  margin(): [Length | "auto" | undefined,
             Length | "auto" | undefined,
             Length | "auto" | undefined,
             Length | "auto" | undefined] |
            Length | "auto" | undefined;
  margin(value: [AnyLength | "auto" | undefined,
                 AnyLength | "auto" | undefined,
                 AnyLength | "auto" | undefined,
                 AnyLength | "auto" | undefined] |
                AnyLength | "auto" | undefined,
         tween?: Tween<Length | "auto">,
         priority?: string): this;
  margin(value?: [AnyLength | "auto" |undefined,
                  AnyLength | "auto" |undefined,
                  AnyLength | "auto" |undefined,
                  AnyLength | "auto" |undefined] |
                 AnyLength | "auto" | undefined,
         tween?: Tween<Length | "auto">,
         priority?: string): [Length | "auto" | undefined,
                              Length | "auto" | undefined,
                              Length | "auto" | undefined,
                              Length | "auto" | undefined] |
                             Length | "auto" | undefined | this {
    if (value === void 0) {
      const marginTop = this.marginTop();
      const marginRight = this.marginRight();
      const marginBottom = this.marginBottom();
      const marginLeft = this.marginLeft();
      if (Objects.equal(marginTop, marginRight)
          && Objects.equal(marginRight, marginBottom)
          && Objects.equal(marginBottom, marginLeft)) {
        return marginTop;
      } else {
        return [marginTop, marginRight, marginBottom, marginLeft];
      }
    } else {
      if (Array.isArray(value)) {
        if (value.length >= 1) {
          this.marginTop(value[0], tween, priority);
        }
        if (value.length >= 2) {
          this.marginRight(value[1], tween, priority);
        }
        if (value.length >= 3) {
          this.marginBottom(value[2], tween, priority);
        }
        if (value.length >= 4) {
          this.marginLeft(value[3], tween, priority);
        }
      } else {
        this.marginTop(value, tween, priority);
        this.marginRight(value, tween, priority);
        this.marginBottom(value, tween, priority);
        this.marginLeft(value, tween, priority);
      }
      return this;
    }
  }

  @StyleAnimator({propertyNames: "margin-top", type: [Length, String]})
  marginTop: StyleAnimator<this, Length | "auto", AnyLength | "auto">;

  @StyleAnimator({propertyNames: "margin-right", type: [Length, String]})
  marginRight: StyleAnimator<this, Length | "auto", AnyLength | "auto">;

  @StyleAnimator({propertyNames: "margin-bottom", type: [Length, String]})
  marginBottom: StyleAnimator<this, Length | "auto", AnyLength | "auto">;

  @StyleAnimator({propertyNames: "margin-left", type: [Length, String]})
  marginLeft: StyleAnimator<this, Length | "auto", AnyLength | "auto">;

  @StyleAnimator({propertyNames: "max-height", type: [Length, String]})
  maxHeight: StyleAnimator<this, MaxHeight, AnyLength | MaxHeight>;

  @StyleAnimator({propertyNames: "max-width", type: [Length, String]})
  maxWidth: StyleAnimator<this, MaxWidth, AnyLength | MaxWidth>;

  @StyleAnimator({propertyNames: "min-height", type: [Length, String]})
  minHeight: StyleAnimator<this, MinHeight, AnyLength | MinHeight>;

  @StyleAnimator({propertyNames: "min-width", type: [Length, String]})
  minWidth: StyleAnimator<this, MinWidth, AnyLength | MinWidth>;

  @StyleAnimator({propertyNames: "opacity", type: Number})
  opacity: StyleAnimator<this, number, number | string>;

  @StyleAnimator({propertyNames: "order", type: Number})
  order: StyleAnimator<this, number, number | string>;

  @StyleAnimator({propertyNames: "outline-color", type: [Color, String]})
  outlineColor: StyleAnimator<this, Color | "currentColor", AnyColor | "currentColor">;

  @StyleAnimator({propertyNames: "outline-style", type: String})
  outlineStyle: StyleAnimator<this, BorderStyle>;

  @StyleAnimator({propertyNames: "outline-width", type: [Length, String]})
  outlineWidth: StyleAnimator<this, Length | BorderWidth, AnyLength | BorderWidth>;

  overflow(): [Overflow | undefined,
               Overflow | undefined] |
              Overflow | undefined;
  overflow(value: [Overflow | undefined,
                   Overflow | undefined] |
                  Overflow | undefined,
          tween?: Tween<Overflow>,
          priority?: string): this;
  overflow(value?: [Overflow | undefined,
                    Overflow | undefined] |
                   Overflow | undefined,
          tween?: Tween<Overflow>,
          priority?: string): [Overflow | undefined,
                               Overflow | undefined] |
                              Overflow | undefined | this {
    if (value === void 0) {
      const overflowX = this.overflowX();
      const overflowY = this.overflowY();
      if (Objects.equal(overflowX, overflowY)) {
        return overflowX;
      } else {
        return [overflowX, overflowY];
      }
    } else {
      if (Array.isArray(value)) {
        if (value.length >= 1) {
          this.overflowX(value[0], tween, priority);
        }
        if (value.length >= 2) {
          this.overflowY(value[1], tween, priority);
        }
      } else {
        this.overflowX(value, tween, priority);
        this.overflowY(value, tween, priority);
      }
      return this;
    }
  }

  @StyleAnimator({propertyNames: "overflow-x", type: String})
  overflowX: StyleAnimator<this, Overflow>;

  @StyleAnimator({propertyNames: "overflow-y", type: String})
  overflowY: StyleAnimator<this, Overflow>;

  @StyleAnimator({propertyNames: "-webkit-overflow-scrolling", type: String})
  overflowScrolling: StyleAnimator<this, "auto" | "touch">;

  overscrollBehavior(): [OverscrollBehavior | undefined,
                         OverscrollBehavior | undefined] |
                        OverscrollBehavior | undefined;
  overscrollBehavior(value: [OverscrollBehavior | undefined,
                             OverscrollBehavior | undefined] |
                            OverscrollBehavior | undefined,
          tween?: Tween<OverscrollBehavior>,
          priority?: string): this;
  overscrollBehavior(value?: [OverscrollBehavior | undefined,
                              OverscrollBehavior | undefined] |
                             OverscrollBehavior | undefined,
          tween?: Tween<OverscrollBehavior>,
          priority?: string): [OverscrollBehavior | undefined,
                               OverscrollBehavior | undefined] |
                              OverscrollBehavior | undefined | this {
    if (value === void 0) {
      const overscrollBehaviorX = this.overscrollBehaviorX();
      const overscrollBehaviorY = this.overscrollBehaviorY();
      if (Objects.equal(overscrollBehaviorX, overscrollBehaviorY)) {
        return overscrollBehaviorX;
      } else {
        return [overscrollBehaviorX, overscrollBehaviorY];
      }
    } else {
      if (Array.isArray(value)) {
        if (value.length >= 1) {
          this.overscrollBehaviorX(value[0], tween, priority);
        }
        if (value.length >= 2) {
          this.overscrollBehaviorY(value[1], tween, priority);
        }
      } else {
        this.overscrollBehaviorX(value, tween, priority);
        this.overscrollBehaviorY(value, tween, priority);
      }
      return this;
    }
  }

  @StyleAnimator({propertyNames: "overscroll-behavior-x", type: String})
  overscrollBehaviorX: StyleAnimator<this, OverscrollBehavior>;

  @StyleAnimator({propertyNames: "overscroll-behavior-y", type: String})
  overscrollBehaviorY: StyleAnimator<this, OverscrollBehavior>;

  padding(): [Length | undefined,
              Length | undefined,
              Length | undefined,
              Length | undefined] |
             Length | undefined;
  padding(value: [AnyLength | undefined,
                  AnyLength | undefined,
                  AnyLength | undefined,
                  AnyLength | undefined] |
                 AnyLength | undefined,
          tween?: Tween<Length>,
          priority?: string): this;
  padding(value?: [AnyLength | undefined,
                   AnyLength | undefined,
                   AnyLength | undefined,
                   AnyLength | undefined] |
                  AnyLength | undefined,
          tween?: Tween<Length>,
          priority?: string): [Length | undefined,
                               Length | undefined,
                               Length | undefined,
                               Length | undefined] |
                              Length | undefined | this {
    if (value === void 0) {
      const paddingTop = this.paddingTop();
      const paddingRight = this.paddingRight();
      const paddingBottom = this.paddingBottom();
      const paddingLeft = this.paddingLeft();
      if (Objects.equal(paddingTop, paddingRight)
          && Objects.equal(paddingRight, paddingBottom)
          && Objects.equal(paddingBottom, paddingLeft)) {
        return paddingTop;
      } else {
        return [paddingTop, paddingRight, paddingBottom, paddingLeft];
      }
    } else {
      if (Array.isArray(value)) {
        if (value.length >= 1) {
          this.paddingTop(value[0], tween, priority);
        }
        if (value.length >= 2) {
          this.paddingRight(value[1], tween, priority);
        }
        if (value.length >= 3) {
          this.paddingBottom(value[2], tween, priority);
        }
        if (value.length >= 4) {
          this.paddingLeft(value[3], tween, priority);
        }
      } else {
        this.paddingTop(value, tween, priority);
        this.paddingRight(value, tween, priority);
        this.paddingBottom(value, tween, priority);
        this.paddingLeft(value, tween, priority);
      }
      return this;
    }
  }

  @StyleAnimator({propertyNames: "padding-top", type: Length})
  paddingTop: StyleAnimator<this, Length, AnyLength>;

  @StyleAnimator({propertyNames: "padding-right", type: Length})
  paddingRight: StyleAnimator<this, Length, AnyLength>;

  @StyleAnimator({propertyNames: "padding-bottom", type: Length})
  paddingBottom: StyleAnimator<this, Length, AnyLength>;

  @StyleAnimator({propertyNames: "padding-left", type: Length})
  paddingLeft: StyleAnimator<this, Length, AnyLength>;

  @StyleAnimator({propertyNames: "pointer-events", type: String})
  pointerEvents: StyleAnimator<this, PointerEvents>;

  @StyleAnimator({propertyNames: "position", type: String})
  position: StyleAnimator<this, Position>;

  @StyleAnimator({propertyNames: "right", type: [Length, String]})
  right: StyleAnimator<this, Length | "auto", AnyLength | "auto">;

  @StyleAnimator({propertyNames: "text-align", type: String})
  textAlign: StyleAnimator<this, TextAlign>;

  @StyleAnimator({propertyNames: "text-decoration-color", type: [Color, String]})
  textDecorationColor: StyleAnimator<this, Color | "currentColor", AnyColor | "currentColor">;

  @StyleAnimator({propertyNames: "text-decoration-line", type: String})
  textDecorationLine: StyleAnimator<this, string>;

  @StyleAnimator({propertyNames: "text-decoration-style", type: String})
  textDecorationStyle: StyleAnimator<this, TextDecorationStyle>;

  @StyleAnimator({propertyNames: "text-overflow", type: String})
  textOverflow: StyleAnimator<this, string>;

  @StyleAnimator({propertyNames: "text-transform", type: String})
  textTransform: StyleAnimator<this, TextTransform>;

  @StyleAnimator({propertyNames: "top", type: [Length, String]})
  top: StyleAnimator<this, Length | "auto", AnyLength | "auto">;

  @StyleAnimator({propertyNames: "touch-action", type: String})
  touchAction: StyleAnimator<this, TouchAction>;

  @StyleAnimator({propertyNames: "transform", type: Transform})
  transform: StyleAnimator<this, Transform, AnyTransform>;

  @StyleAnimator({propertyNames: ["user-select", "-webkit-user-select", "-moz-user-select", "-ms-user-select"], type: String})
  userSelect: StyleAnimator<this, UserSelect>;

  @StyleAnimator({propertyNames: "vertical-align", type: [Length, String]})
  verticalAlign: StyleAnimator<this, VerticalAlign, AnyLength | VerticalAlign>;

  @StyleAnimator({propertyNames: "visibility", type: String})
  visibility: StyleAnimator<this, Visibility>;

  @StyleAnimator({propertyNames: "white-space", type: String})
  whiteSpace: StyleAnimator<this, WhiteSpace>;

  @StyleAnimator({propertyNames: "width", type: [Length, String]})
  width: StyleAnimator<this, Width, AnyLength | Width>;

  @StyleAnimator({propertyNames: "z-index", type: [Number, String]})
  zIndex: StyleAnimator<this, number | string>;

  static fromTag<T extends keyof HtmlViewTagMap>(tag: T): HtmlViewTagMap[T];
  static fromTag(tag: string): HtmlView;
  static fromTag(tag: string): HtmlView {
    const node = document.createElement(tag);
    return new (this as unknown as {new(node: HTMLElement): HtmlView})(node);
  }

  static create<T extends keyof HtmlViewTagMap>(tag: T): HtmlViewTagMap[T];
  static create(tag: string): HtmlView;
  static create(node: HTMLCanvasElement): CanvasView;
  static create(node: HTMLElement): HtmlView;
  static create<VC extends ElementViewConstructor<HTMLElement, HtmlView>>(viewConstructor: VC): InstanceType<VC>;
  static create(source: string | HTMLElement | ElementViewConstructor<HTMLElement, HtmlView>): HtmlView {
    if (typeof source === "string") {
      return this.fromTag(source);
    } else if (source instanceof HTMLElement) {
      return this.fromNode(source);
    } else if (typeof source === "function") {
      return this.fromConstructor(source);
    }
    throw new TypeError("" + source);
  }

  /** @hidden */
  static readonly tag: string = "div";
}
View.Html = HtmlView;
