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
import type {Class} from "@swim/util";
import type {Instance} from "@swim/util";
import type {FromAny} from "@swim/util";
import {Creatable} from "@swim/util";
import type {Consumer} from "@swim/util";
import type {Consumable} from "@swim/util";
import {FastenerContext} from "@swim/component";
import type {Fastener} from "@swim/component";
import {Property} from "@swim/component";
import {Provider} from "@swim/component";
import type {ComponentFlags} from "@swim/component";
import type {ComponentObserver} from "@swim/component";
import {Component} from "@swim/component";
import type {AnyValue} from "@swim/structure";
import {Value} from "@swim/structure";
import type {AnyUri} from "@swim/uri";
import {Uri} from "@swim/uri";
import type {WarpDownlinkModel} from "@swim/client";
import {WarpDownlink} from "@swim/client";
import type {EventDownlinkDescriptor} from "@swim/client";
import {EventDownlink} from "@swim/client";
import type {ValueDownlinkDescriptor} from "@swim/client";
import {ValueDownlink} from "@swim/client";
import type {ListDownlinkDescriptor} from "@swim/client";
import {ListDownlink} from "@swim/client";
import type {MapDownlinkDescriptor} from "@swim/client";
import {MapDownlink} from "@swim/client";
import {WarpRef} from "@swim/client";
import {WarpClient} from "@swim/client";
import {ModelRelation} from "@swim/model";
import {TraitRelation} from "@swim/model";
import {ControllerRelation} from "./"; // forward import
import {TraitViewRef} from "./"; // forward import
import {ExecutorService} from "./"; // forward import

/** @public */
export type ControllerFlags = ComponentFlags;

/** @public */
export type AnyController<C extends Controller = Controller> = C | ControllerFactory<C>;

/** @public */
export interface ControllerFactory<C extends Controller = Controller, U = AnyController<C>> extends Creatable<C>, FromAny<C, U> {
}

/** @public */
export interface ControllerClass<C extends Controller = Controller, U = AnyController<C>> extends Function, ControllerFactory<C, U> {
  readonly prototype: C;
}

/** @public */
export interface ControllerConstructor<C extends Controller = Controller, U = AnyController<C>> extends ControllerClass<C, U> {
  new(): C;
}

/** @public */
export interface ControllerObserver<C extends Controller = Controller> extends ComponentObserver<C> {
  controllerWillAttachParent?(parent: Controller, controller: C): void;

  controllerDidAttachParent?(parent: Controller, controller: C): void;

  controllerWillDetachParent?(parent: Controller, controller: C): void;

  controllerDidDetachParent?(parent: Controller, controller: C): void;

  controllerWillInsertChild?(child: Controller, target: Controller | null, controller: C): void;

  controllerDidInsertChild?(child: Controller, target: Controller | null, controller: C): void;

  controllerWillRemoveChild?(child: Controller, controller: C): void;

  controllerDidRemoveChild?(child: Controller, controller: C): void;

  controllerWillReinsertChild?(child: Controller, target: Controller | null, controller: C): void;

  controllerDidReinsertChild?(child: Controller, target: Controller | null, controller: C): void;

  controllerWillMount?(controller: Controller): void;

  controllerDidMount?(controller: Controller): void;

  controllerWillUnmount?(controller: Controller): void;

  controllerDidUnmount?(controller: Controller): void;

  controllerWillResolve?(controller: C): void;

  controllerDidResolve?(controller: C): void;

  controllerWillGenerate?(controller: C): void;

  controllerDidGenerate?(controller: C): void;

  controllerWillAssemble?(controller: C): void;

  controllerDidAssemble?(controller: C): void;

  controllerWillRevise?(controller: C): void;

  controllerDidRevise?(controller: C): void;

  controllerWillCompute?(controller: C): void;

  controllerDidCompute?(controller: C): void;

  controllerWillStartConsuming?(controller: C): void;

  controllerDidStartConsuming?(controller: C): void;

  controllerWillStopConsuming?(controller: C): void;

  controllerDidStopConsuming?(controller: C): void;
}

/** @public */
export class Controller extends Component<Controller> implements Consumable, WarpRef {
  constructor() {
    super();
    this.consumers = null;
  }

