import { Schema, type } from "@colyseus/schema";

export class PlayerSchema extends Schema {
  @type('boolean')
  isHost: boolean;

  @type('boolean')
  isEnemy: boolean;

  @type('boolean')
  isDied: boolean;

  @type('int16') completedQuests: number;
  @type('int16') index: number;
  @type('string') sessionId: string;
  @type('float32') x: number;
  @type('float32') y: number;
  @type('float32') z: number;

}
