import { Router, RouteConfig } from "aurelia-router";
import { ArticleService } from "../../shared/services/articleservice";
import { autoinject } from "aurelia-dependency-injection";
import { observable } from "aurelia-binding";

@autoinject()
export class EditorComponent {
  article: any;
  @observable() tag: string | undefined;

  articleService: ArticleService;
  router: Router;

  routeConfig: RouteConfig | undefined;
  slug: string | undefined;

  constructor(as: ArticleService, r: Router) {
    this.articleService = as;
    this.router = r;
  }

  activate(params: any, routeConfig: RouteConfig) {
    this.routeConfig = routeConfig;
    this.slug = params.slug;

    if (this.slug) {
      return this.articleService.get(this.slug).then(article => {
        this.article = article;
      });
    } else {
      this.article = {
        title: "",
        description: "",
        body: "",
        tagList: []
      };
    }
    return null;
  }

  tagChanged(newValue: string | undefined, _oldValue: string | undefined) {
    if (newValue !== undefined && newValue !== "") {
      this.addTag(newValue);
    }
  }

  addTag(tag: string) {
    this.article.tagList.push(tag);
  }

  removeTag(tag: string) {
    this.article.tagList.splice(this.article.tagList.indexOf(tag), 1);
  }

  publishArticle() {
    this.articleService.save(this.article).then(article => {
      this.slug = article.slug;
      this.router.navigateToRoute("article", { slug: this.slug });
    });
  }
}
