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

import {AnyTiming, Timing} from "@swim/mapping";
import {AnyLength, Length} from "@swim/math";
import {Look, Feel, MoodVector, ThemeMatrix} from "@swim/theme";
import {
  ViewContextType,
  View,
  ViewEdgeInsets,
  ViewProperty,
  ViewAnimator,
  ViewFastener,
  PositionGestureInput,
  PositionGestureDelegate,
} from "@swim/view";
import {Height, HtmlView} from "@swim/dom";
import {Graphics, HtmlIconView} from "@swim/graphics";
import {ButtonMembrane} from "@swim/controls";
import type {ListItemObserver} from "./ListItemObserver";
import type {ListItemController} from "./ListItemController";
import {ListView} from "./ListView";

export class ListItem extends ButtonMembrane implements PositionGestureDelegate {
  constructor(node: HTMLElement) {
    super(node);
    this.onClick = this.onClick.bind(this);
    this.initListItem();
  }

  protected initListItem(): void {
    this.addClass("list-item");
    this.position.setAutoState("relative");
    this.display.setAutoState("flex");
    this.flexShrink.setAutoState(0);
    this.height.setAutoState(44);
    this.boxSizing.setAutoState("border-box");
    this.lineHeight.setAutoState(this.height.state);
    this.overflowX.setAutoState("hidden");
    this.overflowY.setAutoState("hidden");
    this.cursor.setAutoState("pointer");
    this.userSelect.setAutoState("none");
  }

  declare readonly viewController: ListItemController | null;

  declare readonly viewObservers: ReadonlyArray<ListItemObserver>;

  @ViewProperty({type: Boolean, state: false})
  declare highlighted: ViewProperty<this, boolean>;

  @ViewProperty({type: Object, inherit: true})
  declare edgeInsets: ViewProperty<this, ViewEdgeInsets | undefined>;

  @ViewAnimator({type: Length, inherit: true})
  declare collapsedWidth: ViewAnimator<this, Length | undefined, AnyLength | undefined>;

  @ViewAnimator({type: Number, inherit: true, updateFlags: View.NeedsAnimate})
  declare drawerStretch: ViewAnimator<this, number | undefined>; // 0 = collapsed; 1 = expanded

  @ViewFastener<ListItem, HtmlView, Graphics>({
    key: true,
    type: HtmlView,
    onSetView(iconView: HtmlView | null): void {
      if (iconView !== null) {
        this.owner.initIconView(iconView);
      }
    },
    createView(): HtmlView | null {
      return this.owner.createIconView();
    },
    insertView(parentView: View, childView: HtmlView, targetView: View | null, key: string | undefined): void {
      parentView.prependChildView(childView, key);
    },
    fromAny(value: HtmlView | Graphics): HtmlView | null {
      if (value instanceof HtmlView) {
        return value;
      } else {
        const iconView = this.owner.createIconView();
        iconView.graphics.setAutoState(value);
        return iconView;
      }
    },
  })
  declare icon: ViewFastener<ListItem, HtmlView, Graphics>;

  protected createIconView(): HtmlIconView {
    return HtmlIconView.create();
  }

  protected initIconView(iconView: HtmlView): void {
    iconView.flexShrink.setAutoState(0);
    iconView.width.setAutoState(this.collapsedWidth.getStateOr(ListItem.DefaultCollapsedWidth));
    iconView.height.setAutoState(this.height.state);
    if (iconView instanceof HtmlIconView) {
      iconView.iconWidth.setAutoState(24);
      iconView.iconHeight.setAutoState(24);
      iconView.iconColor.setState(this.getLook(Look.mutedColor));
    }
  }

