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

import type {Mutable} from "@swim/util";
import type {Proto} from "@swim/util";
import type {AnyTiming} from "@swim/util";
import {Affinity} from "@swim/component";
import type {FastenerDescriptor} from "@swim/component";
import type {FastenerClass} from "@swim/component";
import {Fastener} from "@swim/component";
import type {MoodVector} from "@swim/theme";
import type {ThemeMatrix} from "@swim/theme";

/** @public */
export interface CssScopeDescriptor<S extends CSSStyleSheet | CSSRule = CSSStyleSheet | CSSRule> extends FastenerDescriptor {
  extends?: Proto<CssScope<any, any>> | boolean | null;
}

/** @public */
export interface CssScope<O = unknown, S extends CSSStyleSheet | CSSRule = CSSStyleSheet | CSSRule> extends Fastener<O> {
  /** @override */
  get descriptorType(): Proto<CssScopeDescriptor<S>>;

  /** @override */
  get fastenerType(): Proto<CssScope<any>>;

  /** @internal @override */
  setDerived(derived: boolean, inlet: CssScope): void;

  /** @protected @override */
  willDerive(inlet: CssScope): void;

  /** @protected @override */
  onDerive(inlet: CssScope): void;

  /** @protected @override */
  didDerive(inlet: CssScope): void;

  /** @protected @override */
  willUnderive(inlet: CssScope): void;

  /** @protected @override */
  onUnderive(inlet: CssScope): void;

  /** @protected @override */
  didUnderive(inlet: CssScope): void;

  /** @override */
  get parent(): CssScope | null;

  /** @override */
  readonly inlet: CssScope | null;

  /** @override */
  bindInlet(inlet: CssScope): void;

  /** @protected @override */
  willBindInlet(inlet: CssScope): void;

  /** @protected @override */
  onBindInlet(inlet: CssScope): void;

  /** @protected @override */
  didBindInlet(inlet: CssScope): void;

  /** @protected @override */
  willUnbindInlet(inlet: CssScope): void;

  /** @protected @override */
  onUnbindInlet(inlet: CssScope): void;

  /** @protected @override */
  didUnbindInlet(inlet: CssScope): void;

  /** @internal */
  readonly outlets: readonly CssScope[] | null;

  /** @internal @override */
  attachOutlet(outlet: CssScope): void;

  /** @internal @override */
  detachOutlet(outlet: CssScope): void;

  getOutletCss(outlet: CssScope): CSSStyleSheet | CSSRule | null;

  get inletCss(): CSSStyleSheet | CSSRule | null;

  getInletCss(): CSSStyleSheet | CSSRule;

  transformInletCss(inletCss: CSSStyleSheet | CSSRule | null): S | null;

  readonly css: S | null;

  getCss(): S;

  setCss(css: S | null): S | null;

  attachCss(css: S): S;

  /** @protected */
  initCss(css: S): void;

  /** @protected */
  willAttachCss(css: S): void;

  /** @protected */
  onAttachCss(css: S): void;

  /** @protected */
  didAttachCss(css: S): void;

  detachCss(): S | null;

  /** @protected */
  deinitCss(css: S): void;

  /** @protected */
  willDetachCss(css: S): void;

  /** @protected */
  onDetachCss(css: S): void;

  /** @protected */
  didDetachCss(css: S): void;

  applyTheme(theme: ThemeMatrix, mood: MoodVector, timing?: AnyTiming | boolean | null): void;

  /** @internal @protected */
  decohereOutlets(): void;

  /** @internal @protected */
  decohereOutlet(outlet: CssScope): void;

  /** @override */
  recohere(t: number): void;
}

