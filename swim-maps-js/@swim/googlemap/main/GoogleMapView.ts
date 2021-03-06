// Copyright 2015-2021 Swim inc.
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

/// <reference types="google.maps"/>

import {Equivalent, Lazy} from "@swim/util";
import type {AnyTiming} from "@swim/mapping";
import {GeoPoint} from "@swim/geo";
import {ViewContextType, ViewFlags, View} from "@swim/view";
import {ViewHtml, HtmlView} from "@swim/dom";
import type {CanvasView} from "@swim/graphics";
import {AnyGeoPerspective, MapView} from "@swim/map";
import {GoogleMapViewport} from "./GoogleMapViewport";
import type {GoogleMapViewObserver} from "./GoogleMapViewObserver";
import type {GoogleMapViewController} from "./GoogleMapViewController";

export class GoogleMapView extends MapView {
  constructor(map: google.maps.Map) {
    super();
    Object.defineProperty(this, "map", {
      value: map,
      enumerable: true,
    });
    Object.defineProperty(this, "mapOverlay", {
      value: this.createMapOverlay(map),
      enumerable: true,
    });
    Object.defineProperty(this, "geoViewport", {
      value: GoogleMapViewport.create(this.map, this.mapOverlay.getProjection()),
      enumerable: true,
      configurable: true,
    });
    this.onMapDraw = this.onMapDraw.bind(this);
    this.onMapIdle = this.onMapIdle.bind(this);
    this.initMap(map);
  }

  override readonly viewController!: GoogleMapViewController | null;

  override readonly viewObservers!: ReadonlyArray<GoogleMapViewObserver>;

  readonly map!: google.maps.Map;

  protected initMap(map: google.maps.Map): void {
    map.addListener("idle", this.onMapIdle);
  }

  readonly mapOverlay!: google.maps.OverlayView;

  protected createMapOverlay(map: google.maps.Map): google.maps.OverlayView {
    const mapOverlay = new GoogleMapView.MapOverlay(this);
    mapOverlay.setMap(map);
    return mapOverlay;
  }

  /** @hidden */
  @Lazy
  static get MapOverlay(): {new(owner: GoogleMapView): google.maps.OverlayView} {
    return class GoogleMapOverlayView extends google.maps.OverlayView {
      constructor(owner: GoogleMapView) {
        super();
        Object.defineProperty(this, "owner", {
          value: owner,
          enumerable: true,
          configurable: true,
        });
      }
      readonly owner!: GoogleMapView;
      override onAdd(): void {
        const containerView = this.owner.container.view;
        if (containerView !== null) {
          this.owner.initContainer(containerView);
          this.owner.attachContainer(containerView);
        }
      }
      override onRemove(): void {
        this.owner.canvas.removeView();
      }
      override draw(): void {
        this.owner.onMapDraw();
      }
    }
  }

  override readonly geoViewport!: GoogleMapViewport;

