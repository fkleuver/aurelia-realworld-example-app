import { autoinject } from "aurelia-dependency-injection";
import { SharedState } from "../../shared/state/sharedstate";
import { ProfileService } from "../../shared/services/profileservice";
import { Router, RouteConfig, RouterConfiguration } from "aurelia-router";
import { computedFrom } from "aurelia-binding";

@autoinject()
export class ProfileComponent {
  sharedState: SharedState;
  profileService: ProfileService;

  router: Router | undefined;
  username: string = "";
  profile: any;

  constructor(sharedState: SharedState, ps: ProfileService) {
    this.sharedState = sharedState;
    this.profileService = ps;
  }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      { route: [""], moduleId: "components/profile/profilearticlecomponent", name: "profilearticle", title: "Profile" },
      {
        route: ["favorites"],
        moduleId: "components/profile/profilefavoritescomponent",
        name: "profilefavorites",
        title: "Profile"
      }
    ]);

    this.router = router;
  }

  activate(params: any, _routeConfig: RouteConfig) {
    this.username = params.name;
    return this.profileService.get(this.username).then(profile => (this.profile = profile));
  }

  @computedFrom("sharedState.currentUser.username")
  get isUser() {
    return this.profile.username === this.sharedState.currentUser.username;
  }

  onToggleFollowing() {
    this.profile.following = !this.profile.following;
    if (this.profile.following) this.profileService.follow(this.profile.username);
    else this.profileService.unfollow(this.profile.username);
  }
}
