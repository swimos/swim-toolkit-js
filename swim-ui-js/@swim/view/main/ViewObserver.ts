// Copyright 2015-2020 Swim inc.
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

import type {Transition} from "@swim/animation";
import type {MoodVector, ThemeMatrix} from "@swim/theme";
import type {ViewContextType} from "./ViewContext";
import type {View} from "./View";

export type ViewObserverType<V extends View> =
  V extends {readonly viewObservers: ReadonlyArray<infer VO>} ? VO : never;

export interface ViewObserver<V extends View = View> {
  viewWillSetParentView?(newParentView: View | null, oldParentView: View | null, view: V): void;

  viewDidSetParentView?(newParentView: View | null, oldParentView: View | null, view: V): void;

  viewWillInsertChildView?(childView: View, targetView: View | null | undefined, view: V): void;

  viewDidInsertChildView?(childView: View, targetView: View | null | undefined, view: V): void;

  viewWillRemoveChildView?(childView: View, view: V): void;

  viewDidRemoveChildView?(childView: View, view: V): void;

  viewWillMount?(view: V): void;

  viewDidMount?(view: V): void;

  viewWillUnmount?(view: V): void;

  viewDidUnmount?(view: V): void;

  viewWillPower?(view: V): void;

  viewDidPower?(view: V): void;

  viewWillUnpower?(view: V): void;

  viewDidUnpower?(view: V): void;

  viewWillCull?(view: V): void;

  viewDidCull?(view: V): void;

  viewWillUncull?(view: V): void;

  viewDidUncull?(view: V): void;

  viewWillResize?(viewContext: ViewContextType<V>, view: V): void;

  viewDidResize?(viewContext: ViewContextType<V>, view: V): void;

  viewWillScroll?(viewContext: ViewContextType<V>, view: V): void;

  viewDidScroll?(viewContext: ViewContextType<V>, view: V): void;

  viewWillChange?(viewContext: ViewContextType<V>, view: V): void;

  viewDidChange?(viewContext: ViewContextType<V>, view: V): void;

  viewWillAnimate?(viewContext: ViewContextType<V>, view: V): void;

  viewDidAnimate?(viewContext: ViewContextType<V>, view: V): void;

  viewWillProject?(viewContext: ViewContextType<V>, view: V): void;

  viewDidProject?(viewContext: ViewContextType<V>, view: V): void;

  viewWillLayout?(viewContext: ViewContextType<V>, view: V): void;

  viewDidLayout?(viewContext: ViewContextType<V>, view: V): void;

  viewWillRender?(viewContext: ViewContextType<V>, view: V): void;

  viewDidRender?(viewContext: ViewContextType<V>, view: V): void;

  viewWillComposite?(viewContext: ViewContextType<V>, view: V): void;

  viewDidComposite?(viewContext: ViewContextType<V>, view: V): void;

  viewWillApplyTheme?(theme: ThemeMatrix, mood: MoodVector, transition: Transition<any> | null, view: V): void;

  viewDidApplyTheme?(theme: ThemeMatrix, mood: MoodVector, transition: Transition<any> | null, view: V): void;
}

/** @hidden */
export interface WillResizeObserver<V extends View = View> {
  viewWillResize(viewContext: ViewContextType<V>, view: V): void;
}

/** @hidden */
export interface DidResizeObserver<V extends View = View> {
  viewDidResize(viewContext: ViewContextType<V>, view: V): void;
}

/** @hidden */
export interface WillScrollObserver<V extends View = View> {
  viewWillScroll(viewContext: ViewContextType<V>, view: V): void;
}

/** @hidden */
export interface DidScrollObserver<V extends View = View> {
  viewDidScroll(viewContext: ViewContextType<V>, view: V): void;
}

/** @hidden */
export interface WillChangeObserver<V extends View = View> {
  viewWillChange(viewContext: ViewContextType<V>, view: V): void;
}

/** @hidden */
export interface DidChangeObserver<V extends View = View> {
  viewDidChange(viewContext: ViewContextType<V>, view: V): void;
}

/** @hidden */
export interface WillAnimateObserver<V extends View = View> {
  viewWillAnimate(viewContext: ViewContextType<V>, view: V): void;
}

/** @hidden */
export interface DidAnimateObserver<V extends View = View> {
  viewDidAnimate(viewContext: ViewContextType<V>, view: V): void;
}

/** @hidden */
export interface WillProjectObserver<V extends View = View> {
  viewWillProject(viewContext: ViewContextType<V>, view: V): void;
}

/** @hidden */
export interface DidProjectObserver<V extends View = View> {
  viewDidProject(viewContext: ViewContextType<V>, view: V): void;
}

/** @hidden */
export interface WillLayoutObserver<V extends View = View> {
  viewWillLayout(viewContext: ViewContextType<V>, view: V): void;
}

/** @hidden */
export interface DidLayoutObserver<V extends View = View> {
  viewDidLayout(viewContext: ViewContextType<V>, view: V): void;
}

/** @hidden */
export interface WillRenderObserver<V extends View = View> {
  viewWillRender(viewContext: ViewContextType<V>, view: V): void;
}

/** @hidden */
export interface DidRenderObserver<V extends View = View> {
  viewDidRender(viewContext: ViewContextType<V>, view: V): void;
}

/** @hidden */
export interface WillCompositeObserver<V extends View = View> {
  viewWillComposite(viewContext: ViewContextType<V>, view: V): void;
}

/** @hidden */
export interface DidCompositeObserver<V extends View = View> {
  viewDidComposite(viewContext: ViewContextType<V>, view: V): void;
}
