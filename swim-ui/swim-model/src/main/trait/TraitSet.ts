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

import type {Mutable, Proto, ObserverType, ConsumerType} from "@swim/util";
import {Affinity, FastenerFlags, FastenerOwner, Fastener} from "@swim/component";
import type {Model} from "../model/Model";
import type {AnyTrait, Trait} from "./Trait";
import {
  TraitRelationRefinement,
  TraitRelationTemplate,
  TraitRelationClass,
  TraitRelation,
} from "./TraitRelation";

/** @public */
export interface TraitSetRefinement extends TraitRelationRefinement {
}

/** @public */
export type TraitSetTrait<R extends TraitSetRefinement | TraitSet<any, any>, D = Trait> =
  R extends {trait: infer M} ? M :
  R extends {extends: infer E} ? TraitSetTrait<E, D> :
  R extends TraitSet<any, infer M> ? M :
  D;

/** @public */
export interface TraitSetTemplate<T extends Trait = Trait> extends TraitRelationTemplate<T> {
  extends?: Proto<TraitSet<any, any>> | string | boolean | null;
  sorted?: boolean;
}

/** @public */
export interface TraitSetClass<F extends TraitSet<any, any> = TraitSet<any, any>> extends TraitRelationClass<F> {
  /** @override */
  specialize(className: string, template: TraitSetTemplate): TraitSetClass;

  /** @override */
  refine(fastenerClass: TraitSetClass): void;

  /** @override */
  extend(className: string, template: TraitSetTemplate): TraitSetClass<F>;

  /** @override */
  specify<O, T extends Trait = Trait>(className: string, template: ThisType<TraitSet<O, T>> & TraitSetTemplate<T> & Partial<Omit<TraitSet<O, T>, keyof TraitSetTemplate>>): TraitSetClass<F>;

  /** @override */
  <O, T extends Trait = Trait>(template: ThisType<TraitSet<O, T>> & TraitSetTemplate<T> & Partial<Omit<TraitSet<O, T>, keyof TraitSetTemplate>>): PropertyDecorator;

  /** @internal */
  readonly SortedFlag: FastenerFlags;

  /** @internal @override */
  readonly FlagShift: number;
  /** @internal @override */
  readonly FlagMask: FastenerFlags;
}

/** @public */
export type TraitSetDef<O, R extends TraitSetRefinement> =
  TraitSet<O, TraitSetTrait<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer I} ? I : {}) &
  (R extends {implements: infer I} ? I : {}) &
  (R extends {observes: infer B} ? ObserverType<B extends boolean ? TraitSetTrait<R> : B> : {});

/** @public */
export function TraitSetDef<F extends TraitSet<any, any>>(
  template: F extends TraitSetDef<infer O, infer R>
          ? ThisType<TraitSetDef<O, R>>
          & TraitSetTemplate<TraitSetTrait<R>>
          & Partial<Omit<TraitSet<O, TraitSetTrait<R>>, keyof TraitSetTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof TraitSetTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer I} ? Partial<I> : {})
          & (R extends {implements: infer I} ? I : {})
          & (R extends {observes: infer B} ? (ObserverType<B extends boolean ? TraitSetTrait<R> : B> & {observes: boolean}) : {})
          : never
): PropertyDecorator {
  return TraitSet(template);
}

/** @public */
export interface TraitSet<O = unknown, T extends Trait = Trait> extends TraitRelation<O, T> {
  (trait: AnyTrait<T>): O;

  /** @override */
  get fastenerType(): Proto<TraitSet<any, any>>;

  /** @internal @override */
  getSuper(): TraitSet<unknown, T> | null;

  /** @internal @override */
  setDerived(derived: boolean, inlet: TraitSet<unknown, T>): void;

  /** @protected @override */
  willDerive(inlet: TraitSet<unknown, T>): void;

  /** @protected @override */
  onDerive(inlet: TraitSet<unknown, T>): void;

  /** @protected @override */
  didDerive(inlet: TraitSet<unknown, T>): void;

  /** @protected @override */
  willUnderive(inlet: TraitSet<unknown, T>): void;

  /** @protected @override */
  onUnderive(inlet: TraitSet<unknown, T>): void;

  /** @protected @override */
  didUnderive(inlet: TraitSet<unknown, T>): void;

  /** @override */
  readonly inlet: TraitSet<unknown, T> | null;

  /** @protected @override */
  willBindInlet(inlet: TraitSet<unknown, T>): void;

