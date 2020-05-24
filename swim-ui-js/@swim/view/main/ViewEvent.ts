// Copyright 2015-2020 SWIM.AI inc.
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

import {View} from "./View";

export interface ViewEventInit extends EventInit {
  targetView?: View;
  relatedTargetView?: View | null;
}

export interface ViewEvent extends Event {
  targetView?: View;
  relatedTargetView?: View | null;
}

export interface ViewMouseEventInit extends MouseEventInit, ViewEventInit {
}

export interface ViewMouseEvent extends MouseEvent, ViewEvent {
}

export interface ViewPointerEventInit extends PointerEventInit, ViewEventInit {
}

export interface ViewPointerEvent extends PointerEvent, ViewEvent {
}

export interface ViewTouchInit extends TouchInit {
  targetView?: View;
}

export interface ViewTouch extends Touch {
  targetView?: View;
}

export interface ViewTouchEventInit extends TouchEventInit, ViewEventInit {
  targetViewTouches?: TouchList;
}

export interface ViewTouchEvent extends TouchEvent, ViewEvent {
  targetViewTouches?: TouchList;
}

/** @hidden */
export interface ViewEventHandler {
  listener: EventListenerOrEventListenerObject;
  capture: boolean;
  passive: boolean;
  once: boolean;
}
