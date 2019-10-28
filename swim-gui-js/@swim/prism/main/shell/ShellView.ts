// Copyright 2015-2019 SWIM.AI inc.
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

import {AnyColor, Color} from "@swim/color";
import {Ease, Tween, Transition} from "@swim/transition";
import {Constraint} from "@swim/constraint";
import {MemberAnimator, LayoutAnchor, View, HtmlView, HtmlAppView, PopoverState, PopoverOptions, Popover, PopoverView} from "@swim/view";
import {ActionStack} from "../action/ActionStack";
import {ActionStackObserver} from "../action/ActionStackObserver";
import {Toolbar} from "../toolbar/Toolbar";
import {SearchField} from "../search/SearchField";
import {SearchPopover} from "../search/SearchPopover";
import {SearchBar} from "../search/SearchBar";
import {DockPopover} from "../dock/DockPopover";
import {AccountPopover} from "../account/AccountPopover";
import {SettingsDialog} from "../settings/SettingsDialog";
import {CabinetView} from "../cabinet/CabinetView";
import {InspectorView} from "../inspector/InspectorView";
import {TreeView} from "../tree/TreeView";
import {BeamView} from "./BeamView";
import {ScrimView} from "./ScrimView";
import {ShellViewObserver} from "./ShellViewObserver";
import {ShellViewController} from "./ShellViewController";

export class ShellView extends HtmlAppView implements ActionStackObserver {
  /** @hidden */
  _viewController: ShellViewController | null;
  /** @hidden */
  _isMobile: boolean | null;
  /** @hidden */
  _isModal: boolean;

  /** @hidden */
  _searchPopover: SearchPopover | null;
  /** @hidden */
  _dockPopover: DockPopover | null;
  /** @hidden */
  _accountPopover: AccountPopover | null;
  /** @hidden */
  _settingsDialog: SettingsDialog | null;

  /** @hidden */
  _inspectorState: PopoverState;
  /** @hidden */
  _inspectorTransition: Transition<any>;

  /** @hidden */
  _treeLeftMobileConstraint: Constraint;
  /** @hidden */
  _treeRightMobileConstraint: Constraint;
  /** @hidden */
  _treeInsetLeftMobileConstraint: Constraint;
  /** @hidden */
  _treeInsetRightMobileConstraint: Constraint;
  /** @hidden */
  _treeMinInsetLeftMobileConstraint: Constraint;
  /** @hidden */
  _treeMinInsetRightMobileConstraint: Constraint;
  /** @hidden */
  _cabinetBarWidthMobileConstraint: Constraint;
  /** @hidden */
  _cabinetBarInsetLeftMobileConstraint: Constraint;
  /** @hidden */
  _searchBarWidthMobileConstraint: Constraint;
  /** @hidden */
  _searchBarInsetLeftMobileConstraint: Constraint;
  /** @hidden */
  _treeBarWidthMobileConstraint: Constraint;
  /** @hidden */
  _treeBarInsetRightMobileConstraint: Constraint;
  /** @hidden */
  _dockBarWidthMobileConstraint: Constraint;
  /** @hidden */
  _dockBarInsetRightMobileConstraint: Constraint;
  /** @hidden */
  _cabinetTopMobileConstraint: Constraint;
  /** @hidden */
  _cabinetExpandedWidthMobileConstraint: Constraint;
  /** @hidden */
  _cabinetMaxExpandedWidthMobileConstraint: Constraint;
  /** @hidden */
  _inspectorTopMobileConstraint: Constraint;
  /** @hidden */
  _inspectorWidthMobileConstraint: Constraint;
  /** @hidden */
  _actionStackInsetRightMobileConstraint: Constraint;
  /** @hidden */
  _actionStackInsetBottomMobileConstraint: Constraint;

  /** @hidden */
  _treeLeftDesktopConstraint: Constraint;
  /** @hidden */
  _treeRightDesktopConstraint: Constraint;
  /** @hidden */
  _treeInsetLeftDesktopConstraint: Constraint;
  /** @hidden */
  _treeInsetRightDesktopConstraint: Constraint;
  /** @hidden */
  _cabinetBarWidthDesktopConstraint: Constraint;
  /** @hidden */
  _cabinetBarInsetLeftDesktopConstraint: Constraint;
  /** @hidden */
  _searchBarWidthDesktopConstraint: Constraint;
  /** @hidden */
  _searchBarInsetLeftDesktopConstraint: Constraint;
  /** @hidden */
  _treeBarWidthDesktopConstraint: Constraint;
  /** @hidden */
  _treeBarInsetRightDesktopConstraint: Constraint;
  /** @hidden */
  _dockBarWidthDesktopConstraint: Constraint;
  /** @hidden */
  _dockBarInsetRightDesktopConstraint: Constraint;
  /** @hidden */
  _cabinetTopDesktopConstraint: Constraint;
  /** @hidden */
  _cabinetExpandedWidthDesktopConstraint: Constraint;
  /** @hidden */
  _cabinetMaxExpandedWidthDesktopConstraint: Constraint;
  /** @hidden */
  _inspectorTopDesktopConstraint: Constraint;
  /** @hidden */
  _inspectorWidthDesktopConstraint: Constraint;
  /** @hidden */
  _inspectorMaxWidthDesktopConstraint: Constraint;
  /** @hidden */
  _actionStackInsetRightDesktopConstraint: Constraint;
  /** @hidden */
  _actionStackInsetBottomDesktopConstraint: Constraint;

  /** @hidden */
  _cabinetWidthExpandedConstraint: Constraint;
  /** @hidden */
  _cabinetWidthCollapsedConstraint: Constraint;

  /** @hidden */
  _actionStackMinInsetRightConstraint: Constraint;
  /** @hidden */
  _actionStackMinInsetBottomConstraint: Constraint;

