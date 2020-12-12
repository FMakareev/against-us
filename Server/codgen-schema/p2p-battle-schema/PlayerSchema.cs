// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.1
// 

using Colyseus.Schema;

namespace P2PBattleStateSchemaNS {
	public class PlayerSchema : Schema {
		[Type(0, "boolean")]
		public bool isHost = default(bool);

		[Type(1, "boolean")]
		public bool isEnemy = default(bool);

		[Type(2, "boolean")]
		public bool isDied = default(bool);

		[Type(3, "int16")]
		public short completedQuests = default(short);

		[Type(4, "int16")]
		public short index = default(short);

		[Type(5, "string")]
		public string sessionId = default(string);

		[Type(6, "float32")]
		public float x = default(float);

		[Type(7, "float32")]
		public float y = default(float);

		[Type(8, "float32")]
		public float z = default(float);
	}
}
