/* eslint-disable */
import { FilterById, Empty, MongooseDeleteResult } from './commons';
import { Observable } from 'rxjs';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';


export interface News {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  smallPreview: string;
  largePreview: string;
  publicationStartDate: string;
  publicationEndDate: string;
  shortDesc: string;
  isActive: boolean;
}

export interface NewsList {
  data: News[];
}

export interface NewsFilter {
  fromPublishDate: string;
}

export interface NewsServiceClient {

  getNewsById(request: FilterById, ...rest: any): Observable<News>;

  getNewsForClient(request: NewsFilter, ...rest: any): Observable<NewsList>;

  getNewsForAdmin(request: Empty, ...rest: any): Observable<NewsList>;

  createNews(request: News, ...rest: any): Observable<News>;

  updateNews(request: News, ...rest: any): Observable<News>;

  deleteNews(request: FilterById, ...rest: any): Observable<MongooseDeleteResult>;

}

export interface NewsServiceController {

  getNewsById(request: FilterById, ...rest: any): Promise<News> | Observable<News> | News;

  getNewsForClient(request: NewsFilter, ...rest: any): Promise<NewsList> | Observable<NewsList> | NewsList;

  getNewsForAdmin(request: Empty, ...rest: any): Promise<NewsList> | Observable<NewsList> | NewsList;

  createNews(request: News, ...rest: any): Promise<News> | Observable<News> | News;

  updateNews(request: News, ...rest: any): Promise<News> | Observable<News> | News;

  deleteNews(request: FilterById, ...rest: any): Promise<MongooseDeleteResult> | Observable<MongooseDeleteResult> | MongooseDeleteResult;

}

export function NewsServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['getNewsById', 'getNewsForClient', 'getNewsForAdmin', 'createNews', 'updateNews', 'deleteNews'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('NewsService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('NewsService', method)(constructor.prototype[method], method, descriptor);
    }
  }
}

export const protobufPackage = 'news'

export const NEWS_PACKAGE_NAME = 'news'
export const NEWS_SERVICE_NAME = 'NewsService';