using System;
using System.Collections.Generic;
using Cinemachine;
using MoreMountains.TopDownEngine;
using UnityEngine;

/// <summary>
/// Создает, изменяет, удоляет компоненты игрока
/// </summary>
public class PlayerStateManager : MonoBehaviour
{

    private List<PlayerComponent> playerList = new List<PlayerComponent>();

    public InputManager inputManager;
    public CinemachineVirtualCamera camera;
    
    public GameObject localPlayerPrefab;
    public GameObject remotePlayerPrefab;
    
    
    public static PlayerStateManager _instance;
    
    private void Awake()
    {
        if (!PlayerStateManager._instance)
        {
            PlayerStateManager._instance = this;
        }
    }
    
    
    private void FixedUpdate()
    {
        SendMovementLocalePlayer();
    }

    
    
    public PlayerComponent GetPlayerBySessionId(string sessionId)
    {
        PlayerComponent player = playerList.Find(item => item.sessionId == sessionId);
        return player;
    }
    
    public bool HasPlayerInList(string sessionId)
    {
        PlayerComponent player = GetPlayerBySessionId(sessionId);
        return player != null;
    }
    
    private static PlayerComponent AddPlayerComponentOnPrefab(GameObject player, string sessionId, bool isHost, bool isLocale)
    {
        PlayerComponent playerComponent = player.gameObject.AddComponent<PlayerComponent>();

        playerComponent.prefab = player;
        playerComponent.sessionId = sessionId;
        playerComponent.isHost = isHost;
        playerComponent.isLocale = isLocale;

        return playerComponent;
    }

    public void AddLocalPlayer(string sessionId, int respawnIndex)
    {
        GameObject busyRespawnPoint = RespawnManager._instance.GetRespawnPointByIndexAndMarkBusy(respawnIndex);
        if (busyRespawnPoint == null)
        {
            Debug.Log("AddPlayer: not found busy point");
            return;
        }

        inputManager.PlayerID = sessionId;
        localPlayerPrefab.GetComponent<Character>().SetPlayerID(sessionId);
        GameObject player = Instantiate(localPlayerPrefab);
        player.transform.position = busyRespawnPoint.transform.position;
        
        camera.Follow = player.GetComponent<Transform>();

        AddPlayerToList(AddPlayerComponentOnPrefab(player, sessionId, true, true));
    }
    
    public void AddRemotePlayer(string sessionId, int respawnIndex)
    {
        GameObject busyRespawnPoint = RespawnManager._instance.GetRespawnPointByIndexAndMarkBusy(respawnIndex);
        if (busyRespawnPoint == null)
        {
            Debug.Log("AddPlayer: not found busy point");
            return;
        }

        GameObject player = Instantiate(remotePlayerPrefab);
        player.AddComponent<PlayerEntity>();
        player.AddComponent<CapsuleCollider>().isTrigger = true;
        player.transform.position = busyRespawnPoint.transform.position;
        
        AddPlayerToList(AddPlayerComponentOnPrefab(player, sessionId, true, false));
    }

    public bool IsEnemy(string sessionId)
    {
        PlayerComponent playerComponent = GetPlayerBySessionId(sessionId);

        if (playerComponent == null)
        {
            throw new Exception($"Player with sessionId={sessionId} not found");
        }
        
        return playerComponent.isEnemy;
    }

    public void AddPlayerToList(PlayerComponent player)
    {
        if (HasPlayerInList(player.sessionId))
        {
            RemovePlayerBySessionId(player.sessionId);
            playerList.Add(player);
        }
        else
        {
            playerList.Add(player);
        }
    }
    
    public void RemovePlayerBySessionId(string sessionId)
    {
        PlayerComponent player = GetPlayerBySessionId(sessionId);
        if (player != null)
        {
            Destroy(player.prefab);
            playerList.Remove(player);
        }
    }
    
    public void RemoveAllPlayer()
    {
        foreach (PlayerComponent playerLocale in playerList)
        {
            if (playerLocale != null)
            {
                Destroy(playerLocale.prefab);
                playerList.Remove(playerLocale);
            }
        }
    }
    
    public void MakeEnemy(string sessionId)
    {
        PlayerComponent player = GetPlayerBySessionId(sessionId);
        player.isEnemy = true;
        if (player.isLocale)
        {
            for (int i = 0; i < player.prefab.gameObject.transform.childCount; i++)
            {
                PlayerModelGroupEntity group = player.prefab.gameObject.transform.GetChild(i)
                    .GetComponent<PlayerModelGroupEntity>();
                Debug.Log("MakeEnemy group: "+ group);
                if (group != null)
                {
                    player.transform.gameObject.AddComponent<EnemySystem>().player = player;
                    ActiveEnemyPrefab(group.gameObject);
                }
            }
        }
        else
        {
            ActiveEnemyPrefab(player.prefab.gameObject);
        }
    }

    public void KillPlayer(string sessionId)
    {
        Debug.Log("KillPlayer sessionId="+ sessionId);
        PlayerComponent playerComponent = GetPlayerBySessionId(sessionId);

        playerComponent.isDied = true;
        RemovePlayerBySessionId(sessionId);
        P2PServerManager._instance.room.Send("KILLED_PLAYER", sessionId);

        
        
    }
    
    private void ActiveEnemyPrefab(GameObject prefab)
    {
        for (int a = 0; a < prefab.transform.childCount; a++)
        {
            Transform go = prefab.transform.GetChild(a);
            if (go.GetComponent<EnemyEntity>() != null)
            {
                go.gameObject.SetActive(true);
                continue;
            }
            if (go.GetComponent<PlayerModelEntity>() != null)
            {
                go.gameObject.SetActive(false);
            }
        }
    }

    public static bool PlayerIsNotEqualsNullAndNotEnemy(PlayerComponent player)
    {
        return player != null && !player.isEnemy;
    }
    
    public void MoveRemotePlayerOnScene(string sessionId, Vector3 position)
    {
        PlayerComponent player = GetPlayerBySessionId(sessionId);

        if (player != null)
        {
            player.prefab.transform.position = Vector3.Lerp(player.prefab.transform.position, position, 0.5f);
        }
    }

    public void SendMovementLocalePlayer()
    {
        if (playerList.Count > 0)
        {
            // Отправка текущих координат локального пользователя на сервер
            PlayerComponent player = GetPlayerBySessionId(inputManager.PlayerID);

            if (player != null)
            {
                Vector3 position = player.prefab.transform.position;
                Dictionary<string, float> user = new Dictionary<string, float>
                {
                    {"x", position.x},
                    {"y", position.y},
                    {"z", position.z}
                };
                P2PServerManager._instance.room.Send("Move", user);
            }
        }
    }
    
    
    
}
