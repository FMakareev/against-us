import {Room, Client} from 'colyseus';
import {P2PBattleRoomState} from './schema/p2p-battle-state.schema';
import {ActionTypeEnum} from './enums/action-type.enum';

import {get} from 'lodash';
import {UserType} from './types/user.type';


function getRandomArbitrary(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

export class P2PBattleRoom extends Room<P2PBattleRoomState> {

  maxClients = 20;

  onCreate(): void | Promise<any> {
    this.setState(new P2PBattleRoomState());

    this.onMessage(ActionTypeEnum.EndGame, (client: Client, message) => {
      this.broadcast(ActionTypeEnum.EndGame, {
        actionType: ActionTypeEnum.EndGame,
        sessionId: client.sessionId,
        payload: message,
      })
      this.disconnect();
    });

    this.onMessage(ActionTypeEnum.SET_FINAL_QUEST, (client: Client, message) => {
      this.state.players[client.sessionId].completedQuests += 1;
    });

    this.state.isStartGame = false;

    this.onMessage(ActionTypeEnum.KILLED_PLAYER, (client: Client, isDiedSessionId) => {
      console.log('ActionTypeEnum.KILLED_PLAYER: ', isDiedSessionId);

      this.state.players.forEach((item) => {
        if (item.index === isDiedSessionId) {
          item.isDied = true;
        }
      })

      this.broadcast(ActionTypeEnum.KILLED_PLAYER, {
        isDied: true,
        sessionId: isDiedSessionId,
      })
    })
    this.onMessage(ActionTypeEnum.START_GAME, (client: Client) => {
      const enemyIndex = getRandomArbitrary(0, this.state.players.size);
      console.log('ActionTypeEnum.START_GAME enemyIndex: ', enemyIndex);
      this.state.players.forEach((item) => {
        if (item.index === enemyIndex) {
          this.state.players[item.sessionId].isEnemy = true;
          this.state.isStartGame = true;
          this.broadcast(ActionTypeEnum.START_GAME, {enemySessionId: item.sessionId});
        }
      })
    });

    this.onMessage(ActionTypeEnum.Move, (client: Client, message) => {
      this.state.players[client.sessionId].x = message.x;
      this.state.players[client.sessionId].y = message.y;
      this.state.players[client.sessionId].z = message.z;
    });

  }

  onLeave(client: Client, consented?: boolean): void | Promise<any> {
    console.log('onLeave: ', client.sessionId);
    this.state.players.delete(client.sessionId);
  }

  onJoin(client: Client, options: { user: UserType }) {
    console.log('onJoin options: ', options);
    this.state.createPlayer(client.sessionId, get(options, ['user']));
    this.state.setIsBattleBegun(this.maxClients);
  }

}
