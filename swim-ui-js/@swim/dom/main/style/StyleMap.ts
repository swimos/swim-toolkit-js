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

import {Equals, Values} from "@swim/util";
import type {AnyTiming} from "@swim/mapping";
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
  AnyLinearGradient,
  LinearGradient,
  AnyBoxShadow,
  BoxShadow,
} from "@swim/style";
import type {
  AlignContent,
  AlignItems,
  AlignSelf,
  Appearance,
  BackgroundClip,
  BorderCollapse,
  BorderStyle,
  BoxSizing,
  CssCursor,
  CssDisplay,
  FlexBasis,
  FlexDirection,
  FlexWrap,
  JustifyContent,
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
} from "./types";
import type {StyleContext} from "./StyleContext";
import {StyleAnimatorMemberInit, StyleAnimator} from "./StyleAnimator";
import {StyleAnimatorConstraint} from "./StyleAnimatorConstraint";

export interface StyleMapInit {
  alignContent?: StyleAnimatorMemberInit<StyleMap, "alignContent">;
  alignItems?: StyleAnimatorMemberInit<StyleMap, "alignItems">;
  alignSelf?: StyleAnimatorMemberInit<StyleMap, "alignSelf">;
  appearance?: StyleAnimatorMemberInit<StyleMap, "appearance">;
  backdropFilter?: StyleAnimatorMemberInit<StyleMap, "backdropFilter">;
  backgroundClip?: StyleAnimatorMemberInit<StyleMap, "backgroundClip">;
  backgroundColor?: StyleAnimatorMemberInit<StyleMap, "backgroundColor">;
  backgroundImage?: StyleAnimatorMemberInit<StyleMap, "backgroundImage">;
  borderCollapse?: StyleAnimatorMemberInit<StyleMap, "borderCollapse">;
  borderColor?: [AnyColor | null, AnyColor | null, AnyColor | null, AnyColor | null] | AnyColor | null;
  borderTopColor?: StyleAnimatorMemberInit<StyleMap, "borderTopColor">;
  borderRightColor?: StyleAnimatorMemberInit<StyleMap, "borderRightColor">;
  borderBottomColor?: StyleAnimatorMemberInit<StyleMap, "borderBottomColor">;
  borderLeftColor?: StyleAnimatorMemberInit<StyleMap, "borderLeftColor">;
  borderRadius?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null;
  borderTopLeftRadius?: StyleAnimatorMemberInit<StyleMap, "borderTopLeftRadius">;
  borderTopRightRadius?: StyleAnimatorMemberInit<StyleMap, "borderTopRightRadius">;
  borderBottomRightRadius?: StyleAnimatorMemberInit<StyleMap, "borderBottomRightRadius">;
  borderBottomLeftRadius?: StyleAnimatorMemberInit<StyleMap, "borderBottomLeftRadius">;
  borderSpacing?: StyleAnimatorMemberInit<StyleMap, "borderSpacing">;
  borderStyle?: [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined;
  borderTopStyle?: StyleAnimatorMemberInit<StyleMap, "borderTopStyle">;
  borderRightStyle?: StyleAnimatorMemberInit<StyleMap, "borderRightStyle">;
  borderBottomStyle?: StyleAnimatorMemberInit<StyleMap, "borderBottomStyle">;
  borderLeftStyle?: StyleAnimatorMemberInit<StyleMap, "borderLeftStyle">;
  borderWidth?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null;
  borderTopWidth?: StyleAnimatorMemberInit<StyleMap, "borderTopWidth">;
  borderRightWidth?: StyleAnimatorMemberInit<StyleMap, "borderRightWidth">;
  borderBottomWidth?: StyleAnimatorMemberInit<StyleMap, "borderBottomWidth">;
  borderLeftWidth?: StyleAnimatorMemberInit<StyleMap, "borderLeftWidth">;
  bottom?: StyleAnimatorMemberInit<StyleMap, "bottom">;
  boxShadow?: StyleAnimatorMemberInit<StyleMap, "boxShadow">;
  boxSizing?: StyleAnimatorMemberInit<StyleMap, "boxSizing">;
  color?: StyleAnimatorMemberInit<StyleMap, "color">;
  cursor?: StyleAnimatorMemberInit<StyleMap, "cursor">;
  display?: StyleAnimatorMemberInit<StyleMap, "display">;
  filter?: StyleAnimatorMemberInit<StyleMap, "filter">;
  flexBasis?: StyleAnimatorMemberInit<StyleMap, "flexBasis">;
  flexDirection?: StyleAnimatorMemberInit<StyleMap, "flexDirection">;
  flexGrow?: StyleAnimatorMemberInit<StyleMap, "flexGrow">;
  flexShrink?: StyleAnimatorMemberInit<StyleMap, "flexShrink">;
  flexWrap?: StyleAnimatorMemberInit<StyleMap, "flexWrap">;
  font?: AnyFont;
  fontFamily?: StyleAnimatorMemberInit<StyleMap, "fontFamily">;
  fontSize?: StyleAnimatorMemberInit<StyleMap, "fontSize">;
  fontStretch?: StyleAnimatorMemberInit<StyleMap, "fontStretch">;
  fontStyle?: StyleAnimatorMemberInit<StyleMap, "fontStyle">;
  fontVariant?: StyleAnimatorMemberInit<StyleMap, "fontVariant">;
  fontWeight?: StyleAnimatorMemberInit<StyleMap, "fontWeight">;
  height?: StyleAnimatorMemberInit<StyleMap, "height">;
  justifyContent?: StyleAnimatorMemberInit<StyleMap, "justifyContent">;
  left?: StyleAnimatorMemberInit<StyleMap, "left">;
  lineHeight?: StyleAnimatorMemberInit<StyleMap, "lineHeight">;
  margin?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength;
  marginTop?: StyleAnimatorMemberInit<StyleMap, "marginTop">;
  marginRight?: StyleAnimatorMemberInit<StyleMap, "marginRight">;
  marginBottom?: StyleAnimatorMemberInit<StyleMap, "marginBottom">;
  marginLeft?: StyleAnimatorMemberInit<StyleMap, "marginLeft">;
  maxHeight?: StyleAnimatorMemberInit<StyleMap, "maxHeight">;
  maxWidth?: StyleAnimatorMemberInit<StyleMap, "maxWidth">;
  minHeight?: StyleAnimatorMemberInit<StyleMap, "minHeight">;
  minWidth?: StyleAnimatorMemberInit<StyleMap, "minWidth">;
  opacity?: StyleAnimatorMemberInit<StyleMap, "opacity">;
  order?: StyleAnimatorMemberInit<StyleMap, "order">;
  outlineColor?: StyleAnimatorMemberInit<StyleMap, "outlineColor">;
  outlineStyle?: StyleAnimatorMemberInit<StyleMap, "outlineStyle">;
  outlineWidth?: StyleAnimatorMemberInit<StyleMap, "outlineWidth">;
  overflow?: [Overflow | undefined, Overflow | undefined] | Overflow | undefined;
  overflowX?: StyleAnimatorMemberInit<StyleMap, "overflowX">;
  overflowY?: StyleAnimatorMemberInit<StyleMap, "overflowY">;
  overflowScrolling?: StyleAnimatorMemberInit<StyleMap, "overflowScrolling">;
  overscrollBehavior?: [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined;
  overscrollBehaviorX?: StyleAnimatorMemberInit<StyleMap, "overscrollBehaviorX">;
  overscrollBehaviorY?: StyleAnimatorMemberInit<StyleMap, "overscrollBehaviorY">;
  padding?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null;
  paddingTop?: StyleAnimatorMemberInit<StyleMap, "paddingTop">;
  paddingRight?: StyleAnimatorMemberInit<StyleMap, "paddingRight">;
  paddingBottom?: StyleAnimatorMemberInit<StyleMap, "paddingBottom">;
  paddingLeft?: StyleAnimatorMemberInit<StyleMap, "paddingLeft">;
  pointerEvents?: StyleAnimatorMemberInit<StyleMap, "pointerEvents">;
  position?: StyleAnimatorMemberInit<StyleMap, "position">;
  right?: StyleAnimatorMemberInit<StyleMap, "right">;
  textAlign?: StyleAnimatorMemberInit<StyleMap, "textAlign">;
  textDecorationColor?: StyleAnimatorMemberInit<StyleMap, "textDecorationColor">;
  textDecorationLine?: StyleAnimatorMemberInit<StyleMap, "textDecorationLine">;
  textDecorationStyle?: StyleAnimatorMemberInit<StyleMap, "textDecorationStyle">;
  textOverflow?: StyleAnimatorMemberInit<StyleMap, "textOverflow">;
  textTransform?: StyleAnimatorMemberInit<StyleMap, "textTransform">;
  top?: StyleAnimatorMemberInit<StyleMap, "top">;
  touchAction?: StyleAnimatorMemberInit<StyleMap, "touchAction">;
  transform?: StyleAnimatorMemberInit<StyleMap, "transform">;
  userSelect?: StyleAnimatorMemberInit<StyleMap, "userSelect">;
  verticalAlign?: StyleAnimatorMemberInit<StyleMap, "verticalAlign">;
  visibility?: StyleAnimatorMemberInit<StyleMap, "visibility">;
  whiteSpace?: StyleAnimatorMemberInit<StyleMap, "whiteSpace">;
  width?: StyleAnimatorMemberInit<StyleMap, "width">;
  zIndex?: StyleAnimatorMemberInit<StyleMap, "zIndex">;
}

export interface StyleMap extends StyleContext {
  alignContent: StyleAnimator<this, AlignContent | undefined>;

  alignItems: StyleAnimator<this, AlignItems | undefined>;

  alignSelf: StyleAnimator<this, AlignSelf | undefined>;

  appearance: StyleAnimator<this, Appearance | undefined>;

  backdropFilter: StyleAnimator<this, string | undefined>;

  backgroundClip: StyleAnimator<this, BackgroundClip | undefined>;

  backgroundColor: StyleAnimator<this, Color | null, AnyColor | null>;

  backgroundImage: StyleAnimator<this, LinearGradient | string | null, AnyLinearGradient | string | null>;

  borderCollapse: StyleAnimator<this, BorderCollapse | undefined>;

  borderColor(): [Color | null, Color | null, Color | null, Color | null] | Color | null;
  borderColor(value: [AnyColor | null, AnyColor | null, AnyColor | null, AnyColor | null] | AnyColor | null, timing?: AnyTiming | boolean): this;

  borderTopColor: StyleAnimator<this, Color | null, AnyColor | null>;

  borderRightColor: StyleAnimator<this, Color | null, AnyColor | null>;

  borderBottomColor: StyleAnimator<this, Color | null, AnyColor | null>;

  borderLeftColor: StyleAnimator<this, Color | null, AnyColor | null>;

  borderRadius(): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  borderRadius(value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean): this;

  borderTopLeftRadius: StyleAnimator<this, Length | null, AnyLength | null>;

  borderTopRightRadius: StyleAnimator<this, Length | null, AnyLength | null>;

  borderBottomRightRadius: StyleAnimator<this, Length | null, AnyLength | null>;

  borderBottomLeftRadius: StyleAnimator<this, Length | null, AnyLength | null>;

  borderSpacing: StyleAnimator<this, string | undefined>;

  borderStyle(): [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined;
  borderStyle(value: [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined, timing?: AnyTiming | boolean): this;

  borderTopStyle: StyleAnimator<this, BorderStyle | undefined>;

  borderRightStyle: StyleAnimator<this, BorderStyle | undefined>;

  borderBottomStyle: StyleAnimator<this, BorderStyle | undefined>;

  borderLeftStyle: StyleAnimator<this, BorderStyle | undefined>;

  borderWidth(): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  borderWidth(value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean): this;

  borderTopWidth: StyleAnimator<this, Length | null, AnyLength | null>;

  borderRightWidth: StyleAnimator<this, Length | null, AnyLength | null>;

  borderBottomWidth: StyleAnimator<this, Length | null, AnyLength | null>;

  borderLeftWidth: StyleAnimator<this, Length | null, AnyLength | null>;

  bottom: StyleAnimatorConstraint<this, Length | null, AnyLength | null>;

  boxShadow: StyleAnimator<this, BoxShadow | null, AnyBoxShadow | null>;

  boxSizing: StyleAnimator<this, BoxSizing | undefined>;

  color: StyleAnimator<this, Color | null, AnyColor | null>;

  cursor: StyleAnimator<this, CssCursor | undefined>;

  display: StyleAnimator<this, CssDisplay | undefined>;

  filter: StyleAnimator<this, string | undefined>;

  flexBasis: StyleAnimator<this, Length | FlexBasis | null, AnyLength | FlexBasis | null>;

  flexDirection: StyleAnimator<this, FlexDirection | string>;

  flexGrow: StyleAnimator<this, number | undefined>;

  flexShrink: StyleAnimator<this, number | undefined>;

  flexWrap: StyleAnimator<this, FlexWrap | undefined>;

  font(): Font | null;
  font(value: AnyFont | null, timing?: AnyTiming | boolean): this;

  fontFamily: StyleAnimator<this, FontFamily | FontFamily[] | undefined, FontFamily | ReadonlyArray<FontFamily> | undefined>;

  fontSize: StyleAnimator<this, Length | null, AnyLength | null>;

  fontStretch: StyleAnimator<this, FontStretch | undefined>;

  fontStyle: StyleAnimator<this, FontStyle | undefined>;

  fontVariant: StyleAnimator<this, FontVariant | undefined>;

  fontWeight: StyleAnimator<this, FontWeight | undefined>;

  height: StyleAnimatorConstraint<this, Length | null, AnyLength | null>;

  justifyContent: StyleAnimator<this, JustifyContent | undefined>;

  left: StyleAnimatorConstraint<this, Length | null, AnyLength | null>;

  lineHeight: StyleAnimator<this, Length | null, AnyLength | null>;

  margin(): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  margin(value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean): this;

  marginTop: StyleAnimatorConstraint<this, Length | null, AnyLength | null>;

  marginRight: StyleAnimatorConstraint<this, Length | null, AnyLength | null>;

  marginBottom: StyleAnimatorConstraint<this, Length | null, AnyLength | null>;

  marginLeft: StyleAnimatorConstraint<this, Length | null, AnyLength | null>;

  maxHeight: StyleAnimator<this, Length | null, AnyLength | null>;

  maxWidth: StyleAnimator<this, Length | null, AnyLength | null>;

  minHeight: StyleAnimator<this, Length | null, AnyLength | null>;

  minWidth: StyleAnimator<this, Length | null, AnyLength | null>;

  opacity: StyleAnimator<this, number | undefined>;

  order: StyleAnimator<this, number | undefined>;

  outlineColor: StyleAnimator<this, Color | null, AnyColor | null>;

  outlineStyle: StyleAnimator<this, BorderStyle | undefined>;

  outlineWidth: StyleAnimator<this, Length | null, AnyLength | null>;

  overflow(): [Overflow | undefined, Overflow | undefined] | Overflow | undefined;
  overflow(value: [Overflow | undefined, Overflow | undefined] | Overflow | undefined, timing?: AnyTiming | boolean): this;

  overflowX: StyleAnimator<this, Overflow | undefined>;

  overflowY: StyleAnimator<this, Overflow | undefined>;

  overflowScrolling: StyleAnimator<this, "auto" | "touch" | undefined>;

  overscrollBehavior(): [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined;
  overscrollBehavior(value: [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined, timing?: AnyTiming | boolean): this;

  overscrollBehaviorX: StyleAnimator<this, OverscrollBehavior | undefined>;

  overscrollBehaviorY: StyleAnimator<this, OverscrollBehavior | undefined>;

  padding(): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  padding(value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean): this;

  paddingTop: StyleAnimatorConstraint<this, Length | null, AnyLength | null>;

  paddingRight: StyleAnimatorConstraint<this, Length | null, AnyLength | null>;

  paddingBottom: StyleAnimatorConstraint<this, Length | null, AnyLength | null>;

  paddingLeft: StyleAnimatorConstraint<this, Length | null, AnyLength | null>;

  pointerEvents: StyleAnimator<this, PointerEvents | undefined>;

  position: StyleAnimator<this, Position | undefined>;

  right: StyleAnimatorConstraint<this, Length | null, AnyLength | null>;

  textAlign: StyleAnimator<this, TextAlign | undefined>;

  textDecorationColor: StyleAnimator<this, Color | null, AnyColor | null>;

  textDecorationLine: StyleAnimator<this, string | undefined>;

  textDecorationStyle: StyleAnimator<this, TextDecorationStyle | undefined>;

  textOverflow: StyleAnimator<this, string | undefined>;

  textTransform: StyleAnimator<this, TextTransform | undefined>;

  top: StyleAnimatorConstraint<this, Length | null, AnyLength | null>;

  touchAction: StyleAnimator<this, TouchAction | undefined>;

  transform: StyleAnimator<this, Transform | null, AnyTransform | null>;

  userSelect: StyleAnimator<this, UserSelect | undefined>;

  verticalAlign: StyleAnimator<this, VerticalAlign | undefined, AnyLength | VerticalAlign | undefined>;

  visibility: StyleAnimator<this, Visibility | undefined>;

  whiteSpace: StyleAnimator<this, WhiteSpace | undefined>;

  width: StyleAnimatorConstraint<this, Length | null, AnyLength | null>;

  zIndex: StyleAnimator<this, number | undefined>;
}

/** @hidden */
export const StyleMap = {} as {
  init(map: StyleMap, init: StyleMapInit): void;
  define(prototype: StyleMap): void;
};

StyleMap.init = function (map: StyleMap, init: StyleMapInit): void {
  if (init.alignContent !== void 0) {
    map.alignContent(init.alignContent);
  }
  if (init.alignItems !== void 0) {
    map.alignItems(init.alignItems);
  }
  if (init.alignSelf !== void 0) {
    map.alignSelf(init.alignSelf);
  }
  if (init.appearance !== void 0) {
    map.appearance(init.appearance);
  }
  if (init.backdropFilter !== void 0) {
    map.backdropFilter(init.backdropFilter);
  }
  if (init.backgroundClip !== void 0) {
    map.backgroundClip(init.backgroundClip);
  }
  if (init.backgroundColor !== void 0) {
    map.backgroundColor(init.backgroundColor);
  }
  if (init.backgroundImage !== void 0) {
    map.backgroundImage(init.backgroundImage);
  }
  if (init.borderCollapse !== void 0) {
    map.borderCollapse(init.borderCollapse);
  }
  if (init.borderColor !== void 0) {
    map.borderColor(init.borderColor);
  }
  if (init.borderTopColor !== void 0) {
    map.borderTopColor(init.borderTopColor);
  }
  if (init.borderRightColor !== void 0) {
    map.borderRightColor(init.borderRightColor);
  }
  if (init.borderBottomColor !== void 0) {
    map.borderBottomColor(init.borderBottomColor);
  }
  if (init.borderLeftColor !== void 0) {
    map.borderLeftColor(init.borderLeftColor);
  }
  if (init.borderRadius !== void 0) {
    map.borderRadius(init.borderRadius);
  }
  if (init.borderTopLeftRadius !== void 0) {
    map.borderTopLeftRadius(init.borderTopLeftRadius);
  }
  if (init.borderTopRightRadius !== void 0) {
    map.borderTopRightRadius(init.borderTopRightRadius);
  }
  if (init.borderBottomRightRadius !== void 0) {
    map.borderBottomRightRadius(init.borderBottomRightRadius);
  }
  if (init.borderBottomLeftRadius !== void 0) {
    map.borderBottomLeftRadius(init.borderBottomLeftRadius);
  }
  if (init.borderSpacing !== void 0) {
    map.borderSpacing(init.borderSpacing);
  }
  if (init.borderStyle !== void 0) {
    map.borderStyle(init.borderStyle);
  }
  if (init.borderTopStyle !== void 0) {
    map.borderTopStyle(init.borderTopStyle);
  }
  if (init.borderRightStyle !== void 0) {
    map.borderRightStyle(init.borderRightStyle);
  }
  if (init.borderBottomStyle !== void 0) {
    map.borderBottomStyle(init.borderBottomStyle);
  }
  if (init.borderLeftStyle !== void 0) {
    map.borderLeftStyle(init.borderLeftStyle);
  }
  if (init.borderWidth !== void 0) {
    map.borderWidth(init.borderWidth);
  }
  if (init.borderTopWidth !== void 0) {
    map.borderTopWidth(init.borderTopWidth);
  }
  if (init.borderRightWidth !== void 0) {
    map.borderRightWidth(init.borderRightWidth);
  }
  if (init.borderBottomWidth !== void 0) {
    map.borderBottomWidth(init.borderBottomWidth);
  }
  if (init.borderLeftWidth !== void 0) {
    map.borderLeftWidth(init.borderLeftWidth);
  }
  if (init.bottom !== void 0) {
    map.bottom(init.bottom);
  }
  if (init.boxShadow !== void 0) {
    map.boxShadow(init.boxShadow);
  }
  if (init.boxSizing !== void 0) {
    map.boxSizing(init.boxSizing);
  }
  if (init.color !== void 0) {
    map.color(init.color);
  }
  if (init.cursor !== void 0) {
    map.cursor(init.cursor);
  }
  if (init.display !== void 0) {
    map.display(init.display);
  }
  if (init.filter !== void 0) {
    map.filter(init.filter);
  }
  if (init.flexBasis !== void 0) {
    map.flexBasis(init.flexBasis);
  }
  if (init.flexDirection !== void 0) {
    map.flexDirection(init.flexDirection);
  }
  if (init.flexGrow !== void 0) {
    map.flexGrow(init.flexGrow);
  }
  if (init.flexShrink !== void 0) {
    map.flexShrink(init.flexShrink);
  }
  if (init.flexWrap !== void 0) {
    map.flexWrap(init.flexWrap);
  }
  if (init.font !== void 0) {
    map.font(init.font);
  }
  if (init.fontFamily !== void 0) {
    map.fontFamily(init.fontFamily);
  }
  if (init.fontSize !== void 0) {
    map.fontSize(init.fontSize);
  }
  if (init.fontStretch !== void 0) {
    map.fontStretch(init.fontStretch);
  }
  if (init.fontStyle !== void 0) {
    map.fontStyle(init.fontStyle);
  }
  if (init.fontVariant !== void 0) {
    map.fontVariant(init.fontVariant);
  }
  if (init.fontWeight !== void 0) {
    map.fontWeight(init.fontWeight);
  }
  if (init.height !== void 0) {
    map.height(init.height);
  }
  if (init.justifyContent !== void 0) {
    map.justifyContent(init.justifyContent);
  }
  if (init.left !== void 0) {
    map.left(init.left);
  }
  if (init.lineHeight !== void 0) {
    map.lineHeight(init.lineHeight);
  }
  if (init.margin !== void 0) {
    map.margin(init.margin);
  }
  if (init.marginTop !== void 0) {
    map.marginTop(init.marginTop);
  }
  if (init.marginRight !== void 0) {
    map.marginRight(init.marginRight);
  }
  if (init.marginBottom !== void 0) {
    map.marginBottom(init.marginBottom);
  }
  if (init.marginLeft !== void 0) {
    map.marginLeft(init.marginLeft);
  }
  if (init.maxHeight !== void 0) {
    map.maxHeight(init.maxHeight);
  }
  if (init.maxWidth !== void 0) {
    map.maxWidth(init.maxWidth);
  }
  if (init.minHeight !== void 0) {
    map.minHeight(init.minHeight);
  }
  if (init.minWidth !== void 0) {
    map.minWidth(init.minWidth);
  }
  if (init.opacity !== void 0) {
    map.opacity(init.opacity);
  }
  if (init.order !== void 0) {
    map.order(init.order);
  }
  if (init.outlineColor !== void 0) {
    map.outlineColor(init.outlineColor);
  }
  if (init.outlineStyle !== void 0) {
    map.outlineStyle(init.outlineStyle);
  }
  if (init.outlineWidth !== void 0) {
    map.outlineWidth(init.outlineWidth);
  }
  if (init.overflow !== void 0) {
    map.overflow(init.overflow);
  }
  if (init.overflowX !== void 0) {
    map.overflowX(init.overflowX);
  }
  if (init.overflowY !== void 0) {
    map.overflowY(init.overflowY);
  }
  if (init.overflowScrolling !== void 0) {
    map.overflowScrolling(init.overflowScrolling);
  }
  if (init.overscrollBehavior !== void 0) {
    map.overscrollBehavior(init.overscrollBehavior);
  }
  if (init.overscrollBehaviorX !== void 0) {
    map.overscrollBehaviorX(init.overscrollBehaviorX);
  }
  if (init.overscrollBehaviorY !== void 0) {
    map.overscrollBehaviorY(init.overscrollBehaviorY);
  }
  if (init.padding !== void 0) {
    map.padding(init.padding);
  }
  if (init.paddingTop !== void 0) {
    map.paddingTop(init.paddingTop);
  }
  if (init.paddingRight !== void 0) {
    map.paddingRight(init.paddingRight);
  }
  if (init.paddingBottom !== void 0) {
    map.paddingBottom(init.paddingBottom);
  }
  if (init.paddingLeft !== void 0) {
    map.paddingLeft(init.paddingLeft);
  }
  if (init.pointerEvents !== void 0) {
    map.pointerEvents(init.pointerEvents);
  }
  if (init.position !== void 0) {
    map.position(init.position);
  }
  if (init.right !== void 0) {
    map.right(init.right);
  }
  if (init.textAlign !== void 0) {
    map.textAlign(init.textAlign);
  }
  if (init.textDecorationColor !== void 0) {
    map.textDecorationColor(init.textDecorationColor);
  }
  if (init.textDecorationLine !== void 0) {
    map.textDecorationLine(init.textDecorationLine);
  }
  if (init.textDecorationStyle !== void 0) {
    map.textDecorationStyle(init.textDecorationStyle);
  }
  if (init.textOverflow !== void 0) {
    map.textOverflow(init.textOverflow);
  }
  if (init.textTransform !== void 0) {
    map.textTransform(init.textTransform);
  }
  if (init.top !== void 0) {
    map.top(init.top);
  }
  if (init.touchAction !== void 0) {
    map.touchAction(init.touchAction);
  }
  if (init.transform !== void 0) {
    map.transform(init.transform);
  }
  if (init.userSelect !== void 0) {
    map.userSelect(init.userSelect);
  }
  if (init.verticalAlign !== void 0) {
    map.verticalAlign(init.verticalAlign);
  }
  if (init.visibility !== void 0) {
    map.visibility(init.visibility);
  }
  if (init.whiteSpace !== void 0) {
    map.whiteSpace(init.whiteSpace);
  }
  if (init.width !== void 0) {
    map.width(init.width);
  }
  if (init.zIndex !== void 0) {
    map.zIndex(init.zIndex);
  }
};

StyleMap.define = function (prototype: StyleMap): void {
  StyleAnimator({propertyNames: "align-content", type: String})(prototype, "alignContent");

  StyleAnimator({propertyNames: "align-items", type: String})(prototype, "alignItems");

  StyleAnimator({propertyNames: "align-self", type: String})(prototype, "alignSelf");

  StyleAnimator({propertyNames: ["appearance", "-webkit-appearance"], type: String})(prototype, "appearance");

  StyleAnimator({propertyNames: ["backdrop-filter", "-webkit-backdrop-filter"], type: String})(prototype, "backdropFilter");

  StyleAnimator({propertyNames: ["background-clip", "-webkit-background-clip"], type: String})(prototype, "backgroundClip");

  StyleAnimator({propertyNames: "background-color", type: Color, state: null})(prototype, "backgroundColor");

  StyleAnimator({
    propertyNames: "background-image",
    type: Color,
    state: null,
    parse(value: string): LinearGradient | string | null {
      try {
        return LinearGradient.parse(value);
      } catch (swallow) {
        return value;
      }
    },
    fromAny(value: AnyLinearGradient | string): LinearGradient | string | null {
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
  })(prototype, "backgroundImage");

  StyleAnimator({propertyNames: "border-collapse", type: String})(prototype, "borderCollapse");

  prototype.borderColor = borderColor;

  StyleAnimator({propertyNames: "border-top-color", type: Color, state: null})(prototype, "borderTopColor");

  StyleAnimator({propertyNames: "border-right-color", type: Color, state: null})(prototype, "borderRightColor");

  StyleAnimator({propertyNames: "border-bottom-color", type: Color, state: null})(prototype, "borderBottomColor");

  StyleAnimator({propertyNames: "border-left-color", type: Color, state: null})(prototype, "borderLeftColor");

  prototype.borderRadius = borderRadius;

  StyleAnimator({propertyNames: "border-top-left-radius", type: Length, state: null})(prototype, "borderTopLeftRadius");

  StyleAnimator({propertyNames: "border-top-right-radius", type: Length, state: null})(prototype, "borderTopRightRadius");

  StyleAnimator({propertyNames: "border-bottom-right-radius", type: Length, state: null})(prototype, "borderBottomRightRadius");

  StyleAnimator({propertyNames: "border-bottom-left-radius", type: Length, state: null})(prototype, "borderBottomLeftRadius");

  StyleAnimator({propertyNames: "border-spacing", type: String})(prototype, "borderSpacing");

  prototype.borderStyle = borderStyle;

  StyleAnimator({propertyNames: "border-top-style", type: String})(prototype, "borderTopStyle");

  StyleAnimator({propertyNames: "border-right-style", type: String})(prototype, "borderRightStyle");

  StyleAnimator({propertyNames: "border-bottom-style", type: String})(prototype, "borderBottomStyle");

  StyleAnimator({propertyNames: "border-left-style", type: String})(prototype, "borderLeftStyle");

  prototype.borderWidth = borderWidth;

  StyleAnimator({propertyNames: "border-top-width", type: Length, state: null})(prototype, "borderTopWidth");

  StyleAnimator({propertyNames: "border-right-width", type: Length, state: null})(prototype, "borderRightWidth");

  StyleAnimator({propertyNames: "border-bottom-width", type: Length, state: null})(prototype, "borderBottomWidth");

  StyleAnimator({propertyNames: "border-left-width", type: Length, state: null})(prototype, "borderLeftWidth");

  StyleAnimatorConstraint({
    propertyNames: "bottom",
    type: Length,
    state: null,
    get computedValue(): Length | null {
      const node = this.owner.node;
      if (node instanceof HTMLElement) {
        const offsetParent = node.offsetParent;
        const offsetBounds = offsetParent !== null ? offsetParent.getBoundingClientRect()
                           : node === document.body ? node.getBoundingClientRect() : null;
        if (offsetBounds !== null) {
          const bounds = node.getBoundingClientRect();
          return Length.px(bounds.bottom - offsetBounds.bottom);
        }
      }
      return null;
    },
  })(prototype, "bottom");

  StyleAnimator({propertyNames: "box-shadow", type: BoxShadow, state: null})(prototype, "boxShadow");

  StyleAnimator({propertyNames: "box-sizing", type: String})(prototype, "boxSizing");

  StyleAnimator({propertyNames: "color", type: Color, state: null})(prototype, "color");

  StyleAnimator({propertyNames: "cursor", type: String})(prototype, "cursor");

  StyleAnimator({propertyNames: "display", type: String})(prototype, "display");

  StyleAnimator({propertyNames: "filter", type: String})(prototype, "filter");

  StyleAnimator({propertyNames: "flex-basis", type: Length, state: null})(prototype, "flexBasis");

  StyleAnimator({propertyNames: "flex-direction", type: String})(prototype, "flexDirection");

  StyleAnimator({propertyNames: "flex-grow", type: Number})(prototype, "flexGrow");

  StyleAnimator({propertyNames: "flex-shrink", type: Number})(prototype, "flexShrink");

  StyleAnimator({propertyNames: "flex-wrap", type: String})(prototype, "flexWrap");

  prototype.font = font;

  StyleAnimator({propertyNames: "font-family", type: FontFamily})(prototype, "fontFamily");

  StyleAnimator({propertyNames: "font-size", type: Length, state: null})(prototype, "fontSize");

  StyleAnimator({propertyNames: "font-stretch", type: String})(prototype, "fontStretch");

  StyleAnimator({propertyNames: "font-style", type: String})(prototype, "fontStyle");

  StyleAnimator({propertyNames: "font-variant", type: String})(prototype, "fontVariant");

  StyleAnimator({propertyNames: "font-weight", type: String})(prototype, "fontWeight");

  StyleAnimatorConstraint({
    propertyNames: "height",
    type: Length,
    state: null,
    get computedValue(): Length | null {
      const node = this.owner.node;
      return node instanceof HTMLElement ? Length.px(node.offsetHeight) : null;
    },
  })(prototype, "height");

  StyleAnimator({propertyNames: "justify-content", type: String})(prototype, "justifyContent");

  StyleAnimatorConstraint({
    propertyNames: "left",
    type: Length,
    state: null,
    get computedValue(): Length | null {
      const node = this.owner.node;
      return node instanceof HTMLElement ? Length.px(node.offsetLeft) : null;
    },
  })(prototype, "left");

  StyleAnimator({propertyNames: "line-height", type: Length, state: null})(prototype, "lineHeight");

  prototype.margin = margin;

  StyleAnimatorConstraint({propertyNames: "margin-top", type: Length, state: null})(prototype, "marginTop");

  StyleAnimatorConstraint({propertyNames: "margin-right", type: Length, state: null})(prototype, "marginRight");

  StyleAnimatorConstraint({propertyNames: "margin-bottom", type: Length, state: null})(prototype, "marginBottom");

  StyleAnimatorConstraint({propertyNames: "margin-left", type: Length, state: null})(prototype, "marginLeft");

  StyleAnimator({propertyNames: "max-height", type: Length, state: null})(prototype, "maxHeight");

  StyleAnimator({propertyNames: "max-width", type: Length, state: null})(prototype, "maxWidth");

  StyleAnimator({propertyNames: "min-height", type: Length, state: null})(prototype, "minHeight");

  StyleAnimator({propertyNames: "min-width", type: Length, state: null})(prototype, "minWidth");

  StyleAnimator({propertyNames: "opacity", type: Number})(prototype, "opacity");

  StyleAnimator({propertyNames: "order", type: Number})(prototype, "order");

  StyleAnimator({propertyNames: "outline-color", type: Color, state: null})(prototype, "outlineColor");

  StyleAnimator({propertyNames: "outline-style", type: String})(prototype, "outlineStyle");

  StyleAnimator({propertyNames: "outline-width", type: Length, state: null})(prototype, "outlineWidth");

  prototype.overflow = overflow;

  StyleAnimator({propertyNames: "overflow-x", type: String})(prototype, "overflowX");

  StyleAnimator({propertyNames: "overflow-y", type: String})(prototype, "overflowY");

  StyleAnimator({propertyNames: "-webkit-overflow-scrolling", type: String})(prototype, "overflowScrolling");

  prototype.overscrollBehavior = overscrollBehavior;

  StyleAnimator({propertyNames: "overscroll-behavior-x", type: String})(prototype, "overscrollBehaviorX");

  StyleAnimator({propertyNames: "overscroll-behavior-y", type: String})(prototype, "overscrollBehaviorY");

  prototype.padding = padding;

  StyleAnimatorConstraint({propertyNames: "padding-top", type: Length, state: null})(prototype, "paddingTop");

  StyleAnimatorConstraint({propertyNames: "padding-right", type: Length, state: null})(prototype, "paddingRight");

  StyleAnimatorConstraint({propertyNames: "padding-bottom", type: Length, state: null})(prototype, "paddingBottom");

  StyleAnimatorConstraint({propertyNames: "padding-left", type: Length, state: null})(prototype, "paddingLeft");

  StyleAnimator({propertyNames: "pointer-events", type: String})(prototype, "pointerEvents");

  StyleAnimator({propertyNames: "position", type: String})(prototype, "position");

  StyleAnimatorConstraint({
    propertyNames: "right",
    type: Length,
    state: null,
    get computedValue(): Length | null {
      const node = this.owner.node;
      if (node instanceof HTMLElement) {
        const offsetParent = node.offsetParent;
        const offsetBounds = offsetParent !== null ? offsetParent.getBoundingClientRect()
                           : node === document.body ? node.getBoundingClientRect() : null;
        if (offsetBounds !== null) {
          const bounds = node.getBoundingClientRect();
          return Length.px(bounds.right - offsetBounds.right);
        }
      }
      return null;
    },
  })(prototype, "right");

  StyleAnimator({propertyNames: "text-align", type: String})(prototype, "textAlign");

  StyleAnimator({propertyNames: "text-decoration-color", type: Color, state: null})(prototype, "textDecorationColor");

  StyleAnimator({propertyNames: "text-decoration-line", type: String})(prototype, "textDecorationLine");

  StyleAnimator({propertyNames: "text-decoration-style", type: String})(prototype, "textDecorationStyle");

  StyleAnimator({propertyNames: "text-overflow", type: String})(prototype, "textOverflow");

  StyleAnimator({propertyNames: "text-transform", type: String})(prototype, "textTransform");

  StyleAnimatorConstraint({
    propertyNames: "top",
    type: Length,
    state: null,
    get computedValue(): Length | null {
      const node = this.owner.node;
      return node instanceof HTMLElement ? Length.px(node.offsetTop) : null;
    },
  })(prototype, "top");

  StyleAnimator({propertyNames: "touch-action", type: String})(prototype, "touchAction");

  StyleAnimator({propertyNames: "transform", type: Transform, state: null})(prototype, "transform");

  StyleAnimator({propertyNames: ["user-select", "-webkit-user-select", "-moz-user-select", "-ms-user-select"], type: String})(prototype, "userSelect");

  StyleAnimator({propertyNames: "vertical-align", type: String})(prototype, "verticalAlign");

  StyleAnimator({propertyNames: "visibility", type: String})(prototype, "visibility");

  StyleAnimator({propertyNames: "white-space", type: String})(prototype, "whiteSpace");

  StyleAnimatorConstraint({
    propertyNames: "width",
    type: Length,
    state: null,
    get computedValue(): Length | null {
      const node = this.owner.node;
      return node instanceof HTMLElement ? Length.px(node.offsetWidth) : null;
    },
  })(prototype, "width");

  StyleAnimator({propertyNames: "z-index", type: Number})(prototype, "zIndex");
};

function borderColor(this: StyleMap): [Color | null, Color | null, Color | null, Color | null] | Color | null;
function borderColor(this: StyleMap, value: [AnyColor | null, AnyColor | null, AnyColor | null, AnyColor | null] | AnyColor | null, timing?: AnyTiming | boolean): StyleMap;
function borderColor(this: StyleMap, value?: [AnyColor | null, AnyColor | null, AnyColor | null, AnyColor | null] | AnyColor | null, timing?: AnyTiming | boolean): [Color | null, Color | null, Color | null, Color | null] | Color | null | StyleMap {
  if (value === void 0) {
    const borderTopColor = this.borderTopColor.value;
    const borderRightColor = this.borderRightColor.value;
    const borderBottomColor = this.borderBottomColor.value;
    const borderLeftColor = this.borderLeftColor.value;
    if (Values.equal(borderTopColor, borderRightColor)
        && Values.equal(borderRightColor, borderBottomColor)
        && Values.equal(borderBottomColor, borderLeftColor)) {
      return borderTopColor;
    } else {
      return [borderTopColor, borderRightColor, borderBottomColor, borderLeftColor];
    }
  } else {
    if (Array.isArray(value)) {
      if (value.length >= 1) {
        this.borderTopColor.setState(value[0], timing);
      }
      if (value.length >= 2) {
        this.borderRightColor.setState(value[1], timing);
      }
      if (value.length >= 3) {
        this.borderBottomColor.setState(value[2], timing);
      }
      if (value.length >= 4) {
        this.borderLeftColor.setState(value[3], timing);
      }
    } else {
      this.borderTopColor.setState(value, timing);
      this.borderRightColor.setState(value, timing);
      this.borderBottomColor.setState(value, timing);
      this.borderLeftColor.setState(value, timing);
    }
    return this;
  }
}

function borderRadius(this: StyleMap): [Length | null, Length | null, Length | null, Length | null] | Length | null;
function borderRadius(this: StyleMap, value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean): StyleMap;
function borderRadius(this: StyleMap, value?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null,timing?: AnyTiming | boolean): [Length | null, Length | null, Length | null, Length | null] | Length | null | StyleMap {
  if (value === void 0) {
    const borderTopLeftRadius = this.borderTopLeftRadius.value;
    const borderTopRightRadius = this.borderTopRightRadius.value;
    const borderBottomRightRadius = this.borderBottomRightRadius.value;
    const borderBottomLeftRadius = this.borderBottomLeftRadius.value;
    if (Equals(borderTopLeftRadius, borderTopRightRadius)
        && Equals(borderTopRightRadius, borderBottomRightRadius)
        && Equals(borderBottomRightRadius, borderBottomLeftRadius)) {
      return borderTopLeftRadius;
    } else {
      return [borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius];
    }
  } else {
    if (Array.isArray(value)) {
      if (value.length >= 1) {
        this.borderTopLeftRadius.setState(value[0], timing);
      }
      if (value.length >= 2) {
        this.borderTopRightRadius.setState(value[1], timing);
      }
      if (value.length >= 3) {
        this.borderBottomRightRadius.setState(value[2], timing);
      }
      if (value.length >= 4) {
        this.borderBottomLeftRadius.setState(value[3], timing);
      }
    } else {
      this.borderTopLeftRadius.setState(value, timing);
      this.borderTopRightRadius.setState(value, timing);
      this.borderBottomRightRadius.setState(value, timing);
      this.borderBottomLeftRadius.setState(value, timing);
    }
    return this;
  }
}

function borderStyle(this: StyleMap): [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined;
function borderStyle(this: StyleMap, value: [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined, timing?: AnyTiming | boolean): StyleMap;
function borderStyle(this: StyleMap, value?: [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined, timing?: AnyTiming | boolean): [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined | StyleMap {
  if (value === void 0) {
    const borderTopStyle = this.borderTopStyle.value;
    const borderRightStyle = this.borderRightStyle.value;
    const borderBottomStyle = this.borderBottomStyle.value;
    const borderLeftStyle = this.borderLeftStyle.value;
    if (borderTopStyle === borderRightStyle
        && borderRightStyle === borderBottomStyle
        && borderBottomStyle === borderLeftStyle) {
      return borderTopStyle;
    } else {
      return [borderTopStyle, borderRightStyle, borderBottomStyle, borderLeftStyle];
    }
  } else {
    if (Array.isArray(value)) {
      if (value.length >= 1) {
        this.borderTopStyle.setState(value[0], timing);
      }
      if (value.length >= 2) {
        this.borderRightStyle.setState(value[1], timing);
      }
      if (value.length >= 3) {
        this.borderBottomStyle.setState(value[2], timing);
      }
      if (value.length >= 4) {
        this.borderLeftStyle.setState(value[3], timing);
      }
    } else {
      this.borderTopStyle.setState(value, timing);
      this.borderRightStyle.setState(value, timing);
      this.borderBottomStyle.setState(value, timing);
      this.borderLeftStyle.setState(value, timing);
    }
    return this;
  }
}

function borderWidth(this: StyleMap): [Length | null, Length | null, Length | null, Length | null] | Length | null;
function borderWidth(this: StyleMap, value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean): StyleMap;
function borderWidth(this: StyleMap, value?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean): [Length | null, Length | null, Length | null, Length | null] | Length | null | StyleMap {
  if (value === void 0) {
    const borderTopWidth = this.borderTopWidth.value;
    const borderRightWidth = this.borderRightWidth.value;
    const borderBottomWidth = this.borderBottomWidth.value;
    const borderLeftWidth = this.borderLeftWidth.value;
    if (Values.equal(borderTopWidth, borderRightWidth)
        && Values.equal(borderRightWidth, borderBottomWidth)
        && Values.equal(borderBottomWidth, borderLeftWidth)) {
      return borderTopWidth;
    } else {
      return [borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth];
    }
  } else {
    if (Array.isArray(value)) {
      if (value.length >= 1) {
        this.borderTopWidth.setState(value[0], timing);
      }
      if (value.length >= 2) {
        this.borderRightWidth.setState(value[1], timing);
      }
      if (value.length >= 3) {
        this.borderBottomWidth.setState(value[2], timing);
      }
      if (value.length >= 4) {
        this.borderLeftWidth.setState(value[3], timing);
      }
    } else {
      this.borderTopWidth.setState(value, timing);
      this.borderRightWidth.setState(value, timing);
      this.borderBottomWidth.setState(value, timing);
      this.borderLeftWidth.setState(value, timing);
    }
    return this;
  }
}

function font(this: StyleMap): Font | null;
function font(this: StyleMap, value: AnyFont | null, timing?: AnyTiming | boolean): StyleMap;
function font(this: StyleMap, value?: AnyFont | null, timing?: AnyTiming | boolean): Font | null | StyleMap {
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

function margin(this: StyleMap): [Length | null, Length | null, Length | null, Length | null] | Length | null;
function margin(this: StyleMap, value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean): StyleMap;
function margin(this: StyleMap, value?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean): [Length | null, Length | null, Length | null, Length | null] | Length | null | StyleMap {
  if (value === void 0) {
    const marginTop = this.marginTop.value;
    const marginRight = this.marginRight.value;
    const marginBottom = this.marginBottom.value;
    const marginLeft = this.marginLeft.value;
    if (Values.equal(marginTop, marginRight)
        && Values.equal(marginRight, marginBottom)
        && Values.equal(marginBottom, marginLeft)) {
      return marginTop;
    } else {
      return [marginTop, marginRight, marginBottom, marginLeft];
    }
  } else {
    if (Array.isArray(value)) {
      if (value.length >= 1) {
        this.marginTop.setState(value[0], timing);
      }
      if (value.length >= 2) {
        this.marginRight.setState(value[1], timing);
      }
      if (value.length >= 3) {
        this.marginBottom.setState(value[2], timing);
      }
      if (value.length >= 4) {
        this.marginLeft.setState(value[3], timing);
      }
    } else {
      this.marginTop.setState(value, timing);
      this.marginRight.setState(value, timing);
      this.marginBottom.setState(value, timing);
      this.marginLeft.setState(value, timing);
    }
    return this;
  }
}

function overflow(this: StyleMap): [Overflow | undefined, Overflow | undefined] | Overflow | undefined;
function overflow(this: StyleMap, value: [Overflow | undefined, Overflow | undefined] | Overflow | undefined, timing?: AnyTiming | boolean): StyleMap;
function overflow(this: StyleMap, value?: [Overflow | undefined, Overflow | undefined] | Overflow | undefined, timing?: AnyTiming | boolean): [Overflow | undefined, Overflow | undefined] | Overflow | undefined | StyleMap {
  if (value === void 0) {
    const overflowX = this.overflowX.value;
    const overflowY = this.overflowY.value;
    if (overflowX === overflowY) {
      return overflowX;
    } else {
      return [overflowX, overflowY];
    }
  } else {
    if (Array.isArray(value)) {
      if (value.length >= 1) {
        this.overflowX.setState(value[0], timing);
      }
      if (value.length >= 2) {
        this.overflowY.setState(value[1], timing);
      }
    } else {
      this.overflowX.setState(value, timing);
      this.overflowY.setState(value, timing);
    }
    return this;
  }
}

function overscrollBehavior(this: StyleMap): [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined;
function overscrollBehavior(this: StyleMap, value: [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined, timing?: AnyTiming | boolean): StyleMap;
function overscrollBehavior(this: StyleMap, value?: [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined, timing?: AnyTiming | boolean): [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined | StyleMap {
  if (value === void 0) {
    const overscrollBehaviorX = this.overscrollBehaviorX.value;
    const overscrollBehaviorY = this.overscrollBehaviorY.value;
    if (overscrollBehaviorX === overscrollBehaviorY) {
      return overscrollBehaviorX;
    } else {
      return [overscrollBehaviorX, overscrollBehaviorY];
    }
  } else {
    if (Array.isArray(value)) {
      if (value.length >= 1) {
        this.overscrollBehaviorX.setState(value[0], timing);
      }
      if (value.length >= 2) {
        this.overscrollBehaviorY.setState(value[1], timing);
      }
    } else {
      this.overscrollBehaviorX.setState(value, timing);
      this.overscrollBehaviorY.setState(value, timing);
    }
    return this;
  }
}

function padding(this: StyleMap): [Length | null, Length | null, Length | null, Length | null] | Length | null;
function padding(this: StyleMap, value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean): StyleMap;
function padding(this: StyleMap, value?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean): [Length | null, Length | null, Length | null, Length | null] | Length | null | StyleMap {
  if (value === void 0) {
    const paddingTop = this.paddingTop.value;
    const paddingRight = this.paddingRight.value;
    const paddingBottom = this.paddingBottom.value;
    const paddingLeft = this.paddingLeft.value;
    if (Equals(paddingTop, paddingRight)
        && Equals(paddingRight, paddingBottom)
        && Equals(paddingBottom, paddingLeft)) {
      return paddingTop;
    } else {
      return [paddingTop, paddingRight, paddingBottom, paddingLeft];
    }
  } else {
    if (Array.isArray(value)) {
      if (value.length >= 1) {
        this.paddingTop.setState(value[0], timing);
      }
      if (value.length >= 2) {
        this.paddingRight.setState(value[1], timing);
      }
      if (value.length >= 3) {
        this.paddingBottom.setState(value[2], timing);
      }
      if (value.length >= 4) {
        this.paddingLeft.setState(value[3], timing);
      }
    } else {
      this.paddingTop.setState(value, timing);
      this.paddingRight.setState(value, timing);
      this.paddingBottom.setState(value, timing);
      this.paddingLeft.setState(value, timing);
    }
    return this;
  }
}
