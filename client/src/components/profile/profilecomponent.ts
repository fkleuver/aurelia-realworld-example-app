import { computedFrom } from "aurelia-binding";
import { autoinject } from "aurelia-dependency-injection";
import { RouteConfig, Router, RouterConfiguration } from "aurelia-router";
import { ProfileService } from "../../shared/services/profileservice";
import { SharedState } from "../../shared/state/sharedstate";
import { PLATFORM } from "aurelia-pal";

@autoinject()
export class ProfileComponent {
  public sharedState: SharedState;
  public profileService: ProfileService;

  public router: Router | undefined;
  public username: string = "";
  public profile: any;

  constructor(sharedState: SharedState, ps: ProfileService) {
    this.sharedState = sharedState;
    this.profileService = ps;
  }

  public configureRouter(config: RouterConfiguration, router: Router): void {
    config.map([
      { 
        route: [""],
        moduleId: PLATFORM.moduleName("components/profile/profilearticlecomponent"),
        name: "profilearticle",
        title: "Profile" },
      {
        route: ["favorites"],
        moduleId: PLATFORM.moduleName("components/profile/profilefavoritescomponent"),
        name: "profilefavorites",
        title: "Profile"
      }
    ]);

    this.router = router;
  }

  public activate(params: any, _routeConfig: RouteConfig): Promise<void> {
    this.username = params.name;

    return this.profileService.get(this.username).then(profile => (this.profile = profile));
  }

  @computedFrom("sharedState.currentUser.username")
  public get isUser(): boolean {
    return this.profile.username === this.sharedState.currentUser.username;
  }

  public onToggleFollowing(): void {
    this.profile.following = !this.profile.following;
    if (this.profile.following) {
      this.profileService.follow(this.profile.username);
    } else {
      this.profileService.unfollow(this.profile.username);
    }
  }
}
