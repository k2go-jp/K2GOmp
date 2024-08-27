/******************************************************************************/
/* k2go multiPanel                                                            */
/******************************************************************************/
var $Env =
{
  showLogConsole : true,
  apps :
  {
    app01 :
    {
      title         : "app01",
      type          : "standard",
      url           : "/path/to/app/index.html",
      layout        : { top:0, left:0, width:0.5, height:1 },
      display       : true,
      zIndex        : 0,
      waitTime      : 0,
      syncBtnHidden : true,
      syncLock      : true
    },
    app02 :
    {
      title         : "app01",
      type          : "standard",
      url           : "/path/to/app/index.html",
      layout        : { top:0, left:0.5, width:0.5, height:1 },
      display       : true,
      zIndex        : 0,
      waitTime      : 0,
      syncBtnHidden : true,
      syncLock      : true
    }
  }
};
