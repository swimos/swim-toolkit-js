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
import type {AnyModel, Model} from "./Model";
import {
  ModelRelationRefinement,
  ModelRelationTemplate,
  ModelRelationClass,
  ModelRelation,
} from "./ModelRelation";

/** @public */
export interface ModelSetRefinement extends ModelRelationRefinement {
}

/** @public */
export type ModelSetModel<R extends ModelSetRefinement | ModelSet<any, any>, D = Model> =
  R extends {model: infer M} ? M :
  R extends {extends: infer E} ? ModelSetModel<E, D> :
  R extends ModelSet<any, infer M> ? M :
  D;

/** @public */
export interface ModelSetTemplate<M extends Model = Model> extends ModelRelationTemplate<M> {
  extends?: Proto<ModelSet<any, any>> | string | boolean | null;
  sorted?: boolean;
}

/** @public */
export interface ModelSetClass<F extends ModelSet<any, any> = ModelSet<any, any>> extends ModelRelationClass<F> {
  /** @override */
  specialize(className: string, template: ModelSetTemplate): ModelSetClass;

  /** @override */
  refine(fastenerClass: ModelSetClass): void;

  /** @override */
  extend(className: string, template: ModelSetTemplate): ModelSetClass<F>;

  /** @override */
  specify<O, M extends Model = Model>(className: string, template: ThisType<ModelSet<O, M>> & ModelSetTemplate<M> & Partial<Omit<ModelSet<O, M>, keyof ModelSetTemplate>>): ModelSetClass<F>;

  /** @override */
  <O, M extends Model = Model>(template: ThisType<ModelSet<O, M>> & ModelSetTemplate<M> & Partial<Omit<ModelSet<O, M>, keyof ModelSetTemplate>>): PropertyDecorator;

  /** @internal */
  readonly SortedFlag: FastenerFlags;

  /** @internal @override */
  readonly FlagShift: number;
  /** @internal @override */
  readonly FlagMask: FastenerFlags;
}

/** @public */
export type ModelSetDef<O, R extends ModelSetRefinement> =
  ModelSet<O, ModelSetModel<R>> &
  {readonly name: string} & // prevent type alias simplification
  (R extends {extends: infer E} ? E : {}) &
  (R extends {defines: infer I} ? I : {}) &
  (R extends {implements: infer I} ? I : {}) &
  (R extends {observes: infer B} ? ObserverType<B extends boolean ? ModelSetModel<R> : B> : {});

/** @public */
export function ModelSetDef<F extends ModelSet<any, any>>(
  template: F extends ModelSetDef<infer O, infer R>
          ? ThisType<ModelSetDef<O, R>>
          & ModelSetTemplate<ModelSetModel<R>>
          & Partial<Omit<ModelSet<O, ModelSetModel<R>>, keyof ModelSetTemplate>>
          & (R extends {extends: infer E} ? (Partial<Omit<E, keyof ModelSetTemplate>> & {extends: unknown}) : {})
          & (R extends {defines: infer I} ? Partial<I> : {})
          & (R extends {implements: infer I} ? I : {})
          & (R extends {observes: infer B} ? (ObserverType<B extends boolean ? ModelSetModel<R> : B> & {observes: boolean}) : {})
          : never
): PropertyDecorator {
  return ModelSet(template);
}

/** @public */
export interface ModelSet<O = unknown, M extends Model = Model> extends ModelRelation<O, M> {
  (model: AnyModel<M>): O;

  /** @override */
  get fastenerType(): Proto<ModelSet<any, any>>;

  /** @internal @override */
  getSuper(): ModelSet<unknown, M> | null;

