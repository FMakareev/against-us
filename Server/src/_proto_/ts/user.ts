/* eslint-disable */
import { FilterById, Empty, MongooseDeleteResult } from './commons';
import { Observable } from 'rxjs';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';


/**
 *  базовая модель пользователя
 */
export interface User {
  id: string;
  userName: string;
  email: string;
  role: UserRole;
  password: string;
  guestPassword: string;
  createAt: string;
  updateAt: string;
}

export interface UserList {
  data: User[];
}

export interface CreateUserDto {
  password: string;
  email: string;
}

export interface CreateGuestDto {
}

export interface UserUpdateDto {
  id: string;
  userName: string;
  email: string;
  role: UserRole;
}

export interface UserPasswordDto {
  email: string;
  id: string;
  oldPassword: string;
  newPassword: string;
}

export interface FilterByEmail {
  email: string;
}

export interface UserServiceClient {

  getUserById(request: FilterById, ...rest: any): Observable<User>;

  getUserByEmail(request: FilterByEmail, ...rest: any): Observable<User>;

  getUserList(request: Empty, ...rest: any): Observable<UserList>;

  createUser(request: CreateUserDto, ...rest: any): Observable<User>;

  createGuestUser(request: CreateGuestDto, ...rest: any): Observable<User>;

  changePassword(request: UserPasswordDto, ...rest: any): Observable<User>;

  updateUser(request: UserUpdateDto, ...rest: any): Observable<User>;

  deleteUser(request: FilterById, ...rest: any): Observable<MongooseDeleteResult>;

}

export interface UserServiceController {

  getUserById(request: FilterById, ...rest: any): Promise<User> | Observable<User> | User;

  getUserByEmail(request: FilterByEmail, ...rest: any): Promise<User> | Observable<User> | User;

  getUserList(request: Empty, ...rest: any): Promise<UserList> | Observable<UserList> | UserList;

  createUser(request: CreateUserDto, ...rest: any): Promise<User> | Observable<User> | User;

  createGuestUser(request: CreateGuestDto, ...rest: any): Promise<User> | Observable<User> | User;

  changePassword(request: UserPasswordDto, ...rest: any): Promise<User> | Observable<User> | User;

  updateUser(request: UserUpdateDto, ...rest: any): Promise<User> | Observable<User> | User;

  deleteUser(request: FilterById, ...rest: any): Promise<MongooseDeleteResult> | Observable<MongooseDeleteResult> | MongooseDeleteResult;

}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['getUserById', 'getUserByEmail', 'getUserList', 'createUser', 'createGuestUser', 'changePassword', 'updateUser', 'deleteUser'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod('UserService', method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod('UserService', method)(constructor.prototype[method], method, descriptor);
    }
  }
}

export const protobufPackage = 'user'

export enum UserRole {
  GUEST = 0,
  PLAYER = 1,
  ADMIN = 2,
  UNRECOGNIZED = -1,
}

export const USER_PACKAGE_NAME = 'user'
export const USER_SERVICE_NAME = 'UserService';