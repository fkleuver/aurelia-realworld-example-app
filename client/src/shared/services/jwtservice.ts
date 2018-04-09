const storageKey = "aurelia-realworld-example-app:jwtToken";

export class JwtService {
  public getToken(): string {
    return window.localStorage.getItem(storageKey) as any;
  }

  public saveToken(token: string): void {
    if (typeof token === "string") {
      window.localStorage.setItem(storageKey, token);
    }
  }

  public destroyToken(): void {
    window.localStorage.removeItem(storageKey);
  }
}
