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

// Look

export type {AnyLookVector} from "./LookVector";
export type {LookVectorArray} from "./LookVector";
export type {LookVectorUpdates} from "./LookVector";
export {LookVector} from "./LookVector";

// Feel

export type {AnyFeelVector} from "./FeelVector";
export type {FeelVectorArray} from "./FeelVector";
export type {FeelVectorUpdates} from "./FeelVector";
export {FeelVector} from "./FeelVector";
export {FeelVectorInterpolator} from "./FeelVector";

// Mood

export type {AnyMoodVector} from "./MoodVector";
export type {MoodVectorArray} from "./MoodVector";
export type {MoodVectorUpdates} from "./MoodVector";
export {MoodVector} from "./MoodVector";

export {MoodMatrix} from "./MoodMatrix";

// Theme

export {ThemeMatrix} from "./ThemeMatrix";

export {ThemeContext} from "./ThemeContext";

export type {ThemeAnimatorDescriptor} from "./ThemeAnimator";
export {ThemeAnimator} from "./ThemeAnimator";

export type {ThemeConstraintAnimatorDescriptor} from "./ThemeConstraintAnimator";
export {ThemeConstraintAnimator} from "./ThemeConstraintAnimator";

// Builtin

export {Look} from "./Look";
export type {AnyNumberOrLook} from "./Look";
export type {NumberOrLook} from "./Look";
export {NumberLook} from "./Look";
export type {AnyLengthOrLook} from "./Look";
export type {LengthOrLook} from "./Look";
export {LengthLook} from "./Look";
export type {AnyColorOrLook} from "./Look";
export type {ColorOrLook} from "./Look";
export {ColorLook} from "./Look";
export type {AnyFontOrLook} from "./Look";
export type {FontOrLook} from "./Look";
export {FontLook} from "./Look";
export type {AnyShadowOrLook} from "./Look";
export type {ShadowOrLook} from "./Look";
export {ShadowLook} from "./Look";
export type {AnyTimingOrLook} from "./Look";
export type {TimingOrLook} from "./Look";
export {TimingLook} from "./Look";

export {Feel} from "./Feel";
export {InterpolatedFeel} from "./Feel";
export {BrightnessFeel} from "./Feel";
export {OpacityFeel} from "./Feel";

export {Mood} from "./Mood";

export {Theme} from "./Theme";
