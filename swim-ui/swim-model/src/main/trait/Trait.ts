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

import {
  Mutable,
  Class,
  Instance,
  Proto,
  Arrays,
  HashCode,
  Comparator,
  FromAny,
  Creatable,
  InitType,
  Initable,
  ObserverType,
  Observable,
  ObserverMethods,
  ObserverParameters,
  ConsumerType,
  Consumable,
  Consumer,
} from "@swim/util";
import {FastenerContext, Fastener, PropertyDef} from "@swim/component";
import {AnyValue, Value} from "@swim/structure";
import {AnyUri, Uri} from "@swim/uri";
import {
  WarpDownlinkModel,
  WarpDownlink,
  EventDownlinkTemplate,
  EventDownlink,
  ValueDownlinkTemplate,
  ValueDownlink,
  ListDownlinkTemplate,
  ListDownlink,
  MapDownlinkTemplate,
  MapDownlink,
  WarpRef,
  WarpClient,
} from "@swim/client";
import {ModelContextType, ModelFlags, AnyModel, Model} from "../model/Model";
import {ModelRelation} from "../model/ModelRelation";
import type {TraitObserver} from "./TraitObserver";
import {TraitRelation} from "./"; // forward import

/** @public */
export type TraitModelType<T extends Trait> = T extends {readonly model: infer M | null} ? M : never;

/** @public */
export type TraitContextType<T extends Trait> = ModelContextType<TraitModelType<T>>;

/** @public */
export type TraitFlags = number;

/** @public */
export type AnyTrait<T extends Trait = Trait> = T | TraitFactory<T> | InitType<T>;

/** @public */
export interface TraitInit {
  /** @internal */
  uid?: never, // force type ambiguity between Trait and TraitInit
  type?: Creatable<Trait>;
  key?: string;
  traits?: AnyTrait[];
}

/** @public */
export interface TraitFactory<T extends Trait = Trait, U = AnyTrait<T>> extends Creatable<T>, FromAny<T, U> {
  fromInit(init: InitType<T>): T;
}

/** @public */
export interface TraitClass<T extends Trait = Trait, U = AnyTrait<T>> extends Function, TraitFactory<T, U> {
  readonly prototype: T;
}

/** @public */
export interface TraitConstructor<T extends Trait = Trait, U = AnyTrait<T>> extends TraitClass<T, U> {
  new(): T;
}

/** @public */
export abstract class Trait implements HashCode, Initable<TraitInit>, Observable, Consumable, FastenerContext, WarpRef {
  constructor() {
    this.uid = (this.constructor as typeof Trait).uid();
    this.key = void 0;
    this.flags = 0;
    this.model = null;
    this.nextTrait = null;
    this.previousTrait = null;
    this.fasteners = null;
    this.decoherent = null;
    this.observers = Arrays.empty;
    this.consumers = Arrays.empty;

    FastenerContext.init(this);
  }

  readonly observerType?: Class<TraitObserver>;

  /** @override */
  readonly consumerType?: Class<Consumer>;

  /** @internal */
  readonly uid: number;

  readonly key: string | undefined;

  /** @internal */
  setKey(key: string | undefined): void {
    (this as Mutable<this>).key = key;
  }

  /** @internal */
  readonly flags: TraitFlags;

  setFlags(flags: TraitFlags): void {
    (this as Mutable<this>).flags = flags;
  }

  readonly model: Model | null;

  /** @internal */
  attachModel(model: Model, nextTrait: Trait | null): void {
    // assert(this.model === null);
    this.willAttachModel(model);
    (this as Mutable<this>).model = model;
    let previousTrait: Trait | null;
    if (nextTrait !== null) {
      previousTrait = nextTrait.previousTrait;
      this.setNextTrait(nextTrait);
      nextTrait.setPreviousTrait(this);
    } else {
      previousTrait = model.lastTrait;
      model.setLastTrait(this);
    }
    if (previousTrait !== null) {
      previousTrait.setNextTrait(this);
      this.setPreviousTrait(previousTrait);
    } else {
      model.setFirstTrait(this);
    }
    if (model.mounted) {
      this.mountTrait();
    }
    this.onAttachModel(model);
    this.didAttachModel(model);
  }

