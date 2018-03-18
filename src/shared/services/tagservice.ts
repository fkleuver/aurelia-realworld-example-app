import { autoinject } from "aurelia-dependency-injection";
import { ApiService } from "./apiservice";

@autoinject()
export class TagService {
  apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  getList() {
    return this.apiService.get("/tags").then(data => data.tags);
  }
}
