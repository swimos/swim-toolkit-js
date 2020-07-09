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
import {ViewNode, NodeView} from "../node/NodeView";
import {TextView} from "../text/TextView";
import {AttributeAnimatorInitType, AttributeAnimator} from "../attribute/AttributeAnimator";
import {StyleAnimatorInitType, StyleAnimator} from "../style/StyleAnimator";
import {ElementViewConstructor, ElementViewInit, ElementView} from "../element/ElementView";
import {SvgView} from "../svg/SvgView";
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
  autocomplete?: AttributeAnimatorInitType<HtmlView, "autocomplete">;
  checked?: AttributeAnimatorInitType<HtmlView, "checked">;
  colspan?: AttributeAnimatorInitType<HtmlView, "colspan">;
  disabled?: AttributeAnimatorInitType<HtmlView, "disabled">;
  placeholder?: AttributeAnimatorInitType<HtmlView, "placeholder">;
  rowspan?: AttributeAnimatorInitType<HtmlView, "rowspan">;
  selected?: AttributeAnimatorInitType<HtmlView, "selected">;
  title?: AttributeAnimatorInitType<HtmlView, "title">;
  type?: AttributeAnimatorInitType<HtmlView, "type">;
  value?: AttributeAnimatorInitType<HtmlView, "value">;
}

