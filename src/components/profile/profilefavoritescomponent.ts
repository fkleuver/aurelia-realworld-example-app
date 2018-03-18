import { autoinject } from "aurelia-dependency-injection";
import { ArticleService } from "../../shared/services/articleservice";
import { RouteConfig } from "aurelia-router";

@autoinject()
export class ProfileFavoritesComponent {
  articles: any[] = [];
  pageNumber: number | undefined;
  totalPages: number[] = [];
  currentPage = 1;
  limit = 10;

  articleService: ArticleService;

  username: string | undefined;

  constructor(as: ArticleService) {
    this.articleService = as;
  }

  activate(params: any, _routeConfig: RouteConfig) {
    this.username = params.name;
    return this.getArticles();
  }

  getArticles() {
    let queryParams = {
      limit: this.limit,
      offset: this.limit * (this.currentPage - 1),
      favorited: this.username
    };
    return this.articleService.getList("all", queryParams).then(response => {
      this.articles.splice(0);
      this.articles.push(...response.articles);

      // Used from http://www.jstips.co/en/create-range-0...n-easily-using-one-line/
      this.totalPages = Array.from(
        new Array(Math.ceil(response.articlesCount / this.limit)),
        (_val, index) => index + 1
      );
    });
  }

  setPageTo(pageNumber: number) {
    this.currentPage = pageNumber;
    this.getArticles();
  }
}