  override get componentType(): Class<Controller> {
    return Controller;
  }

  declare readonly observerType?: Class<ControllerObserver>;

  protected override willAttachParent(parent: Controller): void {
    this.callObservers("controllerWillAttachParent", parent, this);
  }

  protected override onAttachParent(parent: Controller): void {
    // hook
  }

  protected override didAttachParent(parent: Controller): void {
    this.callObservers("controllerDidAttachParent", parent, this);
  }

  protected override willDetachParent(parent: Controller): void {
    this.callObservers("controllerWillDetachParent", parent, this);
  }

  protected override onDetachParent(parent: Controller): void {
    // hook
  }

  protected override didDetachParent(parent: Controller): void {
    this.callObservers("controllerDidDetachParent", parent, this);
  }

  override setChild<C extends Controller>(key: string, newChild: C): Controller | null;
  override setChild<F extends Class<Instance<F, Controller>> & Creatable<Instance<F, Controller>>>(key: string, factory: F): Controller | null;
  override setChild(key: string, newChild: AnyController | null): Controller | null;
  override setChild(key: string, newChild: AnyController | null): Controller | null {
    if (newChild !== null) {
      newChild = Controller.fromAny(newChild);
    }
    return super.setChild(key, newChild) as Controller | null;
  }

  override appendChild<C extends Controller>(child: C, key?: string): C;
  override appendChild<F extends Class<Instance<F, Controller>> & Creatable<Instance<F, Controller>>>(factory: F, key?: string): InstanceType<F>;
  override appendChild(child: AnyController, key?: string): Controller;
  override appendChild(child: AnyController, key?: string): Controller {
    child = Controller.fromAny(child);
    return super.appendChild(child, key);
  }

  override prependChild<C extends Controller>(child: C, key?: string): C;
  override prependChild<F extends Class<Instance<F, Controller>> & Creatable<Instance<F, Controller>>>(factory: F, key?: string): InstanceType<F>;
  override prependChild(child: AnyController, key?: string): Controller;
  override prependChild(child: AnyController, key?: string): Controller {
    child = Controller.fromAny(child);
    return super.prependChild(child, key);
  }

  override insertChild<C extends Controller>(child: C, target: Controller | null, key?: string): C;
  override insertChild<F extends Class<Instance<F, Controller>> & Creatable<Instance<F, Controller>>>(factory: F, target: Controller | null, key?: string): InstanceType<F>;
  override insertChild(child: AnyController, target: Controller | null, key?: string): Controller;
  override insertChild(child: AnyController, target: Controller | null, key?: string): Controller {
    child = Controller.fromAny(child);
    return super.insertChild(child, target, key);
  }

  override reinsertChild(child: Controller, target: Controller | null): void {
    super.reinsertChild(child, target);
  }

  override replaceChild<C extends Controller>(newChild: Controller, oldChild: C): C;
  override replaceChild<C extends Controller>(newChild: AnyController, oldChild: C): C;
  override replaceChild(newChild: AnyController, oldChild: Controller): Controller {
    newChild = Controller.fromAny(newChild);
    return super.replaceChild(newChild, oldChild);
  }

  protected override willInsertChild(child: Controller, target: Controller | null): void {
    super.willInsertChild(child, target);
    this.callObservers("controllerWillInsertChild", child, target, this);
  }

  protected override onInsertChild(child: Controller, target: Controller | null): void {
    super.onInsertChild(child, target);
  }

  protected override didInsertChild(child: Controller, target: Controller | null): void {
    this.callObservers("controllerDidInsertChild", child, target, this);
    super.didInsertChild(child, target);
  }

  /** @internal */
  override cascadeInsert(updateFlags?: ControllerFlags): void {
    if ((this.flags & Controller.MountedFlag) === 0) {
      return;
    } else if (updateFlags === void 0) {
      updateFlags = 0;
    }
    updateFlags |= this.flags & Controller.UpdateMask;
    if ((updateFlags & Controller.CompileMask) !== 0) {
      this.cascadeCompile(updateFlags);
    }
  }

  protected override willRemoveChild(child: Controller): void {
    super.willRemoveChild(child);
    this.callObservers("controllerWillRemoveChild", child, this);
  }

