import { bindable } from "aurelia-framework";

export class ArticleList {
  @bindable() articles: any[] | undefined;

  @bindable() pageNumber: number | undefined;
  @bindable() totalPages: number | undefined;
  @bindable() currentPage: number | undefined;
  @bindable() setPageCb: Function | undefined;
}
