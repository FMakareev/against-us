using UnityEngine;


public class GameStateManager : MonoBehaviour
{

    public bool isStartGame = false;


    public static GameStateManager _instance;

    private void Awake()
    {
        if (!GameStateManager._instance)
        {
            GameStateManager._instance = this;
        }
    }

    public bool IsStartGame()
    {
        isStartGame = true;
        return isStartGame;
    }

}