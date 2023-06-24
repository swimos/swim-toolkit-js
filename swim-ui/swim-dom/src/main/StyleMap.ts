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
import type {FastenerDecorator} from "@swim/component";
import {Property} from "@swim/component";
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
import {StyleAnimator} from "./StyleAnimator";
import {LengthStyleAnimator} from "./StyleAnimator";
import {LengthStyleConstraintAnimator} from "./StyleConstraintAnimator";
import type {AlignContent} from "./css";
import type {AlignItems} from "./css";
import type {AlignSelf} from "./css";
import type {Appearance} from "./css";
import type {BackgroundClip} from "./css";
import type {BorderCollapse} from "./css";
import type {BorderStyle} from "./css";
import type {BoxSizing} from "./css";
import type {CssCursor} from "./css";
import type {CssDisplay} from "./css";
import type {FlexBasis} from "./css";
import type {FlexDirection} from "./css";
import type {FlexWrap} from "./css";
import type {JustifyContent} from "./css";
import type {Overflow} from "./css";
import type {OverscrollBehavior} from "./css";
import type {PointerEvents} from "./css";
import type {Position} from "./css";
import type {TextAlign} from "./css";
import type {TextDecorationStyle} from "./css";
import type {TextTransform} from "./css";
import type {TouchAction} from "./css";
import type {UserSelect} from "./css";
import type {VerticalAlign} from "./css";
import type {Visibility} from "./css";
import type {WhiteSpace} from "./css";
import type {StyleContext} from "./StyleContext";

/** @public */
export type StyleMapInit = {
  [K in keyof StyleMap as StyleMap[K] extends Property<any, any, any> ? K : never]?: StyleMap[K] extends Property<any, infer T, infer U> ? T | U : never;
};

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
    decorate<K extends keyof StyleMap>(name: K, decorators: StyleMap[K] extends StyleAnimator<any, any, any> ? FastenerDecorator<StyleMap[K]>[] : never,
                                       initializerMap: {[name: string | symbol]: Function[]}, extraInitializers: Function[]): void;

    /** @internal */
    define(prototype: StyleMap, initializerMap: {[name: string | symbol]: Function[]}, extraInitializers: Function[]): void;

    /** @internal */
    pctWidthUnit(node: Node | undefined): number;

    /** @internal */
    pctHeightUnit(node: Node | undefined): number;
  };

  StyleMap.init = function (map: StyleMap, init: StyleMapInit): void {
    for (const key in init) {
      const property = map[key as keyof StyleMap];
      if (property instanceof Property) {
        property(init[key as keyof StyleMapInit] as any);
      }
    }
  };

  StyleMap.decorate = function <K extends keyof StyleMap>(name: K, decorators: StyleMap[K] extends StyleAnimator<any, any, any> ? FastenerDecorator<StyleMap[K]>[] : never,
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
