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

import {__esDecorate} from "tslib";
import {Values} from "@swim/util";
import {Equals} from "@swim/util";
import type {AnyTiming} from "@swim/util";
import type {AnyAnimatorValue} from "@swim/component";
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
import type {AnyLinearGradient} from "@swim/style";
import {LinearGradient} from "@swim/style";
import type {AnyBoxShadow} from "@swim/style";
import {BoxShadow} from "@swim/style";
import type {StyleAnimatorDecorator} from "./StyleAnimator";
import {StyleAnimator} from "./StyleAnimator";
import {LengthStyleAnimator} from "./StyleAnimator";
import {LengthStyleConstraintAnimator} from "./StyleConstraintAnimator";
import type {AlignContent} from "./Css";
import type {AlignItems} from "./Css";
import type {AlignSelf} from "./Css";
import type {Appearance} from "./Css";
import type {BackgroundClip} from "./Css";
import type {BorderCollapse} from "./Css";
import type {BorderStyle} from "./Css";
import type {BoxSizing} from "./Css";
import type {CssCursor} from "./Css";
import type {CssDisplay} from "./Css";
import type {FlexBasis} from "./Css";
import type {FlexDirection} from "./Css";
import type {FlexWrap} from "./Css";
import type {JustifyContent} from "./Css";
import type {Overflow} from "./Css";
import type {OverscrollBehavior} from "./Css";
import type {PointerEvents} from "./Css";
import type {Position} from "./Css";
import type {TextAlign} from "./Css";
import type {TextDecorationStyle} from "./Css";
import type {TextTransform} from "./Css";
import type {TouchAction} from "./Css";
import type {UserSelect} from "./Css";
import type {VerticalAlign} from "./Css";
import type {Visibility} from "./Css";
import type {WhiteSpace} from "./Css";
import type {StyleContext} from "./StyleContext";

