/******************************************************************************/
/* k2go multiPanel                                                            */
/* version : 2.4.0                                                            */
/******************************************************************************/
/******************************************************************************/
/* window.load                                                                */
/******************************************************************************/
window.addEventListener("load", () =>
  {
  /*-----* local storage *------------------------------------------------------*/
    if (typeof localStorage != "undefined")
    {
      try
      {
        const objUserEnv = JSON.parse(localStorage.getItem(location.pathname));
  
        for (const strApp in $Env.apps)
        {
          $Env.apps[strApp].layout  = objUserEnv.apps[strApp].layout;
          $Env.apps[strApp].display = objUserEnv.apps[strApp].display;
          $Env.apps[strApp].zIndex  = objUserEnv.apps[strApp].zIndex;
        }
      }
      catch(error)
      {
  
      }
    }
  /*-----* view url *-----------------------------------------------------------*/
  if (window.location.search.length > 1)
    {
      const urlParams = new URLSearchParams(window.location.search);
      const compressed = urlParams.get('viewUrl');
  
      if (compressed)
      {
        try {
          const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
          const objUrlEnv = JSON.parse(decompressed);
  
          for (const strApp in $Env.apps) {
            if (objUrlEnv.apps && objUrlEnv.apps[strApp])
            {
              $Env.apps[strApp].layout  = objUrlEnv.apps[strApp].layout;
              $Env.apps[strApp].display = objUrlEnv.apps[strApp].display;
              $Env.apps[strApp].zIndex  = objUrlEnv.apps[strApp].zIndex;
            }
          }
  
          if (objUrlEnv.activeApp)
            {
              document.querySelector("#lockWindow").classList.add("active");
  
              const strActiveApp = objUrlEnv.activeApp;
  
              setTimeout(() =>
              {
                K2goSTARSmultiPanel.waitReady(strActiveApp).then(() =>
                {
                  $Env.apps[strActiveApp].position = objUrlEnv.positionInfo;
                  K2goSTARSmultiPanel.setPosition(strActiveApp);
  
                  setTimeout(() =>
                  {
                    K2goSTARSmultiPanel.waitReady(strActiveApp).then(() =>
                    {
                      $Env.apps[strActiveApp].dateInfo = objUrlEnv.dateInfo;
                      K2goSTARSmultiPanel.setDateInfo(strActiveApp, strActiveApp);
  
                      setTimeout(() =>
                      {
                        K2goSTARSmultiPanel.waitReady(strActiveApp).then(() =>
                        {
                          document.querySelector("#lockWindow").classList.remove("active");
                          document.querySelector(`#${strActiveApp} .sync`).click();
                        });
                      }, $Env.apps[strActiveApp].waitTime);
                    });
                  }, $Env.apps[strActiveApp].waitTime);
                });
              }, 1000);
            }
  
        } catch (error) {
          alert("URLパラメータの復元に失敗しました。詳細はコンソールをご確認ください。");
        }
      }
    }
  /*-----* start app *----------------------------------------------------------*/
    for (const strApp in $Env.apps)
    {
      if ($Env.apps[strApp].display) K2goSTARSmultiPanel.addApp(strApp);
    }
  });
  document.addEventListener("DOMContentLoaded", () => {
  /******************************************************************************/
  /* btn-sync.click                                                             */
  /******************************************************************************/
  document.querySelector("#btn-sync").addEventListener("click", () =>
  {
    document.querySelector("#btn-sync").classList.toggle("active");
  });
  /******************************************************************************/
  /* btn-reload.click                                                           */
  /******************************************************************************/
  document.querySelector("#btn-reload").addEventListener("click", () =>
  {
    window.location.reload();
  });
  /******************************************************************************/
  /* btn-init.click                                                             */
  /******************************************************************************/
  document.querySelector("#btn-init").addEventListener("click", () =>
  {
    for (const strApp in $Env.apps)
    {
      if ($Env.apps[strApp].display)
      {
        $Env.apps[strApp].layout.top    = $Env.apps[strApp].defaultLayout.top;
        $Env.apps[strApp].layout.left   = $Env.apps[strApp].defaultLayout.left;
        $Env.apps[strApp].layout.width  = $Env.apps[strApp].defaultLayout.width;
        $Env.apps[strApp].layout.height = $Env.apps[strApp].defaultLayout.height;
  
        K2goSTARSmultiPanel.layoutApp(strApp);
      }
    }
  });
  /******************************************************************************/
  /* btn-url.click                                                              */
  /******************************************************************************/
  /*-----* open *---------------------------------------------------------------*/
  document.querySelector("#btn-url").addEventListener("click", () =>
    {
      document.querySelector("#viewUrl-wrapper").classList.add("active");
  
      const objUrlEnv = { activeApp : null, dateInfo : null, positionInfo : null, apps : {} };
  
      try
      {
        const selectedWindow = document.querySelector('.window.select');
        if (selectedWindow)
        {
          const selectedAppId    = selectedWindow.id;
          objUrlEnv.activeApp    = selectedAppId;
          objUrlEnv.dateInfo     = $Env.apps[selectedAppId].dateInfo;
          objUrlEnv.positionInfo = $Env.apps[selectedAppId].position;
        }
  
        for (const strApp in $Env.apps)
        {
          objUrlEnv.apps[strApp] =
          {
            display : $Env.apps[strApp].display,
            zIndex  : $Env.apps[strApp].zIndex,
            layout  : $Env.apps[strApp].display ? K2goSTARSmultiPanel.getAppPosition(strApp) : $Env.apps[strApp].layout,
          };
        }
  
        const compressedUrl = LZString.compressToEncodedURIComponent(JSON.stringify(objUrlEnv));
        const currentUrl    = new URL(window.location.href);
  
        currentUrl.searchParams.set("viewUrl", compressedUrl);
        document.querySelector("#viewUrl-input").value = currentUrl.toString();
      }
      catch (error)
      {
        alert(`URL生成中にエラーが発生しました:${error}`);
      }
    });
  /*-----* copy *---------------------------------------------------------------*/
  document.querySelector("#copy-btn").addEventListener("click", async () =>
  {
    const text = document.querySelector("#viewUrl-input").value;
  
    try
    {
      await navigator.clipboard.writeText(text);
    }
    catch (error)
    {
      console.error("クリップボードへのコピーに失敗しました:", error);
    }
  });
  /*-----* close *--------------------------------------------------------------*/
  document.querySelector("#viewUrl-wrapper").addEventListener("click", (pEvent) =>
    {
      pEvent.target.classList.remove("active");
    });
  /******************************************************************************/
  /* add app events                                                             */
  /******************************************************************************/
  /*-----* open *---------------------------------------------------------------*/
  document.querySelector("#btn-add").addEventListener("click", () =>
  {
    const wrapper = document.querySelector("#add-app-wrapper");
    const ul      = document.querySelector("#add-app ul");
  
    wrapper.classList.add("active");
    ul     .innerHTML = "";
  
    for (const strApp in $Env.apps)
    {
      const app = $Env.apps[strApp];
  
      if (!app.display)
      {
        const li = document.createElement("li");
  
        li.textContent = app.title;
        li.setAttribute("app-id", strApp);
  
        ul.appendChild(li);
      }
    }
  });
  /*-----* select *-------------------------------------------------------------*/
  document.querySelector("#add-app").addEventListener("click", (pEvent) =>
  {
    pEvent.stopPropagation();
    if (pEvent.target.tagName === "LI") pEvent.target.classList.toggle("selected");
  });
  /*-----* submit *-------------------------------------------------------------*/
  document.querySelector("#btn-submit").addEventListener("click", () =>
  {
    const selectedApp = document.querySelectorAll("#add-app ul li.selected");
  
    selectedApp.forEach((pElement) =>
    {
      const strApp = pElement.getAttribute("app-id");
      const app    = $Env.apps[strApp];
  
      app.display = true;
  
      K2goSTARSmultiPanel.addApp       (strApp);
      K2goSTARSmultiPanel.foregroundApp(strApp);
    });
  
    document.querySelector("#add-app-wrapper").classList.remove("active");
  });
  /*-----* close *--------------------------------------------------------------*/
  document.querySelector("#add-app-wrapper").addEventListener("click", (pEvent) =>
  {
    pEvent.target.classList.remove("active");
  });
  /******************************************************************************/
  /* div.window.drag                                                            */
  /******************************************************************************/
  /*-----* start *--------------------------------------------------------------*/
  document.addEventListener("mousedown", (pEvent) =>
  {
         if (pEvent.target.className === "header") document.querySelector("#lock").classList.add("move");
    else if (pEvent.target.className === "right" ) document.querySelector("#lock").classList.add("ew-resize");
    else if (pEvent.target.className === "footer") document.querySelector("#lock").classList.add("ns-resize");
    else if (pEvent.target.className === "resize") document.querySelector("#lock").classList.add("nwse-resize");
    else return;
  
    pEvent.preventDefault ();
    pEvent.stopPropagation();
  
    const $this           = pEvent.target.parentNode;
    const intHeaderHeight = document.querySelector("header").offsetHeight;
    const intLeft         = parseInt($this.style.left  , 10);
    const intTop          = parseInt($this.style.top   , 10);
    const intWidth        = parseInt($this.style.width , 10);
    const intHeight       = parseInt($this.style.height, 10);
    const intStartX       = pEvent.pageX;
    const intStartY       = pEvent.pageY;
    let   intMoveX        = intStartX;
    let   intMoveY        = intStartY;
  
    K2goSTARSmultiPanel.foregroundApp($this.getAttribute("id"));
  /*-----* move *---------------------------------------------------------------*/
    const fncMove = (pEvent) =>
    {
      pEvent.preventDefault ();
      pEvent.stopPropagation();
  
      intMoveX = pEvent.pageX;
      intMoveY = pEvent.pageY;
  
      if (document.querySelector("#lock").classList.contains("move"))
      {
        $this.style.left = (intLeft + (intMoveX - intStartX)) + "px";
        $this.style.top  = (intTop  + (intMoveY - intStartY)) + "px";
  
        const objRect = $this.getBoundingClientRect();
  
        if (objRect.x + window.pageXOffset < 0              ) $this.style.left = "0px";
        if (objRect.y + window.pageYOffset < intHeaderHeight) $this.style.top  = "0px";
      }
      else if (document.querySelector("#lock").classList.contains("ew-resize"))
      {
        $this.style.width  = (intWidth  + (intMoveX - intStartX)) + "px";
  
        const objRect = $this.getBoundingClientRect();
  
        if (objRect.width < 400) $this.style.width  = "400px";
      }
      else if (document.querySelector("#lock").classList.contains("ns-resize"))
      {
        $this.style.height = (intHeight + (intMoveY - intStartY)) + "px";
  
        const objRect = $this.getBoundingClientRect();
  
        if (objRect.height < 400) $this.style.height = "400px";
      }
      else if (document.querySelector("#lock").classList.contains("nwse-resize"))
      {
        $this.style.width  = (intWidth  + (intMoveX - intStartX)) + "px";
        $this.style.height = (intHeight + (intMoveY - intStartY)) + "px";
  
        const objRect = $this.getBoundingClientRect();
  
        if (objRect.width  < 400) $this.style.width  = "400px";
        if (objRect.height < 400) $this.style.height = "400px";
      }
    };
  
    document.addEventListener("mousemove", fncMove, { passive:false });
  /*-----* end *----------------------------------------------------------------*/
    const fncEnd = () =>
    {
      pEvent.preventDefault ();
      pEvent.stopPropagation();
  
      document.removeEventListener("mousemove", fncMove, { passive:false });
      document.removeEventListener("mouseup"  , fncEnd);
  
      document.querySelector("#lock").classList.remove("move", "ew-resize", "ns-resize", "nwse-resize", "ns-resize-top");
    };
  
    document.addEventListener("mouseup", fncEnd);
  });
  /******************************************************************************/
  /* sync.click                                                                 */
  /******************************************************************************/
  document.addEventListener("click", (pEvent) =>
  {
  /*-----* ui *-----------------------------------------------------------------*/
    if (pEvent.target.className !== "sync") return;
  
    pEvent.preventDefault ();
    pEvent.stopPropagation();
  
    const $this = pEvent.target.parentNode.parentNode;
  
    document.querySelectorAll(".window"                  ).forEach((pElement) => { pElement.classList.remove("sync", "select"); });
    document.querySelectorAll(".window > .header > .sync").forEach((pElement) => { pElement.style.pointerEvents = "none"; });
  
    $this.classList.add("sync", "select");
    K2goSTARSmultiPanel.foregroundApp($this.getAttribute("id"));
  /*-----* sync apps *----------------------------------------------------------*/
    const fncSync = (pApp, pActiveApp) =>
    {
      document.querySelector(`#${pApp}`).classList.add("lock");
  
      K2goSTARSmultiPanel.waitReady(pApp).then(() =>
      {
        let intWaitTime = 0;
  
        $Env.apps[pApp].position = K2goSTARSmultiPanel.getPosition(pApp);
  
        if (K2goSTARSmultiPanel.isChangePosition(pApp, pActiveApp))
        {
          K2goSTARSmultiPanel.putLog(`change position ${pApp} ${JSON.stringify($Env.apps[pActiveApp].position)}`);
          $Env.apps[pApp].position = Object.assign({}, $Env.apps[pActiveApp].position);
          K2goSTARSmultiPanel.setPosition(pApp);
          intWaitTime = $Env.apps[pApp].waitTime;
        }
  
        setTimeout(() =>
        {
          K2goSTARSmultiPanel.waitReady(pApp).then(() =>
          {
            $Env.apps[pApp].dateInfo = K2goSTARSmultiPanel.getDateInfo(pApp);
  
            if (K2goSTARSmultiPanel.isChangeDateInfo(pApp, pActiveApp))
            {
              K2goSTARSmultiPanel.putLog(`change time ${pApp} {current:${K2goSTARSmultiPanel.formatDate(new Date($Env.apps[pActiveApp].dateInfo.currentDate), "%y/%mm/%dd %H:%M:%S")}, start:${K2goSTARSmultiPanel.formatDate(new Date($Env.apps[pActiveApp].dateInfo.startDate), "%y/%mm/%dd %H:%M:%S")}, end:${K2goSTARSmultiPanel.formatDate(new Date($Env.apps[pActiveApp].dateInfo.endDate), "%y/%mm/%dd %H:%M:%S")}, xScale:${$Env.apps[pActiveApp].dateInfo.xScale}}`);
              $Env.apps[pApp].dateInfo = Object.assign({}, $Env.apps[pActiveApp].dateInfo);
              K2goSTARSmultiPanel.setDateInfo(pApp, pActiveApp);
            }
  
            setTimeout(() =>
            {
              K2goSTARSmultiPanel.waitReady(pApp).then(() =>
              {
                document.querySelector(`#${pApp}`).classList.remove("lock");
              });
            }, 100);
          });
        }, intWaitTime);
      });
    };
  /*-----* get active app info *------------------------------------------------*/
    const strActiveApp = $this.getAttribute("id");
  
    const fncAutoSync = () =>
    {
      K2goSTARSmultiPanel.waitReady(strActiveApp).then(() =>
      {
        $Env.apps[strActiveApp].position = K2goSTARSmultiPanel.getPosition(strActiveApp);
        $Env.apps[strActiveApp].dateInfo = K2goSTARSmultiPanel.getDateInfo(strActiveApp);
  
        for (const strApp in $Env.apps)
        {
          if (strApp !== strActiveApp && $Env.apps[strApp].display && !document.querySelector(`#${strApp}`).classList.contains("lock"))
          {
            fncSync(strApp, strActiveApp);
          }
        }
  
        setTimeout(() =>
        {
          K2goSTARSmultiPanel.waitSyncing().then(() =>
          {
            if ($Env.apps[strActiveApp].display && document.querySelector("#btn-sync").classList.contains("active"))
            {
              setTimeout(fncAutoSync, 100);
            }
            else
            {
              document.querySelectorAll(".window > .header > .sync").forEach((pElement) => { pElement.style.pointerEvents = ""; });
              $this.classList.remove("sync");
            }
          });
        }, 100);
      });
    };
  
    fncAutoSync();
  });
  /******************************************************************************/
  /* close.click                                                                */
  /******************************************************************************/
  document.addEventListener("click", (pEvent) =>
  {
    if (pEvent.target.className !== "close") return;
  
    pEvent.preventDefault ();
    pEvent.stopPropagation();
  
    const $this  = pEvent.target.parentNode.parentNode;
    const strApp = $this.getAttribute("id");
  
    $Env.apps[strApp].layout  = K2goSTARSmultiPanel.getAppPosition(strApp);
    $Env.apps[strApp].display = false;
  
    $this.remove();
  });
  /******************************************************************************/
  /* window.unload                                                              */
  /******************************************************************************/
  window.addEventListener("unload", () =>
  {
    if (typeof localStorage != "undefined")
    {
      for (const strApp in $Env.apps)
      {
        if ($Env.apps[strApp].display) $Env.apps[strApp].layout = K2goSTARSmultiPanel.getAppPosition(strApp);
        delete $Env.apps[strApp].window;
      }
      localStorage.setItem(location.pathname, JSON.stringify($Env));
    }
  });
  });
  