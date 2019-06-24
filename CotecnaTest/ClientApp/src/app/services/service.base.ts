import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()

export class Service {

  http: HttpClient;
  baserUrl: string;

  constructor(http: HttpClient, public baseUrl: string) {
    this.http = http;
    this.baserUrl = baseUrl;
  }
}
