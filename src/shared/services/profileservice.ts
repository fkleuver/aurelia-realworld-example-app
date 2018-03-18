import { autoinject } from "aurelia-dependency-injection";
import { ApiService } from "./apiservice";

@autoinject()
export class ProfileService {
  apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  get(username: string) {
    return this.apiService.get("/profiles/" + username).then(data => data.profile);
  }

  follow(username: string) {
    return this.apiService.post("/profiles/" + username + "/follow");
  }

  unfollow(username: string) {
    return this.apiService.delete("/profiles/" + username + "/follow");
  }
}
