/* eslint-disable */
import { FilterById } from './commons';
import { Observable } from 'rxjs';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';


export interface Reward {
  id: string;
  title: string;
  description: string;
}

export interface Status {
  code: number;
  message: string;
}

export interface RewardResponse {
  error: Status | undefined;
  reward: Reward | undefined;
}

export interface RewardServiceClient {

  getRewardById(request: FilterById, ...rest: any): Observable<RewardResponse>;

}

export interface RewardServiceController {

  getRewardById(request: FilterById, ...rest: any): Promise<RewardResponse> | Observable<RewardResponse> | RewardResponse;

}

export function RewardServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['getRewardById'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('RewardService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('RewardService', method)(constructor.prototype[method], method, descriptor);
    }
  }
}

export const protobufPackage = 'reward'

export const REWARD_PACKAGE_NAME = 'reward'
export const REWARD_SERVICE_NAME = 'RewardService';