  protected override onRemoveChild(child: Controller): void {
    super.onRemoveChild(child);
  }

  protected override didRemoveChild(child: Controller): void {
    this.callObservers("controllerDidRemoveChild", child, this);
    super.didRemoveChild(child);
  }

  protected override willReinsertChild(child: Controller, target: Controller | null): void {
    super.willReinsertChild(child, target);
    this.callObservers("controllerWillReinsertChild", child, target, this);
  }

  protected override onReinsertChild(child: Controller, target: Controller | null): void {
    super.onReinsertChild(child, target);
  }

  protected override didReinsertChild(child: Controller, target: Controller | null): void {
    this.callObservers("controllerDidReinsertChild", child, target, this);
    super.didReinsertChild(child, target);
  }

  protected override willMount(): void {
    super.willMount();
    this.callObservers("controllerWillMount", this);
  }

  protected override onMount(): void {
    // subsume super
    this.requestUpdate(this, this.flags & Controller.UpdateMask, false);
    this.requireUpdate(this.mountFlags);

    if (this.decoherent !== null && this.decoherent.length !== 0) {
      this.requireUpdate(Controller.NeedsRevise);
    }

    this.mountFasteners();

    if (this.consumers !== null && this.consumers.size !== 0) {
      this.startConsuming();
    }
  }

  protected override didMount(): void {
    this.callObservers("controllerDidMount", this);
    super.didMount();
  }

  protected override willUnmount(): void {
    super.willUnmount();
    this.callObservers("controllerWillUnmount", this);
  }

  protected override onUnmount(): void {
    this.stopConsuming();
    super.onUnmount();
  }

  protected override didUnmount(): void {
    this.callObservers("controllerDidUnmount", this);
    super.didUnmount();
  }

  override requireUpdate(updateFlags: ControllerFlags, immediate: boolean = false): void {
    const flags = this.flags;
    const deltaUpdateFlags = updateFlags & ~flags & Controller.UpdateMask;
    if (deltaUpdateFlags === 0) {
      return;
    }
    this.setFlags(flags | deltaUpdateFlags);
    this.requestUpdate(this, deltaUpdateFlags, immediate);
  }

  protected needsUpdate(updateFlags: ControllerFlags, immediate: boolean): ControllerFlags {
    return updateFlags;
  }

  requestUpdate(target: Controller, updateFlags: ControllerFlags, immediate: boolean): void {
    updateFlags = this.needsUpdate(updateFlags, immediate);
    let deltaUpdateFlags = this.flags & ~updateFlags & Controller.UpdateMask;
    if ((updateFlags & Controller.CompileMask) !== 0) {
      deltaUpdateFlags |= Controller.NeedsCompile;
    }
    if ((updateFlags & Controller.ExecuteMask) !== 0) {
      deltaUpdateFlags |= Controller.NeedsExecute;
    }
    if (deltaUpdateFlags === 0 && !immediate) {
      return;
    }
    this.setFlags(this.flags | deltaUpdateFlags);
    const parent = this.parent;
    if (parent !== null) {
      parent.requestUpdate(target, updateFlags, immediate);
    } else if (this.mounted) {
      const updaterService = this.updater.service;
      if (updaterService !== null) {
        updaterService.requestUpdate(target, updateFlags, immediate);
      }
    }
  }

  get updating(): boolean {
    return (this.flags & Controller.UpdatingMask) !== 0;
  }

  get compiling(): boolean {
    return (this.flags & Controller.CompilingFlag) !== 0;
  }

  protected needsCompile(compileFlags: ControllerFlags): ControllerFlags {
    return compileFlags;
  }

