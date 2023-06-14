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

import type {Proto} from "@swim/util";
import type {FastenerOwner} from "@swim/component";
import type {CssScopeDescriptor} from "./CssScope";
import type {CssScopeClass} from "./CssScope";
import {CssScope} from "./CssScope";

/** @public */
export type StyleSheetDecorator<F extends StyleSheet<any>> = {
  <T>(target: unknown, context: ClassFieldDecoratorContext<T, F>): (this: T, value: F | undefined) => F;
};

/** @public */
export interface StyleSheetDescriptor extends CssScopeDescriptor<CSSStyleSheet> {
  extends?: Proto<StyleSheet<any>> | boolean | null;
}

/** @public */
export type StyleSheetTemplate<F extends StyleSheet<any>> =
  ThisType<F> &
  StyleSheetDescriptor &
  Partial<Omit<F, keyof StyleSheetDescriptor>>;

/** @public */
export interface StyleSheetClass<F extends StyleSheet<any> = StyleSheet<any>> extends CssScopeClass<F> {
  /** @override */
  specialize(template: StyleSheetDescriptor): StyleSheetClass<F>;

  /** @override */
  refine(fastenerClass: StyleSheetClass<any>): void;

  /** @override */
  extend<F2 extends F>(className: string | symbol, template: StyleSheetTemplate<F2>): StyleSheetClass<F2>;
  extend<F2 extends F>(className: string | symbol, template: StyleSheetTemplate<F2>): StyleSheetClass<F2>;

  /** @override */
  define<F2 extends F>(className: string | symbol, template: StyleSheetTemplate<F2>): StyleSheetClass<F2>;
  define<F2 extends F>(className: string | symbol, template: StyleSheetTemplate<F2>): StyleSheetClass<F2>;

  /** @override */
  <F2 extends F>(template: StyleSheetTemplate<F2>): StyleSheetDecorator<F2>;
}

/** @public */
export interface StyleSheet<O = unknown> extends CssScope<O, CSSStyleSheet> {
  /** @override */
  get fastenerType(): Proto<StyleSheet<any>>;

  /** @override */
  transformInletCss(inletCss: CSSStyleSheet | CSSRule): CSSStyleSheet | null;
}

/** @public */
export const StyleSheet = (function (_super: typeof CssScope) {
  const StyleSheet = _super.extend("StyleSheet", {}) as StyleSheetClass;

  Object.defineProperty(StyleSheet.prototype, "fastenerType", {
    value: StyleSheet,
    enumerable: true,
    configurable: true,
  });

  StyleSheet.prototype.transformInletCss = function (this: StyleSheet, inletCss: CSSStyleSheet | CSSRule): CSSStyleSheet | null {
    if (inletCss instanceof CSSStyleSheet) {
      return inletCss;
    }
    return null;
  };

  StyleSheet.construct = function <F extends StyleSheet<any>>(fastener: F | null, owner: FastenerOwner<F>): F {
    fastener = _super.construct.call(this, fastener, owner) as F;
    return fastener;
  };

  return StyleSheet;
})(CssScope);
