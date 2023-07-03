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
import type {Proto} from "@swim/util";
import {Values} from "@swim/util";
import {Equals} from "@swim/util";
import type {AnyTiming} from "@swim/util";
import type {Affinity} from "@swim/component";
import type {FastenerDecorator} from "@swim/component";
import {Fastener} from "@swim/component";
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
import type {AlignContent} from "./csstypes";
import type {AlignItems} from "./csstypes";
import type {AlignSelf} from "./csstypes";
import type {Appearance} from "./csstypes";
import type {BackgroundClip} from "./csstypes";
import type {BorderCollapse} from "./csstypes";
import type {BorderStyle} from "./csstypes";
import type {BoxSizing} from "./csstypes";
import type {CssCursor} from "./csstypes";
import type {CssDisplay} from "./csstypes";
import type {FlexBasis} from "./csstypes";
import type {FlexDirection} from "./csstypes";
import type {FlexWrap} from "./csstypes";
import type {JustifyContent} from "./csstypes";
import type {Overflow} from "./csstypes";
import type {OverscrollBehavior} from "./csstypes";
import type {PointerEvents} from "./csstypes";
import type {Position} from "./csstypes";
import type {TextAlign} from "./csstypes";
import type {TextDecorationStyle} from "./csstypes";
import type {TextTransform} from "./csstypes";
import type {TouchAction} from "./csstypes";
import type {UserSelect} from "./csstypes";
import type {VerticalAlign} from "./csstypes";
import type {Visibility} from "./csstypes";
import type {WhiteSpace} from "./csstypes";
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
  borderColor(value: [AnyColor | null, AnyColor | null, AnyColor | null, AnyColor | null] | AnyColor | null, timing?: AnyTiming | boolean, affinity?: Affinity): this;

  readonly borderTopColor: StyleAnimator<this, Color | null, AnyColor | null>;

  readonly borderRightColor: StyleAnimator<this, Color | null, AnyColor | null>;

  readonly borderBottomColor: StyleAnimator<this, Color | null, AnyColor | null>;

  readonly borderLeftColor: StyleAnimator<this, Color | null, AnyColor | null>;

  borderRadius(): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  borderRadius(value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, affinity?: Affinity): this;

  readonly borderTopLeftRadius: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  readonly borderTopRightRadius: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  readonly borderBottomRightRadius: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  readonly borderBottomLeftRadius: LengthStyleAnimator<this, Length | null, AnyLength | null>;

  readonly borderSpacing: StyleAnimator<this, string | undefined>;

  borderStyle(): [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined;
  borderStyle(value: [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined, timing?: AnyTiming | boolean, affinity?: Affinity): this;

  readonly borderTopStyle: StyleAnimator<this, BorderStyle | undefined>;

  readonly borderRightStyle: StyleAnimator<this, BorderStyle | undefined>;

  readonly borderBottomStyle: StyleAnimator<this, BorderStyle | undefined>;

  readonly borderLeftStyle: StyleAnimator<this, BorderStyle | undefined>;

  borderWidth(): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  borderWidth(value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, affinity?: Affinity): this;

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
  font(value: AnyFont | null, timing?: AnyTiming | boolean, affinity?: Affinity): this;

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
  margin(value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, affinity?: Affinity): this;

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
  overflow(value: [Overflow | undefined, Overflow | undefined] | Overflow | undefined, timing?: AnyTiming | boolean, affinity?: Affinity): this;

  readonly overflowX: StyleAnimator<this, Overflow | undefined>;

  readonly overflowY: StyleAnimator<this, Overflow | undefined>;

  readonly overflowScrolling: StyleAnimator<this, "auto" | "touch" | undefined>;

  overscrollBehavior(): [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined;
  overscrollBehavior(value: [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined, timing?: AnyTiming | boolean, affinity?: Affinity): this;

  readonly overscrollBehaviorX: StyleAnimator<this, OverscrollBehavior | undefined>;

  readonly overscrollBehaviorY: StyleAnimator<this, OverscrollBehavior | undefined>;

  padding(): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  padding(value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, affinity?: Affinity): this;

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
    defineField<K extends keyof StyleMap>(constructor: Proto<StyleMap>, name: K, decorators: StyleMap[K] extends StyleAnimator<any, any, any> ? FastenerDecorator<StyleMap[K]>[] : never,
                                          fieldInitializers: {[name: PropertyKey]: Function[]}, instanceInitializers: Function[]): void;

    /** @internal */
    defineGetter<K extends keyof StyleMap>(constructor: Proto<StyleMap>, name: K, decorators: StyleMap[K] extends StyleAnimator<any, any, any> ? FastenerDecorator<StyleMap[K]>[] : never,
                                           fieldInitializers: {[name: PropertyKey]: Function[]}, instanceInitializers: Function[]): void;

    /** @internal */
    define(constructor: Proto<StyleMap>, fieldInitializers: {[name: PropertyKey]: Function[]}, instanceInitializers: Function[]): void;

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

  StyleMap.defineField = function <K extends keyof StyleMap>(constructor: Proto<StyleMap>, name: K, decorators: StyleMap[K] extends StyleAnimator<any, any, any> ? FastenerDecorator<StyleMap[K]>[] : never,
                                                             fieldInitializers: {[name: PropertyKey]: Function[]}, instanceInitializers: Function[]): void {
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
    }, fieldInitializers[name] = [], instanceInitializers);
  };

  StyleMap.defineGetter = function <K extends keyof StyleMap>(constructor: Proto<StyleMap>, name: K, decorators: StyleMap[K] extends StyleAnimator<any, any, any> ? FastenerDecorator<StyleMap[K]>[] : never,
                                                              fieldInitializers: {[name: PropertyKey]: Function[]}, instanceInitializers: Function[]): void {
    Object.defineProperty(constructor.prototype, name, {
      get: Fastener.dummy,
      enumerable: true,
      configurable: true,
    });
    __esDecorate(constructor, null, decorators as Function[], {
      kind: "getter",
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
    }, null, instanceInitializers);
  };

  StyleMap.define = function (constructor: Proto<StyleMap>, fieldInitializers: {[name: PropertyKey]: Function[]}, instanceInitializers: Function[]): void {
    StyleMap.defineGetter(constructor, "alignContent", [StyleAnimator({
      propertyNames: "align-content",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "alignItems", [StyleAnimator({
      propertyNames: "align-items",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "alignSelf", [StyleAnimator({
      propertyNames: "align-self",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "appearance", [StyleAnimator({
      propertyNames: ["appearance", "-webkit-appearance"],
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "backdropFilter", [StyleAnimator({
      propertyNames: ["backdrop-filter", "-webkit-backdrop-filter"],
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "backgroundClip", [StyleAnimator({
      propertyNames: ["background-clip", "-webkit-background-clip"],
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "backgroundColor", [StyleAnimator({
      propertyNames: "background-color",
      valueType: Color,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "backgroundImage", [StyleAnimator({
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
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "borderCollapse", [StyleAnimator({
      propertyNames: "border-collapse",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    constructor.prototype.borderColor = borderColor;

    StyleMap.defineGetter(constructor, "borderTopColor", [StyleAnimator({
      propertyNames: "border-top-color",
      valueType: Color,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "borderRightColor", [StyleAnimator({
      propertyNames: "border-right-color",
      valueType: Color,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "borderBottomColor", [StyleAnimator({
      propertyNames: "border-bottom-color",
      valueType: Color,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "borderLeftColor", [StyleAnimator({
      propertyNames: "border-left-color",
      valueType: Color,
      value: null,
    })], fieldInitializers, instanceInitializers);

    constructor.prototype.borderRadius = borderRadius;

    StyleMap.defineGetter(constructor, "borderTopLeftRadius", [LengthStyleAnimator({
      propertyNames: "border-top-left-radius",
      valueType: Length,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "borderTopRightRadius", [LengthStyleAnimator({
      propertyNames: "border-top-right-radius",
      valueType: Length,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "borderBottomRightRadius", [LengthStyleAnimator({
      propertyNames: "border-bottom-right-radius",
      valueType: Length,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "borderBottomLeftRadius", [LengthStyleAnimator({
      propertyNames: "border-bottom-left-radius",
      valueType: Length,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "borderSpacing", [StyleAnimator({
      propertyNames: "border-spacing",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    constructor.prototype.borderStyle = borderStyle;

    StyleMap.defineGetter(constructor, "borderTopStyle", [StyleAnimator({
      propertyNames: "border-top-style",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "borderRightStyle", [StyleAnimator({
      propertyNames: "border-right-style",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "borderBottomStyle", [StyleAnimator({
      propertyNames: "border-bottom-style",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "borderLeftStyle", [StyleAnimator({
      propertyNames: "border-left-style",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    constructor.prototype.borderWidth = borderWidth;

    StyleMap.defineGetter(constructor, "borderTopWidth", [LengthStyleAnimator({
      propertyNames: "border-top-width",
      valueType: Length,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "borderRightWidth", [LengthStyleAnimator({
      propertyNames: "border-right-width",
      valueType: Length,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "borderBottomWidth", [LengthStyleAnimator({
      propertyNames: "border-bottom-width",
      valueType: Length,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "borderLeftWidth", [LengthStyleAnimator({
      propertyNames: "border-left-width",
      valueType: Length,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "bottom", [LengthStyleConstraintAnimator({
      propertyNames: "bottom",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctHeightUnit(this.owner.node);
      },
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "boxShadow", [StyleAnimator({
      propertyNames: "box-shadow",
      valueType: BoxShadow,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "boxSizing", [StyleAnimator({
      propertyNames: "box-sizing",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "color", [StyleAnimator({
      propertyNames: "color",
      valueType: Color,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "cursor", [StyleAnimator({
      propertyNames: "cursor",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "display", [StyleAnimator({
      propertyNames: "display",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "filter", [StyleAnimator({
      propertyNames: "filter",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "flexBasis", [StyleAnimator({
      propertyNames: "flex-basis",
      valueType: Length,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "flexDirection", [StyleAnimator({
      propertyNames: "flex-direction",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "flexGrow", [StyleAnimator({
      propertyNames: "flex-grow",
      valueType: Number,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "flexShrink", [StyleAnimator({
      propertyNames: "flex-shrink",
      valueType: Number,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "flexWrap", [StyleAnimator({
      propertyNames: "flex-wrap",
      valueType: Number,
    })], fieldInitializers, instanceInitializers);

    constructor.prototype.font = font;

    StyleMap.defineGetter(constructor, "fontFamily", [StyleAnimator({
      propertyNames: "font-family",
      valueType: FontFamily,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "fontSize", [LengthStyleAnimator({
      propertyNames: "font-size",
      valueType: Length,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "fontStretch", [StyleAnimator({
      propertyNames: "font-stretch",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "fontStyle", [StyleAnimator({
      propertyNames: "font-style",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "fontVariant", [StyleAnimator({
      propertyNames: "font-variant",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "fontWeight", [StyleAnimator({
      propertyNames: "font-weight",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "height", [LengthStyleConstraintAnimator({
      propertyNames: "height",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctHeightUnit(this.owner.node);
      },
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "justifyContent", [StyleAnimator({
      propertyNames: "justify-content",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "left", [LengthStyleConstraintAnimator({
      propertyNames: "left",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "lineHeight", [LengthStyleAnimator({
      propertyNames: "line-height",
      valueType: Length,
      value: null,
    })], fieldInitializers, instanceInitializers);

    constructor.prototype.margin = margin;

    StyleMap.defineGetter(constructor, "marginTop", [LengthStyleConstraintAnimator({
      propertyNames: "margin-top",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "marginRight", [LengthStyleConstraintAnimator({
      propertyNames: "margin-right",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "marginBottom", [LengthStyleConstraintAnimator({
      propertyNames: "margin-bottom",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "marginLeft", [LengthStyleConstraintAnimator({
      propertyNames: "margin-left",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "maxHeight", [LengthStyleAnimator({
      propertyNames: "max-height",
      valueType: Length,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "maxWidth", [LengthStyleAnimator({
      propertyNames: "max-width",
      valueType: Length,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "minHeight", [LengthStyleAnimator({
      propertyNames: "min-height",
      valueType: Length,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "minWidth", [LengthStyleAnimator({
      propertyNames: "min-width",
      valueType: Length,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "opacity", [StyleAnimator({
      propertyNames: "opacity",
      valueType: Number,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "order", [StyleAnimator({
      propertyNames: "order",
      valueType: Number,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "outlineColor", [StyleAnimator({
      propertyNames: "outline-color",
      valueType: Color,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "outlineOffset", [LengthStyleAnimator({
      propertyNames: "outline-offset",
      valueType: Length,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "outlineStyle", [StyleAnimator({
      propertyNames: "outline-style",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "outlineWidth", [LengthStyleAnimator({
      propertyNames: "outline-width",
      valueType: Length,
      value: null,
    })], fieldInitializers, instanceInitializers);

    constructor.prototype.overflow = overflow;

    StyleMap.defineGetter(constructor, "overflowX", [StyleAnimator({
      propertyNames: "overflow-x",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "overflowY", [StyleAnimator({
      propertyNames: "overflow-y",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "overflowScrolling", [StyleAnimator({
      propertyNames: "-webkit-overflow-scrolling",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    constructor.prototype.overscrollBehavior = overscrollBehavior;

    StyleMap.defineGetter(constructor, "overscrollBehaviorX", [StyleAnimator({
      propertyNames: "overscroll-behavior-x",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "overscrollBehaviorY", [StyleAnimator({
      propertyNames: "overscroll-behavior-y",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    constructor.prototype.padding = padding;

    StyleMap.defineGetter(constructor, "paddingTop", [LengthStyleConstraintAnimator({
      propertyNames: "padding-top",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "paddingRight", [LengthStyleConstraintAnimator({
      propertyNames: "padding-right",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "paddingBottom", [LengthStyleConstraintAnimator({
      propertyNames: "padding-bottom",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "paddingLeft", [LengthStyleConstraintAnimator({
      propertyNames: "padding-left",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "pointerEvents", [StyleAnimator({
      propertyNames: "pointer-events",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "position", [StyleAnimator({
      propertyNames: "position",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "right", [LengthStyleConstraintAnimator({
      propertyNames: "right",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "textAlign", [StyleAnimator({
      propertyNames: "text-align",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "textDecorationColor", [StyleAnimator({
      propertyNames: "text-decoration-color",
      valueType: Color,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "textDecorationLine", [StyleAnimator({
      propertyNames: "text-decoration-line",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "textDecorationStyle", [StyleAnimator({
      propertyNames: "text-decoration-style",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "textOverflow", [StyleAnimator({
      propertyNames: "text-overflow",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "textTransform", [StyleAnimator({
      propertyNames: "text-transform",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "top", [LengthStyleConstraintAnimator({
      propertyNames: "top",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctHeightUnit(this.owner.node);
      },
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "touchAction", [StyleAnimator({
      propertyNames: "touch-action",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "transform", [StyleAnimator({
      propertyNames: "transform",
      valueType: Transform,
      value: null,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "userSelect", [StyleAnimator({
      propertyNames: ["user-select", "-webkit-user-select", "-moz-user-select", "-ms-user-select"],
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "verticalAlign", [StyleAnimator({
      propertyNames: "vertical-align",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "visibility", [StyleAnimator({
      propertyNames: "visibility",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "whiteSpace", [StyleAnimator({
      propertyNames: "white-space",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "width", [LengthStyleConstraintAnimator({
      propertyNames: "width",
      valueType: Length,
      value: null,
      get pctUnit(): number {
        return StyleMap.pctWidthUnit(this.owner.node);
      },
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "zIndex", [StyleAnimator({
      propertyNames: "z-index",
      valueType: Number,
    })], fieldInitializers, instanceInitializers);
  };

  function borderColor(this: StyleMap): [Color | null, Color | null, Color | null, Color | null] | Color | null;
  function borderColor(this: StyleMap, value: [AnyColor | null, AnyColor | null, AnyColor | null, AnyColor | null] | AnyColor | null, timing?: AnyTiming | boolean, affinity?: Affinity): StyleMap;
  function borderColor(this: StyleMap, value?: [AnyColor | null, AnyColor | null, AnyColor | null, AnyColor | null] | AnyColor | null, timing?: AnyTiming | boolean, affinity?: Affinity): [Color | null, Color | null, Color | null, Color | null] | Color | null | StyleMap {
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
          this.borderTopColor.setState(value[0], timing, affinity);
        }
        if (value.length >= 2) {
          this.borderRightColor.setState(value[1], timing, affinity);
        }
        if (value.length >= 3) {
          this.borderBottomColor.setState(value[2], timing, affinity);
        }
        if (value.length >= 4) {
          this.borderLeftColor.setState(value[3], timing, affinity);
        }
      } else {
        this.borderTopColor.setState(value, timing, affinity);
        this.borderRightColor.setState(value, timing, affinity);
        this.borderBottomColor.setState(value, timing, affinity);
        this.borderLeftColor.setState(value, timing, affinity);
      }
      return this;
    }
  }

  function borderRadius(this: StyleMap): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  function borderRadius(this: StyleMap, value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, affinity?: Affinity): StyleMap;
  function borderRadius(this: StyleMap, value?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null,timing?: AnyTiming | boolean, affinity?: Affinity): [Length | null, Length | null, Length | null, Length | null] | Length | null | StyleMap {
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
          this.borderTopLeftRadius.setState(value[0], timing, affinity);
        }
        if (value.length >= 2) {
          this.borderTopRightRadius.setState(value[1], timing, affinity);
        }
        if (value.length >= 3) {
          this.borderBottomRightRadius.setState(value[2], timing, affinity);
        }
        if (value.length >= 4) {
          this.borderBottomLeftRadius.setState(value[3], timing, affinity);
        }
      } else {
        this.borderTopLeftRadius.setState(value, timing, affinity);
        this.borderTopRightRadius.setState(value, timing, affinity);
        this.borderBottomRightRadius.setState(value, timing, affinity);
        this.borderBottomLeftRadius.setState(value, timing, affinity);
      }
      return this;
    }
  }

  function borderStyle(this: StyleMap): [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined;
  function borderStyle(this: StyleMap, value: [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined, timing?: AnyTiming | boolean, affinity?: Affinity): StyleMap;
  function borderStyle(this: StyleMap, value?: [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined, timing?: AnyTiming | boolean, affinity?: Affinity): [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined | StyleMap {
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
          this.borderTopStyle.setState(value[0], timing, affinity);
        }
        if (value.length >= 2) {
          this.borderRightStyle.setState(value[1], timing, affinity);
        }
        if (value.length >= 3) {
          this.borderBottomStyle.setState(value[2], timing, affinity);
        }
        if (value.length >= 4) {
          this.borderLeftStyle.setState(value[3], timing, affinity);
        }
      } else {
        this.borderTopStyle.setState(value, timing, affinity);
        this.borderRightStyle.setState(value, timing, affinity);
        this.borderBottomStyle.setState(value, timing, affinity);
        this.borderLeftStyle.setState(value, timing, affinity);
      }
      return this;
    }
  }

  function borderWidth(this: StyleMap): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  function borderWidth(this: StyleMap, value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, affinity?: Affinity): StyleMap;
  function borderWidth(this: StyleMap, value?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, affinity?: Affinity): [Length | null, Length | null, Length | null, Length | null] | Length | null | StyleMap {
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
          this.borderTopWidth.setState(value[0], timing, affinity);
        }
        if (value.length >= 2) {
          this.borderRightWidth.setState(value[1], timing, affinity);
        }
        if (value.length >= 3) {
          this.borderBottomWidth.setState(value[2], timing, affinity);
        }
        if (value.length >= 4) {
          this.borderLeftWidth.setState(value[3], timing, affinity);
        }
      } else {
        this.borderTopWidth.setState(value, timing, affinity);
        this.borderRightWidth.setState(value, timing, affinity);
        this.borderBottomWidth.setState(value, timing, affinity);
        this.borderLeftWidth.setState(value, timing, affinity);
      }
      return this;
    }
  }

  function font(this: StyleMap): Font | null;
  function font(this: StyleMap, value: AnyFont | null, timing?: AnyTiming | boolean, affinity?: Affinity): StyleMap;
  function font(this: StyleMap, value?: AnyFont | null, timing?: AnyTiming | boolean, affinity?: Affinity): Font | null | StyleMap {
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
          this.fontStyle.setState(value.style, timing, affinity);
        }
        if (value.variant !== void 0) {
          this.fontVariant.setState(value.variant, timing, affinity);
        }
        if (value.weight !== void 0) {
          this.fontWeight.setState(value.weight, timing, affinity);
        }
        if (value.stretch !== void 0) {
          this.fontStretch.setState(value.stretch, timing, affinity);
        }
        if (value.size !== void 0) {
          this.fontSize.setState(value.size, timing, affinity);
        }
        if (value.height !== void 0) {
          this.lineHeight.setState(value.height, timing, affinity);
        }
        this.fontFamily.setState(value.family, timing, affinity);
      } else {
        this.fontStyle.setState(void 0, timing, affinity);
        this.fontVariant.setState(void 0, timing, affinity);
        this.fontWeight.setState(void 0, timing, affinity);
        this.fontStretch.setState(void 0, timing, affinity);
        this.fontSize.setState(null, timing, affinity);
        this.lineHeight.setState(null, timing, affinity);
        this.fontFamily.setState(void 0, timing, affinity);
      }
      return this;
    }
  }

  function margin(this: StyleMap): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  function margin(this: StyleMap, value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, affinity?: Affinity): StyleMap;
  function margin(this: StyleMap, value?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, affinity?: Affinity): [Length | null, Length | null, Length | null, Length | null] | Length | null | StyleMap {
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
          this.marginTop.setState(value[0], timing, affinity);
        }
        if (value.length >= 2) {
          this.marginRight.setState(value[1], timing, affinity);
        }
        if (value.length >= 3) {
          this.marginBottom.setState(value[2], timing, affinity);
        }
        if (value.length >= 4) {
          this.marginLeft.setState(value[3], timing, affinity);
        }
      } else {
        this.marginTop.setState(value, timing, affinity);
        this.marginRight.setState(value, timing, affinity);
        this.marginBottom.setState(value, timing, affinity);
        this.marginLeft.setState(value, timing, affinity);
      }
      return this;
    }
  }

  function overflow(this: StyleMap): [Overflow | undefined, Overflow | undefined] | Overflow | undefined;
  function overflow(this: StyleMap, value: [Overflow | undefined, Overflow | undefined] | Overflow | undefined, timing?: AnyTiming | boolean, affinity?: Affinity): StyleMap;
  function overflow(this: StyleMap, value?: [Overflow | undefined, Overflow | undefined] | Overflow | undefined, timing?: AnyTiming | boolean, affinity?: Affinity): [Overflow | undefined, Overflow | undefined] | Overflow | undefined | StyleMap {
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
          this.overflowX.setState(value[0], timing, affinity);
        }
        if (value.length >= 2) {
          this.overflowY.setState(value[1], timing, affinity);
        }
      } else {
        this.overflowX.setState(value, timing, affinity);
        this.overflowY.setState(value, timing, affinity);
      }
      return this;
    }
  }

  function overscrollBehavior(this: StyleMap): [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined;
  function overscrollBehavior(this: StyleMap, value: [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined, timing?: AnyTiming | boolean, affinity?: Affinity): StyleMap;
  function overscrollBehavior(this: StyleMap, value?: [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined, timing?: AnyTiming | boolean, affinity?: Affinity): [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined | StyleMap {
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
          this.overscrollBehaviorX.setState(value[0], timing, affinity);
        }
        if (value.length >= 2) {
          this.overscrollBehaviorY.setState(value[1], timing, affinity);
        }
      } else {
        this.overscrollBehaviorX.setState(value, timing, affinity);
        this.overscrollBehaviorY.setState(value, timing, affinity);
      }
      return this;
    }
  }

  function padding(this: StyleMap): [Length | null, Length | null, Length | null, Length | null] | Length | null;
  function padding(this: StyleMap, value: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, affinity?: Affinity): StyleMap;
  function padding(this: StyleMap, value?: [AnyLength | null, AnyLength | null, AnyLength | null, AnyLength | null] | AnyLength | null, timing?: AnyTiming | boolean, affinity?: Affinity): [Length | null, Length | null, Length | null, Length | null] | Length | null | StyleMap {
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
          this.paddingTop.setState(value[0], timing, affinity);
        }
        if (value.length >= 2) {
          this.paddingRight.setState(value[1], timing, affinity);
        }
        if (value.length >= 3) {
          this.paddingBottom.setState(value[2], timing, affinity);
        }
        if (value.length >= 4) {
          this.paddingLeft.setState(value[3], timing, affinity);
        }
      } else {
        this.paddingTop.setState(value, timing, affinity);
        this.paddingRight.setState(value, timing, affinity);
        this.paddingBottom.setState(value, timing, affinity);
        this.paddingLeft.setState(value, timing, affinity);
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