  cascadeCompile(compileFlags: ControllerFlags): void {
    try {
      compileFlags &= ~Controller.NeedsCompile;
      compileFlags |= this.flags & Controller.UpdateMask;
      compileFlags = this.needsCompile(compileFlags);
      if ((compileFlags & Controller.CompileMask) === 0) {
        return;
      }
      let cascadeFlags = compileFlags;
      this.setFlags(this.flags & ~Controller.NeedsCompile | Controller.CompilingFlag);
      this.willCompile(cascadeFlags);
      if (((this.flags | compileFlags) & Controller.NeedsResolve) !== 0) {
        cascadeFlags |= Controller.NeedsResolve;
        this.setFlags(this.flags & ~Controller.NeedsResolve);
        this.willResolve();
      }
      if (((this.flags | compileFlags) & Controller.NeedsGenerate) !== 0) {
        cascadeFlags |= Controller.NeedsGenerate;
        this.setFlags(this.flags & ~Controller.NeedsGenerate);
        this.willGenerate();
      }
      if (((this.flags | compileFlags) & Controller.NeedsAssemble) !== 0) {
        cascadeFlags |= Controller.NeedsAssemble;
        this.setFlags(this.flags & ~Controller.NeedsAssemble);
        this.willAssemble();
      }

      this.onCompile(cascadeFlags);
      if ((cascadeFlags & Controller.NeedsResolve) !== 0) {
        this.onResolve();
      }
      if ((cascadeFlags & Controller.NeedsGenerate) !== 0) {
        this.onGenerate();
      }
      if ((cascadeFlags & Controller.NeedsAssemble) !== 0) {
        this.onAssemble();
      }

      if ((cascadeFlags & Controller.CompileMask) !== 0) {
        this.compileChildren(cascadeFlags, this.compileChild);
      }

      if ((cascadeFlags & Controller.NeedsAssemble) !== 0) {
        this.didAssemble();
      }
      if ((cascadeFlags & Controller.NeedsGenerate) !== 0) {
        this.didGenerate();
      }
      if ((cascadeFlags & Controller.NeedsResolve) !== 0) {
        this.didResolve();
      }
      this.didCompile(cascadeFlags);
    } finally {
      this.setFlags(this.flags & ~Controller.CompilingFlag);
    }
  }

  protected willCompile(compileFlags: ControllerFlags): void {
    // hook
  }

  protected onCompile(compileFlags: ControllerFlags): void {
    // hook
  }

  protected didCompile(compileFlags: ControllerFlags): void {
    // hook
  }

  protected willResolve(): void {
    this.callObservers("controllerWillResolve", this);
  }

  protected onResolve(): void {
    // hook
  }

  protected didResolve(): void {
    this.callObservers("controllerDidResolve", this);
  }

  protected willGenerate(): void {
    this.callObservers("controllerWillGenerate", this);
  }

  protected onGenerate(): void {
    // hook
  }

  protected didGenerate(): void {
    this.callObservers("controllerDidGenerate", this);
  }

  protected willAssemble(): void {
    this.callObservers("controllerWillAssemble", this);
  }

  protected onAssemble(): void {
    // hook
  }

  protected didAssemble(): void {
    this.callObservers("controllerDidAssemble", this);
  }

  protected compileChildren(compileFlags: ControllerFlags, compileChild: (this: this, child: Controller, compileFlags: ControllerFlags) => void): void {
    let child = this.firstChild;
    while (child !== null) {
      const next = child.nextSibling;
      compileChild.call(this, child, compileFlags);
      if (next !== null && next.parent !== this) {
        throw new Error("inconsistent compile pass");
      }
      child = next;
    }
  }

  protected compileChild(child: Controller, compileFlags: ControllerFlags): void {
    child.cascadeCompile(compileFlags);
  }

  get executing(): boolean {
    return (this.flags & Controller.ExecutingFlag) !== 0;
  }

  protected needsExecute(executeFlags: ControllerFlags): ControllerFlags {
    return executeFlags;
  }

