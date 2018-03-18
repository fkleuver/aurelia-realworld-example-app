import { autoinject } from "aurelia-dependency-injection";
import { Router, activationStrategy, RouteConfig } from "aurelia-router";
import { ValidationControllerFactory, ValidationRules, ValidationController } from "aurelia-validation";
import { UserService } from "../../shared/services/userservice";
import { SharedState } from "../../shared/state/sharedstate";

@autoinject()
export class AuthComponent {
  type = "";
  username = "";
  email = "";
  password = "";
  errors = null;

  userService: UserService;
  sharedState: SharedState;
  router: Router;
  controller: ValidationController;

  constructor(
    userService: UserService,
    sharedState: SharedState,
    router: Router,
    controllerFactory: ValidationControllerFactory
  ) {
    this.userService = userService;
    this.sharedState = sharedState;
    this.router = router;
    this.controller = controllerFactory.createForCurrentScope();

    ValidationRules.ensure("email")
      .required()
      .email()
      .ensure("password")
      .required()
      .minLength(8)
      .ensure("username")
      .required()
      .when((auth: any) => auth.type === "register")
      .on(this);
  }

  determineActivationStrategy() {
    return activationStrategy.replace;
  }

  activate(_params: any, routeConfig: RouteConfig) {
    this.type = routeConfig.name || "";
  }

  get canSave() {
    if (this.type === "login") {
      return this.email !== "" && this.password !== "";
    } else {
      return this.username !== "" && this.email !== "" && this.password !== "";
    }
  }

  submit() {
    this.errors = null;

    this.controller.validate().then(result => {
      if (result.valid) {
        const credentials = {
          username: this.username,
          email: this.email,
          password: this.password
        };
        this.userService
          .attemptAuth(this.type, credentials)
          .then(_data => this.router.navigateToRoute("home"))
          .catch(promise => {
            promise.then((err: any) => (this.errors = err.errors));
          });
      }
    });
  }
}
