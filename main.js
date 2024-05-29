"use strict"; /*厳格にエラーをチェック*/

var offsetX, offsetY, dragItem;
var resizeHandle;

{
  //ローカルスコープ タブの挙動
  //DOM取得
  const tabMenus = document.querySelectorAll(".tab_menu-item");
  // console.log(tabMenus);
  //イベント追加
  tabMenus.forEach((tabMenu) => {
    tabMenu.addEventListener("click", tabSwitch);
  });
  function tabSwitch(e) {
    // クリックされた要素のデータ属性を取得
    const tabTargetData = e.currentTarget.dataset.tab;
    // console.log(e.currentTarget);
    // console.log(e.currentTarget.dataset.tab);

    // クリックされた要素の親要素と、その子要素を取得
    const tabList = e.currentTarget.closest(".tab_menu");
    console.log(tabList);
    const tabItems = tabList.querySelectorAll(".tab_menu-item");
    console.log(tabItems);

    // クリックされた要素の親要素の兄弟要素の子要素を取得
    const tabPanelItems =
      tabList.nextElementSibling.querySelectorAll(".tab_panel-box");
    console.log(tabPanelItems);

    // クリックされたtabの同階層のmenuとpanelのクラスを削除
    tabItems.forEach((tabItem) => {
      tabItem.classList.remove("is-active");
    });
    tabPanelItems.forEach((tabPanelItem) => {
      tabPanelItem.classList.remove("is-show");
    });
    
    // クリックされたmenu要素にis-activeクラスを付加
    e.currentTarget.classList.add("is-active");

    // クリックしたmenuのデータ属性と等しい値を持つパネルにis-showクラスを付加
    tabPanelItems.forEach((tabPanelItem) => {
      if (tabPanelItem.dataset.panel === tabTargetData) {
        tabPanelItem.classList.add("is-show");
      }
    });
  }
}

//スタンプボタン
function addStamp(stampType) {
  //新しいスタンプを作成
  var newStamp = document.createElement("img");
  var imagePath = "img/stamp/" + stampType + ".png";
  newStamp.src = imagePath;
  newStamp.alt = "stamp";
  newStamp.className = "newStamp";
  newStamp.classList.add("draggable");

  //リサイズハンドルを作成
  var handle = document.createElement("div");
  handle.classList.add("resize-handle");
  newStamp.appendChild(handle);

  //work_sectionに新しいスタンプを追加
  document.getElementById("work_container").appendChild(newStamp);

  //Moveableインスタンスを作成
  var move = new Moveable(document.body, {
    target: newStamp,
    draggable: true, //ここtrueにしないと拡大縮小の枠が移動しない
    resizable: true,
    keepRatio: true,
    renderDirections: ["nw", "ne", "sw", "se"],
  });

  move.on("resize", ({ target, width, height }) => {
    target.style.width = width + "px";
    target.style.height = height + "px";
  });
}

// スタンプのドラッグアンドドロップ
function startDrag(e) {
  if (e.target.classList.contains("draggable")) {
    dragItem = e.target;
    var rect = dragItem.getBoundingClientRect(); //スタンプ要素の位置とサイズを取得
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  }
}

function drag(e) {
  e.preventDefault();

  var containerRect = document
    .getElementById("work_container")
    .getBoundingClientRect(); // work_containerの位置とサイズを取得
  var x = e.clientX - offsetX - containerRect.left; //work_container内のx座標
  var y = e.clientY - offsetY - containerRect.top; //work_container内のy座標

  // コンテナ内での移動範囲を制限
  x = Math.min(Math.max(x, 0), containerRect.width - dragItem.offsetWidth);
  y = Math.min(Math.max(y, 0), containerRect.height - dragItem.offsetHeight);

  dragItem.style.left = x + "px";
  dragItem.style.top = y + "px";
}

function stopDrag() {
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
}
