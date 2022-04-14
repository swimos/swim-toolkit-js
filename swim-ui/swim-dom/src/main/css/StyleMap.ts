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

import {Equals, Values, AnyTiming} from "@swim/util";
import type {AnyAnimatorValue} from "@swim/component";
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
import {StyleAnimatorDef} from "../style/StyleAnimator";
import {LengthStyleAnimator} from "../style/LengthStyleAnimator";
import {StyleConstraintAnimatorDef} from "../style/StyleConstraintAnimator";
import {LengthStyleConstraintAnimator} from "../style/LengthStyleConstraintAnimator";
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
  readonly alignContent: StyleAnimatorDef<this, {value: AlignContent | undefined}>;

  readonly alignItems: StyleAnimatorDef<this, {value: AlignItems | undefined}>;

  readonly alignSelf: StyleAnimatorDef<this, {value: AlignSelf | undefined}>;

  readonly appearance: StyleAnimatorDef<this, {value: Appearance | undefined}>;

  readonly backdropFilter: StyleAnimatorDef<this, {value: string | undefined}>;

  readonly backgroundClip: StyleAnimatorDef<this, {value: BackgroundClip | undefined}>;

  readonly backgroundColor: StyleAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  readonly backgroundImage: StyleAnimatorDef<this, {value: LinearGradient | string | null, valueInit: AnyLinearGradient | string | null}>;

  readonly borderCollapse: StyleAnimatorDef<this, {value: BorderCollapse | undefined}>;

  borderColor(): [Color | null, Color | null, Color | null, Color | null] | Color | null;
  borderColor(value: [AnyColor | null, AnyColor | null, AnyColor | null, AnyColor | null] | AnyColor | null, timing?: AnyTiming | boolean, precedence?: number): this;

  readonly borderTopColor: StyleAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  readonly borderRightColor: StyleAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  readonly borderBottomColor: StyleAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  readonly borderLeftColor: StyleAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  borderRadius(): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  borderRadius(value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, precedence?: number): this;

  readonly borderTopLeftRadius: StyleAnimatorDef<this, {extends: LengthStyleAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly borderTopRightRadius: StyleAnimatorDef<this, {extends: LengthStyleAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly borderBottomRightRadius: StyleAnimatorDef<this, {extends: LengthStyleAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly borderBottomLeftRadius: StyleAnimatorDef<this, {extends: LengthStyleAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly borderSpacing: StyleAnimatorDef<this, {value: string | undefined}>;

  borderStyle(): [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined;
  borderStyle(value: [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined, timing?: AnyTiming | boolean, precedence?: number): this;

  readonly borderTopStyle: StyleAnimatorDef<this, {value: BorderStyle | undefined}>;

  readonly borderRightStyle: StyleAnimatorDef<this, {value: BorderStyle | undefined}>;

  readonly borderBottomStyle: StyleAnimatorDef<this, {value: BorderStyle | undefined}>;

  readonly borderLeftStyle: StyleAnimatorDef<this, {value: BorderStyle | undefined}>;

  borderWidth(): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  borderWidth(value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, precedence?: number): this;

  readonly borderTopWidth: StyleAnimatorDef<this, {extends: LengthStyleAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly borderRightWidth: StyleAnimatorDef<this, {extends: LengthStyleAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly borderBottomWidth: StyleAnimatorDef<this, {extends: LengthStyleAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly borderLeftWidth: StyleAnimatorDef<this, {extends: LengthStyleAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly bottom: StyleConstraintAnimatorDef<this, {extends: LengthStyleConstraintAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly boxShadow: StyleAnimatorDef<this, {value: BoxShadow | null, valueInit: AnyBoxShadow | null}>;

  readonly boxSizing: StyleAnimatorDef<this, {value: BoxSizing | undefined}>;

  readonly color: StyleAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  readonly cursor: StyleAnimatorDef<this, {value: CssCursor | undefined}>;

  readonly display: StyleAnimatorDef<this, {value: CssDisplay | undefined}>;

  readonly filter: StyleAnimatorDef<this, {value: string | undefined}>;

  readonly flexBasis: StyleAnimatorDef<this, {value: Length | FlexBasis | null, valueInit: AnyLength | FlexBasis | null}>;

  readonly flexDirection: StyleAnimatorDef<this, {value: FlexDirection | string}>;

  readonly flexGrow: StyleAnimatorDef<this, {value: number | undefined}>;

  readonly flexShrink: StyleAnimatorDef<this, {value: number | undefined}>;

  readonly flexWrap: StyleAnimatorDef<this, {value: FlexWrap | undefined}>;

  font(): Font | null;
  font(value: AnyFont | null, timing?: AnyTiming | boolean, precedence?: number): this;

  readonly fontFamily: StyleAnimatorDef<this, {value: FontFamily | FontFamily[] | undefined, valueInit: FontFamily | ReadonlyArray<FontFamily> | undefined}>;

  readonly fontSize: StyleAnimatorDef<this, {extends: LengthStyleAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly fontStretch: StyleAnimatorDef<this, {value: FontStretch | undefined}>;

  readonly fontStyle: StyleAnimatorDef<this, {value: FontStyle | undefined}>;

  readonly fontVariant: StyleAnimatorDef<this, {value: FontVariant | undefined}>;

  readonly fontWeight: StyleAnimatorDef<this, {value: FontWeight | undefined}>;

  readonly height: StyleConstraintAnimatorDef<this, {extends: LengthStyleConstraintAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly justifyContent: StyleAnimatorDef<this, {value: JustifyContent | undefined}>;

  readonly left: StyleConstraintAnimatorDef<this, {extends: LengthStyleConstraintAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly lineHeight: StyleAnimatorDef<this, {extends: LengthStyleAnimator<StyleMap, Length | null, AnyLength | null>}>;

  margin(): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  margin(value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, precedence?: number): this;

  readonly marginTop: StyleConstraintAnimatorDef<this, {extends: LengthStyleConstraintAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly marginRight: StyleConstraintAnimatorDef<this, {extends: LengthStyleConstraintAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly marginBottom: StyleConstraintAnimatorDef<this, {extends: LengthStyleConstraintAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly marginLeft: StyleConstraintAnimatorDef<this, {extends: LengthStyleConstraintAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly maxHeight: StyleAnimatorDef<this, {extends: LengthStyleAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly maxWidth: StyleAnimatorDef<this, {extends: LengthStyleAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly minHeight: StyleAnimatorDef<this, {extends: LengthStyleAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly minWidth: StyleAnimatorDef<this, {extends: LengthStyleAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly opacity: StyleAnimatorDef<this, {value: number | undefined}>;

  readonly order: StyleAnimatorDef<this, {value: number | undefined}>;

  readonly outlineColor: StyleAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  readonly outlineStyle: StyleAnimatorDef<this, {value: BorderStyle | undefined}>;

  readonly outlineWidth: StyleAnimatorDef<this, {extends: LengthStyleAnimator<StyleMap, Length | null, AnyLength | null>}>;

  overflow(): [Overflow | undefined, Overflow | undefined] | Overflow | undefined;
  overflow(value: [Overflow | undefined, Overflow | undefined] | Overflow | undefined, timing?: AnyTiming | boolean, precedence?: number): this;

  readonly overflowX: StyleAnimatorDef<this, {value: Overflow | undefined}>;

  readonly overflowY: StyleAnimatorDef<this, {value: Overflow | undefined}>;

  readonly overflowScrolling: StyleAnimatorDef<this, {value: "auto" | "touch" | undefined}>;

  overscrollBehavior(): [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined;
  overscrollBehavior(value: [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined, timing?: AnyTiming | boolean, precedence?: number): this;

  readonly overscrollBehaviorX: StyleAnimatorDef<this, {value: OverscrollBehavior | undefined}>;

  readonly overscrollBehaviorY: StyleAnimatorDef<this, {value: OverscrollBehavior | undefined}>;

  padding(): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  padding(value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, precedence?: number): this;

  readonly paddingTop: StyleConstraintAnimatorDef<this, {extends: LengthStyleConstraintAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly paddingRight: StyleConstraintAnimatorDef<this, {extends: LengthStyleConstraintAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly paddingBottom: StyleConstraintAnimatorDef<this, {extends: LengthStyleConstraintAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly paddingLeft: StyleConstraintAnimatorDef<this, {extends: LengthStyleConstraintAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly pointerEvents: StyleAnimatorDef<this, {value: PointerEvents | undefined}>;

  readonly position: StyleAnimatorDef<this, {value: Position | undefined}>;

  readonly right: StyleConstraintAnimatorDef<this, {extends: LengthStyleConstraintAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly textAlign: StyleAnimatorDef<this, {value: TextAlign | undefined}>;

  readonly textDecorationColor: StyleAnimatorDef<this, {value: Color | null, valueInit: AnyColor | null}>;

  readonly textDecorationLine: StyleAnimatorDef<this, {value: string | undefined}>;

  readonly textDecorationStyle: StyleAnimatorDef<this, {value: TextDecorationStyle | undefined}>;

  readonly textOverflow: StyleAnimatorDef<this, {value: string | undefined}>;

  readonly textTransform: StyleAnimatorDef<this, {value: TextTransform | undefined}>;

  readonly top: StyleConstraintAnimatorDef<this, {extends: LengthStyleConstraintAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly touchAction: StyleAnimatorDef<this, {value: TouchAction | undefined}>;

  readonly transform: StyleAnimatorDef<this, {value: Transform | null, valueInit: AnyTransform | null}>;

  readonly userSelect: StyleAnimatorDef<this, {value: UserSelect | undefined}>;

  readonly verticalAlign: StyleAnimatorDef<this, {value: VerticalAlign | undefined, valueInit: AnyLength | VerticalAlign | undefined}>;

  readonly visibility: StyleAnimatorDef<this, {value: Visibility | undefined}>;

  readonly whiteSpace: StyleAnimatorDef<this, {value: WhiteSpace | undefined}>;

  readonly width: StyleConstraintAnimatorDef<this, {extends: LengthStyleConstraintAnimator<StyleMap, Length | null, AnyLength | null>}>;

  readonly zIndex: StyleAnimatorDef<this, {value: number | undefined}>;
}

/** @public */
export const StyleMap = (function () {
  const StyleMap = {} as {
    /** @internal */
    init(map: StyleMap, init: StyleMapInit): void;

    /** @internal */
    define(prototype: StyleMap): void;

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
    StyleAnimatorDef<StyleMap["alignContent"]>({
      propertyNames: "align-content",
      valueType: String,
    })(prototype, "alignContent");

    StyleAnimatorDef<StyleMap["alignItems"]>({
      propertyNames: "align-items",
      valueType: String,
    })(prototype, "alignItems");

    StyleAnimatorDef<StyleMap["alignSelf"]>({
      propertyNames: "align-self",
      valueType: String,
    })(prototype, "alignSelf");

    StyleAnimatorDef<StyleMap["appearance"]>({
      propertyNames: ["appearance", "-webkit-appearance"],
      valueType: String,
    })(prototype, "appearance");

    StyleAnimatorDef<StyleMap["backdropFilter"]>({
      propertyNames: ["backdrop-filter", "-webkit-backdrop-filter"],
      valueType: String,
    })(prototype, "backdropFilter");

    StyleAnimatorDef<StyleMap["backgroundClip"]>({
      propertyNames: ["background-clip", "-webkit-background-clip"],
      valueType: String,
    })(prototype, "backgroundClip");

    StyleAnimatorDef<StyleMap["backgroundColor"]>({
      propertyNames: "background-color",
      valueType: Color,
      value: null,
    })(prototype, "backgroundColor");

    StyleAnimatorDef<StyleMap["backgroundImage"]>({
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
    })(prototype, "backgroundImage");

    StyleAnimatorDef<StyleMap["borderCollapse"]>({
      propertyNames: "border-collapse",
      valueType: String,
    })(prototype, "borderCollapse");

    prototype.borderColor = borderColor;

    StyleAnimatorDef<StyleMap["borderTopColor"]>({
      propertyNames: "border-top-color",
      valueType: Color,
      value: null,
    })(prototype, "borderTopColor");

    StyleAnimatorDef<StyleMap["borderRightColor"]>({
      propertyNames: "border-right-color",
      valueType: Color,
      value: null,
    })(prototype, "borderRightColor");

    StyleAnimatorDef<StyleMap["borderBottomColor"]>({
      propertyNames: "border-bottom-color",
      valueType: Color,
      value: null,
    })(prototype, "borderBottomColor");

    StyleAnimatorDef<StyleMap["borderLeftColor"]>({
      propertyNames: "border-left-color",
      valueType: Color,
      value: null,
    })(prototype, "borderLeftColor");

    prototype.borderRadius = borderRadius;

    StyleAnimatorDef<StyleMap["borderTopLeftRadius"]>({
      extends: LengthStyleAnimator,
      propertyNames: "border-top-left-radius",
      valueType: Length,
      value: null,
    })(prototype, "borderTopLeftRadius");

    StyleAnimatorDef<StyleMap["borderTopRightRadius"]>({
      extends: LengthStyleAnimator,
      propertyNames: "border-top-right-radius",
      valueType: Length,
      value: null,
    })(prototype, "borderTopRightRadius");

    StyleAnimatorDef<StyleMap["borderBottomRightRadius"]>({
      extends: LengthStyleAnimator,
      propertyNames: "border-bottom-right-radius",
      valueType: Length,
      value: null,
    })(prototype, "borderBottomRightRadius");

    StyleAnimatorDef<StyleMap["borderBottomLeftRadius"]>({
      extends: LengthStyleAnimator,
      propertyNames: "border-bottom-left-radius",
      valueType: Length,
      value: null,
    })(prototype, "borderBottomLeftRadius");

    StyleAnimatorDef<StyleMap["borderSpacing"]>({
      propertyNames: "border-spacing",
      valueType: String,
    })(prototype, "borderSpacing");

    prototype.borderStyle = borderStyle;

    StyleAnimatorDef<StyleMap["borderTopStyle"]>({
      propertyNames: "border-top-style",
      valueType: String,
    })(prototype, "borderTopStyle");

    StyleAnimatorDef<StyleMap["borderRightStyle"]>({
      propertyNames: "border-right-style",
      valueType: String,
    })(prototype, "borderRightStyle");

    StyleAnimatorDef<StyleMap["borderBottomStyle"]>({
      propertyNames: "border-bottom-style",
      valueType: String,
    })(prototype, "borderBottomStyle");

    StyleAnimatorDef<StyleMap["borderLeftStyle"]>({
      propertyNames: "border-left-style",
      valueType: String,
    })(prototype, "borderLeftStyle");

    prototype.borderWidth = borderWidth;

    StyleAnimatorDef<StyleMap["borderTopWidth"]>({
      extends: LengthStyleAnimator,
      propertyNames: "border-top-width",
      valueType: Length,
      value: null,
    })(prototype, "borderTopWidth");

    StyleAnimatorDef<StyleMap["borderRightWidth"]>({
      extends: LengthStyleAnimator,
      propertyNames: "border-right-width",
      valueType: Length,
      value: null,
    })(prototype, "borderRightWidth");

    StyleAnimatorDef<StyleMap["borderBottomWidth"]>({
      extends: LengthStyleAnimator,
      propertyNames: "border-bottom-width",
      valueType: Length,
      value: null,
    })(prototype, "borderBottomWidth");

    StyleAnimatorDef<StyleMap["borderLeftWidth"]>({
      extends: LengthStyleAnimator,
      propertyNames: "border-left-width",
      valueType: Length,
      value: null,
    })(prototype, "borderLeftWidth");

    StyleConstraintAnimatorDef<StyleMap["bottom"]>({
      extends: LengthStyleConstraintAnimator,
      propertyNames: "bottom",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctHeightUnit(this.owner.node);
      },
    })(prototype, "bottom");

    StyleAnimatorDef<StyleMap["boxShadow"]>({
      propertyNames: "box-shadow",
      valueType: BoxShadow,
      value: null,
    })(prototype, "boxShadow");

    StyleAnimatorDef<StyleMap["boxSizing"]>({
      propertyNames: "box-sizing",
      valueType: String,
    })(prototype, "boxSizing");

    StyleAnimatorDef<StyleMap["color"]>({
      propertyNames: "color",
      valueType: Color,
      value: null,
    })(prototype, "color");

    StyleAnimatorDef<StyleMap["cursor"]>({
      propertyNames: "cursor",
      valueType: String,
    })(prototype, "cursor");

    StyleAnimatorDef<StyleMap["display"]>({
      propertyNames: "display",
      valueType: String,
    })(prototype, "display");

    StyleAnimatorDef<StyleMap["filter"]>({
      propertyNames: "filter",
      valueType: String,
    })(prototype, "filter");

    StyleAnimatorDef<StyleMap["flexBasis"]>({
      propertyNames: "flex-basis",
      valueType: Length,
      value: null,
    })(prototype, "flexBasis");

    StyleAnimatorDef<StyleMap["flexDirection"]>({
      propertyNames: "flex-direction",
      valueType: String,
    })(prototype, "flexDirection");

    StyleAnimatorDef<StyleMap["flexGrow"]>({
      propertyNames: "flex-grow",
      valueType: Number,
    })(prototype, "flexGrow");

    StyleAnimatorDef<StyleMap["flexShrink"]>({
      propertyNames: "flex-shrink",
      valueType: Number,
    })(prototype, "flexShrink");

    StyleAnimatorDef<StyleMap["flexWrap"]>({
      propertyNames: "flex-wrap",
      valueType: String,
    })(prototype, "flexWrap");

    prototype.font = font;

    StyleAnimatorDef<StyleMap["fontFamily"]>({
      propertyNames: "font-family",
      valueType: FontFamily,
    })(prototype, "fontFamily");

    StyleAnimatorDef<StyleMap["fontSize"]>({
      extends: LengthStyleAnimator,
      propertyNames: "font-size",
      valueType: Length,
      value: null,
    })(prototype, "fontSize");

    StyleAnimatorDef<StyleMap["fontStretch"]>({
      propertyNames: "font-stretch",
      valueType: String,
    })(prototype, "fontStretch");

    StyleAnimatorDef<StyleMap["fontStyle"]>({
      propertyNames: "font-style",
      valueType: String,
    })(prototype, "fontStyle");

    StyleAnimatorDef<StyleMap["fontVariant"]>({
      propertyNames: "font-variant",
      valueType: String,
    })(prototype, "fontVariant");

    StyleAnimatorDef<StyleMap["fontWeight"]>({
      propertyNames: "font-weight",
      valueType: String,
    })(prototype, "fontWeight");

    StyleConstraintAnimatorDef<StyleMap["height"]>({
      extends: LengthStyleConstraintAnimator,
      propertyNames: "height",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctHeightUnit(this.owner.node);
      },
    })(prototype, "height");

    StyleAnimatorDef<StyleMap["justifyContent"]>({
      propertyNames: "justify-content",
      valueType: String,
    })(prototype, "justifyContent");

    StyleConstraintAnimatorDef<StyleMap["left"]>({
      extends: LengthStyleConstraintAnimator,
      propertyNames: "left",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })(prototype, "left");

    StyleAnimatorDef<StyleMap["lineHeight"]>({
      extends: LengthStyleAnimator,
      propertyNames: "line-height",
      valueType: Length,
      value: null,
    })(prototype, "lineHeight");

    prototype.margin = margin;

    StyleConstraintAnimatorDef<StyleMap["marginTop"]>({
      extends: LengthStyleConstraintAnimator,
      propertyNames: "margin-top",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })(prototype, "marginTop");

    StyleConstraintAnimatorDef<StyleMap["marginRight"]>({
      extends: LengthStyleConstraintAnimator,
      propertyNames: "margin-right",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })(prototype, "marginRight");

    StyleConstraintAnimatorDef<StyleMap["marginBottom"]>({
      extends: LengthStyleConstraintAnimator,
      propertyNames: "margin-bottom",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })(prototype, "marginBottom");

    StyleConstraintAnimatorDef<StyleMap["marginLeft"]>({
      extends: LengthStyleConstraintAnimator,
      propertyNames: "margin-left",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })(prototype, "marginLeft");

    StyleAnimatorDef<StyleMap["maxHeight"]>({
      extends: LengthStyleAnimator,
      propertyNames: "max-height",
      valueType: Length,
      value: null,
    })(prototype, "maxHeight");

    StyleAnimatorDef<StyleMap["maxWidth"]>({
      extends: LengthStyleAnimator,
      propertyNames: "max-width",
      valueType: Length,
      value: null,
    })(prototype, "maxWidth");

    StyleAnimatorDef<StyleMap["minHeight"]>({
      extends: LengthStyleAnimator,
      propertyNames: "min-height",
      valueType: Length,
      value: null,
    })(prototype, "minHeight");

    StyleAnimatorDef<StyleMap["minWidth"]>({
      extends: LengthStyleAnimator,
      propertyNames: "min-width",
      valueType: Length,
      value: null,
    })(prototype, "minWidth");

    StyleAnimatorDef<StyleMap["opacity"]>({
      propertyNames: "opacity",
      valueType: Number,
    })(prototype, "opacity");

    StyleAnimatorDef<StyleMap["order"]>({
      propertyNames: "order",
      valueType: Number,
    })(prototype, "order");

    StyleAnimatorDef<StyleMap["outlineColor"]>({
      propertyNames: "outline-color",
      valueType: Color,
      value: null,
    })(prototype, "outlineColor");

    StyleAnimatorDef<StyleMap["outlineStyle"]>({
      propertyNames: "outline-style",
      valueType: String,
    })(prototype, "outlineStyle");

    StyleAnimatorDef<StyleMap["outlineWidth"]>({
      extends: LengthStyleAnimator,
      propertyNames: "outline-width",
      valueType: Length,
      value: null,
    })(prototype, "outlineWidth");

    prototype.overflow = overflow;

    StyleAnimatorDef<StyleMap["overflowX"]>({
      propertyNames: "overflow-x",
      valueType: String,
    })(prototype, "overflowX");

    StyleAnimatorDef<StyleMap["overflowY"]>({
      propertyNames: "overflow-y",
      valueType: String,
    })(prototype, "overflowY");

    StyleAnimatorDef<StyleMap["overflowScrolling"]>({
      propertyNames: "-webkit-overflow-scrolling",
      valueType: String,
    })(prototype, "overflowScrolling");

    prototype.overscrollBehavior = overscrollBehavior;

    StyleAnimatorDef<StyleMap["overscrollBehaviorX"]>({
      propertyNames: "overscroll-behavior-x",
      valueType: String,
    })(prototype, "overscrollBehaviorX");

    StyleAnimatorDef<StyleMap["overscrollBehaviorY"]>({
      propertyNames: "overscroll-behavior-y",
      valueType: String,
    })(prototype, "overscrollBehaviorY");

    prototype.padding = padding;

    StyleConstraintAnimatorDef<StyleMap["paddingTop"]>({
      extends: LengthStyleConstraintAnimator,
      propertyNames: "padding-top",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })(prototype, "paddingTop");

    StyleConstraintAnimatorDef<StyleMap["paddingRight"]>({
      extends: LengthStyleConstraintAnimator,
      propertyNames: "padding-right",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })(prototype, "paddingRight");

    StyleConstraintAnimatorDef<StyleMap["paddingBottom"]>({
      extends: LengthStyleConstraintAnimator,
      propertyNames: "padding-bottom",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })(prototype, "paddingBottom");

    StyleConstraintAnimatorDef<StyleMap["paddingLeft"]>({
      extends: LengthStyleConstraintAnimator,
      propertyNames: "padding-left",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })(prototype, "paddingLeft");

    StyleAnimatorDef<StyleMap["pointerEvents"]>({
      propertyNames: "pointer-events",
      valueType: String,
    })(prototype, "pointerEvents");

    StyleAnimatorDef<StyleMap["position"]>({
      propertyNames: "position",
      valueType: String,
    })(prototype, "position");

    StyleConstraintAnimatorDef<StyleMap["right"]>({
      extends: LengthStyleConstraintAnimator,
      propertyNames: "right",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })(prototype, "right");

    StyleAnimatorDef<StyleMap["textAlign"]>({
      propertyNames: "text-align",
      valueType: String,
    })(prototype, "textAlign");

    StyleAnimatorDef<StyleMap["textDecorationColor"]>({
      propertyNames: "text-decoration-color",
      valueType: Color,
      value: null,
    })(prototype, "textDecorationColor");

    StyleAnimatorDef<StyleMap["textDecorationLine"]>({
      propertyNames: "text-decoration-line",
      valueType: String,
    })(prototype, "textDecorationLine");

    StyleAnimatorDef<StyleMap["textDecorationStyle"]>({
      propertyNames: "text-decoration-style",
      valueType: String,
    })(prototype, "textDecorationStyle");

    StyleAnimatorDef<StyleMap["textOverflow"]>({
      propertyNames: "text-overflow",
      valueType: String,
    })(prototype, "textOverflow");

    StyleAnimatorDef<StyleMap["textTransform"]>({
      propertyNames: "text-transform",
      valueType: String,
    })(prototype, "textTransform");

    StyleConstraintAnimatorDef<StyleMap["top"]>({
      extends: LengthStyleConstraintAnimator,
      propertyNames: "top",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctHeightUnit(this.owner.node);
      },
    })(prototype, "top");

    StyleAnimatorDef<StyleMap["touchAction"]>({
      propertyNames: "touch-action",
      valueType: String,
    })(prototype, "touchAction");

    StyleAnimatorDef<StyleMap["transform"]>({
      propertyNames: "transform",
      valueType: Transform,
      value: null,
    })(prototype, "transform");

    StyleAnimatorDef<StyleMap["userSelect"]>({
      propertyNames: ["user-select", "-webkit-user-select", "-moz-user-select", "-ms-user-select"],
      valueType: String,
    })(prototype, "userSelect");

    StyleAnimatorDef<StyleMap["verticalAlign"]>({
      propertyNames: "vertical-align",
      valueType: String,
    })(prototype, "verticalAlign");

    StyleAnimatorDef<StyleMap["visibility"]>({
      propertyNames: "visibility",
      valueType: String,
    })(prototype, "visibility");

    StyleAnimatorDef<StyleMap["whiteSpace"]>({
      propertyNames: "white-space",
      valueType: String,
    })(prototype, "whiteSpace");

    StyleConstraintAnimatorDef<StyleMap["width"]>({
      extends: LengthStyleConstraintAnimator,
      propertyNames: "width",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })(prototype, "width");

    StyleAnimatorDef<StyleMap["zIndex"]>({
      propertyNames: "z-index",
      valueType: Number,
    })(prototype, "zIndex");
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