export interface HtmlViewStyleInit {
  alignContent?: StyleAnimatorInitType<HtmlView, "alignContent">;
  alignItems?: StyleAnimatorInitType<HtmlView, "alignItems">;
  alignSelf?: StyleAnimatorInitType<HtmlView, "alignSelf">;
  appearance?: StyleAnimatorInitType<HtmlView, "appearance">;
  backdropFilter?: StyleAnimatorInitType<HtmlView, "backdropFilter">;
  backgroundClip?: StyleAnimatorInitType<HtmlView, "backgroundClip">;
  backgroundColor?: StyleAnimatorInitType<HtmlView, "backgroundColor">;
  borderCollapse?: StyleAnimatorInitType<HtmlView, "borderCollapse">;
  borderColor?: [AnyColor | "currentColor" | undefined,
                 AnyColor | "currentColor" | undefined,
                 AnyColor | "currentColor" | undefined,
                 AnyColor | "currentColor" | undefined] |
                AnyColor | "currentColor";
  borderTopColor?: StyleAnimatorInitType<HtmlView, "borderTopColor">;
  borderRightColor?: StyleAnimatorInitType<HtmlView, "borderRightColor">;
  borderBottomColor?: StyleAnimatorInitType<HtmlView, "borderBottomColor">;
  borderLeftColor?: StyleAnimatorInitType<HtmlView, "borderLeftColor">;
  borderRadius?: [AnyLength | undefined,
                  AnyLength | undefined,
                  AnyLength | undefined,
                  AnyLength | undefined] |
                 AnyLength;
  borderTopLeftRadius?: StyleAnimatorInitType<HtmlView, "borderTopLeftRadius">;
  borderTopRightRadius?: StyleAnimatorInitType<HtmlView, "borderTopRightRadius">;
  borderBottomRightRadius?: StyleAnimatorInitType<HtmlView, "borderBottomRightRadius">;
  borderBottomLeftRadius?: StyleAnimatorInitType<HtmlView, "borderBottomLeftRadius">;
  borderSpacing?: StyleAnimatorInitType<HtmlView, "borderSpacing">;
  borderStyle?: [BorderStyle | undefined,
                 BorderStyle | undefined,
                 BorderStyle | undefined,
                 BorderStyle | undefined] |
                BorderStyle;
  borderTopStyle?: StyleAnimatorInitType<HtmlView, "borderTopStyle">;
  borderRightStyle?: StyleAnimatorInitType<HtmlView, "borderRightStyle">;
  borderBottomStyle?: StyleAnimatorInitType<HtmlView, "borderBottomStyle">;
  borderLeftStyle?: StyleAnimatorInitType<HtmlView, "borderLeftStyle">;
  borderWidth?: [BorderWidth | AnyLength | undefined,
                 BorderWidth | AnyLength | undefined,
                 BorderWidth | AnyLength | undefined,
                 BorderWidth | AnyLength | undefined] |
                BorderWidth | AnyLength;
  borderTopWidth?: StyleAnimatorInitType<HtmlView, "borderTopWidth">;
  borderRightWidth?: StyleAnimatorInitType<HtmlView, "borderRightWidth">;
  borderBottomWidth?: StyleAnimatorInitType<HtmlView, "borderBottomWidth">;
  borderLeftWidth?: StyleAnimatorInitType<HtmlView, "borderLeftWidth">;
  bottom?: StyleAnimatorInitType<HtmlView, "bottom">;
  boxShadow?: StyleAnimatorInitType<HtmlView, "boxShadow">;
  boxSizing?: StyleAnimatorInitType<HtmlView, "boxSizing">;
  color?: StyleAnimatorInitType<HtmlView, "color">;
  cursor?: StyleAnimatorInitType<HtmlView, "cursor">;
  display?: StyleAnimatorInitType<HtmlView, "display">;
  filter?: StyleAnimatorInitType<HtmlView, "filter">;
  flexBasis?: StyleAnimatorInitType<HtmlView, "flexBasis">;
  flexDirection?: StyleAnimatorInitType<HtmlView, "flexDirection">;
  flexGrow?: StyleAnimatorInitType<HtmlView, "flexGrow">;
  flexShrink?: StyleAnimatorInitType<HtmlView, "flexShrink">;
  flexWrap?: StyleAnimatorInitType<HtmlView, "flexWrap">;
  font?: AnyFont;
  fontFamily?: StyleAnimatorInitType<HtmlView, "fontFamily">;
  fontSize?: StyleAnimatorInitType<HtmlView, "fontSize">;
  fontStretch?: StyleAnimatorInitType<HtmlView, "fontStretch">;
  fontStyle?: StyleAnimatorInitType<HtmlView, "fontStyle">;
  fontVariant?: StyleAnimatorInitType<HtmlView, "fontVariant">;
  fontWeight?: StyleAnimatorInitType<HtmlView, "fontWeight">;
  height?: StyleAnimatorInitType<HtmlView, "height">;
  justifyContent?: StyleAnimatorInitType<HtmlView, "justifyContent">;
  left?: StyleAnimatorInitType<HtmlView, "left">;
  lineHeight?: StyleAnimatorInitType<HtmlView, "lineHeight">;
  margin?: [AnyLength | "auto" | undefined,
            AnyLength | "auto" | undefined,
            AnyLength | "auto" | undefined,
            AnyLength | "auto" | undefined] |
           AnyLength | "auto";
  marginTop?: StyleAnimatorInitType<HtmlView, "marginTop">;
  marginRight?: StyleAnimatorInitType<HtmlView, "marginRight">;
  marginBottom?: StyleAnimatorInitType<HtmlView, "marginBottom">;
  marginLeft?: StyleAnimatorInitType<HtmlView, "marginLeft">;
  maxHeight?: StyleAnimatorInitType<HtmlView, "maxHeight">;
  maxWidth?: StyleAnimatorInitType<HtmlView, "maxWidth">;
  minHeight?: StyleAnimatorInitType<HtmlView, "minHeight">;
  minWidth?: StyleAnimatorInitType<HtmlView, "minWidth">;
  opacity?: StyleAnimatorInitType<HtmlView, "opacity">;
  order?: StyleAnimatorInitType<HtmlView, "order">;
  outlineColor?: StyleAnimatorInitType<HtmlView, "outlineColor">;
  outlineStyle?: StyleAnimatorInitType<HtmlView, "outlineStyle">;
  outlineWidth?: StyleAnimatorInitType<HtmlView, "outlineWidth">;
  overflow?: [Overflow | undefined,
              Overflow | undefined] |
             Overflow;
  overflowX?: StyleAnimatorInitType<HtmlView, "overflowX">;
  overflowY?: StyleAnimatorInitType<HtmlView, "overflowY">;
  overflowScrolling?: StyleAnimatorInitType<HtmlView, "overflowScrolling">;
  overscrollBehavior?: [OverscrollBehavior | undefined,
                        OverscrollBehavior | undefined] |
                       OverscrollBehavior;
  overscrollBehaviorX?: StyleAnimatorInitType<HtmlView, "overscrollBehaviorX">;
  overscrollBehaviorY?: StyleAnimatorInitType<HtmlView, "overscrollBehaviorY">;
  padding?: [AnyLength | undefined,
             AnyLength | undefined,
             AnyLength | undefined,
             AnyLength | undefined] |
            AnyLength;
  paddingTop?: StyleAnimatorInitType<HtmlView, "paddingTop">;
  paddingRight?: StyleAnimatorInitType<HtmlView, "paddingRight">;
  paddingBottom?: StyleAnimatorInitType<HtmlView, "paddingBottom">;
  paddingLeft?: StyleAnimatorInitType<HtmlView, "paddingLeft">;
  pointerEvents?: StyleAnimatorInitType<HtmlView, "pointerEvents">;
  position?: StyleAnimatorInitType<HtmlView, "position">;
  right?: StyleAnimatorInitType<HtmlView, "right">;
  textAlign?: StyleAnimatorInitType<HtmlView, "textAlign">;
  textDecorationColor?: StyleAnimatorInitType<HtmlView, "textDecorationColor">;
  textDecorationLine?: StyleAnimatorInitType<HtmlView, "textDecorationLine">;
  textDecorationStyle?: StyleAnimatorInitType<HtmlView, "textDecorationStyle">;
  textOverflow?: StyleAnimatorInitType<HtmlView, "textOverflow">;
  textTransform?: StyleAnimatorInitType<HtmlView, "textTransform">;
  top?: StyleAnimatorInitType<HtmlView, "top">;
  touchAction?: StyleAnimatorInitType<HtmlView, "touchAction">;
  transform?: StyleAnimatorInitType<HtmlView, "transform">;
  userSelect?: StyleAnimatorInitType<HtmlView, "userSelect">;
  verticalAlign?: StyleAnimatorInitType<HtmlView, "verticalAlign">;
  visibility?: StyleAnimatorInitType<HtmlView, "visibility">;
  whiteSpace?: StyleAnimatorInitType<HtmlView, "whiteSpace">;
  width?: StyleAnimatorInitType<HtmlView, "width">;
  zIndex?: StyleAnimatorInitType<HtmlView, "zIndex">;
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

