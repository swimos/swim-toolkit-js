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

import {Lazy} from "@swim/util";
import type {Mutable} from "@swim/util";
import type {Class} from "@swim/util";
import type {Dictionary} from "@swim/util";
import type {MutableDictionary} from "@swim/util";
import type {ServiceObserver} from "@swim/component";
import {Service} from "@swim/component";

/** @public */
export interface StorageServiceObserver<S extends StorageService = StorageService> extends ServiceObserver<S> {
  serviceWillStore?(key: string, newValue: string | undefined, oldValue: string | undefined, service: S): void;

  serviceDidStore?(key: string, newValue: string | undefined, oldValue: string | undefined, service: S): void;

  serviceWillClear?(service: S): void;

  serviceDidClear?(service: S): void;
}

/** @public */
export abstract class StorageService extends Service {
  override readonly observerType?: Class<StorageServiceObserver>;

  abstract get(key: string): string | undefined;

  abstract set(key: string, newValue: string | undefined): string | undefined;

  protected willSet(key: string, newValue: string | undefined, oldValue: string | undefined): void {
    this.callObservers("serviceWillStore", key, newValue, oldValue, this);
  }

  protected onSet(key: string, newValue: string | undefined, oldValue: string | undefined): void {
    // hook
  }

  protected didSet(key: string, newValue: string | undefined, oldValue: string | undefined): void {
    this.callObservers("serviceDidStore", key, newValue, oldValue, this);
  }

  abstract clear(): void;

  protected willClear(): void {
    this.callObservers("serviceWillClear", this);
    const observers = this.observers;
    for (let i = 0, n = observers.length; i < n; i += 1) {
      const observer = observers[i]!;
      if (observer.serviceWillClear !== void 0) {
        observer.serviceWillClear(this);
      }
    }
  }

  protected onClear(): void {
    // hook
  }

  protected didClear(): void {
    this.callObservers("serviceDidClear", this);
  }

  static override create(): StorageService;
  static override create(): StorageService;
  static override create(): StorageService {
    let service: StorageService | null = WebStorageService.local();
    if (service === null) {
      service = new EphemeralStorageService();
    }
    return service;
  }
}

/** @public */
export class WebStorageService extends StorageService {
  constructor(storage: Storage) {
    super();
    this.storage = storage;
    this.onStorage = this.onStorage.bind(this);
  }

  readonly storage: Storage;

  override get(key: string): string | undefined {
    const value = this.storage.getItem(key);
    return value !== null ? value : void 0;
  }

  override set(key: string, newValue: string | undefined): string | undefined {
    let oldValue: string | null | undefined = this.storage.getItem(key);
    if (oldValue === null) {
      oldValue = void 0;
    }
    if (newValue !== oldValue) {
      this.willSet(key, newValue, oldValue);
      if (newValue !== void 0) {
        this.storage.setItem(key, newValue);
      } else {
        this.storage.removeItem(key);
      }
      this.onSet(key, newValue, oldValue);
      this.didSet(key, newValue, oldValue);
    }
    return oldValue;
  }

  override clear(): void {
    this.willClear();
    this.storage.clear();
    this.onClear();
    this.didClear();
  }

  /** @internal */
  onStorage(event: StorageEvent): void {
    if (event.storageArea === this.storage) {
      const key = event.key;
      if (key !== null) {
        let newValue: string | null | undefined = event.newValue;
        if (newValue === null) {
          newValue = void 0;
        }
        let oldValue: string | null | undefined = event.oldValue;
        if (oldValue === null) {
          oldValue = void 0;
        }
        if (newValue !== oldValue) {
          this.willSet(key, newValue, oldValue);
          this.onSet(key, newValue, oldValue);
          this.didSet(key, newValue, oldValue);
        }
      } else {
        this.willClear();
        this.onClear();
        this.didClear();
      }
    }
  }

  protected override onMount(): void {
    super.onMount();
    if (typeof window !== "undefined") {
      window.addEventListener("storage", this.onStorage);
    }
  }

  protected override onUnmount(): void {
    super.onUnmount();
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", this.onStorage);
    }
  }

  @Lazy
  static local(): WebStorageService | null {
    try {
      return new WebStorageService(window.localStorage);
    } catch (e) {
      return null;
    }
  }

  @Lazy
  static session(): WebStorageService | null {
    try {
      return new WebStorageService(window.sessionStorage);
    } catch (e) {
      return null;
    }
  }
}

/** @public */
export class EphemeralStorageService extends StorageService {
  constructor(storage?: Dictionary<string>) {
    super();
    if (storage === void 0) {
      storage = {};
    }
    this.storage = storage;
  }

  readonly storage: Dictionary<string>;

  override get(key: string): string | undefined {
    return this.storage[key];
  }

  override set(key: string, newValue: string | undefined): string | undefined {
    const storage = this.storage as MutableDictionary<string>;
    const oldValue = storage[key];
    if (newValue !== oldValue) {
      this.willSet(key, newValue, oldValue);
      if (newValue !== void 0) {
        storage[key] = newValue;
      } else {
        delete storage[key];
      }
      this.onSet(key, newValue, oldValue);
      this.didSet(key, newValue, oldValue);
    }
    return oldValue;
  }

  override clear(): void {
    this.willClear();
    (this as Mutable<this>).storage = {};
    this.onClear();
    this.didClear();
  }
}
