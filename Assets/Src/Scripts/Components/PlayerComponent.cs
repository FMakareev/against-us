using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[Serializable]
public class PlayerComponent : MonoBehaviour
{
    public string sessionId;
    public int completedQuests = 0;
    public bool isHost;
    public bool isEnemy;
    public bool isLocale;
    public bool isDied = false;
    public GameObject prefab;
}