  get viewController(): HtmlViewController | null {
    return this._viewController;
  }

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
    if (init.backgroundColor !== void 0) {
      this.backgroundColor(init.backgroundColor);
    }
    if (init.backgroundColor !== void 0) {
      this.backgroundColor(init.backgroundColor);
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
  append<C extends ElementViewConstructor>(viewConstructor: C, key?: string): InstanceType<C>;
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
  prepend<C extends ElementViewConstructor>(viewConstructor: C, key?: string): InstanceType<C>;
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
  insert<C extends ElementViewConstructor>(viewConstructor: C, target: View | Node | null, key?: string): InstanceType<C>;
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

  protected updateConstraints(): void {
    super.updateConstraints();
    const topAnchor = this.getLayoutAnchor("topAnchor");
    if (topAnchor !== null) {
      topAnchor.updateState();
    }
    const rightAnchor = this.getLayoutAnchor("rightAnchor");
    if (rightAnchor !== null) {
      rightAnchor.updateState();
    }
    const bottomAnchor = this.getLayoutAnchor("bottomAnchor");
    if (bottomAnchor !== null) {
      bottomAnchor.updateState();
    }
    const leftAnchor = this.getLayoutAnchor("leftAnchor");
    if (leftAnchor !== null) {
      leftAnchor.updateState();
    }
    const widthAnchor = this.getLayoutAnchor("widthAnchor");
    if (widthAnchor !== null) {
      widthAnchor.updateState();
    }
    const heightAnchor = this.getLayoutAnchor("heightAnchor");
    if (heightAnchor !== null) {
      heightAnchor.updateState();
    }
    const centerXAnchor = this.getLayoutAnchor("centerXAnchor");
    if (centerXAnchor !== null) {
      centerXAnchor.updateState();
    }
    const centerYAnchor = this.getLayoutAnchor("centerYAnchor");
    if (centerYAnchor !== null) {
      centerYAnchor.updateState();
    }
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
    get(oldState: number): number {
      const offsetParent = this.scope.node.offsetParent!;
      const offsetBounds = offsetParent.getBoundingClientRect();
      const bounds = this.scope.node.getBoundingClientRect();
      const newState = bounds.top - offsetBounds.top;
      if (oldState !== newState) {
        this.scope.requireUpdate(View.NeedsLayout);
      }
      return newState;
    },
    set(newValue: number): void {
      this.scope.top.setState(Length.px(newValue));
      this.scope.requireUpdate(View.NeedsLayout);
    },
    strength: "strong",
  })
  topAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    get(oldState: number): number {
      const offsetParent = this.scope.node.offsetParent!;
      const offsetBounds = offsetParent.getBoundingClientRect();
      const bounds = this.scope.node.getBoundingClientRect();
      const newState = offsetBounds.right + bounds.right;
      if (oldState !== newState) {
        this.scope.requireUpdate(View.NeedsLayout);
      }
      return newState;
    },
    set(newValue: number): void {
      this.scope.right.setState(Length.px(newValue));
      this.scope.requireUpdate(View.NeedsLayout);
    },
    strength: "strong",
  })
  rightAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    get(oldState: number): number {
      const offsetParent = this.scope.node.offsetParent!;
      const offsetBounds = offsetParent.getBoundingClientRect();
      const bounds = this.scope.node.getBoundingClientRect();
      const newState = offsetBounds.bottom + bounds.bottom;
      if (oldState !== newState) {
        this.scope.requireUpdate(View.NeedsLayout);
      }
      return newState;
    },
    set(newValue: number): void {
      this.scope.bottom.setState(Length.px(newValue));
      this.scope.requireUpdate(View.NeedsLayout);
    },
    strength: "strong",
  })
  bottomAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    get(oldState: number): number {
      const offsetParent = this.scope.node.offsetParent!;
      const offsetBounds = offsetParent.getBoundingClientRect();
      const bounds = this.scope.node.getBoundingClientRect();
      const newState = bounds.left - offsetBounds.left;
      if (oldState !== newState) {
        this.scope.requireUpdate(View.NeedsLayout);
      }
      return newState;
    },
    set(newValue: number): void {
      this.scope.left.setState(Length.px(newValue));
      this.scope.requireUpdate(View.NeedsLayout);
    },
    strength: "strong",
  })
  leftAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    get(oldState: number): number {
      const bounds = this.scope.node.getBoundingClientRect();
      const newState = bounds.width;
      if (oldState !== newState) {
        this.scope.requireUpdate(View.NeedsResize | View.NeedsLayout);
      }
      return newState;
    },
    set(newValue: number): void {
      this.scope.width.setState(Length.px(newValue));
      this.scope.requireUpdate(View.NeedsResize | View.NeedsLayout);
    },
    strength: "strong",
  })
  widthAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    get(oldState: number): number {
      const bounds = this.scope.node.getBoundingClientRect();
      const newState = bounds.height;
      if (oldState !== newState) {
        this.scope.requireUpdate(View.NeedsResize | View.NeedsLayout);
      }
      return newState;
    },
    set(newValue: number): void {
      this.scope.height.setState(Length.px(newValue));
      this.scope.requireUpdate(View.NeedsResize | View.NeedsLayout);
    },
    strength: "strong",
  })
  heightAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    get(oldState: number): number {
      const offsetParent = this.scope.node.offsetParent!;
      const offsetBounds = offsetParent.getBoundingClientRect();
      const bounds = this.scope.node.getBoundingClientRect();
      const newState = bounds.left + 0.5 * bounds.width - offsetBounds.left;
      if (oldState !== newState) {
        this.scope.requireUpdate(View.NeedsLayout);
      }
      return newState;
    },
    set(newValue: number): void {
      const rightAnchor = this.scope.getLayoutAnchor("rightAnchor");
      const leftAnchor = this.scope.getLayoutAnchor("leftAnchor");
      const widthAnchor = this.scope.getLayoutAnchor("widthAnchor");
      if (leftAnchor !== null && leftAnchor.enabled()) {
        this.scope.width.setState(Length.px(2 * (newValue - leftAnchor.value)));
        this.scope.requireUpdate(View.NeedsResize | View.NeedsLayout);
      } else if (rightAnchor !== null && rightAnchor.enabled()) {
        this.scope.width.setState(Length.px(2 * (rightAnchor.value - newValue)));
        this.scope.requireUpdate(View.NeedsResize | View.NeedsLayout);
      } else if (widthAnchor !== null && widthAnchor.enabled()) {
        this.scope.left.setState(Length.px(newValue - 0.5 * widthAnchor.value));
        this.scope.requireUpdate(View.NeedsLayout);
      }
    },
    strength: "strong",
  })
  centerXAnchor: LayoutAnchor<this>;

  @LayoutAnchor<HtmlView>({
    get(oldState: number): number {
      const offsetParent = this.scope.node.offsetParent!;
      const offsetBounds = offsetParent.getBoundingClientRect();
      const bounds = this.scope.node.getBoundingClientRect();
      const newState = bounds.top + 0.5 * bounds.height - offsetBounds.top;
      if (oldState !== newState) {
        this.scope.requireUpdate(View.NeedsLayout);
      }
      return newState;
    },
    set(newValue: number): void {
      const topAnchor = this.scope.getLayoutAnchor("topAnchor");
      const bottomAnchor = this.scope.getLayoutAnchor("bottomAnchor");
      const heightAnchor = this.scope.getLayoutAnchor("heightAnchor");
      if (topAnchor !== null && topAnchor.enabled()) {
        this.scope.height.setState(Length.px(2 * (newValue - topAnchor.value)));
        this.scope.requireUpdate(View.NeedsResize | View.NeedsLayout);
      } else if (bottomAnchor !== null && bottomAnchor.enabled()) {
        this.scope.height.setState(Length.px(2 * (bottomAnchor.value - newValue)));
        this.scope.requireUpdate(View.NeedsResize | View.NeedsLayout);
      } else if (heightAnchor !== null && heightAnchor.enabled()) {
        this.scope.top.setState(Length.px(newValue - 0.5 * heightAnchor.value));
        this.scope.requireUpdate(View.NeedsLayout);
      }
    },
    strength: "strong",
  })
  centerYAnchor: LayoutAnchor<this>;

  @AttributeAnimator("autocomplete", String)
  autocomplete: AttributeAnimator<this, string>;

  @AttributeAnimator("checked", Boolean)
  checked: AttributeAnimator<this, boolean, boolean | string>;

  @AttributeAnimator("colspan", Number)
  colspan: AttributeAnimator<this, number, number | string>;

  @AttributeAnimator("disabled", Boolean)
  disabled: AttributeAnimator<this, boolean, boolean | string>;

  @AttributeAnimator("placeholder", String)
  placeholder: AttributeAnimator<this, string>;

  @AttributeAnimator("rowspan", Number)
  rowspan: AttributeAnimator<this, number, number | string>;

  @AttributeAnimator("selected", Boolean)
  selected: AttributeAnimator<this, boolean, boolean | string>;

  @AttributeAnimator("title", String)
  title: AttributeAnimator<this, string>;

  @AttributeAnimator("type", String)
  type: AttributeAnimator<this, string>;

  @AttributeAnimator("value", String)
  value: AttributeAnimator<this, string>;

  @StyleAnimator("align-content", String)
  alignContent: StyleAnimator<this, AlignContent>;

  @StyleAnimator("align-items", String)
  alignItems: StyleAnimator<this, AlignItems>;

  @StyleAnimator("align-self", String)
  alignSelf: StyleAnimator<this, AlignSelf>;

  @StyleAnimator(["appearance", "-webkit-appearance"], String)
  appearance: StyleAnimator<this, Appearance>;

  @StyleAnimator(["backdrop-filter", "-webkit-backdrop-filter"], String)
  backdropFilter: StyleAnimator<this, string>;

  @StyleAnimator(["background-clip", "-webkit-background-clip"], String)
  backgroundClip: StyleAnimator<this, BackgroundClip>;

  @StyleAnimator("background-color", Color)
  backgroundColor: StyleAnimator<this, Color, AnyColor>;

  @StyleAnimator("border-collapse", String)
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

  @StyleAnimator("border-top-color", [Color, String])
  borderTopColor: StyleAnimator<this, Color | "currentColor", AnyColor | "currentColor">;

  @StyleAnimator("border-right-color", [Color, String])
  borderRightColor: StyleAnimator<this, Color | "currentColor", AnyColor | "currentColor">;

  @StyleAnimator("border-bottom-color", [Color, String])
  borderBottomColor: StyleAnimator<this, Color | "currentColor", AnyColor | "currentColor">;

  @StyleAnimator("border-left-color", [Color, String])
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

  @StyleAnimator("border-top-left-radius", Length)
  borderTopLeftRadius: StyleAnimator<this, Length, AnyLength>;

  @StyleAnimator("border-top-right-radius", Length)
  borderTopRightRadius: StyleAnimator<this, Length, AnyLength>;

  @StyleAnimator("border-bottom-right-radius", Length)
  borderBottomRightRadius: StyleAnimator<this, Length, AnyLength>;

  @StyleAnimator("border-bottom-left-radius", Length)
  borderBottomLeftRadius: StyleAnimator<this, Length, AnyLength>;

  @StyleAnimator("border-spacing", String)
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

  @StyleAnimator("border-top-style", String)
  borderTopStyle: StyleAnimator<this, BorderStyle>;

  @StyleAnimator("border-right-style", String)
  borderRightStyle: StyleAnimator<this, BorderStyle>;

  @StyleAnimator("border-bottom-style", String)
  borderBottomStyle: StyleAnimator<this, BorderStyle>;

  @StyleAnimator("border-left-style", String)
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

  @StyleAnimator("border-top-width", [Length, String])
  borderTopWidth: StyleAnimator<this, Length | BorderWidth, AnyLength | BorderWidth>;

  @StyleAnimator("border-right-width", [Length, String])
  borderRightWidth: StyleAnimator<this, Length | BorderWidth, AnyLength | BorderWidth>;

  @StyleAnimator("border-bottom-width", [Length, String])
  borderBottomWidth: StyleAnimator<this, Length | BorderWidth, AnyLength | BorderWidth>;

  @StyleAnimator("border-left-width", [Length, String])
  borderLeftWidth: StyleAnimator<this, Length | BorderWidth, AnyLength | BorderWidth>;

  @StyleAnimator("bottom", [Length, String])
  bottom: StyleAnimator<this, Length | "auto", AnyLength | "auto">;

  @StyleAnimator("box-shadow", BoxShadow)
  boxShadow: StyleAnimator<this, BoxShadow, AnyBoxShadow>;

  @StyleAnimator("box-sizing", String)
  boxSizing: StyleAnimator<this, BoxSizing>;

  @StyleAnimator("color", [Color, String])
  color: StyleAnimator<this, Color | "currentColor", AnyColor | "currentColor">;

  @StyleAnimator("cursor", String)
  cursor: StyleAnimator<this, CssCursor>;

  @StyleAnimator("display", String)
  display: StyleAnimator<this, CssDisplay>;

  @StyleAnimator("filter", String)
  filter: StyleAnimator<this, string>;

  @StyleAnimator("flex-basis", [Length, String])
  flexBasis: StyleAnimator<this, Length | FlexBasis, AnyLength | FlexBasis>;

  @StyleAnimator("flex-direction", String)
  flexDirection: StyleAnimator<this, FlexDirection>;

  @StyleAnimator("flex-grow", Number)
  flexGrow: StyleAnimator<this, number, number | string>;

  @StyleAnimator("flex-shrink", Number)
  flexShrink: StyleAnimator<this, number, number | string>;

  @StyleAnimator("flex-wrap", String)
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

  @StyleAnimator("height", [Length, String])
  height: StyleAnimator<this, Height, AnyLength | Height>;

  @StyleAnimator("justify-content", String)
  justifyContent: StyleAnimator<this, JustifyContent>;

  @StyleAnimator("left", [Length, String])
  left: StyleAnimator<this, Length | "auto", AnyLength | "auto">;

  @StyleAnimator("line-height", LineHeight)
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

  @StyleAnimator("margin-top", [Length, String])
  marginTop: StyleAnimator<this, Length | "auto", AnyLength | "auto">;

  @StyleAnimator("margin-right", [Length, String])
  marginRight: StyleAnimator<this, Length | "auto", AnyLength | "auto">;

  @StyleAnimator("margin-bottom", [Length, String])
  marginBottom: StyleAnimator<this, Length | "auto", AnyLength | "auto">;

  @StyleAnimator("margin-left", [Length, String])
  marginLeft: StyleAnimator<this, Length | "auto", AnyLength | "auto">;

  @StyleAnimator("max-height", [Length, String])
  maxHeight: StyleAnimator<this, MaxHeight, AnyLength | MaxHeight>;

  @StyleAnimator("max-width", [Length, String])
  maxWidth: StyleAnimator<this, MaxWidth, AnyLength | MaxWidth>;

  @StyleAnimator("min-height", [Length, String])
  minHeight: StyleAnimator<this, MinHeight, AnyLength | MinHeight>;

  @StyleAnimator("min-width", [Length, String])
  minWidth: StyleAnimator<this, MinWidth, AnyLength | MinWidth>;

  @StyleAnimator("opacity", Number)
  opacity: StyleAnimator<this, number, number | string>;

  @StyleAnimator("order", Number)
  order: StyleAnimator<this, number, number | string>;

  @StyleAnimator("outline-color", [Color, String])
  outlineColor: StyleAnimator<this, Color | "currentColor", AnyColor | "currentColor">;

  @StyleAnimator("outline-style", String)
  outlineStyle: StyleAnimator<this, BorderStyle>;

  @StyleAnimator("outline-width", [Length, String])
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

  @StyleAnimator("overflow-x", String)
  overflowX: StyleAnimator<this, Overflow>;

  @StyleAnimator("overflow-y", String)
  overflowY: StyleAnimator<this, Overflow>;

  @StyleAnimator("-webkit-overflow-scrolling", String)
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

  @StyleAnimator("overscroll-behavior-x", String)
  overscrollBehaviorX: StyleAnimator<this, OverscrollBehavior>;

  @StyleAnimator("overscroll-behavior-y", String)
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

  @StyleAnimator("padding-top", Length)
  paddingTop: StyleAnimator<this, Length, AnyLength>;

  @StyleAnimator("padding-right", Length)
  paddingRight: StyleAnimator<this, Length, AnyLength>;

  @StyleAnimator("padding-bottom", Length)
  paddingBottom: StyleAnimator<this, Length, AnyLength>;

  @StyleAnimator("padding-left", Length)
  paddingLeft: StyleAnimator<this, Length, AnyLength>;

  @StyleAnimator("pointer-events", String)
  pointerEvents: StyleAnimator<this, PointerEvents>;

  @StyleAnimator("position", String)
  position: StyleAnimator<this, Position>;

  @StyleAnimator("right", [Length, String])
  right: StyleAnimator<this, Length | "auto", AnyLength | "auto">;

  @StyleAnimator("text-align", String)
  textAlign: StyleAnimator<this, TextAlign>;

  @StyleAnimator("text-decoration-color", [Color, String])
  textDecorationColor: StyleAnimator<this, Color | "currentColor", AnyColor | "currentColor">;

  @StyleAnimator("text-decoration-line", String)
  textDecorationLine: StyleAnimator<this, string>;

  @StyleAnimator("text-decoration-style", String)
  textDecorationStyle: StyleAnimator<this, TextDecorationStyle>;

  @StyleAnimator("text-overflow", String)
  textOverflow: StyleAnimator<this, string>;

  @StyleAnimator("text-transform", String)
  textTransform: StyleAnimator<this, TextTransform>;

  @StyleAnimator("top", [Length, String])
  top: StyleAnimator<this, Length | "auto", AnyLength | "auto">;

  @StyleAnimator("touch-action", String)
  touchAction: StyleAnimator<this, TouchAction>;

  @StyleAnimator("transform", Transform)
  transform: StyleAnimator<this, Transform, AnyTransform>;

  @StyleAnimator(["user-select", "-webkit-user-select", "-moz-user-select", "-ms-user-select"], String)
  userSelect: StyleAnimator<this, UserSelect>;

  @StyleAnimator("vertical-align", [Length, String])
  verticalAlign: StyleAnimator<this, VerticalAlign, AnyLength | VerticalAlign>;

  @StyleAnimator("visibility", String)
  visibility: StyleAnimator<this, Visibility>;

  @StyleAnimator("white-space", String)
  whiteSpace: StyleAnimator<this, WhiteSpace>;

  @StyleAnimator("width", [Length, String])
  width: StyleAnimator<this, Width, AnyLength | Width>;

  @StyleAnimator("z-index", [Number, String])
  zIndex: StyleAnimator<this, number | string>;

  static fromTag<T extends keyof HtmlViewTagMap>(tag: T): HtmlViewTagMap[T];
  static fromTag(tag: string): HtmlView;
  static fromTag(tag: string): HtmlView {
    if (tag === "canvas") {
      return new View.Canvas(document.createElement(tag) as HTMLCanvasElement);
    } else {
      return new HtmlView(document.createElement(tag));
    }
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
    } else if (node instanceof HTMLCanvasElement) {
      return new View.Canvas(node);
    } else if (node instanceof HTMLElement) {
      return new HtmlView(node);
    }
    throw new TypeError("" + node);
  }

  static create<T extends keyof HtmlViewTagMap>(tag: T): HtmlViewTagMap[T];
  static create(tag: string): HtmlView;
  static create(node: HTMLCanvasElement): CanvasView;
  static create(node: HTMLElement): HtmlView;
  static create<C extends ElementViewConstructor<HTMLElement, HtmlView>>(viewConstructor: C): InstanceType<C>;
  static create(source: string | HTMLElement | ElementViewConstructor<HTMLElement, HtmlView>): HtmlView {
    if (typeof source === "string") {
      return HtmlView.fromTag(source);
    } else if (source instanceof HTMLElement) {
      return HtmlView.fromNode(source);
    } else if (typeof source === "function") {
      return HtmlView.fromConstructor(source);
    }
    throw new TypeError("" + source);
  }

  /** @hidden */
  static readonly tag: string = "div";
}
View.Html = HtmlView;
