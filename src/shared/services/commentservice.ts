import { autoinject } from "aurelia-dependency-injection";
import { ApiService } from "./apiservice";

@autoinject()
export class CommentService {
  apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  add(slug: string, payload: any) {
    return this.apiService
      .post(`/articles/${slug}/comments`, { comment: { body: payload } })
      .then(data => data.comment);
  }

  getList(slug: string) {
    return this.apiService.get(`/articles/${slug}/comments`).then(data => data.comments);
  }

  destroy(commentId: string, articleSlug: string) {
    return this.apiService.delete(`/articles/${articleSlug}/comments/${commentId}`);
  }
}