/** @public */
export const CssScope = (function (_super: typeof Fastener) {
  const CssScope = _super.extend("CssScope", {}) as FastenerClass<CssScope<any, any>>;

  Object.defineProperty(CssScope.prototype, "fastenerType", {
    value: CssScope,
    enumerable: true,
    configurable: true,
  });

  CssScope.prototype.onDerive = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>, inlet: CssScope): void {
    const inletCss = this.transformInletCss(inlet.getOutletCss(this));
    this.setCss(inletCss);
  };

  CssScope.prototype.attachOutlet = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>, outlet: CssScope): void {
    let outlets = this.outlets as CssScope[] | null;
    if (outlets === null) {
      outlets = [];
      (this as Mutable<typeof this>).outlets = outlets;
    }
    outlets.push(outlet);
  };

  CssScope.prototype.detachOutlet = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>, outlet: CssScope): void {
    const outlets = this.outlets as CssScope[] | null;
    if (outlets === null) {
      return;
    }
    const index = outlets.indexOf(outlet);
    if (index < 0) {
      return;
    }
    outlets.splice(index, 1);
  };

  CssScope.prototype.getOutletCss = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>, outlet: CssScope): CSSStyleSheet | CSSRule | null {
    return this.css;
  };

  Object.defineProperty(CssScope.prototype, "inletCss", {
    get: function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>): CSSStyleSheet | CSSRule | null {
      const inlet = this.inlet;
      return inlet !== null ? inlet.getOutletCss(this) : null;
    },
    enumerable: true,
    configurable: true,
  });

  CssScope.prototype.getInletCss = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>): CSSStyleSheet | CSSRule {
    const inletCss = this.inletCss;
    if (inletCss === void 0 || inletCss === null) {
      let message = inletCss + " ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "inlet css";
      throw new TypeError(message);
    }
    return inletCss;
  };

  CssScope.prototype.transformInletCss = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>, inletCss: CSSStyleSheet | CSSRule | null): S | null {
    return null;
  };

  CssScope.prototype.getCss = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>): S {
    const css = this.css;
    if (css === null) {
      let message = css + " ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "css";
      throw new TypeError(message);
    }
    return css;
  };

  CssScope.prototype.setCss = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>, newCss: S  | null): S | null {
    const oldCss = this.css;
    if (oldCss === newCss) {
      this.setCoherent(true);
      return oldCss;
    }
    if (oldCss !== null) {
      (this as Mutable<typeof this>).css = null;
      this.willDetachCss(oldCss);
      this.onDetachCss(oldCss);
      this.deinitCss(oldCss);
      this.didDetachCss(oldCss);
    }
    if (newCss !== null) {
      (this as Mutable<typeof this>).css = newCss;
      this.willAttachCss(newCss);
      this.onAttachCss(newCss);
      this.initCss(newCss);
      this.didAttachCss(newCss);
    }
    this.setCoherent(true);
    this.decohereOutlets();
    return oldCss;
  };

  CssScope.prototype.attachCss = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>, newCss: S): S {
    const oldCss = this.css;
    if (oldCss === newCss) {
      return newCss;
    }
    if (oldCss !== null) {
      (this as Mutable<typeof this>).css = null;
      this.willDetachCss(oldCss);
      this.onDetachCss(oldCss);
      this.deinitCss(oldCss);
      this.didDetachCss(oldCss);
    }
    (this as Mutable<typeof this>).css = newCss;
    this.willAttachCss(newCss);
    this.onAttachCss(newCss);
    this.initCss(newCss);
    this.didAttachCss(newCss);
    this.setCoherent(true);
    this.decohereOutlets();
    return newCss;
  };

  CssScope.prototype.initCss = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>, css: S): void {
    // hook
  };

  CssScope.prototype.willAttachCss = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>, css: S): void {
    // hook
  };

  CssScope.prototype.onAttachCss = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>, css: S): void {
    // hook
  };

  CssScope.prototype.didAttachCss = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>, css: S): void {
    // hook
  };

  CssScope.prototype.detachCss = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>): S | null {
    const oldCss = this.css;
    if (oldCss === null) {
      return oldCss;
    }
    (this as Mutable<typeof this>).css = null;
    this.willDetachCss(oldCss);
    this.onDetachCss(oldCss);
    this.deinitCss(oldCss);
    this.didDetachCss(oldCss);
    this.setCoherent(true);
    this.decohereOutlets();
    return oldCss;
  };

  CssScope.prototype.deinitCss = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>, css: S): void {
    // hook
  };

  CssScope.prototype.willDetachCss = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>, css: S): void {
    // hook
  };

  CssScope.prototype.onDetachCss = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>, css: S): void {
    // hook
  };

  CssScope.prototype.didDetachCss = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>, css: S): void {
    // hook
  };

  CssScope.prototype.applyTheme = function (this: CssScope, theme: ThemeMatrix, mood: MoodVector, timing?: AnyTiming | boolean | null): void {
    const outlets = this.outlets;
    for (let i = 0, n = outlets !== null ? outlets.length : 0; i < n; i += 1) {
      const outlet = outlets![i]!;
      if (outlet instanceof CssScope) {
        outlet.applyTheme(theme, mood, timing);
      }
    }
  };

  CssScope.prototype.decohereOutlets = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>): void {
    const outlets = this.outlets;
    for (let i = 0, n = outlets !== null ? outlets.length : 0; i < n; i += 1) {
      this.decohereOutlet(outlets![i]!);
    }
  };

  CssScope.prototype.decohereOutlet = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>, outlet: CssScope<unknown, S>): void {
    if ((outlet.flags & Fastener.DerivedFlag) === 0 && Math.min(this.flags & Affinity.Mask, Affinity.Intrinsic) >= (outlet.flags & Affinity.Mask)) {
      outlet.setDerived(true, this);
    } else if ((outlet.flags & Fastener.DerivedFlag) !== 0 && (outlet.flags & Fastener.DecoherentFlag) === 0) {
      outlet.setCoherent(false);
      outlet.decohere();
    }
  };

  CssScope.prototype.recohere = function <S extends CSSStyleSheet | CSSRule>(this: CssScope<unknown, S>, t: number): void {
    let inlet: CssScope | null;
    if ((this.flags & Fastener.DerivedFlag) === 0 || (inlet = this.inlet) === null) {
      return;
    }
    const inletCss = inlet.getOutletCss(this);
    if (inletCss !== null && this.css === null) {
      this.setCss(this.transformInletCss(inletCss));
    } else if (inletCss === null && this.css !== null) {
      this.setCss(null);
    } else {
      this.setCoherent(true);
    }
  };

  CssScope.construct = function <F extends CssScope<any, any>>(fastener: F | null, owner: F extends CssScope<infer O, any> ? O : never): F {
    fastener = _super.construct.call(this, fastener, owner) as F;
    (fastener as Mutable<typeof fastener>).outlets = null;
    (fastener as Mutable<typeof fastener>).css = null;
    return fastener;
  };

  return CssScope;
})(Fastener);
