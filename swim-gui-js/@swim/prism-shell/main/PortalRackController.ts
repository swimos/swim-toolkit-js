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

import {HtmlView} from "@swim/view";
import {Domain, Label, Portal, PortalObserver} from "@swim/shell";
import {RackItem, RackView, RackViewController} from "@swim/prism";
import {DomainRackItemController} from "./DomainRackItemController";
import {PortalShellController} from "./PortalShellController";

export class PortalRackController extends RackViewController implements PortalObserver {
  /** @hidden */
  readonly _shellController: PortalShellController;
  /** @hidden */
  readonly _model: Portal;
  /** @hidden */
  _selectedItem: RackItem | null;

  constructor(shellController: PortalShellController, model: Portal) {
    super();
    this._shellController = shellController;
    this._model = model;
    this._selectedItem = null;
  }

  get shellController(): PortalShellController {
    return this._shellController;
  }

  get model(): Portal {
    return this._model;
  }

  get selectedItem(): RackItem | null {
    return this._selectedItem;
  }

  selectItem(newItem: RackItem | null): void {
    const oldItem = this._selectedItem;
    if (oldItem !== newItem) {
      if (oldItem) {
        oldItem.unhighlight(true);
      }
      this._selectedItem = newItem;
      if (newItem) {
        newItem.highlight();
        const itemController = newItem.viewController;
        if (itemController instanceof DomainRackItemController) {
          const treeController = itemController.createTreeController(this._shellController);
          this._shellController.setTreeController(treeController);
        }
      } else if (oldItem) {
        this._shellController.setTreeController(null);
      }
    }
  }

  protected didSetView(view: RackView | null): void {
    if (view !== null) {
      let k = 0;
      const domains = this._model.domains;
      for (let i = 0, n = domains.length; i < n; i += 1) {
        this.insertDomain(domains[i], k);
        k += 1;
      }

      //if (k > 0) {
      //  this.view!.append(MenuSeparator);
      //  k += 1;
      //}

      //const tags = this._model.tags;
      //for (let i = 0, n = tags.length; i < n; i += 1) {
      //  this.insertLabel(tags[i], k);
      //  k += 1;
      //}
    }
  }

  protected createRackItem(): RackItem {
    return HtmlView.create(RackItem);
  }

  protected createRackItemController(domain: Domain): DomainRackItemController {
    return new DomainRackItemController(domain);
  }

  insertDomain(domain: Domain, index: number): void {
    const rackItem = this.createRackItem().key(domain.name);
    const rackItemController = this.createRackItemController(domain);
    rackItem.setViewController(rackItemController);
    this.view!.insertChildNode(rackItem.node, this.view!.node.childNodes[1 + index] || null);

    if (this._selectedItem === null) {
      this.selectItem(rackItem);
    }
  }

  //protected createLabelController(label: Label): LabelController {
  //  return new LabelController(label);
  //}

  //insertLabel(label: Label, index: number): void {
  //  const rackItem = this.createRackItem().key(label.name);
  //  const labelController = this.createLabelController(label);
  //  rackItem.setViewController(labelController);
  //  const domainCount = this._model.domains.length;
  //  if (domainCount > 0) {
  //    index += domainCount + 1;
  //  }
  //  this.view!.insertChildNode(rackItem.node, this.view!.node.childNodes[1 + index] || null);
  //}

  portalWillInsertDomain(domain: Domain, index: number): void {
    // stub
  }

  portalDidInsertDomain(domain: Domain, index: number): void {
    this.insertDomain(domain, index);
  }

  portalWillInsertLabel(label: Label, index: number): void {
    // stub
  }

  portalDidInsertLabel(label: Label, index: number): void {
    //this.insertLabel(label, index);
  }

  rackDidClickItem(item: RackItem, view: RackView): void {
    this.selectItem(item);
  }
}
