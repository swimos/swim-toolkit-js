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
import type {Observes} from "@swim/util";
import type {Consumer} from "@swim/util";
import type {Consumable} from "@swim/util";
import type {FastenerFlags} from "@swim/component";
import type {FastenerDescriptor} from "@swim/component";
import type {FastenerClass} from "@swim/component";
import {Fastener} from "@swim/component";
import {Model} from "./Model";
import type {AnyTrait} from "./Trait";
import type {TraitFactory} from "./Trait";
import {Trait} from "./Trait";

/** @public */
export interface TraitRelationDescriptor<T extends Trait = Trait> extends FastenerDescriptor {
  extends?: Proto<TraitRelation<any, any>> | boolean | null;
  traitType?: TraitFactory<T>;
  binds?: boolean;
  observes?: boolean;
  consumed?: boolean;
}

/** @public */
export interface TraitRelation<O = unknown, T extends Trait = Trait> extends Fastener<O>, Consumable {
  /** @override */
  get descriptorType(): Proto<TraitRelationDescriptor<T>>;

  /** @override */
  get fastenerType(): Proto<TraitRelation<any, any>>;

  /** @protected */
  readonly consumed?: boolean; // optional prototype property

  /** @internal */
  readonly observes?: boolean; // optional prototype property

  /** @internal @override */
  setDerived(derived: boolean, inlet: TraitRelation<unknown, T>): void;

  /** @protected @override */
  willDerive(inlet: TraitRelation<unknown, T>): void;

  /** @protected @override */
  onDerive(inlet: TraitRelation<unknown, T>): void;

  /** @protected @override */
  didDerive(inlet: TraitRelation<unknown, T>): void;

  /** @protected @override */
  willUnderive(inlet: TraitRelation<unknown, T>): void;

  /** @protected @override */
  onUnderive(inlet: TraitRelation<unknown, T>): void;

  /** @protected @override */
  didUnderive(inlet: TraitRelation<unknown, T>): void;

  /** @override */
  get parent(): TraitRelation<unknown, T> | null;

  /** @override */
  readonly inlet: TraitRelation<unknown, T> | null;

  /** @override */
  bindInlet(inlet: TraitRelation<unknown, T>): void;

  /** @protected @override */
  willBindInlet(inlet: TraitRelation<unknown, T>): void;

  /** @protected @override */
  onBindInlet(inlet: TraitRelation<unknown, T>): void;

  /** @protected @override */
  didBindInlet(inlet: TraitRelation<unknown, T>): void;

  /** @protected @override */
  willUnbindInlet(inlet: TraitRelation<unknown, T>): void;

  /** @protected @override */
  onUnbindInlet(inlet: TraitRelation<unknown, T>): void;

  /** @protected @override */
  didUnbindInlet(inlet: TraitRelation<unknown, T>): void;

  /** @internal */
  readonly outlets: ReadonlyArray<TraitRelation<unknown, T>> | null;

  /** @internal @override */
  attachOutlet(outlet: TraitRelation<unknown, T>): void;

  /** @internal @override */
  detachOutlet(outlet: TraitRelation<unknown, T>): void;

  /** @internal */
  readonly traitType?: TraitFactory<T>; // optional prototype property

  /** @protected */
  initTrait(trait: T): void;

  /** @protected */
  willAttachTrait(trait: T, target: Trait | null): void;

  /** @protected */
  onAttachTrait(trait: T, target: Trait | null): void;

  /** @protected */
  didAttachTrait(trait: T, target: Trait | null): void;

  /** @protected */
  deinitTrait(trait: T): void;

  /** @protected */
  willDetachTrait(trait: T): void;

  /** @protected */
  onDetachTrait(trait: T): void;

  /** @protected */
  didDetachTrait(trait: T): void;

  /** @internal @protected */
  get parentModel(): Model | null;

  /** @internal @protected */
  insertChild(model: Model, trait: T, target: Trait | null, key: string | undefined): void;

  /** @internal */
  bindModel(model: Model, targetModel: Model | null): void;

  /** @internal */
  unbindModel(model: Model): void;

  detectModel(model: Model): T | null;

  /** @internal */
  bindTrait(trait: Trait, target: Trait | null): void;

  /** @internal */
  unbindTrait(trait: Trait): void;

  detectTrait(trait: Trait): T | null;

  createTrait(): T;

  /** @internal @protected */
  fromAny(value: AnyTrait<T>): T;

  /** @internal */
  readonly consumers: ReadonlySet<Consumer> | null;

  /** @override */
  consume(consumer: Consumer): void

  /** @protected */
  willConsume(consumer: Consumer): void;

  /** @protected */
  onConsume(consumer: Consumer): void;

  /** @protected */
  didConsume(consumer: Consumer): void;

  /** @override */
  unconsume(consumer: Consumer): void

  /** @protected */
  willUnconsume(consumer: Consumer): void;

  /** @protected */
  onUnconsume(consumer: Consumer): void;

