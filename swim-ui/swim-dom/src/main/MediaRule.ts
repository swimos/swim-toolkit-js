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
import type {CssRuleDescriptor} from "./CssRule";
import type {CssRuleClass} from "./CssRule";
import {CssRule} from "./CssRule";

/** @public */
export interface MediaRuleDescriptor extends CssRuleDescriptor<CSSMediaRule> {
  extends?: Proto<MediaRule<any>> | boolean | null;
}

/** @public */
export interface MediaRuleClass<F extends MediaRule<any> = MediaRule<any>> extends CssRuleClass<F> {
}

/** @public */
export interface MediaRule<O = unknown> extends CssRule<O, CSSMediaRule> {
  /** @override */
  get descriptorType(): Proto<MediaRuleDescriptor>;

  /** @override */
  get fastenerType(): Proto<MediaRule<any>>;

  /** @override */
  transformInletCss(inletCss: CSSStyleSheet | CSSRule | null): CSSMediaRule | null;

  /** @override */
  createRule(inletCss: CSSStyleSheet | CSSGroupingRule): CSSMediaRule | null;

  get selector(): string;
}

/** @public */
export const MediaRule = (function (_super: typeof CssRule) {
  const MediaRule = _super.extend("MediaRule", {}) as MediaRuleClass;

  Object.defineProperty(MediaRule.prototype, "fastenerType", {
    value: MediaRule,
    enumerable: true,
    configurable: true,
  });

  MediaRule.prototype.transformInletCss = function (this: MediaRule, inletCss: CSSStyleSheet | CSSRule | null): CSSMediaRule | null {
    if (inletCss instanceof CSSMediaRule) {
      return inletCss;
    } else if (inletCss instanceof CSSStyleSheet || inletCss instanceof CSSGroupingRule) {
      return this.createRule(inletCss);
    }
    return null;
  };

  MediaRule.prototype.createRule = function (this: MediaRule, inletCss: CSSStyleSheet | CSSGroupingRule): CSSMediaRule | null {
    const index = inletCss.insertRule(this.cssText);
    const rule = inletCss.cssRules.item(index);
    if (!(rule instanceof CSSMediaRule)) {
      throw new TypeError("not a media rule: " + rule);
    }
    return rule;
  };

  Object.defineProperty(MediaRule.prototype, "selector", {
    value: "@media",
    enumerable: true,
    configurable: true,
  });

  MediaRule.construct = function <F extends MediaRule<any>>(fastener: F | null, owner: F extends MediaRule<infer O> ? O : never): F {
    fastener = _super.construct.call(this, fastener, owner) as F;
    return fastener;
  };

  return MediaRule;
})(CssRule);
