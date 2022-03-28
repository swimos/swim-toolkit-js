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

import type {Mutable, Proto, ObserverType} from "@swim/util";
import {Affinity, FastenerOwner, FastenerFlags, Fastener} from "@swim/component";
import type {AnyView, View} from "./View";
import {ViewRelationInit, ViewRelationClass, ViewRelation} from "./ViewRelation";

/** @internal */
export type ViewSetType<F extends ViewSet<any, any>> =
  F extends ViewSet<any, infer V> ? V : never;

/** @public */
export interface ViewSetInit<V extends View = View> extends ViewRelationInit<V> {
  extends?: {prototype: ViewSet<any, any>} | string | boolean | null;
  key?(view: V): string | undefined;
  compare?(a: V, b: V): number;

  sorted?: boolean;
  willSort?(parent: View | null): void;
  didSort?(parent: View | null): void;
  sortChildren?(parent: View): void;
  compareChildren?(a: View, b: View): number;

  willInherit?(superFastener: ViewSet<unknown, V>): void;
  didInherit?(superFastener: ViewSet<unknown, V>): void;
  willUninherit?(superFastener: ViewSet<unknown, V>): void;
  didUninherit?(superFastener: ViewSet<unknown, V>): void;

  willBindSuperFastener?(superFastener: ViewSet<unknown, V>): void;
  didBindSuperFastener?(superFastener: ViewSet<unknown, V>): void;
  willUnbindSuperFastener?(superFastener: ViewSet<unknown, V>): void;
  didUnbindSuperFastener?(superFastener: ViewSet<unknown, V>): void;
}

/** @public */
export type ViewSetDescriptor<O = unknown, V extends View = View, I = {}> = ThisType<ViewSet<O, V> & I> & ViewSetInit<V> & Partial<I>;

/** @public */
export interface ViewSetClass<F extends ViewSet<any, any> = ViewSet<any, any>> extends ViewRelationClass<F> {
  /** @internal */
  readonly SortedFlag: FastenerFlags;

  /** @internal @override */
  readonly FlagShift: number;
  /** @internal @override */
  readonly FlagMask: FastenerFlags;
}

/** @public */
export interface ViewSetFactory<F extends ViewSet<any, any> = ViewSet<any, any>> extends ViewSetClass<F> {
  extend<I = {}>(className: string, classMembers?: Partial<I> | null): ViewSetFactory<F> & I;

  define<O, V extends View = View>(className: string, descriptor: ViewSetDescriptor<O, V>): ViewSetFactory<ViewSet<any, V>>;
  define<O, V extends View = View>(className: string, descriptor: {observes: boolean} & ViewSetDescriptor<O, V, ObserverType<V>>): ViewSetFactory<ViewSet<any, V>>;
  define<O, V extends View = View, I = {}>(className: string, descriptor: {implements: unknown} & ViewSetDescriptor<O, V, I>): ViewSetFactory<ViewSet<any, V> & I>;
  define<O, V extends View = View, I = {}>(className: string, descriptor: {implements: unknown; observes: boolean} & ViewSetDescriptor<O, V, I & ObserverType<V>>): ViewSetFactory<ViewSet<any, V> & I>;

  <O, V extends View = View>(descriptor: ViewSetDescriptor<O, V>): PropertyDecorator;
  <O, V extends View = View>(descriptor: {observes: boolean} & ViewSetDescriptor<O, V, ObserverType<V>>): PropertyDecorator;
  <O, V extends View = View, I = {}>(descriptor: {implements: unknown} & ViewSetDescriptor<O, V, I>): PropertyDecorator;
  <O, V extends View = View, I = {}>(descriptor: {implements: unknown; observes: boolean} & ViewSetDescriptor<O, V, I & ObserverType<V>>): PropertyDecorator;
}

/** @public */
export interface ViewSet<O = unknown, V extends View = View> extends ViewRelation<O, V> {
  (view: AnyView<V>): O;

  /** @override */
  get fastenerType(): Proto<ViewSet<any, any>>;