  /** @protected @override */
  onBindInlet(inlet: TraitSet<unknown, T>): void;

  /** @protected @override */
  didBindInlet(inlet: TraitSet<unknown, T>): void;

  /** @protected @override */
  willUnbindInlet(inlet: TraitSet<unknown, T>): void;

  /** @protected @override */
  onUnbindInlet(inlet: TraitSet<unknown, T>): void;

  /** @protected @override */
  didUnbindInlet(inlet: TraitSet<unknown, T>): void;

  /** @internal */
  readonly outlets: ReadonlyArray<TraitSet<unknown, T>> | null;

  /** @internal @override */
  attachOutlet(outlet: TraitSet<unknown, T>): void;

  /** @internal @override */
  detachOutlet(outlet: TraitSet<unknown, T>): void;

  /** @internal */
  readonly traits: {readonly [traitId: number]: T | undefined};

  readonly traitCount: number;

  hasTrait(trait: Trait): boolean;

  addTrait(trait?: AnyTrait<T>, target?: Trait | null, key?: string): T;

  addTraits(traits: {readonly [traitId: number]: T | undefined}, target?: Trait | null): void;

  setTraits(traits: {readonly [traitId: number]: T | undefined}, target?: Trait | null): void;

  attachTrait(trait?: AnyTrait<T>, target?: Trait | null): T;

  attachTraits(traits: {readonly [traitId: number]: T | undefined}, target?: Trait | null): void;

  detachTrait(trait: T): T | null;

  detachTraits(traits?: {readonly [traitId: number]: T | undefined}): void;

  insertTrait(model?: Model | null, trait?: AnyTrait<T>, target?: Trait | null, key?: string): T;

  insertTraits(model: Model | null, traits: {readonly [traitId: number]: T | undefined}, target?: Trait | null): void;

  removeTrait(trait: T): T | null;

  removeTraits(traits?: {readonly [traitId: number]: T | undefined}): void;

  deleteTrait(trait: T): T | null;

  deleteTraits(traits?: {readonly [traitId: number]: T | undefined}): void;

  /** @internal @override */
  bindModel(model: Model, target: Model | null): void;

  /** @internal @override */
  unbindModel(model: Model): void;

  /** @override */
  detectModel(model: Model): T | null;

  /** @internal @override */
  bindTrait(trait: Trait, target: Trait | null): void;

  /** @internal @override */
  unbindTrait(trait: Trait): void;

  /** @override */
  detectTrait(trait: Trait): T | null;

  consumeTraits(consumer: ConsumerType<T>): void;

  unconsumeTraits(consumer: ConsumerType<T>): void;

  /** @internal @protected */
  decohereOutlets(): void;

  /** @internal @protected */
  decohereOutlet(outlet: TraitSet<unknown, T>): void;

  /** @override */
  recohere(t: number): void;

  /** @internal @protected */
  traitKey(trait: T): string | undefined;

  /** @internal */
  initSorted(sorted: boolean): void;

  get sorted(): boolean;

  sort(sorted?: boolean): this;

  /** @protected */
  willSort(parent: Model | null): void;

  /** @protected */
  onSort(parent: Model | null): void;

  /** @protected */
  didSort(parent: Model | null): void;

  /** @internal @protected */
  sortChildren(parent: Model): void;

  /** @internal */
  compareChildren(a: Trait, b: Trait): number;

  /** @internal @protected */
  compare(a: T, b: T): number;
}

