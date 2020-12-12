import { Room, Client } from 'colyseus';
import { ChatActionEnum } from './enums/chat-action.enum';

export class ChatRoom extends Room {
  maxClients = 64;

  getMessage = ({ sessionId, message, client, actionType }: any) => {

    return {
      sessionId,
      message,
      client,
      actionType,
    };
  };

  onCreate() {
    this.onMessage(ChatActionEnum.Message, (client: Client, message) => {
      this.broadcast(ChatActionEnum.Messages, this.getMessage({
        sessionId: client.sessionId,
        message,
        actionType: ChatActionEnum.Message,
        client: {}
      }));
    });
  }

  onJoin(client: Client) {
    this.broadcast(ChatActionEnum.Messages, this.getMessage({
      sessionId: client.sessionId,
      message: '',
      actionType: 'joined',
      client: {}
    }));
  }

  onLeave(client: Client) {
    this.broadcast(ChatActionEnum.Messages, this.getMessage({
      sessionId: client.sessionId,
      message: '',
      actionType: 'leave',
      client: {}
    }));
  }

  onDispose() {
    console.log('Dispose ChatRoom');
  }

}
