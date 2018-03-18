import { autoinject } from "aurelia-dependency-injection";
import { bindable, bindingMode } from "aurelia-framework";
import { SharedState } from "../state/sharedstate";
import { RouteConfig } from "aurelia-router";

@autoinject()
export class HeaderLayout {
  activeRoute = "";

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  routerConfig: RouteConfig | undefined;

  sharedState: SharedState;

  constructor(sharedState: SharedState) {
    this.sharedState = sharedState;
  }

  routerConfigChanged(newValue: RouteConfig | undefined, _oldValue: RouteConfig | undefined) {
    this.activeRoute = newValue && newValue.name ? newValue.name : "";
  }
}
