import { autoinject } from "aurelia-dependency-injection";
import { ApiService } from "./apiservice";
import { JwtService } from "./jwtservice";
import { User } from "../models/user";
import { SharedState } from "../state/sharedstate";

@autoinject()
export class UserService {
  apiService: ApiService;
  jwtService: JwtService;
  sharedState: SharedState;

  constructor(apiService: ApiService, jwtService: JwtService, sharedState: SharedState) {
    this.apiService = apiService;
    this.jwtService = jwtService;
    this.sharedState = sharedState;
  }

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    if (this.jwtService.getToken()) {
      this.apiService.get("/user").then(data => this.setAuth(data.user));
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  setAuth(user: User) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(user.token);
    this.sharedState.currentUser = user;
    this.sharedState.isAuthenticated = true;
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    this.sharedState.currentUser = new User();
    this.sharedState.isAuthenticated = false;
  }

  attemptAuth(type: string, credentials: any) {
    const route = type === "login" ? "/login" : "";
    return this.apiService.post("/users" + route, { user: credentials }).then(data => {
      this.setAuth(data.user);
      return data;
    });
  }

  update(user: User) {
    return this.apiService.put("/user", { user }).then(data => {
      this.sharedState.currentUser = data.user;
      return data.user;
    });
  }
}
