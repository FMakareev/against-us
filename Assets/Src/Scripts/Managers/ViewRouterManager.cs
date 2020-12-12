using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.PlayerLoop;

public enum ViewRouterEnum
{
    MAIN_MENU,
    PAUSE_MENU,
}

public class ViewRouterManager : MonoBehaviour
{
    
    public List<SerializableDict<ViewRouterEnum, GameObject>> routes;

    public ViewRouterEnum defaultRoute = ViewRouterEnum.MAIN_MENU;

    public GameObject youDiedView;
        
    
    public static ViewRouterManager _instance;
    
    private void Awake()
    {
        if (!ViewRouterManager._instance)
        {
            ViewRouterManager._instance = this;
        }
    }

    public void Start()
    {
        OpenRoute(defaultRoute);
    }

    public void CloseAllRoute()
    {
        for (var i = 0; i < routes.Count; i++)
        {
            GameObject routeView = routes[i].value;
            routeView.SetActive(false);
        }
    }

    public void CloseRoute(ViewRouterEnum route)
    {
        for (var i = 0; i < routes.Count; i++)
        {
            if (routes[i].key == route)
            {
                GameObject routeView = routes[i].value;
                routeView.SetActive(false);
            }
        }
    }

    public void OpenRoute(ViewRouterEnum route)
    {
        Debug.Log("OpenRoute: "+ route);
        CloseAllRoute();
        for (var i = 0; i < routes.Count; i++)
        {
            if (routes[i].key == route)
            {
                Debug.Log("OpenRoute: "+ route);
                GameObject routeView = routes[i].value;
                routeView.SetActive(true);
            }
        }
    }


    private void ToggleView(GameObject go)
    {
        go.SetActive(!go.activeSelf);
    }

    public void ToggleYouDiedView()
    {
        if (youDiedView == null)
        {
            throw new Exception("youDiedView in null");
        }

        ToggleView(youDiedView);
    }
    
}
