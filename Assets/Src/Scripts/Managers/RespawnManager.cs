using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RespawnManager : MonoBehaviour
{
    public List<GameObject> respawnPoints = new List<GameObject>();

    public static RespawnManager _instance;

    private void Awake()
    {
        if (_instance == null)
        {
            _instance = this;
        }
    }

    // Start is called before the first frame update
    void Start()
    {
        foreach (var respawnEntity in FindObjectsOfType<RespawnEntity>())
        {
            respawnEntity.GetComponent<MeshRenderer>().enabled = false;
            respawnPoints.Add(respawnEntity.gameObject);
        }
    }

    public GameObject GetRespawnPointByIndexAndMarkBusy(int respawnIndex)
    {
        respawnIndex = respawnIndex < 0 ? 0 : respawnIndex;
        Debug.Log("respawnIndex: "+respawnIndex);
        GameObject busyRespawnPoint = respawnPoints[respawnIndex];

        if (busyRespawnPoint)
        {
            busyRespawnPoint.GetComponent<RespawnComponent>().isBusy = true;
            return busyRespawnPoint;
        }

        Debug.Log("GetBusyRespawnPoint: not found busy point");
        return null;
    }
}