  /** @internal @override */
  setDerived(derived: boolean, inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  willDerive(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  onDerive(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  didDerive(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  willUnderive(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  onUnderive(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  didUnderive(inlet: ModelSet<unknown, M>): void;

  /** @override */
  readonly inlet: ModelSet<unknown, M> | null;

  /** @protected @override */
  willBindInlet(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  onBindInlet(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  didBindInlet(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  willUnbindInlet(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  onUnbindInlet(inlet: ModelSet<unknown, M>): void;

  /** @protected @override */
  didUnbindInlet(inlet: ModelSet<unknown, M>): void;

  /** @internal */
  readonly outlets: ReadonlyArray<ModelSet<unknown, M>> | null;

  /** @internal @override */
  attachOutlet(outlet: ModelSet<unknown, M>): void;

  /** @internal @override */
  detachOutlet(outlet: ModelSet<unknown, M>): void;

  /** @internal */
  readonly models: {readonly [modelId: number]: M | undefined};

  readonly modelCount: number;

  hasModel(model: Model): boolean;

  addModel(model?: AnyModel<M>, target?: Model | null, key?: string): M;

  addModels(models: {readonly [modelId: number]: M | undefined}, target?: Model | null): void;

  setModels(models: {readonly [modelId: number]: M | undefined}, target?: Model | null): void;

  attachModel(model?: AnyModel<M>, target?: Model | null): M;

  attachModels(models: {readonly [modelId: number]: M | undefined}, target?: Model | null): void;

  detachModel(model: M): M | null;

  detachModels(models?: {readonly [modelId: number]: M | undefined}): void;

  insertModel(parent?: Model | null, model?: AnyModel<M>, target?: Model | null, key?: string): M;

  insertModels(parent: Model | null, models: {readonly [modelId: number]: M | undefined}, target?: Model | null): void;

  removeModel(model: M): M | null;

  removeModels(models?: {readonly [modelId: number]: M | undefined}): void;

  deleteModel(model: M): M | null;

  deleteModels(models?: {readonly [modelId: number]: M | undefined}): void;

  /** @internal @override */
  bindModel(model: Model, target: Model | null): void;

  /** @internal @override */
  unbindModel(model: Model): void;

  /** @override */
  detectModel(model: Model): M | null;

  consumeModels(consumer: ConsumerType<M>): void;

  unconsumeModels(consumer: ConsumerType<M>): void;

  /** @internal @protected */
  decohereOutlets(): void;

  /** @internal @protected */
  decohereOutlet(outlet: ModelSet<unknown, M>): void;

  /** @override */
  recohere(t: number): void;

  /** @internal @protected */
  modelKey(model: M): string | undefined;

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
  compareChildren(a: Model, b: Model): number;

  /** @internal @protected */
  compare(a: M, b: M): number;
}

/** @public */
export const ModelSet = (function (_super: typeof ModelRelation) {
  const ModelSet = _super.extend("ModelSet", {}) as ModelSetClass;

  Object.defineProperty(ModelSet.prototype, "fastenerType", {
    value: ModelSet,
    configurable: true,
  });

  ModelSet.prototype.onDerive = function (this: ModelSet, inlet: ModelSet): void {
    this.setModels(inlet.models);
  };

  ModelSet.prototype.onBindInlet = function <M extends Model>(this: ModelSet<unknown, M>, inlet: ModelSet<unknown, M>): void {
    (this as Mutable<typeof this>).inlet = inlet;
    _super.prototype.onBindInlet.call(this, inlet);
  };

  ModelSet.prototype.onUnbindInlet = function <M extends Model>(this: ModelSet<unknown, M>, inlet: ModelSet<unknown, M>): void {
    _super.prototype.onUnbindInlet.call(this, inlet);
    (this as Mutable<typeof this>).inlet = null;
  };

  ModelSet.prototype.attachOutlet = function <M extends Model>(this: ModelSet<unknown, M>, outlet: ModelSet<unknown, M>): void {
    let outlets = this.outlets as ModelSet<unknown, M>[] | null;
    if (outlets === null) {
      outlets = [];
      (this as Mutable<typeof this>).outlets = outlets;
    }
    outlets.push(outlet);
  };

  ModelSet.prototype.detachOutlet = function <M extends Model>(this: ModelSet<unknown, M>, outlet: ModelSet<unknown, M>): void {
    const outlets = this.outlets as ModelSet<unknown, M>[] | null;
    if (outlets !== null) {
      const index = outlets.indexOf(outlet);
      if (index >= 0) {
        outlets.splice(index, 1);
      }
    }
  };

  ModelSet.prototype.hasModel = function (this: ModelSet, model: Model): boolean {
    return this.models[model.uid] !== void 0;
  };

  ModelSet.prototype.addModel = function <M extends Model>(this: ModelSet<unknown, M>, newModel?: AnyModel<M>, target?: Model | null, key?: string): M {
    if (newModel !== void 0 && newModel !== null) {
      newModel = this.fromAny(newModel);
    } else {
      newModel = this.createModel();
    }
    if (target === void 0) {
      target = null;
    }
    let parent: Model | null;
    if (this.binds && (parent = this.parentModel, parent !== null)) {
      if (key === void 0) {
        key = this.modelKey(newModel);
      }
      this.insertChild(parent, newModel, target, key);
    }
    const models = this.models as {[modelId: number]: M | undefined};
    if (models[newModel.uid] === void 0) {
      models[newModel.uid] = newModel;
      (this as Mutable<typeof this>).modelCount += 1;
      this.willAttachModel(newModel, target);
      this.onAttachModel(newModel, target);
      this.initModel(newModel);
      this.didAttachModel(newModel, target);
      this.setCoherent(true);
      this.decohereOutlets();
    }
    return newModel;
  };

  ModelSet.prototype.addModels = function <M extends Model>(this: ModelSet, newModels: {readonly [modelId: number]: M | undefined}, target?: Model | null): void {
    for (const modelId in newModels) {
      this.addModel(newModels[modelId]!, target);
    }
  };

  ModelSet.prototype.setModels = function <M extends Model>(this: ModelSet, newModels: {readonly [modelId: number]: M | undefined}, target?: Model | null): void {
    const models = this.models;
    for (const modelId in models) {
      if (newModels[modelId] === void 0) {
        this.detachModel(models[modelId]!);
      }
    }
    for (const modelId in newModels) {
      if (models[modelId] === void 0) {
        this.attachModel(newModels[modelId]!, target);
      }
    }
  };

  ModelSet.prototype.attachModel = function <M extends Model>(this: ModelSet<unknown, M>, newModel?: AnyModel<M>, target?: Model | null): M {
    if (newModel !== void 0 && newModel !== null) {
      newModel = this.fromAny(newModel);
    } else {
      newModel = this.createModel();
    }
    const models = this.models as {[modelId: number]: M | undefined};
    if (models[newModel.uid] === void 0) {
      if (target === void 0) {
        target = null;
      }
      models[newModel.uid] = newModel;
      (this as Mutable<typeof this>).modelCount += 1;
      this.willAttachModel(newModel, target);
      this.onAttachModel(newModel, target);
      this.initModel(newModel);
      this.didAttachModel(newModel, target);
      this.setCoherent(true);
      this.decohereOutlets();
    }
    return newModel;
  };

  ModelSet.prototype.attachModels = function <M extends Model>(this: ModelSet, newModels: {readonly [modelId: number]: M | undefined}, target?: Model | null): void {
    for (const modelId in newModels) {
      this.attachModel(newModels[modelId]!, target);
    }
  };

  ModelSet.prototype.detachModel = function <M extends Model>(this: ModelSet<unknown, M>, oldModel: M): M | null {
    const models = this.models as {[modelId: number]: M | undefined};
    if (models[oldModel.uid] !== void 0) {
      (this as Mutable<typeof this>).modelCount -= 1;
      delete models[oldModel.uid];
      this.willDetachModel(oldModel);
      this.onDetachModel(oldModel);
      this.deinitModel(oldModel);
      this.didDetachModel(oldModel);
      this.setCoherent(true);
      this.decohereOutlets();
      return oldModel;
    }
    return null;
  };

  ModelSet.prototype.detachModels = function <M extends Model>(this: ModelSet<unknown, M>, models?: {readonly [modelId: number]: M | undefined}): void {
    if (models === void 0) {
      models = this.models;
    }
    for (const modelId in models) {
      this.detachModel(models[modelId]!);
    }
  };

  ModelSet.prototype.insertModel = function <M extends Model>(this: ModelSet<unknown, M>, parent?: Model | null, newModel?: AnyModel<M>, target?: Model | null, key?: string): M {
    if (newModel !== void 0 && newModel !== null) {
      newModel = this.fromAny(newModel);
    } else {
      newModel = this.createModel();
    }
    if (parent === void 0 || parent === null) {
      parent = this.parentModel;
    }
    if (target === void 0) {
      target = null;
    }
    if (key === void 0) {
      key = this.modelKey(newModel);
    }
    if (parent !== null && (newModel.parent !== parent || newModel.key !== key)) {
      this.insertChild(parent, newModel, target, key);
    }
    const models = this.models as {[modelId: number]: M | undefined};
    if (models[newModel.uid] === void 0) {
      models[newModel.uid] = newModel;
      (this as Mutable<typeof this>).modelCount += 1;
      this.willAttachModel(newModel, target);
      this.onAttachModel(newModel, target);
      this.initModel(newModel);
      this.didAttachModel(newModel, target);
      this.setCoherent(true);
      this.decohereOutlets();
    }
    return newModel;
  };

  ModelSet.prototype.insertModels = function <M extends Model>(this: ModelSet, parent: Model | null, newModels: {readonly [modelId: number]: M | undefined}, target?: Model | null): void {
    for (const modelId in newModels) {
      this.insertModel(parent, newModels[modelId]!, target);
    }
  };

  ModelSet.prototype.removeModel = function <M extends Model>(this: ModelSet<unknown, M>, model: M): M | null {
    if (this.hasModel(model)) {
      model.remove();
      return model;
    }
    return null;
  };

  ModelSet.prototype.removeModels = function <M extends Model>(this: ModelSet<unknown, M>, models?: {readonly [modelId: number]: M | undefined}): void {
    if (models === void 0) {
      models = this.models;
    }
    for (const modelId in models) {
      this.removeModel(models[modelId]!);
    }
  };

  ModelSet.prototype.deleteModel = function <M extends Model>(this: ModelSet<unknown, M>, model: M): M | null {
    const oldModel = this.detachModel(model);
    if (oldModel !== null) {
      oldModel.remove();
    }
    return oldModel;
  };

  ModelSet.prototype.deleteModels = function <M extends Model>(this: ModelSet<unknown, M>, models?: {readonly [modelId: number]: M | undefined}): void {
    if (models === void 0) {
      models = this.models;
    }
    for (const modelId in models) {
      this.deleteModel(models[modelId]!);
    }
  };

  ModelSet.prototype.bindModel = function <M extends Model>(this: ModelSet<unknown, M>, model: Model, target: Model | null): void {
    if (this.binds) {
      const newModel = this.detectModel(model);
      const models = this.models as {[modelId: number]: M | undefined};
      if (newModel !== null && models[newModel.uid] === void 0) {
        models[newModel.uid] = newModel;
        (this as Mutable<typeof this>).modelCount += 1;
        this.willAttachModel(newModel, target);
        this.onAttachModel(newModel, target);
        this.initModel(newModel);
        this.didAttachModel(newModel, target);
        this.setCoherent(true);
        this.decohereOutlets();
      }
    }
  };

  ModelSet.prototype.unbindModel = function <M extends Model>(this: ModelSet<unknown, M>, model: Model): void {
    if (this.binds) {
      const oldModel = this.detectModel(model);
      const models = this.models as {[modelId: number]: M | undefined};
      if (oldModel !== null && models[oldModel.uid] !== void 0) {
        (this as Mutable<typeof this>).modelCount -= 1;
        delete models[oldModel.uid];
        this.willDetachModel(oldModel);
        this.onDetachModel(oldModel);
        this.deinitModel(oldModel);
        this.didDetachModel(oldModel);
        this.setCoherent(true);
        this.decohereOutlets();
      }
    }
  };

  ModelSet.prototype.detectModel = function <M extends Model>(this: ModelSet<unknown, M>, model: Model): M | null {
    if (typeof this.modelType === "function" && model instanceof this.modelType) {
      return model as M;
    }
    return null;
  };

  ModelSet.prototype.consumeModels = function <M extends Model>(this: ModelSet<unknown, M>, consumer: ConsumerType<M>): void {
    const models = this.models;
    for (const modelId in models) {
      const model = models[modelId]!;
      model.consume(consumer);
    }
  };

  ModelSet.prototype.unconsumeModels = function <M extends Model>(this: ModelSet<unknown, M>, consumer: ConsumerType<M>): void {
    const models = this.models;
    for (const modelId in models) {
      const model = models[modelId]!;
      model.unconsume(consumer);
    }
  };

  ModelSet.prototype.decohereOutlets = function (this: ModelSet): void {
    const outlets = this.outlets;
    for (let i = 0, n = outlets !== null ? outlets.length : 0; i < n; i += 1) {
      this.decohereOutlet(outlets![i]!);
    }
  };

  ModelSet.prototype.decohereOutlet = function (this: ModelSet, outlet: ModelSet): void {
    if ((outlet.flags & Fastener.DerivedFlag) === 0 && Math.min(this.flags & Affinity.Mask, Affinity.Intrinsic) >= (outlet.flags & Affinity.Mask)) {
      outlet.setDerived(true, this);
    } else if ((outlet.flags & Fastener.DerivedFlag) !== 0 && (outlet.flags & Fastener.DecoherentFlag) === 0) {
      outlet.setCoherent(false);
      outlet.decohere();
    }
  };

  ModelSet.prototype.recohere = function (this: ModelSet, t: number): void {
    if ((this.flags & Fastener.DerivedFlag) !== 0) {
      const inlet = this.inlet;
      if (inlet !== null) {
        this.setModels(inlet.models);
      }
    }
  };

  ModelSet.prototype.modelKey = function <M extends Model>(this: ModelSet<unknown, M>, model: M): string | undefined {
    return void 0;
  };

  ModelSet.prototype.initSorted = function (this: ModelSet, sorted: boolean): void {
    if (sorted) {
      (this as Mutable<typeof this>).flags = this.flags | ModelSet.SortedFlag;
    } else {
      (this as Mutable<typeof this>).flags = this.flags & ~ModelSet.SortedFlag;
    }
  };

  Object.defineProperty(ModelSet.prototype, "sorted", {
    get(this: ModelSet): boolean {
      return (this.flags & ModelSet.SortedFlag) !== 0;
    },
    configurable: true,
  });

  ModelSet.prototype.sort = function (this: ModelSet, sorted?: boolean): typeof this {
    if (sorted === void 0) {
      sorted = true;
    }
    const flags = this.flags;
    if (sorted && (flags & ModelSet.SortedFlag) === 0) {
      const parent = this.parentModel;
      this.willSort(parent);
      this.setFlags(flags | ModelSet.SortedFlag);
      this.onSort(parent);
      this.didSort(parent);
    } else if (!sorted && (flags & ModelSet.SortedFlag) !== 0) {
      this.setFlags(flags & ~ModelSet.SortedFlag);
    }
    return this;
  };

  ModelSet.prototype.willSort = function (this: ModelSet, parent: Model | null): void {
    // hook
  };

  ModelSet.prototype.onSort = function (this: ModelSet, parent: Model | null): void {
    if (parent !== null) {
      this.sortChildren(parent);
    }
  };

  ModelSet.prototype.didSort = function (this: ModelSet, parent: Model | null): void {
    // hook
  };

  ModelSet.prototype.sortChildren = function <M extends Model>(this: ModelSet<unknown, M>, parent: Model): void {
    parent.sortChildren(this.compareChildren.bind(this));
  };

  ModelSet.prototype.compareChildren = function <M extends Model>(this: ModelSet<unknown, M>, a: Model, b: Model): number {
    const models = this.models;
    const x = models[a.uid];
    const y = models[b.uid];
    if (x !== void 0 && y !== void 0) {
      return this.compare(x, y);
    } else {
      return x !== void 0 ? 1 : y !== void 0 ? -1 : 0;
    }
  };

  ModelSet.prototype.compare = function <M extends Model>(this: ModelSet<unknown, M>, a: M, b: M): number {
    return a.uid < b.uid ? -1 : a.uid > b.uid ? 1 : 0;
  };

  ModelSet.construct = function <F extends ModelSet<any, any>>(fastener: F | null, owner: FastenerOwner<F>): F {
    if (fastener === null) {
      fastener = function (newModel: AnyModel<ModelSetModel<F>>): FastenerOwner<F> {
        fastener!.addModel(newModel);
        return fastener!.owner;
      } as F;
      delete (fastener as Partial<Mutable<F>>).name; // don't clobber prototype name
      Object.setPrototypeOf(fastener, this.prototype);
    }
    fastener = _super.construct.call(this, fastener, owner) as F;
    const flagsInit = fastener.flagsInit;
    if (flagsInit !== void 0) {
      fastener.initSorted((flagsInit & ModelSet.SortedFlag) !== 0);
    }
    Object.defineProperty(fastener, "inlet", { // override getter
      value: null,
      writable: true,
      enumerable: true,
      configurable: true,
    });
    (fastener as Mutable<typeof fastener>).outlets = null;
    (fastener as Mutable<typeof fastener>).models = {};
    (fastener as Mutable<typeof fastener>).modelCount = 0;
    return fastener;
  };

  ModelSet.refine = function (fastenerClass: ModelSetClass): void {
    _super.refine.call(this, fastenerClass);
    const fastenerPrototype = fastenerClass.prototype;
    let flagsInit = fastenerPrototype.flagsInit;

    if (Object.prototype.hasOwnProperty.call(fastenerPrototype, "sorted")) {
      if (flagsInit === void 0) {
        flagsInit = 0;
      }
      if (fastenerPrototype.sorted) {
        flagsInit |= ModelSet.SortedFlag;
      } else {
        flagsInit &= ~ModelSet.SortedFlag;
      }
      delete (fastenerPrototype as ModelSetTemplate).sorted;
    }

    if (flagsInit !== void 0) {
      Object.defineProperty(fastenerPrototype, "flagsInit", {
        value: flagsInit,
        configurable: true,
      });
    }
  };

  (ModelSet as Mutable<typeof ModelSet>).SortedFlag = 1 << (_super.FlagShift + 0);

  (ModelSet as Mutable<typeof ModelSet>).FlagShift = _super.FlagShift + 1;
  (ModelSet as Mutable<typeof ModelSet>).FlagMask = (1 << ModelSet.FlagShift) - 1;

  return ModelSet;
})(ModelRelation);