  /** @internal @override */
  setInherited(inherited: boolean, superFastener: ViewSet<unknown, V>): void;

  /** @protected @override */
  willInherit(superFastener: ViewSet<unknown, V>): void;

  /** @protected @override */
  onInherit(superFastener: ViewSet<unknown, V>): void;

  /** @protected @override */
  didInherit(superFastener: ViewSet<unknown, V>): void;

  /** @protected @override */
  willUninherit(superFastener: ViewSet<unknown, V>): void;

  /** @protected @override */
  onUninherit(superFastener: ViewSet<unknown, V>): void;

  /** @protected @override */
  didUninherit(superFastener: ViewSet<unknown, V>): void;

  /** @override */
  readonly superFastener: ViewSet<unknown, V> | null;

  /** @internal @override */
  getSuperFastener(): ViewSet<unknown, V> | null;

  /** @protected @override */
  willBindSuperFastener(superFastener: ViewSet<unknown, V>): void;

  /** @protected @override */
  onBindSuperFastener(superFastener: ViewSet<unknown, V>): void;

  /** @protected @override */
  didBindSuperFastener(superFastener: ViewSet<unknown, V>): void;

  /** @protected @override */
  willUnbindSuperFastener(superFastener: ViewSet<unknown, V>): void;

  /** @protected @override */
  onUnbindSuperFastener(superFastener: ViewSet<unknown, V>): void;

  /** @protected @override */
  didUnbindSuperFastener(superFastener: ViewSet<unknown, V>): void;

  /** @internal */
  readonly subFasteners: ReadonlyArray<ViewSet<unknown, V>> | null;

  /** @internal @override */
  attachSubFastener(subFastener: ViewSet<unknown, V>): void;

  /** @internal @override */
  detachSubFastener(subFastener: ViewSet<unknown, V>): void;

  /** @internal */
  readonly views: {readonly [viewId: number]: V | undefined};

  readonly viewCount: number;

  hasView(view: View): boolean;

  addView(view?: AnyView<V>, target?: View | null, key?: string): V;

  addViews(views: {readonly [viewId: number]: V | undefined}, target?: View | null): void;

  setViews(views: {readonly [viewId: number]: V | undefined}, target?: View | null): void;

  attachView(view?: AnyView<V>, target?: View | null): V;

  attachViews(views: {readonly [viewId: number]: V | undefined}, target?: View | null): void;

  detachView(view: V): V | null;

  detachViews(views?: {readonly [viewId: number]: V | undefined}): void;

  insertView(parent?: View | null, view?: AnyView<V>, target?: View | null, key?: string): V;

  insertViews(parent: View | null, views: {readonly [viewId: number]: V | undefined}, target?: View | null): void;

  removeView(view: V): V | null;

  removeViews(views?: {readonly [viewId: number]: V | undefined}): void;

  deleteView(view: V): V | null;

  deleteViews(views?: {readonly [viewId: number]: V | undefined}): void;

  /** @internal @override */
  bindView(view: View, target: View | null): void;

  /** @internal @override */
  unbindView(view: View): void;

  /** @override */
  detectView(view: View): V | null;

  /** @internal @protected */
  decohereSubFasteners(): void;

  /** @internal @protected */
  decohereSubFastener(subFastener: ViewSet<unknown, V>): void;

  /** @override */
  recohere(t: number): void;

  /** @internal @protected */
  key(view: V): string | undefined;

  get sorted(): boolean;

  /** @internal */
  initSorted(sorted: boolean): void;

  sort(sorted?: boolean): this;

  /** @protected */
  willSort(parent: View | null): void;

  /** @protected */
  onSort(parent: View | null): void;

  /** @protected */
  didSort(parent: View | null): void;

  /** @internal @protected */
  sortChildren(parent: View): void;

  /** @internal */
  compareChildren(a: View, b: View): number;

  /** @internal @protected */
  compare(a: V, b: V): number;
}

