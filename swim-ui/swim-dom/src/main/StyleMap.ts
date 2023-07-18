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
import type {TimingLike} from "@swim/util";
import {Affinity} from "@swim/component";
import type {FastenerDecorator} from "@swim/component";
import {Fastener} from "@swim/component";
import type {LengthLike} from "@swim/math";
import {Length} from "@swim/math";
import {Transform} from "@swim/math";
import type {FontStyle} from "@swim/style";
import type {FontVariant} from "@swim/style";
import type {FontWeight} from "@swim/style";
import type {FontStretch} from "@swim/style";
import {FontFamily} from "@swim/style";
import type {FontLike} from "@swim/style";
import {Font} from "@swim/style";
import type {ColorLike} from "@swim/style";
import {Color} from "@swim/style";
import type {LinearGradientLike} from "@swim/style";
import {LinearGradient} from "@swim/style";
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
export interface StyleMap extends StyleContext {
  readonly alignContent: StyleAnimator<this, AlignContent | undefined>;

  readonly alignItems: StyleAnimator<this, AlignItems | undefined>;

  readonly alignSelf: StyleAnimator<this, AlignSelf | undefined>;

  readonly appearance: StyleAnimator<this, Appearance | undefined>;

  readonly backdropFilter: StyleAnimator<this, string | undefined>;

  readonly backgroundClip: StyleAnimator<this, BackgroundClip | undefined>;

  readonly backgroundColor: StyleAnimator<this, Color | null>;

  readonly backgroundImage: StyleAnimator<this, LinearGradient | string | null>;

  readonly borderCollapse: StyleAnimator<this, BorderCollapse | undefined>;

  readonly borderColor: Fastener<this> & {
    get(): [Color | null, Color | null, Color | null, Color | null] | Color | null;
    set(value: readonly [ColorLike | null, (ColorLike | null)?, (ColorLike | null)?, (ColorLike | null)?] | ColorLike | null, timing?: TimingLike | boolean | null): StyleMap;
    setIntrinsic(value: readonly [ColorLike | null, (ColorLike | null)?, (ColorLike | null)?, (ColorLike | null)?] | ColorLike | null, timing?: TimingLike | boolean | null): StyleMap;
    setState(value: readonly [ColorLike | null, (ColorLike | null)?, (ColorLike | null)?, (ColorLike | null)?] | ColorLike | null, timing: TimingLike | boolean | null | undefined, affinity: Affinity): void;
  };

  readonly borderTopColor: StyleAnimator<this, Color | null>;

  readonly borderRightColor: StyleAnimator<this, Color | null>;

  readonly borderBottomColor: StyleAnimator<this, Color | null>;

  readonly borderLeftColor: StyleAnimator<this, Color | null>;

  readonly borderRadius: Fastener<this> & {
    get(): [Length | null, Length | null, Length | null, Length | null] | Length | null;
    set(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing?: TimingLike | boolean | null): StyleMap;
    setIntrinsic(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing?: TimingLike | boolean | null): StyleMap;
    setState(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing: TimingLike | boolean | null | undefined, affinity: Affinity): void;
  };

  readonly borderTopLeftRadius: LengthStyleAnimator<this, Length | null>;

  readonly borderTopRightRadius: LengthStyleAnimator<this, Length | null>;

  readonly borderBottomRightRadius: LengthStyleAnimator<this, Length | null>;

  readonly borderBottomLeftRadius: LengthStyleAnimator<this, Length | null>;

  readonly borderSpacing: StyleAnimator<this, string | undefined>;

