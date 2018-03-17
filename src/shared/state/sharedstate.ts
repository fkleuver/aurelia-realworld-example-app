import {User} from '../models/user';

export class SharedState {
  currentUser;
  isAuthenticated;
  
  constructor() {
    this.currentUser = new User();
    this.isAuthenticated = false;
  }
}