  /** @hidden */
  _scrimTopConstraint: Constraint | undefined;
  /** @hidden */
  _beamHeightConstraint: Constraint | undefined;
  /** @hidden */
  _treeTopConstraint: Constraint | undefined;
  /** @hidden */
  _treeLeftConstraint: Constraint | undefined;
  /** @hidden */
  _treeRightConstraint: Constraint | undefined;
  /** @hidden */
  _treeInsetLeftConstraint: Constraint | undefined;
  /** @hidden */
  _treeInsetRightConstraint: Constraint | undefined;
  /** @hidden */
  _toolbarTopConstraint: Constraint | undefined;
  /** @hidden */
  _toolbarHeightConstraint: Constraint | undefined;
  /** @hidden */
  _toolbarCabinetBarWidthConstraint: Constraint | undefined;
  /** @hidden */
  _toolbarCabinetBarInsetLeftConstraint: Constraint | undefined;
  /** @hidden */
  _toolbarSearchBarWidthConstraint: Constraint | undefined;
  /** @hidden */
  _toolbarSearchBarInsetLeftConstraint: Constraint | undefined;
  /** @hidden */
  _toolbarTreeBarWidthConstraint: Constraint | undefined;
  /** @hidden */
  _toolbarTreeBarInsetRightConstraint: Constraint | undefined;
  /** @hidden */
  _toolbarDockBarWidthConstraint: Constraint | undefined;
  /** @hidden */
  _toolbarDockBarInsetRightConstraint: Constraint | undefined;
  /** @hidden */
  _cabinetTopConstraint: Constraint | undefined;
  /** @hidden */
  _cabinetExpandedWidthConstraint: Constraint | undefined;
  /** @hidden */
  _cabinetCollapsedWidthConstraint: Constraint | undefined;
  /** @hidden */
  _inspectorTopConstraint: Constraint | undefined;
  /** @hidden */
  _inspectorWidthConstraint: Constraint | undefined;
  /** @hidden */
  _actionStackRightConstraint: Constraint | undefined;
  /** @hidden */
  _actionStackBottomConstraint: Constraint | undefined;

  constructor(node: HTMLElement, key: string | null = null) {
    super(node, key);
    this.onSearchInputChange = this.onSearchInputChange.bind(this);
    this.onTreeScroll = this.onTreeScroll.bind(this);
    this.beamHeight.setState(4);
    this.toolbarHeight.setState(60);
    this.beamColor.setState(Color.parse("#00a6ed"));

    this._isMobile = null;
    this._isModal = false;
    this._searchPopover = null;
    this._dockPopover = null;
    this._accountPopover = null;
    this._settingsDialog = null;

    this._inspectorState = "hidden";
    this._inspectorTransition = Transition.duration(250, Ease.cubicOut);

    this._treeLeftMobileConstraint = this.constraint(this.treeLeft, "eq", 0);
    this._treeRightMobileConstraint = this.constraint(this.treeRight, "eq", 0);
    this._treeInsetLeftMobileConstraint = this.constraint(this.treeInsetLeft, "eq", this.safeAreaInsetLeft);
    this._treeInsetRightMobileConstraint = this.constraint(this.treeInsetRight, "eq", this.safeAreaInsetRight);
    this._treeMinInsetLeftMobileConstraint = this.constraint(this.treeInsetLeft, "ge", 16);
    this._treeMinInsetRightMobileConstraint = this.constraint(this.treeInsetRight, "ge", 16);
    this._cabinetBarWidthMobileConstraint = this.constraint(this.cabinetBarWidth, "eq", this.safeAreaInsetLeft.plus(52));
    this._cabinetBarInsetLeftMobileConstraint = this.constraint(this.cabinetBarInsetLeft, "eq", this.treeInsetLeft);
    this._searchBarWidthMobileConstraint = this.constraint(this.searchBarWidth, "eq", this.widthAnchor.minus(this.cabinetBarWidth).minus(this.dockBarWidth));
    this._searchBarInsetLeftMobileConstraint = this.constraint(this.searchBarInsetLeft, "eq", 4);
    this._treeBarWidthMobileConstraint = this.constraint(this.treeBarWidth, "eq", 0);
    this._treeBarInsetRightMobileConstraint = this.constraint(this.treeBarInsetRight, "eq", 4);
    this._dockBarWidthMobileConstraint = this.constraint(this.dockBarWidth, "eq", this.safeAreaInsetRight.plus(52));
    this._dockBarInsetRightMobileConstraint = this.constraint(this.dockBarInsetRight, "eq", this.treeInsetRight);
    this._cabinetTopMobileConstraint = this.constraint(this.cabinetTop, "eq", this.beamHeight);
    this._cabinetExpandedWidthMobileConstraint = this.constraint(this.cabinetExpandedWidth, "le", this.widthAnchor.times(0.9));
    this._cabinetMaxExpandedWidthMobileConstraint = this.constraint(this.cabinetExpandedWidth, "eq", this.safeAreaInsetLeft.plus(200), "weak");
    this._inspectorTopMobileConstraint = this.constraint(this.inspectorTop, "eq", this.beamHeight);
    this._inspectorWidthMobileConstraint = this.constraint(this.inspectorWidth, "le", this.widthAnchor);
    this._actionStackInsetRightMobileConstraint = this.constraint(this.actionStackInsetRight, "eq", this.safeAreaInsetRight);
    this._actionStackInsetBottomMobileConstraint = this.constraint(this.actionStackInsetBottom, "eq", this.safeAreaInsetBottom.plus(16));

    this._treeLeftDesktopConstraint = this.constraint(this.treeLeft, "eq", this.cabinetWidth);
    this._treeRightDesktopConstraint = this.constraint(this.treeRight, "eq", this.inspectorWidth);
    this._treeInsetLeftDesktopConstraint = this.constraint(this.treeInsetLeft, "eq", 24);
    this._treeInsetRightDesktopConstraint = this.constraint(this.treeInsetRight, "eq", 16);
    this._cabinetBarWidthDesktopConstraint = this.constraint(this.cabinetBarWidth, "eq", this.cabinetExpandedWidth);
    this._cabinetBarInsetLeftDesktopConstraint = this.constraint(this.cabinetBarInsetLeft, "eq", 16);
    this._searchBarWidthDesktopConstraint = this.constraint(this.searchBarWidth, "eq", this.widthAnchor.times(0.7).minus(this.cabinetBarWidth.times(0.7)).minus(this.dockBarWidth.times(0.7)));
    this._searchBarInsetLeftDesktopConstraint = this.constraint(this.searchBarInsetLeft, "eq", this.treeInsetLeft);
    this._treeBarWidthDesktopConstraint = this.constraint(this.treeBarWidth, "eq", this.widthAnchor.times(0.3).minus(this.cabinetBarWidth.times(0.3)).minus(this.dockBarWidth.times(0.3)));
    this._treeBarInsetRightDesktopConstraint = this.constraint(this.treeBarInsetRight, "eq", this.treeInsetRight);
    this._dockBarWidthDesktopConstraint = this.constraint(this.dockBarWidth, "eq", this.inspectorWidth);
    this._dockBarInsetRightDesktopConstraint = this.constraint(this.dockBarInsetRight, "eq", 16);
    this._cabinetTopDesktopConstraint = this.constraint(this.cabinetTop, "eq", this.beamHeight.plus(this.toolbarHeight));
    this._cabinetExpandedWidthDesktopConstraint = this.constraint(this.cabinetExpandedWidth, "le", this.widthAnchor.times(0.25));
    this._cabinetMaxExpandedWidthDesktopConstraint = this.constraint(this.cabinetExpandedWidth, "eq", 200, "weak");
    this._inspectorTopDesktopConstraint = this.constraint(this.inspectorTop, "eq", this.beamHeight.plus(this.toolbarHeight));
    this._inspectorWidthDesktopConstraint = this.constraint(this.inspectorWidth, "le", this.widthAnchor.times(0.33));
    this._inspectorMaxWidthDesktopConstraint = this.constraint(this.inspectorWidth, "eq", 360, "weak");
    this._actionStackInsetRightDesktopConstraint = this.constraint(this.actionStackInsetRight, "eq", 16);
    this._actionStackInsetBottomDesktopConstraint = this.constraint(this.actionStackInsetBottom, "eq", 16);

    this.cabinetCollapsedWidth.setState(60);
    this._cabinetWidthExpandedConstraint = this.constraint(this.cabinetWidth, "eq", this.cabinetExpandedWidth).enabled(true);
    this._cabinetWidthCollapsedConstraint = this.constraint(this.cabinetWidth, "eq", this.cabinetCollapsedWidth);

    this._actionStackMinInsetRightConstraint = this.constraint(this.actionStackInsetRight, "ge", 16).enabled(true);
    this._actionStackMinInsetBottomConstraint = this.constraint(this.actionStackInsetBottom, "ge", 16).enabled(true);

    this.initChildren();
  }

