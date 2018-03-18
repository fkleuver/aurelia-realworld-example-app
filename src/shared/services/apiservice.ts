import { config } from "./config";
import { HttpClient, json } from "aurelia-fetch-client";
import { autoinject } from "aurelia-dependency-injection";
import * as qs from "querystringify";
import { JwtService } from "./jwtservice";
import { status, parseError } from "./servicehelper";

@autoinject()
export class ApiService {
  http: HttpClient;
  jwtService: JwtService;

  constructor(http: HttpClient, jwtService: JwtService) {
    this.http = http;
    this.jwtService = jwtService;
  }

  setHeaders() {
    const headersConfig: any = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };

    if (this.jwtService.getToken()) {
      headersConfig["Authorization"] = `Token ${this.jwtService.getToken()}`;
    }
    return new Headers(headersConfig);
  }

  get(path: string, params?: any) {
    const options = {
      method: "GET",
      headers: this.setHeaders()
    };
    return this.http
      .fetch(`${config.api_url}${path}?${qs.stringify(params)}`, options)
      .then(status)
      .catch(parseError);
  }

  put(path: string, body = {}) {
    const options = {
      method: "PUT",
      headers: this.setHeaders(),
      body: json(body)
    };
    return this.http
      .fetch(`${config.api_url}${path}`, options)
      .then(status)
      .catch(parseError);
  }

  post(path: string, body = {}) {
    const options = {
      method: "POST",
      headers: this.setHeaders(),
      body: json(body)
    };
    return this.http
      .fetch(`${config.api_url}${path}`, options)
      .then(status)
      .catch(parseError);
  }

  delete(path: string) {
    const options = {
      method: "DELETE",
      headers: this.setHeaders()
    };
    return this.http
      .fetch(`${config.api_url}${path}`, options)
      .then(status)
      .catch(parseError);
  }
}