  @ViewFastener<ListItem, HtmlView, string | undefined>({
    key: true,
    type: HtmlView,
    onSetView(labelView: HtmlView | null): void {
      if (labelView !== null) {
        this.owner.initLabelView(labelView);
      }
    },
    createView(): HtmlView | null {
      return this.owner.createLabelView();
    },
    insertView(parentView: View, childView: HtmlView, targetView: View | null, key: string | undefined): void {
      targetView = this.owner.accessory.view;
      parentView.insertChildView(childView, targetView, key);
    },
    fromAny(value: HtmlView | string | undefined): HtmlView | null {
      if (value instanceof HtmlView) {
        return value;
      } else if (typeof value === "string") {
        const labelView = this.owner.createLabelView();
        labelView.text(value);
        return labelView;
      } else {
        return null;
      }
    },
  })
  declare label: ViewFastener<ListItem, HtmlView, string | undefined>;

  protected createLabelView(): HtmlView {
    const labelView = HtmlView.span.create();
    labelView.display.setAutoState("block");
    labelView.fontFamily.setAutoState("system-ui, 'Open Sans', sans-serif");
    labelView.fontSize.setAutoState(17);
    labelView.whiteSpace.setAutoState("nowrap");
    labelView.textOverflow.setAutoState("ellipsis");
    labelView.overflowX.setAutoState("hidden");
    labelView.overflowY.setAutoState("hidden");
    return labelView;
  }

  protected initLabelView(labelView: HtmlView): void {
    labelView.flexGrow.setAutoState(1);
    labelView.flexShrink.setAutoState(0);
    if (labelView.color.isAuto()) {
      const itemColor = this.getLook(this.highlighted.state ? Look.color : Look.mutedColor);
      labelView.color.setAutoState(itemColor);
    }
  }

  @ViewFastener<ListItem, HtmlView, Graphics | string>({
    key: true,
    type: HtmlView,
    onSetView(accessoryView: HtmlView | null): void {
      if (accessoryView !== null) {
        this.owner.initAccessoryView(accessoryView);
      }
    },
    createView(): HtmlView | null {
      return this.owner.createAccessoryView();
    },
    insertView(parentView: View, childView: HtmlView, targetView: View | null, key: string | undefined): void {
      parentView.appendChildView(childView, key);
    },
    fromAny(value: HtmlView | Graphics | string): HtmlView | null {
      if (value instanceof HtmlView) {
        return value;
      } else if (typeof value === "string") {
        const accessoryView = this.owner.createAccessoryView();
        accessoryView.text(value);
        return accessoryView;
      } else {
        const accessoryView = this.owner.createAccessoryIconView();
        accessoryView.graphics.setAutoState(value);
        return accessoryView;
      }
    },
  })
  declare accessory: ViewFastener<ListItem, HtmlView, Graphics | string>;

  protected createAccessoryIconView(): HtmlIconView {
    return HtmlIconView.create();
  }

  protected createAccessoryView(): HtmlView {
    const accessoryView = HtmlView.span.create();
    accessoryView.display.setAutoState("block");
    accessoryView.fontFamily.setAutoState("system-ui, 'Open Sans', sans-serif");
    accessoryView.fontSize.setAutoState(17);
    accessoryView.whiteSpace.setAutoState("nowrap");
    accessoryView.textOverflow.setAutoState("ellipsis");
    accessoryView.overflowX.setAutoState("hidden");
    accessoryView.overflowY.setAutoState("hidden");
    return accessoryView;
  }

