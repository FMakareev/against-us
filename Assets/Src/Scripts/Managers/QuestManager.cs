using System.Collections.Generic;
using UnityEngine;
using System;


[Serializable]
public class QuestItem
{
    public QuestItem(GameObject prefab)
    {
        this.prefab = prefab;
    }

    public GameObject prefab;
}



public class QuestManager : MonoBehaviour
{

    public List<QuestItem> questList = new List<QuestItem>();

    public static QuestManager _instance;

    private void Awake()
    {
        if (!QuestManager._instance)
        {
            QuestManager._instance = this;
        }
    }


    // Start is called before the first frame update
    void Start()
    {
        QuestEntity[] foundCanvasObjects = FindObjectsOfType<QuestEntity>();

        if (foundCanvasObjects.Length > 0)
        {
            foreach (QuestEntity foundCanvasObject in foundCanvasObjects)
            {
                questList.Add(new QuestItem(foundCanvasObject.gameObject));
            }
        }
    }

    
    public void SetQuest(PlayerComponent player)
    {
       // player
    }

}
