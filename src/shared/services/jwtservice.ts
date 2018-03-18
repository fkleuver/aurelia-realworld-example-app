export class JwtService {
  getToken() {
    return window.localStorage["jwtToken"];
  }

  saveToken(token: any) {
    window.localStorage["jwtToken"] = token;
  }

  destroyToken() {
    window.localStorage.removeItem("jwtToken");
  }
}