  readonly borderStyle: Fastener<this> & {
    get(): [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined;
    set(value: readonly [BorderStyle | undefined, (BorderStyle | undefined)?, (BorderStyle | undefined)?, (BorderStyle | undefined)?] | BorderStyle | undefined, timing?: TimingLike | boolean | null): StyleMap;
    setIntrinsic(value: readonly [BorderStyle | undefined, (BorderStyle | undefined)?, (BorderStyle | undefined)?, (BorderStyle | undefined)?] | BorderStyle | undefined, timing?: TimingLike | boolean | null): StyleMap;
    setState(value: readonly [BorderStyle | undefined, (BorderStyle | undefined)?, (BorderStyle | undefined)?, (BorderStyle | undefined)?] | BorderStyle | undefined, timing: TimingLike | boolean | null | undefined, affinity: Affinity): void;
  };

  readonly borderTopStyle: StyleAnimator<this, BorderStyle | undefined>;

  readonly borderRightStyle: StyleAnimator<this, BorderStyle | undefined>;

  readonly borderBottomStyle: StyleAnimator<this, BorderStyle | undefined>;

  readonly borderLeftStyle: StyleAnimator<this, BorderStyle | undefined>;

  readonly borderWidth: Fastener<this> & {
    get(): [Length | null, Length | null, Length | null, Length | null] | Length | null;
    set(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing?: TimingLike | boolean | null): StyleMap;
    setIntrinsic(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing?: TimingLike | boolean | null): StyleMap;
    setState(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing: TimingLike | boolean | null | undefined, affinity: Affinity): void;
  };

  readonly borderTopWidth: LengthStyleAnimator<this, Length | null>;

  readonly borderRightWidth: LengthStyleAnimator<this, Length | null>;

  readonly borderBottomWidth: LengthStyleAnimator<this, Length | null>;

  readonly borderLeftWidth: LengthStyleAnimator<this, Length | null>;

  readonly bottom: LengthStyleConstraintAnimator<this, Length | null>;

  readonly boxShadow: StyleAnimator<this, BoxShadow | null>;

  readonly boxSizing: StyleAnimator<this, BoxSizing | undefined>;

  readonly color: StyleAnimator<this, Color | null>;

  readonly cursor: StyleAnimator<this, CssCursor | undefined>;

  readonly display: StyleAnimator<this, CssDisplay | undefined>;

  readonly filter: StyleAnimator<this, string | undefined>;

  readonly flexBasis: StyleAnimator<this, Length | FlexBasis | null>;

  readonly flexDirection: StyleAnimator<this, FlexDirection | string>;

  readonly flexGrow: StyleAnimator<this, number | undefined>;

  readonly flexShrink: StyleAnimator<this, number | undefined>;

  readonly flexWrap: StyleAnimator<this, FlexWrap | undefined>;

  readonly font: Fastener<this> & {
    get(): Font | null;
    set(value: FontLike | null, timing?: TimingLike | boolean | null): StyleMap;
    setIntrinsic(value: FontLike | null, timing?: TimingLike | boolean | null): StyleMap;
    setState(value: FontLike | null, timing: TimingLike | boolean | null | undefined, affinity: Affinity): void;
  };

  readonly fontFamily: StyleAnimator<this, FontFamily | readonly FontFamily[] | undefined>;

  readonly fontSize: LengthStyleAnimator<this, Length | null>;

  readonly fontStretch: StyleAnimator<this, FontStretch | undefined>;

  readonly fontStyle: StyleAnimator<this, FontStyle | undefined>;

  readonly fontVariant: StyleAnimator<this, FontVariant | undefined>;

  readonly fontWeight: StyleAnimator<this, FontWeight | undefined>;

  readonly height: LengthStyleConstraintAnimator<this, Length | null>;

  readonly justifyContent: StyleAnimator<this, JustifyContent | undefined>;

  readonly left: LengthStyleConstraintAnimator<this, Length | null>;

  readonly lineHeight: LengthStyleAnimator<this, Length | null>;

  readonly margin: Fastener<this> & {
    get(): [Length | null, Length | null, Length | null, Length | null] | Length | null;
    set(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing?: TimingLike | boolean | null): StyleMap;
    setIntrinsic(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing?: TimingLike | boolean | null): StyleMap;
    setState(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing: TimingLike | boolean | null | undefined, affinity: Affinity): void;
  };

  readonly marginTop: LengthStyleConstraintAnimator<this, Length | null>;

  readonly marginRight: LengthStyleConstraintAnimator<this, Length | null>;

  readonly marginBottom: LengthStyleConstraintAnimator<this, Length | null>;

  readonly marginLeft: LengthStyleConstraintAnimator<this, Length | null>;

  readonly maxHeight: LengthStyleAnimator<this, Length | null>;

  readonly maxWidth: LengthStyleAnimator<this, Length | null>;

  readonly minHeight: LengthStyleAnimator<this, Length | null>;

  readonly minWidth: LengthStyleAnimator<this, Length | null>;

  readonly opacity: StyleAnimator<this, number | undefined>;

  readonly order: StyleAnimator<this, number | undefined>;

  readonly outlineColor: StyleAnimator<this, Color | null>;

  readonly outlineOffset: LengthStyleAnimator<this, Length | null>;

  readonly outlineStyle: StyleAnimator<this, BorderStyle | undefined>;

  readonly outlineWidth: LengthStyleAnimator<this, Length | null>;

  readonly overflow: Fastener<this> & {
    get(): [Overflow | undefined, Overflow | undefined] | Overflow | undefined;
    set(value: readonly [Overflow | undefined, (Overflow | undefined)?] | Overflow | undefined, timing?: TimingLike | boolean | null): StyleMap;
    setIntrinsic(value: readonly [Overflow | undefined, (Overflow | undefined)?] | Overflow | undefined, timing?: TimingLike | boolean | null): StyleMap;
    setState(value: readonly [Overflow | undefined, (Overflow | undefined)?] | Overflow | undefined, timing: TimingLike | boolean | null | undefined, affinity: Affinity): void;
  };

  readonly overflowX: StyleAnimator<this, Overflow | undefined>;

  readonly overflowY: StyleAnimator<this, Overflow | undefined>;

  readonly overflowScrolling: StyleAnimator<this, "auto" | "touch" | undefined>;

  readonly overscrollBehavior: Fastener<this> & {
    get(): [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined;
    set(value: readonly [OverscrollBehavior | undefined, (OverscrollBehavior | undefined)?] | OverscrollBehavior | undefined, timing?: TimingLike | boolean | null): StyleMap;
    setIntrinsic(value: readonly [OverscrollBehavior | undefined, (OverscrollBehavior | undefined)?] | OverscrollBehavior | undefined, timing?: TimingLike | boolean | null): StyleMap;
    setState(value: readonly [OverscrollBehavior | undefined, (OverscrollBehavior | undefined)?] | OverscrollBehavior | undefined, timing: TimingLike | boolean | null | undefined, affinity: Affinity): void;
  };

  readonly overscrollBehaviorX: StyleAnimator<this, OverscrollBehavior | undefined>;

  readonly overscrollBehaviorY: StyleAnimator<this, OverscrollBehavior | undefined>;

  readonly padding: Fastener<this> & {
    get(): [Length | null, Length | null, Length | null, Length | null] | Length | null;
    set(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing?: TimingLike | boolean | null): StyleMap;
    setIntrinsic(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing?: TimingLike | boolean | null): StyleMap;
    setState(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing: TimingLike | boolean | null | undefined, affinity: Affinity): void;
  };

  readonly paddingTop: LengthStyleConstraintAnimator<this, Length | null>;

  readonly paddingRight: LengthStyleConstraintAnimator<this, Length | null>;

  readonly paddingBottom: LengthStyleConstraintAnimator<this, Length | null>;

  readonly paddingLeft: LengthStyleConstraintAnimator<this, Length | null>;

  readonly pointerEvents: StyleAnimator<this, PointerEvents | undefined>;

  readonly position: StyleAnimator<this, Position | undefined>;

  readonly right: LengthStyleConstraintAnimator<this, Length | null>;

  readonly textAlign: StyleAnimator<this, TextAlign | undefined>;

  readonly textDecorationColor: StyleAnimator<this, Color | null>;

  readonly textDecorationLine: StyleAnimator<this, string | undefined>;

  readonly textDecorationStyle: StyleAnimator<this, TextDecorationStyle | undefined>;

  readonly textOverflow: StyleAnimator<this, string | undefined>;

  readonly textTransform: StyleAnimator<this, TextTransform | undefined>;

  readonly top: LengthStyleConstraintAnimator<this, Length | null>;

  readonly touchAction: StyleAnimator<this, TouchAction | undefined>;

  readonly transform: StyleAnimator<this, Transform | null>;

  readonly userSelect: StyleAnimator<this, UserSelect | undefined>;

  readonly verticalAlign: StyleAnimator<this, VerticalAlign | undefined>;

  readonly visibility: StyleAnimator<this, Visibility | undefined>;

  readonly whiteSpace: StyleAnimator<this, WhiteSpace | undefined>;

  readonly width: LengthStyleConstraintAnimator<this, Length | null>;

  readonly zIndex: StyleAnimator<this, number | undefined>;
}

/** @public */
export const StyleMap = (function () {
  const StyleMap = {} as {
    /** @internal */
    defineField<K extends keyof StyleMap>(constructor: Proto<StyleMap>, name: K, decorators: StyleMap[K] extends Fastener<any, any, any> ? FastenerDecorator<StyleMap[K]>[] : never,
                                          fieldInitializers: {[name: PropertyKey]: Function[]}, instanceInitializers: Function[]): void;

    /** @internal */
    defineGetter<K extends keyof StyleMap>(constructor: Proto<StyleMap>, name: K, decorators: StyleMap[K] extends Fastener<any, any, any> ? FastenerDecorator<StyleMap[K]>[] : never,
                                           fieldInitializers: {[name: PropertyKey]: Function[]}, instanceInitializers: Function[]): void;

    /** @internal */
    define(constructor: Proto<StyleMap>, fieldInitializers: {[name: PropertyKey]: Function[]}, instanceInitializers: Function[]): void;

    /** @internal */
    pctWidthUnit(node: Node | undefined): number;

    /** @internal */
    pctHeightUnit(node: Node | undefined): number;
  };

  StyleMap.defineField = function <K extends keyof StyleMap>(constructor: Proto<StyleMap>, name: K, decorators: StyleMap[K] extends Fastener<any, any, any> ? FastenerDecorator<StyleMap[K]>[] : never,
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

  StyleMap.defineGetter = function <K extends keyof StyleMap>(constructor: Proto<StyleMap>, name: K, decorators: StyleMap[K] extends Fastener<any, any, any> ? FastenerDecorator<StyleMap[K]>[] : never,
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
      fromLike(value: LinearGradientLike | string | null): LinearGradient | string | null {
        if (typeof value === "string") {
          try {
            return LinearGradient.parse(value);
          } catch (swallow) {
            return value;
          }
        } else {
          return LinearGradient.fromLike(value);
        }
      },
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "borderCollapse", [StyleAnimator({
      propertyNames: "border-collapse",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "borderColor", [Fastener({
      get(): [Color | null, Color | null, Color | null, Color | null] | Color | null {
        const borderTopColor = this.owner.borderTopColor.value;
        const borderRightColor = this.owner.borderRightColor.value;
        const borderBottomColor = this.owner.borderBottomColor.value;
        const borderLeftColor = this.owner.borderLeftColor.value;
        if (Values.equal(borderTopColor, borderRightColor)
            && Values.equal(borderRightColor, borderBottomColor)
            && Values.equal(borderBottomColor, borderLeftColor)) {
          return borderTopColor;
        }
        return [borderTopColor, borderRightColor, borderBottomColor, borderLeftColor];
      },
      set(value: readonly [ColorLike | null, (ColorLike | null)?, (ColorLike | null)?, (ColorLike | null)?] | Color | null, timing?: TimingLike | boolean | null): StyleMap {
        this.setState(value, timing, Affinity.Extrinsic);
        return this.owner;
      },
      setIntrinsic(value: readonly [ColorLike | null, (ColorLike | null)?, (ColorLike | null)?, (ColorLike | null)?] | ColorLike | null, timing?: TimingLike | boolean | null): StyleMap {
        this.setState(value, timing, Affinity.Intrinsic);
        return this.owner;
      },
      setState(value: readonly [ColorLike | null, (ColorLike | null)?, (ColorLike | null)?, (ColorLike | null)?] | ColorLike | null, timing: TimingLike | boolean | null | undefined, affinity: Affinity): void {
        if (!Array.isArray(value)) {
          this.owner.borderTopColor.setState(value as ColorLike | null, timing, affinity);
          this.owner.borderRightColor.setState(value as ColorLike | null, timing, affinity);
          this.owner.borderBottomColor.setState(value as ColorLike | null, timing, affinity);
          this.owner.borderLeftColor.setState(value as ColorLike | null, timing, affinity);
        } else if (value.length === 1) {
          this.owner.borderTopColor.setState(value[0], timing, affinity);
          this.owner.borderRightColor.setState(value[0], timing, affinity);
          this.owner.borderBottomColor.setState(value[0], timing, affinity);
          this.owner.borderLeftColor.setState(value[0], timing, affinity);
        } else if (value.length === 2) {
          this.owner.borderTopColor.setState(value[0], timing, affinity);
          this.owner.borderRightColor.setState(value[1], timing, affinity);
          this.owner.borderBottomColor.setState(value[0], timing, affinity);
          this.owner.borderLeftColor.setState(value[1], timing, affinity);
        } else if (value.length === 3) {
          this.owner.borderTopColor.setState(value[0], timing, affinity);
          this.owner.borderRightColor.setState(value[1], timing, affinity);
          this.owner.borderBottomColor.setState(value[2], timing, affinity);
          this.owner.borderLeftColor.setState(value[1], timing, affinity);
        } else if (value.length === 4) {
          this.owner.borderTopColor.setState(value[0], timing, affinity);
          this.owner.borderRightColor.setState(value[1], timing, affinity);
          this.owner.borderBottomColor.setState(value[2], timing, affinity);
          this.owner.borderLeftColor.setState(value[3], timing, affinity);
        }
      },
    })], fieldInitializers, instanceInitializers);

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

    StyleMap.defineGetter(constructor, "borderRadius", [Fastener({
      get(): [Length | null, Length | null, Length | null, Length | null] | Length | null {
        const borderTopLeftRadius = this.owner.borderTopLeftRadius.value;
        const borderTopRightRadius = this.owner.borderTopRightRadius.value;
        const borderBottomRightRadius = this.owner.borderBottomRightRadius.value;
        const borderBottomLeftRadius = this.owner.borderBottomLeftRadius.value;
        if (Equals(borderTopLeftRadius, borderTopRightRadius)
            && Equals(borderTopRightRadius, borderBottomRightRadius)
            && Equals(borderBottomRightRadius, borderBottomLeftRadius)) {
          return borderTopLeftRadius;
        }
        return [borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius];
      },
      set(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing?: TimingLike | boolean | null): StyleMap {
        this.setState(value, timing, Affinity.Extrinsic);
        return this.owner;
      },
      setIntrinsic(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing?: TimingLike | boolean | null): StyleMap {
        this.setState(value, timing, Affinity.Intrinsic);
        return this.owner;
      },
      setState(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing: TimingLike | boolean | null | undefined, affinity: Affinity): void {
        if (!Array.isArray(value)) {
          this.owner.borderTopLeftRadius.setState(value as LengthLike | null, timing, affinity);
          this.owner.borderTopRightRadius.setState(value as LengthLike | null, timing, affinity);
          this.owner.borderBottomRightRadius.setState(value as LengthLike | null, timing, affinity);
          this.owner.borderBottomLeftRadius.setState(value as LengthLike | null, timing, affinity);
        } else if (value.length === 1) {
          this.owner.borderTopLeftRadius.setState(value[0], timing, affinity);
          this.owner.borderTopRightRadius.setState(value[0], timing, affinity);
          this.owner.borderBottomRightRadius.setState(value[0], timing, affinity);
          this.owner.borderBottomLeftRadius.setState(value[0], timing, affinity);
        } else if (value.length === 2) {
          this.owner.borderTopLeftRadius.setState(value[0], timing, affinity);
          this.owner.borderTopRightRadius.setState(value[1], timing, affinity);
          this.owner.borderBottomRightRadius.setState(value[0], timing, affinity);
          this.owner.borderBottomLeftRadius.setState(value[1], timing, affinity);
        } else if (value.length === 3) {
          this.owner.borderTopLeftRadius.setState(value[0], timing, affinity);
          this.owner.borderTopRightRadius.setState(value[1], timing, affinity);
          this.owner.borderBottomRightRadius.setState(value[2], timing, affinity);
          this.owner.borderBottomLeftRadius.setState(value[1], timing, affinity);
        } else if (value.length === 4) {
          this.owner.borderTopLeftRadius.setState(value[0], timing, affinity);
          this.owner.borderTopRightRadius.setState(value[1], timing, affinity);
          this.owner.borderBottomRightRadius.setState(value[2], timing, affinity);
          this.owner.borderBottomLeftRadius.setState(value[3], timing, affinity);
        }
      },
    })], fieldInitializers, instanceInitializers);

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

    StyleMap.defineGetter(constructor, "borderStyle", [Fastener({
      get(): [BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined, BorderStyle | undefined] | BorderStyle | undefined {
        const borderTopStyle = this.owner.borderTopStyle.value;
        const borderRightStyle = this.owner.borderRightStyle.value;
        const borderBottomStyle = this.owner.borderBottomStyle.value;
        const borderLeftStyle = this.owner.borderLeftStyle.value;
        if (borderTopStyle === borderRightStyle
            && borderRightStyle === borderBottomStyle
            && borderBottomStyle === borderLeftStyle) {
          return borderTopStyle;
        }
        return [borderTopStyle, borderRightStyle, borderBottomStyle, borderLeftStyle];
      },
      set(value: readonly [BorderStyle | undefined, (BorderStyle | undefined)?, (BorderStyle | undefined)?, (BorderStyle | undefined)?] | BorderStyle | undefined, timing?: TimingLike | boolean | null): StyleMap {
        this.setState(value, timing, Affinity.Extrinsic);
        return this.owner;
      },
      setIntrinsic(value: readonly [BorderStyle | undefined, (BorderStyle | undefined)?, (BorderStyle | undefined)?, (BorderStyle | undefined)?] | BorderStyle | undefined, timing?: TimingLike | boolean | null): StyleMap {
        this.setState(value, timing, Affinity.Intrinsic);
        return this.owner;
      },
      setState(value: readonly [BorderStyle | undefined, (BorderStyle | undefined)?, (BorderStyle | undefined)?, (BorderStyle | undefined)?] | BorderStyle | undefined, timing: TimingLike | boolean | null | undefined, affinity: Affinity): void {
        if (!Array.isArray(value)) {
          this.owner.borderTopStyle.setState(value as BorderStyle | undefined, timing, affinity);
          this.owner.borderRightStyle.setState(value as BorderStyle | undefined, timing, affinity);
          this.owner.borderBottomStyle.setState(value as BorderStyle | undefined, timing, affinity);
          this.owner.borderLeftStyle.setState(value as BorderStyle | undefined, timing, affinity);
        } else if (value.length === 1) {
          this.owner.borderTopStyle.setState(value[0], timing, affinity);
          this.owner.borderRightStyle.setState(value[0], timing, affinity);
          this.owner.borderBottomStyle.setState(value[0], timing, affinity);
          this.owner.borderLeftStyle.setState(value[0], timing, affinity);
        } else if (value.length === 2) {
          this.owner.borderTopStyle.setState(value[0], timing, affinity);
          this.owner.borderRightStyle.setState(value[1], timing, affinity);
          this.owner.borderBottomStyle.setState(value[0], timing, affinity);
          this.owner.borderLeftStyle.setState(value[1], timing, affinity);
        } else if (value.length === 3) {
          this.owner.borderTopStyle.setState(value[0], timing, affinity);
          this.owner.borderRightStyle.setState(value[1], timing, affinity);
          this.owner.borderBottomStyle.setState(value[2], timing, affinity);
          this.owner.borderLeftStyle.setState(value[1], timing, affinity);
        } else if (value.length === 4) {
          this.owner.borderTopStyle.setState(value[0], timing, affinity);
          this.owner.borderRightStyle.setState(value[1], timing, affinity);
          this.owner.borderBottomStyle.setState(value[2], timing, affinity);
          this.owner.borderLeftStyle.setState(value[3], timing, affinity);
        }
      },
    })], fieldInitializers, instanceInitializers);

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

    StyleMap.defineGetter(constructor, "borderWidth", [Fastener({
      get(): [Length | null, Length | null, Length | null, Length | null] | Length | null {
        const borderTopWidth = this.owner.borderTopWidth.value;
        const borderRightWidth = this.owner.borderRightWidth.value;
        const borderBottomWidth = this.owner.borderBottomWidth.value;
        const borderLeftWidth = this.owner.borderLeftWidth.value;
        if (Values.equal(borderTopWidth, borderRightWidth)
            && Values.equal(borderRightWidth, borderBottomWidth)
            && Values.equal(borderBottomWidth, borderLeftWidth)) {
          return borderTopWidth;
        }
        return [borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth];
      },
      set(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing?: TimingLike | boolean | null): StyleMap {
        this.setState(value, timing, Affinity.Extrinsic);
        return this.owner;
      },
      setIntrinsic(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing?: TimingLike | boolean | null): StyleMap {
        this.setState(value, timing, Affinity.Intrinsic);
        return this.owner;
      },
      setState(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing: TimingLike | boolean | null | undefined, affinity: Affinity): void {
        if (!Array.isArray(value)) {
          this.owner.borderTopWidth.setState(value as LengthLike | null, timing, affinity);
          this.owner.borderRightWidth.setState(value as LengthLike | null, timing, affinity);
          this.owner.borderBottomWidth.setState(value as LengthLike | null, timing, affinity);
          this.owner.borderLeftWidth.setState(value as LengthLike | null, timing, affinity);
        } else if (value.length === 1) {
          this.owner.borderTopWidth.setState(value[0], timing, affinity);
          this.owner.borderRightWidth.setState(value[0], timing, affinity);
          this.owner.borderBottomWidth.setState(value[0], timing, affinity);
          this.owner.borderLeftWidth.setState(value[0], timing, affinity);
        } else if (value.length === 2) {
          this.owner.borderTopWidth.setState(value[0], timing, affinity);
          this.owner.borderRightWidth.setState(value[1], timing, affinity);
          this.owner.borderBottomWidth.setState(value[0], timing, affinity);
          this.owner.borderLeftWidth.setState(value[1], timing, affinity);
        } else if (value.length === 3) {
          this.owner.borderTopWidth.setState(value[0], timing, affinity);
          this.owner.borderRightWidth.setState(value[1], timing, affinity);
          this.owner.borderBottomWidth.setState(value[2], timing, affinity);
          this.owner.borderLeftWidth.setState(value[1], timing, affinity);
        } else if (value.length === 4) {
          this.owner.borderTopWidth.setState(value[0], timing, affinity);
          this.owner.borderRightWidth.setState(value[1], timing, affinity);
          this.owner.borderBottomWidth.setState(value[2], timing, affinity);
          this.owner.borderLeftWidth.setState(value[3], timing, affinity);
        }
      },
    })], fieldInitializers, instanceInitializers);

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

    StyleMap.defineGetter(constructor, "font", [Fastener({
      get(): Font | null {
        const style = this.owner.fontStyle.value;
        const variant = this.owner.fontVariant.value;
        const weight = this.owner.fontWeight.value;
        const stretch = this.owner.fontStretch.value;
        const size = this.owner.fontSize.value;
        const height = this.owner.lineHeight.value;
        const family = this.owner.fontFamily.value;
        if (family === void 0) {
          return null;
        }
        return Font.create(style, variant, weight, stretch, size, height, family);
      },
      set(value: FontLike | null, timing?: TimingLike | boolean | null): StyleMap {
        this.setState(value, timing, Affinity.Extrinsic);
        return this.owner;
      },
      setIntrinsic(value: FontLike | null, timing?: TimingLike | boolean | null): StyleMap {
        this.setState(value, timing, Affinity.Intrinsic);
        return this.owner;
      },
      setState(value: FontLike | null, timing: TimingLike | boolean | null | undefined, affinity: Affinity): void {
        if (value === null) {
          this.owner.fontStyle.setState(void 0, timing, affinity);
          this.owner.fontVariant.setState(void 0, timing, affinity);
          this.owner.fontWeight.setState(void 0, timing, affinity);
          this.owner.fontStretch.setState(void 0, timing, affinity);
          this.owner.fontSize.setState(null, timing, affinity);
          this.owner.lineHeight.setState(null, timing, affinity);
          this.owner.fontFamily.setState(void 0, timing, affinity);
          return;
        }
        value = Font.fromLike(value);
        this.owner.fontStyle.setState(value.style, timing, affinity);
        this.owner.fontVariant.setState(value.variant, timing, affinity);
        this.owner.fontWeight.setState(value.weight, timing, affinity);
        this.owner.fontStretch.setState(value.stretch, timing, affinity);
        this.owner.fontSize.setState(value.size, timing, affinity);
        this.owner.lineHeight.setState(value.height, timing, affinity);
        this.owner.fontFamily.setState(value.family, timing, affinity);
      },
    })], fieldInitializers, instanceInitializers);

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

    StyleMap.defineGetter(constructor, "margin", [Fastener({
      get(): [Length | null, Length | null, Length | null, Length | null] | Length | null {
        const marginTop = this.owner.marginTop.value;
        const marginRight = this.owner.marginRight.value;
        const marginBottom = this.owner.marginBottom.value;
        const marginLeft = this.owner.marginLeft.value;
        if (Values.equal(marginTop, marginRight)
            && Values.equal(marginRight, marginBottom)
            && Values.equal(marginBottom, marginLeft)) {
          return marginTop;
        }
        return [marginTop, marginRight, marginBottom, marginLeft];
      },
      set(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing?: TimingLike | boolean | null): StyleMap {
        this.setState(value, timing, Affinity.Extrinsic);
        return this.owner;
      },
      setIntrinsic(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing?: TimingLike | boolean | null): StyleMap {
        this.setState(value, timing, Affinity.Intrinsic);
        return this.owner;
      },
      setState(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing: TimingLike | boolean | null | undefined, affinity: Affinity): void {
        if (!Array.isArray(value)) {
          this.owner.marginTop.setState(value as LengthLike | null, timing, affinity);
          this.owner.marginRight.setState(value as LengthLike | null, timing, affinity);
          this.owner.marginBottom.setState(value as LengthLike | null, timing, affinity);
          this.owner.marginLeft.setState(value as LengthLike | null, timing, affinity);
        } else if (value.length === 1) {
          this.owner.marginTop.setState(value[0], timing, affinity);
          this.owner.marginRight.setState(value[0], timing, affinity);
          this.owner.marginBottom.setState(value[0], timing, affinity);
          this.owner.marginLeft.setState(value[0], timing, affinity);
        } else if (value.length === 2) {
          this.owner.marginTop.setState(value[0], timing, affinity);
          this.owner.marginRight.setState(value[1], timing, affinity);
          this.owner.marginBottom.setState(value[0], timing, affinity);
          this.owner.marginLeft.setState(value[1], timing, affinity);
        } else if (value.length === 3) {
          this.owner.marginTop.setState(value[0], timing, affinity);
          this.owner.marginRight.setState(value[1], timing, affinity);
          this.owner.marginBottom.setState(value[2], timing, affinity);
          this.owner.marginLeft.setState(value[1], timing, affinity);
        } else if (value.length === 4) {
          this.owner.marginTop.setState(value[0], timing, affinity);
          this.owner.marginRight.setState(value[1], timing, affinity);
          this.owner.marginBottom.setState(value[2], timing, affinity);
          this.owner.marginLeft.setState(value[3], timing, affinity);
        }
      },
    })], fieldInitializers, instanceInitializers);

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

    StyleMap.defineGetter(constructor, "overflow", [Fastener({
      get(): [Overflow | undefined, Overflow | undefined] | Overflow | undefined {
        const overflowX = this.owner.overflowX.value;
        const overflowY = this.owner.overflowY.value;
        if (overflowX === overflowY) {
          return overflowX;
        }
        return [overflowX, overflowY];
      },
      set(value: readonly [Overflow | undefined, (Overflow | undefined)?] | Overflow | undefined, timing?: TimingLike | boolean | null): StyleMap {
        this.setState(value, timing, Affinity.Extrinsic);
        return this.owner;
      },
      setIntrinsic(value: readonly [Overflow | undefined, (Overflow | undefined)?] | Overflow | undefined, timing?: TimingLike | boolean | null): StyleMap {
        this.setState(value, timing, Affinity.Intrinsic);
        return this.owner;
      },
      setState(value: readonly [Overflow | undefined, (Overflow | undefined)?] | Overflow | undefined, timing: TimingLike | boolean | null | undefined, affinity: Affinity): void {
        if (!Array.isArray(value)) {
          this.owner.overflowX.setState(value as Overflow | undefined, timing, affinity);
          this.owner.overflowY.setState(value as Overflow | undefined, timing, affinity);
        } else if (value.length === 1) {
          this.owner.overflowX.setState(value[0], timing, affinity);
          this.owner.overflowY.setState(value[0], timing, affinity);
        } else if (value.length === 2) {
          this.owner.overflowX.setState(value[0], timing, affinity);
          this.owner.overflowY.setState(value[1], timing, affinity);
        }
      },
    })], fieldInitializers, instanceInitializers);

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

    StyleMap.defineGetter(constructor, "overscrollBehavior", [Fastener({
      get(): [OverscrollBehavior | undefined, OverscrollBehavior | undefined] | OverscrollBehavior | undefined {
        const overscrollBehaviorX = this.owner.overscrollBehaviorX.value;
        const overscrollBehaviorY = this.owner.overscrollBehaviorY.value;
        if (overscrollBehaviorX === overscrollBehaviorY) {
          return overscrollBehaviorX;
        }
        return [overscrollBehaviorX, overscrollBehaviorY];
      },
      set(value: readonly [OverscrollBehavior | undefined, (OverscrollBehavior | undefined)?] | OverscrollBehavior | undefined, timing?: TimingLike | boolean | null): StyleMap {
        this.setState(value, timing, Affinity.Extrinsic);
        return this.owner;
      },
      setIntrinsic(value: readonly [OverscrollBehavior | undefined, (OverscrollBehavior | undefined)?] | OverscrollBehavior | undefined, timing?: TimingLike | boolean | null): StyleMap {
        this.setState(value, timing, Affinity.Intrinsic);
        return this.owner;
      },
      setState(value: readonly [OverscrollBehavior | undefined, (OverscrollBehavior | undefined)?] | OverscrollBehavior | undefined, timing: TimingLike | boolean | null | undefined, affinity: Affinity): void {
        if (!Array.isArray(value)) {
          this.owner.overscrollBehaviorX.setState(value as OverscrollBehavior | undefined, timing, affinity);
          this.owner.overscrollBehaviorY.setState(value as OverscrollBehavior | undefined, timing, affinity);
        } else if (value.length === 1) {
          this.owner.overscrollBehaviorX.setState(value[0], timing, affinity);
          this.owner.overscrollBehaviorY.setState(value[0], timing, affinity);
        } else if (value.length === 2) {
          this.owner.overscrollBehaviorX.setState(value[0], timing, affinity);
          this.owner.overscrollBehaviorY.setState(value[1], timing, affinity);
        }
      },
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "overscrollBehaviorX", [StyleAnimator({
      propertyNames: "overscroll-behavior-x",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "overscrollBehaviorY", [StyleAnimator({
      propertyNames: "overscroll-behavior-y",
      valueType: String,
    })], fieldInitializers, instanceInitializers);

    StyleMap.defineGetter(constructor, "padding", [Fastener({
      get(): [Length | null, Length | null, Length | null, Length | null] | Length | null {
        const paddingTop = this.owner.paddingTop.value;
        const paddingRight = this.owner.paddingRight.value;
        const paddingBottom = this.owner.paddingBottom.value;
        const paddingLeft = this.owner.paddingLeft.value;
        if (Values.equal(paddingTop, paddingRight)
            && Values.equal(paddingRight, paddingBottom)
            && Values.equal(paddingBottom, paddingLeft)) {
          return paddingTop;
        }
        return [paddingTop, paddingRight, paddingBottom, paddingLeft];
      },
      set(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing?: TimingLike | boolean | null): StyleMap {
        this.setState(value, timing, Affinity.Extrinsic);
        return this.owner;
      },
      setIntrinsic(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing?: TimingLike | boolean | null): StyleMap {
        this.setState(value, timing, Affinity.Intrinsic);
        return this.owner;
      },
      setState(value: readonly [LengthLike | null, (LengthLike | null)?, (LengthLike | null)?, (LengthLike | null)?] | LengthLike | null, timing: TimingLike | boolean | null | undefined, affinity: Affinity): void {
        if (!Array.isArray(value)) {
          this.owner.paddingTop.setState(value as LengthLike | null, timing, affinity);
          this.owner.paddingRight.setState(value as LengthLike | null, timing, affinity);
          this.owner.paddingBottom.setState(value as LengthLike | null, timing, affinity);
          this.owner.paddingLeft.setState(value as LengthLike | null, timing, affinity);
        } else if (value.length === 1) {
          this.owner.paddingTop.setState(value[0], timing, affinity);
          this.owner.paddingRight.setState(value[0], timing, affinity);
          this.owner.paddingBottom.setState(value[0], timing, affinity);
          this.owner.paddingLeft.setState(value[0], timing, affinity);
        } else if (value.length === 2) {
          this.owner.paddingTop.setState(value[0], timing, affinity);
          this.owner.paddingRight.setState(value[1], timing, affinity);
          this.owner.paddingBottom.setState(value[0], timing, affinity);
          this.owner.paddingLeft.setState(value[1], timing, affinity);
        } else if (value.length === 3) {
          this.owner.paddingTop.setState(value[0], timing, affinity);
          this.owner.paddingRight.setState(value[1], timing, affinity);
          this.owner.paddingBottom.setState(value[2], timing, affinity);
          this.owner.paddingLeft.setState(value[1], timing, affinity);
        } else if (value.length === 4) {
          this.owner.paddingTop.setState(value[0], timing, affinity);
          this.owner.paddingRight.setState(value[1], timing, affinity);
          this.owner.paddingBottom.setState(value[2], timing, affinity);
          this.owner.paddingLeft.setState(value[3], timing, affinity);
        }
      },
    })], fieldInitializers, instanceInitializers);

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