  protected initNode(node: HTMLElement): void {
    this.addClass("shell")
        .position("relative")
        .width("100%")
        .height("100%")
        .backgroundColor("#1e2022")
        .userSelect("none");
  }

  protected initChildren(): void {
    this.append(ScrimView, "scrim")
        .display("none");
    this.append(BeamView, "beam");
    this.append(TreeView, "tree")
        .visibility("hidden");
    this.append(Toolbar, "toolbar");
    this.append(CabinetView, "cabinet")
        .display("none");
    this.append(InspectorView, "inspector")
        .display("none");
    this.append(ActionStack, "actionStack")
        .visibility("hidden");
  }

  get viewController(): ShellViewController | null {
    return this._viewController;
  }

  isMobile(): boolean {
    let isMobile = this._isMobile;
    if (isMobile === null) {
      const viewport = this.viewport;
      isMobile = viewport.width < 960 || viewport.height < 480;
      this._isMobile = isMobile;
    }
    return isMobile;
  }

  @LayoutAnchor("strong")
  beamHeight: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  treeLeft: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  treeRight: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  toolbarHeight: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  cabinetBarWidth: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  cabinetBarInsetLeft: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  searchBarWidth: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  searchBarInsetLeft: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  treeBarWidth: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  treeBarInsetRight: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  dockBarWidth: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  dockBarInsetRight: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  cabinetTop: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  cabinetWidth: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  cabinetExpandedWidth: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  cabinetCollapsedWidth: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  inspectorTop: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  inspectorWidth: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  treeInsetLeft: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  treeInsetRight: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  actionStackInsetRight: LayoutAnchor<this>;

  @LayoutAnchor("strong")
  actionStackInsetBottom: LayoutAnchor<this>;

  @MemberAnimator(Color)
  beamColor: MemberAnimator<this, Color, AnyColor>;

  get scrim(): ScrimView | null {
    const childView = this.getChildView("scrim");
    return childView instanceof ScrimView ? childView : null;
  }

  get beam(): BeamView | null {
    const childView = this.getChildView("beam");
    return childView instanceof BeamView ? childView : null;
  }

  get tree(): TreeView | null {
    const childView = this.getChildView("tree");
    return childView instanceof TreeView ? childView : null;
  }

  get toolbar(): Toolbar | null {
    const childView = this.getChildView("toolbar");
    return childView instanceof Toolbar ? childView : null;
  }

  get searchBar(): SearchBar | null {
    const toolbar = this.toolbar;
    const searchBar = toolbar && toolbar.searchBar;
    return searchBar instanceof SearchBar ? searchBar : null;
  }

  get searchField(): SearchField | null {
    const searchBar = this.searchBar;
    const searchField = searchBar && searchBar.searchField;
    return searchField instanceof SearchField ? searchField : null;
  }

  get searchInput(): HtmlView | null {
    const searchField = this.searchField;
    const searchInput = searchField && searchField.searchInput;
    return searchInput instanceof HtmlView ? searchInput : null;
  }

  get cabinet(): CabinetView | null {
    const childView = this.getChildView("cabinet");
    return childView instanceof CabinetView ? childView : null;
  }

  get inspector(): InspectorView | null {
    const childView = this.getChildView("inspector");
    return childView instanceof InspectorView ? childView : null;
  }

  get actionStack(): ActionStack | null {
    const childView = this.getChildView("actionStack");
    return childView instanceof ActionStack ? childView : null;
  }