/** @public */
export interface StyleMapInit {
  alignContent?: AnyAnimatorValue<StyleMap["alignContent"]>;
  alignItems?: AnyAnimatorValue<StyleMap["alignItems"]>;
  alignSelf?: AnyAnimatorValue<StyleMap["alignSelf"]>;
  appearance?: AnyAnimatorValue<StyleMap["appearance"]>;
  backdropFilter?: AnyAnimatorValue<StyleMap["backdropFilter"]>;
  backgroundClip?: AnyAnimatorValue<StyleMap["backgroundClip"]>;
  backgroundColor?: AnyAnimatorValue<StyleMap["backgroundColor"]>;
  backgroundImage?: AnyAnimatorValue<StyleMap["backgroundImage"]>;
  borderCollapse?: AnyAnimatorValue<StyleMap["borderCollapse"]>;
  borderColor?: [AnyColor | null, AnyColor | null, AnyColor | null, AnyColor | null] | AnyColor | null;
  borderTopColor?: AnyAnimatorValue<StyleMap["borderTopColor"]>;
  borderRightColor?: AnyAnimatorValue<StyleMap["borderRightColor"]>;
  borderBottomColor?: AnyAnimatorValue<StyleMap["borderBottomColor"]>;
  borderLeftColor?: AnyAnimatorValue<StyleMap["borderLeftColor"]>;
  borderRadius?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null;
  borderTopLeftRadius?: AnyAnimatorValue<StyleMap["borderTopLeftRadius"]>;
  borderTopRightRadius?: AnyAnimatorValue<StyleMap["borderTopRightRadius"]>;
  borderBottomRightRadius?: AnyAnimatorValue<StyleMap["borderBottomRightRadius"]>;
  borderBottomLeftRadius?: AnyAnimatorValue<StyleMap["borderBottomLeftRadius"]>;
  borderSpacing?: AnyAnimatorValue<StyleMap["borderSpacing"]>;
  borderStyle?: [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined;
  borderTopStyle?: AnyAnimatorValue<StyleMap["borderTopStyle"]>;
  borderRightStyle?: AnyAnimatorValue<StyleMap["borderRightStyle"]>;
  borderBottomStyle?: AnyAnimatorValue<StyleMap["borderBottomStyle"]>;
  borderLeftStyle?: AnyAnimatorValue<StyleMap["borderLeftStyle"]>;
  borderWidth?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null;
  borderTopWidth?: AnyAnimatorValue<StyleMap["borderTopWidth"]>;
  borderRightWidth?: AnyAnimatorValue<StyleMap["borderRightWidth"]>;
  borderBottomWidth?: AnyAnimatorValue<StyleMap["borderBottomWidth"]>;
  borderLeftWidth?: AnyAnimatorValue<StyleMap["borderLeftWidth"]>;
  bottom?: AnyAnimatorValue<StyleMap["bottom"]>;
  boxShadow?: AnyAnimatorValue<StyleMap["boxShadow"]>;
  boxSizing?: AnyAnimatorValue<StyleMap["boxSizing"]>;
  color?: AnyAnimatorValue<StyleMap["color"]>;
  cursor?: AnyAnimatorValue<StyleMap["cursor"]>;
  display?: AnyAnimatorValue<StyleMap["display"]>;
  filter?: AnyAnimatorValue<StyleMap["filter"]>;
  flexBasis?: AnyAnimatorValue<StyleMap["flexBasis"]>;
  flexDirection?: AnyAnimatorValue<StyleMap["flexDirection"]>;
  flexGrow?: AnyAnimatorValue<StyleMap["flexGrow"]>;
  flexShrink?: AnyAnimatorValue<StyleMap["flexShrink"]>;
  flexWrap?: AnyAnimatorValue<StyleMap["flexWrap"]>;
  font?: AnyFont;
  fontFamily?: AnyAnimatorValue<StyleMap["fontFamily"]>;
  fontSize?: AnyAnimatorValue<StyleMap["fontSize"]>;
  fontStretch?: AnyAnimatorValue<StyleMap["fontStretch"]>;
  fontStyle?: AnyAnimatorValue<StyleMap["fontStyle"]>;
  fontVariant?: AnyAnimatorValue<StyleMap["fontVariant"]>;
  fontWeight?: AnyAnimatorValue<StyleMap["fontWeight"]>;
  height?: AnyAnimatorValue<StyleMap["height"]>;
  justifyContent?: AnyAnimatorValue<StyleMap["justifyContent"]>;
  left?: AnyAnimatorValue<StyleMap["left"]>;
  lineHeight?: AnyAnimatorValue<StyleMap["lineHeight"]>;
  margin?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength;
  marginTop?: AnyAnimatorValue<StyleMap["marginTop"]>;
  marginRight?: AnyAnimatorValue<StyleMap["marginRight"]>;
  marginBottom?: AnyAnimatorValue<StyleMap["marginBottom"]>;
  marginLeft?: AnyAnimatorValue<StyleMap["marginLeft"]>;
  maxHeight?: AnyAnimatorValue<StyleMap["maxHeight"]>;
  maxWidth?: AnyAnimatorValue<StyleMap["maxWidth"]>;
  minHeight?: AnyAnimatorValue<StyleMap["minHeight"]>;
  minWidth?: AnyAnimatorValue<StyleMap["minWidth"]>;
  opacity?: AnyAnimatorValue<StyleMap["opacity"]>;
  order?: AnyAnimatorValue<StyleMap["order"]>;
  outlineColor?: AnyAnimatorValue<StyleMap["outlineColor"]>;
  outlineOffset?: AnyAnimatorValue<StyleMap["outlineOffset"]>;
  outlineStyle?: AnyAnimatorValue<StyleMap["outlineStyle"]>;
  outlineWidth?: AnyAnimatorValue<StyleMap["outlineWidth"]>;
  overflow?: [Overflow | undefined, Overflow | undefined] | Overflow | undefined;
  overflowX?: AnyAnimatorValue<StyleMap["overflowX"]>;
  overflowY?: AnyAnimatorValue<StyleMap["overflowY"]>;
  overflowScrolling?: AnyAnimatorValue<StyleMap["overflowScrolling"]>;
  overscrollBehavior?: [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined;
  overscrollBehaviorX?: AnyAnimatorValue<StyleMap["overscrollBehaviorX"]>;
  overscrollBehaviorY?: AnyAnimatorValue<StyleMap["overscrollBehaviorY"]>;
  padding?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null;
  paddingTop?: AnyAnimatorValue<StyleMap["paddingTop"]>;
  paddingRight?: AnyAnimatorValue<StyleMap["paddingRight"]>;
  paddingBottom?: AnyAnimatorValue<StyleMap["paddingBottom"]>;
  paddingLeft?: AnyAnimatorValue<StyleMap["paddingLeft"]>;
  pointerEvents?: AnyAnimatorValue<StyleMap["pointerEvents"]>;
  position?: AnyAnimatorValue<StyleMap["position"]>;
  right?: AnyAnimatorValue<StyleMap["right"]>;
  textAlign?: AnyAnimatorValue<StyleMap["textAlign"]>;
  textDecorationColor?: AnyAnimatorValue<StyleMap["textDecorationColor"]>;
  textDecorationLine?: AnyAnimatorValue<StyleMap["textDecorationLine"]>;
  textDecorationStyle?: AnyAnimatorValue<StyleMap["textDecorationStyle"]>;
  textOverflow?: AnyAnimatorValue<StyleMap["textOverflow"]>;
  textTransform?: AnyAnimatorValue<StyleMap["textTransform"]>;
  top?: AnyAnimatorValue<StyleMap["top"]>;
  touchAction?: AnyAnimatorValue<StyleMap["touchAction"]>;
  transform?: AnyAnimatorValue<StyleMap["transform"]>;
  userSelect?: AnyAnimatorValue<StyleMap["userSelect"]>;
  verticalAlign?: AnyAnimatorValue<StyleMap["verticalAlign"]>;
  visibility?: AnyAnimatorValue<StyleMap["visibility"]>;
  whiteSpace?: AnyAnimatorValue<StyleMap["whiteSpace"]>;
  width?: AnyAnimatorValue<StyleMap["width"]>;
  zIndex?: AnyAnimatorValue<StyleMap["zIndex"]>;
}

/** @public */
export interface StyleMap extends StyleContext {
  readonly alignContent: StyleAnimator<this, AlignContent | undefined>;

  readonly alignItems: StyleAnimator<this, AlignItems | undefined>;

  readonly alignSelf: StyleAnimator<this, AlignSelf | undefined>;

  readonly appearance: StyleAnimator<this, Appearance | undefined>;

  readonly backdropFilter: StyleAnimator<this, string | undefined>;

  readonly backgroundClip: StyleAnimator<this, BackgroundClip | undefined>;

  readonly backgroundColor: StyleAnimator<this, Color | null, AnyColor | null>;

  readonly backgroundImage: StyleAnimator<this, LinearGradient | string | null, AnyLinearGradient | string | null>;

  readonly borderCollapse: StyleAnimator<this, BorderCollapse | undefined>;

  borderColor(): [Color | null, Color | null, Color | null, Color | null] | Color | null;
  borderColor(value: [AnyColor | null, AnyColor | null, AnyColor | null, AnyColor | null] | AnyColor | null, timing?: AnyTiming | boolean, precedence?: number): this;

  readonly borderTopColor: StyleAnimator<this, Color | null, AnyColor | null>;

  readonly borderRightColor: StyleAnimator<this, Color | null, AnyColor | null>;

  readonly borderBottomColor: StyleAnimator<this, Color | null, AnyColor | null>;

  readonly borderLeftColor: StyleAnimator<this, Color | null, AnyColor | null>;

  borderRadius(): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  borderRadius(value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, precedence?: number): this;

  readonly borderTopLeftRadius: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  readonly borderTopRightRadius: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  readonly borderBottomRightRadius: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  readonly borderBottomLeftRadius: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  readonly borderSpacing: StyleAnimator<this, string | undefined>;

  borderStyle(): [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined;
  borderStyle(value: [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined, timing?: AnyTiming | boolean, precedence?: number): this;

  readonly borderTopStyle: StyleAnimator<this, BorderStyle | undefined>;

  readonly borderRightStyle: StyleAnimator<this, BorderStyle | undefined>;

  readonly borderBottomStyle: StyleAnimator<this, BorderStyle | undefined>;

  readonly borderLeftStyle: StyleAnimator<this, BorderStyle | undefined>;

  borderWidth(): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  borderWidth(value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, precedence?: number): this;

  readonly borderTopWidth: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  readonly borderRightWidth: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  readonly borderBottomWidth: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  readonly borderLeftWidth: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  readonly bottom: LengthStyleConstraintAnimator<this, Length | null, AnyLength | null>;

  readonly boxShadow: StyleAnimator<this, BoxShadow | null, AnyBoxShadow | null>;

  readonly boxSizing: StyleAnimator<this, BoxSizing | undefined>;

  readonly color: StyleAnimator<this, Color | null, AnyColor | null>;

  readonly cursor: StyleAnimator<this, CssCursor | undefined>;

  readonly display: StyleAnimator<this, CssDisplay | undefined>;

  readonly filter: StyleAnimator<this, string | undefined>;

  readonly flexBasis: StyleAnimator<this, Length | FlexBasis | null, AnyLength | FlexBasis | null>;

  readonly flexDirection: StyleAnimator<this, FlexDirection | string>;

  readonly flexGrow: StyleAnimator<this, number | undefined>;

  readonly flexShrink: StyleAnimator<this, number | undefined>;

  readonly flexWrap: StyleAnimator<this, FlexWrap | undefined>;

  font(): Font | null;
  font(value: AnyFont | null, timing?: AnyTiming | boolean, precedence?: number): this;

  readonly fontFamily: StyleAnimator<this, FontFamily | FontFamily[] | undefined, FontFamily | ReadonlyArray<FontFamily> | undefined>;

  readonly fontSize: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  readonly fontStretch: StyleAnimator<this, FontStretch | undefined>;

  readonly fontStyle: StyleAnimator<this, FontStyle | undefined>;

  readonly fontVariant: StyleAnimator<this, FontVariant | undefined>;

  readonly fontWeight: StyleAnimator<this, FontWeight | undefined>;

  readonly height: LengthStyleConstraintAnimator<this, Length | null, AnyLength | null>;

  readonly justifyContent: StyleAnimator<this, JustifyContent | undefined>;

  readonly left: LengthStyleConstraintAnimator<this, Length | null, AnyLength | null>;

  readonly lineHeight: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  margin(): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  margin(value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, precedence?: number): this;

  readonly marginTop: LengthStyleConstraintAnimator<this, Length | null, AnyLength | null>;

  readonly marginRight: LengthStyleConstraintAnimator<this, Length | null, AnyLength | null>;

  readonly marginBottom: LengthStyleConstraintAnimator<this, Length | null, AnyLength | null>;

  readonly marginLeft: LengthStyleConstraintAnimator<this, Length | null, AnyLength | null>;

  readonly maxHeight: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  readonly maxWidth: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  readonly minHeight: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  readonly minWidth: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  readonly opacity: StyleAnimator<this, number | undefined>;

  readonly order: StyleAnimator<this, number | undefined>;

  readonly outlineColor: StyleAnimator<this, Color | null, AnyColor | null>;

  readonly outlineOffset: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  readonly outlineStyle: StyleAnimator<this, BorderStyle | undefined>;

  readonly outlineWidth: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  overflow(): [Overflow | undefined, Overflow | undefined] | Overflow | undefined;
  overflow(value: [Overflow | undefined, Overflow | undefined] | Overflow | undefined, timing?: AnyTiming | boolean, precedence?: number): this;

  readonly overflowX: StyleAnimator<this, Overflow | undefined>;

  readonly overflowY: StyleAnimator<this, Overflow | undefined>;

  readonly overflowScrolling: StyleAnimator<this, "auto" | "touch" | undefined>;

  overscrollBehavior(): [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined;
  overscrollBehavior(value: [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined, timing?: AnyTiming | boolean, precedence?: number): this;

  readonly overscrollBehaviorX: StyleAnimator<this, OverscrollBehavior | undefined>;

  readonly overscrollBehaviorY: StyleAnimator<this, OverscrollBehavior | undefined>;

  padding(): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  padding(value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, precedence?: number): this;

  readonly paddingTop: LengthStyleConstraintAnimator<this, Length | null, AnyLength | null>;

  readonly paddingRight: LengthStyleConstraintAnimator<this, Length | null, AnyLength | null>;

  readonly paddingBottom: LengthStyleConstraintAnimator<this, Length | null, AnyLength | null>;

  readonly paddingLeft: LengthStyleConstraintAnimator<this, Length | null, AnyLength | null>;

  readonly pointerEvents: StyleAnimator<this, PointerEvents | undefined>;

  readonly position: StyleAnimator<this, Position | undefined>;

  readonly right: LengthStyleConstraintAnimator<this, Length | null, AnyLength | null>;

  readonly textAlign: StyleAnimator<this, TextAlign | undefined>;

  readonly textDecorationColor: StyleAnimator<this, Color | null, AnyColor | null>;

  readonly textDecorationLine: StyleAnimator<this, string | undefined>;

  readonly textDecorationStyle: StyleAnimator<this, TextDecorationStyle | undefined>;

  readonly textOverflow: StyleAnimator<this, string | undefined>;

  readonly textTransform: StyleAnimator<this, TextTransform | undefined>;

  readonly top: LengthStyleConstraintAnimator<this, Length | null, AnyLength | null>;

  readonly touchAction: StyleAnimator<this, TouchAction | undefined>;

  readonly transform: StyleAnimator<this, Transform | null, AnyTransform | null>;

  readonly userSelect: StyleAnimator<this, UserSelect | undefined>;

  readonly verticalAlign: StyleAnimator<this, VerticalAlign | undefined, AnyLength | VerticalAlign | undefined>;

  readonly visibility: StyleAnimator<this, Visibility | undefined>;

  readonly whiteSpace: StyleAnimator<this, WhiteSpace | undefined>;

  readonly width: LengthStyleConstraintAnimator<this, Length | null, AnyLength | null>;

  readonly zIndex: StyleAnimator<this, number | undefined>;
}

/** @public */
export const StyleMap = (function () {
  const StyleMap = {} as {
    /** @internal */
    init(map: StyleMap, init: StyleMapInit): void;

    /** @internal */
    decorate<K extends keyof StyleMap>(name: K, decorators: StyleMap[K] extends StyleAnimator<any, any, any> ? StyleAnimatorDecorator<StyleMap[K]>[] : never,
                                       initializerMap: {[name: string | symbol]: Function[]}, extraInitializers: Function[]): void;

    /** @internal */
    define(prototype: StyleMap, initializerMap: {[name: string | symbol]: Function[]}, extraInitializers: Function[]): void;

    /** @internal */
    pctWidthUnit(node: Node | undefined): number;

    /** @internal */
    pctHeightUnit(node: Node | undefined): number;
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
    if (init.outlineOffset !== void 0) {
      map.outlineOffset(init.outlineOffset);
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

  StyleMap.decorate = function <K extends keyof StyleMap>(name: K, decorators: StyleMap[K] extends StyleAnimator<any, any, any> ? StyleAnimatorDecorator<StyleMap[K]>[] : never,
                                                          initializerMap: {[name: string | symbol]: Function[]}, extraInitializers: Function[]): void {
    __esDecorate(null, null, decorators as Function[], {
      kind: "field",
      name,
      static: false,
      private: false,
      access: {
        has(obj: StyleMap): boolean {
          return name in obj;
        },
        get(obj: StyleMap): StyleMap[K] {
          return obj[name];
        },
        set(obj: StyleMap, value: StyleMap[K]): void {
          obj[name] = value;
        },
      },
    }, initializerMap[name] = [], extraInitializers);
  };

  StyleMap.define = function (prototype: StyleMap, initializerMap: {[name: string | symbol]: Function[]}, extraInitializers: Function[]): void {
    StyleMap.decorate("alignContent", [StyleAnimator({
      propertyNames: "align-content",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("alignItems", [StyleAnimator({
      propertyNames: "align-items",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("alignSelf", [StyleAnimator({
      propertyNames: "align-self",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("appearance", [StyleAnimator({
      propertyNames: ["appearance", "-webkit-appearance"],
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("backdropFilter", [StyleAnimator({
      propertyNames: ["backdrop-filter", "-webkit-backdrop-filter"],
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("backgroundClip", [StyleAnimator({
      propertyNames: ["background-clip", "-webkit-background-clip"],
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("backgroundColor", [StyleAnimator({
      propertyNames: "background-color",
      valueType: Color,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("backgroundImage", [StyleAnimator({
      propertyNames: "background-image",
      value: null,
      parse(value: string): LinearGradient | string | null {
        try {
          return LinearGradient.parse(value);
        } catch (swallow) {
          return value;
        }
      },
      fromAny(value: AnyLinearGradient | string | null): LinearGradient | string | null {
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
    })], initializerMap, extraInitializers);

    StyleMap.decorate("borderCollapse", [StyleAnimator({
      propertyNames: "border-collapse",
      valueType: String,
    })], initializerMap, extraInitializers);

    prototype.borderColor = borderColor;

    StyleMap.decorate("borderTopColor", [StyleAnimator({
      propertyNames: "border-top-color",
      valueType: Color,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("borderRightColor", [StyleAnimator({
      propertyNames: "border-right-color",
      valueType: Color,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("borderBottomColor", [StyleAnimator({
      propertyNames: "border-bottom-color",
      valueType: Color,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("borderLeftColor", [StyleAnimator({
      propertyNames: "border-left-color",
      valueType: Color,
      value: null,
    })], initializerMap, extraInitializers);

    prototype.borderRadius = borderRadius;

    StyleMap.decorate("borderTopLeftRadius", [LengthStyleAnimator({
      propertyNames: "border-top-left-radius",
      valueType: Length,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("borderTopRightRadius", [LengthStyleAnimator({
      propertyNames: "border-top-right-radius",
      valueType: Length,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("borderBottomRightRadius", [LengthStyleAnimator({
      propertyNames: "border-bottom-right-radius",
      valueType: Length,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("borderBottomLeftRadius", [LengthStyleAnimator({
      propertyNames: "border-bottom-left-radius",
      valueType: Length,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("borderSpacing", [StyleAnimator({
      propertyNames: "border-spacing",
      valueType: String,
    })], initializerMap, extraInitializers);

    prototype.borderStyle = borderStyle;

    StyleMap.decorate("borderTopStyle", [StyleAnimator({
      propertyNames: "border-top-style",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("borderRightStyle", [StyleAnimator({
      propertyNames: "border-right-style",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("borderBottomStyle", [StyleAnimator({
      propertyNames: "border-bottom-style",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("borderLeftStyle", [StyleAnimator({
      propertyNames: "border-left-style",
      valueType: String,
    })], initializerMap, extraInitializers);

    prototype.borderWidth = borderWidth;

    StyleMap.decorate("borderTopWidth", [LengthStyleAnimator({
      propertyNames: "border-top-width",
      valueType: Length,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("borderRightWidth", [LengthStyleAnimator({
      propertyNames: "border-right-width",
      valueType: Length,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("borderBottomWidth", [LengthStyleAnimator({
      propertyNames: "border-bottom-width",
      valueType: Length,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("borderLeftWidth", [LengthStyleAnimator({
      propertyNames: "border-left-width",
      valueType: Length,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("bottom", [LengthStyleConstraintAnimator({
      propertyNames: "bottom",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctHeightUnit(this.owner.node);
      },
    })], initializerMap, extraInitializers);

    StyleMap.decorate("boxShadow", [StyleAnimator({
      propertyNames: "box-shadow",
      valueType: BoxShadow,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("boxSizing", [StyleAnimator({
      propertyNames: "box-sizing",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("color", [StyleAnimator({
      propertyNames: "color",
      valueType: Color,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("cursor", [StyleAnimator({
      propertyNames: "cursor",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("display", [StyleAnimator({
      propertyNames: "display",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("filter", [StyleAnimator({
      propertyNames: "filter",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("flexBasis", [StyleAnimator({
      propertyNames: "flex-basis",
      valueType: Length,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("flexDirection", [StyleAnimator({
      propertyNames: "flex-direction",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("flexGrow", [StyleAnimator({
      propertyNames: "flex-grow",
      valueType: Number,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("flexShrink", [StyleAnimator({
      propertyNames: "flex-shrink",
      valueType: Number,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("flexWrap", [StyleAnimator({
      propertyNames: "flex-wrap",
      valueType: Number,
    })], initializerMap, extraInitializers);

    prototype.font = font;

    StyleMap.decorate("fontFamily", [StyleAnimator({
      propertyNames: "font-family",
      valueType: FontFamily,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("fontSize", [LengthStyleAnimator({
      propertyNames: "font-size",
      valueType: Length,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("fontStretch", [StyleAnimator({
      propertyNames: "font-stretch",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("fontStyle", [StyleAnimator({
      propertyNames: "font-style",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("fontVariant", [StyleAnimator({
      propertyNames: "font-variant",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("fontWeight", [StyleAnimator({
      propertyNames: "font-weight",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("height", [LengthStyleConstraintAnimator({
      propertyNames: "height",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctHeightUnit(this.owner.node);
      },
    })], initializerMap, extraInitializers);

    StyleMap.decorate("justifyContent", [StyleAnimator({
      propertyNames: "justify-content",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("left", [LengthStyleConstraintAnimator({
      propertyNames: "left",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], initializerMap, extraInitializers);

    StyleMap.decorate("lineHeight", [LengthStyleAnimator({
      propertyNames: "line-height",
      valueType: Length,
      value: null,
    })], initializerMap, extraInitializers);

    prototype.margin = margin;

    StyleMap.decorate("marginTop", [LengthStyleConstraintAnimator({
      propertyNames: "margin-top",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], initializerMap, extraInitializers);

    StyleMap.decorate("marginRight", [LengthStyleConstraintAnimator({
      propertyNames: "margin-right",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], initializerMap, extraInitializers);

    StyleMap.decorate("marginBottom", [LengthStyleConstraintAnimator({
      propertyNames: "margin-bottom",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], initializerMap, extraInitializers);

    StyleMap.decorate("marginLeft", [LengthStyleConstraintAnimator({
      propertyNames: "margin-left",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], initializerMap, extraInitializers);

    StyleMap.decorate("maxHeight", [LengthStyleAnimator({
      propertyNames: "max-height",
      valueType: Length,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("maxWidth", [LengthStyleAnimator({
      propertyNames: "max-width",
      valueType: Length,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("minHeight", [LengthStyleAnimator({
      propertyNames: "min-height",
      valueType: Length,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("minWidth", [LengthStyleAnimator({
      propertyNames: "min-width",
      valueType: Length,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("opacity", [StyleAnimator({
      propertyNames: "opacity",
      valueType: Number,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("order", [StyleAnimator({
      propertyNames: "order",
      valueType: Number,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("outlineColor", [StyleAnimator({
      propertyNames: "outline-color",
      valueType: Color,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("outlineOffset", [LengthStyleAnimator({
      propertyNames: "outline-offset",
      valueType: Length,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("outlineStyle", [StyleAnimator({
      propertyNames: "outline-style",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("outlineWidth", [LengthStyleAnimator({
      propertyNames: "outline-width",
      valueType: Length,
      value: null,
    })], initializerMap, extraInitializers);

    prototype.overflow = overflow;

    StyleMap.decorate("overflowX", [StyleAnimator({
      propertyNames: "overflow-x",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("overflowY", [StyleAnimator({
      propertyNames: "overflow-y",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("overflowScrolling", [StyleAnimator({
      propertyNames: "-webkit-overflow-scrolling",
      valueType: String,
    })], initializerMap, extraInitializers);

    prototype.overscrollBehavior = overscrollBehavior;

    StyleMap.decorate("overscrollBehaviorX", [StyleAnimator({
      propertyNames: "overscroll-behavior-x",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("overscrollBehaviorY", [StyleAnimator({
      propertyNames: "overscroll-behavior-y",
      valueType: String,
    })], initializerMap, extraInitializers);

    prototype.padding = padding;

    StyleMap.decorate("paddingTop", [LengthStyleConstraintAnimator({
      propertyNames: "padding-top",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], initializerMap, extraInitializers);

    StyleMap.decorate("paddingRight", [LengthStyleConstraintAnimator({
      propertyNames: "padding-right",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], initializerMap, extraInitializers);

    StyleMap.decorate("paddingBottom", [LengthStyleConstraintAnimator({
      propertyNames: "padding-bottom",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], initializerMap, extraInitializers);

    StyleMap.decorate("paddingLeft", [LengthStyleConstraintAnimator({
      propertyNames: "padding-left",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], initializerMap, extraInitializers);

    StyleMap.decorate("pointerEvents", [StyleAnimator({
      propertyNames: "pointer-events",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("position", [StyleAnimator({
      propertyNames: "position",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("right", [LengthStyleConstraintAnimator({
      propertyNames: "right",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], initializerMap, extraInitializers);

    StyleMap.decorate("textAlign", [StyleAnimator({
      propertyNames: "text-align",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("textDecorationColor", [StyleAnimator({
      propertyNames: "text-decoration-color",
      valueType: Color,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("textDecorationLine", [StyleAnimator({
      propertyNames: "text-decoration-line",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("textDecorationStyle", [StyleAnimator({
      propertyNames: "text-decoration-style",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("textOverflow", [StyleAnimator({
      propertyNames: "text-overflow",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("textTransform", [StyleAnimator({
      propertyNames: "text-transform",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("top", [LengthStyleConstraintAnimator({
      propertyNames: "top",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctHeightUnit(this.owner.node);
      },
    })], initializerMap, extraInitializers);

    StyleMap.decorate("touchAction", [StyleAnimator({
      propertyNames: "touch-action",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("transform", [StyleAnimator({
      propertyNames: "transform",
      valueType: Transform,
      value: null,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("userSelect", [StyleAnimator({
      propertyNames: ["user-select", "-webkit-user-select", "-moz-user-select", "-ms-user-select"],
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("verticalAlign", [StyleAnimator({
      propertyNames: "vertical-align",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("visibility", [StyleAnimator({
      propertyNames: "visibility",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("whiteSpace", [StyleAnimator({
      propertyNames: "white-space",
      valueType: String,
    })], initializerMap, extraInitializers);

    StyleMap.decorate("width", [LengthStyleConstraintAnimator({
      propertyNames: "width",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], initializerMap, extraInitializers);

    StyleMap.decorate("zIndex", [StyleAnimator({
      propertyNames: "z-index",
      valueType: Number,
    })], initializerMap, extraInitializers);
  };

  function borderColor(this: StyleMap): [Color | null, Color | null, Color | null, Color | null] | Color | null;
  function borderColor(this: StyleMap, value: [AnyColor | null, AnyColor | null, AnyColor | null, AnyColor | null] | AnyColor | null, timing?: AnyTiming | boolean, precedence?: number): StyleMap;
  function borderColor(this: StyleMap, value?: [AnyColor | null, AnyColor | null, AnyColor | null, AnyColor | null] | AnyColor | null, timing?: AnyTiming | boolean, precedence?: number): [Color | null, Color | null, Color | null, Color | null] | Color | null | StyleMap {
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
          this.borderTopColor.setState(value[0], timing, precedence);
        }
        if (value.length >= 2) {
          this.borderRightColor.setState(value[1], timing, precedence);
        }
        if (value.length >= 3) {
          this.borderBottomColor.setState(value[2], timing, precedence);
        }
        if (value.length >= 4) {
          this.borderLeftColor.setState(value[3], timing, precedence);
        }
      } else {
        this.borderTopColor.setState(value, timing, precedence);
        this.borderRightColor.setState(value, timing, precedence);
        this.borderBottomColor.setState(value, timing, precedence);
        this.borderLeftColor.setState(value, timing, precedence);
      }
      return this;
    }
  }

  function borderRadius(this: StyleMap): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  function borderRadius(this: StyleMap, value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, precedence?: number): StyleMap;
  function borderRadius(this: StyleMap, value?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null,timing?: AnyTiming | boolean, precedence?: number): [Length | null, Length | null, Length | null, Length | null] | Length | null | StyleMap {
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
          this.borderTopLeftRadius.setState(value[0], timing, precedence);
        }
        if (value.length >= 2) {
          this.borderTopRightRadius.setState(value[1], timing, precedence);
        }
        if (value.length >= 3) {
          this.borderBottomRightRadius.setState(value[2], timing, precedence);
        }
        if (value.length >= 4) {
          this.borderBottomLeftRadius.setState(value[3], timing, precedence);
        }
      } else {
        this.borderTopLeftRadius.setState(value, timing, precedence);
        this.borderTopRightRadius.setState(value, timing, precedence);
        this.borderBottomRightRadius.setState(value, timing, precedence);
        this.borderBottomLeftRadius.setState(value, timing, precedence);
      }
      return this;
    }
  }

  function borderStyle(this: StyleMap): [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined;
  function borderStyle(this: StyleMap, value: [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined, timing?: AnyTiming | boolean, precedence?: number): StyleMap;
  function borderStyle(this: StyleMap, value?: [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined, timing?: AnyTiming | boolean, precedence?: number): [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined | StyleMap {
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
          this.borderTopStyle.setState(value[0], timing, precedence);
        }
        if (value.length >= 2) {
          this.borderRightStyle.setState(value[1], timing, precedence);
        }
        if (value.length >= 3) {
          this.borderBottomStyle.setState(value[2], timing, precedence);
        }
        if (value.length >= 4) {
          this.borderLeftStyle.setState(value[3], timing, precedence);
        }
      } else {
        this.borderTopStyle.setState(value, timing, precedence);
        this.borderRightStyle.setState(value, timing, precedence);
        this.borderBottomStyle.setState(value, timing, precedence);
        this.borderLeftStyle.setState(value, timing, precedence);
      }
      return this;
    }
  }

  function borderWidth(this: StyleMap): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  function borderWidth(this: StyleMap, value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, precedence?: number): StyleMap;
  function borderWidth(this: StyleMap, value?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, precedence?: number): [Length | null, Length | null, Length | null, Length | null] | Length | null | StyleMap {
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
          this.borderTopWidth.setState(value[0], timing, precedence);
        }
        if (value.length >= 2) {
          this.borderRightWidth.setState(value[1], timing, precedence);
        }
        if (value.length >= 3) {
          this.borderBottomWidth.setState(value[2], timing, precedence);
        }
        if (value.length >= 4) {
          this.borderLeftWidth.setState(value[3], timing, precedence);
        }
      } else {
        this.borderTopWidth.setState(value, timing, precedence);
        this.borderRightWidth.setState(value, timing, precedence);
        this.borderBottomWidth.setState(value, timing, precedence);
        this.borderLeftWidth.setState(value, timing, precedence);
      }
      return this;
    }
  }

  function font(this: StyleMap): Font | null;
  function font(this: StyleMap, value: AnyFont | null, timing?: AnyTiming | boolean, precedence?: number): StyleMap;
  function font(this: StyleMap, value?: AnyFont | null, timing?: AnyTiming | boolean, precedence?: number): Font | null | StyleMap {
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
          this.fontStyle.setState(value.style, timing, precedence);
        }
        if (value.variant !== void 0) {
          this.fontVariant.setState(value.variant, timing, precedence);
        }
        if (value.weight !== void 0) {
          this.fontWeight.setState(value.weight, timing, precedence);
        }
        if (value.stretch !== void 0) {
          this.fontStretch.setState(value.stretch, timing, precedence);
        }
        if (value.size !== void 0) {
          this.fontSize.setState(value.size, timing, precedence);
        }
        if (value.height !== void 0) {
          this.lineHeight.setState(value.height, timing, precedence);
        }
        this.fontFamily.setState(value.family, timing, precedence);
      } else {
        this.fontStyle.setState(void 0, timing, precedence);
        this.fontVariant.setState(void 0, timing, precedence);
        this.fontWeight.setState(void 0, timing, precedence);
        this.fontStretch.setState(void 0, timing, precedence);
        this.fontSize.setState(null, timing, precedence);
        this.lineHeight.setState(null, timing, precedence);
        this.fontFamily.setState(void 0, timing, precedence);
      }
      return this;
    }
  }

  function margin(this: StyleMap): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  function margin(this: StyleMap, value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, precedence?: number): StyleMap;
  function margin(this: StyleMap, value?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, precedence?: number): [Length | null, Length | null, Length | null, Length | null] | Length | null | StyleMap {
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
          this.marginTop.setState(value[0], timing, precedence);
        }
        if (value.length >= 2) {
          this.marginRight.setState(value[1], timing, precedence);
        }
        if (value.length >= 3) {
          this.marginBottom.setState(value[2], timing, precedence);
        }
        if (value.length >= 4) {
          this.marginLeft.setState(value[3], timing, precedence);
        }
      } else {
        this.marginTop.setState(value, timing, precedence);
        this.marginRight.setState(value, timing, precedence);
        this.marginBottom.setState(value, timing, precedence);
        this.marginLeft.setState(value, timing, precedence);
      }
      return this;
    }
  }

  function overflow(this: StyleMap): [Overflow | undefined, Overflow | undefined] | Overflow | undefined;
  function overflow(this: StyleMap, value: [Overflow | undefined, Overflow | undefined] | Overflow | undefined, timing?: AnyTiming | boolean, precedence?: number): StyleMap;
  function overflow(this: StyleMap, value?: [Overflow | undefined, Overflow | undefined] | Overflow | undefined, timing?: AnyTiming | boolean, precedence?: number): [Overflow | undefined, Overflow | undefined] | Overflow | undefined | StyleMap {
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
          this.overflowX.setState(value[0], timing, precedence);
        }
        if (value.length >= 2) {
          this.overflowY.setState(value[1], timing, precedence);
        }
      } else {
        this.overflowX.setState(value, timing, precedence);
        this.overflowY.setState(value, timing, precedence);
      }
      return this;
    }
  }

  function overscrollBehavior(this: StyleMap): [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined;
  function overscrollBehavior(this: StyleMap, value: [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined, timing?: AnyTiming | boolean, precedence?: number): StyleMap;
  function overscrollBehavior(this: StyleMap, value?: [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined, timing?: AnyTiming | boolean, precedence?: number): [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined | StyleMap {
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
          this.overscrollBehaviorX.setState(value[0], timing, precedence);
        }
        if (value.length >= 2) {
          this.overscrollBehaviorY.setState(value[1], timing, precedence);
        }
      } else {
        this.overscrollBehaviorX.setState(value, timing, precedence);
        this.overscrollBehaviorY.setState(value, timing, precedence);
      }
      return this;
    }
  }

  function padding(this: StyleMap): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  function padding(this: StyleMap, value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, precedence?: number): StyleMap;
  function padding(this: StyleMap, value?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, precedence?: number): [Length | null, Length | null, Length | null, Length | null] | Length | null | StyleMap {
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
          this.paddingTop.setState(value[0], timing, precedence);
        }
        if (value.length >= 2) {
          this.paddingRight.setState(value[1], timing, precedence);
        }
        if (value.length >= 3) {
          this.paddingBottom.setState(value[2], timing, precedence);
        }
        if (value.length >= 4) {
          this.paddingLeft.setState(value[3], timing, precedence);
        }
      } else {
        this.paddingTop.setState(value, timing, precedence);
        this.paddingRight.setState(value, timing, precedence);
        this.paddingBottom.setState(value, timing, precedence);
        this.paddingLeft.setState(value, timing, precedence);
      }
      return this;
    }
  }

  StyleMap.pctWidthUnit = function (node: Node | undefined): number {
    if (node instanceof HTMLElement) {
      const offsetParent = node.offsetParent;
      if (offsetParent instanceof HTMLElement) {
        return offsetParent.offsetWidth;
      }
    }
    if (node === document.body || node === document.documentElement) {
      return window.innerWidth;
    }
    return 0;
  };

  StyleMap.pctHeightUnit = function (node: Node | undefined): number {
    if (node instanceof HTMLElement) {
      const offsetParent = node.offsetParent;
      if (offsetParent instanceof HTMLElement) {
        return offsetParent.offsetHeight;
      }
    }
    if (node === document.body || node === document.documentElement) {
      return window.innerHeight;
    }
    return 0;
  };

  return StyleMap;
})();
