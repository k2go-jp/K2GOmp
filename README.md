# STARSmp (Multi Panel)
このライブラリは、iframeを利用して複数の表示を同時に行い、STARS同期機能を持つアプリを相互に同期させるためのものです。

* 設定ファイル(env.js)に同期するアプリの情報を記述しする
* index.htmlをブラウザで開く
  
設定ファイル(env.js)の記述例

```
var $Env =
{
  showLogConsole : true,
  apps :
  {
    app01 :
    {
      title    : "app01", // アプリ名
      type     : "standard", // 同期の方式 standard, himawari, starsTouch, cesium, hpvt, harps, openDataGmapHouseholds, openDataGmapEnergy
      url      : "/path/to/app/index.html", // webアプリのURL
      layout   : { top:0, left:0, width:0.5, height:1 }, // ウインドウの配置（相対値）
      display  : true, // 表示の有無
      waitTime : 0 // 表示されるまでの待ち時間（通常は 0）
    },
    app02 :
    {
      title    : "app02",
      type     : "standard",
      url      : "/path/to/app/index.html",
      layout   : { top:0, left:0.5, width:0.5, height:1 },
      display  : true,
      waitTime : 0
    }
  }
};
```/