  protected willResize(): void {
    if (!(navigator as any).standalone) {
      const viewport = this.viewport;
      const documentWidth = window.innerWidth === document.documentElement.offsetWidth ? "100%" : "100vw";
      const documentHeight = window.innerHeight === document.documentElement.offsetHeight ? "100%" : "100vh";
      document.documentElement.style.width = documentWidth;
      document.documentElement.style.height = documentHeight;
      document.body.style.width = viewport.width + "px";
      document.body.style.height = viewport.height + "px";
      this.width(viewport.width).height(viewport.height);
    }
    super.willResize();
  }

  protected onResize(): void {
    const oldMobile = this.isMobile();
    this._isMobile = null;
    const newMobile = this.isMobile();

    const viewport = this.viewport;
    this.beamHeight.setState(Math.max(4, viewport.safeArea.insetTop));

    if (newMobile) {
      if (!oldMobile) {
        this.hideCabinet(false);
        this.hideInspector(false);
        this.actionStack!.collapse();
        if (this._popovers.length > 0) {
          this.scrim!.show(0.5);
        }
        this.throttleLayout();
      }

      this._treeLeftDesktopConstraint.enabled(false);
      this._treeRightDesktopConstraint.enabled(false);
      this._treeInsetLeftDesktopConstraint.enabled(false);
      this._treeInsetRightDesktopConstraint.enabled(false);
      this._cabinetBarWidthDesktopConstraint.enabled(false);
      this._cabinetBarInsetLeftDesktopConstraint.enabled(false);
      this._searchBarWidthDesktopConstraint.enabled(false);
      this._searchBarInsetLeftDesktopConstraint.enabled(false);
      this._treeBarWidthDesktopConstraint.enabled(false);
      this._treeBarInsetRightDesktopConstraint.enabled(false);
      this._dockBarWidthDesktopConstraint.enabled(false);
      this._dockBarInsetRightDesktopConstraint.enabled(false);
      this._cabinetTopDesktopConstraint.enabled(false);
      this._cabinetExpandedWidthDesktopConstraint.enabled(false);
      this._cabinetMaxExpandedWidthDesktopConstraint.enabled(false);
      this._inspectorTopDesktopConstraint.enabled(false);
      this._inspectorWidthDesktopConstraint.enabled(false);
      this._inspectorMaxWidthDesktopConstraint.enabled(false);
      this._actionStackInsetRightDesktopConstraint.enabled(false);
      this._actionStackInsetBottomDesktopConstraint.enabled(false);

      this._treeLeftMobileConstraint.enabled(true);
      this._treeRightMobileConstraint.enabled(true);
      this._treeInsetLeftMobileConstraint.enabled(true);
      this._treeInsetRightMobileConstraint.enabled(true);
      this._treeMinInsetLeftMobileConstraint.enabled(true);
      this._treeMinInsetRightMobileConstraint.enabled(true);
      this._cabinetBarWidthMobileConstraint.enabled(true);
      this._cabinetBarInsetLeftMobileConstraint.enabled(true);
      this._searchBarWidthMobileConstraint.enabled(true);
      this._searchBarInsetLeftMobileConstraint.enabled(true);
      this._treeBarWidthMobileConstraint.enabled(true);
      this._treeBarInsetRightMobileConstraint.enabled(true);
      this._dockBarWidthMobileConstraint.enabled(true);
      this._dockBarInsetRightMobileConstraint.enabled(true);
      this._cabinetTopMobileConstraint.enabled(true);
      this._cabinetExpandedWidthMobileConstraint.enabled(true);
      this._cabinetMaxExpandedWidthMobileConstraint.enabled(true);
      this._inspectorTopMobileConstraint.enabled(true);
      this._inspectorWidthMobileConstraint.enabled(true);
      this._actionStackInsetRightMobileConstraint.enabled(true);
      this._actionStackInsetBottomMobileConstraint.enabled(true);
    } else {
      if (oldMobile) {
        this.actionStack!.collapse();
        if (!this._isModal) {
          this.scrim!.hide();
        }
      }

      this._treeLeftMobileConstraint.enabled(false);
      this._treeRightMobileConstraint.enabled(false);
      this._treeInsetLeftMobileConstraint.enabled(false);
      this._treeInsetRightMobileConstraint.enabled(false);
      this._treeMinInsetLeftMobileConstraint.enabled(false);
      this._treeMinInsetRightMobileConstraint.enabled(false);
      this._cabinetBarWidthMobileConstraint.enabled(false);
      this._cabinetBarInsetLeftMobileConstraint.enabled(false);
      this._searchBarWidthMobileConstraint.enabled(false);
      this._searchBarInsetLeftMobileConstraint.enabled(false);
      this._treeBarWidthMobileConstraint.enabled(false);
      this._treeBarInsetRightMobileConstraint.enabled(false);
      this._dockBarWidthMobileConstraint.enabled(false);
      this._dockBarInsetRightMobileConstraint.enabled(false);
      this._cabinetTopMobileConstraint.enabled(false);
      this._cabinetExpandedWidthMobileConstraint.enabled(false);
      this._cabinetMaxExpandedWidthMobileConstraint.enabled(false);
      this._inspectorTopMobileConstraint.enabled(false);
      this._inspectorWidthMobileConstraint.enabled(false);
      this._actionStackInsetRightMobileConstraint.enabled(false);
      this._actionStackInsetBottomMobileConstraint.enabled(false);

      this._treeLeftDesktopConstraint.enabled(true);
      this._treeRightDesktopConstraint.enabled(true);
      this._treeInsetLeftDesktopConstraint.enabled(true);
      this._treeInsetRightDesktopConstraint.enabled(true);
      this._cabinetBarWidthDesktopConstraint.enabled(true);
      this._cabinetBarInsetLeftDesktopConstraint.enabled(true);
      this._searchBarWidthDesktopConstraint.enabled(true);
      this._searchBarInsetLeftDesktopConstraint.enabled(true);
      this._treeBarWidthDesktopConstraint.enabled(true);
      this._treeBarInsetRightDesktopConstraint.enabled(true);
      this._dockBarWidthDesktopConstraint.enabled(true);
      this._dockBarInsetRightDesktopConstraint.enabled(true);
      this._cabinetTopDesktopConstraint.enabled(true);
      this._cabinetExpandedWidthDesktopConstraint.enabled(true);
      this._cabinetMaxExpandedWidthDesktopConstraint.enabled(true);
      this._inspectorTopDesktopConstraint.enabled(true);
      this._inspectorWidthDesktopConstraint.enabled(true);
      this._inspectorMaxWidthDesktopConstraint.enabled(true);
      this._actionStackInsetRightDesktopConstraint.enabled(true);
      this._actionStackInsetBottomDesktopConstraint.enabled(true);

      this.showCabinet();
      this.showInspector();
    }
  }

