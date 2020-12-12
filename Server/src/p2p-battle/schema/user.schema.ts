import { Schema, type } from "@colyseus/schema";
import { User } from "../../_proto_/ts/user";

export class UserSchema extends Schema {
  @type('string')
  id: string;
  @type('string')
  email: string;
  @type('string')
  userName: string;
  @type('string')
  role: string;

  createUser(user: User){
    this.id = user.id;
    this.email = user.email;
    this.userName = user.userName;
    this.role = user.role.toString();
  }

}
