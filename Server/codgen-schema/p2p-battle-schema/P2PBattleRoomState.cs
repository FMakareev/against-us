// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.1
// 

using Colyseus.Schema;

namespace P2PBattleStateSchemaNS {
	public class P2PBattleRoomState : Schema {
		[Type(0, "boolean")]
		public bool isStartGame = default(bool);

		[Type(1, "map", typeof(MapSchema<PlayerSchema>))]
		public MapSchema<PlayerSchema> players = new MapSchema<PlayerSchema>();
	}
}