  protected initAccessoryView(accessoryView: HtmlView): void {
    accessoryView.flexShrink.setAutoState(0);
    accessoryView.width.setAutoState(this.collapsedWidth.getStateOr(ListItem.DefaultCollapsedWidth));
    if (accessoryView instanceof HtmlIconView) {
      accessoryView.iconWidth.setAutoState(24);
      accessoryView.iconHeight.setAutoState(24);
      accessoryView.iconColor.setState(this.getLook(Look.mutedColor));
    } else if (accessoryView.color.isAuto()) {
      const itemColor = this.getLook(this.highlighted.state ? Look.color : Look.mutedColor);
      accessoryView.color.setAutoState(itemColor);
    }
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector, timing: Timing | boolean): void {
    super.onApplyTheme(theme, mood, timing);
    const itemColor = theme.dot(this.highlighted.state ? Look.color : Look.mutedColor, mood);

    if (this.backgroundColor.isAuto()) {
      let backgroundColor = theme.dot(Look.backgroundColor, mood);
      if (backgroundColor !== void 0 && !this.highlighted.state && !this.gesture.isHovering()) {
        backgroundColor = backgroundColor.alpha(0);
      }
      this.backgroundColor.setAutoState(backgroundColor, timing);
    }

    const iconView = this.icon.view;
    if (iconView instanceof HtmlIconView) {
      iconView.iconColor.setState(itemColor, timing);
    }

    const labelView = this.label.view;
    if (labelView !== null) {
      labelView.color.setAutoState(itemColor, timing);
    }

    const accessoryView = this.accessory.view;
    if (accessoryView instanceof HtmlIconView) {
      accessoryView.iconColor.setState(itemColor, timing);
    } else if (accessoryView !== null) {
      accessoryView.color.setAutoState(itemColor, timing);
    }
  }

  protected onMount(): void {
    super.onMount();
    this.on("click", this.onClick);
  }

  protected onUnmount(): void {
    this.off("click", this.onClick);
    super.onUnmount();
  }

  protected onAnimate(viewContext: ViewContextType<this>): void {
    super.onAnimate(viewContext);
    this.lineHeight.setAutoState(this.height.state);
    const drawerStretch = this.drawerStretch.value;
    if (drawerStretch !== void 0) {
      const labelView = this.label.view;
      if (labelView !== null) {
        labelView.display.setAutoState(drawerStretch === 0 ? "none" : "block");
        labelView.opacity.setAutoState(drawerStretch);
      }
      const accessoryView = this.accessory.view;
      if (accessoryView !== null) {
        accessoryView.display.setAutoState(drawerStretch === 0 ? "none" : "block");
        accessoryView.opacity.setAutoState(drawerStretch);
      }
    }
  }

  protected onLayout(viewContext: ViewContextType<this>): void {
    super.onLayout(viewContext);
    const edgeInsets = this.edgeInsets.state;
    if (edgeInsets !== void 0) {
      let collapsedWidth: Length | number | undefined = this.collapsedWidth.state;
      collapsedWidth = collapsedWidth !== void 0 ? collapsedWidth.pxValue() : ListItem.DefaultCollapsedWidth;
      let height: Height | number | undefined = this.height.state;
      height = height instanceof Length ? height.pxValue() : this.clientBounds.height;
      const iconPadding = Math.max(0, (collapsedWidth - height) / 2);

      this.paddingLeft.setAutoState(Math.max(0, edgeInsets.insetLeft - iconPadding));
      const iconView = this.icon.view;
      if (iconView !== null) {
        iconView.width.setAutoState(collapsedWidth);
        iconView.height.setAutoState(this.height.state);
      }
      const labelView = this.label.view;
      const accessoryView = this.accessory.view;
      if (accessoryView !== null) {
        accessoryView.paddingRight.setAutoState(edgeInsets.insetRight);
        if (labelView !== null) {
          labelView.paddingRight.setAutoState(void 0);
        }
      } else if (labelView !== null) {
        labelView.paddingRight.setAutoState(edgeInsets.insetRight);
      }
    }
  }

  highlight(timing?: AnyTiming | boolean): this {
    if (!this.highlighted.state) {
      this.highlighted.setState(true);
      this.modifyMood(Feel.default, [Feel.selected, 1], [Feel.hovering, void 0]);
      if (timing === true) {
        timing = this.getLook(Look.timing);
      } else {
        timing = Timing.fromAny(timing);
      }
      if (this.backgroundColor.isAuto()) {
        this.backgroundColor.setAutoState(this.getLook(Look.backgroundColor));
      }
      const iconView = this.icon.view;
      if (iconView instanceof HtmlIconView) {
        iconView.iconColor.setState(this.getLook(Look.color), timing);
      }
      const labelView = this.label.view;
      if (labelView !== null && labelView.color.isAuto()) {
        labelView.color.setAutoState(this.getLook(Look.color), timing);
      }
      const accessoryView = this.accessory.view;
      if (accessoryView instanceof HtmlIconView) {
        accessoryView.iconColor.setState(this.getLook(Look.color), timing);
      } else if (accessoryView !== null && accessoryView.color.isAuto()) {
        accessoryView.color.setAutoState(this.getLook(Look.color), timing);
      }
    }
    return this;
  }

