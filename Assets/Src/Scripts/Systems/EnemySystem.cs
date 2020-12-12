using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemySystem : MonoBehaviour
{
    public PlayerComponent player;


    private void OnTriggerEnter(Collider other)
    {
        Debug.Log("OnTriggerEnter player.isEnemy :" + player.isEnemy);
        if (player.isEnemy && player.isLocale)
        {
            PlayerComponent playerComponent = other.gameObject.GetComponent<PlayerComponent>();

            Debug.Log("OnTriggerEnter player.sessionId :" + playerComponent.sessionId);
            if (PlayerStateManager.PlayerIsNotEqualsNullAndNotEnemy(playerComponent))
            {
                PlayerStateManager._instance.KillPlayer(playerComponent.sessionId);
            }
        }
        
    }

    
}
