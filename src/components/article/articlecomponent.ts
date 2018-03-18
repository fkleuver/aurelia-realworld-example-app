import { Router, RouteConfig } from "aurelia-router";
import { ArticleService } from "../../shared/services/articleservice";
import { CommentService } from "../../shared/services/commentservice";
import { UserService } from "../../shared/services/userservice";
import { SharedState } from "../../shared/state/sharedstate";
import { ProfileService } from "../../shared/services/profileservice";
import { autoinject } from "aurelia-dependency-injection";
import { computedFrom } from "aurelia-binding";

@autoinject()
export class ArticleComponent {
  article: any;
  comments: any[]  = [];
  myComment: any;

  articleService: ArticleService;
  commentService: CommentService;
  userService: UserService;
  sharedState: SharedState;
  profileService: ProfileService;
  router: Router;

  routeConfig: RouteConfig | undefined;
  slug: string = "";

  constructor(
    as: ArticleService,
    cs: CommentService,
    us: UserService,
    shst: SharedState,
    ps: ProfileService,
    r: Router
  ) {
    this.articleService = as;
    this.commentService = cs;
    this.userService = us;
    this.sharedState = shst;
    this.profileService = ps;
    this.router = r;
  }

  activate(params: any, routeConfig: RouteConfig) {
    this.routeConfig = routeConfig;
    this.slug = params.slug;

    return this.articleService.get(this.slug).then(article => {
      this.article = article;
      this.commentService.getList(this.slug).then(comments => (this.comments = comments));
    });
  }

  onToggleFavorited() {
    this.article.favorited = !this.article.favorited;
    if (this.article.favorited) {
      this.article.favoritesCount++;
      this.articleService.favorite(this.slug);
    } else {
      this.article.favoritesCount--;
      this.articleService.unfavorite(this.slug);
    }
  }

  onToggleFollowing() {
    this.article.author.following = !this.article.author.following;
    if (this.article.author.following) this.profileService.follow(this.article.author.username);
    else this.profileService.unfollow(this.article.author.username);
  }

  postComment() {
    return this.commentService.add(this.slug, this.myComment).then(comment => {
      this.comments.push(comment);
      this.myComment = "";
    });
  }

  @computedFrom("article.author.username")
  get canModify() {
    return this.article.author.username === this.sharedState.currentUser.username;
  }

  deleteArticle() {
    this.articleService.destroy(this.article.slug).then(() => this.router.navigateToRoute("home"));
  }

  deleteComment(commentId: string) {
    this.commentService.destroy(commentId, this.slug).then(() => {
      this.commentService.getList(this.slug).then(comments => (this.comments = comments));
    });
  }
}