  protected willSetGeoViewport(newGeoViewport: GoogleMapViewport, oldGeoViewport: GoogleMapViewport): void {
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewWillSetGeoViewport !== void 0) {
      viewController.viewWillSetGeoViewport(newGeoViewport, oldGeoViewport, this);
    }
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.viewWillSetGeoViewport !== void 0) {
        viewObserver.viewWillSetGeoViewport(newGeoViewport, oldGeoViewport, this);
      }
    }
  }

  protected onSetGeoViewport(newGeoViewport: GoogleMapViewport, oldGeoViewport: GoogleMapViewport): void {
    // hook
  }

  protected didSetGeoViewport(newGeoViewport: GoogleMapViewport, oldGeoViewport: GoogleMapViewport): void {
    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!
      if (viewObserver.viewDidSetGeoViewport !== void 0) {
        viewObserver.viewDidSetGeoViewport(newGeoViewport, oldGeoViewport, this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.viewDidSetGeoViewport !== void 0) {
      viewController.viewDidSetGeoViewport(newGeoViewport, oldGeoViewport, this);
    }
  }

  protected updateGeoViewport(): boolean {
    const oldGeoViewport = this.geoViewport;
    const newGeoViewport = GoogleMapViewport.create(this.map, this.mapOverlay.getProjection());
    if (!newGeoViewport.equals(oldGeoViewport)) {
      this.willSetGeoViewport(newGeoViewport, oldGeoViewport);
      Object.defineProperty(this, "geoViewport", {
        value: newGeoViewport,
        enumerable: true,
        configurable: true,
      });
      this.onSetGeoViewport(newGeoViewport, oldGeoViewport);
      this.didSetGeoViewport(newGeoViewport, oldGeoViewport);
      return true;
    }
    return false;
  }

  override willProcess(processFlags: ViewFlags, viewContext: ViewContextType<this>): void {
    if ((this.viewFlags & View.NeedsProject) !== 0 && this.updateGeoViewport()) {
      (viewContext as any).geoViewport = this.geoViewport;
    }
    super.willProcess(processFlags, viewContext);
  }

  protected onMapDraw(): void {
    if (this.updateGeoViewport()) {
      const immediate = !this.isHidden() && !this.isCulled();
      this.requireUpdate(View.NeedsProject, immediate);
    }
  }

  protected onMapIdle(): void {
    this.requireUpdate(View.NeedsProject);
  }

  override moveTo(geoPerspective: AnyGeoPerspective, timing?: AnyTiming | boolean): void {
    const geoViewport = this.geoViewport;
    let geoCenter = geoPerspective.geoCenter;
    if (geoCenter !== void 0 && geoCenter !== null) {
      geoCenter = GeoPoint.fromAny(geoCenter);
      if (!geoViewport.geoCenter.equivalentTo(geoCenter, 1e-5)) {
        this.map.panTo(geoCenter);
      }
    }
    const zoom = geoPerspective.zoom;
    if (zoom !== void 0 && !Equivalent(geoViewport.zoom, zoom, 1e-5)) {
      this.map.setZoom(zoom);
    }
    const heading = geoPerspective.heading;
    if (heading !== void 0 && !Equivalent(geoViewport.heading, heading, 1e-5)) {
      this.map.setHeading(heading);
    }
    const tilt = geoPerspective.tilt;
    if (tilt !== void 0 && !Equivalent(geoViewport.tilt, tilt, 1e-5)) {
      this.map.setTilt(tilt);
    }
  }

  protected override attachCanvas(canvasView: CanvasView): void {
    super.attachCanvas(canvasView);
    if (this.parentView === null) {
      canvasView.appendChildView(this);
    }
  }

  protected override detachCanvas(canvasView: CanvasView): void {
    if (this.parentView === canvasView) {
      canvasView.removeChildView(this);
    }
    super.detachCanvas(canvasView);
  }

  protected override initContainer(containerView: HtmlView): void {
    super.initContainer(containerView);
    const mapPanes = this.mapOverlay.getPanes();
    if (mapPanes !== void 0 && mapPanes !== null) {
      materializeAncestors(mapPanes.overlayMouseTarget as HTMLElement);
    }
    function materializeAncestors(node: HTMLElement): HtmlView {
      const parentNode = node.parentNode;
      if (parentNode instanceof HTMLElement && (parentNode as ViewHtml).view === void 0) {
        materializeAncestors(parentNode);
      }
      return HtmlView.fromNode(node);
    }
  }

  protected override attachContainer(containerView: HtmlView): void {
    super.attachContainer(containerView);
    const mapPanes = this.mapOverlay.getPanes();
    if (mapPanes !== void 0 && mapPanes !== null) {
      const overlayMouseTargetView = (mapPanes.overlayMouseTarget as ViewHtml).view!;
      const overlayContainerView = overlayMouseTargetView.parentView as HtmlView;
      const canvasContainerView = overlayContainerView.parentView as HtmlView;
      this.canvas.injectView(canvasContainerView);
    } else if (this.canvas.view === null) {
      this.canvas.setView(this.canvas.createView());
    }
  }

  protected override detachContainer(containerView: HtmlView): void {
    const canvasView = this.canvas.view;
    const mapPanes = this.mapOverlay.getPanes();
    if (mapPanes !== void 0 && mapPanes !== null) {
      const overlayMouseTargetView = (mapPanes.overlayMouseTarget as ViewHtml).view!;
      const overlayContainerView = overlayMouseTargetView.parentView as HtmlView;
      const canvasContainerView = overlayContainerView.parentView as HtmlView;
      if (canvasView !== null && canvasView.parentView === canvasContainerView) {
        canvasContainerView.removeChildView(containerView);
      }
    }
    super.detachContainer(containerView);
  }
}