  unhighlight(timing?: AnyTiming | boolean): this {
    if (this.highlighted.state) {
      this.highlighted.setState(false);
      this.modifyMood(Feel.default, [Feel.selected, void 0]);
      if (timing === true) {
        timing = this.getLookOr(Look.timing, false);
      } else {
        timing = Timing.fromAny(timing);
      }
      if (this.backgroundColor.isAuto()) {
        let backgroundColor = this.getLook(Look.backgroundColor);
        if (backgroundColor !== void 0 && !this.gesture.isHovering()) {
          backgroundColor = backgroundColor.alpha(0);
        }
        this.backgroundColor.setAutoState(backgroundColor, timing);
      }
      const iconView = this.icon.view;
      if (iconView instanceof HtmlIconView) {
        iconView.iconColor.setState(this.getLook(Look.mutedColor), timing);
      }
      const labelView = this.label.view;
      if (labelView !== null && labelView.color.isAuto()) {
        labelView.color.setAutoState(this.getLook(Look.mutedColor), timing);
      }
      const accessoryView = this.accessory.view;
      if (accessoryView instanceof HtmlIconView) {
        accessoryView.iconColor.setState(this.getLook(Look.mutedColor), timing);
      } else if (accessoryView !== null && accessoryView.color.isAuto()) {
        accessoryView.color.setAutoState(this.getLook(Look.mutedColor), timing);
      }
    }
    return this;
  }

  protected glow(input: PositionGestureInput): void {
    if (!this.highlighted.state) {
      super.glow(input);
    }
  }

  get hovers(): boolean {
    return true;
  }

  setHovers(hovers: boolean): void {
    if (this.hovers !== hovers) {
      Object.defineProperty(this, "hovers", {
        value: hovers,
        configurable: true,
        enumerable: true,
      });
    }
  }

  didStartHovering(): void {
    if (!this.highlighted.state && this.hovers) {
      this.modifyMood(Feel.default, [Feel.hovering, 1]);
      if (this.backgroundColor.isAuto()) {
        const timing = this.gesture.isPressing() ? this.getLook(Look.timing) : false;
        this.backgroundColor.setAutoState(this.getLook(Look.backgroundColor), timing);
      }
    }
  }

  didStopHovering(): void {
    this.modifyMood(Feel.default, [Feel.hovering, void 0]);
    if (this.backgroundColor.isAuto()) {
      let backgroundColor = this.getLook(Look.backgroundColor);
      if (backgroundColor !== void 0 && !this.highlighted.state) {
        backgroundColor = backgroundColor.alpha(0);
      }
      const timing = this.getLook(Look.timing);
      this.backgroundColor.setAutoState(backgroundColor, timing);
    }
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();

    const viewObservers = this.viewObservers;
    for (let i = 0, n = viewObservers.length; i < n; i += 1) {
      const viewObserver = viewObservers[i]!;
      if (viewObserver.listItemDidPress !== void 0) {
        viewObserver.listItemDidPress(this);
      }
    }
    const viewController = this.viewController;
    if (viewController !== null && viewController.listItemDidPress !== void 0) {
      viewController.listItemDidPress(this);
    }

    const parentView = this.parentView;
    if (parentView instanceof ListView) {
      parentView.onPressItem(this);
    }
  }

  /** @hidden */
  static DefaultCollapsedWidth: number = 60;
}
