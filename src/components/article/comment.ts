import { bindable, computedFrom } from "aurelia-framework";
import { autoinject } from "aurelia-framework";
import { SharedState } from "../../shared/state/sharedstate";

@autoinject()
export class CommentCustomElement {
  @bindable() comment: any;
  @bindable() deleteCb: Function | undefined;

  sharedState: SharedState;

  constructor(shSt: SharedState) {
    this.sharedState = shSt;
  }

  @computedFrom("comment.author.username")
  get canModify() {
    return this.comment.author.username === this.sharedState.currentUser.username;
  }
}
