import {Schema, type, MapSchema} from '@colyseus/schema';
import {PlayerSchema} from './player.schema';
import {UserType} from 'p2p-battle/types/user.type';

export class P2PBattleRoomState extends Schema {

  @type('boolean')
  isStartGame: boolean = false;

  @type({map: PlayerSchema})
  players = new MapSchema<PlayerSchema>();

  createPlayer(sessionId: string, user: UserType) {
    const player = new PlayerSchema();
    player.sessionId = sessionId;
    player.completedQuests = 0;
    player.index = this.players.size;
    player.x = user.x;
    player.y = user.y;
    player.z = user.z;
    player.isDied = false;
    player.isEnemy = false;
    player.isHost = this.isHost();
    this.players.set(sessionId, player);
  }

  isHost() {
    return this.players.size === 0;
  }

  setIsBattleBegun(maxClients: number) {
    if (this.players.size === maxClients) {
      this.isStartGame = true;
    }
  }

}