  protected onScroll(): void {
    if (!(navigator as any).standalone) {
      document.documentElement.style.width = "100%";
      document.documentElement.style.height = "100%";
    }
  }

  protected onLayout(): void {
    const tree = this.tree;
    if (tree) {
      tree.visibility("visible");
    }

    const actionStack = this.actionStack;
    if (actionStack) {
      actionStack.visibility("visible");
    }
  }

  protected onTreeScroll(): void {
    for (let i = 0; i < this._popovers.length; i += 1) {
      const popover = this._popovers[i];
      if (popover instanceof PopoverView) {
        popover.place();
      }
    }
  }

  protected onAnimate(t: number): void {
    this.beamColor.onFrame(t);

    const beam = this.beam;
    if (beam) {
      this.onAnimateBeam(beam);
    }
  }

  protected onShowPopover(popover: Popover, options: PopoverOptions): void {
    if (this.isMobile() || options.modal) {
      if (options.modal) {
        this._isModal = true;
      }
      this.actionStack!.zIndex(3);
      this.cabinet!.zIndex(4);
      this.scrim!.show(0.5);
      this.doLayout();
    }
  }

  protected onHidePopover(popover: Popover): void {
    if (this._popovers.length === 0) {
      this._isModal = false;
      this.scrim!.hide();
    }
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key();
    if (childKey === "scrim" && childView instanceof ScrimView) {
      this.onInsertScrim(childView);
    } else if (childKey === "beam" && childView instanceof BeamView) {
      this.onInsertBeam(childView);
    } else if (childKey === "tree" && childView instanceof TreeView) {
      this.onInsertTree(childView);
    } else if (childKey === "toolbar" && childView instanceof Toolbar) {
      this.onInsertToolbar(childView);
    } else if (childKey === "cabinet" && childView instanceof CabinetView) {
      this.onInsertCabinet(childView);
    } else if (childKey === "inspector" && childView instanceof InspectorView) {
      this.onInsertInspector(childView);
    } else if (childKey === "actionStack" && childView instanceof ActionStack) {
      this.onInsertActionStack(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key();
    if (childKey === "scrim" && childView instanceof ScrimView) {
      this.onRemoveScrim(childView);
    } else if (childKey === "beam" && childView instanceof BeamView) {
      this.onRemoveBeam(childView);
    } else if (childKey === "tree" && childView instanceof TreeView) {
      this.onRemoveTree(childView);
    } else if (childKey === "toolbar" && childView instanceof Toolbar) {
      this.onRemoveToolbar(childView);
    } else if (childKey === "cabinet" && childView instanceof CabinetView) {
      this.onRemoveCabinet(childView);
    } else if (childKey === "inspector" && childView instanceof InspectorView) {
      this.onRemoveInspector(childView);
    } else if (childKey === "actionStack" && childView instanceof ActionStack) {
      this.onRemoveActionStack(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertScrim(scrim: ScrimView): void {
    scrim.zIndex(5);
    scrim.topAnchor.enabled(true);
    this._scrimTopConstraint = this.constraint(scrim.topAnchor, "eq", this.beamHeight).enabled(true);
  }

  protected onRemoveScrim(scrim: ScrimView): void {
    if (this._scrimTopConstraint) {
      this._scrimTopConstraint.enabled(false);
      this._scrimTopConstraint = void 0;
    }
  }

  protected onInsertBeam(beam: BeamView): void {
    beam.position("absolute").top(0).right(0).left(0);
    beam.heightAnchor.enabled(true);
    this._beamHeightConstraint = this.constraint(beam.heightAnchor, "eq", this.beamHeight).enabled(true);
  }

  protected onRemoveBeam(beam: BeamView): void {
    if (this._beamHeightConstraint) {
      this._beamHeightConstraint.enabled(false);
      this._beamHeightConstraint = void 0;
    }
  }

  protected onAnimateBeam(beam: BeamView): void {
    // stub
  }

  protected onInsertTree(tree: TreeView): void {
    tree.position("absolute").bottom(0).zIndex(0);
    tree.topAnchor.enabled(true);
    tree.leftAnchor.enabled(true);
    tree.rightAnchor.enabled(true);
    this._treeTopConstraint = this.constraint(tree.topAnchor, "eq", this.beamHeight.plus(this.toolbarHeight)).enabled(true);
    this._treeLeftConstraint = this.constraint(tree.leftAnchor, "eq", this.treeLeft).enabled(true);
    this._treeRightConstraint = this.constraint(tree.rightAnchor, "eq", this.treeRight).enabled(true);
    this._treeInsetLeftConstraint = this.constraint(tree.insetLeft, "eq", this.treeInsetLeft).enabled(true);
    this._treeInsetRightConstraint = this.constraint(tree.insetRight, "eq", this.treeInsetRight).enabled(true);
    tree.on("scroll", this.onTreeScroll);
  }

  protected onRemoveTree(tree: TreeView): void {
    tree.off("scroll", this.onTreeScroll);
    if (this._treeInsetRightConstraint) {
      this._treeInsetRightConstraint.enabled(false);
      this._treeInsetRightConstraint = void 0;
    }
    if (this._treeInsetLeftConstraint) {
      this._treeInsetLeftConstraint.enabled(false);
      this._treeInsetLeftConstraint = void 0;
    }
    if (this._treeRightConstraint) {
      this._treeRightConstraint.enabled(false);
      this._treeRightConstraint = void 0;
    }
    if (this._treeLeftConstraint) {
      this._treeLeftConstraint.enabled(false);
      this._treeLeftConstraint = void 0;
    }
    if (this._treeTopConstraint) {
      this._treeTopConstraint.enabled(false);
      this._treeTopConstraint = void 0;
    }
  }

  protected onInsertToolbar(toolbar: Toolbar): void {
    toolbar.position("absolute").right(0).left(0).zIndex(1);
    toolbar.topAnchor.enabled(true);
    toolbar.heightAnchor.enabled(true);
    this._toolbarTopConstraint = this.constraint(toolbar.topAnchor, "eq", this.beamHeight).enabled(true);
    this._toolbarHeightConstraint = this.constraint(toolbar.heightAnchor, "eq", this.toolbarHeight).enabled(true);
    this._toolbarCabinetBarWidthConstraint = this.constraint(toolbar.cabinetBarWidth, "eq", this.cabinetBarWidth).enabled(true);
    this._toolbarCabinetBarInsetLeftConstraint = this.constraint(toolbar.cabinetBarInsetLeft, "eq", this.cabinetBarInsetLeft).enabled(true);
    this._toolbarSearchBarWidthConstraint = this.constraint(toolbar.searchBarWidth, "eq", this.searchBarWidth).enabled(true);
    this._toolbarSearchBarInsetLeftConstraint = this.constraint(toolbar.searchBarInsetLeft, "eq", this.searchBarInsetLeft).enabled(true);
    this._toolbarTreeBarWidthConstraint = this.constraint(toolbar.treeBarWidth, "eq", this.treeBarWidth).enabled(true);
    this._toolbarTreeBarInsetRightConstraint = this.constraint(toolbar.treeBarInsetRight, "eq", this.treeBarInsetRight).enabled(true);
    this._toolbarDockBarWidthConstraint = this.constraint(toolbar.dockBarWidth, "eq", this.dockBarWidth).enabled(true);
    this._toolbarDockBarInsetRightConstraint = this.constraint(toolbar.dockBarInsetRight, "eq", this.dockBarInsetRight).enabled(true);
    const searchInput = this.searchInput;
    if (searchInput) {
      searchInput.on("change", this.onSearchInputChange);
    }
  }

  protected onRemoveToolbar(toolbar: Toolbar): void {
    const searchInput = this.searchInput;
    if (searchInput) {
      searchInput.off("change", this.onSearchInputChange);
    }
    if (this._toolbarDockBarInsetRightConstraint) {
      this._toolbarDockBarInsetRightConstraint.enabled(false);
      this._toolbarDockBarInsetRightConstraint = void 0;
    }
    if (this._toolbarDockBarWidthConstraint) {
      this._toolbarDockBarWidthConstraint.enabled(false);
      this._toolbarDockBarWidthConstraint = void 0;
    }
    if (this._toolbarTreeBarInsetRightConstraint) {
      this._toolbarTreeBarInsetRightConstraint.enabled(false);
      this._toolbarTreeBarInsetRightConstraint = void 0;
    }
    if (this._toolbarTreeBarWidthConstraint) {
      this._toolbarTreeBarWidthConstraint.enabled(false);
      this._toolbarTreeBarWidthConstraint = void 0;
    }
    if (this._toolbarSearchBarInsetLeftConstraint) {
      this._toolbarSearchBarInsetLeftConstraint.enabled(false);
      this._toolbarSearchBarInsetLeftConstraint = void 0;
    }
    if (this._toolbarSearchBarWidthConstraint) {
      this._toolbarSearchBarWidthConstraint.enabled(false);
      this._toolbarSearchBarWidthConstraint = void 0;
    }
    if (this._toolbarCabinetBarInsetLeftConstraint) {
      this._toolbarCabinetBarInsetLeftConstraint.enabled(false);
      this._toolbarCabinetBarInsetLeftConstraint = void 0;
    }
    if (this._toolbarCabinetBarWidthConstraint) {
      this._toolbarCabinetBarWidthConstraint.enabled(false);
      this._toolbarCabinetBarWidthConstraint = void 0;
    }
    if (this._toolbarHeightConstraint) {
      this._toolbarHeightConstraint.enabled(false);
      this._toolbarHeightConstraint = void 0;
    }
    if (this._toolbarTopConstraint) {
      this._toolbarTopConstraint.enabled(false);
      this._toolbarTopConstraint = void 0;
    }
  }

  protected onInsertCabinet(cabinet: CabinetView): void {
    cabinet.position("absolute").bottom(0).left(0).zIndex(4);
    cabinet.topAnchor.enabled(true);
    this._cabinetTopConstraint = this.constraint(cabinet.topAnchor, "eq", this.cabinetTop).enabled(true);
    this._cabinetExpandedWidthConstraint = this.constraint(cabinet.expandedWidth, "eq", this.cabinetExpandedWidth).enabled(true);
    this._cabinetCollapsedWidthConstraint = this.constraint(cabinet.collapsedWidth, "eq", this.cabinetCollapsedWidth).enabled(true);
  }

  protected onRemoveCabinet(cabinet: CabinetView): void {
    if (this._cabinetCollapsedWidthConstraint) {
      this._cabinetCollapsedWidthConstraint.enabled(false);
      this._cabinetCollapsedWidthConstraint = void 0;
    }
    if (this._cabinetExpandedWidthConstraint) {
      this._cabinetExpandedWidthConstraint.enabled(false);
      this._cabinetExpandedWidthConstraint = void 0;
    }
    if (this._cabinetTopConstraint) {
      this._cabinetTopConstraint.enabled(false);
      this._cabinetTopConstraint = void 0;
    }
  }

  protected onInsertInspector(inspector: InspectorView): void {
    inspector.position("absolute").right(0).bottom(0).zIndex(2);
    inspector.topAnchor.enabled(true);
    inspector.widthAnchor.enabled(true);
    this._inspectorTopConstraint = this.constraint(inspector.topAnchor, "eq", this.inspectorTop).enabled(true);
    this._inspectorWidthConstraint = this.constraint(inspector.widthAnchor, "eq", this.inspectorWidth).enabled(true);
  }

  protected onRemoveInspector(inspector: InspectorView): void {
    if (this._inspectorWidthConstraint) {
      this._inspectorWidthConstraint.enabled(false);
      this._inspectorWidthConstraint = void 0;
    }
    if (this._inspectorTopConstraint) {
      this._inspectorTopConstraint.enabled(false);
      this._inspectorTopConstraint = void 0;
    }
  }

  protected onInsertActionStack(actionStack: ActionStack): void {
    actionStack.position("absolute").zIndex(3);
    actionStack.rightAnchor.enabled(true);
    actionStack.bottomAnchor.enabled(true);
    this._actionStackRightConstraint = this.constraint(actionStack.rightAnchor, "eq", this.actionStackInsetRight).enabled(true);
    this._actionStackBottomConstraint = this.constraint(actionStack.bottomAnchor, "eq", this.actionStackInsetBottom).enabled(true);
    actionStack.addViewObserver(this as any);
  }

  protected onRemoveActionStack(actionStack: ActionStack): void {
    actionStack.removeViewObserver(this as any);
    if (this._actionStackBottomConstraint) {
      this._actionStackBottomConstraint.enabled(false);
      this._actionStackBottomConstraint = void 0;
    }
    if (this._actionStackRightConstraint) {
      this._actionStackRightConstraint.enabled(false);
      this._actionStackRightConstraint = void 0;
    }
  }

  /** @hidden */
  protected onSearchInputChange(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.search(query);
  }

  search(query: string): void {
    this.willSearch(query);
    this.didSearch(query);
  }

  /** @hidden */
  protected willSearch(query: string): void {
    this.willObserve(function (viewObserver: ShellViewObserver): void {
      if (viewObserver.shellWillSearch) {
        viewObserver.shellWillSearch(query, this);
      }
    });
  }

  /** @hidden */
  protected didSearch(query: string): void {
    this.didObserve(function (viewObserver: ShellViewObserver): void {
      if (viewObserver.shellDidSearch) {
        viewObserver.shellDidSearch(query, this);
      }
    });
  }

  showCabinet(tween?: Tween<any>): void {
    const cabinet = this.cabinet;
    if (cabinet && (cabinet._cabinetState === "hidden" || cabinet._cabinetState === "hiding")) {
      cabinet.show(tween);
    }
  }

  /** @hidden */
  willShowCabinet(cabinet: CabinetView): void {
    this.willObserve(function (viewObserver: ShellViewObserver): void {
      if (viewObserver.shellWillShowCabinet) {
        viewObserver.shellWillShowCabinet(cabinet, this);
      }
    });
    this._cabinetWidthCollapsedConstraint.enabled(false);
    this._cabinetWidthExpandedConstraint.enabled(true);
    this.actionStack!.zIndex(3).collapse();
    if (this.isMobile()) {
      this.hidePopovers();
      this.scrim!.show(0.5, cabinet._cabinetTransition);
    }
    cabinet.display("flex").zIndex(6);
    this.doLayout();
  }

  /** @hidden */
  didShowCabinet(cabinet: CabinetView): void {
    this.didObserve(function (viewObserver: ShellViewObserver): void {
      if (viewObserver.shellDidShowCabinet) {
        viewObserver.shellDidShowCabinet(cabinet, this);
      }
    });
  }

  hideCabinet(tween?: Tween<any>): void {
    const cabinet = this.cabinet;
    if (cabinet && this.isMobile()) {
      cabinet.hide(tween);
    }
  }

  /** @hidden */
  willHideCabinet(cabinet: CabinetView): void {
    this.willObserve(function (viewObserver: ShellViewObserver): void {
      if (viewObserver.shellWillHideCabinet) {
        viewObserver.shellWillHideCabinet(cabinet, this);
      }
    });
    if (this._popovers.length === 0) {
      this.scrim!.hide(cabinet._cabinetTransition);
    }
  }

  /** @hidden */
  didHideCabinet(cabinet: CabinetView): void {
    cabinet.display("none").left(0);
    this.doLayout();
    this.didObserve(function (viewObserver: ShellViewObserver): void {
      if (viewObserver.shellDidHideCabinet) {
        viewObserver.shellDidHideCabinet(cabinet, this);
      }
    });
  }

  /** @hidden */
  willExpandCabinet(cabinet: CabinetView): void {
    this._cabinetWidthCollapsedConstraint.enabled(false);
    this._cabinetWidthExpandedConstraint.enabled(true);
    this.doLayout();
  }

  /** @hidden */
  didExpandCabinet(cabinet: CabinetView): void {
    // stub
  }

  /** @hidden */
  willCollapseCabinet(cabinet: CabinetView): void {
    // stub
  }

  /** @hidden */
  didCollapseCabinet(cabinet: CabinetView): void {
    this._cabinetWidthExpandedConstraint.enabled(false);
    this._cabinetWidthCollapsedConstraint.enabled(true);
    this.doLayout();
  }

  toggleCabinet(tween?: Tween<any>): void {
    const cabinet = this.cabinet;
    if (cabinet) {
      cabinet.toggle(tween);
    }
  }

  showInspector(tween?: Tween<any>): void {
    const inspector = this.inspector;
    if (inspector && (this._inspectorState === "hidden" || this._inspectorState === "hiding")) {
      if (tween === void 0 || tween === true) {
        tween = this._inspectorTransition;
      } else if (tween) {
        tween = Transition.fromAny(tween);
      }
      this.willShowInspector(inspector);
      inspector.display("flex");
      this.actionStack!.zIndex(3).collapse();
      this.cabinet!.zIndex(4);
      this.doLayout();
      if (tween) {
        tween = tween.onEnd(this.didShowInspector.bind(this, inspector));
        inspector.right(-this.inspectorWidth.value)
                 .right(0, tween);
      } else {
        inspector.right(0);
        this.didShowInspector(inspector);
      }
    }
  }

  protected willShowInspector(inspector: InspectorView): void {
    this.willObserve(function (viewObserver: ShellViewObserver): void {
      if (viewObserver.shellWillShowInspector) {
        viewObserver.shellWillShowInspector(inspector, this);
      }
    });
    if (this.isMobile()) {
      this.hidePopovers();
    }
    this._inspectorState = "showing";
  }

  protected didShowInspector(inspector: InspectorView): void {
    this._inspectorState = "shown";
    this.didObserve(function (viewObserver: ShellViewObserver): void {
      if (viewObserver.shellDidShowInspector) {
        viewObserver.shellDidShowInspector(inspector, this);
      }
    });
  }

  hideInspector(tween?: Tween<any>): void {
    const inspector = this.inspector;
    if (inspector && this.isMobile() && (this._inspectorState === "shown" || this._inspectorState === "showing")) {
      if (tween === void 0 || tween === true) {
        tween = this._inspectorTransition;
      } else if (tween) {
        tween = Transition.fromAny(tween);
      }
      this.willHideInspector(inspector);
      if (tween) {
        tween = tween.onEnd(this.didHideInspector.bind(this, inspector));
        inspector.right(0)
                 .right(-this.inspectorWidth.value, tween);
      } else {
        this.didHideInspector(inspector);
      }
    }
  }

  protected willHideInspector(inspector: InspectorView): void {
    this.willObserve(function (viewObserver: ShellViewObserver): void {
      if (viewObserver.shellWillHideInspector) {
        viewObserver.shellWillHideInspector(inspector, this);
      }
    });
    this._inspectorState = "hiding";
  }

  protected didHideInspector(inspector: InspectorView): void {
    this._inspectorState = "hidden";
    inspector.display("none").right(0);
    this.doLayout();
    this.didObserve(function (viewObserver: ShellViewObserver): void {
      if (viewObserver.shellDidHideInspector) {
        viewObserver.shellDidHideInspector(inspector, this);
      }
    });
  }

  toggleInspector(tween?: Tween<any>): void {
    if (this._inspectorState === "hidden" || this._inspectorState === "hiding") {
      this.showInspector(tween);
    } else {
      this.hideInspector(tween);
    }
  }

  toggleSearchPopover(): void {
    if (!this._searchPopover) {
      this._searchPopover = new SearchPopover();
      this._searchPopover.setSource(this.toolbar!.searchBar!.searchButton!);
      this._searchPopover.hidePopover(false);
    }
    this.togglePopover(this._searchPopover);
  }

  toggleDockPopover(): void {
    if (!this._dockPopover) {
      this._dockPopover = new DockPopover();
      this._dockPopover.setSource(this.toolbar!.dockBar!.dockButton!);
      this._dockPopover.hidePopover(false);
    }
    this.togglePopover(this._dockPopover);
  }

  toggleAccountPopover(): void {
    if (!this._accountPopover) {
      this._accountPopover = new AccountPopover();
      this._accountPopover.setSource(this.toolbar!.dockBar!.accountButton!);
      this._accountPopover.hidePopover(false);
    }
    this.togglePopover(this._accountPopover);
  }

  showSettingsDialog(tween?: Tween<any>): void {
    if (!this._settingsDialog) {
      this._settingsDialog = new SettingsDialog();
      this._settingsDialog.setSource(this.cabinet!.settings!);
      this._settingsDialog.hidePopover(false);
    }
    if (this._settingsDialog.popoverState === "hidden" || this._settingsDialog.popoverState === "hiding") {
      this.showPopover(this._settingsDialog, {modal: true});
    }
    this.hideCabinet();
  }

  actionStackDidPress(actionStack: ActionStack): void {
    const stackPhase = actionStack.stackPhase()!;
    if (stackPhase < 0.1 || actionStack.stackState === "expanded") {
      actionStack.collapse();
    } else {
      actionStack.expand();
    }
  }

  actionStackDidPressHold(actionStack: ActionStack): void {
    const stackPhase = actionStack.stackPhase();
    if (stackPhase === 0 || stackPhase === 1) {
      actionStack.toggle();
    }
  }

  actionStackDidLongPress(actionStack: ActionStack): void {
    const stackPhase = actionStack.stackPhase()!;
    if (stackPhase < 0.5) {
      actionStack.collapse();
    } else if (stackPhase >= 0.5) {
      actionStack.expand();
    }
  }

  actionStackDidContextPress(actionStack: ActionStack): void {
    actionStack.toggle();
  }

  actionStackWillExpand(actionStack: ActionStack): void {
    this.hidePopovers();
    this.cabinet!.zIndex(4);
    this.scrim!.show(0.5, actionStack._stackTransition);
    actionStack.zIndex(6);
    this.doLayout();
  }

  actionStackDidExpand(actionStack: ActionStack): void {
    // stub
  }

  actionStackWillCollapse(actionStack: ActionStack): void {
    if (this._popovers.length === 0) {
      this.scrim!.hide(actionStack._stackTransition);
    }
  }

  actionStackDidCollapse(actionStack: ActionStack): void {
    this.doLayout();
  }

  defocus(): void {
    this.willDefocus();
    this.hideCabinet();
    this.hideInspector();
    this.didDefocus();
  }

  protected willDefocus(): void {
    this.willObserve(function (viewObserver: ShellViewObserver): void {
      if (viewObserver.shellWillDefocus) {
        viewObserver.shellWillDefocus(this);
      }
    });
  }

  protected didDefocus(): void {
    this.didObserve(function (viewObserver: ShellViewObserver): void {
      if (viewObserver.shellDidDefocus) {
        viewObserver.shellDidDefocus(this);
      }
    });
  }

  onFallthroughClick(event: Event): void {
    if (this._popovers.length !== 0) {
      this.hidePopovers();
    } else {
      const actionStack = this.actionStack;
      if (actionStack && actionStack.isExpanded()) {
        if (actionStack.stackState === "expanded") {
          actionStack.collapse();
        }
      } else {
        this.defocus();
      }
    }
  }
}