/** @public */
export const ViewSet = (function (_super: typeof ViewRelation) {
  const ViewSet: ViewSetFactory = _super.extend("ViewSet");

  Object.defineProperty(ViewSet.prototype, "fastenerType", {
    get: function (this: ViewSet): Proto<ViewSet<any, any>> {
      return ViewSet;
    },
    configurable: true,
  });

  ViewSet.prototype.onInherit = function (this: ViewSet, superFastener: ViewSet): void {
    this.setViews(superFastener.views);
  };

  ViewSet.prototype.onBindSuperFastener = function <V extends View>(this: ViewSet<unknown, V>, superFastener: ViewSet<unknown, V>): void {
    (this as Mutable<typeof this>).superFastener = superFastener;
    _super.prototype.onBindSuperFastener.call(this, superFastener);
  };

  ViewSet.prototype.onUnbindSuperFastener = function <V extends View>(this: ViewSet<unknown, V>, superFastener: ViewSet<unknown, V>): void {
    _super.prototype.onUnbindSuperFastener.call(this, superFastener);
    (this as Mutable<typeof this>).superFastener = null;
  };

  ViewSet.prototype.attachSubFastener = function <V extends View>(this: ViewSet<unknown, V>, subFastener: ViewSet<unknown, V>): void {
    let subFasteners = this.subFasteners as ViewSet<unknown, V>[] | null;
    if (subFasteners === null) {
      subFasteners = [];
      (this as Mutable<typeof this>).subFasteners = subFasteners;
    }
    subFasteners.push(subFastener);
  };

  ViewSet.prototype.detachSubFastener = function <V extends View>(this: ViewSet<unknown, V>, subFastener: ViewSet<unknown, V>): void {
    const subFasteners = this.subFasteners as ViewSet<unknown, V>[] | null;
    if (subFasteners !== null) {
      const index = subFasteners.indexOf(subFastener);
      if (index >= 0) {
        subFasteners.splice(index, 1);
      }
    }
  };

  ViewSet.prototype.hasView = function (this: ViewSet, view: View): boolean {
    return this.views[view.uid] !== void 0;
  };

  ViewSet.prototype.addView = function <V extends View>(this: ViewSet<unknown, V>, newView?: AnyView<V>, target?: View | null, key?: string): V {
    if (newView !== void 0 && newView !== null) {
      newView = this.fromAny(newView);
    } else {
      newView = this.createView();
    }
    if (target === void 0) {
      target = null;
    }
    let parent: View | null;
    if (this.binds && (parent = this.parentView, parent !== null)) {
      if (key === void 0) {
        key = this.key(newView);
      }
      this.insertChild(parent, newView, target, key);
    }
    const views = this.views as {[viewId: number]: V | undefined};
    if (views[newView.uid] === void 0) {
      views[newView.uid] = newView;
      (this as Mutable<typeof this>).viewCount += 1;
      this.willAttachView(newView, target);
      this.onAttachView(newView, target);
      this.initView(newView);
      this.didAttachView(newView, target);
      this.setCoherent(true);
      this.decohereSubFasteners();
    }
    return newView;
  };

  ViewSet.prototype.addViews = function <V extends View>(this: ViewSet, newViews: {readonly [viewId: number]: V | undefined}, target?: View | null): void {
    for (const viewId in newViews) {
      this.addView(newViews[viewId]!, target);
    }
  };

  ViewSet.prototype.setViews = function <V extends View>(this: ViewSet, newViews: {readonly [viewId: number]: V | undefined}, target?: View | null): void {
    const views = this.views;
    for (const viewId in views) {
      if (newViews[viewId] === void 0) {
        this.detachView(views[viewId]!);
      }
    }
    for (const viewId in newViews) {
      if (views[viewId] === void 0) {
        this.attachView(newViews[viewId]!, target);
      }
    }
  };

  ViewSet.prototype.attachView = function <V extends View>(this: ViewSet<unknown, V>, newView?: AnyView<V>, target?: View | null): V {
    if (newView !== void 0 && newView !== null) {
      newView = this.fromAny(newView);
    } else {
      newView = this.createView();
    }
    const views = this.views as {[viewId: number]: V | undefined};
    if (views[newView.uid] === void 0) {
      if (target === void 0) {
        target = null;
      }
      views[newView.uid] = newView;
      (this as Mutable<typeof this>).viewCount += 1;
      this.willAttachView(newView, target);
      this.onAttachView(newView, target);
      this.initView(newView);
      this.didAttachView(newView, target);
      this.setCoherent(true);
      this.decohereSubFasteners();
    }
    return newView;
  };

  ViewSet.prototype.attachViews = function <V extends View>(this: ViewSet, newViews: {readonly [viewId: number]: V | undefined}, target?: View | null): void {
    for (const viewId in newViews) {
      this.attachView(newViews[viewId]!, target);
    }
  };

  ViewSet.prototype.detachView = function <V extends View>(this: ViewSet<unknown, V>, oldView: V): V | null {
    const views = this.views as {[viewId: number]: V | undefined};
    if (views[oldView.uid] !== void 0) {
      (this as Mutable<typeof this>).viewCount -= 1;
      delete views[oldView.uid];
      this.willDetachView(oldView);
      this.onDetachView(oldView);
      this.deinitView(oldView);
      this.didDetachView(oldView);
      this.setCoherent(true);
      this.decohereSubFasteners();
      return oldView;
    }
    return null;
  };

  ViewSet.prototype.detachViews = function <V extends View>(this: ViewSet<unknown, V>, views?: {readonly [viewId: number]: V | undefined}): void {
    if (views === void 0) {
      views = this.views;
    }
    for (const viewId in views) {
      this.detachView(views[viewId]!);
    }
  };

  ViewSet.prototype.insertView = function <V extends View>(this: ViewSet<unknown, V>, parent?: View | null, newView?: AnyView<V>, target?: View | null, key?: string): V {
    if (newView !== void 0 && newView !== null) {
      newView = this.fromAny(newView);
    } else {
      newView = this.createView();
    }
    if (parent === void 0 || parent === null) {
      parent = this.parentView;
    }
    if (target === void 0) {
      target = null;
    }
    if (key === void 0) {
      key = this.key(newView);
    }
    if (parent !== null && (newView.parent !== parent || newView.key !== key)) {
      this.insertChild(parent, newView, target, key);
    }
    const views = this.views as {[viewId: number]: V | undefined};
    if (views[newView.uid] === void 0) {
      views[newView.uid] = newView;
      (this as Mutable<typeof this>).viewCount += 1;
      this.willAttachView(newView, target);
      this.onAttachView(newView, target);
      this.initView(newView);
      this.didAttachView(newView, target);
      this.setCoherent(true);
      this.decohereSubFasteners();
    }
    return newView;
  };

  ViewSet.prototype.insertViews = function <V extends View>(this: ViewSet, parent: View | null, newViews: {readonly [viewId: number]: V | undefined}, target?: View | null): void {
    for (const viewId in newViews) {
      this.insertView(parent, newViews[viewId]!, target);
    }
  };

  ViewSet.prototype.removeView = function <V extends View>(this: ViewSet<unknown, V>, view: V): V | null {
    if (this.hasView(view)) {
      view.remove();
      return view;
    }
    return null;
  };

  ViewSet.prototype.removeViews = function <V extends View>(this: ViewSet<unknown, V>, views?: {readonly [viewId: number]: V | undefined}): void {
    if (views === void 0) {
      views = this.views;
    }
    for (const viewId in views) {
      this.removeView(views[viewId]!);
    }
  };

  ViewSet.prototype.deleteView = function <V extends View>(this: ViewSet<unknown, V>, view: V): V | null {
    const oldView = this.detachView(view);
    if (oldView !== null) {
      oldView.remove();
    }
    return oldView;
  };

  ViewSet.prototype.deleteViews = function <V extends View>(this: ViewSet<unknown, V>, views?: {readonly [viewId: number]: V | undefined}): void {
    if (views === void 0) {
      views = this.views;
    }
    for (const viewId in views) {
      this.deleteView(views[viewId]!);
    }
  };

  ViewSet.prototype.bindView = function <V extends View>(this: ViewSet<unknown, V>, view: View, target: View | null): void {
    if (this.binds) {
      const newView = this.detectView(view);
      const views = this.views as {[viewId: number]: V | undefined};
      if (newView !== null && views[newView.uid] === void 0) {
        views[newView.uid] = newView;
        (this as Mutable<typeof this>).viewCount += 1;
        this.willAttachView(newView, target);
        this.onAttachView(newView, target);
        this.initView(newView);
        this.didAttachView(newView, target);
        this.setCoherent(true);
        this.decohereSubFasteners();
      }
    }
  };

  ViewSet.prototype.unbindView = function <V extends View>(this: ViewSet<unknown, V>, view: View): void {
    if (this.binds) {
      const oldView = this.detectView(view);
      const views = this.views as {[viewId: number]: V | undefined};
      if (oldView !== null && views[oldView.uid] !== void 0) {
        (this as Mutable<typeof this>).viewCount -= 1;
        delete views[oldView.uid];
        this.willDetachView(oldView);
        this.onDetachView(oldView);
        this.deinitView(oldView);
        this.didDetachView(oldView);
        this.setCoherent(true);
        this.decohereSubFasteners();
      }
    }
  };

  ViewSet.prototype.detectView = function <V extends View>(this: ViewSet<unknown, V>, view: View): V | null {
    if (typeof this.type === "function" && view instanceof this.type) {
      return view as V;
    }
    return null;
  };

  ViewSet.prototype.decohereSubFasteners = function (this: ViewSet): void {
    const subFasteners = this.subFasteners;
    for (let i = 0, n = subFasteners !== null ? subFasteners.length : 0; i < n; i += 1) {
      this.decohereSubFastener(subFasteners![i]!);
    }
  };

  ViewSet.prototype.decohereSubFastener = function (this: ViewSet, subFastener: ViewSet): void {
    if ((subFastener.flags & Fastener.InheritedFlag) === 0 && Math.min(this.flags & Affinity.Mask, Affinity.Intrinsic) >= (subFastener.flags & Affinity.Mask)) {
      subFastener.setInherited(true, this);
    } else if ((subFastener.flags & Fastener.InheritedFlag) !== 0 && (subFastener.flags & Fastener.DecoherentFlag) === 0) {
      subFastener.setCoherent(false);
      subFastener.decohere();
    }
  };

  ViewSet.prototype.recohere = function (this: ViewSet, t: number): void {
    if ((this.flags & Fastener.InheritedFlag) !== 0) {
      const superFastener = this.superFastener;
      if (superFastener !== null) {
        this.setViews(superFastener.views);
      }
    }
  };

  ViewSet.prototype.key = function <V extends View>(this: ViewSet<unknown, V>, view: V): string | undefined {
    return void 0;
  };

  Object.defineProperty(ViewSet.prototype, "sorted", {
    get(this: ViewSet): boolean {
      return (this.flags & ViewSet.SortedFlag) !== 0;
    },
    configurable: true,
  });

  ViewSet.prototype.initSorted = function (this: ViewSet, sorted: boolean): void {
    if (sorted) {
      (this as Mutable<typeof this>).flags = this.flags | ViewSet.SortedFlag;
    } else {
      (this as Mutable<typeof this>).flags = this.flags & ~ViewSet.SortedFlag;
    }
  };

  ViewSet.prototype.sort = function (this: ViewSet, sorted?: boolean): typeof this {
    if (sorted === void 0) {
      sorted = true;
    }
    const flags = this.flags;
    if (sorted && (flags & ViewSet.SortedFlag) === 0) {
      const parent = this.parentView;
      this.willSort(parent);
      this.setFlags(flags | ViewSet.SortedFlag);
      this.onSort(parent);
      this.didSort(parent);
    } else if (!sorted && (flags & ViewSet.SortedFlag) !== 0) {
      this.setFlags(flags & ~ViewSet.SortedFlag);
    }
    return this;
  };

  ViewSet.prototype.willSort = function (this: ViewSet, parent: View | null): void {
    // hook
  };

  ViewSet.prototype.onSort = function (this: ViewSet, parent: View | null): void {
    if (parent !== null) {
      this.sortChildren(parent);
    }
  };

  ViewSet.prototype.didSort = function (this: ViewSet, parent: View | null): void {
    // hook
  };

  ViewSet.prototype.sortChildren = function <V extends View>(this: ViewSet<unknown, V>, parent: View): void {
    parent.sortChildren(this.compareChildren.bind(this));
  };

  ViewSet.prototype.compareChildren = function <V extends View>(this: ViewSet<unknown, V>, a: View, b: View): number {
    const views = this.views;
    const x = views[a.uid];
    const y = views[b.uid];
    if (x !== void 0 && y !== void 0) {
      return this.compare(x, y);
    } else {
      return x !== void 0 ? 1 : y !== void 0 ? -1 : 0;
    }
  };

  ViewSet.prototype.compare = function <V extends View>(this: ViewSet<unknown, V>, a: V, b: V): number {
    return a.uid < b.uid ? -1 : a.uid > b.uid ? 1 : 0;
  };

  ViewSet.construct = function <F extends ViewSet<any, any>>(fastenerClass: {prototype: F}, fastener: F | null, owner: FastenerOwner<F>): F {
    if (fastener === null) {
      fastener = function (newView: AnyView<ViewSetType<F>>): FastenerOwner<F> {
        fastener!.addView(newView);
        return fastener!.owner;
      } as F;
      delete (fastener as Partial<Mutable<F>>).name; // don't clobber prototype name
      Object.setPrototypeOf(fastener, fastenerClass.prototype);
    }
    fastener = _super.construct(fastenerClass, fastener, owner) as F;
    Object.defineProperty(fastener, "superFastener", { // override getter
      value: null,
      writable: true,
      enumerable: true,
      configurable: true,
    });
    (fastener as Mutable<typeof fastener>).subFasteners = null;
    (fastener as Mutable<typeof fastener>).views = {};
    (fastener as Mutable<typeof fastener>).viewCount = 0;
    return fastener;
  };

  ViewSet.define = function <O, V extends View>(className: string, descriptor: ViewSetDescriptor<O, V>): ViewSetFactory<ViewSet<any, V>> {
    let superClass = descriptor.extends as ViewSetFactory | null | undefined;
    const affinity = descriptor.affinity;
    const inherits = descriptor.inherits;
    const sorted = descriptor.sorted;
    delete descriptor.extends;
    delete descriptor.implements;
    delete descriptor.affinity;
    delete descriptor.inherits;
    delete descriptor.sorted;

    if (superClass === void 0 || superClass === null) {
      superClass = this;
    }

    const fastenerClass = superClass.extend(className, descriptor);

    fastenerClass.construct = function (fastenerClass: {prototype: ViewSet<any, any>}, fastener: ViewSet<O, V> | null, owner: O): ViewSet<O, V> {
      fastener = superClass!.construct(fastenerClass, fastener, owner);
      if (affinity !== void 0) {
        fastener.initAffinity(affinity);
      }
      if (inherits !== void 0) {
        fastener.initInherits(inherits);
      }
      if (sorted !== void 0) {
        fastener.initSorted(sorted);
      }
      return fastener;
    };

    return fastenerClass;
  };

  (ViewSet as Mutable<typeof ViewSet>).SortedFlag = 1 << (_super.FlagShift + 0);

  (ViewSet as Mutable<typeof ViewSet>).FlagShift = _super.FlagShift + 1;
  (ViewSet as Mutable<typeof ViewSet>).FlagMask = (1 << ViewSet.FlagShift) - 1;

  return ViewSet;
})(ViewRelation);
