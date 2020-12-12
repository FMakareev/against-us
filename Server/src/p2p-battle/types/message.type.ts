import { ActionTypeEnum } from "../enums/action-type.enum";




export type MessageType  = {
  actionType: ActionTypeEnum;
  sessionId: string;
  payload: any;
}
