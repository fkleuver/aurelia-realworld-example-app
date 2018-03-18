import { autoinject } from "aurelia-dependency-injection";
import { Router } from "aurelia-router";
import { UserService } from "../../shared/services/userservice";
import { SharedState } from "../../shared/state/sharedstate";

@autoinject()
export class SettingsComponent {
  userService: UserService;
  sharedState: SharedState;
  router: Router;

  constructor(userService: UserService, sharedState: SharedState, router: Router) {
    this.userService = userService;
    this.sharedState = sharedState;
    this.router = router;
  }

  update() {
    this.userService.update(this.sharedState.currentUser);
  }

  logout() {
    this.userService.purgeAuth();
    this.router.navigateToRoute("home");
  }
}
