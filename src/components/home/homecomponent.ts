import { BindingEngine } from "aurelia-framework";
import { autoinject } from "aurelia-dependency-injection";
import { SharedState } from "../../shared/state/sharedstate";
import { ArticleService } from "../../shared/services/articleservice";
import { TagService } from "../../shared/services/tagservice";
import { Disposable } from "aurelia-binding";

@autoinject()
export class HomeComponent {
  articles: any[] = [];
  shownList = "all";
  tags: string[] = [];
  filterTag: string | undefined;
  pageNumber: number | undefined;
  totalPages: number[] = [];
  currentPage = 1;
  limit = 10;

  sharedState: SharedState;
  bindingEngine: BindingEngine;
  articleService: ArticleService;
  tagService: TagService;

  subscription: Disposable | undefined;

  constructor(
    sharedState: SharedState,
    bindingEngine: BindingEngine,
    articleService: ArticleService,
    tagService: TagService
  ) {
    this.sharedState = sharedState;
    this.bindingEngine = bindingEngine;
    this.articleService = articleService;
    this.tagService = tagService;
  }

  bind() {
    this.subscription = this.bindingEngine
      .propertyObserver(this.sharedState, "isAuthenticated")
      .subscribe((newValue, _oldValue) => {
        console.log("homeComponent isAuthenticated: ", newValue);
      });
  }

  unbind() {
    this.subscription && this.subscription.dispose();
  }

  attached() {
    this.getArticles();
    this.getTags();
  }

  getArticles() {
    let params: any = {
      limit: this.limit,
      offset: this.limit * (this.currentPage - 1)
    };
    if (this.filterTag !== undefined) params.tag = this.filterTag;
    this.articleService.getList(this.shownList, params).then(response => {
      this.articles.splice(0);
      this.articles.push(...response.articles);

      // Used from http://www.jstips.co/en/create-range-0...n-easily-using-one-line/
      this.totalPages = Array.from(
        new Array(Math.ceil(response.articlesCount / this.limit)),
        (_val, index) => index + 1
      );
    });
  }

  getTags() {
    this.tagService.getList().then(response => {
      this.tags.splice(0);
      this.tags.push(...response);
    });
  }

  setListTo(type: string, tag: string) {
    if (type === "feed" && !this.sharedState.isAuthenticated) return;
    this.shownList = type;
    this.filterTag = tag;
    this.getArticles();
  }

  getFeedLinkClass() {
    let clazz = "";
    if (!this.sharedState.isAuthenticated) clazz += " disabled";
    if (this.shownList === "feed") clazz += " active";
    return clazz;
  }

  setPageTo(pageNumber: number) {
    this.currentPage = pageNumber;
    this.getArticles();
  }
}
