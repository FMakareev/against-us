// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.1
// 

using Colyseus.Schema;

namespace P2PBattleStateSchemaNS {
	public class UserSchema : Schema {
		[Type(0, "string")]
		public string id = default(string);

		[Type(1, "string")]
		public string email = default(string);

		[Type(2, "string")]
		public string userName = default(string);

		[Type(3, "string")]
		public string role = default(string);
	}
}
