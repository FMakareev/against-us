using System;
using System.Collections.Generic;
using UnityEngine;

[Serializable]
public class WorkingOnQuest
{
    public PlayerComponent Player;
    public float TargetTime = 60.0f;
    public bool IsCompleted = false;
    public bool IsExit;

    public WorkingOnQuest(PlayerComponent player, float targetTime, bool isExit)
    {
        this.Player = player;
        this.TargetTime = targetTime;
        this.IsExit = isExit;
    }
}


public class QuestSystem : MonoBehaviour
{
    private QuestComponent _component;

    public List<WorkingOnQuest> workingOnQuestList = new List<WorkingOnQuest>();

    public float TaskExecutionTime = 60.0f;

    private void Awake()
    {
        _component = gameObject.GetComponent<QuestComponent>();
    }

    private void Update()
    {
        foreach (WorkingOnQuest workingOnQuest in workingOnQuestList)
        {
            if (!workingOnQuest.IsCompleted && !workingOnQuest.IsExit)
            {
                workingOnQuest.TargetTime -= Time.deltaTime;
                if (workingOnQuest.TargetTime <= 0.0f)
                {
                    QuestEnded(workingOnQuest);
                }
            }
        }
    }
    /// <summary>
    /// квест завершен
    /// </summary>
    void QuestEnded(WorkingOnQuest workingOnQuest)
    {
        workingOnQuest.IsCompleted = true;
        workingOnQuest.Player.completedQuests += 1;
        
        // Отправка сообщения о завершении выполнения квеста 
        P2PServerManager._instance.room.Send("SET_FINAL_QUEST");
    }
    
    /// <summary>
    /// поиск игрока в списке работающих над квестом
    /// </summary>
    WorkingOnQuest FindPlayerInWorkingOnQuest(PlayerComponent player)
    {
        return workingOnQuestList.Find((item) => item.Player.sessionId == player.sessionId);
    }
    /// <summary>
    /// игрок завершил квест?
    /// </summary>
    bool PlayerIsCompletedQuest(PlayerComponent player)
    {
        WorkingOnQuest workingOnQuest = FindPlayerInWorkingOnQuest(player);
        return workingOnQuest?.IsCompleted ?? false;
    }
    /// <summary>
    /// игрок вышел из квеста?
    /// </summary>
    bool PlayerIsExitQuest(PlayerComponent player)
    {
        WorkingOnQuest workingOnQuest = FindPlayerInWorkingOnQuest(player);
        return workingOnQuest?.IsExit ?? false;
    }

    /// <summary>
    /// Есть ли игрок в списке выполняющих квест
    /// </summary>
    bool HasPlayerInWorkingOnQuest(PlayerComponent player)
    {
        WorkingOnQuest workingOnQuest = FindPlayerInWorkingOnQuest(player);
        return workingOnQuest != null;
    }

    /// <summary>
    /// добавить нового игрока в список выполняющих квест
    /// </summary>
    void AddPlayerToWorkingOnQuest(PlayerComponent player)
    {
        workingOnQuestList.Add(new WorkingOnQuest(player, TaskExecutionTime, false));
    }
    
    /// <summary>
    /// добавить нового игрока в список выполняющих квест
    /// </summary>
    void PlayerEnterToQuest(PlayerComponent player)
    {
        WorkingOnQuest workingOnQuest = FindPlayerInWorkingOnQuest(player);
        workingOnQuest.IsExit = false;
    }
    /// <summary>
    /// игрок вышел из зоны квеста
    /// </summary>
    void PlayerExitToQuest(PlayerComponent player)
    {
        WorkingOnQuest workingOnQuest = FindPlayerInWorkingOnQuest(player);
        workingOnQuest.IsExit = true;
    }

    private void OnTriggerEnter(Collider other)
    {
        PlayerComponent player = other.gameObject.GetComponent<PlayerComponent>();
        if (PlayerStateManager.PlayerIsNotEqualsNullAndNotEnemy(player))
        {
            if (player.isEnemy)
            {
                return;
            }

            if (HasPlayerInWorkingOnQuest(player))
            {
                if (!PlayerIsCompletedQuest(player) && PlayerIsExitQuest(player))
                {
                    PlayerEnterToQuest(player);
                }
            }
            else
            {
                AddPlayerToWorkingOnQuest(player);
            }
        }
    }

    private void OnTriggerExit(Collider other)
    {
        PlayerComponent player = other.gameObject.GetComponent<PlayerComponent>();
        if (PlayerStateManager.PlayerIsNotEqualsNullAndNotEnemy(player))
        {

            PlayerExitToQuest(player);
        }
    }
    
}