  cascadeExecute(executeFlags: ControllerFlags): void {
    try {
      executeFlags &= ~Controller.NeedsExecute;
      executeFlags |= this.flags & Controller.UpdateMask;
      executeFlags = this.needsExecute(executeFlags);
      if ((executeFlags & Controller.ExecuteMask) === 0) {
        return;
      }
      let cascadeFlags = executeFlags;
      this.setFlags(this.flags & ~Controller.NeedsExecute | Controller.ExecutingFlag);
      this.willExecute(cascadeFlags);
      if (((this.flags | executeFlags) & Controller.NeedsRevise) !== 0) {
        cascadeFlags |= Controller.NeedsRevise;
        this.setFlags(this.flags & ~Controller.NeedsRevise);
        this.willRevise();
      }
      if (((this.flags | executeFlags) & Controller.NeedsCompute) !== 0) {
        cascadeFlags |= Controller.NeedsCompute;
        this.setFlags(this.flags & ~Controller.NeedsCompute);
        this.willCompute();
      }

      this.onExecute(cascadeFlags);
      if ((cascadeFlags & Controller.NeedsRevise) !== 0) {
        this.onRevise();
      }
      if ((cascadeFlags & Controller.NeedsCompute) !== 0) {
        this.onCompute();
      }

      if ((cascadeFlags & Controller.ExecuteMask) !== 0) {
        this.executeChildren(cascadeFlags, this.executeChild);
      }

      if ((cascadeFlags & Controller.NeedsCompute) !== 0) {
        this.didCompute();
      }
      if ((cascadeFlags & Controller.NeedsRevise) !== 0) {
        this.didRevise();
      }
      this.didExecute(cascadeFlags);
    } finally {
      this.setFlags(this.flags & ~Controller.ExecutingFlag);
    }
  }

  protected willExecute(executeFlags: ControllerFlags): void {
    // hook
  }

  protected onExecute(executeFlags: ControllerFlags): void {
    // hook
  }

  protected didExecute(executeFlags: ControllerFlags): void {
    // hook
  }

  protected willRevise(): void {
    this.callObservers("controllerWillRevise", this);
  }

  protected onRevise(): void {
    this.recohereFasteners(this.updateTime);
  }

  protected didRevise(): void {
    this.callObservers("controllerDidRevise", this);
  }

  protected willCompute(): void {
    this.callObservers("controllerWillCompute", this);
  }

  protected onCompute(): void {
    // hook
  }

  protected didCompute(): void {
    this.callObservers("controllerDidCompute", this);
  }

  protected executeChildren(executeFlags: ControllerFlags, executeChild: (this: this, child: Controller, executeFlags: ControllerFlags) => void): void {
    let child = this.firstChild;
    while (child !== null) {
      const next = child.nextSibling;
      executeChild.call(this, child, executeFlags);
      if (next !== null && next.parent !== this) {
        throw new Error("inconsistent execute pass");
      }
      child = next;
    }
  }

  /** @internal */
  protected executeChild(child: Controller, executeFlags: ControllerFlags): void {
    child.cascadeExecute(executeFlags);
  }

  protected override bindFastener(fastener: Fastener): void {
    super.bindFastener(fastener);
    if (this.consuming) {
      if (fastener instanceof WarpDownlink && fastener.consumed === true) {
        fastener.consume(this);
      } else if (fastener instanceof ControllerRelation && fastener.consumed === true) {
        fastener.consume(this);
      } else if (fastener instanceof TraitViewRef && fastener.consumed === true) {
        fastener.consume(this);
      } else if (fastener instanceof TraitRelation && fastener.consumed === true) {
        fastener.consume(this);
      } else if (fastener instanceof ModelRelation && fastener.consumed === true) {
        fastener.consume(this);
      }
    }
  }

  /** @internal */
  protected override bindChildFastener(fastener: Fastener, child: Controller, target: Controller | null): void {
    super.bindChildFastener(fastener, child, target);
    if (fastener instanceof ControllerRelation) {
      fastener.bindController(child, target);
    }
  }

  /** @internal */
  protected override unbindChildFastener(fastener: Fastener, child: Controller): void {
    if (fastener instanceof ControllerRelation) {
      fastener.unbindController(child);
    }
    super.unbindChildFastener(fastener, child);
  }

  /** @internal @override */
  override decohereFastener(fastener: Fastener): void {
    super.decohereFastener(fastener);
    this.requireUpdate(Controller.NeedsRevise);
  }

