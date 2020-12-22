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

import {AnyLength, Length} from "@swim/math";
import {AnyColor, Color} from "@swim/color";
import {ViewInit, View, ViewAnimator} from "@swim/view";
import {Graphics} from "../graphics/Graphics";
import {GraphicsIconView} from "./GraphicsIconView";
import {SvgIconPathView} from "./SvgIconPathView";
import {SvgIconView} from "./SvgIconView";
import {HtmlIconView} from "./HtmlIconView";

export interface IconViewInit extends ViewInit {
  xAlign?: number;
  yAlign?: number;
  iconWidth?: AnyLength;
  iconHeight?: AnyLength;
  iconColor?: AnyColor;
  graphics?: Graphics;
}

export interface IconView extends View {
  readonly xAlign: ViewAnimator<this, number | undefined>;

  readonly yAlign: ViewAnimator<this, number | undefined>;

  readonly iconWidth: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  readonly iconHeight: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  readonly iconColor: ViewAnimator<this, Color | undefined, AnyColor | undefined>;

  readonly graphics: ViewAnimator<this, Graphics | undefined>;
}

/** @hidden */
export const IconView = {
  /** @hidden */
  is(object: unknown): object is IconView {
    if (typeof object === "object" && object !== null) {
      const view = object as IconView;
      return view instanceof IconView.Graphics
          || view instanceof IconView.Path
          || view instanceof IconView.Svg
          || view instanceof IconView.Html
          || view instanceof View
          && "xAlign" in view
          && "yAlign" in view
          && "iconWidth" in view
          && "iconHeight" in view
          && "iconColor" in view
          && "graphics" in view;
    }
    return false;
  },

  initView(view: IconView, init: IconViewInit): void {
    if (init.xAlign !== void 0) {
      view.xAlign(init.xAlign);
    }
    if (init.yAlign !== void 0) {
      view.yAlign(init.yAlign);
    }
    if (init.iconWidth !== void 0) {
      view.iconWidth(init.iconWidth);
    }
    if (init.iconHeight !== void 0) {
      view.iconHeight(init.iconHeight);
    }
    if (init.iconColor !== void 0) {
      view.iconColor(init.iconColor);
    }
    if (init.graphics !== void 0) {
      view.graphics(init.graphics);
    }
  },

  // Forward type declarations
  /** @hidden */
  Graphics: void 0 as unknown as typeof GraphicsIconView, // defined by GraphicsIconView
  /** @hidden */
  Path: void 0 as unknown as typeof SvgIconPathView, // defined by PathIconView
  /** @hidden */
  Svg: void 0 as unknown as typeof SvgIconView, // defined by SvgIconView
  /** @hidden */
  Html: void 0 as unknown as typeof HtmlIconView, // defined by HtmlIconView
};
