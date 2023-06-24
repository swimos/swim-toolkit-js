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

// Font

export type {FontStyle} from "./Font";
export type {FontVariant} from "./Font";
export type {FontWeight} from "./Font";
export type {FontStretch} from "./Font";
export type {AnyFontSize} from "./Font";
export {FontSize} from "./Font";
export type {AnyLineHeight} from "./Font";
export {LineHeight} from "./Font";
export type {GenericFamily} from "./Font";
export {FontFamily} from "./Font";
export type {AnyFont} from "./Font";
export type {FontInit} from "./Font";
export {Font} from "./Font";
export {FontInterpolator} from "./Font";
export {FontFamilyParser} from "./Font";
export {FontParser} from "./Font";

// Color

export type {AnyColor} from "./Color";
export type {ColorInit} from "./Color";
export {Color} from "./Color";
export {ColorForm} from "./Color";
export {ColorParser} from "./Color";
export {ColorChannel} from "./Color";
export {ColorChannelParser} from "./Color";

export type {AnyRgbColor} from "./RgbColor";
export type {RgbColorInit} from "./RgbColor";
export {RgbColor} from "./RgbColor";
export {RgbColorInterpolator} from "./RgbColor";
export {RgbColorParser} from "./RgbColor";
export {HexColorParser} from "./RgbColor";

export type {AnyHslColor} from "./HslColor";
export type {HslColorInit} from "./HslColor";
export {HslColor} from "./HslColor";
export {HslColorInterpolator} from "./HslColor";
export {HslColorParser} from "./HslColor";

// Gradient

export type {AnyColorStop} from "./ColorStop";
export type {ColorStopInit} from "./ColorStop";
export type {ColorStopTuple} from "./ColorStop";
export {ColorStop} from "./ColorStop";
export {ColorStopInterpolator} from "./ColorStop";
export {ColorStopParser} from "./ColorStop";
export {ColorStopListParser} from "./ColorStop";

export type {AnyLinearGradient} from "./LinearGradient";
export type {AnyLinearGradientAngle} from "./LinearGradient";
export type {LinearGradientAngle} from "./LinearGradient";
export type {LinearGradientCorner} from "./LinearGradient";
export type {LinearGradientSide} from "./LinearGradient";
export type {LinearGradientInit} from "./LinearGradient";
export {LinearGradient} from "./LinearGradient";
export {LinearGradientInterpolator} from "./LinearGradient";
export {LinearGradientAngleParser} from "./LinearGradient";
export {LinearGradientParser} from "./LinearGradient";

// Shadow

export type {AnyBoxShadow} from "./BoxShadow";
export type {BoxShadowInit} from "./BoxShadow";
export {BoxShadow} from "./BoxShadow";
export {BoxShadowInterpolator} from "./BoxShadow";
export {BoxShadowForm} from "./BoxShadow";
export {BoxShadowParser} from "./BoxShadow";

// Value

export type {AnyStyleValue} from "./StyleValue";
export {StyleValue} from "./StyleValue";
export {StyleValueForm} from "./StyleValue";
export {StyleValueParser} from "./StyleValue";

export {ToAttributeString} from "./ToAttributeString";
export {ToStyleString} from "./ToStyleString";
export {ToCssValue} from "./ToCssValue";

// Focus

export type {AnyFocus} from "./Focus";
export type {FocusInit} from "./Focus";
export {Focus} from "./Focus";
export {FocusInterpolator} from "./Focus";
export {FocusAnimator} from "./Focus";

export type {AnyPresence} from "./Presence";
export type {PresenceInit} from "./Presence";
export {Presence} from "./Presence";
export {PresenceInterpolator} from "./Presence";
export {PresenceAnimator} from "./Presence";

// Expansion

export type {AnyExpansion} from "./Expansion";
export type {ExpansionInit} from "./Expansion";
export {Expansion} from "./Expansion";
export {ExpansionInterpolator} from "./Expansion";
export {ExpansionAnimator} from "./Expansion";