  protected willAttachModel(model: Model): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitWillAttachModel !== void 0) {
        observer.traitWillAttachModel(model, this);
      }
    }
  }

  protected onAttachModel(model: Model): void {
    this.bindModelFasteners(model);
  }

  protected didAttachModel(model: Model): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitDidAttachModel !== void 0) {
        observer.traitDidAttachModel(model, this);
      }
    }
  }

  /** @internal */
  detachModel(model: Model): void {
    // assert(this.model === model);
    this.willDetachModel(model);
    if (this.mounted) {
      this.unmountTrait();
    }
    this.onDetachModel(model);
    const nextTrait = this.nextTrait;
    const previousTrait = this.previousTrait;
    if (nextTrait !== null) {
      this.setNextTrait(null);
      nextTrait.setPreviousTrait(previousTrait);
    } else {
      model.setLastTrait(previousTrait);
    }
    if (previousTrait !== null) {
      previousTrait.setNextTrait(nextTrait);
      this.setPreviousTrait(null);
    } else {
      model.setFirstTrait(nextTrait);
    }
    (this as Mutable<this>).model = null;
    this.didDetachModel(model);
  }

  protected willDetachModel(model: Model): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitWillDetachModel !== void 0) {
        observer.traitWillDetachModel(model, this);
      }
    }
  }

  protected onDetachModel(model: Model): void {
    this.unbindModelFasteners(model);
  }

  protected didDetachModel(model: Model): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitDidDetachModel !== void 0) {
        observer.traitDidDetachModel(model, this);
      }
    }
  }

  get modelFlags(): ModelFlags {
    const model = this.model;
    return model !== null ? model.flags : 0;
  }

  setModelFlags(modelFlags: ModelFlags): void {
    const model = this.model;
    if (model !== null) {
      model.setFlags(modelFlags);
    } else {
      throw new Error("no model");
    }
  }

  remove(): void {
    const model = this.model;
    if (model !== null) {
      model.removeTrait(this);
    }
  }

  get parent(): Model | null {
    const model = this.model;
    return model !== null ? model.parent : null;
  }

  /** @protected */
  willAttachParent(parent: Model): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitWillAttachParent !== void 0) {
        observer.traitWillAttachParent(parent, this);
      }
    }
  }

  /** @protected */
  onAttachParent(parent: Model): void {
    // hook
  }

  /** @protected */
  didAttachParent(parent: Model): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitDidAttachParent !== void 0) {
        observer.traitDidAttachParent(parent, this);
      }
    }
  }

  /** @protected */
  willDetachParent(parent: Model): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitWillDetachParent !== void 0) {
        observer.traitWillDetachParent(parent, this);
      }
    }
  }

  /** @protected */
  onDetachParent(parent: Model): void {
    // hook
  }

  /** @protected */
  didDetachParent(parent: Model): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitDidDetachParent !== void 0) {
        observer.traitDidDetachParent(parent, this);
      }
    }
  }

  get nextSibling(): Model | null {
    const model = this.model;
    return model !== null ? model.nextSibling : null;
  }

  get previousSibling(): Model | null {
    const model = this.model;
    return model !== null ? model.previousSibling : null;
  }

  get firstChild(): Model | null {
    const model = this.model;
    return model !== null ? model.firstChild : null;
  }

  get lastChild(): Model | null {
    const model = this.model;
    return model !== null ? model.lastChild : null;
  }

  forEachChild<T>(callback: (child: Model) => T | void): T | undefined;
  forEachChild<T, S>(callback: (this: S, child: Model) => T | void, thisArg: S): T | undefined;
  forEachChild<T, S>(callback: (this: S | undefined, child: Model) => T | void, thisArg?: S): T | undefined {
    const model = this.model;
    return model !== null ? model.forEachChild(callback, thisArg) : void 0;
  }

  getChild<F extends Class<Model>>(key: string, childBound: F): InstanceType<F> | null;
  getChild(key: string, childBound?: Class<Model>): Model | null;
  getChild(key: string, childBound?: Class<Model>): Model | null {
    const model = this.model;
    return model !== null ? model.getChild(key, childBound) : null;
  }

  setChild<M extends Model>(key: string, newChild: M): Model | null;
  setChild<F extends Class<Instance<F, Model>> & Creatable<Instance<F, Model>>>(key: string, factory: F): Model | null;
  setChild(key: string, newChild: AnyModel | null): Model | null;
  setChild(key: string, newChild: AnyModel | null): Model | null {
    const model = this.model;
    if (model !== null) {
      return model.setChild(key, newChild);
    } else {
      throw new Error("no model");
    }
  }

  appendChild<M extends Model>(child: M, key?: string): M;
  appendChild<F extends Class<Instance<F, Model>> & Creatable<Instance<F, Model>>>(factory: F, key?: string): InstanceType<F>;
  appendChild(child: AnyModel, key?: string): Model;
  appendChild(child: AnyModel, key?: string): Model {
    const model = this.model;
    if (model !== null) {
      return model.appendChild(child, key);
    } else {
      throw new Error("no model");
    }
  }

  prependChild<M extends Model>(child: M, key?: string): M;
  prependChild<F extends Class<Instance<F, Model>> & Creatable<Instance<F, Model>>>(factory: F, key?: string): InstanceType<F>;
  prependChild(child: AnyModel, key?: string): Model;
  prependChild(child: AnyModel, key?: string): Model {
    const model = this.model;
    if (model !== null) {
      return model.prependChild(child, key);
    } else {
      throw new Error("no model");
    }
  }

  insertChild<M extends Model>(child: M, target: Model | null, key?: string): M;
  insertChild<F extends Class<Instance<F, Model>> & Creatable<Instance<F, Model>>>(factory: F, target: Model | null, key?: string): InstanceType<F>;
  insertChild(child: AnyModel, target: Model | null, key?: string): Model;
  insertChild(child: AnyModel, target: Model | null, key?: string): Model {
    const model = this.model;
    if (model !== null) {
      return model.insertChild(child, target, key);
    } else {
      throw new Error("no model");
    }
  }

  replaceChild<M extends Model>(newChild: Model, oldChild: M): M;
  replaceChild<M extends Model>(newChild: AnyModel, oldChild: M): M;
  replaceChild(newChild: AnyModel, oldChild: Model): Model {
    const model = this.model;
    if (model !== null) {
      return model.replaceChild(newChild, oldChild);
    } else {
      throw new Error("no model");
    }
  }

  get insertChildFlags(): ModelFlags {
    return (this.constructor as typeof Trait).InsertChildFlags;
  }

  /** @protected */
  willInsertChild(child: Model, target: Model | null): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitWillInsertChild !== void 0) {
        observer.traitWillInsertChild(child, target, this);
      }
    }
  }

  /** @protected */
  onInsertChild(child: Model, target: Model | null): void {
    this.requireUpdate(this.insertChildFlags);
    this.bindChildFasteners(child, target);
  }

  /** @protected */
  didInsertChild(child: Model, target: Model | null): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitDidInsertChild !== void 0) {
        observer.traitDidInsertChild(child, target, this);
      }
    }
  }

  removeChild<M extends Model>(child: M): M | null;
  removeChild(key: string | Model): Model | null;
  removeChild(key: string | Model): Model | null {
    const model = this.model;
    if (model !== null) {
      return model.removeChild(key);
    } else {
      return null;
    }
  }

  get removeChildFlags(): ModelFlags {
    return (this.constructor as typeof Trait).RemoveChildFlags;
  }

  /** @protected */
  willRemoveChild(child: Model): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitWillRemoveChild !== void 0) {
        observer.traitWillRemoveChild(child, this);
      }
    }
    this.requireUpdate(this.removeChildFlags);
  }

  /** @protected */
  onRemoveChild(child: Model): void {
    this.unbindChildFasteners(child);
  }

  /** @protected */
  didRemoveChild(child: Model): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitDidRemoveChild !== void 0) {
        observer.traitDidRemoveChild(child, this);
      }
    }
  }

  removeChildren(): void {
    const model = this.model;
    if (model !== null) {
      return model.removeChildren();
    }
  }

  sortChildren(comparator: Comparator<Model>): void {
    const model = this.model;
    if (model !== null) {
      return model.sortChildren(comparator);
    }
  }

  getSuper<F extends Class<Model>>(superBound: F): InstanceType<F> | null {
    const model = this.model;
    return model !== null ? model.getSuper(superBound) : null;
  }

  getBase<F extends Class<Model>>(baseBound: F): InstanceType<F> | null {
    const model = this.model;
    return model !== null ? model.getBase(baseBound) : null;
  }

  readonly nextTrait: Trait | null;

  /** @internal */
  setNextTrait(nextTrait: Trait | null): void {
    (this as Mutable<this>).nextTrait = nextTrait;
  }

  readonly previousTrait: Trait | null;

  /** @internal */
  setPreviousTrait(previousTrait: Trait | null): void {
    (this as Mutable<this>).previousTrait = previousTrait;
  }

  get firstTrait(): Trait | null {
    const model = this.model;
    return model !== null ? model.firstTrait : null;
  }

  get lastTrait(): Trait | null {
    const model = this.model;
    return model !== null ? model.lastTrait : null;
  }

  forEachTrait<T>(callback: (trait: Trait) => T | void): T | undefined;
  forEachTrait<T, S>(callback: (this: S, trait: Trait) => T | void, thisArg: S): T | undefined;
  forEachTrait<T, S>(callback: (this: S | undefined, trait: Trait) => T | void, thisArg?: S): T | undefined {
    const model = this.model;
    return model !== null ? model.forEachTrait(callback, thisArg) : void 0;
  }

  findTrait<F extends Class<Trait>>(key: string | undefined, traitBound: F): InstanceType<F> | null;
  findTrait(key: string | undefined, traitBound: Class<Trait> | undefined): Trait | null;
  findTrait(key: string | undefined, traitBound: Class<Trait> | undefined): Trait | null {
    const model = this.model;
    return model !== null ? model.findTrait(key, traitBound) : null;
  }

  getTrait<F extends Class<Trait>>(key: string, traitBound: F): InstanceType<F> | null;
  getTrait(key: string, traitBound?: Class<Trait>): Trait | null;
  getTrait<F extends Class<Trait>>(traitBound: F): InstanceType<F> | null;
  getTrait(key: string | Class<Trait>, traitBound?: Class<Trait>): Trait | null {
    const model = this.model;
    return model !== null ? model.getTrait(key as string, traitBound) : null;
  }

  setTrait<T extends Trait>(key: string, newTrait: T): Trait | null;
  setTrait<F extends Class<Instance<F, Trait>> & Creatable<Instance<F, Trait>>>(key: string, factory: F): Trait | null;
  setTrait(key: string, newTrait: AnyTrait | null): Trait | null;
  setTrait(key: string, newTrait: AnyTrait | null): Trait | null {
    const model = this.model;
    if (model !== null) {
      return model.setTrait(key, newTrait);
    } else {
      throw new Error("no model");
    }
  }

  appendTrait<T extends Trait>(trait: T, key?: string): T;
  appendTrait<F extends Class<Instance<F, Trait>> & Creatable<Instance<F, Trait>>>(factory: F, key?: string): InstanceType<F>;
  appendTrait(trait: AnyTrait, key?: string): Trait;
  appendTrait(trait: AnyTrait, key?: string): Trait {
    const model = this.model;
    if (model !== null) {
      return model.appendTrait(trait, key);
    } else {
      throw new Error("no model");
    }
  }

  prependTrait<T extends Trait>(trait: T, key?: string): T;
  prependTrait<F extends Class<Instance<F, Trait>> & Creatable<Instance<F, Trait>>>(factory: F, key?: string): InstanceType<F>;
  prependTrait(trait: AnyTrait, key?: string): Trait;
  prependTrait(trait: AnyTrait, key?: string): Trait {
    const model = this.model;
    if (model !== null) {
      return model.prependTrait(trait, key);
    } else {
      throw new Error("no model");
    }
  }

  insertTrait<T extends Trait>(trait: T, target: Trait | null, key?: string): T;
  insertTrait<F extends Class<Instance<F, Trait>> & Creatable<Instance<F, Trait>>>(factory: F, target: Trait | null, key?: string): InstanceType<F>;
  insertTrait(trait: AnyTrait, target: Trait | null, key?: string): Trait;
  insertTrait(trait: AnyTrait, target: Trait | null, key?: string): Trait {
    const model = this.model;
    if (model !== null) {
      return model.insertTrait(trait, target, key);
    } else {
      throw new Error("no model");
    }
  }

  replaceTraitt<T extends Trait>(newTrait: Trait, oldTrait: T): T;
  replaceTraitt<T extends Trait>(newTrait: AnyTrait, oldTrait: T): T;
  replaceTraitt(newTrait: AnyTrait, oldTrait: Trait): Trait {
    const model = this.model;
    if (model !== null) {
      return model.replaceTrait(newTrait, oldTrait);
    } else {
      throw new Error("no model");
    }
  }

  get insertTraitFlags(): ModelFlags {
    return (this.constructor as typeof Trait).InsertTraitFlags;
  }

  /** @protected */
  willInsertTrait(trait: Trait, target: Trait | null): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitWillInsertTrait !== void 0) {
        observer.traitWillInsertTrait(trait, target, this);
      }
    }
  }

  /** @protected */
  onInsertTrait(trait: Trait, target: Trait | null): void {
    this.requireUpdate(this.insertTraitFlags);
    this.bindTraitFasteners(trait, target);
  }

  /** @protected */
  didInsertTrait(trait: Trait, target: Trait | null): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitDidInsertTrait !== void 0) {
        observer.traitDidInsertTrait(trait, target, this);
      }
    }
  }

  removeTrait<T extends Trait>(trait: T): T | null;
  removeTrait(key: string | Trait): Trait | null;
  removeTrait(key: string | Trait): Trait | null {
    const model = this.model;
    if (model !== null) {
      return model.removeTrait(key);
    } else {
      return null;
    }
  }

  get removeTraitFlags(): ModelFlags {
    return (this.constructor as typeof Trait).RemoveTraitFlags;
  }

  /** @protected */
  willRemoveTrait(trait: Trait): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitWillRemoveTrait !== void 0) {
        observer.traitWillRemoveTrait(trait, this);
      }
    }
  }

  /** @protected */
  onRemoveTrait(trait: Trait): void {
    this.requireUpdate(this.removeTraitFlags);
    this.unbindTraitFasteners(trait);
  }

  /** @protected */
  didRemoveTrait(trait: Trait): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitDidRemoveTrait !== void 0) {
        observer.traitDidRemoveTrait(trait, this);
      }
    }
  }

  sortTraits(comparator: Comparator<Trait>): void {
    const model = this.model;
    if (model !== null) {
      model.sortTraits(comparator);
    }
  }

  getSuperTrait<F extends Class<Trait>>(superBound: F): InstanceType<F> | null {
    const model = this.model;
    return model !== null ? model.getSuperTrait(superBound) : null;
  }

  getBaseTrait<F extends Class<Trait>>(baseBound: F): InstanceType<F> | null {
    const model = this.model;
    return model !== null ? model.getBaseTrait(baseBound) : null;
  }

  /** @override */
  @PropertyDef({valueType: Uri, value: null, inherits: true, updateFlags: Model.NeedsReconcile})
  readonly hostUri!: PropertyDef<this, {value: Uri | null, valueInit: AnyUri | null}>;

  /** @override */
  @PropertyDef({valueType: Uri, value: null, inherits: true, updateFlags: Model.NeedsReconcile})
  readonly nodeUri!: PropertyDef<this, {value: Uri | null, valueInit: AnyUri | null}>;

  /** @override */
  @PropertyDef({valueType: Uri, value: null, inherits: true, updateFlags: Model.NeedsReconcile})
  readonly laneUri!: PropertyDef<this, {value: Uri | null, valueInit: AnyUri | null}>;

  /** @override */
  downlink(template?: ThisType<EventDownlink<this>> & EventDownlinkTemplate & Partial<Omit<EventDownlink<this>, keyof EventDownlinkTemplate>>): EventDownlink<this> {
    let downlinkClass = EventDownlink;
    if (template !== void 0) {
      downlinkClass = downlinkClass.specify("downlink", template);
    }
    return downlinkClass.create(this);
  }

  /** @override */
  downlinkValue<V = Value, VU = V extends Value ? AnyValue : V>(template?: ThisType<ValueDownlink<this, V, VU>> & ValueDownlinkTemplate<V, VU> & Partial<Omit<ValueDownlink<this, V, VU>, keyof ValueDownlinkTemplate>>): ValueDownlink<this, V, VU> {
    let downlinkClass = ValueDownlink;
    if (template !== void 0) {
      downlinkClass = downlinkClass.specify("downlinkValue", template);
    }
    return downlinkClass.create(this);
  }

  /** @override */
  downlinkList<V = Value, VU = V extends Value ? AnyValue : V>(template?: ThisType<ListDownlink<this, V, VU>> & ListDownlinkTemplate<V, VU> & Partial<Omit<ListDownlink<this, V, VU>, keyof ListDownlinkTemplate>>): ListDownlink<this, V, VU> {
    let downlinkClass = ListDownlink;
    if (template !== void 0) {
      downlinkClass = downlinkClass.specify("downlinkList", template);
    }
    return downlinkClass.create(this);
  }

  /** @override */
  downlinkMap<K = Value, V = Value, KU = K extends Value ? AnyValue : K, VU = V extends Value ? AnyValue : V>(template?: ThisType<MapDownlink<this, K, V, KU, VU>> & MapDownlinkTemplate<V, VU> & Partial<Omit<MapDownlink<this, K, V, KU, VU>, keyof MapDownlinkTemplate>>): MapDownlink<this, K, V, KU, VU> {
    let downlinkClass = MapDownlink;
    if (template !== void 0) {
      downlinkClass = downlinkClass.specify("downlinkMap", template);
    }
    return downlinkClass.create(this);
  }

  /** @override */
  command(hostUri: AnyUri, nodeUri: AnyUri, laneUri: AnyUri, body: AnyValue): void;
  /** @override */
  command(nodeUri: AnyUri, laneUri: AnyUri, body: AnyValue): void;
  /** @override */
  command(laneUri: AnyUri, body: AnyValue): void;
  /** @override */
  command(body: AnyValue): void;
  command(hostUri: AnyUri | AnyValue, nodeUri?: AnyUri | AnyValue, laneUri?: AnyUri | AnyValue, body?: AnyValue): void {
    if (nodeUri === void 0) {
      body = Value.fromAny(hostUri as AnyValue);
      laneUri = this.laneUri.getValue();
      nodeUri = this.nodeUri.getValue();
      hostUri = this.hostUri.value;
    } else if (laneUri === void 0) {
      body = Value.fromAny(nodeUri as AnyValue);
      laneUri = Uri.fromAny(hostUri as AnyUri);
      nodeUri = this.nodeUri.getValue();
      hostUri = this.hostUri.value;
    } else if (body === void 0) {
      body = Value.fromAny(laneUri as AnyValue);
      laneUri = Uri.fromAny(nodeUri as AnyUri);
      nodeUri = Uri.fromAny(hostUri as AnyUri);
      hostUri = this.hostUri.value;
    } else {
      body = Value.fromAny(body);
      laneUri = Uri.fromAny(laneUri as AnyUri);
      nodeUri = Uri.fromAny(nodeUri as AnyUri);
      hostUri = Uri.fromAny(hostUri as AnyUri);
    }
    if (hostUri === null) {
      hostUri = nodeUri.endpoint();
      nodeUri = hostUri.unresolve(nodeUri);
    }
    const warpRef = this.warpRef.value;
    warpRef.command(hostUri, nodeUri, laneUri, body);
  }

  /** @override */
  authenticate(hostUri: AnyUri, credentials: AnyValue): void;
  /** @override */
  authenticate(credentials: AnyValue): void;
  authenticate(hostUri: AnyUri | AnyValue, credentials?: AnyValue): void {
    if (credentials === void 0) {
      credentials = Value.fromAny(hostUri as AnyValue);
      hostUri = this.hostUri.getValue();
    } else {
      credentials = Value.fromAny(credentials);
      hostUri = Uri.fromAny(hostUri as AnyUri);
    }
    const warpRef = this.warpRef.value;
    warpRef.authenticate(hostUri, credentials);
  }

  /** @override */
  hostRef(hostUri: AnyUri): WarpRef {
    hostUri = Uri.fromAny(hostUri);
    const childRef = new Model();
    childRef.hostUri.setValue(hostUri);
    this.appendChild(childRef);
    return childRef;
  }

  /** @override */
  nodeRef(hostUri: AnyUri, nodeUri: AnyUri): WarpRef;
  /** @override */
  nodeRef(nodeUri: AnyUri): WarpRef;
  nodeRef(hostUri: AnyUri | undefined, nodeUri?: AnyUri): WarpRef {
    if (nodeUri === void 0) {
      nodeUri = Uri.fromAny(hostUri as AnyUri);
      hostUri = nodeUri.endpoint();
      if (hostUri.isDefined()) {
        nodeUri = hostUri.unresolve(nodeUri);
      } else {
        hostUri = void 0;
      }
    } else {
      nodeUri = Uri.fromAny(nodeUri);
      hostUri = Uri.fromAny(hostUri as AnyUri);
    }
    const childRef = new Model();
    if (hostUri !== void 0) {
      childRef.hostUri.setValue(hostUri);
    }
    if (nodeUri !== void 0) {
      childRef.nodeUri.setValue(nodeUri);
    }
    this.appendChild(childRef);
    return childRef;
  }

  /** @override */
  laneRef(hostUri: AnyUri, nodeUri: AnyUri, laneUri: AnyUri): WarpRef;
  /** @override */
  laneRef(nodeUri: AnyUri, laneUri: AnyUri): WarpRef;
  /** @override */
  laneRef(laneUri: AnyUri): WarpRef;
  laneRef(hostUri: AnyUri | undefined, nodeUri?: AnyUri, laneUri?: AnyUri): WarpRef {
    if (nodeUri === void 0) {
      laneUri = Uri.fromAny(hostUri as AnyUri);
      nodeUri = void 0;
      hostUri = void 0;
    } else if (laneUri === void 0) {
      laneUri = Uri.fromAny(nodeUri);
      nodeUri = Uri.fromAny(hostUri as AnyUri);
      hostUri = nodeUri.endpoint();
      if (hostUri.isDefined()) {
        nodeUri = hostUri.unresolve(nodeUri);
      } else {
        hostUri = void 0;
      }
    } else {
      laneUri = Uri.fromAny(laneUri);
      nodeUri = Uri.fromAny(nodeUri);
      hostUri = Uri.fromAny(hostUri as AnyUri);
    }
    const childRef = new Model();
    if (hostUri !== void 0) {
      childRef.hostUri.setValue(hostUri);
    }
    if (nodeUri !== void 0) {
      childRef.nodeUri.setValue(nodeUri);
    }
    if (laneUri !== void 0) {
      childRef.laneUri.setValue(laneUri);
    }
    this.appendChild(childRef);
    return childRef;
  }

  /** @internal @override */
  getDownlink(hostUri: Uri, nodeUri: Uri, laneUri: Uri): WarpDownlinkModel | null {
    const warpRef = this.warpRef.value;
    return warpRef.getDownlink(hostUri, nodeUri, laneUri);
  }

  /** @internal @override */
  openDownlink(downlink: WarpDownlinkModel): void {
    const warpRef = this.warpRef.value;
    warpRef.openDownlink(downlink);
  }

  @PropertyDef<Trait["warpRef"]>({
    valueType: WarpRef,
    inherits: true,
    updateFlags: Model.NeedsReconcile,
    initValue(): WarpRef {
      return WarpClient.global();
    },
    equalValues(newValue: WarpRef, oldValue: WarpRef): boolean {
      return newValue === oldValue;
    },
  })
  readonly warpRef!: PropertyDef<this, {value: WarpRef}>;

  get mounted(): boolean {
    return (this.flags & Trait.MountedFlag) !== 0;
  }

  get mountFlags(): ModelFlags {
    return (this.constructor as typeof Trait).MountFlags;
  }

  /** @internal */
  mountTrait(): void {
    if ((this.flags & Trait.MountedFlag) === 0) {
      this.setFlags(this.flags | Trait.MountedFlag);
      this.willMount();
      this.onMount();
      this.didMount();
    } else {
      throw new Error("already mounted");
    }
  }

  protected willMount(): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitWillMount !== void 0) {
        observer.traitWillMount(this);
      }
    }
  }

  protected onMount(): void {
    this.requireUpdate(this.mountFlags);

    if (this.decoherent !== null && this.decoherent.length !== 0) {
      this.requireUpdate(Model.NeedsMutate);
    }

    this.mountFasteners();

    if (this.consumers.length !== 0) {
      this.startConsuming();
    }
  }

  protected didMount(): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitDidMount !== void 0) {
        observer.traitDidMount(this);
      }
    }
  }

  /** @internal */
  unmountTrait(): void {
    if ((this.flags & Trait.MountedFlag) !== 0) {
      this.setFlags(this.flags & ~Trait.MountedFlag);
      this.willUnmount();
      this.onUnmount();
      this.didUnmount();
    } else {
      throw new Error("already unmounted");
    }
  }

  protected willUnmount(): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitWillUnmount !== void 0) {
        observer.traitWillUnmount(this);
      }
    }
  }

  protected onUnmount(): void {
    this.stopConsuming();
    this.unmountFasteners();
  }

  protected didUnmount(): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitDidUnmount !== void 0) {
        observer.traitDidUnmount(this);
      }
    }
  }

  requireUpdate(updateFlags: ModelFlags, immediate: boolean = false): void {
    const model = this.model;
    if (model !== null) {
      model.requireUpdate(updateFlags, immediate);
    }
  }

  /** @protected */
  needsUpdate(updateFlags: ModelFlags, immediate: boolean): ModelFlags {
    return updateFlags;
  }

  requestUpdate(target: Model, updateFlags: ModelFlags, immediate: boolean): void {
    const model = this.model;
    if (model !== null) {
      model.requestUpdate(target, updateFlags, immediate);
    } else {
      throw new TypeError("no model");
    }
  }

  get updating(): boolean {
    const model = this.model;
    return model !== null && model.updating;
  }

  get analyzing(): boolean {
    const model = this.model;
    return model !== null && model.analyzing;
  }

  /** @protected */
  needsAnalyze(analyzeFlags: ModelFlags, modelContext: TraitContextType<this>): ModelFlags {
    return analyzeFlags;
  }

  /** @protected */
  willAnalyze(analyzeFlags: ModelFlags, modelContext: TraitContextType<this>): void {
    // hook
  }

  /** @protected */
  onAnalyze(analyzeFlags: ModelFlags, modelContext: TraitContextType<this>): void {
    // hook
  }

  /** @protected */
  didAnalyze(analyzeFlags: ModelFlags, modelContext: TraitContextType<this>): void {
    // hook
  }

  /** @protected */
  willMutate(modelContext: TraitContextType<this>): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitWillMutate !== void 0) {
        observer.traitWillMutate(modelContext, this);
      }
    }
  }

  /** @protected */
  onMutate(modelContext: TraitContextType<this>): void {
    this.recohereFasteners(modelContext.updateTime);
  }

  /** @protected */
  didMutate(modelContext: TraitContextType<this>): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitDidMutate !== void 0) {
        observer.traitDidMutate(modelContext, this);
      }
    }
  }

  /** @protected */
  willAggregate(modelContext: TraitContextType<this>): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitWillAggregate !== void 0) {
        observer.traitWillAggregate(modelContext, this);
      }
    }
  }

  /** @protected */
  onAggregate(modelContext: TraitContextType<this>): void {
    // hook
  }

  /** @protected */
  didAggregate(modelContext: TraitContextType<this>): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitDidAggregate !== void 0) {
        observer.traitDidAggregate(modelContext, this);
      }
    }
  }

  /** @protected */
  willCorrelate(modelContext: TraitContextType<this>): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitWillCorrelate !== void 0) {
        observer.traitWillCorrelate(modelContext, this);
      }
    }
  }

  /** @protected */
  onCorrelate(modelContext: TraitContextType<this>): void {
    // hook
  }

  /** @protected */
  didCorrelate(modelContext: TraitContextType<this>): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitDidCorrelate !== void 0) {
        observer.traitDidCorrelate(modelContext, this);
      }
    }
  }

  /** @protected */
  analyzeChildren(analyzeFlags: ModelFlags, modelContext: ModelContextType<Model>,
                  analyzeChild: (this: Model, child: Model, analyzeFlags: ModelFlags,
                                 modelContext: ModelContextType<Model>) => void,
                  analyzeChildren: (this: Model, analyzeFlags: ModelFlags, modelContext: ModelContextType<Model>,
                                    analyzeChild: (this: Model, child: Model, analyzeFlags: ModelFlags,
                                                   modelContext: ModelContextType<Model>) => void) => void): void {
    analyzeChildren.call(this.model!, analyzeFlags, modelContext, analyzeChild);
  }

  get refreshing(): boolean {
    const model = this.model;
    return model !== null && model.refreshing;
  }

  /** @protected */
  needsRefresh(refreshFlags: ModelFlags, modelContext: TraitContextType<this>): ModelFlags {
    return refreshFlags;
  }

  /** @protected */
  willRefresh(refreshFlags: ModelFlags, modelContext: TraitContextType<this>): void {
    // hook
  }

  /** @protected */
  onRefresh(refreshFlags: ModelFlags, modelContext: TraitContextType<this>): void {
    // hook
  }

  /** @protected */
  didRefresh(refreshFlags: ModelFlags, modelContext: TraitContextType<this>): void {
    // hook
  }

  /** @protected */
  willValidate(modelContext: TraitContextType<this>): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitWillValidate !== void 0) {
        observer.traitWillValidate(modelContext, this);
      }
    }
  }

  /** @protected */
  onValidate(modelContext: TraitContextType<this>): void {
    // hook
  }

  /** @protected */
  didValidate(modelContext: TraitContextType<this>): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitDidValidate !== void 0) {
        observer.traitDidValidate(modelContext, this);
      }
    }
  }

  /** @protected */
  willReconcile(modelContext: TraitContextType<this>): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitWillReconcile !== void 0) {
        observer.traitWillReconcile(modelContext, this);
      }
    }
  }

  /** @protected */
  onReconcile(modelContext: TraitContextType<this>): void {
    this.recohereDownlinks(modelContext.updateTime);
  }

  /** @protected */
  didReconcile(modelContext: TraitContextType<this>): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitDidReconcile !== void 0) {
        observer.traitDidReconcile(modelContext, this);
      }
    }
  }

  /** @protected */
  refreshChildren(refreshFlags: ModelFlags, modelContext: ModelContextType<Model>,
                  refreshChild: (this: Model, child: Model, refreshFlags: ModelFlags,
                                 modelContext: ModelContextType<Model>) => void,
                  refreshChildren: (this: Model, refreshFlags: ModelFlags, modelContext: ModelContextType<Model>,
                                    refreshChild: (this: Model, child: Model, refreshFlags: ModelFlags,
                                                   modelContext: ModelContextType<Model>) => void) => void): void {
    refreshChildren.call(this.model!, refreshFlags, modelContext, refreshChild);
  }

  /** @internal */
  readonly fasteners: {[fastenerName: string]: Fastener | undefined} | null;

  /** @override */
  hasFastener(fastenerName: string, fastenerBound?: Proto<Fastener> | null): boolean {
    const fasteners = this.fasteners;
    if (fasteners !== null) {
      const fastener = fasteners[fastenerName];
      if (fastener !== void 0 && (fastenerBound === void 0 || fastenerBound === null || fastener instanceof fastenerBound)) {
        return true;
      }
    }
    return false;
  }

  /** @override */
  getFastener<F extends Fastener<any>>(fastenerName: string, fastenerBound: Proto<F>): F | null;
  /** @override */
  getFastener(fastenerName: string, fastenerBound?: Proto<Fastener> | null): Fastener | null;
  getFastener(fastenerName: string, fastenerBound?: Proto<Fastener> | null): Fastener | null {
    const fasteners = this.fasteners;
    if (fasteners !== null) {
      const fastener = fasteners[fastenerName];
      if (fastener !== void 0 && (fastenerBound === void 0 || fastenerBound === null || fastener instanceof fastenerBound)) {
        return fastener;
      }
    }
    return null;
  }

  /** @override */
  setFastener(fastenerName: string, newFastener: Fastener | null): void {
    const fasteners = this.fasteners;
    const oldFastener: Fastener | null | undefined = fasteners !== null ? fasteners[fastenerName] ?? null : null;
    if (oldFastener !== newFastener) {
      if (oldFastener !== null) {
        this.detachFastener(fastenerName, oldFastener);
      }
      if (newFastener !== null) {
        this.attachFastener(fastenerName, newFastener);
      }
    }
  }

  /** @internal */
  protected attachFastener(fastenerName: string, fastener: Fastener): void {
    let fasteners = this.fasteners;
    if (fasteners === null) {
      fasteners = {};
      (this as Mutable<this>).fasteners = fasteners;
    }
    // assert(fasteners[fastenerName] === void 0);
    this.willAttachFastener(fastenerName, fastener);
    fasteners[fastenerName] = fastener;
    if (this.mounted) {
      fastener.mount();
    }
    this.onAttachFastener(fastenerName, fastener);
    this.didAttachFastener(fastenerName, fastener);
  }

  protected willAttachFastener(fastenerName: string, fastener: Fastener): void {
    // hook
  }

  protected onAttachFastener(fastenerName: string, fastener: Fastener): void {
    this.bindFastener(fastener);
  }

  protected didAttachFastener(fastenerName: string, fastener: Fastener): void {
    // hook
  }

  /** @internal */
  protected detachFastener(fastenerName: string, fastener: Fastener): void {
    const fasteners = this.fasteners!;
    // assert(fasteners !== null);
    // assert(fasteners[fastenerName] === fastener);
    this.willDetachFastener(fastenerName, fastener);
    this.onDetachFastener(fastenerName, fastener);
    if (this.mounted) {
      fastener.unmount();
    }
    delete fasteners[fastenerName];
    this.didDetachFastener(fastenerName, fastener);
  }

  protected willDetachFastener(fastenerName: string, fastener: Fastener): void {
    // hook
  }

  protected onDetachFastener(fastenerName: string, fastener: Fastener): void {
    // hook
  }

  protected didDetachFastener(fastenerName: string, fastener: Fastener): void {
    // hook
  }

  /** @override */
  getLazyFastener<F extends Fastener<any>>(fastenerName: string, fastenerBound: Proto<F>): F | null;
  /** @override */
  getLazyFastener(fastenerName: string, fastenerBound?: Proto<Fastener> | null): Fastener | null;
  getLazyFastener(fastenerName: string, fastenerBound?: Proto<Fastener> | null): Fastener | null {
    return FastenerContext.getLazyFastener(this, fastenerName, fastenerBound);
  }

  /** @override */
  getSuperFastener<F extends Fastener<any>>(fastenerName: string, fastenerBound: Proto<F>): F | null;
  /** @override */
  getSuperFastener(fastenerName: string, fastenerBound?: Proto<Fastener> | null): Fastener | null;
  getSuperFastener(fastenerName: string, fastenerBound?: Proto<Fastener> | null): Fastener | null {
    const model = this.model;
    if (model === null) {
      return null;
    } else {
      const modelFastener = model.getLazyFastener(fastenerName, fastenerBound);
      if (modelFastener !== null) {
        return modelFastener;
      } else {
        return model.getSuperFastener(fastenerName, fastenerBound);
      }
    }
  }

  /** @internal */
  protected mountFasteners(): void {
    const fasteners = this.fasteners;
    for (const fastenerName in fasteners) {
      const fastener = fasteners[fastenerName]!;
      fastener.mount();
    }
  }

  /** @internal */
  protected unmountFasteners(): void {
    const fasteners = this.fasteners;
    for (const fastenerName in fasteners) {
      const fastener = fasteners[fastenerName]!;
      fastener.unmount();
    }
  }

  protected bindFastener(fastener: Fastener): void {
    if ((fastener instanceof ModelRelation || fastener instanceof TraitRelation) && fastener.binds) {
      this.forEachChild(function (child: Model): void {
        fastener.bindModel(child, null);
      }, this);
    }
    if (fastener instanceof TraitRelation && fastener.binds) {
      this.forEachTrait(function (trait: Trait): void {
        fastener.bindTrait(trait, null);
      }, this);
    }
    if (fastener instanceof WarpDownlink && fastener.consumed === true && this.consuming) {
      fastener.consume(this);
    }
  }

  /** @internal */
  protected bindModelFasteners(model: Model): void {
    const fasteners = this.fasteners;
    model.forEachChild(function (child: Model): void {
      for (const fastenerName in fasteners) {
        const fastener = fasteners[fastenerName]!;
        this.bindChildFastener(fastener, child, null);
      }
    }, this);
    model.forEachTrait(function (trait: Trait): void {
      for (const fastenerName in fasteners) {
        const fastener = fasteners[fastenerName]!;
        this.bindTraitFastener(fastener, trait, null);
      }
    }, this);
  }

  /** @internal */
  protected unbindModelFasteners(model: Model): void {
    const fasteners = this.fasteners;
    model.forEachTrait(function (trait: Trait): void {
      for (const fastenerName in fasteners) {
        const fastener = fasteners[fastenerName]!;
        this.unbindTraitFastener(fastener, trait);
      }
    }, this);
    model.forEachChild(function (child: Model): void {
      for (const fastenerName in fasteners) {
        const fastener = fasteners[fastenerName]!;
        this.unbindChildFastener(fastener, child);
      }
    }, this);
  }

  /** @internal */
  protected bindChildFasteners(child: Model, target: Model | null): void {
    const fasteners = this.fasteners;
    for (const fastenerName in fasteners) {
      const fastener = fasteners[fastenerName]!;
      this.bindChildFastener(fastener, child, target);
    }
  }

  /** @internal */
  protected bindChildFastener(fastener: Fastener, child: Model, target: Model | null): void {
    if (fastener instanceof ModelRelation || fastener instanceof TraitRelation) {
      fastener.bindModel(child, target);
    }
  }

  /** @internal */
  protected unbindChildFasteners(child: Model): void {
    const fasteners = this.fasteners;
    for (const fastenerName in fasteners) {
      const fastener = fasteners[fastenerName]!;
      this.unbindChildFastener(fastener, child);
    }
  }

  /** @internal */
  protected unbindChildFastener(fastener: Fastener, child: Model): void {
    if (fastener instanceof ModelRelation || fastener instanceof TraitRelation) {
      fastener.unbindModel(child);
    }
  }

  /** @internal */
  protected bindTraitFasteners(trait: Trait, target: Trait | null): void {
    const fasteners = this.fasteners;
    for (const fastenerName in fasteners) {
      const fastener = fasteners[fastenerName]!;
      this.bindTraitFastener(fastener, trait, target);
    }
  }

  /** @internal */
  protected bindTraitFastener(fastener: Fastener, trait: Trait, target: Trait | null): void {
    if (fastener instanceof TraitRelation) {
      fastener.bindTrait(trait, target);
    }
  }

  /** @internal */
  protected unbindTraitFasteners(trait: Trait): void {
    const fasteners = this.fasteners;
    for (const fastenerName in fasteners) {
      const fastener = fasteners[fastenerName]!;
      this.unbindTraitFastener(fastener, trait);
    }
  }

  /** @internal */
  protected unbindTraitFastener(fastener: Fastener, trait: Trait): void {
    if (fastener instanceof TraitRelation) {
      fastener.unbindTrait(trait);
    }
  }

  /** @internal */
  readonly decoherent: ReadonlyArray<Fastener> | null;

  /** @internal */
  decohereFastener(fastener: Fastener): void {
    let decoherent = this.decoherent as Fastener[];
    if (decoherent === null) {
      decoherent = [];
      (this as Mutable<this>).decoherent = decoherent;
    }
    decoherent.push(fastener);
    if (fastener instanceof WarpDownlink) {
      this.requireUpdate(Model.NeedsReconcile);
    } else {
      this.requireUpdate(Model.NeedsMutate);
    }
  }

  /** @internal */
  recohereFasteners(t?: number): void {
    const decoherent = this.decoherent;
    if (decoherent !== null) {
      const decoherentCount = decoherent.length;
      if (decoherentCount !== 0) {
        if (t === void 0) {
          t = performance.now();
        }
        (this as Mutable<this>).decoherent = null;
        for (let i = 0; i < decoherentCount; i += 1) {
          const fastener = decoherent[i]!;
          if (!(fastener instanceof WarpDownlink)) {
            fastener.recohere(t);
          } else {
            this.decohereFastener(fastener);
          }
        }
      }
    }
  }

  /** @internal */
  recohereDownlinks(t: number): void {
    const decoherent = this.decoherent;
    if (decoherent !== null) {
      const decoherentCount = decoherent.length;
      if (decoherentCount !== 0) {
        (this as Mutable<this>).decoherent = null;
        for (let i = 0; i < decoherentCount; i += 1) {
          const fastener = decoherent[i]!;
          if (fastener instanceof WarpDownlink) {
            fastener.recohere(t);
          } else {
            this.decohereFastener(fastener);
          }
        }
      }
    }
  }

  /** @internal */
  readonly observers: ReadonlyArray<ObserverType<this>>;

  /** @override */
  observe(observer: ObserverType<this>): void {
    const oldObservers = this.observers;
    const newObservers = Arrays.inserted(observer, oldObservers);
    if (oldObservers !== newObservers) {
      this.willObserve(observer);
      (this as Mutable<this>).observers = newObservers;
      this.onObserve(observer);
      this.didObserve(observer);
    }
  }

  protected willObserve(observer: ObserverType<this>): void {
    // hook
  }

  protected onObserve(observer: ObserverType<this>): void {
    // hook
  }

  protected didObserve(observer: ObserverType<this>): void {
    // hook
  }

  /** @override */
  unobserve(observer: ObserverType<this>): void {
    const oldObservers = this.observers;
    const newObservers = Arrays.removed(observer, oldObservers);
    if (oldObservers !== newObservers) {
      this.willUnobserve(observer);
      (this as Mutable<this>).observers = newObservers;
      this.onUnobserve(observer);
      this.didUnobserve(observer);
    }
  }

  protected willUnobserve(observer: ObserverType<this>): void {
    // hook
  }

  protected onUnobserve(observer: ObserverType<this>): void {
    // hook
  }

  protected didUnobserve(observer: ObserverType<this>): void {
    // hook
  }

  callObservers<O, K extends keyof ObserverMethods<O>>(this: this & {readonly observerType?: Class<O>}, key: K, ...args: ObserverParameters<O, K>): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]! as ObserverMethods<O>;
      const method = observer[key];
      if (typeof method === "function") {
        method.call(observer, ...args);
      }
    }
  }

  /** @internal */
  readonly consumers: ReadonlyArray<ConsumerType<this>>;

  /** @override */
  consume(consumer: ConsumerType<this>): void {
    const oldConsumers = this.consumers;
    const newConsumers = Arrays.inserted(consumer, oldConsumers);
    if (oldConsumers !== newConsumers) {
      this.willConsume(consumer);
      (this as Mutable<this>).consumers = newConsumers;
      this.onConsume(consumer);
      this.didConsume(consumer);
      if (oldConsumers.length === 0 && this.mounted) {
        this.startConsuming();
      }
    }
  }

  protected willConsume(consumer: ConsumerType<this>): void {
    // hook
  }

  protected onConsume(consumer: ConsumerType<this>): void {
    // hook
  }

  protected didConsume(consumer: ConsumerType<this>): void {
    // hook
  }

  /** @override */
  unconsume(consumer: ConsumerType<this>): void {
    const oldConsumers = this.consumers;
    const newConsumers = Arrays.removed(consumer, oldConsumers);
    if (oldConsumers !== newConsumers) {
      this.willUnconsume(consumer);
      (this as Mutable<this>).consumers = newConsumers;
      this.onUnconsume(consumer);
      this.didUnconsume(consumer);
      if (newConsumers.length === 0) {
        this.stopConsuming();
      }
    }
  }

  protected willUnconsume(consumer: ConsumerType<this>): void {
    // hook
  }

  protected onUnconsume(consumer: ConsumerType<this>): void {
    // hook
  }

  protected didUnconsume(consumer: ConsumerType<this>): void {
    // hook
  }

  get consuming(): boolean {
    return (this.flags & Trait.ConsumingFlag) !== 0;
  }

  get startConsumingFlags(): ModelFlags {
    return (this.constructor as typeof Trait).StartConsumingFlags;
  }

  protected startConsuming(): void {
    if ((this.flags & Trait.ConsumingFlag) === 0) {
      this.willStartConsuming();
      this.setFlags(this.flags | Trait.ConsumingFlag);
      this.onStartConsuming();
      this.didStartConsuming();
    }
  }

  protected willStartConsuming(): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitWillStartConsuming !== void 0) {
        observer.traitWillStartConsuming(this);
      }
    }
  }

  protected onStartConsuming(): void {
    this.requireUpdate(this.startConsumingFlags);
    this.startConsumingFasteners();
  }

  protected didStartConsuming(): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitDidStartConsuming !== void 0) {
        observer.traitDidStartConsuming(this);
      }
    }
  }

  get stopConsumingFlags(): ModelFlags {
    return (this.constructor as typeof Trait).StopConsumingFlags;
  }

  protected stopConsuming(): void {
    if ((this.flags & Trait.ConsumingFlag) !== 0) {
      this.willStopConsuming();
      this.setFlags(this.flags & ~Trait.ConsumingFlag);
      this.onStopConsuming();
      this.didStopConsuming();
    }
  }

  protected willStopConsuming(): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitWillStopConsuming !== void 0) {
        observer.traitWillStopConsuming(this);
      }
    }
  }

  protected onStopConsuming(): void {
    this.requireUpdate(this.stopConsumingFlags);
    this.stopConsumingFasteners();
  }

  protected didStopConsuming(): void {
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.traitDidStopConsuming !== void 0) {
        observer.traitDidStopConsuming(this);
      }
    }
  }

  /** @internal */
  protected startConsumingFasteners(): void {
    const fasteners = this.fasteners;
    for (const fastenerName in fasteners) {
      const fastener = fasteners[fastenerName]!;
      if (fastener instanceof WarpDownlink && fastener.consumed === true) {
        fastener.consume(this);
      }
    }
  }

  /** @internal */
  protected stopConsumingFasteners(): void {
    const fasteners = this.fasteners;
    for (const fastenerName in fasteners) {
      const fastener = fasteners[fastenerName]!;
      if (fastener instanceof WarpDownlink && fastener.consumed === true) {
        fastener.unconsume(this);
      }
    }
  }

  get modelContext(): TraitContextType<this> | null {
    const model = this.model;
    return model !== null ? model.modelContext as TraitContextType<this> : null;
  }

  /** @override */
  equals(that: unknown): boolean {
    return this === that;
  }

  /** @override */
  hashCode(): number {
    return this.uid;
  }

  /** @override */
  init(init: TraitInit): void {
    // hook
  }

  static create<S extends new () => InstanceType<S>>(this: S): InstanceType<S> {
    return new this();
  }

  static fromInit<S extends Class<Instance<S, Trait>>>(this: S, init: InitType<InstanceType<S>>): InstanceType<S> {
    let type: Creatable<Trait>;
    if ((typeof init === "object" && init !== null || typeof init === "function") && Creatable.is((init as TraitInit).type)) {
      type = (init as TraitInit).type!;
    } else {
      type = this as unknown as Creatable<Trait>;
    }
    const view = type.create();
    view.init(init as TraitInit);
    return view as InstanceType<S>;
  }

  static fromAny<S extends Class<Instance<S, Trait>>>(this: S, value: AnyTrait<InstanceType<S>>): InstanceType<S> {
    if (value === void 0 || value === null) {
      return value as InstanceType<S>;
    } else if (value instanceof Trait) {
      if (value instanceof this) {
        return value;
      } else {
        throw new TypeError(value + " not an instance of " + this);
      }
    } else if (Creatable.is(value)) {
      return (value as Creatable<InstanceType<S>>).create();
    } else {
      return (this as unknown as TraitFactory<InstanceType<S>>).fromInit(value);
    }
  }

  /** @internal */
  static uid: () => number = (function () {
    let nextId = 1;
    return function uid(): number {
      const id = ~~nextId;
      nextId += 1;
      return id;
    }
  })();

  /** @internal */
  static readonly MountedFlag: TraitFlags = 1 << 0;
  /** @internal */
  static readonly ConsumingFlag: TraitFlags = 1 << 1;

  /** @internal */
  static readonly FlagShift: number = 2;
  /** @internal */
  static readonly FlagMask: ModelFlags = (1 << Trait.FlagShift) - 1;

  static readonly MountFlags: ModelFlags = 0;
  static readonly InsertChildFlags: ModelFlags = 0;
  static readonly RemoveChildFlags: ModelFlags = 0;
  static readonly InsertTraitFlags: ModelFlags = 0;
  static readonly RemoveTraitFlags: ModelFlags = 0;
  static readonly StartConsumingFlags: TraitFlags = 0;
  static readonly StopConsumingFlags: TraitFlags = 0;
}