  /** @protected */
  didUnconsume(consumer: Consumer): void;

  get consuming(): boolean;

  /** @internal */
  startConsuming(): void;

  /** @protected */
  willStartConsuming(): void;

  /** @protected */
  onStartConsuming(): void;

  /** @protected */
  didStartConsuming(): void;

  /** @internal */
  stopConsuming(): void;

  /** @protected */
  willStopConsuming(): void;

  /** @protected */
  onStopConsuming(): void;

  /** @protected */
  didStopConsuming(): void;

  /** @protected @override */
  onMount(): void;

  /** @protected @override */
  onUnmount(): void;
}

/** @public */
export const TraitRelation = (function (_super: typeof Fastener) {
  const TraitRelation = _super.extend("TraitRelation", {}) as FastenerClass<TraitRelation<any, any>> & {
    /** @internal */
    readonly ConsumingFlag: FastenerFlags;

    /** @internal @override */
    readonly FlagShift: number;
    /** @internal @override */
    readonly FlagMask: FastenerFlags;
  };

  Object.defineProperty(TraitRelation.prototype, "fastenerType", {
    value: TraitRelation,
    enumerable: true,
    configurable: true,
  });

  TraitRelation.prototype.attachOutlet = function <T extends Trait>(this: TraitRelation<unknown, T>, outlet: TraitRelation<unknown, T>): void {
    let outlets = this.outlets as TraitRelation<unknown, T>[] | null;
    if (outlets === null) {
      outlets = [];
      (this as Mutable<typeof this>).outlets = outlets;
    }
    outlets.push(outlet);
  };

  TraitRelation.prototype.detachOutlet = function <T extends Trait>(this: TraitRelation<unknown, T>, outlet: TraitRelation<unknown, T>): void {
    const outlets = this.outlets as TraitRelation<unknown, T>[] | null;
    if (outlets === null) {
      return;
    }
    const index = outlets.indexOf(outlet);
    if (index < 0) {
      return;
    }
    outlets.splice(index, 1);
  };

  TraitRelation.prototype.initTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: T): void {
    // hook
  };

  TraitRelation.prototype.willAttachTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: T, target: Trait | null): void {
    // hook
  };

  TraitRelation.prototype.onAttachTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: T, target: Trait | null): void {
    if (this.observes === true) {
      trait.observe(this as Observes<T>);
    }
    if ((this.flags & TraitRelation.ConsumingFlag) !== 0) {
      trait.consume(this);
    }
  };

  TraitRelation.prototype.didAttachTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: T, target: Trait | null): void {
    // hook
  };

  TraitRelation.prototype.deinitTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: T): void {
    // hook
  };

  TraitRelation.prototype.willDetachTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: T): void {
    // hook
  };

  TraitRelation.prototype.onDetachTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: T): void {
    if ((this.flags & TraitRelation.ConsumingFlag) !== 0) {
      trait.unconsume(this);
    }
    if (this.observes === true) {
      trait.unobserve(this as Observes<T>);
    }
  };

  TraitRelation.prototype.didDetachTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: T): void {
    // hook
  };

  Object.defineProperty(TraitRelation.prototype, "parentModel", {
    get(this: TraitRelation): Model | null {
      const owner = this.owner;
      if (owner instanceof Model) {
        return owner;
      } else if (owner instanceof Trait) {
        return owner.model;
      } else {
        return null;
      }
    },
    enumerable: true,
    configurable: true,
  });

  TraitRelation.prototype.insertChild = function <T extends Trait>(this: TraitRelation<unknown, T>, model: Model, trait: T, target: Trait | null, key: string | undefined): void {
    model.insertTrait(trait, target, key);
  };

  TraitRelation.prototype.bindModel = function <T extends Trait>(this: TraitRelation<unknown, T>, model: Model, targetModel: Model | null): void {
    // hook
  };

  TraitRelation.prototype.unbindModel = function <T extends Trait>(this: TraitRelation<unknown, T>, model: Model): void {
    // hook
  };

  TraitRelation.prototype.detectModel = function <T extends Trait>(this: TraitRelation<unknown, T>, model: Model): T | null {
    return null;
  };

  TraitRelation.prototype.bindTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: Trait, target: Trait | null): void {
    // hook
  };

  TraitRelation.prototype.unbindTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: Trait): void {
    // hook
  };

  TraitRelation.prototype.detectTrait = function <T extends Trait>(this: TraitRelation<unknown, T>, trait: Trait): T | null {
    return null;
  };

  TraitRelation.prototype.createTrait = function <T extends Trait>(this: TraitRelation<unknown, T>): T {
    let trait: T | undefined;
    const traitType = this.traitType;
    if (traitType !== void 0) {
      trait = traitType.create();
    }
    if (trait === void 0 || trait === null) {
      let message = "Unable to create ";
      const name = this.name.toString();
      if (name.length !== 0) {
        message += name + " ";
      }
      message += "trait";
      throw new Error(message);
    }
    return trait;
  };

  TraitRelation.prototype.fromAny = function <T extends Trait>(this: TraitRelation<unknown, T>, value: AnyTrait<T>): T {
    const traitType = this.traitType;
    if (traitType !== void 0) {
      return traitType.fromAny(value);
    } else {
      return Trait.fromAny(value) as T;
    }
  };

  TraitRelation.prototype.consume = function (this: TraitRelation, consumer: Consumer): void {
    let consumers = this.consumers as Set<Consumer> | null;
    if (consumers === null) {
      consumers = new Set<Consumer>();
      (this as Mutable<typeof this>).consumers = consumers;
    } else if (consumers.has(consumer)) {
      return;
    }
    this.willConsume(consumer);
    consumers.add(consumer);
    this.onConsume(consumer);
    this.didConsume(consumer);
    if (consumers.size === 1 && this.mounted) {
      this.startConsuming();
    }
  };

  TraitRelation.prototype.willConsume = function (this: TraitRelation, consumer: Consumer): void {
    // hook
  };

  TraitRelation.prototype.onConsume = function (this: TraitRelation, consumer: Consumer): void {
    // hook
  };

  TraitRelation.prototype.didConsume = function (this: TraitRelation, consumer: Consumer): void {
    // hook
  };

  TraitRelation.prototype.unconsume = function (this: TraitRelation, consumer: Consumer): void {
    const consumers = this.consumers as Set<Consumer> | null;
    if (consumers === null || !consumers.has(consumer)) {
      return;
    }
    this.willUnconsume(consumer);
    consumers.delete(consumer);
    this.onUnconsume(consumer);
    this.didUnconsume(consumer);
    if (consumers.size === 0) {
      this.stopConsuming();
    }
  };

  TraitRelation.prototype.willUnconsume = function (this: TraitRelation, consumer: Consumer): void {
    // hook
  };

  TraitRelation.prototype.onUnconsume = function (this: TraitRelation, consumer: Consumer): void {
    // hook
  };

  TraitRelation.prototype.didUnconsume = function (this: TraitRelation, consumer: Consumer): void {
    // hook
  };

  Object.defineProperty(TraitRelation.prototype, "consuming", {
    get(this: TraitRelation): boolean {
      return (this.flags & TraitRelation.ConsumingFlag) !== 0;
    },
    enumerable: true,
    configurable: true,
  });

  TraitRelation.prototype.startConsuming = function (this: TraitRelation): void {
    if ((this.flags & TraitRelation.ConsumingFlag) !== 0) {
      return;
    }
    this.willStartConsuming();
    this.setFlags(this.flags | TraitRelation.ConsumingFlag);
    this.onStartConsuming();
    this.didStartConsuming();
  };

  TraitRelation.prototype.willStartConsuming = function (this: TraitRelation): void {
    // hook
  };

  TraitRelation.prototype.onStartConsuming = function (this: TraitRelation): void {
    // hook
  };

  TraitRelation.prototype.didStartConsuming = function (this: TraitRelation): void {
    // hook
  };

  TraitRelation.prototype.stopConsuming = function (this: TraitRelation): void {
    if ((this.flags & TraitRelation.ConsumingFlag) === 0) {
      return;
    }
    this.willStopConsuming();
    this.setFlags(this.flags & ~TraitRelation.ConsumingFlag);
    this.onStopConsuming();
    this.didStopConsuming();
  };

  TraitRelation.prototype.willStopConsuming = function (this: TraitRelation): void {
    // hook
  };

  TraitRelation.prototype.onStopConsuming = function (this: TraitRelation): void {
    // hook
  };

  TraitRelation.prototype.didStopConsuming = function (this: TraitRelation): void {
    // hook
  };

  TraitRelation.prototype.onMount = function (this: TraitRelation): void {
    _super.prototype.onMount.call(this);
    if (this.consumers !== null && this.consumers.size !== 0) {
      this.startConsuming();
    }
  };

  TraitRelation.prototype.onUnmount = function (this: TraitRelation): void {
    _super.prototype.onUnmount.call(this);
    this.stopConsuming();
  };

  TraitRelation.construct = function <F extends TraitRelation<any, any>>(fastener: F | null, owner: F extends TraitRelation<infer O, any> ? O : never): F {
    fastener = _super.construct.call(this, fastener, owner) as F;
    (fastener as Mutable<typeof fastener>).outlets = null;
    (fastener as Mutable<typeof fastener>).consumers = null;
    return fastener;
  };

  (TraitRelation as Mutable<typeof TraitRelation>).ConsumingFlag = 1 << (_super.FlagShift + 0);

  (TraitRelation as Mutable<typeof TraitRelation>).FlagShift = _super.FlagShift + 1;
  (TraitRelation as Mutable<typeof TraitRelation>).FlagMask = (1 << TraitRelation.FlagShift) - 1;

  return TraitRelation;
})(Fastener);