  /** @internal */
  override recohereFasteners(t?: number): void {
    const decoherent = this.decoherent;
    if (decoherent === null) {
      return;
    }
    const decoherentCount = decoherent.length;
    if (decoherentCount === 0) {
      return;
    } else if (t === void 0) {
      t = performance.now();
    }
    let coherentDownlinkProps = false;
    (this as Mutable<this>).decoherent = null;
    for (let i = 0; i < decoherentCount; i += 1) {
      const fastener = decoherent[i]!;
      if (fastener instanceof WarpDownlink && !coherentDownlinkProps) {
        coherentDownlinkProps = true;
        this.hostUri.recohere(t);
        this.nodeUri.recohere(t);
        this.laneUri.recohere(t);
      }
      fastener.recohere(t);
    }
  }

  /** @internal */
  readonly consumers: ReadonlySet<Consumer> | null;

  /** @override */
  consume(consumer: Consumer): void {
    let consumers = this.consumers as Set<Consumer> | null;
    if (consumers === null) {
      consumers = new Set<Consumer>();
      (this as Mutable<this>).consumers = consumers;
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
  }

  protected willConsume(consumer: Consumer): void {
    // hook
  }

  protected onConsume(consumer: Consumer): void {
    // hook
  }

  protected didConsume(consumer: Consumer): void {
    // hook
  }

  /** @override */
  unconsume(consumer: Consumer): void {
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
  }

  protected willUnconsume(consumer: Consumer): void {
    // hook
  }

  protected onUnconsume(consumer: Consumer): void {
    // hook
  }

  protected didUnconsume(consumer: Consumer): void {
    // hook
  }

  get consuming(): boolean {
    return (this.flags & Controller.ConsumingFlag) !== 0;
  }

  get startConsumingFlags(): ControllerFlags {
    return (this.constructor as typeof Controller).StartConsumingFlags;
  }

  protected startConsuming(): void {
    if ((this.flags & Controller.ConsumingFlag) !== 0) {
      return;
    }
    this.willStartConsuming();
    this.setFlags(this.flags | Controller.ConsumingFlag);
    this.onStartConsuming();
    this.didStartConsuming();
  }

  protected willStartConsuming(): void {
    this.callObservers("controllerWillStartConsuming", this);
  }

  protected onStartConsuming(): void {
    this.requireUpdate(this.startConsumingFlags);
    this.startConsumingFasteners();
  }

  protected didStartConsuming(): void {
    this.callObservers("controllerDidStartConsuming", this);
  }

  get stopConsumingFlags(): ControllerFlags {
    return (this.constructor as typeof Controller).StopConsumingFlags;
  }

  protected stopConsuming(): void {
    if ((this.flags & Controller.ConsumingFlag) === 0) {
      return;
    }
    this.willStopConsuming();
    this.setFlags(this.flags & ~Controller.ConsumingFlag);
    this.onStopConsuming();
    this.didStopConsuming();
  }

  protected willStopConsuming(): void {
    this.callObservers("controllerWillStopConsuming", this);
  }

  protected onStopConsuming(): void {
    this.requireUpdate(this.stopConsumingFlags);
    this.stopConsumingFasteners();
  }

  protected didStopConsuming(): void {
    this.callObservers("controllerDidStopConsuming", this);
  }

  /** @internal */
  protected startConsumingFasteners(): void {
    const fastenerSlots = FastenerContext.getFastenerSlots(this);
    for (let i = 0; i < fastenerSlots.length; i += 1) {
      const fastener = this[fastenerSlots[i]!];
      if (fastener instanceof WarpDownlink && fastener.consumed === true) {
        fastener.consume(this);
      } else if (fastener instanceof ControllerRelation && fastener.consumed === true) {
        fastener.consume(this);
      } else if (fastener instanceof TraitViewRef && fastener.consumed === true) {
        fastener.consume(this);
      } else if (fastener instanceof TraitRelation && fastener.consumed === true) {
        fastener.consume(this);
      } else if (fastener instanceof ModelRelation && fastener.consumed === true) {
        fastener.consume(this);
      }
    }
  }

  /** @internal */
  protected stopConsumingFasteners(): void {
    const fastenerSlots = FastenerContext.getFastenerSlots(this);
    for (let i = 0; i < fastenerSlots.length; i += 1) {
      const fastener = this[fastenerSlots[i]!];
      if (fastener instanceof WarpDownlink && fastener.consumed === true) {
        fastener.unconsume(this);
      } else if (fastener instanceof ControllerRelation && fastener.consumed === true) {
        fastener.unconsume(this);
      } else if (fastener instanceof TraitViewRef && fastener.consumed === true) {
        fastener.unconsume(this);
      } else if (fastener instanceof TraitRelation && fastener.consumed === true) {
        fastener.unconsume(this);
      } else if (fastener instanceof ModelRelation && fastener.consumed === true) {
        fastener.unconsume(this);
      }
    }
  }

  get updateTime(): number {
    return this.updater.getService().updateTime;
  }

  @Provider({
    get serviceType(): typeof ExecutorService { // avoid static forward reference
      return ExecutorService;
    },
    mountRootService(service: ExecutorService): void {
      super.mountRootService(service);
      service.roots.addController(this.owner);
    },
    unmountRootService(service: ExecutorService): void {
      super.unmountRootService(service);
      service.roots.removeController(this.owner);
    },
  })
  readonly updater!: Provider<this, ExecutorService>;

  /** @override */
  @Property({
    valueType: Uri,
    value: null,
    inherits: true,
    get updateFlags(): ControllerFlags {
      return Controller.NeedsRevise;
    },
  })
  get hostUri(): Property<this, Uri | null, AnyUri | null> {
    return Property.dummy();
  }

  /** @override */
  @Property({
    valueType: Uri,
    value: null,
    inherits: true,
    get updateFlags(): ControllerFlags {
      return Controller.NeedsRevise;
    },
  })
  get nodeUri(): Property<this, Uri | null, AnyUri | null> {
    return Property.dummy();
  }

  /** @override */
  @Property({
    valueType: Uri,
    value: null,
    inherits: true,
    get updateFlags(): ControllerFlags {
      return Controller.NeedsRevise;
    },
  })
  get laneUri(): Property<this, Uri | null, AnyUri | null> {
    return Property.dummy();
  }

  /** @override */
  downlink(template?: ThisType<EventDownlink<this>> & EventDownlinkDescriptor & Partial<Omit<EventDownlink<this>, keyof EventDownlinkDescriptor>>): EventDownlink<this> {
    let downlinkClass = EventDownlink;
    if (template !== void 0) {
      downlinkClass = downlinkClass.define("downlink", template) as typeof EventDownlink;
    }
    return downlinkClass.create(this);
  }

  /** @override */
  downlinkValue<V = Value, VU = V extends Value ? AnyValue : V>(template?: ThisType<ValueDownlink<this, V, VU>> & ValueDownlinkDescriptor<V, VU> & Partial<Omit<ValueDownlink<this, V, VU>, keyof ValueDownlinkDescriptor<V, VU>>>): ValueDownlink<this, V, VU> {
    let downlinkClass = ValueDownlink;
    if (template !== void 0) {
      downlinkClass = downlinkClass.define("downlinkValue", template) as typeof ValueDownlink;
    }
    return downlinkClass.create(this);
  }

  /** @override */
  downlinkList<V = Value, VU = V extends Value ? AnyValue : V>(template?: ThisType<ListDownlink<this, V, VU>> & ListDownlinkDescriptor<V, VU> & Partial<Omit<ListDownlink<this, V, VU>, keyof ListDownlinkDescriptor<V, VU>>>): ListDownlink<this, V, VU> {
    let downlinkClass = ListDownlink;
    if (template !== void 0) {
      downlinkClass = downlinkClass.define("downlinkList", template) as typeof ListDownlink;
    }
    return downlinkClass.create(this);
  }

  /** @override */
  downlinkMap<K = Value, V = Value, KU = K extends Value ? AnyValue : K, VU = V extends Value ? AnyValue : V>(template?: ThisType<MapDownlink<this, K, V, KU, VU>> & MapDownlinkDescriptor<K, V, KU, VU> & Partial<Omit<MapDownlink<this, K, V, KU, VU>, keyof MapDownlinkDescriptor<K, V, KU, VU>>>): MapDownlink<this, K, V, KU, VU> {
    let downlinkClass = MapDownlink;
    if (template !== void 0) {
      downlinkClass = downlinkClass.define("downlinkMap", template) as typeof MapDownlink;
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
    const childRef = new Controller();
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
    const childRef = new Controller();
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
    const childRef = new Controller();
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

  @Property({
    valueType: WarpRef,
    inherits: true,
    get updateFlags(): ControllerFlags {
      return Controller.NeedsRevise;
    },
    initValue(): WarpRef {
      return WarpClient.global();
    },
    equalValues(newValue: WarpRef, oldValue: WarpRef): boolean {
      return newValue === oldValue;
    },
  })
  get warpRef(): Property<this, WarpRef> {
    return Property.dummy();
  }

  static override create<S extends new () => InstanceType<S>>(this: S): InstanceType<S> {
    return new this();
  }

  static override fromAny<S extends Class<Instance<S, Controller>>>(this: S, value: AnyController<InstanceType<S>>): InstanceType<S> {
    if (value === void 0 || value === null) {
      return value;
    } else if (value instanceof Controller) {
      if (!((value as Controller) instanceof this)) {
        throw new TypeError(value + " not an instance of " + this);
      }
      return value;
    } else if (Creatable[Symbol.hasInstance](value)) {
      return (value as Creatable<InstanceType<S>>).create();
    }
    throw new TypeError("" + value);
  }

  /** @internal */
  static override uid: () => string = (function () {
    let nextId = 1;
    return function uid(): string {
      const id = ~~nextId;
      nextId += 1;
      return "controller" + id;
    };
  })();

  /** @internal */
  static override readonly MountedFlag: ControllerFlags = Component.MountedFlag;
  /** @internal */
  static override readonly InsertingFlag: ControllerFlags = Component.InsertingFlag;
  /** @internal */
  static override readonly RemovingFlag: ControllerFlags = Component.RemovingFlag;
  /** @internal */
  static readonly CompilingFlag: ControllerFlags = 1 << (Component.FlagShift + 0);
  /** @internal */
  static readonly ExecutingFlag: ControllerFlags = 1 << (Component.FlagShift + 1);
  /** @internal */
  static readonly ConsumingFlag: ControllerFlags = 1 << (Component.FlagShift + 2);
  /** @internal */
  static readonly UpdatingMask: ControllerFlags = this.CompilingFlag
                                                | this.ExecutingFlag;
  /** @internal */
  static readonly StatusMask: ControllerFlags = this.MountedFlag
                                              | this.InsertingFlag
                                              | this.RemovingFlag
                                              | this.CompilingFlag
                                              | this.ExecutingFlag;

  static readonly NeedsCompile: ControllerFlags = 1 << (Component.FlagShift + 3);
  static readonly NeedsResolve: ControllerFlags = 1 << (Component.FlagShift + 4);
  static readonly NeedsGenerate: ControllerFlags = 1 << (Component.FlagShift + 5);
  static readonly NeedsAssemble: ControllerFlags = 1 << (Component.FlagShift + 6);
  /** @internal */
  static readonly CompileMask: ControllerFlags = this.NeedsCompile
                                               | this.NeedsResolve
                                               | this.NeedsGenerate
                                               | this.NeedsAssemble;

  static readonly NeedsExecute: ControllerFlags = 1 << (Component.FlagShift + 7);
  static readonly NeedsRevise: ControllerFlags = 1 << (Component.FlagShift + 8);
  static readonly NeedsCompute: ControllerFlags = 1 << (Component.FlagShift + 9);
  /** @internal */
  static readonly ExecuteMask: ControllerFlags = this.NeedsExecute
                                               | this.NeedsRevise
                                               | this.NeedsCompute;

  /** @internal */
  static readonly UpdateMask: ControllerFlags = this.CompileMask
                                              | this.ExecuteMask;

  /** @internal */
  static override readonly FlagShift: number = Component.FlagShift + 10;
  /** @internal */
  static override readonly FlagMask: ControllerFlags = (1 << this.FlagShift) - 1;

  static override readonly MountFlags: ControllerFlags = 0;
  static override readonly InsertChildFlags: ControllerFlags = 0;
  static override readonly RemoveChildFlags: ControllerFlags = 0;
  static override readonly ReinsertChildFlags: ControllerFlags = 0;
  static readonly StartConsumingFlags: ControllerFlags = 0;
  static readonly StopConsumingFlags: ControllerFlags = 0;
}
