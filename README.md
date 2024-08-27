# K2GOmp (Multi Panel)
K2GOmpは、iframeを使用して複数の表示を同時に行い、STARS同期機能を活用してアプリケーションを相互に同期させるためのライブラリです。

1. 設定ファイル（env.js）に同期対象のアプリケーション情報を記述します。
2. index.htmlをブラウザで開いて使用します。
  
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
      waitTime : 0, // 表示されるまでの待ち時間（通常は 0）
      zIndex   : 0, // z-index（通常は 0）
      syncBtnHidden : false, // syncボタンの有無
      syncLock      : false  // 閲覧のみにする場合は true
    },
    app02 :
    {
      title    : "app02",
      type     : "standard",
      url      : "/path/to/app/index.html",
      layout   : { top:0, left:0.5, width:0.5, height:1 },
      display  : true,
      waitTime : 0,
      zIndex   : 0,
      syncBtnHidden : true
    }
  }
};
```

### 同期対象のアプリケーション
同期対象のアプリケーションは、STARScontrollerに対応している必要があります。STARScontrollerに関する詳細は以下のURLからご確認ください。
[STARScontroller GitHubリポジトリ](https://github.com/k2go-jp/STARScontroller)