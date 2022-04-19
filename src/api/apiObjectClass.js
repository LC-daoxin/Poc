export class ApiObject {
  constructor(url, port, method, headers) {
    this.port = port;
    this.method = method;
    this.url = url
    this.headers = headers
  }
}