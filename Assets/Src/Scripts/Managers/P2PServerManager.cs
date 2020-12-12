using System.Collections.Generic;
using UnityEngine;
using Colyseus;
using P2PBattleStateSchemaNS;
using System.Threading.Tasks;
using Colyseus.Schema;
using UnityEngine.UI;

class StartGameTypeMessage
{
    public string enemySessionId;
}

class KilledPlayerTypeMessage
{
    public bool isDied;
    public string sessionId;
}

public class P2PServerManager : MonoBehaviour
{
    public Client client;
    public Room<P2PBattleRoomState> room;

    public static P2PServerManager _instance;


    public Text AllCompletedQuest;
    public Text MyCompletedQuest;

    private void Awake()
    {
        if (!P2PServerManager._instance)
        {
            P2PServerManager._instance = this;
        }
    }

    void Start()
    {
        ConnectToServer();
    }

    public void ConnectToServer()
    {
        string endpoint = "ws://localhost:2567";

        client = new Client(endpoint);
    }

    public async void JoinOrCreate()
    {
        if (room != null)
        {
            await LeaveRoom();
        }

        Dictionary<string, float> user = new Dictionary<string, float>
        {
            {"x", 0.0f},
            {"y", 0.0f},
            {"z", 0.0f}
        };
        Dictionary<string, object> options = new Dictionary<string, object>
        {
            {"user", user}
        };

        room = await client.JoinOrCreate<P2PBattleRoomState>("P2PBattleRoom", options);

        room.State.players.OnRemove += OnRemove;
        room.State.players.OnAdd += OnAdd;
        
        room.OnStateChange += OnStateChange;

        room.OnMessage<KilledPlayerTypeMessage>("KILLED_PLAYER", (message) =>
        {
            if (message.isDied && PlayerStateManager._instance.GetPlayerBySessionId(message.sessionId).isLocale)
            {
                ViewRouterManager._instance.ToggleYouDiedView();
                PlayerStateManager._instance.KillPlayer(message.sessionId);
            }
        });
        
        room.OnMessage<StartGameTypeMessage>("START_GAME", (message) =>
        {
            Debug.Log("START_GAME: message.enemySessionId: " + message.enemySessionId);
            GameStateManager._instance.IsStartGame();
            room.State.players.ForEach((key, data) =>
            {
                if (message.enemySessionId == data.sessionId)
                {
                    PlayerStateManager._instance.MakeEnemy(data.sessionId);
                }
            });
        });
    }
    
    void OnRemove(PlayerSchema player, string key)
    {
        PlayerStateManager._instance.RemovePlayerBySessionId(player.sessionId);
    }

    void OnAdd(PlayerSchema player, string key)
    {
        if (player.sessionId != room.SessionId)
        {
            PlayerStateManager._instance.AddRemotePlayer(player.sessionId, player.index);
        }
        else
        {
            PlayerStateManager._instance.AddLocalPlayer(room.SessionId, player.index);
        }
    }

    void OnStateChange(P2PBattleRoomState state, bool isFirstState)
    {
        state.players.ForEach((key, data) =>
        {
            if (data.sessionId != room.SessionId)
            {
                PlayerStateManager._instance.MoveRemotePlayerOnScene(data.sessionId, new Vector3(data.x, data.y, data.z));
            }
        });
        
        
        SetAllCompleteQuest();
        SetMyCompleteQuest();
    }
    
    public void StartGame()
    {
        if (!GameStateManager._instance.isStartGame)
        {
            room.Send("START_GAME");
        }
    }

    public async Task LeaveRoom()
    {
        PlayerStateManager._instance.RemovePlayerBySessionId(room.SessionId);
        PlayerStateManager._instance.RemoveAllPlayer();
        await room.Leave();
        room = null;
    }

    public void LeaveRoomUI()
    {
        LeaveRoom();
    }
    
    public void SetAllCompleteQuest()
    {
        int count = 0;
        room.State.players.ForEach((key, data) => { count += data.completedQuests; });

        AllCompletedQuest.text = count.ToString();
    }

    public void SetMyCompleteQuest()
    {
        MyCompletedQuest.text = room.State.players[room.SessionId].completedQuests.ToString();
    }
}