/** @public */
export const TraitSet = (function (_super: typeof TraitRelation) {
  const TraitSet = _super.extend("TraitSet", {}) as TraitSetClass;

  Object.defineProperty(TraitSet.prototype, "fastenerType", {
    value: TraitSet,
    configurable: true,
  });

  TraitSet.prototype.onDerive = function (this: TraitSet, inlet: TraitSet): void {
    this.setTraits(inlet.traits);
  };

  TraitSet.prototype.onBindInlet = function <T extends Trait>(this: TraitSet<unknown, T>, inlet: TraitSet<unknown, T>): void {
    (this as Mutable<typeof this>).inlet = inlet;
    _super.prototype.onBindInlet.call(this, inlet);
  };

  TraitSet.prototype.onUnbindInlet = function <T extends Trait>(this: TraitSet<unknown, T>, inlet: TraitSet<unknown, T>): void {
    _super.prototype.onUnbindInlet.call(this, inlet);
    (this as Mutable<typeof this>).inlet = null;
  };

  TraitSet.prototype.attachOutlet = function <T extends Trait>(this: TraitSet<unknown, T>, outlet: TraitSet<unknown, T>): void {
    let outlets = this.outlets as TraitSet<unknown, T>[] | null;
    if (outlets === null) {
      outlets = [];
      (this as Mutable<typeof this>).outlets = outlets;
    }
    outlets.push(outlet);
  };

  TraitSet.prototype.detachOutlet = function <T extends Trait>(this: TraitSet<unknown, T>, outlet: TraitSet<unknown, T>): void {
    const outlets = this.outlets as TraitSet<unknown, T>[] | null;
    if (outlets !== null) {
      const index = outlets.indexOf(outlet);
      if (index >= 0) {
        outlets.splice(index, 1);
      }
    }
  };

  TraitSet.prototype.hasTrait = function (this: TraitSet, trait: Trait): boolean {
    return this.traits[trait.uid] !== void 0;
  };

  TraitSet.prototype.addTrait = function <T extends Trait>(this: TraitSet<unknown, T>, newTrait?: AnyTrait<T>, target?: Trait | null, key?: string): T {
    if (newTrait !== void 0 && newTrait !== null) {
      newTrait = this.fromAny(newTrait);
    } else {
      newTrait = this.createTrait();
    }
    if (target === void 0) {
      target = null;
    }
    let model: Model | null;
    if (this.binds && (model = this.parentModel, model !== null)) {
      if (key === void 0) {
        key = this.traitKey(newTrait);
      }
      this.insertChild(model, newTrait, target, key);
    }
    const traits = this.traits as {[traitId: number]: T | undefined};
    if (traits[newTrait.uid] === void 0) {
      traits[newTrait.uid] = newTrait;
      (this as Mutable<typeof this>).traitCount += 1;
      this.willAttachTrait(newTrait, target);
      this.onAttachTrait(newTrait, target);
      this.initTrait(newTrait);
      this.didAttachTrait(newTrait, target);
      this.setCoherent(true);
      this.decohereOutlets();
    }
    return newTrait;
  };

  TraitSet.prototype.addTraits = function <T extends Trait>(this: TraitSet, newTraits: {readonly [traitId: number]: T | undefined}, target?: Trait | null): void {
    for (const traitId in newTraits) {
      this.addTrait(newTraits[traitId]!, target);
    }
  };

  TraitSet.prototype.setTraits = function <T extends Trait>(this: TraitSet, newTraits: {readonly [traitId: number]: T | undefined}, target?: Trait | null): void {
    const traits = this.traits;
    for (const traitId in traits) {
      if (newTraits[traitId] === void 0) {
        this.detachTrait(traits[traitId]!);
      }
    }
    for (const traitId in newTraits) {
      if (traits[traitId] === void 0) {
        this.attachTrait(newTraits[traitId]!, target);
      }
    }
  };

  TraitSet.prototype.attachTrait = function <T extends Trait>(this: TraitSet<unknown, T>, newTrait?: AnyTrait<T>, target?: Trait | null): T {
    if (newTrait !== void 0 && newTrait !== null) {
      newTrait = this.fromAny(newTrait);
    } else {
      newTrait = this.createTrait();
    }
    const traits = this.traits as {[traitId: number]: T | undefined};
    if (traits[newTrait.uid] === void 0) {
      if (target === void 0) {
        target = null;
      }
      traits[newTrait.uid] = newTrait;
      (this as Mutable<typeof this>).traitCount += 1;
      this.willAttachTrait(newTrait, target);
      this.onAttachTrait(newTrait, target);
      this.initTrait(newTrait);
      this.didAttachTrait(newTrait, target);
      this.setCoherent(true);
      this.decohereOutlets();
    }
    return newTrait;
  };

  TraitSet.prototype.attachTraits = function <T extends Trait>(this: TraitSet, newTraits: {readonly [traitId: number]: T | undefined}, target?: Trait | null): void {
    for (const traitId in newTraits) {
      this.attachTrait(newTraits[traitId]!, target);
    }
  };

  TraitSet.prototype.detachTrait = function <T extends Trait>(this: TraitSet<unknown, T>, oldTrait: T): T | null {
    const traits = this.traits as {[traitId: number]: T | undefined};
    if (traits[oldTrait.uid] !== void 0) {
      (this as Mutable<typeof this>).traitCount -= 1;
      delete traits[oldTrait.uid];
      this.willDetachTrait(oldTrait);
      this.onDetachTrait(oldTrait);
      this.deinitTrait(oldTrait);
      this.didDetachTrait(oldTrait);
      this.setCoherent(true);
      this.decohereOutlets();
      return oldTrait;
    }
    return null;
  };

  TraitSet.prototype.detachTraits = function <T extends Trait>(this: TraitSet<unknown, T>, traits?: {readonly [traitId: number]: T | undefined}): void {
    if (traits === void 0) {
      traits = this.traits;
    }
    for (const traitId in traits) {
      this.detachTrait(traits[traitId]!);
    }
  };

  TraitSet.prototype.insertTrait = function <T extends Trait>(this: TraitSet<unknown, T>, model?: Model | null, newTrait?: AnyTrait<T>, target?: Trait | null, key?: string): T {
    if (newTrait !== void 0 && newTrait !== null) {
      newTrait = this.fromAny(newTrait);
    } else {
      newTrait = this.createTrait();
    }
    if (model === void 0 || model === null) {
      model = this.parentModel;
    }
    if (target === void 0) {
      target = null;
    }
    if (key === void 0) {
      key = this.traitKey(newTrait);
    }
    if (model !== null && (newTrait.model !== model || newTrait.key !== key)) {
      this.insertChild(model, newTrait, target, key);
    }
    const traits = this.traits as {[traitId: number]: T | undefined};
    if (traits[newTrait.uid] === void 0) {
      traits[newTrait.uid] = newTrait;
      (this as Mutable<typeof this>).traitCount += 1;
      this.willAttachTrait(newTrait, target);
      this.onAttachTrait(newTrait, target);
      this.initTrait(newTrait);
      this.didAttachTrait(newTrait, target);
      this.setCoherent(true);
      this.decohereOutlets();
    }
    return newTrait;
  };

  TraitSet.prototype.insertTraits = function <T extends Trait>(this: TraitSet, model: Model | null, newTraits: {readonly [traitId: number]: T | undefined}, target?: Trait | null): void {
    for (const traitId in newTraits) {
      this.insertTrait(model, newTraits[traitId]!, target);
    }
  };

  TraitSet.prototype.removeTrait = function <T extends Trait>(this: TraitSet<unknown, T>, trait: T): T | null {
    if (this.hasTrait(trait)) {
      trait.remove();
      return trait;
    }
    return null;
  };

  TraitSet.prototype.removeTraits = function <T extends Trait>(this: TraitSet<unknown, T>, traits?: {readonly [traitId: number]: T | undefined}): void {
    if (traits === void 0) {
      traits = this.traits;
    }
    for (const traitId in traits) {
      this.removeTrait(traits[traitId]!);
    }
  };

  TraitSet.prototype.deleteTrait = function <T extends Trait>(this: TraitSet<unknown, T>, trait: T): T | null {
    const oldTrait = this.detachTrait(trait);
    if (oldTrait !== null) {
      oldTrait.remove();
    }
    return oldTrait;
  };

  TraitSet.prototype.deleteTraits = function <T extends Trait>(this: TraitSet<unknown, T>, traits?: {readonly [traitId: number]: T | undefined}): void {
    if (traits === void 0) {
      traits = this.traits;
    }
    for (const traitId in traits) {
      this.deleteTrait(traits[traitId]!);
    }
  };

  TraitSet.prototype.bindModel = function <T extends Trait>(this: TraitSet<unknown, T>, model: Model, target: Model | null): void {
    if (this.binds) {
      const newTrait = this.detectModel(model);
      const traits = this.traits as {[traitId: number]: T | undefined};
      if (newTrait !== null && traits[newTrait.uid] === void 0) {
        traits[newTrait.uid] = newTrait;
        (this as Mutable<typeof this>).traitCount += 1;
        this.willAttachTrait(newTrait, null);
        this.onAttachTrait(newTrait, null);
        this.initTrait(newTrait);
        this.didAttachTrait(newTrait, null);
        this.setCoherent(true);
        this.decohereOutlets();
      }
    }
  };

  TraitSet.prototype.unbindModel = function <T extends Trait>(this: TraitSet<unknown, T>, model: Model): void {
    if (this.binds) {
      const oldTrait = this.detectModel(model);
      const traits = this.traits as {[traitId: number]: T | undefined};
      if (oldTrait !== null && traits[oldTrait.uid] !== void 0) {
        (this as Mutable<typeof this>).traitCount -= 1;
        delete traits[oldTrait.uid];
        this.willDetachTrait(oldTrait);
        this.onDetachTrait(oldTrait);
        this.deinitTrait(oldTrait);
        this.didDetachTrait(oldTrait);
        this.setCoherent(true);
        this.decohereOutlets();
      }
    }
  };

  TraitSet.prototype.detectModel = function <T extends Trait>(this: TraitSet<unknown, T>, model: Model): T | null {
    return null;
  };

  TraitSet.prototype.bindTrait = function <T extends Trait>(this: TraitSet<unknown, T>, trait: Trait, target: Trait | null): void {
    if (this.binds) {
      const newTrait = this.detectTrait(trait);
      const traits = this.traits as {[traitId: number]: T | undefined};
      if (newTrait !== null && traits[newTrait.uid] === void 0) {
        traits[newTrait.uid] = newTrait;
        (this as Mutable<typeof this>).traitCount += 1;
        this.willAttachTrait(newTrait, target);
        this.onAttachTrait(newTrait, target);
        this.initTrait(newTrait);
        this.didAttachTrait(newTrait, target);
        this.setCoherent(true);
        this.decohereOutlets();
      }
    }
  };

  TraitSet.prototype.unbindTrait = function <T extends Trait>(this: TraitSet<unknown, T>, trait: Trait): void {
    if (this.binds) {
      const oldTrait = this.detectTrait(trait);
      const traits = this.traits as {[traitId: number]: T | undefined};
      if (oldTrait !== null && traits[oldTrait.uid] !== void 0) {
        (this as Mutable<typeof this>).traitCount -= 1;
        delete traits[oldTrait.uid];
        this.willDetachTrait(oldTrait);
        this.onDetachTrait(oldTrait);
        this.deinitTrait(oldTrait);
        this.didDetachTrait(oldTrait);
        this.setCoherent(true);
        this.decohereOutlets();
      }
    }
  };

  TraitSet.prototype.detectTrait = function <T extends Trait>(this: TraitSet<unknown, T>, trait: Trait): T | null {
    if (typeof this.traitType === "function" && trait instanceof this.traitType) {
      return trait as T;
    }
    return null;
  };

  TraitSet.prototype.consumeTraits = function <T extends Trait>(this: TraitSet<unknown, T>, consumer: ConsumerType<T>): void {
    const traits = this.traits;
    for (const traitId in traits) {
      const trait = traits[traitId]!;
      trait.consume(consumer);
    }
  };

  TraitSet.prototype.unconsumeTraits = function <T extends Trait>(this: TraitSet<unknown, T>, consumer: ConsumerType<T>): void {
    const traits = this.traits;
    for (const traitId in traits) {
      const trait = traits[traitId]!;
      trait.unconsume(consumer);
    }
  };

  TraitSet.prototype.detachTraits = function <T extends Trait>(this: TraitSet<unknown, T>, traits?: {readonly [traitId: number]: T | undefined}): void {
    if (traits === void 0) {
      traits = this.traits;
    }
    for (const traitId in traits) {
      this.detachTrait(traits[traitId]!);
    }
  };

  TraitSet.prototype.decohereOutlets = function (this: TraitSet): void {
    const outlets = this.outlets;
    for (let i = 0, n = outlets !== null ? outlets.length : 0; i < n; i += 1) {
      this.decohereOutlet(outlets![i]!);
    }
  };

  TraitSet.prototype.decohereOutlet = function (this: TraitSet, outlet: TraitSet): void {
    if ((outlet.flags & Fastener.DerivedFlag) === 0 && Math.min(this.flags & Affinity.Mask, Affinity.Intrinsic) >= (outlet.flags & Affinity.Mask)) {
      outlet.setDerived(true, this);
    } else if ((outlet.flags & Fastener.DerivedFlag) !== 0 && (outlet.flags & Fastener.DecoherentFlag) === 0) {
      outlet.setCoherent(false);
      outlet.decohere();
    }
  };

  TraitSet.prototype.recohere = function (this: TraitSet, t: number): void {
    if ((this.flags & Fastener.DerivedFlag) !== 0) {
      const inlet = this.inlet;
      if (inlet !== null) {
        this.setTraits(inlet.traits);
      }
    }
  };

  TraitSet.prototype.traitKey = function <T extends Trait>(this: TraitSet<unknown, T>, trait: T): string | undefined {
    return void 0;
  };

  TraitSet.prototype.initSorted = function (this: TraitSet, sorted: boolean): void {
    if (sorted) {
      (this as Mutable<typeof this>).flags = this.flags | TraitSet.SortedFlag;
    } else {
      (this as Mutable<typeof this>).flags = this.flags & ~TraitSet.SortedFlag;
    }
  };

  Object.defineProperty(TraitSet.prototype, "sorted", {
    get(this: TraitSet): boolean {
      return (this.flags & TraitSet.SortedFlag) !== 0;
    },
    configurable: true,
  });

  TraitSet.prototype.sort = function (this: TraitSet, sorted?: boolean): typeof this {
    if (sorted === void 0) {
      sorted = true;
    }
    const flags = this.flags;
    if (sorted && (flags & TraitSet.SortedFlag) === 0) {
      const parent = this.parentModel;
      this.willSort(parent);
      this.setFlags(flags | TraitSet.SortedFlag);
      this.onSort(parent);
      this.didSort(parent);
    } else if (!sorted && (flags & TraitSet.SortedFlag) !== 0) {
      this.setFlags(flags & ~TraitSet.SortedFlag);
    }
    return this;
  };

  TraitSet.prototype.willSort = function (this: TraitSet, parent: Model | null): void {
    // hook
  };

  TraitSet.prototype.onSort = function (this: TraitSet, parent: Model | null): void {
    if (parent !== null) {
      this.sortChildren(parent);
    }
  };

  TraitSet.prototype.didSort = function (this: TraitSet, parent: Model | null): void {
    // hook
  };

  TraitSet.prototype.sortChildren = function <T extends Trait>(this: TraitSet<unknown, T>, parent: Model): void {
    parent.sortTraits(this.compareChildren.bind(this));
  };

  TraitSet.prototype.compareChildren = function <T extends Trait>(this: TraitSet<unknown, T>, a: Trait, b: Trait): number {
    const traits = this.traits;
    const x = traits[a.uid];
    const y = traits[b.uid];
    if (x !== void 0 && y !== void 0) {
      return this.compare(x, y);
    } else {
      return x !== void 0 ? 1 : y !== void 0 ? -1 : 0;
    }
  };

  TraitSet.prototype.compare = function <T extends Trait>(this: TraitSet<unknown, T>, a: T, b: T): number {
    return a.uid < b.uid ? -1 : a.uid > b.uid ? 1 : 0;
  };

  TraitSet.construct = function <F extends TraitSet<any, any>>(fastener: F | null, owner: FastenerOwner<F>): F {
    if (fastener === null) {
      fastener = function (newTrait: AnyTrait<TraitSetTrait<F>>): FastenerOwner<F> {
        fastener!.addTrait(newTrait);
        return fastener!.owner;
      } as F;
      delete (fastener as Partial<Mutable<F>>).name; // don't clobber prototype name
      Object.setPrototypeOf(fastener, this.prototype);
    }
    fastener = _super.construct.call(this, fastener, owner) as F;
    const flagsInit = fastener.flagsInit;
    if (flagsInit !== void 0) {
      fastener.initSorted((flagsInit & TraitSet.SortedFlag) !== 0);
    }
    Object.defineProperty(fastener, "inlet", { // override getter
      value: null,
      writable: true,
      enumerable: true,
      configurable: true,
    });
    (fastener as Mutable<typeof fastener>).outlets = null;
    (fastener as Mutable<typeof fastener>).traits = {};
    (fastener as Mutable<typeof fastener>).traitCount = 0;
    return fastener;
  };

  TraitSet.refine = function (fastenerClass: TraitSetClass): void {
    _super.refine.call(this, fastenerClass);
    const fastenerPrototype = fastenerClass.prototype;
    let flagsInit = fastenerPrototype.flagsInit;

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "sorted")) {
      if (flagsInit === void 0) {
        flagsInit = 0;
      }
      if (fastenerPrototype.sorted) {
        flagsInit |= TraitSet.SortedFlag;
      } else {
        flagsInit &= ~TraitSet.SortedFlag;
      }
      delete (fastenerPrototype as TraitSetTemplate).sorted;
    }

    if (flagsInit !== void 0) {
      Object.defineProperty(fastenerPrototype, "flagsInit", {
        value: flagsInit,
        configurable: true,
      });
    }
  };

  (TraitSet as Mutable<typeof TraitSet>).SortedFlag = 1 << (_super.FlagShift + 0);

  (TraitSet as Mutable<typeof TraitSet>).FlagShift = _super.FlagShift + 1;
  (TraitSet as Mutable<typeof TraitSet>).FlagMask = (1 << TraitSet.FlagShift) - 1;

  return TraitSet;
})(TraitRelation);
