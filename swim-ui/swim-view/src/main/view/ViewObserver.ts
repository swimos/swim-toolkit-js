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

import type {Timing} from "@swim/util";
import type {ComponentObserver} from "@swim/component";
import type {MoodVector} from "@swim/theme";
import type {ThemeMatrix} from "@swim/theme";
import type {View} from "./View";

/** @public */
export interface ViewObserver<V extends View = View> extends ComponentObserver<V> {
  viewWillAttachParent?(parent: View, view: V): void;

  viewDidAttachParent?(parent: View, view: V): void;

  viewWillDetachParent?(parent: View, view: V): void;

  viewDidDetachParent?(parent: View, view: V): void;

  viewWillInsertChild?(child: View, target: View | null, view: V): void;

  viewDidInsertChild?(child: View, target: View | null, view: V): void;

  viewWillRemoveChild?(child: View, view: V): void;

  viewDidRemoveChild?(child: View, view: V): void;

  viewWillReinsertChild?(child: View, target: View | null, view: V): void;

  viewDidReinsertChild?(child: View, target: View | null, view: V): void;

  viewWillMount?(view: V): void;

  viewDidMount?(view: V): void;

  viewWillUnmount?(view: V): void;

  viewDidUnmount?(view: V): void;

  viewWillCull?(view: V): void;

  viewDidCull?(view: V): void;

  viewWillUncull?(view: V): void;

  viewDidUncull?(view: V): void;

  viewWillHide?(view: V): void;

  viewDidHide?(view: V): void;

  viewWillUnhide?(view: V): void;

  viewDidUnhide?(view: V): void;

  viewWillResize?(view: V): void;

  viewDidResize?(view: V): void;

  viewWillScroll?(view: V): void;

  viewDidScroll?(view: V): void;

  viewWillChange?(view: V): void;

  viewDidChange?(view: V): void;

  viewWillAnimate?(view: V): void;

  viewDidAnimate?(view: V): void;

  viewWillProject?(view: V): void;

  viewDidProject?(view: V): void;

  viewWillLayout?(view: V): void;

  viewDidLayout?(view: V): void;

  viewWillRender?(view: V): void;

  viewDidRender?(view: V): void;

  viewWillRasterize?(view: V): void;

  viewDidRasterize?(view: V): void;

  viewWillComposite?(view: V): void;

  viewDidComposite?(view: V): void;

  viewWillApplyTheme?(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean, view: V): void;

  viewDidApplyTheme?(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean, view: V): void;
}

/** @internal */
export interface ViewObserverCache<V extends View> {
  viewWillInsertChildObservers?: ReadonlyArray<ViewWillInsertChild<V>>;
  viewDidInsertChildObservers?: ReadonlyArray<ViewDidInsertChild<V>>;
  viewWillRemoveChildObservers?: ReadonlyArray<ViewWillRemoveChild<V>>;
  viewDidRemoveChildObservers?: ReadonlyArray<ViewDidRemoveChild<V>>;
  viewWillResizeObservers?: ReadonlyArray<ViewWillResize<V>>;
  viewDidResizeObservers?: ReadonlyArray<ViewDidResize<V>>;
  viewWillScrollObservers?: ReadonlyArray<ViewWillScroll<V>>;
  viewDidScrollObservers?: ReadonlyArray<ViewDidScroll<V>>;
  viewWillChangeObservers?: ReadonlyArray<ViewWillChange<V>>;
  viewDidChangeObservers?: ReadonlyArray<ViewDidChange<V>>;
  viewWillAnimateObservers?: ReadonlyArray<ViewWillAnimate<V>>;
  viewDidAnimateObservers?: ReadonlyArray<ViewDidAnimate<V>>;
  viewWillProjectObservers?: ReadonlyArray<ViewWillProject<V>>;
  viewDidProjectObservers?: ReadonlyArray<ViewDidProject<V>>;
  viewWillLayoutObservers?: ReadonlyArray<ViewWillLayout<V>>;
  viewDidLayoutObservers?: ReadonlyArray<ViewDidLayout<V>>;
  viewWillRenderObservers?: ReadonlyArray<ViewWillRender<V>>;
  viewDidRenderObservers?: ReadonlyArray<ViewDidRender<V>>;
  viewWillRasterizeObservers?: ReadonlyArray<ViewWillRasterize<V>>;
  viewDidRasterizeObservers?: ReadonlyArray<ViewDidRasterize<V>>;
  viewWillCompositeObservers?: ReadonlyArray<ViewWillComposite<V>>;
  viewDidCompositeObservers?: ReadonlyArray<ViewDidComposite<V>>;
}

/** @internal */
export interface ViewWillInsertChild<V extends View = View> {
  viewWillInsertChild(child: View, target: View | null, view: V): void;
}

/** @internal */
export interface ViewDidInsertChild<V extends View = View> {
  viewDidInsertChild(child: View, target: View | null, view: V): void;
}

/** @internal */
export interface ViewWillRemoveChild<V extends View = View> {
  viewWillRemoveChild(child: View, view: V): void;
}

/** @internal */
export interface ViewDidRemoveChild<V extends View = View> {
  viewDidRemoveChild(child: View, view: V): void;
}

/** @internal */
export interface ViewWillResize<V extends View = View> {
  viewWillResize(view: V): void;
}

/** @internal */
export interface ViewDidResize<V extends View = View> {
  viewDidResize(view: V): void;
}

/** @internal */
export interface ViewWillScroll<V extends View = View> {
  viewWillScroll(view: V): void;
}

/** @internal */
export interface ViewDidScroll<V extends View = View> {
  viewDidScroll(view: V): void;
}

/** @internal */
export interface ViewWillChange<V extends View = View> {
  viewWillChange(view: V): void;
}

/** @internal */
export interface ViewDidChange<V extends View = View> {
  viewDidChange(view: V): void;
}

/** @internal */
export interface ViewWillAnimate<V extends View = View> {
  viewWillAnimate(view: V): void;
}

/** @internal */
export interface ViewDidAnimate<V extends View = View> {
  viewDidAnimate(view: V): void;
}

/** @internal */
export interface ViewWillProject<V extends View = View> {
  viewWillProject(view: V): void;
}

/** @internal */
export interface ViewDidProject<V extends View = View> {
  viewDidProject(view: V): void;
}

/** @internal */
export interface ViewWillLayout<V extends View = View> {
  viewWillLayout(view: V): void;
}

/** @internal */
export interface ViewDidLayout<V extends View = View> {
  viewDidLayout(view: V): void;
}

/** @internal */
export interface ViewWillRender<V extends View = View> {
  viewWillRender(view: V): void;
}

/** @internal */
export interface ViewDidRender<V extends View = View> {
  viewDidRender(view: V): void;
}

/** @internal */
export interface ViewWillRasterize<V extends View = View> {
  viewWillRasterize(view: V): void;
}

/** @internal */
export interface ViewDidRasterize<V extends View = View> {
  viewDidRasterize(view: V): void;
}

/** @internal */
export interface ViewWillComposite<V extends View = View> {
  viewWillComposite(view: V): void;
}

/** @internal */
export interface ViewDidComposite<V extends View = View> {
  viewDidComposite(view: V): void;
}
